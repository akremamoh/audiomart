"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useState, useEffect } from "react";
import { ShoppingCart, Star, Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRef } from "react";

interface Product {
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

function StarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
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

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (id: string) => void;
}) {
  return (
    <section
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out hover:z-10 focus-within:shadow-2xl focus-within:scale-105 focus-within:-translate-y-1 focus-within:z-10"
      role="region"
      aria-label={product.title}
    >
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
      {/* Add to Cart Button */}
      <Button
        onClick={() => onAddToCart(product.id)}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-normal rounded-full py-3 text-base focus:outline-none active:scale-95 transition-transform duration-200 ease-in-out min-h-[48px] min-w-[48px] sm:min-h-[48px] sm:min-w-[48px]"
        aria-label={`Add ${product.title} to cart`}
        style={{ minHeight: 48 }} // touch target
      >
        Add to cart
      </Button>
    </section>
  );
}

function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-end mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm
      </Button>
    </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProductGrid() {
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ [id: string]: number }>({});
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const [showRemoveItemConfirm, setShowRemoveItemConfirm] = useState<{
    id: string | null;
  }>({ id: null });
  const pendingRemoveId = useRef<string | null>(null);

  // Load cart count and cart items from localStorage on mount
  useEffect(() => {
    const storedCount = localStorage.getItem("cartCount");
    if (storedCount) {
      setCartCount(Number(storedCount));
    }
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      setCartItems(JSON.parse(storedItems));
    }
  }, []);

  // Fetch products from JSON file
  useEffect(() => {
    fetch("/products.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (productId: string) => {
    setCartCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem("cartCount", newCount.toString());
      return newCount;
    });
    setCartItems((prev) => {
      const newItems = { ...prev, [productId]: (prev[productId] || 0) + 1 };
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      return newItems;
    });
    toast({ title: "Added to cart!", duration: 1000 });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => {
      const newItems = { ...prev };
      delete newItems[productId];
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      // Update cart count
      const newCount = Object.values(newItems).reduce(
        (sum, qty) => sum + qty,
        0,
      );
      setCartCount(newCount);
      localStorage.setItem("cartCount", newCount.toString());
      return newItems;
    });
  };

  const handleChangeCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      const newItems = { ...prev };
      const newQty = (newItems[productId] || 0) + delta;
      if (newQty <= 0) {
        delete newItems[productId];
      } else {
        newItems[productId] = newQty;
      }
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      // Update cart count
      const newCount = Object.values(newItems).reduce(
        (sum, qty) => sum + qty,
        0,
      );
      setCartCount(newCount);
      localStorage.setItem("cartCount", newCount.toString());
      return newItems;
    });
  };

  // Get unique product types for filter dropdown
  const productTypes = Array.from(
    new Set(products.map((p) => p.type).filter(Boolean)),
  );

  // Filter and sort products
  let displayedProducts = products.filter(
    (p) => !filterType || p.type === filterType,
  );
  if (sortBy === "price-asc") {
    displayedProducts = [...displayedProducts].sort(
      (a, b) => a.price - b.price,
    );
  } else if (sortBy === "price-desc") {
    displayedProducts = [...displayedProducts].sort(
      (a, b) => b.price - a.price,
    );
  } else if (sortBy === "rating-desc") {
    displayedProducts = [...displayedProducts].sort(
      (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0),
    );
    console.log(
      "Sorted by rating desc",
      displayedProducts.map((p) => p.rating),
    );
  } else if (sortBy === "rating-asc") {
    displayedProducts = [...displayedProducts].sort(
      (a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0),
    );
    console.log(
      "Sorted by rating asc",
      displayedProducts.map((p) => p.rating),
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">AudioMart</h1>
          <div className="relative">
            <button
              className="relative focus:outline-none active:scale-95 transition-transform group"
              aria-label="Open cart"
              onClick={() => setCartDrawerOpen(true)}
              style={{ minWidth: 48, minHeight: 48 }} // touch target
            >
              <ShoppingCart className="w-6 h-6 transition-transform duration-200 group-hover:scale-125 group-hover:-rotate-12" aria-label="Shopping cart" />
            {cartCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full"
                  aria-live="polite"
                  aria-atomic="true"
                >
                {cartCount}
              </Badge>
            )}
            </button>
            <Drawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Cart</DrawerTitle>
                  <DialogDescription>
                    This is your shopping cart. Review your items and proceed to checkout when ready.
                  </DialogDescription>
                  <DrawerClose className="absolute right-4 top-4">
                    Close
                  </DrawerClose>
                </DrawerHeader>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  {Object.keys(cartItems).length === 0 ? (
                    <p className="text-gray-600">Your cart is empty.</p>
                  ) : (
                    <>
                      <ul className="divide-y divide-gray-200">
                        {Object.entries(cartItems).map(([id, count]) => {
                          const product = products.find((p) => p.id === id);
                          if (!product) return null;
                          const subtotal = product.price * count;
                          return (
                            <li
                              key={id}
                              className="flex items-center gap-3 py-3"
                            >
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-16 h-16 object-contain rounded border"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 truncate">
                                  {product.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Unit: ${product.price.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Subtotal: ${subtotal.toFixed(2)}
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-1">
                                  <button
                                    aria-label={`Decrease quantity of ${product.title}`}
                                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                    onClick={() => {
                                      if (count === 1) {
                                        setShowRemoveItemConfirm({
                                          id: product.id,
                                        });
                                      } else {
                                        handleChangeCartQuantity(
                                          product.id,
                                          -1,
                                        );
                                      }
                                    }}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="text-sm font-bold w-6 text-center">
                                    {count}
                                  </span>
                                  <button
                                    aria-label={`Increase quantity of ${product.title}`}
                                    className="text-gray-400 hover:text-green-600 transition-colors p-1"
                                    onClick={() => {
                                      handleChangeCartQuantity(product.id, 1);
                                      toast({
                                        title: "Added to cart!",
                                        duration: 1000,
                                      });
                                    }}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                <button
                                  aria-label={`Remove ${product.title} from cart`}
                                  className="text-gray-400 hover:text-red-600 transition-colors"
                                  onClick={() => setShowRemoveItemConfirm({ id: product.id })}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="flex justify-between items-center mt-6 pt-4 border-t font-bold text-base">
                        <span>Total</span>
                        <span>
                          $
                          {Object.entries(cartItems)
                            .reduce((total, [id, count]) => {
                              const product = products.find((p) => p.id === id);
                              return product
                                ? total + product.price * count
                                : total;
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <Button
                        className="w-full mt-4 border border-red-600 text-red-600 bg-white hover:bg-red-600 hover:text-white font-semibold rounded transition-colors"
                        onClick={() => setShowClearCartConfirm(true)}
                        aria-label="Clear cart"
                      >
                        Clear Cart
                      </Button>
                    </>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4" role="main">
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Results for "wireless earbuds"
          </h2>
          <p className="text-sm text-gray-600">1-8 of over 50,000 results</p>
        </div>
        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by type:</span>
            <select
              className="border rounded px-2 py-1"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All</option>
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              className="border rounded px-2 py-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
            </select>
          </label>
        </div>
        {/* Product Grid */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
          aria-label="Product results"
        >
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${product.title}`}
              onClick={(e) => {
                // Only open modal if the click is not on the Add to Cart button
                if ((e.target as HTMLElement).closest("button")) return;
                setSelectedProduct(product);
                setDetailsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedProduct(product);
                  setDetailsOpen(true);
                }
              }}
              onMouseEnter={() => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
                setHoveredProduct(product);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => setHoveredProduct(null), 150);
                setHoverTimeout(timeout);
              }}
              className="outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            >
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </section>
      </main>
      <Dialog
        open={!!selectedProduct}
        onOpenChange={(open) =>
          setSelectedProduct(open ? selectedProduct : null)
        }
      >
        <DialogContent className="max-w-2xl w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.title}</DialogTitle>
                <DialogDescription>
                  {selectedProduct.type}{" "}
                  {selectedProduct.quantity
                    ? `| ${selectedProduct.quantity}`
                    : ""}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-40 h-40 object-contain rounded border bg-white mx-auto"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="text-lg font-semibold text-gray-900">
                    ${selectedProduct.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-700">
                    Options: {selectedProduct.options}
                  </div>
                  <div className="text-sm text-gray-700">
                    {selectedProduct.purchaseStats}
                  </div>
                  <div className="text-sm text-gray-700">
                    {selectedProduct.delivery}{" "}
                    {selectedProduct.fastestDelivery &&
                      `| ${selectedProduct.fastestDelivery}`}
                  </div>
                  <div className="text-sm text-gray-700">
                    {selectedProduct.eligibility}
                  </div>
                  <div className="text-sm text-gray-700">
                    {selectedProduct.moreOptions}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-normal rounded-full py-2 text-base focus:outline-none active:scale-95 transition-transform"
                      aria-label={`Add ${selectedProduct.title} to cart`}
                      onClick={() => handleAddToCart(selectedProduct.id)}
                    >
                      Add to cart
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={showClearCartConfirm}
        title="Clear Cart?"
        description="Are you sure you want to remove all items from your cart? This action cannot be undone."
        onConfirm={() => {
          setCartItems({});
          setCartCount(0);
          localStorage.setItem("cartItems", JSON.stringify({}));
          localStorage.setItem("cartCount", "0");
          setShowClearCartConfirm(false);
        }}
        onCancel={() => setShowClearCartConfirm(false)}
      />
      <ConfirmDialog
        open={!!showRemoveItemConfirm.id}
        title="Remove Item?"
        description="Are you sure you want to remove this item from your cart?"
        onConfirm={() => {
          if (showRemoveItemConfirm.id) {
            handleRemoveFromCart(showRemoveItemConfirm.id);
            setShowRemoveItemConfirm({ id: null });
          }
        }}
        onCancel={() => setShowRemoveItemConfirm({ id: null })}
      />
    </div>
  );
}
