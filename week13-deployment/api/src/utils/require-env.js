// Reads an environment variable the app can't run without. When it is missing, the process stops
// with a message that says how to fix it. There is no fallback value on purpose: a default secret
// or connection string would let a misconfigured server start and look like it works.
export function requireEnv(name, hint = 'Copy .env.example to .env and fill it in.') {
  const value = process.env[name];
  if (!value) {
    console.error(`${name} is not set. ${hint}`);
    process.exit(1);
  }
  return value;
}
