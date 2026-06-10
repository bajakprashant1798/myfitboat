"use client";

import Link from "next/link";
import { useCart } from "@/stores/cart";
import { motion } from "framer-motion";
import { Droplet, Activity, Zap, Brain, Shield, Sun, Plus, Apple, Heart } from "lucide-react";
import type { ProductDetail } from "@/lib/products.functions";

const ICONS: Record<string, typeof Droplet> = {
  droplet: Droplet,
  activity: Activity,
  zap: Zap,
  brain: Brain,
  shield: Shield,
  sun: Sun,
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function HomeClient({ product }: { product: ProductDetail }) {
  const addItem = useCart((s) => s.addItem);
  const defaultVariant = product.variants.find((v) => v.is_default) ?? product.variants[0];

  const onAddToCart = () => {
    if (!defaultVariant) return;
    addItem({
      id: defaultVariant.id,
      productSlug: product.slug,
      name: product.name,
      variantName: defaultVariant.name,
      priceInr: defaultVariant.price_inr,
      image: "/product/Box_Sachet_Front-image-1.jpg",
    });
  };

  return (
    <div className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative min-h-[90dvh] flex flex-col md:flex-row items-stretch border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-8 md:p-16 flex flex-col justify-center"
        >
          <div className="font-mono text-brand text-[12px] uppercase tracking-[0.3em] mb-6">
            NEWLY LAUNCHED / 001
          </div>
          <h1 className="font-display text-5xl md:text-7xl xl:text-8xl leading-[0.85] tracking-tight uppercase text-balance mb-8">
            India's First
            <br />
            Potassium <span className="text-brand">Rich</span>
            <br />
            Electrolyte Drink
          </h1>
          <p className="max-w-[45ch] text-base md:text-lg text-muted-foreground mb-10 text-pretty">
            Scientifically balanced ratio (1:1 or less) of Sodium and Potassium. Engineered with
            550mg Potassium for peak cardiac and muscle output — zero sugar, obviously tasty.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onAddToCart}
              className="px-10 py-5 bg-brand text-brand-foreground font-display text-xl uppercase tracking-wider hover:bg-foreground hover:text-background transition-all cursor-pointer"
            >
              Add to Cart — {inr(defaultVariant?.price_inr ?? product.price_inr)}
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="font-mono text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity self-center text-center sm:text-left"
            >
              Full product details →
            </Link>
          </div>
        </motion.div>

        <div className="flex-1 bg-surface relative overflow-hidden grid place-items-center p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_84/0.10)_0%,transparent_70%)]" />
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            src="/product-with-lamon.png" // Real sachet box and lemon image from public folder
            alt={`${product.name} packaging`}
            width={1024}
            height={1280}
            className="relative z-10 max-h-[70dvh] w-auto object-contain drop-shadow-[0_30px_60px_rgba(238,186,26,0.15)]"
          />
        </div>
      </section>

      {/* TRUST / METRICS */}
      <div className="border-b border-border grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {[
          ["FSSAI License", "Elite Nutriscience"],
          ["WHO - GMP", "Eurowiss Certified"],
          ["Purity Standard", "Qualiset Tested"],
          ["Sweetened", "100% Zero Sugar"],
        ].map(([k, v]) => (
          <div key={v} className="p-6 flex flex-col items-center gap-2 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {k}
            </div>
            <div className="font-display text-lg uppercase">{v}</div>
          </div>
        ))}
      </div>

      {/* BENEFITS */}
      <section className="p-8 md:p-16 bg-foreground text-background">
        <div className="flex justify-between items-end mb-16">
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-none">
            Protocol
            <br />
            Benefits
          </h2>
          <div className="font-mono text-[11px] uppercase tracking-tighter text-right hidden md:block">
            Standard Formulation: V1.1
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {product.benefits.map((b, i) => {
            const Icon = ICONS[b.icon ?? "droplet"] ?? Droplet;
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="border-t-2 border-background pt-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm">[{String(i + 1).padStart(2, "0")}]</span>
                  <Icon className="size-5" />
                </div>
                <h3 className="font-display text-2xl uppercase mb-3">{b.title}</h3>
                <p className="text-sm leading-relaxed opacity-70">{b.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* POTASSIUM CONTENT COMPARISON BLOCK */}
      <section className="border-b border-border bg-surface p-8 md:p-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="font-mono text-brand text-[10px] uppercase tracking-[0.3em]">
            Potassium benchmark
          </div>
          <h2 className="font-display text-4xl md:text-5xl uppercase leading-none">
            Flipping the standard electrolyte scale
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
            Standard sports drinks are loaded with sodium, neglecting potassium. We pair 550mg of
            active potassium citrate with low sodium to fuel cellular fluid transfer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto pt-6">
            {/* Banana */}
            <div className="border border-border bg-background p-6 rounded flex flex-col justify-between items-center space-y-4">
              <Apple className="size-8 text-muted-foreground/60" />
              <div>
                <div className="font-mono text-[9px] uppercase text-muted-foreground">
                  Standard Medium Banana
                </div>
                <div className="font-display text-3xl uppercase text-foreground mt-1">
                  450 mg Potassium
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                Slow absorption, contains fructose (sucrose/sugars), causing calorie loads during
                active runs.
              </p>
            </div>
            {/* Our Sachet */}
            <div className="border border-brand bg-brand/5 p-6 rounded flex flex-col justify-between items-center space-y-4 shadow-[0_0_20px_oklch(0.82_0.16_84/0.04)]">
              <Heart className="size-8 text-brand" />
              <div>
                <div className="font-mono text-[9px] uppercase text-brand">
                  MyFitBoat Single Sachet
                </div>
                <div className="font-display text-3xl uppercase text-brand mt-1">
                  550 mg Potassium
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                Rapid intracellular osmosis, zero sugar, zero carbs, fortified with B-vitamins and
                zinc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INGREDIENTS + SCIENCE */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-border">
        <div className="p-8 md:p-16 border-r border-border flex flex-col justify-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-brand mb-4">
            The Formula
          </div>
          <h2 className="font-display text-5xl uppercase mb-12">Active Compounds</h2>
          <div className="space-y-6">
            {product.ingredients.slice(0, 5).map((i) => (
              <div
                key={i.id}
                className="flex justify-between items-center border-b border-border pb-4"
              >
                <span className="font-display text-xl md:text-2xl uppercase">{i.name}</span>
                <span className="font-mono text-brand text-sm">{i.amount}</span>
              </div>
            ))}
          </div>
          <Link
            href="/ingredients"
            className="inline-block mt-10 font-mono text-[11px] uppercase tracking-widest text-brand hover:underline"
          >
            Full ingredient breakdown →
          </Link>
        </div>

        {/* Real Athlete Image Background */}
        <div className="bg-brand text-brand-foreground p-8 md:p-16 flex flex-col justify-center relative overflow-hidden min-h-[400px]">
          <img
            src="/Cardio-perfoming-athlete_no_text.png" // Real athlete image from public folder
            alt="Cardio sports athlete"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-25"
          />
          <div className="relative z-10">
            <div className="font-mono text-[12px] uppercase tracking-widest mb-6 font-bold">
              The Science
            </div>
            <div className="font-display text-6xl md:text-8xl leading-none mb-4 uppercase">
              Stronger Cardio
            </div>
            <p className="font-display text-2xl md:text-3xl uppercase leading-tight mb-8 max-w-md">
              Starts with the right electrolytes. Flipped sodium-potassium balance optimizes
              heartbeat stability.
            </p>
            <Link
              href="/science"
              className="inline-block px-8 py-3 border-2 border-brand-foreground font-mono text-[11px] uppercase tracking-widest hover:bg-brand-foreground hover:text-brand transition-colors"
            >
              Read the Science
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="p-8 md:p-16 border-b border-border">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] mb-12 text-center text-muted-foreground">
          Athlete Reports
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.reviews.slice(0, 3).map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-surface p-8 border border-border"
            >
              <div className="flex text-brand mb-4 tracking-widest">{"★".repeat(r.rating)}</div>
              <p className="text-lg mb-6 italic text-pretty">"{r.body}"</p>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {r.author_name} — {r.author_title}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto p-8 md:p-16">
        <div className="font-mono text-[10px] uppercase tracking-widest text-brand mb-4 text-center">
          Knowledge Base
        </div>
        <h2 className="font-display text-4xl md:text-5xl uppercase mb-12 text-center">
          Common Questions
        </h2>
        <div className="space-y-2">
          {product.faqs.slice(0, 5).map((f) => (
            <details key={f.id} className="group border-b border-border py-6">
              <summary className="list-none cursor-pointer flex justify-between items-center gap-6">
                <span className="font-display text-lg md:text-xl uppercase">{f.question}</span>
                <Plus className="text-brand size-5 shrink-0 group-open:rotate-45 transition-transform" />
              </summary>
              <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-3xl">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/faq"
            className="font-mono text-[11px] uppercase tracking-widest text-brand hover:underline"
          >
            View all FAQs →
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-surface border-t border-border p-8 md:p-16 text-center">
        <h2 className="font-display text-5xl md:text-7xl uppercase mb-6">Start the Protocol.</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
          Join thousands of athletes who've upgraded their hydration. Free shipping across India on
          orders over ₹999.
        </p>
        <button
          onClick={onAddToCart}
          className="px-10 py-5 bg-brand text-brand-foreground font-display text-xl uppercase tracking-wider hover:bg-foreground hover:text-background transition-all cursor-pointer"
        >
          Add to Cart — {inr(defaultVariant?.price_inr ?? product.price_inr)}
        </button>
      </section>
    </div>
  );
}
