"use client";

import { useState } from "react";
import { Roller } from "./Roller";
import { AddFood } from "./AddFood";
import { FoodList } from "./FoodList";

export function FoodApp({ initialFoods }: { initialFoods: string[] }) {
  const [foods, setFoods] = useState<string[]>(initialFoods);
  const [winner, setWinner] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [mutation, setMutation] = useState<"idle" | "adding" | "removing">("idle");

  const handleAdd = async (name: string) => {
    if (mutation !== "idle") return;
    setMutation("adding");
    try {
      const res = await fetch("/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = "Failed to add";
        try { msg = JSON.parse(text).error ?? msg; } catch { /* empty body */ }
        throw new Error(msg);
      }
      const updated: string[] = await res.json();
      setFoods(updated);
    } finally {
      setMutation("idle");
    }
  };

  const handleRemove = async (name: string) => {
    if (mutation !== "idle") return;
    setMutation("removing");
    // Optimistic update — remove immediately so the UI responds instantly
    const previous = foods;
    setFoods((f) => f.filter((item) => item !== name));

    try {
      const res = await fetch("/api/foods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok && res.status !== 503) {
        // Revert on real errors; 503 = no storage configured (dev/local), keep removal
        setFoods(previous);
      }
    } finally {
      setMutation("idle");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center gap-3" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ background: "#f3e9d2" }}>
          🍽️
        </div>
        <div>
          <h1 className="font-semibold text-base leading-tight" style={{ color: "var(--text-primary)" }}>
            What To Eat Today?
          </h1>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Let the universe decide your next meal
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#f3e9d2", color: "var(--text-secondary)" }}>
            {foods.length} options
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10 flex flex-col gap-10">
        {/* Hero */}
        <div className="text-center">
          <p className="text-sm mb-1 font-medium" style={{ color: "var(--accent)" }}>
            SPIN TO DECIDE
          </p>
          <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            {"I can't decide what to eat."}
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Add your favourite spots and spin to let fate choose.
          </p>
        </div>

        {/* Roller card */}
        <div
          className="rounded-2xl p-8 flex flex-col items-center gap-6 shadow-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Roller
            foods={foods}
            winner={winner}
            setWinner={setWinner}
            spinning={spinning}
            setSpinning={setSpinning}
          />

          {winner && !spinning && (
            <div className="text-center animate-[pop_in_0.4s_ease_forwards]">
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                Today you should eat
              </p>
              <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                {winner} 🎉
              </p>
            </div>
          )}
        </div>

        {/* Add food */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h3 className="font-semibold mb-1 text-sm" style={{ color: "var(--text-primary)" }}>
            Add a food to the list
          </h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
            Everyone can contribute — your addition will appear for all visitors.
          </p>
          <AddFood onAdd={handleAdd} disabled={mutation !== "idle"} />
        </div>

        {/* Food list */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <FoodList foods={foods} onRemove={handleRemove} disabled={mutation !== "idle"} />
        </div>
      </main>

      <footer className="text-center py-6 text-xs" style={{ color: "var(--text-secondary)" }}>
        Built with Next.js · Hosted on Vercel
        <br />
        Built by Cheezy
      </footer>
    </div>
  );
}
