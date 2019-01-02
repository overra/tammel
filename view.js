const { send } = require("micro");
const uuid = require("uuid/v4");
const {
  encodeHtmlEntities,
  getMetadata,
  getJson,
  getId,
  languageScript,
  pre,
  code,
  template
} = require("./utils");

module.exports = async (req, res) => {
  const id = getId(req);
  if (id === "favicon.ico") return send(res, 404);
  try {
    const gist = await getJson("https://api.github.com/gists/" + id);
    const languages = [];
    const meta = getMetadata(req, gist);
    const source = Object.entries(gist.files).reduce(
      (source, [name, { content, language }]) => {
        const lang = language.toLowerCase();
        languages.push(languageScript(lang));
        return source + pre(code(name, encodeHtmlEntities(content), lang));
      },
      ""
    );

    send(res, 200, template(languages, source, meta));
  } catch (err) {
    const code = uuid();
    console.error(code);
    console.error(err);
    send(res, 500, `<h1>😬 something unexpected happened</h1><small>${code}`);
  }
};
