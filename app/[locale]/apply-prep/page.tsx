import { PrepAssistant } from "@/components/application/prep-assistant";

export default function ApplyPrepPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">交互式填表助手</h1>
      <p className="mt-2 text-neutral-600">
        按 UCAS / 港校申请表的栏目，一步步帮你准备好每一栏该填的内容，并保存到你的账号。
        它只做「准备」，不代你登录或提交——最终由你亲自在官方系统完成。
      </p>
      <PrepAssistant />
    </div>
  );
}
