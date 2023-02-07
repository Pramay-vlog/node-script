const fs = require("fs").promises;
const path = require("path");
const c = require("../colors");
module.exports = async (projectName, dbName) => {
  try {
    projectName = projectName + "-backend-apis";
    console.log(c.fg.yellow, `Copying files for ${projectName}...`, c.reset);
    await fs.mkdir(path.resolve(process.cwd(), projectName));
    console.log(c.fg.yellow, `Creating ${projectName}...`, c.reset);
    await copySetupFiles(path.resolve(__dirname, `../../resource/setupSkeletons/${dbName}Setup`), projectName, dbName);
    console.log(c.fg.green, `Project ${projectName} created successfully.`, c.reset);
  } catch (error) {
    console.log(c.fg.red, "Error encountered while creating project...", c.reset);
    console.log(c.fg.red, error.message, c.reset);
  }
};

const kababCaseToCamelCase = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const copySetupFiles = async (location, projectName, dbName) => {
  location = location.replace(/\\/g, "/");
  fs.access(location).catch(() => {
    return;
  });
  const refLocStat = await fs.lstat(location);
  if (refLocStat.isFile()) {
    // if (location.split(`${dbName}Setup\\`)[1]) {
    if (location.split(`${dbName}Setup/`)[1]) {
      const filePath = path.resolve(process.cwd(), projectName, location.split(`${dbName}Setup/`)[1]);
      // const filePath = path.resolve(process.cwd(), projectName, location.split(`${dbName}Setup\\`)[1]);
      let projectNameWithouBackendAPIS = projectName.split("-backend-apis")[0];
      const fileContent = (await fs.readFile(location))
        .toString()
        .replace(/xxxxx/g, projectNameWithouBackendAPIS)
        .replace(/Xxxxx/g, `${projectNameWithouBackendAPIS.charAt(0).toUpperCase()}${kababCaseToCamelCase(projectNameWithouBackendAPIS.slice(1))}`)
        .replace(/XXXXX/g, kababCaseToCamelCase(projectNameWithouBackendAPIS).toUpperCase());
      await fs.writeFile(filePath, fileContent);
    }
    return;
  } else {
    // if (location.split(`${dbName}Setup\\`)[1]) {
    if (location.split(`${dbName}Setup/`)[1]) {
      const dirPath = path.resolve(process.cwd(), projectName, location.split(`${dbName}Setup/`)[1]);
      // const dirPath = path.resolve(process.cwd(), projectName, location.split(`${dbName}Setup\\`)[1]);
      await fs.mkdir(dirPath);
    }
    const refDirs = await fs.readdir(location);
    for (let i = 0; i < refDirs.length; i++) {
      const refDir = refDirs[i];
      await copySetupFiles(path.resolve(location, refDir), projectName, dbName);
    }
    return;
  }
};
