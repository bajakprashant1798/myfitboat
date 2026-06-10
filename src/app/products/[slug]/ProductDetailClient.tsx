"use client";

import { useState } from "react";
import { useCart } from "@/stores/cart";
import { Star, Shield, HelpCircle, Activity, ChevronRight, Check } from "lucide-react";
import type { ProductDetail } from "@/lib/products.functions";
import Link from "next/link";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const PRODUCT_IMAGES = [
  { src: "/product/Box_Sachet_Front-image-1.jpg", alt: "Box and Sachet Front" },
  { src: "/product/WhatsApp-Image-2025-09-08-at-15.24.57.png", alt: "Nutrition Facts Label" },
  { src: "/product/Cardio-explainig-image.jpg", alt: "Cardio Health Flipped Ratio Explanation" },
  { src: "/product/How-to-use-image.png", alt: "How to use instruction diagram" },
  { src: "/product/Label.jpg", alt: "Product composition label details" },
  { src: "/product/5.jpg", alt: "Sachets display" },
];

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const addItem = useCart((s) => s.addItem);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "science" | "ingredients" | "usage">(
    "overview",
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find((v) => v.is_default) ?? product.variants[0],
  );

  const galleryImages =
    product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0
      ? (product.gallery as string[]).map((url: string, i: number) => ({
          src: url,
          alt: `${product.name} Image ${i + 1}`,
        }))
      : product.image_url
        ? [{ src: product.image_url, alt: product.name }]
        : PRODUCT_IMAGES;

  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center",
      transform: "scale(1)",
    });
  };

  const onAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      id: selectedVariant.id,
      productSlug: product.slug,
      name: product.name,
      variantName: selectedVariant.name,
      priceInr: selectedVariant.price_inr,
      image: galleryImages[0]?.src || "/product/Box_Sachet_Front-image-1.jpg",
    });
  };

  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-8">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/shop" className="hover:text-brand">
            Shop
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* TOP LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* LEFT: GALLERY CAROUSEL */}
          <div className="lg:col-span-7 space-y-4">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-surface border border-border p-6 flex items-center justify-center relative overflow-hidden h-[400px] md:h-[550px] cursor-zoom-in"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_84/0.05)_0%,transparent_75%)]" />
              {galleryImages[activeImageIdx] && (
                <img
                  src={galleryImages[activeImageIdx].src}
                  alt={galleryImages[activeImageIdx].alt}
                  style={{
                    transition: "transform 0.1s ease-out, transform-origin 0.05s ease-out",
                    ...zoomStyle,
                  }}
                  className="relative z-10 max-h-[85%] max-w-[85%] w-auto h-auto object-contain drop-shadow-[0_25px_50px_rgba(238,186,26,0.15)] rounded"
                />
              )}
            </div>
            {/* THUMBNAILS */}
            <div className="grid grid-cols-6 gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.src}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`border p-2 bg-surface flex items-center justify-center h-16 md:h-24 transition-all relative overflow-hidden cursor-pointer ${
                    activeImageIdx === idx
                      ? "border-brand shadow-[0_0_10px_oklch(0.82_0.16_84/0.1)]"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: SELECTION PANEL */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-border p-8 bg-surface">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-brand">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-brand stroke-none" />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  (5.0 · 326 verified buyer reports)
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl uppercase leading-none mb-3">
                {product.name}
              </h1>
              <div className="font-mono text-brand text-xs uppercase tracking-widest mb-6">
                {product.tagline}
              </div>

              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Variant selection */}
              <div className="space-y-3 mb-6">
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  Select Pack Configuration:
                </div>
                <div className="space-y-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`w-full flex items-center justify-between p-3 border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-brand bg-brand/5"
                            : "border-border bg-background hover:border-foreground/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-3 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-brand bg-brand" : "border-border bg-transparent"
                            }`}
                          >
                            {isSelected && (
                              <Check className="size-2 text-brand-foreground stroke-[4px]" />
                            )}
                          </div>
                          <div>
                            <span className="font-display text-base uppercase leading-none">
                              {v.name}
                            </span>
                            {v.badge && (
                              <span className="block font-mono text-[7px] uppercase tracking-widest text-brand mt-0.5">
                                {v.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right font-mono text-base font-medium">
                          {inr(v.price_inr)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button
                onClick={onAddToCart}
                className="w-full py-5 bg-brand text-brand-foreground font-display text-xl uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors cursor-pointer text-center"
              >
                Add to Cart — {inr(selectedVariant.price_inr)}
              </button>

              <div className="border-t border-border pt-4 grid grid-cols-2 divide-x divide-border">
                <div className="pr-2 flex items-center gap-2.5">
                  <Shield className="size-4 text-brand shrink-0" />
                  <span className="font-mono text-[9px] uppercase leading-tight text-muted-foreground">
                    FSSAI Central & WHO-GMP Standards
                  </span>
                </div>
                <div className="pl-2 flex items-center gap-2.5">
                  <Activity className="size-4 text-brand shrink-0" />
                  <span className="font-mono text-[9px] uppercase leading-tight text-muted-foreground">
                    Cardiac Supportive Flipped Ratio
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE DETAILS TABS */}
        <section className="border border-border bg-surface mb-16">
          <div className="flex border-b border-border font-mono text-[10px] md:text-[11px] uppercase tracking-widest overflow-x-auto divide-x divide-border">
            {[
              { id: "overview", label: "Overview" },
              { id: "science", label: "Electrolyte Science" },
              { id: "ingredients", label: "Ingredients breakdown" },
              { id: "usage", label: "How to use" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "overview" | "science" | "ingredients" | "usage")
                }
                className={`px-6 py-4 transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-background text-brand font-medium border-b border-brand"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="font-display text-2xl uppercase">
                    Engineered for Hydration Performance
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Most hydration brands pack their formulas with cheap sodium and artificial
                    sugars, completely ignoring potassium. High sodium intake without balanced
                    potassium can lead to bloating, muscle weakness, and cardiac stress.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    MyFitBoat flips this completely. Each sachet delivers{" "}
                    <strong className="text-brand">550mg Potassium Citrate</strong>
                    paired with calcium, magnesium, vitamins, and zinc. Fluid is pushed directly
                    into cells for instant, cramp-free recovery.
                  </p>
                </div>
                <div className="border border-border p-6 bg-background rounded">
                  <h4 className="font-mono text-sm uppercase text-brand tracking-wider mb-4">
                    Protocol Key Metrics:
                  </h4>
                  <ul className="space-y-3 font-mono text-sm text-muted-foreground">
                    <li className="flex justify-between border-b border-border/40 pb-2">
                      <span>Serving Size:</span>
                      <span className="text-foreground">5g Sachet</span>
                    </li>
                    <li className="flex justify-between border-b border-border/40 pb-2">
                      <span>Sugar:</span>
                      <span className="text-foreground">0g (Stevia sweetened)</span>
                    </li>
                    <li className="flex justify-between border-b border-border/40 pb-2">
                      <span>Potassium Citrate:</span>
                      <span className="text-brand">550 mg</span>
                    </li>
                    <li className="flex justify-between border-b border-border/40 pb-2">
                      <span>Sodium:</span>
                      <span className="text-foreground">40 mg (Low-sodium profile)</span>
                    </li>
                    <li className="flex justify-between pb-2">
                      <span>Targeting:</span>
                      <span className="text-foreground">Heart, muscle endurance</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* SCIENCE TAB */}
            {activeTab === "science" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <h3 className="font-display text-2xl uppercase text-brand">
                    The Cardiac Potassium Advantage
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    A balanced sodium-to-potassium ratio is required to regulate blood pressure and
                    sustain proper cardiac rhythm. Most commercial options pack 300mg+ sodium and
                    less than 100mg potassium, causing cellular fluid imbalances.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed font-semibold">
                    MyFitBoat flips this with:
                  </p>
                  <ul className="space-y-2 text-base text-muted-foreground list-disc pl-5">
                    <li>
                      <strong className="text-foreground">550mg Potassium</strong> for steady heart
                      contractions and neurological relay performance.
                    </li>
                    <li>
                      <strong className="text-foreground">Low-sodium (40mg) balance</strong> to
                      support rapid hydration without bloating.
                    </li>
                    <li>
                      <strong className="text-foreground">Magnesium and Calcium</strong> synergy to
                      relax blood vessel walls and mitigate lactic acid fatigue.
                    </li>
                  </ul>
                </div>
                <div className="lg:col-span-5 bg-background p-4 border border-border flex items-center justify-center rounded">
                  <img
                    src="/product/Cardio-explainig-image.jpg"
                    alt="Cardiac comparison graph"
                    className="max-h-[300px] w-auto object-contain rounded"
                  />
                </div>
              </div>
            )}

            {/* INGREDIENTS TAB */}
            {activeTab === "ingredients" && (
              <div className="space-y-6">
                <h3 className="font-display text-2xl uppercase mb-6">
                  Complete Composition Profile
                </h3>
                <div className="overflow-x-auto border border-border">
                  <table className="w-full text-left font-mono text-sm border-collapse">
                    <thead>
                      <tr className="bg-background text-brand border-b border-border uppercase tracking-wider">
                        <th className="p-4 border-r border-border">Component</th>
                        <th className="p-4 border-r border-border">Strength (Per serving)</th>
                        <th className="p-4">Physiological Function</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {product.ingredients.map((ing) => (
                        <tr key={ing.id} className="hover:bg-background/40">
                          <td className="p-4 border-r border-border font-medium text-foreground">
                            {ing.name}
                          </td>
                          <td className="p-4 border-r border-border text-brand">
                            {ing.amount || "N/A"}
                          </td>
                          <td className="p-4 text-muted-foreground leading-normal">
                            {ing.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* USAGE TAB */}
            {activeTab === "usage" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="font-display text-2xl uppercase">Simple Preparation Steps</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="font-mono text-brand font-bold text-lg">01.</div>
                      <div>
                        <h4 className="font-display text-base uppercase text-foreground">
                          Tear and Pour
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Empty one 5g lemonade sachet into a glass or athletic shaker.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="font-mono text-brand font-bold text-lg">02.</div>
                      <div>
                        <h4 className="font-display text-base uppercase text-foreground">
                          Add Cold Water
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pour in 250ml to 500ml of cold water, adjusting for your preferred flavor
                          intensity.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="font-mono text-brand font-bold text-lg">03.</div>
                      <div>
                        <h4 className="font-display text-base uppercase text-foreground">
                          Stir and Drink
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Stir/shake for 10 seconds until completely dissolved. Consume 15-30
                          minutes before or during exercise.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center bg-background border border-border p-4 rounded">
                  <img
                    src="/product/How-to-use-image.png"
                    alt="How to prepare illustration"
                    className="max-h-[300px] w-auto object-contain rounded"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ATHLETE REVIEWS */}
        <section className="border-t border-border pt-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground mb-3">
              Athlete Reports
            </div>
            <h2 className="font-display text-4xl uppercase">Real Output Feedback</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="bg-surface border border-border p-6 rounded">
                <div className="flex text-brand mb-4 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="size-3.5 fill-brand stroke-none" />
                  ))}
                </div>
                <h4 className="font-display text-lg uppercase mb-2">
                  "{rev.title || "Excellent Product"}"
                </h4>
                <p className="text-base text-muted-foreground italic leading-relaxed mb-6">
                  "{rev.body}"
                </p>
                <div className="flex justify-between items-center font-mono text-[10px] uppercase text-muted-foreground pt-4 border-t border-border/40">
                  <span>{rev.author_name}</span>
                  <span className="text-brand font-semibold">
                    {rev.author_title || "Verified Athlete"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
