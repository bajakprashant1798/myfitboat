"use client";

import { useState } from "react";
import Link from "next/link";
import { trackOrder, type OrderDetail } from "@/app/checkout/actions";
import {
  ArrowLeft,
  Loader2,
  Package,
  Truck,
  Calendar,
  MapPin,
  CheckCircle,
  Search,
  ShieldCheck,
} from "lucide-react";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderDetail | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) {
      setError("Please fill out both fields.");
      return;
    }

    setError("");
    setIsSearching(true);
    setOrder(null);

    trackOrder(orderNumber, email)
      .then((res) => {
        setIsSearching(false);
        if (res.success && res.order) {
          setOrder(res.order);
        } else {
          setError(res.error || "Order not found. Verify your entry.");
        }
      })
      .catch((err) => {
        console.error("Track request error:", err);
        setIsSearching(false);
        setError("A connection error occurred. Try again.");
      });
  };

  // Helper to determine status step indexes
  // Statuses: 'pending', 'pending_upi', 'pending_cod', 'processing', 'shipped', 'delivered', 'cancelled'
  const getStatusStep = (status: string) => {
    const s = status.toLowerCase();
    if (s === "delivered") return 4;
    if (s === "shipped") return 3;
    if (s === "processing") return 2;
    if (s.startsWith("pending") || s === "paid") return 1;
    return 1;
  };

  const currentStep = order ? getStatusStep(order.status) : 1;

  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-brand"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <h1 className="font-display text-5xl md:text-7xl uppercase leading-none tracking-tight mb-4">
          TRACK <span className="text-brand">ORDER</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mb-12">
          Enter your unique order reference code and the email address used during purchase to
          monitor your shipment status.
        </p>

        {/* LOOKUP FORM */}
        {!order && (
          <div className="border border-border bg-surface p-8 max-w-xl">
            <form onSubmit={handleLookup} className="space-y-6">
              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">
                  Order Number / Reference *
                </label>
                <input
                  type="text"
                  placeholder="MFB-123456"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 font-mono text-xs uppercase focus:outline-none focus:border-brand text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="YOU@EXAMPLE.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 font-mono text-xs uppercase focus:outline-none focus:border-brand text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-mono uppercase tracking-wider">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-4 bg-brand text-brand-foreground font-display text-lg uppercase tracking-wider hover:bg-foreground hover:text-background transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Searching database...</span>
                  </>
                ) : (
                  <>
                    <Search className="size-4" />
                    <span>Track Order</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ORDER DETAILS SCREEN */}
        {order && (
          <div className="space-y-8 animate-fade-up">
            {/* Header info card */}
            <div className="border border-border bg-surface p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  Order Number:
                </div>
                <div className="font-display text-2xl text-brand uppercase mt-1">
                  {order.order_number}
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  Status:
                </div>
                <span className="inline-block mt-1 font-mono text-xs uppercase tracking-wider px-3 py-1 border border-brand bg-brand/5 text-brand">
                  {order.status}
                </span>
              </div>
              <button
                onClick={() => setOrder(null)}
                className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-brand transition-colors pt-2 md:pt-0 self-end md:self-auto cursor-pointer"
              >
                Search Another Order
              </button>
            </div>

            {/* PROGRESS VISUAL TIMELINE */}
            <div className="border border-border bg-surface p-8">
              <h2 className="font-display text-xl uppercase mb-8">Delivery Progress</h2>
              <div className="relative">
                {/* Connecting lines */}
                <div className="absolute top-5 left-6 right-6 h-0.5 bg-border -z-10 hidden md:block" />
                <div
                  className="absolute top-5 left-6 h-0.5 bg-brand -z-10 hidden md:block transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
                  {/* Step 1: Placed */}
                  <div className="flex md:flex-col items-center gap-4 md:text-center">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center border transition-all ${
                        currentStep >= 1
                          ? "border-brand bg-brand text-brand-foreground shadow-[0_0_15px_oklch(0.82_0.16_84/0.2)]"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <Package className="size-4" />
                    </div>
                    <div>
                      <div className="font-display text-base uppercase text-foreground leading-none">
                        Placed
                      </div>
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-muted-foreground mt-1">
                        Order received
                      </span>
                    </div>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="flex md:flex-col items-center gap-4 md:text-center">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center border transition-all ${
                        currentStep >= 2
                          ? "border-brand bg-brand text-brand-foreground shadow-[0_0_15px_oklch(0.82_0.16_84/0.2)]"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <ShieldCheck className="size-4" />
                    </div>
                    <div>
                      <div className="font-display text-base uppercase text-foreground leading-none">
                        Processing
                      </div>
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-muted-foreground mt-1">
                        Quality checks
                      </span>
                    </div>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="flex md:flex-col items-center gap-4 md:text-center">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center border transition-all ${
                        currentStep >= 3
                          ? "border-brand bg-brand text-brand-foreground shadow-[0_0_15px_oklch(0.82_0.16_84/0.2)]"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <Truck className="size-4" />
                    </div>
                    <div>
                      <div className="font-display text-base uppercase text-foreground leading-none">
                        Shipped
                      </div>
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-muted-foreground mt-1">
                        In transit
                      </span>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex md:flex-col items-center gap-4 md:text-center">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center border transition-all ${
                        currentStep >= 4
                          ? "border-brand bg-brand text-brand-foreground shadow-[0_0_15px_oklch(0.82_0.16_84/0.2)]"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <CheckCircle className="size-4" />
                    </div>
                    <div>
                      <div className="font-display text-base uppercase text-foreground leading-none">
                        Delivered
                      </div>
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-muted-foreground mt-1">
                        Package received
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COURIER & DELIVERY DETAILS */}
            {order.carrier && (
              <div className="border border-border bg-surface p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    <Truck className="size-3.5 text-brand" />
                    <span>Courier Service</span>
                  </div>
                  <div className="font-display text-lg uppercase text-foreground">
                    {order.carrier}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    <Package className="size-3.5 text-brand" />
                    <span>Tracking Number</span>
                  </div>
                  <div className="font-mono text-sm text-foreground">{order.tracking_number}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    <Calendar className="size-3.5 text-brand" />
                    <span>Estimated Delivery</span>
                  </div>
                  <div className="font-display text-lg uppercase text-brand">
                    {order.estimated_delivery || "3-5 Business Days"}
                  </div>
                </div>
              </div>
            )}

            {/* SHIPPING DESTINATION & ITEMS SUMMARY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Shipping Address */}
              <div className="lg:col-span-5 border border-border bg-surface p-6 space-y-4">
                <h3 className="font-display text-lg uppercase flex items-center gap-2 border-b border-border/40 pb-2">
                  <MapPin className="size-4 text-brand" />
                  <span>Delivery Address</span>
                </h3>
                <div className="font-mono text-xs uppercase text-muted-foreground space-y-1.5 leading-relaxed">
                  <div className="text-foreground font-bold">{order.customer_name}</div>
                  <div>{order.shipping_address?.address_line}</div>
                  <div>
                    {order.shipping_address?.city}, {order.shipping_address?.state} -{" "}
                    {order.shipping_address?.pincode}
                  </div>
                  <div className="pt-2">Phone: {order.phone}</div>
                  <div>Pay Type: {order.shipping_address?.payment_method}</div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="lg:col-span-7 border border-border bg-surface p-6 space-y-4">
                <h3 className="font-display text-lg uppercase border-b border-border/40 pb-2">
                  Order Items
                </h3>
                <div className="divide-y divide-border/30">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3">
                      <div>
                        <div className="font-display text-sm uppercase text-foreground leading-none">
                          {item.name}
                        </div>
                        <div className="font-mono text-[9px] uppercase text-muted-foreground mt-1">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                      <div className="font-mono text-xs text-brand">
                        {inr(item.line_total_inr || item.unit_price_inr * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/40 pt-4 font-mono text-[11px] text-muted-foreground space-y-1.5">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-foreground">{inr(order.subtotal_inr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="text-foreground">{inr(order.shipping_inr)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/40 pt-3 text-xs font-bold text-foreground">
                    <span className="uppercase">Total:</span>
                    <span className="text-brand text-sm">{inr(order.total_inr)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
