import { expect, test, type Page } from "@playwright/test";
import { deskAs } from "./helpers";

/**
 * Geography: a destination of its own beside the Theory Map. Places come from
 * the gazetteer (seeded from the Geography corpus's verified records);
 * birthplaces, places of death and event locations come from the entries'
 * fields, and recorded associations go through review.
 */

const map = (page: Page) => page.getByRole("region", { name: /^Geography map/ });
const panel = (page: Page) => page.getByRole("complementary", { name: "Places and entries" });
const kinds = (page: Page) => page.getByRole("group", { name: "Kinds of entry" });
const roles = (page: Page) => page.getByRole("group", { name: "Kinds of association" });

/** The map has hydrated and made its first fit. */
async function mapReady(page: Page) {
  await expect(map(page)).toHaveAttribute("data-ready", "true");
}

async function findOnMap(page: Page, query: string, option: RegExp) {
  const box = page.getByRole("combobox", { name: "Find a place or an entry" });
  await box.fill(query);
  await page.getByRole("listbox", { name: "Places and entries" }).getByRole("option", { name: option }).first().click();
}

test("Geography and the Theory Map are separate destinations in Explore's menu", async ({ page }) => {
  await page.goto("/");
  const primary = page.getByRole("navigation", { name: "Primary" });
  const toggle = primary.getByRole("button", { name: "The collection's sections" });
  // Retry if the dev server's first compile of a route refreshes the page just after the click.
  const open = () =>
    expect(async () => {
      if ((await toggle.getAttribute("aria-expanded")) !== "true") await toggle.click();
      await expect(primary.getByRole("list", { name: "Maps & time" })).toBeVisible({ timeout: 1000 });
    }).toPass();
  const group = primary.getByRole("list", { name: "Maps & time" });
  await open();
  await expect(group.getByRole("link", { name: "Geography" })).toHaveAttribute("href", "/geography");
  await expect(group.getByRole("link", { name: "Theory Map" })).toHaveAttribute("href", "/map");

  await group.getByRole("link", { name: "Geography" }).click();
  await expect(page).toHaveURL(/\/geography$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Geography.");
  await expect(primary).toContainText("Current section: Geography");
  await open();
  await expect(group.getByRole("link", { name: "Geography" })).toHaveAttribute("aria-current", "page");
  await expect(group.getByRole("link", { name: "Theory Map" })).not.toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await page.waitForLoadState("networkidle");
  // Its own controls, not the Theory Map's.
  await expect(page.getByRole("button", { name: /Relations/ })).toHaveCount(0);
  await expect(map(page).locator("svg g[role=button]").first()).toBeVisible();

  await open();
  await group.getByRole("link", { name: "Theory Map" }).click();
  await expect(page).toHaveURL(/\/map$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The Theory Map");
  await expect(page.getByRole("region", { name: /^Theory Map/ })).toBeVisible();
});

test("selecting a place shows who and what is associated with it, by kind of association", async ({ page }) => {
  await page.goto("/geography");
  await mapReady(page);
  const index = panel(page);
  await expect(index.getByRole("heading", { name: "Most associated places" })).toBeVisible();
  await index.getByRole("button", { name: /^1 Berlin/ }).click();

  await expect(page).toHaveURL(/[?&]place=berlin/);
  await expect(index.getByRole("heading", { level: 2, name: "Berlin" })).toBeVisible();
  await expect(index).toContainText("Capital of Prussia");
  const births = index.locator("section").filter({ has: page.getByRole("heading", { name: "Birthplace" }) });
  await expect(births.getByRole("link", { name: "Eduard Bernstein" })).toHaveAttribute("href", "/thinkers/bernstein");
  await expect(births).toContainText("From the entry: “Berlin”");
  await expect(index.getByRole("heading", { name: "Event location" })).toBeVisible();
  await expect(index.getByRole("link", { name: /Spartacist uprising/ })).toBeVisible();
  await expect(map(page).locator('g[role=button][aria-pressed=true][aria-label^="Berlin"]')).toBeVisible();

  // A historical name: Petrograd is St Petersburg, with its other names.
  await findOnMap(page, "Petrograd", /St Petersburg/);
  await expect(index.getByRole("heading", { level: 2, name: "St Petersburg" })).toBeVisible();
  await expect(index).toContainText("Petrograd (1914–24)");
  await expect(index).toContainText("From the entry: “Petrograd”");

  // A region is named across its area and listed apart, never a point.
  await page.goto("/geography");
  await mapReady(page);
  await index.getByRole("button", { name: /^Catalonia/ }).click();
  await expect(index.getByRole("heading", { level: 2, name: "Catalonia" })).toBeVisible();
  await expect(index).toContainText("From the entry: “Catalonia, Aragon and beyond”");
  await expect(map(page).locator('g[role=button][aria-label^="Catalonia"]')).toHaveCount(0);

  await page.keyboard.press("Escape");
  await expect(index.getByRole("heading", { name: "Most associated places" })).toBeVisible();
});

test("filters by kind of entry and kind of association, and a period", async ({ page }) => {
  await page.goto("/geography?place=berlin");
  await mapReady(page);
  const index = panel(page);
  await expect(index.getByRole("heading", { name: "Event location" })).toBeVisible();

  await kinds(page).getByRole("button", { name: /^Events \d+$/ }).click();
  await expect(kinds(page).getByRole("button", { name: /^Events \d+$/ })).toHaveAttribute("aria-pressed", "false");
  await expect(page).toHaveURL(/[?&]kinds=thinker/);
  await expect(index.getByRole("heading", { name: "Event location" })).toHaveCount(0);
  await expect(index).toContainText(/more associations? (is|are) hidden by the filters/);
  await kinds(page).getByRole("button", { name: /^Events \d+$/ }).click();

  await roles(page).getByRole("button", { name: /^Deaths \d+$/ }).click();
  await expect(page).toHaveURL(/[?&]roles=/);
  await expect(index.getByRole("heading", { name: "Place of death" })).toHaveCount(0);
  await expect(index.getByRole("heading", { name: "Birthplace" })).toBeVisible();
  // A group label narrows to that group alone.
  await roles(page).getByRole("button", { name: "Events", exact: true }).click();
  await expect(index.getByRole("heading", { name: "Birthplace" })).toHaveCount(0);
  await expect(index.getByRole("heading", { name: "Event location" })).toBeVisible();

  // The period: the Paris Commune is in 1848–1871, the founding of the Second International is not.
  await page.goto("/geography?place=paris");
  await mapReady(page);
  await expect(index.getByRole("link", { name: "Second International founded" })).toBeVisible();
  await page.getByRole("group", { name: "Period" }).getByRole("button", { name: "1848 to the Commune" }).click();
  await expect(page).toHaveURL(/from=1848&to=1871/);
  await expect(index.getByRole("link", { name: "The Paris Commune" })).toBeVisible();
  await expect(index.getByRole("link", { name: "Second International founded" })).toHaveCount(0);
  // The address keeps the view.
  await page.reload();
  await expect(page.getByRole("group", { name: "Period" }).getByRole("button", { name: "1848 to the Commune" })).toHaveAttribute("aria-pressed", "true");
  await expect(index.getByRole("heading", { level: 2, name: "Paris" })).toBeVisible();
});

test("an entry's places can be traced in order, and lead back to the entry", async ({ page }) => {
  await page.goto("/geography");
  await mapReady(page);
  await findOnMap(page, "Lenin", /Vladimir Lenin/);
  await expect(page).toHaveURL(/[?&]trace=thinker%3Alenin|[?&]trace=thinker:lenin/);
  const index = panel(page);
  await expect(index.getByRole("heading", { level: 2, name: "Vladimir Lenin" })).toBeVisible();
  const stops = index.getByRole("listitem");
  await expect(stops.nth(0)).toContainText("Simbirsk");
  await expect(stops.nth(0)).toContainText("Birthplace");
  await expect(stops.nth(1)).toContainText("Gorki");
  await expect(stops.nth(1)).toContainText("Place of death");
  await expect(map(page).locator('g[role=button][aria-label^="Simbirsk"] text')).toHaveText("1");
  await index.getByRole("link", { name: "Read the entry →" }).click();
  await expect(page).toHaveURL(/\/thinkers\/lenin$/);
});

test("the map zooms and pans with the keyboard and buttons, and groups nearby places", async ({ page }) => {
  await page.goto("/geography");
  await mapReady(page);
  const world = map(page).locator("svg > g").first();
  const k = async () => Number((await world.getAttribute("transform"))!.match(/matrix\(([\d.]+)/)![1]);
  const groups = map(page).locator('g[role=button][aria-label*="places:"]');
  const k0 = await k();
  const grouped = await groups.count();
  await map(page).focus();
  await page.keyboard.press("+");
  await expect.poll(k).toBeGreaterThan(k0 * 1.3);
  await page.keyboard.press("ArrowLeft");
  await map(page).getByRole("button", { name: "Zoom in", exact: true }).click();
  await map(page).getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect.poll(k).toBeGreaterThan(k0 * 3);
  // Closer in, groups come apart.
  await expect.poll(() => groups.count()).toBeLessThanOrEqual(grouped);
  await map(page).getByRole("button", { name: "Show every place" }).click();
  await expect.poll(k).toBeLessThan(k0);
  // Clicking a group zooms into it.
  await page.goto("/geography");
  await mapReady(page);
  const before = await k();
  const frame = (await map(page).boundingBox())!;
  for (let i = 0; i < (await groups.count()); i++) {
    const b = await groups.nth(i).boundingBox();
    if (!b || b.x < frame.x + 40 || b.x > frame.x + frame.width - 80 || b.y < frame.y + 50 || b.y > frame.y + frame.height - 60) continue;
    await groups.nth(i).click();
    await expect.poll(k).toBeGreaterThan(before * 1.5);
    break;
  }
});

test("recorded associations go through review before they reach the map", async ({ browser }) => {
  const page = await deskAs(browser, "editor");
  const note = `Settled in London in 1849 (test ${Date.now().toString(36)}).`;
  await page.goto("/admin/entries/th_marx?tab=places");
  await expect(page.getByText(/located:\s*Trier/)).toBeVisible();
  const form = page.getByRole("group", { name: "Record a place association" });
  await form.getByLabel("Place", { exact: true }).fill("London");
  await form.getByLabel("How it is connected").selectOption("exile");
  await form.getByLabel("From").fill("1849");
  await form.getByLabel("To").fill("1883");
  await form.getByLabel("Note").fill(note);
  await form.getByRole("combobox", { name: "Source" }).fill("Capital");
  await page.getByRole("listbox", { name: "Sources" }).getByRole("option").first().click();
  await form.getByRole("button", { name: "Record association" }).click();
  await expect(page.getByText("Recorded: exile, London.")).toBeVisible();
  await expect(page.getByText(note)).toBeVisible();
  await expect(page.getByText("◌ with next publication").first()).toBeVisible();

  // Not public yet.
  expect(await (await page.request.get("/geography?trace=thinker:marx")).text()).not.toContain(note);

  await page.goto("/admin/entries/th_marx");
  for (const step of ["Submit for review", "Start review", "Approve", "Publish changes"]) {
    const button = page.getByRole("button", { name: step, exact: true });
    await button.click();
    if (["Submit for review", "Approve"].includes(step)) await page.getByRole("button", { name: `Confirm: ${step}` }).click();
    await expect(button).toHaveCount(0);
  }
  await page.goto("/geography?trace=thinker:marx");
  await mapReady(page);
  const stops = panel(page).getByRole("listitem");
  await expect(panel(page)).toContainText(note);
  await expect(stops.filter({ hasText: note })).toContainText("Exile");
  await expect(stops.filter({ hasText: note })).toContainText("1849–1883");
  await expect(stops.filter({ hasText: note }).getByRole("link", { name: /Capital/ })).toHaveAttribute("href", /\/sources\//);

  // The desk gazetteer: unlocated wordings are listed, coordinates need a source.
  await page.goto("/admin/places");
  await expect(page.getByRole("listitem").filter({ hasText: "“Global”" }).getByRole("link", { name: /financial crisis/i })).toBeVisible();
  await page.goto("/admin/places/new");
  await page.getByLabel(/^Name/).fill("Nowhere in particular");
  await page.getByLabel(/^Latitude/).fill("200");
  await page.getByRole("button", { name: "Add to the gazetteer" }).click();
  await expect(page.getByText("Latitude between −90 and 90.").first()).toBeVisible();
});

test("public visitors cannot reach the gazetteer desk", async ({ page }) => {
  await page.goto("/admin/places");
  await expect(page).toHaveURL(/\/admin\/login/);
});
