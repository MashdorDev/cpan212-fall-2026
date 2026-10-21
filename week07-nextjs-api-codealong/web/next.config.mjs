// TODO STEP 3a: where the API runs (same 4 lines as in lib/events.js).
// Delete these TODO lines and type:
//
//   let API_ORIGIN = process.env.API_ORIGIN;
//   if (!API_ORIGIN) {
//     API_ORIGIN = 'http://localhost:4000';
//   }

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stops `next dev` from writing AGENTS.md and CLAUDE.md (instructions for AI coding tools) into the project.
  agentRules: false,

  // TODO STEP 3b: the rewrite.
  // Why: code in the browser calls /api/events on port 3000. This passes it on to the API on port 4000,
  // so the browser never talks to port 4000 and you don't need CORS.
  // Delete these TODO lines and type:
  //
  //   async rewrites() {
  //     return [
  //       {
  //         source: '/api/:path*',
  //         destination: API_ORIGIN + '/api/:path*',
  //       },
  //     ];
  //   },
  //
  // Check: stop npm run dev (Ctrl+C), start it again, then open http://localhost:3000/api/events.
  // You see the API's JSON on port 3000.
};

export default nextConfig;
