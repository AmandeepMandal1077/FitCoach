# FitCoach AI 🏅

Your Personal AI Fitness Coach. Log workouts, track your progress, and get personalized AI motivation and insights to achieve your fitness goals faster.

## 🚀 Live Deployment

[View FitCoach AI Live](https://fit-coach-gamma.vercel.app/)

## 🛠 Tech Stack

- **Framework**: Next.js (App Router), React
- **Styling**: Tailwind CSS, shadcn/ui
- **Database & Auth**: Supabase
- **ORM**: Prisma
- **Language**: TypeScript

## 🧠 Design Decisions & Trade-offs

- **Color Theming**: Implemented a minimalistic black, white, and red color palette. The color combination emphasizes action and energy, fitting for a fitness application.
- **Component Modularity**: Dashboard features (Workout History, Motivation, Stats, Chat) are split into standalone, highly cohesive React components (`WorkoutList`, `MotivationCard`, etc.). This adds a slight overhead in file management but vastly improves maintainability and separation of concerns.

## ⚙️ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AmandeepMandal1077/FitCoach.git
   cd FitCoach
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup:**
   Rename `.env.example` to `.env.local` and supply your Supabase and Database details:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_postgres_connection_string
   ```

4. **Initialize Database:**
   Push the Prisma schema to your database.

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
