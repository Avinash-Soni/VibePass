"use strict";

import * as React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ Your custom context
import { Link, useNavigate, useParams } from "react-router";
import { AlertCircle, MapPin, Ticket, ChevronRight } from "lucide-react";

import RandomEventImage from "@/components/random-event-image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPublishedEvent } from "@/lib/api";
import { cn } from "@/lib/utils";

const PublishedEventsPage = () => {
  // 1. Updated destructuring to use 'token' and 'logout'
  const { token, isLoading: isAuthLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // 2. Derive isAuthenticated from the presence of a token
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
        setError(err instanceof Error ? err.message : "Unable to retrieve event details.");
      } finally {
        setIsDataLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md bg-gray-900 border-red-900/50">
          <AlertCircle className="size-5" />
          <AlertTitle className="font-bold">Error Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isDataLoading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="size-12 rounded-full border-t-2 border-primary animate-spin mb-4" />
        <p className="text-xs font-bold tracking-[0.3em] uppercase opacity-50">Loading Event</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-primary/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold tracking-tighter hover:text-primary transition-colors">
            VibePass
          </Link>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
                {/* 3. Use local logout function */}
                <Button variant="outline" onClick={() => logout()}>Log out</Button>
              </>
            ) : (
              /* 4. Navigate to local /login instead of Redirect function */
              <Button className="bg-primary text-black hover:bg-primary/90" onClick={() => navigate("/login")}>Log in</Button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* ... Rest of your existing JSX UI (Hero Section, Tickets Section, etc.) remains exactly the same ... */}
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <Badge variant="outline" className="border-primary/30 text-primary">Live Event</Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              {publishedEvent?.name}
            </h1>
            <div className="flex items-center gap-3 text-gray-400 text-lg font-medium">
              <div className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                <MapPin className="size-5 text-primary" />
              </div>
              {publishedEvent?.venue}
            </div>
          </div>
          
          <div className="rounded-[2rem] overflow-hidden aspect-video md:aspect-square shadow-2xl border border-white/10 group">
            <RandomEventImage className="group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>

        {/* Tickets Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Select Tickets</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Ticket List */}
            <div className="lg:col-span-3 space-y-4">
              {publishedEvent?.ticketTypes?.map((ticketType) => (
                <Card
                  key={ticketType.id}
                  className={cn(
                    "bg-gray-900/40 border-white/5 cursor-pointer transition-all duration-300 hover:border-white/20",
                    selectedTicketType?.id === ticketType.id && "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                  )}
                  onClick={() => setSelectedTicketType(ticketType)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold tracking-tight">{ticketType.name}</h3>
                      <span className="text-2xl font-black text-primary">₹{ticketType.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {ticketType.description}
                      </p>

                      <p className="text-[11px] text-gray-400 mt-2 font-medium">
                        {(ticketType.remainingTickets ?? ticketType.totalAvailable) > 0
                          ? `${ticketType.remainingTickets ?? ticketType.totalAvailable} tickets left`
                          : "Sold Out"}
                      </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sticky Checkout Panel */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 bg-gray-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-2 mb-6 opacity-50">
                  <Ticket className="size-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Order Summary Order Summary</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedTicketType?.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Single Entry Pass</p>
                  </div>
                  <div className="text-4xl font-black tracking-tighter text-white">
                    ₹{selectedTicketType?.price}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed italic">
                    "{selectedTicketType?.description}"
                  </p>
                </div>

                <Link
                  to={`/events/${publishedEvent?.id}/purchase/${selectedTicketType?.id}`}
                  className="block group"
                >
                  <Button className="w-full h-14 bg-primary text-black font-bold text-lg rounded-2xl hover:bg-primary/90 shadow-xl shadow-primary/20 transition-transform active:scale-95 flex items-center justify-center gap-2">
                    Checkout Now
                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <p className="mt-6 text-center text-[10px] text-gray-600 font-medium uppercase tracking-widest">
                  Secure checkout powered by VibePass
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Internal Badge for the header
const Badge = ({ children, className, variant }) => (
  <span className={cn(
    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
    variant === "outline" ? "border-white/20 text-gray-400" : "bg-primary text-black border-transparent",
    className
  )}>
    {children}
  </span>
);

export default PublishedEventsPage;