import { PageHeader } from "@/components/page-header";
import { EnglishPrepCenter } from "@/components/english-prep-center";

export default function EnglishPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="English requirements"
        title="IELTS / 英语要求备考中心"
        subtitle="把院校门槛、四项分差、专项训练、写作评分和口语模拟放进同一条可执行路径。"
        icon="Aa"
      />
      <EnglishPrepCenter />
    </div>
  );
}
