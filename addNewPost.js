const meta = require('./posts_meta.json');
const fs = require('fs-extra');

const validPostTypes = ['short','long','photo'];

function addPost(inType, inFile, inTitle) {
    meta.posts.push({
        title: inTitle,
        dateTime: Date.now(),
        type: inType,
        file: inFile
    });
    const metaString = JSON.stringify(meta);
    fs.writeFileSync('posts_meta.json', metaString);
}

function readCommandLine(){
    const type = process.argv[2] || 'NO TYPE PROVIDED';
    const file = process.argv[3] || 'NO FILE PROVIDED';
    const title = process.argv[4] || "";
    if (!validPostTypes.includes(type)) {
        throw new Error("post type not valid!");
    }
    if (file.substring(file.length-3, file.length) !== '.md') {
        throw new Error("file format not valid!");
    }

    addPost(type, file, title);
}

readCommandLine();