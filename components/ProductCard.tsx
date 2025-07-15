import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";

export interface Product {
  id: string;
  image: string;
  title: string;
  type: string;
  quantity: string;
  options: string;
  rating: number;
  reviewCount: number;
  purchaseStats: string;
  price: number;
  originalPrice?: number;
  subscriptionPrice?: number;
  subscriptionDiscount?: string;
  delivery: string;
  fastestDelivery: string;
  badge?: string;
  moreOptions?: string;
  eligibility?: string;
  isTopRated?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <section
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out hover:z-10 focus-within:shadow-2xl focus-within:scale-105 focus-within:-translate-y-1 focus-within:z-10 flex flex-col justify-between min-h-[420px] h-full"
      role="region"
      aria-label={product.title}
    >
      <div className="flex-1 flex flex-col">
        {/* Product Image */}
        <div className="relative mb-3">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-48 object-contain"
          />
          {product.isTopRated && (
            <Badge className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1">
              #1 Top Rated
            </Badge>
          )}
        </div>
        {/* Product Title */}
        <h3 className="text-sm font-normal text-gray-900 mb-2 line-clamp-3 leading-tight">
          {product.title}
        </h3>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge
            variant="secondary"
            className="text-xs bg-gray-100 text-gray-700"
          >
            {product.type}
          </Badge>
          {product.quantity && (
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-700"
            >
              {product.quantity}
            </Badge>
          )}
        </div>
        {/* Options */}
        <p className="text-xs text-gray-600 mb-2">Options: {product.options}</p>
        {/* Rating */}
        <div className="mb-2">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        {/* Purchase Stats */}
        <p className="text-xs text-gray-600 mb-3">{product.purchaseStats}</p>
        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-normal">
              <span className="text-sm align-super">$</span>
              <span className="text-xl">{Math.floor(product.price)}</span>
              <span className="text-sm align-super">
                {(product.price % 1).toFixed(2).slice(1)}
              </span>
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                (${product.originalPrice.toFixed(2)}/ounce)
              </span>
            )}
          </div>
          {product.subscriptionPrice && (
            <p className="text-sm text-gray-700">
              ${product.subscriptionPrice.toFixed(2)} with{" "}
              {product.subscriptionDiscount}
            </p>
          )}
        </div>
        {/* Delivery Info */}
        <div className="mb-3">
          <p className="text-sm font-bold text-gray-900">{product.delivery}</p>
          <p className="text-sm text-gray-600">{product.fastestDelivery}</p>
        </div>
        {/* More Options */}
        {product.moreOptions && (
          <p className="text-sm text-gray-600 mb-2">More Buying Choices</p>
        )}
        {/* Eligibility */}
        {product.eligibility && (
          <p className="text-sm text-gray-600 mb-3">{product.eligibility}</p>
        )}
      </div>
      {/* Add to Cart Button */}
      <Button
        onClick={() => onAddToCart(product.id)}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-normal rounded-full py-3 text-base focus:outline-none active:scale-95 transition-transform duration-200 ease-in-out min-h-[48px] min-w-[48px] sm:min-h-[48px] sm:min-w-[48px] mt-2"
        aria-label={`Add ${product.title} to cart`}
        style={{ minHeight: 48 }} // touch target
      >
        Add to cart
      </Button>
    </section>
  );
} 