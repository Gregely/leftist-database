import { expect, test, type Page, type Request } from "@playwright/test";
import { createEntry, deskAs, editorReady, expectSaved, pick, uniquePng } from "./helpers";

/**
 * The definition-of-done workflow, entirely through the GUI: a contributor
 * writes a thinker, a reviewer sends it back, the contributor revises, the
 * reviewer approves and an editor publishes. Test content is clearly marked
 * as test content — no real quotations are invented.
 */
test("contributor → reviewer → editor: an entry from draft to the public site", async ({ browser }) => {
  test.setTimeout(300_000);
  const tag = Date.now().toString(36);
  const title = `Testwright Ainsley ${tag}`;

  /* ——— 1–9. The contributor drafts the entry ——— */
  const contributor = await deskAs(browser, "contributor");
  const id = await createEntry(contributor, "Thinker", title);
  const entryUrl = `/admin/entries/${id}`;
  const slug = await contributor.getByLabel("Slug").inputValue();
  expect(slug).toContain("testwright-ainsley");

  await contributor.getByLabel(/^Born/).fill("1851");
  await contributor.getByLabel("Died", { exact: true }).fill("1922");
  await contributor.getByLabel("Description").fill("Test fixture — a fictional organiser used by the end-to-end tests");
  await contributor.getByLabel("Summary").fill("A fictional figure created by the automated tests. Not a historical person.");

  // Rich text: a heading, a paragraph, an internal link made by selecting words, a footnote and a citation.
  const bio = contributor.locator(".rt", { has: contributor.locator("#field-body") });
  await bio.locator(".ProseMirror").click();
  await bio.getByRole("button", { name: "H2" }).click();
  await contributor.keyboard.type("Early years");
  await contributor.keyboard.press("Enter");
  await contributor.keyboard.type("This test paragraph mentions Karl Marx");
  for (let i = 0; i < "Karl Marx".length; i++) await contributor.keyboard.press("Shift+ArrowLeft");
  await bio.getByRole("button", { name: "Link entry" }).click();
  await bio.getByRole("listbox").getByRole("option", { name: /Karl Marx/ }).first().click();
  await bio.getByRole("button", { name: "Link", exact: true }).click();
  await expect(bio.locator(".rt-entity")).toHaveText("Karl Marx");
  await contributor.keyboard.press("End");
  await contributor.keyboard.type(" and closes here.");
  await bio.getByRole("button", { name: "Footnote" }).click();
  await bio.getByLabel("Footnote text").fill("A test footnote.");
  await bio.getByRole("button", { name: "Insert footnote" }).click();
  await bio.getByRole("button", { name: "Cite" }).click();
  await pick(contributor, bio.getByRole("combobox", { name: "Cite a source" }), "Capital", /Capital: A Critique/);
  await bio.getByPlaceholder("p. 125").fill("p. 1");
  await bio.getByRole("button", { name: "Insert citation" }).click();
  await expect(bio.locator(".rt-chip")).toHaveCount(2);
  await expectSaved(contributor);

  // Relationship: this thinker was influenced by Marx (stored canonically as Marx → influenced → them).
  await tab(contributor, "Connections");
  const rel = contributor.getByRole("group", { name: "Add a relationship" });
  await rel.getByLabel("Type").selectOption("INFLUENCED_BY");
  await pick(contributor, rel.getByRole("combobox", { name: "To" }), "Karl Marx", /Karl Marx/);
  await rel.getByLabel("Note").fill("Test relationship");
  await rel.getByRole("button", { name: "Add relationship" }).click();
  await expect(contributor.getByText(`Added: ${title} influenced by Karl Marx.`)).toBeVisible();

  // Sources: attach an existing source and catalogue a new one.
  await tab(contributor, "Sources & excerpts");
  const attach = contributor.getByRole("group", { name: "Attach a source" });
  await pick(contributor, attach.getByRole("combobox", { name: "Source" }), "Capital", /Capital: A Critique/);
  await attach.getByRole("button", { name: "Attach source" }).click();
  await expect(contributor.getByText("Attached “Capital: A Critique")).toBeVisible();

  // An unverified excerpt, catalogued against a newly created source.
  const ex = contributor.getByRole("group", { name: "Add an excerpt" });
  await ex.getByLabel("Quotation").fill(`Placeholder passage ${tag} — test fixture, not a quotation.`);
  await ex.getByRole("combobox", { name: "Edition (source)" }).fill(`Test edition ${tag}`);
  await contributor.getByRole("button", { name: /Catalogue a new source/ }).click();
  await contributor.getByRole("group", { name: "New source" }).getByRole("button", { name: "Add to bibliography" }).click();
  await ex.getByLabel("Page / chapter").fill("p. 7");
  await expect(ex.getByLabel("Verification")).toHaveValue("unverified");
  await ex.getByRole("button", { name: "Add excerpt" }).click();
  await expect(contributor.getByText("Excerpt added.")).toBeVisible();
  await expect(contributor.getByText(`Placeholder passage ${tag}`)).toBeVisible();

  // A portrait, uploaded with its rights metadata.
  await tab(contributor, "Media");
  await contributor.getByRole("button", { name: "+ Add an image" }).click();
  await contributor.getByRole("tab", { name: "Upload new" }).click();
  await contributor.locator("#media-file").setInputFiles({ name: `portrait-${tag}.png`, mimeType: "image/png", buffer: uniquePng(tag) });
  await contributor.getByLabel("Alt text").fill(`Test portrait ${tag}`);
  await contributor.getByLabel("Credit line").fill("Generated by the test suite");
  await contributor.getByLabel("Licence").fill("CC0");
  await contributor.getByRole("button", { name: "Upload and attach" }).click();
  await expect(contributor.getByText(/Uploaded and attached|already in the library/)).toBeVisible();
  await expect(contributor.locator(`img[alt="Test portrait ${tag}"]`)).toBeVisible();

  // Save a named version.
  await tab(contributor, "Content");
  await contributor.getByLabel("Version note").fill("First complete draft");
  await contributor.getByRole("button", { name: "Save version" }).click();
  await expect(contributor.getByText(/Saved as version \d+/)).toBeVisible();

  // 10. Preview renders the working copy with the public components.
  await contributor.goto(`/preview/${id}`);
  await expect(contributor.getByRole("heading", { level: 1 })).toContainText(title);
  await expect(contributor.getByText("Preview", { exact: false }).first()).toBeVisible();
  await expect(contributor.locator(`img[alt="Test portrait ${tag}"]`).first()).toBeVisible();
  await expect(contributor.getByRole("link", { name: "Karl Marx" }).first()).toBeVisible();

  // The draft is private.
  expect((await contributor.request.get(`/thinkers/${slug}`)).status()).toBe(404);

  // 11. Submit for review.
  await contributor.goto(entryUrl);
  const transitionAction = captureAction(contributor, `"submit"`);
  await transition(contributor, "Submit for review", "Ready for a first look.");
  await expect(contributor.getByText("Submitted for review")).toBeVisible();
  await expect(contributor.getByText("locked until a reviewer responds")).toBeVisible();

  /* ——— 12–13. The reviewer leaves feedback and asks for a revision ——— */
  const reviewer = await deskAs(browser, "reviewer");
  await reviewer.goto("/admin/review");
  await reviewer.getByRole("link", { name: title }).first().click();
  await expect(reviewer).toHaveURL(new RegExp(entryUrl));
  await reviewer.getByRole("button", { name: "Start review" }).click();
  await expect(reviewer.getByText("You are now reviewing")).toBeVisible();
  await tab(reviewer, "Review");
  await reviewer.getByLabel("About (optional)").selectOption({ label: "Summary" });
  await reviewer.getByLabel("Note", { exact: true }).fill("Please say where this figure was active.");
  await reviewer.getByRole("button", { name: "Add note" }).click();
  await expect(reviewer.getByText("Please say where this figure was active.")).toBeVisible();
  await transition(reviewer, "Request revision", "See the note on the summary.");
  await expect(reviewer.getByText("Revision requested — the note is with the contributor.")).toBeVisible();

  /* ——— 14. The contributor revises and resubmits ——— */
  await contributor.goto(`${entryUrl}?tab=review`);
  await expect(contributor.getByText("Please say where this figure was active.")).toBeVisible();
  await contributor.goto(entryUrl);
  await editorReady(contributor);
  await contributor.getByLabel("Summary").fill("A fictional figure created by the automated tests, active in a fictional town. Not a historical person.");
  await expectSaved(contributor);
  await transition(contributor, "Resubmit for review", "Added where they were active.");

  /* ——— 15. The reviewer approves ——— */
  await reviewer.goto(entryUrl);
  await reviewer.getByRole("button", { name: "Start review" }).click();
  await expect(reviewer.getByText("You are now reviewing")).toBeVisible();
  await transition(reviewer, "Approve", "Looks right.");
  await expect(reviewer.getByText("Approved. An editor can now publish it.")).toBeVisible();

  /* ——— 26. A contributor cannot publish, even by calling the server directly ——— */
  await contributor.goto(entryUrl);
  await expect(contributor.getByRole("button", { name: "Publish" })).toHaveCount(0);
  expect(transitionAction.id).toBeTruthy();
  const forged = await forgeTransition(contributor, transitionAction.id!, id, "publish");
  expect(forged).toMatch(/permission/i);
  expect((await contributor.request.get(`/thinkers/${slug}`)).status()).toBe(404);
  // The draft has not leaked into public search, the map or the timeline.
  const draftSearch = await (await contributor.request.get(`/api/search?q=${encodeURIComponent(title)}`)).json();
  expect(JSON.stringify(draftSearch.groups)).not.toContain(tag);
  expect((await contributor.request.get(`/api/preview/${id}`)).status()).toBe(404);
  expect(await (await contributor.request.get("/thinkers/marx")).text()).not.toContain(title);
  expect(await (await contributor.request.get("/timeline")).text()).not.toContain(title);

  /* ——— 16. The editor publishes ——— */
  const editor = await deskAs(browser, "editor");
  await editor.goto(entryUrl);
  await editor.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(editor.getByText("Published. It is now in the public library")).toBeVisible();

  /* ——— 17–19. The public site ——— */
  const pub = editor;
  await pub.goto(`/thinkers/${slug}`);
  await expect(pub.getByRole("heading", { level: 1 })).toContainText(title);
  await expect(pub.locator(`img[alt="Test portrait ${tag}"]`).first()).toBeVisible();
  await expect(pub.getByRole("heading", { name: "Early years" })).toBeVisible();
  await expect(pub.getByRole("link", { name: "Karl Marx" }).first()).toBeVisible();
  await expect(pub.getByText(`Placeholder passage ${tag}`)).toBeVisible();
  await expect(pub.getByText("Unverified").first()).toBeVisible();
  await expect(pub.getByText("active in a fictional town. Not a historical person.", { exact: false }).first()).toBeVisible();
  expect(await pub.locator("main").innerText()).not.toContain("person.A fictional");
  const found = await (await pub.request.get(`/api/search?q=${encodeURIComponent(title)}`)).json();
  expect(JSON.stringify(found)).toContain(title);
  expect((await pub.request.get(`/api/preview/${id}`)).status()).toBe(200);
  expect(await (await pub.request.get("/thinkers/marx")).text()).toContain(title);
  expect(await (await pub.request.get("/timeline?from=1840&to=1860")).text()).toContain(title);

  /* ——— 20–21. Revision history and the audit log ——— */
  await editor.goto(`${entryUrl}?tab=history`);
  await expect(editor.getByText("First complete draft")).toBeVisible();
  await expect(editor.getByText(/published/i).first()).toBeVisible();

  const admin = await deskAs(browser, "admin");
  await admin.goto(`/admin/audit?target=${id}`);
  for (const action of ["create", "submit", "revision request", "approve", "publish"]) {
    await expect(admin.locator("td", { hasText: new RegExp(`^${action}$`) }).first()).toBeVisible();
  }

  // Contributors cannot reach editor and administrator screens.
  await contributor.goto("/admin/users");
  await expect(contributor.getByText("Only administrators can manage people.")).toBeVisible();
  await contributor.goto("/admin/audit");
  await expect(contributor.getByRole("table")).toHaveCount(0);
});

