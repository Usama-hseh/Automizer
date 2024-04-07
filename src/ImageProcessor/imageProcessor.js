async function swaperPage(executeModel, core, app, fs, psAction) {
	const SolidColor = require('photoshop').app.SolidColor;

	const swaperPage = document.getElementById('swaperPage');
	const textPage = document.getElementById('textPage');
	const swaperToggleButton = document.getElementById('swaperToggleButton');
	const textToggleButton = document.getElementById('textToggleButton');
	const swapperFontDropdown = document.getElementById('swapperFontDropdown');
	const selectFileSwaper = document.getElementById('selectFileSwaper');
	const swaperTextPath = document.getElementById('swaperTextPath');
	const fontError = document.getElementById('fontError');
	const swaperSubmit = document.getElementById('swaperSubmit');
	const swaperResetBtn = document.getElementById('swaperResetBtn');
	const checkboxError = document.getElementById('checkboxError');
	const outFoldBtnSwp = document.getElementById('outFoldBtnSwp');
	const outFoldPathSwp = document.getElementById('outFoldPathSwp');
	const colorBlkSwp = document.getElementById('colorBlkSwp');
	const colorWhiteSwp = document.getElementById('colorWhiteSwp');

	const { createDialog } = require('../../dialog/dialog.js');

	let createFolderPath = '';
	let outPathToken = {};
	//global variables
	let textArray = [];
	let selectedFont = '';
	let blackText = false;
	let whiteText = false;
	let textLayer = '';
	let layerText = '';

	let blackColor = new SolidColor();
	blackColor.rgb.red = 0;
	blackColor.rgb.green = 0;
	blackColor.rgb.blue = 0;

	let whiteColor = new SolidColor();
	whiteColor.rgb.red = 255;
	whiteColor.rgb.green = 255;
	whiteColor.rgb.blue = 255;

	const arr = app.fonts;
	const fontsArray = arr.map(font => {
		return font.postScriptName;
	});

	// try {
	// 	textLayer = doc.layers.getByName('TextLayer');
	// 	await selectLayer(textLayer.id);
	// 	//console.log(textLayer)
	// 	layerText = doc.activeLayers[0].textItem;
	// } catch (e) {
	// 	core.showAlert({ message: 'No layer was found with name "TextLayer" ' });
	// 	return;
	// }

	async function browseFolder() {
		let fold = await fs.getFolder();
		if (fold) {
			outPathToken = fold;
			outFoldPathSwp.innerText = fold.nativePath;
		}
	}
	outFoldBtnSwp.addEventListener('click', browseFolder);

	selectFileSwaper.addEventListener('click', async () => {
		swaperTextPath.innerText = 'No file selected';
		swaperTextPath.style.color = 'inherit';
		const textFile = await fs.getFileForOpening();
		console.log(textFile);
		if (textFile.name.includes('.txt')) {
			const textDataRAw = (await textFile.read({ format: storage.formats.utf8 })).toString();

			const textData = textDataRAw.split('\r\n\r\n');
			textArray = [...textData];
			swaperTextPath.innerText = textFile.nativePath;
			createFolderPath = textFile.nativePath;
		} else {
			swaperTextPath.innerText = 'Please select a text file with .txt filename';
			swaperTextPath.style.color = 'red';
		}
	});

	swapperFontDropdown.addEventListener('change', evt => {
		fontError.style.display = 'none';
		if (evt.target.selectedIndex) {
			selectedFont = fontsArray[evt.target.selectedIndex];
		} else {
			fontError.style.display = 'block';
		}
	});

	colorBlkSwp.addEventListener('change', evt => {
		checkboxError.style.display = 'none';
		if (evt.target.checked) {
			blackText = true;
		} else {
			blackText = false;
		}
	});

	colorWhiteSwp.addEventListener('change', evt => {
		checkboxError.style.display = 'none';
		if (evt.target.checked) {
			whiteText = true;
		} else {
			whiteText = false;
		}
	});

	swaperResetBtn.addEventListener('click', async () => {
		window.location.reload();
	});

	swaperSubmit.addEventListener('click', async () => {
		if (!createFolderPath || createFolderPath === '') {
			swaperTextPath.innerText = 'Please select a text file with .txt filename';
			swaperTextPath.style.color = 'red';
		}
		if (!selectedFont || selectedFont === '') {
			fontError.style.display = 'block';
		} else {
			if (
				(blackText === false && whiteText === false) ||
				(blackText === true && whiteText === true)
			) {
				checkboxError.style.display = 'block';
			} else {
				try {
					let docuCur = app.activeDocument;
					textLayer = docuCur.layers.getByName('TextLayer');
					await selectLayer(textLayer.id);
					//console.log(textLayer)
					layerText = docuCur.activeLayers[0].textItem;
				} catch (e) {
					core.showAlert({ message: 'No layer was found with name "TextLayer" ' });
					return;
				}
				submitHandler();
			}
		}
	});

	function submitHandler() {
		applyFontSizeToFitLayer(textLayer.bounds.width, textLayer.bounds.height, textArray);
	}

	async function applyFontSizeToFitLayer(layerWidth, layerHeight, arr) {
		

		let wqt = new Date();
		let snapAbra = "ABRA " + wqt.getMilliseconds() + Math.random() * 9999;

		createSnapShot(snapAbra);

		for (let index = 0; index < arr.length; index++) {
			const sentence = arr[index];
			let sent_withewLines = String(sentence).replace(/\n/g, "");

			//	await executeModel({ contents: sentence });
			await core.executeAsModal(async () => {
				layerText.characterStyle.font = selectedFont;
				if (blackText === true) {
					layerText.characterStyle.color = blackColor;
				} else {
					layerText.characterStyle.color = whiteColor;
				}
				return (layerText.contents = sent_withewLines);
			}, {});

			await ScaleTextToFitBox(textLayer);

			// textLayer.document.saveAs.jpg();
			let filenameFinal = `${index + 1}`;
			await savePNG(outPathToken, filenameFinal);

			loadSnapShot(snapAbra);
		}
		createDialog('Process Completed');
	}

	addOptions(swapperFontDropdown, fontsArray);
}

