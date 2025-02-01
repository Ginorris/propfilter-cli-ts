export type Property = {
  squareFootage: number;
  lighting: "low" | "medium" | "high";
  price: number;
  rooms: number;
  bathrooms: number;
  location: [number, number];
  description: string;
  amenities: Record<string, boolean>;
};

export type FilterCondition = { key: string; operator: string; value: any };
