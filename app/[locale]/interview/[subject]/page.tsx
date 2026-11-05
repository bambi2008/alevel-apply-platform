import { notFound, redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/page-header";
import { SubjectInterview } from "@/components/interview/subject-interview";
import { getSubject, getQuestionsBySubject } from "@/lib/interview";
import { setRequestLocale } from "next-intl/server";
import { INTERVIEW_BLURBS_EN } from "@/lib/interview/presentation";
import { localizeStaticContent } from "@/lib/content-language";
import { getQuantitativeDrills } from "@/lib/interview/quantitative-interview";
import { getQuantitativeInterviewPapers } from "@/lib/interview/quantitative-interview-papers";
import { auth } from "@/auth";
import { membershipAccess } from "@/lib/membership/access";
import { MembershipRequired } from "@/components/membership-required";
import { seasonPassOffer } from "@/lib/membership/config";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string; locale: string }>;
}) {
  const { subject: subjectId, locale } = await params;
  setRequestLocale(locale);
  const en = locale === "en";
  const subject = getSubject(subjectId);
  if (!subject) notFound();
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect(`/${locale}/login`);
  const access = await membershipAccess(userId);
  if (!access.active) return <MembershipRequired offer={seasonPassOffer()} expiredTrial={access.membership?.plan === "trial"} />;

  const questions = localizeStaticContent(getQuestionsBySubject(subjectId), locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/interview" className="text-sm text-[var(--ink-soft)] hover:text-[var(--indigo)] mb-4 inline-block">
        ← {en ? "Back to interviews" : "返回面试准备"}
      </Link>
      <PageHeader
        title={en ? (/interview/i.test(subject.nameEn) ? subject.nameEn : `${subject.nameEn} interview`) : `${subject.name} 面试`}
        subtitle={en ? INTERVIEW_BLURBS_EN[subject.id] : subject.blurb}
      />
      <SubjectInterview subjectId={subject.id} subjectName={en ? subject.nameEn : subject.name} questions={questions}
        quantitativeDrills={localizeStaticContent(getQuantitativeDrills(subjectId), locale)}
        quantitativePapers={localizeStaticContent(getQuantitativeInterviewPapers(subjectId), locale)} />
    </div>
  );
}
