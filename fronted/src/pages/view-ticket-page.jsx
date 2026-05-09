"use strict";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router";
import { format } from "date-fns";

import {
  MapPin,
  ShieldCheck,
  Calendar,
  Ticket,
  Sparkles,
  Circle,
} from "lucide-react";

import { getTicket, getTicketQr } from "@/lib/api";
import { cn } from "@/lib/utils";

const ViewTicketPage = () => {
  const [ticket, setTicket] = useState(undefined);
  const [qrCodeUrl, setQrCodeUrl] = useState(undefined);
  const [isQrLoading, setIsQrCodeLoading] = useState(true);
  const [error, setError] = useState(undefined);

  const { id } = useParams();
  const { isLoading: isAuthLoading, token } = useAuth();

  useEffect(() => {
    if (isAuthLoading || !token || !id) return;

    const fetchTicketData = async () => {
      try {
        setIsQrCodeLoading(true);
        setError(undefined);

        const [ticketDetails, qrBlob] = await Promise.all([
          getTicket(token, id),
          getTicketQr(token, id),
        ]);

        setTicket(ticketDetails);
        setQrCodeUrl(URL.createObjectURL(qrBlob));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load ticket"
        );
      } finally {
        setIsQrCodeLoading(false);
      }
    };

    fetchTicketData();

    return () => {
      if (qrCodeUrl) URL.revokeObjectURL(qrCodeUrl);
    };
  }, [token, isAuthLoading, id]);

  const getStatusConfig = (status, used) => {
    if (status === "CANCELLED") {
      return {
        label: "VOID / CANCELLED",
        color: "text-rose-400",
        bg: "bg-rose-500/10 border-rose-500/20",
      };
    }

    if (used) {
      return {
        label: "PASS USED",
        color: "text-gray-300",
        bg: "bg-white/5 border-white/10",
      };
    }

    return {
      label: "ACTIVE PASS",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    };
  };

  if (!ticket && !error) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center overflow-hidden">
        <div className="relative">
          <div className="size-12 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const status = getStatusConfig(ticket?.status, ticket?.used);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white flex items-center justify-center px-2 py-2">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:55px_55px]" />

        {/* GLOW */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-primary/20 blur-[130px] rounded-full animate-pulse" />

        <div className="absolute bottom-[-20%] right-[-10%] w-[320px] h-[320px] bg-purple-500/10 blur-[90px] rounded-full" />

        {/* FLOATING LIGHTS */}
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[320px]"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-[26px] border border-white/10 backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.45)]",

            !ticket?.used &&
              "bg-gradient-to-b from-[#111827]/95 via-[#1e1b4b]/95 to-[#312e81]/95",

            ticket?.used &&
              "bg-gradient-to-b from-[#111111]/95 to-[#222222]/95 grayscale opacity-80"
          )}
        >

          {/* TOP GLOW */}
          {!ticket?.used && (
            <div className="absolute -top-20 right-[-20%] w-[180px] h-[180px] bg-primary/20 blur-[70px] rounded-full" />
          )}

          {/* USED OVERLAY */}
          {ticket?.used && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="text-4xl font-black text-white/5 rotate-[-18deg] tracking-[0.3em]">
                USED
              </div>
            </div>
          )}

          {/* TOP BAR */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

          {/* CUTS */}
          <div className="absolute top-[72%] -left-4 size-7 bg-[#020617] rounded-full border border-white/10" />
          <div className="absolute top-[72%] -right-4 size-7 bg-[#020617] rounded-full border border-white/10" />

          <div className="relative z-10 p-3.5">

            {/* BADGE */}
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-xl mb-3",
                status.bg
              )}
            >
              {!ticket?.used &&
                ticket?.status !== "CANCELLED" && (
                  <Circle className={cn("size-1.5 fill-current animate-pulse", status.color)} />
                )}

              <ShieldCheck className={cn("size-3", status.color)} />

              <span
                className={cn(
                  "text-[8px] font-black uppercase tracking-[0.18em]",
                  status.color
                )}
              >
                {status.label}
              </span>
            </div>

            {/* EVENT */}
            <div className="text-center">

              <motion.div
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="mx-auto mb-3 size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.2)]"
              >
                <Ticket className="size-5 text-primary" />
              </motion.div>

              <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[9px] text-primary mb-2">
                <Sparkles className="size-2.5" />
                Digital Premium Pass
              </div>

              <h1 className="text-xl font-black leading-tight line-clamp-2">
                {ticket.eventName}
              </h1>

              <div className="flex items-center justify-center gap-1 mt-2 text-gray-300">
                <MapPin className="size-3 text-primary" />

                <span className="text-[11px] font-medium line-clamp-1">
                  {ticket.eventVenue}
                </span>
              </div>
            </div>

            {/* QR */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex justify-center"
            >
              <div className="relative bg-white rounded-[20px] p-2.5 shadow-xl">

                {/* QR GLOW */}
                <div className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-primary/20 to-purple-500/20 blur-lg opacity-40" />

                <div className="relative z-10">

                  {ticket?.used ? (
                    <div className="size-32 flex items-center justify-center text-center text-gray-500 text-[9px] font-black uppercase tracking-widest">
                      PASS USED
                    </div>
                  ) : isQrLoading ? (
                    <div className="size-32 flex items-center justify-center">
                      <div className="size-7 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    </div>
                  ) : error ? (
                    <div className="size-32 flex items-center justify-center text-center text-rose-500 text-[9px] px-4">
                      {error}
                    </div>
                  ) : (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      src={qrCodeUrl}
                      className="size-32 object-contain"
                    />
                  )}
                </div>
              </div>
            </motion.div>

            {/* INFO */}
            <div className="mt-4 grid grid-cols-2 gap-2">

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 backdrop-blur-xl">
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <Calendar className="size-3" />

                  <p className="text-[7px] uppercase tracking-widest font-black">
                    Event Date
                  </p>
                </div>

                <p className="text-[10px] font-bold leading-relaxed">
                  {format(
                    new Date(ticket.eventStart),
                    "MMM d, h:mm a"
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 backdrop-blur-xl">
                <p className="text-[7px] uppercase tracking-widest text-gray-500 font-black mb-1">
                  Ticket Type
                </p>

                <p className="text-[10px] font-bold line-clamp-2">
                  {ticket.description}
                </p>
              </div>
            </div>

            {/* PRICE */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-center backdrop-blur-xl">

              <p className="text-[7px] uppercase tracking-[0.22em] text-gray-500 font-black">
                Total Paid
              </p>

              <h2 className="text-2xl font-black mt-1 bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent">
                ₹{ticket.price}
              </h2>

              <p className="mt-1 text-[7px] text-gray-600 font-mono break-all">
                {ticket.id}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-center text-[9px] text-gray-500 uppercase tracking-[0.18em]"
        >
          Powered by VibePass
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ViewTicketPage;