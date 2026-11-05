/** Official DeepSeek Chat Completions vendor parameter. The JS SDK sends this
 * at the JSON body's top level (Python's extra_body is an SDK-specific wrapper). */
export function deepSeekParameters(env: Record<string, string | undefined> = process.env) {
  const model = env.DEEPSEEK_MODEL ?? "deepseek-flash";
  if (!/^deepseek-[a-z0-9.-]+$/.test(model)) throw Error("Invalid DEEPSEEK_MODEL");
  return { model, thinking: { type: "disabled" as const } };
}
