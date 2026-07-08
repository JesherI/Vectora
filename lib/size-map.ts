// ── Central size map for all output files ──
// Matches by filename (exact or includes). First match wins.
// Some names (background.png) differ by framework; use framework-aware override.

const SIZE_MAP: [string, number][] = [
  // Favicons
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['favicon-48x48.png', 48],
  ['favicon-96x96.png', 96],
  ['favicon.ico', 32],
  ['favicon.png', 32],

  // Android / PWA
  ['android-chrome-192x192.png', 192],
  ['android-chrome-512x512.png', 512],
  ['maskable_icon.png', 512],
  ['adaptive-icon.png', 1024],
  ['ic_launcher_round.png', 192],
  ['ic_launcher.png', 192],

  // Apple touch icons
  ['apple-touch-icon-180x180.png', 180],
  ['apple-touch-icon-167x167.png', 167],
  ['apple-touch-icon-152x152.png', 152],
  ['apple-touch-icon-144x144.png', 144],
  ['apple-touch-icon-120x120.png', 120],
  ['apple-touch-icon-114x114.png', 114],
  ['apple-touch-icon-76x76.png', 76],
  ['apple-touch-icon-72x72.png', 72],
  ['apple-touch-icon-60x60.png', 60],
  ['apple-touch-icon-57x57.png', 57],
  ['apple-touch-icon.png', 180],

  // Windows Square logos
  ['Square310x310Logo.png', 310],
  ['Square284x284Logo.png', 284],
  ['Square150x150Logo.png', 150],
  ['Square142x142Logo.png', 142],
  ['Square107x107Logo.png', 107],
  ['Square89x89Logo.png', 89],
  ['Square71x71Logo.png', 71],
  ['Square44x44Logo.png', 44],
  ['Square30x30Logo.png', 30],
  ['StoreLogo.png', 50],

  // Desktop PNG sizes (generic)
  ['16x16.png', 16],
  ['24x24.png', 24],
  ['32x32.png', 32],
  ['48x48.png', 48],
  ['64x64.png', 64],
  ['96x96.png', 96],
  ['128x128@2x.png', 256],
  ['128x128.png', 128],
  ['256x256@2x.png', 512],
  ['256x256.png', 256],
  ['512x512@2x.png', 1024],
  ['512x512.png', 512],

  // iOS AppIcon sizes
  ['icon-20.png', 20],
  ['icon-29.png', 29],
  ['icon-40.png', 40],
  ['icon-58.png', 58],
  ['icon-60.png', 60],
  ['icon-76.png', 76],
  ['icon-80.png', 80],
  ['icon-83.5.png', 83],
  ['icon-87.png', 87],
  ['icon-120.png', 120],
  ['icon-152.png', 152],
  ['icon-167.png', 167],
  ['icon-180.png', 180],
  ['icon-192.png', 192],
  ['icon-256.png', 256],
  ['icon-512.png', 512],
  ['icon-1024.png', 1024],

  // Splash
  ['splash.png', 1284],

  // Expo
  ['icon-only.png', 1024],

  // Play Store
  ['playstore-icon.png', 512],

  // App Store
  ['appstore.png', 1024],
  ['AppStore.png', 1024],
  ['marketing-icon.png', 1024],

  // Foreground / background (Android adaptive)
  ['foreground.png', 1024],
  ['icon-background.png', 1024],
  ['icon-foreground.png', 1024],

  // Electron DMG backgrounds (non-square; convert.ts uses bgSize for actual w/h)
  ['background@2x.png', 1080],
  ['background.png', 540],

  // Fallback icon
  ['icon.png', 512],
  ['icon.icns', 1024],
  ['icon.ico', 256],
];

const EXACT_MATCH: Record<string, number> = {};
const PREFIX_MATCH: [string, number][] = [];

for (const [key, size] of SIZE_MAP) {
  if (key.includes('*')) {
    PREFIX_MATCH.push([key.replace('*', ''), size]);
  } else {
    EXACT_MATCH[key] = size;
  }
}

// Framework-aware overrides — some filenames have different sizes per platform
// Electron: background.png = 540 (DMG). Other frameworks: background.png = 1024 (Android adaptive)
const FW_OVERRIDES: Record<string, Record<string, number>> = {
  electron: { 'background.png': 540, 'background@2x.png': 1080 },
};

export function sizeForFile(filename: string, fwId?: string): number {
  // Framework override takes precedence
  if (fwId && FW_OVERRIDES[fwId]?.[filename] !== undefined) {
    return FW_OVERRIDES[fwId][filename];
  }

  // 1. Exact match
  if (filename in EXACT_MATCH) return EXACT_MATCH[filename];

  // 2. NxN pattern (e.g. "icon-180.png", "logo_256x256.png")
  const dimMatch = filename.match(/(\d+)x(\d+)/);
  if (dimMatch) return parseInt(dimMatch[1]);

  // 3. Number-in-filename heuristic
  const numMatch = filename.match(/(\d{2,4})/);
  if (numMatch) {
    const n = parseInt(numMatch[1]);
    if (n >= 16 && n <= 2048) return n;
  }

  // 4. Prefix match
  for (const [prefix, size] of PREFIX_MATCH) {
    if (filename.startsWith(prefix)) return size;
  }

  return 1024; // fallback
}