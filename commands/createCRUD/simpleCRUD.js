const fs = require("fs").promises;
const path = require("path");
const c = require("../colors");
module.exports = async (projectName, dbName, crudName, crudType) => {
  try {
    console.log(c.fg.yellow, `Creating ${crudName}...`, c.reset);
    await copyCRUDFiles(path.resolve(__dirname, `../../resource/CRUDSkeletons/${crudType}CRUD/${dbName}CRUD`), projectName, dbName, crudName);
    console.log(c.fg.green, `Crud ${projectName} created successfully.`, c.reset);
  } catch (error) {
    console.log(c.fg.red, "Error encountered while creating crud...", c.reset);
    console.log(c.fg.red, error, c.reset);
  }
};

const kababCaseToCamelCase = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const copyCRUDFiles = async (location, projectName, dbName, crudName) => {
  // location = location.replace(/\\/g, "/");
  fs.access(location).catch(() => {
    return;
  });
  const refLocStat = await fs.lstat(location);
  if (refLocStat.isFile()) {
    if (location.split(`${dbName}CRUD\\`)[1]) {
      // if (location.split(`${dbName}CRUD/`)[1]) {
      let filePath = path.resolve(
        process.cwd(),
        location.split(`${dbName}CRUD\\`)[1]
        // location.split(`${dbName}CRUD/`)[1]
      );
      filePath = filePath.replace("\\xxxxx\\", `\\${kababCaseToCamelCase(crudName)}\\`);
      // filePath = filePath.replace("/xxxxx/", `/${kababCaseToCamelCase(crudName)}/`);
      if (filePath.includes("schema")) filePath = filePath.replace("xxxxx", kababCaseToCamelCase(crudName));
      else filePath = filePath.replace("xxxxx", crudName);
      const fileContent = (await fs.readFile(location))
        .toString()
        .replace(/xxxxx/g, kababCaseToCamelCase(crudName))
        .replace(/Xxxxx/g, `${crudName.charAt(0).toUpperCase()}${kababCaseToCamelCase(crudName.slice(1))}`)
        .replace(/XXXXX/g, kababCaseToCamelCase(crudName).toUpperCase());
      await fs.writeFile(filePath, fileContent);
    }
    return;
  } else {
    if (location.split(`${dbName}CRUD\\`)[1]) {
      // if (location.split(`${dbName}CRUD/`)[1]) {
      let dirPath = path.resolve(process.cwd(), location.split(`${dbName}CRUD\\`)[1]);
      // let dirPath = path.resolve(process.cwd(), location.split(`${dbName}CRUD/`)[1]);
      dirPath = dirPath.replace(/xxxxx/, kababCaseToCamelCase(crudName));
      try {
        await fs.readdir(dirPath);
      } catch (error) {
        await fs.mkdir(dirPath);
      }
    }
    const refDirs = await fs.readdir(location);
    for (let i = 0; i < refDirs.length; i++) {
      const refDir = refDirs[i];
      await copyCRUDFiles(path.resolve(location, refDir), projectName, dbName, crudName);
    }
    return;
  }
};
