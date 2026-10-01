import zlib from "node:zlib";
import { expect, type Browser, type Page } from "@playwright/test";

/** Demo accounts created by `scripts/users.ts` (development and test only). */
export const PASSWORD = "atlas-demo-2026";
export const USERS = {
  contributor: "contributor@atlas.test",
  reviewer: "reviewer@atlas.test",
  editor: "editor@atlas.test",
  admin: "admin@atlas.test",
} as const;
export type DemoRole = keyof typeof USERS;

export async function login(page: Page, role: DemoRole) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(USERS[role]);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Enter the desk" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

/** A fresh browser session signed in as `role`. */
export async function deskAs(browser: Browser, role: DemoRole, viewport = { width: 1440, height: 1000 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await login(page, role);
  return page;
}

/** The autosave indicator reads "Saved · hh:mm" once the server has the latest content. */
export async function expectSaved(page: Page) {
  await expect(page.locator("span[role=status]").filter({ hasText: "Saved ·" })).toBeVisible({ timeout: 20_000 });
}

/** Wait until the entry editor has hydrated, so typing reaches React state. */
export async function editorReady(page: Page) {
  await expect(page.locator("[data-editor-ready]")).toBeAttached({ timeout: 20_000 });
}

/** Create an entry through the New entry screen and return its desk id. */
export async function createEntry(page: Page, kindLabel: string, title: string) {
  await page.goto("/admin/new");
  await page.locator("label").filter({ hasText: new RegExp(`^${kindLabel}`) }).first().click();
  await page.getByLabel("Working title").fill(title);
  await page.getByRole("button", { name: /^Create .* and open the editor/ }).click();
  await expect(page).toHaveURL(/\/admin\/entries\/[a-z]{2}_[^?]+\?created=1/);
  await editorReady(page);
  return new URL(page.url()).pathname.split("/").pop()!;
}

/** Pick the first suggestion from an Atlas combobox (entity or source picker). */
export async function pick(page: Page, combobox: ReturnType<Page["getByRole"]>, query: string, option?: string | RegExp) {
  await combobox.fill(query);
  const list = page.getByRole("listbox");
  const opt = option ? list.getByRole("option", { name: option }).first() : list.getByRole("option").first();
  await opt.click();
}

/** A small, valid PNG whose pixels encode `tag`, so the library's de-duplication does not merge test uploads. */
export function uniquePng(tag: string, size = 24) {
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour
  const seed = Buffer.from(tag);
  const rows: Buffer[] = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    for (let x = 0; x < size * 3; x++) row[1 + x] = (seed[(x + y) % seed.length] * (y + 1)) & 0xff;
    rows.push(row);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
