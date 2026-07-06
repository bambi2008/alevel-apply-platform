"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  getSections,
  REGION_META,
  type AppPrepRegion,
  type PrepSection,
} from "@/lib/application/prep-schema";
import {
  getApplicationPrep,
  saveApplicationPrep,
  type PrepData,
} from "@/lib/application/actions";

export function PrepAssistant() {
  const [region, setRegion] = useState<AppPrepRegion>("UK_UCAS");
  const [data, setData] = useState<PrepData>({});
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const sections = useMemo(() => getSections(region), [region]);
  const meta = REGION_META[region];

  useEffect(() => {
    setLoaded(false);
    getApplicationPrep(region).then((r) => {
      setData(r.data ?? {});
      setLoaded(true);
      setOpenId(sections[0]?.id ?? null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  const setField = (sectionId: string, fieldId: string, value: unknown) => {
    setData((d) => ({ ...d, [sectionId]: { ...(d[sectionId] ?? {}), [fieldId]: value } }));
  };
  const toggleDone = (sectionId: string) => {
    setData((d) => ({ ...d, [sectionId]: { ...(d[sectionId] ?? {}), __done: !(d[sectionId]?.__done) } }));
  };

  const onSave = async () => {
    setSavedAt(null);
    const r = await saveApplicationPrep(region, data);
    if (r.authed) setSavedAt(new Date().toLocaleTimeString());
    else setSavedAt("需登录后才能保存");
  };

  const doneCount = sections.filter((s) => data[s.id]?.__done).length;
  const progress = Math.round((doneCount / sections.length) * 100);

  const copySection = (s: PrepSection) => {
    const vals = data[s.id] ?? {};
    const lines = s.fields
      .map((f) => `${f.label}:\n${(vals[f.id] as string) || "（未填）"}`)
      .join("\n\n");
    navigator.clipboard?.writeText(`【${s.title}】\n\n${lines}`);
  };

  if (!loaded) return <div className="py-10 text-[var(--ink-faint)]">加载中…</div>;

  return (
    <div>
      {/* 区域切换 */}
      <div className="mt-4 inline-flex rounded-lg border border-[var(--border)] p-1 bg-[var(--surface)]">
        {(["UK_UCAS", "HK"] as AppPrepRegion[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegion(r)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${region === r ? "bg-white shadow text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}
          >
            {REGION_META[r].flag} {REGION_META[r].label}
          </button>
        ))}
      </div>

      {/* 合规说明 */}
      <div className="mt-4 text-sm bg-[var(--warning-bg)] text-[var(--warning)] rounded-lg px-3 py-2">
        本助手只帮你<strong>准备好每一栏该填的内容</strong>并保存下来，供你复制。它<strong>不会代你登录、代填或代提交</strong>——最终请到官方系统亲自完成。
        <a href={meta.officialUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-[var(--indigo)] hover:underline">
          {meta.officialLabel} →
        </a>
      </div>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">{meta.note}</p>

      {/* 进度 */}
      <div className="mt-5 sticky top-14 bg-white/95 backdrop-blur py-2 z-[5]">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-medium">准备进度</span>
          <span className="text-[var(--ink-soft)]">{doneCount}/{sections.length} 栏已就绪（{progress}%）</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
          <div className="h-full bg-[var(--indigo)] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 各栏目 */}
      <div className="mt-4 space-y-3">
        {sections.map((s) => {
          const open = openId === s.id;
          const done = !!data[s.id]?.__done;
          return (
            <section key={s.id} className={`rounded-xl border ${done ? "border-[color:var(--success)]/25 bg-[var(--success-bg)]" : "border-[var(--border)]"}`}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : s.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-semibold flex items-center gap-2">
                  <span>{done ? "✅" : "▢"}</span>
                  {s.title}
                </span>
                <span className="text-[var(--ink-faint)] text-sm">{open ? "收起" : "展开"}</span>
              </button>

              {open && (
                <div className="px-4 pb-4 space-y-4">
                  <p className="text-sm text-[var(--ink-soft)]">{s.intro}</p>

                  {/* 字段 */}
                  <div className="space-y-3">
                    {s.fields.map((f) => {
                      const val = (data[s.id]?.[f.id] as string) ?? "";
                      return (
                        <div key={f.id}>
                          <label className="text-sm font-medium">{f.label}</label>
                          {f.type === "textarea" ? (
                            <textarea
                              className="mt-1 w-full min-h-20 rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--indigo)]/20"
                              value={val}
                              placeholder={f.placeholder}
                              onChange={(e) => setField(s.id, f.id, e.target.value)}
                            />
                          ) : f.type === "select" ? (
                            <select
                              className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-white"
                              value={val}
                              onChange={(e) => setField(s.id, f.id, e.target.value)}
                            >
                              <option value="">（请选择）</option>
                              {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input
                              type={f.type === "date" ? "text" : "text"}
                              className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--indigo)]/20"
                              value={val}
                              placeholder={f.placeholder}
                              onChange={(e) => setField(s.id, f.id, e.target.value)}
                            />
                          )}
                          {f.hint && <p className="text-xs text-[var(--ink-soft)] mt-1">💡 {f.hint}</p>}
                        </div>
                      );
                    })}
                  </div>

                  {/* 要点 */}
                  {s.tips.length > 0 && (
                    <div className="rounded-lg bg-[var(--info-bg)] p-3">
                      <p className="text-xs font-semibold text-[var(--indigo)] mb-1">填写要点</p>
                      <ul className="space-y-1">
                        {s.tips.map((t, i) => (
                          <li key={i} className="text-sm text-[var(--ink)] flex gap-2"><span className="text-[var(--ink-faint)]">·</span>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 常见错误 */}
                  {s.mistakes.length > 0 && (
                    <div className="rounded-lg bg-[var(--danger-bg)] p-3">
                      <p className="text-xs font-semibold text-[var(--danger)] mb-1">⚠️ 常见错误</p>
                      <ul className="space-y-1">
                        {s.mistakes.map((t, i) => (
                          <li key={i} className="text-sm text-[var(--ink)] flex gap-2"><span className="text-[var(--ink-faint)]">·</span>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 跳转平台工具 */}
                  {s.linkTo && (
                    <Link href={s.linkTo.href} className="inline-block text-sm text-indigo-600 hover:underline">
                      🔗 {s.linkTo.label}
                    </Link>
                  )}

                  {/* 操作 */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => toggleDone(s.id)}
                      className={`text-sm px-4 py-1.5 rounded-lg border ${done ? "border-[color:var(--success)]/40 text-[var(--success)] bg-white" : "border-[var(--border)] text-[var(--ink)] bg-white hover:bg-[var(--surface)]"}`}
                    >
                      {done ? "✓ 已标记就绪（点此取消）" : "标记这栏已准备好"}
                    </button>
                    <button
                      type="button"
                      onClick={() => copySection(s)}
                      className="text-sm px-4 py-1.5 rounded-lg border border-[var(--border)] text-[var(--ink)] bg-white hover:bg-[var(--surface)]"
                    >
                      📋 复制本栏内容
                    </button>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* 保存 */}
      <div className="mt-6 flex items-center gap-4">
        <button type="button" onClick={onSave} className="btn btn-primary">
          保存进度
        </button>
        {savedAt && <span className="text-sm text-[var(--success)]">✓ 已保存（{savedAt}）</span>}
        <span className="text-xs text-[var(--ink-faint)]">内容存在你的账号里，换设备也能继续。</span>
      </div>
    </div>
  );
}
