"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, cartSubtotal, cartCount } from "@/stores/cart";
import { CheckCircle2, ShoppingBag, Loader2, ArrowLeft, CreditCard } from "lucide-react";
import {
  createOrder,
  getRazorpayKeyId,
  checkRazorpayConfigured,
  createRazorpayOrder,
  verifyAndCreatePaidOrder,
} from "./actions";

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as unknown as Record<string, unknown>).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const subtotal = cartSubtotal(items);
  const count = cartCount(items);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const shippingFee = subtotal >= 999 ? 0 : 50;
  const total = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = "Email is required";
    if (!name) newErrors.name = "Full name is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (!address) newErrors.address = "Street address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!pincode) newErrors.pincode = "Pin code is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsProcessing(true);

    const checkoutDetails = {
      email,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      items: items.map((item) => ({
        id: item.id,
        productSlug: item.productSlug,
        name: item.name,
        variantName: item.variantName,
        priceInr: item.priceInr,
        quantity: item.quantity,
      })),
      subtotal,
      shippingFee,
      total,
    };

    if (paymentMethod === "online") {
      // Razorpay online checkout path
      checkRazorpayConfigured()
        .then(async (configured) => {
          if (!configured) {
            console.warn("[Checkout] Razorpay keys not configured. Simulating transaction.");
            alert(
              "Razorpay payment keys are not configured in your environment. Running in Test Simulation Mode.",
            );

            setTimeout(async () => {
              try {
                const res = await verifyAndCreatePaidOrder(checkoutDetails, {
                  razorpay_order_id: `mock_order_${Math.floor(Math.random() * 1000000)}`,
                  razorpay_payment_id: `mock_pay_${Math.floor(Math.random() * 1000000)}`,
                  razorpay_signature: "mock_signature_verified",
                });
                setIsProcessing(false);
                if (res.success && res.orderNumber) {
                  setOrderId(res.orderNumber);
                  setIsSuccess(true);
                  clear();
                } else {
                  alert(res.error || "Failed to place simulated online order.");
                }
              } catch (err) {
                console.error("[Checkout] Simulated verification failed:", err);
                setIsProcessing(false);
                alert("An error occurred during payment simulation.");
              }
            }, 1200);
            return;
          }

          // Load script dynamically
          const loaded = await loadRazorpayScript();
          if (!loaded) {
            setIsProcessing(false);
            alert("Failed to load Razorpay script. Please check your internet connection.");
            return;
          }

          // Create order on Razorpay
          const rzpOrder = await createRazorpayOrder(total);
          if (!rzpOrder.success || !rzpOrder.orderId) {
            setIsProcessing(false);
            alert(rzpOrder.error || "Failed to initialize Razorpay checkout order.");
            return;
          }

          // Fetch key
          const keyId = await getRazorpayKeyId();
          if (!keyId) {
            setIsProcessing(false);
            alert("Razorpay public Key ID could not be loaded.");
            return;
          }

          // Initialize Checkout Modal
          const options = {
            key: keyId,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            name: "MyFitBoat",
            description: "Zero Sugar Lemonade / Electrolyte Checkout",
            image: "/logo.png",
            order_id: rzpOrder.orderId,
            handler: async function (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) {
              try {
                setIsProcessing(true);
                const verification = await verifyAndCreatePaidOrder(checkoutDetails, {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });

                setIsProcessing(false);
                if (verification.success && verification.orderNumber) {
                  setOrderId(verification.orderNumber);
                  setIsSuccess(true);
                  clear();
                } else {
                  alert(verification.error || "Payment verification failed.");
                }
              } catch (err) {
                console.error("[Checkout] Signature verification failed:", err);
                setIsProcessing(false);
                alert("An error occurred while verifying the payment.");
              }
            },
            prefill: {
              name: name,
              email: email,
              contact: phone,
            },
            notes: {
              address: `${address}, ${city}, ${state} - ${pincode}`,
            },
            theme: {
              color: "#C5A880", // Theme gold
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
                console.log("[Checkout] Razorpay modal dismissed.");
              },
            },
          };

          const rzp = new (
            window as unknown as {
              Razorpay: new (opts: unknown) => { open: () => void };
            }
          ).Razorpay(options);
          rzp.open();
        })
        .catch((err) => {
          console.error("[Checkout] Razorpay initialization failed:", err);
          setIsProcessing(false);
          alert("An error occurred during payment setup.");
        });
    } else {
      // Cash on delivery path
      createOrder(checkoutDetails)
        .then((res) => {
          setIsProcessing(false);
          if (res.success && res.orderNumber) {
            setOrderId(res.orderNumber);
            setIsSuccess(true);
            clear();
          } else {
            alert(res.error || "Failed to place order. Please try again.");
          }
        })
        .catch((err) => {
          console.error("Order insertion request failed:", err);
          setIsProcessing(false);
          alert("An error occurred while placing your order. Please try again.");
        });
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full border border-border bg-surface p-8 text-center space-y-6">
          <CheckCircle2 className="size-16 text-brand mx-auto drop-shadow-[0_0_15px_oklch(0.82_0.16_84/0.2)]" />
          <h1 className="font-display text-4xl uppercase leading-none">Order Placed!</h1>
          <div className="font-mono text-xs uppercase tracking-widest text-brand">
            Order Reference: {orderId}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Your order has been logged into our system. We will dispatch it from our Mumbai center
            within 24 hours. A tracking link will be sent to{" "}
            <span className="text-foreground">{email}</span>.
          </p>

          <div className="border-t border-b border-border/40 py-4 font-mono text-xs text-muted-foreground space-y-2 text-left">
            <div className="flex justify-between">
              <span>Customer name:</span>
              <span className="text-foreground">{name}</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Delivery:</span>
              <span className="text-foreground">3 – 5 Business Days</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="w-full block py-4 bg-brand text-brand-foreground font-display text-base uppercase tracking-wider text-center hover:bg-foreground transition-colors"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center py-20 px-6 text-center">
        <ShoppingBag className="size-12 text-muted-foreground mb-4" />
        <h1 className="font-display text-4xl uppercase leading-none mb-3">No Items in Cart</h1>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs">
          Your cart is currently empty. Visit the shop page to select a pack configuration.
        </p>
        <Link
          href="/shop"
          className="px-8 py-4 bg-brand text-brand-foreground font-display text-base uppercase tracking-wider hover:bg-foreground transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-brand"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Shop</span>
          </Link>
        </div>

        <h1 className="font-display text-5xl md:text-7xl uppercase leading-none tracking-tight mb-12">
          SECURE <span className="text-brand">CHECKOUT</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: SHIPPING FORM */}
          <div className="lg:col-span-7 border border-border p-8 bg-surface">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-display text-2xl uppercase text-foreground mb-4">
                Shipping Information
              </h2>

              {/* Email */}
              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="CONTACT@EXAMPLE.COM"
                  className={`w-full bg-background border px-4 py-3 font-mono text-xs uppercase focus:outline-none placeholder:text-muted-foreground text-foreground ${
                    errors.email ? "border-destructive" : "border-border focus:border-brand"
                  }`}
                />
                {errors.email && (
                  <span className="font-mono text-[9px] text-destructive uppercase tracking-wider block mt-1">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="DISHANT TRIVEDI"
                    className={`w-full bg-background border px-4 py-3 font-mono text-xs uppercase focus:outline-none placeholder:text-muted-foreground text-foreground ${
                      errors.name ? "border-destructive" : "border-border focus:border-brand"
                    }`}
                  />
                  {errors.name && (
                    <span className="font-mono text-[9px] text-destructive uppercase tracking-wider block mt-1">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9157414407"
                    className={`w-full bg-background border px-4 py-3 font-mono text-xs uppercase focus:outline-none placeholder:text-muted-foreground text-foreground ${
                      errors.phone ? "border-destructive" : "border-border focus:border-brand"
                    }`}
                  />
                  {errors.phone && (
                    <span className="font-mono text-[9px] text-destructive uppercase tracking-wider block mt-1">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="B-502, SAFAL PARISAR ROAD"
                  className={`w-full bg-background border px-4 py-3 font-mono text-xs uppercase focus:outline-none placeholder:text-muted-foreground text-foreground ${
                    errors.address ? "border-destructive" : "border-border focus:border-brand"
                  }`}
                />
                {errors.address && (
                  <span className="font-mono text-[9px] text-destructive uppercase tracking-wider block mt-1">
                    {errors.address}
                  </span>
                )}
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="AHMEDABAD"
                    className={`w-full bg-background border px-4 py-3 font-mono text-xs uppercase focus:outline-none placeholder:text-muted-foreground text-foreground ${
                      errors.city ? "border-destructive" : "border-border focus:border-brand"
                    }`}
                  />
                  {errors.city && (
                    <span className="font-mono text-[9px] text-destructive uppercase tracking-wider block mt-1">
                      {errors.city}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">
                    State *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="GUJARAT"
                    className={`w-full bg-background border px-4 py-3 font-mono text-xs uppercase focus:outline-none placeholder:text-muted-foreground text-foreground ${
                      errors.state ? "border-destructive" : "border-border focus:border-brand"
                    }`}
                  />
                  {errors.state && (
                    <span className="font-mono text-[9px] text-destructive uppercase tracking-wider block mt-1">
                      {errors.state}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">
                    Pin Code *
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="380057"
                    className={`w-full bg-background border px-4 py-3 font-mono text-xs uppercase focus:outline-none placeholder:text-muted-foreground text-foreground ${
                      errors.pincode ? "border-destructive" : "border-border focus:border-brand"
                    }`}
                  />
                  {errors.pincode && (
                    <span className="font-mono text-[9px] text-destructive uppercase tracking-wider block mt-1">
                      {errors.pincode}
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <h3 className="font-display text-xl uppercase text-foreground">
                  Select Payment Method
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "online", name: "Pay Online (Cards, UPI, NetBanking)" },
                    { id: "cod", name: "Cash On Delivery (COD)" },
                  ].map((pm) => {
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`p-4 border flex items-center justify-between transition-all font-mono text-xs uppercase cursor-pointer ${
                          isSelected
                            ? "border-brand bg-brand/5 text-foreground"
                            : "border-border hover:border-foreground/30 text-muted-foreground"
                        }`}
                      >
                        <span>{pm.name}</span>
                        <div
                          className={`size-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-brand bg-brand" : "border-border"
                          }`}
                        >
                          {isSelected && (
                            <div className="size-1.5 rounded-full bg-brand-foreground" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-5 bg-brand text-brand-foreground font-display text-xl uppercase tracking-wider hover:bg-foreground hover:text-background transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="size-5" />
                      <span>Complete Order — {inr(total)}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-5 border border-border p-8 bg-surface space-y-6">
            <h2 className="font-display text-2xl uppercase text-foreground">Order Summary</h2>

            <div className="divide-y divide-border/40 max-h-[350px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-4 gap-4">
                  <div>
                    <div className="font-display text-sm uppercase text-foreground leading-none">
                      {item.name}
                    </div>
                    <div className="font-mono text-[9px] uppercase text-muted-foreground mt-1.5">
                      {item.variantName} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-mono text-sm text-foreground shrink-0">
                    {inr(item.priceInr * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-border/40 pt-4 space-y-3 font-mono text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Items count:</span>
                <span className="text-foreground">{count}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-foreground">{inr(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping fee:</span>
                {shippingFee === 0 ? (
                  <span className="text-brand uppercase font-bold">Free Shipping</span>
                ) : (
                  <span className="text-foreground">{inr(shippingFee)}</span>
                )}
              </div>
              <div className="flex justify-between border-t border-border pt-4 text-sm font-bold text-foreground">
                <span className="uppercase">Order Total:</span>
                <span className="text-brand font-mono text-lg">{inr(total)}</span>
              </div>
            </div>

            <div className="bg-background/40 p-4 border border-border/40 rounded text-center">
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest leading-normal">
                Secure SSL checkouts · Free shipping across India on orders over ₹999
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
