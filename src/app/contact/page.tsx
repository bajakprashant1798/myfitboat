"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<{ email?: string; phone?: string; message?: string }>({});
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please provide a valid email address";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (phone.length < 8) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!message) {
      newErrors.message = "Message content is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear validation errors and show success state
    setErrors({});
    setIsSent(true);

    // Reset fields
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* HERO SECTION */}
      <section className="border-b border-border py-20 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_84/0.05)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="font-mono text-brand text-xs uppercase tracking-[0.3em] mb-4">
            Get In Touch / 006
          </div>
          <h1 className="font-display text-5xl md:text-8xl uppercase leading-none tracking-tight mb-6">
            Contact <span className="text-brand">Support</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Have questions about the formulation, wholesale distributorship, or order details?
            Connect with us.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="p-6 md:p-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* INFO COLUMN */}
          <div className="lg:col-span-5 border border-border p-8 bg-surface space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="font-display text-3xl uppercase text-foreground">Office & Details</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect with our Ahmedabad office or submit the form for wholesale and retail
                distribution support.
              </p>

              <div className="space-y-6 font-mono text-xs text-muted-foreground">
                <div className="flex gap-4 items-start">
                  <MapPin className="size-5 text-brand shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground/60 block mb-1">
                      Registered Address
                    </span>
                    <span className="text-foreground leading-normal">
                      B-502, Safal Parisar Road,
                      <br />
                      Bopal, Ahmedabad, Gujarat - 380057
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Phone className="size-5 text-brand shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground/60 block mb-1">
                      Support Phone
                    </span>
                    <a
                      href="tel:02717491114"
                      className="text-foreground hover:text-brand transition-colors text-sm"
                    >
                      02717491114
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Mail className="size-5 text-brand shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground/60 block mb-1">
                      Email Support
                    </span>
                    <a
                      href="mailto:contact@myfitboat.com"
                      className="text-foreground hover:text-brand transition-colors text-sm"
                    >
                      contact@myfitboat.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Clock className="size-5 text-brand shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground/60 block mb-1">
                      Operational Hours
                    </span>
                    <span className="text-foreground">Monday – Saturday: 9:00 AM – 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border/40 pt-6 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Response time: ~12-24 business hours
            </div>
          </div>

          {/* FORM COLUMN */}
          <div className="lg:col-span-7 border border-border p-8 bg-surface flex flex-col justify-center">
            {isSent ? (
              <div className="text-center py-12 space-y-6">
                <CheckCircle2 className="size-16 text-brand mx-auto drop-shadow-[0_0_15px_oklch(0.82_0.16_84/0.2)]" />
                <h3 className="font-display text-3xl uppercase">Message Dispatched</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. A MyFitBoat support representative will verify your
                  inquiry and email you back.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-6 py-3 border border-border hover:border-brand font-mono text-xs uppercase tracking-widest text-foreground transition-all cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-display text-3xl uppercase text-foreground mb-4">
                  Submit Inquiry
                </h2>

                {/* Email */}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL..."
                    className={`w-full bg-background border px-4 py-3 font-mono text-xs uppercase focus:outline-none placeholder:text-muted-foreground text-foreground ${
                      errors.email
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-brand"
                    }`}
                  />
                  {errors.email && (
                    <span className="font-mono text-[10px] text-destructive uppercase tracking-wider block mt-1">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label
                    htmlFor="phone"
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="ENTER YOUR PHONE NUMBER..."
                    className={`w-full bg-background border px-4 py-3 font-mono text-xs uppercase focus:outline-none placeholder:text-muted-foreground text-foreground ${
                      errors.phone
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-brand"
                    }`}
                  />
                  {errors.phone && (
                    <span className="font-mono text-[10px] text-destructive uppercase tracking-wider block mt-1">
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label
                    htmlFor="subject"
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block"
                  >
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="E.G. WHOLESALE ENQUIRY..."
                    className="w-full bg-background border border-border px-4 py-3 font-mono text-xs uppercase focus:outline-none focus:border-brand placeholder:text-muted-foreground text-foreground"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label
                    htmlFor="message"
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block"
                  >
                    Message Detail *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="WRITE YOUR MESSAGE..."
                    className={`w-full bg-background border px-4 py-3 font-mono text-xs uppercase focus:outline-none placeholder:text-muted-foreground text-foreground resize-none ${
                      errors.message
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-brand"
                    }`}
                  />
                  {errors.message && (
                    <span className="font-mono text-[10px] text-destructive uppercase tracking-wider block mt-1">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-brand hover:bg-foreground hover:text-background text-brand-foreground font-display text-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="size-4" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
