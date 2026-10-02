import { expect, test, type Page } from "@playwright/test";
import { createEntry, deskAs, editorReady, expectSaved, PASSWORD, USERS } from "./helpers";

test("the desk is protected", async ({ page }) => {
  await page.goto("/admin/content");
  await expect(page).toHaveURL(/\/admin\/login\?next=/);
  await page.getByLabel("Email").fill(USERS.editor);
  await page.getByLabel("Password").fill(`${PASSWORD}-wrong`);
  await page.getByRole("button", { name: "Enter the desk" }).click();
  await expect(page.getByText("do not match an active account")).toBeVisible();
  expect((await page.request.get("/api/desk/lookup?q=marx")).status()).toBe(401);
  expect((await page.request.get("/api/desk/sources?q=capital")).status()).toBe(401);
  expect((await page.request.post("/api/desk/media")).status()).toBe(401);
});

test("contributors cannot change other people's entries or use editor tools", async ({ browser }) => {
  const page = await deskAs(browser, "contributor");
  await page.goto("/admin/content?q=Karl+Marx");
  await page.getByRole("link", { name: "Karl Marx" }).first().click();
  await editorReady(page);
  await expect(page.getByText("Only the author and editors can change this entry")).toBeVisible();
  await expect(page.locator("#field-title")).toBeDisabled();
  for (const label of ["Publish", "Unpublish", "Archive", "Approve"]) await expect(page.getByRole("button", { name: label, exact: true })).toHaveCount(0);
  await page.goto("/admin/relationships");
  await expect(page.getByRole("group", { name: "Add a relationship" })).toHaveCount(0);
});

test("revisions: compare and restore without losing history", async ({ browser }) => {
  const page = await deskAs(browser, "contributor");
  const tag = Date.now().toString(36);
  await createEntry(page, "Concept", `Revision Test ${tag}`);
  await page.getByLabel("Summary").fill(`First wording of the test summary ${tag}.`);
  await saveVersion(page, "first wording");
  await page.getByLabel("Summary").fill(`Second wording of the test summary ${tag}.`);
  await saveVersion(page, "second wording");

  await page.getByRole("navigation", { name: "Editor sections" }).getByRole("link", { name: "History" }).click();
  await expect(page.getByText("first wording")).toBeVisible();
  await page.getByRole("link", { name: /vs current/i }).first().click();
  const cmp = page.getByRole("region", { name: /Comparison of version/ });
  await expect(cmp).toContainText("First");
  await expect(cmp).toContainText("Second");

  const row = page.locator("tr", { hasText: "first wording" });
  const version = (await row.locator("td").first().innerText()).match(/v(\d+)/)![1];
  await row.getByRole("button", { name: `Restore v${version}` }).click();
  await row.getByRole("button", { name: "Restore", exact: true }).click();
  await expect(page.getByText(`Version ${version} was restored as a new version`)).toBeVisible();
  await expect(page.getByText("second wording")).toBeVisible();

  await page.getByRole("navigation", { name: "Editor sections" }).getByRole("link", { name: "Content" }).click();
  await editorReady(page);
  await expect(page.getByLabel("Summary")).toHaveValue(`First wording of the test summary ${tag}.`);
});

test("concurrent edits are detected instead of overwritten", async ({ browser }) => {
  const a = await deskAs(browser, "contributor");
  const tag = Date.now().toString(36);
  const id = await createEntry(a, "Concept", `Conflict Test ${tag}`);
  const b = await deskAs(browser, "contributor");
  await b.goto(`/admin/entries/${id}`);
  await editorReady(b);

  await a.getByLabel("Summary").fill(`Saved first in window A ${tag}.`);
  await expectSaved(a);
  await b.getByLabel("Summary").fill(`Typed later in window B ${tag}.`);
  await expect(b.getByText("Someone else saved this entry")).toBeVisible({ timeout: 20_000 });
  await expect(b.getByText("Conflict — not saved")).toBeVisible();

  await b.reload();
  await editorReady(b);
  // The unsaved work is offered back from this browser.
  await expect(b.getByText("Unsaved changes found in this browser")).toBeVisible();
  await expect(b.getByLabel("Summary")).toHaveValue(`Saved first in window A ${tag}.`);
});

test("an editor publishes, renames with a redirect, then archives after seeing dependencies", async ({ browser }) => {
  const page = await deskAs(browser, "editor");
  const tag = Date.now().toString(36);
  const title = `Lifecycle Test ${tag}`;
  const id = await createEntry(page, "Concept", title);
  await page.getByLabel("Summary").fill(`A test concept used by the automated lifecycle test ${tag}.`);
  const brief = page.locator(".rt", { has: page.locator("#field-brief") }).locator(".ProseMirror");
  await brief.click();
  await page.keyboard.type("A short plain-language explanation written for the test suite.");
  await expectSaved(page);
  const slug = await page.getByLabel("Slug").inputValue();

  for (const step of ["Submit for review", "Start review", "Approve", "Publish"]) await fire(page, step);
  await expect(page.getByText("Published. It is now in the public library")).toBeVisible();
  expect((await page.request.get(`/concepts/${slug}`)).status()).toBe(200);

  // Rename: edits to a live entry wait for publication, and the old address redirects.
  await page.reload();
  await editorReady(page);
  await page.getByLabel("Slug").fill(`${slug}-renamed`);
  await expectSaved(page);
  await expect(page.getByText(/Unpublished changes: v\d+/)).toBeVisible();
  expect((await page.request.get(`/concepts/${slug}-renamed`)).status()).toBe(404);
  for (const step of ["Submit for review", "Start review", "Approve", "Publish changes"]) await fire(page, step);
  await page.goto(`/concepts/${slug}`);
  await expect(page).toHaveURL(new RegExp(`/concepts/${slug}-renamed$`));

  // Archive: the dependency summary is shown before confirming; the entry leaves the site but is not deleted.
  await page.goto(`/admin/entries/${id}`);
  await page.getByRole("button", { name: "Archive", exact: true }).click();
  await expect(page.getByText("Archive this entry?")).toBeVisible();
  await expect(page.getByText(/Nothing else in the Atlas depends on it|It is connected to/)).toBeVisible();
  await page.getByRole("button", { name: "Confirm: Archive" }).click();
  await expect(page.getByText("Archived. It has left the public site")).toBeVisible();
  expect((await page.request.get(`/concepts/${slug}-renamed`)).status()).toBe(404);
  await expect(page.getByRole("button", { name: "Restore from archive" })).toBeVisible();
});

