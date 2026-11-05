import { Fragment } from "react";
import { PUBLIC_CONTACT_EMAIL, PUBLIC_CONTACT_HREF } from "@/lib/site-config";

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith("**")
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : <Fragment key={index}>{part.split(PUBLIC_CONTACT_EMAIL).map((value, i) => <Fragment key={i}>{i > 0 && <a href={PUBLIC_CONTACT_HREF} className="underline">{PUBLIC_CONTACT_EMAIL}</a>}{value}</Fragment>)}</Fragment>);
}

/** Narrow Markdown for approved prose. Never inject document HTML or URLs. */
export function StaticProse({ text }: { text: string }) {
  return <article className="space-y-6 text-base leading-8">{text.split(/\n\s*\n/).map((block, i) => {
    if (block.startsWith("#### ")) return <h2 key={i} className="pt-7 text-2xl font-semibold tracking-tight">{inline(block.slice(5))}</h2>;
    if (block.startsWith("### ")) return <h1 key={i} className="text-4xl font-semibold tracking-tight">{inline(block.slice(4))}</h1>;
    if (block.startsWith("- ")) return <ul key={i} className="list-disc space-y-3 pl-6">{block.split("\n").map((line, j) => <li key={j}>{inline(line.replace(/^- /, ""))}</li>)}</ul>;
    return <p key={i}>{inline(block)}</p>;
  })}</article>;
}
