import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { Property } from "../types/Property";
import { NUMERIC_FIELDS } from "../constants/filtersConfig";

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
 * Loads properties from a JSON or CSV file, or from raw input (stdin).
 */
export function loadProperties(input?: string, filePath?: string): Property[] {
  if (!input && !filePath) {
    throw new Error("No input provided. Specify a file or use STDIN.");
  }

  if (input) {
    return JSON.parse(input);
  }

  if (filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const fileExt = path.extname(filePath).toLowerCase();
    const rawData = fs.readFileSync(filePath, "utf-8");

    if (fileExt === ".json") return JSON.parse(rawData);
    if (fileExt === ".csv") {
      return parse(rawData, {
        columns: true,
        skip_empty_lines: true,
        cast: (value, context) => {
          if (context.column === ("amenities" as keyof Property)) {
            return JSON.parse(value.replace(/'/g, '"'));
          }
          if (context.column === ("location" as keyof Property)) {
            return value.replace(/[()]/g, "").split(",").map(Number);
          }
          return NUMERIC_FIELDS.includes(context.column as keyof Property) ? Number(value) : value;
        },
      }) as Property[];
    }

    throw new Error("Unsupported file format. Use .json or .csv.");
  }

  throw new Error("Unexpected error: No valid input method detected.");
}
