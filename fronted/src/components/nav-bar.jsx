"use strict";

import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { motion, AnimatePresence } from "framer-motion"; // Added for smooth mobile menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  LogOut,
  LayoutDashboard,
  Ticket,
  Rocket,
  Menu,
  Home,
  X,
} from "lucide-react";
import { useRoles } from "@/hooks/use-roles";
import { Link, useNavigate, useLocation } from "react-router";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const { user, logout } = useAuth();
  const { isOrganizer } = useRoles();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Helper to check active route
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    ...(isOrganizer ? [{ name: "Events", path: "/dashboard/events", icon: LayoutDashboard }] : []),
    { name: "Tickets", path: "/dashboard/tickets", icon: Ticket },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LEFT: LOGO & DESKTOP NAV */}
          <div className="flex gap-12 items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-all duration-300">
                <Ticket className="size-5 text-black" strokeWidth={2.5} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black tracking-tighter leading-none">
                  Vibe<span className="text-primary">Pass</span>
                </h1>
                <p className="text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold">Protocol</p>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex gap-1 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200",
                    isActive(link.path) 
                      ? "text-primary bg-primary/10" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <link.icon className="size-4" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: ACTIONS & PROFILE */}
          <div className="flex items-center gap-3">
            {isOrganizer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/organizers")}
                className="text-gray-400 hover:text-primary hover:bg-primary/5 hidden lg:flex items-center gap-2 font-bold rounded-xl"
              >
                <Rocket className="size-4" />
                Organizer Pro
              </Button>
            )}

            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />

            {/* Profile Section */}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none group">
                <div className="flex items-center gap-3 p-1 rounded-2xl transition-all">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-black leading-none">{user?.name || "User"}</p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-tighter mt-1">Online</p>
                  </div>
                  <div className="relative">
                    <Avatar className="size-10 border-2 border-white/10 group-hover:border-primary/50 transition-all duration-300">
                      <AvatarFallback className="bg-gradient-to-br from-gray-800 to-black text-xs font-black text-primary">
                        {user?.name?.slice(0, 2).toUpperCase() || "VP"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-black rounded-full" />
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64 mt-4 bg-gray-950 border-white/10 text-white rounded-2xl p-2 backdrop-blur-2xl" align="end">
                <DropdownMenuLabel className="p-4">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Account</p>
                  <p className="text-sm font-black truncate">{user?.sub || user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  className="p-3 rounded-xl text-rose-500 focus:bg-rose-500/10 focus:text-rose-400 cursor-pointer font-bold flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Toggle */}
            <button
              className="md:hidden size-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="size-6 text-primary" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/5"
            >
              <div className="flex flex-col gap-2 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl font-black transition-all",
                      isActive(link.path) ? "bg-primary text-black" : "bg-white/5 text-gray-400"
                    )}
                  >
                    <link.icon className="size-5" />
                    {link.name}
                  </Link>
                ))}
                
                {isOrganizer && (
                  <button
                    onClick={() => {
                      navigate("/organizers");
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-4 p-4 rounded-2xl font-black bg-primary/10 text-primary mt-2"
                  >
                    <Rocket className="size-5" />
                    Organizer Landing Page
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;