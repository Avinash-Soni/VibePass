"use strict";

import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Rocket, Ticket, ShieldCheck, Zap } from "lucide-react";
import RandomEventImage from "../components/random-event-image.jsx";

const OrganizersLandingPage = () => {
  const { token, isLoading, logout } = useAuth(); 
  const navigate = useNavigate();
  const isAuthenticated = !!token;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
        <div className="size-12 rounded-full border-t-2 border-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-primary/30 overflow-x-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <nav className="relative z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="size-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Rocket className="size-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tighter">VibePass <span className="text-primary text-sm font-medium tracking-normal ml-1">Pro</span></span>
          </div>
          
          <div className="flex gap-4">
            {isAuthenticated ? (
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => navigate("/dashboard/events")} className="hover:bg-white/5">
                  Dashboard
                </Button>
                <Button variant="outline" onClick={() => logout()}>
                  Log out
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => navigate("/login")}>
                Organizer Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Zap className="size-3 fill-current" />
              Everything you need in one place
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]">
              Launch Your Next <br />
              <span className="text-primary italic">Sold-Out</span> Event
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
              The professional suite for organizers. Create custom ticket tiers, 
              track real-time analytics, and secure your gate with lightning-fast QR validation.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="h-14 px-8 bg-primary text-black font-black rounded-2xl hover:bg-primary/90 shadow-xl shadow-primary/10 transition-transform active:scale-95"
                onClick={() => navigate("/dashboard/events")}
              >
                Create an Event
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="h-14 px-8 border-white/10 hover:bg-white/5 rounded-2xl font-bold"
                onClick={() => navigate("/")}
              >
                Browse Marketplace
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-gray-900 flex items-center justify-center border border-white/5">
                  <Ticket className="size-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-gray-300">Smart Tiering</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-gray-900 flex items-center justify-center border border-white/5">
                  <ShieldCheck className="size-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-gray-300">Secure Entry</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <div className="relative bg-gray-900 rounded-3xl aspect-[4/5] overflow-hidden border border-white/10 shadow-2xl">
                 <RandomEventImage className="opacity-80" />
              <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-gray-950 to-transparent">
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="flex-1">
                    <p className="text-2xl font-black text-primary tabular-nums">VibePass</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pro</p>
                  </div>
                  <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Zap className="size-5 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400">
          VibePass Event Engine &copy; 2026
        </p>
      </footer>
    </div>
  );
};

export default OrganizersLandingPage;