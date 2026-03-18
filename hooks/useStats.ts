"use client";

import { useState, useCallback } from "react";
import { WorkoutStats } from "@/types";

export function useStats() {
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data.stats);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { stats, isLoading, fetchStats };
}
