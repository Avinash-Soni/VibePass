"use strict";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    className={cn(
      // Typography & Layout
      "text-sm font-semibold leading-none tracking-tight select-none",
      "flex items-center gap-2 mb-1.5 transition-colors duration-200",
      // Interaction & Peer States
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
      "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-60",
      "hover:text-foreground/90",
      className
    )}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };