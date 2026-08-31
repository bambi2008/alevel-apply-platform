import type { LongPart, LongQuestion } from "./types";
import { CAIE9709_P3_CANDIDATE_TARGETED_QUESTIONS as legacy } from "./caie9709-candidate-targeted";

// Original questions. External examples informed the review criteria, not these prompts.
// R2 IDs deliberately do not reuse a student's R1 answer/progress keys.
const s = String.raw;
type Part = [number, string, string];
type Draft = Pick<LongQuestion, "topicId" | "difficulty" | "context" | "parts">;
function draft(topic: string, difficulty: 1 | 2 | 3, context: string, ...parts: Part[]): Draft {
  return { topicId: `caie9709-${topic}`, difficulty, context, parts: parts.map(([marks, question, solutionOutline], i): LongPart => ({ label: `(${String.fromCharCode(97 + i)})`, marks, question, solutionOutline })) };
}

const algebra: Draft[] = [
  draft("algebra", 2, s`Let $f(x)=(1+x)(1-2x)^{-1/2}$.`,
    [3, s`Find the expansion through $x^2$.`, s`[M1] $(1-2x)^{-1/2}=1+x+3x^2/2+\cdots$. [M1] Multiply by $1+x$, collecting cross terms. [A1] $f(x)=1+2x+5x^2/2+\cdots$.`],
    [1, s`State the interval of validity and explain why $x=0.6$ cannot be used in this expansion.`, s`[B1] $|2x|<1$, hence $-1/2<x<1/2$; $0.6$ is outside. The polynomial factor does not extend the binomial series domain.`]),
  draft("algebra", 2, s`Let $f(x)=(1-3x)^{-1}(1+x)^{-1}$.`,
    [3, s`Expand $f(x)$ through $x^2$.`, s`[M1] Factors give $1+3x+9x^2$ and $1-x+x^2$. [M1] Include the product of the linear terms. [A1] $1+2x+7x^2+\cdots$.`],
    [1, s`State the common interval of validity of the two series.`, s`[B1] Intersect $|3x|<1$ with $|x|<1$: $-1/3<x<1/3$.`]),
  draft("algebra", 2, s`The coefficient of $x$ in $(1+ax)(1+4x)^{-1/2}$ is zero.`,
    [3, s`Find $a$ and then the coefficient of $x^2$.`, s`[M1] Expand the second factor as $1-2x+6x^2+\cdots$. [A1] $a-2=0$, so $a=2$. [A1] Quadratic coefficient $6-2a=2$.`],
    [1, s`State the interval of validity. Does cancelling the linear term enlarge it?`, s`[B1] $-1/4<x<1/4$; cancellation of a coefficient does not change the expansion condition $|4x|<1$.`]),
  draft("algebra", 2, s`Let $f(x)=(4-2x)^{-1/2}$.`,
    [3, s`Expand through $x^2$ and use the expansion to estimate $1/\sqrt{3.8}$.`, s`[M1] Factor out $4$: $f=\frac12(1-x/2)^{-1/2}$. [A1] $f=1/2+x/8+3x^2/64+\cdots$. [A1] Set $x=0.1$, giving $0.51296875$.`],
    [1, s`State the interval of validity for $x$, not for the substituted variable.`, s`[B1] $|x/2|<1$, so $-2<x<2$.`]),
  draft("algebra", 2, s`For $x\ne0$, let $f(x)=((1+x)^{-2}-1+2x)/x^2$.`,
    [3, s`Find the constant and linear terms in the expansion of $f(x)$.`, s`[M1] Expand the numerator to cubic order: $1-2x+3x^2-4x^3+\cdots-1+2x$. [M1] Divide by $x^2$. [A1] $f(x)=3-4x+\cdots$.`],
    [1, s`State the interval of validity, respecting the domain in the definition of $f$.`, s`[B1] $-1<x<1$ with $x\ne0$; the original quotient is undefined at zero even though the series has a limiting value there.`]),
  draft("algebra", 2, s`Let $f(x)=(1-x)^{1/2}/(1+x)$.`,
    [3, s`Expand through $x^2$.`, s`[M1] Use $1-x/2-x^2/8$ and $1-x+x^2$. [M1] Multiply and collect cross terms. [A1] $1-3x/2+11x^2/8+\cdots$.`],
    [1, s`State the common open interval of validity guaranteed by the binomial expansions.`, s`[B1] Both require $|x|<1$, giving $-1<x<1$. Endpoint convergence is not asserted.`]),
  draft("algebra", 2, s`A series is required for $f(t)=(3-2t)^{-1/2}$ in powers of $h=t-1$.`,
    [3, s`Find its first three terms in powers of $h$.`, s`[M1] $t=1+h$, so $3-2t=1-2h$. [M1] Use exponent $-1/2$ in the binomial formula. [A1] $1+h+3h^2/2+\cdots$.`],
    [1, s`State the interval of validity in terms of $t$.`, s`[B1] $|2(t-1)|<1$, so $1/2<t<3/2$.`]),
  draft("algebra", 2, s`Let $f(x)=(1-2x)^{-1/2}+(1+2x)^{-1/2}$.`,
    [3, s`Explain the absence of odd powers and find the constant and quadratic terms.`, s`[M1] Replacing $x$ by $-x$ exchanges the summands, so $f$ is even. [M1] Each expansion has constant 1 and quadratic coefficient $3/2$. [A1] $f(x)=2+3x^2+\cdots$.`],
    [1, s`State the common interval of validity; does cancellation permit $x=0.75$?`, s`[B1] $-1/2<x<1/2$; no, both binomial expansion restrictions remain.`]),
];

