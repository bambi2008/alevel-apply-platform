import { ArrowDown, ArrowUpRight, BookOpenCheck, FilePenLine, FlaskConical, MessagesSquare, GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CORE_AREAS, coreAreaTitle } from "@/lib/core-navigation";
import { WaterlightHeroFrame } from "@/components/waterlight-hero-frame";

const CENTERS = [
  { ...CORE_AREAS[0], subtitle: "CAIE 9709 · 仅 Pure 3", subtitleEn: "CAIE 9709 · Pure 3 only", description: "专项练习、原创书面训练卷与学习记录。", descriptionEn: "Topic practice, original written papers and study records.", icon: BookOpenCheck },
  { ...CORE_AREAS[1], subtitle: "BMO · BPhO", subtitleEn: "BMO · BPhO", description: "进入题库，规划竞赛与专业实践。", descriptionEn: "Open the question banks and plan competitions and subject projects.", icon: FlaskConical },
  { ...CORE_AREAS[2], subtitle: "按目标课程选择", subtitleEn: "Choose for your target course", description: "专项练习、范围训练与历史训练。", descriptionEn: "Topic practice, scoped papers and historical practice.", icon: GraduationCap },
  { ...CORE_AREAS[3], subtitle: "开发中", subtitleEn: "In development", description: "学科推理、口头表达与追问练习预览。", descriptionEn: "Preview subject reasoning, explanation and follow-up practice.", icon: MessagesSquare },
  { ...CORE_AREAS[4], subtitle: "从素材到成稿", subtitleEn: "From evidence to draft", description: "整理真实经历，完成申请文书。", descriptionEn: "Organise real experiences and develop your own statement.", icon: FilePenLine },
] as const;

export function CoreDashboard({ locale }: { locale: string }) {
  const en = locale === "en";
  return (
    <div className="core-dashboard-home bg-[#f4f4f0] text-[#101817]">
      <section className="relative min-h-svh overflow-hidden bg-[#061013] text-white" aria-labelledby="home-wordmark">
        <WaterlightHeroFrame locale={locale} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,12,15,.16)_0%,rgba(2,12,15,.02)_48%,rgba(2,10,13,.32)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,.08),transparent_48%)]" />

        <div className="pointer-events-none absolute left-6 top-6 z-10 sm:left-8 sm:top-8">
          <h1
            id="home-wordmark"
            className="select-none text-[clamp(2.25rem,4vw,4rem)] font-semibold leading-none tracking-[-0.08em] text-white/95 drop-shadow-[0_6px_28px_rgba(0,0,0,.28)]"
            style={{
              WebkitBoxReflect: "below 0.2rem linear-gradient(to bottom, rgba(0,0,0,.42), transparent 78%)",
            }}
          >
            {en ? "QiaoShen" : "桥申"}
            <span className="sr-only">{en ? " | A-Level and UK/HK Admissions Training" : "｜A-Level 与英港升学训练"}</span>
          </h1>
        </div>

        <a
          href="#core-centers"
          aria-label={en ? "Explore the five areas" : "查看五个入口"}
          className="absolute bottom-7 left-1/2 z-20 flex size-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/35 bg-black/10 text-white/85 backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/70 hover:bg-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowDown className="size-4" aria-hidden="true" />
        </a>
      </section>

      <section id="core-centers" className="scroll-mt-0 px-5 py-12 sm:px-8" aria-labelledby="core-centers-title">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 border-b border-black/15 pb-5 md:grid-cols-[1fr_1.4fr] md:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-black/60">{en ? "CHOOSE YOUR FOCUS" : "选择训练方向"}</p>
              <h2 id="core-centers-title" className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{en ? "Five ways to get started" : "五个入口"}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-black/65 md:justify-self-end">{en ? "Choose one thing to work on, from study to application writing." : "从训练到申请表达，选择当前要推进的一件事。"}</p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3">
            {CENTERS.map((center) => {
              const Icon = center.icon;
              return (
                <Link
                  key={center.href}
                  href={center.href}
                  className="group relative min-h-52 border-b border-black/15 px-4 py-5 transition-colors hover:bg-white/55 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101817] md:border-r md:px-6"
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-xs font-semibold tracking-[0.18em] text-black/60">{center.index}</span>
                    <span className="flex size-11 items-center justify-center rounded-full border border-black/15 text-black/55 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-black/35 group-hover:text-black">
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-[auto_1fr] items-start gap-4">
                    <Icon className="mt-1 size-6 stroke-[1.5] text-black/55" aria-hidden="true" />
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.025em]">{coreAreaTitle(center, locale)}</h3>
                      <p className="mt-1 text-sm font-medium leading-5 text-black/65">{en ? center.subtitleEn : center.subtitle}</p>
                      <p className="mt-1 max-w-sm text-sm leading-5 text-black/65">{en ? center.descriptionEn : center.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
