import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate high quality SVG icons
const getSvg = (size, isMaskable = false) => {
  const rx = isMaskable ? 0 : Math.round(size * 0.22);
  const strokeW = Math.max(3, Math.round(size * 0.06));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="vlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb7185" />
      <stop offset="50%" stop-color="#e15b70" />
      <stop offset="100%" stop-color="#9f1239" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="${size * 0.04}" stdDeviation="${size * 0.03}" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" rx="${rx}" fill="url(#vlGrad)"/>
  <g filter="url(#shadow)" transform="translate(${size * 0.2}, ${size * 0.2}) scale(${size / 100 * 0.6})">
    <path d="M10 20 L50 85 L90 20" fill="none" stroke="#ffffff" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 20 L50 55 L70 20" fill="none" stroke="#ffe4e6" stroke-width="${strokeW * 0.8}" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="15" r="7" fill="#ffffff" />
  </g>
</svg>`;
};

fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), getSvg(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), getSvg(512));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192.svg'), getSvg(192, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.svg'), getSvg(512, true));

// Create fallback PNG data-uri wrappers or standard SVG file references
console.log('✅ PWA Icons generated successfully!');
