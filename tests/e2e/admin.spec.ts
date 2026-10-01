import { expect, test, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Password").fill("test-password");
  await page.getByRole("button", { name: "Enter the desk" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("the desk is protected", async ({ page }) => {
  await page.goto("/admin/concept");
  await expect(page).toHaveURL(/\/admin\/login\?next=/);
  await page.getByLabel("Password").fill("wrong");
  await page.getByRole("button", { name: "Enter the desk" }).click();
  await expect(page.getByText("not correct")).toBeVisible();
});

test("create, relate, publish and delete an entry", async ({ page }) => {
  await login(page);
  await page.goto("/admin/concept/new");
  await page.getByLabel("Title *").fill("Primitive Accumulation");
  await page.getByLabel("Summary *").fill("The forcible separation of producers from the means of production.");
  await page.getByLabel("30 seconds").fill("Before capitalism could exploit wage labour, people had to be separated from the land.");
  await page.getByRole("button", { name: "Create concept" }).click();
  await expect(page).toHaveURL(/\/admin\/concept\/co_/);
  const editUrl = page.url().split("?")[0];

  // Drafts are not public.
  expect((await page.request.get("/concepts/primitive-accumulation")).status()).toBe(404);

  // Relationship: Federici DEVELOPED this concept, entered from the concept's side as an inverse.
  const rel = page.locator("#relationships");
  await rel.getByPlaceholder("Search the Atlas…").fill("Federici");
  await rel.getByRole("listbox").getByRole("option").first().click();
  await rel.getByLabel("Relationship").selectOption("INFLUENCED_BY");
  await rel.getByLabel("Note").fill("Caliban and the Witch");
  await rel.getByRole("button", { name: "Add relationship" }).click();
  await expect(page.locator("#relationships li")).toContainText(["Silvia Federici"]);

  // Citation.
  await page.locator("#citations select[name=sourceId]").selectOption("src_caliban");
  await page.locator("#citations").getByRole("button", { name: "Add" }).click();
  await expect(page.locator("#citations li")).toContainText(["Caliban and the Witch"]);

  // Publish.
  await page.getByLabel("Status").selectOption("published");
  await page.locator("#fields").getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved.")).toBeVisible();

  await page.goto("/concepts/primitive-accumulation");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Primitive Accumulation");
  await expect(page.locator("#interpretations")).toContainText("Silvia Federici");
  await expect(page.locator("#notes-heading")).toBeVisible();
  const search = await (await page.request.get("/api/search?q=primitive")).json();
  expect(search.total).toBeGreaterThan(0);

  // Delete.
  await page.goto(editUrl);
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete this entry" }).click();
  await expect(page).toHaveURL(/\/admin\/concept$/);
  expect((await page.request.get("/concepts/primitive-accumulation")).status()).toBe(404);
});

test("edit a debate's stance matrix and a path's route", async ({ page }) => {
  await login(page);
  await page.goto("/admin/debate/db_class-consciousness");
  await page.getByLabel("Marx on: Culture and common sense are decisive terrains.").selectOption("qualified");
  await page.getByRole("button", { name: "Save stances" }).click();
  await page.goto("/debates/class-consciousness");
  const row = page.locator("#compare tbody tr").filter({ hasText: "Culture and common sense" });
  await expect(row.locator("td").first()).toContainText("Qualified");

  await page.goto("/admin/path/pa_anarchism");
  const first = page.locator("#steps ol li").first();
  await expect(first).toContainText("Anarchism");
  await first.getByRole("button", { name: "↓" }).click();
  await expect(page.locator("#steps ol li").first()).toContainText("Pierre-Joseph Proudhon");
});
