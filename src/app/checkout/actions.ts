"use server";

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Helper functions for Razorpay integration
export async function getRazorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID || null;
}

export async function checkRazorpayConfigured() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return !!(keyId && keySecret && keyId.trim() !== "" && keySecret.trim() !== "");
}

// Action to create Razorpay Order
export async function createRazorpayOrder(amountInr: number) {
  console.log("[Razorpay Action] Creating order for amount:", amountInr);

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error("[Razorpay Action] Missing Razorpay Key ID or Secret.");
    return {
      success: false,
      error: "Razorpay credentials are not configured on the server.",
    };
  }

  try {
    const amountInPaise = Math.round(amountInr * 100);
    const receipt = `rcpt_${Math.floor(100000 + Math.random() * 900000)}`;

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: receipt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Razorpay Action] Razorpay API Error:", errorText);
      throw new Error(`Razorpay API responded with status ${response.status}: ${errorText}`);
    }

    const orderData = await response.json();
    console.log("[Razorpay Action] Razorpay Order created successfully:", orderData.id);

    return {
      success: true,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
    };
  } catch (error: unknown) {
    console.error("[Razorpay Action] Exception occurred:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to create Razorpay order.";
    return {
      success: false,
      error: errMessage,
    };
  }
}

// Action to verify signature and save paid order in database
export async function verifyAndCreatePaidOrder(
  details: CheckoutDetails,
  razorpayPayment: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
) {
  console.log(
    "[Razorpay Action] Verifying payment for order ID:",
    razorpayPayment.razorpay_order_id,
  );

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // 1. Signature Verification
  if (keySecret) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = razorpayPayment;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256", keySecret).update(body).digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("[Razorpay Action] Signature verification failed!");
      return {
        success: false,
        error: "Payment verification failed. Invalid signature.",
      };
    }
    console.log("[Razorpay Action] Signature verification succeeded!");
  } else {
    console.warn(
      "[Razorpay Action] No Razorpay Key Secret found. Skipping signature verification (simulation/dev mode).",
    );
  }

  // 2. Insert order
  if (!hasServerConfig()) {
    console.warn(
      "[Checkout Action] Server is missing Supabase keys. Simulating order placement in memory.",
    );
    const mockOrderNum = `MFB-${Math.floor(100000 + Math.random() * 900000)}`;
    const mockOrder = {
      id: genMockUuid(),
      order_number: mockOrderNum,
      email: details.email,
      customer_name: details.name,
      phone: details.phone,
      shipping_address: {
        address_line: details.address,
        city: details.city,
        state: details.state,
        pincode: details.pincode,
        payment_method: details.paymentMethod,
      },
      subtotal_inr: details.subtotal,
      shipping_inr: details.shippingFee,
      tax_inr: 0,
      total_inr: details.total,
      status: "paid",
      currency: "INR",
      created_at: new Date().toISOString(),
      tracking_number: null,
      carrier: null,
      estimated_delivery: null,
      razorpay_order_id: razorpayPayment.razorpay_order_id,
      razorpay_payment_id: razorpayPayment.razorpay_payment_id,
      razorpay_signature: razorpayPayment.razorpay_signature,
      order_items: details.items.map((item) => ({
        id: genMockUuid(),
        name: `${item.name} (${item.variantName})`,
        quantity: item.quantity,
        unit_price_inr: item.priceInr,
        line_total_inr: item.priceInr * item.quantity,
      })),
    };
    simulatedOrders.unshift(mockOrder); // Save to local array
    return {
      success: true,
      orderNumber: mockOrderNum,
      isSimulated: true,
      message: "Order simulated successfully (local fallback active).",
    };
  }

  try {
    const shippingAddress = {
      address_line: details.address,
      city: details.city,
      state: details.state,
      pincode: details.pincode,
      payment_method: details.paymentMethod,
    };

    const { data: dbProducts } = await supabaseAdmin
      .from("products")
      .select("id, slug")
      .eq("is_active", true);

    const { data: dbVariants } = await supabaseAdmin
      .from("product_variants")
      .select("id, name, product_id");

    const findProductUuid = (slug: string) => dbProducts?.find((p) => p.slug === slug)?.id || null;
    const findVariantUuid = (name: string, productId: string | null) => {
      if (!productId) return null;
      return (
        dbVariants?.find(
          (v) => v.product_id === productId && v.name.toLowerCase() === name.toLowerCase(),
        )?.id || null
      );
    };

    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        email: details.email,
        customer_name: details.name,
        phone: details.phone,
        shipping_address: shippingAddress,
        subtotal_inr: details.subtotal,
        shipping_inr: details.shippingFee,
        tax_inr: 0,
        total_inr: details.total,
        status: "paid",
        currency: "INR",
        razorpay_order_id: razorpayPayment.razorpay_order_id,
        razorpay_payment_id: razorpayPayment.razorpay_payment_id,
        razorpay_signature: razorpayPayment.razorpay_signature,
      })
      .select("id, order_number")
      .single();

    if (orderError) {
      console.error("[Checkout Action] Error inserting order:", orderError);
      throw new Error(`Order insertion failed: ${orderError.message}`);
    }

    if (!newOrder) {
      throw new Error("Order creation succeeded but returned no data.");
    }

    console.log("[Checkout Action] Created order record:", newOrder.order_number);

    const itemsToInsert = details.items.map((item) => {
      const productId = findProductUuid(item.productSlug);
      const variantId = findVariantUuid(item.variantName, productId);

      return {
        order_id: newOrder.id,
        product_id: productId,
        variant_id: variantId,
        name: `${item.name} (${item.variantName})`,
        quantity: item.quantity,
        unit_price_inr: item.priceInr,
        line_total_inr: item.priceInr * item.quantity,
      };
    });

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(itemsToInsert);

    if (itemsError) {
      console.error("[Checkout Action] Error inserting order line items:", itemsError);
      throw new Error(`Order items insertion failed: ${itemsError.message}`);
    }

    console.log("[Checkout Action] Inserted order items successfully.");

    return {
      success: true,
      orderNumber: newOrder.order_number,
      isSimulated: false,
    };
  } catch (err: unknown) {
    console.error("[Checkout Action] Fatal error placing order:", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred during order creation.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Define input interfaces
export interface CheckoutItem {
  id: string;
  productSlug: string;
  name: string;
  variantName: string;
  priceInr: number;
  quantity: number;
}

export interface CheckoutDetails {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  items: CheckoutItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

export interface OrderDetail {
  id: string;
  order_number: string;
  email: string;
  customer_name: string | null;
  phone: string | null;
  status: string;
  total_inr: number;
  subtotal_inr: number;
  shipping_inr: number;
  created_at: string;
  carrier: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  shipping_address?: {
    address_line?: string;
    city?: string;
    state?: string;
    pincode?: string;
    payment_method?: string;
  };
  order_items: Array<{
    id?: string;
    name: string;
    quantity: number;
    unit_price_inr: number;
    line_total_inr?: number;
  }>;
}

export interface NewProductDetails {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  priceInr: number;
  compareAtPriceInr: number | null;
  imageUrl: string;
  badges: string;
  servingSize?: string;
  servingsPerPack?: number;
  isFeatured?: boolean;
}

// Function to check if server-side Supabase environment keys are set up
function hasServerConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key);
}

// Check admin password
function verifyAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_ACCESS_PASSWORD || "mfb-admin-2026";
  return password === adminPassword;
}

