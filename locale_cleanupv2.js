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
		} else if (file.endsWith('.js') || file.endsWith('.jsx')) {
			filelist.push(dir + file);
		}
	});

	return filelist;
};

if (loadFound) {
	console.log('dumpLangJSONs output was found.'.green);
	console.log();
	console.log('Loading files/subdirs from "common"'.yellow);
	console.log('Loading files/subdirs from "embedded"'.yellow);
	console.log('Loading files/subdirs from "libs"'.yellow);

	const commonFileList = fetchFiles(path.join(__dirname, '../../../common/'));
	const embeddedFileList = fetchFiles(path.join(__dirname, '../../../embedded/'));
	const libsFileList = fetchFiles(path.join(__dirname, '../../../libs/'));

	for (let i = 0; i < runAll.length; i++) {
		console.log();
		console.log('Loading ' + runAll[i].toUpperCase().green + ' locale files');
		console.log();

		for (let j = 0; j < loadFound.languages.length; j++) {
			if (loadFound.languages[j].lang === runAll[i]) {
				for (let l = 0; l < loadFound.languages[j].files.length; l++) {
					try {
						const getJSONFile = require('./locales/' + runAll[i] + '/' + loadFound.languages[j].files[l]);

						if (loadFound.languages[j].files[l] !== 'errors.json') {
							doStuff(runAll[i], getJSONFile, loadFound.languages[j].files[l], commonFileList, embeddedFileList, libsFileList);
						}
					} catch (err) {
						console.log('Could not require '.red + loadFound.languages[j].files[l].red);
					}
				}
			}
		}
	}

	console.log();
	console.log('Terminated.'.green);
} else {
	console.log('found.json not found, are you sure that dumpLangJSONs ran successfully?'.red);
	process.exit();
}

function doStuff(lang, locales, fileName, common, embed, libs) {
	const getKeys = allInternalObjs(locales);

	console.log();
	console.log(fileName.green + ' file and keys loaded successfully'.green);
	console.log();

	const keys = getKeys.length === 1 ? 'key' : 'keys';

	console.log('Parsing '.yellow + getKeys.length.toString().yellow + ' ' + keys.yellow + ' obtained from '.yellow + lang.yellow + '/'.yellow + fileName.yellow + ' through files in "common"'.yellow);
	console.log();

	const keysFound = [];

	for (let k = 0; k < getKeys.length; k++) {
		for (let f = 0; f < common.length; f++) {
			const file = fs.readFileSync(common[f], 'utf8');
			const idx = file.indexOf(getKeys[k]);

			if (idx !== -1 && keysFound.indexOf(getKeys[k]) === -1) {
				keysFound.push(getKeys[k]);
			}
		}

		for (let e = 0; e < embed.length; e++) {
			const file = fs.readFileSync(embed[e], 'utf8');
			const idx = file.indexOf(getKeys[k]);

			if (idx !== -1 && keysFound.indexOf(getKeys[k]) === -1) {
				keysFound.push(getKeys[k]);
			}
		}

		for (let l = 0; l < libs.length; l++) {
			const file = fs.readFileSync(libs[l], 'utf8');
			const idx = file.indexOf(getKeys[k]);

			if (idx !== -1 && keysFound.indexOf(getKeys[k]) === -1) {
				keysFound.push(getKeys[k]);
			}
		}
	}

	const keysToDelete = getKeys.filter(function(val) {
		return keysFound.indexOf(val) === -1;
	});

	if (keysToDelete.length > 0) {
		console.log('Found '.cyan + keysToDelete.length.toString().cyan + ' ' + keys.cyan + ' to delete.'.cyan);
		console.log();
	}

	const exceptions = ['app.member_type', 'app.timeout']

	for (let d = 0; d < keysToDelete.length; d++) {
		if (!containsAny(keysToDelete[d], exceptions)) {
			unset(locales, keysToDelete[d]);
			clean(locales);

			console.log(keysToDelete[d].cyan + ' deleted'.cyan);
			console.log();
		} else {
			console.log('A key exception was found on '.magenta + keysToDelete[d].red + ' , not deleting key but file will be rewritten to disk.'.magenta);
			console.log();
		}
	}

	if (keysToDelete.length > 0) {
		console.log(fileName.magenta + ' - Writing changes to disk.'.magenta);

		fs.writeFileSync(path.join(__dirname, './locales/' + lang + '/' + fileName), JSON.stringify(locales, null, 4));
	} else {
		console.log('No keys to delete.'.blue);
	}
}

function containsAny(str, substrings) {
	for (let i = 0; i !== substrings.length; i++) {
		const substring = substrings[i];

		if (str.indexOf(substring) !== -1) {
			return substring;
		}
	}

	return null;
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
