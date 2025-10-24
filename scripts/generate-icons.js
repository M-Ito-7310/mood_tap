/**
 * PWAアイコン生成スクリプト
 * シンプルなプレースホルダーアイコンを各サイズで生成
 */

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// iconsディレクトリが存在することを確認
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 各サイズのSVGアイコンを生成
sizes.forEach(size => {
  const svg = generateSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);

  fs.writeFileSync(filepath, svg);
  console.log(`✓ Generated: ${filename}`);
});

console.log('\n📝 Note: SVG files have been generated as placeholders.');
console.log('For production, convert these to PNG using:');
console.log('  - https://www.pwabuilder.com/imageGenerator');
console.log('  - https://realfavicongenerator.net/');
console.log('  - Or use ImageMagick/Sharp for batch conversion\n');

function generateSVGIcon(size) {
  const center = size / 2;
  const radius = size * 0.4;
  const eyeRadius = size * 0.05;
  const eyeOffsetX = size * 0.12;
  const eyeOffsetY = size * 0.1;

  // スマイル曲線のパス
  const smileY = center + size * 0.05;
  const smileWidth = size * 0.25;
  const smileHeight = size * 0.1;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- グラデーション背景 -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- 背景円 -->
  <circle cx="${center}" cy="${center}" r="${radius}" fill="url(#gradient)"/>

  <!-- 顔のベース（白い円） -->
  <circle cx="${center}" cy="${center}" r="${radius * 0.85}" fill="white" opacity="0.95"/>

  <!-- 左目 -->
  <circle cx="${center - eyeOffsetX}" cy="${center - eyeOffsetY}" r="${eyeRadius}" fill="#3B82F6"/>

  <!-- 右目 -->
  <circle cx="${center + eyeOffsetX}" cy="${center - eyeOffsetY}" r="${eyeRadius}" fill="#3B82F6"/>

  <!-- スマイル -->
  <path d="M ${center - smileWidth} ${smileY} Q ${center} ${smileY + smileHeight} ${center + smileWidth} ${smileY}"
        stroke="#3B82F6"
        stroke-width="${size * 0.03}"
        fill="none"
        stroke-linecap="round"/>
</svg>`;
}
