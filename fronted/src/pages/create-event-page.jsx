"use strict";

import NavBar from "@/components/nav-bar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EventStatusEnum } from "@/domain/domain";
// ✅ Fixed: Added addStaffToEvent to the imports
import { createEvent, getEvent, updateEvent, addStaffToEvent } from "@/lib/api";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  Edit,
  Plus,
  Ticket,
  Trash,
  UserCheck, // ✅ Fixed: Added UserCheck icon import
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useParams } from "react-router";

const DateTimeSelect = ({
  date,
  setDate,
  time,
  setTime,
  enabled,
  setEnabled,
}) => {
  return (
    <div className="flex gap-3 items-center">
      <div className="flex items-center justify-between bg-gray-900/60 px-4 py-3 rounded-xl border border-gray-800">
  
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-white">
      Enable Date & Time
    </span>
    <span className="text-xs text-gray-400">
      Turn on to set event schedule
    </span>
  </div>

      <Switch
        checked={enabled}
        onCheckedChange={setEnabled}
        className="
          relative inline-flex h-6 w-11 rounded-full
          transition-all duration-300
          data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-purple-500
          data-[state=checked]:shadow-[0_0_10px_rgba(168,85,247,0.5)]
          data-[state=unchecked]:bg-gray-700
        "
      />
    </div>

      {enabled && (
        <div className="w-full flex gap-2">
          {/* Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-gray-900 border-gray-700 border">
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto p-3 
                  bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-pink-600/30 
                  backdrop-blur-xl 
                  border border-white/20 
                  shadow-2xl 
                  rounded-2xl"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (!selectedDate) return;
                  const correctedDate = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
                  setDate(correctedDate);
                }}
                className="text-white"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center px-8",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-white/10 rounded-md transition-colors",
                  day_selected: "bg-white text-black hover:bg-white hover:text-black focus:bg-white focus:text-black font-bold",
                  day_today: "bg-gray-800 text-white ring-1 ring-white/20",
                  day_outside: "text-gray-600 opacity-50",
                  day_disabled: "text-gray-600 opacity-50",
                }}
              />
            </PopoverContent>
          </Popover>
          {/* Time */}
          <div className="flex gap-2 items-center">
            <Input
              type="time"
              className="w-[90px] bg-gray-900 text-white border-gray-700 border [&::-webkit-calendar-picker-indicator]:invert"
              value={time || ""}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const getEventStaff = async (token, eventId) => {
  const res = await fetch(`/api/v1/staff/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch staff");
  return res.json();
};

const generateTempId = () => `temp_${crypto.randomUUID()}`;
const isTempId = (id) => id && id.startsWith("temp_");

const CreateEventPage = () => {
  const { isLoading, user, token } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);

  // --- Staff Management State ---
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [staffData, setStaffData] = useState({ name: "", email: "", password: "" });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdEventId, setCreatedEventId] = useState(null);   

  // --- Event Data State ---
  const [eventData, setEventData] = useState({
    id: undefined,
    name: "",
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
    venueDetails: "",
    salesStartDate: undefined,
    salesStartTime: undefined,
    salesEndDate: undefined,
    salesEndTime: undefined,
    ticketTypes: [],
    status: EventStatusEnum.DRAFT,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const [currentTicketType, setCurrentTicketType] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventDateEnabled, setEventDateEnabled] = useState(false);
  const [eventSalesDateEnabled, setEventSalesDateEnabled] = useState(false);
  const [error, setError] = useState();

  const updateField = (field, value) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  // --- API Handlers ---

    const handleAddStaff = async () => {
    if (!staffData.name || !staffData.email) return;

    // ✅ Add locally (UI like ticket types)
    const newStaff = {
      id: generateTempId(),
      ...staffData,
    };

    setStaffList((prev) => [...prev, newStaff]);

    // ✅ Call API only if edit mode
    if (token && id) {
      try {
        await addStaffToEvent(token, id, staffData);
      } catch (err) {
        console.error(err);
      }
    }

    setStaffDialogOpen(false);
    setStaffData({ name: "", email: "", password: "" });
  };

  const handleDeleteStaff = (id) => {
  setStaffList((prev) => prev.filter((s) => s.id !== id));
};

  useEffect(() => {
    if (isEditMode && !isLoading && token) {
      const fetchEvent = async () => {
        try {
          const staff = await getEventStaff(token, id);
          setStaffList(staff);
          const event = await getEvent(token, id);
          
          setEventData({
            id: event.id,
            name: event.name,
            startDate: event.start ? new Date(event.start) : undefined,
            startTime: event.start 
              ? formatTimeFromDate(new Date(event.start)) 
              : undefined,
            endDate: event.end ? new Date(event.end) : undefined,
            endTime: event.end 
              ? formatTimeFromDate(new Date(event.end)) 
              : undefined,
            venueDetails: event.venue || "",
            salesStartDate: event.salesStart ? new Date(event.salesStart) : undefined,
            salesStartTime: event.salesStart 
              ? formatTimeFromDate(new Date(event.salesStart)) 
              : undefined,
            salesEndDate: event.salesEnd ? new Date(event.salesEnd) : undefined,
            salesEndTime: event.salesEnd 
              ? formatTimeFromDate(new Date(event.salesEnd)) 
              : undefined,
            status: event.status,
            ticketTypes: event.ticketTypes || [],
            createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
            updatedAt: event.updatedAt ? new Date(event.updatedAt) : undefined,
          });

          setEventDateEnabled(!!(event.start || event.end));
          setEventSalesDateEnabled(!!(event.salesStart || event.salesEnd));

        } catch (err) {
          console.error("Failed to fetch event:", err);
          setError("Could not load event data. Please try again.");
        }
      };
      fetchEvent();
    }
  }, [id, token, isEditMode, isLoading]);

  const formatTimeFromDate = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const combineDateTime = (date, time) => {
    const [hours, minutes] = time
      .split(":")
      .map((num) => Number.parseInt(num, 10));

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);
    combinedDateTime.setSeconds(0);

    const utcResult = new Date(
      Date.UTC(
        combinedDateTime.getFullYear(),
        combinedDateTime.getMonth(),
        combinedDateTime.getDate(),
        hours,
        minutes,
        0,
        0,
      ),
    );

    return utcResult;
  };

  const handleEventUpdateSubmit = async (accessToken, id) => {
    const ticketTypes = eventData.ticketTypes.map((ticketType) => {
      return {
        id: isTempId(ticketType.id) ? undefined : ticketType.id,
        name: ticketType.name,
        price: ticketType.price,
        description: ticketType.description,
        totalAvailable: ticketType.totalAvailable,
      };
    });

    const request = {
      id: id,
      name: eventData.name,
      start:
        eventData.startDate && eventData.startTime
          ? combineDateTime(eventData.startDate, eventData.startTime)
          : undefined,
      end:
        eventData.endDate && eventData.endTime
          ? combineDateTime(eventData.endDate, eventData.endTime)
          : undefined,
      venue: eventData.venueDetails,
      salesStart:
        eventData.salesStartDate && eventData.salesStartTime
          ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
          : undefined,
      salesEnd:
        eventData.salesEndDate && eventData.salesEndTime
          ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
          : undefined,
      status: eventData.status,
      ticketTypes: ticketTypes,
    };

    try {
      await updateEvent(accessToken, id, request);
      navigate("/dashboard/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

    const handleEventCreateSubmit = async (accessToken) => {
    const ticketTypes = eventData.ticketTypes.map((ticketType) => ({
      name: ticketType.name,
      price: ticketType.price,
      description: ticketType.description,
      totalAvailable: ticketType.totalAvailable,
    }));

    const request = {
      name: eventData.name,
      start: eventData.startDate && eventData.startTime
        ? combineDateTime(eventData.startDate, eventData.startTime)
        : undefined,
      end: eventData.endDate && eventData.endTime
        ? combineDateTime(eventData.endDate, eventData.endTime)
        : undefined,
      venue: eventData.venueDetails,
      salesStart: eventData.salesStartDate && eventData.salesStartTime
        ? combineDateTime(eventData.salesStartDate, eventData.salesStartTime)
        : undefined,
      salesEnd: eventData.salesEndDate && eventData.salesEndTime
        ? combineDateTime(eventData.salesEndDate, eventData.salesEndTime)
        : undefined,
      status: eventData.status,
      ticketTypes,
    };

    try {
      const createdEvent = await createEvent(accessToken, request);

      // ✅ Store ID
      setCreatedEventId(createdEvent.id);

      // ✅ Show popup instead of navigating
      setShowSuccessPopup(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(undefined);

    if (isLoading || !token) {
      setError("You must be logged in to perform this action.");
      return;
    }

    if (isEditMode) {
      if (!eventData.id) {
        setError("Event does not have an ID");
        return;
      }
      await handleEventUpdateSubmit(token, eventData.id);
    } else {
      await handleEventCreateSubmit(token);
    }
  };

  // --- Ticket Type Handlers ---

  const handleAddTicketType = () => {
    setCurrentTicketType({
      id: undefined,
      name: "",
      price: 0,
      totalAvailable: 0,
      description: "",
    });
    setDialogOpen(true);
  };

  const handleSaveTicketType = () => {
    if (!currentTicketType) return;

    const newTicketTypes = [...eventData.ticketTypes];

    if (currentTicketType.id) {
      const index = newTicketTypes.findIndex((t) => t.id === currentTicketType.id);
      if (index !== -1) newTicketTypes[index] = currentTicketType;
    } else {
      newTicketTypes.push({
        ...currentTicketType,
        id: generateTempId(),
      });
    }

    updateField("ticketTypes", newTicketTypes);
    setDialogOpen(false);
  };

  const handleEditTicketType = (ticketType) => {
    setCurrentTicketType(ticketType);
    setDialogOpen(true);
  };

  const handleDeleteTicketType = (id) => {
    if (!id) return;
    updateField(
      "ticketTypes",
      eventData.ticketTypes.filter((t) => t.id !== id),
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Event" : "Create a New Event"}
          </h1>
          {isEditMode ? (
            <>
              {eventData.id && (
                <p className="text-sm text-gray-400">ID: {eventData.id}</p>
              )}
              {eventData.createdAt && (
                <p className="text-sm text-gray-400">
                  Created At: {format(eventData.createdAt, "PPP")}
                </p>
              )}
              {eventData.updatedAt && (
                <p className="text-sm text-gray-400">
                  Updated At: {format(eventData.updatedAt, "PPP")}
                </p>
              )}
            </>
          ) : (
            <p>Fill out the form below to create your event</p>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Event Name */}
          <div>
            <label htmlFor="event-name" className="text-sm font-medium">Event Name</label>
            <Input
              id="event-name"
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="Event Name"
              value={eventData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
            <p className="text-gray-400 text-xs">This is the public name of your event.</p>
          </div>

          {/* Event Start */}
          <div>
            <label className="text-sm font-medium">Event Start</label>
            <DateTimeSelect
              date={eventData.startDate}
              setDate={(date) => updateField("startDate", date)}
              time={eventData.startTime}
              setTime={(time) => updateField("startTime", time)}
              enabled={eventDateEnabled}
              setEnabled={setEventDateEnabled}
            />
          </div>

          {/* Event End */}
          <div>
            <label className="text-sm font-medium">Event End</label>
            <DateTimeSelect
              date={eventData.endDate}
              setDate={(date) => updateField("endDate", date)}
              time={eventData.endTime}
              setTime={(time) => updateField("endTime", time)}
              enabled={eventDateEnabled}
              setEnabled={setEventDateEnabled}
            />
          </div>

          {/* Venue Details */}
          <div>
            <label htmlFor="venue-details" className="text-sm font-medium">Venue Details</label>
            <Textarea
              id="venue-details"
              className="bg-gray-900 border-gray-700 min-h-[100px]"
              value={eventData.venueDetails}
              onChange={(e) => updateField("venueDetails", e.target.value)}
            />
          </div>

          {/* Sales Start */}
          <div>
            <label className="text-sm font-medium">Event Sales Start</label>
            <DateTimeSelect
              date={eventData.salesStartDate}
              setDate={(date) => updateField("salesStartDate", date)}
              time={eventData.salesStartTime}
              setTime={(time) => updateField("salesStartTime", time)}
              enabled={eventSalesDateEnabled}
              setEnabled={setEventSalesDateEnabled}
            />
          </div>

          {/* Sales End */}
          <div>
            <label className="text-sm font-medium">Event Sales End</label>
            <DateTimeSelect
              date={eventData.salesEndDate}
              setDate={(date) => updateField("salesEndDate", date)}
              time={eventData.salesEndTime}
              setTime={(time) => updateField("salesEndTime", time)}
              enabled={eventSalesDateEnabled}
              setEnabled={setEventSalesDateEnabled}
            />
          </div>

          {/* Ticket Types Card */}
          <div>
            <Card className="bg-gray-900 border-gray-700 text-white">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="flex gap-2 items-center text-sm">
                      <Ticket /> Ticket Types
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={() => handleAddTicketType()}
                      className="bg-gray-800 border-gray-700 text-white"
                    >
                      <Plus /> Add Ticket Type
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  {eventData.ticketTypes.map((ticketType) => (
                    <div key={ticketType.id} className="bg-gray-700 w-full p-4 rounded-lg border-gray-600">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex gap-4">
                            <p className="text-small font-medium">{ticketType.name}</p>
                            <Badge variant="outline" className="border-gray-600 text-white font-normal text-xs">
                              ₹{ticketType.price}
                            </Badge>
                          </div>
                          {ticketType.totalAvailable && (
                            <p className="text-gray-400">{ticketType.totalAvailable} tickets available</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="ghost" onClick={() => handleEditTicketType(ticketType)}><Edit /></Button>
                          <Button type="button" variant="ghost" className="text-red-400" onClick={() => handleDeleteTicketType(ticketType.id)}><Trash /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Add Ticket Type</DialogTitle>
                    <DialogDescription className="text-gray-400">Please enter details of the ticket type</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-1">
                    <Label htmlFor="ticket-type-name">Name</Label>
                    <Input
                      id="ticket-type-name"
                      className="bg-gray-800 border-gray-700"
                      value={currentTicketType?.name || ""}
                      onChange={(e) => setCurrentTicketType(prev => prev ? { ...prev, name: e.target.value } : undefined)}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="space-y-1 w-full">
                      <Label htmlFor="ticket-type-price">Price</Label>
                      <Input
                        id="ticket-type-price"
                        type="number"
                        className="bg-gray-800 border-gray-700"
                        value={currentTicketType?.price || 0}
                        onChange={(e) => setCurrentTicketType(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : undefined)}
                      />
                    </div>
                    <div className="space-y-1 w-full">
                      <Label htmlFor="ticket-type-total-available">Total Available</Label>
                      <Input
                        id="ticket-type-total-available"
                        type="number"
                        className="bg-gray-800 border-gray-700"
                        value={currentTicketType?.totalAvailable || 0}
                        onChange={(e) => setCurrentTicketType(prev => prev ? { ...prev, totalAvailable: parseFloat(e.target.value) } : undefined)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ticket-type-description">Description</Label>
                    <Textarea
                      id="ticket-type-description"
                      className="bg-gray-800 border-gray-700"
                      value={currentTicketType?.description || ""}
                      onChange={(e) => setCurrentTicketType(prev => prev ? { ...prev, description: e.target.value } : undefined)}
                    />
                  </div>
                  <DialogFooter>
                    <Button className="bg-white text-black hover:bg-gray-300" onClick={handleSaveTicketType}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          </div>

          {/* ✅ Staff Management Logic Block */}
          {!isEditMode ? (
              <Alert className="bg-gray-900 border-yellow-600 mt-6">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Staff Management</AlertTitle>
                <AlertDescription className="text-gray-400">
                  You can add staff after creating the event.
                </AlertDescription>
              </Alert>
            ) :(
            <div>
              <Card className="bg-gray-900 border-gray-700 text-white mt-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm flex gap-2">
                      <UserCheck className="size-4 text-primary" /> Event Staff
                    </CardTitle>
                    <Button type="button" onClick={() => setStaffDialogOpen(true)} variant="outline" size="sm" className="border-gray-700">
                      <Plus className="size-4 mr-1" /> Add Staff
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {staffList.length === 0 && (
                    <p className="text-xs text-gray-500 italic">
                      No staff added yet.
                    </p>
                  )}

                  {staffList.map((staff) => (
                    <div
                      key={staff.id}
                      className="bg-gray-700 w-full p-4 rounded-lg border-gray-600 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium">{staff.name}</p>
                        <p className="text-xs text-gray-400">{staff.email}</p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-400"
                        onClick={() => handleDeleteStaff(staff.id)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
                <DialogContent className="bg-gray-900 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Add Event Staff</DialogTitle>
                    <DialogDescription className="text-gray-400">Credentials will only be authorized to validate this specific event.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-1">
                      <Label>Full Name</Label>
                      <Input className="bg-gray-800 border-gray-700" value={staffData.name} onChange={(e) => setStaffData({...staffData, name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label>Email</Label>
                      <Input type="email" className="bg-gray-800 border-gray-700" value={staffData.email} onChange={(e) => setStaffData({...staffData, email: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label>Password</Label>
                      <Input type="password" className="bg-gray-800 border-gray-700" value={staffData.password} onChange={(e) => setStaffData({...staffData, password: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddStaff} className="w-full bg-primary text-black font-bold">Create Staff Account</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Event Status */}
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={eventData.status} onValueChange={(value) => updateField("status", value)}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Select Event Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                <SelectItem value={EventStatusEnum.DRAFT}>Draft</SelectItem>
                <SelectItem value={EventStatusEnum.PUBLISHED}>Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-gray-900 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Button onClick={handleFormSubmit}>
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
  <DialogContent className="bg-gray-900 text-white border-gray-700">
    <DialogHeader>
      <DialogTitle>✅ Event Created Successfully!</DialogTitle>
      <DialogDescription className="text-gray-400">
        Now you can add staff to manage your event.
      </DialogDescription>
    </DialogHeader>

    <DialogFooter className="flex gap-2">
      
      {/* 👉 Go to staff page */}
      <Button
        className="bg-primary text-black font-bold"
        onClick={() => {
          setShowSuccessPopup(false);
          navigate(`/dashboard/events/update/${createdEventId}`);
        }}
      >
        Add Staff
      </Button>

      {/* 👉 Skip */}
      <Button
        variant="outline"
        onClick={() => {
          setShowSuccessPopup(false);
          navigate("/dashboard/events");
        }}
      >
        Skip
      </Button>

    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default CreateEventPage;