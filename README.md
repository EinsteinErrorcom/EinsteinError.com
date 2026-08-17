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

Defined in `app/globals.css` as `--font-base`. Page 6 document text uses `--font-mono` for WYSIWYG `.txt` rendering only.

`/font-compare.html` is a local dev reference for comparing alternative SaaS fonts — it does **not** affect the live site.

## Page 6 content editing

1. `npm run dev`
2. Edit at [http://localhost:3000/dev/page6-edit](http://localhost:3000/dev/page6-edit) or `content/page6.txt`
3. Preview at [http://localhost:3000/page6](http://localhost:3000/page6)

## Deploy

Deploy on [Vercel](https://vercel.com/new) or your preferred host. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
