import { Star } from "lucide-react";
import React from "react";

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

export function StarRating({ rating, reviewCount }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div
      className="flex items-center gap-1 text-sm"
      aria-label={`Rated ${rating} out of 5 stars with ${reviewCount} reviews`}
    >
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? "fill-orange-400 text-orange-400"
                : i === fullStars && hasHalfStar
                ? "fill-orange-400/50 text-orange-400"
                : "fill-gray-200 text-gray-200"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="text-blue-600 hover:text-orange-600 cursor-pointer">
        {reviewCount.toLocaleString()}
      </span>
    </div>
  );
} 