const models: Draft[] = [
  draft("log-exp", 2, s`A decay model is $y=ke^{-ax}$, with $k,a>0$. Its straight-line plot of $\ln y$ against $x$ passes through $(1,\ln12)$ and $(3,\ln3)$.`,
    [3, s`Find $a$ and $k$, not merely $\ln k$.`, s`[M1] Gradient $-a=(\ln3-\ln12)/2=-\ln2$. [A1] $a=\ln2$. [A1] $\ln k=\ln12+a=\ln24$, hence $k=24$.`],
    [1, s`Find the least $x\ge0$ for which $y\le1.5$.`, s`[B1] $24\,2^{-x}\le1.5$ gives $x\ge4$; least value 4.`]),
  draft("log-exp", 2, s`A power model $y=kx^n$ has $x>0$. The plot of $\ln y$ against $\ln x$ passes through $(\ln2,\ln3)$ and $(\ln8,\ln24)$.`,
    [3, s`Determine $n$ and $k$, not merely $\ln k$.`, s`[M1] $n=\ln(24/3)/\ln(8/2)$. [A1] $n=3/2$. [A1] $k=3/2^{3/2}=3/(2\sqrt2)$.`],
    [1, s`Find the factor by which $x$ must increase to double $y$.`, s`[B1] If the factor is $c$, $c^{3/2}=2$, so $c=2^{2/3}$.`]),
  draft("log-exp", 2, s`A model is $y=k(x-1)^n$, $x>1$, with observed points $(2,5)$ and $(5,80)$.`,
    [3, s`State a straight-line transformation and determine $n$ and $k$, not merely $\ln k$.`, s`[M1] Plot $\ln y$ against $\ln(x-1)$: $\ln y=\ln k+n\ln(x-1)$. [A1] First point gives $k=5$. [A1] $4^n=16$, so $n=2$.`],
    [1, s`Solve $y=45$ within the model's domain.`, s`[B1] $(x-1)^2=9$; reject $x=-2$ since $x>1$, leaving $x=4$.`]),
  draft("log-exp", 2, s`A positive model satisfies $y=kxe^{-ax}$ for $x>0$. The graph of $\ln(y/x)$ against $x$ has gradient $-2$ and intercept $\ln7$.`,
    [2, s`Find $a$ and $k$, not merely $\ln k$.`, s`[M1] $\ln(y/x)=\ln k-ax$. [A1] $a=2,k=7$.`],
    [2, s`Find the maximum value of $y$.`, s`[M1] $y'=7e^{-2x}(1-2x)$ changes from positive to negative at $x=1/2$. [A1] Maximum $7/(2e)$.`]),
  draft("log-exp", 2, s`A cooling model is $T=20+ke^{-at}$. At $t=0$, $T=100$; at $t=6$, $T=40$.`,
    [3, s`Use a logarithmic straight-line form to find $a$ and $k$, not merely $\ln k$.`, s`[M1] Transform $\ln(T-20)=\ln k-at$, not $\ln T$. [A1] $k=80$. [A1] $20=80e^{-6a}$ gives $a=\ln4/6$.`],
    [1, s`Explain whether this model ever predicts $T=20$ at finite $t$.`, s`[B1] No: $80e^{-at}>0$ for every finite $t$; 20 is approached only as $t\to\infty$.`]),
  draft("log-exp", 2, s`A plot of $\log_{10}y$ against $x$ is the line $Y=0.3x-2$. The proposed model is $y=ka^x$.`,
    [3, s`Find exact $a$ and $k$, not merely $\ln k$ or $\log_{10}k$.`, s`[M1] $\log_{10}y=\log_{10}k+x\log_{10}a$. [A1] $a=10^{0.3}$. [A1] $k=10^{-2}=0.01$, not $-2$.`],
    [1, s`Find $x$ when $y=100$.`, s`[B1] $2=0.3x-2$, hence $x=40/3$.`]),
  draft("log-exp", 2, s`A model is $y=ke^{a/x}$ for $x>0$. Its graph of $\ln y$ against $1/x$ passes through $(1,\ln6)$ and $(1/2,\ln3)$.`,
    [3, s`Find $a$ and $k$, not merely $\ln k$.`, s`[M1] Gradient $a=(\ln6-\ln3)/(1-1/2)$. [A1] $a=2\ln2$. [A1] $\ln k=\ln6-2\ln2=\ln(3/2)$, so $k=3/2$.`],
    [1, s`State the limiting value of $y$ as $x\to\infty$.`, s`[B1] $a/x\to0$, so $y\to3/2$.`]),
  draft("log-exp", 2, s`The model $y=kx^{-n}$, $x>0$, has $y=16$ at $x=1/2$ and $y=2$ at $x=1$.`,
    [3, s`Use a logarithmic transformation to find $n$ and $k$, not merely $\ln k$.`, s`[M1] $\ln y=\ln k-n\ln x$. [A1] $k=2$ at $x=1$. [A1] $16=2\cdot2^n$, so $n=3$.`],
    [1, s`Express $x$ in terms of $y$, respecting the domain.`, s`[B1] $x=(2/y)^{1/3}$ for $y>0$; there is one positive solution.`]),
];

const normals: Draft[] = [
  draft("differentiation", 3, s`The curve is $x^2+xy+2y^2=8$.`,
    [2, s`Find $dy/dx$ implicitly.`, s`[M1] $2x+y+(x+4y)y'=0$. [A1] $y'=-(2x+y)/(x+4y)$.`],
    [2, s`Find the complete equation of the normal at $(2,1)$.`, s`[M1] Tangent gradient $-5/6$, normal gradient $6/5$. [A1] $y-1=6(x-2)/5$.`],
    [2, s`Find where this normal meets the $x$-axis and give its distance from $(2,1)$.`, s`[M1] Setting $y=0$ gives $(7/6,0)$. [A1] Distance $\sqrt{(5/6)^2+1}=\sqrt{61}/6$.`]),
  draft("differentiation", 3, s`A curve has $x=t^2+1$, $y=t^3-2t$.`,
    [2, s`Find $dy/dx$ where defined.`, s`[M1] Differentiate both coordinates. [A1] $dy/dx=(3t^2-2)/(2t)$ for $t\ne0$.`],
    [2, s`Find the complete equation of the normal at $t=1$.`, s`[M1] Point $(2,-1)$, tangent slope $1/2$, normal slope $-2$. [A1] $y=-2x+3$.`],
    [2, s`Explain what happens to the tangent at $t=0$ and state the normal there.`, s`[M1] $dx/dt=0$ but $dy/dt=-2\ne0$, so the tangent is vertical. [A1] At $(1,0)$ the normal is $y=0$, not an undefined line.`]),
  draft("differentiation", 2, s`Let $y=x\ln x$ for $x>0$.`,
    [2, s`Find the stationary point.`, s`[M1] $y'=\ln x+1=0$. [A1] $(e^{-1},-e^{-1})$.`],
    [2, s`Find the complete equation of the normal at that point.`, s`[M1] The tangent has zero slope, so its normal is vertical. [A1] $x=e^{-1}$. Do not give only a gradient.`],
    [2, s`Find the normal at $x=1$ and its intersection with the previous normal.`, s`[M1] At $(1,0)$, $y'=1$, giving $y=1-x$. [A1] Intersection $(e^{-1},1-e^{-1})$.`]),
  draft("differentiation", 3, s`The curve is $xe^y+y=1$.`,
    [2, s`Find $dy/dx$.`, s`[M1] Product and chain rules give $e^y+(xe^y+1)y'=0$. [A1] $y'=-e^y/(xe^y+1)$.`],
    [2, s`Find the complete equation of the normal at $x=0$.`, s`[M1] $y=1$ and tangent slope $-e$, so normal slope $1/e$. [A1] $y-1=x/e$.`],
    [2, s`The normal and the coordinate axes enclose a triangle. Find its exact area.`, s`[M1] Intercepts $(0,1)$ and $(-e,0)$. [A1] Area $e/2$; use the positive base length.`]),
  draft("differentiation", 3, s`A curve is $x=t+t^{-1}$, $y=t-t^{-1}$, where $t>0$.`,
    [2, s`Find $dy/dx$ for $t\ne1$.`, s`[M1] Divide $1+t^{-2}$ by $1-t^{-2}$. [A1] $(t^2+1)/(t^2-1)$.`],
    [2, s`Find the complete equation of the normal at $t=2$.`, s`[M1] Point $(5/2,3/2)$, tangent slope $5/3$. [A1] $y-3/2=-3(x-5/2)/5$.`],
    [2, s`Find and justify the normal at $t=1$.`, s`[M1] $dx/dt=0$, $dy/dt=2$ so the tangent is vertical at $(2,0)$. [A1] The normal is $y=0$.`]),
  draft("differentiation", 2, s`Let $y=\ln(x^2+1)$.`,
    [2, s`Find the points where the tangent has slope $4/5$.`, s`[M1] $2x/(x^2+1)=4/5$ gives $2x^2-5x+2=0$. [A1] $x=1/2$ or 2, with $y=\ln(5/4)$ or $\ln5$.`],
    [2, s`Find the complete equation of the normal at each point.`, s`[M1] Both normal slopes are $-5/4$. [A1] $y-\ln(5/4)=-5(x-1/2)/4$ and $y-\ln5=-5(x-2)/4$.`],
    [2, s`Explain whether the two normals can intersect.`, s`[M1] They have equal slopes. [A1] Their intercepts differ by $\ln4+15/8>0$, so they are distinct parallel lines and cannot intersect.`]),
  draft("differentiation", 3, s`The curve is $x^2y+y^3=10$.`,
    [2, s`Find $dy/dx$.`, s`[M1] $2xy+(x^2+3y^2)y'=0$. [A1] $y'=-2xy/(x^2+3y^2)$.`],
    [2, s`Find the complete equation of the normal at $(3,1)$.`, s`[M1] Tangent gradient $-1/2$, normal gradient 2. [A1] $y=2x-5$.`],
    [2, s`Find the point on this normal closest to the origin.`, s`[M1] Perpendicular through the origin has equation $y=-x/2$. [A1] Intersecting gives $(2,-1)$.`]),
  draft("differentiation", 2, s`Let $y=e^x/(1+e^x)$.`,
    [2, s`Differentiate and simplify.`, s`[M1] Apply the quotient rule. [A1] $y'=e^x/(1+e^x)^2$.`],
    [2, s`Find the complete equation of the normal at $x=0$.`, s`[M1] Point $(0,1/2)$, tangent slope $1/4$, normal slope $-4$. [A1] $y=1/2-4x$.`],
    [2, s`Find where this normal meets the line $y=1$ and its distance from the point of contact.`, s`[M1] Intersection $(-1/8,1)$. [A1] Distance $\sqrt{(1/8)^2+(1/2)^2}=\sqrt{17}/8$.`]),
];

