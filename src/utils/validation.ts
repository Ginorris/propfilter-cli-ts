import { FilterCondition, Property } from "../types/Property";
import { VALID_LIGHTING_VALUES, NUMERIC_FIELDS, PROPERTY_FIELDS } from "../constants/filtersConfig";

function validateFieldExists(key: string): void {
  if (!PROPERTY_FIELDS.includes(key as keyof Property)) {
    throw new Error(`Invalid filter field: "${key}". Allowed: ${PROPERTY_FIELDS.join(", ")}`);
  }
}

function validateNumericField(key: string, value: any): void {
  if (NUMERIC_FIELDS.includes(key as any)) {
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error(`Field "${key}" expects a numeric value, but got "${value}"`);
    }
  }
}

function validateLocation(value: any): void {
  if (!Array.isArray(value) || value.length !== 3 || value.some(isNaN)) {
    throw new Error(
      `Invalid location format. Expected "location <= lat,lng,radius", e.g. "location <= 10,45,5".`,
    );
  }
}

function validateSubstring(operator: string, value: any): void {
  if (operator === "~=" && typeof value !== "string") {
    throw new Error(
      `Operator "~=" requires a string value (e.g. "description ~= house"). Got "${value}"`,
    );
  }
}

function validateLighting(key: string, value: any): void {
  if (key === "lighting" && typeof value === "string") {
    if (!VALID_LIGHTING_VALUES.includes(value as any)) {
      throw new Error(
        `Field "lighting" must be one of: ${VALID_LIGHTING_VALUES.join(", ")}. Received: "${value}"`,
      );
    }
  }
}

export function validateCondition({ key, operator, value }: FilterCondition): void {
  validateFieldExists(key);
  validateNumericField(key, value);
  validateSubstring(operator, value);
  validateLighting(key, value);

  if (key === ("location" as keyof Property)) {
    validateLocation(value);
  }
}
