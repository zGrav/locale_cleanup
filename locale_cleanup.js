'use strict';

const fs = require('fs');
const path = require('path');
/*eslint-disable no-unused-vars*/
const colors = require('colors');
const unset = require('lodash.unset');

const runAll = ['en', 'es', 'pt', 'tr'];
const loadFound = require('./locales/found.json');

const fetchFiles = function(dir, filelist) {
	const files = fs.readdirSync(dir);
	filelist = filelist || [];

	files.forEach(function(file) {
		if (fs.statSync(dir + file).isDirectory()) {
			filelist = fetchFiles(dir + file + '/', filelist);
		} else {
			if (file.endsWith('.js') || file.endsWith('.jsx')) {
				filelist.push(dir + file);
			}
		}
	});

	return filelist;
};

if (loadFound) {
	console.log('dumpLangJSONs output was found.'.green);
	console.log();
	console.log('Loading files/subdirs from "common"'.yellow);

	const commonFileList = fetchFiles(path.join(__dirname, '../../../common/'));

	console.log();
	console.log('Loading files/subdirs from "embedded"'.yellow);

	const embeddedFileList = fetchFiles(path.join(__dirname, '../../../embedded/'));

	for (let i = 0; i < runAll.length; i++) {
		console.log();
		console.log('Loading ' + runAll[i].toUpperCase().green + ' locale files');
		console.log();

		if (runAll[i] === 'en') {
			// english
			for (let j = 0; j < loadFound.languages.length; j++) {
				if (loadFound.languages[j].lang === 'english') {
					try {
						const getJSONFile = require('./locales/english/' + loadFound.languages[j].file);

						const getKeys = allInternalObjs(getJSONFile);

						console.log();
						console.log(loadFound.languages[j].file.green + ' file and keys loaded successfully'.green);
						console.log();

						console.log('Parsing '.yellow + getKeys.length.toString().yellow + ' keys obtained from '.yellow + loadFound.languages[j].file.yellow + ' through files in "common"'.yellow);
						console.log();

						let keyFound = false;
						const keysToDelete = [];

						for (let k = 0; k < getKeys.length; k++) {
							for (let f = 0; f < commonFileList.length; f++) {
								const file = fs.readFileSync(commonFileList[f], 'utf8');

								if (file.indexOf(getKeys[k]) > -1) {
									keyFound = true;
									break;
								}
							}

							if (!keyFound && !getKeys[k].startsWith('errors')) {
								keysToDelete.push(getKeys[k]);
							}
						}

						if (keysToDelete.length > 0) {
							console.log('Found '.cyan + keysToDelete.length.toString().cyan + ' keys to delete.'.cyan);
							console.log();
						}

						for (let d = 0; d < keysToDelete.length; d++) {
							unset(getJSONFile, keysToDelete[d]);
							clean(getJSONFile);

							console.log(keysToDelete[d].cyan + ' deleted'.cyan);
							console.log();
						}

						if (keysToDelete.length > 0) {
							console.log(loadFound.languages[j].file.magenta + ' - Writing changes to disk.'.magenta);

							fs.writeFileSync(path.join(__dirname, './locales/english/' + loadFound.languages[j].file), JSON.stringify(getJSONFile, null, 4));
						} else {
							console.log('No keys to delete.'.blue);
						}

					} catch (err) {
						console.log('Could not require '.red + loadFound.languages[j].file.red);
					}
				}
			}
		} else if (runAll[i] === 'es') {
			// spanish
			for (let j = 0; j < loadFound.languages.length; j++) {
				if (loadFound.languages[j].lang === 'spanish') {
					try {
						const getJSONFile = require('./locales/spanish/' + loadFound.languages[j].file);

						const getKeys = allInternalObjs(getJSONFile);

						console.log();
						console.log(loadFound.languages[j].file.green + ' file and keys loaded successfully'.green);
						console.log();

						console.log('Parsing '.yellow + getKeys.length.toString().yellow + ' keys obtained from '.yellow + loadFound.languages[j].file.yellow + ' through files in "common"'.yellow);
						console.log();

						let keyFound = false;
						const keysToDelete = [];

						for (let k = 0; k < getKeys.length; k++) {
							for (let f = 0; f < commonFileList.length; f++) {
								const file = fs.readFileSync(commonFileList[f], 'utf8');

								if (file.indexOf(getKeys[k]) > -1) {
									keyFound = true;
									break;
								}
							}

							if (!keyFound && !getKeys[k].startsWith('errors')) {
								keysToDelete.push(getKeys[k]);
							}
						}

						if (keysToDelete.length > 0) {
							console.log('Found '.cyan + keysToDelete.length.toString().cyan + ' keys to delete.'.cyan);
							console.log();
						}

						for (let d = 0; d < keysToDelete.length; d++) {
							unset(getJSONFile, keysToDelete[d]);
							clean(getJSONFile);

							console.log(keysToDelete[d].cyan + ' deleted'.cyan);
							console.log();
						}

						if (keysToDelete.length > 0) {
							console.log(loadFound.languages[j].file.magenta + ' - Writing changes to disk.'.magenta);

							fs.writeFileSync(path.join(__dirname, './locales/spanish/' + loadFound.languages[j].file), JSON.stringify(getJSONFile, null, 4));
						} else {
							console.log('No keys to delete.'.blue);
						}

					} catch (err) {
						console.log('Could not require '.red + loadFound.languages[j].file.red);
					}
				}
			}
		} else if (runAll[i] === 'pt') {
			// portuguese
			for (let j = 0; j < loadFound.languages.length; j++) {
				if (loadFound.languages[j].lang === 'portuguese') {
					try {
						const getJSONFile = require('./locales/portuguese/' + loadFound.languages[j].file);

						const getKeys = allInternalObjs(getJSONFile);

						console.log();
						console.log(loadFound.languages[j].file.green + ' file and keys loaded successfully'.green);
						console.log();

						console.log('Parsing '.yellow + getKeys.length.toString().yellow + ' keys obtained from '.yellow + loadFound.languages[j].file.yellow + ' through files in "common"'.yellow);
						console.log();

						let keyFound = false;
						const keysToDelete = [];

						for (let k = 0; k < getKeys.length; k++) {
							for (let f = 0; f < commonFileList.length; f++) {
								const file = fs.readFileSync(commonFileList[f], 'utf8');

								if (file.indexOf(getKeys[k]) > -1) {
									keyFound = true;
									break;
								}
							}

							if (!keyFound && !getKeys[k].startsWith('errors')) {
								keysToDelete.push(getKeys[k]);
							}
						}

						if (keysToDelete.length > 0) {
							console.log('Found '.cyan + keysToDelete.length.toString().cyan + ' keys to delete.'.cyan);
							console.log();
						}

						for (let d = 0; d < keysToDelete.length; d++) {
							unset(getJSONFile, keysToDelete[d]);
							clean(getJSONFile);

							console.log(keysToDelete[d].cyan + ' deleted'.cyan);
							console.log();
						}

						if (keysToDelete.length > 0) {
							console.log(loadFound.languages[j].file.magenta + ' - Writing changes to disk.'.magenta);

							fs.writeFileSync(path.join(__dirname, './locales/portuguese/' + loadFound.languages[j].file), JSON.stringify(getJSONFile, null, 4));
						} else {
							console.log('No keys to delete.'.blue);
						}

					} catch (err) {
						console.log('Could not require '.red + loadFound.languages[j].file.red);
					}
				}
			}

		} else if (runAll[i] === 'tr') {
			// turkish
			for (let j = 0; j < loadFound.languages.length; j++) {
				if (loadFound.languages[j].lang === 'turkish') {
					try {
						const getJSONFile = require('./locales/turkish/' + loadFound.languages[j].file);

						const getKeys = allInternalObjs(getJSONFile);

						console.log();
						console.log(loadFound.languages[j].file.green + ' file and keys loaded successfully'.green);
						console.log();

						console.log('Parsing '.yellow + getKeys.length.toString().yellow + ' keys obtained from '.yellow + loadFound.languages[j].file.yellow + ' through files in "common"'.yellow);
						console.log();

						let keyFound = false;
						const keysToDelete = [];

						for (let k = 0; k < getKeys.length; k++) {
							for (let f = 0; f < commonFileList.length; f++) {
								const file = fs.readFileSync(commonFileList[f], 'utf8');

								if (file.indexOf(getKeys[k]) > -1) {
									keyFound = true;
									break;
								}
							}

							if (!keyFound && !getKeys[k].startsWith('errors')) {
								keysToDelete.push(getKeys[k]);
							}
						}

						if (keysToDelete.length > 0) {
							console.log('Found '.cyan + keysToDelete.length.toString().cyan + ' keys to delete.'.cyan);
							console.log();
						}

						for (let d = 0; d < keysToDelete.length; d++) {
							unset(getJSONFile, keysToDelete[d]);
							clean(getJSONFile);

							console.log(keysToDelete[d].cyan + ' deleted'.cyan);
							console.log();
						}

						if (keysToDelete.length > 0) {
							console.log(loadFound.languages[j].file.magenta + ' - Writing changes to disk.'.magenta);

							fs.writeFileSync(path.join(__dirname, './locales/turkish/' + loadFound.languages[j].file), JSON.stringify(getJSONFile, null, 4));
						} else {
							console.log('No keys to delete.'.blue);
						}

					} catch (err) {
						console.log('Could not require '.red + loadFound.languages[j].file.red);
					}
				}
			}

		}
	}
} else {
	console.log('found.json not found, are you sure that dumpLangJSONs ran successfully?'.red);
	process.exit();
}

