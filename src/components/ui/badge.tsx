import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        pending: "border-transparent bg-status-pending-bg text-status-pending font-medium",
        "in-progress": "border-transparent bg-status-in-progress-bg text-status-in-progress font-medium",
        resolved: "border-transparent bg-status-resolved-bg text-status-resolved font-medium",
        escalated: "border-transparent bg-status-escalated-bg text-status-escalated font-medium",
        low: "border-transparent bg-priority-low/10 text-priority-low font-medium",
        medium: "border-transparent bg-priority-medium/10 text-priority-medium font-medium",
        high: "border-transparent bg-priority-high/10 text-priority-high font-medium",
        student: "border-transparent bg-role-student/10 text-role-student font-medium",
        faculty: "border-transparent bg-role-faculty/10 text-role-faculty font-medium",
        admin: "border-transparent bg-role-admin/10 text-role-admin font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
