import { sql } from "@vercel/postgres";

let schemaReady: Promise<void> | null = null;

async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS foods (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS foods_name_lower_idx
        ON foods ((LOWER(name)))
      `;
    })();
  }
  await schemaReady;
}

export async function readFoods(): Promise<string[]> {
  await ensureSchema();
  const { rows } = await sql<{ name: string }>`
    SELECT name
    FROM foods
    ORDER BY created_at ASC, id ASC
  `;
  return rows.map((row) => row.name);
}

export async function addFood(name: string): Promise<boolean> {
  await ensureSchema();
  const result = await sql`
    INSERT INTO foods (name)
    VALUES (${name})
    ON CONFLICT DO NOTHING
    RETURNING id
  `;
  return (result.rowCount ?? 0) > 0;
}

export async function removeFood(name: string): Promise<boolean> {
  await ensureSchema();
  const result = await sql`
    DELETE FROM foods
    WHERE LOWER(name) = LOWER(${name})
    RETURNING id
  `;
  return (result.rowCount ?? 0) > 0;
}
