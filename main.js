const app = require('photoshop').app;
const core = require('photoshop').core;
let action = require('photoshop').action;
const { storage } = require('uxp');
const fs = storage.localFileSystem;


const process = document.getElementsByClassName("process");
const convert = document.getElementsByClassName("convert");
const back = document.getElementsByClassName("back");
const outFoldPathSwp = document.getElementById('outFoldPathSwp');
const imageinput = document.getElementById('imageinput');
const selectimageinput = document.getElementById("selectimageinput");
const resize = document.getElementById("resize");
const cinput = document.getElementById("input");
const selectinputFol = document.getElementById("selectinputFol");
const coutput = document.getElementById("output");
const selectoutputFol = document.getElementById("selectoutputFol");
const savJpg = document.getElementById("savJpg");
const savPng = document.getElementById("savPng");
const convertBt = document.getElementById("convertBt");

process.forEach(element => {
  element.addEventListener("click", function () {
    document.getElementById("header").style.display = "none";
    document.getElementById("gap").style.display = "none";
    document.getElementById("automizer").style.display = "none";
    document.getElementById("conversion").style.display = "none";
    document.getElementById("processing").style.display = "block";
  });
});

convert.forEach(element => {
  element.addEventListener("click", function () {
    document.getElementById("header").style.display = "none";
    document.getElementById("gap").style.display = "none";
    document.getElementById("automizer").style.display = "none";
    document.getElementById("processing").style.display = "none";
    document.getElementById("conversion").style.display = "block";
  });
});

back.forEach(element => {
  element.addEventListener("click", function () {
    document.getElementById("header").style.display = "block";
    document.getElementById("gap").style.display = "block";
    document.getElementById("automizer").style.display = "block";
    document.getElementById("conversion").style.display = "none";
    document.getElementById("processing").style.display = "none";
  });
});

document.getElementById("header").style.display = "none";
document.getElementById("gap").style.display = "none";
document.getElementById("automizer").style.display = "none";
document.getElementById("processing").style.display = "none";
document.getElementById("conversion").style.display = "block";

selectimageinput.addEventListener('click', browseFolder);
selectinputFol.addEventListener('click', async function () {
  let fold = await fs.getFolder();
  if (fold) {
    cinput.value = fold.nativePath;
    cinput.setAttribute('token', fs.createSessionToken(fold));
  }
});

selectoutputFol.addEventListener('click', async function () {
  let fold = await fs.getFolder();
  if (fold) {
    coutput.value = fold.nativePath;
    coutput.setAttribute('token', fs.createSessionToken(fold));
  }
});

convertBt.addEventListener('click', convertImages);
async function convertImages() {
  const inputToken = cinput.getAttribute('token');
  const outputToken = coutput.getAttribute('token');
  if (inputToken != null || outputToken != null) {
    var inputFolder = await fs.getEntryForSessionToken(inputToken);
    var outputFolder = await fs.getEntryForSessionToken(outputToken);
    const entries = await inputFolder.getEntries();
    const allFiles = entries.filter(entry => entry.isFile && (entry.name.endsWith(".psd") || entry.name.endsWith(".psb")));
    console.log(allFiles.length)
    core.executeAsModal(async () => {
      for (var j = 0; j < allFiles.length; j++) {
        var doc;
        try {
          doc = await app.open(allFiles[j]);
          var docName = allFiles[j].name.replace(".psd", "").replace(".psb", "");
          if (savJpg.checked) {
            var newFile = await outputFolder.createFile(docName + '.jpg', {
              "overwrite": "true"
            });
            app.activeDocument.saveAs.jpg(newFile, {
              quality: 12,
              embedColorProfile: true
            }, true);
          }
          if (savPng.checked) {
            var newFile = await outputFolder.createFile(docName + '.png', {
              "overwrite": "true"
            });
            app.activeDocument.saveAs.png(newFile, {
              embedColorProfile: true
            }, true);
          }
          app.activeDocument.closeWithoutSaving();
        } catch (mIssue) {
          console.log(mIssue)
        }
      }
    }, {
      "commandName": 'Converting Image'
    });
  }
}

