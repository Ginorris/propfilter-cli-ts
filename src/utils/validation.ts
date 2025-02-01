import {
  FilterCondition,
  Property,
  PROPERTY_FIELDS,
  VALID_LIGHTING_VALUES,
  VALID_OPERATORS,
  NUMERIC_FIELDS,
} from "../types/Property";

function validateFieldExists(key: string): void {
  if (!PROPERTY_FIELDS.includes(key as keyof Property)) {
    throw new Error(`Invalid filter field: "${key}". Allowed: ${PROPERTY_FIELDS.join(", ")}`);
  }
}

function validateOperator(operator: string): void {
  if (!VALID_OPERATORS.includes(operator as any)) {
    throw new Error(`Invalid operator: "${operator}". Allowed: ${VALID_OPERATORS.join(" ")}`);
  }
}

function validateNumericField(key: string, value: any): void {
  if (NUMERIC_FIELDS.includes(key as any)) {
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error(`Field "${key}" expects a numeric value, but got "${value}"`);
    }
  }
}

function validateAmenities(key: string, value: any): void {
  if (key === "amenities") {
    if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) {
      throw new Error(
        `Field "amenities" must be comma-separated strings, e.g. "amenities == garage,pool".`,
      );
    }
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
  validateOperator(operator);
  validateNumericField(key, value);
  validateAmenities(key, value);
  validateSubstring(operator, value);
  validateLighting(key, value);
}
