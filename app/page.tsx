import { FoodApp } from "./components/FoodApp";
import { readFoods } from "./lib/foods";

export const dynamic = "force-dynamic";

export default async function Home() {
  const foods = await readFoods();
  return <FoodApp initialFoods={foods} />;
}
