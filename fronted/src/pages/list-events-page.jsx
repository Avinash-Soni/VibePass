"use strict";

import * as React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ Your custom context
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
  CardHeader,
} from "@/components/ui/card";
import { EventStatusEnum } from "@/domain/domain";
import { deleteEvent, listEvents } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Tag,
  Trash,
  Plus,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";

const ListEventsPage = () => {
  const { isLoading, user, token } = useAuth();
  const [events, setEvents] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [deleteEventError, setDeleteEventError] = useState(undefined);

  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(undefined);

  useEffect(() => {
  // Change user.access_token to token
  if (isLoading || !token) return;
  refreshEvents(token);
}, [isLoading, token, page]); // Add token to dependencies

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
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case EventStatusEnum.DRAFT:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case EventStatusEnum.PUBLISHED:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case EventStatusEnum.CANCELLED:
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case EventStatusEnum.COMPLETED:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

 const handleDeleteEvent = async () => {
  if (!eventToDelete || !token) return; // Use token

  try {
    setDeleteEventError(undefined);
    await deleteEvent(token, eventToDelete.id); // Use token
    setDialogOpen(false);
    setEventToDelete(undefined);
    refreshEvents(token); // Use token
  } catch (err) {
    setDeleteEventError(err instanceof Error ? err.message : "Failed to delete event");
  }
};

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md bg-gray-900 border-red-900/50">
          <AlertCircle className="size-5" />
          <AlertTitle className="font-bold">Error Loading Dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-primary/30">
      <NavBar />

      <main className="max-w-4xl mx-auto px-6 pb-20">
        {/* Header Section */}
        <div className="py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Events</h1>
            <p className="text-gray-400 mt-1 font-medium">Manage and monitor your upcoming productions.</p>
          </div>
          <Link to="/dashboard/events/create">
            <Button className="bg-primary text-black font-bold hover:bg-primary/90 shadow-lg shadow-primary/10 rounded-xl px-6">
              <Plus className="mr-2 size-5" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-4">
          {events?.content.map((eventItem) => (
            <Card key={eventItem.id} className="bg-gray-900/40 border-white/5 backdrop-blur-sm transition-all hover:bg-gray-900/60 hover:border-white/10 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-2xl tracking-tight">{eventItem.name}</h3>
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    getStatusStyles(eventItem.status)
                  )}>
                    {eventItem.status === EventStatusEnum.PUBLISHED && (
                      <Circle className="size-2 fill-current animate-pulse" />
                    )}
                    {eventItem.status}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="grid md:grid-cols-2 gap-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="size-5 text-primary/70 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold">{formatDate(eventItem.start)} – {formatDate(eventItem.end)}</p>
                      <p className="text-xs text-gray-500 font-medium">{formatTime(eventItem.start)} – {formatTime(eventItem.end)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="size-5 text-primary/70 mt-0.5" />
                    <p className="text-sm font-bold leading-tight">{eventItem.venue}</p>
                  </div>
                </div>

                <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                  <div className="flex items-start gap-3">
                    <Clock className="size-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sales Period</p>
                      <p className="text-sm font-medium">{formatDate(eventItem.salesStart)} to {formatDate(eventItem.salesEnd)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Tag className="size-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Pricing</p>
                      <div className="flex flex-wrap gap-2">
                        {eventItem.ticketTypes.map((type) => (
                          <div key={type.id} className="text-xs font-bold bg-white/5 px-2 py-1 rounded border border-white/5">
                            <div
                              key={type.id}
                              className="text-xs font-bold bg-white/5 px-3 py-2 rounded border border-white/5 flex flex-col"
                            >
                              <span>
                                {type.name}
                                <span className="text-primary ml-1">₹{type.price}</span>
                              </span>

                              <span className="text-[10px] text-gray-400 mt-1">
                                {type.remainingTickets ?? type.totalAvailable} tickets left
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-white/[0.02] px-6 py-4 flex justify-end gap-3 border-t border-white/5">
                <Link to={`/dashboard/events/update/${eventItem.id}`}>
                  <Button variant="ghost" className="size-10 p-0 rounded-lg hover:bg-white/10">
                    <Edit className="size-5" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="size-10 p-0 rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-400"
                  onClick={() => {
                    setEventToDelete(eventItem);
                    setDialogOpen(true);
                  }}
                >
                  <Trash className="size-5" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Empty State */}
          {events?.content.length === 0 && (
            <div className="py-20 border-2 border-dashed border-white/5 rounded-2xl text-center">
              <div className="size-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="size-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold">No events created yet</h3>
              <p className="text-gray-500 mt-2 mb-8">Ready to organize something amazing?</p>
              <Link to="/dashboard/events/create">
                <Button variant="outline" className="border-white/10 hover:bg-white/5 font-bold">
                  Start Your First Event
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {events && events.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <SimplePagination pagination={events} onPageChange={setPage} />
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-white/10 text-white rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 leading-relaxed pt-2">
              Are you sure you want to delete <span className="text-white font-bold">"{eventToDelete?.name}"</span>? 
              All associated ticket types and configurations will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {deleteEventError && (
            <Alert variant="destructive" className="bg-red-950/20 border-red-900/50 mt-4">
              <AlertCircle className="size-4" />
              <AlertTitle className="font-bold">Deletion Failed</AlertTitle>
              <AlertDescription>{deleteEventError}</AlertDescription>
            </Alert>
          )}

          <AlertDialogFooter className="mt-6 gap-2 sm:gap-0">
            <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 rounded-xl font-bold">
              Keep Event
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEvent}
              className="bg-rose-600 text-white hover:bg-rose-500 font-bold rounded-xl"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListEventsPage;