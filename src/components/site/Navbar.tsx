"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useCart, cartCount } from "@/stores/cart";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { items, toggleCart } = useCart();
  const count = cartCount(items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/shop", label: "Shop" },
    { href: "/science", label: "Science" },
    { href: "/ingredients", label: "Ingredients" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/certificates", label: "Certificates" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--header-border)] shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center">
            {theme === "dark" ? (
              <img
                src="/myfitboat-light.png"
                alt="MyFitBoat"
                className="h-8.5 w-auto object-contain"
              />
            ) : (
              <img
                src="/myfitboat-dark.png"
                alt="MyFitBoat"
                className="h-8.5 w-auto object-contain"
              />
            )}
          </Link>
          <div className="hidden lg:flex items-center gap-7 font-display text-[13px] font-bold uppercase tracking-wider">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-brand transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-5 font-display text-[13px] font-bold uppercase tracking-wider">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="hover:text-brand transition-colors cursor-pointer p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
          >
            {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </button>
          <button
            onClick={toggleCart}
            className="hover:text-brand transition-colors flex items-center gap-2 cursor-pointer bg-brand/10 hover:bg-brand/20 text-brand px-3 py-1.5 rounded-md transition-all"
            aria-label="Open cart"
          >
            <ShoppingBag className="size-4" />
            <span>Cart</span>
            <span className="bg-brand text-brand-foreground px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none">
              {count}
            </span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden hover:text-brand transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background py-6 px-6 space-y-4 flex flex-col font-mono text-xs uppercase tracking-widest absolute top-full left-0 w-full z-40 shadow-xl animate-fade-in">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-brand py-2 border-b border-border/40 last:border-0 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
