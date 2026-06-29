# Huzhou Haode Import and Export Website

Full-stack bilingual textile export site for 湖州好德进出口有限公司 / Huzhou Haode Import and Export Co.,Ltd.

## Local Development

```bash
npm install
npm run dev
```

Open:

- Site: `http://127.0.0.1:3000`
- Admin: `http://127.0.0.1:3000/admin`

Local fallback admin password is `haode2026`. Set `ADMIN_PASSWORD` for production.

## Production Environment Variables

Set these in Vercel:

```env
DEEPSEEK_API_KEY=
DEEPSEEK_API_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
ADMIN_PASSWORD=
AUTH_SECRET=
GITHUB_TOKEN=
GITHUB_REPO=SuperGokou/haodeimexport
GITHUB_BRANCH=main
NEXT_PUBLIC_SITE_URL=
```

`GITHUB_TOKEN` lets the admin CMS persist product and company updates by committing `data/products.json` and `data/company.json` back to GitHub. Without it, local development can still write files, but Vercel runtime storage is not persistent.

## Content

- Product data: `data/products.json`
- Company and AI customer service context: `data/company.json`
- Temporary generated textile images: `public/images`

The customer can replace image URLs from `/admin` after final photography is ready.
