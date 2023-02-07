#!/usr/bin/env node
const c = require("../colors");
const fs = require("fs/promises");
const path = require("path");
const yargs = require("yargs");
try {
  const crudName = yargs.argv.name;
  if (!crudName) {
    console.log(c.fg.red, "Please provide a name for the crud.", c.reset);
    console.log(c.fg.yellow, "Example: npx createCRUD --name=['crud-name-in-kebab-case']", c.reset);
    return;
  }
  if (/[A-Z_ ]/.test(crudName)) {
    console.log(c.fg.red, "Please user kebab case for name of the crud.", c.reset);
    console.log(c.fg.yellow, "Example: npx createCRUD --name=['crud-name-in-kebab-case']", c.reset);
    return;
  }
  const crudType = yargs.argv.type;
  if (!crudType || (crudType !== "simple" && crudType !== "image")) {
    console.log(c.fg.red, `Plase provide crud type.`, c.reset);
    console.log(c.fg.yellow, `Example: npx createCRUD --type=['simple' | 'image']`, c.reset);
    return;
  }
  const projectDir = process.cwd();
  // const projectName = projectDir.split("\\")[projectDir.split("\\").length - 1];
  const projectName = projectDir.split("/")[projectDir.split("/").length - 1];
  console.log(projectName);
  // if (!/backend$/.test(projectName)) {
  //   console.log(c.fg.red, "Invlaid code structure. Please use the correct template.", c.reset);
  //   return;
  // }
  const dbName = yargs.argv.db;
  if (!dbName || (dbName !== "mongodb" && dbName !== "postgres")) {
    console.log(c.fg.red, `Plase provide project type.`, c.reset);
    console.log(c.fg.yellow, `Example: npx createSetup --db=['postgres' | 'mongodb']`, c.reset);
    return;
  }
  require("./simpleCRUD")(projectName, dbName, crudName, crudType);
} catch (error) {
  console.log(c.fg.red, error.message, c.reset);
  console.log(error);
}
