export const COFFEE_ROASTERS = [
  "Their Own Beans",
  "Dukes",
  "Seven Seeds",
  "ONA",
  "Coffee Supreme",
  "Axil",
  "Vacation",
  "Inglewood",
  "Veneziano",
  "Fieldwork",
  "Rumble",
  "Allpress",
  "Proud Mary",
  "Small Batch",
  "Klim Coffee",
  "Market Lane",
  "Toby's Estate",
  "Industry Beans",
  "St Ali",
  "Five Senses",
  "Maker",
  "Code Black",
];

export const SUGGESTED_TAGS = [
  "Pastries",
  "Tarts",
  "Cakes",
  "Good Coffee",
  "Pour Over",
  "Good Brunch",
  "Group Seatings",
  "Open until Late",
  "Photo Worthy",
  "Sandwich/Burger",
  "Special Drinks",
];

export const CATEGORIES = ["cafe", "restaurant"] as const;
export type Category = (typeof CATEGORIES)[number];
