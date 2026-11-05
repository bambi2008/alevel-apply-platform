import { execFileSync } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const entries = execFileSync("rg", ["--files", "app", "-g", "page.tsx", "-g", "layout.tsx", "-g", "template.tsx", "-g", "loading.tsx", "-g", "error.tsx", "-g", "not-found.tsx", "-g", "global-error.tsx"], { encoding: "utf8", windowsHide: true }).trim().split(/\r?\n/).filter(Boolean);
const visited = new Set();
const findings = new Map();
const relative = file => path.relative(root, file).replaceAll("\\", "/");
const privateModule = file => /^(lib\/tests\/(lookup\.ts|practice-banks\.ts|mock-papers\/index\.ts|questions\/(?!types\.ts))|lib\/interview\/(questions\.ts|quantitative-interview\.ts|quantitative-interview-papers\.ts)|lib\/content-language\.ts|data\/content-language\/)/.test(relative(file));
const privateJson = value => value && typeof value === "object" && Object.entries(value).some(([key, item]) => ["answer", "matrixAnswer", "fullSolution", "solution", "solutionOutline"].includes(key) || privateJson(item));

async function resolve(from, specifier) {
  if (!specifier.startsWith("@/") && !specifier.startsWith(".")) return null;
  const base = specifier.startsWith("@/") ? path.resolve(root, specifier.slice(2)) : path.resolve(path.dirname(from), specifier);
  if (path.relative(root, base).startsWith("..")) return null;
  for (const candidate of [base, ...[".ts", ".tsx", ".js", ".mjs", "/index.ts", "/index.tsx"].map(suffix => base + suffix)]) {
    if (!/\.(?:tsx?|m?js|json)$/.test(candidate)) continue;
    try { if ((await stat(candidate)).isFile()) return candidate; } catch { /* Next extension/index candidates. */ }
  }
  return null;
}

async function visit(file, client, trace) {
  const key = `${client}:${file}`;
  if (visited.has(key)) return;
  visited.add(key);
  if (privateModule(file)) {
    if (client) findings.set(relative(file), trace);
    return; // Never traverse entire server banks during this client-boundary check.
  }
  const text = await readFile(file, "utf8");
  if (file.endsWith(".json")) {
    if (client && privateJson(JSON.parse(text))) findings.set(relative(file), trace);
    return;
  }
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const directives = [];
  for (const statement of source.statements) {
    if (!ts.isExpressionStatement(statement) || !ts.isStringLiteral(statement.expression)) break;
    directives.push(statement.expression.text);
  }
  if (directives.includes("use server")) return; // Next compiles an RPC boundary.
  client ||= directives.includes("use client");
  const imports = [];
  function walk(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const clause = node.importClause;
      const named = clause?.namedBindings;
      const typeOnly = clause?.isTypeOnly || (named && ts.isNamedImports(named) && !clause.name && named.elements.every(item => item.isTypeOnly));
      if (!typeOnly) imports.push(node.moduleSpecifier.text);
    } else if (ts.isExportDeclaration(node) && !node.isTypeOnly && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      if (!node.exportClause || !ts.isNamedExports(node.exportClause) || !node.exportClause.elements.every(item => item.isTypeOnly)) imports.push(node.moduleSpecifier.text);
    } else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require")) && node.arguments.length === 1 && ts.isStringLiteral(node.arguments[0])) {
      imports.push(node.arguments[0].text);
    }
    ts.forEachChild(node, walk);
  }
  walk(source);
  for (const specifier of imports) {
    const target = await resolve(file, specifier);
    if (target) await visit(target, client, [...trace, relative(target)]);
  }
}

for (const entry of entries) await visit(path.resolve(root, entry), false, [entry.replaceAll("\\", "/")]);
for (const [file, trace] of findings) console.error(`[question-boundary] ${file}: ${trace.join(" -> ")}`);
console.log(`[question-boundary] ${entries.length} route entries checked; ${findings.size} private client dependencies`);
if (findings.size) process.exitCode = 1;
