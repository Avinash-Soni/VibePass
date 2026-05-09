"use strict";
import * as React from "react";
import { Card } from "./ui/card";
import {
  Calendar,
  Heart,
  MapPin,
  Share2,
  Ticket,
  Clock3,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";
import { API_BASE_URL } from "../config";

const PublishedEventCard = ({ publishedEvent }) => {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const eventId = publishedEvent.id;
  const token = localStorage.getItem("token");

  // ✅ Fetch initial like status + count
  React.useEffect(() => {
    const fetchLikes = async () => {
      try {
        const statusRes = await fetch(`${API_BASE_URL}/api/likes/${eventId}/status`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const countRes = await fetch(`${API_BASE_URL}/api/likes/${eventId}`);
        let status = false;
        let count = 0;
        if (statusRes.ok) status = await statusRes.json();
        if (countRes.ok) count = await countRes.json();

        setLiked(status);
        setLikeCount(count);
      } catch (err) {
        console.error("Error fetching likes", err);
      }
    };
    fetchLikes();
  }, [eventId, token]);

  // ✅ Toggle Like
  const handleLike = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login to like events");
      return;
    }
    try {
      const res = await fetch(`/api/likes/${eventId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;

      setLiked((prevLiked) => {
        setLikeCount((prevCount) => (prevLiked ? prevCount - 1 : prevCount + 1));
        return !prevLiked;
      });
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  // ✅ Share
  const handleShare = (e) => {
    e.preventDefault();
    const url = `${window.location.origin}/events/${eventId}`;
    if (navigator.share) {
      navigator.share({
        title: publishedEvent.name,
        text: "Check out this event!",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  return (
    <Link to={`/events/${eventId}`} className="block group">
      <Card className="overflow-hidden bg-gray-900/70 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 max-w-[280px]">
        {/* Image Section */}
        <div className="relative h-[168px] w-full overflow-hidden">
          <RandomEventImage />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Live Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg">
            <Ticket className="size-3" />
            LIVE
          </div>

          {/* Date Chip (Top Right) */}
          {publishedEvent.start && (
            <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm">
              {format(new Date(publishedEvent.start), "MMM d")}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 pb-3">
          <h3 className="text-lg font-bold line-clamp-2 leading-tight text-white group-hover:text-primary transition-colors">
            {publishedEvent.name}
          </h3>

          {/* Venue */}
          <div className="flex items-center gap-2 mt-3 text-gray-400 text-sm">
            <MapPin className="size-4 flex-shrink-0" />
            <span className="line-clamp-1">{publishedEvent.venue}</span>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-3 mt-3 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="size-4" />
              {publishedEvent.start && publishedEvent.end ? (
                <span>
                  {format(new Date(publishedEvent.start), "MMM d")} -{" "}
                  {format(new Date(publishedEvent.end), "MMM d, yyyy")}
                </span>
              ) : (
                "TBA"
              )}
            </div>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-1.5 text-gray-300">
              <Clock3 className="size-4 text-primary" />
              <span className="font-medium">
                {publishedEvent.start
                  ? format(new Date(publishedEvent.start), "hh:mm a")
                  : "TBA"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10 bg-black/30 flex items-center justify-between">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={!token}
            className={`flex items-center gap-1.5 text-sm transition-all ${
              liked ? "text-red-500" : "text-gray-400 hover:text-gray-200"
            } ${!token ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart
              className={`size-4 transition-all ${liked ? "fill-current" : ""}`}
            />
            <span className="font-medium">{likeCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Share2 className="size-4" />
          </button>
        </div>
      </Card>
    </Link>
  );
};

export default PublishedEventCard;