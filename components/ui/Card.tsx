"use client";

import React from "react";
import Link from "next/link";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  href?: string;
  accent?: "cyan" | "magenta" | "lime" | "default";
  padding?: "sm" | "md" | "lg";
};

const pad = {
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-6",
} as const;

export function Card({
  asChild,
  href,
  accent = "default",
  padding = "md",
  className = "",
  children,
  ...rest
}: CardProps) {
  const base = `card-surface ${pad[padding]} transition-transform duration-200`;
  const accentShadow =
    accent === "cyan"
      ? "shadow-[var(--shadow-neon-cyan)]"
      : accent === "magenta"
      ? "shadow-[var(--shadow-neon-magenta)]"
      : "";
  const classes = `${base} ${accentShadow} ${className}`.trim();

  const content = (
    <div className={classes} {...rest}>
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

export default Card;
