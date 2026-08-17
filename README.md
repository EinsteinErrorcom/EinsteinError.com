This is a [Next.js](https://nextjs.org) project for **MAX-LIT** (EinsteinError.com).

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Typography

The live app uses the **system font stack** (no custom web fonts loaded):

- **Apple (iPhone/Mac):** San Francisco via `-apple-system`
- **Windows:** Segoe UI
- **Android:** Roboto

Defined in `app/globals.css` as `--font-base`. Page 7 document text uses `--font-mono` for WYSIWYG `.txt` rendering only.

`/font-compare.html` is a local dev reference for comparing alternative SaaS fonts — it does **not** affect the live site.

## Page 7 content editing

1. `npm run dev`
2. Edit at [http://localhost:3000/dev/page7-edit](http://localhost:3000/dev/page7-edit) or `content/page7.txt`
3. Preview at [http://localhost:3000/page7](http://localhost:3000/page7)

## Deploy

Deploy on [Vercel](https://vercel.com/new) or your preferred host. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
