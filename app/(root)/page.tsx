"use client";
import FadeIn from "@/components/animations/FadeIn";
import Header from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Tag, Target } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    document.title = "TodoApp - Organize Your Tasks with Tags";
  }, []);

  const features = [
    {
      icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
      title: "Task Management",
      description:
        "Create, organize, and track your tasks effortlessly with our intuitive interface.",
    },
    {
      icon: <Tag className="h-6 w-6 text-primary" />,
      title: "Smart Tagging",
      description:
        "Categorize tasks with custom tags for better organization and quick access.",
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Goal Tracking",
      description:
        "Set goals, track progress, and celebrate your achievements.",
    },
  ];

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 md:px-6 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn direction="up" delay={100}>
            <h1 className="text-4xl font-bold tracking-tight mb-4 md:text-5xl">
              Organize Your Tasks with{" "}
              <span className="text-primary">TodoApp</span>
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={150}>
            <p className="text-xl text-muted-foreground mb-8">
              The smart way to manage tasks, track progress, and boost
              productivity with intelligent tagging.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <FadeIn
              key={feature.title}
              direction="up"
              delay={250 + index * 50}
              className="relative"
            >
              <div className="bg-card p-6 rounded-xl border hover:border-primary/50 transition-all duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </main>
    </>
  );
}
