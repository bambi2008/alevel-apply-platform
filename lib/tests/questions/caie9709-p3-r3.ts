import type { LongQuestion } from "./types";

// Cambridge 9709 (2026-2027), sections 3.1-3.9. Original training tasks.
// Student descriptions guide linked skills, not an asserted official question order.
const s = String.raw;
type Draft = Pick<LongQuestion, "topicId" | "difficulty" | "context" | "parts">;
type Part = [number, string, string];
function task(topic: string, difficulty: 1 | 2 | 3, context: string, ...parts: Part[]): Draft {
  return { topicId: `caie9709-${topic}`, difficulty, context, parts: parts.map(([marks, question, solutionOutline], i) => ({ label: `(${String.fromCharCode(97 + i)})`, marks, question, solutionOutline })) };
}
function finish(draft: Draft, paper: number, slot: number): LongQuestion {
  return { ...draft, id: `caie9709-p3-m${paper}-r3-q${String(slot).padStart(2, "0")}`, type: "long", testId: "caie9709", totalMarks: draft.parts.reduce((n, p) => n + p.marks, 0), fullSolution: draft.parts.map(p => `${p.label} ${p.solutionOutline}`).join("\n\n") };
}

const modulus: Draft[] = [
  task("algebra", 1, "",
    [4, s`Solve $|2x-3|\le5$, giving your answer as an interval.`, s`[M1] $-5\le2x-3\le5$. [M1] Add 3 and divide by 2. [A1] $-1\le x\le4$. [B1] Both endpoints are included.`]),
  task("algebra", 1, "",
    [4, s`Solve $|3x+1|>2$ and show the solution on a number line.`, s`[M1] $3x+1<-2$ or $3x+1>2$. [A1] $x<-1$ or $x>1/3$. [B1] Open endpoints at $-1,1/3$. [B1] Shade the two exterior rays, not the interval between them.`]),
  task("algebra", 2, "",
    [4, s`Solve $|x-2|\le|2x+1|$.`, s`[M1] Both sides are nonnegative, so square: $(x-2)^2\le(2x+1)^2$. [M1] $(3x-1)(x+3)\ge0$. [A1] $x\le-3$ or $x\ge1/3$. [B1] Equality includes both endpoints.`]),
  task("algebra", 2, "",
    [4, s`Solve $|2x-1|<x+2$.`, s`[B1] The right side must be positive. [M1] $-(x+2)<2x-1<x+2$. [A1] $x>-1/3$ and $x<3$. [A1] Hence $-1/3<x<3$, already satisfying $x+2>0$.`]),
  task("algebra", 2, "",
    [4, s`Solve $|x+1|\ge2x-1$, considering separately whether the right side is positive.`, s`[B1] Every $x\le1/2$ works since the right side is nonpositive. [M1] For $x>1/2$, $|x+1|=x+1$. [A1] $x+1\ge2x-1$ gives $x\le2$. [A1] Combining both cases gives $x\le2$.`]),
  task("algebra", 1, "",
    [4, s`Solve $|3x-2|=|x+4|$ and check each answer in the original equation.`, s`[M1] $3x-2=x+4$ or $3x-2=-(x+4)$. [A1] $x=3$ or $x=-1/2$. [B1] At 3 both sides are 7. [B1] At $-1/2$ both sides are $7/2$.`]),
  task("algebra", 2, "",
    [4, s`Solve $|x-1|+|x+2|\le5$.`, s`[M1] Split at $x=-2,1$. [B1] Between these points the sum is 3, so all are allowed. [M1] Outside, the sum is $-2x-1$ on the left and $2x+1$ on the right. [A1] Combining $x\ge-3$ and $x\le2$ gives $[-3,2]$.`]),
  task("algebra", 1, "",
    [4, s`Solve $|4x+1|\ge3$ and show the solution on a number line.`, s`[M1] $4x+1\le-3$ or $4x+1\ge3$. [A1] $x\le-1$ or $x\ge1/2$. [B1] Closed endpoints. [B1] Shade the two exterior rays.`]),
];

