import { PageHeader } from "@/components/page-header";
import { PrepAssistant } from "@/components/application/prep-assistant";

export default function ApplyPrepPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader title="交互式填表助手" subtitle="按 UCAS / 港校申请表的栏目，一步步帮你准备好每一栏该填的内容，并保存到你的账号。它只做「准备」，不代你登录或提交——最终由你亲自在官方系统完成。" icon="📋" />
      <PrepAssistant />
    </div>
  );
}
