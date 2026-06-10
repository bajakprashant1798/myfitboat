export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto border border-border bg-surface p-8 md:p-12 space-y-8">
        <div className="font-mono text-brand text-xs uppercase tracking-[0.3em] mb-4">
          Legal documents
        </div>
        <h1 className="font-display text-4xl md:text-5xl uppercase leading-none tracking-tight">
          Privacy <span className="text-brand">Policy</span>
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest border-b border-border pb-4">
          Last Updated: June 2026
        </p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            At MyFitBoat, accessible from https://myfitboat.com, one of our main priorities is the
            privacy of our visitors. This Privacy Policy document contains types of information that
            is collected and recorded by MyFitBoat and how we use it.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">
            1. Information We Collect
          </h3>
          <p>
            We collect personal information that you provide to us directly, such as your name,
            email address, phone number, and billing/shipping address when placing an order or
            contacting us.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">
            2. How We Use Your Information
          </h3>
          <p>
            We use the information we collect to process transactions, dispatch orders from our
            Mumbai facility, communicate with you regarding your shipment, and resolve support
            queries.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">
            3. Log Files & Analytics
          </h3>
          <p>
            MyFitBoat follows a standard procedure of using log files. These files log visitors when
            they visit websites. The information collected includes internet protocol (IP)
            addresses, browser type, Internet Service Provider (ISP), date/time stamps, and pages
            visited.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">4. Consent</h3>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </div>
      </div>
    </div>
  );
}
