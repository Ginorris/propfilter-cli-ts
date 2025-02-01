#!/usr/bin/env node

import { Command } from "commander";
import { loadProperties, readStdin } from "./utils/loadFile";
import { parseSingleCondition, applyFilters } from "./utils/filter";
import { Property, FilterCondition } from "./types/Property";

async function main() {
  const program = new Command();

  program
    .name("propfilter")
    .description("A CLI tool for filtering real estate properties.")
    .argument("<file>", "Path to JSON or CSV file (or use STDIN)")
    .argument("[filters...]", "One or more single-condition filters, e.g. 'price < 500000'")
    .parse(process.argv);

  const filePath: string = program.args[0];
  const filterArgs: string[] = program.args.slice(1) || [];
  const stdinData = await readStdin();

  try {
    let properties: Property[] = loadProperties(stdinData || undefined, filePath);

    const allConditions: FilterCondition[] = [];
    for (const arg of filterArgs) {
      const condition = parseSingleCondition(arg);
      console.log(`Parsed condition: ${JSON.stringify(condition)}`);
      allConditions.push(condition);
    }

    const result = applyFilters(properties, allConditions);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
