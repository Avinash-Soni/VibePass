"use strict";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router";
import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { EventStatusEnum } from "@/domain/domain";
import { deleteEvent, listEvents } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  MapPin,
  Trash,
  Plus,
  Circle,
  ArrowUpRight,
  Settings2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ListEventsPage = () => {
  const { isLoading, token } = useAuth();
  const [events, setEvents] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [deleteEventError, setDeleteEventError] = useState(undefined);
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(undefined);

  useEffect(() => {
    if (isLoading || !token) return;
    refreshEvents(token);
  }, [isLoading, token, page]);

  const refreshEvents = async (accessToken) => {
    try {
      const data = await listEvents(accessToken, page);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error has occurred");
    }
  };

  const formatDate = (date) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case EventStatusEnum.DRAFT:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case EventStatusEnum.PUBLISHED:
        return "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]";
      case EventStatusEnum.CANCELLED:
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || !token) return;

    try {
      setDeleteEventError(undefined);
      await deleteEvent(token, eventToDelete.id);
      setDialogOpen(false);
      setEventToDelete(undefined);
      refreshEvents(token);
    } catch (err) {
      setDeleteEventError(
        err instanceof Error ? err.message : "Failed to delete event"
      );
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <Alert
          variant="destructive"
          className="max-w-md bg-red-950/20 border-rose-900/50"
        >
          <AlertCircle className="size-5" />
          <AlertTitle className="font-bold">
            Error Loading Dashboard
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white selection:bg-primary/30">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        
        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:55px_55px]" />

        {/* MAIN GLOW */}
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/20 blur-[180px] rounded-full animate-pulse" />

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

      <NavBar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="py-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div className="space-y-3">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-xl px-5 py-2 text-sm text-primary shadow-lg shadow-primary/10">
              <Sparkles className="size-4" />
              Manage your experiences
            </div>

            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                Event Dashboard
              </h1>

              <p className="text-gray-400 font-medium mt-3 text-lg">
                Control center for your high-vibe experiences.
              </p>
            </div>
          </div>

          <Link to="/dashboard/events/create" className="w-full md:w-auto">
            <Button className="w-full md:w-auto h-14 bg-primary text-black font-black hover:bg-primary/90 shadow-[0_0_40px_rgba(168,85,247,0.35)] rounded-2xl px-8 transition-all duration-300 hover:scale-[1.03]">
              <Plus className="mr-2 size-5 stroke-[3px]" />
              Create New Event
            </Button>
          </Link>
        </motion.div>

        {/* EVENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {events?.content.map((eventItem, index) => (
            <motion.div
              key={eventItem.id}
              initial={{ opacity: 0, y: 70, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
            >
              <Card className="group relative flex flex-col bg-white/[0.03] border-white/5 backdrop-blur-2xl transition-all duration-500 hover:bg-white/[0.06] hover:border-white/10 rounded-[32px] overflow-hidden hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)]">
                
                {/* GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />

                <CardContent className="p-0 flex-1">
                  
                  {/* TOP GRADIENT */}
                  <div className="h-2 w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-60" />

                  <div className="p-6 relative z-10">
                    
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-xl",
                          getStatusStyles(eventItem.status)
                        )}
                      >
                        {eventItem.status ===
                          EventStatusEnum.PUBLISHED && (
                          <Circle className="size-2 fill-current animate-pulse" />
                        )}

                        {eventItem.status}
                      </div>

                      <ArrowUpRight className="size-5 text-gray-600 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>

                    <h3 className="font-black text-2xl leading-tight mb-6 group-hover:text-primary transition-colors line-clamp-2">
                      {eventItem.name}
                    </h3>

                    <div className="space-y-4">
                      
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                          <Calendar className="size-4 text-primary" />
                        </div>

                        <p className="text-sm font-bold uppercase tracking-wide">
                          {formatDate(eventItem.start)}
                          <span className="text-gray-600 mx-1">—</span>
                          {formatDate(eventItem.end)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                          <MapPin className="size-4 text-primary" />
                        </div>

                        <p className="text-sm font-medium line-clamp-1">
                          {eventItem.venue}
                        </p>
                      </div>
                    </div>

                    {/* TICKET TYPES */}
                    <div className="mt-8 flex flex-wrap gap-2">
                      {eventItem.ticketTypes
                        .slice(0, 2)
                        .map((type) => (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            key={type.id}
                            className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 backdrop-blur-xl"
                          >
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">
                              {type.name}
                            </p>

                            <p className="text-xs font-bold text-primary">
                              ₹{type.price}
                            </p>
                          </motion.div>
                        ))}

                      {eventItem.ticketTypes.length > 2 && (
                        <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 flex items-center">
                          <p className="text-[10px] text-gray-500 font-bold">
                            +{eventItem.ticketTypes.length - 2} more
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 bg-black/40 border-t border-white/5 flex gap-2">
                  
                  <Link
                    to={`/dashboard/events/update/${eventItem.id}`}
                    className="flex-1"
                  >
                    <Button
                      variant="ghost"
                      className="w-full bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl gap-2 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <Settings2 className="size-4" />
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    className="size-10 p-0 rounded-xl bg-rose-500/5 text-rose-500 hover:bg-rose-500/20 hover:text-rose-400 transition-all duration-300 hover:scale-110"
                    onClick={() => {
                      setEventToDelete(eventItem);
                      setDialogOpen(true);
                    }}
                  >
                    <Trash className="size-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {events?.content.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]"
          >
            <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/20 animate-pulse">
              <Plus className="size-10 text-primary" />
            </div>

            <h3 className="text-2xl font-black">
              No events found
            </h3>

            <p className="text-gray-500 mt-2 text-center max-w-xs">
              You haven't created any experiences yet.
              Start your journey today.
            </p>

            <Link to="/dashboard/events/create" className="mt-8">
              <Button className="bg-white text-black hover:bg-gray-200 font-black rounded-xl px-8 h-12 transition-all duration-300 hover:scale-[1.03]">
                Launch First Event
              </Button>
            </Link>
          </motion.div>
        )}

        {/* PAGINATION */}
        {events && events.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16 flex justify-center"
          >
            <div className="bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/5 shadow-2xl">
              <SimplePagination
                pagination={events}
                onPageChange={setPage}
              />
            </div>
          </motion.div>
        )}
      </main>

      {/* DELETE DIALOG */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-[#020617] border-white/10 text-white rounded-[32px] max-w-md p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          <AlertDialogHeader>
            <div className="size-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
              <Trash className="size-6 text-rose-500" />
            </div>

            <AlertDialogTitle className="text-2xl font-black">
              Delete Event?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-gray-400 text-base leading-relaxed pt-2">
              This will permanently wipe
              <span className="text-white font-bold">
                {" "}
                "{eventToDelete?.name}"
              </span>{" "}
              and all ticket data.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-8 gap-3">
            
            <AlertDialogCancel className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold h-12">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteEvent}
              className="flex-1 bg-rose-600 text-white hover:bg-rose-500 font-black rounded-2xl h-12"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>

          {deleteEventError && (
            <p className="text-sm text-rose-400 mt-3">
              {deleteEventError}
            </p>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListEventsPage;