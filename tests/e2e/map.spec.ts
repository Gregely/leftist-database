import { expect, test, type Page } from "@playwright/test";

/** The Theory Map: progressive detail, selection, filters, views, period, search and navigation. */

const plate = (page: Page) => page.locator("section[aria-labelledby=map-heading]");
const mark = (page: Page, name: string) => plate(page).locator(`g[role=button][aria-label^="${name}"]`);
const labels = (page: Page) => plate(page).locator("svg text[font-family]");
const canvas = (page: Page) => plate(page).locator("svg.touch-none");
/** The share of marks in view that carry a name. */
const namedShare = (page: Page) =>
  page.evaluate(() => {
    const svg = document.querySelector("section[aria-labelledby=map-heading] svg.touch-none")!.getBoundingClientRect();
    const inView = [...document.querySelectorAll("section[aria-labelledby=map-heading] g[role=button]")].filter((g) => {
      const r = g.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      return x > svg.left && x < svg.right && y > svg.top && y < svg.bottom;
    }).length;
    return document.querySelectorAll("section[aria-labelledby=map-heading] svg text[font-family]").length / Math.max(1, inView);
  });
const scale = async (page: Page) => {
  const m = await plate(page).locator("svg > g > g[transform^=matrix]").first().getAttribute("transform");
  return Number(m!.match(/matrix\(([\d.e-]+)/)![1]);
};

async function open(page: Page, url = "/map") {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  await expect(plate(page).locator("g[role=button]").first()).toBeAttached();
  // Names are placed once the map has measured itself.
  await expect(labels(page).first()).toBeVisible();
  await page.waitForTimeout(400);
}

/** No two names drawn on the map overlap. */
async function expectNoLabelCollisions(page: Page) {
  const overlaps = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll("section[aria-labelledby=map-heading] svg text[font-family]")].map((t) => t.getBoundingClientRect()).filter((r) => r.width > 0);
    let n = 0;
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const [a, b] = [boxes[i], boxes[j]];
        if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 2 && a.bottom > b.top + 2) n++;
      }
    return n;
  });
  expect(overlaps).toBe(0);
}

test("the overview is sparse and zooming in names more entries", async ({ page }) => {
  await open(page);
  const group = page.getByRole("group", { name: "Show" });
  await expect(group.getByRole("button", { name: /Thinkers/ })).toHaveAttribute("aria-pressed", "true");
  await expect(group.getByRole("button", { name: /Concepts/ })).toHaveAttribute("aria-pressed", "true");
  await expect(group.getByRole("button", { name: /Texts/ })).toHaveAttribute("aria-pressed", "false");
  const marks = await plate(page).locator("g[role=button]").count();
  const overview = await labels(page).count();
  expect(overview).toBeGreaterThan(3);
  expect(overview).toBeLessThan(marks / 2);
  const share = await namedShare(page);
  await expectNoLabelCollisions(page);

  const k0 = await scale(page);
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Zoom in" }).click();
  await page.waitForTimeout(800);
  expect(await scale(page)).toBeGreaterThan(k0 * 3);
  expect(await namedShare(page)).toBeGreaterThan(share);
  await expectNoLabelCollisions(page);

  await page.getByRole("button", { name: "Fit to view" }).click();
  await page.waitForTimeout(800);
  expect(Math.abs((await scale(page)) - k0) / k0).toBeLessThan(0.05);
});

test("zoom by wheel, keyboard and drag", async ({ page }) => {
  await open(page);
  const box = (await canvas(page).boundingBox())!;
  const k0 = await scale(page);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, -600);
  await page.waitForTimeout(400);
  const k1 = await scale(page);
  expect(k1).toBeGreaterThan(k0);

  await page.getByRole("region", { name: /Theory Map/ }).focus();
  await page.keyboard.press("-");
  await page.waitForTimeout(500);
  expect(await scale(page)).toBeLessThan(k1);
  await page.keyboard.press("0");
  await page.waitForTimeout(700);
  expect(Math.abs((await scale(page)) - k0) / k0).toBeLessThan(0.05);

  // Dragging moves the map without selecting anything.
  const before = await plate(page).locator("svg > g > g[transform^=matrix]").first().getAttribute("transform");
  await page.mouse.move(box.x + 60, box.y + 60);
  await page.mouse.down();
  await page.mouse.move(box.x + 260, box.y + 160, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(300);
  expect(await plate(page).locator("svg > g > g[transform^=matrix]").first().getAttribute("transform")).not.toBe(before);
  await expect(page.locator("[data-map-panel]")).toHaveCount(0);
});

