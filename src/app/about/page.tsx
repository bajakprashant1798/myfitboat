import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* HEADER */}
      <section className="border-b border-border py-20 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_84/0.04)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="font-mono text-brand text-xs uppercase tracking-[0.3em] mb-4">
            Our Origin / 001
          </div>
          <h1 className="font-display text-5xl md:text-7xl uppercase leading-none tracking-tight mb-6">
            About <span className="text-brand">MyFitBoat</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Redefining functional hydration through pharmaceutical rigor, clean nutrition, and
            scientific transparency.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="border-b border-border grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-brand mb-4">
            The Purpose
          </div>
          <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Our Mission</h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 text-pretty">
            We are committed to providing products that deliver real, visible improvements in health
            and well-being. Everyone who chooses our products should feel the positive impact in
            their daily lives. We simplify healthy living with science-backed formulas without
            compromise on taste or quality.
          </p>
        </div>
        <div className="p-8 md:p-16 flex items-center justify-center bg-surface relative overflow-hidden min-h-[300px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_84/0.05)_0%,transparent_60%)]" />
          <img
            src="/About Us.3.png"
            alt="MyFitBoat Origin and Mission"
            className="max-h-[350px] w-auto object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(238,186,26,0.1)] rounded"
          />
        </div>
      </section>

      {/* FOUNDER */}
      <section className="border-b border-border p-8 md:p-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-brand">
              The Leadership
            </div>
            <h2 className="font-display text-4xl md:text-5xl uppercase leading-none">
              Meet our
              <br />
              <span className="text-brand">Founder</span>
            </h2>
            <div className="border border-border p-6 bg-surface space-y-4">
              <div className="font-display text-xl uppercase text-foreground">Dishant Trivedi</div>
              <div className="font-mono text-xs text-brand uppercase tracking-wider">
                Founder, Pharmaceutical Professional
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                “I’ve always believed that the right product, made with care and quality, can truly
                change lives. That’s what we aim to deliver every single day.”
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Dishant Trivedi</strong> is a passionate
              pharmaceutical professional with a strong background in both research and
              entrepreneurship. He earned his Bachelor's degree in Pharmacy from Anand, India, and
              later completed his Master's in Pharmaceutical Chemistry from New Jersey, USA.
            </p>
            <p>
              He also enrolled in an MBA in Healthcare Management at Delaware, USA, but chose to
              step away after one year to pursue his entrepreneurial vision full-time.
            </p>
            <p>
              With a keen interest in health, fitness, and innovation, Dishant founded{" "}
              <strong className="text-foreground">Imp Nutritions</strong> in the United States—a
              company focused on developing high-quality nutraceutical and health supplements. All
              products were formulated under strict U.S. FDA guidelines, ensuring safety and
              effectiveness.
            </p>
            <p>
              Professionally, Dishant has worked as a Research Scientist with leading pharmaceutical
              companies such as <strong className="text-foreground">Novartis</strong> and{" "}
              <strong className="text-foreground">Amneal</strong>, contributing significantly to
              research and development. His work involved formulating medicines that meet the
              highest quality standards and comply with US FDA regulations.
            </p>
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="bg-surface p-8 md:p-16 text-center border-b border-border">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-display text-3xl uppercase">Quality Without Compromise</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto">
            From raw ingredient sourcing to batch laboratory analysis, every MyFitBoat production
            run is certified for purity, consistency, and athletic compliance.
          </p>
        </div>
      </section>
    </div>
  );
}
