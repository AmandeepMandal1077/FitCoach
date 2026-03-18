"use client";

import { useState } from "react";
import { ActivityType } from "@/types";

const ACTIVITIES: ActivityType[] = [
  "Running",
  "Yoga",
  "Cycling",
  "Gym",
  "Swimming",
  "HIIT",
  "Walking",
  "Pilates",
];

interface Props {
  onWorkoutAdded: () => void;
  addWorkout: (payload: {
    activityType: string;
    durationMins: number;
    date: string;
  }) => Promise<unknown>;
}

export function WorkoutForm({ onWorkoutAdded, addWorkout }: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    activityType: "Running" as ActivityType,
    durationMins: 30,
    date: today,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setSuccess(false);

    try {
      await addWorkout(form);
      setSuccess(true);
      setForm({ activityType: "Running", durationMins: 30, date: today });
      onWorkoutAdded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Activity</label>
        <select
          value={form.activityType}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              activityType: e.target.value as ActivityType,
            }))
          }
          className="w-full border border-input bg-background rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        >
          {ACTIVITIES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Duration (minutes)
        </label>
        <input
          type="number"
          min={1}
          max={480}
          value={form.durationMins}
          onChange={(e) =>
            setForm((f) => ({ ...f, durationMins: Number(e.target.value) }))
          }
          className="w-full border border-input bg-background rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={form.date}
          max={today}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className="w-full border border-input bg-background rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          required
        />
      </div>

      {error && <p className="text-destructive text-sm font-medium">{error}</p>}
      {success && <p className="text-green-600 text-sm font-medium">✓ Workout logged!</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground shadow-sm py-2 rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Logging..." : "Log Workout"}
      </button>
    </form>
  );
}
