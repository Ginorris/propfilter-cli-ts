# PropFilter CLI - Real Estate Filtering Tool 🏡

PropFilter is a powerful and intuitive command-line tool for filtering real estate properties. It supports JSON and CSV files as input and allows precise filtering using a variety of operators.

---

## 🚀 Get Started

### 🏆 Recommended: Use GitHub Codespaces

The easiest way to try PropFilter is through **GitHub Codespaces**, where everything is pre-configured.

1. Click **"Code"** -> **"Codespaces"** -> **"Open in Codespaces"** on GitHub.
2. Wait for the setup to complete.
3. Open the terminal and run:
   ```bash
   propfilter --help
   ```
4. Start filtering properties instantly!

---

## 🛠️ Installation (For Local Usage)

### **1. Install via npm**
PropFilter is available as an npm package. Install it globally using:
```bash
npm install -g propfilter-cli-ts
```

[View on npm](https://www.npmjs.com/package/propfilter-cli-ts)

### **2. Run the CLI**
```bash
propfilter --help
```
This will display all available options and usage examples.

---

## 📚 Example Usage (Using Provided Sample Files)

You can test PropFilter immediately using the **example CSV** file included in the repository.

```bash
propfilter .devcontainer/sample.csv "price > 400000"
```

---

## 📚 Example Usage

### **Basic Filtering**
```bash
propfilter sample.csv "price > 400000"
```
Filters properties where the price is greater than 400,000.

```bash
propfilter sample.csv "lighting == high" "rooms >= 3"
```
Filters properties with high lighting and at least 3 rooms.

### **Filtering by Location**
```bash
propfilter sample.csv "location <= 37.7749,-122.4194,10"
```
Finds properties within a 10 km radius of (37.7749, -122.4194).

### **Filtering by Amenities**
```bash
propfilter sample.csv "amenities == pool,garage"
```
Filters properties that include both a **pool** and a **garage**.

### **Using JSON Output**
```bash
propfilter sample.csv "amenities == pool,garage" --json
```
Outputs results as JSON instead of a table.

---

## ⚙️ Features

👉 **Supports CSV & JSON files**  
👉 **Powerful filtering using various operators**  
👉 **Intuitive CLI interface with formatted table output**  
👉 **JSON output mode for structured data processing**  
👉 **Works with GitHub Codespaces for instant use**  
👉 **Fully tested with automated GitHub Actions**  

---

## 📊 Test Coverage

PropFilter is rigorously tested with **Jest**, ensuring reliability and correctness.

To run tests locally:
```bash
npm test
```

GitHub Actions automatically run tests on every push to `main`.

---

## 👉 Supported Operators

- `==`, `!=` → Equals, Not Equals
- `<`, `<=`, `>`, `>=` → Numeric comparisons
- `~=` → Contains (for descriptions)
- `location <= lat,lng,radius` → Find properties within a distance

### 💡 Notes
- CSV files should have a header row matching the expected property fields.
- JSON files should be an array of property objects.

---

## 📚 Input Formats

PropFilter supports both **CSV** and **JSON** formats for input data.

### 🔢 CSV Example:
```csv
squareFootage,lighting,price,rooms,bathrooms,location,description,amenities
4485,medium,470155,2,1,"(-7.25056, -56.540592)","House with renovated kitchen","{'garage': false, 'pool': false, 'garden': false, 'fireplace': false, 'basement': true}"
```

### 🔢 JSON Example:
```json
[
  {
    "squareFootage": 4485,
    "lighting": "medium",
    "price": 470155,
    "rooms": 2,
    "bathrooms": 1,
    "location": [-7.25056, -56.540592],
    "description": "House with renovated kitchen",
    "amenities": {
        "garage": false,
        "pool": false,
        "garden": false,
        "fireplace": false,
        "basement": true
    }
  }
]
```

---

## 📦 Dependencies

PropFilter relies on the following libraries:
- [**commander**](https://www.npmjs.com/package/commander) - CLI argument parsing
- [**chalk**](https://www.npmjs.com/package/chalk) - Colored terminal output
- [**cli-table3**](https://www.npmjs.com/package/cli-table3) - Table formatting
- [**csv-parse**](https://www.npmjs.com/package/csv-parse) - CSV parsing
- [**typescript**](https://www.npmjs.com/package/typescript) - Type safety

---

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Clone it to your local machine.
3. Install dependencies using `npm install`.
4. Run tests using `npm test`.
5. Open a pull request with your changes.

---

## 📝 License

This project is licensed under the **MIT License**.

Have fun filtering properties with PropFilter! 🚀

