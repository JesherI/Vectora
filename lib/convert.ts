import sharp from 'sharp';
import JSZip from 'jszip';
import pngToIco from 'png-to-ico';
import frameworks from '@/components/framework-data';
import { sizeForFile } from './size-map';

function isIco(filename: string) { return filename.endsWith('.ico'); }
function isIcns(filename: string) { return filename.endsWith('.icns'); }
function isPng(filename: string) { return filename.endsWith('.png'); }
function isSvg(filename: string) { return filename.endsWith('.svg'); }
function isWebmanifest(filename: string) { return filename.endsWith('.webmanifest'); }
function isJson(filename: string) { return filename.endsWith('.json'); }

// Electron DMG backgrounds: non-square
function bgSize(filename: string): { w: number; h: number } | null {
  if (filename === 'background.png') return { w: 540, h: 380 };
  if (filename === 'background@2x.png') return { w: 1080, h: 760 };
  return null;
}

export interface CustomAsset {
  size: number;
  format: 'png' | 'jpg' | 'ico';
  name: string;
}

export async function convertSvg(
  svgBuffer: Buffer,
  selectedIds: string[],
  custom: CustomAsset[],
  baseName: string,
): Promise<Uint8Array> {
  const zip = new JSZip();

  const selectedFrameworks = frameworks.filter(f => selectedIds.includes(f.id));

  for (const fw of selectedFrameworks) {
    for (const output of fw.outputs) {
      const size = sizeForFile(output, fw.id);
      const filename = output.replace(/\.png$/, `.png`); // already fine

      if (isWebmanifest(output)) {
        zip.file(`${baseName}/${fw.id}/${output}`, JSON.stringify({
          name: baseName,
          icons: [
            { src: `${baseName}-192x192.png`, sizes: '192x192', type: 'image/png' },
            { src: `${baseName}-512x512.png`, sizes: '512x512', type: 'image/png' },
          ],
        }, null, 2));
        continue;
      }

      if (isJson(output)) {
        // Contents.json for iOS AppIcon.appiconset
        const sizes = [
          { size: 20, scales: [1, 2, 3] },
          { size: 29, scales: [1, 2, 3] },
          { size: 40, scales: [1, 2, 3] },
          { size: 60, scales: [2, 3] },
          { size: 76, scales: [1, 2] },
          { size: 83.5, scales: [2] },
          { size: 1024, scales: [1] },
        ];
        const images: any[] = [];
        for (const s of sizes) {
          for (const scale of s.scales) {
            const px = Math.round(s.size * scale);
            images.push({
              filename: `icon-${px}.png`,
              idiom: px >= 1024 ? 'ios-marketing' : 'iphone',
              scale: `${scale}x`,
              size: `${s.size}x${s.size}`,
            });
          }
        }
        zip.file(`${baseName}/${fw.id}/ios/AppIcon.appiconset/Contents.json`, JSON.stringify({ images, info: { version: 1, author: 'vectora' } }, null, 2));
        continue;
      }

      if (isSvg(output)) {
        // Electron: icon.svg is the master SVG itself
        zip.file(`${baseName}/${fw.id}/${output}`, svgBuffer);
        continue;
      }

      if (isIco(output)) {
        realIco: {
          const pngBuf = await sharp(svgBuffer)
            .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toBuffer();
          try {
            const icoBuf = await pngToIco(pngBuf);
            zip.file(`${baseName}/${fw.id}/${output}`, icoBuf);
          } catch {
            // fallback: raw PNG renamed
            zip.file(`${baseName}/${fw.id}/${output}`, pngBuf);
          }
        }
        continue;
      }

      if (isIcns(output)) {
        // ICNS unsupported — deliver PNG with .icns extension
        // macOS users need iconutil or png2icons to convert
        const buf = await sharp(svgBuffer)
          .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        zip.file(`${baseName}/${fw.id}/${output}`, buf);
        continue;
      }

      if (isPng(output)) {
        const bg = bgSize(output);
        const resized = await sharp(svgBuffer)
          .resize(bg ? bg.w : size, bg ? bg.h : size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        zip.file(`${baseName}/${fw.id}/${output}`, resized);
      }
    }
  }

  // Custom assets
  if (custom.length > 0) {
    for (const asset of custom) {
      const { size, format, name } = asset;
      if (format === 'ico') {
        const pngBuf = await sharp(svgBuffer)
          .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        try {
          const icoBuf = await pngToIco(pngBuf);
          zip.file(`${baseName}/custom/${name}`, icoBuf);
        } catch {
          zip.file(`${baseName}/custom/${name}`, pngBuf);
        }
      } else {
        const fmt = format === 'jpg' ? 'jpeg' : format;
        const buf = await sharp(svgBuffer)
          .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          [fmt]()
          .toBuffer();
        zip.file(`${baseName}/custom/${name}`, buf);
      }
    }
  }

  return await zip.generateAsync({ type: 'uint8array' });
}