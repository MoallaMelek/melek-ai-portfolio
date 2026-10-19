# Melek Moalla — AI & Engineering Portfolio

Career portfolio showcasing Melek Moalla's AI, machine learning, and software engineering projects, with case studies, technical details, and interactive demonstrations.

**Live site:** https://melek-moalla.vercel.app

Built with Next.js, React, TypeScript, and CSS. The site exports static pages; project media and demonstration data are included.

## Run locally

Use Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## Build and check

```sh
npm run lint
npm run typecheck
npm run build
npm run preview
```

The build generates `out/`.

This project sets `output: "export"` in `next.config.ts`. Serve the generated files with `npm run preview` after building; `npm start` invokes `next start`, which is not the server for a static export. For deployment, publish the contents of `out/` to a static host, preserving the exported route directories.

 The preview runs at http://localhost:4173. No environment variables or API credentials are required for the portfolio.
