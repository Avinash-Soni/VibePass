"use strict";

import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, LayoutDashboard, Ticket, Rocket, Menu } from "lucide-react";
import { useRoles } from "@/hooks/use-roles";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";

const NavBar = () => {
  const { user, logout } = useAuth();
  const { isOrganizer } = useRoles();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-gray-950/80 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center h-16">
          
          {/* Left Section */}
          <div className="flex gap-10 items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                <Ticket className="size-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold tracking-tighter">
                Vibe<span className="text-primary">Pass</span>
              </h1>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex gap-8 text-sm font-medium">
              {isOrganizer && (
                <Link
                  to="/dashboard/events"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="size-4" />
                  Events
                </Link>
              )}

              <Link
                to="/dashboard/tickets"
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <Ticket className="size-4" />
                Tickets
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {/* Organizer Landing Page Button */}
            {isOrganizer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/organizers")}
                className="text-gray-400 hover:text-primary hidden sm:flex items-center gap-2"
              >
                <Rocket className="size-4" />
                Landing Page
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="size-6" />
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                  <Avatar className="size-9 border-2 border-white/10 hover:border-primary/50 transition-colors cursor-pointer">
                    <AvatarFallback className="bg-gray-800 text-xs font-bold uppercase">
                      {user?.name?.slice(0, 2) ||
                        user?.sub?.slice(0, 2) ||
                        "US"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64 mt-2" align="end">
                <DropdownMenuLabel className="p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate font-medium">
                      {user?.sub || user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="p-3 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-4" />
                  <span className="font-semibold">Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 pb-4">
            
            {isOrganizer && (
              <Link
                to="/dashboard/events"
                className="text-gray-400 hover:text-white flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard className="size-4" />
                Events
              </Link>
            )}

            <Link
              to="/dashboard/tickets"
              className="text-gray-400 hover:text-white flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <Ticket className="size-4" />
              Tickets
            </Link>

            {isOrganizer && (
              <button
                onClick={() => {
                  navigate("/organizers");
                  setMenuOpen(false);
                }}
                className="text-gray-400 hover:text-primary flex items-center gap-2"
              >
                <Rocket className="size-4" />
                Landing Page
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;