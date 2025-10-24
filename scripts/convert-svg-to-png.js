/**
 * SVGアイコンをPNGに変換
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

async function convertSVGtoPNG() {
  console.log('🎨 Converting SVG icons to PNG...\n');

  for (const size of sizes) {
    const svgFile = path.join(iconsDir, `icon-${size}x${size}.svg`);
    const pngFile = path.join(iconsDir, `icon-${size}x${size}.png`);

    try {
      await sharp(svgFile)
        .resize(size, size)
        .png()
        .toFile(pngFile);

      console.log(`✓ Converted: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to convert icon-${size}x${size}.svg:`, error.message);
    }
  }

  console.log('\n✅ All icons converted successfully!');
  console.log('📁 Icons location: public/icons/');
}

convertSVGtoPNG().catch(console.error);
