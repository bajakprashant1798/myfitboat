export default function ShippingPolicyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto border border-border bg-surface p-8 md:p-12 space-y-8">
        <div className="font-mono text-brand text-xs uppercase tracking-[0.3em] mb-4">
          Legal documents
        </div>
        <h1 className="font-display text-4xl md:text-5xl uppercase leading-none tracking-tight">
          Shipping <span className="text-brand">Policy</span>
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest border-b border-border pb-4">
          Last Updated: June 2026
        </p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            At MyFitBoat, we aim to deliver our specialized hydration formulations in perfect
            condition, directly to your doorstep.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">1. Shipping timelines</h3>
          <p>
            All verified orders are processed and shipped within 24 business hours from our central
            fulfillment center in Mumbai, Maharashtra. Standard transit times across India range
            from 3 to 5 business days.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">
            2. Rates & Free Shipping
          </h3>
          <p>
            A flat shipping rate of ₹50 is applied on standard orders. Free shipping is
            automatically applied during checkout on all orders of ₹999 or more.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">
            3. Tracking & Damaged Goods
          </h3>
          <p>
            Once shipped, you will receive a tracking link via email and SMS. In the rare event that
            your product box or sachets arrive in a damaged state, please contact our support desk
            immediately at contact@myfitboat.com with photographs, and we will issue a replacement
            run.
          </p>
        </div>
      </div>
    </div>
  );
}
