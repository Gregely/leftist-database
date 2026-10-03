import { expect, test, type Page } from "@playwright/test";
import { createEntry, deskAs, expectSaved, pick } from "./helpers";

/** Run one workflow step from the entry's workflow bar, confirming where the desk asks for it. */
async function fire(page: Page, label: string) {
  const button = page.getByRole("button", { name: label, exact: true });
  await button.click();
  const confirm = page.getByRole("button", { name: `Confirm: ${label}` });
  if (["Submit for review", "Approve", "Unpublish"].includes(label)) await confirm.click();
  await expect(button).toHaveCount(0);
}

async function addStop(page: Page, query: string, title: string) {
  await pick(page, page.getByRole("combobox", { name: "Add a stop" }), query, new RegExp(title));
  await page.getByRole("button", { name: "Add stop" }).click();
  await expect(page.getByRole("button", { name: `Remove ${title}` })).toBeVisible();
}

const stopTitles = (page: Page) => page.locator("li[data-path-stop=main] > span > .font-serif").allTextContents();
const copyFor = (page: Page, title: string) => page.getByRole("group", { name: `Guided copy for ${title}` });

test("editors build a Guided journey from existing entries, and readers only see it once it is published", async ({ browser }) => {
  test.setTimeout(300_000);
  const page = await deskAs(browser, "editor");
  const tag = Date.now().toString(36);
  const title = `Guided Test ${tag}`;

  // A journey is a learning path with "Guided" ticked; its stops are existing entries.
  const id = await createEntry(page, "Path", title);
  await page.getByLabel("Entry line").fill("I want a test journey.");
  await page.getByLabel("Summary").fill(`A journey created by the automated Guided test (${tag}).`);
  await page.getByLabel("Offer this path as a Guided journey").check();
  await page.locator(".rt", { has: page.locator("#field-overview") }).locator(".ProseMirror").click();
  await page.keyboard.type(`Three stops through existing entries, for test ${tag}.`);
  await expectSaved(page);
  const slug = await page.getByLabel("Slug").inputValue();

  await page.goto(`/admin/entries/${id}?tab=structure`);
  await expect(page.getByText("This path is a Guided journey.")).toBeVisible();
  await addStop(page, "Gramsci", "Antonio Gramsci");
  await addStop(page, "Hegemony", "Hegemony");
  await addStop(page, "Prison Notebooks", "Prison Notebooks");

  // Reorder: Prison Notebooks moves ahead of Hegemony.
  await page.getByRole("button", { name: "Move Prison Notebooks up" }).click();
  await expect.poll(() => stopTitles(page)).toEqual(["Antonio Gramsci", "Prison Notebooks", "Hegemony"]);

  // Contextual copy for the first stop.
  const toggle = page.locator("li[data-path-stop]", { hasText: "Antonio Gramsci" }).locator("[data-guided-copy]");
  await expect(toggle).toContainText("missing where you are, why it matters, continue");
  await toggle.click();
  const first = copyFor(page, "Antonio Gramsci");
  await first.getByLabel("Where you are").fill(`Orientation for the first stop ${tag}.`);
  await first.getByLabel("Why it matters").fill(`Why the first stop matters ${tag}.`);
  await first.getByLabel("Continue").fill(`Why the next stop follows ${tag}.`);
  await first.getByRole("button", { name: "Save guided copy" }).click();
  await expect(page.locator("li[data-path-stop]", { hasText: "Antonio Gramsci" }).locator("[data-guided-copy]")).toContainText("complete");

  // Point the second stop at a different entry, and feature an excerpt on the third.
  await page.locator("li[data-path-stop]", { hasText: "Prison Notebooks" }).locator("[data-guided-copy]").click();
  const second = copyFor(page, "Prison Notebooks");
  await pick(page, second.getByRole("combobox", { name: "Point this stop at a different entry (optional)" }), "Capitalism", /^Capitalism/);
  await second.getByLabel("Where you are").fill(`Orientation for the second stop ${tag}.`);
  await second.getByRole("button", { name: "Save guided copy" }).click();
  await expect.poll(() => stopTitles(page)).toEqual(["Antonio Gramsci", "Capitalism", "Hegemony"]);

  await page.locator("li[data-path-stop]", { hasText: "Hegemony" }).locator("[data-guided-copy]").click();
  const third = copyFor(page, "Hegemony");
  const excerpt = third.getByLabel("Featured excerpt");
  const option = await excerpt.locator("option").nth(1).getAttribute("value");
  await excerpt.selectOption(option!);
  await third.getByRole("button", { name: "Save guided copy" }).click();
  await expect(third.getByRole("button", { name: "Save guided copy" })).toBeDisabled();

  // A draft journey is not public: not listed, not reachable, not under /paths either.
  expect((await page.request.get(`/guided/${slug}`)).status()).toBe(404);
  expect((await page.request.get(`/paths/${slug}`)).status()).toBe(404);
  await page.goto("/guided");
  await expect(page.locator(`[data-guided-card="${slug}"]`)).toHaveCount(0);

  // The preview shows it to the desk as readers will see it.
  await page.goto(`/preview/${id}`);
  await expect(page.locator(`[data-guided-journey="${slug}"]`)).toBeVisible();
  await expect(page.getByRole("heading", { name: "The whole journey" })).toBeVisible();
  await page.goto(`/preview/${id}?step=1`);
  await expect(page.getByText(`Orientation for the first stop ${tag}.`)).toBeVisible();

  // Through the usual workflow; approval alone does not publish.
  await page.goto(`/admin/entries/${id}`);
  for (const step of ["Submit for review", "Start review", "Approve"]) await fire(page, step);
  expect((await page.request.get(`/guided/${slug}`)).status()).toBe(404);
  await fire(page, "Publish");

  // A reader: the landing page lists it with Start; nothing has been read yet.
  const reader = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
  await reader.goto("/guided");
  const card = reader.locator(`[data-guided-card="${slug}"]`);
  await expect(card).toContainText("3 steps");
  await expect(card).toContainText("Capitalism");
  await expect(card).toContainText("0 of 3 steps read");
  await card.locator("[data-journey-start]").click();
  await expect(reader).toHaveURL(new RegExp(`/guided/${slug}\\?step=1$`));
  await expect(reader.getByRole("heading", { name: "Where you are" })).toBeVisible();
  await expect(reader.getByText(`Orientation for the first stop ${tag}.`)).toBeVisible();
  await expect(reader.getByText(`Why the first stop matters ${tag}.`)).toBeVisible();

  // Forward, forward, back: nothing is locked, and the reader can skip anywhere.
  const nav = reader.getByRole("navigation", { name: "Journey navigation" });
  await nav.getByRole("link", { name: /Next/ }).click();
  await expect(reader.locator("[data-guided-step]")).toHaveAttribute("data-guided-step", "2");
  await nav.getByRole("link", { name: /Next/ }).click();
  await expect(reader.locator("[data-guided-step]")).toHaveAttribute("data-guided-step", "3");
  await expect(reader.getByText("The crisis consists precisely")).toBeVisible();
  await nav.getByRole("link", { name: /Back/ }).click();
  await expect(reader.locator("[data-guided-step]")).toHaveAttribute("data-guided-step", "2");

  // Progress is remembered: Continue returns to the last step read.
  await reader.goto("/guided");
  await expect(card).toContainText("3 of 3 steps read");
  await expect(card).toContainText("You were last at step 2");
  await card.locator("[data-journey-continue]").click();
  await expect(reader).toHaveURL(new RegExp(`/guided/${slug}\\?step=2$`));

  // Out to the normal entry page and back in.
  await reader.locator("[data-guided-entry]").click();
  await expect(reader).toHaveURL(/\/concepts\/capitalism$/);
  await expect(reader.getByRole("heading", { level: 1 })).toContainText("Capitalism");
  await reader.goBack();
  await expect(reader.locator("[data-guided-step]")).toHaveAttribute("data-guided-step", "2");
  await reader.getByRole("link", { name: "All steps" }).click();
  await expect(reader).toHaveURL(new RegExp(`/guided/${slug}$`));
  await reader.goto(`/paths/${slug}?step=3`);
  await expect(reader).toHaveURL(new RegExp(`/guided/${slug}\\?step=3$`));

  // The same journey on a phone: no sideways scrolling, and the navigation still works.
  const phone = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  for (const path of ["/guided", `/guided/${slug}`, `/guided/${slug}?step=1`, `/guided/${slug}?step=3`]) {
    await phone.goto(path);
    const overflow = await phone.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
  await phone.goto(`/guided/${slug}?step=1`);
  await phone.getByRole("navigation", { name: "Journey navigation" }).getByRole("link", { name: /Next/ }).click();
  await expect(phone.locator("[data-guided-step]")).toHaveAttribute("data-guided-step", "2");

  // Unpublishing takes it off the public site again.
  await page.goto(`/admin/entries/${id}`);
  await fire(page, "Unpublish");
  expect((await reader.request.get(`/guided/${slug}`)).status()).toBe(404);
  await reader.goto("/guided");
  await expect(reader.locator(`[data-guided-card="${slug}"]`)).toHaveCount(0);
});

test("Guided is in the main navigation alongside the existing sections", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation").first();
  await expect(nav.getByRole("link", { name: "Guided" })).toBeVisible();
  for (const label of ["Thinkers", "Concepts"]) await expect(nav.getByRole("link", { name: label })).toBeVisible();
  await nav.getByRole("link", { name: "Guided" }).click();
  await expect(page).toHaveURL(/\/guided$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Where should I start");
});
