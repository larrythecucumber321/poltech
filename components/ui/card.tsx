import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={cn("p-4", className)}>{children}</div>;
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn("p-4 pt-0", className)}>{children}</div>;
}

export function CardTitle({ className, children }: CardProps) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}
