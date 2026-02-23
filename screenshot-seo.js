const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Dark mode
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  
  // Article page with new SEO components
  await page.setViewport({ width: 1280, height: 1600 });
  await page.goto('http://localhost:3001/blog/digitalocean-review-2026', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: '/tmp/article-seo-dark.png' });
  console.log('✓ Article with SEO components');
  
  // Mobile view
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: '/tmp/article-seo-mobile.png' });
  console.log('✓ Article mobile');
  
  await browser.close();
  console.log('Done!');
})();