// Independently specified conditions and coefficients, checked by substitution in tests.
export const P3_COEFFICIENT_CASES = [
  { a: -2, b: -3, c: 4, r: 1, t: -2, remainder: -6 },
  { a: 1, b: -4, c: -4, r: 2, t: -1, remainder: 0 },
  { a: 3, b: 2, c: 0, r: -1, t: 2, remainder: 24 },
  { a: -1, b: -2, c: -12, r: 3, t: 1, remainder: -14 },
  { a: 2, b: 1, c: 2, r: -2, t: 1, remainder: 6 },
  { a: -3, b: 4, c: -2, r: 1, t: -1, remainder: -10 },
  { a: -4, b: 3, c: 2, r: 2, t: -2, remainder: -28 },
  { a: 1, b: -5, c: -5, r: -1, t: 3, remainder: 16 },
];
const linear = (v: number) => v < 0 ? `x+${-v}` : v === 0 ? "x" : `x-${v}`;
const signed = (v: number) => v < 0 ? `${v}` : `+${v}`;
const coefficients = P3_COEFFICIENT_CASES.map(({ a, b, c, r, t, remainder }) => task("algebra", 2,
  s`The polynomial is $P(x)=x^3+ax^2+bx${signed(c)}$. The factor $${linear(r)}$ divides $P(x)$, and the remainder on division by $${linear(t)}$ is $${remainder}$.`,
  [4, s`Use the factor theorem and remainder theorem to find $a$ and $b$.`, s`[M1] $P(${r})=0$, hence $${r*r}a${signed(r)}b=${-(r**3)-c}$. [M1] $P(${t})=${remainder}$, hence $${t*t}a${signed(t)}b=${remainder-t**3-c}$. [A1] Solving gives $a=${a}$. [A1] $b=${b}$; substitution satisfies both conditions.`]));

// f = u/(1-px) + v/(1+qx) + w/(1+qx)^2; numerator and series are authored independently.
export const P3_PARTIAL_FRACTION_CASES = [
  { p: 2, q: 1, u: 2, v: -1, w: 3, numerator: [4,-1,4], series: [4,-1,16] },
  { p: 1, q: 2, u: 1, v: 2, w: -1, numerator: [2,7,0], series: [2,1,-3] },
  { p: 3, q: 1, u: 1, v: -2, w: 2, numerator: [1,0,7], series: [1,1,13] },
  { p: 2, q: 3, u: 2, v: 1, w: -2, numerator: [1,17,12], series: [1,13,-37] },
  { p: 1, q: 1, u: 2, v: -1, w: 1, numerator: [2,3,3], series: [2,1,4] },
  { p: 0.5, q: 1, u: 2, v: 1, w: -1, numerator: [2,5,1.5], series: [2,2,-1.5] },
  { p: 2, q: 0.5, u: 1, v: 3, w: -2, numerator: [2,0.5,-2.75], series: [2,2.5,3.25] },
  { p: 4, q: 2, u: 1, v: -1, w: 1, numerator: [1,2,12], series: [1,2,24] },
];
function polynomial(values: number[]): string {
  return values.map((v, i) => v === 0 ? "" : `${v < 0 ? "-" : "+"}${Math.abs(v)}${i === 0 ? "" : i === 1 ? "x" : `x^${i}`}`).join("").replace(/^\+/, "") || "0";
}
const partialFractions = P3_PARTIAL_FRACTION_CASES.map(({ p, q, u, v, w, numerator, series }) => task("algebra", 2,
  s`Let $f(x)=\dfrac{${polynomial(numerator)}}{(1-${p}x)(1+${q}x)^2}$.`,
  [4, s`Express $f(x)$ in partial fractions, including the term for the repeated factor.`, s`[M1] Use $A/(1-${p}x)+B/(1+${q}x)+C/(1+${q}x)^2$. [M1] Clear denominators and equate coefficients. [A1] $A=${u},B=${v}$. [A1] $C=${w}$, giving the required decomposition.`],
  [3, s`Hence use binomial expansions to find the constant, $x$ and $x^2$ terms of $f(x)$.`, s`[M1] Expand $(1-${p}x)^{-1}$, $(1+${q}x)^{-1}$ and $(1+${q}x)^{-2}$ separately. [M1] Collect coefficients, remembering the squared factor contributes $-2(${q}x)+3(${q}x)^2$. [A1] $f(x)=${polynomial(series)}+\cdots$.`],
  [1, s`State the common interval of validity in terms of $x$.`, s`[B1] Intersect $|${p}x|<1$ and $|${q}x|<1$, giving $|x|<1/${Math.max(p,q)}$. A cancelled coefficient does not extend this guaranteed interval.`]));

