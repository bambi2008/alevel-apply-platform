import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
const locale = vi.hoisted(() => ({ value: "zh-CN" }));
vi.mock("next-intl", () => ({ useLocale: () => locale.value }));
vi.mock("@/i18n/navigation", () => ({ Link: ({ children, href }: { children: ReactNode; href: string }) => createElement("a", { href }, children) }));
import { QuestionFeedback, QuestionFeedbackProvider } from "../../components/question-feedback";

it.each(["zh-CN", "en"])("keeps all three feedback buttons disabled for anonymous %s readers", value => {
  locale.value = value;
  const html = renderToStaticMarkup(
    <QuestionFeedbackProvider loggedIn={false}>
      <QuestionFeedback questionId="fixture-question" testId="tmua" />
    </QuestionFeedbackProvider>,
  );
  expect(html.match(/<button\b/g)).toHaveLength(3);
  expect(html.match(/disabled=""/g)).toHaveLength(3);
  expect(html).toContain(value === "en" ? "Sign in to give feedback" : "登录后可反馈");
  for (const label of value === "en" ? ["Question error", "Too hard", "More like this"] : ["题目有误", "太难了", "想要更多这类题"]) expect(html).toContain(label);
});
