import { NextResponse } from "next/server";
import { readFoods, writeFoods } from "@/app/lib/foods";

export async function GET() {
  console.log("[api/foods] GET");
  const foods = await readFoods();
  console.log("[api/foods] GET returning", foods.length, "items");
  return NextResponse.json(foods);
}

function storageGuard() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[api/foods] BLOB_READ_WRITE_TOKEN not set");
    return NextResponse.json(
      { error: "Storage not configured — set BLOB_READ_WRITE_TOKEN in Vercel." },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = (body.name ?? "").toString().trim();
  console.log("[api/foods] POST name:", name);

  if (!name || name.length > 60) {
    console.log("[api/foods] POST invalid name");
    return NextResponse.json({ error: "Invalid food name" }, { status: 400 });
  }

  const guard = storageGuard();
  if (guard) return guard;

  const foods = await readFoods();
  console.log("[api/foods] POST current list:", foods.length, "items");

  if (foods.map((f) => f.toLowerCase()).includes(name.toLowerCase())) {
    console.log("[api/foods] POST duplicate:", name);
    return NextResponse.json({ error: "Already in the list!" }, { status: 409 });
  }

  const updated = [...foods, name];
  try {
    await writeFoods(updated);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Storage write failed";
    console.error("[api/foods] POST write error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  console.log("[api/foods] POST success, list now:", updated.length, "items");
  return NextResponse.json(updated, { status: 201 });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const name = (body.name ?? "").toString().trim();
  console.log("[api/foods] DELETE name:", name);

  if (!name) {
    console.log("[api/foods] DELETE invalid name");
    return NextResponse.json({ error: "Invalid food name" }, { status: 400 });
  }

  const guard = storageGuard();
  if (guard) return guard;

  const foods = await readFoods();
  console.log("[api/foods] DELETE current list:", foods.length, "items");

  const updated = foods.filter((f) => f.toLowerCase() !== name.toLowerCase());

  if (updated.length === foods.length) {
    console.log("[api/foods] DELETE not found:", name);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await writeFoods(updated);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Storage write failed";
    console.error("[api/foods] DELETE write error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  console.log("[api/foods] DELETE success, list now:", updated.length, "items");
  return NextResponse.json(updated);
}