const shortTrig: Draft[] = [
  task("trig", 1, "", [4, s`Using a compound-angle formula, solve $\sin(x+\pi/6)=\cos x$ for $0\le x<2\pi$.`, s`[M1] $(\sqrt3/2)\sin x+(1/2)\cos x=\cos x$. [M1] $\tan x=1/\sqrt3$, with no solution where $\cos x=0$. [A1] $x=\pi/6$. [A1] Also $x=7\pi/6$.`]),
  task("trig", 1, "", [4, s`Using a compound-angle formula, solve $\cos(x-\pi/4)=\sin x$ for $0\le x<2\pi$.`, s`[M1] $(\cos x+\sin x)/\sqrt2=\sin x$. [M1] $\tan x=1+\sqrt2$, checking $\cos x=0$ gives no solution. [A1] $x=3\pi/8$. [A1] Also $x=11\pi/8$.`]),
  task("trig", 1, "", [4, s`Solve $\sin(x+\pi/3)=\sin x$ for $0\le x<2\pi$, showing use of a compound-angle formula.`, s`[M1] $(1/2)\sin x+(\sqrt3/2)\cos x=\sin x$. [M1] $\tan x=\sqrt3$, and $\cos x=0$ gives no solution. [A1] $x=\pi/3$. [A1] Also $x=4\pi/3$.`]),
  task("trig", 1, "", [4, s`Solve $\cos2x=\sin x$ for $-\pi/2\le x\le\pi/2$.`, s`[M1] $1-2\sin^2x=\sin x$. [M1] $(2\sin x-1)(\sin x+1)=0$. [A1] $x=\pi/6$. [A1] Also $x=-\pi/2$, included at the endpoint.`]),
  task("trig", 1, "", [4, s`Solve $\sin2x=\cos x$ for $0\le x<2\pi$, taking care not to lose solutions.`, s`[M1] $\cos x(2\sin x-1)=0$. [A1] $\cos x=0$ gives $\pi/2,3\pi/2$. [A1] $\sin x=1/2$ gives $\pi/6,5\pi/6$. [B1] All four values are in the interval; dividing by $\cos x$ would lose two.`]),
  task("trig", 1, "", [4, s`Using a compound-angle formula, solve $\cos(x+\pi/3)=\sin x$ for $0\le x<2\pi$.`, s`[M1] $(1/2)\cos x-(\sqrt3/2)\sin x=\sin x$. [M1] $\tan x=2-\sqrt3$, checking the possible zero denominator. [A1] $x=\pi/12$. [A1] Also $x=13\pi/12$.`]),
  task("trig", 1, "", [4, s`Solve $\sin2x+\sin x=0$ for $0\le x\le2\pi$.`, s`[M1] $\sin x(2\cos x+1)=0$. [A1] $x=0,\pi,2\pi$ from the first factor. [A1] $x=2\pi/3,4\pi/3$ from the second. [B1] Include both interval endpoints.`]),
  task("trig", 1, "", [4, s`Solve $2\cos^2x+\sin x-1=0$ for $0\le x<2\pi$.`, s`[M1] $2\sin^2x-\sin x-1=0$. [M1] $(2\sin x+1)(\sin x-1)=0$. [A1] $x=\pi/2$. [A1] Also $x=7\pi/6,11\pi/6$.`]),
];

