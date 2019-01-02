const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

async function getScreenshot(url, type, quality, fullPage) {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 900, height: 1080, deviceScaleFactor: 2 });
  await page.goto(url);
  await page.evaluateHandle("document.fonts.ready");
  const clip = await page.evaluate(() => {
    const el = document.querySelector("body");
    return {
      x: el.offsetLeft,
      y: el.offsetTop,
      width: el.clientWidth,
      height: el.clientWidth / 2
    };
  });
  const file = await page.screenshot({ type, quality, fullPage, clip });
  await browser.close();
  return file;
}

module.exports = {
  getScreenshot
};
