-- MyFitBoat Database Setup Script
-- Paste this script into your Supabase SQL Editor (Dashboard > SQL Editor > New Query) and click Run.

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  long_description TEXT,
  price_inr INTEGER NOT NULL,
  compare_at_price_inr INTEGER,
  image_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  serving_size TEXT,
  servings_per_pack INTEGER DEFAULT 1,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (is_active = true);

-- 2. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  price_inr INTEGER NOT NULL,
  compare_at_price_inr INTEGER,
  servings INTEGER NOT NULL DEFAULT 1,
  badge TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0
);

GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read variants" ON public.product_variants FOR SELECT USING (true);

-- 3. INGREDIENTS TABLE
CREATE TABLE IF NOT EXISTS public.ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

GRANT SELECT ON public.ingredients TO anon, authenticated;
GRANT ALL ON public.ingredients TO service_role;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ingredients" ON public.ingredients FOR SELECT USING (true);

-- 4. BENEFITS TABLE
CREATE TABLE IF NOT EXISTS public.benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

GRANT SELECT ON public.benefits TO anon, authenticated;
GRANT ALL ON public.benefits TO service_role;
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read benefits" ON public.benefits FOR SELECT USING (true);

-- 5. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (true);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_title TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  title TEXT,
  body TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE DEFAULT ('MFB-' || upper(substring(md5(random()::text || clock_timestamp()::text), 1, 8))),
  email TEXT NOT NULL,
  customer_name TEXT,
  phone TEXT,
  shipping_address JSONB,
  subtotal_inr INTEGER NOT NULL,
  shipping_inr INTEGER NOT NULL DEFAULT 0,
  tax_inr INTEGER NOT NULL DEFAULT 0,
  total_inr INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  tracking_number TEXT,
  carrier TEXT,
  estimated_delivery TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_inr INTEGER NOT NULL,
  line_total_inr INTEGER NOT NULL
);

GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 9. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 10. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 11. TIMESTAMPS HANDLER
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE TRIGGER set_products_updated BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE OR REPLACE TRIGGER set_orders_updated BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 12. SEED DATA FOR PRODUCTS AND SPECIFICATIONS
-- Note: Using a fixed UUID so references match exactly
INSERT INTO public.products (
  id, slug, name, tagline, description, long_description, price_inr, compare_at_price_inr, image_url, gallery, badges, serving_size, servings_per_pack, is_featured, is_active, sort_order
) VALUES (
  '3ff50b4a-2f7a-4146-b09b-cd5bb3e48284',
  'zero-sugar-lemonade',
  'Zero Sugar Lemonade - Potassium Rich Electrolyte',
  'India''s First Potassium-Rich Electrolyte Drink Mix',
  'Stay hydrated and energized with MyFitBoat. Fast-absorbing, potassium-rich hydration formula for sports, workouts, and daily performance.',
  'Most sports drinks are loaded with sodium and sugar, ignoring the key mineral needed for heart health and muscle contraction: potassium. MyFitBoat delivers a potassium-rich, low-sodium formula that supports blood pressure, heart rhythm, stamina, and recovery. Perfect for athletes, active lifestyles, keto, and daily hydration.',
  240,
  300,
  '/product/product-with-lamon.png',
  '["/product/Box_Sachet_Front-image-1.jpg", "/product/WhatsApp-Image-2025-09-08-at-15.24.57.png", "/product/Cardio-explainig-image.jpg", "/product/How-to-use-image.png", "/product/Label.jpg", "/product/5.jpg"]'::jsonb,
  '["Zero Sugar", "Vegan", "Gluten Free", "Lab Tested", "Clean Label"]'::jsonb,
  '5g sachet',
  10,
  true,
  true,
  1
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  price_inr = EXCLUDED.price_inr,
  compare_at_price_inr = EXCLUDED.compare_at_price_inr,
  image_url = EXCLUDED.image_url,
  gallery = EXCLUDED.gallery,
  badges = EXCLUDED.badges;

-- SEED VARIANTS
INSERT INTO public.product_variants (id, product_id, name, sku, price_inr, compare_at_price_inr, servings, badge, is_default, sort_order) VALUES
  ('445f1b13-9a3b-489e-9905-2b47814b78c1', '3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', '10 Sachets Pack', 'MFB-LMN-10', 240, 300, 10, 'Intro Pack', true, 1),
  ('445f1b13-9a3b-489e-9905-2b47814b78c2', '3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', '20 Sachets Pack', 'MFB-LMN-20', 450, 600, 20, 'Value Pack', false, 2),
  ('445f1b13-9a3b-489e-9905-2b47814b78c3', '3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', '30 Sachets Pack', 'MFB-LMN-30', 680, 900, 30, 'Performance Pack', false, 3)
ON CONFLICT (id) DO NOTHING;

-- SEED INGREDIENTS
INSERT INTO public.ingredients (product_id, name, amount, description, sort_order) VALUES
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Potassium Citrate', '550 mg', 'Maintains blood pressure, heart rhythm, and muscle performance.', 1),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Sodium Citrate/Chloride', '40 mg', 'Low sodium hydration without excess salt.', 2),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Magnesium', '21 mg', 'Reduces fatigue and muscle cramps.', 3),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Calcium', '16 mg', 'Strengthens bones and supports nerves.', 4),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Zinc', '5.2 mg', 'Boosts immunity and repair.', 5),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Vitamin C', '43 mg', 'Antioxidant & immunity boost.', 6),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Vitamin D', '2.3 mcg', 'Bone health & immunity.', 7),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Vitamin B1', '15 mg', 'Converts carbs into cellular energy.', 8),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Vitamin B3', '3.1 mg', 'Supports blood circulation and energy release.', 9),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Vitamin B5', '1.2 mg', 'Boosts metabolism and reduces fatigue.', 10),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Vitamin B6', '1.4 mg', 'Aids muscle recovery and protein utilization.', 11),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Chloride', 'Aids hydration', 'Helps maintain proper fluid balance.', 12)
ON CONFLICT DO NOTHING;

