import type { MatchCategory } from "@/lib/matching";

export interface PortfolioItem {
  category: MatchCategory;
  region: "UK" | "HK";
  universityId: string;
}

export interface PortfolioIssue {
  code: string;
  severity: "warning" | "critical";
  message: string;
}

export function analyzePortfolio(items: PortfolioItem[], targetRegions: Array<"UK" | "HK"> = ["UK", "HK"]) {
  const counts = { reach: 0, match: 0, safety: 0, out_of_reach: 0, UK: 0, HK: 0 };
  for (const item of items) { counts[item.category] += 1; counts[item.region] += 1; }
  const issues: PortfolioIssue[] = [];
  if (counts.UK > 5) issues.push({ code: "UCAS_LIMIT", severity: "critical", message: "UCAS 本科最多提交 5 个志愿。" });
  if (items.length > 0 && counts.safety === 0) issues.push({ code: "NO_SAFETY", severity: "warning", message: "当前组合没有稳妥选项。" });
  if (items.length > 1 && counts.match === 0) issues.push({ code: "NO_MATCH", severity: "warning", message: "当前组合缺少与成绩直接匹配的选项。" });
  if (items.length >= 3 && counts.reach + counts.out_of_reach > Math.ceil(items.length / 2)) issues.push({ code: "TOO_AGGRESSIVE", severity: "warning", message: "超过一半选项属于冲刺或暂不建议，组合风险偏高。" });
  for (const region of targetRegions) if (items.length && counts[region] === 0) issues.push({ code: `NO_${region}`, severity: "warning", message: `目标地区包含 ${region === "UK" ? "英国" : "香港"}，但候选清单尚未覆盖。` });
  const universityCounts = new Map<string, number>();
  for (const item of items) universityCounts.set(item.universityId, (universityCounts.get(item.universityId) ?? 0) + 1);
  const concentration = Math.max(0, ...universityCounts.values());
  if (concentration > 2) issues.push({ code: "CONCENTRATION", severity: "warning", message: "同一院校超过 2 个专业，建议降低院校集中风险。" });
  const penalty = issues.reduce((sum, issue) => sum + (issue.severity === "critical" ? 35 : 12), 0);
  return { score: items.length ? Math.max(0, 100 - penalty) : 0, counts, issues, balanced: items.length >= 3 && issues.length === 0 };
}

export function categoryRank(category: MatchCategory) {
  return ({ match: 0, safety: 1, reach: 2, out_of_reach: 3 })[category];
}
