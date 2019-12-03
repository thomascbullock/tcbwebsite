const jimp = require('jimp');
const fs = require('fs-extra');
const md = require('markdown-it');

const imagePath = './images/toResize';
const pagesPath = './pages';
const path = require('path');
const meta = require('./posts_meta.json');

async function resizeMe(pathOfImage, fileName) {
  console.log(`resizing ${fileName}`);

  try {
    const myPic = await jimp.read(pathOfImage);
    if (myPic.getWidth > 1500) {
      await myPic.resize(1500, jimp.AUTO);
    }
    await myPic.quality(60);
    await myPic.writeAsync(`./images/resized/${fileName}`);
  } catch (err) {
    console.error(err);
  }
}

async function resizeDir() {
  for (const img of fs.readdirSync(imagePath)) {
    if (imagePath) {
      await resizeMe(path.join(imagePath, img), img);
    }
  }
}

async function showDir() {
  const dirResult = await fs.readdir(pagesPath);
  console.log(dirResult);
}

async function newBuilderPosts() {
  
}


newBuilderPosts();
