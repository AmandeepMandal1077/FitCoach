import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      <header className="px-6 h-16 flex items-center justify-between border-b border-border bg-card">
        <Link className="flex items-center justify-center font-bold text-xl tracking-tight" href="/">
          FitCoach <span className="text-primary ml-1">AI</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <div>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full py-20 lg:py-32 xl:py-40 flex flex-col items-center text-center px-4 md:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter max-w-4xl mx-auto mb-6 leading-tight">
            Your Personal AI <br className="hidden sm:block" />
            <span className="text-primary">Fitness Coach</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed mb-10">
            Log workouts, track your progress, and get personalized AI motivation and insights. Achieve your fitness goals faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 py-2 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors w-full sm:w-auto"
            >
              Get Started Now
            </Link>
            <Link
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors w-full sm:w-auto"
            >
              Learn More
            </Link>
          </div>
        </section>
        
        <section id="features" className="w-full py-20 bg-muted/40 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12">
              Everything you need to succeed
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-card border border-border/80 shadow-md hover:shadow-lg transition-shadow rounded-xl">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4 text-3xl">
                  📊
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Tracking</h3>
                <p className="text-muted-foreground">Easily log your activities and monitor your streak, total duration, and favorite exercises.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card border border-border/80 shadow-md hover:shadow-lg transition-shadow rounded-xl">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4 text-3xl">
                  🧠
                </div>
                <h3 className="text-xl font-bold mb-2">AI Motivation</h3>
                <p className="text-muted-foreground">Choose from different coaching tones to get the right push you need before or after your workout.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card border border-border/80 shadow-md hover:shadow-lg transition-shadow rounded-xl">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4 text-3xl">
                  💬
                </div>
                <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">Ask questions about nutrition, recovery, or training and get instant intelligent answers.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-8 text-center border-t border-border mt-auto bg-card">
        <p className="text-sm text-muted-foreground">
          © 2026 FitCoach AI. Designed for performance.
        </p>
      </footer>
    </div>
  );
}
