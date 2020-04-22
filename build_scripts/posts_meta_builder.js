const md = require('markdown-it')();
const fm = require('markdown-it-front-matter');
const fs = require('fs-extra');
const path = require('path');
const promisify = require('util').promisify;
const gm = require('gray-matter');

class PostFromFile {
    constructor(inFile){
        this.path = inFile;
    }

    async readPost(){
        const post = await fs.readFile(this.path);
        const postString = post.toString();
        const postJson = gm(postString);
        this.metadata = postJson.data;
        const renderedMD = md.render(postJson.content);
        const postDate = new Date(this.metadata.dateTime);
        if (postDate > Date.now()) {
            return 'not yet';
        }
        const postyr = postDate.getFullYear();
        const postmm = parseInt(postDate.getMonth()) + 1;
        const postdd = postDate.getDate();
        if (!this.metadata.slug) {
            this.metadata.slug = this.metadata.title.replace(/\s+/g, '-').toLowerCase();
        }
        return {
            dateTime: this.metadata.dateTime,
            title: this.metadata.title,
            type: this.metadata.type,
            body: renderedMD,
            path: `${postyr}/${postmm}/${postdd}`,
            slug: this.metadata.slug
        }
    }
}

class MetaBuilder {
    constructor(inDir){
        this.dir = inDir;
        this.metaArr = [];
    }
    async build(){
        for (const file of fs.readdirSync(this.dir)) {
            if (file.toString()[0] !== '.') {
            const postFromFile = new PostFromFile(path.join(this.dir, file));
            const postJson = await postFromFile.readPost();
            if (postJson !== 'not yet') {
            this.metaArr.push(postJson);
            }
          }
        }
          return this.metaArr;
    }
}

module.exports = MetaBuilder;

