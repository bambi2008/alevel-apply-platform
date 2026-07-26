import path from "node:path";

const PLACEHOLDERS = new Set([
  "change-me",
  "change-me-in-production",
  "replace-me",
  "secret",
  "password",
]);

function overlaps(first, second) {
  const relative = path.relative(first, second);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function validateProductionEnv(env = process.env) {
  const errors = [];
  const warnings = [];
  const required = ["DATABASE_URL", "AUTH_SECRET", "APP_ORIGIN", "STORAGE_DRIVER"];

  for (const key of required) {
    if (!env[key]?.trim()) errors.push(`${key} is required`);
  }

  const secret = env.AUTH_SECRET?.trim() ?? "";
  if (secret.length < 32 || PLACEHOLDERS.has(secret.toLowerCase())) {
    errors.push("AUTH_SECRET must be a non-placeholder value with at least 32 characters");
  }

  if (env.APP_ORIGIN) {
    try {
      const origin = new URL(env.APP_ORIGIN);
      if (origin.pathname !== "/" || origin.search || origin.hash) errors.push("APP_ORIGIN must contain only scheme and host");
      if (origin.protocol !== "https:" && env.ALLOW_HTTP_PRODUCTION !== "true") errors.push("APP_ORIGIN must use https");
    } catch {
      errors.push("APP_ORIGIN must be a valid absolute URL");
    }
  }

  if (env.DATABASE_URL) {
    try {
      const database = new URL(env.DATABASE_URL);
      if (!["postgres:", "postgresql:"].includes(database.protocol)) errors.push("DATABASE_URL must use PostgreSQL");
      if (!database.password) errors.push("DATABASE_URL must include a password");
      const privateHosts = new Set(["postgres", "db"]);
      const hasTls = ["require", "verify-ca", "verify-full"].includes(database.searchParams.get("sslmode") ?? "");
      if (!privateHosts.has(database.hostname) && !hasTls && env.ALLOW_INSECURE_DATABASE !== "true") {
        errors.push("External DATABASE_URL must require TLS via sslmode=require or stronger");
      }
    } catch {
      errors.push("DATABASE_URL must be a valid PostgreSQL URL");
    }
  }

  if (env.STORAGE_DRIVER === "local") {
    if (env.ALLOW_LOCAL_STORAGE_IN_PRODUCTION !== "true") {
      errors.push("Local production storage requires ALLOW_LOCAL_STORAGE_IN_PRODUCTION=true");
    }
    if (!env.LOCAL_STORAGE_PATH || !path.isAbsolute(env.LOCAL_STORAGE_PATH)) {
      errors.push("LOCAL_STORAGE_PATH must be an absolute persistent-volume path");
    }
    if (
      env.LOCAL_STORAGE_PATH
      && env.BACKUP_DIR
      && path.isAbsolute(env.LOCAL_STORAGE_PATH)
      && path.isAbsolute(env.BACKUP_DIR)
      && (overlaps(env.LOCAL_STORAGE_PATH, env.BACKUP_DIR) || overlaps(env.BACKUP_DIR, env.LOCAL_STORAGE_PATH))
    ) {
      errors.push("BACKUP_DIR and LOCAL_STORAGE_PATH must be separate, non-nested paths");
    }
  } else if (env.STORAGE_DRIVER && env.STORAGE_DRIVER !== "local") {
    errors.push(`Unsupported STORAGE_DRIVER: ${env.STORAGE_DRIVER}`);
  }

  if (env.REQUIRE_BACKUPS !== "false") {
    if (!env.BACKUP_DIR || !path.isAbsolute(env.BACKUP_DIR)) errors.push("BACKUP_DIR must be an absolute path");
    const encryptionKey = env.BACKUP_ENCRYPTION_KEY ?? "";
    let keyBytes = 0;
    try {
      keyBytes = Buffer.from(encryptionKey, "base64").length;
    } catch {
      keyBytes = 0;
    }
    if (keyBytes !== 32) errors.push("BACKUP_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  }

  if (env.AI_ENABLED === "true" && !env.DEEPSEEK_API_KEY) errors.push("DEEPSEEK_API_KEY is required when AI_ENABLED=true");
  if (!env.SENTRY_DSN) warnings.push("SENTRY_DSN is not configured; external error alerting is disabled");
  if (env.REQUIRE_BACKUPS === "false") warnings.push("Backups are explicitly disabled");

  return { errors, warnings };
}
