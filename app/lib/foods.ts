import { put, head } from "@vercel/blob";

const BLOB_FILENAME = "what-to-eat-foods.json";

export async function readFoods(): Promise<string[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }
  console.log("[foods] head()", BLOB_FILENAME);
  const blob = await head(BLOB_FILENAME);
  console.log("[foods] blob url:", blob.url, "size:", blob.size);

  const baseReadUrl = blob.downloadUrl || blob.url;
  const freshUrl = `${baseReadUrl}${baseReadUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
  const response = await fetch(freshUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  console.log("[foods] fetch status:", response.status);

  if (!response.ok) {
    throw new Error(`Blob read failed with status ${response.status}`);
  }

  const text = await response.text();
  console.log("[foods] raw text:", text.slice(0, 200));

  const data = JSON.parse(text);
  console.log("[foods] parsed items:", Array.isArray(data) ? data.length : "not array");
  if (!Array.isArray(data)) {
    throw new Error("Blob data is not an array");
  }
  return data;
}

export async function writeFoods(foods: string[]): Promise<void> {
  console.log("[foods] writeFoods", foods.length, "items");
  try {
    const result = await put(BLOB_FILENAME, JSON.stringify(foods), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    console.log("[foods] write ok, url:", result.url);
  } catch (e) {
    console.error("[foods] writeFoods error:", e instanceof Error ? e.message : e);
    throw e;
  }
}
