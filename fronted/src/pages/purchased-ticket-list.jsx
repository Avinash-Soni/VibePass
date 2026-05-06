"use strict";

import * as React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router";
import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listTickets } from "@/lib/api";
import {
  AlertCircle,
  DollarSign,
  Tag,
  Ticket,
  ChevronRight,
  Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";

const PurchasedTicketList = () => {
  const { isLoading, token } = useAuth();

  const [tickets, setTickets] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isLoading || !token) return;

    const fetchTickets = async () => {
      try {
        const data = await listTickets(token, page);
        setTickets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };

    fetchTickets();
  }, [isLoading, token, page]);

  // ✅ Status Styling
  const getStatusStyles = (status, used) => {
    if (status === "CANCELLED") {
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
    if (used) {
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  };

  // ✅ Status Label
  const getStatusLabel = (status, used) => {
    if (status === "CANCELLED") return "CANCELLED";
    return used ? "USED" : "ACTIVE";
  };

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white">
        <NavBar />
        <div className="max-w-7xl mx-auto px-6 pt-10">
          <Alert variant="destructive" className="bg-gray-900 border-red-900/50">
            <AlertCircle className="size-5" />
            <AlertTitle className="font-bold">Error Loading Tickets</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-primary/30">
      <NavBar />

      <main className="max-w-4xl mx-auto px-6 pb-20">
        {/* Header */}
        <div className="py-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Your Digital Wallet
          </h1>
          <p className="text-gray-400 mt-1 font-medium">
            Manage and view your event passes.
          </p>
        </div>

        <div className="grid gap-4">
          {tickets?.content.map((ticketItem) => (
            <Link
              key={ticketItem.id}
              to={`/dashboard/tickets/${ticketItem.id}`}
              className="group block outline-none"
            >
              <Card className="relative bg-gray-900/40 border-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-gray-900/60 group-hover:border-primary/20 group-hover:scale-[1.01] overflow-hidden">

                {/* Ticket cut effect */}
                <div className="absolute top-1/2 -left-3 size-6 bg-black rounded-full -translate-y-1/2 border border-white/5" />
                <div className="absolute top-1/2 -right-3 size-6 bg-black rounded-full -translate-y-1/2 border border-white/5" />

                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">

                    {/* Left */}
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Ticket className="size-5 text-primary" />
                      </div>

                      <div>
                        {/* ✅ Event Name */}
                        <h3 className="font-bold text-xl tracking-tight leading-none mb-1">
                          {ticketItem.eventName || "Event Name"}
                        </h3>

                        {/* ✅ Ticket Type */}
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                          {ticketItem.ticketType?.name}
                        </p>
                      </div>
                    </div>

                    {/* ✅ Status */}
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        getStatusStyles(ticketItem.status, ticketItem.used)
                      )}
                    >
                      {getStatusLabel(ticketItem.status, ticketItem.used)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-dashed border-white/10 pt-6">

                  <div className="flex items-center gap-6">
                    
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold tabular-nums">
                        ₹{ticketItem.ticketType?.price}
                      </span>
                    </div>

                    <div className="hidden sm:block h-8 w-px bg-white/5" />

                    {/* Ticket ID */}
                    <div className="flex items-center gap-2">
                      <Tag className="size-4 text-gray-500" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          Pass Reference
                        </p>
                        <p className="text-xs font-mono text-gray-400">
                          {ticketItem.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                    View Pass
                    <ChevronRight className="size-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Empty */}
          {tickets?.content.length === 0 && (
            <div className="py-24 border-2 border-dashed border-white/5 rounded-3xl text-center bg-gray-900/10">
              <div className="size-20 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Inbox className="size-10 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold">No tickets found</h3>
              <p className="text-gray-500 mt-2 mb-10 max-w-xs mx-auto">
                You haven't booked anything yet.
              </p>
              <Link to="/">
                <Button className="bg-primary text-black font-bold px-8 rounded-xl">
                  Explore Events
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {tickets && tickets.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <SimplePagination pagination={tickets} onPageChange={setPage} />
          </div>
        )}
      </main>
    </div>
  );
};

export default PurchasedTicketList; 