const fetch = require('isomorphic-unfetch')
const getJson = url => fetch(url).then(res => res.json())
const getId = req => req.url.split('/').pop()
const languageScript = l => `
  <script src="https://unpkg.com/prismjs@1.15.0/components/prism-${l}.min.js">
  </script>
`
const pre = c => `<pre>${c}</pre>`
const code = (name, c, lang = 'js') =>
  `<code class="language-${lang}" data-name="${name}">${c}</code>`

const template = (languages, body, meta = '') => `
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
    ${languages.join('\n')}
  </head>
  <body>
    ${body}
  </body>
</html>
`

// encode html entities
const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;'};
const replaceTag = tag => entities[tag] || tag
const encodeHtmlEntities = str => str.replace(/[&<>]/g, replaceTag)

module.exports = {
  encodeHtmlEntities,
  getJson,
  getId,
  languageScript,
  pre,
  code,
  template
}