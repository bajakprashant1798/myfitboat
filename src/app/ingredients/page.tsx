"use client";

import { useState } from "react";
import { CheckCircle2, FlaskConical, Award } from "lucide-react";

interface Ingredient {
  name: string;
  amount: string;
  category: "electrolyte" | "vitamin-mineral" | "other";
  function: string;
  physiologicalRole: string;
}

const INGREDIENTS_DATA: Ingredient[] = [
  {
    name: "Potassium Citrate",
    amount: "550 mg",
    category: "electrolyte",
    function: "Cardiac & Muscle Contracting Relay",
    physiologicalRole:
      "Maintains blood pressure, heart rhythm, nerve transmissions, and prevents cramping by keeping cell hydration high.",
  },
  {
    name: "Sodium Citrate/Chloride",
    amount: "40 mg",
    category: "electrolyte",
    function: "Fluid & Osmotic Balance",
    physiologicalRole:
      "Balances body fluid levels without the excess salt retention that leads to bloating and blood pressure spikes.",
  },
  {
    name: "Magnesium Citrate",
    amount: "21 mg",
    category: "electrolyte",
    function: "Muscle Relaxant & Cramp Prevention",
    physiologicalRole:
      "Assists in cellular energy production (ATP), prevents muscle spasms, and helps clear training-induced lactic acid.",
  },
  {
    name: "Calcium Citrate",
    amount: "16 mg",
    category: "electrolyte",
    function: "Bone Density & Nerve Signaling",
    physiologicalRole:
      "Crucial for bone density maintenance and cellular signals that regulate muscle flexing and vasoconstriction.",
  },
  {
    name: "Zinc",
    amount: "5.2 mg",
    category: "vitamin-mineral",
    function: "Cellular Repair & Immune Health",
    physiologicalRole:
      "Promotes protein synthesis, accelerates tissue recovery after workouts, and supports immune cell integrity.",
  },
  {
    name: "Vitamin C (Ascorbic Acid)",
    amount: "43 mg",
    category: "vitamin-mineral",
    function: "Antioxidant & Tissue Resilience",
    physiologicalRole:
      "Neutralizes exercise-induced free radicals, supports collagen synthesis, and optimizes immune responses.",
  },
  {
    name: "Vitamin D3",
    amount: "2.3 mcg (400 IU)",
    category: "vitamin-mineral",
    function: "Calcium Absorption & Muscle Tone",
    physiologicalRole:
      "Aids intestinal absorption of calcium, regulates muscle force generation, and promotes skeletal health.",
  },
  {
    name: "Vitamin B1 (Thiamine)",
    amount: "15 mg",
    category: "vitamin-mineral",
    function: "Carbohydrate Metabolism",
    physiologicalRole:
      "Helps convert carbohydrates into active energy for muscles and nerves, preventing sudden fatigue.",
  },
  {
    name: "Vitamin B3 (Niacinamide)",
    amount: "3.1 mg",
    category: "vitamin-mineral",
    function: "Blood Circulation & Energy Flow",
    physiologicalRole:
      "Supports vasodilation (blood flow) to working muscles and enhances mitochondrial energy release.",
  },
  {
    name: "Vitamin B5 (Pantothenic Acid)",
    amount: "1.2 mg",
    category: "vitamin-mineral",
    function: "Fatty Acid Oxidation & Adrenal Support",
    physiologicalRole:
      "Supports metabolism of fats and proteins and aids in synthesizing stress-coping adrenal hormones.",
  },
  {
    name: "Vitamin B6 (Pyridoxine HCl)",
    amount: "1.4 mg",
    category: "vitamin-mineral",
    function: "Protein Synthesis & RBC Production",
    physiologicalRole:
      "Assists in amino acid breakdown for muscle building and helps generate red blood cells that transport oxygen.",
  },
  {
    name: "Chloride",
    amount: "Aids Hydration",
    category: "electrolyte",
    function: "Electracellular Balance & Digestion",
    physiologicalRole:
      "Works alongside sodium and potassium to maintain electrical neutrality and aids gastric digestion function.",
  },
];

