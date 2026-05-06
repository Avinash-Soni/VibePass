"use strict";

import * as React from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SimplePagination = ({
  pagination,
  onPageChange,
  className
}) => {
  if (!pagination) return null;

  const currentPage = pagination.number;
  const totalPages = pagination.totalPages;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-lg cursor-pointer transition-all hover:border-primary/50 disabled:opacity-30"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={pagination.first}
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Previous Page</span>
      </Button>

      {/* Page Indicator */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 shadow-inner">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-tighter">
          Page
        </span>
        <span className="text-sm font-bold tabular-nums text-white">
          {currentPage + 1}
        </span>
        <span className="text-xs font-medium text-muted-foreground/60">
          of
        </span>
        <span className="text-sm font-bold tabular-nums text-white">
          {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-lg cursor-pointer transition-all hover:border-primary/50 disabled:opacity-30"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={pagination.last}
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  );
}

export { SimplePagination };