// Memory cache for simulated orders in development if database is not active
const simulatedOrders: OrderDetail[] = [];

// 1. PLACE AN ORDER
export async function createOrder(details: CheckoutDetails) {
  console.log("[Checkout Action] Processing order request for:", details.email);

  if (!hasServerConfig()) {
    console.warn(
      "[Checkout Action] Server is missing Supabase keys. Simulating order placement in memory.",
    );
    const mockOrderNum = `MFB-${Math.floor(100000 + Math.random() * 900000)}`;
    const mockOrder = {
      id: genMockUuid(),
      order_number: mockOrderNum,
      email: details.email,
      customer_name: details.name,
      phone: details.phone,
      shipping_address: {
        address_line: details.address,
        city: details.city,
        state: details.state,
        pincode: details.pincode,
        payment_method: details.paymentMethod,
      },
      subtotal_inr: details.subtotal,
      shipping_inr: details.shippingFee,
      tax_inr: 0,
      total_inr: details.total,
      status: details.paymentMethod === "cod" ? "pending_cod" : "pending_upi",
      currency: "INR",
      created_at: new Date().toISOString(),
      tracking_number: null,
      carrier: null,
      estimated_delivery: null,
      order_items: details.items.map((item) => ({
        id: genMockUuid(),
        name: `${item.name} (${item.variantName})`,
        quantity: item.quantity,
        unit_price_inr: item.priceInr,
        line_total_inr: item.priceInr * item.quantity,
      })),
    };
    simulatedOrders.unshift(mockOrder); // Save to local array
    return {
      success: true,
      orderNumber: mockOrderNum,
      isSimulated: true,
      message: "Order simulated successfully (local fallback active).",
    };
  }

  try {
    const shippingAddress = {
      address_line: details.address,
      city: details.city,
      state: details.state,
      pincode: details.pincode,
      payment_method: details.paymentMethod,
    };

    const { data: dbProducts } = await supabaseAdmin
      .from("products")
      .select("id, slug")
      .eq("is_active", true);

    const { data: dbVariants } = await supabaseAdmin
      .from("product_variants")
      .select("id, name, product_id");

    const findProductUuid = (slug: string) => dbProducts?.find((p) => p.slug === slug)?.id || null;
    const findVariantUuid = (name: string, productId: string | null) => {
      if (!productId) return null;
      return (
        dbVariants?.find(
          (v) => v.product_id === productId && v.name.toLowerCase() === name.toLowerCase(),
        )?.id || null
      );
    };

    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        email: details.email,
        customer_name: details.name,
        phone: details.phone,
        shipping_address: shippingAddress,
        subtotal_inr: details.subtotal,
        shipping_inr: details.shippingFee,
        tax_inr: 0,
        total_inr: details.total,
        status: details.paymentMethod === "cod" ? "pending_cod" : "pending_upi",
        currency: "INR",
      })
      .select("id, order_number")
      .single();

    if (orderError) {
      console.error("[Checkout Action] Error inserting order:", orderError);
      throw new Error(`Order insertion failed: ${orderError.message}`);
    }

    if (!newOrder) {
      throw new Error("Order creation succeeded but returned no data.");
    }

    console.log("[Checkout Action] Created order record:", newOrder.order_number);

    const itemsToInsert = details.items.map((item) => {
      const productId = findProductUuid(item.productSlug);
      const variantId = findVariantUuid(item.variantName, productId);

      return {
        order_id: newOrder.id,
        product_id: productId,
        variant_id: variantId,
        name: `${item.name} (${item.variantName})`,
        quantity: item.quantity,
        unit_price_inr: item.priceInr,
        line_total_inr: item.priceInr * item.quantity,
      };
    });

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(itemsToInsert);

    if (itemsError) {
      console.error("[Checkout Action] Error inserting order line items:", itemsError);
      throw new Error(`Order items insertion failed: ${itemsError.message}`);
    }

    console.log("[Checkout Action] Inserted order items successfully.");

    return {
      success: true,
      orderNumber: newOrder.order_number,
      isSimulated: false,
    };
  } catch (err: unknown) {
    console.error("[Checkout Action] Fatal error placing order:", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred during order creation.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// 2. GUEST TRACK AN ORDER
export async function trackOrder(orderNumber: string, email: string) {
  console.log(`[Track Action] Looking up order: ${orderNumber} for email: ${email}`);

  const cleanOrderNum = orderNumber.toUpperCase().trim();
  const cleanEmail = email.toLowerCase().trim();

  // If local fallback is active, check memory array first, then static mock
  if (!hasServerConfig()) {
    const memoryMatch = simulatedOrders.find(
      (o) => o.order_number === cleanOrderNum && o.email.toLowerCase().trim() === cleanEmail,
    );
    if (memoryMatch) return { success: true, order: memoryMatch };

    // Standard static order for demonstration
    if (cleanOrderNum === "MFB-123456" && cleanEmail === "dishant@myfitboat.com") {
      return {
        success: true,
        order: {
          id: "mock-order-static-1",
          order_number: "MFB-123456",
          customer_name: "Dishant Trivedi",
          email: "dishant@myfitboat.com",
          phone: "9157414407",
          status: "shipped",
          total_inr: 680,
          shipping_inr: 0,
          subtotal_inr: 680,
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          carrier: "Delhivery Express",
          tracking_number: "987654321011",
          estimated_delivery: "June 15, 2026",
          shipping_address: {
            address_line: "B-502, Safal Parisar Road",
            city: "Ahmedabad",
            state: "Gujarat",
            pincode: "380057",
            payment_method: "upi",
          },
          order_items: [
            {
              id: "mock-order-item-static-1",
              name: "Zero Sugar Lemonade - Potassium Rich Electrolyte (30 Sachets Pack)",
              quantity: 1,
              unit_price_inr: 680,
              line_total_inr: 680,
            },
          ],
        },
      };
    }

    return {
      success: false,
      error: "Order details not found. Enter MFB-123456 and dishant@myfitboat.com to test.",
    };
  }

  try {
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", cleanOrderNum)
      .eq("email", cleanEmail)
      .maybeSingle();

    if (error) throw error;
    if (!order) {
      return {
        success: false,
        error: "No matching order found for this number and email.",
      };
    }

    return {
      success: true,
      order: order as unknown as OrderDetail,
    };
  } catch (err: unknown) {
    console.error("[Track Action] Error tracking order:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error reading database.",
    };
  }
}

// 3. ADMIN LIST ORDERS
export async function adminListOrders(password: string) {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Access Denied: Invalid credentials." };
  }

  if (!hasServerConfig()) {
    // Return custom memory orders merged with seed logs
    const mockSeed = [
      {
        id: "mock-order-seed-1",
        order_number: "MFB-123456",
        customer_name: "Dishant Trivedi",
        email: "dishant@myfitboat.com",
        phone: "9157414407",
        status: "shipped",
        total_inr: 680,
        shipping_inr: 0,
        subtotal_inr: 680,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        carrier: "Delhivery Express",
        tracking_number: "987654321011",
        estimated_delivery: "June 15, 2026",
        shipping_address: {
          address_line: "B-502, Safal Parisar Road",
          city: "Ahmedabad",
          state: "Gujarat",
          pincode: "380057",
          payment_method: "upi",
        },
        order_items: [
          {
            name: "Zero Sugar Lemonade (30 Sachets Pack)",
            quantity: 1,
            unit_price_inr: 680,
          },
        ],
      },
    ];
    return { success: true, orders: [...simulatedOrders, ...mockSeed] };
  }

  try {
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, orders: orders as unknown as OrderDetail[] };
  } catch (err: unknown) {
    console.error("[Admin List Orders] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error fetching orders list.",
    };
  }
}

