import { expect, test } from "@playwright/test";

test.describe("home & theory map", () => {
  test("renders the masthead and entry points", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("A map of socialist thought");
    const explore = page.getByRole("navigation", { name: "Explore by" });
    for (const k of ["Thinker", "Concept", "Tendency", "Debate", "Period", "Text"]) await expect(explore).toContainText(k);
  });

  test("hover, select and open a thinker from the map", async ({ page }) => {
    await page.goto("/");
    const map = page.locator("section[aria-labelledby=map-heading]");
    const marx = map.locator('svg:visible g[role=button][aria-label^="Karl Marx"]');
    await marx.hover();
    await expect(map.getByText("click to preview")).toBeVisible();
    await marx.click();
    const panel = map.getByRole("link", { name: /Open thinker/ });
    await expect(panel).toBeVisible();
    await expect(map).toContainText("influenced");
    await panel.click();
    await expect(page).toHaveURL(/\/thinkers\/marx$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Karl Marx");
  });

  test("map is keyboard operable", async ({ page }) => {
    await page.goto("/");
    const node = page.locator('section[aria-labelledby=map-heading] svg:visible g[role=button][aria-label^="Rosa Luxemburg"]');
    await node.focus();
    await page.keyboard.press("Enter");
    await expect(node).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Escape");
    await expect(node).toHaveAttribute("aria-pressed", "false");
  });
});

test.describe("search", () => {
  test("overlay opens with / and groups results by type", async ({ page }) => {
    await page.goto("/explore");
    await page.keyboard.press("/");
    const dialog = page.getByRole("dialog", { name: "Search the archive" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("combobox").fill("alienation");
    await expect(dialog.getByRole("region", { name: "Concepts" })).toContainText("Alienation");
    await expect(dialog.getByRole("region", { name: "Thinkers" })).toContainText("Karl Marx");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/concepts\/alienation/);
  });

  test("search page finds aliases and prefixes", async ({ page }) => {
    await page.goto("/search?q=estrang");
    await expect(page.getByRole("main")).toContainText("Alienation");
    await page.goto("/search?q=Kapital");
    await expect(page.getByRole("main")).toContainText("Capital, Volume I");
  });
});

test.describe("entries", () => {
  test("concept: descend through depth levels", async ({ page }) => {
    await page.goto("/concepts/alienation");
    await expect(page.getByRole("region", { name: "30 seconds explanation" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Deep dive explanation" })).toHaveCount(0);
    await page.getByRole("button", { name: /Go deeper: 5 minutes/ }).click();
    await expect(page.getByRole("region", { name: "5 minutes explanation" })).toContainText("species-being");
    await page.getByRole("button", { name: /Go deeper: Deep dive/ }).click();
    await expect(page.getByRole("region", { name: "Deep dive explanation" })).toContainText("anti-humanist");
    await expect(page).toHaveURL(/depth=deep/);
    // Footnotes resolve to sources.
    await expect(page.locator("#notes-heading")).toBeVisible();
    await expect(page.locator("#note-1")).toContainText("Economic and Philosophic Manuscripts");
  });

  test("thinker: sections, works and debates", async ({ page }) => {
    await page.goto("/thinkers/luxemburg");
    await expect(page.locator("#works")).toContainText("Social Reform or Revolution?");
    await expect(page.locator("#disagreements")).toContainText("Eduard Bernstein");
    await expect(page.locator("#disagreements")).toContainText("What is the state");
    await expect(page.locator("#timeline")).toContainText("1919");
  });

  test("debate: compare two positions", async ({ page }) => {
    await page.goto("/debates/what-is-the-state");
    await page.getByRole("button", { name: "Compare Bakunin" }).click();
    await page.getByRole("button", { name: "Compare Lenin" }).click();
    const table = page.locator("#compare table");
    await expect(table.locator("thead th")).toHaveCount(4);
    await expect(page.locator("#compare")).toContainText("Comparing Bakunin · Lenin");
    await expect(table).toContainText("Diverge");
    await page.getByLabel("Only disagreements").check();
    await expect(table.locator("tbody tr").filter({ hasText: "Agree" })).toHaveCount(0);
    await expect(page.locator("#arguments")).toContainText("Counterargument");
  });

  test("timeline: zoom and open the context panel", async ({ page }) => {
    await page.goto("/timeline?focus=1871");
    await page.getByRole("button", { name: "Decade" }).click();
    await expect(page.getByRole("button", { name: "Decade" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: /^1871: The Paris Commune/ }).click();
    const panel = page.getByRole("complementary", { name: /Context: The Paris Commune/ });
    await expect(panel).toContainText("18 March");
    await expect(panel).toContainText("Karl Marx");
    await expect(page).toHaveURL(/item=paris-commune/);
    await page.getByRole("button", { name: "Events" }).click();
    await expect(page.getByRole("button", { name: /^1871: The Paris Commune/ })).toHaveCount(0);
  });

  test("learning path: next, back, explore", async ({ page }) => {
    await page.goto("/paths/first-steps-into-marxism");
    await page.getByRole("link", { name: /Begin the path/ }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Capitalism" })).toBeVisible();
    await page.getByRole("link", { name: /Next/ }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Class", exact: true })).toBeVisible();
    await page.getByRole("link", { name: /Back/ }).click();
    await expect(page).toHaveURL(/step=1/);
    await page.getByRole("link", { name: /Open the full entry/ }).click();
    await expect(page).toHaveURL(/\/concepts\/capitalism/);
  });

  test("bookmarks persist in the browser", async ({ page }) => {
    await page.goto("/thinkers/gramsci");
    await page.getByRole("button", { name: /Save Antonio Gramsci/ }).click();
    await page.goto("/bookmarks");
    await expect(page.getByRole("main")).toContainText("Antonio Gramsci");
    await page.getByRole("button", { name: /Remove Antonio Gramsci/ }).click();
    await expect(page.getByRole("main")).toContainText("Nothing saved yet");
  });

  test("unknown entries 404", async ({ page }) => {
    const res = await page.goto("/thinkers/nobody-at-all");
    expect(res?.status()).toBe(404);
  });
});
