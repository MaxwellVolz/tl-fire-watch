import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--muted)] text-[var(--muted-foreground)]",
        high: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
        fire: "bg-fire-100 text-fire-800 dark:bg-fire-900/30 dark:text-fire-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
