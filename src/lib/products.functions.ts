import { supabase } from "@/integrations/supabase/client";

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_inr: number;
  compare_at_price_inr: number | null;
  image_url: string | null;
  badges: string[];
}

export interface ProductDetail extends ProductSummary {
  long_description: string | null;
  serving_size: string | null;
  servings_per_pack: number | null;
  gallery?: unknown;
  variants: Array<{
    id: string;
    name: string;
    price_inr: number;
    compare_at_price_inr: number | null;
    servings: number;
    badge: string | null;
    is_default: boolean;
  }>;
  ingredients: Array<{
    id: string;
    name: string;
    amount: string | null;
    description: string | null;
  }>;
  benefits: Array<{ id: string; title: string; description: string; icon: string | null }>;
  faqs: Array<{ id: string; question: string; answer: string }>;
  reviews: Array<{
    id: string;
    author_name: string;
    author_title: string | null;
    rating: number;
    title: string | null;
    body: string;
    verified: boolean;
    is_featured: boolean;
  }>;
}

// Exact content and assets from myfitboat.com
export const MOCK_PRODUCT: ProductDetail = {
  id: "3ff50b4a-2f7a-4146-b09b-cd5bb3e48284",
  slug: "zero-sugar-lemonade",
  name: "Zero Sugar Lemonade - Potassium Rich Electrolyte",
  tagline: "India's First Potassium-Rich Electrolyte Drink Mix",
  description:
    "Stay hydrated and energized with MyFitBoat. Fast-absorbing, potassium-rich hydration formula for sports, workouts, and daily performance.",
  long_description:
    "Most sports drinks are loaded with sodium and sugar, ignoring the key mineral needed for heart health and muscle contraction: potassium. MyFitBoat delivers a potassium-rich, low-sodium formula that supports blood pressure, heart rhythm, stamina, and recovery. Perfect for athletes, active lifestyles, keto, and daily hydration.",
  price_inr: 240,
  compare_at_price_inr: 300,
  image_url: "/product/Box_Sachet_Front-image-1.jpg",
  gallery: [
    "/product/Box_Sachet_Front-image-1.jpg",
    "/product/WhatsApp-Image-2025-09-08-at-15.24.57.png",
    "/product/Cardio-explainig-image.jpg",
    "/product/How-to-use-image.png",
    "/product/Label.jpg",
    "/product/5.jpg",
  ],
  badges: ["Zero Sugar", "Vegan", "Gluten Free", "Lab Tested", "Clean Label"],
  serving_size: "5g sachet",
  servings_per_pack: 10,
  variants: [
    {
      id: "var-10-sachets",
      name: "10 Sachets Pack",
      price_inr: 240,
      compare_at_price_inr: 300,
      servings: 10,
      badge: "Intro Pack",
      is_default: true,
    },
    {
      id: "var-20-sachets",
      name: "20 Sachets Pack",
      price_inr: 450,
      compare_at_price_inr: 600,
      servings: 20,
      badge: "Value Pack",
      is_default: false,
    },
    {
      id: "var-30-sachets",
      name: "30 Sachets Pack",
      price_inr: 680,
      compare_at_price_inr: 900,
      servings: 30,
      badge: "Performance Pack",
      is_default: false,
    },
  ],
  ingredients: [
    {
      id: "ing-1",
      name: "Potassium Citrate",
      amount: "550 mg",
      description: "Maintains blood pressure, heart rhythm, and muscle performance.",
    },
    {
      id: "ing-2",
      name: "Sodium Citrate/Chloride",
      amount: "40 mg",
      description: "Low sodium hydration without excess salt.",
    },
    {
      id: "ing-3",
      name: "Magnesium",
      amount: "21 mg",
      description: "Reduces fatigue and muscle cramps.",
    },
    {
      id: "ing-4",
      name: "Calcium",
      amount: "16 mg",
      description: "Strengthens bones and supports nerves.",
    },
    { id: "ing-5", name: "Zinc", amount: "5.2 mg", description: "Boosts immunity and repair." },
    {
      id: "ing-6",
      name: "Vitamin C",
      amount: "43 mg",
      description: "Antioxidant & immunity boost.",
    },
    { id: "ing-7", name: "Vitamin D", amount: "2.3 mcg", description: "Bone health & immunity." },
    {
      id: "ing-8",
      name: "Vitamin B1",
      amount: "15 mg",
      description: "Converts carbs into cellular energy.",
    },
    {
      id: "ing-9",
      name: "Vitamin B3",
      amount: "3.1 mg",
      description: "Supports blood circulation and energy release.",
    },
    {
      id: "ing-10",
      name: "Vitamin B5",
      amount: "1.2 mg",
      description: "Boosts metabolism and reduces fatigue.",
    },
    {
      id: "ing-11",
      name: "Vitamin B6",
      amount: "1.4 mg",
      description: "Aids muscle recovery and protein utilization.",
    },
    {
      id: "ing-12",
      name: "Chloride",
      amount: "Aids hydration",
      description: "Helps maintain proper fluid balance.",
    },
  ],
  benefits: [
    {
      id: "ben-1",
      title: "Rapid Hydration",
      description: "Isotonic concentration designed for immediate cellular absorption.",
      icon: "droplet",
    },
    {
      id: "ben-2",
      title: "Muscle Function",
      description: "High-dose potassium prevents cramping and optimizes contractions.",
      icon: "activity",
    },
    {
      id: "ben-3",
      title: "Zero Crash",
      description: "Zero sugar means no insulin spike, no afternoon slump.",
      icon: "zap",
    },
    {
      id: "ben-4",
      title: "Neuro Boost",
      description: "Methylated B-vitamins and Vitamin D for cognitive performance.",
      icon: "brain",
    },
    {
      id: "ben-5",
      title: "Recovery Support",
      description: "Antioxidant Vitamin C and minerals speed recovery.",
      icon: "shield",
    },
    {
      id: "ben-6",
      title: "Daily Ready",
      description: "Clean ingredients for daily use. Take pre/post workout.",
      icon: "sun",
    },
  ],
  faqs: [
    {
      id: "faq-1",
      question: "Why 550mg potassium per sachet?",
      answer:
        "Potassium is vital for blood pressure, steady heartbeat, and muscle performance. paired with low sodium (40mg), it aligns with a healthy sodium-to-potassium ratio.",
    },
    {
      id: "faq-2",
      question: "How do I use it?",
      answer:
        "Tear open one sachet, pour into 250–500ml of cold water, stir, and drink. Perfect for workouts or daily hydration.",
    },
    {
      id: "faq-3",
      question: "Is it really zero sugar?",
      answer:
        "Yes. We use natural lemon flavor and clean stevia. No sugar, no maltodextrin, no artificial fillers.",
    },
    {
      id: "faq-4",
      question: "Is it keto-friendly?",
      answer:
        "Absolutely. Zero sugar, zero carbs, and mineral-rich — ideal for low-carb training protocols.",
    },
    {
      id: "faq-5",
      question: "Can I take it daily?",
      answer: "Yes. The formula is designed for daily use by active individuals.",
    },
  ],
  reviews: [
    {
      id: "rev-1",
      author_name: "Aarav S.",
      author_title: "Marathon Runner",
      rating: 5,
      title: "No more cramps",
      body: "Switched to MyFitBoat for my long runs. No cramps and rapid recovery.",
      verified: true,
      is_featured: true,
    },
    {
      id: "rev-2",
      author_name: "Pooja K.",
      author_title: "Fitness Coach",
      rating: 5,
      title: "Cleanest hydration",
      body: "Love that there is zero sugar and high potassium. It's the clean formula we've been waiting for.",
      verified: true,
      is_featured: true,
    },
    {
      id: "rev-3",
      author_name: "Vikram R.",
      author_title: "Triathlete",
      rating: 5,
      title: "Exceptional recovery",
      body: "Flipped sodium-potassium balance is key. Hydration felt in minutes.",
      verified: true,
      is_featured: true,
    },
  ],
};

function hasSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  return !!(url && key);
}

export async function listProducts(): Promise<ProductSummary[]> {
  if (!hasSupabaseConfig()) {
    return [MOCK_PRODUCT];
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, slug, name, tagline, description, price_inr, compare_at_price_inr, image_url, badges",
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return [MOCK_PRODUCT];

    return data.map((p) => ({
      ...p,
      badges: (p.badges as string[]) ?? [],
    }));
  } catch (err) {
    console.warn("[Supabase Fallback] Error listing products, using mock:", err);
    return [MOCK_PRODUCT];
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  if (slug !== "zero-sugar-lemonade") {
    // If they ask for the featured slug, return our mock product, otherwise check DB
    if (!hasSupabaseConfig()) return null;
  }

  if (!hasSupabaseConfig()) {
    return MOCK_PRODUCT;
  }

  try {
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!product) return slug === "zero-sugar-lemonade" ? MOCK_PRODUCT : null;

    const [variants, ingredients, benefits, faqs, reviews] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", product.id)
        .order("sort_order"),
      supabase.from("ingredients").select("*").eq("product_id", product.id).order("sort_order"),
      supabase.from("benefits").select("*").eq("product_id", product.id).order("sort_order"),
      supabase.from("faqs").select("*").eq("product_id", product.id).order("sort_order"),
      supabase.from("reviews").select("*").eq("product_id", product.id).order("sort_order"),
    ]);

    const isLemonade = slug === "zero-sugar-lemonade";

    return {
      ...product,
      badges: (product.badges as string[]) ?? [],
      variants:
        variants.data && variants.data.length > 0
          ? variants.data
          : isLemonade
            ? MOCK_PRODUCT.variants
            : [],
      ingredients:
        ingredients.data && ingredients.data.length > 0
          ? ingredients.data
          : isLemonade
            ? MOCK_PRODUCT.ingredients
            : [],
      benefits:
        benefits.data && benefits.data.length > 0
          ? benefits.data
          : isLemonade
            ? MOCK_PRODUCT.benefits
            : [],
      faqs: faqs.data && faqs.data.length > 0 ? faqs.data : isLemonade ? MOCK_PRODUCT.faqs : [],
      reviews:
        reviews.data && reviews.data.length > 0
          ? reviews.data
          : isLemonade
            ? MOCK_PRODUCT.reviews
            : [],
    } as ProductDetail;
  } catch (err) {
    console.warn(`[Supabase Fallback] Error fetching product ${slug}, using mock:`, err);
    return slug === "zero-sugar-lemonade" ? MOCK_PRODUCT : null;
  }
}

export async function getFeaturedProduct(): Promise<ProductDetail | null> {
  if (!hasSupabaseConfig()) {
    return MOCK_PRODUCT;
  }

  try {
    const { data: product } = await supabase
      .from("products")
      .select("slug")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("sort_order")
      .limit(1)
      .maybeSingle();

    if (!product) return MOCK_PRODUCT;
    return getProductBySlug(product.slug);
  } catch (err) {
    console.warn("[Supabase Fallback] Error fetching featured product, using mock:", err);
    return MOCK_PRODUCT;
  }
}
