"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  adminListOrders,
  adminUpdateOrderStatus,
  OrderDetail,
  FullProductDetail,
  adminGetFullProducts,
  adminSaveProduct,
  adminDeleteProduct,
  adminUploadImage,
} from "@/app/checkout/actions";
import {
  Loader2,
  Key,
  ListFilter,
  PlusCircle,
  CheckCircle,
  Package,
  Truck,
  ArrowLeft,
  RefreshCw,
  Trash2,
  Upload,
  X,
  Plus,
} from "lucide-react";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<"orders" | "products" | "product-editor">("orders");
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Status edit form fields
  const [editStatus, setEditStatus] = useState("pending");
  const [editCarrier, setEditCarrier] = useState("");
  const [editTrackingNum, setEditTrackingNum] = useState("");
  const [editEstDelivery, setEditEstDelivery] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Formulation catalog state variables
  const [fullProducts, setFullProducts] = useState<FullProductDetail[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<FullProductDetail> | null>(null);

  // Formulation arrays builders
  const [formVariants, setFormVariants] = useState<FullProductDetail["variants"]>([]);
  const [formIngredients, setFormIngredients] = useState<FullProductDetail["ingredients"]>([]);
  const [formBenefits, setFormBenefits] = useState<FullProductDetail["benefits"]>([]);
  const [formFaqs, setFormFaqs] = useState<FullProductDetail["faqs"]>([]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "pending_cod":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "pending_upi":
        return "bg-sky-500/10 border-sky-500/30 text-sky-400";
      case "processing":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "shipped":
        return "bg-indigo-500/10 border-indigo-500/30 text-indigo-400";
      case "delivered":
        return "bg-teal-500/10 border-teal-500/30 text-teal-400";
      case "cancelled":
        return "bg-destructive/10 border-destructive/30 text-destructive";
      default:
        return "bg-background/50 border-border text-foreground";
    }
  };

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Retrieve auth state from sessionStorage on load
  useEffect(() => {
    const savedPassword = sessionStorage.getItem("mfb-admin-key");
    if (savedPassword) {
      setPassword(savedPassword);
      loadDashboardData(savedPassword);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please input password.");
      return;
    }

    setError("");
    setIsVerifying(true);

    loadDashboardData(password);
  };

  const loadDashboardData = (pass: string) => {
    setIsLoadingOrders(true);
    adminListOrders(pass)
      .then((res) => {
        setIsVerifying(false);
        setIsLoadingOrders(false);
        if (res.success && res.orders) {
          setIsAuthorized(true);
          setOrders(res.orders);
          sessionStorage.setItem("mfb-admin-key", pass);
        } else {
          setError(res.error || "Incorrect admin password.");
          sessionStorage.removeItem("mfb-admin-key");
        }
      })
      .catch((err) => {
        setIsVerifying(false);
        setIsLoadingOrders(false);
        setError("Connection failed. Try again.");
      });

    setIsLoadingProducts(true);
    adminGetFullProducts(pass)
      .then((res) => {
        setIsLoadingProducts(false);
        if (res.success && res.products) {
          setFullProducts(res.products);
        }
      })
      .catch((err) => {
        setIsLoadingProducts(false);
        console.error("Error fetching full products catalog:", err);
      });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mfb-admin-key");
    setPassword("");
    setIsAuthorized(false);
    setOrders([]);
    setFullProducts([]);
  };

  const handleSelectOrder = (order: OrderDetail) => {
    setSelectedOrderId(order.id);
    setEditStatus(order.status);
    setEditCarrier(order.carrier || "");
    setEditTrackingNum(order.tracking_number || "");
    setEditEstDelivery(order.estimated_delivery || "");
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    setIsUpdatingStatus(true);
    adminUpdateOrderStatus(
      password,
      selectedOrderId,
      editStatus,
      editCarrier,
      editTrackingNum,
      editEstDelivery,
    )
      .then((res) => {
        setIsUpdatingStatus(false);
        if (res.success) {
          alert("Order status successfully updated!");
          loadDashboardData(password);
        } else {
          alert(res.error || "Failed to update order status.");
        }
      })
      .catch((err) => {
        console.error(err);
        setIsUpdatingStatus(false);
        alert("An error occurred.");
      });
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (
      confirm(
        `Are you sure you want to permanently delete "${productName}"? This will delete all variants, ingredients, benefits, and FAQs related to it.`,
      )
    ) {
      adminDeleteProduct(password, productId)
        .then((res) => {
          if (res.success) {
            alert("Formulation successfully deleted!");
            loadDashboardData(password);
          } else {
            alert(res.error || "Failed to delete product.");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("An error occurred.");
        });
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name || !editingProduct.slug || !editingProduct.price_inr) {
      setSaveMessage("Name, slug slug and price are required fields.");
      return;
    }

    setIsSavingProduct(true);
    setSaveMessage("");

    adminSaveProduct(
      password,
      editingProduct,
      formVariants,
      formIngredients,
      formBenefits,
      formFaqs,
    )
      .then((res) => {
        setIsSavingProduct(false);
        if (res.success) {
          alert(
            res.isSimulated
              ? "Formulation successfully simulated in memory!"
              : "Formulation successfully saved to database!",
          );
          setEditingProduct(null);
          setActiveTab("products");
          loadDashboardData(password);
        } else {
          setSaveMessage(res.error || "Failed to save formulation details.");
        }
      })
      .catch((err) => {
        console.error(err);
        setIsSavingProduct(false);
        setSaveMessage("An error occurred during save.");
      });
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "primary" | "gallery",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setIsUploadingImage(false);
          alert("Browser canvas context not available.");
          return;
        }

        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL("image/webp", 0.85);

        adminUploadImage(password, base64, file.name.replace(/\.[^/.]+$/, "") + ".webp")
          .then((res) => {
            setIsUploadingImage(false);
            if (res.success && res.publicUrl) {
              if (type === "primary") {
                setEditingProduct((prev) => ({ ...prev, image_url: res.publicUrl }));
              } else {
                setEditingProduct((prev) => ({
                  ...prev,
                  gallery: [...(prev?.gallery || []), res.publicUrl],
                }));
              }
            } else {
              alert(res.error || "Failed to upload image.");
            }
          })
          .catch((err) => {
            setIsUploadingImage(false);
            console.error(err);
            alert("Error uploading file.");
          });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthorized) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full border border-border bg-surface p-8 space-y-6">
          <div className="text-center">
            <Key className="size-12 text-brand mx-auto mb-4" />
            <h1 className="font-display text-4xl uppercase leading-none mb-2">ADMIN PORTAL</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
              Authentication Required
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Access Password
              </label>
              <input
                type="password"
                placeholder="ENTER ACCESS KEY"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 font-sans text-sm tracking-wider focus:outline-none focus:border-brand text-center text-foreground placeholder:text-muted-foreground/40"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-mono uppercase text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-4 bg-brand text-brand-foreground font-display text-lg uppercase tracking-wider hover:bg-foreground hover:text-background transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isVerifying ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <span>Authorize Admin</span>
              )}
            </button>
          </form>
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-brand"
            >
              <ArrowLeft className="size-3" />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6 mb-8">
          <div>
            <div className="font-sans text-xs font-semibold text-brand uppercase tracking-wider">
              MyFitBoat Management
            </div>
            <h1 className="font-display text-4xl md:text-5xl uppercase leading-none mt-1">
              ADMIN <span className="text-brand">DASHBOARD</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
            <button
              onClick={() => loadDashboardData(password)}
              className="p-3 border border-border bg-surface hover:border-brand/40 text-muted-foreground hover:text-brand transition-colors cursor-pointer rounded"
              title="Refresh Data"
            >
              <RefreshCw className="size-4" />
            </button>
            <button
              onClick={handleLogout}
              className="font-sans text-xs font-semibold uppercase tracking-wider px-4 py-2.5 border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              Logout Access
            </button>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex border-b border-border font-sans text-sm font-semibold uppercase tracking-wider mb-8 divide-x divide-border">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-4 flex items-center gap-2 cursor-pointer ${
              activeTab === "orders"
                ? "bg-surface text-brand border-b border-brand"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListFilter className="size-3.5" />
            <span>Manage Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-4 flex items-center gap-2 cursor-pointer ${
              activeTab === "products"
                ? "bg-surface text-brand border-b border-brand"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="size-3.5" />
            <span>Formulations catalog ({fullProducts.length})</span>
          </button>
          {activeTab === "product-editor" && (
            <button
              className="px-6 py-4 flex items-center gap-2 bg-surface text-brand border-b border-brand font-bold"
              disabled
            >
              <PlusCircle className="size-3.5" />
              <span>{editingProduct?.id ? "Edit Formulation" : "Create Formulation"}</span>
            </button>
          )}
        </div>

        {/* ORDERS MANAGEMENT VIEW */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Orders Table */}
            <div className="lg:col-span-8 border border-border bg-surface overflow-x-auto">
              <table className="w-full text-left font-sans text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background/50 text-brand uppercase tracking-wider font-semibold text-xs">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No orders logged in database.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => {
                      const isSelected = selectedOrderId === o.id;
                      return (
                        <tr
                          key={o.id}
                          className={`hover:bg-background/20 transition-colors ${
                            isSelected ? "bg-brand/5 border-l-2 border-brand" : ""
                          }`}
                        >
                          <td className="p-4 font-semibold text-foreground">{o.order_number}</td>
                          <td className="p-4">
                            <div className="font-semibold text-foreground">{o.customer_name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{o.email}</div>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {new Date(o.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-4 font-semibold text-foreground">{inr(o.total_inr)}</td>
                          <td className="p-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadgeClass(o.status)}`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleSelectOrder(o)}
                              className="px-3 py-1.5 bg-brand text-brand-foreground font-display text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                            >
                              Manage Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Selected Order Actions Panel */}
            <div className="lg:col-span-4 space-y-6">
              {selectedOrderId ? (
                (() => {
                  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
                  if (!selectedOrder) return null;
                  return (
                    <div className="border border-border bg-surface p-6 space-y-6 animate-fade-up">
                      <div>
                        <div className="font-sans text-xs font-semibold text-brand uppercase tracking-wider">
                          Managing Order:
                        </div>
                        <h3 className="font-display text-2xl uppercase mt-1">
                          {selectedOrder.order_number}
                        </h3>
                        <p className="font-sans text-xs text-muted-foreground mt-1 leading-normal">
                          {selectedOrder.customer_name} · {selectedOrder.phone}
                        </p>
                      </div>

                      {/* Items Purchased details */}
                      <div className="border-t border-b border-border/40 py-4 space-y-3 font-sans text-sm text-muted-foreground">
                        <div className="font-bold text-foreground uppercase tracking-wider text-xs">
                          Purchased Items:
                        </div>
                        {selectedOrder.order_items?.map((item) => (
                          <div key={item.id} className="flex justify-between text-foreground">
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span className="font-semibold">
                              {inr(item.line_total_inr || item.unit_price_inr * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Destination Details */}
                      <div className="space-y-1 font-sans text-sm text-muted-foreground border-b border-border/40 pb-4">
                        <div className="font-bold text-foreground uppercase tracking-wider text-xs mb-1">
                          Destination Address:
                        </div>
                        <div className="text-foreground">
                          {selectedOrder.shipping_address?.address_line}
                        </div>
                        <div>
                          {selectedOrder.shipping_address?.city},{" "}
                          {selectedOrder.shipping_address?.state} -{" "}
                          {selectedOrder.shipping_address?.pincode}
                        </div>
                        <div className="pt-2 font-semibold text-foreground/80">
                          Payment selection:{" "}
                          {selectedOrder.shipping_address?.payment_method?.toUpperCase()}
                        </div>
                        {(selectedOrder.razorpay_payment_id || selectedOrder.razorpay_order_id) && (
                          <div className="pt-2 font-mono text-[10px] text-muted-foreground bg-background/30 p-2 border border-border/40 space-y-0.5">
                            {selectedOrder.razorpay_payment_id && (
                              <div>RZP Pay ID: {selectedOrder.razorpay_payment_id}</div>
                            )}
                            {selectedOrder.razorpay_order_id && (
                              <div>RZP Order ID: {selectedOrder.razorpay_order_id}</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Update Status form */}
                      <form onSubmit={handleUpdateStatus} className="space-y-4">
                        <h4 className="font-display text-base uppercase text-foreground">
                          Update Shipping Status
                        </h4>

                        <div className="space-y-1">
                          <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                            Order Status Code
                          </label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="w-full bg-background border border-border px-3 py-2 font-sans text-sm text-foreground focus:outline-none focus:border-brand cursor-pointer"
                          >
                            <option value="paid">Paid (Razorpay Successful)</option>
                            <option value="pending_cod">Cash On Delivery Pending</option>
                            <option value="pending_upi">Online Payment Pending</option>
                            <option value="processing">Processing (Packing)</option>
                            <option value="shipped">Shipped (In Transit)</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                            Courier Carrier Partner
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. DELHIVERY, BLUEDART"
                            value={editCarrier}
                            onChange={(e) => setEditCarrier(e.target.value)}
                            className="w-full bg-background border border-border px-3 py-2 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                            Tracking Code ID
                          </label>
                          <input
                            type="text"
                            placeholder="TRACKING NUMBER"
                            value={editTrackingNum}
                            onChange={(e) => setEditTrackingNum(e.target.value)}
                            className="w-full bg-background border border-border px-3 py-2 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                            Est. Arrival Date
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. JUNE 20, 2026"
                            value={editEstDelivery}
                            onChange={(e) => setEditEstDelivery(e.target.value)}
                            className="w-full bg-background border border-border px-3 py-2 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isUpdatingStatus}
                          className="w-full py-3.5 bg-brand text-brand-foreground font-display text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isUpdatingStatus ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <span>Save Status Details</span>
                          )}
                        </button>
                      </form>
                    </div>
                  );
                })()
              ) : (
                <div className="border border-border border-dashed p-8 text-center bg-surface/50 text-muted-foreground font-sans text-sm uppercase">
                  Select an order from the list to manage courier tracking codes.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS (FORMULATIONS) VIEW */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl uppercase">Catalog Formulations</h2>
              <button
                onClick={() => {
                  setEditingProduct({
                    gallery: [],
                    badges: [],
                    is_active: true,
                    is_featured: false,
                    sort_order: 1,
                  });
                  setFormVariants([
                    {
                      name: "10 Sachets Pack",
                      sku: "",
                      price_inr: 240,
                      compare_at_price_inr: 300,
                      servings: 10,
                      badge: "Intro Pack",
                      is_default: true,
                    },
                    {
                      name: "20 Sachets Pack",
                      sku: "",
                      price_inr: 450,
                      compare_at_price_inr: 600,
                      servings: 20,
                      badge: "Value Pack",
                      is_default: false,
                    },
                    {
                      name: "30 Sachets Pack",
                      sku: "",
                      price_inr: 680,
                      compare_at_price_inr: 900,
                      servings: 30,
                      badge: "Performance Pack",
                      is_default: false,
                    },
                  ]);
                  setFormIngredients([]);
                  setFormBenefits([]);
                  setFormFaqs([]);
                  setActiveTab("product-editor");
                }}
                className="px-4 py-2 bg-brand text-brand-foreground font-display text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="size-4" />
                <span>Create New Formulation</span>
              </button>
            </div>

            <div className="border border-border bg-surface overflow-x-auto">
              <table className="w-full text-left font-sans text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background/50 text-brand uppercase tracking-wider font-semibold text-xs">
                    <th className="p-4 w-16">Image</th>
                    <th className="p-4">Formulation Name</th>
                    <th className="p-4">Slug URL</th>
                    <th className="p-4">Base Price</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {fullProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No custom formulations registered in the database.
                      </td>
                    </tr>
                  ) : (
                    fullProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-background/20 transition-colors">
                        <td className="p-4">
                          <div className="size-10 border border-border bg-background flex items-center justify-center overflow-hidden">
                            <img
                              src={p.image_url || "/product/Box_Sachet_Front-image-1.jpg"}
                              alt={p.name}
                              className="size-full object-contain"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-foreground">{p.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{p.tagline}</div>
                        </td>
                        <td className="p-4 text-muted-foreground">{p.slug}</td>
                        <td className="p-4 font-semibold text-foreground">{inr(p.price_inr)}</td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase ${
                              p.is_active
                                ? "bg-brand/10 text-brand border border-brand/35"
                                : "bg-destructive/10 text-destructive border border-destructive/30"
                            }`}
                          >
                            {p.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setFormVariants(p.variants || []);
                              setFormIngredients(p.ingredients || []);
                              setFormBenefits(p.benefits || []);
                              setFormFaqs(p.faqs || []);
                              setActiveTab("product-editor");
                            }}
                            className="px-2.5 py-1.5 border border-border bg-background text-foreground text-xs uppercase tracking-wider hover:border-brand transition-colors cursor-pointer"
                          >
                            Edit Details
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="px-2.5 py-1.5 border border-destructive/40 text-destructive text-xs uppercase tracking-wider hover:bg-destructive/10 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPREHENSIVE FORMULATION EDITOR VIEW */}
        {activeTab === "product-editor" && editingProduct && (
          <div className="border border-border bg-surface p-8 max-w-4xl mx-auto space-y-8 animate-fade-up">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h2 className="font-display text-3xl uppercase">
                {editingProduct.id ? "Edit Catalog Formulation" : "Create Catalog Formulation"}
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setActiveTab("products");
                }}
                className="px-4 py-2 border border-border hover:border-brand font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="size-3" />
                <span>Cancel Editor</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-8">
              {/* SECTION A: GENERAL PROPERTIES */}
              <div className="space-y-6">
                <h3 className="font-display text-xl uppercase border-b border-border/20 pb-2">
                  General formulation specs
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={editingProduct.name || ""}
                      onChange={(e) => {
                        setEditingProduct((prev) => ({
                          ...prev,
                          name: e.target.value,
                          slug: prev?.id
                            ? prev.slug
                            : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        }));
                      }}
                      placeholder="e.g. ZERO SUGAR LEMONADE"
                      className="w-full bg-background border border-border px-4 py-2.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      URL Slug Identifier *
                    </label>
                    <input
                      type="text"
                      value={editingProduct.slug || ""}
                      onChange={(e) =>
                        setEditingProduct((prev) => ({
                          ...prev,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""),
                        }))
                      }
                      placeholder="e.g. zero-sugar-lemonade"
                      className="w-full bg-background border border-border px-4 py-2.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div className="space-y-1">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Short Tagline
                  </label>
                  <input
                    type="text"
                    value={editingProduct.tagline || ""}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({ ...prev, tagline: e.target.value }))
                    }
                    placeholder="e.g. INDIA'S FIRST POTASSIUM-RICH ELECTROLYTE"
                    className="w-full bg-background border border-border px-4 py-2.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                  />
                </div>

                {/* Price, Compare, Serving specs */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  {/* Price */}
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Base price (INR) *
                    </label>
                    <input
                      type="number"
                      value={editingProduct.price_inr || ""}
                      onChange={(e) =>
                        setEditingProduct((prev) => ({
                          ...prev,
                          price_inr: Number(e.target.value),
                        }))
                      }
                      placeholder="e.g. 240"
                      className="w-full bg-background border border-border px-4 py-2.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>

                  {/* Compare Strike Price */}
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Compare Strike (INR)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.compare_at_price_inr || ""}
                      onChange={(e) =>
                        setEditingProduct((prev) => ({
                          ...prev,
                          compare_at_price_inr: e.target.value ? Number(e.target.value) : null,
                        }))
                      }
                      placeholder="e.g. 300"
                      className="w-full bg-background border border-border px-4 py-2.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>

                  {/* Serving size */}
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Serving size
                    </label>
                    <input
                      type="text"
                      value={editingProduct.serving_size || ""}
                      onChange={(e) =>
                        setEditingProduct((prev) => ({ ...prev, serving_size: e.target.value }))
                      }
                      placeholder="e.g. 5g sachet"
                      className="w-full bg-background border border-border px-4 py-2.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>

                  {/* Servings count */}
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Servings per pack
                    </label>
                    <input
                      type="number"
                      value={editingProduct.servings_per_pack || ""}
                      onChange={(e) =>
                        setEditingProduct((prev) => ({
                          ...prev,
                          servings_per_pack: e.target.value ? Number(e.target.value) : null,
                        }))
                      }
                      placeholder="e.g. 10"
                      className="w-full bg-background border border-border px-4 py-2.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* Card description */}
                <div className="space-y-1">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Short catalog card description
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Concise description used on lists cards."
                    className="w-full bg-background border border-border px-4 py-2.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand resize-none"
                  />
                </div>

                {/* Long description */}
                <div className="space-y-1">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Detailed long specifications
                  </label>
                  <textarea
                    rows={4}
                    value={editingProduct.long_description || ""}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({ ...prev, long_description: e.target.value }))
                    }
                    placeholder="Full scientific parameters list, targets and features description."
                    className="w-full bg-background border border-border px-4 py-2.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                  />
                </div>

                {/* Feature switches, Badges and sorting */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Feature badges (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.badges?.join(", ") || ""}
                      onChange={(e) =>
                        setEditingProduct((prev) => ({
                          ...prev,
                          badges: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }))
                      }
                      placeholder="e.g. Zero Sugar, Vegan, Organic"
                      className="w-full bg-background border border-border px-4 py-2.5 font-sans text-sm uppercase text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                      Sort order ranking
                    </label>
                    <input
                      type="number"
                      value={editingProduct.sort_order || 0}
                      onChange={(e) =>
                        setEditingProduct((prev) => ({
                          ...prev,
                          sort_order: Number(e.target.value),
                        }))
                      }
                      className="w-full bg-background border border-border px-4 py-2.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div className="flex gap-6 pt-4">
                    <label className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!editingProduct.is_featured}
                        onChange={(e) =>
                          setEditingProduct((prev) => ({ ...prev, is_featured: e.target.checked }))
                        }
                      />
                      <span>Featured product</span>
                    </label>

                    <label className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-foreground cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_active !== false}
                        onChange={(e) =>
                          setEditingProduct((prev) => ({ ...prev, is_active: e.target.checked }))
                        }
                      />
                      <span>Active catalog item</span>
                    </label>
                  </div>
                </div>

                {/* PRIMARY IMAGE UPLOAD CONVERTER */}
                <div className="space-y-3">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Primary box image
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="size-24 border border-border bg-background flex items-center justify-center overflow-hidden">
                      {editingProduct.image_url ? (
                        <img
                          src={editingProduct.image_url}
                          alt="Primary"
                          className="size-full object-contain"
                        />
                      ) : (
                        <span className="font-sans text-xs text-muted-foreground uppercase text-center">
                          No Image
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="inline-flex items-center gap-2 px-3 py-2 border border-border bg-surface hover:border-brand hover:text-brand font-sans text-xs font-semibold uppercase tracking-wider cursor-pointer">
                        <Upload className="size-3.5" />
                        <span>Upload Primary Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "primary")}
                        />
                      </label>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">
                        Compressed browser-side to WebP format
                      </div>
                    </div>
                  </div>
                </div>

                {/* GALLERY CAROUSEL IMAGES UPLOAD CONVERTER */}
                <div className="space-y-3">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Formulation carousel gallery images
                  </label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {editingProduct.gallery?.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative size-16 border border-border bg-background group"
                        >
                          <img
                            src={url}
                            alt={`Gallery ${idx}`}
                            className="size-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct((prev) => ({
                                ...prev,
                                gallery: (prev?.gallery || []).filter((_, i) => i !== idx),
                              }));
                            }}
                            className="absolute -top-1.5 -right-1.5 size-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                      <label className="size-16 border border-border border-dashed bg-background flex flex-col items-center justify-center hover:border-brand text-muted-foreground hover:text-brand cursor-pointer">
                        <Plus className="size-4" />
                        <span className="font-sans text-[10px] uppercase tracking-wider mt-1">
                          Add Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "gallery")}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: DYNAMIC VARIANTS BUILDER */}
              <div className="border-t border-border/40 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-xl uppercase">Formulation Variants</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setFormVariants((prev) => [
                        ...prev,
                        {
                          name: "New Variant",
                          sku: "",
                          price_inr: 240,
                          compare_at_price_inr: null,
                          servings: 10,
                          badge: "",
                          is_default: false,
                        },
                      ]);
                    }}
                    className="px-3 py-1.5 border border-border hover:border-brand font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" />
                    <span>Add Variant</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formVariants.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-border/40 bg-background/50 grid grid-cols-1 sm:grid-cols-7 gap-4 items-end relative animate-fade-up"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFormVariants((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Remove Variant"
                      >
                        <Trash2 className="size-4" />
                      </button>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Variant Name
                        </label>
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => {
                            const newVars = [...formVariants];
                            newVars[idx].name = e.target.value;
                            setFormVariants(newVars);
                          }}
                          placeholder="e.g. 10 Sachets Pack"
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm uppercase text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          SKU Code
                        </label>
                        <input
                          type="text"
                          value={v.sku || ""}
                          onChange={(e) => {
                            const newVars = [...formVariants];
                            newVars[idx].sku = e.target.value;
                            setFormVariants(newVars);
                          }}
                          placeholder="e.g. MFB-LMN-10"
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Price (INR)
                        </label>
                        <input
                          type="number"
                          value={v.price_inr}
                          onChange={(e) => {
                            const newVars = [...formVariants];
                            newVars[idx].price_inr = Number(e.target.value);
                            setFormVariants(newVars);
                          }}
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Compare (INR)
                        </label>
                        <input
                          type="number"
                          value={v.compare_at_price_inr || ""}
                          onChange={(e) => {
                            const newVars = [...formVariants];
                            newVars[idx].compare_at_price_inr = e.target.value
                              ? Number(e.target.value)
                              : null;
                            setFormVariants(newVars);
                          }}
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Servings
                        </label>
                        <input
                          type="number"
                          value={v.servings}
                          onChange={(e) => {
                            const newVars = [...formVariants];
                            newVars[idx].servings = Number(e.target.value);
                            setFormVariants(newVars);
                          }}
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div className="flex items-center gap-4 py-2">
                        <label className="flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-wider text-foreground cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={!!v.is_default}
                            onChange={(e) => {
                              const newVars = formVariants.map((item, i) => ({
                                ...item,
                                is_default:
                                  i === idx
                                    ? e.target.checked
                                    : e.target.checked
                                      ? false
                                      : item.is_default,
                              }));
                              setFormVariants(newVars);
                            }}
                          />
                          <span>Default</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION C: INGREDIENTS LIST */}
              <div className="border-t border-border/40 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-xl uppercase">Ingredients List</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setFormIngredients((prev) => [
                        ...prev,
                        { name: "", amount: "", description: "" },
                      ]);
                    }}
                    className="px-3 py-1.5 border border-border hover:border-brand font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" />
                    <span>Add Ingredient</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formIngredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-border/40 bg-background/50 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end relative animate-fade-up"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFormIngredients((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Remove Ingredient"
                      >
                        <Trash2 className="size-4" />
                      </button>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Ingredient Name
                        </label>
                        <input
                          type="text"
                          value={ing.name}
                          onChange={(e) => {
                            const newIngs = [...formIngredients];
                            newIngs[idx].name = e.target.value;
                            setFormIngredients(newIngs);
                          }}
                          placeholder="e.g. Potassium Citrate"
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm uppercase text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Amount / Dose
                        </label>
                        <input
                          type="text"
                          value={ing.amount || ""}
                          onChange={(e) => {
                            const newIngs = [...formIngredients];
                            newIngs[idx].amount = e.target.value;
                            setFormIngredients(newIngs);
                          }}
                          placeholder="e.g. 550 mg"
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div className="sm:col-span-7 space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Function / Description
                        </label>
                        <input
                          type="text"
                          value={ing.description || ""}
                          onChange={(e) => {
                            const newIngs = [...formIngredients];
                            newIngs[idx].description = e.target.value;
                            setFormIngredients(newIngs);
                          }}
                          placeholder="e.g. Regulates cellular hydration"
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION D: BENEFITS LIST */}
              <div className="border-t border-border/40 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-xl uppercase">Benefits List</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setFormBenefits((prev) => [
                        ...prev,
                        { title: "", description: "", icon: "droplet" },
                      ]);
                    }}
                    className="px-3 py-1.5 border border-border hover:border-brand font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" />
                    <span>Add Benefit</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formBenefits.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-border/40 bg-background/50 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end relative animate-fade-up"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFormBenefits((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Remove Benefit"
                      >
                        <Trash2 className="size-4" />
                      </button>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Benefit Title
                        </label>
                        <input
                          type="text"
                          value={b.title}
                          onChange={(e) => {
                            const newBens = [...formBenefits];
                            newBens[idx].title = e.target.value;
                            setFormBenefits(newBens);
                          }}
                          placeholder="e.g. Rapid Hydration"
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm uppercase text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Icon Style
                        </label>
                        <select
                          value={b.icon || "droplet"}
                          onChange={(e) => {
                            const newBens = [...formBenefits];
                            newBens[idx].icon = e.target.value;
                            setFormBenefits(newBens);
                          }}
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand cursor-pointer"
                        >
                          <option value="droplet">Droplet</option>
                          <option value="activity">Activity</option>
                          <option value="zap">Zap</option>
                          <option value="brain">Brain</option>
                          <option value="shield">Shield</option>
                          <option value="sun">Sun</option>
                          <option value="leaf">Leaf</option>
                        </select>
                      </div>

                      <div className="sm:col-span-7 space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Detailed Explanation
                        </label>
                        <input
                          type="text"
                          value={b.description}
                          onChange={(e) => {
                            const newBens = [...formBenefits];
                            newBens[idx].description = e.target.value;
                            setFormBenefits(newBens);
                          }}
                          placeholder="e.g. Isotonic formulation for immediate absorption."
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION E: FAQS LIST */}
              <div className="border-t border-border/40 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-xl uppercase">Frequently Asked Questions</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setFormFaqs((prev) => [
                        ...prev,
                        { question: "", answer: "", category: "General" },
                      ]);
                    }}
                    className="px-3 py-1.5 border border-border hover:border-brand font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formFaqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-border/40 bg-background/50 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end relative animate-fade-up"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFormFaqs((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Remove FAQ"
                      >
                        <Trash2 className="size-4" />
                      </button>

                      <div className="sm:col-span-5 space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const newFaqs = [...formFaqs];
                            newFaqs[idx].question = e.target.value;
                            setFormFaqs(newFaqs);
                          }}
                          placeholder="e.g. Is it really sugar free?"
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Category
                        </label>
                        <input
                          type="text"
                          value={faq.category || ""}
                          onChange={(e) => {
                            const newFaqs = [...formFaqs];
                            newFaqs[idx].category = e.target.value;
                            setFormFaqs(newFaqs);
                          }}
                          placeholder="e.g. Science"
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm uppercase text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div className="sm:col-span-5 space-y-1">
                        <label className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Answer
                        </label>
                        <input
                          type="text"
                          value={faq.answer}
                          onChange={(e) => {
                            const newFaqs = [...formFaqs];
                            newFaqs[idx].answer = e.target.value;
                            setFormFaqs(newFaqs);
                          }}
                          placeholder="e.g. Yes. We use zero sugar and stevia."
                          className="w-full bg-background border border-border px-2 py-1.5 font-sans text-sm text-foreground focus:outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {saveMessage && (
                <div className="p-3 bg-brand/10 border border-brand/20 text-brand text-xs font-sans uppercase tracking-wider text-center">
                  {saveMessage}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSavingProduct || isUploadingImage}
                  className="flex-1 py-4.5 bg-brand text-brand-foreground font-display text-xl uppercase tracking-wider hover:bg-foreground hover:text-background transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSavingProduct ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>Saving Formulation Specs...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-5" />
                      <span>Deploy Formulation to Catalog</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setActiveTab("products");
                  }}
                  className="px-8 py-4.5 border border-border bg-surface text-foreground font-display text-xl uppercase tracking-wider hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all cursor-pointer"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
