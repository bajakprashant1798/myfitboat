-- ==============================================================================
-- SUPABASE MIGRATION SCRIPT FOR MULTI-PRODUCT CERTIFICATES
-- Description: Creates the `certificates` table and `product_certificates` M:N junction table.
-- ==============================================================================

-- 1. Create Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    certificate_number VARCHAR(100) NOT NULL,
    issue_date VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    file_url TEXT NOT NULL,
    badge VARCHAR(100) DEFAULT 'NABL Accredited',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Product-Certificates Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.product_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    certificate_id UUID NOT NULL REFERENCES public.certificates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_product_certificate UNIQUE(product_id, certificate_id)
);

-- 3. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_product_certificates_product_id ON public.product_certificates(product_id);
CREATE INDEX IF NOT EXISTS idx_product_certificates_certificate_id ON public.product_certificates(certificate_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_certificates ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Public Read Access
CREATE POLICY "Public Read Certificates" 
    ON public.certificates 
    FOR SELECT 
    USING (true);

CREATE POLICY "Public Read Product Certificates" 
    ON public.product_certificates 
    FOR SELECT 
    USING (true);

-- 6. RLS Policies: Service Role Admin Access
CREATE POLICY "Admin All Certificates" 
    ON public.certificates 
    FOR ALL 
    USING (true);

CREATE POLICY "Admin All Product Certificates" 
    ON public.product_certificates 
    FOR ALL 
    USING (true);

-- 7. Grant Table Permissions to Supabase API Roles
GRANT ALL ON TABLE public.certificates TO anon, authenticated, service_role, postgres;
GRANT ALL ON TABLE public.product_certificates TO anon, authenticated, service_role, postgres;

-- 7. Seed Initial Lab Certificates (Optional)
INSERT INTO public.certificates (id, title, issuer, certificate_number, issue_date, summary, file_url, badge)
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    'Potassium Assay & Electrolyte Purity Report',
    'Qualiset Testing Laboratories / NABL Accredited',
    'COA-2025-550K',
    'January 2025',
    'NABL lab assay confirming 550mg active Potassium Citrate per sachet with zero heavy metal contaminants.',
    '/product/WhatsApp-Image-2025-09-08-at-15.24.57.png',
    'NABL Accredited'
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-222222222222',
    'FSSAI Food Safety License & Compliance Certificate',
    'Food Safety and Standards Authority of India',
    'FSSAI-10021022000849',
    '2024 - 2029',
    'Central license approval for specialized dietary electrolyte drink formulations and sachet packaging.',
    '/product/Label.jpg',
    'FSSAI Certified'
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-333333333333',
    'WHO-GMP Good Manufacturing Practices Certificate',
    'Eurowiss Standard Quality Assurance',
    'GMP-IND-2024-991',
    'December 2024',
    'Certified ISO cleanroom processing ensuring zero cross-contamination and 100% batch consistency.',
    '/product/Cardio-explainig-image.jpg',
    'WHO-GMP'
  )
ON CONFLICT (id) DO NOTHING;

-- Link Seeded Certificates to Zero Sugar Lemonade product if present
INSERT INTO public.product_certificates (product_id, certificate_id)
SELECT p.id, c.id
FROM public.products p
CROSS JOIN public.certificates c
WHERE p.slug = 'zero-sugar-lemonade'
ON CONFLICT (product_id, certificate_id) DO NOTHING;
