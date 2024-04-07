const fs = storage.localFileSystem;
const app = window.require("photoshop").app;
const core = require("photoshop").core;
let psAction = require("photoshop").action;
const batchPlay = require("photoshop").action.batchPlay;
let constants = require("photoshop").constants;
const { createDialog } = require("../../dialog/dialog.js");
let selectedFont_textFile = "";

async function textPage(folderObj) {
  console.log(folderObj);
  const SolidColor = require("photoshop").app.SolidColor;
  // element mapping
  /*
  let outPathToken = {};
  const swaperPage = document.getElementById("swaperPage");
  const textPage = document.getElementById("textPage");
  const textFontDropdown = document.getElementById("textFontDropdown");
  const textOutputDropdown = document.getElementById("textOutputDropdown");
  const selectFileText = document.getElementById("selectFileText");
  const outFoldBtn = document.getElementById("outFoldBtn");
  const outFoldPath = document.getElementById("outFoldPath");
  const ok__textBtn = document.getElementById("ok__textBtn");
  let colorBlkText = document.getElementById("colorBlkText");
  let colorWhiteText = document.getElementById("colorWhiteText");
  let text_textFile = document.getElementById("text_textFile");
  const checkboxError4Text = document.getElementById("checkboxError4Text");
  const fontErrorText = document.getElementById("fontErrorText");
  const sizeError = document.getElementById("sizeError");
  const textResetBtn = document.getElementById("textResetBtn");
  let textScriptTextData = [];
  var vSpace = 20;
  let globalcount = 1;
  */
  const pluginsPage = document.getElementById("pluginsPage");
  const swaperPage = document.getElementById("swaperPage");
  const textPage = document.getElementById("textPage");
  const textPagebtn = document.getElementById("converterButton");

  textPagebtn.addEventListener("click",  () => {
    pluginsPage.style.display = 'none';
    textPage.style.display = 'block';
    // pluginsError.style.display = 'none';
    // footerContainer.style.display = 'none';
    // pluginsPage.style.display = 'none';
  })





}

module.exports = { textPage };

// populate options dropdown
function addOptions(node, data) {
  for (const value of data) {
    const item = document.createElement("sp-menu-item");
    item.innerHTML = `${value}`;
    node.appendChild(item);
  }
}


async function savePNG(outToken, fileName) {
  var finalFile = await outToken.createFile(fileName, { overwrite: true });

  await core.executeAsModal(async () => {
    return app.activeDocument.saveAs.png(finalFile, undefined, true);
  }, {});
}
