import { NextResponse } from "next/server";
import { readFoods, writeFoods } from "@/app/lib/foods";

export async function GET() {
  const foods = await readFoods();
  return NextResponse.json(foods);
}

function storageGuard() {
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    return NextResponse.json(
      { error: "Storage not configured — set BLOB_READ_WRITE_TOKEN in Vercel." },
      { status: 503 }
    );
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = (body.name ?? "").toString().trim();

  if (!name || name.length > 60)
    return NextResponse.json({ error: "Invalid food name" }, { status: 400 });

  const guard = storageGuard();
  if (guard) return guard;

  const foods = await readFoods();

  if (foods.map((f) => f.toLowerCase()).includes(name.toLowerCase()))
    return NextResponse.json({ error: "Already in the list!" }, { status: 409 });

  const updated = [...foods, name];
  await writeFoods(updated);
  return NextResponse.json(updated, { status: 201 });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const name = (body.name ?? "").toString().trim();

  if (!name)
    return NextResponse.json({ error: "Invalid food name" }, { status: 400 });

  const guard = storageGuard();
  if (guard) return guard;

  const foods = await readFoods();
  const updated = foods.filter((f) => f.toLowerCase() !== name.toLowerCase());

  if (updated.length === foods.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await writeFoods(updated);
  return NextResponse.json(updated);
}
