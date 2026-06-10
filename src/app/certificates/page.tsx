import { Shield, FileText, CheckCircle, ExternalLink } from "lucide-react";

interface Certificate {
  title: string;
  number: string;
  holder: string;
  authority: string;
  issued: string;
  expiry: string;
  address: string;
  pdfUrl: string;
  details: string[];
}

const CERTIFICATES_DATA: Certificate[] = [
  {
    title: "FSSAI Central License",
    number: "10721999000020",
    holder: "ELITE NUTRISCIENCE",
    authority: "Food Safety and Standards Authority of India",
    issued: "26-12-2025",
    expiry: "25-12-2026",
    address:
      "73/G, SOPAN KESAR INDUSTRIAL HUB, MORAIYA, TA SANAND, DIST-AHMEDABAD, GUJARAT - 382213",
    pdfUrl: "/certificate/ELITE FSSAI LICENSE COPY.pdf",
    details: [
      "Authorized Central License for manufacture of food supplements",
      "Rigorous adherence to safety standards and storage layout protocols",
      "Full compliance with Schedule 4 sanitation guidelines",
    ],
  },
  {
    title: "FSSAI Registration Certificate",
    number: "20725038002092",
    holder: "Maydev Foods",
    authority: "Food Safety and Standards Authority of India (State Registry)",
    issued: "06-05-2026",
    expiry: "05-05-2031",
    address:
      "B-502, Orchid Divine, Bodakdev(New West Zone), Ahmedabad Corporation, Gujarat - 380057",
    pdfUrl: "/certificate/Maydev Foods new license.pdf",
    details: [
      "Official distribution and wholesale registry",
      "Ensures compliant cold-storage and dispatch channels",
      "Valid for a 5-year operational term",
    ],
  },
  {
    title: "Analytical Test Report",
    number: "QFL/250426/02",
    holder: "Lemonade Formulation (Batch HD11)",
    authority: "Qualiset Food Laboratories",
    issued: "01-05-2026",
    expiry: "FEB-2027 (Batch Expiry)",
    address: "Qualiset Analytical Testing Facility, Gujarat, India",
    pdfUrl: "/certificate/Lab Report.pdf",
    details: [
      "Verifies active Potassium strength at 562mg per sachet",
      "Confirms trace sodium level at 42mg",
      "Tested free of Heavy Metals (Arsenic, Lead, Mercury, Cadmium)",
    ],
  },
  {
    title: "WHO - GMP Certificate",
    number: "ECI/2507/2065",
    holder: "ELITE NUTRISCIENCE",
    authority: "Eurowiss Certification Inc.",
    issued: "24-07-2025",
    expiry: "23-07-2028",
    address:
      "73/G, SOPAN KESAR INDUSTRIAL HUB, MORAIYA, TA SANAND, DIST-AHMEDABAD - 382213, GUJARAT, INDIA",
    pdfUrl: "/certificate/ELITE - WHO-GMP- CERTIFICATE.pdf",
    details: [
      "Compliance with World Health Organization Good Manufacturing Practices",
      "Covers gym supplements, multivitamin sachets, and energy drink mixes",
      "Assures sterile raw component handling and equipment calibrations",
    ],
  },
];

export default function CertificatesPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* HERO SECTION */}
      <section className="border-b border-border py-20 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_84/0.05)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="font-mono text-brand text-xs uppercase tracking-[0.3em] mb-4">
            Quality assurance / 005
          </div>
          <h1 className="font-display text-5xl md:text-8xl uppercase leading-none tracking-tight mb-6">
            Certifications & <br />
            <span className="text-brand">Compliance</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Complete compliance reports validating raw component sourcing, hygienic manufacture
            standards, and exact mineral compositions.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="p-6 md:p-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CERTIFICATES_DATA.map((cert) => (
            <div
              key={cert.number}
              className="border border-border bg-surface p-8 flex flex-col justify-between hover:border-brand/40 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="font-display text-3xl uppercase text-foreground leading-tight">
                      {cert.title}
                    </h2>
                    <div className="font-mono text-xs text-brand uppercase tracking-wider mt-1">
                      {cert.authority}
                    </div>
                  </div>
                  <Shield className="size-8 text-brand shrink-0" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-border/40 py-6 mb-6 font-mono text-xs text-muted-foreground">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-muted-foreground/60 block">
                      License/Report No:
                    </span>
                    <strong className="text-foreground">{cert.number}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-muted-foreground/60 block">
                      Issued To:
                    </span>
                    <strong className="text-foreground">{cert.holder}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-muted-foreground/60 block">
                      Issue Date:
                    </span>
                    <strong className="text-foreground">{cert.issued}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-muted-foreground/60 block">
                      Validity Upto:
                    </span>
                    <strong className="text-foreground">{cert.expiry}</strong>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      Registered Address
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                      {cert.address}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                      Key Compliance Notes
                    </h4>
                    <ul className="space-y-2">
                      {cert.details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="flex gap-2.5 items-start text-xs text-muted-foreground"
                        >
                          <CheckCircle className="size-4 text-brand shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href={cert.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-background hover:bg-foreground hover:text-background border border-border text-foreground font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <FileText className="size-4" />
                  <span>View Official PDF</span>
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DISCLOSURE */}
      <section className="bg-surface border-t border-border p-8 md:p-16 text-center">
        <p className="max-w-2xl mx-auto text-xs text-muted-foreground leading-relaxed font-mono uppercase tracking-widest">
          All document copies are verified and directly pulled from state food safety networks and
          laboratory databases. For verification inquiries, email us at contact@myfitboat.com.
        </p>
      </section>
    </div>
  );
}
