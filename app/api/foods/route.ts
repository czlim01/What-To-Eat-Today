import { NextResponse } from "next/server";
import { addFood, readFoods, removeFood } from "@/app/lib/foods";

export async function GET() {
  console.log("[api/foods] GET");
  try {
    const foods = await readFoods();
    console.log("[api/foods] GET returning", foods.length, "items");
    return NextResponse.json(foods);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Storage read failed";
    console.error("[api/foods] GET read error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function storageGuard() {
  if (!process.env.POSTGRES_URL) {
    console.error("[api/foods] POSTGRES_URL not set");
    return NextResponse.json(
      { error: "Storage not configured — set POSTGRES_URL in Vercel." },
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

  try {
    const added = await addFood(name);
    if (!added) {
      console.log("[api/foods] POST duplicate:", name);
      return NextResponse.json({ error: "Already in the list!" }, { status: 409 });
    }
    const updated = await readFoods();
    console.log("[api/foods] POST success, list now:", updated.length, "items");
    return NextResponse.json(updated, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Storage operation failed";
    console.error("[api/foods] POST error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name ?? "").toString().trim();
    console.log("[api/foods] DELETE name:", name);

    if (!name) {
      console.log("[api/foods] DELETE invalid name");
      return NextResponse.json({ error: "Invalid food name" }, { status: 400 });
    }

    const guard = storageGuard();
    if (guard) return guard;

    const removed = await removeFood(name);
    if (!removed) {
      console.log("[api/foods] DELETE not found:", name);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const updated = await readFoods();
    console.log("[api/foods] DELETE success, list now:", updated.length, "items");
    return NextResponse.json(updated);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[api/foods] DELETE unhandled error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
