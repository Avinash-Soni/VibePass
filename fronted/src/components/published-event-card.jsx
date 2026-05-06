"use strict";

import * as React from "react";
import { Card } from "./ui/card";
import { Calendar, Heart, MapPin, Share2, Ticket } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";
import { cn } from "@/lib/utils";

const PublishedEventCard = ({ publishedEvent }) => {
  return (
    <Link to={`/events/${publishedEvent.id}`} className="block group">
      <Card className="p-0 overflow-hidden max-w-[280px] border-white/5 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/10 group-hover:border-primary/20">
        {/* Card Image Container */}
        <div className="relative h-[160px] w-full overflow-hidden">
          <RandomEventImage />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
          
          {/* Featured Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary/90 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-lg">
            <Ticket className="size-3 text-primary-foreground" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              Live Tickets
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col gap-3">
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {publishedEvent.name}
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <MapPin className="size-3.5 text-primary/70" />
              <span className="truncate">{publishedEvent.venue}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <Calendar className="size-3.5 text-primary/70" />
              {publishedEvent.start && publishedEvent.end ? (
                <span className="truncate">
                  {format(new Date(publishedEvent.start), "MMM d")} - {format(new Date(publishedEvent.end), "MMM d, yyyy")}
                </span>
              ) : (
                <span className="italic opacity-60">Dates to be announced</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-white/5 mt-auto">
          <button 
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer group/btn"
            onClick={(e) => { e.preventDefault(); /* Add like logic */ }}
          >
            <Heart className="size-4 group-hover/btn:fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Like</span>
          </button>
          
          <button 
            className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-colors cursor-pointer"
            onClick={(e) => { e.preventDefault(); /* Add share logic */ }}
          >
            <Share2 className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Share</span>
          </button>
        </div>
      </Card>
    </Link>
  );
};

export default PublishedEventCard;