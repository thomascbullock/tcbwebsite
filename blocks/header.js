function header(inKeywords) {
  return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charset="utf8">
        <meta keywords="${inKeywords}">
        <meta author="Thom Bullock">
        <title>T.</title>
        <link rel="stylesheet" href="reset.css" />
        <link rel="stylesheet" href="scratch.css" />
    </head>
    <body>
        <header id="heading">
                <h1><a href="/"><img src="./images/logo.jpg"></a></h1>
            <nav>
                <a href="/long">Long</a>
                <a href="/short">Short</a>
                <a href="/photo">Photo</a>
                <a href="/link">Link</a>
                <a href="/about">About</a>
            </nav>
        </header>`;
}
module.exports = header;
