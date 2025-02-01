import { parseFilters, applyFilters } from "../src/utils/filter";
import { Property } from "../src/types/Property";

describe("Filtering Logic", () => {
  const sampleProperties: Property[] = [
    {
      squareFootage: 2000,
      lighting: "medium",
      price: 500000,
      rooms: 3,
      bathrooms: 2,
      location: [37.7749, -122.4194],
      description: "Spacious house with a pool",
      amenities: { pool: true, garage: false },
    },
    {
      squareFootage: 1500,
      lighting: "low",
      price: 300000,
      rooms: 2,
      bathrooms: 1,
      location: [40.7128, -74.006],
      description: "Cozy apartment",
      amenities: { pool: false, garage: true },
    },
    {
      squareFootage: 1500,
      lighting: "medium",
      price: 300000,
      rooms: 2,
      bathrooms: 1,
      location: [40.7128, -74.006],
      description: "Cozy apartment",
      amenities: {},
    },
  ];

  //
  // 1) Validation / Error Cases
  //
  describe("Validation & Error Handling", () => {
    it("throws error for invalid field name", () => {
      expect(() => parseFilters(["color == red"])).toThrow(/Invalid filter field: "color"/);
    });

    it("throws error for invalid operator", () => {
      expect(() => parseFilters(["lighting @ medium"])).toThrow(/Invalid filter syntax/);
    });

    it("throws error for invalid numeric value", () => {
      expect(() => parseFilters(["price == not-a-number"])).toThrow(
        /Field "price" expects a numeric value/,
      );
    });

    it("throws error for invalid lighting value", () => {
      expect(() => parseFilters(["lighting == extra-bright"])).toThrow(
        `Field "lighting" must be one of: low, medium, high. Received: "extra-bright"`,
      );
    });

    it("throws error if empty filter input is provided", () => {
      expect(() => parseFilters([""])).toThrow("Invalid filter syntax");
    });

    it("throws error if '~=' operator is used with non-string value", () => {
      expect(() => parseFilters(["rooms ~= 2"])).toThrow(/Operator "~=" requires a string value/);
    });
  });

  //
  // 2) Basic Parsing Tests
  //
  describe("Parsing Single Condition", () => {
    it("parses a single filter condition correctly", () => {
      expect(parseFilters(["price > 400000"])).toEqual([
        { key: "price", operator: ">", value: 400000 },
      ]);
    });

    it("ignores multiple conditions in an array, parsing them individually", () => {
      const filters = parseFilters(["price < 500000", "lighting == medium"]);
      expect(filters).toHaveLength(2);
      expect(filters[0]).toMatchObject({ key: "price", operator: "<", value: 500000 });
      expect(filters[1]).toMatchObject({ key: "lighting", operator: "==", value: "medium" });
    });
  });

  //
  // 3) Price Filtering (Simplified Individual Tests)
  //
  describe("Price Filtering", () => {
    it("returns empty result if no property matches (price > 1000000)", () => {
      const filters = parseFilters(["price > 1000000"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result).toEqual([]);
    });

    it("returns only the 500k property if price > 400000", () => {
      const filters = parseFilters(["price > 400000"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.map((p) => sampleProperties.indexOf(p))).toEqual([0]);
    });

    it("returns only the 500k property if price >= 500000", () => {
      const filters = parseFilters(["price >= 500000"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.map((p) => sampleProperties.indexOf(p))).toEqual([0]);
    });

    it("returns two properties if price <= 300000", () => {
      const filters = parseFilters(["price <= 300000"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.map((p) => sampleProperties.indexOf(p))).toEqual([1, 2]);
    });

    it("returns two properties if price < 400000", () => {
      const filters = parseFilters(["price < 400000"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.map((p) => sampleProperties.indexOf(p))).toEqual([1, 2]);
    });
  });

  //
  // 4) Lighting Filtering
  //
  describe("Lighting Filtering", () => {
    it("filters by exact lighting match with '=='", () => {
      const filters = parseFilters(["lighting == medium"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.map((p) => sampleProperties.indexOf(p))).toEqual([0, 2]);
    });

    it("filters out properties by lighting with '!='", () => {
      const filters = parseFilters(["lighting != medium"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.map((p) => sampleProperties.indexOf(p))).toEqual([1]);
    });
  });

  //
  // 5) Description (Substring) Filtering
  //
  describe("Description Substring Filtering", () => {
    it("filters properties where description contains a keyword (~=)", () => {
      const filters = parseFilters(["description ~= pool"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((p) => p.description.toLowerCase().includes("pool"))).toBe(true);
    });

    it("returns empty when no description matches keyword", () => {
      const filters = parseFilters(["description ~= spaceship"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result).toEqual([]);
    });

    it("performs case-insensitive matching for ~= operator", () => {
      const filters = parseFilters(["description ~= Spacious"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((p) => p.description.toLowerCase().includes("spacious"))).toBe(true);
    });
  });

  //
  // 6) Amenities Filtering
  //
  describe("Amenities Filtering", () => {
    it("filters by included amenities (== pool)", () => {
      const filters = parseFilters(["amenities == pool"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.map((p) => sampleProperties.indexOf(p))).toEqual([0]);
    });

    it("filters by multiple included amenities (== pool,garage)", () => {
      const filters = parseFilters(["amenities == pool,garage"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result).toEqual([]);
    });

    it("filters by excluded amenities (!= pool)", () => {
      const filters = parseFilters(["amenities != pool"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.map((p) => sampleProperties.indexOf(p))).toEqual([1, 2]);
    });

    it("includes property that has an empty amenities object for '!= pool'", () => {
      const filters = parseFilters(["amenities != pool"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.some((p) => p === sampleProperties[2])).toBe(true);
    });
  });

  //
  // 7) Location Filtering
  //
  describe("Location Filtering", () => {
    it("filters properties within a given radius", () => {
      const filters = parseFilters(["location <= 37.7749,-122.4194,100"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.length).toBeGreaterThan(0);
    });

    it("excludes properties outside the given radius", () => {
      const filters = parseFilters(["location >= 37.7749,-122.4194,5"]);
      const result = applyFilters(sampleProperties, filters);
      expect(result.length).toBe(1);
    });

    it("throws an error for invalid location format", () => {
      expect(() => parseFilters(["location <= 37.7749,-122.4194"])).toThrow(
        /Invalid location format/,
      );
    });
  });
});
