import Link from "next/link";
import { Star } from "lucide-react";
import type { ProductSummary } from "@/lib/products.functions";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function ShopClient({ products }: { products: ProductSummary[] }) {
  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-brand text-xs uppercase tracking-[0.3em] mb-4">
          All Formulations / Collection
        </div>
        <h1 className="font-display text-5xl md:text-7xl uppercase leading-none tracking-tight mb-12">
          THE PROTOCOL <span className="text-brand">SHOP</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => {
            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="border border-border bg-surface flex flex-col justify-between hover:border-brand/40 transition-all group relative overflow-hidden cursor-pointer"
              >
                {/* Image Section */}
                <div className="p-8 bg-surface/50 border-b border-border flex items-center justify-center relative overflow-hidden h-[300px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_84/0.03)_0%,transparent_70%)] group-hover:bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_84/0.06)_0%,transparent_75%)] transition-all" />
                  <img
                    src={p.image_url || "/product/product-with-lamon.png"}
                    alt={p.name}
                    className="relative z-10 w-full max-w-[200px] h-auto object-contain drop-shadow-[0_15px_30px_rgba(238,186,26,0.1)] group-hover:drop-shadow-[0_20px_40px_rgba(238,186,26,0.18)] transition-all duration-300"
                  />
                  {p.compare_at_price_inr && (
                    <span className="absolute top-4 right-4 font-mono text-[8px] uppercase tracking-widest text-brand border border-brand/30 px-2 py-0.5 bg-brand/5">
                      Save{" "}
                      {Math.round(
                        ((p.compare_at_price_inr - p.price_inr) / p.compare_at_price_inr) * 100,
                      )}
                      %
                    </span>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-brand">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="size-3 fill-brand stroke-none" />
                        ))}
                      </div>
                      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                        (5.0 · ACTIVE)
                      </span>
                    </div>

                    <h2 className="font-display text-2xl uppercase tracking-tight group-hover:text-brand transition-colors">
                      {p.name}
                    </h2>

                    {p.tagline && (
                      <div className="font-mono text-brand text-[10px] uppercase tracking-wider">
                        {p.tagline}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {p.description}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {p.badges?.slice(0, 3).map((b) => (
                        <span
                          key={b}
                          className="font-mono text-[8px] uppercase tracking-widest px-2.5 py-0.5 border border-border bg-background/30 text-foreground"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 space-y-4">
                    <div className="flex items-baseline justify-between border-t border-border/40 pt-4">
                      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                        Starting At
                      </span>
                      <div className="flex items-baseline gap-2">
                        {p.compare_at_price_inr && (
                          <span className="font-mono text-xs text-muted-foreground line-through">
                            {inr(p.compare_at_price_inr)}
                          </span>
                        )}
                        <span className="font-mono text-xl text-brand font-semibold">
                          {inr(p.price_inr)}
                        </span>
                      </div>
                    </div>

                    <div className="block w-full py-4 bg-brand text-brand-foreground font-display text-center text-sm uppercase tracking-wider group-hover:bg-foreground group-hover:text-background transition-colors">
                      View Formulation Details
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
