const app = require('photoshop').app;
const core = require('photoshop').core;
let psAction = require('photoshop').action;
const { storage } = require('uxp');
const ls = storage.localStorage;
const fs = storage.localFileSystem;
const doc = app.activeDocument;
let folderObj = '';

const { plugins } = require('./src/PluginsPage/plugins');
const { swaperPage } = require('./src/ImageProcessor/imageProcessor');
const { textPage } = require('./src/ConverterImages/converterImages');

plugins(fs,folderObj);
swaperPage(executeModel, core, app, fs, psAction, doc,folderObj);
textPage(folderObj);

async function executeModel(obj, opt = {}) {
	await core.executeAsModal(obj, opt);
}

//testing
