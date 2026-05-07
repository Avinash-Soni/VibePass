"use strict";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";

import {
  AlertCircle,
  Search,
  Sparkles,
  User,
  LogOut,
  LayoutDashboard,
  ArrowRight,
  Flame,
  Star,
} from "lucide-react";

import {
  listPublishedEvents,
  searchPublishedEvents,
} from "@/lib/api";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";
import { useRoles } from "@/hooks/use-roles";

const Home = () => {
  const { token, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = !!token;

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [query, setQuery] = useState("");

  const { isOrganizer, isAttendee } = useRoles();

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
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error has occurred"
      );
    }
  };

  const queryPublishedEvents = async () => {
    try {
      const data = query.trim()
        ? await searchPublishedEvents(query, page)
        : await listPublishedEvents(page);

      setPublishedEvents(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error has occurred"
      );
    }
  };

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <Alert className="max-w-md border-red-500/20 bg-red-500/10 backdrop-blur-xl">
          <AlertCircle className="size-5 text-red-500" />

          <AlertTitle className="text-white text-lg">
            Something went wrong
          </AlertTitle>

          <AlertDescription className="text-gray-300 mt-2">
            {error}
          </AlertDescription>

          <Button
            onClick={() => window.location.reload()}
            className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  // LOADER
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="relative">
          <div className="size-16 rounded-full border-4 border-primary/20" />
          <div className="size-16 rounded-full border-4 border-primary border-t-transparent animate-spin absolute inset-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#020617] text-white min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:55px_55px]" />

        {/* GLOWS */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[850px] h-[850px] bg-primary/20 blur-[180px] rounded-full animate-pulse" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full" />

        {/* FLOATING LIGHTS */}
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-pulse"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 8 }}
              className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <Sparkles className="size-5 text-black" />
            </motion.div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                VibePass
              </h1>

              <p className="text-[11px] text-gray-500 -mt-1">
                Discover Amazing Events
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isOrganizer && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/organizers")}
                    className="hidden md:flex text-gray-300 hover:text-primary hover:bg-white/5 gap-2"
                  >
                    <LayoutDashboard className="size-4" />
                    Organizer
                  </Button>
                )}

                {isAttendee && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/dashboard/tickets")}
                    className="hidden md:flex text-gray-300 hover:text-primary hover:bg-white/5 gap-2"
                  >
                    <User className="size-4" />
                    My Tickets
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={logout}
                  className="border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-500 gap-2 rounded-xl"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:block">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/organizers")}
                  className="text-gray-300 hover:text-primary"
                >
                  Organizers
                </Button>

                <Button
                  onClick={() => navigate("/login")}
                  className="bg-primary hover:bg-primary/90 text-black font-bold rounded-xl shadow-lg shadow-primary/30"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="max-w-6xl mx-auto text-center relative z-10"
        >

          {/* BADGE */}
          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary mb-8 backdrop-blur-xl shadow-lg shadow-primary/10"
          >
            <Flame className="size-4" />
            Trending events updated daily
          </motion.div>

          {/* TITLE */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
            Your Gateway To

            <span className="block bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Extraordinary Events
            </span>
          </h1>

          {/* SUBTITLE */}
          <p className="mt-8 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover concerts, workshops, conferences, and unforgettable
            experiences happening around you.
          </p>

          {/* SEARCH */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mt-12"
          >
            <div className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-3 shadow-2xl">

              {/* SEARCH GLOW */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-50" />

              <div className="relative z-10 flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="size-5 text-gray-500" />

                  <input
                    type="text"
                    placeholder="Search events, concerts, conferences..."
                    className="w-full bg-transparent outline-none border-none text-white placeholder:text-gray-500 h-14 text-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && queryPublishedEvents()
                    }
                  />
                </div>

                <Button
                  onClick={queryPublishedEvents}
                  className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-black font-bold text-lg shadow-[0_0_40px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-[1.03]"
                >
                  Search
                  <ArrowRight className="size-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* STATS */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm">

              {[
                { value: "500+", label: "Live Events" },
                { value: "50K+", label: "Tickets Sold" },
                { value: "4.9", label: "Rating" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                  }}
                >
                  <span className="text-3xl font-black text-white">
                    {item.value}
                  </span>

                  <p className="text-gray-500 mt-1 flex items-center justify-center gap-1">
                    {item.label === "Rating" && (
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    )}

                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* EVENTS */}
      <main className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-12"
        >
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.25em] mb-2">
              Discover
            </p>

            <h2 className="text-4xl font-black tracking-tight">
              Upcoming Events
            </h2>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <div className="size-3 rounded-full bg-green-500 animate-pulse" />

            <span className="text-gray-300 text-sm">
              {publishedEvents?.numberOfElements || 0} events available
            </span>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {publishedEvents?.content?.map((publishedEvent, index) => (
            <motion.div
              key={publishedEvent.id}
              initial={{ opacity: 0, y: 70, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
              }}
            >
              <PublishedEventCard
                publishedEvent={publishedEvent}
              />
            </motion.div>
          ))}
        </div>

        {/* EMPTY */}
        {publishedEvents?.content?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-28 text-center"
          >
            <div className="size-24 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Search className="size-10 text-gray-600" />
            </div>

            <h3 className="text-3xl font-bold">
              No events found
            </h3>

            <p className="text-gray-500 mt-3 text-lg">
              Try searching with different keywords.
            </p>
          </motion.div>
        )}

        {/* PAGINATION */}
        {publishedEvents && publishedEvents.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex justify-center mt-20"
          >
            <SimplePagination
              pagination={publishedEvents}
              onPageChange={setPage}
            />
          </motion.div>
        )}
      </main>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-white/5 py-12 text-center mt-20"
      >
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-center justify-center gap-2 mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="size-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <Sparkles className="size-4 text-black" />
            </motion.div>

            <span className="text-lg font-bold tracking-tight text-white">
              VibePass
            </span>
          </div>

          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Discover unforgettable experiences, book tickets instantly,
            and join the next generation of live events.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-8">
            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="hover:text-primary transition-colors"
            >
              Events
            </button>

            <button
              onClick={() => navigate("/organizers")}
              className="hover:text-primary transition-colors"
            >
              Organizers
            </button>

            <button className="hover:text-primary transition-colors">
              Support
            </button>

            <button className="hover:text-primary transition-colors">
              Privacy
            </button>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

          <p className="text-[10px] font-mono text-gray-600 tracking-[0.2em] uppercase">
            © 2026 VibePass Protocol — All Access Granted
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;