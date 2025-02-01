import { Property } from "../types/Property";

export const PROPERTY_FIELDS: (keyof Property)[] = [
  "squareFootage",
  "lighting",
  "price",
  "rooms",
  "bathrooms",
  "location",
  "description",
  "amenities",
];

export const LIST_FIELDS: (keyof Property)[] = ["amenities", "lighting"];

export const VALID_LIGHTING_VALUES = ["low", "medium", "high"];

export const NUMERIC_FIELDS: (keyof Property)[] = ["squareFootage", "price", "rooms", "bathrooms"];

export const VALID_OPERATORS = ["==", "!=", "<=", ">=", "<", ">", "~="];

// Regex capturing: (key)(operator)(value), allowing spaces around the operator
// e.g. "price > 1", "description~=renovated", "amenities == pool,garage"
export const FILTER_REGEX = new RegExp(`^(\\w+)\\s*(${VALID_OPERATORS.join("|")})\\s*(.+)$`);

export const EARTH_RADIUS_KM = 6371;

export const OPERATORS: Record<string, (a: any, b: any) => boolean> = {
  "==": (a, b) => a === b,
  "!=": (a, b) => a !== b,
  ">": (a, b) => typeof a === "number" && a > b,
  "<": (a, b) => typeof a === "number" && a < b,
  ">=": (a, b) => typeof a === "number" && a >= b,
  "<=": (a, b) => typeof a === "number" && a <= b,
  "~=": (a, b) =>
    typeof a === "string" && typeof b === "string" && a.toLowerCase().includes(b.toLowerCase()),
};
