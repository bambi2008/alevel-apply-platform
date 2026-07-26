import { validateProductionEnv } from "./production-env.mjs";

const result = validateProductionEnv(process.env);
for (const warning of result.warnings) console.warn(`[production:warning] ${warning}`);
if (result.errors.length) {
  for (const error of result.errors) console.error(`[production:error] ${error}`);
  process.exit(1);
}
console.log("[production] environment preflight passed");
