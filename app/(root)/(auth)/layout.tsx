import FadeIn from "@/components/animations/FadeIn";
import { CheckSquare } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <FadeIn direction="down" delay={100}>
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <CheckSquare className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                TodoApp
              </span>
            </Link>
          </FadeIn>
        </div>
        {children}
      </div>
    </div>
  );
}
