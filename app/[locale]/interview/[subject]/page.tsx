import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import { SubjectInterview } from "@/components/interview/subject-interview";
import { getSubject, getQuestionsBySubject } from "@/lib/interview";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: subjectId } = await params;
  const subject = getSubject(subjectId);
  if (!subject) notFound();

  const questions = getQuestionsBySubject(subjectId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/interview" className="text-sm text-[var(--ink-soft)] hover:text-[var(--indigo)] mb-4 inline-block">
        ← 返回面试准备
      </Link>
      <PageHeader
        title={`${subject.name} 面试`}
        subtitle={subject.blurb}
        icon="🎙️"
      />
      <SubjectInterview subjectId={subject.id} subjectName={subject.name} questions={questions} />
    </div>
  );
}
