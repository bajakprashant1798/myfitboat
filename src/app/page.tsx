import { getFeaturedProduct } from "@/lib/products.functions";
import { HomeClient } from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const product = await getFeaturedProduct();

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        No product configured.
      </div>
    );
  }

  return <HomeClient product={product} />;
}
