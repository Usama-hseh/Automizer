async function swaperPage(executeModel, core, app, fs, psAction) {
	const SolidColor = require('photoshop').app.SolidColor;


	const pluginsPage = document.getElementById("pluginsPage");
	const swaperPage = document.getElementById("swaperPage");
	const textPage = document.getElementById("textPage");
	const textPagebtn = document.getElementById("converterButton");
	const processImgbtn = document.getElementById("processImageButton");
	const imagesDiv = document.getElementById("imagesDiv");

	const swaperToggleButton = document.getElementById('swaperToggleButton');
	const textToggleButton = document.getElementById('textToggleButton');
	const swapperFontDropdown = document.getElementById('swapperFontDropdown');
	const selectFileSwaper = document.getElementById('selectFileSwaper');
	const swaperTextPath = document.getElementById('swaperTextPath');
	const fontError = document.getElementById('fontError');
	const swaperSubmit = document.getElementById('swaperSubmit');
	const swaperResetBtn = document.getElementById('swaperResetBtn');
	const checkboxError = document.getElementById('checkboxError');
	const srcFoldBtnSwp = document.getElementById('srcFoldBtnSwp');
	const outFoldPathSwp = document.getElementById('outFoldPathSwp');
	const colorBlkSwp = document.getElementById('colorBlkSwp');
	const colorWhiteSwp = document.getElementById('colorWhiteSwp');

	const { createDialog } = require('../../dialog/dialog.js');


	processImgbtn.addEventListener("click", () => {
		pluginsPage.style.display = 'none';
		swaperPage.style.display = 'block';
		// pluginsError.style.display = 'none';
		// footerContainer.style.display = 'none';
		// pluginsPage.style.display = 'none';
	})






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

	/*
	async function browseFolder() {
		let fold = await fs.getFolder();
		if (fold) {
			const entries = await fold.getEntries();
			srcPathTokken = []; // cso that if previously files are procesed that are removed
			const imgfiles = entries.filter(entry => entry.isFile && entry.name.endsWith(".png") || entry.name.endsWith(".jpg") || entry.name.endsWith(".jpeg"));
			srcPathTokken = imgfiles.map((imgEntry) => {
				return {
					name: imgEntry.name,
					path: imgEntry.nativePath,
					token: fs.createSessionToken(imgEntry)
				}
			})
			outPathToken = fold;
			outFoldPathSwp.innerText = `File Selected : ${srcPathTokken.length}` //fold.nativePath;

		//	const srcPathTokken = ['image1.jpg', 'image2.jpg', 'image3.jpg']; // Example array of image paths
			//const imagesDiv = document.getElementById('imagesDiv');
			srcPathTokken.forEach(imagePath => {
				const card = document.createElement('div');
				card.classList.add('card');

				const img = document.createElement('img');
				img.src = imagePath.path;
				img.alt = 'Image Name';

				const cardText = document.createElement('div');
				cardText.classList.add('card-text');
				cardText.textContent = 'Image Name';

				card.appendChild(img);
				card.appendChild(cardText);
				imagesDiv.appendChild(card);
			});
		}



	}
	*/
	
	async function browseFolder() {
		let fold = await fs.getFolder();
		if (fold) {
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
	
			const imagesDiv = document.getElementById('imagesDiv');
			imagesDiv.innerHTML = ''; // Clear previous content if any
	
			srcPathTokken.forEach(imagePath => {
				const card = document.createElement('div');
				card.classList.add('card');
	
				const img = document.createElement('img');
				img.alt = 'Image';
				img.onload = () => {
					// Once image is loaded, append it to the card
					card.appendChild(img);
				};
				img.onerror = (error) => {
					console.error('Image load error:', error);
				};
				img.src = imagePath.path; // Set image source
	
				const cardText = document.createElement('div');
				cardText.classList.add('card-text');
				cardText.textContent = imagePath.name; // Display image name
	
				card.appendChild(img);
				card.appendChild(cardText);
				imagesDiv.appendChild(card);
			});
		}
	}
	
	srcFoldBtnSwp.addEventListener('click', browseFolder);

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
