import { notFound } from "next/navigation";
import { mockProducts } from "@/lib/mockData";
import { fetchLiveProducts } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all known products (works with both mock + WP)
export async function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return { title: "Product Not Found — Classy Missy Collection" };
  }

  return {
    title: `${product.name} — Classy Missy Collection`,
    description: `${product.description} Shop now with MMG payment. GYD ${product.price.toLocaleString()}`,
    openGraph: {
      title: `${product.name} | Classy Missy Collection`,
      description: `GYD ${product.price.toLocaleString()} — ${product.description}`,
      images: product.image ? [{ url: product.image, width: 800, height: 800, alt: product.name }] : [],
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://classymissy.gy"}/shop/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: `GYD ${product.price.toLocaleString()} — Shop now at Classy Missy Collection`,
      images: product.image ? [product.image] : [],
    },
  };
}

async function getProducts() {
  // In production, fetch from WordPress; fall back to mock data during dev
  try {
    const liveProducts = await fetchLiveProducts();
    return liveProducts.length > 0 ? liveProducts : mockProducts;
  } catch {
    return mockProducts;
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  // Related products: same price tier ± 30%, exclude self
  const related = products
    .filter((p) => p.id !== product.id && Math.abs(p.price - product.price) / product.price < 0.3)
    .slice(0, 3);

  return <ProductDetailClient product={product} related={related} />;
}