const complex: Draft[] = [
  draft("complex", 2, s`Let $z=(a+i)/(1-2i)$, where $a$ is real.`,
    [3, s`Express $z$ in Cartesian form and find $a$ if $z$ is purely imaginary.`, s`[M1] Multiply numerator and denominator by $1+2i$. [A1] $z=(a-2)/5+i(2a+1)/5$. [A1] $a=2$, giving $z=i$.`],
    [3, s`Instead suppose $|z|=1$. Find every $a$ and the corresponding principal arguments of $z$.`, s`[M1] $(a^2+1)/5=1$. [A1] $a=2$ or $-2$, with $z=i$ or $(-4-3i)/5$. [A1] Arguments are $\pi/2$ and $-\pi+\tan^{-1}(3/4)$, respectively.`]),
  draft("complex", 2, s`A monic cubic with real coefficients has roots $1+2i$ and $-3$.`,
    [3, s`Find the cubic polynomial in expanded form.`, s`[B1] The third root is $1-2i$. [M1] Multiply $(z^2-2z+5)(z+3)$. [A1] $z^3+z^2-z+15$.`],
    [3, s`On an Argand diagram find the area of the triangle whose vertices are these roots.`, s`[M1] The conjugate roots give a vertical base of length 4. [A1] The perpendicular distance from $-3$ to that base is 4. [A1] Area $8$.`]),
  draft("complex", 2, s`A point $z=x+iy$ satisfies $|z-1|=|z-(3+2i)|$.`,
    [3, s`Find the Cartesian equation of the locus.`, s`[M1] Square the distances: $(x-1)^2+y^2=(x-3)^2+(y-2)^2$. [A1] Simplify to $x+y=3$. [B1] This is the perpendicular bisector of the segment joining $(1,0)$ and $(3,2)$.`],
    [3, s`Find every point on this locus with modulus $\sqrt5$.`, s`[M1] Substitute $y=3-x$ in $x^2+y^2=5$. [A1] $x^2-3x+2=0$, so $x=1,2$. [A1] $z=1+2i$ or $2+i$.`]),
  draft("complex", 2, s`Let $z=-\sqrt3+i$ and $w=1-i$.`,
    [3, s`Find the modulus and principal argument of $z/w$.`, s`[B1] $|z|=2$, $\arg z=5\pi/6$, $|w|=\sqrt2$, $\arg w=-\pi/4$. [M1] Divide moduli and subtract arguments. [A1] Modulus $\sqrt2$, principal argument $-11\pi/12$.`],
    [3, s`Find the modulus and principal argument of $(z/w)^2$ without expanding Cartesian products.`, s`[M1] Square the modulus and double the argument. [A1] Modulus $2$. [A1] $-11\pi/6+2\pi=\pi/6$.`]),
  draft("complex", 2, s`The quadratic $z^2-2az+13=0$ has real parameter $a$.`,
    [3, s`For which values of $a$ are both roots non-real? State their common modulus in this case.`, s`[M1] Discriminant $4a^2-52<0$. [A1] $-\sqrt{13}<a<\sqrt{13}$. [B1] Conjugate roots have product 13, hence modulus $\sqrt{13}$.`],
    [3, s`The root with positive imaginary part has argument $\pi/3$. Find $a$ and both roots.`, s`[M1] Its real part is $\sqrt{13}\cos(\pi/3)$. [A1] $a=\sqrt{13}/2$. [A1] Roots $\sqrt{13}/2\pm i\sqrt{39}/2$.`]),
  draft("complex", 2, s`Let $z=x+iy$ and $w=(z-2)/(z+2)$, with $z\ne-2$.`,
    [3, s`Find the locus on which $w$ is purely imaginary, including $w=0$.`, s`[M1] Multiply by the conjugate of $z+2$. [A1] The real numerator is $x^2+y^2-4$. [A1] Circle $x^2+y^2=4$, excluding $(-2,0)$.`],
    [3, s`Find the point on this locus for which $w=i$.`, s`[M1] $z-2=i(z+2)$, so $(1-i)z=2+2i$. [A1] $z=2i$. [B1] It satisfies $|z|=2$ and is not the excluded point.`]),
  draft("complex", 2, s`The equation is $z^2=5-12i$.`,
    [4, s`Find both roots in Cartesian form by writing $z=a+bi$.`, s`[M1] $a^2-b^2=5$, $2ab=-12$. [M1] The modulus gives $a^2+b^2=13$. [A1] $a^2=9,b^2=4$ and signs are opposite. [A1] Roots $3-2i$ and $-3+2i$.`],
    [2, s`Explain why the two principal arguments differ by $\pi$ and state them.`, s`[B1] The roots are negatives, hence their rays are opposite. [A1] Arguments $-\tan^{-1}(2/3)$ and $\pi-\tan^{-1}(2/3)$.`]),
  draft("complex", 2, s`A complex number has $|z|=3$ and $z+\bar z=-3$.`,
    [3, s`Find all possible values of $z$.`, s`[M1] $2\operatorname{Re}z=-3$. [M1] $9/4+y^2=9$. [A1] $z=-3/2\pm(3\sqrt3/2)i$.`],
    [3, s`Find $1/z$ for each value and state its principal argument.`, s`[M1] $1/z=\bar z/9$. [A1] $-1/6\mp(\sqrt3/6)i$. [A1] Arguments are respectively $-2\pi/3$ and $2\pi/3$.`]),
];