test("drafts never reach the public site", async ({ browser }) => {
  const tag = Date.now().toString(36);
  const title = `Privatus Draftwell ${tag}`;
  const page = await deskAs(browser, "contributor");
  const id = await createEntry(page, "Concept", title);
  await page.getByLabel("Summary").fill(`Unpublished test concept ${tag}.`);
  await expectSaved(page);
  const slug = await page.getByLabel("Slug").inputValue();

  const anon = await browser.newPage();
  expect((await anon.request.get(`/concepts/${slug}`)).status()).toBe(404);
  const found = await (await anon.request.get(`/api/search?q=${tag}`)).json();
  expect(found.total).toBe(0);
  expect(JSON.stringify(found.groups)).not.toContain(tag);
  expect(JSON.stringify(await (await anon.request.get(`/api/search?q=${tag}&mode=lookup`)).json())).not.toContain(title);
  expect((await anon.request.get(`/api/preview/${id}`)).status()).toBe(404);
  await anon.goto(`/search?q=${tag}`);
  await expect(anon.getByText(title)).toHaveCount(0);
  // The preview, the desk and the desk APIs need a session.
  await anon.goto(`/preview/${id}`);
  await expect(anon).toHaveURL(/\/admin\/login/);
  expect((await anon.request.get(`/api/desk/lookup?q=${tag}`)).status()).toBe(401);
});

