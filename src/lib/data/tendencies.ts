import "server-only";
import { eq, inArray } from "drizzle-orm";
import { ready } from "@/lib/db/client";
import { tendencyDetails } from "@/lib/db/schema";
import { buildProse, getEntityRow, getRelations, pick, toSummary } from "./core";
import { getNeighborhood } from "./graph";

export async function getTendency(slug: string) {
  const row = await getEntityRow("tendency", slug);
  if (!row) return null;
  const db = await ready();
  const details = (await db.select().from(tendencyDetails).where(eq(tendencyDetails.entityId, row.id)).get()) ?? {
    color: "ink",
    periodLabel: null,
  };
  const [relations, prose] = await Promise.all([getRelations(row.id), buildProse(row.id, [row.body])]);
  const members = pick(relations, "MEMBER_OF", "in", "thinker").sort((a, b) => (a.yearStart ?? 0) - (b.yearStart ?? 0));
  const memberIds = members.map((m) => m.id);
  // Texts by members.
  const texts = (
    await Promise.all(memberIds.map((id) => getRelations(id, { types: ["WROTE"], direction: "out", kinds: ["text"] })))
  )
    .flat()
    .filter((t, i, all) => all.findIndex((x) => x.id === t.id) === i)
    .sort((a, b) => (a.yearStart ?? 0) - (b.yearStart ?? 0));
  const network = memberIds.length
    ? await getNeighborhood(row.id, { depth: 1, kinds: ["thinker", "tendency"], limit: 30, families: ["influence", "critique", "response", "affinity", "structure"] })
    : { nodes: [], edges: [] };
  return {
    entity: toSummary(row),
    body: row.body,
    details,
    members,
    texts,
    lineage: relations.filter((r) => r.kind === "tendency"),
    events: relations.filter((r) => r.kind === "event"),
    network,
    prose,
  };
}

export async function getTendencyColors(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length) return {};
  const db = await ready();
  const rows = await db.select().from(tendencyDetails).where(inArray(tendencyDetails.entityId, ids));
  return Object.fromEntries(rows.map((r) => [r.entityId, r.color]));
}

export type TendencyAggregate = NonNullable<Awaited<ReturnType<typeof getTendency>>>;

/** Ids of thinkers belonging to a tendency (by slug), or null if the tendency doesn't exist. */
export async function getTendencyMemberIds(slug: string): Promise<string[] | null> {
  const row = await getEntityRow("tendency", slug);
  if (!row) return null;
  const rel = await getRelations(row.id, { types: ["MEMBER_OF"], direction: "in", kinds: ["thinker"] });
  return rel.map((r) => r.id);
}
