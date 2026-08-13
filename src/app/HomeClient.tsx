"use client";

import Link from "next/link";
import { useCart } from "@/stores/cart";
import { motion } from "framer-motion";
import {
  Droplet,
  Activity,
  Zap,
  Brain,
  Shield,
  Sun,
  Plus,
  Apple,
  Heart,
  ArrowRight,
  HeartPulse,
  Flame,
  Beaker,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
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
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="font-mono text-brand text-[11px] uppercase tracking-[0.25em] font-semibold">
              NEWLY LAUNCHED / 001
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              🍋 Lemonade
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
              🍓 Fruit Punch
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
              🫐 Berry Mix
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl xl:text-8xl leading-[0.85] tracking-tight uppercase text-balance mb-8">
            India's First
            <br />
            Potassium <span className="text-gradient-brand">Rich</span>
            <br />
            <span className="text-foreground">Electrolyte</span>{" "}
            <span className="text-gradient-fruit-mix">Drink</span>
          </h1>
          <p className="max-w-[45ch] text-base md:text-lg text-muted-foreground mb-10 text-pretty">
            Scientifically balanced ratio (1:1 or less) of Sodium and Potassium. Engineered with
            550mg Potassium for peak cardiac and muscle output — zero sugar, packed with real fruit
            flavor.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/shop"
              className="px-10 py-5 bg-brand text-brand-foreground font-display text-xl uppercase tracking-wider hover:bg-foreground hover:text-background transition-all cursor-pointer inline-block text-center shadow-md hover:shadow-lg"
            >
              Buy Now
            </Link>
            <Link
              href={`/products/${product.slug}`}
              className="font-display text-[12px] font-bold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity self-center text-center sm:text-left hover:text-brand"
            >
              Full product details →
            </Link>
          </div>
        </motion.div>

        <div className="flex-1 bg-surface relative overflow-hidden grid place-items-center p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,151,24,0.12)_0%,transparent_70%)]" />
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            src="/product/lemon/lemon_sachet.png"
            alt={`${product.name} sachet`}
            width={1024}
            height={1280}
            className="relative z-10 max-h-[72dvh] w-auto object-contain drop-shadow-[0_25px_50px_rgba(45,151,24,0.22)]"
          />
        </div>
      </section>

      {/* TRUST / METRICS */}
      <div className="border-b border-border grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {[
          ["FSSAI License", "Elite Nutriscience", "bg-emerald-500", "border-t-emerald-500"],
          ["WHO - GMP", "Eurowiss Certified", "bg-amber-500", "border-t-amber-500"],
          ["Purity Standard", "Qualiset Tested", "bg-purple-500", "border-t-purple-500"],
          ["Sweetened", "100% Zero Sugar", "bg-rose-500", "border-t-rose-500"],
        ].map(([k, v, dotBg, borderTop]) => (
          <div
            key={v}
            className={`p-6 flex flex-col items-center gap-2 text-center border-t-2 ${borderTop}`}
          >
            <div className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${dotBg}`} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {k}
              </span>
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
          <div className="font-mono text-[11px] uppercase tracking-tighter text-right hidden md:block opacity-80">
            Standard Formulation: V1.1
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {product.benefits.map((b, i) => {
            const Icon = ICONS[b.icon ?? "droplet"] ?? Droplet;
            const accentColors = [
              "border-emerald-500 text-emerald-400",
              "border-amber-400 text-amber-300",
              "border-rose-500 text-rose-400",
              "border-purple-400 text-purple-300",
              "border-orange-500 text-orange-400",
              "border-teal-400 text-teal-300",
            ];
            const colorClass = accentColors[i % accentColors.length];
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className={`border-t-2 ${colorClass.split(" ")[0]} pt-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm opacity-80">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <Icon className={`size-5 ${colorClass.split(" ")[1]}`} />
                </div>
                <h3 className="font-display text-2xl uppercase mb-3">{b.title}</h3>
                <p className="text-sm leading-relaxed opacity-75">{b.description}</p>
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
            <div className="border border-amber-500/30 bg-amber-500/5 p-6 rounded flex flex-col justify-between items-center space-y-4">
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Apple className="size-7 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="font-mono text-[9px] uppercase text-amber-700 dark:text-amber-400 font-semibold">
                  Standard Medium Banana
                </div>
                <div className="font-display text-3xl uppercase text-foreground mt-1">
                  450 mg Potassium
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                Slow absorption, contains fructose (sucrose/sugars), causing heavy calorie loads
                during active workouts.
              </p>
            </div>
            {/* Our Sachet */}
            <div className="border-2 border-brand bg-brand/5 p-6 rounded flex flex-col justify-between items-center space-y-4 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-fruit-mix text-white font-mono text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl">
                Multi-Flavor
              </div>
              <div className="p-3 bg-brand/10 rounded-full">
                <Heart className="size-7 text-brand" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase text-brand font-bold">
                  MyFitBoat Single Sachet
                </div>
                <div className="font-display text-3xl uppercase text-brand mt-1">
                  550 mg Potassium
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                Rapid intracellular osmosis, zero sugar, zero carbs, fortified with B-vitamins, Zinc
                & real fruit extract.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 FEATURE & SCIENCE SHOWCASE SECTIONS FROM PACKAGING & LAB IMAGES */}
      <section className="border-b border-border divide-y divide-border overflow-hidden">
        {/* SECTION 1: LEMONADE PERFORMANCE & HYDRATION (lemon/image1.png) */}
        <div className="p-8 md:p-16 bg-background">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full font-mono text-[11px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  01 / Lemonade Protocol
                </span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  High-Performance Hydration
                </span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl uppercase leading-[0.95] text-foreground">
                Hydrates. Replenishes. <span className="text-gradient-lemon">Fuels.</span>
              </h2>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Health-First Potassium Rich Electrolyte Drink Formula. Engineered to optimize fluid
                absorption, restore vital mineral balance during heavy exertion, and sustain
                athletic energy with zero sugar.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border transition-colors hover:border-amber-500/40">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                    <Droplet className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg uppercase text-foreground">
                      Hydrates Rapidly
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Accelerates intracellular fluid transfer to eliminate muscle dehydration and
                      physical fatigue.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border transition-colors hover:border-emerald-500/40">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Zap className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg uppercase text-foreground">
                      Replenishes Electrolytes
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Loaded with 550mg Potassium and key trace minerals lost through heavy sweat
                      output.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border transition-colors hover:border-rose-500/40">
                  <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                    <Flame className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg uppercase text-foreground">
                      Fuels Stamina
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Clean endurance formula with zero sugar, zero gluten, and zero energy crash.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  className="px-8 py-3.5 bg-brand text-brand-foreground font-display text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
                >
                  Buy Lemonade <ArrowRight className="size-4" />
                </Link>
                <span className="font-mono text-xs text-muted-foreground">
                  Net Wt: 180g (30 Servings x 6g)
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative rounded-2xl overflow-hidden bg-surface border border-border p-4 md:p-6 group shadow-lg"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,216,59,0.15)_0%,transparent_70%)] opacity-70 pointer-events-none" />
              <img
                src="/product/lemon/image1.png"
                alt="Zero Sugar Lemonade Health-First Electrolyte Drink"
                loading="lazy"
                className="w-full h-auto object-contain rounded-xl drop-shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </motion.div>
          </div>
        </div>

        {/* SECTION 2: VITALITY & ABSORPTION PROTOCOL (benifits.png) */}
        <div className="p-8 md:p-16 bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1 relative rounded-2xl overflow-hidden bg-background border border-border p-4 md:p-6 group shadow-lg"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,28,64,0.15)_0%,transparent_70%)] opacity-70 pointer-events-none" />
              <img
                src="/benifits.png"
                alt="Complete Cardio & Vitamin Shield Hydration Protocol"
                loading="lazy"
                className="w-full h-auto object-contain rounded-xl drop-shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2 space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full font-mono text-[11px] font-semibold uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                  02 / Bio-Absorption Shield
                </span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  Cardio & Vitamin Complex
                </span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl uppercase leading-[0.95] text-foreground">
                Cardio Support &{" "}
                <span className="text-gradient-fruit-mix">Triple Vitamin Shield</span>
              </h2>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Designed to protect cardiac vascular output during high exertion. Combines high
                potassium osmolality with an active vitamin shield (Vitamin B, C, and E) to fight
                cellular oxidative stress.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-background border border-border flex flex-col justify-between transition-colors hover:border-rose-500/40">
                  <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 w-fit mb-3">
                    <HeartPulse className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base uppercase text-foreground">
                      Cardio Pulse
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Potassium stabilizes heartbeat during athletic stress.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border flex flex-col justify-between transition-colors hover:border-amber-500/40">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit mb-3">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base uppercase text-foreground">
                      Vitamins B, C, E
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Immunity defense, energy synthesis & cell recovery.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border flex flex-col justify-between transition-colors hover:border-purple-500/40">
                  <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit mb-3">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base uppercase text-foreground">
                      Peak Bio-Speed
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fast fluid uptake without stomach heaviness.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/science"
                  className="px-8 py-3.5 bg-brand text-brand-foreground font-display text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
                >
                  Learn the Science <ArrowRight className="size-4" />
                </Link>
                <span className="font-mono text-xs text-muted-foreground">
                  Certified Bioavailable Ratio
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* SECTION 3: LEMONADE LAB R&D SHOWCASE (lemon/image2.png) */}
        <div className="p-8 md:p-16 bg-background">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full font-mono text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  03 / Clinical R&D
                </span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  Laboratory Precision
                </span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl uppercase leading-[0.95] text-foreground">
                Biochemically Formulated{" "}
                <span className="text-gradient-brand">Lemonade Science</span>
              </h2>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Engineered in advanced sports science laboratories by clinical researchers. Every
                sachet of Zero Sugar Lemonade undergoes rigorous microscopic testing to ensure high
                purity and optimal ionic osmolality.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border transition-colors hover:border-brand/40">
                  <Beaker className="size-5 text-brand shrink-0" />
                  <span className="font-display text-sm uppercase text-foreground">
                    550mg Potassium Citrate Molecular Formulation
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border transition-colors hover:border-emerald-500/40">
                  <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-display text-sm uppercase text-foreground">
                    GMP & WHO Certified Manufacturing Standard
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border transition-colors hover:border-amber-500/40">
                  <CheckCircle2 className="size-5 text-amber-500 shrink-0" />
                  <span className="font-display text-sm uppercase text-foreground">
                    Non-GMO, Zero Sugar & 100% Vegan Purity
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/certificates"
                  className="px-8 py-3.5 bg-brand text-brand-foreground font-display text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
                >
                  View Lab Certificates <ArrowRight className="size-4" />
                </Link>
                <span className="font-mono text-xs text-muted-foreground">Batch Lab Tested</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative rounded-2xl overflow-hidden bg-surface border border-border p-4 md:p-6 group shadow-lg"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,151,24,0.15)_0%,transparent_70%)] opacity-70 pointer-events-none" />
              <img
                src="/product/lemon/image2.png"
                alt="Lemonade Laboratory Science and Research"
                loading="lazy"
                className="w-full h-auto object-contain rounded-xl drop-shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </motion.div>
          </div>
        </div>

        {/* SECTION 4: FRUIT PUNCH LAB INNOVATION (fruit/image1.png) */}
        <div className="p-8 md:p-16 bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1 relative rounded-2xl overflow-hidden bg-background border border-border p-4 md:p-6 group shadow-lg"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,28,64,0.15)_0%,transparent_70%)] opacity-70 pointer-events-none" />
              <img
                src="/product/fruit/image1.png"
                alt="Zero Sugar Fruit Punch Electrolyte Drink Formula Lab Research"
                loading="lazy"
                className="w-full h-auto object-contain rounded-xl drop-shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2 space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full font-mono text-[11px] font-semibold uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                  04 / Fruit Punch Formula
                </span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  India's First Innovation
                </span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl uppercase leading-[0.95] text-foreground">
                Zero Sugar <span className="text-gradient-punch">Fruit Punch</span>
              </h2>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                India's First Potassium-rich Electrolyte Drink Formula in delicious Fruit Punch
                flavor. Packed with 500mg Potassium, 4+ Essential Electrolytes, and Vitamin
                B-Complex for active daily energy.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-background border border-border transition-colors hover:border-rose-500/40">
                  <span className="font-mono text-[10px] uppercase text-rose-500 font-bold block mb-1">
                    POTASSIUM POWER
                  </span>
                  <h4 className="font-display text-2xl uppercase text-foreground">500 MG</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    High-dose potassium for rapid muscle recovery.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border transition-colors hover:border-amber-500/40">
                  <span className="font-mono text-[10px] uppercase text-amber-500 font-bold block mb-1">
                    ELECTROLYTE MATRIX
                  </span>
                  <h4 className="font-display text-2xl uppercase text-foreground">4+ Minerals</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Potassium, Sodium, Calcium & Magnesium.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border transition-colors hover:border-purple-500/40">
                  <span className="font-mono text-[10px] uppercase text-purple-500 font-bold block mb-1">
                    VITAMIN COMPLEX
                  </span>
                  <h4 className="font-display text-2xl uppercase text-foreground">
                    B3, B6, B12, C
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fortified with Niacin, B5 and Vitamin C.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border transition-colors hover:border-emerald-500/40">
                  <span className="font-mono text-[10px] uppercase text-emerald-500 font-bold block mb-1">
                    CLEAN FORMULA
                  </span>
                  <h4 className="font-display text-2xl uppercase text-foreground">Zero Sugar</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sodium free option, naturally sweetened.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  className="px-8 py-3.5 bg-brand text-brand-foreground font-display text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
                >
                  Buy Fruit Punch <ArrowRight className="size-4" />
                </Link>
                <span className="font-mono text-xs text-muted-foreground">
                  Net Wt: 180g (30 Servings x 6g)
                </span>
              </div>
            </motion.div>
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
        <Link
          href="/shop"
          className="px-10 py-5 bg-brand text-brand-foreground font-display text-xl uppercase tracking-wider hover:bg-foreground hover:text-background transition-all cursor-pointer inline-block text-center shadow-md hover:shadow-lg"
        >
          Buy Now
        </Link>
      </section>
    </div>
  );
}
