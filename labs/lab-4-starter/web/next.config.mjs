const apiOrigin = process.env.API_ORIGIN ?? 'http://localhost:4000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stops `next dev` from writing AGENTS.md and CLAUDE.md (instructions for AI coding tools) into the project.
  agentRules: false,

  // The browser calls /api/... on the Next.js server, which forwards the request
  // to Express. The browser never talks to port 4000 directly, so there is no
  // CORS setup, and cookies set by the API stay first-party.
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiOrigin}/api/:path*` }];
  },
};

export default nextConfig;
