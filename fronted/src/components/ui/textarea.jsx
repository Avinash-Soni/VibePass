"use strict";

import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        // Base Layout
        "flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background transition-all duration-200",
        // Typography
        "placeholder:text-muted-foreground/60 leading-relaxed selection:bg-primary/30",
        // Interaction & Focus
        "outline-none focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 shadow-sm focus:shadow-md",
        // Scrollbar & Resizing
        "resize-y scrollbar-thin scrollbar-thumb-muted",
        // State Management
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };