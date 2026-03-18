"use client";

import { useState, useEffect } from "react";
import { WorkoutForm } from "@/components/WorkoutForm";
import { WorkoutList } from "@/components/WorkoutList";
import { StatsDashboard } from "@/components/StatsDashboard";
import { MotivationCard } from "@/components/MotivationCard";
import { ChatWidget } from "@/components/ChatWidget";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DashboardClient() {
  const router = useRouter();
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);
  const [authChecked, setAuthChecked] = useState(false);
  const { workouts, isLoading, addWorkout } = useWorkouts();

  // Auth guard on the client side
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login");
      } else {
        setAuthChecked(true);
      }
    });
  }, [router]);

  if (!authChecked) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const handleWorkoutAdded = () => {
    setStatsRefreshTrigger((n) => n + 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">FitCoach AI 🏅</h1>

      <StatsDashboard refreshTrigger={statsRefreshTrigger} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4">Log a Workout</h2>
            <WorkoutForm
              addWorkout={addWorkout}
              onWorkoutAdded={handleWorkoutAdded}
            />
          </div>
          <MotivationCard />
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4">Activity History</h2>
          <WorkoutList workouts={workouts} isLoading={isLoading} />
        </div>

        <ChatWidget />
      </div>
    </div>
  );
}
