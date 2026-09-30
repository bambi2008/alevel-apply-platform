import { ArrowDown, ArrowUpRight, BookOpenCheck, FilePenLine, FlaskConical, MessagesSquare } from "lucide-react";
import { Link } from "@/i18n/navigation";

const CENTERS = [
  { href: "/tests", index: "01", title: "考试训练", subtitle: "入学考试与 A-Level", description: "专项练习、完整模考与学习分析。", icon: BookOpenCheck },
  { href: "/background", index: "02", title: "竞赛与专业实践", subtitle: "把学术兴趣做成成果", description: "竞赛训练、研究课题与专业实践。", icon: FlaskConical },
  { href: "/interview", index: "03", title: "面试训练", subtitle: "高质量计算与表达", description: "学科推理、口头表达与追问训练。", icon: MessagesSquare },
  { href: "/statements", index: "04", title: "文书", subtitle: "从素材到成稿", description: "整理经历证据，完成申请文书。", icon: FilePenLine },
] as const;

export function CoreDashboard({ locale }: { locale: string }) {
  return (
    <div className="core-dashboard-home bg-[#f4f4f0] text-[#101817]">
      <section className="relative min-h-svh overflow-hidden bg-[#061013] text-white" aria-labelledby="home-wordmark">
        <iframe
          src={`/${locale}/waterlight`}
          title="鼠标或触控划动会产生波纹的交互水面"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full border-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,12,15,.16)_0%,rgba(2,12,15,.02)_48%,rgba(2,10,13,.32)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,.08),transparent_48%)]" />

        <div className="pointer-events-none relative z-10 flex min-h-svh items-center justify-center px-6">
          <h1 id="home-wordmark" className="select-none text-[clamp(4.5rem,15vw,13rem)] font-semibold leading-none tracking-[-0.09em] text-white/95 drop-shadow-[0_10px_50px_rgba(0,0,0,.24)]">
            桥申
          </h1>
        </div>

        <a
          href="#core-centers"
          aria-label="查看四个核心入口"
          className="absolute bottom-7 left-1/2 z-20 flex size-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/35 bg-black/10 text-white/85 backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/70 hover:bg-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowDown className="size-4" aria-hidden="true" />
        </a>
      </section>

      <section id="core-centers" className="scroll-mt-0 px-5 py-12 sm:px-8" aria-labelledby="core-centers-title">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 border-b border-black/15 pb-5 md:grid-cols-[1fr_1.4fr] md:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-black/45">CORE FOUR</p>
              <h2 id="core-centers-title" className="mt-2 text-4xl font-semibold tracking-[-0.04em]">四个核心入口</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-black/55 md:justify-self-end">从训练到申请表达，选择当前要推进的一件事。</p>
          </div>

          <div className="grid md:grid-cols-2">
            {CENTERS.map((center) => {
              const Icon = center.icon;
              return (
                <Link
                  key={center.href}
                  href={center.href}
                  className="group relative min-h-64 border-b border-black/15 px-1 py-7 transition-colors hover:bg-white/55 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101817] md:h-[220px] md:min-h-0 md:px-8 md:py-6 md:odd:border-r"
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-xs font-semibold tracking-[0.18em] text-black/35">{center.index}</span>
                    <span className="flex size-11 items-center justify-center rounded-full border border-black/15 text-black/55 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-black/35 group-hover:text-black">
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-[auto_1fr] items-start gap-4">
                    <Icon className="mt-1 size-6 stroke-[1.5] text-black/55" aria-hidden="true" />
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.025em]">{center.title}</h3>
                      <p className="mt-1 text-sm font-medium text-black/55">{center.subtitle}</p>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-black/55">{center.description}</p>
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
