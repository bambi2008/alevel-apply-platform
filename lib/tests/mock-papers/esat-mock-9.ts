// ESAT 模拟卷九（自然科学方向 · 数学 + 生物 · 对标 NSAA）—— 全新原创题。
// 依据 NSAA 2016–2023 真题校准：NSAA 含数学 + 物理 + 化学 + 生物；本卷补足生物方向
// （与工程卷五/六/七、化学卷八互补，形成完整科目覆盖）。生物考点覆盖：细胞结构与
// 细胞器、酶、呼吸与光合、遗传（显隐性/孟德尔比例/庞纳特方格）、DNA 与蛋白质合成、
// 物质运输（扩散/渗透/主动运输）、循环与气体交换、有丝/减数分裂、显微镜放大倍数、
// 自然选择与进化、稳态。数学为自然科学风格基础—中等。
// 题目全新原创，未照搬真题，也不与其他卷/练习库重复。id 前缀 esat-mk9-*。

import type { MCQQuestion } from "@/lib/tests/questions/types";

// ── 模块一：数学（自然科学基础—中等）——27 题 / 40 分钟 ─────────────────────
export const ESAT_MK9_MATH: MCQQuestion[] = [
  { id: "esat-mk9-m-01", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Calculate $15\\%$ of $60$.",
    options: [ {key:"A",text:"$6$"},{key:"B",text:"$9$"},{key:"C",text:"$12$"},{key:"D",text:"$15$"},{key:"E",text:"$4$"} ],
    answer: "B", solution: "$0.15\\times60=9$." },

  { id: "esat-mk9-m-02", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "A bag contains $3$ red counters and $7$ blue counters. One counter is chosen at random. What is the probability that it is red?",
    options: [ {key:"A",text:"$\\dfrac{3}{7}$"},{key:"B",text:"$\\dfrac{3}{10}$"},{key:"C",text:"$\\dfrac{7}{10}$"},{key:"D",text:"$\\dfrac{1}{3}$"},{key:"E",text:"$\\dfrac{1}{10}$"} ],
    answer: "B", solution: "There are $10$ counters in total and $3$ favourable outcomes, so the probability is $3/10$." },

  { id: "esat-mk9-m-03", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "A population of $2000$ bacteria doubles every hour. After $3$ hours it is:",
    options: [ {key:"A",text:"$6000$"},{key:"B",text:"$8000$"},{key:"C",text:"$12000$"},{key:"D",text:"$16000$"},{key:"E",text:"$18000$"} ],
    answer: "D", solution: "$2000\\times2^3=2000\\times8=16000$." },

  { id: "esat-mk9-m-04", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Express $2.5\\times10^{-3}$ as an ordinary number.",
    options: [ {key:"A",text:"$0.0025$"},{key:"B",text:"$0.025$"},{key:"C",text:"$0.25$"},{key:"D",text:"$2500$"},{key:"E",text:"$0.00025$"} ],
    answer: "A", solution: "$2.5\\times10^{-3}=0.0025$." },

  { id: "esat-mk9-m-05", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The numbers $4, 7, 7, 9, 13$ have a median of:",
    options: [ {key:"A",text:"$7$"},{key:"B",text:"$8$"},{key:"C",text:"$9$"},{key:"D",text:"$13$"},{key:"E",text:"$4$"} ],
    answer: "A", solution: "The middle value of the ordered set is $7$." },

  { id: "esat-mk9-m-06", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The range of $4, 7, 7, 9, 13$ is:",
    options: [ {key:"A",text:"$7$"},{key:"B",text:"$8$"},{key:"C",text:"$9$"},{key:"D",text:"$13$"},{key:"E",text:"$5$"} ],
    answer: "C", solution: "Range $=13-4=9$." },

  { id: "esat-mk9-m-07", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "The arithmetic sequence $5,9,13,\\ldots$ contains the term $53$. What is its position in the sequence?",
    options: [ {key:"A",text:"$10$th"},{key:"B",text:"$12$th"},{key:"C",text:"$13$th"},{key:"D",text:"$14$th"},{key:"E",text:"$16$th"} ],
    answer: "C", solution: "$5+4(n-1)=53$, so $4(n-1)=48$ and $n=13$." },

  { id: "esat-mk9-m-08", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "A sample loses half its mass every $5\\,\\text{days}$. What fraction remains after $15\\,\\text{days}$?",
    options: [ {key:"A",text:"$\\dfrac12$"},{key:"B",text:"$\\dfrac14$"},{key:"C",text:"$\\dfrac18$"},{key:"D",text:"$\\dfrac{1}{16}$"},{key:"E",text:"$\\dfrac{1}{3}$"} ],
    answer: "C", solution: "$15/5=3$ halvings; $\\left(\\tfrac12\\right)^3=\\tfrac18$." },

  { id: "esat-mk9-m-09", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "What is $\\dfrac{2}{5}$ as a percentage?",
    options: [ {key:"A",text:"$20\\%$"},{key:"B",text:"$25\\%$"},{key:"C",text:"$40\\%$"},{key:"D",text:"$50\\%$"},{key:"E",text:"$60\\%$"} ],
    answer: "C", solution: "$\\dfrac25=0.4=40\\%$." },

  { id: "esat-mk9-m-10", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Make $h$ the subject of $V=\\pi r^2 h$.",
    options: [ {key:"A",text:"$\\dfrac{V}{\\pi r^2}$"},{key:"B",text:"$\\dfrac{V}{\\pi r}$"},{key:"C",text:"$V\\pi r^2$"},{key:"D",text:"$\\dfrac{\\pi r^2}{V}$"},{key:"E",text:"$\\dfrac{V}{r^2}$"} ],
    answer: "A", solution: "$h=\\dfrac{V}{\\pi r^2}$." },

  { id: "esat-mk9-m-11", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "$60\\,\\text{cm}^3$ is what fraction of $1$ litre?",
    options: [ {key:"A",text:"$\\dfrac{3}{50}$"},{key:"B",text:"$\\dfrac{6}{10}$"},{key:"C",text:"$\\dfrac{1}{6}$"},{key:"D",text:"$\\dfrac{3}{5}$"},{key:"E",text:"$\\dfrac{1}{60}$"} ],
    answer: "A", solution: "$1\\,\\text{L}=1000\\,\\text{cm}^3$; $\\dfrac{60}{1000}=\\dfrac{3}{50}$." },

  { id: "esat-mk9-m-12", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "If $5(x+2)=35$, then $x=$",
    options: [ {key:"A",text:"$3$"},{key:"B",text:"$5$"},{key:"C",text:"$7$"},{key:"D",text:"$9$"},{key:"E",text:"$33$"} ],
    answer: "B", solution: "$x+2=7\\Rightarrow x=5$." },

  { id: "esat-mk9-m-13", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "The magnification of an image is $\\times400$. If the image is $8\\,\\text{mm}$ long, the actual object length is:",
    options: [ {key:"A",text:"$0.02\\,\\text{mm}$"},{key:"B",text:"$0.2\\,\\text{mm}$"},{key:"C",text:"$2\\,\\text{mm}$"},{key:"D",text:"$20\\,\\text{mm}$"},{key:"E",text:"$3200\\,\\text{mm}$"} ],
    answer: "A", solution: "Actual $=\\dfrac{\\text{image}}{\\text{magnification}}=\\dfrac{8}{400}=0.02\\,\\text{mm}$." },

  { id: "esat-mk9-m-14", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Simplify $3(2x-1)-2(x-4)$.",
    options: [ {key:"A",text:"$4x+5$"},{key:"B",text:"$4x-5$"},{key:"C",text:"$8x+5$"},{key:"D",text:"$4x+11$"},{key:"E",text:"$6x-5$"} ],
    answer: "A", solution: "$6x-3-2x+8=4x+5$." },

  { id: "esat-mk9-m-15", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "In a class of $30$, the ratio of girls to boys is $2:3$. How many girls are there?",
    options: [ {key:"A",text:"$10$"},{key:"B",text:"$12$"},{key:"C",text:"$15$"},{key:"D",text:"$18$"},{key:"E",text:"$20$"} ],
    answer: "B", solution: "$5$ parts $=30\\Rightarrow1$ part $=6$; girls $=2\\times6=12$." },

  { id: "esat-mk9-m-16", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Evaluate $\\sqrt{144}$.",
    options: [ {key:"A",text:"$11$"},{key:"B",text:"$12$"},{key:"C",text:"$13$"},{key:"D",text:"$14$"},{key:"E",text:"$72$"} ],
    answer: "B", solution: "$12^2=144$." },

  { id: "esat-mk9-m-17", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 3, marks: 1,
    question: "Two coins are flipped. The probability of getting two heads is:",
    options: [ {key:"A",text:"$\\dfrac12$"},{key:"B",text:"$\\dfrac14$"},{key:"C",text:"$\\dfrac13$"},{key:"D",text:"$\\dfrac18$"},{key:"E",text:"$\\dfrac34$"} ],
    answer: "B", solution: "$P(\\text{HH})=\\tfrac12\\times\\tfrac12=\\tfrac14$." },

  { id: "esat-mk9-m-18", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "A rectangle is $12\\,\\text{cm}$ by $5\\,\\text{cm}$. Its perimeter is:",
    options: [ {key:"A",text:"$17\\,\\text{cm}$"},{key:"B",text:"$34\\,\\text{cm}$"},{key:"C",text:"$60\\,\\text{cm}$"},{key:"D",text:"$24\\,\\text{cm}$"},{key:"E",text:"$120\\,\\text{cm}$"} ],
    answer: "B", solution: "$P=2(12+5)=34\\,\\text{cm}$." },

  { id: "esat-mk9-m-19", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "Increase $80$ by $35\\%$.",
    options: [ {key:"A",text:"$100$"},{key:"B",text:"$104$"},{key:"C",text:"$108$"},{key:"D",text:"$112$"},{key:"E",text:"$115$"} ],
    answer: "C", solution: "$80\\times1.35=108$." },

  { id: "esat-mk9-m-20", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 2, marks: 1,
    question: "What is the gradient of the tangent to $y=x^2+2x$ at $x=3$?",
    options: [ {key:"A",text:"$5$"},{key:"B",text:"$6$"},{key:"C",text:"$8$"},{key:"D",text:"$11$"},{key:"E",text:"$15$"} ],
    answer: "C", solution: "$dy/dx=2x+2$, which equals $8$ at $x=3$." },

  { id: "esat-mk9-m-21", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "A biological reaction rate triples for every $10^\\circ\\text{C}$ rise. By what factor does it change for a $20^\\circ\\text{C}$ rise?",
    options: [ {key:"A",text:"$3$"},{key:"B",text:"$6$"},{key:"C",text:"$9$"},{key:"D",text:"$20$"},{key:"E",text:"$30$"} ],
    answer: "C", solution: "$20^\\circ\\text{C}=2$ steps of $10^\\circ\\text{C}$; factor $=3^2=9$." },

  { id: "esat-mk9-m-22", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 3, marks: 1,
    question: "Solve $\\dfrac{3}{x}=\\dfrac{12}{20}$.",
    options: [ {key:"A",text:"$x=3$"},{key:"B",text:"$x=4$"},{key:"C",text:"$x=5$"},{key:"D",text:"$x=6$"},{key:"E",text:"$x=8$"} ],
    answer: "C", solution: "$\\dfrac{12}{20}=\\dfrac35$; so $\\dfrac3x=\\dfrac35\\Rightarrow x=5$." },

  { id: "esat-mk9-m-23", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "The mean of $6$ numbers is $10$. Adding a $7$th number makes the mean $11$. The $7$th number is:",
    options: [ {key:"A",text:"$11$"},{key:"B",text:"$12$"},{key:"C",text:"$17$"},{key:"D",text:"$21$"},{key:"E",text:"$77$"} ],
    answer: "C", solution: "Old sum $=60$; new sum $=7\\times11=77$; $7$th $=77-60=17$." },

  { id: "esat-mk9-m-24", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 1, marks: 1,
    question: "Simplify $\\dfrac{10^6}{10^2}$.",
    options: [ {key:"A",text:"$10^3$"},{key:"B",text:"$10^4$"},{key:"C",text:"$10^8$"},{key:"D",text:"$10^{12}$"},{key:"E",text:"$10^2$"} ],
    answer: "B", solution: "$10^{6-2}=10^4$." },

  { id: "esat-mk9-m-25", type: "mcq", testId: "esat", topicId: "esat-math2", difficulty: 3, marks: 1,
    question: "A curve has $\\dfrac{dy}{dx}=2x-4$. Its gradient is zero at $x=$",
    options: [ {key:"A",text:"$1$"},{key:"B",text:"$2$"},{key:"C",text:"$3$"},{key:"D",text:"$4$"},{key:"E",text:"$0$"} ],
    answer: "B", solution: "$2x-4=0\\Rightarrow x=2$." },

  { id: "esat-mk9-m-26", type: "mcq", testId: "esat", topicId: "esat-math1", difficulty: 2, marks: 1,
    question: "$0.6\\,\\text{g}$ expressed in milligrams is:",
    options: [ {key:"A",text:"$6\\,\\text{mg}$"},{key:"B",text:"$60\\,\\text{mg}$"},{key:"C",text:"$600\\,\\text{mg}$"},{key:"D",text:"$6000\\,\\text{mg}$"},{key:"E",text:"$0.006\\,\\text{mg}$"} ],
    answer: "C", solution: "$1\\,\\text{g}=1000\\,\\text{mg}$; $0.6\\times1000=600\\,\\text{mg}$." },

  { id: "esat-mk9-m-27", type: "mcq", testId: "esat", topicId: "esat-math3", difficulty: 2, marks: 1,
    question: "A right-angled triangle has legs $6$ and $8$. Its area is:",
    options: [ {key:"A",text:"$14$"},{key:"B",text:"$24$"},{key:"C",text:"$48$"},{key:"D",text:"$10$"},{key:"E",text:"$28$"} ],
    answer: "B", solution: "Area $=\\tfrac12(6)(8)=24$." },
];

