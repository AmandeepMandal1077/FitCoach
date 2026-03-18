export type ActivityType =
  | "Running"
  | "Yoga"
  | "Cycling"
  | "Gym"
  | "Swimming"
  | "HIIT"
  | "Walking"
  | "Pilates";

export interface Workout {
  id: string;
  userId: string;
  activityType: ActivityType;
  durationMins: number;
  date: string; // ISO string
  createdAt: string;
}

export interface WorkoutStats {
  currentStreak: number;
  workoutsThisWeek: number;
  mostFrequentActivity: string | null;
  totalWorkoutMinutes: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export type CoachTone = "tough" | "friendly" | "data";