const complex: Draft[] = [
  task("complex", 2, s`The real-coefficient polynomial is $P(z)=z^3+z^2-z+15$, and $u=1+2i$ is a root.`,
    [4, s`Find the other two roots, showing a real quadratic factor.`, s`[B1] $1-2i$ is also a root. [M1] Their factor is $z^2-2z+5$. [M1] Division gives $P=(z^2-2z+5)(z+3)$. [A1] Other roots $1-2i,-3$.`],
    [4, s`Write $u$ in polar form and find $u^2$ in Cartesian form and its principal argument.`, s`[B1] $|u|=\sqrt5$, $\theta=\tan^{-1}2$. [M1] $u=\sqrt5e^{i\theta}$. [A1] $(1+2i)^2=-3+4i$. [A1] Principal argument $\pi-\tan^{-1}(4/3)$.`],
    [3, s`On an Argand diagram shade $|z-u|\le2$ and $\operatorname{Im}z\ge2$. Mark boundary intersections and show whether boundaries are included.`, s`[B1] Circle centre $(1,2)$, radius 2. [B1] Shade the upper half-disc above $y=2$. [B1] Intersections $(-1,2),(3,2)$; both straight and circular boundaries are solid and included.`]),
  task("complex", 2, s`The equation is $z^2-2z+10=0$. Let $u$ be the root with positive imaginary part.`,
    [4, s`Find both roots, showing your working.`, s`[M1] Complete the square: $(z-1)^2=-9$. [M1] $z-1=\pm3i$. [A1] Roots $1\pm3i$. [B1] $u=1+3i$.`],
    [4, s`Write $u$ in polar form and find $1/u$ in Cartesian and polar forms.`, s`[B1] $u=\sqrt{10}e^{i\tan^{-1}3}$. [M1] Multiply by the conjugate. [A1] $1/u=(1-3i)/10$. [A1] Polar form $(1/\sqrt{10})e^{-i\tan^{-1}3}$.`],
    [3, s`On an Argand diagram shade $|z-1|\le3$ and $\operatorname{Im}z\ge0$, marking its real-axis intercepts.`, s`[B1] Circle centre $(1,0)$, radius 3. [B1] Shade the upper half-disc. [B1] Intercepts $(-2,0),(4,0)$; both boundaries are included.`]),
  task("complex", 2, s`The equation is $z^2=5-12i$. Let $u$ be the root with positive real part.`,
    [4, s`Find both roots in exact Cartesian form by writing $z=a+bi$.`, s`[M1] $a^2-b^2=5,2ab=-12$. [M1] $a^2+b^2=13$, giving $a^2=9,b^2=4$. [A1] Signs are opposite. [A1] Roots $3-2i,-3+2i$; $u=3-2i$.`],
    [4, s`Find the modulus and principal argument of each root.`, s`[B1] Both moduli are $\sqrt{13}$. [M1] Locate each quadrant. [A1] For $u$, argument $-\tan^{-1}(2/3)$. [A1] For $-u$, argument $\pi-\tan^{-1}(2/3)$.`],
    [3, s`On an Argand diagram shade $|z-u|<2$ and $\operatorname{Re}z\ge3$. Show the boundary conventions.`, s`[B1] Circle centre $(3,-2)$, radius 2, dashed. [B1] Shade its right half-disc, with $x=3$ included inside the circle. [B1] Boundary intersections $(3,0),(3,-4)$ are excluded because the circle inequality is strict.`]),
  task("complex", 3, s`The polynomial is $P(z)=z^4-4z^3+14z^2-20z+25$. The number $1+2i$ is a repeated root.`,
    [4, s`Factorise $P$ over the reals and state all roots with their multiplicities.`, s`[B1] $1-2i$ is also repeated. [M1] The conjugate pair gives $z^2-2z+5$. [M1] Squaring gives the stated polynomial. [A1] Roots $1+2i,1-2i$, each multiplicity 2.`],
    [4, s`Let $u=1+2i$. Find $u/\bar u$ in Cartesian form and its modulus and principal argument.`, s`[M1] Multiply the quotient by $u/u$. [A1] $u/\bar u=(-3+4i)/5$. [B1] Modulus 1. [A1] Principal argument $\pi-\tan^{-1}(4/3)$.`],
    [3, s`On an Argand diagram draw the set satisfying $|z-u|=|z-\bar u|$ and $|z-u|\le\sqrt5$.`, s`[B1] Equal distances give the real axis $y=0$. [M1] $(x-1)^2+4\le5$. [A1] Draw the closed segment from 0 to 2 on the real axis; this is a segment, not a two-dimensional shaded disc.`]),
  task("complex", 2, s`The real-coefficient polynomial is $P(z)=z^3+3z^2+7z+5$ with root $u=-1+2i$.`,
    [4, s`Find all remaining roots, showing your factorisation.`, s`[B1] The conjugate root is $-1-2i$. [M1] Pair factor $z^2+2z+5$. [M1] $P=(z+1)(z^2+2z+5)$. [A1] Remaining roots $-1-2i,-1$.`],
    [4, s`Write $u$ and its conjugate in polar form using principal arguments.`, s`[B1] Both moduli are $\sqrt5$. [M1] Put the roots in quadrants II and III. [A1] $u=\sqrt5e^{i(\pi-\tan^{-1}2)}$. [A1] $\bar u=\sqrt5e^{i(-\pi+\tan^{-1}2)}$.`],
    [3, s`On an Argand diagram shade $|z+1|\le\sqrt5$ and $\operatorname{Im}z\ge2$, marking boundary intersections.`, s`[B1] Circle centre $(-1,0)$, radius $\sqrt5$. [M1] At $y=2$, $(x+1)^2=1$. [A1] Intersections $(-2,2),(0,2)$; shade the top circular cap, including both boundaries.`]),
  task("complex", 2, s`The equation is $z^2-4z+5=0$. Let $u$ be its root above the real axis.`,
    [4, s`Find both roots and check them in the equation.`, s`[M1] $(z-2)^2=-1$. [A1] Roots $2+i,2-i$. [B1] Substitution of either root gives zero. [B1] $u=2+i$.`],
    [4, s`Find $u/\bar u$ in Cartesian form and state its modulus and principal argument.`, s`[M1] Multiply by the denominator's conjugate. [A1] Quotient $(3+4i)/5$. [B1] Modulus 1. [A1] Argument $\tan^{-1}(4/3)$.`],
    [3, s`On an Argand diagram shade $|z-u|\le1$, $\operatorname{Re}z\le2$ and $\operatorname{Im}z\ge1$.`, s`[B1] Circle centre $(2,1)$, radius 1. [B1] Shade its upper-left quarter-disc. [B1] Straight edges meet at $(2,1)$ and the arc endpoints are $(1,1),(2,2)$; all boundaries are included.`]),
  task("complex", 2, s`The equation is $z^2=-3+4i$. Let $u$ be the root with positive imaginary part.`,
    [4, s`Find the roots in Cartesian form with full working.`, s`[M1] With $z=a+bi$, $a^2-b^2=-3,2ab=4$. [M1] $a^2+b^2=5$. [A1] $a^2=1,b^2=4$, with equal signs. [A1] Roots $1+2i,-1-2i$; $u=1+2i$.`],
    [4, s`Write $u$ in polar form and find $u^4$ by squaring twice.`, s`[B1] $u=\sqrt5e^{i\tan^{-1}2}$. [M1] $u^2=-3+4i$. [M1] Square again. [A1] $u^4=-7-24i$.`],
    [3, s`On an Argand diagram shade the intersection $|z-u|\le\sqrt5$ and $|z-\bar u|\le\sqrt5$, marking the circle intersections.`, s`[B1] Equal radii, centres $(1,2),(1,-2)$. [M1] Subtraction of circle equations gives $y=0$; then $(x-1)^2=1$. [A1] Intersections $(0,0),(2,0)$; shade the closed lens belonging to both discs.`]),
  task("complex", 3, s`The real-coefficient polynomial is $P(z)=z^3-2z^2-3z+10$, and $u=2+i$ is a root.`,
    [4, s`Find the other roots by forming a quadratic factor.`, s`[B1] Conjugate root $2-i$. [M1] Factor $z^2-4z+5$. [M1] $P=(z+2)(z^2-4z+5)$. [A1] Other roots $2-i,-2$.`],
    [4, s`Find $1/u$ in Cartesian form and in polar form using its principal argument.`, s`[M1] Rationalise with $2-i$. [A1] $1/u=(2-i)/5$. [B1] Modulus $1/\sqrt5$. [A1] Polar form $(1/\sqrt5)e^{-i\tan^{-1}(1/2)}$.`],
    [3, s`On an Argand diagram shade $|z-u|\le\sqrt5$ with $0\le\arg z\le\pi/4$, excluding $z=0$. Mark where each ray meets the circle.`, s`[B1] Use the closed disc centred $(2,1)$ inside the sector between $y=0$ and $y=x$. [M1] On $y=0$ the nonzero endpoint is $(4,0)$; on $y=x$ it is $(3,3)$. [A1] Shade their common region; ray and arc boundaries are included, but the origin is an open point because its argument is undefined.`]),
];

