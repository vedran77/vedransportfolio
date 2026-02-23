const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Desktop screenshot - Homepage with Blog button
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: '/tmp/home-desktop.png', fullPage: false });
  console.log('✓ Home desktop');
  
  // Blog page desktop
  await page.goto('http://localhost:3001/blog', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: '/tmp/blog-desktop.png', fullPage: false });
  console.log('✓ Blog desktop');
  
  // Mobile screenshot - Homepage
  await page.setViewport({ width: 390, height: 844 }); // iPhone 14 size
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: '/tmp/home-mobile.png', fullPage: false });
  console.log('✓ Home mobile');
  
  // Blog page mobile
  await page.goto('http://localhost:3001/blog', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: '/tmp/blog-mobile.png', fullPage: false });
  console.log('✓ Blog mobile');
  
  await browser.close();
  console.log('Done!');
})();
