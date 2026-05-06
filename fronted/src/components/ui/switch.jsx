"use strict";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-slot="switch"
    className={cn(
      "group peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 outline-none",
      "focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:ring-offset-2",
      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted/80",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "active:scale-95",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        "pointer-events-none block size-5 rounded-full bg-background shadow-md ring-0 transition-all duration-300 ease-in-out",
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        "group-active:w-6" // Elongates the thumb slightly while clicking for a "squishy" feel
      )}
    />
  </SwitchPrimitive.Root>
));

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };