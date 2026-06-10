export default function RefundPolicyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto border border-border bg-surface p-8 md:p-12 space-y-8">
        <div className="font-mono text-brand text-xs uppercase tracking-[0.3em] mb-4">
          Legal documents
        </div>
        <h1 className="font-display text-4xl md:text-5xl uppercase leading-none tracking-tight">
          Refund <span className="text-brand">Policy</span>
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest border-b border-border pb-4">
          Last Updated: June 2026
        </p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            We stand behind the formulation quality and physiological performance of our hydration
            packets.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">1. 30-Day Guarantee</h3>
          <p>
            If you are not satisfied with MyFitBoat, you can request a return and refund within 30
            days of purchase. Simply email our customer support team at contact@myfitboat.com with
            your order details and reason.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">2. Processing Refunds</h3>
          <p>
            Once approved, your refund will be processed immediately, and a credit will
            automatically be applied to your original payment method (UPI / Credit Card) within 5–7
            business days.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">3. Return Shipping</h3>
          <p>
            Depending on the return reason, our support desk may issue a pickup order or ask you to
            mail back any remaining packets.
          </p>
        </div>
      </div>
    </div>
  );
}
