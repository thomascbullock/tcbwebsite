const fs = require('fs-extra');

class Postmaster {
  constructor() {
    this.all = [];
    this.long = [];
    this.short = [];
    this.photo = [];
    this.link = [];
  }

  async add(inPostMeta) {
    const postObject = inPostMeta;
    const postBody = await fs.readFile(`./posts/${inPostMeta.file}`);
    postObject.body = postBody.toString();
    this.all.push(postObject);
    this[inPostMeta.type].push(postObject);
  }

  sort() {
    for (const postType of Object.entries(this)) {
      this[postType[0]].sort((post1, post2) => {
          const d1 = new Date(post1.date);
          console.log(d1);
          const d2 = new Date(post2.date);
          console.log(d2);
          return d2 - d1;
      });
    }
  }

  async build(inMeta) {
    const meta = inMeta;
    const postPromises = [];
    meta.posts.forEach((postMeta) => {
      postPromises.push(this.add(postMeta));
    });
    await Promise.all(postPromises);
    this.sort();
    console.log(this);
  }
}

module.exports = Postmaster;
