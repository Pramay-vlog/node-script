#!/usr/bin/env node
const c = require("../colors");
const fs = require("fs/promises");
const path = require("path");
const yargs = require("yargs");
try {
  const projectName = yargs.argv.name;
  if (!projectName) {
    console.log(c.fg.red, "Please provide a name for the project.", c.reset);
    console.log(
      c.fg.yellow,
      "Example: npx createSetup --name=['project-name']",
      c.reset
    );
    return;
  }
  if (/[A-Z_ ]/.test(projectName)) {
    console.log(
      c.fg.red,
      "Please user kebab case for name of the crud.",
      c.reset
    );
    console.log(
      c.fg.yellow,
      "Example: npx createCRUD --name=['crud-name-in-kebab-case']",
      c.reset
    );
    return;
  }
  const dbName = yargs.argv.db;
  if (!dbName || (dbName !== "mongodb" && dbName !== "postgres")) {
    console.log(c.fg.red, `Plase provide project type.`, c.reset);
    console.log(
      c.fg.yellow,
      `Example: npx createSetup --db=['postgres' | 'mongodb']`,
      c.reset
    );
    return;
  }
  require("./copyFiles")(projectName, dbName);
} catch (error) {
  console.log(c.fg.red, error.message, c.reset);
}