-- SEED BENEFITS
INSERT INTO public.benefits (product_id, title, description, icon, sort_order) VALUES
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Rapid Hydration', 'Isotonic concentration designed for immediate cellular absorption.', 'droplet', 1),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Muscle Function', 'High-dose potassium prevents cramping and optimizes contractions.', 'activity', 2),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Zero Crash', 'Zero sugar means no insulin spike, no afternoon slump.', 'zap', 3),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Neuro Boost', 'Methylated B-vitamins and Vitamin D for cognitive performance.', 'brain', 4),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Recovery Support', 'Antioxidant Vitamin C and minerals speed recovery.', 'shield', 5),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Daily Ready', 'Clean ingredients for daily use. Take pre/post workout.', 'sun', 6)
ON CONFLICT DO NOTHING;

-- SEED FAQS
INSERT INTO public.faqs (product_id, question, answer, category, sort_order) VALUES
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Why 550mg potassium per sachet?', 'Potassium is vital for blood pressure, steady heartbeat, and muscle performance. paired with low sodium (40mg), it aligns with a healthy sodium-to-potassium ratio.', 'Science', 1),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'How do I use it?', 'Tear open one sachet, pour into 250–500ml of cold water, stir, and drink. Perfect for workouts or daily hydration.', 'Usage', 2),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Is it really zero sugar?', 'Yes. We use natural lemon flavor and clean stevia. No sugar, no maltodextrin, no artificial fillers.', 'Nutrition', 3),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Is it keto-friendly?', 'Absolutely. Zero sugar, zero carbs, and mineral-rich — ideal for low-carb training protocols.', 'Nutrition', 4),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Can I take it daily?', 'Yes. The formula is designed for daily use by active individuals.', 'General', 5)
ON CONFLICT DO NOTHING;

-- SEED REVIEWS
INSERT INTO public.reviews (product_id, author_name, author_title, rating, title, body, verified, is_featured, sort_order) VALUES
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Aarav S.', 'Marathon Runner', 5, 'No more cramps', 'Switched to MyFitBoat for my long runs. No cramps and rapid recovery.', true, true, 1),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Pooja K.', 'Fitness Coach', 5, 'Cleanest hydration', 'Love that there is zero sugar and high potassium. It''s the clean formula we''ve been waiting for.', true, true, 2),
  ('3ff50b4a-2f7a-4146-b09b-cd5bb3e48284', 'Vikram R.', 'Triathlete', 5, 'Exceptional recovery', 'Flipped sodium-potassium balance is key. Hydration felt in minutes.', true, true, 3)
ON CONFLICT DO NOTHING;

-- 13. STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 14. RAZORPAY MIGRATION (FOR EXISTING TABLES)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT UNIQUE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;