test("changes to a live debate's structure are staged until it is published", async ({ browser }) => {
  const page = await deskAs(browser, "editor");
  const cell = "Marx on: Culture and common sense are decisive terrains.";
  const row = (p: Page) => p.locator("#compare tbody tr").filter({ hasText: "Culture and common sense" }).locator("td").first();
  // Choose a stance that differs from what the public page shows now.
  await page.goto("/debates/class-consciousness");
  const before = (await row(page).textContent()) ?? "";
  const [value, label] = before.includes("Qualified") ? ["rejects", "Rejects"] : ["qualified", "Qualified"];

  await page.goto("/admin/entries/db_class-consciousness?tab=structure");
  await expect(page.getByText(/Your first change here starts a staged copy|You are editing a staged copy/)).toBeVisible();
  await page.getByLabel(cell).selectOption(value);
  await page.getByRole("button", { name: "Save stances" }).click();
  await expect(page.getByText("You are editing a staged copy")).toBeVisible();
  await expect(page.getByLabel(cell)).toHaveValue(value);

  // The public debate is unchanged; the preview shows the staged copy.
  await page.goto("/debates/class-consciousness");
  await expect(row(page)).not.toContainText(label);
  await page.goto("/preview/db_class-consciousness");
  await expect(row(page)).toContainText(label);

  await page.goto("/admin/entries/db_class-consciousness");
  for (const step of ["Submit for review", "Start review", "Approve", "Publish changes"]) await fire(page, step);
  await page.goto("/debates/class-consciousness");
  await expect(row(page)).toContainText(label);

  await page.goto("/admin/entries/pa_anarchism?tab=structure");
  const steps = page.getByRole("button", { name: /^Move .* down$/ });
  const first = (await steps.first().getAttribute("aria-label"))!.replace(/^Move | down$/g, "");
  await steps.first().click();
  await expect(page.getByRole("button", { name: /^Move .* down$/ }).first()).not.toHaveAttribute("aria-label", `Move ${first} down`);
});

test("relationships added to a live entry wait for its next publication", async ({ browser }) => {
  const page = await deskAs(browser, "editor");
  const tag = Date.now().toString(36);
  const title = `Staging Test ${tag}`;
  const id = await createEntry(page, "Concept", title);
  await page.getByLabel("Summary").fill(`A test concept used to check staged relationships ${tag}.`);
  await page.locator(".rt", { has: page.locator("#field-brief") }).locator(".ProseMirror").click();
  await page.keyboard.type("A short plain-language explanation written for the test suite.");
  await expectSaved(page);
  const slug = await page.getByLabel("Slug").inputValue();
  for (const step of ["Submit for review", "Start review", "Approve", "Publish"]) await fire(page, step);

  // From the live concept, connect it to a live thinker.
  await page.goto(`/admin/entries/${id}?tab=connections`);
  await expect(page.getByText("Anything you add here waits for its next publication")).toBeVisible();
  const rel = page.getByRole("group", { name: "Add a relationship" });
  await rel.getByLabel("Type").selectOption("ASSOCIATED_WITH");
  await rel.getByRole("combobox", { name: "To" }).fill("Karl Marx");
  await page.getByRole("listbox").getByRole("option", { name: /Karl Marx/ }).first().click();
  await rel.getByRole("button", { name: "Add relationship" }).click();
  await expect(page.getByText("◌ with next publication").first()).toBeVisible();

  expect(await (await page.request.get(`/concepts/${slug}`)).text()).not.toContain("Karl Marx");
  expect(await (await page.request.get("/thinkers/marx")).text()).not.toContain(title);
  expect(await (await page.request.get(`/preview/${id}`)).text()).toContain("Karl Marx");

  await page.goto(`/admin/entries/${id}`);
  await expect(page.getByText(/Unpublished changes/)).toBeVisible();
  for (const step of ["Submit for review", "Start review", "Approve", "Publish changes"]) await fire(page, step);
  expect(await (await page.request.get(`/concepts/${slug}`)).text()).toContain("Karl Marx");
  expect(await (await page.request.get("/thinkers/marx")).text()).toContain(title);
});

async function saveVersion(page: Page, note: string) {
  await page.getByLabel("Version note").fill(note);
  await page.getByRole("button", { name: "Save version" }).click();
  await expect(page.getByText(/Saved as version \d+/)).toBeVisible();
}

async function fire(page: Page, label: string) {
  const button = page.getByRole("button", { name: label, exact: true });
  await button.click();
  const confirm = page.getByRole("button", { name: `Confirm: ${label}` });
  if (["Submit for review", "Approve", "Archive", "Unpublish"].includes(label)) await confirm.click();
  await expect(button).toHaveCount(0);
}
