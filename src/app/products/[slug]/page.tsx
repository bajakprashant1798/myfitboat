import { getProductBySlug } from "@/lib/products.functions";
import { ProductDetailClient } from "./ProductDetailClient";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Product not found.
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