// ── 模块二：生物（对标 NSAA）——27 题 / 40 分钟 ──────────────────────────────
export const ESAT_MK9_BIO: MCQQuestion[] = [
  { id: "esat-mk9-b-01", type: "mcq", testId: "esat", topicId: "esat-bio1", difficulty: 1, marks: 1,
    question: "Which structure is present in a plant cell but NOT in an animal cell?",
    options: [ {key:"A",text:"cell membrane"},{key:"B",text:"nucleus"},{key:"C",text:"cell wall"},{key:"D",text:"mitochondria"},{key:"E",text:"ribosome"} ],
    answer: "C", solution: "Plant cells have a cellulose cell wall (also chloroplasts and a large vacuole); animal cells do not." },

  { id: "esat-mk9-b-02", type: "mcq", testId: "esat", topicId: "esat-bio1", difficulty: 1, marks: 1,
    question: "Which organelle is the main site of aerobic respiration?",
    options: [ {key:"A",text:"nucleus"},{key:"B",text:"ribosome"},{key:"C",text:"mitochondrion"},{key:"D",text:"chloroplast"},{key:"E",text:"cell wall"} ],
    answer: "C", solution: "Most aerobic respiration (ATP production) occurs in the mitochondria." },

  { id: "esat-mk9-b-03", type: "mcq", testId: "esat", topicId: "esat-bio1", difficulty: 2, marks: 1,
    question: "Enzymes act as biological catalysts by:",
    options: [ {key:"A",text:"raising the activation energy"},{key:"B",text:"lowering the activation energy"},{key:"C",text:"being used up in the reaction"},{key:"D",text:"increasing the temperature"},{key:"E",text:"changing the products"} ],
    answer: "B", solution: "Enzymes speed up reactions by lowering the activation energy; they are not used up." },

  { id: "esat-mk9-b-04", type: "mcq", testId: "esat", topicId: "esat-bio1", difficulty: 2, marks: 1,
    question: "Above its optimum temperature, an enzyme's activity falls sharply mainly because the enzyme:",
    options: [ {key:"A",text:"is diluted"},{key:"B",text:"denatures (changes shape)"},{key:"C",text:"is used up"},{key:"D",text:"becomes an inhibitor"},{key:"E",text:"turns into substrate"} ],
    answer: "B", solution: "High temperature denatures the enzyme: its active site changes shape so substrate no longer fits." },

  { id: "esat-mk9-b-05", type: "mcq", testId: "esat", topicId: "esat-bio2", difficulty: 2, marks: 1,
    question: "The word equation for aerobic respiration is:",
    options: [ {key:"A",text:"glucose + oxygen → carbon dioxide + water"},{key:"B",text:"carbon dioxide + water → glucose + oxygen"},{key:"C",text:"glucose → lactic acid"},{key:"D",text:"oxygen + water → glucose"},{key:"E",text:"glucose + carbon dioxide → oxygen"} ],
    answer: "A", solution: "Aerobic respiration: glucose + oxygen → carbon dioxide + water (+ energy)." },

  { id: "esat-mk9-b-06", type: "mcq", testId: "esat", topicId: "esat-bio2", difficulty: 2, marks: 1,
    question: "Photosynthesis in a leaf mainly occurs in cells containing:",
    options: [ {key:"A",text:"mitochondria"},{key:"B",text:"chloroplasts"},{key:"C",text:"ribosomes"},{key:"D",text:"vacuoles"},{key:"E",text:"nuclei"} ],
    answer: "B", solution: "Chloroplasts contain chlorophyll, which absorbs light for photosynthesis." },

  { id: "esat-mk9-b-07", type: "mcq", testId: "esat", topicId: "esat-bio2", difficulty: 1, marks: 1,
    question: "The net movement of water across a partially permeable membrane from a dilute to a more concentrated solution is called:",
    options: [ {key:"A",text:"diffusion"},{key:"B",text:"osmosis"},{key:"C",text:"active transport"},{key:"D",text:"respiration"},{key:"E",text:"transpiration"} ],
    answer: "B", solution: "Osmosis is the movement of water across a partially permeable membrane down a water-potential gradient." },

  { id: "esat-mk9-b-08", type: "mcq", testId: "esat", topicId: "esat-bio2", difficulty: 2, marks: 1,
    question: "Which process moves substances against a concentration gradient and requires energy?",
    options: [ {key:"A",text:"diffusion"},{key:"B",text:"osmosis"},{key:"C",text:"active transport"},{key:"D",text:"filtration"},{key:"E",text:"evaporation"} ],
    answer: "C", solution: "Active transport moves substances against the gradient and uses energy (ATP)." },

  { id: "esat-mk9-b-09", type: "mcq", testId: "esat", topicId: "esat-bio3", difficulty: 2, marks: 1,
    question: "In humans, the sex chromosomes of a normal male are:",
    options: [ {key:"A",text:"XX"},{key:"B",text:"XY"},{key:"C",text:"YY"},{key:"D",text:"XO"},{key:"E",text:"XXY"} ],
    answer: "B", solution: "Males are XY; females are XX." },

  { id: "esat-mk9-b-10", type: "mcq", testId: "esat", topicId: "esat-bio3", difficulty: 3, marks: 1,
    question: "Two heterozygous tall plants (Tt) are crossed, where T (tall) is dominant. What proportion of offspring are expected to be short?",
    options: [ {key:"A",text:"$0$"},{key:"B",text:"$\\dfrac14$"},{key:"C",text:"$\\dfrac12$"},{key:"D",text:"$\\dfrac34$"},{key:"E",text:"all"} ],
    answer: "B", solution: "Tt × Tt gives TT:Tt:tt $=1:2:1$; only tt (short) $=\\tfrac14$." },

  { id: "esat-mk9-b-11", type: "mcq", testId: "esat", topicId: "esat-bio3", difficulty: 3, marks: 1,
    question: "In the same cross (Tt × Tt), what proportion of offspring are expected to be tall?",
    options: [ {key:"A",text:"$\\dfrac14$"},{key:"B",text:"$\\dfrac12$"},{key:"C",text:"$\\dfrac34$"},{key:"D",text:"all"},{key:"E",text:"$\\dfrac13$"} ],
    answer: "C", solution: "TT and Tt are tall $=3$ out of $4=\\tfrac34$." },

  { id: "esat-mk9-b-12", type: "mcq", testId: "esat", topicId: "esat-bio3", difficulty: 2, marks: 1,
    question: "The genetic information in DNA is carried in the sequence of:",
    options: [ {key:"A",text:"amino acids"},{key:"B",text:"bases"},{key:"C",text:"sugars"},{key:"D",text:"proteins"},{key:"E",text:"ribosomes"} ],
    answer: "B", solution: "The order of bases (A, T, C, G) encodes genetic information." },

  { id: "esat-mk9-b-13", type: "mcq", testId: "esat", topicId: "esat-bio3", difficulty: 2, marks: 1,
    question: "In DNA, the base adenine (A) always pairs with:",
    options: [ {key:"A",text:"guanine"},{key:"B",text:"cytosine"},{key:"C",text:"thymine"},{key:"D",text:"uracil"},{key:"E",text:"adenine"} ],
    answer: "C", solution: "In DNA, A pairs with T (and C pairs with G)." },

  { id: "esat-mk9-b-14", type: "mcq", testId: "esat", topicId: "esat-bio1", difficulty: 2, marks: 1,
    question: "Proteins are assembled at which cell structure?",
    options: [ {key:"A",text:"nucleus"},{key:"B",text:"ribosome"},{key:"C",text:"mitochondrion"},{key:"D",text:"cell membrane"},{key:"E",text:"vacuole"} ],
    answer: "B", solution: "Ribosomes are the site of protein synthesis (translation)." },

  { id: "esat-mk9-b-15", type: "mcq", testId: "esat", topicId: "esat-bio2", difficulty: 2, marks: 1,
    question: "When oxygen is in short supply, human muscle cells respire anaerobically, producing:",
    options: [ {key:"A",text:"carbon dioxide and water"},{key:"B",text:"lactic acid"},{key:"C",text:"ethanol and carbon dioxide"},{key:"D",text:"glucose"},{key:"E",text:"oxygen"} ],
    answer: "B", solution: "In human muscle, anaerobic respiration produces lactic acid." },

  { id: "esat-mk9-b-16", type: "mcq", testId: "esat", topicId: "esat-bio1", difficulty: 1, marks: 1,
    question: "Which part of a cell controls its activities and contains the chromosomes?",
    options: [ {key:"A",text:"cytoplasm"},{key:"B",text:"nucleus"},{key:"C",text:"cell membrane"},{key:"D",text:"mitochondrion"},{key:"E",text:"ribosome"} ],
    answer: "B", solution: "The nucleus contains the chromosomes (DNA) and controls cell activities." },

  { id: "esat-mk9-b-17", type: "mcq", testId: "esat", topicId: "esat-bio2", difficulty: 2, marks: 1,
    question: "In humans, oxygen enters the blood from the air mainly at the:",
    options: [ {key:"A",text:"trachea"},{key:"B",text:"bronchi"},{key:"C",text:"alveoli"},{key:"D",text:"diaphragm"},{key:"E",text:"larynx"} ],
    answer: "C", solution: "Gas exchange occurs across the thin walls of the alveoli in the lungs." },

  { id: "esat-mk9-b-18", type: "mcq", testId: "esat", topicId: "esat-bio2", difficulty: 2, marks: 1,
    question: "Which blood vessels carry blood away from the heart?",
    options: [ {key:"A",text:"veins"},{key:"B",text:"arteries"},{key:"C",text:"capillaries"},{key:"D",text:"venules"},{key:"E",text:"lymph vessels"} ],
    answer: "B", solution: "Arteries carry blood away from the heart (usually at high pressure)." },

  { id: "esat-mk9-b-19", type: "mcq", testId: "esat", topicId: "esat-bio3", difficulty: 3, marks: 1,
    question: "A cell with $23$ pairs of chromosomes divides by mitosis. Each daughter cell has how many chromosomes?",
    options: [ {key:"A",text:"$23$"},{key:"B",text:"$46$"},{key:"C",text:"$92$"},{key:"D",text:"$12$"},{key:"E",text:"$24$"} ],
    answer: "B", solution: "Mitosis produces genetically identical cells with the full number: $23$ pairs $=46$ chromosomes." },

  { id: "esat-mk9-b-20", type: "mcq", testId: "esat", topicId: "esat-bio3", difficulty: 3, marks: 1,
    question: "Which type of cell division produces gametes with half the chromosome number?",
    options: [ {key:"A",text:"mitosis"},{key:"B",text:"meiosis"},{key:"C",text:"binary fission"},{key:"D",text:"budding"},{key:"E",text:"cloning"} ],
    answer: "B", solution: "Meiosis produces haploid gametes (half the chromosome number) with genetic variation." },

  { id: "esat-mk9-b-21", type: "mcq", testId: "esat", topicId: "esat-bio2", difficulty: 2, marks: 1,
    question: "The main role of red blood cells is to:",
    options: [ {key:"A",text:"fight infection"},{key:"B",text:"carry oxygen"},{key:"C",text:"clot blood"},{key:"D",text:"produce antibodies"},{key:"E",text:"digest food"} ],
    answer: "B", solution: "Red blood cells contain haemoglobin, which transports oxygen." },

  { id: "esat-mk9-b-22", type: "mcq", testId: "esat", topicId: "esat-bio3", difficulty: 2, marks: 1,
    question: "Variation that arises from changes in the DNA base sequence is due to:",
    options: [ {key:"A",text:"respiration"},{key:"B",text:"mutation"},{key:"C",text:"digestion"},{key:"D",text:"osmosis"},{key:"E",text:"diffusion"} ],
    answer: "B", solution: "A mutation is a change in the DNA base sequence, a source of genetic variation." },

  { id: "esat-mk9-b-23", type: "mcq", testId: "esat", topicId: "esat-bio3", difficulty: 3, marks: 1,
    question: "According to natural selection, individuals best suited to their environment are more likely to:",
    options: [ {key:"A",text:"mutate faster"},{key:"B",text:"survive and reproduce"},{key:"C",text:"change their genes deliberately"},{key:"D",text:"live forever"},{key:"E",text:"lose their adaptations"} ],
    answer: "B", solution: "Better-adapted individuals are more likely to survive and pass on their advantageous alleles." },

  { id: "esat-mk9-b-24", type: "mcq", testId: "esat", topicId: "esat-bio2", difficulty: 2, marks: 1,
    question: "The rate of photosynthesis can be limited by all of the following EXCEPT:",
    options: [ {key:"A",text:"light intensity"},{key:"B",text:"carbon dioxide concentration"},{key:"C",text:"temperature"},{key:"D",text:"oxygen concentration in the air"},{key:"E",text:"chlorophyll amount"} ],
    answer: "D", solution: "Light, CO$_2$ and temperature are the main limiting factors; atmospheric oxygen concentration is not a limiting factor." },

  { id: "esat-mk9-b-25", type: "mcq", testId: "esat", topicId: "esat-bio1", difficulty: 2, marks: 1,
    question: "The maintenance of a constant internal environment in the body is called:",
    options: [ {key:"A",text:"homeostasis"},{key:"B",text:"metabolism"},{key:"C",text:"respiration"},{key:"D",text:"digestion"},{key:"E",text:"excretion"} ],
    answer: "A", solution: "Homeostasis is the regulation of a stable internal environment (e.g. temperature, blood glucose)." },

  { id: "esat-mk9-b-26", type: "mcq", testId: "esat", topicId: "esat-bio2", difficulty: 3, marks: 1,
    question: "In a food chain, most energy is lost between trophic levels mainly through:",
    options: [ {key:"A",text:"photosynthesis"},{key:"B",text:"respiration and heat loss"},{key:"C",text:"osmosis"},{key:"D",text:"mutation"},{key:"E",text:"pollination"} ],
    answer: "B", solution: "Energy is lost between levels largely as heat from respiration (and in movement, waste, etc.)." },

  { id: "esat-mk9-b-27", type: "mcq", testId: "esat", topicId: "esat-bio1", difficulty: 1, marks: 1,
    question: "Which of these is a single-celled organism with no nucleus?",
    options: [ {key:"A",text:"a bacterium"},{key:"B",text:"a human liver cell"},{key:"C",text:"a plant root cell"},{key:"D",text:"a yeast cell"},{key:"E",text:"a red blood cell precursor"} ],
    answer: "A", solution: "Bacteria are prokaryotes: single-celled with no true (membrane-bound) nucleus." },
];
