async function plugins(fs,folderObj) {
	//const fs = storage.localFileSystem;
	const loginButton = document.getElementById('loginButton');
	const pluginsPage = document.getElementById('pluginsPage');
	let foldPath = document.getElementById("foldPath")
	const pluginsError = document.getElementById('pluginsError');
	
	const selecFoldBtn = document.getElementById('selecFoldBtn');
	const swaperToggleButton = document.getElementById('swaperToggleButton');
	const textToggleButton = document.getElementById('textToggleButton');
	const togglePlugins = document.getElementById('togglePlugins');
	
	const swaperPage = document.getElementById('swaperPage');
	const textPage = document.getElementById('textPage');
	const footerContainer = document.getElementById('footerContainer');
	const footerLeft = document.getElementById('footerLeft');
	const footerRight = document.getElementById('footerRight');

	// const floderPathName = 'Select Folder'

	selecFoldBtn.addEventListener("click", async function() {
		try {
			const folder = await fs.getFolder();
			if (folder) {
				foldPath.innerText = folder.nativePath;
				folderObj = folder;
			}
		} catch (error) {
			console.error("Error selecting folder:", error);
			foldPath.innerText = "Folder was not selected";
			// Handle error if necessary
		}
	});



	//setTimeout(async () => {, 1);

	if (!emailFromStorage) {
		swaperPage.style.display = 'none';
		togglePlugins.style.display = 'none';
		textPage.style.display = 'none';
		pluginsError.style.display = 'none';
		footerContainer.style.display = 'none';
		pluginsPage.style.display = 'block';
	} else {
		footerLeft.innerText = `${emailFromStorage}`;
		swaperPage.style.display = 'block';
		togglePlugins.style.display = 'flex';
		footerContainer.style.display = 'flex';
		textPage.style.display = 'none';
		pluginsError.style.display = 'none';
		pluginsPage.style.display = 'none';
	}

	// get email
	loginEmail.addEventListener('input', evt => {
		emailAddress = evt.target.value;
	});

	// login button listener
	loginButton.addEventListener('click', async () => {
		loginButton.innerText = 'Wait...';

			pluginsError.style.display = 'none';
			pluginsPage.style.display = 'none';
			togglePlugins.style.display = 'flex';
			swaperPage.style.display = 'block';
			footerContainer.style.display = 'flex';
			footerLeft.innerText = "Image Swapper";
			loginButton.innerText = 'Login';
			swaperToggleButton.style.backgroundColor = '#ddd';
			swaperToggleButton.style.color = '#111';
			textToggleButton.style.backgroundColor = '#333';
			textToggleButton.style.color = '#ddd';
		
	});
	swaperToggleButton.addEventListener('click', () => {
		textPage.style.display = 'none';
		swaperPage.style.display = 'block';
		swaperToggleButton.style.backgroundColor = 'var(--text)';
		swaperToggleButton.style.color = 'var(--background)';
		textToggleButton.style.backgroundColor = 'var(--background)';
		textToggleButton.style.color = 'var(--text)';
	});
	textToggleButton.addEventListener('click', () => {
		textPage.style.display = 'block';
		swaperPage.style.display = 'none';
		textToggleButton.style.backgroundColor = 'var(--text)';
		textToggleButton.style.color = 'var(--background)';
		swaperToggleButton.style.backgroundColor = 'var(--background)';
		swaperToggleButton.style.color = 'var(--text)';
	});


}
async function browseFolder() {
	let targetElement;
	console.log(this.id);
	if (this.id == "bgImgBtn") { targetElement = bgImgPath }
	else if (this.id == "outPathBtn") { targetElement = outPutPath }
	const fs = storage.localFileSystem;
	
 }
module.exports = { plugins };


