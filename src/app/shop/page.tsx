import { listProducts } from "@/lib/products.functions";
import { ShopClient } from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await listProducts();

  if (!products || products.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        No products available.
      </div>
    );
  }

  return <ShopClient products={products} />;
}
