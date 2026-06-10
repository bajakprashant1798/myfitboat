export default function TermsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto border border-border bg-surface p-8 md:p-12 space-y-8">
        <div className="font-mono text-brand text-xs uppercase tracking-[0.3em] mb-4">
          Legal documents
        </div>
        <h1 className="font-display text-4xl md:text-5xl uppercase leading-none tracking-tight">
          Terms & <span className="text-brand">Conditions</span>
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest border-b border-border pb-4">
          Last Updated: June 2026
        </p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            Welcome to MyFitBoat! These terms and conditions outline the rules and regulations for
            the use of My Fit Boat's Website, located at https://myfitboat.com.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">1. User Agreements</h3>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not
            continue to use MyFitBoat if you do not agree to take all of the terms and conditions
            stated on this page.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">
            2. Intellectual Property Rights
          </h3>
          <p>
            Unless otherwise stated, My Fit Boat and/or its licensors own the intellectual property
            rights for all material on MyFitBoat. All intellectual property rights are reserved. You
            must not copy, sell, or rent material from our web pages.
          </p>

          <h3 className="font-display text-xl uppercase text-foreground">
            3. Liability Disclaimer
          </h3>
          <p>
            The products offered on this site are dietary supplements formulated in accordance with
            WHO-GMP and FSSAI standards. They are not intended to diagnose, treat, cure, or prevent
            any chronic cardiovascular or metabolic diseases. Always consult your medical
            professional before modifying your electrolyte protocol.
          </p>
        </div>
      </div>
    </div>
  );
}
