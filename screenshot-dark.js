const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable dark mode
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  
  // Desktop dark mode
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: '/tmp/home-dark.png' });
  
  await page.goto('http://localhost:3001/blog', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: '/tmp/blog-dark.png' });
  
  await page.goto('http://localhost:3001/blog/digitalocean-review-2026', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: '/tmp/article-dark.png', fullPage: true });
  
  await browser.close();
  console.log('Dark mode screenshots done!');
})();
