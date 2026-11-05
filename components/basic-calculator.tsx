"use client";
import { useCallback, useEffect, useState } from "react";
import { Delete, X } from "lucide-react";
import { useUiCopy } from "@/components/use-ui-copy";
export function BasicCalculator({ onClose }: { onClose: () => void }) {
  const ui = useUiCopy();
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [operation, setOperation] = useState<"+" | "-" | "*" | "/" | null>(null);
  const [replace, setReplace] = useState(true);

  const calculate = useCallback((left: number, right: number, op: "+" | "-" | "*" | "/") => {
    if (op === "+") return left + right;
    if (op === "-") return left - right;
    if (op === "*") return left * right;
    return right === 0 ? NaN : left / right;
  }, []);
  const inputDigit = useCallback((digit: string) => setDisplay((current) => {
    if (replace) { setReplace(false); return digit === "." ? "0." : digit; }
    if (digit === "." && current.includes(".")) return current;
    return current.length >= 14 ? current : current === "0" && digit !== "." ? digit : current + digit;
  }), [replace]);
  const selectOperation = useCallback((next: "+" | "-" | "*" | "/") => {
    const value = Number(display);
    if (stored !== null && operation && !replace) {
      const result = calculate(stored, value, operation);
      setDisplay(Number.isFinite(result) ? String(Number(result.toPrecision(12))) : "Error");
      setStored(result);
    } else setStored(value);
    setOperation(next); setReplace(true);
  }, [calculate, display, operation, replace, stored]);
  const equals = useCallback(() => {
    if (stored === null || !operation) return;
    const result = calculate(stored, Number(display), operation);
    setDisplay(Number.isFinite(result) ? String(Number(result.toPrecision(12))) : "Error");
    setStored(null); setOperation(null); setReplace(true);
  }, [calculate, display, operation, stored]);
  const clear = useCallback(() => { setDisplay("0"); setStored(null); setOperation(null); setReplace(true); }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (/^[0-9.]$/.test(event.key)) { event.preventDefault(); inputDigit(event.key); }
      if (["+", "-", "*", "/"].includes(event.key)) { event.preventDefault(); selectOperation(event.key as "+" | "-" | "*" | "/"); }
      if (event.key === "Enter" || event.key === "=") { event.preventDefault(); equals(); }
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [equals, inputDigit, onClose, selectOperation]);

  const keys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"];
  return <aside role="dialog" aria-label={ui("基础计算器")} className="fixed right-3 top-36 z-40 w-[min(18rem,calc(100vw-1.5rem))] rounded-lg border border-neutral-300 bg-white p-3 shadow-xl">
    <div className="flex items-center justify-between"><span className="text-xs font-semibold text-neutral-600">Calculator</span><button type="button" onClick={onClose} aria-label={ui("关闭计算器")} className="flex size-7 items-center justify-center rounded hover:bg-neutral-100"><X className="size-4" /></button></div>
    <output className="mt-2 block min-h-12 overflow-hidden rounded border border-neutral-300 bg-neutral-50 px-3 py-2 text-right font-mono text-xl tabular-nums">{display}</output>
    <div className="mt-2 grid grid-cols-4 gap-1.5"><button type="button" onClick={clear} className="col-span-2 rounded border border-neutral-300 py-2 text-sm font-semibold">ON/C</button><button type="button" onClick={() => setDisplay((value) => value.length > 1 ? value.slice(0, -1) : "0")} aria-label={ui("退格")} className="col-span-2 flex items-center justify-center rounded border border-neutral-300 py-2"><Delete className="size-4" /></button>{keys.map((key) => <button key={key} type="button" onClick={() => key === "=" ? equals() : ["+", "-", "*", "/"].includes(key) ? selectOperation(key as "+" | "-" | "*" | "/") : inputDigit(key)} className={`rounded border py-2.5 text-sm font-semibold ${["+", "-", "*", "/", "="].includes(key) ? "border-blue-200 bg-blue-50 text-blue-800" : "border-neutral-300"}`}>{key === "*" ? "×" : key === "/" ? "÷" : key}</button>)}</div>
  </aside>;
}
