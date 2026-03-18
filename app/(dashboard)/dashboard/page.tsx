import { Suspense } from "react";
import { DashboardClient } from "./DashboardClient";
import Link from "next/link";
import { AuthButton } from "@/components/auth-button";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-6 h-16 flex items-center justify-between border-b border-border bg-card shrink-0">
        <Link className="flex items-center justify-center font-bold text-xl tracking-tight" href="/">
          FitCoach <span className="text-primary ml-1">AI</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:block">
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>
      </header>
      
      <main className="flex-1 flex w-full">
        <Suspense
          fallback={
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
          }
        >
          <DashboardClient />
        </Suspense>
      </main>
    </div>
  );
}
