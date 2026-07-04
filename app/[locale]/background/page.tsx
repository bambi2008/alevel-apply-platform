"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  BACKGROUND_CATALOG,
  BG_FIELDS,
  fieldLabel,
  categoryLabel,
  categoryEmoji,
  type BgField,
  type BgCategory,
  type CatalogItem,
} from "@/lib/background/catalog";
import { recommend, classifyMajors } from "@/lib/background/recommend";
import {
  listBackground,
  addBackground,
  updateBackground,
  deleteBackground,
  subscribeBackground,
  plannedCatalogIds,
  statusLabel,
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
  const autoFields = useMemo(() => {
    const f = classifyMajors(profile.intendedMajors);
    return f.length ? f : (BG_FIELDS.map((x) => x.value) as BgField[]);
  }, [profile]);

  const planned = plannedCatalogIds(items);
  const reminders = useMemo(() => computeReminders(items), [items]);

  // 推荐列表：AUTO=主方向推荐；否则该方向全部项目
  const shownCatalog: CatalogItem[] =
    activeField === "AUTO"
      ? scored.filter((s) => s.primary).map((s) => s.item)
      : BACKGROUND_CATALOG.filter((c) => c.field === activeField);

  const reasonOf = (id: string) => scored.find((s) => s.item.id === id)?.reasons ?? [];

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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">背景提升</h1>
      <p className="text-sm text-neutral-500 mb-6">
        围绕你的目标专业规划竞赛、科研、活动与夏校，让申请更有竞争力。推荐已根据你的档案个性化排序。
      </p>

      {/* 在线课题入口（平台自有、可完成的高含金量课题） */}
      <Link
        href="/background/projects"
        className="card-hover block rounded-2xl bg-brand-soft border border-[var(--border)] p-5 mb-8 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-white text-2xl shrink-0">🛠️</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--ink)]">在线课题 · 做出真实产出</p>
            <p className="text-sm text-[var(--ink-soft)]">
              贴近专业、分阶段引导的高含金量课题（工程方向已上线）——比「给个题自己做」更扎实，产出可写入文书与作品集。
            </p>
          </div>
          <span className="text-[var(--indigo)] shrink-0">→</span>
        </div>
      </Link>

      {/* 自提课题入口 */}
      <Link
        href="/background/my-projects"
        className="card-hover block rounded-2xl border border-[var(--border)] p-5 mb-8 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--surface)] text-2xl shrink-0">💡</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--ink)]">我的自提课题 · 提交你自己的研究</p>
            <p className="text-sm text-[var(--ink-soft)]">
              有自己的研究想法？把它交给平台，AI 帮你梳理成规范课题，记录过程、产出个人陈述素材。
            </p>
          </div>
          <span className="text-[var(--indigo)] shrink-0">→</span>
        </div>
      </Link>

      {/* 进度提醒 */}
      {reminders.length > 0 && (
        <section className="mb-8 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🔔</span>
            <h2 className="text-sm font-semibold text-amber-900">进度提醒（{reminders.length}）</h2>
          </div>
          <ul className="space-y-1.5">
            {reminders.map((r) => (
              <li key={r.itemId} className="flex items-center gap-2 text-sm">
                <span
                  className={`text-[11px] rounded px-1.5 py-0.5 shrink-0 ${
                    r.severity === "high"
                      ? "bg-red-100 text-red-700"
                      : r.severity === "medium"
                      ? "bg-amber-100 text-amber-800"
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
              className={`px-2.5 py-1 rounded-full ${activeField === "AUTO" ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
            >
              为我推荐
            </button>
            {BG_FIELDS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveField(f.value)}
                className={`px-2.5 py-1 rounded-full ${activeField === f.value ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {activeField === "AUTO" && profile.intendedMajors.length === 0 && (
          <p className="text-xs text-amber-700 bg-amber-50 rounded px-3 py-2 mb-3">
            提示：在「我的档案」里填写目标专业后，推荐会更贴合你的方向。当前按通用方向展示。
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          {shownCatalog.map((c) => {
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
                      <span key={i} className="text-[11px] text-blue-700 bg-blue-50 rounded px-1.5 py-0.5">{r}</span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => onAdd(c)}
                  disabled={added}
                  className={`mt-3 text-sm rounded-lg py-1.5 ${added ? "bg-neutral-100 text-neutral-400 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  {added ? "已加入规划" : "加入规划"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 我的规划 */}
      <section>
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
            <option value="ACTIVITY">活动</option>
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
                <button onClick={() => toTask(i)} className="text-xs text-blue-600 hover:underline shrink-0" title="在待办清单中创建一条">
                  转为待办
                </button>
                <button onClick={() => deleteBackground(i.id)} className="text-xs text-neutral-300 hover:text-red-600 shrink-0">
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
