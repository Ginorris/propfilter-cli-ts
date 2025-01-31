export type Property = {
  squareFootage: number;
  lighting: "low" | "medium" | "high";
  price: number;
  rooms: number;
  bathrooms: number;
  location: [number, number];
  description: string;
  ammenities: Record<string, boolean>;
};

export const NUMERIC_FIELDS: (keyof Property)[] = [
  "squareFootage",
  "price",
  "rooms",
  "bathrooms",
];
