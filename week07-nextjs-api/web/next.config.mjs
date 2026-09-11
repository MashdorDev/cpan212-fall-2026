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
    ];
  },
};

export default nextConfig;
