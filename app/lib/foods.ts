import { kv } from "@vercel/kv";

const KV_KEY = "what-to-eat-foods";

export async function readFoods(): Promise<string[]> {
  const data = await kv.get(KV_KEY);
  if (data == null) {
    return [];
  }
  if (!Array.isArray(data)) {
    throw new Error("KV data is not an array");
  }
  return data.map((item) => String(item));
}

export async function writeFoods(foods: string[]): Promise<void> {
  await kv.set(KV_KEY, foods);
}
