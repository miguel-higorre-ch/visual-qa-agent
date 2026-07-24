const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const BASELINE_URL = process.env.BASELINE_URL || 'http://localhost:3000';
const CURRENT_URL = process.env.CURRENT_URL || 'http://localhost:3001';

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const BASELINE_DIR = path.join(SCREENSHOTS_DIR, 'baseline');
const CURRENT_DIR = path.join(SCREENSHOTS_DIR, 'current');

// Viewport configurations for responsive testing
const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];

/**
 * Ensure screenshot directories exist
 */
function ensureDirectories() {
  [BASELINE_DIR, CURRENT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✓ Created directory: ${dir}`);
    }
  });
}

/**
 * Capture screenshot of a URL
 * @param {Browser} browser - Playwright browser instance
 * @param {string} url - URL to capture
 * @param {string} outputDir - Directory to save screenshot
 * @param {Object} viewport - Viewport configuration
 * @param {string} name - Screenshot name
 */
async function captureScreenshot(browser, url, outputDir, viewport, name) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  try {
    console.log(`📸 Capturing ${name} at ${viewport.name} (${viewport.width}x${viewport.height})...`);
    
    // Navigate to URL with timeout
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for page to be fully rendered
    await page.waitForTimeout(1000);
    
    // Capture screenshot
    const screenshotPath = path.join(outputDir, `${name}-${viewport.name}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: 'png'
    });
    
    console.log(`✓ Saved: ${screenshotPath}`);
    return screenshotPath;
  } catch (error) {
    console.error(`✗ Error capturing ${name} at ${viewport.name}:`, error.message);
    throw error;
  } finally {
    await context.close();
  }
}

/**
 * Capture all screenshots
 */
async function captureAll() {
  console.log('🚀 Visual QA Agent - Screenshot Capture\n');
  console.log(`Baseline URL: ${BASELINE_URL}`);
  console.log(`Current URL: ${CURRENT_URL}\n`);

  ensureDirectories();

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage']
  });

  try {
    const captureMode = process.argv[2];
    
    // Determine which screenshots to capture based on CLI argument
    const shouldCaptureBaseline = !captureMode || captureMode === '--baseline' || captureMode === '--all';
    const shouldCaptureCurrent = !captureMode || captureMode === '--current' || captureMode === '--all';

    let totalCaptured = 0;

    // Capture baseline screenshots
    if (shouldCaptureBaseline) {
      console.log('📋 Capturing BASELINE screenshots...\n');
      for (const viewport of VIEWPORTS) {
        await captureScreenshot(browser, BASELINE_URL, BASELINE_DIR, viewport, 'login-page');
        totalCaptured++;
      }
      console.log(`\n✓ Captured ${VIEWPORTS.length} baseline screenshots\n`);
    }

    // Capture current screenshots
    if (shouldCaptureCurrent) {
      console.log('📋 Capturing CURRENT screenshots...\n');
      for (const viewport of VIEWPORTS) {
        await captureScreenshot(browser, CURRENT_URL, CURRENT_DIR, viewport, 'login-page');
        totalCaptured++;
      }
      console.log(`\n✓ Captured ${VIEWPORTS.length} current screenshots\n`);
    }

    console.log(`\n🎉 Total screenshots captured: ${totalCaptured}`);
    console.log(`\n📁 Screenshots saved to:`);
    console.log(`   Baseline: ${BASELINE_DIR}`);
    console.log(`   Current: ${CURRENT_DIR}`);
    console.log(`\n💡 Next step: Run 'npm run upload' to upload to S3`);

  } catch (error) {
    console.error('\n❌ Capture failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

/**
 * Main execution
 */
(async () => {
  try {
    await captureAll();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
})();
