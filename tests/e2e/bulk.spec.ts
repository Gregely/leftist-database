import { expect, test, type Page } from "@playwright/test";
import { createEntry, deskAs, expectSaved } from "./helpers";

/** A minimal publishable test concept, submitted for review. Clearly marked as test content. */
async function submittedConcept(page: Page, title: string) {
  const id = await createEntry(page, "Concept", title);
  await page.getByLabel("Summary").fill(`A test concept used by the automated bulk-review test (${title}).`);
  await page.locator(".rt", { has: page.locator("#field-brief") }).locator(".ProseMirror").click();
  await page.keyboard.type("A short plain-language explanation written for the test suite.");
  await expectSaved(page);
  await page.getByRole("button", { name: "Submit for review", exact: true }).click();
  await page.getByRole("button", { name: "Confirm: Submit for review" }).click();
  await expect(page.getByText("Submitted for review.")).toBeVisible();
  return { id, slug: await page.getByLabel("Slug").inputValue() };
}

const row = (page: Page, title: string) => page.locator("tr", { hasText: title });
const select = (page: Page, title: string) => page.getByRole("checkbox", { name: `Select “${title}”` }).check();

test("editors approve selected entries in bulk without touching their flags; publishing is a separate, confirmed step", async ({ browser }) => {
  test.setTimeout(240_000);
  const page = await deskAs(browser, "editor");
  const tag = Date.now().toString(36);
  const [a, b, c] = ["A", "B", "C"].map((x) => `Bulk Test ${x} ${tag}`);
  const ea = await submittedConcept(page, a);
  const eb = await submittedConcept(page, b);
  await submittedConcept(page, c);

  // A review flag on A, which bulk approval must leave open.
  await page.goto(`/admin/entries/${ea.id}?tab=review`);
  await page.getByLabel("Note", { exact: true }).fill(`Bulk test flag ${tag}: check the summary.`);
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByText(`Bulk test flag ${tag}: check the summary.`)).toBeVisible();

  // Select two of the three and approve them.
  await page.goto(`/admin/content?q=${encodeURIComponent(`Bulk Test`)}&status=submitted`);
  await expect(row(page, a)).toContainText("✎ 1");
  await select(page, a);
  await select(page, b);
  await page.getByRole("button", { name: "Approve (2)" }).click();
  const dialog = page.getByRole("dialog", { name: "Confirm: Approve" });
  await expect(dialog).toContainText("Approve 2 entries?");
  await expect(dialog.getByRole("list", { name: "Entries to be changed" })).not.toContainText(c);
  await expect(dialog).toContainText("1 of these entries has open notes or flags (1 in all). They stay open");
  await expect(dialog).toContainText("Approval does not publish anything.");
  await dialog.getByRole("button", { name: "Approve 2 entries" }).click();
  await expect(page.getByRole("status").filter({ hasText: "2 entries approved." })).toBeVisible();

  // Only the selected entries changed, nothing was published, and the flag is still open.
  await page.goto(`/admin/content?q=${encodeURIComponent(`Bulk Test`)}`);
  await expect(row(page, a)).toContainText("Approved");
  await expect(row(page, b)).toContainText("Approved");
  await expect(row(page, c)).toContainText("Submitted");
  await expect(row(page, a)).toContainText("✎ 1");
  expect((await page.request.get(`/concepts/${ea.slug}`)).status()).toBe(404);
  await page.goto(`/admin/entries/${ea.id}?tab=review`);
  await expect(page.getByText(`Bulk test flag ${tag}: check the summary.`)).toBeVisible();
  await expect(page.getByRole("button", { name: "Mark resolved" }).first()).toBeVisible();

  // Publishing needs its own action and the number of entries typed in.
  await page.goto(`/admin/content?q=${encodeURIComponent(`Bulk Test`)}&status=approved`);
  await select(page, a);
  await select(page, b);
  await expect(page.getByRole("button", { name: /^Approve/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Publish (2)" }).click();
  const confirm = page.getByRole("dialog", { name: "Confirm: Publish" });
  await expect(confirm).toContainText("Publishing makes these 2 entries public");
  await expect(confirm).toContainText("They stay open: publishing does not resolve or remove them.");
  const go = confirm.getByRole("button", { name: "Publish 2 entries" });
  await expect(go).toBeDisabled();
  await confirm.getByLabel("Type 2 to confirm").fill("1");
  await expect(go).toBeDisabled();
  await confirm.getByLabel("Type 2 to confirm").fill("2");
  await go.click();
  await expect(page.getByRole("status").filter({ hasText: "2 entries published." })).toBeVisible();
  expect((await page.request.get(`/concepts/${ea.slug}`)).status()).toBe(200);
  expect((await page.request.get(`/concepts/${eb.slug}`)).status()).toBe(200);
  await page.goto(`/admin/entries/${ea.id}?tab=review`);
  await expect(page.getByText(`Bulk test flag ${tag}: check the summary.`)).toBeVisible();

  // The audit trail has a summary for each bulk action and the usual record for every entry.
  const admin = await deskAs(browser, "admin");
  await admin.goto("/admin/audit?action=bulk_transition");
  await expect(admin.getByText("Approve · 2 of 2 selected").first()).toBeVisible();
  await expect(admin.getByText("Publish · 2 of 2 selected").first()).toBeVisible();
  await admin.goto(`/admin/audit?target=${ea.id}`);
  for (const action of ["approve", "publish", "note add", "submit"]) await expect(admin.locator("td", { hasText: new RegExp(`^${action}$`) }).first()).toBeVisible();
});

test("an entry changed after it was selected is skipped, not swept along", async ({ browser }) => {
  test.setTimeout(120_000);
  const page = await deskAs(browser, "editor");
  const tag = Date.now().toString(36);
  const title = `Bulk Stale ${tag}`;
  const e = await submittedConcept(page, title);

  await page.goto(`/admin/content?q=${encodeURIComponent(title)}`);
  await select(page, title);
  // Meanwhile, someone else starts reviewing it.
  const reviewer = await deskAs(browser, "reviewer");
  await reviewer.goto(`/admin/entries/${e.id}`);
  await reviewer.getByRole("button", { name: "Start review", exact: true }).click();
  await expect(reviewer.getByText("You are now reviewing")).toBeVisible();

  await page.getByRole("button", { name: "Approve (1)" }).click();
  await page.getByRole("dialog", { name: "Confirm: Approve" }).getByRole("button", { name: "Approve 1 entry" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "could not be" })).toContainText(`${title} — Changed since you selected it`);
  await page.goto(`/admin/content?q=${encodeURIComponent(title)}`);
  await expect(row(page, title)).toContainText("Under review");
});

test("bulk tools are for editors only", async ({ browser }) => {
  for (const role of ["contributor", "reviewer"] as const) {
    const page = await deskAs(browser, role);
    await page.goto(role === "reviewer" ? "/admin/review" : "/admin/content");
    await expect(page.getByRole("toolbar", { name: /Bulk actions/ })).toHaveCount(0);
    await expect(page.locator("[data-bulk-select]")).toHaveCount(0);
  }
});
