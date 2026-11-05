export const DEFAULT_SEASON_PASS = { priceFen: 39_900, months: 3 } as const;

function positiveInteger(value: string | undefined, fallback: number, max: number, name: string) {
  if (value === undefined) return fallback;
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) > max) throw Error(`Invalid ${name}`);
  return Number(value);
}

/** Server reads only. Checkout must snapshot this offer into its own order. */
export function seasonPassOffer(env: Record<string, string | undefined> = process.env) {
  return {
    priceFen: positiveInteger(env.SEASON_PASS_PRICE_FEN, DEFAULT_SEASON_PASS.priceFen, 10_000_000, "SEASON_PASS_PRICE_FEN"),
    months: positiveInteger(env.SEASON_PASS_MONTHS, DEFAULT_SEASON_PASS.months, 36, "SEASON_PASS_MONTHS"),
  };
}
