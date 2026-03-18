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
        router.replace("/auth/login");
      } else {
        setAuthChecked(true);
      }
    });
  }, [router]);

  if (!authChecked) {
    return (
      <div className="w-full px-4 sm:px-8 py-8 space-y-8 max-w-none">
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
    <div className="w-full px-4 sm:px-8 py-8 space-y-8 max-w-none flex flex-col flex-1">
      <StatsDashboard refreshTrigger={statsRefreshTrigger} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Workout Form & AI Motivation */}
        <div className="flex flex-col gap-6">
          <div className="bg-card text-card-foreground border shadow-sm rounded-xl p-6 shrink-0">
            <h2 className="font-semibold text-lg mb-4">Log a Workout</h2>
            <WorkoutForm
              addWorkout={addWorkout}
              onWorkoutAdded={handleWorkoutAdded}
            />
          </div>
          <div className="shrink-0">
            <MotivationCard />
          </div>
        </div>

        {/* Column 2: Activity History */}
        <div className="relative w-full h-[500px] lg:h-full">
          <div className="h-full w-full lg:absolute lg:inset-0 bg-card text-card-foreground border shadow-sm rounded-xl p-6 flex flex-col overflow-hidden">
            <h2 className="font-semibold text-lg mb-4 shrink-0">Activity History</h2>
            <div className="overflow-y-auto flex-1 pr-2 space-y-2">
              <WorkoutList workouts={workouts} isLoading={isLoading} />
            </div>
          </div>
        </div>

        {/* Column 3: AI Chat */}
        <div className="relative w-full h-[500px] lg:h-full">
          <div className="h-full w-full lg:absolute lg:inset-0 flex flex-col overflow-hidden rounded-xl border shadow-sm">
            <ChatWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
