// Vercel sets VERCEL=1 during its builds. The rewrites below are written into the build output, so on Vercel
// API_ORIGIN has to be set before the build. Without it every /api request would go to localhost, which doesn't
// exist on Vercel's servers. Failing the build shows the problem in the build log instead of as broken pages.
if (process.env.VERCEL && !process.env.API_ORIGIN) {
  throw new Error('API_ORIGIN is not set. Add it under Environment Variables in the Vercel project settings, then redeploy.');
}

const API_ORIGIN = process.env.API_ORIGIN ?? 'http://localhost:4000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stops `next dev` from writing AGENTS.md and CLAUDE.md (instructions for AI coding tools) into the project.
  agentRules: false,

  // The browser only talks to Next.js. A request to /api/events on localhost:3000 is forwarded
  // by the Next.js server to the Express API, so the browser never makes a cross-origin request
  // and cookies set by the API stay first-party.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_ORIGIN}/api/:path*`,
      },
      // Images uploaded through the admin form are saved as /uploads/<file> on the API.
      // Forwarding the same path lets <img src="/uploads/..."> work on the Next.js site.
      {
        source: '/uploads/:path*',
        destination: `${API_ORIGIN}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
