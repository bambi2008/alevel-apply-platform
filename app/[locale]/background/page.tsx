"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  CoreList,
  CorePageHeader,
  CorePageShell,
  CoreSectionHeader,
  CoreTabBar,
  coreTabClass,
} from "@/components/core-page-layout";
import {
  BACKGROUND_CATALOG,
  BG_FIELDS,
  BG_GROUPS,
  groupOfCategory,
  fieldLabel,
  categoryLabel,
  catalogEventKey,
  uniqueCatalogEvents,
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
import { backgroundStaticCopy } from "@/lib/background/presentation";
import { uiCopy } from "@/lib/ui-copy";

const DIFF_LABEL = ["", "入门", "进阶", "挑战"];

export default function BackgroundPage() {
  const locale = useLocale();
  const english = locale === "en";
  const category = (value: BgCategory) => english ? ({ COMPETITION: "Competition", RESEARCH: "Research", ACTIVITY: "Activity", SUMMER_SCHOOL: "Summer school" })[value] : categoryLabel(value);
  const field = (value: BgField) => english ? BG_FIELDS.find(f => f.value === value)?.labelEn : fieldLabel(value);
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
  const planned = new Set([...plannedCatalogIds(items)].map(catalogEventKey));
  const reminders = useMemo(() => computeReminders(items), [items]);

  // 推荐列表：AUTO=主方向推荐；否则该方向全部项目
  const shownCatalog: CatalogItem[] =
    activeField === "AUTO"
      ? scored.filter((s) => s.primary).map((s) => s.item)
      : BACKGROUND_CATALOG.filter((c) => c.field === activeField);

  // 顶层两大类过滤：竞赛 / 实践
  const shownByGroup: CatalogItem[] = uniqueCatalogEvents(
    activeGroup === "ALL"
      ? shownCatalog
      : shownCatalog.filter((c) => groupOfCategory(c.category) === activeGroup));

  const reasonOf = (id: string) => scored.find((s) => s.item.id === id)?.reasons ?? [];

  // 专业实践块内的两个课题入口（在线课题 / 自提课题）
  const projectEntries = (
    <CoreList className="mb-5">
      <Link
        href="/background/projects"
        className="group grid gap-2 py-4 sm:grid-cols-[minmax(170px,0.8fr)_minmax(0,1.6fr)_auto] sm:items-center sm:gap-5"
      >
        <p className="font-medium text-[var(--ink)] group-hover:text-[var(--indigo)]">{english ? "Guided projects" : "在线专业课题"}</p>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">{english ? "Complete research and engineering tasks with a record of your work." : "按阶段完成研究与工程任务，形成可验证的作品、报告或实验记录。"}</p>
        <ArrowRight className="h-4 w-4 text-[var(--ink-faint)] group-hover:text-[var(--indigo)]" aria-hidden="true" />
      </Link>
      <Link
        href="/background/my-projects"
        className="group grid gap-2 py-4 sm:grid-cols-[minmax(170px,0.8fr)_minmax(0,1.6fr)_auto] sm:items-center sm:gap-5"
      >
        <p className="font-medium text-[var(--ink)] group-hover:text-[var(--indigo)]">{english ? "My projects" : "我的专业实践"}</p>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">{english ? "Record your own projects, process and outcomes." : "记录自提研究、实践过程与产出，并沉淀为可用于文书的真实素材。"}</p>
        <ArrowRight className="h-4 w-4 text-[var(--ink-faint)] group-hover:text-[var(--indigo)]" aria-hidden="true" />
      </Link>
    </CoreList>
  );

  const onAdd = (c: CatalogItem) =>
    addBackground({ catalogId: c.id, title: english ? c.titleEn : c.title, category: c.category, field: c.field });

  const onAddCustom = () => {
    const t = customTitle.trim();
    if (!t) return;
    setCustomTitle("");
    addBackground({ title: t, category: customCat, field: null });
  };

  const toTask = (i: BackgroundPlanItem) =>
    addTask({ title: (english ? "Project: " : "背景提升：") + i.title, category: "OTHER" });

  return (
    <CorePageShell>
      <CorePageHeader
        step="2 / 5"
        title={english ? "Competitions" : "竞赛"}
        description={english ? "Choose a question bank or plan your next project." : "进入题库，或选择一个项目开始规划。"}
        meta={english ? `${shownByGroup.length} projects shown` : `${shownByGroup.length} 个当前项目`}
      />

      <section className="my-7 grid gap-3 sm:grid-cols-2" aria-label={english ? "Competition question banks" : "竞赛题库"}>
        {([ ["bmo", "BMO"], ["bpho", "BPhO"] ] as const).map(([id, title]) => (
          <Link key={id} href={`/tests/${id}`} className="group flex min-h-20 items-center justify-between rounded-xl border border-black/20 px-5 py-4 font-semibold transition hover:-translate-y-0.5 hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2">
            <span>{title}<span className="ml-3 text-sm font-normal text-[var(--ink-soft)]">{english ? "Question bank" : "题库"}</span></span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ))}
      </section>

      <CoreTabBar label={english ? "Project categories" : "项目分类"}>
        <button
          type="button"
          onClick={() => setActiveGroup("COMPETITION")}
          aria-pressed={activeGroup === "COMPETITION"}
          className={coreTabClass(activeGroup === "COMPETITION")}
        >
          {english ? "Competitions" : "竞赛提升"}
        </button>
        <button
          type="button"
          onClick={() => setActiveGroup("PROFESSIONAL")}
          aria-pressed={activeGroup === "PROFESSIONAL"}
          className={coreTabClass(activeGroup === "PROFESSIONAL")}
        >
          {english ? "Projects" : "专业实践"}
        </button>
        <a href="#background-plan" className={coreTabClass(false)}>
          {english ? "My progress" : "我的进度"}
        </a>
      </CoreTabBar>

      {/* 进度提醒 */}
      {reminders.length > 0 && (
        <section className="mt-5 border-l-2 border-[var(--warning)] pl-4">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--warning)]">{english ? "Reminders" : "进度提醒"} ({reminders.length})</h2>
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
                  {english ? r.kind === "overdue" ? "Overdue" : r.kind === "due_soon" ? "Due soon" : "Not started" : r.kind === "overdue" ? "已逾期" : r.kind === "due_soon" ? "临近" : "停滞"}
                </span>
                <span className="text-neutral-800 truncate">{r.title}</span>
                <span className="text-neutral-600 text-xs shrink-0">— {english ? `${r.days} days` : r.message}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 为你推荐 */}
      <section className="mt-8">
        <CoreSectionHeader title={english ? "Explore projects" : "为你推荐"} meta={english ? "Filter by subject" : "按方向筛选"} />
        <CoreTabBar label={english ? "Filter by subject" : "按专业方向筛选"}>
            <button
              onClick={() => setActiveField("AUTO")}
              aria-pressed={activeField === "AUTO"}
              className={coreTabClass(activeField === "AUTO")}
            >
              {english ? "For me" : "为我推荐"}
            </button>
            {BG_FIELDS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveField(f.value)}
                aria-pressed={activeField === f.value}
                className={coreTabClass(activeField === f.value)}
              >
                {english ? f.labelEn : f.label}
              </button>
            ))}
        </CoreTabBar>

        {activeGroup !== "ALL" && (
          <p className="text-sm text-[var(--ink-faint)] mb-3">
            {english ? activeGroup === "COMPETITION" ? "Practise problem-solving and prepare your entry." : "Record research, projects and learning experiences." : BG_GROUPS.find((g) => g.value === activeGroup)?.desc}
          </p>
        )}

        {activeField === "AUTO" && profile.intendedMajors.length === 0 && (
          <p className="mt-4 border-l-2 border-[var(--warning)] pl-3 text-xs leading-5 text-[var(--warning)]">
            {english ? "Add your intended subject in your profile to personalise these suggestions." : "在「我的档案」填写目标专业后，可查看更贴合方向的推荐。"}
          </p>
        )}

        {(activeGroup === "ALL"
          ? BG_GROUPS.map((g) => ({
              key: g.value,
              label: english ? g.value === "COMPETITION" ? "Competitions" : "Projects" : g.label,
              items: uniqueCatalogEvents(shownCatalog.filter((c) => groupOfCategory(c.category) === g.value)),
            }))
          : [{ key: activeGroup, label: "", items: shownByGroup }]
        ).map((sec) =>
          sec.items.length === 0 && sec.key !== "PROFESSIONAL" ? null : (
            <div key={sec.key} className="mt-7">
              {sec.label && (
                <h3 className="text-sm font-semibold text-[var(--ink-soft)]">{sec.label}</h3>
              )}
              {sec.key === "PROFESSIONAL" && projectEntries}
              <CoreList>
                {sec.items.map((c) => {
                  const added = planned.has(catalogEventKey(c.id));
                  const reasons = activeField === "AUTO" ? reasonOf(c.id) : [];
                  return (
                    <article key={c.id} className="grid gap-3 py-4 sm:grid-cols-[minmax(180px,0.9fr)_minmax(0,1.6fr)_auto] sm:items-center sm:gap-5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--ink)]">{english ? c.titleEn : c.title}</p>
                          <p className="mt-0.5 text-xs text-[var(--ink-faint)]">
                            {category(c.category)} · {field(c.field)} · {english ? ["", "Introductory", "Intermediate", "Challenge"][c.difficulty] : `难度：${DIFF_LABEL[c.difficulty]}`}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm leading-6 text-[var(--ink-soft)]">{backgroundStaticCopy(c.description, locale)}</p>
                          <p className="mt-1 text-xs text-[var(--ink-faint)]">
                            {english ? "Suggested timing: " : "建议时间："}{backgroundStaticCopy(c.timing, locale)}{reasons.length > 0 ? ` · ${reasons.map(reason => uiCopy(locale, reason)).join(" · ")}` : ""}
                          </p>
                        </div>
                      <div className="flex items-center gap-3 sm:justify-end">
                        <button
                          onClick={() => onAdd(c)}
                          disabled={added}
                          className={`inline-flex min-h-11 min-w-11 items-center text-sm font-medium ${added ? "cursor-default text-[var(--ink-faint)]" : "text-[var(--indigo)] hover:underline"}`}
                        >
                          {english ? added ? "Added to plan" : "Add to plan" : added ? "已加入规划" : "加入规划"}
                        </button>
                        {c.testId && (
                          <Link
                            href={`/tests/${c.testId}`}
                            className="inline-flex min-h-11 min-w-11 items-center whitespace-nowrap text-sm font-medium text-[var(--indigo)] hover:underline"
                          >
                            {english ? "Question bank →" : "进入题库 →"}
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </CoreList>
            </div>
          )
        )}
        {shownByGroup.length === 0 && (
          <p className="text-sm text-[var(--ink-faint)] py-6 text-center">
            {english ? "No projects in this view. Try another subject." : "该分类下暂无推荐项目，试试切换方向。"}
          </p>
        )}
      </section>

      {/* 我的规划 */}
      <section id="background-plan" className="mt-10 scroll-mt-24 border-t border-[var(--border)] pt-7">
        <CoreSectionHeader title={english ? "My plan" : "我的规划"} meta={english ? `${items.length} projects` : `${items.length} 个项目`} />

        {/* 自定义添加 */}
        <div className="mt-4 flex gap-2 border-b border-[var(--border)] pb-4">
          <select
            aria-label={english ? "Project category" : "项目类别"}
            value={customCat}
            onChange={(e) => setCustomCat(e.target.value)}
            className="min-h-11 border border-[var(--border)] bg-white px-2 py-2 text-sm"
          >
            <option value="COMPETITION">{english ? "Competition" : "竞赛"}</option>
            <option value="RESEARCH">{english ? "Research" : "科研"}</option>
            <option value="SUMMER_SCHOOL">{english ? "Summer school" : "夏校"}</option>
          </select>
          <input
            aria-label={english ? "Project title" : "项目名称"}
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAddCustom()}
            placeholder={english ? "Add your own project…" : "自定义添加一个背景项目…"}
            className="min-h-11 min-w-0 flex-1 border border-[var(--border)] px-3 py-2 text-sm"
          />
          <button onClick={onAddCustom} className="min-h-11 min-w-11 bg-[var(--ink)] px-4 text-sm text-white hover:opacity-90">
            {english ? "Add" : "添加"}
          </button>
        </div>

        {!loaded ? (
          <div className="py-12 text-center text-neutral-600 text-sm">{english ? "Loading…" : "加载中…"}</div>
        ) : items.length === 0 ? (
          <div className="border-b border-[var(--border)] py-12 text-center text-sm text-[var(--ink-faint)]">
            {english ? "No projects yet. Choose Add to plan above to get started." : "还没有规划项目。从上方推荐中「加入规划」开始吧。"}
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)] border-b border-[var(--border)]">
            {items.map((i) => (
              <div key={i.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${i.status === "DONE" ? "text-neutral-400 line-through" : "text-neutral-800"}`}>{i.title}</p>
                  <p className="text-xs text-neutral-600">{category(i.category as BgCategory)}</p>
                </div>
                <input
                  type="date"
                  value={i.targetDate ?? ""}
                  onChange={(e) => updateBackground(i.id, { targetDate: e.target.value || null })}
                  className="min-h-11 rounded-md border border-neutral-300 px-2 py-1 text-xs bg-white shrink-0 text-neutral-600"
                  title={english ? "Target date" : "目标日期"}
                  aria-label={english ? "Target date" : "目标日期"}
                />
                <select
                  aria-label={english ? "Project status" : "项目状态"}
                  value={i.status}
                  onChange={(e) => updateBackground(i.id, { status: e.target.value as BgStatus })}
                  className="min-h-11 rounded-md border border-neutral-300 px-2 py-1 text-xs bg-white shrink-0"
                >
                  {BG_STATUS_LABELS.map((s) => (
                    <option key={s.value} value={s.value}>{english ? ({ PLANNED: "Planned", IN_PROGRESS: "In progress", DONE: "Done" })[s.value] : s.label}</option>
                  ))}
                </select>
                <button onClick={() => toTask(i)} className="min-h-11 min-w-11 text-xs text-[var(--indigo)] hover:underline shrink-0" title={english ? "Create a task" : "在待办清单中创建一条"}>
                  {english ? "Create task" : "转为待办"}
                </button>
                <button onClick={() => deleteBackground(i.id)} className="min-h-11 min-w-11 text-xs text-[var(--ink-faint)] hover:text-[var(--danger)] shrink-0">
                  {english ? "Delete" : "删除"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </CorePageShell>
  );
}
