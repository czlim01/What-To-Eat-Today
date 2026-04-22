import { put, head } from "@vercel/blob";

const BLOB_FILENAME = "what-to-eat-foods.json";

export const DEFAULT_FOODS = [
  "Pizza", "Sushi", "Burger", "Tacos", "Pasta",
  "Fried Chicken", "Ramen", "Salad", "Steak", "Dim Sum",
  "Nasi Lemak", "Char Kway Teow", "Laksa", "Satay", "Prata",
];

export async function readFoods(): Promise<string[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return DEFAULT_FOODS;
  try {
    const blob = await head(BLOB_FILENAME);
    const res = await fetch(blob.url, { cache: "no-store" });
    const data = await res.json();
    return Array.isArray(data) ? data : DEFAULT_FOODS;
  } catch {
    return DEFAULT_FOODS;
  }
}

export async function writeFoods(foods: string[]): Promise<void> {
  await put(BLOB_FILENAME, JSON.stringify(foods), {
    access: "public",
    addRandomSuffix: false,
  });
}
