import { expect, test } from "@playwright/test";
import { login } from "./helpers";

const PAGES = ["/", "/explore", "/thinkers", "/thinkers/marx", "/concepts/alienation", "/debates/what-is-the-state", "/timeline", "/texts", "/paths/foundations?step=3", "/guided", "/search?q=state"];

for (const path of PAGES) {
  test(`no horizontal overflow: ${path}`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("the dock keeps Guided apart and opens Explore with the collection beneath it", async ({ page }) => {
  await page.goto("/");
  const guided = page.getByRole("link", { name: "Guided" }).last();
  await expect(guided).toHaveAttribute("href", "/guided");
  await page.getByRole("button", { name: "Explore" }).click();
  const nav = page.getByRole("navigation", { name: "Explore" });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link", { name: "Explore" })).toHaveAttribute("href", "/explore");
  await expect(nav.getByRole("link", { name: "Guided" })).toHaveCount(0);
  await nav.getByRole("link", { name: "Debates" }).click();
  await expect(page).toHaveURL(/\/debates$/);
});

test("the Theory Map works on a phone", async ({ page }) => {
  await page.goto("/map");
  await page.waitForLoadState("networkidle");
  const plate = page.locator("section[aria-labelledby=map-heading]");
  // The overview names the most connected entries in view; tap one of them.
  const named = plate.locator('g[role=button][tabindex="0"]').first();
  await expect(named).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await named.tap();
  await expect(page.getByRole("complementary", { name: /summary and connections/ })).toBeVisible();
  await page.getByRole("button", { name: /Filters & views/ }).tap();
  await expect(page.getByRole("group", { name: "Starting points" })).toBeVisible();
  await page.getByRole("group", { name: "Show" }).getByRole("button", { name: /Texts/ }).tap();
  await expect(plate.locator('g[role=button][aria-label*=", text"]').first()).toBeAttached();
});

test("portrait map and timeline list are used on phones", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("section[aria-labelledby=map-heading] svg:visible g[role=button]").first()).toBeVisible();
  await page.goto("/timeline");
  await page.getByRole("button", { name: /The Paris Commune/ }).first().click();
  await expect(page.getByRole("complementary", { name: /Context: The Paris Commune/ })).toBeVisible();
});

test("the editorial desk fits a phone, with an Editor / Preview switch", async ({ page }) => {
  await login(page, "editor");
  const pages = ["/admin", "/admin/content", "/admin/review", "/admin/new", "/admin/sources", "/admin/media", "/admin/relationships", "/admin/entries/th_marx", "/admin/entries/th_marx?tab=connections", "/admin/entries/th_marx?tab=sources", "/admin/entries/th_marx?tab=history", "/admin/entries/db_class-consciousness?tab=structure", "/preview/th_marx"];
  for (const path of pages) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
  await page.goto("/admin/entries/th_marx");
  const views = page.getByRole("navigation", { name: "Editor or preview" });
  await views.getByRole("link", { name: "Preview" }).click();
  await expect(page).toHaveURL(/\/preview\/th_marx$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Karl Marx");
  await page.getByRole("navigation", { name: "Editor or preview" }).getByRole("link", { name: "Editor" }).click();
  await expect(page).toHaveURL(/\/admin\/entries\/th_marx$/);
});