// 4. ADMIN UPDATE ORDER STATUS
export async function adminUpdateOrderStatus(
  password: string,
  orderId: string,
  status: string,
  carrier?: string,
  trackingNumber?: string,
  estimatedDelivery?: string,
) {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Access Denied: Invalid credentials." };
  }

  if (!hasServerConfig()) {
    // Update memory cache
    const match = simulatedOrders.find((o) => o.id === orderId);
    if (match) {
      match.status = status;
      match.carrier = carrier || null;
      match.tracking_number = trackingNumber || null;
      match.estimated_delivery = estimatedDelivery || null;
      return { success: true, isSimulated: true };
    }
    return { success: true, message: "Mock status logged in console." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        carrier: carrier || null,
        tracking_number: trackingNumber || null,
        estimated_delivery: estimatedDelivery || null,
      })
      .eq("id", orderId);

    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    console.error("[Admin Update Status] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update database record.",
    };
  }
}

// 5. ADMIN ADD NEW PRODUCT
export async function adminAddProduct(password: string, details: NewProductDetails) {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Access Denied: Invalid credentials." };
  }

  if (!hasServerConfig()) {
    console.warn("[Admin Add Product] Database missing. Simulating add.");
    return {
      success: true,
      productId: "mock-new-product-id",
      isSimulated: true,
      message: "Successfully simulated. Connect database to make it appear dynamically.",
    };
  }

  try {
    // Parse badges as array JSON
    const badgesArray = details.badges
      ? details.badges.split(",").map((s: string) => s.trim())
      : ["Zero Sugar", "Keto Friendly"];

    // 1. Insert product record
    const { data: newProd, error: prodError } = await supabaseAdmin
      .from("products")
      .insert({
        name: details.name,
        slug: details.slug,
        tagline: details.tagline,
        description: details.description,
        long_description: details.longDescription,
        price_inr: details.priceInr,
        compare_at_price_inr: details.compareAtPriceInr || null,
        image_url: details.imageUrl || "/product/Box_Sachet_Front-image-1.jpg",
        badges: badgesArray,
        gallery: [details.imageUrl || "/product/Box_Sachet_Front-image-1.jpg"],
        serving_size: details.servingSize || "5g sachet",
        servings_per_pack: details.servingsPerPack || 10,
        is_featured: details.isFeatured || false,
        is_active: true,
      })
      .select("id")
      .single();

    if (prodError) throw prodError;

    // 2. Insert variants for this product
    const variants = [
      {
        product_id: newProd.id,
        name: "10 Sachets Pack",
        price_inr: details.priceInr,
        compare_at_price_inr: details.compareAtPriceInr || null,
        servings: 10,
        badge: "Intro Pack",
        is_default: true,
        sku: `${details.slug}-10`,
      },
      {
        product_id: newProd.id,
        name: "20 Sachets Pack",
        price_inr: Math.round(details.priceInr * 1.8),
        compare_at_price_inr: details.compareAtPriceInr ? details.compareAtPriceInr * 2 : null,
        servings: 20,
        badge: "Value Pack",
        is_default: false,
        sku: `${details.slug}-20`,
      },
      {
        product_id: newProd.id,
        name: "30 Sachets Pack",
        price_inr: Math.round(details.priceInr * 2.6),
        compare_at_price_inr: details.compareAtPriceInr ? details.compareAtPriceInr * 3 : null,
        servings: 30,
        badge: "Performance Pack",
        is_default: false,
        sku: `${details.slug}-30`,
      },
    ];

    const { error: varError } = await supabaseAdmin.from("product_variants").insert(variants);
    if (varError) throw varError;

    // 3. Insert initial placeholder scientific components
    const ingredients = [
      {
        product_id: newProd.id,
        name: "Potassium",
        amount: "550 mg",
        description: "Regulates heart rhythm and supports cardiovascular cellular hydration.",
        sort_order: 1,
      },
      {
        product_id: newProd.id,
        name: "Sodium",
        amount: "40 mg",
        description: "Maintains plasma volume and prevents muscle fatigue.",
        sort_order: 2,
      },
    ];
    await supabaseAdmin.from("ingredients").insert(ingredients);

    return {
      success: true,
      productId: newProd.id,
    };
  } catch (err: unknown) {
    console.error("[Admin Add Product] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error creating product.",
    };
  }
}

