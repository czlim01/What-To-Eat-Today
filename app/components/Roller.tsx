"use client";

import { useRef, useCallback } from "react";

const ITEM_H = 64;
const VISIBLE = 5;
const VIEWPORT_H = ITEM_H * VISIBLE;

interface Props {
  foods: string[];
  winner: string | null;
  setWinner: (w: string) => void;
  spinning: boolean;
  setSpinning: (s: boolean) => void;
}

export function Roller({ foods, winner, setWinner, spinning, setSpinning }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spin = useCallback(() => {
    if (spinning || foods.length === 0) return;

    const track = trackRef.current;
    if (!track) return;

    const winnerIdx = Math.floor(Math.random() * foods.length);
    const duration = 2.8 + Math.random() * 1.2;

    // Reset position instantly (no transition)
    track.style.transition = "none";
    track.style.transform = "translateY(0px)";

    // Force reflow
    void track.offsetHeight;

    // The track contains [foods × 5]. We land on the winner in the 3rd copy.
    // offset = (2 * foods.length + winnerIdx) * ITEM_H — centers winner in viewport
    const centeringOffset = Math.floor((VISIBLE - 1) / 2) * ITEM_H;
    const finalOffset = (2 * foods.length + winnerIdx) * ITEM_H - centeringOffset;

    setSpinning(true);
    setWinner("");

    // Animate
    requestAnimationFrame(() => {
      track.style.transition = `transform ${duration}s cubic-bezier(0.12, 0.8, 0.25, 1)`;
      track.style.transform = `translateY(-${finalOffset}px)`;
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSpinning(false);
      setWinner(foods[winnerIdx]);
    }, duration * 1000 + 100);
  }, [foods, spinning, setSpinning, setWinner]);

  if (foods.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: "var(--text-secondary)" }}>
        <p className="text-4xl mb-3">🍽️</p>
        <p className="text-sm">Add some foods to get started!</p>
      </div>
    );
  }

  // Build track: 5 copies for long spin effect
  const track = [...foods, ...foods, ...foods, ...foods, ...foods];

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Slot viewport */}
      <div className="relative w-full max-w-xs">
        {/* Selection highlight */}
        <div
          className="absolute left-0 right-0 rounded-xl z-10 pointer-events-none"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            height: ITEM_H,
            background: "rgba(204, 120, 92, 0.08)",
            border: "2px solid rgba(204, 120, 92, 0.3)",
          }}
        />
        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 z-10 pointer-events-none rounded-t-2xl"
          style={{
            height: ITEM_H * 2,
            background: "linear-gradient(to bottom, var(--surface) 0%, transparent 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none rounded-b-2xl"
          style={{
            height: ITEM_H * 2,
            background: "linear-gradient(to top, var(--surface) 0%, transparent 100%)",
          }}
        />

        {/* Viewport */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            height: VIEWPORT_H,
            border: "1px solid var(--border)",
            background: "var(--bg)",
          }}
        >
          <div ref={trackRef} style={{ willChange: "transform" }}>
            {track.map((food, i) => (
              <div
                key={i}
                className="flex items-center justify-center font-medium text-base select-none"
                style={{
                  height: ITEM_H,
                  color: "var(--text-primary)",
                }}
              >
                {food}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning || foods.length < 2}
        className="px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: spinning ? "var(--border)" : "var(--accent)",
          color: spinning ? "var(--text-secondary)" : "#ffffff",
          boxShadow: spinning ? "none" : "0 2px 8px rgba(204,120,92,0.35)",
        }}
      >
        {spinning ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
            Spinning…
          </span>
        ) : winner ? (
          "Spin Again ↻"
        ) : (
          "Spin 🎲"
        )}
      </button>

      {foods.length < 2 && (
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Add at least 2 foods to spin
        </p>
      )}
    </div>
  );
}
