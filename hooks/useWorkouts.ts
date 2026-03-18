"use client";

import { useState, useEffect, useCallback } from "react";
import { Workout } from "@/types";

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/workouts");
      if (!res.ok) throw new Error("Failed to fetch workouts");
      const data = await res.json();
      setWorkouts(data.workouts);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addWorkout = useCallback(
    async (payload: {
      activityType: string;
      durationMins: number;
      date: string;
    }) => {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to log workout");
      }

      const data = await res.json();
      setWorkouts((prev) => [data.workout, ...prev]);
      return data.workout as Workout;
    },
    [],
  );

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { workouts, isLoading, error, addWorkout, refetch: fetchWorkouts };
}
