"use client";

import { useCart, cartSubtotal } from "@/stores/cart";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem } = useCart();
  const subtotal = cartSubtotal(items);

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!isOpen}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] h-dvh w-full max-w-md bg-background border-l border-border transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="font-display text-xl uppercase">Your Cart</div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="hover:text-brand cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60%] text-center px-6">
            <ShoppingBag className="size-12 text-muted-foreground mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Your cart is empty
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="bg-brand text-brand-foreground px-6 py-3 font-display text-sm uppercase tracking-wider"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 h-[calc(100dvh-260px)]">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-border pb-6">
                  <div className="size-20 bg-surface-2 shrink-0 grid place-items-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[8px] font-mono text-muted-foreground">MFB</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm uppercase truncate">{item.name}</div>
                    <div className="font-mono text-[10px] uppercase text-muted-foreground mb-3">
                      {item.variantName}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="p-2 hover:text-brand cursor-pointer"
                          aria-label="Decrease"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="px-3 font-mono text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="p-2 hover:text-brand cursor-pointer"
                          aria-label="Increase"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <div className="font-mono text-sm">{inr(item.priceInr * item.quantity)}</div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="font-mono text-[10px] uppercase text-muted-foreground hover:text-brand mt-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-6 space-y-4 bg-surface">
              <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{inr(subtotal)}</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Shipping calculated at checkout · Free over ₹999
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-brand text-brand-foreground py-4 font-display text-sm uppercase tracking-wider text-center hover:bg-foreground transition-colors"
              >
                Checkout — {inr(subtotal)}
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