// Full product detail structure for CRUD operations
export interface FullProductDetail {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  long_description: string | null;
  price_inr: number;
  compare_at_price_inr: number | null;
  image_url: string | null;
  gallery: string[];
  badges: string[];
  serving_size: string | null;
  servings_per_pack: number | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  variants: Array<{
    id?: string;
    name: string;
    sku: string | null;
    price_inr: number;
    compare_at_price_inr: number | null;
    servings: number;
    badge: string | null;
    is_default: boolean;
    sort_order?: number;
  }>;
  ingredients: Array<{
    id?: string;
    name: string;
    amount: string | null;
    description: string | null;
    sort_order?: number;
  }>;
  benefits: Array<{
    id?: string;
    title: string;
    description: string;
    icon: string | null;
    sort_order?: number;
  }>;
  faqs: Array<{
    id?: string;
    question: string;
    answer: string;
    category: string | null;
    sort_order?: number;
  }>;
}

// Inline fallback products list to run locally without a database connection
const simulatedProducts: FullProductDetail[] = [
  {
    id: "3ff50b4a-2f7a-4146-b09b-cd5bb3e48284",
    slug: "zero-sugar-lemonade",
    name: "Zero Sugar Lemonade - Potassium Rich Electrolyte",
    tagline: "India's First Potassium-Rich Electrolyte Drink Mix",
    description:
      "Stay hydrated and energized with MyFitBoat. Fast-absorbing, potassium-rich hydration formula for sports, workouts, and daily performance.",
    long_description:
      "Most sports drinks are loaded with sodium and sugar, ignoring the key mineral needed for heart health and muscle contraction: potassium. MyFitBoat delivers a potassium-rich, low-sodium formula that supports blood pressure, heart rhythm, stamina, and recovery. Perfect for athletes, active lifestyles, keto, and daily hydration.",
    price_inr: 240,
    compare_at_price_inr: 300,
    image_url: "/product/Box_Sachet_Front-image-1.jpg",
    gallery: [
      "/product/Box_Sachet_Front-image-1.jpg",
      "/product/WhatsApp-Image-2025-09-08-at-15.24.57.png",
      "/product/Cardio-explainig-image.jpg",
      "/product/How-to-use-image.png",
      "/product/Label.jpg",
      "/product/5.jpg",
    ],
    badges: ["Zero Sugar", "Vegan", "Gluten Free", "Lab Tested", "Clean Label"],
    serving_size: "5g sachet",
    servings_per_pack: 10,
    is_featured: true,
    is_active: true,
    sort_order: 1,
    variants: [
      {
        id: "var-10-sachets",
        name: "10 Sachets Pack",
        sku: "MFB-LMN-10",
        price_inr: 240,
        compare_at_price_inr: 300,
        servings: 10,
        badge: "Intro Pack",
        is_default: true,
        sort_order: 1,
      },
      {
        id: "var-20-sachets",
        name: "20 Sachets Pack",
        sku: "MFB-LMN-20",
        price_inr: 450,
        compare_at_price_inr: 600,
        servings: 20,
        badge: "Value Pack",
        is_default: false,
        sort_order: 2,
      },
      {
        id: "var-30-sachets",
        name: "30 Sachets Pack",
        sku: "MFB-LMN-30",
        price_inr: 680,
        compare_at_price_inr: 900,
        servings: 30,
        badge: "Performance Pack",
        is_default: false,
        sort_order: 3,
      },
    ],
    ingredients: [
      {
        id: "ing-1",
        name: "Potassium Citrate",
        amount: "550 mg",
        description: "Maintains blood pressure, heart rhythm, and muscle performance.",
        sort_order: 1,
      },
      {
        id: "ing-2",
        name: "Sodium Citrate/Chloride",
        amount: "40 mg",
        description: "Low sodium hydration without excess salt.",
        sort_order: 2,
      },
      {
        id: "ing-3",
        name: "Magnesium",
        amount: "21 mg",
        description: "Reduces fatigue and muscle cramps.",
        sort_order: 3,
      },
      {
        id: "ing-4",
        name: "Calcium",
        amount: "16 mg",
        description: "Strengthens bones and supports nerves.",
        sort_order: 4,
      },
      {
        id: "ing-5",
        name: "Zinc",
        amount: "5.2 mg",
        description: "Boosts immunity and repair.",
        sort_order: 5,
      },
      {
        id: "ing-6",
        name: "Vitamin C",
        amount: "43 mg",
        description: "Antioxidant & immunity boost.",
        sort_order: 6,
      },
      {
        id: "ing-7",
        name: "Vitamin D",
        amount: "2.3 mcg",
        description: "Bone health & immunity.",
        sort_order: 7,
      },
      {
        id: "ing-8",
        name: "Vitamin B1",
        amount: "15 mg",
        description: "Converts carbs into cellular energy.",
        sort_order: 8,
      },
      {
        id: "ing-9",
        name: "Vitamin B3",
        amount: "3.1 mg",
        description: "Supports blood circulation and energy release.",
        sort_order: 9,
      },
      {
        id: "ing-10",
        name: "Vitamin B5",
        amount: "1.2 mg",
        description: "Boosts metabolism and reduces fatigue.",
        sort_order: 10,
      },
      {
        id: "ing-11",
        name: "Vitamin B6",
        amount: "1.4 mg",
        description: "Aids muscle recovery and protein utilization.",
        sort_order: 11,
      },
      {
        id: "ing-12",
        name: "Chloride",
        amount: "Aids hydration",
        description: "Helps maintain proper fluid balance.",
        sort_order: 12,
      },
    ],
    benefits: [
      {
        id: "ben-1",
        title: "Rapid Hydration",
        description: "Isotonic concentration designed for immediate cellular absorption.",
        icon: "droplet",
        sort_order: 1,
      },
      {
        id: "ben-2",
        title: "Muscle Function",
        description: "High-dose potassium prevents cramping and optimizes contractions.",
        icon: "activity",
        sort_order: 2,
      },
      {
        id: "ben-3",
        title: "Zero Crash",
        description: "Zero sugar means no insulin spike, no afternoon slump.",
        icon: "zap",
        sort_order: 3,
      },
      {
        id: "ben-4",
        title: "Neuro Boost",
        description: "Methylated B-vitamins and Vitamin D for cognitive performance.",
        icon: "brain",
        sort_order: 4,
      },
      {
        id: "ben-5",
        title: "Recovery Support",
        description: "Antioxidant Vitamin C and minerals speed recovery.",
        icon: "shield",
        sort_order: 5,
      },
      {
        id: "ben-6",
        title: "Daily Ready",
        description: "Clean ingredients for daily use. Take pre/post workout.",
        icon: "sun",
        sort_order: 6,
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "Why 550mg potassium per sachet?",
        answer:
          "Potassium is vital for blood pressure, steady heartbeat, and muscle performance. paired with low sodium (40mg), it aligns with a healthy sodium-to-potassium ratio.",
        category: "Science",
        sort_order: 1,
      },
      {
        id: "faq-2",
        question: "How do I use it?",
        answer:
          "Tear open one sachet, pour into 250–500ml of cold water, stir, and drink. Perfect for workouts or daily hydration.",
        category: "Usage",
        sort_order: 2,
      },
      {
        id: "faq-3",
        question: "Is it really zero sugar?",
        answer:
          "Yes. We use natural lemon flavor and clean stevia. No sugar, no maltodextrin, no artificial fillers.",
        category: "Nutrition",
        sort_order: 3,
      },
      {
        id: "faq-4",
        question: "Is it keto-friendly?",
        answer:
          "Absolutely. Zero sugar, zero carbs, and mineral-rich — ideal for low-carb training protocols.",
        category: "Nutrition",
        sort_order: 4,
      },
      {
        id: "faq-5",
        question: "Can I take it daily?",
        answer: "Yes. The formula is designed for daily use by active individuals.",
        category: "General",
        sort_order: 5,
      },
    ],
  },
];

