import { Property, NUMERIC_FIELDS, FilterCondition, FILTER_REGEX } from "../types/Property";
import { validateCondition } from "./validation";

/**
 * Takes an array of filter strings ("price > 1" "lighting == low")
 * and parses them into FilterCondition objects with validation.
 */
export function parseFilters(conditionStrings: string[]): FilterCondition[] {
  return conditionStrings.map(parseSingleCondition);
}

/**
 * Parse a single condition string ("price > 1") into { key, operator, value },
 * with validation for field/operator/numeric fields.
 */
export function parseSingleCondition(filterStr: string): FilterCondition {
  const match = filterStr.match(FILTER_REGEX);
  if (!match) {
    throw new Error(
      `Invalid filter syntax: "${filterStr}". Expected "field operator value", e.g. "price > 1".`,
    );
  }

  const [, rawKey, operator, rawValue] = match;
  const key = rawKey as keyof Property;

  const value = parseFilterValue(key, rawValue);
  const condition: FilterCondition = { key, operator, value };

  validateCondition(condition);

  return condition;
}

/**
 * Converts the raw string (third part of "field operator value")
 * to a number (if numeric), array of strings (if amenities), or leave as string.
 */
function parseFilterValue(key: keyof Property, rawValue: string): any {
  if (NUMERIC_FIELDS.includes(key)) {
    return Number(rawValue);
  }
  if (key === ("amenities" as keyof Property)) {
    return rawValue.split(",").map((v) => v.trim());
  }
  return rawValue;
}

/**
 * Applies multiple filters (AND logic) to a list of properties.
 */
export function applyFilters(properties: Property[], filters: FilterCondition[]): Property[] {
  return properties.filter((property) =>
    filters.every(({ key, operator, value }) =>
      checkCondition(property, key as keyof Property, operator, value),
    ),
  );
}

/**
 * Check a single condition on a single property object.
 */
function checkCondition(
  property: Property,
  key: keyof Property,
  operator: string,
  value: any,
): boolean {
  const propVal = property[key];

  if (key === ("amenities" as keyof Property) && isAmenitiesObject(propVal)) {
    const required = Array.isArray(value) ? value : [value];
    if (operator === "==") {
      return required.every((amenity) => propVal[amenity] === true);
    } else if (operator === "!=") {
      return required.every((amenity) => propVal[amenity] !== true);
    }
  }

  const operators: Record<string, (a: any, b: any) => boolean> = {
    "==": (a, b) => a === b,
    "!=": (a, b) => a !== b,
    ">": (a, b) => typeof a === "number" && a > b,
    "<": (a, b) => typeof a === "number" && a < b,
    ">=": (a, b) => typeof a === "number" && a >= b,
    "<=": (a, b) => typeof a === "number" && a <= b,
    "~=": (a, b) =>
      typeof a === "string" && typeof b === "string" && a.toLowerCase().includes(b.toLowerCase()),
  };

  return operators[operator]?.(propVal, value) ?? false;
}

/**
 * Helper to confirm 'amenities' is an object {garage:true} rather than an array or null.
 */
function isAmenitiesObject(val: any): val is Record<string, boolean> {
  return val && typeof val === "object" && !Array.isArray(val);
}
