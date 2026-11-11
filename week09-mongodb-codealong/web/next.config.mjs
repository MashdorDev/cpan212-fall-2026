// Where the Express API runs. The value comes from web/.env.
let API_ORIGIN = process.env.API_ORIGIN;
if (!API_ORIGIN) {
  API_ORIGIN = 'http://localhost:4000';
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stops `next dev` from writing AGENTS.md and CLAUDE.md (instructions for AI coding tools) into the project.
  agentRules: false,

  // The browser only talks to Next.js on port 3000. When it asks for /api/events,
  // the Next.js server passes the request on to the Express API on port 4000.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: API_ORIGIN + '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