const linkedCalculus: Draft[] = [
  task("integration", 3, "",
    [2, s`Use compound-angle and double-angle formulae to prove $\sin3x=3\sin x-4\sin^3x$.`, s`[M1] Expand $\sin(2x+x)=\sin2x\cos x+\cos2x\sin x$. [A1] Use $\cos^2x=1-\sin^2x$ to obtain $3\sin x-4\sin^3x$.`],
    [3, s`Hence evaluate $\int_0^{\pi/2}\sin^3x\,dx$ exactly.`, s`[M1] Rewrite as $(3\sin x-\sin3x)/4$. [M1] Antiderivative $-3\cos x/4+\cos3x/12$. [A1] Integral $2/3$.`],
    [3, s`Using $u=\cos x$, evaluate $\int_0^{\pi/2}\sin^3x\cos^2x\,dx$ exactly.`, s`[M1] Write $\sin^3x=\sin x(1-\cos^2x)$ and change limits. [M1] Integral becomes $\int_0^1(u^2-u^4)du$. [A1] Result $2/15$.`]),
  task("integration", 3, "",
    [2, s`Differentiate $\cot x=\cos x/\sin x$.`, s`[M1] Quotient rule. [A1] Derivative $-(\sin^2x+\cos^2x)/\sin^2x=-\cosec^2x$.`],
    [3, s`Hence evaluate $\int_{\pi/4}^{\pi/2}\cot x\cosec^2x\,dx$.`, s`[M1] Antiderivative $-\cot^2x/2$. [M1] Limits have cotangents 1 and 0. [A1] Integral $1/2$.`],
    [3, s`Using $u=\cot x$ and $\cosec^2x=1+\cot^2x$, evaluate $\int_{\pi/4}^{\pi/2}\cosec^4x\,dx$.`, s`[M1] $du=-\cosec^2x\,dx$. [M1] Integral becomes $\int_0^1(1+u^2)du$. [A1] Result $4/3$.`]),
  task("integration", 2, "",
    [2, s`Derive $\cos2x=2\cos^2x-1$ from the cosine compound-angle formula.`, s`[M1] $\cos(x+x)=\cos^2x-\sin^2x$. [A1] Use $\sin^2x=1-\cos^2x$.`],
    [3, s`Hence evaluate $\int_0^{\pi/3}\cos^2x\,dx$ exactly.`, s`[M1] Rewrite as $(1+\cos2x)/2$. [M1] Antiderivative $x/2+\sin2x/4$. [A1] Result $\pi/6+\sqrt3/8$.`],
    [3, s`Without another integration, deduce $\int_0^{\pi/3}\sin^2x\,dx$.`, s`[B1] The two integrands sum to 1. [M1] Subtract the preceding integral from $\pi/3$. [A1] Result $\pi/6-\sqrt3/8$.`]),
  task("integration", 3, "",
    [2, s`Differentiate $\tan^3x$ and express the result using $\sec^4x$ and $\sec^2x$.`, s`[M1] Chain rule gives $3\tan^2x\sec^2x$. [A1] This is $3(\sec^4x-\sec^2x)$.`],
    [3, s`Hence evaluate $\int_0^{\pi/4}\sec^4x\,dx$.`, s`[M1] Antiderivative $\tan^3x/3+\tan x$. [M1] Substitute 0 and $\pi/4$. [A1] Result $4/3$.`],
    [3, s`Deduce $\int_0^{\pi/4}\tan^4x\,dx$.`, s`[M1] $\tan^4x=\sec^4x-2\sec^2x+1$. [M1] Combine the preceding integral, $\int\sec^2x\,dx$ and the interval length. [A1] Result $\pi/4-2/3$.`]),
  task("integration", 3, s`Let $f(x)=e^x\sin x$ for $0\le x\le\pi$, and $F(x)=e^x(\sin x-\cos x)$.`,
    [3, s`Find the maximum value of $f$ on the stated interval.`, s`[M1] $f'=e^x(\sin x+\cos x)$. [M1] Stationary value at $x=3\pi/4$, with derivative changing from positive to negative; endpoints give zero. [A1] Maximum $e^{3\pi/4}/\sqrt2$.`],
    [3, s`Differentiate $F$ and show that $F'=2f$.`, s`[M1] Apply the product rule. [M1] Combine $\sin x-\cos x+\cos x+\sin x$. [A1] $F'=2e^x\sin x=2f$.`],
    [2, s`Hence evaluate $\int_0^{\pi/2} f(x)\,dx$ exactly.`, s`[M1] Evaluate $[F/2]_0^{\pi/2}$. [A1] Result $(e^{\pi/2}+1)/2$.`]),
  task("integration", 3, s`Let $F(x)=(x^2+ax+b)e^{2x}$.`,
    [3, s`Find $a,b$ so that $F'(x)=2x^2e^{2x}$.`, s`[M1] Product rule gives coefficients $2+2a$ and $a+2b$. [A1] $a=-1$. [A1] $b=1/2$.`],
    [3, s`Hence evaluate $\int_0^1x^2e^{2x}dx$ exactly.`, s`[M1] Use $F/2$ as an antiderivative. [M1] At 1 and 0 the values are $e^2/4$ and $1/4$. [A1] Result $(e^2-1)/4$.`],
    [2, s`By recognising a derivative, evaluate $\int_0^1(2x^2+2x)e^{2x}dx$.`, s`[M1] Integrand is the derivative of $x^2e^{2x}$. [A1] Result $e^2$.`]),
  task("integration", 3, s`Use the substitution $u=2+\sin x$ in the following integrals.`,
    [3, s`Evaluate $I=\int_0^{\pi/2}\cos x/(2+\sin x)^2dx$ exactly.`, s`[M1] $du=\cos x\,dx$, limits 2 and 3. [M1] Antiderivative $-1/u$. [A1] $I=1/6$.`],
    [3, s`Using the same substitution, evaluate $J=\int_0^{\pi/2}\sin x\cos x/(2+\sin x)^2dx$.`, s`[M1] Replace $\sin x$ by $u-2$. [M1] Antiderivative $\ln u+2/u$. [A1] $J=\ln(3/2)-1/3$.`],
    [2, s`Verify the antiderivative of the first integrand by differentiation.`, s`[M1] Differentiate $-(2+\sin x)^{-1}$. [A1] The result is $\cos x/(2+\sin x)^2$, verifying the substitution result.`]),
  task("integration", 3, s`Let $F(x)=x\sin2x+\tfrac12\cos2x$.`,
    [2, s`Show by differentiation that $F'(x)=2x\cos2x$.`, s`[M1] Product and chain rules. [A1] The $\sin2x$ terms cancel, leaving $2x\cos2x$.`],
    [3, s`Hence evaluate $\int_0^{\pi/4}x\cos2x\,dx$ exactly.`, s`[M1] Antiderivative $F/2$. [M1] $F(\pi/4)=\pi/4$, $F(0)=1/2$. [A1] Result $\pi/8-1/4$.`],
    [3, s`Deduce $\int_0^{\pi/4}x\sin^2x\,dx$ exactly.`, s`[M1] $\sin^2x=(1-\cos2x)/2$. [M1] Subtract half the previous integral from $\int_0^{\pi/4}x/2\,dx$. [A1] Result $\pi^2/64-\pi/16+1/8$.`]),
];

