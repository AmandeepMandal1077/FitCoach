import { Workout, WorkoutStats } from "@/types";
import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  parseISO,
  subDays,
} from "date-fns";

export function computeStats(workouts: Workout[]): WorkoutStats {
  if (workouts.length === 0) {
    return {
      currentStreak: 0,
      workoutsThisWeek: 0,
      mostFrequentActivity: null,
      totalWorkoutMinutes: 0,
    };
  }

  const sorted = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Total minutes
  const totalWorkoutMinutes = workouts.reduce(
    (sum, w) => sum + w.durationMins,
    0,
  );

  // Workouts this week
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const workoutsThisWeek = workouts.filter((w) =>
    isWithinInterval(parseISO(w.date), { start: weekStart, end: weekEnd }),
  ).length;

  // Most frequent activity
  const activityCount = workouts.reduce<Record<string, number>>((acc, w) => {
    acc[w.activityType] = (acc[w.activityType] || 0) + 1;
    return acc;
  }, {});
  const mostFrequentActivity =
    Object.entries(activityCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Current streak
  const workoutDays = new Set(
    sorted.map((w) => w.date.split("T")[0]), // YYYY-MM-DD
  );

  let streak = 0;
  let checkDate = new Date();

  // Allow streak to include today OR yesterday (don't break if user hasn't logged today yet)
  if (!workoutDays.has(checkDate.toISOString().split("T")[0])) {
    checkDate = subDays(checkDate, 1);
  }

  while (workoutDays.has(checkDate.toISOString().split("T")[0])) {
    streak++;
    checkDate = subDays(checkDate, 1);
  }

  return {
    currentStreak: streak,
    workoutsThisWeek,
    mostFrequentActivity,
    totalWorkoutMinutes,
  };
}

/** Returns gap info for AI context */
export function getActivityGaps(workouts: Workout[]): {
  daysSinceLastWorkout: number;
  longestGap: number;
} {
  if (workouts.length === 0)
    return { daysSinceLastWorkout: 999, longestGap: 0 };

  const sorted = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const daysSinceLastWorkout = differenceInCalendarDays(
    new Date(),
    parseISO(sorted[0].date),
  );

  let longestGap = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = differenceInCalendarDays(
      parseISO(sorted[i].date),
      parseISO(sorted[i + 1].date),
    );
    if (gap > longestGap) longestGap = gap;
  }

  return { daysSinceLastWorkout, longestGap };
}
