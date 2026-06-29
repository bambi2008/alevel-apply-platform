// ESAT 生物题库（Module 2 选修 · 生物方向）
// 自然科学(生化方向) / 兽医学 考生需选生物模块。
// 本文件按知识点分块导出，最终在 esat.ts 的 ESAT_QUESTIONS 聚合。
//
// 进度：
//   esat-bio1 细胞与分子生物学 —— 40 题 ✓（本批）
//   esat-bio2 遗传与进化       —— 待补
//   esat-bio3 生理学与生态学   —— 待补

import type { MCQQuestion } from "@/lib/tests/questions/types";

// ════════════════════════════════════════════════════════════════════════
//  esat-bio1 · 细胞与分子生物学 (Cell & Molecular Biology) — 40 题
// ════════════════════════════════════════════════════════════════════════
export const ESAT_BIO_CELL: MCQQuestion[] = [
  // ── 细胞结构与细胞器 (8) ──────────────────────────────────────────────
  {
    id: "esat-b-001",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 1,
    marks: 1,
    question:
      "Which structure is present in a prokaryotic cell but absent in all eukaryotic cells?",
    options: [
      { key: "A", text: "Ribosomes" },
      { key: "B", text: "Cell-surface (plasma) membrane" },
      { key: "C", text: "A cell wall containing peptidoglycan (murein)" },
      { key: "D", text: "DNA" },
    ],
    answer: "C",
    solution:
      "Ribosomes, a plasma membrane and DNA occur in both cell types. A wall made of peptidoglycan is unique to bacteria; eukaryotic walls (where present) use cellulose, chitin or glycoproteins instead.",
  },
  {
    id: "esat-b-002",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 1,
    marks: 1,
    question:
      "Which organelle is the main site of aerobic respiration and ATP synthesis?",
    options: [
      { key: "A", text: "Mitochondrion" },
      { key: "B", text: "Chloroplast" },
      { key: "C", text: "Golgi apparatus" },
      { key: "D", text: "Lysosome" },
    ],
    answer: "A",
    solution:
      "Oxidative phosphorylation occurs on the inner mitochondrial membrane (cristae), where most ATP is produced. Chloroplasts perform photosynthesis; the Golgi modifies/packages proteins; lysosomes digest material.",
  },
  {
    id: "esat-b-003",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "A protein destined for secretion is made and processed by several organelles. Which sequence shows the correct order of the pathway?",
    options: [
      { key: "A", text: "Rough ER → Golgi apparatus → vesicle → plasma membrane" },
      { key: "B", text: "Golgi apparatus → rough ER → lysosome → plasma membrane" },
      { key: "C", text: "Smooth ER → nucleus → Golgi apparatus → plasma membrane" },
      { key: "D", text: "Rough ER → mitochondrion → Golgi apparatus → plasma membrane" },
    ],
    answer: "A",
    solution:
      "Ribosomes on the rough ER synthesise the protein; it is transported in vesicles to the Golgi for modification, then packaged into secretory vesicles that fuse with the plasma membrane (exocytosis).",
  },
  {
    id: "esat-b-004",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "A cell is specialised for secreting large amounts of digestive enzyme. Which combination of organelles would you expect to be especially abundant?",
    options: [
      { key: "A", text: "Chloroplasts and vacuoles" },
      { key: "B", text: "Rough ER, Golgi apparatus and mitochondria" },
      { key: "C", text: "Lysosomes only" },
      { key: "D", text: "Smooth ER and centrioles" },
    ],
    answer: "B",
    solution:
      "Enzymes are proteins, so abundant rough ER (synthesis) and Golgi (processing/packaging) are needed, plus many mitochondria to supply ATP for synthesis and secretion.",
  },
  {
    id: "esat-b-005",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "An object measured under a light microscope appears $5\\text{ mm}$ long at a magnification of $\\times 400$. What is its actual length?",
    options: [
      { key: "A", text: "$0.8\\ \\mu\\text{m}$" },
      { key: "B", text: "$12.5\\ \\mu\\text{m}$" },
      { key: "C", text: "$2000\\ \\mu\\text{m}$" },
      { key: "D", text: "$1.25\\ \\mu\\text{m}$" },
    ],
    answer: "B",
    solution:
      "Actual size = image size ÷ magnification = $5\\text{ mm} \\div 400 = 0.0125\\text{ mm} = 12.5\\ \\mu\\text{m}$ (since $1\\text{ mm}=1000\\ \\mu\\text{m}$).",
  },
  {
    id: "esat-b-006",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 1,
    marks: 1,
    question:
      "Which feature is found in a typical plant cell but NOT in a typical animal cell?",
    options: [
      { key: "A", text: "Nucleus" },
      { key: "B", text: "Mitochondria" },
      { key: "C", text: "A large permanent vacuole bounded by a tonoplast" },
      { key: "D", text: "Ribosomes" },
    ],
    answer: "C",
    solution:
      "Nuclei, mitochondria and ribosomes are common to both. A large central vacuole surrounded by a tonoplast (together with a cellulose wall and chloroplasts) is characteristic of plant cells.",
  },
  {
    id: "esat-b-007",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 3,
    marks: 1,
    question:
      "Cells were broken open and centrifuged at increasing speeds (differential centrifugation). Which organelle settles into a pellet FIRST (at the lowest speed)?",
    options: [
      { key: "A", text: "Ribosomes" },
      { key: "B", text: "Mitochondria" },
      { key: "C", text: "Nuclei" },
      { key: "D", text: "Endoplasmic reticulum fragments" },
    ],
    answer: "C",
    solution:
      "Denser, larger organelles sediment at lower speeds. Nuclei are the largest and densest, so they pellet first; mitochondria next; ribosomes (smallest) require the highest speed.",
  },
  {
    id: "esat-b-008",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "Why does a smaller cell exchange substances with its surroundings more efficiently than a larger cell of the same shape?",
    options: [
      { key: "A", text: "It has a smaller surface area to volume ratio" },
      { key: "B", text: "It has a larger surface area to volume ratio" },
      { key: "C", text: "Its volume increases faster than its surface area" },
      { key: "D", text: "Diffusion does not depend on cell size" },
    ],
    answer: "B",
    solution:
      "As size increases, volume rises with the cube of length but surface area only with the square, so SA:V falls. Smaller cells have a larger SA:V, giving relatively more membrane for exchange per unit of metabolic demand.",
  },

  // ── 生物膜与物质运输 (7) ──────────────────────────────────────────────
  {
    id: "esat-b-009",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 1,
    marks: 1,
    question:
      "In the fluid-mosaic model, the basic structural framework of a cell membrane is a:",
    options: [
      { key: "A", text: "Single layer of protein" },
      { key: "B", text: "Phospholipid bilayer" },
      { key: "C", text: "Layer of cellulose fibres" },
      { key: "D", text: "Continuous sheet of cholesterol" },
    ],
    answer: "B",
    solution:
      "Membranes are built from a phospholipid bilayer (hydrophilic heads outward, hydrophobic tails inward) within which proteins and cholesterol are embedded — the 'mosaic' that is 'fluid' because components can move laterally.",
  },
  {
    id: "esat-b-010",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "Which molecule can diffuse directly through the phospholipid bilayer WITHOUT a transport protein?",
    options: [
      { key: "A", text: "Sodium ions (Na⁺)" },
      { key: "B", text: "Glucose" },
      { key: "C", text: "Oxygen" },
      { key: "D", text: "Amino acids" },
    ],
    answer: "C",
    solution:
      "Small, non-polar molecules such as O₂ and CO₂ dissolve in the hydrophobic core and diffuse freely. Ions and large polar molecules (glucose, amino acids) need channel or carrier proteins.",
  },
  {
    id: "esat-b-011",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "Which statement about active transport is correct?",
    options: [
      { key: "A", text: "It moves substances down a concentration gradient using no energy" },
      { key: "B", text: "It moves substances against a concentration gradient using ATP" },
      { key: "C", text: "It occurs only through the lipid bilayer, not through proteins" },
      { key: "D", text: "It is unaffected by the number of carrier proteins" },
    ],
    answer: "B",
    solution:
      "Active transport uses carrier proteins (pumps) and ATP to move substances against (up) their concentration gradient; its rate depends on the number of carriers and on respiration supplying ATP.",
  },
  {
    id: "esat-b-012",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "An animal cell is placed in a solution with a LOWER (more negative) water potential than its cytoplasm. What happens?",
    options: [
      { key: "A", text: "Water enters the cell and it may burst (lysis)" },
      { key: "B", text: "Water leaves the cell and it shrinks (crenation)" },
      { key: "C", text: "There is no net movement of water" },
      { key: "D", text: "The cell becomes turgid" },
    ],
    answer: "B",
    solution:
      "Water moves by osmosis from higher (less negative) to lower (more negative) water potential. The external solution is more negative, so water leaves the cell; an animal cell shrinks and crenates (no wall to resist it).",
  },
  {
    id: "esat-b-013",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 3,
    marks: 1,
    question:
      "A plant cell has solute potential $\\psi_s = -800\\text{ kPa}$ and pressure potential $\\psi_p = +300\\text{ kPa}$. What is its water potential $\\psi$?",
    options: [
      { key: "A", text: "$-1100\\text{ kPa}$" },
      { key: "B", text: "$-500\\text{ kPa}$" },
      { key: "C", text: "$+500\\text{ kPa}$" },
      { key: "D", text: "$+1100\\text{ kPa}$" },
    ],
    answer: "B",
    solution:
      "Water potential $\\psi = \\psi_s + \\psi_p = (-800) + (+300) = -500\\text{ kPa}$.",
  },
  {
    id: "esat-b-014",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "Facilitated diffusion differs from simple diffusion because it:",
    options: [
      { key: "A", text: "Requires ATP" },
      { key: "B", text: "Moves substances against the gradient" },
      { key: "C", text: "Uses channel or carrier proteins but no metabolic energy" },
      { key: "D", text: "Only transports gases" },
    ],
    answer: "C",
    solution:
      "Facilitated diffusion is passive (down the gradient, no ATP) but uses transport proteins to move polar/charged solutes that cannot cross the bilayer directly.",
  },
  {
    id: "esat-b-015",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 3,
    marks: 1,
    question:
      "The rate of facilitated diffusion of glucose into a cell is increased by raising the external glucose concentration, but eventually levels off (plateaus). The best explanation is that:",
    options: [
      { key: "A", text: "Glucose has been used up inside the cell" },
      { key: "B", text: "All the carrier proteins are saturated (working at maximum rate)" },
      { key: "C", text: "The temperature has fallen" },
      { key: "D", text: "ATP has run out" },
    ],
    answer: "B",
    solution:
      "Carrier proteins are finite. Once every carrier is continuously occupied, adding more glucose cannot increase the rate — the system is saturated, so the curve plateaus. (ATP is irrelevant: facilitated diffusion is passive.)",
  },
  {
    id: "esat-b-016",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 1,
    marks: 1,
    question:
      "What is the role of cholesterol in an animal cell-surface membrane?",
    options: [
      { key: "A", text: "It actively pumps ions across the membrane" },
      { key: "B", text: "It carries out photosynthesis" },
      { key: "C", text: "It regulates membrane fluidity and stability" },
      { key: "D", text: "It stores genetic information" },
    ],
    answer: "C",
    solution:
      "Cholesterol sits between phospholipids, restricting their movement and reducing fluidity at high temperature while preventing rigidity at low temperature — stabilising the membrane and reducing ion leakage.",
  },

  // ── 酶 (7) ───────────────────────────────────────────────────────────
  {
    id: "esat-b-017",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 1,
    marks: 1,
    question:
      "Enzymes increase the rate of a reaction by:",
    options: [
      { key: "A", text: "Increasing the activation energy" },
      { key: "B", text: "Lowering the activation energy" },
      { key: "C", text: "Raising the temperature of the reaction" },
      { key: "D", text: "Changing the overall energy released by the reaction" },
    ],
    answer: "B",
    solution:
      "Enzymes are biological catalysts that provide an alternative pathway with a lower activation energy. They do not change the net energy change (ΔG) of the reaction, only its rate.",
  },
  {
    id: "esat-b-018",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "According to the 'induced-fit' model of enzyme action, when the substrate binds:",
    options: [
      { key: "A", text: "The active site is already an exact, rigid complement to the substrate" },
      { key: "B", text: "The active site changes shape slightly to fit around the substrate" },
      { key: "C", text: "The substrate changes into the same shape as the enzyme" },
      { key: "D", text: "No conformational change occurs at all" },
    ],
    answer: "B",
    solution:
      "The induced-fit model proposes that the active site is not perfectly complementary at first; substrate binding induces a conformational change that moulds the active site around the substrate, straining bonds and catalysing the reaction.",
  },
  {
    id: "esat-b-019",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "Above its optimum temperature, the rate of an enzyme-catalysed reaction falls sharply. The main reason is that:",
    options: [
      { key: "A", text: "Substrate molecules move too slowly" },
      { key: "B", text: "The enzyme's tertiary structure is denatured, altering the active site" },
      { key: "C", text: "The activation energy increases" },
      { key: "D", text: "The pH automatically rises" },
    ],
    answer: "B",
    solution:
      "High temperature breaks the hydrogen and ionic bonds holding the enzyme's 3-D (tertiary) shape. The active site changes shape, so substrate can no longer bind — the enzyme is denatured.",
  },
  {
    id: "esat-b-020",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 3,
    marks: 1,
    question:
      "A competitive inhibitor and a non-competitive inhibitor are compared. Which statement is correct?",
    options: [
      { key: "A", text: "Increasing substrate concentration reverses competitive but not non-competitive inhibition" },
      { key: "B", text: "Increasing substrate concentration reverses non-competitive but not competitive inhibition" },
      { key: "C", text: "Both bind to the active site" },
      { key: "D", text: "Neither is affected by substrate concentration" },
    ],
    answer: "A",
    solution:
      "A competitive inhibitor binds the active site and competes with substrate, so excess substrate out-competes it (effect reversible). A non-competitive inhibitor binds elsewhere (allosteric site) and changes the active site, so adding substrate does not relieve the inhibition.",
  },
  {
    id: "esat-b-021",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "In an experiment, substrate concentration is increased while enzyme concentration is kept constant. The rate rises then plateaus. At the plateau, the limiting factor is:",
    options: [
      { key: "A", text: "Substrate concentration" },
      { key: "B", text: "The number of available active sites (enzyme concentration)" },
      { key: "C", text: "Temperature" },
      { key: "D", text: "Product concentration" },
    ],
    answer: "B",
    solution:
      "At low substrate concentration, substrate limits the rate. Once enough substrate keeps all active sites occupied, the rate is capped by how fast the fixed number of enzyme molecules can work — enzyme concentration becomes limiting.",
  },
  {
    id: "esat-b-022",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 1,
    marks: 1,
    question:
      "Which statement about enzymes is correct?",
    options: [
      { key: "A", text: "Each enzyme can catalyse many unrelated reactions" },
      { key: "B", text: "Enzymes are used up and destroyed during the reaction" },
      { key: "C", text: "Enzymes are specific because the active site is complementary to one substrate" },
      { key: "D", text: "Enzymes work best at 100 °C" },
    ],
    answer: "C",
    solution:
      "Enzyme specificity arises because the active-site shape is complementary to a particular substrate. Enzymes are not consumed (they are catalysts) and most have an optimum near body or environmental temperature, not 100 °C.",
  },
  {
    id: "esat-b-023",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 3,
    marks: 1,
    question:
      "End-product inhibition (negative feedback) in a metabolic pathway typically works because the final product:",
    options: [
      { key: "A", text: "Permanently denatures every enzyme in the pathway" },
      { key: "B", text: "Acts as a non-competitive inhibitor of an enzyme early in the pathway" },
      { key: "C", text: "Increases the substrate concentration" },
      { key: "D", text: "Raises the temperature of the cell" },
    ],
    answer: "B",
    solution:
      "The product binds reversibly to an allosteric site on an enzyme catalysing an early step, slowing the pathway when product is plentiful. As product is used up, inhibition is relieved — a self-regulating feedback loop.",
  },

  // ── DNA 结构与复制 (6) ────────────────────────────────────────────────
  {
    id: "esat-b-024",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 1,
    marks: 1,
    question:
      "In DNA, which bases pair together?",
    options: [
      { key: "A", text: "Adenine–Cytosine and Guanine–Thymine" },
      { key: "B", text: "Adenine–Thymine and Guanine–Cytosine" },
      { key: "C", text: "Adenine–Guanine and Cytosine–Thymine" },
      { key: "D", text: "Adenine–Uracil and Guanine–Cytosine" },
    ],
    answer: "B",
    solution:
      "Complementary base pairing in DNA is A–T (2 hydrogen bonds) and G–C (3 hydrogen bonds). Uracil replaces thymine in RNA, not DNA.",
  },
  {
    id: "esat-b-025",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "A sample of double-stranded DNA contains 20% adenine. What percentage is cytosine?",
    options: [
      { key: "A", text: "$20\\%$" },
      { key: "B", text: "$30\\%$" },
      { key: "C", text: "$40\\%$" },
      { key: "D", text: "$60\\%$" },
    ],
    answer: "B",
    solution:
      "By Chargaff's rule, %A = %T = 20%, so A+T = 40%. The remaining 60% is G+C, split equally: %C = %G = 30%.",
  },
  {
    id: "esat-b-026",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "DNA replication is described as 'semi-conservative'. This means each new DNA molecule contains:",
    options: [
      { key: "A", text: "Two newly synthesised strands" },
      { key: "B", text: "One original (template) strand and one new strand" },
      { key: "C", text: "Two original strands" },
      { key: "D", text: "Only fragments of the original strands" },
    ],
    answer: "B",
    solution:
      "The double helix unwinds and each strand acts as a template. Each daughter molecule therefore keeps one parental strand and gains one newly made complementary strand — hence 'semi-conservative' (confirmed by Meselson and Stahl).",
  },
  {
    id: "esat-b-027",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "Which enzyme joins free DNA nucleotides to the template strand by forming phosphodiester bonds during replication?",
    options: [
      { key: "A", text: "DNA helicase" },
      { key: "B", text: "DNA polymerase" },
      { key: "C", text: "RNA polymerase" },
      { key: "D", text: "Amylase" },
    ],
    answer: "B",
    solution:
      "DNA helicase unwinds and separates the strands; DNA polymerase then adds complementary nucleotides to the template and catalyses formation of phosphodiester bonds in the sugar-phosphate backbone.",
  },
  {
    id: "esat-b-028",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 3,
    marks: 1,
    question:
      "In the Meselson–Stahl experiment, bacteria grown in heavy ¹⁵N were switched to light ¹⁴N. After exactly TWO rounds of replication, the proportion of DNA molecules containing a heavy (¹⁵N) strand is:",
    options: [
      { key: "A", text: "0 (none)" },
      { key: "B", text: "One quarter ($\\tfrac{1}{4}$)" },
      { key: "C", text: "One half ($\\tfrac{1}{2}$)" },
      { key: "D", text: "All of them" },
    ],
    answer: "C",
    solution:
      "Two ¹⁵N strands seed replication. After two rounds there are 4 molecules and 8 strands, but still only the original 2 heavy strands. Those 2 heavy strands sit in 2 of the 4 molecules, so $\\tfrac{2}{4}=\\tfrac12$ contain a heavy strand (the rest are fully light).",
  },
  {
    id: "esat-b-029",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 1,
    marks: 1,
    question:
      "A single DNA nucleotide is made of:",
    options: [
      { key: "A", text: "A ribose sugar, a phosphate and a base" },
      { key: "B", text: "A deoxyribose sugar, a phosphate and a nitrogenous base" },
      { key: "C", text: "An amino acid, a phosphate and a base" },
      { key: "D", text: "Two sugars joined to one base" },
    ],
    answer: "B",
    solution:
      "A DNA nucleotide = deoxyribose (a pentose sugar) + phosphate group + one nitrogenous base (A, T, G or C). RNA uses ribose instead of deoxyribose.",
  },

  // ── 蛋白质合成 (6) ───────────────────────────────────────────────────
  {
    id: "esat-b-030",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "During transcription, the DNA template strand reads $3'$–TAC GGA–$5'$. What is the corresponding mRNA sequence (read $5'\\to3'$)?",
    options: [
      { key: "A", text: "AUG CCU" },
      { key: "B", text: "ATG CCT" },
      { key: "C", text: "UAC GGA" },
      { key: "D", text: "AUG GGA" },
    ],
    answer: "A",
    solution:
      "mRNA is complementary to the template with U replacing T: template T→A, A→U, C→G, G→C, G→C, A→U gives AUG CCU. (Note AUG is the start codon.)",
  },
  {
    id: "esat-b-031",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 1,
    marks: 1,
    question:
      "What is the role of transfer RNA (tRNA) in translation?",
    options: [
      { key: "A", text: "It carries the genetic code out of the nucleus" },
      { key: "B", text: "It brings specific amino acids to the ribosome according to the codon" },
      { key: "C", text: "It joins amino acids by replication" },
      { key: "D", text: "It forms the bulk of the ribosome's enzymes" },
    ],
    answer: "B",
    solution:
      "Each tRNA has an anticodon that base-pairs with a complementary mRNA codon, and carries the specific amino acid for that codon, delivering amino acids in the correct order for the polypeptide.",
  },
  {
    id: "esat-b-032",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "A length of mRNA contains 90 nucleotides in its coding region (including a stop codon). The maximum number of amino acids in the polypeptide it codes for is:",
    options: [
      { key: "A", text: "90" },
      { key: "B", text: "45" },
      { key: "C", text: "30" },
      { key: "D", text: "29" },
    ],
    answer: "D",
    solution:
      "Each codon = 3 nucleotides, so 90 ÷ 3 = 30 codons. One codon is a stop codon that codes for no amino acid, leaving 29 amino acids.",
  },
  {
    id: "esat-b-033",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 3,
    marks: 1,
    question:
      "The genetic code is described as 'degenerate'. Which observation BEST illustrates this?",
    options: [
      { key: "A", text: "Each codon codes for several different amino acids" },
      { key: "B", text: "Several different codons can code for the same amino acid" },
      { key: "C", text: "The code is read in overlapping triplets" },
      { key: "D", text: "Every organism uses a completely different code" },
    ],
    answer: "B",
    solution:
      "Degeneracy means most amino acids are specified by more than one codon (e.g. leucine has six codons). This can make some base substitutions 'silent', having no effect on the protein.",
  },
  {
    id: "esat-b-034",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "Where in a eukaryotic cell does translation (assembly of the polypeptide) take place?",
    options: [
      { key: "A", text: "In the nucleus" },
      { key: "B", text: "On ribosomes in the cytoplasm or on the rough ER" },
      { key: "C", text: "Inside mitochondria only" },
      { key: "D", text: "In the Golgi apparatus" },
    ],
    answer: "B",
    solution:
      "Transcription occurs in the nucleus; the mRNA then moves to the cytoplasm where ribosomes (free or attached to the rough ER) translate it into a polypeptide.",
  },
  {
    id: "esat-b-035",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 3,
    marks: 1,
    question:
      "A single base in a gene is substituted, yet the protein produced is completely unchanged. The most likely reason is that the new codon:",
    options: [
      { key: "A", text: "Codes for the same amino acid (a silent mutation)" },
      { key: "B", text: "Is a stop codon" },
      { key: "C", text: "Causes a frameshift" },
      { key: "D", text: "Deletes the whole gene" },
    ],
    answer: "A",
    solution:
      "Because the code is degenerate, a substitution can give a different codon that still specifies the same amino acid, so the amino-acid sequence — and the protein — is unchanged (a silent/synonymous mutation). Insertions/deletions, by contrast, cause frameshifts.",
  },

  // ── 细胞周期与细胞分裂 (5) ────────────────────────────────────────────
  {
    id: "esat-b-036",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "During which stage of the cell cycle is DNA replicated?",
    options: [
      { key: "A", text: "G₁ phase" },
      { key: "B", text: "S phase" },
      { key: "C", text: "Metaphase" },
      { key: "D", text: "Cytokinesis" },
    ],
    answer: "B",
    solution:
      "DNA is synthesised (replicated) during S (synthesis) phase of interphase, so each chromosome then consists of two identical sister chromatids before mitosis.",
  },
  {
    id: "esat-b-037",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 2,
    marks: 1,
    question:
      "In which stage of mitosis do chromosomes line up along the equator (metaphase plate) of the cell?",
    options: [
      { key: "A", text: "Prophase" },
      { key: "B", text: "Metaphase" },
      { key: "C", text: "Anaphase" },
      { key: "D", text: "Telophase" },
    ],
    answer: "B",
    solution:
      "In metaphase the chromosomes (each two sister chromatids) align on the equatorial plate, attached to spindle fibres by their centromeres, ready to be separated in anaphase.",
  },
  {
    id: "esat-b-038",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 1,
    marks: 1,
    question:
      "Mitosis produces:",
    options: [
      { key: "A", text: "Two genetically identical diploid daughter cells" },
      { key: "B", text: "Four genetically different haploid cells" },
      { key: "C", text: "Two haploid gametes" },
      { key: "D", text: "Four identical diploid cells" },
    ],
    answer: "A",
    solution:
      "Mitosis yields two daughter cells genetically identical to the parent and to each other, with the same (diploid) chromosome number — used for growth and repair. Meiosis is what produces four genetically varied haploid gametes.",
  },
  {
    id: "esat-b-039",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 3,
    marks: 1,
    question:
      "Which feature of MEIOSIS (but not mitosis) increases genetic variation among the daughter cells?",
    options: [
      { key: "A", text: "DNA replication before division" },
      { key: "B", text: "Crossing over and independent assortment of homologous chromosomes" },
      { key: "C", text: "Separation of sister chromatids" },
      { key: "D", text: "Formation of a spindle" },
    ],
    answer: "B",
    solution:
      "Crossing over (exchange of alleles between homologues in prophase I) and independent assortment (random orientation of homologous pairs in metaphase I) are unique to meiosis and generate new allele combinations. The other options also occur in mitosis.",
  },
  {
    id: "esat-b-040",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio1",
    difficulty: 3,
    marks: 1,
    question:
      "An organism has a diploid number of $2n = 8$. How many chromosomes are present in each cell at the END of meiosis I (in each of the two cells formed)?",
    options: [
      { key: "A", text: "8, each as a single chromatid" },
      { key: "B", text: "4, each consisting of two chromatids" },
      { key: "C", text: "4, each as a single chromatid" },
      { key: "D", text: "16, each as two chromatids" },
    ],
    answer: "B",
    solution:
      "Meiosis I separates homologous chromosomes (reductional division), so the chromosome number halves from 8 to 4. Sister chromatids have not yet separated, so each of those 4 chromosomes still consists of two chromatids (they separate in meiosis II).",
  },
];

// 聚合（后续 bio2 / bio3 在此累加）
export const ESAT_BIO_QUESTIONS = [...ESAT_BIO_CELL];