/** Switch editor tab. */
async function tab(page: Page, name: string) {
  await page.getByRole("navigation", { name: "Editor sections" }).getByRole("link", { name: new RegExp(`^${name}`) }).click();
  await expect(page.getByRole("navigation", { name: "Editor sections" }).locator("[aria-current=page]")).toContainText(name);
}

/** Fire a workflow action from the bar, filling the note when one is asked for. */
async function transition(page: Page, label: string, note?: string) {
  const button = page.getByRole("button", { name: label, exact: true });
  await button.click();
  if (["Publish", "Start review"].includes(label)) return;
  if (note) await page.locator("#wf-note").fill(note);
  await page.getByRole("button", { name: `Confirm: ${label}` }).click();
}

/** Record the id of the server action a page calls with `marker` in its arguments. */
function captureAction(page: Page, marker: string) {
  const captured: { id: string | null } = { id: null };
  const listener = (r: Request) => {
    const h = r.headers()["next-action"];
    if (h && r.method() === "POST" && (r.postData() ?? "").includes(marker)) {
      captured.id = h;
      page.off("request", listener);
    }
  };
  page.on("request", listener);
  return captured;
}

/** Replay the workflow server action with other arguments, as a hostile client could. */
async function forgeTransition(page: Page, actionId: string, id: string, transition: string) {
  const res = await page.request.post(`/admin/entries/${id}`, {
    headers: { "next-action": actionId, "content-type": "text/plain;charset=UTF-8", accept: "text/x-component" },
    data: JSON.stringify([id, transition, "$undefined"]),
  });
  return res.text();
}
