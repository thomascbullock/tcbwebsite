/* eslint-disable no-restricted-syntax */
const fs = require('fs-extra');
const path = require('path');
const pageTemplate = require('./page_template');
const Postmaster = require('./postMaster');

const pagesPath = './pages';
const pagesMetaPath = './pages_meta';
const copyFolders = ['./images', './css', './js'];
const outputPath = './build';
const meta = require('../posts_meta.json');


/*
// clean the existing dirs

// build the postmaster object

const postmaster = {
  all: [],
  long: [],
  short: [],
  photo: [],
  link: [],
};

async function buildPostObject(inPostMeta) {
  const postObject = inPostMeta;
  const postBody = await fs.readFile(`./posts/${inPostMeta.file}`);
  postObject.body = postBody.toString();
  postmaster.all.push(postObject);
  postmaster[inPostMeta.type].push(postObject);
}

async function buildPostmaster() {
  const postPromises = [];
  meta.posts.forEach((postMeta) => {
    postPromises.push(buildPostObject(postMeta));
  });
  await Promise.all(postPromises);
  sortPostmaster();
  console.log(postmaster);
}

function sortPostmaster() {
  console.log('entering sort postmaster');
  console.log(Object.entries(postmaster));
  for (const postType of Object.entries(postmaster)) {
    console.log(postType[0]);
    postmaster[postType[0]].sort((post1, post2) => post1.date - post2.date);
  }
}


// async function sortPostmaster
// loop through posts_meta.json
// for each:
// get the appropriate file and add it to the object
// add the completed object to the appropriate array
// sort the arrays by date

// build the pages:
// instantiate a pageTypes array of [all, long, short, photo, link]
// for each pageType...
// initiate a postsOnPage counter for the number of posts on a page for each type
// initiate a currentPage counter
// loop through the array within postmaster matching that postType
// create an html string with the header
// while postsOnPage < 11
// add the title, date, and body to the end of the string
// add the footer including links to the appropriate older/newer pages based on currentPage
// increment the currentPage counter

*/

const postmaster = new Postmaster();
postmaster.build(meta);

