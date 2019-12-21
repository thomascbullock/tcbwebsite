/* eslint-disable no-restricted-syntax */
const fs = require('fs-extra');
const path = require('path');
const express = require('express');
const Rss = require('rss');
const moment = require('moment');
const uuid = require('uuid/v1');

const app = express();
const port = 3000;
const Postmaster = require('./postMaster');
const Page = require('./page_template_new');

const outputPath = './build';
const meta = require('../posts_meta.json');

const pageTypes = ['long', 'short', 'photo', 'all'];

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
  constructor() {
    this.postmaster = new Postmaster();
  }

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
    await fs.ensureDir(path.join(outputPath, 'rss'));

    await fs.copyFile('reset.css', path.join(outputPath, 'css', 'reset.css'));
    await fs.copyFile('style.css', path.join(outputPath, 'css', 'style.css'));
    for (const imgFile of fs.readdirSync('img')) {
      await fs.copyFile(path.join('img', imgFile), path.join(outputPath, 'img', imgFile));
    }
    await this.postmaster.build(meta);
  }

  async buildSinglePages() {
    let i;
    for (i = 0; i < this.postmaster.all.length; i++) {
      let footerPrevious;
      let footerNext;
      // write the indivdual Page
      const singleBodyBag = [{
        title: this.postmaster.all[i].title,
        dateTime: this.postmaster.all[i].dateTime,
        body: this.postmaster.all[i].body,
        href: `/posts/${this.postmaster.all[i].file.split('.')[0]}`,
      }];
      if (i === 0) {
        footerNext = `${this.postmaster.all[i + 1].file.split('.')[0]}.html`;
      } else if (i > 0 && i < this.postmaster.all.length - 1) {
        footerPrevious = `${this.postmaster.all[i - 1].file.split('.')[0]}.html`;
        footerNext = `${this.postmaster.all[i + 1].file.split('.')[0]}.html`;
      } else {
        footerPrevious = `${this.postmaster.all[i - 1].file.split('.')[0]}.html`;
      }

      const singlePage = new Page({
        title: this.postmaster.all[i].title,
        bodyBag: singleBodyBag,
        footerPrevious,
        footerNext,
        fileName: this.postmaster.all[i].file.split('.')[0],
        fileDir: path.join(outputPath, 'posts'),
      });
      await singlePage.savePage();
    }
  }

  async buildMultiPages() {
    let archive = '';
    for (let pageTypeCounter = 0; pageTypeCounter < pageTypes.length; pageTypeCounter++) {
      const postType = pageTypes[pageTypeCounter];
      let bodyBag = [];
      let pagesCounter = 0;
      let postsCounter = 0;
      
      const feed = new Rss({
        title: postType,
        feed_url: `http://thomascbullock.com/rss/rss-${postType}.xml`,
        site_url: 'http://thomascbullock.com',
      });
      if (this.postmaster[postType]) {

        for (let totalPostCounter = 0; totalPostCounter < this.postmaster[postType].length; totalPostCounter++) {
          bodyBag.push({
            title: this.postmaster[postType][totalPostCounter].title,
            dateTime: this.postmaster[postType][totalPostCounter].dateTime,
            body: this.postmaster[postType][totalPostCounter].body,
            href: `/posts/${this.postmaster[postType][totalPostCounter].file.split('.')[0]}`,
          });
          feed.item({
            title: this.postmaster[postType][totalPostCounter].title,
            description: this.postmaster[postType][totalPostCounter].title,
            url: `http://thomascbullock.com/posts/${this.postmaster[postType][totalPostCounter].file.split('.')[0]}`,
            guid: uuid(),
          });

          if (postType === 'all' && this.postmaster[postType][totalPostCounter].type !== 'short') {
            archive = archive + `${moment(this.postmaster[postType][totalPostCounter].dateTime).format('MMMM Do YYYY')}: [${this.postmaster[postType][totalPostCounter].title}](/posts/${this.postmaster[postType][totalPostCounter].file.split('.')[0]})\n\n`;
          }

          if (postsCounter === 10 || totalPostCounter + 1 === this.postmaster[postType].length) {
            let footerNext;
            let footerPrevious;
            let fileName;

            if (pagesCounter === 0) {
              footerPrevious = `/posts/${postType}/${pagesCounter + 1}.html`;
              fileName = `${postType}`;
            } else if (pagesCounter === 1) {
              footerPrevious = `/posts/${postType}/${pagesCounter + 1}.html`;
              footerNext = `/posts/${postType}/${postType}.html`;
              fileName = `${pagesCounter}`;
            } else if (pagesCounter > 1 && pagesCounter < (this.postmaster[postType].length / 10)) {
              footerPrevious = `/posts/${postType}/${pagesCounter + 1}.html`;
              footerNext = `/posts/${postType}/${pagesCounter - 1}.html`;
              fileName = `${pagesCounter}`;
            } else {
              footerNext = `/posts/${postType}/${pagesCounter - 1}.html`;
              fileName = `${pagesCounter}`;
            }
            const pageOfPosts = new Page({
              title: 'T',
              bodyBag,
              footerPrevious,
              footerNext,
              fileName,
              fileDir: path.join(outputPath, 'posts', postType),
            });
            await pageOfPosts.savePage();
            postsCounter = 0;
            pagesCounter++;
            bodyBag = [];
          } else {
            postsCounter++;
          }
        }
      }
      await fs.writeFile(path.join(outputPath, 'rss',`rss-${postType}.xml`),feed.xml({indent: true}));
    }
    const archiveBag = [{
      title: 'Archive',
            dateTime: Date.now(),
            body: archive,
            href: `/posts/archive`,
    }];
    const archivePage = new Page({
      title: 'Archive',
      bodyBag: archiveBag,
      fileName: 'archive',
      fileDir: path.join(outputPath,'posts')
    });
    await archivePage.savePage();
  }

    async buildAboutPage(){

      const aboutBody = await fs.readFile(`./posts/about.md`);

      const aboutBodyBag = [{
        title: 'About',
        dateTime: Date.now(),
        body: aboutBody.toString(),
        href: '/posts/about',
      }];
   
      const aboutPage = new Page({
        title: 'About',
        bodyBag: aboutBodyBag,
        fileName: 'about',
        fileDir: path.join(outputPath, 'posts'),
      });

      await aboutPage.savePage();

  }

  async orchestrate() {
    await website.setup();
    await website.buildSinglePages();
    await website.buildMultiPages();
    await website.buildAboutPage();
    app.use(express.static('./build', { extensions: ['html'], index: 'posts/all/all.html' }));
    app.listen(port);
  }
}

const website = new Website();
website.orchestrate();
