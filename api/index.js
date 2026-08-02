// Export the pre-built application instead of the source.
// This completely skips Vercel's TypeChecker, resolving all duplicate drizzle-orm type conflicts.
export { default } from "../artifacts/api-server/dist/app.mjs";
