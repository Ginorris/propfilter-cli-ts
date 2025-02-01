import fs from "fs";
import path from "path";
import { parse, CastingContext } from "csv-parse/sync";
import { Property } from "../types/Property";
import { NUMERIC_FIELDS } from "../constants/filtersConfig";
import { csvErrorMessage, jsonErrorMessage } from "../constants/errorMessages";

/**
 * Reads data from stdin (if available).
 */
export async function readStdin(): Promise<string | null> {
  if (!process.stdin.isTTY) {
    return new Promise((resolve, reject) => {
      let data = "";
      process.stdin.on("data", (chunk) => (data += chunk));
      process.stdin.on("end", () => resolve(data));
      process.stdin.on("error", (err) => reject(err));
    });
  }
  return null;
}

/**
 * Function to cast CSV values into the correct types (amenities, location, numbers, etc.).
 */
function csvCast(value: string, context: CastingContext): any {
  const colName = String(context.column);
  if (colName === "amenities") {
    return JSON.parse(
      value.replace(/'/g, '"').replace(/\b(true|false)\b/gi, (match) => match.toLowerCase()),
    );
  }

  if (colName === "location") {
    return value.replace(/[()]/g, "").split(",").map(Number);
  }

  if (NUMERIC_FIELDS.includes(colName as keyof Property)) {
    return Number(value);
  }

  return value;
}

/**
 * Loads properties from a JSON or CSV file, or from raw input (stdin).
 */
export function loadProperties(input?: string, filePath?: string): Property[] {
  if (!input && !filePath) {
    throw new Error("No input provided. Specify a file or use STDIN.");
  }

  if (input) {
    return JSON.parse(input);
  }

  if (!filePath) {
    /* istanbul ignore next */
    throw new Error("File path is undefined. Please provide a file path."); // Required by ts
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileExt = path.extname(filePath).toLowerCase();
  const rawData = fs.readFileSync(filePath, "utf-8");

  if (fileExt === ".json") {
    try {
      return JSON.parse(rawData);
    } catch (err) {
      throw new Error(jsonErrorMessage((err as Error).message));
    }
  }

  if (fileExt === ".csv") {
    try {
      return parse(rawData, {
        columns: true,
        skip_empty_lines: true,
        cast: csvCast,
      }) as Property[];
    } catch (err) {
      throw new Error(csvErrorMessage((err as Error).message));
    }
  }
  throw new Error("Unsupported file format. Use .json or .csv.");
}
