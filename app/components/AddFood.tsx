"use client";

import { useState, useRef } from "react";

export function AddFood({ onAdd }: { onAdd: (name: string) => Promise<void> }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = value.trim();
    if (!name) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      await onAdd(name);
      setStatus("success");
      setValue("");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setTimeout(() => setStatus("idle"), 3000);
    }

    inputRef.current?.focus();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Nasi Goreng, Dim Sum, Pho…"
          maxLength={60}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "var(--bg)",
            border: "1.5px solid var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={!value.trim() || status === "loading"}
          className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "var(--accent)",
            color: "#fff",
          }}
        >
          {status === "loading" ? (
            <span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            "Add"
          )}
        </button>
      </div>

      {status === "success" && (
        <p className="text-xs font-medium" style={{ color: "#16a34a" }}>
          ✓ Added successfully! It&apos;s now in the spin list.
        </p>
      )}
      {status === "error" && (
        <p className="text-xs font-medium" style={{ color: "#dc2626" }}>
          ✗ {errorMsg}
        </p>
      )}
    </form>
  );
}
