"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { CartDrawer } from "@/components/CartDrawer";
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
import { ProductCard, Product } from "@/components/ProductCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";

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

  // Derive custom categories
  const derivedCategories = [
    { label: "All", value: "" },
    { label: "Sports", value: "sports" },
    { label: "Noise Cancelling", value: "noise-cancelling" },
    ...Array.from(new Set(products.map((p) => p.type).filter(Boolean)))
      .filter((type) => type !== "Wireless Earbuds")
      .map((type) => ({ label: type, value: type })),
  ];

  // Helper to check if a product matches a derived category
  function matchesCategory(product: Product, category: string) {
    if (!category) return true;
    // Assign by ID for demo purposes
    const sportsIds = ["2", "4", "8"]; // TOZO T6, JBL Vibe Beam, Skullcandy Sesh Evo
    const noiseCancellingIds = ["1", "3", "5", "6", "7"]; // Soundcore, AirPods Pro, Beats, Sony, Samsung
    if (category === "sports") {
      return (
        sportsIds.includes(product.id) ||
        product.title.toLowerCase().includes("sport") ||
        product.options?.toLowerCase().includes("sport")
      );
    }
    if (category === "noise-cancelling") {
      return (
        noiseCancellingIds.includes(product.id) ||
        product.title.toLowerCase().includes("noise cancelling")
      );
    }
    // Default: match by type
    return product.type === category;
  }

  // Filter and sort products
  let displayedProducts = products.filter((p) => matchesCategory(p, filterType));
  if (sortBy === "price-asc") {
    displayedProducts = [...displayedProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    displayedProducts = [...displayedProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating-desc") {
    displayedProducts = [...displayedProducts].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  } else if (sortBy === "rating-asc") {
    displayedProducts = [...displayedProducts].sort((a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0));
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
            <CartDrawer
              open={cartDrawerOpen}
              onOpenChange={setCartDrawerOpen}
              cartItems={cartItems}
              products={products}
              onChangeQuantity={handleChangeCartQuantity}
              onRemoveItem={handleRemoveFromCart}
              onShowRemoveItemConfirm={(id) => setShowRemoveItemConfirm({ id })}
              onShowClearCartConfirm={() => setShowClearCartConfirm(true)}
              toast={toast}
            />
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
              {derivedCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
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
              className="outline-none focus:ring-2 focus:ring-blue-500 rounded-lg h-full flex"
              style={{ minHeight: 420 }}
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
          {/* Visually hidden description for accessibility if no product is selected */}
          {!selectedProduct && (
            <DialogDescription className="sr-only">
              Product details dialog
            </DialogDescription>
          )}
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