// populate options dropdown
function addOptions(node, data) {
	for (const value of data) {
		const item = document.createElement('sp-menu-item');
		item.value = value;
		item.innerHTML = `${value}`;
		node.appendChild(item);
	}
}

module.exports = { swaperPage };

async function selectLayer(lyrId) {
	await core.executeAsModal(
		async () => {
			return await psAction.batchPlay(
				[
					{
						_obj: 'select',
						_target: [
							{
								_ref: 'layer',
								_id: parseInt(lyrId),
							},
						],
						makeVisible: false,
						// layerID: [
						//    lyrId
						// ],
						_options: {
							dialogOptions: 'dontDisplay',
						},
					},
				],
				{},
			);
		},
		{ commandName: 'Select a layer by name' },
	);
}

async function ScaleTextToFitBox(textLayer) {
	// if (!textLayer.isParagraphText) {
	//   await alert("Text layer type is not Paragraph...");
	//   return;
	// }

	let fitInsideBoxDimensions = getLayerDimensions(textLayer);

	let textLayerHeight = await getRealTextLayerDimensions(textLayer);
	console.log(textLayerHeight);
	while (fitInsideBoxDimensions.height < textLayerHeight) {
		let fontSize = parseInt(textLayer.textItem.characterStyle.size);
		core.executeAsModal(() => {
			return (textLayer.textItem.characterStyle.size = fontSize * 0.95);
		}, {});
		console.log(fontSize * 0.95);
		await selectLayer(textLayer.id);
		textLayerHeight = await getRealTextLayerDimensions(textLayer);
	}
}

/***dependency ScaleTextToFitBox****/
async function getRealTextLayerDimensions(textLayer) {
	let textLayerCopy;
	await core.executeAsModal(async () => {
		return (textLayerCopy = await textLayer.duplicate());
	}, {});
	await selectLayer(textLayerCopy.id);
	let horiz = Math.floor(
		(app.activeDocument.activeLayers[0].bounds.left / app.activeDocument.width) * 100,
	);
	let wi = app.activeDocument.activeLayers[0].bounds.width;
	await changeTextBounds(wi, horiz);

	await core.executeAsModal(
		async () => {
			await textLayerCopy.rasterize();
		},
		{ commandName: 'rasterize layer' },
	);

	const dimensions = getLayerDimensions(textLayerCopy);

	await core.executeAsModal(async () => {
		return textLayerCopy.delete();
	}, {});

	return dimensions.height;
}
/***dependency ScaleTextToFitBox****/
function getLayerDimensions(layer) {
	return {
		width: layer.bounds.width,
		height: layer.bounds.height,
	};
}