// Fetch all catalog products with related items
export async function adminGetFullProducts(password: string) {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Access Denied: Invalid credentials." };
  }

  if (!hasServerConfig()) {
    return { success: true, products: simulatedProducts };
  }

  try {
    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    if (!products) return { success: true, products: [] };

    const fullProducts = await Promise.all(
      products.map(async (product) => {
        const [variants, ingredients, benefits, faqs] = await Promise.all([
          supabaseAdmin
            .from("product_variants")
            .select("*")
            .eq("product_id", product.id)
            .order("sort_order"),
          supabaseAdmin
            .from("ingredients")
            .select("*")
            .eq("product_id", product.id)
            .order("sort_order"),
          supabaseAdmin
            .from("benefits")
            .select("*")
            .eq("product_id", product.id)
            .order("sort_order"),
          supabaseAdmin.from("faqs").select("*").eq("product_id", product.id).order("sort_order"),
        ]);

        return {
          ...product,
          gallery: Array.isArray(product.gallery) ? product.gallery : [],
          badges: Array.isArray(product.badges) ? product.badges : [],
          variants: variants.data || [],
          ingredients: ingredients.data || [],
          benefits: benefits.data || [],
          faqs: faqs.data || [],
        };
      }),
    );

    return { success: true, products: fullProducts as unknown as FullProductDetail[] };
  } catch (err: unknown) {
    console.error("[Admin Get Full Products] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error listing products.",
    };
  }
}

