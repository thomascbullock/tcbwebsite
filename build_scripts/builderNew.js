const fs = require('fs-extra');
const path = require('path');
const pageTemplate = require('./page_template');

var pagesPath = './pages';
var pagesMetaPath = './pages_meta';
var copyFolders = ['./images', './css', './js'];
var outputPath = './build';

async function clean(){

}

async function 