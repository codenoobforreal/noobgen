#!/usr/bin/env node

import { Command } from "commander";
import { action as textfilegenAction } from "./textfilegen";

const program = new Command();

program
  .name("@codenoobforreal/noobgen")
  .description("CLI to generate stuff etc.")
  .version("0.1.0", "-v,--version", "output the current version");

program
  .command("textfilegen")
  .description("generate a text file with certain size")
  .argument("<filename>", "the name of generated file")
  .option("-s,--size <size>", "the size of generated file")
  .action(textfilegenAction);

program.parseAsync(process.argv);
