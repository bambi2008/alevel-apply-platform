export type RegistrationMode = "invite" | "open";

/** Server runtime setting. Missing or misspelled values fail closed. */
export function getRegistrationMode(): RegistrationMode {
  return process.env.REGISTRATION_MODE === "open" ? "open" : "invite";
}
