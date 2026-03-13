const fs = require("fs");
const yaml = require("js-yaml");

function loadCatalogue() {

  const file = fs.readFileSync("./config/catalogue.yaml", "utf8");
  return yaml.load(file);

}

function getMenu() {

  const file = fs.readFileSync("./config/menu.yaml", "utf8");
  return yaml.load(file).menu;

}

module.exports = { loadCatalogue, getMenu };

