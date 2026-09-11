# HTTPS on your computer, and why the app has no HTTPS code

Checked against the mkcert README (https://github.com/FiloSottile/mkcert, release 1.4.4) and the Next.js 16.3 CLI docs on 2026-09-11.

## Who handles HTTPS in production

When you deploy in Week 13, you don't write any HTTPS code. Render and Vercel each hold a certificate for your site, accept the HTTPS connection from the browser, decrypt it, and pass the request to your app over their own network as plain HTTP. This is called TLS termination.

```
Browser ==HTTPS==> Vercel (certificate for your-app.vercel.app) --rewrite--> Render load balancer (HTTPS ends here) --HTTP--> Express on PORT
```

That is why `src/server.js` still calls `app.listen(port)` with no certificate. Two settings make Express work correctly behind that proxy:

- `TRUST_PROXY=1`, so `req.secure` is true when the browser used HTTPS (the proxy says so in the `X-Forwarded-Proto` header). express-session refuses to send a `Secure` cookie over what looks like plain HTTP.
- `NODE_ENV=production`, so the session cookie gets the `Secure` flag and helmet sends `upgrade-insecure-requests`.

Helmet also sends `Strict-Transport-Security` (HSTS), which tells the browser to use only HTTPS for your site for the next year. Browsers ignore that header on plain `http://localhost`, so it does no harm in development.

## Do you need HTTPS locally?

Usually not. Browsers treat `http://localhost` as a secure context, so cookies, `crypto.subtle` and service workers already work. Local HTTPS is worth setting up when you want to test something that only happens over HTTPS:

- a cookie with the `Secure` flag, or with `SameSite=None` (which requires `Secure`)
- HSTS or `upgrade-insecure-requests`
- mixed content warnings (an https page loading an http image)

A self-signed certificate made with `openssl` works, but every browser shows a full-page warning for it, and browsers ignore HSTS when there is a certificate error. mkcert fixes that: it creates your own local certificate authority, tells your computer to trust it, and signs certificates for `localhost` with it. The browser then trusts the certificate and shows no warning.

## 1. Install mkcert

macOS (Homebrew):

```bash
brew install mkcert
brew install nss   # only if you use Firefox
```

Windows (Chocolatey, or Scoop). Run the terminal as Administrator if you get a permission error:

```powershell
choco install mkcert
```

```powershell
scoop bucket add extras
scoop install mkcert
```

Linux: install `certutil` first, then mkcert from the prebuilt binary (or `brew install mkcert` if you use Homebrew on Linux):

```bash
sudo apt install libnss3-tools          # Debian and Ubuntu; Fedora: sudo yum install nss-tools
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert
```

## 2. Create the local certificate authority

```bash
mkcert -install
```

This creates a root certificate and adds it to your system's trust store (and Firefox's, on macOS and Linux). You only do it once per computer. `mkcert -CAROOT` prints the folder it lives in.

That folder also contains `rootCA-key.pem`. Anyone with that file can create certificates your computer trusts for any website, including your bank's. Never share it, never commit it, and never copy it to another machine.

## 3. Create a certificate for localhost

From the `api` folder:

```bash
mkcert localhost 127.0.0.1 ::1
```

mkcert prints the names of the two files it wrote, so use the names it prints. For these three names they are usually `localhost+2.pem` (the certificate) and `localhost+2-key.pem` (the private key). Keep both out of Git: add `*.pem` to `.gitignore`.

## 4. Try the API over HTTPS

This is a throwaway test script, not a change to the app. Save it as `https-test.js` in the `api` folder:

```js
import { readFileSync } from 'node:fs';
import { createServer } from 'node:https';
import { app } from './src/app.js';
import { connectDb } from './src/db.js';

await connectDb();

const options = {
  key: readFileSync('localhost+2-key.pem'),
  cert: readFileSync('localhost+2.pem'),
};

createServer(options, app).listen(4443, () => {
  console.log('Campus Events API on https://localhost:4443');
});
```

```bash
node --env-file=.env https-test.js
```

Open https://localhost:4443/api/health. The browser loads it with no certificate warning. Delete the script (and the `.pem` files if you don't need them) when you're done.

Node itself doesn't use your system's trust store. If a Node program, such as a Next.js Server Component, calls this HTTPS server, tell Node about the mkcert root:

```bash
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
```

## 5. Next.js dev server over HTTPS

The Next.js dev server can do all of this for you:

```bash
npx next dev --experimental-https
```

It downloads mkcert, creates a certificate for `localhost`, and saves it in a `certificates/` folder that it adds to `.gitignore`. The app is then on https://localhost:3000. Use it only for development. In production, Vercel handles HTTPS.