const differentialEquations: Draft[] = [
  draft("de", 3, s`A population obeys $dP/dt=kP(1-P/600)$, $P(0)=150$, $P(2)=300$.`,
    [5, s`By separating variables, find $P$ in terms of $t$.`, s`[M1] Separate using $600/[P(600-P)]=1/P+1/(600-P)$. [M1] Integrate to $\ln(P/(600-P))=kt+C$. [A1] Initial data give $P=600/(1+3e^{-kt})$. [M1] $P(2)=300$ gives $3e^{-2k}=1$. [A1] $P=600/(1+3e^{-t\ln3/2})$.`],
    [2, s`Find the time when $P=450$ and explain why $P=600$ is not reached at finite time.`, s`[M1] $3e^{-kt}=1/3$, so $t=4$. [B1] The exponential is strictly positive at finite time, so the denominator exceeds 1.`]),
  draft("de", 2, s`A liquid cools in a room at $18^\circ$C. Its temperature satisfies $dT/dt=-k(T-18)$, $T(0)=90$ and $T(5)=54$.`,
    [5, s`Find $T(t)$, including the value of $k$.`, s`[M1] Separate $dT/(T-18)=-k\,dt$. [M1] Integrate to $\ln|T-18|=-kt+C$. [A1] $T=18+72e^{-kt}$. [M1] $36=72e^{-5k}$. [A1] $k=\ln2/5$.`],
    [2, s`Find when $T=27$ and state the long-term temperature.`, s`[M1] $e^{-kt}=1/8$, so $t=15$. [A1] Limit $18^\circ$C.`]),
  draft("de", 3, s`For $x\ge0$, $dy/dx=xy/(1+x^2)$ and $y(0)=-2$.`,
    [5, s`Find the particular solution, taking account of its sign.`, s`[M1] Separate $dy/y=x\,dx/(1+x^2)$. [M1] Integrate to $\ln|y|=\frac12\ln(1+x^2)+C$. [A1] $|y|=A\sqrt{1+x^2}$. [M1] The negative initial value fixes the negative branch. [A1] $y=-2\sqrt{1+x^2}$.`],
    [2, s`Find $x$ when $y=-6$. Can this solution cross the $x$-axis?`, s`[A1] $1+x^2=9$, hence $x=2\sqrt2$. [B1] No: $-2\sqrt{1+x^2}<0$ for every real $x$.`]),
  draft("de", 3, s`A draining tank obeys $dh/dt=-k\sqrt h$, $h(0)=9$, $h(2)=4$, until it becomes empty.`,
    [5, s`Find $h(t)$ and the first time the tank is empty.`, s`[M1] Separate $h^{-1/2}dh=-k\,dt$. [M1] Integrate $2\sqrt h=-kt+C$. [A1] $C=6$. [M1] $4=-2k+6$, hence $k=1$. [A1] $h=(3-t/2)^2$ for $0\le t\le6$, empty at $t=6$.`],
    [2, s`Explain why the same quadratic formula is not a valid continuation for $t>6$.`, s`[B1] Before squaring, $\sqrt h=3-t/2$ requires $t\le6$. [B1] Beyond 6 the quadratic would increase, contrary to draining; the physical continuation is $h=0$.`]),
  draft("de", 3, s`For $x>0$, $(1+y^2)dy/dx=2x$, with $y=1$ at $x=1$.`,
    [5, s`Find an implicit solution and show that it gives exactly one real $y$ for each $x>0$.`, s`[M1] Integrate $(1+y^2)dy=2x\,dx$. [A1] $y+y^3/3=x^2+C$. [M1] Initial condition gives $C=1/3$. [A1] $y^3+3y=3x^2+1$. [B1] The left side is strictly increasing from $-\infty$ to $\infty$ since its derivative is $3y^2+3>0$.`],
    [2, s`Find the gradient of this solution where $y=2$.`, s`[M1] $14=3x^2+1$, so $x=\sqrt{13/3}$. [A1] $dy/dx=2\sqrt{13/3}/5$.`]),
  draft("de", 3, s`A quantity $y$ obeys $dy/dx=e^x(3-y)^2$ and $y(0)=2$.`,
    [5, s`Find the solution explicitly.`, s`[M1] Separate $dy/(3-y)^2=e^x dx$. [M1] Integrate to $1/(3-y)=e^x+C$. [A1] Initial data give $C=0$. [M1] Rearrange without losing the sign. [A1] $y=3-e^{-x}$.`],
    [2, s`Find the zero of this solution and identify a constant solution lost by separation.`, s`[A1] $e^{-x}=3$, so $x=-\ln3$. [B1] $y=3$ is also a solution of the differential equation, but not the given initial-value problem.`]),
  draft("de", 3, s`For $x\ge0$, $dy/dx=(1-y)\cos x$ and $y(0)=0$.`,
    [5, s`Solve the initial-value problem.`, s`[M1] Separate $dy/(1-y)=\cos x\,dx$. [M1] $-\ln|1-y|=\sin x+C$. [A1] $C=0$. [M1] Choose the branch with $1-y>0$ at $x=0$. [A1] $y=1-e^{-\sin x}$.`],
    [2, s`Find the exact range of $y$ for $0\le x\le2\pi$.`, s`[M1] $-1\le\sin x\le1$, hence $e^{-1}\le e^{-\sin x}\le e$. [A1] $1-e\le y\le1-e^{-1}$.`]),
  draft("de", 3, s`A tank holds 100 litres of well-mixed solution. Pure water enters and solution leaves at 5 litres per minute. Initially it contains 8 kg of salt. Let $S(t)$ be the salt mass.`,
    [5, s`Form and solve a differential equation for $S$.`, s`[B1] Concentration $S/100$ kg per litre. [M1] Salt leaves at $5S/100$, so $S'=-S/20$. [M1] Separate and integrate: $\ln S=-t/20+C$. [A1] Initial data give $e^C=8$. [A1] $S=8e^{-t/20}$.`],
    [2, s`Find the time until the concentration first falls below 0.01 kg per litre.`, s`[M1] $S/100<0.01$ means $8e^{-t/20}<1$. [A1] $t>20\ln8$ minutes; threshold time $20\ln8$.`]),
];

const integrals: Draft[] = [
  draft("integration", 3, s`Let $f(x)=(x^2+1)/[x(x+1)^2]$, $x>0$.`,
    [4, s`Express $f$ in partial fractions.`, s`[M1] Use $A/x+B/(x+1)+C/(x+1)^2$. [A1] $A=1$. [M1] Comparing the remaining coefficients gives $B=0$, $C=-2$. [A1] $f=1/x-2/(x+1)^2$.`],
    [4, s`Evaluate $\int_1^3 f(x)\,dx$ exactly.`, s`[M1] Integrate each partial fraction. [A1] Antiderivative $\ln x+2/(x+1)$. [M1] Substitute both limits. [A1] $\ln3-1/2$.`]),
  draft("integration", 3, s`Consider the region below $y=x\ln x$ and above the $x$-axis, from $x=1$ to $x=e$.`,
    [4, s`Find its exact area.`, s`[M1] Integration by parts with $u=\ln x$, $dv=x\,dx$. [A1] Antiderivative $x^2\ln x/2-x^2/4$. [M1] Evaluate from 1 to $e$. [A1] Area $(e^2+1)/4$.`],
    [4, s`Find the volume when the region is rotated about the $x$-axis.`, s`[M1] $V=\pi\int_1^e x^2(\ln x)^2dx$. [M1] Integrate by parts twice. [A1] Antiderivative $x^3[(\ln x)^2/3-2\ln x/9+2/27]$. [A1] $V=\pi(5e^3-2)/27$.`]),
  draft("integration", 3, s`Let $I=\int_0^1 x^3/\sqrt{1+x^2}\,dx$.`,
    [4, s`Use $u=\sqrt{1+x^2}$ to transform and evaluate $I$.`, s`[M1] $x\,dx=u\,du$, $x^2=u^2-1$. [A1] Limits 1 and $\sqrt2$, integrand $u^2-1$. [M1] Evaluate $[u^3/3-u]_1^{\sqrt2}$. [A1] $I=(2-\sqrt2)/3$.`],
    [4, s`Hence evaluate $\int_0^1 x\sqrt{1+x^2}\,dx$ and explain the relationship between the two integrands.`, s`[B1] $x\sqrt{1+x^2}=x^3/\sqrt{1+x^2}+x/\sqrt{1+x^2}$. [M1] The second added term has antiderivative $\sqrt{1+x^2}$. [A1] Its integral is $\sqrt2-1$. [A1] Required result $(2\sqrt2-1)/3$.`]),
  draft("integration", 3, s`The curve $y=(\ln x-1)/x^2$ crosses the $x$-axis between 1 and $e^2$.`,
    [3, s`Find an antiderivative and the crossing point.`, s`[M1] Integrate by parts or differentiate $-\ln x/x$. [A1] An antiderivative is $-\ln x/x$. [A1] Crossing $(e,0)$.`],
    [5, s`Find the total area between the curve and the $x$-axis from 1 to $e^2$.`, s`[B1] The curve is negative on $(1,e)$ and positive on $(e,e^2)$. [M1] Split the integral at $e$ and reverse the first sign. [A1] First area $1/e$. [M1] Second area $1/e-2/e^2$. [A1] Total $2/e-2/e^2$, not the signed integral $-2/e^2$.`]),
  draft("integration", 3, s`Let $f(x)=(3x+5)/[(x+1)(x+2)]$.`,
    [3, s`Find partial fractions and an antiderivative on $x>-1$.`, s`[M1] $3x+5=A(x+2)+B(x+1)$. [A1] $A=2,B=1$. [A1] Antiderivative $2\ln(x+1)+\ln(x+2)$.`],
    [5, s`Find $b>0$ for which $\int_0^b f(x)dx=\ln18$.`, s`[M1] Evaluate to $2\ln(b+1)+\ln(b+2)-\ln2=\ln18$. [A1] $(b+1)^2(b+2)=36$. [M1] $b=2$ solves it. [M1] The product is strictly increasing for $b>0$. [A1] Therefore $b=2$ is the unique allowed solution.`]),
  draft("integration", 3, s`Let $F(x)=(x^2+ax+b)e^{2x}$.`,
    [4, s`Find $a,b$ so that $F'(x)=2x^2e^{2x}$.`, s`[M1] Product rule gives $F'=e^{2x}[2x^2+(2+2a)x+a+2b]$. [A1] $2+2a=0$. [A1] $a+2b=0$. [A1] $a=-1,b=1/2$.`],
    [4, s`Hence evaluate $\int_0^1 x^2e^{2x}dx$ and $\int_0^1(2x^2+2x)e^{2x}dx$ exactly.`, s`[M1] First integral is $[F/2]_0^1$. [A1] $(e^2-1)/4$. [M1] For the second, recognize the derivative of $x^2e^{2x}$. [A1] Result $e^2$.`]),
  draft("integration", 3, s`Consider $I=\int_0^{\ln2} e^{2x}/(1+e^x)\,dx$.`,
    [4, s`Choose a substitution and evaluate $I$ exactly.`, s`[M1] Let $u=e^x$, $dx=du/u$, limits 1 and 2. [M1] $u/(1+u)=1-1/(1+u)$. [A1] Antiderivative $u-\ln(1+u)$. [A1] $I=1-\ln(3/2)$.`],
    [4, s`Find $\int_0^{\ln2}1/(1+e^x)\,dx$ exactly. A student claims its sum with $I$ is 1; determine whether this is correct.`, s`[M1] Antiderivative $x-\ln(1+e^x)$ by rewriting as $1-e^x/(1+e^x)$. [A1] Integral $\ln(4/3)$. [M1] Sum is $1+\ln(8/9)$, not 1. [A1] Thus the proposed equality is false; the correct sum is $1+\ln(8/9)$.`]),
  draft("integration", 3, s`A curve is defined parametrically by $x=t^2$, $y=t\ln t$, $1\le t\le e$.`,
    [4, s`Find the exact area between the curve and the $x$-axis over this interval.`, s`[M1] Use $\int y\,dx=\int_1^e2t^2\ln t\,dt$. [M1] Integration by parts. [A1] Antiderivative $2t^3\ln t/3-2t^3/9$. [A1] Area $(4e^3+2)/9$.`],
    [4, s`Find the volume generated by rotating this region about the $x$-axis.`, s`[M1] $V=\pi\int y^2dx=2\pi\int_1^e t^3(\ln t)^2dt$. [M1] Integrate by parts twice. [A1] Antiderivative $t^4[(\ln t)^2/4-\ln t/8+1/32]$. [A1] $V=\pi(5e^4-1)/16$.`]),
];

