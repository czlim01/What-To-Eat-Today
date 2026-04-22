import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { addFood, readFoods } from "@/app/lib/foods";

const LEGACY_KV_KEY = "what-to-eat-foods";

export async function POST(req: Request) {
  const expectedToken = process.env.MIGRATION_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      { error: "MIGRATION_TOKEN is not configured." },
      { status: 503 }
    );
  }

  const token = req.headers.get("x-migration-token");
  if (token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.POSTGRES_URL) {
    return NextResponse.json(
      { error: "POSTGRES_URL is not configured." },
      { status: 503 }
    );
  }
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json(
      { error: "KV_REST_API_URL/KV_REST_API_TOKEN are not configured." },
      { status: 503 }
    );
  }

  try {
    const payload = await kv.get(LEGACY_KV_KEY);
    if (!Array.isArray(payload)) {
      return NextResponse.json(
        { error: `KV key "${LEGACY_KV_KEY}" is missing or not an array.` },
        { status: 400 }
      );
    }

    const names = payload
      .map((item) => String(item).trim())
      .filter((name) => name.length > 0 && name.length <= 60);

    let inserted = 0;
    let skipped = 0;
    for (const name of names) {
      const ok = await addFood(name);
      if (ok) inserted += 1;
      else skipped += 1;
    }

    const foods = await readFoods();
    return NextResponse.json({
      sourceKey: LEGACY_KV_KEY,
      kvItems: names.length,
      inserted,
      skipped,
      totalInPostgres: foods.length,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
