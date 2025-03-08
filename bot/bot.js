// https://github.com/puppeteer/puppeteer/issues/5662#issuecomment-732076246
// sudo apt-get update
// sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
// sudo apt-get install -y libgbm-dev


const puppeteer = require("puppeteer");
const capture = async () => {
	const browser = await puppeteer.launch({
		headless: 'new',
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox'
		]
	});
	const page = await browser.newPage();
	await page.goto("https://www.microsoft.com/en-us/microsoft-365/roadmap?filters=");
	await page.waitForSelector("tr[data-feature-id='67161']"); 
	const tr = await page.$("tr[data-feature-id='67161']");
	const content = await page.$("tr[data-feature-id='67161']>td>.ow-col-content")
	content.class = "ow-col-content"
	const expandButton = await page.$("tr[data-feature-id='67161']>td>div>button");
	await expandButton.click();
	const contentBlock = await page.$("tr[data-feature-id='67161']>td>div.ow-col-content")
	contentBlock.display = "block"
	await new Promise(r => setTimeout(r, 1000));
	await tr.screenshot({ path: "./screenshot.png" });
	await browser.close();
};
capture();