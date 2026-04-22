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

export function FoodList({
  foods,
  onRemove,
  disabled = false,
}: {
  foods: string[];
  onRemove: (name: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
          All options
        </h3>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: "var(--bg)", color: "var(--text-secondary)" }}
        >
          {foods.length} items
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {foods.map((food) => (
          <div
            key={food}
            className="flex items-center gap-1.5 pl-3 pr-1 py-1.5 rounded-full text-sm group"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <span>{getEmoji(food)}</span>
            <span>{food}</span>
            <button
              onClick={() => onRemove(food)}
              disabled={disabled}
              title={`Remove ${food}`}
              className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                color: "var(--text-secondary)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(204,120,92,0.15)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
              }}
            >
              ×
            </button>
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
