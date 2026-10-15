// TODO (you): STEP 3a - replace this line with API_ORIGIN, the same 4 lines as in lib/events.js.

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stops `next dev` from writing AGENTS.md and CLAUDE.md (instructions for AI coding tools) into the project.
  agentRules: false,

  // TODO (you): STEP 3b - replace this line with the rewrites() function that sends /api/... on to the API.
};

export default nextConfig;