async function changeTextBounds(wi, horiz) {
	const batchCommands = {
		_obj: 'set',
		_target: [
			{
				_ref: 'textLayer',
				_enum: 'ordinal',
				_value: 'targetEnum',
			},
		],
		to: {
			_obj: 'textLayer',
			textClickPoint: {
				_obj: 'paint',
				horizontal: {
					_unit: 'percentUnit',
					_value: Number(horiz),
				},
				vertical: {
					_unit: 'percentUnit',
					_value: 0,
				},
			},

			orientation: {
				_enum: 'orientation',
				_value: 'horizontal',
			},

			textShape: [
				{
					_obj: 'textShape',
					char: {
						_enum: 'char',
						_value: 'box',
					},
					orientation: {
						_enum: 'orientation',
						_value: 'horizontal',
					},
					transform: {
						_obj: 'transform',
						xx: 1,
						xy: 0,
						yx: 0,
						yy: 1,
						tx: 0,
						ty: 0,
					},
					rowCount: 1,
					columnCount: 1,
					rowMajorOrder: true,
					rowGutter: {
						_unit: 'pixelsUnit',
						_value: 0,
					},
					columnGutter: {
						_unit: 'pixelsUnit',
						_value: 0,
					},
					spacing: {
						_unit: 'pixelsUnit',
						_value: 0,
					},
					frameBaselineAlignment: {
						_enum: 'frameBaselineAlignment',
						_value: 'alignByAscent',
					},
					firstBaselineMinimum: {
						_unit: 'pixelsUnit',
						_value: 0,
					},
					bounds: {
						_obj: 'rectangle',
						top: 0,
						left: 0,
						bottom: Number(app.activeDocument.height * (72 / app.activeDocument.resolution)),
						right: Number(wi * (72 / app.activeDocument.resolution)),
					},
				},
			],
		},
		_options: {
			dialogOptions: 'dontDisplay',
		},
	};
	return await core.executeAsModal(
		async () => {
			await psAction.batchPlay([batchCommands], { synchronousExecution: false });
		},
		{ commandName: 'make rectangle Shape' },
	);
}
async function savePNG(outToken, fileName) {
	var finalFile = await outToken.createFile(fileName, { overwrite: true });

	await core.executeAsModal(async () => {
		return app.activeDocument.saveAs.png(finalFile, undefined, true);
	}, {});
}
async function createSnapShot(nm) {
	await core.executeAsModal(
	  async () => {
		return await psAction.batchPlay(
		  [
			{
			  _obj: "make",
			  _target: [
				{
				  _ref: "snapshotClass",
				},
			  ],
			  name: nm,
			  from: {
				_ref: "historyState",
				_property: "currentHistoryState",
			  },
			  _options: {
				dialogOptions: "dontDisplay",
			  },
			},
		  ],
		  {}
		);
	  },
	  { commandName: "Create Snapshot" }
	);
  }
  async function loadSnapShot(nm) {
	await core.executeAsModal(
	  async () => {
		return await psAction.batchPlay(
		  [
			{
			  _obj: "select",
			  _target: [
				{
				  _ref: "snapshotClass",
				  _name: nm,
				},
			  ],
			  _options: {
				dialogOptions: "dontDisplay",
			  },
			},
		  ],
		  {}
		);
	  },
	  { commandName: "Create Snapshot" }
	);
  }

  async function converBitMode(value) {
	await core.executeAsModal(
	  async () => {
		return await psAction.batchPlay(
		  [
			{
				_obj: "convertMode",
				depth: Number(value),
				merge: false,
				_options: {
				   dialogOptions: "dontDisplay"
				}
			 }
		  ],
		  {}
		);
	  },
	  { commandName: "Convert Document Mode" }
	);
  }