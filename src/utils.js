/* Small shared helpers used by both JasbelaStore.jsx and ProductDetails.jsx */

export const currency = (n) => "\u20B9" + n.toLocaleString("en-IN");

/* Generic category-level info shown on the product details page.
   Keyed by CATEGORIES id from db.js. */
export const CATEGORY_DETAILS = {
  clothing: ["Fabric: Premium blended weave", "Care: Dry clean recommended", "Fit: True to size"],
  jewelry: ["Material: Plated finish over brass base", "Care: Keep away from water & perfume", "Comes in a JASBELA gift pouch"],
  grooming: ["Cruelty-free, dermatologically tested", "Suitable for all skin & hair types", "Store in a cool, dry place"],
  bags: ["Material: Vegan leather / textile blend", "Care: Wipe clean with a dry cloth", "Includes dust bag"],
  footwear: ["True to size — order your regular fit", "Cushioned insole for all-day wear", "Non-slip sole"],
};

export const DELIVERY_NOTE = "Delivered in 4–7 business days. Free returns within 14 days.";