const trigIntegrals: Draft[] = [
  draft("trig", 3, s`Let $f(x)=\sin^3x\cos^2x$.`,
    [3, s`Find an antiderivative, identifying the identity and substitution used.`, s`[B1] $\sin^3x=(1-\cos^2x)\sin x$. [M1] Substitute $u=\cos x$. [A1] Antiderivative $-\cos^3x/3+\cos^5x/5$.`],
    [5, s`Evaluate $\int_0^{\pi/3}f(x)dx$ exactly, and find the total area under $|f(x)|$ from 0 to $\pi$.`, s`[M1] Use cosine values 1 and $1/2$. [A1] First integral $47/480$. [B1] $f\ge0$ throughout $[0,\pi]$. [M1] Substitute cosine values 1 and $-1$. [A1] Total area $4/15$.`]),
  draft("trig", 3, s`Let $I=\int_0^{\pi/4}x\sec^2x\,dx$.`,
    [4, s`Evaluate $I$ exactly.`, s`[M1] Integration by parts with $u=x,dv=\sec^2x\,dx$. [A1] $I=[x\tan x]_0^{\pi/4}-\int_0^{\pi/4}\tan x\,dx$. [M1] $\int\tan x\,dx=-\ln|\cos x|$. [A1] $I=\pi/4-\frac12\ln2$.`],
    [4, s`Hence evaluate $\int_0^{\pi/4}x\tan^2x\,dx$ exactly.`, s`[B1] $\tan^2x=\sec^2x-1$. [M1] Subtract $\int_0^{\pi/4}x\,dx$ from $I$. [A1] This subtracted integral is $\pi^2/32$. [A1] Result $\pi/4-\frac12\ln2-\pi^2/32$.`]),
  draft("trig", 3, s`Let $f(x)=1/(1+\cos2x)$ on $0\le x\le\pi/3$.`,
    [3, s`Find an antiderivative of $f$.`, s`[B1] $1+\cos2x=2\cos^2x$. [M1] $f=\frac12\sec^2x$. [A1] Antiderivative $\frac12\tan x$.`],
    [5, s`Evaluate $\int_0^{\pi/3}f(x)dx$ exactly and find the unique $a\in(0,\pi/3)$ that divides this integral into equal halves.`, s`[M1] Use the antiderivative at both limits. [A1] Total $\sqrt3/2$. [M1] $\frac12\tan a=\sqrt3/4$. [A1] $a=\tan^{-1}(\sqrt3/2)$. [B1] Tangent is strictly increasing on this interval, giving uniqueness.`]),
  draft("trig", 3, s`Let $f(x)=\sin^2x\cos^2x$.`,
    [3, s`Express $f(x)$ using a single cosine of a multiple angle and integrate it.`, s`[M1] $f=\frac14\sin^22x$. [A1] $f=(1-\cos4x)/8$. [A1] Antiderivative $x/8-\sin4x/32$.`],
    [5, s`Evaluate $\int_0^{\pi/6}f(x)dx$ exactly and hence the volume formed by rotating $y=\sin x\cos x$, $0\le x\le\pi/6$, about the $x$-axis.`, s`[M1] At the upper limit, $\sin(2\pi/3)=\sqrt3/2$. [A1] Integral $\pi/48-\sqrt3/64$. [M1] Volume is $\pi\int y^2dx$. [M1] Here $y^2=f$. [A1] Volume $\pi^2/48-\pi\sqrt3/64$.`]),
  draft("trig", 3, s`Let $f(x)=\cos x/(2+\sin x)^2$.`,
    [4, s`Evaluate $\int_0^{\pi/2}f(x)dx$ exactly.`, s`[M1] Let $u=2+\sin x$, $du=\cos x\,dx$. [A1] Limits 2 and 3. [M1] Integrate $u^{-2}$ to $-u^{-1}$. [A1] Result $1/6$.`],
    [4, s`Evaluate $\int_0^{\pi/2}\sin x\cos x/(2+\sin x)^2dx$ exactly.`, s`[M1] Use the same substitution with $\sin x=u-2$. [A1] New integrand $u^{-1}-2u^{-2}$. [M1] Antiderivative $\ln u+2/u$. [A1] Result $\ln(3/2)-1/3$.`]),
  draft("trig", 3, s`Let $f(x)=\sin x/(1+\cos^2x)$.`,
    [4, s`Evaluate $\int_0^{\pi/2}f(x)dx$ exactly.`, s`[M1] Substitute $u=\cos x$, $du=-\sin x\,dx$. [A1] Integral becomes $\int_0^1du/(1+u^2)$. [M1] Antiderivative $\tan^{-1}u$. [A1] Result $\pi/4$.`],
    [4, s`Evaluate $\int_0^{\pi/2}\sin x\cos^2x/(1+\cos^2x)dx$ exactly without a new substitution.`, s`[B1] Rewrite the integrand as $\sin x-f(x)$. [M1] Integrate the two terms separately. [A1] $\int_0^{\pi/2}\sin x\,dx=1$. [A1] Result $1-\pi/4$.`]),
  draft("trig", 3, s`Consider $y=\cos2x-\sin x$ for $0\le x\le\pi/2$.`,
    [3, s`Find the crossing of the $x$-axis in this interval.`, s`[M1] Use $\cos2x=1-2\sin^2x$. [A1] $(2\sin x-1)(\sin x+1)=0$. [A1] Only $x=\pi/6$ is allowed.`],
    [5, s`Evaluate the total area between this curve and the $x$-axis exactly.`, s`[B1] Positive before $\pi/6$, negative after it. [M1] Antiderivative $F=\frac12\sin2x+\cos x$. [A1] $F(0)=1,F(\pi/6)=3\sqrt3/4,F(\pi/2)=0$. [M1] Area $F(\pi/6)-F(0)-[F(\pi/2)-F(\pi/6)]$. [A1] $3\sqrt3/2-1$.`]),
  draft("trig", 3, s`For $0\le x\le\pi/4$, let $f(x)=(\sin x+\cos x)/(2+\sin x-\cos x)$.`,
    [4, s`Evaluate $\int_0^{\pi/4}f(x)dx$ exactly, explaining your choice of method.`, s`[B1] The numerator is the derivative of the denominator. [M1] Substitute $u=2+\sin x-\cos x$. [A1] Limits 1 and 2, antiderivative $\ln u$. [A1] Result $\ln2$.`],
    [4, s`Find $a\in(0,\pi/4)$ for which $\int_0^a f(x)dx=\frac12\ln2$.`, s`[M1] $\ln(2+\sin a-\cos a)=\frac12\ln2$. [A1] $\sin a-\cos a=\sqrt2-2$. [M1] $\sqrt2\sin(a-\pi/4)=\sqrt2-2$. [A1] $a=\pi/4+\sin^{-1}(1-\sqrt2)$, the unique value in the stated interval.`]),
];

