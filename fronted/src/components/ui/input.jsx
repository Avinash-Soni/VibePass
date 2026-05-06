"use strict";

import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      data-slot="input"
      className={cn(
        // Base Layout & Typography
        "flex h-10 w-full min-w-0 rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-all duration-200",
        // File Input Styling
        "file:mr-4 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-secondary-foreground hover:file:bg-secondary/80",
        // Placeholder & Selection
        "placeholder:text-muted-foreground/60 selection:bg-primary/30 selection:text-foreground",
        // Interaction & Focus States
        "outline-none focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 shadow-sm focus:shadow-md",
        // Validation & Disabled States
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };