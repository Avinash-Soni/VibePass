"use strict";

import * as React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router";
import { format } from "date-fns";
import {
  Calendar,
  DollarSign,
  MapPin,
  Tag,
  ShieldCheck,
  Info
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
          getTicketQr(token, id)
        ]);

        setTicket(ticketDetails);
        setQrCodeUrl(URL.createObjectURL(qrBlob));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ticket");
      } finally {
        setIsQrCodeLoading(false);
      }
    };

    fetchTicketData();

    return () => {
      if (qrCodeUrl) URL.revokeObjectURL(qrCodeUrl);
    };
  }, [token, isAuthLoading, id]);

  // ✅ Status Logic
  const getStatusConfig = (status, used) => {
    if (status === "CANCELLED") {
      return {
        label: "VOID / CANCELLED",
        color: "text-rose-400",
        bg: "bg-rose-500/10"
      };
    }

    if (used) {
      return {
        label: "ALREADY USED",
        color: "text-gray-400",
        bg: "bg-gray-500/10"
      };
    }

    return {
      label: "ACTIVE PASS",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    };
  };

  if (!ticket && !error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="size-12 rounded-full border-t-2 border-primary animate-spin" />
      </div>
    );
  }

  const status = getStatusConfig(ticket?.status, ticket?.used);

  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* 🎟 Ticket Card */}
        <div
          className={cn(
            "relative overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10 transition-all",

            // 🎨 Normal
            !ticket?.used && "bg-gradient-to-b from-indigo-600 to-purple-900",

            // ⚫ Used → black & white
            ticket?.used && "bg-gray-900 grayscale opacity-70"
          )}
        >
          {/* Glow */}
          {!ticket?.used && (
            <div className="absolute -top-24 -right-24 size-48 bg-primary/20 blur-[80px] rounded-full" />
          )}

          {/* 🔥 USED Overlay */}
          {ticket?.used && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="text-5xl font-black text-white/10 rotate-[-20deg] tracking-widest">
                USED
              </div>
            </div>
          )}

          <div className={cn("p-8 relative z-10", ticket?.used && "opacity-80")}>

            {/* Status */}
            <div className={cn("flex justify-center gap-2 py-2 rounded-full mb-8 border border-white/5", status.bg)}>
              <ShieldCheck className={cn("size-4", status.color)} />
              <span className={cn("text-[10px] font-black uppercase", status.color)}>
                {status.label}
              </span>
            </div>

            {/* Event */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black">
                {ticket.eventName}
              </h1>
              <div className="flex justify-center gap-2 text-sm text-gray-300">
                <MapPin className="size-3" />
                {ticket.eventVenue}
              </div>
            </div>

            {/* QR */}
            <div className="flex justify-center mb-8">
              <div className="bg-white p-4 rounded-2xl">

                {ticket?.used ? (
                  <div className="text-center text-gray-500 text-xs font-bold">
                    PASS ALREADY USED
                  </div>
                ) : isQrLoading ? (
                  <div className="text-center text-xs">Loading QR...</div>
                ) : error ? (
                  <div className="text-center text-rose-500 text-xs">{error}</div>
                ) : (
                  <img src={qrCodeUrl} className="size-48 object-contain" />
                )}

              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-black/20 p-4 rounded-xl">
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Date</p>
                <p className="text-xs font-bold">
                  {format(new Date(ticket.eventStart), "MMM d, h:mm a")}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase">Type</p>
                <p className="text-xs font-bold">{ticket.description}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center border-t border-dashed pt-6">
              <div className="flex justify-center gap-2">
                <span className="text-xl font-bold">₹{ticket.price}</span>
              </div>

              <p className="text-[10px] text-gray-500 mt-2">{ticket.id}</p>
            </div>
          </div>

          {/* Notches */}
          <div className="absolute top-[70%] -left-4 size-8 bg-black rounded-full" />
          <div className="absolute top-[70%] -right-4 size-8 bg-black rounded-full" />
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Powered by VibePass
        </p>
      </div>
    </div>
  );
};

export default ViewTicketPage;