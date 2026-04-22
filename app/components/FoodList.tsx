"use client";

const FOOD_EMOJIS: Record<string, string> = {
  pizza: "🍕", sushi: "🍣", burger: "🍔", taco: "🌮", tacos: "🌮",
  pasta: "🍝", ramen: "🍜", salad: "🥗", steak: "🥩", chicken: "🍗",
  rice: "🍚", noodle: "🍜", noodles: "🍜", soup: "🥣", sandwich: "🥪",
  curry: "🍛", dim: "🥟", dumpling: "🥟", prata: "🫓", laksa: "🍜",
  satay: "🍢", nasi: "🍚", char: "🍜", pho: "🍜", sashimi: "🍣",
  hot: "🌶️", fried: "🍳", bbq: "🍖", wrap: "🌯", fish: "🐟",
};

function getEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return "🍽️";
}

export function FoodList({ foods }: { foods: string[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
          All options
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg)", color: "var(--text-secondary)" }}>
          {foods.length} items
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {foods.map((food) => (
          <div
            key={food}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <span>{getEmoji(food)}</span>
            <span>{food}</span>
          </div>
        ))}

        {foods.length === 0 && (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No foods yet — be the first to add one!
          </p>
        )}
      </div>
    </div>
  );
}
