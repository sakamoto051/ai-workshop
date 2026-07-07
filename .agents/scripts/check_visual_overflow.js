const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const glob = require('glob'); // ensure glob is available or use a simple fs.readdirSync loop

(async () => {
  // Find all built HTML slides
  const htmlFiles = glob.sync('s*/*.html');
  
  if (htmlFiles.length === 0) {
    console.log('No HTML files found. Please run npm run slides:html first.');
    process.exit(1);
  }

  console.log(`Starting automated visual overflow check on ${htmlFiles.length} files...`);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  let totalErrors = 0;

  for (const file of htmlFiles) {
    const absolutePath = `file://${path.resolve(process.cwd(), file)}`;
    await page.goto(absolutePath, { waitUntil: 'networkidle' });

    // Evaluate in the browser context to find overflowing sections
    const errors = await page.evaluate(() => {
      const issues = [];
      const sections = document.querySelectorAll('section');
      
      sections.forEach((section, index) => {
        const slideNum = index + 1;
        // Marp sections usually have fixed dimensions (e.g. 1280x720)
        // If content inside exceeds this, scrollHeight will be greater than clientHeight
        if (section.scrollHeight > section.clientHeight) {
          issues.push(`Slide ${slideNum}: height overflow (scrollHeight: ${section.scrollHeight}, clientHeight: ${section.clientHeight})`);
        }
        
        // Also check if any child element extends beyond the section's bounding box
        const sectionRect = section.getBoundingClientRect();
        const children = section.querySelectorAll('*');
        for (const child of children) {
          const childRect = child.getBoundingClientRect();
          if (childRect.bottom > sectionRect.bottom) {
             // We only report if it's significantly overflowing (e.g., > 2px to ignore subpixel rendering artifacts)
             if (childRect.bottom - sectionRect.bottom > 2) {
               issues.push(`Slide ${slideNum}: element <${child.tagName.toLowerCase()}> overflows bottom boundary by ${Math.round(childRect.bottom - sectionRect.bottom)}px`);
               break; // only report once per slide to avoid spam
             }
          }
        }
      });
      return issues;
    });

    if (errors.length > 0) {
      console.log(`❌ ${file} has visual overflow issues:`);
      errors.forEach(err => console.log(`   - ${err}`));
      totalErrors += errors.length;
    } else {
      console.log(`✅ ${file} passed visual overflow check.`);
    }
  }

  await browser.close();

  if (totalErrors > 0) {
    console.error(`\n🚨 Automated self-review failed: Found ${totalErrors} visual layout issues!`);
    process.exit(1);
  } else {
    console.log('\n✨ Automated self-review passed: All slides fit within their boundaries perfectly!');
  }
})();