// Save (create or update) a product and all related details
export async function adminSaveProduct(
  password: string,
  productDetails: Partial<FullProductDetail>,
  variants: FullProductDetail["variants"],
  ingredients: FullProductDetail["ingredients"],
  benefits: FullProductDetail["benefits"],
  faqs: FullProductDetail["faqs"],
) {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Access Denied: Invalid credentials." };
  }

  const { name, slug, price_inr } = productDetails;
  if (!name || !slug || price_inr === undefined) {
    return { success: false, error: "Name, slug, and price are required fields." };
  }

  const isNew = !productDetails.id;
  const productId = productDetails.id || genMockUuid();

  if (!hasServerConfig()) {
    const fullProduct: FullProductDetail = {
      id: productId,
      slug: slug,
      name: name,
      tagline: productDetails.tagline || null,
      description: productDetails.description || null,
      long_description: productDetails.long_description || null,
      price_inr: Number(price_inr),
      compare_at_price_inr: productDetails.compare_at_price_inr
        ? Number(productDetails.compare_at_price_inr)
        : null,
      image_url: productDetails.image_url || "/product/Box_Sachet_Front-image-1.jpg",
      gallery: productDetails.gallery || [],
      badges: productDetails.badges || [],
      serving_size: productDetails.serving_size || null,
      servings_per_pack: productDetails.servings_per_pack
        ? Number(productDetails.servings_per_pack)
        : null,
      is_featured: !!productDetails.is_featured,
      is_active: productDetails.is_active !== false,
      sort_order: Number(productDetails.sort_order) || 0,
      variants: variants.map((v, idx) => ({
        ...v,
        id: v.id || genMockUuid(),
        sort_order: idx + 1,
      })),
      ingredients: ingredients.map((ing, idx) => ({
        ...ing,
        id: ing.id || genMockUuid(),
        sort_order: idx + 1,
      })),
      benefits: benefits.map((b, idx) => ({
        ...b,
        id: b.id || genMockUuid(),
        sort_order: idx + 1,
      })),
      faqs: faqs.map((f, idx) => ({ ...f, id: f.id || genMockUuid(), sort_order: idx + 1 })),
    };

    if (isNew) {
      simulatedProducts.push(fullProduct);
    } else {
      const idx = simulatedProducts.findIndex((p) => p.id === productId);
      if (idx !== -1) simulatedProducts[idx] = fullProduct;
    }

    return { success: true, productId, isSimulated: true };
  }

  try {
    const productPayload = {
      name,
      slug,
      tagline: productDetails.tagline || null,
      description: productDetails.description || null,
      long_description: productDetails.long_description || null,
      price_inr: Number(price_inr),
      compare_at_price_inr: productDetails.compare_at_price_inr
        ? Number(productDetails.compare_at_price_inr)
        : null,
      image_url: productDetails.image_url || null,
      gallery: productDetails.gallery || [],
      badges: productDetails.badges || [],
      serving_size: productDetails.serving_size || null,
      servings_per_pack: productDetails.servings_per_pack
        ? Number(productDetails.servings_per_pack)
        : null,
      is_featured: !!productDetails.is_featured,
      is_active: productDetails.is_active !== false,
      sort_order: Number(productDetails.sort_order) || 0,
    };

    if (isNew) {
      const { error } = await supabaseAdmin
        .from("products")
        .insert({ id: productId, ...productPayload });
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("products")
        .update(productPayload)
        .eq("id", productId);
      if (error) throw error;
    }

    // Update product variant catalog rows
    await supabaseAdmin.from("product_variants").delete().eq("product_id", productId);
    if (variants && variants.length > 0) {
      const { error: varError } = await supabaseAdmin.from("product_variants").insert(
        variants.map((v, idx) => ({
          product_id: productId,
          name: v.name,
          sku: v.sku || null,
          price_inr: Number(v.price_inr),
          compare_at_price_inr: v.compare_at_price_inr ? Number(v.compare_at_price_inr) : null,
          servings: Number(v.servings) || 10,
          badge: v.badge || null,
          is_default: !!v.is_default,
          sort_order: idx + 1,
        })),
      );
      if (varError) throw varError;
    }

    // Update ingredients rows
    await supabaseAdmin.from("ingredients").delete().eq("product_id", productId);
    if (ingredients && ingredients.length > 0) {
      const { error: ingError } = await supabaseAdmin.from("ingredients").insert(
        ingredients.map((ing, idx) => ({
          product_id: productId,
          name: ing.name,
          amount: ing.amount || null,
          description: ing.description || null,
          sort_order: idx + 1,
        })),
      );
      if (ingError) throw ingError;
    }

    // Update benefits list rows
    await supabaseAdmin.from("benefits").delete().eq("product_id", productId);
    if (benefits && benefits.length > 0) {
      const { error: benError } = await supabaseAdmin.from("benefits").insert(
        benefits.map((b, idx) => ({
          product_id: productId,
          title: b.title,
          description: b.description,
          icon: b.icon || null,
          sort_order: idx + 1,
        })),
      );
      if (benError) throw benError;
    }

    // Update faqs rows
    await supabaseAdmin.from("faqs").delete().eq("product_id", productId);
    if (faqs && faqs.length > 0) {
      const { error: faqError } = await supabaseAdmin.from("faqs").insert(
        faqs.map((f, idx) => ({
          product_id: productId,
          question: f.question,
          answer: f.answer,
          category: f.category || null,
          sort_order: idx + 1,
        })),
      );
      if (faqError) throw faqError;
    }

    return { success: true, productId, isSimulated: false };
  } catch (err: unknown) {
    console.error("[Admin Save Product] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error saving product to database.",
    };
  }
}

