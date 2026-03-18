import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { startOfWeek, endOfWeek, isWithinInterval, subDays } from "date-fns";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawWorkouts = await prisma.workout.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    // Compute stats inline — no shared lib import needed
    if (rawWorkouts.length === 0) {
      return NextResponse.json({
        stats: {
          currentStreak: 0,
          workoutsThisWeek: 0,
          mostFrequentActivity: null,
          totalWorkoutMinutes: 0,
        },
      });
    }

    const totalWorkoutMinutes = rawWorkouts.reduce(
      (sum, w) => sum + w.durationMins,
      0,
    );

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const workoutsThisWeek = rawWorkouts.filter((w) =>
      isWithinInterval(w.date, { start: weekStart, end: weekEnd }),
    ).length;

    const activityCount = rawWorkouts.reduce<Record<string, number>>(
      (acc, w) => {
        acc[w.activityType] = (acc[w.activityType] || 0) + 1;
        return acc;
      },
      {},
    );
    const mostFrequentActivity =
      Object.entries(activityCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    // Streak
    const workoutDays = new Set(
      rawWorkouts.map((w) => w.date.toISOString().split("T")[0]),
    );

    let streak = 0;
    let checkDate = new Date();
    if (!workoutDays.has(checkDate.toISOString().split("T")[0])) {
      checkDate = subDays(checkDate, 1);
    }
    while (workoutDays.has(checkDate.toISOString().split("T")[0])) {
      streak++;
      checkDate = subDays(checkDate, 1);
    }

    return NextResponse.json({
      stats: {
        currentStreak: streak,
        workoutsThisWeek,
        mostFrequentActivity,
        totalWorkoutMinutes,
      },
    });
  } catch (error) {
    console.error("[/api/stats] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
