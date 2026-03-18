"use client";

import { Workout } from "@/types";
import { format } from "date-fns";

interface Props {
  workouts: Workout[];
  isLoading: boolean;
}

export function WorkoutList({ workouts, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <p className="text-gray-400 text-center py-8">
        No workouts logged yet. Start today!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {workouts.map((w) => (
        <div
          key={w.id}
          className="flex items-center justify-between bg-white border rounded-lg px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{activityEmoji(w.activityType)}</span>
            <div>
              <p className="font-medium text-sm">{w.activityType}</p>
              <p className="text-xs text-gray-400">
                {format(new Date(w.date), "MMM d, yyyy")}
              </p>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-600">
            {w.durationMins} min
          </span>
        </div>
      ))}
    </div>
  );
}

function activityEmoji(activity: string): string {
  const map: Record<string, string> = {
    Running: "🏃",
    Yoga: "🧘",
    Cycling: "🚴",
    Gym: "🏋️",
    Swimming: "🏊",
    HIIT: "⚡",
    Walking: "🚶",
    Pilates: "🤸",
  };
  return map[activity] ?? "💪";
}
