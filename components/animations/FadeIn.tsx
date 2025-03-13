"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  className,
  delay = 0,
  duration = 300,
  direction = "up",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getDirectionClass = () => {
    switch (direction) {
      case "up":
        return "translate-y-4";
      case "down":
        return "-translate-y-4";
      case "left":
        return "translate-x-4";
      case "right":
        return "-translate-x-4";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "transform transition-all",
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${getDirectionClass()}`,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      }}
    >
      {children}
    </div>
  );
};

export default FadeIn;