function clean(obj) {
	for (const key in obj) {

		// value is empty string
		if (obj[key] === '') {
			delete obj[key];
		}

		// value is array with only emtpy strings
		if (obj[key] instanceof Array) {
			let empty = true;

			for (let i = 0; i < obj[key].length; i++) {
				if (obj[key][i] !== '') {
					empty = false;
					break;
				}
			}

			if (empty) {
				delete obj[key];
			}
		}

		// value is object with only empty strings or arrays of empty strings
		if (typeof obj[key] === 'object') {
			obj[key] = clean(obj[key]);

			let hasKeys = false;

			for (const objKey in obj[key]) {
				hasKeys = true;
				break;
			}

			if (!hasKeys) {
				delete obj[key];
			}
		}
	}

	return obj;
}

function getkeys(z) {
	const out = [];
	for (const i in z) {
		out.push(i);
	}
	return out;
}

function allInternalObjs(data, name) {
	name = name || '';

	return getkeys(data)
		.reduce(function(olist, k) {

			const v = data[k];

			if (typeof v === 'object') {
				if (name === '') {
					olist.push.apply(olist, allInternalObjs(v, k));
				} else {
					olist.push.apply(olist, allInternalObjs(v, name + '.' + k));
				}
			} else {
				if (name === '') {
					olist.push(k);
				} else {
					olist.push(name + '.' + k);
				}
			}
			return olist;
		}, []);
}
