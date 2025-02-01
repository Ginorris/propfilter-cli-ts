import { loadProperties, readStdin } from "../src/utils/loadFile";
import fs from "fs";

describe("File Input Handling", () => {
  const mockJsonFile = "mock_properties.json";
  const mockCsvFile = "mock_properties.csv";
  const mockInvalidFile = "mock_invalid.txt";
  const mockNonExistentFile = "does_not_exist.json";

  beforeAll(() => {
    // Create mock files for testing
    fs.writeFileSync(
      mockJsonFile,
      JSON.stringify([{ squareFootage: 1500, price: 300000, location: [40.7128, -74.006] }]),
    );

    fs.writeFileSync(
      mockCsvFile,
      `squareFootage,price,location,amenities
1500,300000,"(40.7128,-74.006)","{'garage': True, 'pool': False}"
`,
    );

    fs.writeFileSync(mockInvalidFile, "This is not a valid JSON or CSV file.");
  });

  afterAll(() => {
    fs.unlinkSync(mockJsonFile);
    fs.unlinkSync(mockCsvFile);
    fs.unlinkSync(mockInvalidFile);
  });

  //
  // 1) STDIN Input Handling
  //
  describe("STDIN Input Handling", () => {
    it("reads data from STDIN correctly", async () => {
      const mockInput = JSON.stringify([
        { squareFootage: 1200, price: 250000, location: [34.0522, -118.2437] },
      ]);

      // Simulate reading from STDIN
      const mockStdin = jest
        .spyOn(process.stdin, "on")
        .mockImplementation((event: any, callback: any) => {
          if (event === "data") {
            callback(mockInput);
          }
          if (event === "end") {
            callback();
          }
          return process.stdin;
        });

      const inputData = await readStdin();
      expect(inputData).toBe(mockInput);

      mockStdin.mockRestore();
    });

    it("returns null if no STDIN input is provided", async () => {
      const mockStdin = jest
        .spyOn(process.stdin, "on")
        .mockImplementation((event: any, callback: any) => {
          if (event === "end") {
            callback();
          }
          return process.stdin;
        });

      const inputData = await readStdin();
      expect(inputData).toBe("");

      mockStdin.mockRestore();
    });

    it("loads properties from valid JSON input (provided via STDIN)", async () => {
      const jsonData = JSON.stringify([
        { squareFootage: 2000, price: 450000, location: [37.7749, -122.4194] },
      ]);

      const properties = loadProperties(jsonData, undefined);
      expect(properties.length).toBe(1);
      expect(properties[0].squareFootage).toBe(2000);
    });

    it("returns null when stdin is TTY (no piped input)", async () => {
      Object.defineProperty(process.stdin, "isTTY", { value: true });
      const mockStdin = jest.spyOn(process.stdin, "on").mockImplementation(() => process.stdin);
      const inputData = await readStdin();
      expect(inputData).toBeNull();
      mockStdin.mockRestore();
    });
  });

  //
  // 2) JSON File Handling
  //
  it("loads properties from a valid JSON file", () => {
    const properties = loadProperties(undefined, mockJsonFile);
    expect(properties.length).toBe(1);
    expect(properties[0].squareFootage).toBe(1500);
  });

  //
  // 3) CSV File Handling
  //
  it("loads properties from a CSV file and correctly parses the amenities field", () => {
    const properties = loadProperties(undefined, mockCsvFile);
    expect(properties.length).toBe(1);
    expect(properties[0].amenities).toMatchObject({ garage: true, pool: false });
    expect(properties[0].location).toEqual([40.7128, -74.006]);
  });

  //
  // 4) Error Handling
  //
  it("throws an error if the file format is unsupported", () => {
    expect(() => loadProperties(undefined, mockInvalidFile)).toThrow(
      "Unsupported file format. Use .json or .csv.",
    );
  });

  it("throws an error if no input method is provided", () => {
    expect(() => loadProperties(undefined, undefined)).toThrow(
      "No input provided. Specify a file or use STDIN.",
    );
  });

  it("throws an error if the file does not exist", () => {
    expect(() => loadProperties(undefined, mockNonExistentFile)).toThrow(
      `File not found: ${mockNonExistentFile}`,
    );
  });
});
