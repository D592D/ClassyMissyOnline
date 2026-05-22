// Handles fetching live inventory from Headless WordPress via WPGraphQL.

import { Product } from './mockData';

const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'http://localhost:8080/graphql';

export async function fetchLiveProducts(): Promise<Product[]> {
  const query = `
    query GetProducts {
      products(first: 50) {
        nodes {
          id
          slug
          databaseId
          name
          description(format: RAW)
          image {
            sourceUrl(size: MEDIUM)
          }
          ... on SimpleProduct {
            price(format: RAW)
            stockQuantity
            stockStatus
          }
          ... on VariableProduct {
            price(format: RAW)
            stockQuantity
            stockStatus
            variations {
              nodes {
                id
                name
                price(format: RAW)
                stockQuantity
                attributes {
                  nodes { name value }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      // ISR: revalidate product data every 60 seconds at the edge
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`WPGraphQL responded ${res.status}`);

    const json = await res.json();
    const nodes = json.data?.products?.nodes ?? [];

    // Normalize WooCommerce response to the Product interface
    return nodes.map((node: any): Product => ({
      id: String(node.databaseId || node.id),
      slug: node.slug,
      name: node.name,
      description: node.description?.replace(/<[^>]+>/g, '') || '',
      // WooCommerce returns price as "$15,000.00" — strip to number
      price: parseFloat((node.price || '0').replace(/[^0-9.]/g, '')),
      stock: node.stockQuantity ?? (node.stockStatus === 'IN_STOCK' ? 1 : 0),
      image: node.image?.sourceUrl || '',
    }));
  } catch (error) {
    console.error('Failed to fetch products from WordPress:', error);
    return [];
  }
}