export default function IngredientsPage() {
  const [filter, setFilter] = useState<"all" | "electrolyte" | "vitamin-mineral">("all");

  const filteredIngredients = INGREDIENTS_DATA.filter(
    (item) => filter === "all" || item.category === filter,
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* HERO SECTION */}
      <section className="border-b border-border py-20 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_84/0.05)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="font-mono text-brand text-xs uppercase tracking-[0.3em] mb-4">
            Formula Disclosure / 003
          </div>
          <h1 className="font-display text-5xl md:text-8xl uppercase leading-none tracking-tight mb-6">
            Every Milligram <br />
            <span className="text-brand">Accounted For</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Zero filler. Zero fake sugars. Explore the physiological roles of the 12 active
            components fueling our protocol.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="border-b border-border bg-surface px-6 md:px-16 py-6 sticky top-[68px] z-40 backdrop-blur-md bg-surface/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4 font-mono text-[10px] md:text-xs uppercase tracking-widest">
          <div className="flex gap-2">
            {[
              { id: "all", label: "All ingredients" },
              { id: "electrolyte", label: "Electrolytes" },
              { id: "vitamin-mineral", label: "Vitamins & Minerals" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as "all" | "electrolyte" | "vitamin-mineral")}
                className={`px-4 py-2 border transition-all cursor-pointer ${
                  filter === btn.id
                    ? "bg-brand text-brand-foreground border-brand font-medium shadow-[0_0_15px_oklch(0.82_0.16_84/0.15)]"
                    : "border-border hover:border-foreground/30 text-muted-foreground"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <div className="text-muted-foreground hidden lg:block">Total active compounds: 12</div>
        </div>
      </section>

      {/* LIST GRID */}
      <section className="p-6 md:p-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIngredients.map((ing, idx) => (
            <div
              key={ing.name}
              className="border border-border bg-surface p-6 md:p-8 flex flex-col justify-between hover:border-brand/40 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start mb-6 font-mono text-xs">
                  <span className="text-muted-foreground">
                    [{String(idx + 1).padStart(2, "0")}]
                  </span>
                  <span className="text-brand font-bold uppercase tracking-wider">
                    {ing.category}
                  </span>
                </div>

                <h3 className="font-display text-2xl uppercase leading-none mb-1 text-foreground">
                  {ing.name}
                </h3>
                <div className="font-mono text-brand text-sm font-semibold mb-6">{ing.amount}</div>

                <h4 className="font-mono text-[10px] uppercase text-muted-foreground tracking-wider mb-2">
                  Target Function
                </h4>
                <p className="font-display text-lg uppercase mb-4 text-foreground leading-snug">
                  {ing.function}
                </p>

                <h4 className="font-mono text-[10px] uppercase text-muted-foreground tracking-wider mb-2">
                  Physiological Role
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ing.physiologicalRole}
                </p>
              </div>

              <div className="mt-8 border-t border-border/30 pt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-brand" />
                <span>RDA Compliant Formulation</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LAB CONFIDENCE BANNER */}
      <section className="border-t border-border bg-surface p-8 md:p-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="font-display text-3xl uppercase leading-none">Third-Party Lab Tested</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every batch of MyFitBoat undergoes strict assay testing at Qualiset Food Laboratories.
              We measure vitamin levels and mineral metrics down to the microgram, validating that
              the Flipped Ratio stays perfectly active.
            </p>
          </div>
          <div className="flex gap-4 items-center justify-start md:justify-end">
            <div className="border border-border p-6 bg-background flex items-center gap-3">
              <FlaskConical className="size-6 text-brand" />
              <div className="font-mono text-left">
                <div className="text-[10px] uppercase text-muted-foreground">Lab report</div>
                <div className="text-xs font-bold text-foreground">QFL/250426/02</div>
              </div>
            </div>
            <div className="border border-border p-6 bg-background flex items-center gap-3">
              <Award className="size-6 text-brand" />
              <div className="font-mono text-left">
                <div className="text-[10px] uppercase text-muted-foreground">Standards</div>
                <div className="text-xs font-bold text-foreground">WHO-GMP & FSSAI</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
