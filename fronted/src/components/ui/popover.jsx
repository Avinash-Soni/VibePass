"use strict";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

const Popover = ({ ...props }) => (
  <PopoverPrimitive.Root data-slot="popover" {...props} />
);

const PopoverTrigger = ({ ...props }) => (
  <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
);

const PopoverAnchor = ({ ...props }) => (
  <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
);

const PopoverContent = React.forwardRef(({ 
  className, 
  align = "center", 
  sideOffset = 8, 
  ...props 
}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      data-slot="popover-content"
      align={align}
      sideOffset={sideOffset}
      className={cn(
        // Base Styling
        "z-50 w-72 rounded-xl border border-border/60 bg-popover/95 p-4 text-popover-foreground shadow-xl outline-none backdrop-blur-md",
        // Animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100",
        // Side-based slide animations
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };