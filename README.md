# Gamified Soccer — Ready for Vercel

Files from your uploaded project were merged with a minimal Vite + React + TypeScript + Tailwind setup.

## What I added
- package.json (scripts: dev, build, preview)
- vite.config.ts
- tsconfig.json
- index.html
- src/main.tsx
- src/App.tsx (placeholder)
- src/styles/globals.css
- tailwind.config.cjs
- postcss.config.cjs
- vercel.json
- README

Important: I did **not** overwrite any existing files in your upload. If your project already had `src/` assets and components, they are preserved.

## How to run locally
```bash
# install deps
npm install

# dev server
npm run dev

# build
npm run build

# preview
npm run preview
```

## Deploy to Vercel
1. Push this project to GitHub.
2. Create a new project in Vercel, connect the repo.
3. Vercel should auto-detect Vite. If not, set:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set any environment variables needed.

