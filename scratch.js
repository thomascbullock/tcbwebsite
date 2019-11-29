const jimp = require('jimp');
const fs= require('fs-extra');
const imagePath = './images/toResize';
const path = require('path');

async function resizeMe(pathOfImage, fileName){
    console.log("resizing " + fileName);
    
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

async function resizeDir(){

    for (var img of fs.readdirSync(imagePath)){
        if (imagePath){
            await resizeMe(path.join(imagePath, img), img);
        }
    };
}

resizeDir();

