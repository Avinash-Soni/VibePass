"use strict";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router";

import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { listTickets } from "@/lib/api";

import {
  AlertCircle,
  Ticket,
  ChevronRight,
  Inbox,
  CalendarDays,
  Circle,
  Sparkles,
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
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred"
        );
      }
    };

    fetchTickets();
  }, [isLoading, token, page]);

  const getStatusStyles = (status, used) => {
    if (status === "CANCELLED") {
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }

    if (used) {
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }

    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  };

  const getStatusLabel = (status, used) => {
    if (status === "CANCELLED") return "Cancelled";
    return used ? "Used" : "Active";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <NavBar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <Alert className="bg-rose-500/10 border border-rose-500/20 rounded-2xl text-white">
            <AlertCircle className="size-5 text-rose-400" />

            <AlertTitle className="font-bold">
              Error Loading Tickets
            </AlertTitle>

            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white selection:bg-primary/30">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:55px_55px]" />

        {/* GLOW */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/20 blur-[180px] rounded-full animate-pulse" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-500/10 blur-[160px] rounded-full" />

        {/* FLOATING LIGHTS */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-pulse"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <NavBar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="py-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-xl px-5 py-2 text-sm text-primary mb-6 shadow-lg shadow-primary/10">
              <Sparkles className="size-4" />
              Your premium event access
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              My Tickets
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              All your purchased event passes in one place.
            </p>
          </div>

          <Link to="/">
            <Button className="h-12 rounded-2xl px-8 font-black bg-primary hover:bg-primary/90 text-black shadow-[0_0_40px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-[1.03]">
              Explore Events
            </Button>
          </Link>
        </motion.div>

        {/* TICKET GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {tickets?.content.map((ticketItem, index) => (
            <motion.div
              key={ticketItem.id}
              initial={{ opacity: 0, y: 70, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
            >
              <Link
                to={`/dashboard/tickets/${ticketItem.id}`}
                className="group block"
              >
                <Card className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.05] hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)]">

                  {/* HOVER GLOW */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />

                  {/* TOP BAR */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

                  {/* CUT EFFECT */}
                  <div className="absolute top-1/2 -left-3 size-6 rounded-full bg-[#020617] border border-white/10 -translate-y-1/2" />
                  <div className="absolute top-1/2 -right-3 size-6 rounded-full bg-[#020617] border border-white/10 -translate-y-1/2" />

                  <CardContent className="p-6 relative z-10">

                    {/* TOP */}
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex gap-4">

                        {/* ICON */}
                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                        >
                          <Ticket className="size-6 text-primary" />
                        </motion.div>

                        {/* TITLE */}
                        <div>
                          <h2 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">
                            {ticketItem.eventName || "Event Name"}
                          </h2>

                          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 font-bold mt-2">
                            {ticketItem.ticketType?.name}
                          </p>
                        </div>
                      </div>

                      {/* STATUS */}
                      <div
                        className={cn(
                          "px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 backdrop-blur-xl",
                          getStatusStyles(
                            ticketItem.status,
                            ticketItem.used
                          )
                        )}
                      >
                        {!ticketItem.used &&
                          ticketItem.status !== "CANCELLED" && (
                            <Circle className="size-2 fill-current animate-pulse" />
                          )}

                        {getStatusLabel(
                          ticketItem.status,
                          ticketItem.used
                        )}
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="mt-8 grid grid-cols-2 gap-4">

                      {/* PRICE */}
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-xl"
                      >
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                          Price
                        </p>

                        <h3 className="text-2xl font-black text-primary">
                          ₹{ticketItem.ticketType?.price}
                        </h3>
                      </motion.div>

                      {/* PASS ID */}
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-xl"
                      >
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                          Pass ID
                        </p>

                        <p className="text-xs text-gray-300 font-mono break-all">
                          {ticketItem.id}
                        </p>
                      </motion.div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-6 pt-5 border-t border-dashed border-white/10 flex items-center justify-between">

                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <CalendarDays className="size-4" />

                        <span>
                          Digital Event Pass
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform duration-300">
                        View Ticket

                        <ChevronRight className="size-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}

          {/* EMPTY */}
          {tickets?.content.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="col-span-full py-28 border border-dashed border-white/10 rounded-[40px] bg-white/[0.02] text-center"
            >

              <div className="size-24 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Inbox className="size-12 text-gray-600" />
              </div>

              <h2 className="text-3xl font-black">
                No Tickets Yet
              </h2>

              <p className="text-gray-500 mt-3 max-w-sm mx-auto">
                You haven’t booked any events yet.
                Start exploring amazing experiences.
              </p>

              <Link to="/">
                <Button className="mt-8 h-12 px-8 rounded-2xl font-black bg-white text-black hover:bg-gray-200 transition-all duration-300 hover:scale-[1.03]">
                  Explore Events
                </Button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* PAGINATION */}
        {tickets && tickets.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mt-14"
          >
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-2 backdrop-blur-xl">
              <SimplePagination
                pagination={tickets}
                onPageChange={setPage}
              />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PurchasedTicketList;