// Delete a product and let cascades clean related elements
export async function adminDeleteProduct(password: string, productId: string) {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Access Denied: Invalid credentials." };
  }

  if (!hasServerConfig()) {
    const idx = simulatedProducts.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      simulatedProducts.splice(idx, 1);
      return { success: true, isSimulated: true };
    }
    return { success: false, error: "Mock product not found." };
  }

  try {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", productId);
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    console.error("[Admin Delete Product] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error deleting product from database.",
    };
  }
}

// Decodes a base64 string, converts it to Buffer, and uploads to product-images public storage bucket
export async function adminUploadImage(password: string, base64Data: string, fileName: string) {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Access Denied: Invalid credentials." };
  }

  if (!hasServerConfig()) {
    console.warn("[Admin Upload Image] Database config missing. Simulating upload.");
    return {
      success: true,
      publicUrl:
        base64Data.length > 500
          ? "data:image/webp;base64," + base64Data.substring(0, 100) + "..."
          : base64Data,
      isSimulated: true,
    };
  }

  try {
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
    const uniqueName = `${Date.now()}-${cleanFileName}`;

    const base64Body = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Body, "base64");

    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(uniqueName, buffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(uniqueName);

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (err: unknown) {
    console.error("[Admin Upload Image] Error uploading image:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to upload image file.",
    };
  }
}

// ----------------------------------------------------
// CERTIFICATE MANAGEMENT SERVER ACTIONS
// ----------------------------------------------------

export interface CertificateData {
  id?: string;
  title: string;
  issuer: string;
  certificate_number: string;
  issue_date: string;
  summary: string;
  file_url: string;
  badge?: string;
  product_ids?: string[];
}

const CERT_STORAGE_FILE = path.join(process.cwd(), ".simulated_certificates.json");

const initialSimulatedCertificates: CertificateData[] = [
  {
    id: "cert-1",
    title: "Potassium Assay & Electrolyte Purity Report",
    issuer: "Qualiset Testing Laboratories / NABL Accredited",
    certificate_number: "COA-2025-550K",
    issue_date: "January 2025",
    summary:
      "NABL lab assay confirming 550mg active Potassium Citrate per sachet with zero heavy metal contaminants.",
    file_url: "/product/WhatsApp-Image-2025-09-08-at-15.24.57.png",
    badge: "NABL Accredited",
    product_ids: ["3ff50b4a-2f7a-4146-b09b-cd5bb3e48284"],
  },
  {
    id: "cert-2",
    title: "FSSAI Food Safety License & Compliance Certificate",
    issuer: "Food Safety and Standards Authority of India",
    certificate_number: "FSSAI-10021022000849",
    issue_date: "2024 - 2029",
    summary:
      "Central license approval for specialized dietary electrolyte drink formulations and sachet packaging.",
    file_url: "/product/Label.jpg",
    badge: "FSSAI Certified",
    product_ids: ["3ff50b4a-2f7a-4146-b09b-cd5bb3e48284"],
  },
  {
    id: "cert-3",
    title: "WHO-GMP Good Manufacturing Practices Certificate",
    issuer: "Eurowiss Standard Quality Assurance",
    certificate_number: "GMP-IND-2024-991",
    issue_date: "December 2024",
    summary:
      "Certified ISO cleanroom processing ensuring zero cross-contamination and 100% batch consistency.",
    file_url: "/product/Cardio-explainig-image.jpg",
    badge: "WHO-GMP",
    product_ids: ["3ff50b4a-2f7a-4146-b09b-cd5bb3e48284"],
  },
];

export async function loadSimulatedCertificates(): Promise<CertificateData[]> {
  try {
    if (fs.existsSync(CERT_STORAGE_FILE)) {
      const content = fs.readFileSync(CERT_STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("[Certificates] Error reading simulated certificates file:", err);
  }
  return initialSimulatedCertificates;
}

function saveSimulatedCertificates(certs: CertificateData[]) {
  try {
    fs.writeFileSync(CERT_STORAGE_FILE, JSON.stringify(certs, null, 2), "utf-8");
  } catch (err) {
    console.error("[Certificates] Error writing simulated certificates file:", err);
  }
}

export async function adminGetCertificates(password: string) {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Access Denied: Invalid credentials." };
  }

  if (!hasServerConfig()) {
    const certs = await loadSimulatedCertificates();
    return { success: true, certificates: certs };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: certs, error } = await (supabaseAdmin as any)
      .from("certificates")
      .select("*, product_certificates(product_id)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatted = (certs || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      certificate_number: c.certificate_number,
      issue_date: c.issue_date,
      summary: c.summary,
      file_url: c.file_url,
      badge: c.badge,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product_ids: (c.product_certificates || []).map((pc: any) => pc.product_id),
    }));

    const localCerts = await loadSimulatedCertificates();
    const merged = [...formatted];
    for (const lc of localCerts) {
      if (!merged.some((c) => c.id === lc.id || c.title === lc.title)) {
        merged.push(lc);
      }
    }

    return { success: true, certificates: merged };
  } catch (err: unknown) {
    console.error("[Admin Get Certificates] Supabase Error:", err);
    const certs = await loadSimulatedCertificates();
    return {
      success: true,
      certificates: certs,
      isSimulatedFallback: true,
    };
  }
}

