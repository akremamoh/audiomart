import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" }
>(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      variant === "default"
        ? "bg-primary text-primary-foreground border-transparent"
        : "bg-secondary text-secondary-foreground border-transparent",
      className,
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge }; 