test("selecting an entry shows its connections and opens it", async ({ page }) => {
  await open(page);
  await mark(page, "Karl Marx").click();
  const panel = page.getByRole("complementary", { name: /Karl Marx: summary and connections/ });
  await expect(panel).toBeVisible();
  await expect(panel).toContainText(/connections? shown/);
  await expect(mark(page, "Karl Marx")).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/focus=thinker%3Amarx/);
  // Its neighbours are named on the map.
  await expect(labels(page).filter({ hasText: "Friedrich Engels" })).toHaveCount(1);
  await expectNoLabelCollisions(page);

  // Narrow to the neighbourhood, then back to the whole map.
  const all = await plate(page).locator("g[role=button]").count();
  await panel.getByRole("button", { name: "Show only these" }).click();
  await expect(page).toHaveURL(/isolate=1/);
  await expect.poll(() => plate(page).locator("g[role=button]").count()).toBeLessThan(all);
  await panel.getByRole("button", { name: "Whole map" }).click();
  await expect.poll(() => plate(page).locator("g[role=button]").count()).toBe(all);

  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);

  await mark(page, "Karl Marx").click();
  await page.getByRole("complementary", { name: /Karl Marx/ }).getByRole("link", { name: /Open the thinker/ }).click();
  await expect(page).toHaveURL(/\/thinkers\/marx$/);
});

test("filters by kind and relation, arrangement and period", async ({ page }) => {
  await open(page);
  const textMarks = plate(page).locator('g[role=button][aria-label*=", text"]');
  await expect(textMarks).toHaveCount(0);
  await page.getByRole("group", { name: "Show" }).getByRole("button", { name: /Texts/ }).click();
  await expect(page).toHaveURL(/kinds=thinker%2Cconcept%2Ctext/);
  expect(await textMarks.count()).toBeGreaterThan(0);

  await page.getByRole("button", { name: /^Relations:/ }).click();
  await page.getByRole("checkbox", { name: "Critique" }).uncheck();
  await expect(page.getByRole("button", { name: /^Relations:/ })).toContainText("4/5");

  await page.getByRole("group", { name: "Arrange" }).getByRole("button", { name: "By connection" }).click();
  await expect(page).toHaveURL(/arrange=links/);

  // A period: entries active outside it leave the map.
  await page.getByRole("group", { name: "Period" }).getByRole("button", { name: "1848 to the Commune" }).click();
  await expect(page).toHaveURL(/from=1848&to=1871/);
  await expect(mark(page, "Vladimir Lenin")).toHaveCount(0);
  await expect(mark(page, "Karl Marx")).toBeVisible();
  await page.getByRole("group", { name: "Period" }).getByRole("button", { name: "All" }).click();
  await expect(mark(page, "Vladimir Lenin")).toBeVisible();

  await page.getByRole("button", { name: "Reset map" }).click();
  await expect(textMarks).toHaveCount(0);
  await expect(page).toHaveURL(/\/map$/);
});

test("search finds an entry hidden by the filters and focuses it", async ({ page }) => {
  await open(page);
  const q = page.getByRole("combobox", { name: "Find on the map" });
  await q.fill("manifesto");
  await expect(page.getByRole("listbox", { name: "Entries on the map" })).toContainText("Manifesto of the Communist Party");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("complementary", { name: /Manifesto of the Communist Party/ })).toBeVisible();
  await expect(page.getByRole("group", { name: "Show" }).getByRole("button", { name: /Texts/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/focus=text%3Acommunist-manifesto/);
});

test("starting points open curated views of the real record, and survive a reload", async ({ page }) => {
  await open(page);
  const views = page.getByRole("group", { name: "Starting points" });
  await views.getByRole("button", { name: "Marx and his influences" }).click();
  await expect(page).toHaveURL(/view=marx/);
  await expect(page.getByRole("complementary", { name: /Karl Marx/ })).toBeVisible();
  const n = await plate(page).locator("g[role=button]").count();
  expect(n).toBeGreaterThan(3);
  await expectNoLabelCollisions(page);

  await page.reload();
  await expect(page.getByRole("complementary", { name: /Karl Marx/ })).toBeVisible();
  await expect.poll(() => plate(page).locator("g[role=button]").count()).toBe(n);

  await page.getByRole("button", { name: /Show the whole map/ }).click();
  await expect(page).toHaveURL(/\/map$/);
});

test("a shared address restores the focus", async ({ page }) => {
  await open(page, "/map?focus=thinker:luxemburg&kinds=thinker");
  await expect(page.getByRole("complementary", { name: /Rosa Luxemburg/ })).toBeVisible();
  await expect(plate(page).locator('g[role=button][aria-label*=", concept"]')).toHaveCount(0);
  await expect(mark(page, "Rosa Luxemburg")).toHaveAttribute("aria-pressed", "true");
});
