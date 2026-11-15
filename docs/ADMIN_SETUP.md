# Admin setup (one time)

The dashboard is at `/admin` and is only available to the admin account.
**No password is stored in this repository or in the site code.** The password lives only in Firebase Authentication.

1. Create a Firebase project (https://console.firebase.google.com) and add a **Web app**. Copy its config values.
2. In Vercel → Project → Settings → Environment Variables, add the `VITE_FIREBASE_*` values from `.env.example`, then redeploy.
3. Firebase Console → **Authentication** → Sign-in method → enable **Email/Password**.
4. Authentication → **Users** → **Add user**: email `yznshat@gmail.com` and your chosen password.
   Do this **before** the site goes public, so nobody else can register that email.
5. **Firestore Database** → create database → **Rules** tab → paste `firestore.rules` → Publish.
6. **Storage** → get started → **Rules** tab → paste `storage.rules` → Publish.
7. Open `/auth` on your site, sign in with the admin account: you are redirected to `/admin`.

The `/admin` link is not shown anywhere on the public site; open it by typing the address.
If the password was ever shared in chat or messages, change it from Firebase Console → Authentication → Users → (⋮) → Reset password.
