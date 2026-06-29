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

// ════════════════════════════════════════════════════════════════════════
//  esat-bio2 · 遗传与进化 (Genetics & Evolution) — 40 题
// ════════════════════════════════════════════════════════════════════════
export const ESAT_BIO_GENETICS: MCQQuestion[] = [
  // ── 孟德尔遗传与单因子杂交 (8) ────────────────────────────────────────
  {
    id: "esat-b-041",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 1,
    marks: 1,
    question:
      "An organism with the genotype Aa is described as:",
    options: [
      { key: "A", text: "Homozygous dominant" },
      { key: "B", text: "Homozygous recessive" },
      { key: "C", text: "Heterozygous" },
      { key: "D", text: "Haploid" },
    ],
    answer: "C",
    solution:
      "Two different alleles of the same gene (A and a) means the organism is heterozygous. Homozygous would be AA or aa.",
  },
  {
    id: "esat-b-042",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 1,
    marks: 1,
    question:
      "Two heterozygous tall pea plants (Tt) are crossed, where T (tall) is dominant to t (short). What is the expected phenotypic ratio of the offspring?",
    options: [
      { key: "A", text: "1 tall : 1 short" },
      { key: "B", text: "3 tall : 1 short" },
      { key: "C", text: "all tall" },
      { key: "D", text: "1 tall : 2 short" },
    ],
    answer: "B",
    solution:
      "Tt × Tt gives genotypes 1 TT : 2 Tt : 1 tt. TT and Tt are tall, tt is short, so the phenotypic ratio is 3 tall : 1 short.",
  },
  {
    id: "esat-b-043",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "From the cross Tt × Tt, what is the GENOTYPIC ratio of the offspring?",
    options: [
      { key: "A", text: "3 : 1" },
      { key: "B", text: "1 : 1" },
      { key: "C", text: "1 : 2 : 1" },
      { key: "D", text: "9 : 3 : 3 : 1" },
    ],
    answer: "C",
    solution:
      "The Punnett square gives 1 TT : 2 Tt : 1 tt — a genotypic ratio of 1 : 2 : 1 (which corresponds to the 3 : 1 phenotypic ratio).",
  },
  {
    id: "esat-b-044",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "A test cross is carried out to find the genotype of a tall plant by crossing it with a short (tt) plant. The offspring are all tall. The unknown plant was most probably:",
    options: [
      { key: "A", text: "Homozygous dominant (TT)" },
      { key: "B", text: "Heterozygous (Tt)" },
      { key: "C", text: "Homozygous recessive (tt)" },
      { key: "D", text: "Impossible to deduce" },
    ],
    answer: "A",
    solution:
      "If the plant were Tt, crossing with tt would give 1 tall : 1 short. Since all offspring are tall, the plant supplied only T alleles, so it is homozygous TT.",
  },
  {
    id: "esat-b-045",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "Two heterozygous parents (Bb) are crossed, where b causes a recessive disorder. What is the probability that a single child is affected (bb)?",
    options: [
      { key: "A", text: "$\\tfrac{1}{2}$" },
      { key: "B", text: "$\\tfrac{1}{3}$" },
      { key: "C", text: "$\\tfrac{1}{4}$" },
      { key: "D", text: "0" },
    ],
    answer: "C",
    solution:
      "Bb × Bb → 1 BB : 2 Bb : 1 bb. Only bb is affected, so the probability is $\\tfrac{1}{4}$.",
  },
  {
    id: "esat-b-046",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 1,
    question:
      "Two carriers (Bb) of a recessive disorder have two children. What is the probability that BOTH children are affected?",
    options: [
      { key: "A", text: "$\\tfrac{1}{2}$" },
      { key: "B", text: "$\\tfrac{1}{8}$" },
      { key: "C", text: "$\\tfrac{1}{16}$" },
      { key: "D", text: "$\\tfrac{1}{4}$" },
    ],
    answer: "C",
    solution:
      "Each child independently has probability $\\tfrac14$ of being affected. For both: $\\tfrac14 \\times \\tfrac14 = \\tfrac{1}{16}$.",
  },
  {
    id: "esat-b-047",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 1,
    marks: 1,
    question:
      "The observable characteristics of an organism (e.g. flower colour) are called its:",
    options: [
      { key: "A", text: "Genotype" },
      { key: "B", text: "Phenotype" },
      { key: "C", text: "Karyotype" },
      { key: "D", text: "Allele" },
    ],
    answer: "B",
    solution:
      "Phenotype = the expressed, observable traits. Genotype = the alleles present. The phenotype results from the genotype interacting with the environment.",
  },
  {
    id: "esat-b-048",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "A cross between a heterozygous plant (Tt) and a homozygous recessive plant (tt) produces 200 offspring. Approximately how many are expected to be short (tt)?",
    options: [
      { key: "A", text: "50" },
      { key: "B", text: "100" },
      { key: "C", text: "150" },
      { key: "D", text: "200" },
    ],
    answer: "B",
    solution:
      "Tt × tt → 1 Tt : 1 tt, i.e. half are short. Half of 200 = 100.",
  },

  // ── 双因子杂交与自由组合 (6) ──────────────────────────────────────────
  {
    id: "esat-b-049",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "How many genetically different types of gamete can the genotype AaBb produce (genes on different chromosomes)?",
    options: [
      { key: "A", text: "2" },
      { key: "B", text: "3" },
      { key: "C", text: "4" },
      { key: "D", text: "8" },
    ],
    answer: "C",
    solution:
      "Each heterozygous gene gives 2 possible alleles in a gamete; with independent assortment the number of gamete types is $2^n$ where n = number of heterozygous genes. Here $2^2 = 4$: AB, Ab, aB, ab.",
  },
  {
    id: "esat-b-050",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "A dihybrid cross AaBb × AaBb (genes unlinked, both showing simple dominance) gives a phenotypic ratio of:",
    options: [
      { key: "A", text: "3 : 1" },
      { key: "B", text: "1 : 1 : 1 : 1" },
      { key: "C", text: "9 : 3 : 3 : 1" },
      { key: "D", text: "1 : 2 : 1" },
    ],
    answer: "C",
    solution:
      "Combining two independent 3 : 1 ratios gives the classic dihybrid ratio 9 (both dominant) : 3 : 3 : 1 (both recessive).",
  },
  {
    id: "esat-b-051",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 1,
    question:
      "In the cross AaBb × AaBb (unlinked genes), what fraction of offspring are expected to show both recessive phenotypes (aabb)?",
    options: [
      { key: "A", text: "$\\tfrac{9}{16}$" },
      { key: "B", text: "$\\tfrac{3}{16}$" },
      { key: "C", text: "$\\tfrac{1}{16}$" },
      { key: "D", text: "$\\tfrac{1}{4}$" },
    ],
    answer: "C",
    solution:
      "P(aa) = $\\tfrac14$ and P(bb) = $\\tfrac14$; independent, so P(aabb) = $\\tfrac14 \\times \\tfrac14 = \\tfrac{1}{16}$ — the '1' in the 9:3:3:1 ratio.",
  },
  {
    id: "esat-b-052",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 1,
    question:
      "How many different gamete types can an individual of genotype AaBbCc produce (all genes on different chromosomes)?",
    options: [
      { key: "A", text: "3" },
      { key: "B", text: "6" },
      { key: "C", text: "8" },
      { key: "D", text: "9" },
    ],
    answer: "C",
    solution:
      "Three heterozygous genes → $2^3 = 8$ gamete types (ABC, ABc, AbC, Abc, aBC, aBc, abC, abc).",
  },
  {
    id: "esat-b-053",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "Two genes located close together on the SAME chromosome tend to be inherited together. This phenomenon is called:",
    options: [
      { key: "A", text: "Independent assortment" },
      { key: "B", text: "Gene linkage" },
      { key: "C", text: "Codominance" },
      { key: "D", text: "Epistasis" },
    ],
    answer: "B",
    solution:
      "Linked genes are on the same chromosome and do not assort independently; they are usually inherited together unless separated by crossing over, producing fewer recombinant offspring than a 9:3:3:1 ratio predicts.",
  },
  {
    id: "esat-b-054",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 1,
    question:
      "A dihybrid test cross (AaBb × aabb) of unlinked genes is expected to give a 1 : 1 : 1 : 1 ratio. An experiment instead gives mostly parental types with few recombinants. This is best explained by:",
    options: [
      { key: "A", text: "The genes being linked on the same chromosome" },
      { key: "B", text: "A mutation in every offspring" },
      { key: "C", text: "Codominance of both genes" },
      { key: "D", text: "Non-disjunction" },
    ],
    answer: "A",
    solution:
      "A large excess of parental combinations and few recombinants indicates the two genes are linked; recombinants arise only when crossing over separates the linked alleles, so they are rarer than independent assortment would give.",
  },

  // ── 共显性 / 不完全显性 / 复等位基因 (6) ──────────────────────────────
  {
    id: "esat-b-055",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "In snapdragons, red (C^R C^R) × white (C^W C^W) gives all pink offspring (C^R C^W). This is an example of:",
    options: [
      { key: "A", text: "Complete dominance" },
      { key: "B", text: "Incomplete dominance" },
      { key: "C", text: "Sex linkage" },
      { key: "D", text: "Epistasis" },
    ],
    answer: "B",
    solution:
      "Neither allele is fully dominant, so the heterozygote shows an intermediate (blended) phenotype — pink. This is incomplete dominance.",
  },
  {
    id: "esat-b-056",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "Two pink snapdragons (C^R C^W) are crossed. What phenotypic ratio is expected in the offspring?",
    options: [
      { key: "A", text: "all pink" },
      { key: "B", text: "3 red : 1 white" },
      { key: "C", text: "1 red : 2 pink : 1 white" },
      { key: "D", text: "1 red : 1 white" },
    ],
    answer: "C",
    solution:
      "C^R C^W × C^R C^W → 1 C^R C^R (red) : 2 C^R C^W (pink) : 1 C^W C^W (white). With incomplete dominance the genotypic and phenotypic ratios coincide: 1 : 2 : 1.",
  },
  {
    id: "esat-b-057",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 1,
    marks: 1,
    question:
      "Human ABO blood group is controlled by three alleles (I^A, I^B, i). The alleles I^A and I^B are codominant. A person with genotype I^A I^B has blood group:",
    options: [
      { key: "A", text: "A" },
      { key: "B", text: "B" },
      { key: "C", text: "AB" },
      { key: "D", text: "O" },
    ],
    answer: "C",
    solution:
      "Because I^A and I^B are codominant, both antigens are expressed, giving blood group AB.",
  },
  {
    id: "esat-b-058",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 1,
    question:
      "A man of blood group O (ii) and a woman of group AB (I^A I^B) have children. Which blood groups are possible among their children?",
    options: [
      { key: "A", text: "Only AB" },
      { key: "B", text: "A or B only" },
      { key: "C", text: "A, B, AB or O" },
      { key: "D", text: "Only O" },
    ],
    answer: "B",
    solution:
      "Father (ii) gives i; mother (I^A I^B) gives I^A or I^B. Children are I^A i (group A) or I^B i (group B). Neither AB nor O is possible.",
  },
  {
    id: "esat-b-059",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "What is the difference between codominance and incomplete dominance?",
    options: [
      { key: "A", text: "In codominance both alleles are fully and separately expressed; in incomplete dominance a blended intermediate appears" },
      { key: "B", text: "They are exactly the same thing" },
      { key: "C", text: "Codominance only occurs on sex chromosomes" },
      { key: "D", text: "Incomplete dominance produces four phenotypes" },
    ],
    answer: "A",
    solution:
      "In codominance (e.g. AB blood, or roan coat) both alleles' products appear distinctly in the heterozygote. In incomplete dominance the heterozygote is an intermediate blend (e.g. pink flowers).",
  },
  {
    id: "esat-b-060",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 1,
    marks: 1,
    question:
      "A 'multiple-allele' system such as ABO blood group means that:",
    options: [
      { key: "A", text: "A single individual can carry more than two alleles at once" },
      { key: "B", text: "More than two alleles for the gene exist in the population, though each individual has only two" },
      { key: "C", text: "The gene is always sex-linked" },
      { key: "D", text: "The gene cannot mutate" },
    ],
    answer: "B",
    solution:
      "Multiple alleles means three or more allele forms exist in the gene pool (I^A, I^B, i). Any one diploid individual still carries only two of them.",
  },

  // ── 伴性遗传与性别决定 (5) ────────────────────────────────────────────
  {
    id: "esat-b-061",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 1,
    marks: 1,
    question:
      "In humans, the sex chromosome combination of a typical male is:",
    options: [
      { key: "A", text: "XX" },
      { key: "B", text: "XY" },
      { key: "C", text: "YY" },
      { key: "D", text: "XO" },
    ],
    answer: "B",
    solution:
      "Human males are XY and females XX. The sperm (carrying X or Y) determines the sex of the offspring.",
  },
  {
    id: "esat-b-062",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "Red–green colour blindness is caused by a recessive allele on the X chromosome. It is more common in males than females because:",
    options: [
      { key: "A", text: "Males have two X chromosomes" },
      { key: "B", text: "A male needs only one recessive allele on his single X to be affected" },
      { key: "C", text: "The allele is on the Y chromosome" },
      { key: "D", text: "Females cannot carry the allele" },
    ],
    answer: "B",
    solution:
      "Males (XY) have only one X, so a single recessive allele is expressed. Females (XX) need two copies to be affected, which is rarer; a female with one copy is an unaffected carrier.",
  },
  {
    id: "esat-b-063",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 1,
    question:
      "A carrier mother (X^B X^b) for colour blindness has children with an unaffected father (X^B Y). What proportion of their SONS are expected to be colour blind?",
    options: [
      { key: "A", text: "0" },
      { key: "B", text: "$\\tfrac{1}{4}$" },
      { key: "C", text: "$\\tfrac{1}{2}$" },
      { key: "D", text: "all" },
    ],
    answer: "C",
    solution:
      "Sons receive Y from the father and either X^B or X^b from the mother (50:50). So half of the sons are X^b Y (colour blind) and half X^B Y (normal).",
  },
  {
    id: "esat-b-064",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 1,
    question:
      "For the same cross (X^B X^b mother × X^B Y father), what proportion of the DAUGHTERS are expected to be colour blind?",
    options: [
      { key: "A", text: "0" },
      { key: "B", text: "$\\tfrac{1}{4}$" },
      { key: "C", text: "$\\tfrac{1}{2}$" },
      { key: "D", text: "all" },
    ],
    answer: "A",
    solution:
      "Daughters receive X^B from the father plus X^B or X^b from the mother, giving X^B X^B or X^B X^b. Both have at least one X^B, so none is colour blind (half are carriers).",
  },
  {
    id: "esat-b-065",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "Why can a father NEVER pass an X-linked recessive allele (such as that for haemophilia) to his sons?",
    options: [
      { key: "A", text: "Sons inherit their X chromosome from the mother and the Y from the father" },
      { key: "B", text: "Sons inherit two X chromosomes" },
      { key: "C", text: "The allele is dominant" },
      { key: "D", text: "Fathers do not carry X chromosomes" },
    ],
    answer: "A",
    solution:
      "A son receives the Y chromosome (not the X) from his father, and his single X from his mother. So an X-linked allele in the father can only be passed to daughters.",
  },

  // ── 突变与变异来源 (5) ────────────────────────────────────────────────
  {
    id: "esat-b-066",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "Insertion or deletion of a single base in a coding sequence usually has a more serious effect than a substitution because it:",
    options: [
      { key: "A", text: "Always deletes the whole gene" },
      { key: "B", text: "Causes a frameshift, altering every codon downstream" },
      { key: "C", text: "Cannot be inherited" },
      { key: "D", text: "Only changes one amino acid" },
    ],
    answer: "B",
    solution:
      "Adding or removing a base shifts the reading frame, so all codons after the mutation are changed — typically producing a completely different, non-functional polypeptide. A substitution changes at most one codon.",
  },
  {
    id: "esat-b-067",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 1,
    marks: 1,
    question:
      "Which of the following is a source of GENETIC variation only (not environmental)?",
    options: [
      { key: "A", text: "Mutation and meiosis (crossing over and independent assortment)" },
      { key: "B", text: "Diet" },
      { key: "C", text: "Amount of sunlight" },
      { key: "D", text: "Physical training" },
    ],
    answer: "A",
    solution:
      "Mutation, plus crossing over, independent assortment and random fertilisation, create new allele combinations — genetic variation. Diet, sunlight and training are environmental influences.",
  },
  {
    id: "esat-b-068",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "Continuous variation (such as human height) typically results from:",
    options: [
      { key: "A", text: "A single gene with two alleles" },
      { key: "B", text: "Many genes (polygenes) together with environmental factors" },
      { key: "C", text: "Sex linkage only" },
      { key: "D", text: "A single mutation" },
    ],
    answer: "B",
    solution:
      "Continuous traits show a range of values because they are controlled by many genes (polygenic) and strongly influenced by the environment, giving a normal distribution. Discontinuous traits (e.g. blood group) are usually monogenic.",
  },
  {
    id: "esat-b-069",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 1,
    marks: 1,
    question:
      "A mutation will only be passed on to offspring if it occurs in:",
    options: [
      { key: "A", text: "A skin cell" },
      { key: "B", text: "A gamete (or gamete-forming cell)" },
      { key: "C", text: "A red blood cell" },
      { key: "D", text: "A neurone" },
    ],
    answer: "B",
    solution:
      "Only mutations in the germ line (gametes or the cells that form them) are inherited. Mutations in body (somatic) cells are not passed to offspring.",
  },
  {
    id: "esat-b-070",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 1,
    question:
      "A non-disjunction event during meiosis produces a gamete with an extra chromosome. If this gamete is fertilised, the result is an individual with:",
    options: [
      { key: "A", text: "A point mutation" },
      { key: "B", text: "An extra whole chromosome (a chromosome mutation, e.g. trisomy)" },
      { key: "C", text: "A frameshift mutation" },
      { key: "D", text: "No change in chromosome number" },
    ],
    answer: "B",
    solution:
      "Non-disjunction is failure of chromosomes (or chromatids) to separate properly, giving gametes with one too many or too few chromosomes. Fertilisation then yields an abnormal chromosome number, e.g. trisomy 21.",
  },

  // ── 自然选择与进化 + Hardy-Weinberg (6) ──────────────────────────────
  {
    id: "esat-b-071",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 1,
    marks: 1,
    question:
      "Natural selection leads to evolution because:",
    options: [
      { key: "A", text: "Individuals change their own genes to suit the environment" },
      { key: "B", text: "Individuals with advantageous alleles survive and reproduce more, increasing those alleles' frequency over generations" },
      { key: "C", text: "All variation is environmental" },
      { key: "D", text: "Mutations never occur" },
    ],
    answer: "B",
    solution:
      "Variation exists; those with favourable alleles are more likely to survive and breed, passing on those alleles. Over many generations the allele frequencies in the population shift — evolution. (Individuals cannot choose to change their own genes.)",
  },
  {
    id: "esat-b-072",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "The rapid spread of antibiotic resistance in bacteria is a clear example of:",
    options: [
      { key: "A", text: "Bacteria deliberately becoming resistant when exposed" },
      { key: "B", text: "Natural selection: resistant mutants survive the antibiotic and reproduce" },
      { key: "C", text: "Loss of all genetic variation" },
      { key: "D", text: "Sexual reproduction in bacteria" },
    ],
    answer: "B",
    solution:
      "A chance mutation makes some bacteria resistant. The antibiotic kills non-resistant cells; resistant ones survive and multiply, so the resistance allele's frequency rises — natural selection acting on pre-existing variation.",
  },
  {
    id: "esat-b-073",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "Selection that favours one extreme of a range of phenotypes (e.g. larger beak size in a drought) is called:",
    options: [
      { key: "A", text: "Stabilising selection" },
      { key: "B", text: "Directional selection" },
      { key: "C", text: "Disruptive selection" },
      { key: "D", text: "Artificial selection" },
    ],
    answer: "B",
    solution:
      "Directional selection shifts the population mean towards one extreme. Stabilising selection favours the mean (against extremes); disruptive selection favours both extremes.",
  },
  {
    id: "esat-b-074",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 1,
    question:
      "In a population at Hardy–Weinberg equilibrium, a recessive condition affects 1 in 100 people. What is the frequency of the recessive allele (q)?",
    options: [
      { key: "A", text: "$0.01$" },
      { key: "B", text: "$0.1$" },
      { key: "C", text: "$0.5$" },
      { key: "D", text: "$0.9$" },
    ],
    answer: "B",
    solution:
      "Affected individuals are homozygous recessive: $q^2 = \\tfrac{1}{100} = 0.01$, so $q = \\sqrt{0.01} = 0.1$.",
  },
  {
    id: "esat-b-075",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 1,
    question:
      "Using the previous population ($q = 0.1$, $p = 0.9$, Hardy–Weinberg), what fraction of people are heterozygous carriers?",
    options: [
      { key: "A", text: "$0.01$" },
      { key: "B", text: "$0.09$" },
      { key: "C", text: "$0.18$" },
      { key: "D", text: "$0.81$" },
    ],
    answer: "C",
    solution:
      "Carrier (heterozygote) frequency is $2pq = 2 \\times 0.9 \\times 0.1 = 0.18$, i.e. 18% of the population.",
  },
  {
    id: "esat-b-076",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "Which is a necessary condition for a population to remain at Hardy–Weinberg equilibrium?",
    options: [
      { key: "A", text: "Strong natural selection" },
      { key: "B", text: "Frequent mutation" },
      { key: "C", text: "No selection, no mutation, no migration, random mating and a large population" },
      { key: "D", text: "A very small population" },
    ],
    answer: "C",
    solution:
      "Allele frequencies stay constant only with no selection, no mutation, no gene flow (migration), random mating and a large population (no genetic drift). If any fails, frequencies can change — evolution.",
  },

  // ── 物种形成 (4) ──────────────────────────────────────────────────────
  {
    id: "esat-b-077",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "Allopatric speciation begins with:",
    options: [
      { key: "A", text: "A geographical barrier physically separating two populations" },
      { key: "B", text: "A behavioural difference within one freely interbreeding population" },
      { key: "C", text: "A single mutation in one individual" },
      { key: "D", text: "Artificial selection by humans" },
    ],
    answer: "A",
    solution:
      "Allopatric ('different homeland') speciation starts when a physical barrier separates populations, preventing gene flow. They then diverge under different selection pressures until they can no longer interbreed.",
  },
  {
    id: "esat-b-078",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 1,
    marks: 1,
    question:
      "Two populations are considered separate species when they:",
    options: [
      { key: "A", text: "Look slightly different" },
      { key: "B", text: "Can no longer interbreed to produce fertile offspring" },
      { key: "C", text: "Live in different countries" },
      { key: "D", text: "Have any genetic difference at all" },
    ],
    answer: "B",
    solution:
      "Under the biological species concept, reproductive isolation — the inability to interbreed and produce fertile offspring — defines separate species, regardless of how similar they look.",
  },
  {
    id: "esat-b-079",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 3,
    marks: 1,
    question:
      "Reproductive isolation can arise WITHOUT a geographical barrier (sympatric speciation). Which is an example of a mechanism for this?",
    options: [
      { key: "A", text: "A mountain range splitting a population" },
      { key: "B", text: "Polyploidy (chromosome doubling) in plants, making them unable to breed with the parent type" },
      { key: "C", text: "A river dividing a forest" },
      { key: "D", text: "Continental drift" },
    ],
    answer: "B",
    solution:
      "Sympatric speciation occurs within the same area. Polyploidy in plants instantly creates a reproductive barrier: polyploids cannot produce fertile offspring with the diploid parents, forming a new species without geographical separation.",
  },
  {
    id: "esat-b-080",
    type: "mcq",
    testId: "esat",
    topicId: "esat-bio2",
    difficulty: 2,
    marks: 1,
    question:
      "Genetic drift has a greater effect on small populations than large ones because:",
    options: [
      { key: "A", text: "Small populations mutate faster" },
      { key: "B", text: "Chance changes in allele frequency have a proportionally larger impact when few individuals are involved" },
      { key: "C", text: "Natural selection does not act on small populations" },
      { key: "D", text: "Small populations never reach equilibrium" },
    ],
    answer: "B",
    solution:
      "Genetic drift is random change in allele frequency between generations. In a small population, the loss or random over-representation of a few individuals' alleles causes large swings in frequency; in a large population such chance effects average out.",
  },
];

// 聚合（后续 bio3 在此累加）
export const ESAT_BIO_QUESTIONS = [...ESAT_BIO_CELL, ...ESAT_BIO_GENETICS];
