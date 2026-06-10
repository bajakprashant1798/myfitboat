import Link from "next/link";
import { Activity, Zap, Shield, Heart } from "lucide-react";

export default function SciencePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* HERO SECTION */}
      <section className="border-b border-border py-20 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_84/0.05)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="font-mono text-brand text-xs uppercase tracking-[0.3em] mb-4">
            Physiological Research / 002
          </div>
          <h1 className="font-display text-5xl md:text-8xl uppercase leading-none tracking-tight mb-6">
            The Science of <br />
            <span className="text-brand">Flipped Hydration</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Research-backed cardiac optimization. Flipping the sodium-heavy formulation paradigm for
            peak cellular energy.
          </p>
        </div>
      </section>

      {/* CORE PROBLEM */}
      <section className="border-b border-border grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-brand mb-4">
            The Problem
          </div>
          <h2 className="font-display text-3xl md:text-4xl uppercase mb-6 leading-tight">
            The Excess Sodium Crisis in Sports Hydration
          </h2>
          <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            <p>
              Traditional sports drinks and hydration powders focus heavily on sodium. While sodium
              is lost in sweat, most modern diets are already heavily overloaded with it.
            </p>
            <p>
              Consuming high-sodium drinks during workouts triggers fluid retention (bloating),
              blood vessel constriction, and elevation in blood pressure. More critically, it
              neglects the crucial mineral that dictates active muscle relaxation and heart rate
              stability: <strong className="text-foreground">Potassium</strong>.
            </p>
          </div>
        </div>
        <div className="p-8 md:p-16 flex flex-col justify-center bg-surface">
          <div className="font-mono text-[10px] uppercase tracking-widest text-brand mb-4">
            The Solution
          </div>
          <h2 className="font-display text-3xl md:text-4xl uppercase mb-6 leading-tight">
            Optimizing the Sodium-to-Potassium Ratio
          </h2>
          <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            <p>
              Every heartbeat and muscle contraction relies on the sodium-potassium pump. Pushing
              high concentrations of intracellular potassium (
              <strong className="text-brand">550mg Citrate</strong>) paired with low sodium (
              <strong className="text-foreground">40mg</strong>) pulls water into the cells
              immediately.
            </p>
            <p>
              This flipped balance stabilizes electrical activity in cardiac tissue, relaxes
              vascular walls, and prevents intractable cramps before they begin.
            </p>
          </div>
        </div>
      </section>

      {/* DETAILED STAT COMPARISON & DIAGRAM */}
      <section className="border-b border-border p-8 md:p-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-brand">
              Comparative Analysis
            </div>
            <h2 className="font-display text-4xl uppercase leading-none">
              Over <span className="text-brand">4X More</span> Potassium
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our formulation flips the standard industrial recipe. We deliver 550mg of bioavailable
              potassium citrate per serving, while keeping sodium levels to a precision minimum of
              40mg.
            </p>
            <div className="border border-border p-6 bg-surface space-y-4">
              <div className="flex justify-between items-center border-b border-border/55 pb-2">
                <span className="font-mono text-xs uppercase text-muted-foreground">
                  MyFitBoat Potassium
                </span>
                <span className="font-display text-lg text-brand">550 mg</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/55 pb-2">
                <span className="font-mono text-xs uppercase text-muted-foreground">
                  Standard Sports Drink
                </span>
                <span className="font-mono text-xs text-muted-foreground">~80-120 mg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs uppercase text-muted-foreground">
                  Sodium Content comparison
                </span>
                <span className="font-mono text-xs text-brand">10x Lower than leading brands</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 flex justify-center bg-surface border border-border p-6 rounded">
            <img
              src="/product/Cardio-explainig-image.jpg"
              alt="Cardiac Flipped Ratio Comparison Graphic"
              className="max-w-full h-auto object-contain rounded drop-shadow-[0_20px_40px_rgba(238,186,26,0.1)]"
            />
          </div>
        </div>
      </section>

      {/* PILLARS OF PERFORMANCE */}
      <section className="border-b border-border p-8 md:p-16 bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl uppercase mb-12 text-center">
            Three Pillars of Flipped Hydration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-border p-8 bg-background space-y-4">
              <Heart className="size-8 text-brand" />
              <h3 className="font-display text-xl uppercase">Cardiac Stability</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Potassium is the chief electrical regulator of cardiovascular rhythm. 550mg
                potassium citrate supports stable cardiac rhythm, prevents pacing stress, and
                maintains comfortable blood pressure during peak outputs.
              </p>
            </div>
            <div className="border border-border p-8 bg-background space-y-4">
              <Activity className="size-8 text-brand" />
              <h3 className="font-display text-xl uppercase">Neuromuscular Relay</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The sodium-potassium pump triggers the electrical signals that drive muscle
                contraction. Enhancing bioavailable potassium prevents contractive locking (cramps)
                and speeds up muscle re-firing.
              </p>
            </div>
            <div className="border border-border p-8 bg-background space-y-4">
              <Zap className="size-8 text-brand" />
              <h3 className="font-display text-xl uppercase">Intracellular Osmosis</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlike high-sodium drinks that hold fluids in extracellular tissue (bloating),
                potassium citrate transports fluid directly across the cell membrane, promoting
                efficient cell hydration and toxin removal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="p-8 md:p-20 text-center bg-background">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-display text-5xl md:text-6xl uppercase">Test the Protocol</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Upgrade your daily performance stack with our scientifically formulated lemonade
            hydration.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-block px-10 py-5 bg-brand text-brand-foreground font-display text-xl uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
            >
              Shop Zero Sugar Lemonade
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
