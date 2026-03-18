"use client";

import { useState } from "react";
import { CoachTone } from "@/types";

const TONES: { value: CoachTone; label: string; emoji: string }[] = [
  { value: "tough", label: "Tough Coach", emoji: "💪" },
  { value: "friendly", label: "Friendly Buddy", emoji: "😊" },
  { value: "data", label: "Data Nerd", emoji: "📊" },
];

export function MotivationCard() {
  const [tone, setTone] = useState<CoachTone>("friendly");
  const [motivation, setMotivation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMotivation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/motivation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone }),
      });

      if (!res.ok) throw new Error("Failed to get motivation");
      const data = await res.json();
      setMotivation(data.motivation);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground border shadow-sm rounded-xl p-6 space-y-4">
      <h2 className="font-semibold text-lg">AI Motivation</h2>

      <div className="flex gap-2">
        {TONES.map((t) => (
          <button
            key={t.value}
            onClick={() => setTone(t.value)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
              tone === t.value
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "border-border text-foreground hover:border-primary/50 bg-background"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <button
        onClick={fetchMotivation}
        disabled={isLoading}
        className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:bg-primary/90 disabled:opacity-50 shadow-sm"
      >
        {isLoading ? "Getting your message..." : "Get AI Motivation"}
      </button>

      {error && <p className="text-destructive text-sm font-medium">{error}</p>}

      {motivation && (
        <div className="bg-secondary text-secondary-foreground rounded-lg p-4 text-sm leading-relaxed border-l-4 border-primary mt-4">
          {motivation}
        </div>
      )}
    </div>
  );
}
