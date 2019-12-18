const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');
const md = require('markdown-it')();

class Page {
  constructor(inPage) {
    this.title = inPage.title;
    this.bodyBag = inPage.bodyBag;
    this.footerPrevious = inPage.footerPrevious;
    this.footerNext = inPage.footerNext;
    this.fileName = inPage.fileName;
    this.fileDir = inPage.fileDir;
  }

  makePage() {
    return `<!DOCTYPE html>
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="css/reset.css" />
                <link rel="stylesheet" href="css/style.css" />
                <title>${this.title}</title>
            </head>
            <body>
                <header id="heading">
                        <h1><a href="/"><img src="./img/logo.jpg"></a></h1>
                    <nav>
                        <a href="/long">Long</a>
                        <a href="/short">Short</a>
                        <a href="/photo">Photo</a>
                        <a href="/about">About</a>
                    </nav>
                </header>${this.bodyBuilder()}    <footer id="footer">
                <nav>
                    <a href="/${this.footerPrevious}">Previous</a>
                    <a href="/archive">Archive</a>
                    <a href="/${this.footerNext}">Next</a>
                </nav>
            </footer>    
            </body>
        </html>`;
  }

  async savePage() {
    await fs.ensureDir(this.fileDir);
    await fs.writeFile(path.join(this.fileDir, `${this.fileName}.html`), this.makePage());
  }

  bodyBuilder() {
    let body = '';
    for (let bodyCount = 0; bodyCount < this.bodyBag.length; bodyCount++) {
      const readableDate = new moment(this.bodyBag[bodyCount].dateTime).format('MMMM Do YYYY');
      const singleBody = `<article><h1>${this.bodyBag[bodyCount].title}</h1><p class="date-time">
            <time datetime="${this.bodyBag[bodyCount].dateTime}" pubdate="pubdate">${readableDate}</time></p>${md.render(this.bodyBag[bodyCount].body)}</article>`;
      body += singleBody;
    }
    return body;
  }
}

module.exports = Page;