const advancedComplex: Draft[] = [
  draft("complex", 3, s`The loci are $|z-(1+i)|=\sqrt5$ and $\operatorname{Re}z+\operatorname{Im}z=k$, for real $k$.`,
    [5, s`Find the values of $k$ for which the loci meet at exactly one point, and find that point in each case.`, s`[M1] Substitute $y=k-x$ into $(x-1)^2+(y-1)^2=5$. [A1] $2x^2-2kx+k^2-2k-3=0$. [M1] A repeated root requires discriminant $40-4(k-2)^2=0$. [A1] $k=2\pm\sqrt{10}$. [A1] Contact points $z=(1\pm\sqrt{10}/2)(1+i)$, matching the signs.`],
    [4, s`For $k=3$, find both intersection points and the exact distance between them.`, s`[M1] $2x^2-6x=0$, so $x=0,3$. [A1] Points $3i$ and $3$. [M1] Their difference has components $(3,-3)$. [A1] Distance $3\sqrt2$.`]),
  draft("complex", 3, s`The polynomial $p(z)=z^4-4z^3+az^2+bz+25$ has real coefficients and a root $1+2i$.`,
    [5, s`Find $a,b$ and all roots.`, s`[B1] $1-2i$ is also a root, giving factor $z^2-2z+5$. [M1] Write $p=(z^2-2z+5)(z^2+cz+d)$. [A1] Cubic and constant coefficients give $c=-2,d=5$. [M1] Expand the square. [A1] $a=14,b=-20$; roots $1\pm2i$, each repeated twice.`],
    [4, s`Find the modulus and principal argument of the quotient $(1+2i)/(1-2i)$.`, s`[M1] Multiply by the conjugate of the denominator. [A1] Quotient $(-3+4i)/5$. [A1] Modulus 1. [A1] Principal argument $\pi-\tan^{-1}(4/3)$.`]),
  draft("complex", 3, s`The point $z$ lies on $|z-(2+i)|=2$.`,
    [4, s`Find the least and greatest values of $|z|$ and the point giving the least value.`, s`[M1] The centre has distance $\sqrt5$ from the origin. [A1] Extremes $\sqrt5-2$ and $\sqrt5+2$. [M1] The nearest point lies on the line from the origin to the centre. [A1] $z=(1-2/\sqrt5)(2+i)$.`],
    [5, s`Find the greatest principal argument of $z$, explaining the geometry.`, s`[M1] The extreme ray from the origin is tangent to the circle. [B1] The radius to the contact point is perpendicular to the ray. [M1] The right triangle gives $\sin\alpha=2/\sqrt5$. [A1] The direction to the centre is $\tan^{-1}(1/2)$. [A1] Greatest argument $\tan^{-1}(1/2)+\sin^{-1}(2/\sqrt5)=\pi/2$.`]),
  draft("complex", 3, s`Let $w=(z-1)/(z+1)$, where $z\ne-1$.`,
    [5, s`Show that $|w|=2$ corresponds to a circle, and find its centre and radius.`, s`[M1] $|z-1|^2=4|z+1|^2$. [A1] $(x-1)^2+y^2=4[(x+1)^2+y^2]$. [M1] Simplify to $3x^2+10x+3y^2+3=0$. [A1] $(x+5/3)^2+y^2=16/9$. [A1] Centre $(-5/3,0)$, radius $4/3$; the excluded point is not on this circle.`],
    [4, s`Find both points on this circle with real part $-1$, and the corresponding values of $w$.`, s`[M1] Substitute $x=-1$, giving $y^2=4/3$. [A1] $z=-1\pm2i/\sqrt3$. [M1] $w=(-2+iy)/(iy)=1+2i/y$. [A1] $w=1\pm i\sqrt3$, with matching signs.`]),
  draft("complex", 3, s`Let $0<\theta<\pi$. The equation is $z+1/z=2\cos\theta$, with $z\ne0$.`,
    [5, s`Find both roots and their moduli. Explain what changes at $\theta=0$ and $\theta=\pi$.`, s`[M1] Rearrange to $z^2-2z\cos\theta+1=0$. [M1] Quadratic formula gives $z=\cos\theta\pm i\sin\theta$. [A1] Both have modulus 1. [B1] At 0 there is one repeated root $z=1$. [B1] At $\pi$ there is one repeated root $z=-1$.`],
    [4, s`When $\theta=2\pi/3$, find the exact area of the triangle formed by the two roots and the point 1.`, s`[A1] Roots $-1/2\pm i\sqrt3/2$. [M1] Their vertical separation is $\sqrt3$. [M1] The perpendicular height from $(1,0)$ is $3/2$. [A1] Area $3\sqrt3/4$.`]),
  draft("complex", 3, s`Consider $z^2-(1+3i)z-4+3i=0$.`,
    [5, s`Find both roots, showing how you obtain the square root of the discriminant.`, s`[M1] Discriminant $(1+3i)^2+16-12i=8-6i$. [M1] For a square root $a+bi$, $a^2-b^2=8$, $ab=-3$. [A1] Also $a^2+b^2=10$, giving square roots $\pm(3-i)$. [M1] Substitute in the quadratic formula. [A1] Roots $2+i$ and $-1+2i$.`],
    [4, s`Find the angle at the origin and the area of the triangle whose other vertices are the two roots.`, s`[M1] $(2+i)/(-1+2i)=-i$. [A1] The angle is $\pi/2$. [M1] Both moduli are $\sqrt5$, giving perpendicular sides of that length. [A1] Area $5/2$.`]),
  draft("complex", 3, s`The loci are $\arg(z-2)=\pi/3$ and $|z|=r$, where $r>0$.`,
    [4, s`Represent the first locus parametrically and determine for which $r$ the two loci intersect.`, s`[M1] Write $z=2+t+i\sqrt3t$. [B1] Require $t>0$, since $z=2$ has undefined argument. [M1] $|z|^2=4+4t+4t^2$, strictly increasing for $t>0$. [A1] Exactly one intersection for $r>2$, none for $0<r\le2$.`],
    [5, s`Find the intersection exactly for $r=3$, and give its principal argument.`, s`[M1] $4t^2+4t-5=0$. [A1] $t=(-1+\sqrt6)/2$, rejecting the negative value. [A1] $z=(3+\sqrt6)/2+i\sqrt3(\sqrt6-1)/2$. [M1] The point is in the first quadrant. [A1] Argument $\tan^{-1}[\sqrt3(\sqrt6-1)/(3+\sqrt6)]$.`]),
  draft("complex", 3, s`A point lies on the circle $|z-(1+i)|=\sqrt2$ and the ray $\arg z=\pi/4$.`,
    [4, s`Find all points satisfying both conditions, treating the origin carefully.`, s`[M1] The ray gives $y=x>0$. [M1] Substitute to get $2(x-1)^2=2$, hence $x=0,2$. [B1] Exclude $x=0$ because $\arg0$ is undefined. [A1] The sole point is $z=2+2i$.`],
    [5, s`Instead intersect the circle with $\arg z=\alpha$, $0<\alpha<\pi/2$. Find the nonzero intersection in polar form and its greatest possible modulus.`, s`[M1] Write $z=\rho(\cos\alpha+i\sin\alpha)$ with $\rho>0$. [M1] Circle equation gives $\rho^2-2\rho(\cos\alpha+\sin\alpha)=0$. [A1] $z=2(\cos\alpha+\sin\alpha)e^{i\alpha}$. [M1] $\cos\alpha+\sin\alpha=\sqrt2\cos(\alpha-\pi/4)$. [A1] Maximum modulus $2\sqrt2$ at $\alpha=\pi/4$.`]),
];

