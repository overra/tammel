const { parse: parseUrl } = require("url");
const fetch = require("isomorphic-unfetch");

const isCapture = url => parseUrl(url).query === "capture";
const getMetadata = (req, gist) => {
  if (isCapture(req.url)) return;
  const screenshot = `https://${req.headers.host}/c/${getId(req)}`;
  return `
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@github" />
    <meta property="og:url" content="${gist.html_url}" />
    <meta property="og:title" content="${gist.owner.login}'s gist" />
    <meta property="og:description" content="${gist.description}" />
    <meta property="og:image" content="${screenshot}" />
  `;
};
const getJson = url => fetch(url).then(res => res.json());
const getId = req =>
  parseUrl(req.url)
    .pathname.split("/")
    .pop();
const languageScript = l => `
  <script src="https://unpkg.com/prismjs@1.15.0/components/prism-${l}.min.js">
  </script>
`;
const pre = c => `<pre>${c}</pre>`;
const code = (name, c, lang = "js") =>
  `<code class="language-${lang}" data-name="${name}">${c}</code>`;

const template = (languages, body, meta = "") => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${meta}
    <link rel="stylesheet" href="/style.css" />
    <link 
      rel="stylesheet" 
      href="https://fonts.googleapis.com/css?family=Roboto+Mono"
    />
    <link 
      rel="stylesheet" 
      href="https://unpkg.com/prism-themes@1.0.1/themes/prism-duotone-space.css" 
    />
    <script src="https://unpkg.com/prismjs@1.15.0/prism.js"></script>
    ${languages.join("\n")}
  </head>
  <body>
    ${body}
  </body>
</html>
`;

// encode html entities
const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };
const replaceTag = tag => entities[tag] || tag;
const encodeHtmlEntities = str => str.replace(/[&<>]/g, replaceTag);

module.exports = {
  getMetadata,
  getJson,
  getId,
  languageScript,
  pre,
  code,
  template,
  encodeHtmlEntities
};
