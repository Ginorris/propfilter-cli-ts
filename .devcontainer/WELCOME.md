# Welcome to PropFilter CLI 🚀

PropFilter is a command-line tool for filtering real estate properties. It supports JSON and CSV files as input and allows powerful filtering using intuitive operators.

## ⚡ Quick Start

Once the setup completes, open the terminal and run:

```bash
propfilter --help
```

This will show you all available options and usage examples.

## 📌 Example Commands

### **Basic Filtering**
```bash
propfilter .devcontainer/sample.csv "price > 400000"
```
Filters properties where the price is greater than 400,000.

```bash
propfilter .devcontainer/sample.csv "lighting == high" "rooms >= 3"
```
Filters properties with high lighting and at least 3 rooms.

### **Filtering by Location**
```bash
propfilter .devcontainer/sample.csv "location <= 37.7749,-122.4194,10"
```
Finds properties within a 10 km radius of (37.7749, -122.4194).

### **Using JSON Output**
```bash
propfilter .devcontainer/sample.csv "amenities == pool,garage" --json
```
Outputs results as JSON instead of a table.

## ℹ️ Supported Operators
- `==`, `!=` → Equals, Not Equals
- `<`, `<=`, `>`, `>=` → Numeric comparisons
- `~=` → Contains (for descriptions)
- `location <= lat,lng,radius` → Find properties within a distance

### 💡 Notes
- CSV files should have a header row matching the expected property fields.
- JSON files should be an array of property objects.

Have fun testing, and feel free to explore the filters! 🚀

