"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";

export function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="bg-[var(--footer-bg)] border-t border-[var(--footer-border)] px-6 md:px-16 py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div>
            <h3 className="font-display text-4xl uppercase mb-6">Stay Synced</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md">
              Performance protocols, ingredient deep-dives, and athlete stories. No spam.
            </p>
            <form className="flex border-b border-border" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="bg-transparent w-full py-3 font-mono text-xs focus:outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="text-brand font-mono text-xs tracking-widest uppercase"
              >
                Join
              </button>
            </form>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="font-mono text-[10px] uppercase text-brand tracking-widest">Shop</div>
              <ul className="flex flex-col gap-2 text-xs uppercase">
                <li>
                  <Link href="/shop" className="hover:text-brand">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products/zero-sugar-lemonade" className="hover:text-brand">
                    Lemonade
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="hover:text-brand">
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="font-mono text-[10px] uppercase text-brand tracking-widest">
                Learn
              </div>
              <ul className="flex flex-col gap-2 text-xs uppercase">
                <li>
                  <Link href="/science" className="hover:text-brand">
                    Science
                  </Link>
                </li>
                <li>
                  <Link href="/ingredients" className="hover:text-brand">
                    Ingredients
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-brand">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-brand">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/certificates" className="hover:text-brand">
                    Certificates
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="font-mono text-[10px] uppercase text-brand tracking-widest">
                Legal
              </div>
              <ul className="flex flex-col gap-2 text-xs uppercase">
                <li>
                  <Link href="/privacy" className="hover:text-brand">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-brand">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="hover:text-brand">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-brand">
                    Refunds
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-brand">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border">
          <Link href="/" className="flex items-center">
            {theme === "dark" ? (
              <img
                src="/myfitboat-light.png"
                alt="MyFitBoat"
                className="h-8 w-auto object-contain opacity-40 hover:opacity-100 transition-opacity"
              />
            ) : (
              <img
                src="/myfitboat-dark.png"
                alt="MyFitBoat"
                className="h-8 w-auto object-contain opacity-40 hover:opacity-100 transition-opacity"
              />
            )}
          </Link>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} MyFitBoat
          </span>
        </div>
      </div>
    </footer>
  );
}
