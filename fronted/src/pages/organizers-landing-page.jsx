"use strict";

import * as React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";

import {
  Rocket,
  Ticket,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Globe,
  Star,
  Play,
} from "lucide-react";

import RandomEventImage from "../components/random-event-image.jsx";

const OrganizersLandingPage = () => {
  const { token, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = !!token;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#020617]">
        <div className="relative">
          <div className="size-16 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 size-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        
        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:55px_55px]" />

        {/* MAIN GLOW */}
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/20 blur-[180px] rounded-full" />

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

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="size-11 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-300 group-hover:scale-110">
              <Rocket className="size-5 text-black" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                VibePass
              </h1>

              <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">
                Organizer Pro
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard/events")}
                  className="hidden md:flex rounded-xl text-gray-300 hover:text-primary hover:bg-white/5"
                >
                  Dashboard
                </Button>

                <Button
                  variant="outline"
                  onClick={logout}
                  className="rounded-xl border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-400"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="rounded-xl bg-primary hover:bg-primary/90 text-black font-black shadow-[0_0_30px_rgba(168,85,247,0.4)]"
              >
                Organizer Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <main className="relative z-10 px-6 pt-24 pb-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-xl px-5 py-2 text-sm text-primary mb-8 shadow-lg shadow-primary/10">
              <Sparkles className="size-4" />
              Powering the next generation of events
            </div>

            {/* TITLE */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.02]">
              Create
              <span className="block bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent">
                Viral Experiences
              </span>
              That People Remember
            </h1>

            {/* TEXT */}
            <p className="mt-8 text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl">
              Launch stunning events, sell tickets instantly, validate attendees
              with blazing-fast QR scanning, and grow your audience using one
              beautiful platform.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-4 mt-10">
              <Button
                size="lg"
                onClick={() => navigate("/dashboard/events")}
                className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-black text-lg font-black shadow-[0_0_50px_rgba(168,85,247,0.45)] transition-all duration-300 hover:scale-[1.03]"
              >
                Start Creating
                <ArrowRight className="size-5 ml-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/")}
                className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold"
              >
                <Play className="size-4 mr-2" />
                Explore Events
              </Button>
            </div>

            {/* TRUST */}
            <div className="flex flex-wrap gap-8 mt-12">
              
              <div>
                <h2 className="text-4xl font-black">12K+</h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Active attendees
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-black">320+</h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Events launched
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-black flex items-center gap-2">
                  4.9
                  <Star className="size-5 fill-yellow-400 text-yellow-400" />
                </h2>

                <p className="text-gray-500 mt-1 text-sm">
                  Organizer rating
                </p>
              </div>
            </div>

            {/* FEATURES */}
            <div className="grid sm:grid-cols-2 gap-5 mt-14">
              
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <Ticket className="size-5 text-primary" />
                </div>

                <h3 className="text-lg font-bold">
                  Smart Ticketing
                </h3>

                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  Create custom ticket tiers, VIP access, early-bird pricing,
                  and more.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <ShieldCheck className="size-5 text-primary" />
                </div>

                <h3 className="text-lg font-bold">
                  Secure Entry
                </h3>

                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  Instantly verify attendees with encrypted QR validation.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <Users className="size-5 text-primary" />
                </div>

                <h3 className="text-lg font-bold">
                  Audience Growth
                </h3>

                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  Reach thousands of potential attendees across the platform.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <Globe className="size-5 text-primary" />
                </div>

                <h3 className="text-lg font-bold">
                  Global Reach
                </h3>

                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  Host online or offline experiences accessible worldwide.
                </p>
              </div>
            </div>

            {/* TRUSTED */}
            <div className="flex flex-wrap items-center gap-6 mt-12 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-400" />
                Secure payments
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-400" />
                Real-time analytics
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-400" />
                Lightning-fast scans
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* OUTER GLOW */}
            <div className="absolute -inset-5 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-[50px] blur-3xl opacity-20 animate-pulse" />

            {/* CARD */}
            <div className="relative rounded-[40px] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_0_100px_rgba(168,85,247,0.15)]">
              
              {/* IMAGE */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <RandomEventImage className="h-full w-full object-cover scale-110 opacity-80" />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-black/10 to-transparent" />

                {/* FLOATING TOP */}
                <div className="absolute top-6 left-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                    Live Platform
                  </p>

                  <h3 className="text-xl font-black mt-1 text-primary">
                    VibePass Pro
                  </h3>
                </div>

                {/* FLOATING BOTTOM */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl p-6">
                    
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                          Event Suite
                        </p>

                        <h2 className="text-3xl font-black mt-2">
                          Modern Event Infrastructure
                        </h2>
                      </div>

                      <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <Zap className="size-6 text-primary" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      
                      <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                        <p className="text-2xl font-black">99%</p>
                        <span className="text-xs text-gray-400">
                          Scan Speed
                        </span>
                      </div>

                      <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                        <p className="text-2xl font-black">24/7</p>
                        <span className="text-xs text-gray-400">
                          Support
                        </span>
                      </div>

                      <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                        <p className="text-2xl font-black">AI</p>
                        <span className="text-xs text-gray-400">
                          Insights
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-5">
          
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Rocket className="size-4 text-black" />
            </div>

            <div>
              <p className="font-bold tracking-tight">
                VibePass
              </p>

              <p className="text-xs text-gray-500">
                Professional Event Platform
              </p>
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
            © 2026 VibePass Protocol — All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OrganizersLandingPage;