/* eslint-disable no-restricted-syntax */
const fs = require('fs-extra');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;
const pageTemplate = require('./page_template');
const Postmaster = require('./postMaster');
const Page = require('./page_template_new');

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

// remove previous build

for (const file of fs.readdirSync(outputPath)) {
  fs.removeSync(path.join(outputPath, file));
}

// move the css and image files straight across


class Website {
  async setup() {
    await fs.ensureDir(outputPath);
    for (const file of fs.readdirSync(outputPath)) {
      await fs.remove(path.join(outputPath, file));
    }
    await fs.ensureDir(path.join(outputPath, 'css'));
    await fs.ensureDir(path.join(outputPath, 'img'));
    await fs.ensureDir(path.join(outputPath, 'posts', 'long'));
    await fs.ensureDir(path.join(outputPath, 'posts', 'all'));
    await fs.ensureDir(path.join(outputPath, 'posts', 'photo'));
    await fs.ensureDir(path.join(outputPath, 'posts', 'short'));

    await fs.copyFile('reset.css', path.join(outputPath, 'css', 'reset.css'));
    await fs.copyFile('style.css', path.join(outputPath, 'css', 'style.css'));
    for (const imgFile of fs.readdirSync('img')) {
      await fs.copyFile(path.join('img',imgFile), path.join(outputPath, 'img', imgFile));
    }
  }


}

const website = new Website();
website.setup();

const postmaster = new Postmaster();
postmaster.build(meta)
  .then(() => {
    const bodyBag = [];
    let i;
    for (i = 0; i < postmaster.all.length; i++) {
      let footerPrevious;
      let footerNext;
      // write the indivdual Page
      const singleBodyBag = [{
        title: postmaster.all[i].title,
        dateTime: postmaster.all[i].dateTime,
        body: postmaster.all[i].body,
      }];
      if (i === 0) {
        footerPrevious = `${postmaster.all[i].file.split('.')[0]}.html`;
        footerNext = `${postmaster.all[i + 1].file.split('.')[0]}.html`;
      } else if (i > 0 && i < postmaster.all.length - 1) {
        footerPrevious = `${postmaster.all[i - 1].file.split('.')[0]}.html`;
        footerNext = `${postmaster.all[i + 1].file.split('.')[0]}.html`;
      } else {
        footerPrevious = `${postmaster.all[i - 1].file.split('.')[0]}.html`;
        footerNext = `${postmaster.all[i].file.split('.')[0]}.html`;
      }

      const singlePage = new Page({
        title: postmaster.all[i].title,
        bodyBag: singleBodyBag,
        footerPrevious,
        footerNext,
        fileName: postmaster.all[i].file.split('.')[0],
        fileDir: path.join(outputPath, 'posts'),
      });
      singlePage.savePage();
      bodyBag.push({
        title: postmaster.all[i].title,
        dateTime: postmaster.all[i].dateTime,
        body: postmaster.all[i].body,
      });
    }
    const allPage = new Page({
      title: 'All',
      bodyBag,
      footerPrevious: 'previous',
      footerNext: 'next',
      fileName: 'all',
      fileDir: 'posts/all',
    });

    allPage.savePage();
    app.use(express.static('./build'));
    app.listen(port);
  });
