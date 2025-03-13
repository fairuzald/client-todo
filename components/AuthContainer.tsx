import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import FadeIn from "./animations/FadeIn";

interface AuthContainerProps {
  children: ReactNode;
  title: string;
  description: string;
  footer?: ReactNode;
}

export function AuthContainer({
  children,
  title,
  description,
  footer,
}: AuthContainerProps) {
  return (
    <>
      <FadeIn direction="down" delay={150}>
        <h1 className="text-2xl font-bold tracking-tight mb-2">{title}</h1>
      </FadeIn>
      <FadeIn direction="down" delay={200}>
        <p className="text-muted-foreground text-sm mb-8">{description}</p>
      </FadeIn>

      <FadeIn delay={250}>
        <div
          className={cn(
            "p-6 rounded-xl border border-border bg-card shadow-subtle"
          )}
        >
          {children}
        </div>
      </FadeIn>

      {footer && (
        <FadeIn delay={300}>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        </FadeIn>
      )}
    </>
  );
}
