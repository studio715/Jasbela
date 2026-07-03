/* -----------------------------------------------------------------
   db.js — JASBELA static "database"
------------------------------------------------------------------ */
import cloth1 from "./Images/cloth1.jpeg";
import cloth2 from "./Images/cloth2.jpeg";
import cloth3 from "./Images/cloth3.jpeg";
import cloth4 from "./Images/cloth4.jpeg";
import cloth5 from "./Images/cloth5.jpeg";

import groom1 from "./Images/groom1.jpeg";
import groom2 from "./Images/groom2.jpeg";
import groom3 from "./Images/groom3.jpeg";
import groom4 from "./Images/groom4.jpeg";
import groom5 from "./Images/groom5.jpeg";

import jew1 from "./Images/jew1.jpeg";
import jew2 from "./Images/jew2.jpeg";
import jew3 from "./Images/jew3.jpeg";
import jew4 from "./Images/jew4.jpeg";
import jew5 from "./Images/jew5.jpeg";

import foot1 from "./Images/foot1.jpeg";
import foot2 from "./Images/foot2.jpeg";
import foot3 from "./Images/foot3.jpeg";
import foot4 from "./Images/foot4.jpeg";
import foot5 from "./Images/foot5.jpeg"; 

import bag1 from "./Images/bag1.jpeg";
import bag2 from "./Images/bag2.jpeg";
import bag3 from "./Images/bag3.jpeg";
import bag4 from "./Images/bag4.jpeg";
import bag5 from "./Images/bag5.jpeg";
/* ---------------- Theme ---------------- */
export const THEME = {
  bg: "#FBF9F3",
  surface: "#FFFFFF",
  surfaceAlt: "#F3EDDF",
  line: "#E4DCC7",
  gold: "#AD8A44",
  goldLight: "#C7A25E",
  goldDim: "#8C6B33",
  ivory: "#241F18", // primary text (dark ink)
  muted: "#867A66",
  rose: "#A85D50",  
};
/* ---------------- Hero background slideshow ---------------- */
export const HERO_IMAGES = [
  "/images/banner1.jpeg",
  "/images/banner2.jpeg",
  "/images/banner3.jpeg",
  "/images/banner4.jpeg",
  "/images/banner5.jpeg",
];
/* ---------------- Site-wide copy ---------------- */
export const SITE = {
  name: "JASBELA",
  announcement: "Complimentary shipping on orders over ₹4,999",
  freeShippingThreshold: 4999,
  shippingFee: 149,

  hero: {
    eyebrow: "Womenswear & Adornment",
    titleLine1: "Adorn every",
    titleLine2: "layer of you",
    subtitle:
      "From tailored silhouettes to fine jewelry and quiet luxury grooming — a wardrobe built around you, curated in one place.",
    primaryCta: "Shop new arrivals",
    secondaryCta: "Explore all",
  },

  promo: {
    heading:
      "Every piece chosen for the woman who layers meaning into what she wears",
    body:
      "Small-batch clothing, fine jewelry and considered grooming — sourced with the same care as the mark we sign it with.",
  },

  footer: {
    description: "Clothing, jewelry and grooming for every layer of her world.",
    shopLinks: ["Clothing", "Jewelry", "Grooming", "Bags", "Footwear"],
    helpLinks: ["Shipping", "Returns", "Size guide", "Contact us"],
    newsletterHeading: "Stay in touch",
    newsletterText: "New arrivals and quiet sales, sent occasionally.",
    newsletterPlaceholder: "Your email",
    tagline: "Crafted with care, worn with intent.",
  },

  social: ["instagram", "facebook", "twitter"],
};

/* ---------------- Nav / filter categories ----------------
   `icon` refers to a key in ICON_COMPONENTS (see JasbelaStore.jsx) */
export const CATEGORIES = [
  { id: "all", label: "All", icon: "sparkles" },
  { id: "clothing", label: "Clothing", icon: "shirt" },
  { id: "jewelry", label: "Jewelry", icon: "gem" },
  { id: "grooming", label: "Grooming", icon: "sparkles" },
  { id: "bags", label: "Bags", icon: "shopping-bag" },
  { id: "footwear", label: "Footwear", icon: "footprints" },
];

