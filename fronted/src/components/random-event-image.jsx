"use strict";

import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const RandomEventImage = ({ className }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Generate random index between 1 and 5
    const randomIndex = Math.floor(Math.random() * 5) + 1;
    setImageSrc(`/event-image-${randomIndex}.webp`);
  }, []);

  return (
    <div className={cn("relative size-full overflow-hidden bg-gray-800", className)}>
      {/* Skeleton / Placeholder Pulse */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-800 to-gray-900" />
      )}
      
      <img
        src={imageSrc}
        alt="Event background"
        draggable="false"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "size-full object-cover transition-all duration-700 ease-out",
          // Zoom effect on parent hover (requires 'group' class on parent)
          "group-hover:scale-110 group-hover:rotate-1",
          isLoaded ? "opacity-100 " : "opacity-0"
        )}
      />
    </div>
  );
};

export default RandomEventImage;