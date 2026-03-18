import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  subDays,
  differenceInCalendarDays,
} from "date-fns";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type CoachTone = "tough" | "friendly" | "data";

function buildPrompt(
  stats: {
    currentStreak: number;
    workoutsThisWeek: number;
    mostFrequentActivity: string | null;
    totalWorkoutMinutes: number;
  },
  daysSinceLastWorkout: number,
  longestGap: number,
  recentActivities: string,
  tone: CoachTone,
): string {
  const toneInstructions = {
    tough: `You are a tough, no-nonsense drill sergeant coach. Be direct, intense, and push them hard. Use short punchy sentences. No fluff.`,
    friendly: `You are an enthusiastic, warm, supportive friend who also happens to be a fitness coach. Be encouraging and positive.`,
    data: `You are a data-driven analytical coach. Reference specific numbers and patterns. Speak like a scientist who loves fitness.`,
  };

  return `${toneInstructions[tone]}

Here is the user's actual workout data:
- Current streak: ${stats.currentStreak} days
- Workouts this week: ${stats.workoutsThisWeek}
- Most frequent activity: ${stats.mostFrequentActivity ?? "none yet"}
- Total workout minutes logged: ${stats.totalWorkoutMinutes}
- Days since last workout: ${daysSinceLastWorkout}
- Longest gap between workouts ever: ${longestGap} days
- Recent workouts: ${recentActivities || "none yet"}

Write a personalized motivational message (2-4 sentences) that:
1. References at least 2-3 specific data points from above
2. Acknowledges their current momentum or lack thereof
3. Gives a concrete, actionable next step based on their patterns
4. Matches your assigned coaching tone exactly

DO NOT write generic platitudes. Every sentence must be grounded in their actual data.`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const tone: CoachTone = body.tone ?? "friendly";

    const rawWorkouts = await prisma.workout.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    // Compute stats inline
    const now = new Date();
    const totalWorkoutMinutes = rawWorkouts.reduce(
      (sum, w) => sum + w.durationMins,
      0,
    );
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

    const daysSinceLastWorkout =
      rawWorkouts.length > 0
        ? differenceInCalendarDays(now, rawWorkouts[0].date)
        : 999;

    let longestGap = 0;
    for (let i = 0; i < rawWorkouts.length - 1; i++) {
      const gap = differenceInCalendarDays(
        rawWorkouts[i].date,
        rawWorkouts[i + 1].date,
      );
      if (gap > longestGap) longestGap = gap;
    }

    const recentActivities = rawWorkouts
      .slice(0, 5)
      .map((w) => `${w.activityType} (${w.durationMins} mins)`)
      .join(", ");

    const prompt = buildPrompt(
      {
        currentStreak: streak,
        workoutsThisWeek,
        mostFrequentActivity,
        totalWorkoutMinutes,
      },
      daysSinceLastWorkout,
      longestGap,
      recentActivities,
      tone,
    );

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const motivationText = result.response.text();

    return NextResponse.json({ motivation: motivationText });
  } catch (error) {
    console.error("[POST /api/motivation] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
