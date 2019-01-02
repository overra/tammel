const { getId } = require("./utils");
const { getScreenshot } = require("./chromium");

module.exports = async function(req, res) {
  const id = getId(req);
  if (id === "favicon.ico") return send(res, 404);

  try {
    const url = `https://${req.headers.host}/${id}?capture`;
    const file = await getScreenshot(url, "jpeg");
    res.statusCode = 200;
    res.setHeader("Content-Type", "image/jpeg");
    res.end(file);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Server Error</h1><p>Sorry, there was a problem</p>");
    console.error(e.message);
  }
};
