import { expect, test, type Page } from "@playwright/test";

/**
 * The masthead: Guided on its own; Explore, the parent of the collection,
 * with a compact menu of its sections; Search and Saved on the right.
 */

const primary = (page: Page) => page.getByRole("navigation", { name: "Primary" });
const toggle = (page: Page) => primary(page).getByRole("button", { name: "The collection's sections" });
async function menu(page: Page) {
  const id = await toggle(page).getAttribute("aria-controls");
  return page.locator(`[id="${id}"]`);
}
/** Open the menu. (The dev server compiles a route on first visit and may refresh the page under the test; retry then.) */
async function openMenu(page: Page) {
  const m = await menu(page);
  await expect(async () => {
    if (await m.isHidden()) await toggle(page).click();
    await expect(m).toBeVisible({ timeout: 1000 });
  }).toPass();
  return m;
}

const DESTINATIONS: [string, RegExp][] = [
  ["Thinkers", /\/thinkers$/],
  ["Concepts", /\/concepts$/],
  ["Texts", /\/texts$/],
  ["Debates", /\/debates$/],
  ["Tendencies", /\/tendencies$/],
  ["Timeline", /\/timeline$/],
  ["Theory Map", /\/map$/],
  ["Geography", /\/geography$/],
  ["Learning paths", /\/paths$/],
  ["Sources", /\/sources$/],
];

test("the masthead shows Guided and Explore; the sections sit in Explore's menu", async ({ page }) => {
  await page.goto("/thinkers");
  await page.waitForLoadState("networkidle");
  const links = primary(page).getByRole("link");
  expect(await links.evaluateAll((els) => els.filter((e) => (e as HTMLElement).offsetParent).map((e) => e.getAttribute("href")))).toEqual(["/guided", "/explore"]);
  await expect(links.first()).toHaveAccessibleName(/^Guided/);
  await expect(primary(page).getByRole("link", { name: "Explore", exact: true })).not.toHaveAttribute("aria-current", "page");
  // The page's place in the collection is named beside Explore.
  await expect(primary(page)).toContainText("Current section: Thinkers");
  const m = await menu(page);
  await expect(m).toBeHidden();
  await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");

  await toggle(page).click();
  await expect(m).toBeVisible();
  await expect(toggle(page)).toHaveAttribute("aria-expanded", "true");
  expect(await m.getByRole("list", { name: "Library" }).getByRole("link").allInnerTexts()).toEqual(["Thinkers", "Concepts", "Texts", "Debates", "Tendencies"]);
  expect(await m.getByRole("list", { name: "Maps & time" }).getByRole("link").allInnerTexts()).toEqual(["Timeline", "Theory Map", "Geography"]);
  await expect(m.getByRole("link", { name: "Thinkers" })).toHaveAttribute("aria-current", "page");
  await expect(m.getByRole("link", { name: "Guided" })).toHaveCount(0);

  // Search and Saved stay in the masthead.
  await expect(page.getByRole("banner").getByRole("button", { name: /Search/ })).toBeVisible();
  await expect(page.getByRole("banner").getByRole("link", { name: /Saved entries/ })).toBeVisible();

  await page.goto("/explore");
  await page.waitForLoadState("networkidle");
  await expect(primary(page).getByRole("link", { name: "Explore", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(primary(page)).not.toContainText("Current section");
});

test("every destination is reachable from the menu, and the menu closes on navigating", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  for (const [name, url] of DESTINATIONS) {
    const m = await openMenu(page);
    await m.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(url);
    await expect(m).toBeHidden();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
    await page.waitForLoadState("networkidle");
    await openMenu(page);
    await expect(m.getByRole("link", { name, exact: true })).toHaveAttribute("aria-current", "page");
    await page.keyboard.press("Escape");
    await expect(m).toBeHidden();
  }
  await (await openMenu(page)).getByRole("link", { name: /The whole collection/ }).click();
  await expect(page).toHaveURL(/\/explore$/);
  await primary(page).getByRole("link", { name: /^Guided/ }).click();
  await expect(page).toHaveURL(/\/guided$/);
  await expect(primary(page).getByRole("link", { name: /^Guided/ })).toHaveAttribute("aria-current", "page");
});

test("the menu works from the keyboard", async ({ page }) => {
  await page.goto("/texts");
  await page.waitForLoadState("networkidle");
  const m = await menu(page);
  await primary(page).getByRole("link", { name: "Explore", exact: true }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(m).toBeVisible();
  await expect(m.getByRole("link", { name: /The whole collection/ })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(m.getByRole("link", { name: "Thinkers" })).toBeFocused();
  await page.keyboard.press("End");
  await expect(m.getByRole("link", { name: "Sources" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(m.getByRole("link", { name: /The whole collection/ })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(m).toBeHidden();
  await expect(toggle(page)).toBeFocused();

  // Enter on the chevron opens it; Tab walks through it; leaving it closes it.
  await page.keyboard.press("Enter");
  await expect(m).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(m.getByRole("link", { name: /The whole collection/ })).toBeFocused();
  for (let i = 0; i < 3; i++) await page.keyboard.press("Tab");
  await expect(m.getByRole("link", { name: "Texts" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/texts$/);
  await expect(m).toBeHidden();
  await toggle(page).focus();
  await page.keyboard.press("Enter");
  await expect(m).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(m).toBeHidden();
});

test("a mouse opens the menu on hover; a click elsewhere closes it", async ({ page }) => {
  await page.goto("/concepts");
  await page.waitForLoadState("networkidle");
  const m = await menu(page);
  await primary(page).getByRole("link", { name: "Explore", exact: true }).hover();
  await expect(m).toBeVisible();
  await m.getByRole("link", { name: "Geography" }).hover();
  await expect(m).toBeVisible();
  await page.mouse.move(700, 600);
  await expect(m).toBeHidden();
  await toggle(page).click();
  await expect(m).toBeVisible();
  await page.mouse.click(1300, 700);
  await expect(m).toBeHidden();
});

test("touch: tapping the chevron opens the menu, tapping Explore opens its page", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/debates");
  await page.waitForLoadState("networkidle");
  const m = await menu(page);
  await toggle(page).tap();
  await expect(m).toBeVisible();
  await m.getByRole("link", { name: "Timeline" }).tap();
  await expect(page).toHaveURL(/\/timeline$/);
  await expect(m).toBeHidden();
  await primary(page).getByRole("link", { name: "Explore", exact: true }).tap();
  await expect(page).toHaveURL(/\/explore$/);
  await context.close();
});

for (const width of [1024, 1180, 1280, 1440, 1920]) {
  test(`the masthead fits on one line at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 800 } });
    const page = await context.newPage();
    await page.goto("/geography");
    await page.waitForLoadState("networkidle");
    const banner = page.getByRole("banner");
    const box = async (l: ReturnType<Page["locator"]>) => (await l.boundingBox())!;
    const word = await box(banner.getByRole("link", { name: /home$/ }));
    const nav = await box(primary(page).getByRole("list").first());
    const search = await box(banner.getByRole("button", { name: /Search/ }));
    const saved = await box(banner.getByRole("link", { name: /Saved entries/ }));
    expect(word.x + word.width + 24).toBeLessThan(nav.x);
    expect(nav.x + nav.width + 24).toBeLessThan(search.x);
    expect(search.x + search.width).toBeLessThan(saved.x);
    expect(saved.x + saved.width).toBeLessThanOrEqual(width);
    expect((await box(banner)).height).toBeLessThanOrEqual(61);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await context.close();
  });
}