function repairFoundation(question: LongQuestion): Draft {
  const draft: Draft = { ...question, parts: question.parts.map(p => ({ ...p })) };
  const projections: Record<string, string> = {
    "caie9709-p3-m1-q11": s`[M1] Set $H=t(2,1,-1)$ on $OB$. [M1] $(A-H)\cdot(2,1,-1)=0$ gives $t=0$. [A1] Thus $H=O$. [A1] Distance $|A|=\sqrt5$.`,
    "caie9709-p3-m2-q11": s`[M1] $H=t(2,1,1)$ and $(A-H)\cdot(2,1,1)=0$. [A1] $4-6t=0$, so $H=(4/3,2/3,2/3)$. [M1] $|A-H|^2=5-16/6=7/3$. [A1] Distance $\sqrt{21}/3$.`,
    "caie9709-p3-m3-q11": s`[M1] $H=t(2,-1,0)$ and $(A-H)\cdot(2,-1,0)=0$. [A1] $1-5t=0$, so $H=(2/5,-1/5,0)$. [M1] $|A-H|^2=6-1/5=29/5$. [A1] Distance $\sqrt{145}/5$.`,
    "caie9709-p3-m4-q11": s`[M1] $H=t(1,2,2)$ and $(A-H)\cdot(1,2,2)=0$. [A1] $4-9t=0$, so $H=(4/9,8/9,8/9)$. [M1] $|A-H|^2=5-16/9=29/9$. [A1] Distance $\sqrt{29}/3$.`,
  };
  if (projections[question.id]) draft.parts[0].solutionOutline = projections[question.id];
  if (question.id === "caie9709-p3-m2-q02") draft.parts = task("complex", 1, "",
    [4, s`Find both square roots of $2-2\sqrt3i$ in exact Cartesian form, showing full working.`, s`[M1] Put $w=a+bi$: $a^2-b^2=2$, $2ab=-2\sqrt3$. [M1] $a^2+b^2=4$. [A1] $a^2=3,b^2=1$, with opposite signs. [A1] Roots $\sqrt3-i,-\sqrt3+i$.`]).parts;
  if (question.id === "caie9709-p3-m3-q02") draft.parts = task("complex", 1, "",
    [4, s`Find both square roots of $-8+6i$ in exact Cartesian form, showing full working.`, s`[M1] Put $w=a+bi$: $a^2-b^2=-8$, $2ab=6$. [M1] $a^2+b^2=10$. [A1] $a^2=1,b^2=9$, with equal signs. [A1] Roots $1+3i,-1-3i$.`]).parts;
  if (question.id === "caie9709-p3-m3-q06") draft.parts[1] = {
    label: "(b)", marks: 4,
    question: s`Use the given iteration $x_{n+1}=(5-x_n)^{1/3}$ with $x_1=1.5$ to find $\alpha$ to 4 decimal places. Verify the accuracy using a sign change at the rounding boundaries.`,
    solutionOutline: s`[M1] Rearrange $x^3+x=5$ to $x=(5-x)^{1/3}$. [M1] Iterate with full calculator precision to $1.5159802277$. [M1] For $f=x^3+x-5$, $f(1.51595)<0<f(1.51605)$. [A1] $\alpha=1.5160$ to 4 decimal places.`,
  };
  // Supply the substitutions already used by these worked solutions.
  if (question.id === "caie9709-p3-m1-q10") draft.parts[0].question = s`Using $u=x^2+2$, evaluate $I=\int_0^1 x^3/(x^2+2)^2dx$ exactly.`;
  if (question.id === "caie9709-p3-m8-q09") draft.parts[1].question = s`The mean value of a function on $[a,b]$ is defined as $\frac1{b-a}\int_a^b f(x)dx$. Hence find the mean value of $x\ln x$ on $[1,e]$.`;
  return draft;
}

