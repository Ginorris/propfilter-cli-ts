#!/usr/bin/env node

import { Command } from "commander";
import { loadProperties, readStdin } from "./utils/loadFile";
import { parseSingleCondition, applyFilters } from "./utils/filter";
import { Property, FilterCondition } from "./types/Property";
import Table from "cli-table3";
import chalk from "chalk";

function setupCLI(): Command {
  const program = new Command();

  program
    .name("propfilter")
    .description(chalk.green("A CLI tool for filtering real estate properties."))
    .argument("<file>", chalk.yellow("Path to JSON or CSV file (or use STDIN)"))
    .argument("[filters...]", chalk.yellow("Filters in 'field operator value' format"))
    .option("--json", chalk.yellow("Output results as raw JSON"))
    .on("--help", () => {
      console.log("\n" + chalk.blue("📌 Usage Examples:"));
      console.log(chalk.yellow('  propfilter properties.json "price > 500000"'));
      console.log(chalk.yellow('  propfilter dataset.csv "lighting == high" "rooms >= 3"'));
      console.log(chalk.yellow('  propfilter dataset.csv "description ~= city center"'));
      console.log(
        chalk.yellow('  cat properties.json | propfilter --json "amenities == pool,garage"'),
      );

      console.log("\n" + chalk.blue("📍 Location Filtering:"));
      console.log(
        chalk.yellow(
          '  propfilter dataset.csv "location <= 10,45,50" (Filter by latitude, longitude, and max distance in km)',
        ),
      );

      console.log("\n" + chalk.blue("⚡ Supported Operators:"));
      console.log(
        chalk.cyan("  ==   !=   >   <   >=   <=   ~= (contains)  location <= lat,lng,distance"),
      );

      console.log("\n" + chalk.blue("💡 Notes:"));
      console.log(chalk.magenta("  - Multiple filters use AND logic (all conditions must match)."));
      console.log(chalk.magenta("  - Use quotes for filters containing spaces."));
      console.log(chalk.magenta("  - The '--json' flag outputs raw JSON results."));
    });

  return program;
}

function displayResults(properties: any[]) {
  if (properties.length === 0) {
    console.log(chalk.yellow("No results found."));
    return;
  }

  const table = new Table({
    head: [
      chalk.blue("SqFt"),
      chalk.blue("Lighting"),
      chalk.blue("Price"),
      chalk.blue("Rooms"),
      chalk.blue("Baths"),
      chalk.blue("Amenities"),
      chalk.blue("Description"),
      chalk.blue("Location"),
    ],
    colWidths: [10, 10, 12, 8, 8, 20, 40],
  });

  properties.forEach((prop) => {
    table.push([
      prop.squareFootage,
      prop.lighting,
      `$${prop.price.toLocaleString()}`,
      prop.rooms,
      prop.bathrooms,
      Object.keys(prop.amenities)
        .filter((a) => prop.amenities[a])
        .join(", "),
      prop.description.length > 50 ? prop.description.substring(0, 47) + "..." : prop.description,
      `[${prop.location.join(", ")}]`,
    ]);
  });

  console.log(table.toString());
}

async function main() {
  const program = setupCLI();
  program.parse(process.argv);
  const options = program.opts();
  const args = program.args;

  if (args.length < 1) {
    console.error(chalk.red("Error: You must provide a file path."));
    process.exit(1);
  }

  const filePath: string = program.args[0];
  const filterArgs: string[] = program.args.slice(1) || [];
  const stdinData = await readStdin();

  try {
    let properties: Property[] = loadProperties(stdinData || undefined, filePath);

    const allConditions: FilterCondition[] = [];
    for (const arg of filterArgs) {
      const condition = parseSingleCondition(arg);
      allConditions.push(condition);
    }

    const result = applyFilters(properties, allConditions);

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      displayResults(result);
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
