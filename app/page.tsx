import { FoodApp } from "./components/FoodApp";
import { readFoods } from "./lib/foods";

export const dynamic = "force-dynamic";

export default async function Home() {
  let foods: string[] = [];
  try {
    foods = await readFoods();
  } catch (e) {
    console.error("[page] failed to read foods:", e instanceof Error ? e.message : e);
  }
  return <FoodApp initialFoods={foods} />;
}
