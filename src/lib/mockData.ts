export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;       // in GYD
  stock: number;       // 0 = sold out
  image: string;
  category?: string;
}

/**
 * Mock product catalog — representative of Classy Missy Collection's
 * affordable-aspirational glam offering for the Georgetown, Guyana market.
 *
 * Replace with fetchLiveProducts() from wp-graphql.ts once WordPress is live.
 */
export const mockProducts: Product[] = [
  {
    id: "p_1",
    slug: "classic-leather-handbag",
    name: "Classic Leather Handbag",
    description: "Structured faux-leather handbag with gold-tone hardware. Goes from brunch to evening seamlessly.",
    price: 15000,
    stock: 5,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
    category: "Bags",
  },
  {
    id: "p_2",
    slug: "elegant-evening-dress",
    name: "Elegant Evening Dress",
    description: "Stunning floor-length dress with ruched bodice — perfect for galas, weddings, and nights out.",
    price: 25000,
    stock: 2,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80",
    category: "Dresses",
  },
  {
    id: "p_3",
    slug: "gold-plated-necklace",
    name: "Gold Plated Necklace",
    description: "Delicate layered chain necklace with 18k gold plating. Nickel-free and tarnish-resistant.",
    price: 8000,
    stock: 0,
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=600&q=80",
    category: "Jewellery",
  },
  {
    id: "p_4",
    slug: "summer-floral-blouse",
    name: "Summer Floral Blouse",
    description: "Light chiffon blouse with tropical floral print. Breathable and breezy for Guyanese heat.",
    price: 6500,
    stock: 12,
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=600&q=80",
    category: "Tops",
  },
  {
    id: "p_5",
    slug: "bodycon-sequin-dress",
    name: "Sequin Bodycon Dress",
    description: "Show-stopping silver sequin mini dress. Turn heads at every party — guaranteed.",
    price: 22000,
    stock: 3,
    image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=600&q=80",
    category: "Dresses",
  },
  {
    id: "p_6",
    slug: "pink-coord-set",
    name: "Pink Co-ord Set",
    description: "Matching crop top and wide-leg trouser set in blush pink. Mix, match, and slay.",
    price: 18000,
    stock: 7,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    category: "Sets",
  },
  {
    id: "p_7",
    slug: "strappy-heels-nude",
    name: "Strappy Nude Heels",
    description: "Barely-there 3-inch block heel in nude — the shoe that goes with everything in your closet.",
    price: 14000,
    stock: 4,
    image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=600&q=80",
    category: "Footwear",
  },
  {
    id: "p_8",
    slug: "satin-wrap-dress",
    name: "Satin Wrap Midi Dress",
    description: "Luxurious satin-finish wrap midi in deep burgundy. Flattering on every body type.",
    price: 19500,
    stock: 1,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
    category: "Dresses",
  },
];