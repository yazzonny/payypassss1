# PlayPass

Digital subscriptions and gaming credits store (React 19 + Vite, Firebase, Three.js).

## Run
```bash
npm install
npm run dev       # local dev (Local Demo Mode if no Firebase env)
npm run build     # production build
npm run lint
```

## Configuration
Copy `.env.example` to `.env.local` and fill in your Firebase values.
Without them the site runs in Local Demo Mode (localStorage). Demo mode never grants admin access in production builds.

## Deployment (Vercel)
`vercel.json` provides SPA rewrites (so `/catalog`, `/cart`... survive a refresh), security headers and long-term asset caching.
Set the `VITE_FIREBASE_*` variables in the Vercel project settings.

## Notes
- 3D effects live in `src/components/fx` (`Scene3D`, `Tilt`, `Reveal`) and respect `prefers-reduced-motion`.
- Admin access in the UI is derived on the client. Protect real data with Firestore security rules.
