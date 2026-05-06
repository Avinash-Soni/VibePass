"use strict";

import * as React from "react";
import { Card } from "./ui/card";
import { Calendar, Heart, MapPin, Share2, Ticket } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";

const PublishedEventCard = ({ publishedEvent }) => {

  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);

  const eventId = publishedEvent.id;
  const token = localStorage.getItem("token");

  // ✅ Fetch initial like status + count
  React.useEffect(() => {
    const fetchLikes = async () => {
      try {
        const statusRes = await fetch(`/api/likes/${eventId}/status`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const countRes = await fetch(`/api/likes/${eventId}/count`);

        let status = false;
        let count = 0;

        if (statusRes.ok) {
          status = await statusRes.json();
        }

        if (countRes.ok) {
          count = await countRes.json();
        }

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
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.error("Like failed");
        return;
      }

      // ✅ Correct state update
      setLiked((prevLiked) => {
        setLikeCount((prevCount) =>
          prevLiked ? prevCount - 1 : prevCount + 1
        );
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
        url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  return (
    <Link to={`/events/${eventId}`} className="block group">
      <Card className="p-0 overflow-hidden max-w-[280px] bg-gray-900/50">

        {/* Image */}
        <div className="relative h-[160px] w-full overflow-hidden">
          <RandomEventImage />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />

          <div className="absolute top-3 left-3 px-2 py-1 bg-primary rounded-full flex items-center gap-1">
            <Ticket className="size-3" />
            <span className="text-[10px] font-bold">Live</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold line-clamp-1">
            {publishedEvent.name}
          </h3>

          <div className="text-xs text-gray-400 mt-2">
            <div className="flex items-center gap-2">
              <MapPin className="size-3" />
              {publishedEvent.venue}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Calendar className="size-3" />
              {publishedEvent.start && publishedEvent.end ? (
                <>
                  {format(new Date(publishedEvent.start), "MMM d")} -{" "}
                  {format(new Date(publishedEvent.end), "MMM d, yyyy")}
                </>
              ) : "TBA"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between px-4 py-3 border-t border-white/10">

          {/* ❤️ Like */}
          <button
            onClick={handleLike}
            disabled={!token}
            className={`flex items-center gap-1 ${
              liked ? "text-red-500" : "text-gray-400"
            } ${!token ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
            <span className="text-xs">{likeCount}</span>
          </button>

          {/* 🔗 Share */}
          <button onClick={handleShare} className="text-gray-400">
            <Share2 className="size-4" />
          </button>

        </div>
      </Card>
    </Link>
  );
};

export default PublishedEventCard;