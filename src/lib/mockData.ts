export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export const mockProducts: Product[] = [
  {
    id: "p_1",
    slug: "classic-leather-handbag",
    name: "Classic Leather Handbag",
    description: "A timeless leather handbag perfect for any occasion.",
    price: 15000,
    stock: 5,
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "p_2",
    slug: "elegant-evening-dress",
    name: "Elegant Evening Dress",
    description: "Stunning evening wear for those special nights out.",
    price: 25000,
    stock: 2,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "p_3",
    slug: "gold-plated-necklace",
    name: "Gold Plated Necklace",
    description: "Simple yet elegant gold-plated necklace.",
    price: 8000,
    stock: 0, // out of stock to test features
    image: "https://images.unsplash.com/photo-1599643478514-4a820c56a820?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "p_4",
    slug: "summer-floral-blouse",
    name: "Summer Floral Blouse",
    description: "Light and breezy blouse for the tropical heat.",
    price: 6500,
    stock: 12,
    image: "https://images.unsplash.com/photo-1572804013309-8c98e2501a35?auto=format&fit=crop&w=400&q=80",
  },
];