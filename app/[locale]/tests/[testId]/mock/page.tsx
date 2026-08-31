import { CaieWrittenPaperList } from "@/components/caie-written-paper-list";
import MixedMockRunner from "./mixed-mock-runner";

export default async function MockExamPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  // The main CTA and existing /mock bookmarks both reach fixed written papers.
  if (testId === "caie9709") return <CaieWrittenPaperList />;
  return <MixedMockRunner testId={testId} />;
}
