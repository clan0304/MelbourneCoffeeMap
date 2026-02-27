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
  "Bench Coffee",
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
  "Multiple Locations",
];

export const CATEGORIES = ["cafe", "restaurant"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CITIES = ["melbourne", "sydney", "brisbane"] as const;
export type City = (typeof CITIES)[number];

export const CITY_CENTERS: Record<City, { lat: number; lng: number }> = {
  melbourne: { lat: -37.8136, lng: 144.9631 },
  sydney: { lat: -33.8688, lng: 151.2093 },
  brisbane: { lat: -27.4698, lng: 153.0251 },
};

export const CITY_LABELS: Record<City, string> = {
  melbourne: "Melbourne",
  sydney: "Sydney",
  brisbane: "Brisbane",
};
