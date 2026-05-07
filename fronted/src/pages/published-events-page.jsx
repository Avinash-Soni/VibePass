"use strict";

import * as React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate, useParams } from "react-router";
import {
  AlertCircle,
  MapPin,
  Ticket,
  ChevronRight,
  Calendar,
  Clock3,
  Sparkles,
} from "lucide-react";

import { format } from "date-fns";
import RandomEventImage from "@/components/random-event-image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPublishedEvent } from "@/lib/api";
import { cn } from "@/lib/utils";

const PublishedEventsPage = () => {
  const { token, isLoading: isAuthLoading, logout } = useAuth();

  const navigate = useNavigate();
  const { id } = useParams();

  const isAuthenticated = !!token;

  const [error, setError] = useState(undefined);
  const [publishedEvent, setPublishedEvent] = useState(undefined);
  const [selectedTicketType, setSelectedTicketType] = useState(undefined);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Event ID is missing from the request.");
      return;
    }

    const fetchEventDetails = async () => {
      try {
        setIsDataLoading(true);

        const eventData = await getPublishedEvent(id);

        setPublishedEvent(eventData);

        if (eventData.ticketTypes?.length > 0) {
          setSelectedTicketType(eventData.ticketTypes[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to retrieve event details."
        );
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <Alert className="max-w-md border-red-500/20 bg-red-500/10 backdrop-blur-xl">
          <AlertCircle className="size-5 text-red-500" />

          <AlertTitle className="text-white">
            Something went wrong
          </AlertTitle>

          <AlertDescription className="text-gray-300">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // LOADING
  if (isDataLoading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <div className="size-14 rounded-full border-4 border-primary/20" />

        <div className="size-14 rounded-full border-4 border-primary border-t-transparent animate-spin absolute" />

        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gray-500">
          Loading Event
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#020617] min-h-screen text-white overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="size-4 text-black" />
            </div>

            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight">
                VibePass
              </h1>

              <p className="text-[9px] text-gray-500 hidden sm:block -mt-1">
                Premium Event Access
              </p>
            </div>
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-300 hover:text-primary hover:bg-white/5 rounded-xl text-sm"
                >
                  Dashboard
                </Button>

                <Button
                  variant="outline"
                  onClick={() => logout()}
                  className="border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-primary hover:bg-primary/90 text-black font-semibold rounded-xl"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* HERO */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-14">
          
          {/* LEFT */}
          <div className="space-y-6 order-2 lg:order-1">
            
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 text-primary"
            >
              Live Event
            </Badge>

            {/* TITLE */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.1] tracking-tight">
                {publishedEvent?.name}
              </h1>
            </div>

            {/* VENUE */}
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <MapPin className="size-4 text-primary" />
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-1">
                  Venue
                </p>

                <p className="text-sm sm:text-base text-gray-300 font-medium">
                  {publishedEvent?.venue}
                </p>
              </div>
            </div>

            {/* DATE & TIME */}
            <div className="flex flex-col sm:flex-row gap-4">
              
              {/* DATE */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="size-4 text-primary" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    Date
                  </p>

                  <p className="text-sm font-medium text-gray-300">
                    {publishedEvent?.start && publishedEvent?.end
                      ? `${format(
                          new Date(publishedEvent.start),
                          "MMM d"
                        )} - ${format(
                          new Date(publishedEvent.end),
                          "MMM d, yyyy"
                        )}`
                      : "TBA"}
                  </p>
                </div>
              </div>

              {/* TIME */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock3 className="size-4 text-primary" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    Time
                  </p>

                  <p className="text-sm font-medium text-gray-300">
                    {publishedEvent?.start
                      ? format(
                          new Date(publishedEvent.start),
                          "hh:mm a"
                        )
                      : "TBA"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />

              <div className="h-[220px] sm:h-[280px] md:h-[340px] overflow-hidden">
                <RandomEventImage className="group-hover:scale-105 transition-transform duration-700" />
              </div>

              <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-xs font-semibold">
                🔥 Trending Event
              </div>
            </div>
          </div>
        </div>

        {/* TICKETS */}
        <section>
          
          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">
            <div>
              <p className="text-primary text-xs uppercase tracking-[0.25em] font-semibold mb-1">
                Tickets
              </p>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Choose Your Pass
              </h2>
            </div>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* CONTENT */}
          <div className="grid xl:grid-cols-5 gap-8">
            
            {/* LEFT */}
            <div className="xl:col-span-3 space-y-4">
              {publishedEvent?.ticketTypes?.map((ticketType) => {
                const availableTickets =
                  ticketType.remainingTickets ??
                  ticketType.totalAvailable;

                const isAvailable = availableTickets > 0;

                return (
                  <Card
                    key={ticketType.id}
                    onClick={() => setSelectedTicketType(ticketType)}
                    className={cn(
                      "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl cursor-pointer transition-all duration-300 hover:border-primary/30 hover:bg-primary/5",
                      selectedTicketType?.id === ticketType.id &&
                        "border-primary bg-primary/10 ring-1 ring-primary/30"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                            {ticketType.name}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1">
                            Premium Event Access
                          </p>
                        </div>

                        <div className="text-right">
                          <h2 className="text-2xl sm:text-3xl font-black text-primary">
                            ₹{ticketType.price}
                          </h2>

                          <p className="text-[10px] uppercase tracking-widest text-gray-500">
                            per ticket
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {ticketType.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between">
                        
                        {/* AVAILABLE */}
                        <div
                          className={cn(
                            "px-3 py-1 rounded-full text-[11px] font-semibold",
                            isAvailable
                              ? "bg-green-500/15 text-green-400 border border-green-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          )}
                        >
                          {isAvailable
                            ? `${availableTickets} Tickets Available`
                            : "Sold Out"}
                        </div>

                        {/* SELECTED */}
                        {selectedTicketType?.id === ticketType.id && (
                          <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                            Selected
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* RIGHT */}
            <div className="xl:col-span-2">
              <div className="xl:sticky xl:top-24 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
                
                {/* TOP */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Ticket className="size-4 text-primary" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                      Checkout
                    </p>

                    <h3 className="text-sm font-semibold">
                      Order Summary
                    </h3>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Selected Ticket
                    </p>

                    <h2 className="text-2xl font-black">
                      {selectedTicketType?.name}
                    </h2>

                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                      {selectedTicketType?.description}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
                      Total Price
                    </p>

                    <h1 className="text-4xl font-black text-primary">
                      ₹{selectedTicketType?.price}
                    </h1>
                  </div>

                  {/* BUTTON */}
                  <Link
                    to={`/events/${publishedEvent?.id}/purchase/${selectedTicketType?.id}`}
                    className="block"
                  >
                    <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-black text-base font-bold shadow-xl shadow-primary/20">
                      Continue Checkout
                      <ChevronRight className="size-5 ml-1" />
                    </Button>
                  </Link>

                  <p className="text-center text-[10px] uppercase tracking-[0.2em] text-gray-600 pt-2">
                    Secure checkout powered by VibePass
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// BADGE
const Badge = ({ children, className, variant }) => (
  <span
    className={cn(
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
      variant === "outline"
        ? "border-white/20 text-gray-400"
        : "bg-primary text-black border-transparent",
      className
    )}
  >
    {children}
  </span>
);

export default PublishedEventsPage;