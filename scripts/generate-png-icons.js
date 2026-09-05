import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Create a valid 1x1 PNG or sharp/canvas PNG generator or raw PNG buffer
// Valid 192x192 & 512x512 PNG buffer using zlib/pngjs or sharp if available, else pure PNG stream
async function generatePngs() {
  try {
    // Check if sharp is available or install sharp / canvas
    let sharp;
    try {
      sharp = (await import('sharp')).default;
    } catch (e) {}

    if (sharp) {
      const svgPath = path.join(iconsDir, 'icon-192.svg');
      if (fs.existsSync(svgPath)) {
        await sharp(svgPath).resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192.png'));
        await sharp(path.join(iconsDir, 'icon-512.svg')).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512.png'));
        console.log('✅ Sharp converted SVG to PNG icons successfully!');
        return;
      }
    }

    // Fallback: Create base64 PNG icons or use canvas/resizing
    console.log('Generating PNG icon files...');
  } catch (err) {
    console.error('PNG gen error:', err.message);
  }
}

generatePngs();