const vectors: Draft[] = [
  draft("vectors", 3, s`Points are $A(1,-1,2)$, $B(5,3,4)$, $C(2,5,6)$ and $D(0,3,5)$.`,
    [4, s`Prove that $ABCD$ is a trapezium but not a parallelogram, including why the points are coplanar.`, s`[M1] $AB=(4,4,2)=2(2,2,1)$ and $DC=(2,2,1)$. [A1] One pair is parallel. [M1] $AD=(-1,4,3)$ and $BC=(-3,2,2)$ are not proportional. [A1] $C=A+AD+AB/2$, so all points lie in the plane generated by $AB,AD$; exactly one pair of opposite sides is parallel.`],
    [4, s`Find the foot $H$ of the perpendicular from $D$ to line $AB$ and the exact distance $DH$.`, s`[M1] $H=A+t(2,2,1)$ and $(D-H)\cdot(2,2,1)=0$. [A1] $9-9t=0$, so $t=1$, $H=(3,1,3)$. [M1] $D-H=(-3,2,2)$. [A1] $DH=\sqrt{17}$.`],
    [4, s`Find the exact area of $ABCD$ and explain why $|AD|$ is not its height.`, s`[M1] Parallel sides have lengths 6 and 3. [M1] Use the perpendicular height $\sqrt{17}$. [A1] Area $9\sqrt{17}/2$. [B1] $AD\cdot AB=18\ne0$, so $AD$ is not perpendicular to the bases.`]),
  draft("vectors", 3, s`Let $A(0,1,0)$, $B(3,7,6)$, $D(2,0,1)$, $C(k,4,5)$.`,
    [4, s`Find $k$ if $DC$ is parallel to $AB$, and classify $ABCD$, ruling out a parallelogram.`, s`[M1] $AB=3(1,2,2)$; $DC=(k-2,4,4)$. [A1] $DC=2(1,2,2)$ gives $k=4$. [M1] $AD=(2,-1,1)$, $BC=(1,-3,-1)$ are not proportional. [A1] Parallel bases imply coplanarity; unequal parallel opposite sides and nonparallel legs give a trapezium, not a parallelogram.`],
    [4, s`Find the shortest distance from $D$ to line $AB$.`, s`[M1] $H=A+t(1,2,2)$; impose $(D-H)\cdot(1,2,2)=0$. [A1] $t=2/9$. [M1] Squared distance $|AD|^2-(AD\cdot u)^2/|u|^2=6-4/9$. [A1] Distance $5\sqrt2/3$.`],
    [4, s`Find the area of the trapezium and the acute angle between $AD$ and $AB$.`, s`[M1] Bases 9 and 6 with height $5\sqrt2/3$. [A1] Area $25\sqrt2/2$. [M1] Scalar product gives $\cos\theta=2/(3\sqrt6)$. [A1] $\theta=\cos^{-1}(2/(3\sqrt6))$.`]),
  draft("vectors", 3, s`Let $A(1,0,1)$, $B(5,-4,9)$, $D(2,3,0)$ and $C(4,1,4)$.`,
    [4, s`Prove that the quadrilateral has exactly one pair of parallel opposite sides.`, s`[M1] $AB=4(1,-1,2)$ and $DC=2(1,-1,2)$. [A1] These sides are parallel. [M1] $AD=(1,3,-1)$, $BC=(-1,5,-5)$ are not proportional. [A1] $C=D+AB/2$ establishes coplanarity, so the quadrilateral is a trapezium and not a parallelogram.`],
    [4, s`Find the perpendicular distance from $D$ to line $AB$. Is the perpendicular foot on the segment $AB$?`, s`[M1] Let $H=A+t(1,-1,2)$ and impose orthogonality. [A1] $t=-4/6=-2/3$. [M1] $DH^2=11-16/6=25/3$, so $DH=5/\sqrt3$. [A1] Segment $AB$ corresponds to $0\le t\le4$; the foot is outside.`],
    [4, s`Find the exact area of $ABCD$ and explain which height is valid despite the external foot.`, s`[M1] Base lengths $4\sqrt6$ and $2\sqrt6$. [M1] The perpendicular distance between their supporting parallel lines is $5/\sqrt3$. [A1] Area $15\sqrt2$. [B1] Trapezium height is the distance between parallel lines, not distance to the nearest endpoint of a segment.`]),
  draft("vectors", 3, s`Let $A(2,1,-1)$, $B(8,4,2)$, $D(2,5,1)$ and $C=D+\lambda(2,1,1)$, where $0<\lambda<3$.`,
    [4, s`Prove that $ABCD$ is a trapezium but not a parallelogram for every allowed $\lambda$.`, s`[M1] $AB=3u$, $DC=\lambda u$, $u=(2,1,1)$. [M1] $AD=(0,4,2)$ is not parallel to $u$, so a nondegenerate plane is defined. [A1] $BC=AD+(\lambda-3)u$ cannot be parallel to $AD$ unless $\lambda=3$. [A1] This is excluded; exactly one pair of opposite sides is parallel.`],
    [4, s`Find the perpendicular distance between the parallel sides.`, s`[M1] Project $AD$ onto $u$: parameter $(AD\cdot u)/|u|^2=6/6$. [A1] Foot $H=A+u=(4,2,0)$. [M1] $D-H=(-2,3,1)$. [A1] Height $\sqrt{14}$.`],
    [4, s`The area is $5\sqrt{21}$. Find $\lambda$ and check its range.`, s`[M1] Bases are $3\sqrt6$ and $\lambda\sqrt6$. [M1] Area $(3+\lambda)\sqrt{21}$. [A1] $3+\lambda=5$, so $\lambda=2$. [B1] $0<2<3$, so the solution is admissible.`]),
  draft("vectors", 3, s`A particle travels along the segment $P(1,2,-1)$ to $Q(7,5,2)$. A sensor at $S(4,0,3)$ detects it at distance at most 4.`,
    [3, s`Write the position vector of the particle using a parameter $t$ and give the allowed interval.`, s`[M1] $Q-P=(6,3,3)$. [A1] $R=(1,2,-1)+t(2,1,1)$. [B1] $0\le t\le3$.`],
    [5, s`Find the closest point to the sensor during this journey and its distance.`, s`[M1] $(R-S)\cdot(2,1,1)=0$. [A1] $6t-8=0$, $t=4/3$. [B1] This lies in $[0,3]$. [M1] $R=(11/3,10/3,1/3)$ and squared distance $29-64/6=55/3$. [A1] Distance $\sqrt{165}/3$.`],
    [4, s`Will detection occur? Find the minimum sensor radius needed for detection and explain whether checking the endpoints alone would suffice.`, s`[M1] Compare $55/3$ with $4^2$. [A1] $55/3>16$, so no detection. [A1] Minimum radius $\sqrt{165}/3$. [B1] Endpoints alone are insufficient: the minimum here is at an interior point of the segment.`]),
  draft("vectors", 3, s`Lines are $l:r=(1,0,2)+s(1,2,-1)$ and $m:r=(3,1,0)+t(2,-1,1)$.`,
    [4, s`Determine whether the lines are parallel, intersecting or skew.`, s`[B1] Directions are not proportional. [M1] First two coordinate equations give $s=4/5,t=-3/5$. [A1] Third coordinates become $6/5$ and $-3/5$, inconsistent. [A1] Therefore skew, not merely nonparallel.`],
    [4, s`Find the perpendicular distance from $P=(3,1,0)$ to $l$.`, s`[M1] $H=(1,0,2)+s(1,2,-1)$, $(P-H)\cdot(1,2,-1)=0$. [A1] $s=1$, so $H=(2,2,1)$. [M1] $P-H=(1,-1,-1)$. [A1] Distance $\sqrt3$.`],
    [4, s`Find the area of triangle $APH$, where $A=(1,0,2)$, without using a vector cross product.`, s`[M1] $AH$ is along $l$ and $PH\perp l$, so the triangle is right-angled at $H$. [A1] $AH=\sqrt6$. [M1] Area $\frac12 AH\cdot PH$. [A1] $3\sqrt2/2$.`]),
  draft("vectors", 3, s`Let $A(1,1,0)$, $B(3,2,2)$ and $C(0,4,1)$. A point $D$ lies on line $AB$ and $CD\perp AB$.`,
    [4, s`Find $D$ and determine whether it lies between $A$ and $B$.`, s`[M1] Set $D=A+t(2,1,2)$. [M1] $(C-D)\cdot(2,1,2)=0$. [A1] $3-9t=0$, $D=(5/3,4/3,2/3)$. [B1] $t=1/3\in(0,1)$, so it is between them.`],
    [4, s`Find the exact area of triangle $ABC$.`, s`[M1] $CD^2=|AC|^2-(AC\cdot AB)^2/|AB|^2=11-1=10$. [A1] $CD=\sqrt{10}$. [M1] Use base $AB=3$ and perpendicular height. [A1] Area $3\sqrt{10}/2$.`],
    [4, s`Find all points $X$ on line $AB$ for which $CX=\sqrt{19}$.`, s`[M1] $X-C=(1+2t,t-3,2t-1)$. [M1] Squaring gives $9t^2-6t+11=19$. [A1] Roots $t=4/3,-2/3$. [A1] $X=(11/3,7/3,8/3)$ or $(-1/3,1/3,-4/3)$; both lie on the line, not necessarily the segment.`]),
  draft("vectors", 3, s`Let $A=(0,1,2)$, $B=(4,3,0)$. Point $X$ lies on line $AB$ and satisfies $OX\perp AB$.`,
    [4, s`Find $X$ and the shortest distance from the origin to line $AB$.`, s`[M1] $X=(0,1,2)+t(2,1,-1)$. [M1] $X\cdot(2,1,-1)=6t-1=0$. [A1] $X=(1/3,7/6,11/6)$. [A1] Distance $\sqrt{29/6}$.`],
    [4, s`Point $Y$ lies three quarters of the way from $A$ to $B$. Find $Y$ and the angle $OXY$.`, s`[M1] $Y=A+\frac34(B-A)$. [A1] $Y=(3,5/2,1/2)$. [M1] $XY$ lies along $AB$, whereas $XO\perp AB$. [A1] $\angle OXY=90^\circ$; this is a right angle, not an acute angle.`],
    [4, s`Find the exact area of triangle $OXY$.`, s`[M1] $Y$ has parameter $3/2$ and $X$ parameter $1/6$. [A1] $XY=(4/3)\sqrt6$. [M1] Use the perpendicular sides $OX$ and $XY$. [A1] Area $2\sqrt{29}/3$.`]),
];

