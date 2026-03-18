"use client";

import { useEffect } from "react";
import { WorkoutStats } from "@/types";
import { useStats } from "@/hooks/useStats";

interface Props {
  refreshTrigger: number; // increment to trigger a refetch
}

const STAT_CARDS = (stats: WorkoutStats) => [
  { label: "Current Streak", value: `${stats.currentStreak} 🔥`, sub: "days" },
  { label: "This Week", value: stats.workoutsThisWeek, sub: "workouts" },
  {
    label: "Favorite Activity",
    value: stats.mostFrequentActivity ?? "—",
    sub: "most logged",
  },
  { label: "Total Minutes", value: stats.totalWorkoutMinutes, sub: "all time" },
];

export function StatsDashboard({ refreshTrigger }: Props) {
  const { stats, isLoading, fetchStats } = useStats();

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger, fetchStats]);

  if (isLoading && !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STAT_CARDS(stats).map((card) => (
        <div key={card.label} className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {card.label}
          </p>
          <p className="text-2xl font-bold mt-1">{card.value}</p>
          <p className="text-xs text-gray-400">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
