import { put, head, get } from "@vercel/blob";

const BLOB_FILENAME = "what-to-eat-foods.json";

export const DEFAULT_FOODS = [
  "Pizza", "Sushi", "Burger", "Tacos", "Pasta",
  "Fried Chicken", "Ramen", "Salad", "Steak", "Dim Sum",
  "Nasi Lemak", "Char Kway Teow", "Laksa", "Satay", "Prata",
];

export async function readFoods(): Promise<string[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.log("[foods] No BLOB_READ_WRITE_TOKEN — returning defaults");
    return DEFAULT_FOODS;
  }
  try {
    console.log("[foods] head()", BLOB_FILENAME);
    const blob = await head(BLOB_FILENAME);
    console.log("[foods] blob url:", blob.url, "size:", blob.size);

    const result = await get(blob.url, { access: "private" });
    console.log("[foods] get statusCode:", result?.statusCode);

    if (!result || result.statusCode !== 200) {
      console.log("[foods] unexpected statusCode, returning defaults");
      return DEFAULT_FOODS;
    }

    const text = await new Response(result.stream).text();
    console.log("[foods] raw text:", text.slice(0, 200));

    const data = JSON.parse(text);
    console.log("[foods] parsed items:", Array.isArray(data) ? data.length : "not array");
    return Array.isArray(data) ? data : DEFAULT_FOODS;
  } catch (e) {
    console.error("[foods] readFoods error:", e instanceof Error ? e.message : e);
    return DEFAULT_FOODS;
  }
}

export async function writeFoods(foods: string[]): Promise<void> {
  console.log("[foods] writeFoods", foods.length, "items");
  try {
    const result = await put(BLOB_FILENAME, JSON.stringify(foods), {
      access: "private",
      addRandomSuffix: false,
    });
    console.log("[foods] write ok, url:", result.url);
  } catch (e) {
    console.error("[foods] writeFoods error:", e instanceof Error ? e.message : e);
    throw e;
  }
}
