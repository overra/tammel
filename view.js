const { send } = require('micro')
const uuid = require('uuid/v4')
const { 
  encodeHtmlEntities, 
  getJson, 
  getId, 
  languageScript,
  pre,
  code,
  template
} = require('./utils')

module.exports = async (req, res) => {
  const id = getId(req)
  if (id === 'favicon.ico') return send(res, 404)
  try {
    const result = await getJson('https://api.github.com/gists/' + id)
    const languages = []
    const source = Object.entries(result.files)
      .reduce((source, [name, {content, language}]) => {
        const lang = language.toLowerCase()
        languages.push(languageScript(lang))
        return source + pre(code(name, encodeHtmlEntities(content), lang))
      }, '')
    
    send(res, 200, template(languages, source))
  } catch (err) {
    const code = uuid()
    console.error(code)
    console.error(err)
    send(res, 500, `<h1>😬 something unexpected happened</h1><small>${code}`)
  }
}