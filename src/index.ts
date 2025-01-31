#!/usr/bin/env node

import { Command } from "commander";
import { loadProperties, readStdin } from "./utils/loadFile";

const program = new Command();

/**
 * Main CLI execution function.
 */
async function main() {
  program
    .name("propfilter")
    .description("A CLI tool for filtering real estate properties.")
    .argument("[file]", "Path to JSON or CSV file (or use STDIN)")
    .parse(process.argv);

  const filePath = program.args[0];
  const stdinData = await readStdin();

  try {
    const properties = loadProperties(stdinData || undefined, filePath);
    console.log(`Loaded ${properties.length} properties successfully.`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
