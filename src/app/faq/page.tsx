"use client";

import { useState } from "react";
import { Plus, Minus, Search, HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "science" | "usage" | "ingredients" | "shipping";
}

const FAQS_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "science",
    question: "Why 550mg potassium per sachet?",
    answer:
      "Potassium is the primary intracellular cation and most adults — especially active ones — under-consume it. 550mg per serving puts you in the optimal range for physiological performance and recovery without exceeding daily safe thresholds.",
  },
  {
    id: "faq-2",
    category: "usage",
    question: "How do I use it?",
    answer:
      "Tear open one sachet, pour into 250–500ml of cold water, stir, and drink. Best taken 15–30 minutes before exercise, or during high-intensity training sessions to offset muscle fatigue.",
  },
  {
    id: "faq-3",
    category: "ingredients",
    question: "Is it really zero sugar?",
    answer:
      "Yes. We use organic lemon extract and a clean, high-grade steviol glycoside blend for sweetening. There is zero added cane sugar, zero maltodextrin fillers, and zero synthetic chemical sweeteners.",
  },
  {
    id: "faq-4",
    category: "ingredients",
    question: "Is it keto-friendly?",
    answer:
      "Absolutely. With zero sugar and minimal net carbohydrates, MyFitBoat is fully compatible with ketogenic protocols, intermittent fasting schedules, and low-carb training models.",
  },
  {
    id: "faq-5",
    category: "usage",
    question: "Can I take it daily?",
    answer:
      "Yes. The formula is designed for daily use by active individuals. Standard usage is 1–2 sachets per day to maintain mineral balance, unless directed otherwise by your healthcare advisor.",
  },
  {
    id: "faq-6",
    category: "shipping",
    question: "When will my order arrive?",
    answer:
      "Orders ship within 24 hours of verification from our fulfillment center in Mumbai. Standard delivery across India takes 3–5 business days. Free shipping is automatically applied on orders over ₹999.",
  },
  {
    id: "faq-7",
    category: "shipping",
    question: "What's your refund policy?",
    answer:
      "We stand behind the quality of our formulation. If you are not satisfied with your purchase, you can return it within 30 days for a full refund of your order — no questions asked.",
  },
  {
    id: "faq-8",
    category: "science",
    question: "Is it safe for women / pregnant athletes?",
    answer:
      "The formula uses food-grade mineral and vitamin compounds well within standard RDA ranges. We always recommend consulting with your personal physician if you are pregnant, nursing, or have a pre-existing medical condition.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | FAQItem["category"]>("all");

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFAQs = FAQS_DATA.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* HERO SECTION */}
      <section className="border-b border-border py-20 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_84/0.05)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="font-mono text-brand text-xs uppercase tracking-[0.3em] mb-4">
            Knowledge base / 004
          </div>
          <h1 className="font-display text-5xl md:text-8xl uppercase leading-none tracking-tight mb-6">
            Frequently Asked <br />
            <span className="text-brand">Questions</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Find immediate answers on the Flipped Ratio, usage protocols, ingredient sourcing, and
            order shipping.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-6">
        {/* SEARCH & FILTER BAR */}
        <div className="space-y-6 mb-12">
          {/* Search box */}
          <div className="relative border border-border bg-surface flex items-center px-4">
            <Search className="size-5 text-muted-foreground mr-3" />
            <input
              type="text"
              placeholder="SEARCH QUESTIONS OR KEYWORDS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full py-4 font-mono text-xs uppercase focus:outline-none placeholder:text-muted-foreground text-foreground"
            />
          </div>

          {/* Category buttons */}
          <div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-widest border-b border-border pb-4">
            {[
              { id: "all", label: "All questions" },
              { id: "science", label: "Science & formulation" },
              { id: "usage", label: "Preparation & intake" },
              { id: "ingredients", label: "Sweeteners & keto" },
              { id: "shipping", label: "Shipping & returns" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as "all" | FAQItem["category"])}
                className={`px-3 py-1.5 border transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-brand text-brand-foreground border-brand font-medium shadow-[0_0_10px_oklch(0.82_0.16_84/0.1)]"
                    : "border-border hover:border-foreground/30 text-muted-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ ACCORDION LIST */}
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-16 border border-border border-dashed">
            <HelpCircle className="size-8 text-muted-foreground mx-auto mb-4" />
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              No matching questions found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`border transition-all duration-300 bg-surface ${
                    isOpen
                      ? "border-brand shadow-[0_0_20px_oklch(0.82_0.16_84/0.03)]"
                      : "border-border"
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full text-left p-6 flex items-center justify-between gap-6 cursor-pointer"
                  >
                    <span className="font-display text-xl uppercase tracking-wide text-foreground">
                      {faq.question}
                    </span>
                    <span className="text-brand shrink-0">
                      {isOpen ? <Minus className="size-5" /> : <Plus className="size-5" />}
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "max-h-[300px] border-t border-border/40 p-6 bg-background/30"
                        : "max-h-0"
                    }`}
                  >
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                    <div className="mt-4 flex gap-2 justify-end font-mono text-[8px] uppercase tracking-widest text-brand">
                      <span>Category: {faq.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SUPPORT BANNER */}
      <section className="bg-surface p-8 md:p-16 border-t border-border text-center mt-12">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="font-display text-2xl uppercase">Still Have Questions?</h2>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto">
            Our support desk is open Monday through Saturday from 9 AM to 6 PM.
          </p>
          <div className="pt-2">
            <a
              href="/contact"
              className="inline-block px-6 py-3 border-2 border-brand text-brand hover:bg-brand hover:text-brand-foreground font-mono text-[10px] uppercase tracking-widest transition-colors"
            >
              Contact Support desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
