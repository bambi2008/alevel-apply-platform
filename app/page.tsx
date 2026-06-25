import Link from "next/link";

const features = [
  { title: "选校匹配", desc: "输入 A-Level 预估成绩，按最低/典型 offer 智能给出冲刺/匹配/稳妥分层。", href: "/match", emoji: "🎯" },
  { title: "院校数据库", desc: "英国 + 香港院校与专业的入学要求、学费、排名，结构化透明可查。", href: "/universities", emoji: "🏛️" },
  { title: "申请追踪", desc: "每所申请的状态、材料清单与截止日历，不再漏 deadline。", href: "/match", emoji: "📅" },
  { title: "文书工具", desc: "UCAS 个人陈述结构化引导 + 字数/格式自查（AI 辅助即将上线）。", href: "/match", emoji: "✍️" },
];

const plans = [
  { name: "免费版", price: "¥0", tagline: "探索期", perks: ["选校匹配（前 5 结果）", "院校基础信息查询", "1 份文书草稿"] },
  { name: "标准版", price: "¥299", unit: "/年", tagline: "预算敏感", perks: ["完整选校匹配", "全量院校数据库", "申请日历与任务", "文书编辑器"], highlight: true },
  { name: "专业版", price: "¥899", unit: "/年", tagline: "主流之选", perks: ["标准版全部", "AI 文书润色", "往届案例库", "Offer 对比分析"] },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="py-16 sm:py-24 text-center">
        <p className="inline-block text-xs font-medium text-blue-700 bg-blue-50 rounded-full px-3 py-1 mb-5">
          A-Level 专属 · 英国 UCAS + 香港直申
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          自己掌控留学申请，
          <br className="hidden sm:block" />
          用 <span className="text-blue-600">1/20</span> 的价格替代中介
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-neutral-600 text-lg">
          为中国大陆 A-Level 学生打造的英国 / 香港本科申请平台：选校匹配、院校数据库、申请追踪、文书工具，透明、流程化、低成本。
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/match" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
            免费试用选校匹配
          </Link>
          <Link href="/universities" className="px-6 py-3 rounded-lg border border-neutral-300 font-medium hover:bg-neutral-50">
            浏览院校库
          </Link>
        </div>
        <p className="mt-4 text-sm text-neutral-400">传统中介 ¥20,000–¥60,000 · 桥申 ¥299–¥899/年</p>
      </section>

      {/* Features */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
        {features.map((f) => (
          <Link key={f.title} href={f.href} className="block rounded-xl border border-neutral-200 p-5 hover:border-blue-300 hover:shadow-sm transition">
            <div className="text-2xl mb-2">{f.emoji}</div>
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-neutral-600">{f.desc}</p>
          </Link>
        ))}
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 scroll-mt-16">
        <h2 className="text-2xl font-bold text-center mb-2">透明定价</h2>
        <p className="text-center text-neutral-500 mb-8">一次年费，覆盖申请全流程工具</p>
        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-xl border p-6 ${p.highlight ? "border-blue-500 ring-1 ring-blue-200" : "border-neutral-200"}`}>
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                <span className="text-xs text-neutral-400">{p.tagline}</span>
              </div>
              <div className="mt-3 mb-4">
                <span className="text-3xl font-bold">{p.price}</span>
                {p.unit && <span className="text-neutral-500">{p.unit}</span>}
              </div>
              <ul className="space-y-2 text-sm text-neutral-600">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <span className="text-blue-600">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-neutral-400 mt-6">
          定价为产品规划方案，最终以正式上线为准。本平台不承诺录取结果。
        </p>
      </section>
    </div>
  );
}