export function buildP3R3(foundation: LongQuestion[][], previous: LongQuestion[][]) {
  const targetedIds = new Set<string>();
  const papers = foundation.map((paper, i) => paper.map((q, j) => finish(repairFoundation(q), i+1, j+1)));
  previous.forEach((paper, i) => {
    const numerical: Draft = { ...paper[6], parts: paper[6].parts.map(p => ({ ...p })) };
    if (i === 3 || i === 5) {
      numerical.context = i === 3 ? s`The curves are $y=e^x$ and $y=-x^2/6$. Their tangents at points with the same positive $x$-coordinate $\alpha$ are perpendicular.` : s`The curves are $y=\ln x$ and $y=e^{-x}$. Their tangents at points with the same positive $x$-coordinate $\alpha$ are perpendicular.`;
      numerical.parts[0] = { label: "(a)", marks: 2, question: i === 3 ? s`Show that $\alpha e^\alpha=3$.` : s`Show that $\alpha=e^{-\alpha}$.`, solutionOutline: i === 3 ? s`[M1] Gradients $e^\alpha,-\alpha/3$ have product $-1$. [A1] Hence $\alpha e^\alpha=3$.` : s`[M1] Gradients $1/\alpha,-e^{-\alpha}$ have product $-1$. [A1] Hence $\alpha=e^{-\alpha}$.` };
      if (i === 3) numerical.parts[2] = {
        label: "(c)", marks: 3,
        question: s`Explain how the given iteration $x_{n+1}=\frac12[x_n+\ln(3/x_n)]$ relates to the equation. Starting with $x_1=1$, find $\alpha$ to 4 decimal places and check the rounding boundaries. Display at least 5 decimal places in intermediate values.`,
        solutionOutline: s`[M1] At a fixed point, $2x=x+\ln(3/x)$, so $xe^x=3$. The first three updates are $1.0493061,1.0498947,1.0499086$. [M1] Continue with full precision to $1.049908895$; $f(1.04985)<0<f(1.04995)$ for $f(x)=xe^x-3$. [A1] $\alpha=1.0499$ to 4 decimal places.`,
      };
    }
    const de: Draft = { ...paper[5], parts: paper[5].parts.map(p => ({ ...p })) };
    if (i === 0) de.parts = [
      { label: "(a)", marks: 2, question: s`Express $600/[P(600-P)]$ in partial fractions.`, solutionOutline: s`[M1] Write $A/P+B/(600-P)$ and clear denominators. [A1] $A=B=1$.` },
      { ...paper[5].parts[0], label: "(b)", marks: 3, question: s`Hence separate variables and use both given observations to find $P(t)$.`, solutionOutline: s`[M1] Integrate to $\ln(P/(600-P))=kt+C$. [M1] $P(0)=150$ gives $P=600/(1+3e^{-kt})$; $P(2)=300$ gives $k=\ln3/2$. [A1] $P=600/(1+3e^{-t\ln3/2})$.` },
      { ...paper[5].parts[1], label: "(c)" },
    ];
    const slots: Array<{ draft: Draft; targeted: boolean }> = [
      { draft: modulus[i], targeted: false }, { draft: coefficients[i], targeted: false },
      { draft: paper[1], targeted: true }, { draft: shortTrig[i], targeted: false },
      { draft: paper[4], targeted: true }, { draft: numerical, targeted: true },
      { draft: complex[i], targeted: false }, { draft: partialFractions[i], targeted: true },
      { draft: de, targeted: false }, { draft: linkedCalculus[i], targeted: true },
      { draft: paper[10], targeted: i < 4 },
    ];
    // Keep a short opening and alternate the later linked tasks across papers.
    const order = i % 2 === 0 ? [0,1,2,3,4,5,6,7,8,9,10] : [0,2,1,3,4,7,5,10,6,8,9];
    papers.push(order.map((index, j) => {
      const item = slots[index], q = finish(item.draft, i+9, j+1);
      if (item.targeted) targetedIds.add(q.id);
      return q;
    }));
  });
  return { papers, targetedIds };
}
