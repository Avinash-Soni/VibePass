"use strict";

import * as React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; 
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { AlertCircle, Search, Sparkles, User, LogOut, LayoutDashboard } from "lucide-react";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";

const Home = () => {
  const { token, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Determine auth status from token
  const isAuthenticated = !!token;

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query && query.length > 0) {
      queryPublishedEvents();
    } else {
      refreshPublishedEvents();
    }
  }, [page]);

  const refreshPublishedEvents = async () => {
    try {
      const data = await listPublishedEvents(page);
      setPublishedEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error has occurred");
    }
  };

  const queryPublishedEvents = async () => {
    try {
      const data = query.trim() 
        ? await searchPublishedEvents(query, page) 
        : await listPublishedEvents(page);
      setPublishedEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error has occurred");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md bg-gray-900 border-red-900/50 shadow-2xl">
          <AlertCircle className="size-5" />
          <AlertTitle className="font-bold">System Error</AlertTitle>
          <AlertDescription className="text-gray-400">
            {error}
          </AlertDescription>
          <Button variant="outline" className="mt-4 w-full border-red-900/20 hover:bg-red-900/10" onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="size-12 rounded-full border-t-2 border-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-primary/30">
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="size-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tighter">VibePass</span>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Organizers Page Link */}
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/organizers")} 
                  className="text-gray-400 hover:text-primary text-sm hidden md:flex items-center gap-2"
                >
                  <LayoutDashboard className="size-4" />
                  Organizers
                </Button>
                
                {/* User Symbol */}
                <div className="size-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                  <User className="size-5" />
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/10 hover:bg-red-500/10 hover:text-red-500 gap-2"
                  onClick={() => logout()}
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Log out</span>
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/organizers")}
                  className="text-gray-400"
                >
                  Organizers
                </Button>
                <Button 
                  className="bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20" 
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Find Tickets to Your <br /> Next Unforgettable Event
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover the best concerts, conferences, and workshops happening near you. 
            Secure your spot in seconds.
          </p>
          
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000" />
            <div className="relative flex gap-2 bg-gray-900/80 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="flex-1 flex items-center px-4 gap-3">
                <Search className="size-5 text-gray-500" />
                <input
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-500 text-lg"
                  placeholder="Search for events, venues, or vibes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && queryPublishedEvents()}
                />
              </div>
              <Button onClick={queryPublishedEvents} className="h-12 px-8 bg-primary text-black font-bold rounded-xl">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Upcoming Events</h2>
          <div className="h-px flex-1 bg-white/5 mx-6 hidden sm:block" />
          <span className="text-sm text-gray-500 font-medium">
            Showing {publishedEvents?.numberOfElements || 0} events
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {publishedEvents?.content?.map((publishedEvent) => (
            <PublishedEventCard publishedEvent={publishedEvent} key={publishedEvent.id} />
          ))}
        </div>

        {publishedEvents?.content?.length === 0 && (
          <div className="py-20 text-center">
            <div className="size-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <Search className="size-8 text-gray-700" />
            </div>
            <h3 className="text-xl font-bold">No events found</h3>
            <p className="text-gray-500">Try adjusting your search filters or browse all events.</p>
          </div>
        )}

        {publishedEvents && publishedEvents.totalPages > 1 && (
          <div className="w-full flex justify-center mt-16">
            <SimplePagination pagination={publishedEvents} onPageChange={setPage} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;