export async function adminSaveCertificate(
  password: string,
  data: CertificateData,
  productIds: string[],
) {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Access Denied: Invalid credentials." };
  }

  if (!hasServerConfig()) {
    const list = await loadSimulatedCertificates();
    if (data.id) {
      const idx = list.findIndex((c) => c.id === data.id);
      if (idx !== -1) {
        list[idx] = {
          ...data,
          product_ids: productIds,
        };
      } else {
        list.unshift({ ...data, product_ids: productIds });
      }
    } else {
      const newCert = {
        ...data,
        id: genMockUuid(),
        product_ids: productIds,
      };
      list.unshift(newCert);
    }
    saveSimulatedCertificates(list);
    return { success: true, isSimulated: true };
  }

  try {
    let certId = data.id;

    if (certId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateErr } = await (supabaseAdmin as any)
        .from("certificates")
        .update({
          title: data.title,
          issuer: data.issuer,
          certificate_number: data.certificate_number,
          issue_date: data.issue_date,
          summary: data.summary,
          file_url: data.file_url,
          badge: data.badge || "Verified Test",
        })
        .eq("id", certId);

      if (updateErr) throw updateErr;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newCert, error: insertErr } = await (supabaseAdmin as any)
        .from("certificates")
        .insert({
          title: data.title,
          issuer: data.issuer,
          certificate_number: data.certificate_number,
          issue_date: data.issue_date,
          summary: data.summary,
          file_url: data.file_url,
          badge: data.badge || "Verified Test",
        })
        .select("id")
        .single();

      if (insertErr) throw insertErr;
      certId = newCert.id;
    }

    // Update multi-product junction links
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any).from("product_certificates").delete().eq("certificate_id", certId);

    if (productIds && productIds.length > 0) {
      // Filter out non-UUID mock product IDs to prevent FK violations in PostgreSQL
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validProductIds = productIds.filter((pId) => uuidRegex.test(pId));

      if (validProductIds.length > 0) {
        const links = validProductIds.map((pId) => ({
          certificate_id: certId,
          product_id: pId,
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: linkErr } = await (supabaseAdmin as any)
          .from("product_certificates")
          .insert(links);
        if (linkErr) throw linkErr;
      }
    }

    // Keep local simulated certificates file in sync
    const list = await loadSimulatedCertificates();
    const finalCert = { ...data, id: certId, product_ids: productIds };
    const existingIdx = list.findIndex((c) => c.id === certId || c.title === data.title);
    if (existingIdx !== -1) {
      list[existingIdx] = finalCert;
    } else {
      list.unshift(finalCert);
    }
    saveSimulatedCertificates(list);

    return { success: true, certId };
  } catch (err: unknown) {
    console.error("[Admin Save Certificate] Error:", err);
    const msg = err instanceof Error ? err.message : "Error saving certificate.";
    let userFriendlyError = msg;
    if (msg.includes("relation") && msg.includes("does not exist")) {
      userFriendlyError =
        "Database table 'certificates' not found in Supabase. Please run the SQL migration script (supabase_certificates_migration.sql) in your Supabase SQL Editor.";
    }

    // Also fallback to saving locally so admin work is never lost!
    const list = await loadSimulatedCertificates();
    if (data.id) {
      const idx = list.findIndex((c) => c.id === data.id);
      if (idx !== -1) {
        list[idx] = { ...data, product_ids: productIds };
      } else {
        list.unshift({ ...data, product_ids: productIds });
      }
    } else {
      list.unshift({ ...data, id: genMockUuid(), product_ids: productIds });
    }
    saveSimulatedCertificates(list);

    return {
      success: true,
      isSimulatedFallback: true,
      warning: userFriendlyError,
    };
  }
}

export async function adminDeleteCertificate(password: string, certId: string) {
  if (!verifyAdminPassword(password)) {
    return { success: false, error: "Access Denied: Invalid credentials." };
  }

  if (!hasServerConfig()) {
    const list = await loadSimulatedCertificates();
    const idx = list.findIndex((c) => c.id === certId);
    if (idx !== -1) {
      list.splice(idx, 1);
      saveSimulatedCertificates(list);
      return { success: true, isSimulated: true };
    }
    return { success: false, error: "Certificate not found." };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any).from("certificates").delete().eq("id", certId);
    if (error) throw error;

    // Also remove from local fallback file if present
    const list = await loadSimulatedCertificates();
    const idx = list.findIndex((c) => c.id === certId);
    if (idx !== -1) {
      list.splice(idx, 1);
      saveSimulatedCertificates(list);
    }
    return { success: true };
  } catch (err: unknown) {
    console.error("[Admin Delete Certificate] Error:", err);
    // Fallback to local file deletion
    const list = await loadSimulatedCertificates();
    const idx = list.findIndex((c) => c.id === certId);
    if (idx !== -1) {
      list.splice(idx, 1);
      saveSimulatedCertificates(list);
      return { success: true, isSimulatedFallback: true };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error deleting certificate.",
    };
  }
}

// Helpers
function genMockUuid() {
  return "mock-uuid-" + Math.random().toString(36).substring(2, 11);
}
