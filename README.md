<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JesherI/Vectora/main/public/Vectora-Negro.svg">
  <img alt="Vectora" src="https://raw.githubusercontent.com/JesherI/Vectora/main/public/Vectora-Negro.svg" width="400">
</picture>

**Vectora** — one SVG in, every icon you need out.

Drop an SVG logo. Pick your platforms. Download a ZIP with every icon sized, named, and formatted per that platform's exact spec. No manual cropping, no guessing resolutions, no hunting docs.

---

## ✦ How it works

```
1. Upload SVG   →   2. Select frameworks   →   3. Generate   →   4. Download ZIP
```

Vectora runs `sharp` on the server to resize your SVG to every exact pixel dimension each framework demands — 16×16 favicons, 1024×1024 App Store assets, 540×380 DMG backgrounds, multi-resolution `.ico` files, iOS `Contents.json` manifests, PWA `site.webmanifest` files. Everything lands in a ZIP, organized by framework and name.

---

## ✦ Supported platforms

**Web** — Next.js, React, Vue, Vite, Astro, Nuxt, SvelteKit, Angular  
**Mobile** — Expo, React Native, Flutter, Capacitor, Android, iOS  
**Desktop** — Tauri, Electron, Neutralino  
**Universal** — PWA, Windows, macOS, Linux  

21 frameworks total. Each has its own output list matching the framework's official icon conventions.

---

## ✦ What you get

For each selected framework, a folder named `[project-name]/[framework-id]/` containing:

- **Favicons** — `favicon.ico`, `favicon-16×16.png`, `favicon-32×32.png`, etc.
- **PWA manifests** — `site.webmanifest`, `apple-touch-icon.png`
- **Android** — `ic_launcher.png` at 5 mipmap densities, adaptive icons, round icons
- **iOS** — `AppIcon.appiconset/Contents.json` with all 17 sizes + scales
- **Expo/Capacitor** — adaptive icon layers, splash screens
- **Tauri** — 13 Square logos, StoreLogo, `.ico`, `.icns`
- **Electron** — master `icon.svg`, backgrounds (540×380 / 1080×760 for DMG), Linux `icons/` set
- **Flutter** — both iOS and Android asset trees
- **Windows/macOS/Linux** — platform-native formats

Need something custom? The Custom Builder floating panel lets you generate assets at any resolution (16–1024px) in PNG, JPG, or ICO format.

---

## ✦ Technical stack

- **Framework** — [Next.js](https://nextjs.org/) (App Router)
- **Image processing** — [sharp](https://sharp.pixelplumbing.com/) (server-side SVG→PNG)
- **ICO generation** — [png-to-ico](https://github.com/stephenmathieson/png-to-ico)
- **ZIP assembly** — [jszip](https://stuk.github.io/jszip/)
- **UI** — Tailwind v4 with Apple-style glassmorphism (`backdrop-blur-2xl`)
- **Background** — Custom WebGL shader (black background, red lines, no curvature)
- **TypeScript** — Strict mode, zero `any` or `@ts-ignore`

---

## ✦ Quick start

```bash
git clone https://github.com/JesherI/Vectora.git
cd vectora
pnpm install
pnpm dev        # → http://localhost:3000
pnpm run build  # production build
```

The app is a single-page converter at `/convert`. The home page (`/`) is a hero with the logo and shader background.

---

## ✦ Architecture

```
app/
├── page.tsx                 # Home hero (shader + logo)
├── convert/page.tsx        # Convert UI (glass panel + grid)
├── api/convert/route.ts    # POST /api/convert (multipart → ZIP)
├── layout.tsx              # Root layout + metadata
├── globals.css             # Tailwind + custom scrollbar
components/
├── vectora-app.tsx         # Main convert panel (drop zone, grid, modal)
├── framework-data.ts         # 21 framework definitions with exact outputs
├── custom-builder.tsx      # Floating modal for custom sizes
├── ui/shader-background.tsx # WebGL animated background
lib/
├── convert.ts              # sharp resize + ICO + ZIP assembly
├── size-map.ts             # Centralized size mapping (100+ entries)
```

Vectora processes everything server-side. The SVG is never sent to a third party — all resizing runs in the `sharp` pipeline on your Next.js server.

---

## ✦ Custom asset builder

The floating custom modal generates assets at any size from 16 to 1024 pixels. Supports:

- PNG (lossless)
- JPG (lossy compression for large assets)
- ICO (multi-resolution icon format)

Output lands in `[project-name]/custom/` inside the ZIP.

---

## ✦ Influences

A lot of icon tools exist. Most either generate a handful of common sizes or pipe your SVG through a template. Vectora instead maps _every_ file a given framework expects, at the exact size it expects, named precisely to the filename convention. There is no "close enough". If Electron wants `background.png` at 540×380, that is what you get.

---

Made with red on black.  
One SVG. All the icons.