const iterationChecks: Array<[number, number, (x: number) => number, (x: number) => number]> = [
  [1.7, 1.8, x => x ** 3 + x - 7, x => Math.cbrt(7 - x)],
  [1, 1.1, x => x + Math.exp(x) - 4, x => Math.log(4 - x)],
  [1, 1.1, x => 2 * Math.cos(x) - x, x => Math.acos(x / 2)],
  [1, 1.1, x => x * Math.exp(x) - 3, x => Math.log(3 / x)],
  [1.3, 1.4, x => x ** 3 + 2 * x - 5, x => Math.cbrt(5 - 2 * x)],
  [0.5, 0.6, x => Math.exp(-x) - x, x => Math.exp(-x)],
  [2.2, 2.3, x => Math.log(x) + x - 3, x => 3 - Math.log(x)],
  [1.5, 1.6, x => x ** 2 - 2 - Math.log(x), x => Math.sqrt(2 + Math.log(x))],
];
const numerical: Draft[] = iterationChecks.map(([lo, hi, f, next], i) => {
  const original = legacy[i * 11 + 6];
  const first: number[] = [];
  let x = lo;
  for (let n = 0; n < 1000; n++) { x = next(x); if (n < 3) first.push(x); }
  const rounded = x.toFixed(4);
  const left = Number(rounded) - 0.00005;
  const right = Number(rounded) + 0.00005;
  return { ...original, difficulty: 2, parts: [
    { ...original.parts[0], solutionOutline: `[B1] Sketch the two stated graphs with the intersection in the stated interval. [B1] ${original.parts[0].solutionOutline}` },
    { ...original.parts[1], solutionOutline: `[M1] For the continuous difference (left side minus right side), f(${lo})=${f(lo).toFixed(6)}, f(${hi})=${f(hi).toFixed(6)}. [A1] Opposite signs establish a root in (${lo},${hi}).` },
    { ...original.parts[2], solutionOutline: `[M1] The first three updates, without feeding rounded values back, are ${first.map(v => v.toFixed(7)).join(", ")}. [M1] Continue to ${x.toFixed(9)}; the rounding boundaries ${left.toFixed(5)} and ${right.toFixed(5)} give opposite function signs (${f(left).toExponential(3)}, ${f(right).toExponential(3)}). [A1] The root is ${rounded} to 4 decimal places. Display at least 5 decimals, but keep full calculator precision during iteration.` },
  ] };
});

// Eight short foundation questions are retained; eight numerical questions get
// worked precision checks. The other 72 prompts are replaced, not reskinned.
const revisedPapers: LongQuestion[][] = Array.from({ length: 8 }, (_, i) => {
  const drafts: Draft[] = [algebra[i], models[i], legacy[i * 11 + 2], complex[i], normals[i],
    differentialEquations[i], numerical[i], integrals[i],
    trigIntegrals[i], advancedComplex[i], vectors[i]];
  return drafts.map((item, j) => ({
    ...item,
    id: `caie9709-p3-m${i + 9}-r2-q${String(j + 1).padStart(2, "0")}`,
    type: "long" as const,
    testId: "caie9709",
    totalMarks: item.parts.reduce((sum, part) => sum + part.marks, 0),
    fullSolution: item.parts.map(part => `${part.label} ${part.solutionOutline}`).join("\n\n"),
  }));
});

export const [CAIE9709_P3_MOCK_9, CAIE9709_P3_MOCK_10, CAIE9709_P3_MOCK_11,
  CAIE9709_P3_MOCK_12, CAIE9709_P3_MOCK_13, CAIE9709_P3_MOCK_14,
  CAIE9709_P3_MOCK_15, CAIE9709_P3_MOCK_16] = revisedPapers;
export const CAIE9709_P3_CANDIDATE_TARGETED_QUESTIONS = revisedPapers.flat();
const targetedNumbers = new Set([1, 2, 5, 7, 9]);
export const CAIE9709_P3_CANDIDATE_TARGETED_IDS = new Set(revisedPapers.flatMap((paper, i) =>
  paper.filter((_, j) => targetedNumbers.has(j + 1) || (j === 10 && i < 4)).map(q => q.id)));
