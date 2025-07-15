import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { Product } from "./ProductCard";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: { [id: string]: number };
  products: Product[];
  onChangeQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onShowRemoveItemConfirm: (id: string) => void;
  onShowClearCartConfirm: () => void;
  toast: (opts: { title: string; duration?: number }) => void;
}

export function CartDrawer({
  open,
  onOpenChange,
  cartItems,
  products,
  onChangeQuantity,
  onRemoveItem,
  onShowRemoveItemConfirm,
  onShowClearCartConfirm,
  toast,
}: CartDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Cart</DrawerTitle>
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
                    <li key={id} className="flex items-center gap-3 py-3">
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
                                onShowRemoveItemConfirm(product.id);
                              } else {
                                onChangeQuantity(product.id, -1);
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
                              onChangeQuantity(product.id, 1);
                              toast({ title: "Added to cart!", duration: 1000 });
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          aria-label={`Remove ${product.title} from cart`}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          onClick={() => onShowRemoveItemConfirm(product.id)}
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
                      return product ? total + product.price * count : total;
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full mt-4 border border-red-600 text-red-600 bg-white hover:bg-red-600 hover:text-white font-semibold rounded transition-colors"
                onClick={onShowClearCartConfirm}
                aria-label="Clear cart"
              >
                Clear Cart
              </Button>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
} 