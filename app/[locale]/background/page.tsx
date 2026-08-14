"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, FlaskConical, FolderKanban, Trophy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  BACKGROUND_CATALOG,
  BG_FIELDS,
  BG_GROUPS,
  groupOfCategory,
  fieldLabel,
  categoryLabel,
  categoryEmoji,
  type BgField,
  type BgGroup,
  type BgCategory,
  type CatalogItem,
} from "@/lib/background/catalog";
import { recommend } from "@/lib/background/recommend";
import {
  listBackground,
  addBackground,
  updateBackground,
  deleteBackground,
  subscribeBackground,
  plannedCatalogIds,
  BG_STATUS_LABELS,
  type BackgroundPlanItem,
  type BgStatus,
} from "@/lib/background/store";
import { getProfileForRecommendAction } from "@/lib/background/actions";
import { addTask } from "@/lib/tasks/store";
import { computeReminders } from "@/lib/background/reminders";

const DIFF_LABEL = ["", "入门", "进阶", "挑战"];

export default function BackgroundPage() {
  const [profile, setProfile] = useState<{ intendedMajors: string[]; subjects: string[] }>({
    intendedMajors: [],
    subjects: [],
  });
  const [items, setItems] = useState<BackgroundPlanItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeField, setActiveField] = useState<BgField | "AUTO">("AUTO");
  const [activeGroup, setActiveGroup] = useState<BgGroup | "ALL">("COMPETITION");
  const [customTitle, setCustomTitle] = useState("");
  const [customCat, setCustomCat] = useState("COMPETITION");

  useEffect(() => {
    getProfileForRecommendAction()
      .then((p) => setProfile(p))
      .catch(() => {});
    const sync = () => listBackground().then((i) => { setItems(i); setLoaded(true); });
    sync();
    return subscribeBackground(sync);
  }, []);

  const scored = useMemo(() => recommend(profile), [profile]);
  const planned = plannedCatalogIds(items);
  const reminders = useMemo(() => computeReminders(items), [items]);

  // 推荐列表：AUTO=主方向推荐；否则该方向全部项目
  const shownCatalog: CatalogItem[] =
    activeField === "AUTO"
      ? scored.filter((s) => s.primary).map((s) => s.item)
      : BACKGROUND_CATALOG.filter((c) => c.field === activeField);

  // 顶层两大类过滤：竞赛 / 实践
  const shownByGroup: CatalogItem[] =
    activeGroup === "ALL"
      ? shownCatalog
      : shownCatalog.filter((c) => groupOfCategory(c.category) === activeGroup);

  const reasonOf = (id: string) => scored.find((s) => s.item.id === id)?.reasons ?? [];

  // 专业实践块内的两个课题入口（在线课题 / 自提课题）
  const projectEntries = (
    <div className="grid sm:grid-cols-2 gap-3 mb-4">
      <Link
        href="/background/projects"
        className="group block border border-[var(--border)] bg-white p-5 hover:border-[var(--indigo)]"
      >
        <div className="flex items-start gap-3">
          <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-[var(--indigo)]" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--ink)]">在线专业课题</p>
            <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">按阶段完成研究与工程任务，形成可验证的作品、报告或实验记录。</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ink-faint)] group-hover:text-[var(--indigo)]" aria-hidden="true" />
        </div>
      </Link>
      <Link
        href="/background/my-projects"
        className="group block border border-[var(--border)] bg-white p-5 hover:border-[var(--indigo)]"
      >
        <div className="flex items-start gap-3">
          <FolderKanban className="mt-0.5 h-5 w-5 shrink-0 text-[var(--indigo)]" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--ink)]">我的专业实践</p>
            <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">记录自提研究、实践过程与产出，并沉淀为可用于文书的真实素材。</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ink-faint)] group-hover:text-[var(--indigo)]" aria-hidden="true" />
        </div>
      </Link>
    </div>
  );

  const onAdd = (c: CatalogItem) =>
    addBackground({ catalogId: c.id, title: c.title, category: c.category, field: c.field });

  const onAddCustom = () => {
    const t = customTitle.trim();
    if (!t) return;
    setCustomTitle("");
    addBackground({ title: t, category: customCat, field: null });
  };

  const toTask = (i: BackgroundPlanItem) =>
    addTask({ title: "背景提升：" + i.title, category: "OTHER" });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="border-b border-[var(--border)] pb-6">
        <p className="text-sm font-medium text-[var(--indigo)]">核心功能 2 / 4</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--ink)] sm:text-4xl">竞赛与专业实践</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-soft)] sm:text-base">
          竞赛用于系统训练与能力证明，专业实践用于完成真实研究、工程任务和可展示产出。两类经历分别规划，不再混入申请待办。
        </p>
      </header>

      <nav aria-label="背景提升分类" className="mb-8 grid grid-cols-3 border-b border-[var(--border)]">
        <button
          type="button"
          onClick={() => setActiveGroup("COMPETITION")}
          className={`flex min-h-20 items-center justify-center gap-2 border-r border-[var(--border)] px-3 text-sm font-medium ${activeGroup === "COMPETITION" ? "border-b-2 border-b-[var(--indigo)] text-[var(--indigo)]" : "text-[var(--ink-soft)] hover:bg-[var(--surface-2)]"}`}
        >
          <Trophy className="h-4 w-4" aria-hidden="true" /> 竞赛提升
        </button>
        <button
          type="button"
          onClick={() => setActiveGroup("PROFESSIONAL")}
          className={`flex min-h-20 items-center justify-center gap-2 border-r border-[var(--border)] px-3 text-sm font-medium ${activeGroup === "PROFESSIONAL" ? "border-b-2 border-b-[var(--indigo)] text-[var(--indigo)]" : "text-[var(--ink-soft)] hover:bg-[var(--surface-2)]"}`}
        >
          <FlaskConical className="h-4 w-4" aria-hidden="true" /> 专业实践
        </button>
        <a href="#background-plan" className="flex min-h-20 items-center justify-center gap-2 px-3 text-sm font-medium text-[var(--ink-soft)] hover:bg-[var(--surface-2)]">
          <FolderKanban className="h-4 w-4" aria-hidden="true" /> 我的进度
        </a>
      </nav>

      {/* 进度提醒 */}
      {reminders.length > 0 && (
        <section className="mb-8 rounded-xl border border-[color:var(--warning)]/25 bg-[var(--warning-bg)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🔔</span>
            <h2 className="text-sm font-semibold text-[var(--warning)]">进度提醒（{reminders.length}）</h2>
          </div>
          <ul className="space-y-1.5">
            {reminders.map((r) => (
              <li key={r.itemId} className="flex items-center gap-2 text-sm">
                <span
                  className={`text-[11px] rounded px-1.5 py-0.5 shrink-0 ${
                    r.severity === "high"
                      ? "bg-[var(--danger-bg)] text-[var(--danger)]"
                      : r.severity === "medium"
                      ? "bg-[var(--warning-bg)] text-[var(--warning)]"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {r.kind === "overdue" ? "已逾期" : r.kind === "due_soon" ? "临近" : "停滞"}
                </span>
                <span className="text-neutral-800 truncate">{r.title}</span>
                <span className="text-neutral-400 text-xs shrink-0">— {r.message}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 为你推荐 */}
      <section className="mb-10">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <h2 className="text-lg font-semibold">为你推荐</h2>
          <div className="flex gap-1 text-xs flex-wrap">
            <button
              onClick={() => setActiveField("AUTO")}
              className={`px-2.5 py-1 rounded-full ${activeField === "AUTO" ? "bg-[var(--indigo)] text-white" : "bg-[var(--surface-2)] text-[var(--ink-soft)] hover:bg-[var(--border)]"}`}
            >
              为我推荐
            </button>
            {BG_FIELDS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveField(f.value)}
                className={`px-2.5 py-1 rounded-full ${activeField === f.value ? "bg-[var(--indigo)] text-white" : "bg-[var(--surface-2)] text-[var(--ink-soft)] hover:bg-[var(--border)]"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {activeGroup !== "ALL" && (
          <p className="text-sm text-[var(--ink-faint)] mb-3">
            {BG_GROUPS.find((g) => g.value === activeGroup)?.desc}
          </p>
        )}

        {activeField === "AUTO" && profile.intendedMajors.length === 0 && (
          <p className="text-xs text-[var(--warning)] bg-[var(--warning-bg)] rounded px-3 py-2 mb-3">
            提示：在「我的档案」里填写目标专业后，推荐会更贴合你的方向。当前按通用方向展示。
          </p>
        )}

        {(activeGroup === "ALL"
          ? BG_GROUPS.map((g) => ({
              key: g.value,
              label: `${g.emoji} ${g.label}`,
              items: shownCatalog.filter((c) => groupOfCategory(c.category) === g.value),
            }))
          : [{ key: activeGroup, label: "", items: shownByGroup }]
        ).map((sec) =>
          sec.items.length === 0 && sec.key !== "PROFESSIONAL" ? null : (
            <div key={sec.key} className="mb-6">
              {sec.label && (
                <h3 className="text-sm font-semibold text-[var(--ink-soft)] mb-2">{sec.label}</h3>
              )}
              {sec.key === "PROFESSIONAL" && projectEntries}
              <div className="grid sm:grid-cols-2 gap-3">
                {sec.items.map((c) => {
                  const added = planned.has(c.id);
                  const reasons = activeField === "AUTO" ? reasonOf(c.id) : [];
                  return (
                    <div key={c.id} className="rounded-xl border border-neutral-200 bg-white p-4 flex flex-col">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{categoryEmoji(c.category)}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-neutral-900">{c.title}</p>
                          <p className="text-xs text-neutral-400">
                            {categoryLabel(c.category)} · {fieldLabel(c.field)} · 难度：{DIFF_LABEL[c.difficulty]}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 mt-2 flex-1">{c.description}</p>
                      <p className="text-xs text-neutral-400 mt-1">建议时间：{c.timing}</p>
                      {reasons.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-2">
                          {reasons.map((r, i) => (
                            <span key={i} className="text-[11px] text-[var(--indigo)] bg-[var(--info-bg)] rounded px-1.5 py-0.5">{r}</span>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => onAdd(c)}
                          disabled={added}
                          className={`flex-1 text-sm rounded-lg py-1.5 ${added ? "bg-[var(--surface-2)] text-[var(--ink-faint)] cursor-default" : "bg-[var(--indigo)] text-white hover:bg-[var(--indigo-hover)]"}`}
                        >
                          {added ? "已加入规划" : "加入规划"}
                        </button>
                        {c.testId && (
                          <Link
                            href={`/tests/${c.testId}`}
                            className="text-sm rounded-lg py-1.5 px-3 border border-[var(--indigo)] text-[var(--indigo)] font-medium hover:bg-[var(--info-bg)] whitespace-nowrap"
                          >
                            进入竞赛题库
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
        {shownByGroup.length === 0 && (
          <p className="text-sm text-[var(--ink-faint)] py-6 text-center">
            该分类下暂无推荐项目，试试切换方向或点「全部」。
          </p>
        )}
      </section>

      {/* 我的规划 */}
      <section id="background-plan" className="scroll-mt-24">
        <h2 className="text-lg font-semibold mb-3">我的规划（{items.length}）</h2>

        {/* 自定义添加 */}
        <div className="flex gap-2 mb-4">
          <select
            value={customCat}
            onChange={(e) => setCustomCat(e.target.value)}
            className="rounded-lg border border-neutral-300 px-2 py-2 text-sm bg-white"
          >
            <option value="COMPETITION">竞赛</option>
            <option value="RESEARCH">科研</option>
            <option value="SUMMER_SCHOOL">夏校</option>
          </select>
          <input
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAddCustom()}
            placeholder="自定义添加一个背景项目…"
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
          <button onClick={onAddCustom} className="rounded-lg bg-neutral-800 text-white text-sm px-4 hover:bg-neutral-700">
            添加
          </button>
        </div>

        {!loaded ? (
          <div className="py-12 text-center text-neutral-400 text-sm">加载中…</div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center text-neutral-400 text-sm">
            还没有规划项目。从上方推荐中「加入规划」开始吧。
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
                <span className="text-lg shrink-0">{categoryEmoji(i.category as BgCategory)}</span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${i.status === "DONE" ? "text-neutral-400 line-through" : "text-neutral-800"}`}>{i.title}</p>
                  <p className="text-xs text-neutral-400">{categoryLabel(i.category as BgCategory)}</p>
                </div>
                <input
                  type="date"
                  value={i.targetDate ?? ""}
                  onChange={(e) => updateBackground(i.id, { targetDate: e.target.value || null })}
                  className="rounded-md border border-neutral-300 px-2 py-1 text-xs bg-white shrink-0 text-neutral-600"
                  title="目标日期"
                />
                <select
                  value={i.status}
                  onChange={(e) => updateBackground(i.id, { status: e.target.value as BgStatus })}
                  className="rounded-md border border-neutral-300 px-2 py-1 text-xs bg-white shrink-0"
                >
                  {BG_STATUS_LABELS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button onClick={() => toTask(i)} className="text-xs text-[var(--indigo)] hover:underline shrink-0" title="在待办清单中创建一条">
                  转为待办
                </button>
                <button onClick={() => deleteBackground(i.id)} className="text-xs text-[var(--ink-faint)] hover:text-[var(--danger)] shrink-0">
                  删除
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