async function browseFolder() {
  let fold = await fs.getFolder();
  if (fold) {
    imageinput.value = fold.nativePath;
    const entries = await fold.getEntries();
    srcPathTokken = [];
    const imgFiles = entries.filter(entry => entry.isFile && (entry.name.endsWith(".png") || entry.name.endsWith(".jpg") || entry.name.endsWith(".jpeg")));
    srcPathTokken = imgFiles.map((imgEntry) => {
      return {
        name: imgEntry.name,
        path: imgEntry.nativePath,
        token: fs.createSessionToken(imgEntry)
      };
    });

    outPathToken = fold;
    outFoldPathSwp.innerText = `Files Selected: ${srcPathTokken.length}`;

    const imagesDiv = document.getElementById('images');
    imagesDiv.innerHTML = '';

    srcPathTokken.forEach(imagePath => {
      const card = document.createElement('div');
      card.classList.add('image');

      const img = document.createElement('img');
      img.alt = 'Image';
      img.setAttribute('token', imagePath.token);
      img.src = `file://${imagePath.path.replace(/\\/g, '/')}`;
      img.addEventListener('click', function () {
        core.executeAsModal(async () => {
          var resizeMode = function () {
            var allRadios = resize.querySelectorAll('sp-radio');
            for (var i = 0; i < allRadios.length; i++) {
              if (allRadios[i].checked) {
                return allRadios[i].name;
              }
            }
          }();
          const token = img.getAttribute('token');
          await editContents(token, resizeMode);
        }, {
          "commandName": 'Placing Image'
        });
      });
      const cardText = document.createElement('sp-lable');
      cardText.classList.add('imageTitle');
      cardText.textContent = imagePath.name; // Display image name

      card.appendChild(img);
      card.appendChild(cardText);
      imagesDiv.appendChild(card);
    })
  }
}
async function editContents(designFiletoken, reiszeMode) {
  try {
    if (app.activeDocument.activeLayers[0]?.kind == 'smartObject') {
      await action.batchPlay([{
        _obj: "placedLayerEditContents",
        _options: {
          dialogOptions: "dontDisplay"
        }
      }], {});
      var smartObject = app.activeDocument;
      smartObject.flatten();
      smartObject.activeLayers[0].allLocked = false;
      smartObject.activeLayers[0].clear();
      command = { "_obj": "placeEvent", "freeTransformCenterState": { "_enum": "quadCenterState", "_value": "QCSAverage" }, "null": { "_kind": "local", "_path": designFiletoken }, "offset": { "_obj": "offset", "horizontal": { "_unit": "pixelsUnit", "_value": 0.0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0.0 } }, "replaceLayer": { "_obj": "placeEvent", "to": { "_ref": "layer" } } };
      await action.batchPlay([command], {});

      await resizeAlTo(reiszeMode);
      if (app.activeDocument.name.indexOf(".jpg") != -1) app.activeDocument.flatten();
      await action.batchPlay([{
        "_obj": "close",
        "saving": {
          "_enum": "yesNo",
          "_value": "yes"
        },
        "_isCommand": true,
        "_options": {
          "dialogOptions": "dontDisplay"
        }
      }], {});
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function resizeAlTo(scale) {
  if (scale == 'none') return;
  try {
    var doc = app.activeDocument;
    var iLayer = doc.activeLayers[0];
    doc.selection.selectAll();
    var mLayerB = doc.selection.bounds
    doc.selection.deselect();
    var scaley = mLayerB.width / iLayer.bounds.width;
    var scalex = mLayerB.height / iLayer.bounds.height;
    var scaleMax = Math.max(scaley, scalex);
    var scaleMin = Math.min(scaley, scalex);
    if (scale == 'fill') {
      scaley = scalex = scaleMax;
    } else if (scale == 'fit') {
      scaley = scalex = scaleMin;
    }
    iLayer.scale(scaley * 100, scalex * 100);
    iLayer.translate(((mLayerB[0] + mLayerB[2]) / 2) - ((iLayer.bounds[0] + iLayer.bounds[2]) / 2), ((mLayerB[1] + mLayerB[3]) / 2) - ((iLayer.bounds[1] + iLayer.bounds[3]) / 2));
  } catch (e) {
    console.log(e);
  }
};