export const PRODUCTS = [
  { id: 1, name: "Silk Wrap Midi Dress", category: "clothing", price: 4999, oldPrice: null, rating: 4.7, tag: "new", images: [cloth1, cloth2, cloth3, cloth4, cloth5], description: "A fluid silk midi cut for effortless movement, finished with a self-tie wrap waist that flatters every silhouette." },
  { id: 2, name: "Embroidered Anarkali Gown", category: "clothing", price: 7499, oldPrice: 9999, rating: 4.8, tag: "sale", images: [cloth2, cloth3, cloth4, cloth5, cloth1], description: "Hand-embroidered florals cascade down a floor-length Anarkali silhouette — statement dressing for celebrations." },
  { id: 3, name: "Tailored Linen Blazer", category: "clothing", price: 5299, oldPrice: null, rating: 4.5, tag: null, images: [cloth3, cloth4, cloth5, cloth1, cloth2], description: "A structured linen blazer with a soft shoulder and clean lapel, built to layer over anything in your wardrobe." },
  { id: 4, name: "Chiffon Co-ord Set", category: "clothing", price: 3799, oldPrice: null, rating: 4.6, tag: "new", images: [cloth4, cloth5, cloth1, cloth2, cloth3], description: "A breezy chiffon two-piece with a relaxed top and matching flowy pants — easy to dress up or down." },
  
  { id: 5, name: "Kundan Necklace Set", category: "jewelry", price: 6999, oldPrice: 8999, rating: 4.9, tag: "sale", images: [jew1,jew2,jew3,jew4,jew5], description: "A traditional Kundan-inspired necklace and earring set, hand-set stones catching the light with every turn." },
  { id: 6, name: "Pearl Drop Earrings", category: "jewelry", price: 1899, oldPrice: null, rating: 4.6, tag: null, images: [jew2,jew3,jew4,jew5,jew1], description: "Freshwater pearl drops on a delicate gold-toned hook — a quiet everyday luxury." },
  { id: 7, name: "Layered Chain Bracelet", category: "jewelry", price: 2299, oldPrice: null, rating: 4.4, tag: "new", images: [jew3,jew4,jew5,jew1,jew2], description: "Three fine chains layered onto a single clasp, designed to stack beautifully with your other pieces." },
  { id: 8, name: "Diamond Cut Nose Pin", category: "jewelry", price: 1299, oldPrice: null, rating: 4.3, tag: null, images: [jew4,jew5,jew1,jew2,jew3], description: "A tiny diamond-cut stud that catches light from every angle — subtle sparkle for daily wear." },
  
  { id: 9, name: "Rose Gold Hair Serum", category: "grooming", price: 899, oldPrice: null, rating: 4.5, tag: null, images: [groom1,groom2,groom3,groom4,groom5], description: "A lightweight serum that smooths frizz and adds shine without weighing hair down." },
  { id: 10, name: "Vitamin C Radiance Cream", category: "grooming", price: 1199, oldPrice: null, rating: 4.7, tag: "new", images: [groom2,groom3,groom4,groom5,groom1], description: "A daily brightening cream formulated with stabilized Vitamin C to even tone and boost radiance." },
  { id: 11, name: "Silk Press Hair Straightener", category: "grooming", price: 3499, oldPrice: 4299, rating: 4.6, tag: "sale", images: [groom3,groom4,groom5,groom1,groom2], description: "Ceramic plates deliver a smooth, salon-finish press while protecting hair from heat damage." },
  { id: 12, name: "Luxury Perfume Oil Duo", category: "grooming", price: 2199, oldPrice: null, rating: 4.8, tag: null, images: [groom4,groom5,groom1,groom2,groom3], description: "Two long-lasting perfume oils, alcohol-free and gentle on skin, in a travel-friendly duo." },
  
  { id: 13, name: "Structured Handbag", category: "bags", price: 4499, oldPrice: null, rating: 4.5, tag: null, images: [bag1,bag2,bag3,bag4,bag5], description: "A structured silhouette with a top handle and detachable strap — takes you from desk to dinner." },
  { id: 14, name: "Embroidered Potli Clutch", category: "bags", price: 2799, oldPrice: null, rating: 4.4, tag: "new", images: [bag2,bag3,bag4,bag5,bag1], description: "A hand-embroidered potli clutch on a drawstring closure, sized for the essentials only." },
  { id: 15, name: "Leather Tote", category: "bags", price: 5999, oldPrice: 7499, rating: 4.7, tag: "sale", images: [bag3,bag4,bag5,bag1,bag2], description: "A roomy everyday tote in soft vegan leather with an interior pocket for the small things." },
  
  { id: 16, name: "Embellished Block Heels", category: "footwear", price: 3299, oldPrice: null, rating: 4.3, tag: null, images: [foot1, foot2, foot3, foot4, foot5], description: "A comfortable block heel dressed up with hand-placed embellishments across the strap." },
  {id: 17,name: "Pearl Strap Kitten Heels",category: "footwear",price: 2899,oldPrice: 3499,rating: 4.5,tag: "Sale",images: [foot2, foot3, foot4, foot5, foot1],description: "Elegant kitten heels featuring delicate pearl-embellished straps, designed for effortless comfort and festive occasions."},
  {id: 18,name: "Embroidered Festive Juttis",category: "footwear",price: 2199,oldPrice: 2799,rating: 4.6,tag: "New",images: [foot3, foot4, foot5, foot1, foot2],description: "Traditional handcrafted juttis adorned with intricate embroidery and subtle embellishments for a refined ethnic look."
},
];