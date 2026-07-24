import { ADMISSIONS_TESTS } from "@/lib/tests";
import { QuestionStudio } from "@/components/admin/question-studio";

export default function QuestionStudioPage() {
  const tests = ADMISSIONS_TESTS.map((test) => ({
    id: test.id,
    abbr: test.abbr,
    nameZh: test.nameZh,
    topics: test.topics.map((topic) => ({ id: topic.id, title: topic.title })),
  }));

  return <QuestionStudio tests={tests} />;
}
