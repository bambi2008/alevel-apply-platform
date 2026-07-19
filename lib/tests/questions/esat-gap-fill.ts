import { ESAT_MK5_PHYS } from "../mock-papers/esat-mock-5";
import { ESAT_MK6_PHYS } from "../mock-papers/esat-mock-6";
import { ESAT_MK7_PHYS } from "../mock-papers/esat-mock-7";
import { ESAT_MK8_CHEM } from "../mock-papers/esat-mock-8";
import { ESAT_MK9_BIO } from "../mock-papers/esat-mock-9";
import { ESAT_MK10_MAG, ESAT_MK10_SCI } from "../mock-papers/esat-mock-10";
import type { MCQQuestion } from "./types";

type GapTopic = "esat-phys4" | "esat-phys5" | "esat-phys6" | "esat-phys7" | "esat-chem4" | "esat-chem5" | "esat-bio4";

interface Seed {
  topicId: GapTopic;
  difficulty: 1 | 2 | 3;
  question: string;
  choices: [string, string, string, string, string];
  answer: 0 | 1 | 2 | 3 | 4;
  solution: string;
}

const KEYS = ["A", "B", "C", "D", "E"] as const;

function createQuestion(seed: Seed, index: number): MCQQuestion {
  return {
    id: `esat-gap-new-${String(index + 1).padStart(3, "0")}`,
    type: "mcq",
    testId: "esat",
    topicId: seed.topicId,
    difficulty: seed.difficulty,
    marks: 1,
    question: seed.question,
    options: seed.choices.map((text, optionIndex) => ({ key: KEYS[optionIndex], text })),
    answer: KEYS[seed.answer],
    solution: seed.solution,
  };
}

function promote(question: MCQQuestion, topicId: GapTopic, index: number): MCQQuestion {
  return { ...question, id: `esat-gap-${topicId.replace("esat-", "")}-${String(index + 1).padStart(2, "0")}`, topicId };
}

const NEW_SEEDS: Seed[] = [
  { topicId: "esat-phys4", difficulty: 1, question: "A sound wave travels at $340\\,\\text{m s}^{-1}$ and has frequency $170\\,\\text{Hz}$. What is its wavelength?", choices: ["$0.5\\,\\text{m}$", "$2.0\\,\\text{m}$", "$170\\,\\text{m}$", "$510\\,\\text{m}$", "$57800\\,\\text{m}$"], answer: 1, solution: "$\\lambda=v/f=340/170=2.0\\,\\text{m}$." },
  { topicId: "esat-phys4", difficulty: 1, question: "A ray strikes a plane mirror at $35^\\circ$ to the normal. What is the angle of reflection?", choices: ["$20^\\circ$", "$35^\\circ$", "$55^\\circ$", "$70^\\circ$", "$145^\\circ$"], answer: 1, solution: "The angle of reflection equals the angle of incidence, both measured from the normal, so it is $35^\\circ$." },
  { topicId: "esat-phys4", difficulty: 2, question: "A source makes $15$ complete oscillations in $3.0\\,\\text{s}$. What is the period?", choices: ["$0.20\\,\\text{s}$", "$0.50\\,\\text{s}$", "$3.0\\,\\text{s}$", "$5.0\\,\\text{s}$", "$45\\,\\text{s}$"], answer: 0, solution: "$f=15/3=5\\,\\text{Hz}$, so $T=1/f=0.20\\,\\text{s}$." },
  { topicId: "esat-phys4", difficulty: 3, question: "A wave enters a second medium. Its speed falls from $300$ to $200\\,\\text{m s}^{-1}$ while its frequency remains $50\\,\\text{Hz}$. By how much does its wavelength decrease?", choices: ["$1\\,\\text{m}$", "$2\\,\\text{m}$", "$3\\,\\text{m}$", "$4\\,\\text{m}$", "$6\\,\\text{m}$"], answer: 1, solution: "The wavelengths are $300/50=6\\,\\text{m}$ and $200/50=4\\,\\text{m}$, a decrease of $2\\,\\text{m}$." },

  { topicId: "esat-phys5", difficulty: 1, question: "Which pair describes two isotopes of the same element?", choices: ["same proton number, different neutron number", "different proton number, same neutron number", "same mass number, different proton number", "different electron and proton numbers only", "same neutron number and different charge only"], answer: 0, solution: "Isotopes have the same proton number but different neutron numbers." },
  { topicId: "esat-phys5", difficulty: 1, question: "Which action reduces a worker's radiation dose without changing the source?", choices: ["spending longer near it", "standing closer to it", "using suitable shielding", "removing all warning labels", "holding it by hand"], answer: 2, solution: "Suitable shielding absorbs radiation and reduces dose; reducing time and increasing distance also help." },
  { topicId: "esat-phys5", difficulty: 2, question: "A nucleus emits an alpha particle. How do its nucleon number $A$ and proton number $Z$ change?", choices: ["$A-4, Z-2$", "$A-2, Z-4$", "$A, Z+1$", "$A, Z-1$", "$A-1, Z$"], answer: 0, solution: "An alpha particle contains two protons and two neutrons, so $A$ falls by 4 and $Z$ by 2." },
  { topicId: "esat-phys5", difficulty: 2, question: "During beta-minus decay, how do the mass number and proton number of the nucleus change?", choices: ["mass number $-4$, proton number $-2$", "mass number unchanged, proton number $+1$", "mass number unchanged, proton number $-1$", "mass number $+1$, proton number unchanged", "both numbers unchanged"], answer: 1, solution: "A neutron changes into a proton and emits an electron, so the mass number is unchanged and the proton number rises by 1." },
  { topicId: "esat-phys5", difficulty: 2, question: "Which statement about radioactive decay is correct?", choices: ["heating always speeds it up", "each undecayed nucleus has a constant probability of decay per unit time", "all nuclei decay after exactly one half-life", "pressure stops gamma emission", "the half-life increases as the sample gets smaller"], answer: 1, solution: "Decay is random for an individual nucleus but has a constant probability per unit time for a given isotope." },
  { topicId: "esat-phys5", difficulty: 3, question: "A detector records $520$ counts per minute from a source plus background. The background is $40$ counts per minute. After one half-life, what total count rate is expected?", choices: ["$240$", "$260$", "$280$", "$300$", "$480$"], answer: 2, solution: "The source rate is $520-40=480$. After one half-life it is $240$, then background is added: $240+40=280$ counts per minute." },
  { topicId: "esat-phys5", difficulty: 3, question: "A nucleus $^{210}_{84}X$ emits one alpha particle and then one beta-minus particle. What is the proton number of the final nucleus?", choices: ["$80$", "$81$", "$82$", "$83$", "$85$"], answer: 3, solution: "Alpha emission changes $Z$ from $84$ to $82$; beta-minus emission then raises it to $83$." },

  { topicId: "esat-phys6", difficulty: 2, question: "How much energy is needed to raise the temperature of a $2.0\\,\\text{kg}$ block with specific heat capacity $500\\,\\text{J kg}^{-1}\\,{}^\\circ\\text{C}^{-1}$ by $10^\\circ\\text{C}$?", choices: ["$100\\,\\text{J}$", "$1000\\,\\text{J}$", "$5000\\,\\text{J}$", "$10000\\,\\text{J}$", "$20000\\,\\text{J}$"], answer: 3, solution: "$E=mc\\Delta T=2.0\\times500\\times10=10000\\,\\text{J}$." },

  { topicId: "esat-chem4", difficulty: 1, question: "What is the amount of substance in $18\\,\\text{g}$ of water, $M_r(\\text{H}_2\\text{O})=18$?", choices: ["$0.5\\,\\text{mol}$", "$1.0\\,\\text{mol}$", "$2.0\\,\\text{mol}$", "$18\\,\\text{mol}$", "$36\\,\\text{mol}$"], answer: 1, solution: "$n=m/M_r=18/18=1.0\\,\\text{mol}$." },
  { topicId: "esat-chem4", difficulty: 1, question: "What is the relative formula mass of $\\text{MgO}$? ($A_r$: Mg $=24$, O $=16$)", choices: ["$8$", "$16$", "$24$", "$40$", "$384$"], answer: 3, solution: "$M_r=24+16=40$." },
  { topicId: "esat-chem4", difficulty: 1, question: "At room conditions, what volume is occupied by $2.0\\,\\text{mol}$ of gas if the molar gas volume is $24\\,\\text{dm}^3\\,\\text{mol}^{-1}$?", choices: ["$12\\,\\text{dm}^3$", "$24\\,\\text{dm}^3$", "$36\\,\\text{dm}^3$", "$48\\,\\text{dm}^3$", "$72\\,\\text{dm}^3$"], answer: 3, solution: "$V=nV_m=2.0\\times24=48\\,\\text{dm}^3$." },
  { topicId: "esat-chem4", difficulty: 1, question: "How many moles are present in $250\\,\\text{cm}^3$ of a $0.20\\,\\text{mol dm}^{-3}$ solution?", choices: ["$0.010\\,\\text{mol}$", "$0.050\\,\\text{mol}$", "$0.080\\,\\text{mol}$", "$0.20\\,\\text{mol}$", "$50\\,\\text{mol}$"], answer: 1, solution: "$250\\,\\text{cm}^3=0.250\\,\\text{dm}^3$ and $n=cV=0.20\\times0.250=0.050\\,\\text{mol}$." },
  { topicId: "esat-chem4", difficulty: 1, question: "In $2\\text{Mg}+\\text{O}_2\\rightarrow2\\text{MgO}$, how many moles of MgO form from $3.0\\,\\text{mol}$ Mg with excess oxygen?", choices: ["$1.0\\,\\text{mol}$", "$1.5\\,\\text{mol}$", "$2.0\\,\\text{mol}$", "$3.0\\,\\text{mol}$", "$6.0\\,\\text{mol}$"], answer: 3, solution: "The Mg:MgO coefficient ratio is $2:2$, so $3.0\\,\\text{mol}$ Mg forms $3.0\\,\\text{mol}$ MgO." },
  { topicId: "esat-chem4", difficulty: 2, question: "A reaction has a theoretical yield of $8.0\\,\\text{g}$ and produces $6.0\\,\\text{g}$. What is the percentage yield?", choices: ["$25\\%$", "$60\\%$", "$75\\%$", "$80\\%$", "$133\\%$"], answer: 2, solution: "Percentage yield $=(6.0/8.0)\\times100=75\\%$." },
  { topicId: "esat-chem4", difficulty: 2, question: "A compound contains $24\\,\\text{g}$ carbon and $4\\,\\text{g}$ hydrogen. What is its empirical formula?", choices: ["$\\text{CH}$", "$\\text{CH}_2$", "$\\text{CH}_3$", "$\\text{CH}_4$", "$\\text{C}_2\\text{H}$"], answer: 1, solution: "Moles: C $=24/12=2$, H $=4/1=4$. The simplest ratio is $1:2$, giving $\\text{CH}_2$." },
  { topicId: "esat-chem4", difficulty: 3, question: "For $\\text{N}_2+3\\text{H}_2\\rightarrow2\\text{NH}_3$, a mixture contains $2.0\\,\\text{mol}$ $\\text{N}_2$ and $3.0\\,\\text{mol}$ $\\text{H}_2$. What is the maximum amount of $\\text{NH}_3$?", choices: ["$1.0\\,\\text{mol}$", "$2.0\\,\\text{mol}$", "$3.0\\,\\text{mol}$", "$4.0\\,\\text{mol}$", "$6.0\\,\\text{mol}$"], answer: 1, solution: "$3.0\\,\\text{mol}$ H$_2$ is limiting and reacts with $1.0\\,\\text{mol}$ N$_2$ to form $2.0\\,\\text{mol}$ NH$_3$." },

  { topicId: "esat-chem5", difficulty: 1, question: "In electrolysis, which particles carry charge through the electrolyte?", choices: ["atoms only", "ions", "neutrons", "photons", "molecules only"], answer: 1, solution: "Mobile positive and negative ions carry charge through an electrolyte." },
  { topicId: "esat-chem5", difficulty: 1, question: "Which process occurs at the cathode during electrolysis?", choices: ["oxidation", "reduction", "neutralisation", "combustion", "polymerisation"], answer: 1, solution: "Positive ions gain electrons at the cathode, so reduction occurs." },
  { topicId: "esat-chem5", difficulty: 1, question: "Which process occurs at the anode during electrolysis?", choices: ["reduction", "oxidation", "condensation", "precipitation", "cracking"], answer: 1, solution: "Negative ions lose electrons at the anode, so oxidation occurs." },
  { topicId: "esat-chem5", difficulty: 1, question: "Why must an ionic compound be molten or dissolved before it can be electrolysed?", choices: ["its ions must be free to move", "its atoms must become radioactive", "its electrons must stop moving", "its mass must increase", "its covalent bonds must all break"], answer: 0, solution: "Electrolysis requires mobile ions; ions are fixed in place in a solid ionic lattice." },
  { topicId: "esat-chem5", difficulty: 1, question: "During electroplating, the object to be coated is connected as the:", choices: ["anode", "cathode", "electrolyte", "power supply", "salt bridge"], answer: 1, solution: "Metal cations gain electrons and deposit on the cathode, so the object is the cathode." },
  { topicId: "esat-chem5", difficulty: 1, question: "What is produced at the cathode during electrolysis of molten lead bromide?", choices: ["bromine", "lead", "oxygen", "hydrogen", "lead bromide"], answer: 1, solution: "$\\text{Pb}^{2+}$ ions gain electrons at the cathode to form lead." },
  { topicId: "esat-chem5", difficulty: 2, question: "What is produced at the anode during electrolysis of molten lead bromide?", choices: ["lead", "bromine", "hydrogen", "oxygen", "water"], answer: 1, solution: "Bromide ions lose electrons at the anode to form bromine molecules." },
  { topicId: "esat-chem5", difficulty: 2, question: "Which half-equation represents copper deposition?", choices: ["$\\text{Cu}\\rightarrow\\text{Cu}^{2+}+2e^-$", "$\\text{Cu}^{2+}+2e^-\\rightarrow\\text{Cu}$", "$2\\text{Cu}^++e^-\\rightarrow\\text{Cu}_2$", "$\\text{Cu}^{2+}\\rightarrow\\text{Cu}+2e^-$", "$\\text{Cu}+e^-\\rightarrow\\text{Cu}^+$"], answer: 1, solution: "Copper(II) ions gain two electrons: $\\text{Cu}^{2+}+2e^-\\rightarrow\\text{Cu}$." },
  { topicId: "esat-chem5", difficulty: 2, question: "Which half-equation represents chloride ions forming chlorine?", choices: ["$\\text{Cl}_2+2e^-\\rightarrow2\\text{Cl}^-$", "$2\\text{Cl}^-\\rightarrow\\text{Cl}_2+2e^-$", "$\\text{Cl}^-+e^-\\rightarrow\\text{Cl}$", "$2\\text{Cl}^-+2e^-\\rightarrow\\text{Cl}_2$", "$\\text{Cl}_2\\rightarrow\\text{Cl}^-+e^-$"], answer: 1, solution: "Two chloride ions each lose one electron: $2\\text{Cl}^-\\rightarrow\\text{Cl}_2+2e^-$." },
  { topicId: "esat-chem5", difficulty: 2, question: "Aqueous copper(II) sulfate is electrolysed using inert electrodes. What forms at the cathode?", choices: ["copper", "oxygen", "sulfur", "hydrogen sulfate", "carbon dioxide"], answer: 0, solution: "Copper(II) ions are reduced preferentially and copper metal is deposited." },
  { topicId: "esat-chem5", difficulty: 2, question: "Aqueous copper(II) sulfate is electrolysed using inert electrodes. Which gas forms at the anode?", choices: ["hydrogen", "oxygen", "nitrogen", "sulfur dioxide", "chlorine"], answer: 1, solution: "Water or hydroxide ions are oxidised at the inert anode, producing oxygen." },
  { topicId: "esat-chem5", difficulty: 2, question: "In the electrolysis of concentrated aqueous sodium chloride, which gas forms at the cathode?", choices: ["chlorine", "hydrogen", "oxygen", "nitrogen", "sodium vapour"], answer: 1, solution: "Water is reduced in preference to sodium ions, producing hydrogen gas." },
  { topicId: "esat-chem5", difficulty: 2, question: "Why is aluminium extracted by electrolysis rather than reduction with carbon?", choices: ["aluminium is less reactive than carbon", "aluminium is more reactive than carbon", "aluminium oxide is covalent", "carbon has no electrons", "aluminium is a noble gas"], answer: 1, solution: "Aluminium is above carbon in the reactivity series, so carbon cannot reduce aluminium oxide." },
  { topicId: "esat-chem5", difficulty: 2, question: "In copper purification, what happens to the impure copper anode?", choices: ["it gains mass", "it dissolves and loses mass", "it becomes the cathode", "it produces hydrogen only", "it remains unchanged"], answer: 1, solution: "Copper atoms at the anode are oxidised to copper ions, so the impure anode loses mass." },
  { topicId: "esat-chem5", difficulty: 3, question: "A current of $2.0\\,\\text{A}$ flows for $300\\,\\text{s}$. What charge passes through the electrolyte?", choices: ["$150\\,\\text{C}$", "$298\\,\\text{C}$", "$600\\,\\text{C}$", "$900\\,\\text{C}$", "$1200\\,\\text{C}$"], answer: 2, solution: "$Q=It=2.0\\times300=600\\,\\text{C}$." },
  { topicId: "esat-chem5", difficulty: 3, question: "The same charge is passed through solutions containing $\\text{Ag}^+$ and $\\text{Cu}^{2+}$. Which statement is correct?", choices: ["equal moles of Ag and Cu form", "twice as many moles of Ag as Cu form", "twice as many moles of Cu as Ag form", "no copper forms", "the result is independent of ionic charge"], answer: 1, solution: "Ag$^+$ needs one electron per atom while Cu$^{2+}$ needs two, so the same electron amount deposits twice as many moles of Ag." },
  { topicId: "esat-chem5", difficulty: 3, question: "During copper electroplating, a current of $0.50\\,\\text{A}$ runs for $20\\,\\text{min}$. What total charge passes?", choices: ["$10\\,\\text{C}$", "$40\\,\\text{C}$", "$300\\,\\text{C}$", "$600\\,\\text{C}$", "$1200\\,\\text{C}$"], answer: 3, solution: "$20\\,\\text{min}=1200\\,\\text{s}$, so $Q=It=0.50\\times1200=600\\,\\text{C}$." },
  { topicId: "esat-chem5", difficulty: 3, question: "An aqueous solution contains $\\text{Cu}^{2+}$ and $\\text{Na}^+$ ions. Copper, rather than sodium, forms at an inert cathode because:", choices: ["copper ions are negative", "copper is less reactive and is reduced preferentially", "sodium atoms are larger", "the cathode repels sodium ions", "sulfate ions remove sodium"], answer: 1, solution: "Copper is less reactive than sodium, so Cu$^{2+}$ is discharged preferentially from aqueous solution." },
  { topicId: "esat-chem5", difficulty: 3, question: "Which change doubles the mass deposited during electrolysis, assuming all other conditions remain constant?", choices: ["halving the current and halving the time", "doubling the current at the same time", "doubling resistance while holding current constant", "reversing both electrodes every second", "halving both ionic charge and current"], answer: 1, solution: "Deposited amount is proportional to charge $Q=It$; doubling current for the same time doubles the charge and deposited mass." },

  { topicId: "esat-bio4", difficulty: 1, question: "Which molecule is commonly used as a vector to transfer a gene into a bacterium?", choices: ["plasmid", "starch", "glycogen", "cholesterol", "cellulose"], answer: 0, solution: "Small circular bacterial plasmids can carry inserted genes into bacterial cells." },
  { topicId: "esat-bio4", difficulty: 1, question: "Which enzyme cuts DNA at specific recognition sequences?", choices: ["DNA ligase", "restriction enzyme", "amylase", "protease", "lipase"], answer: 1, solution: "Restriction enzymes cut DNA at specific recognition sites." },
  { topicId: "esat-bio4", difficulty: 1, question: "Which enzyme joins DNA fragments by forming bonds in the sugar-phosphate backbone?", choices: ["DNA ligase", "restriction enzyme", "catalase", "pepsin", "helicase only"], answer: 0, solution: "DNA ligase seals the sugar-phosphate backbone and joins DNA fragments." },
  { topicId: "esat-bio4", difficulty: 1, question: "Organisms that make organic molecules using light energy are called:", choices: ["producers", "primary consumers", "decomposers", "parasites", "detritivores only"], answer: 0, solution: "Photosynthetic producers convert light energy into chemical energy in organic molecules." },
  { topicId: "esat-bio4", difficulty: 1, question: "Which organisms release mineral ions from dead material during decomposition?", choices: ["decomposers", "top predators", "pollinators", "primary consumers", "hosts"], answer: 0, solution: "Decomposers digest dead organic material and release mineral ions back into the environment." },
  { topicId: "esat-bio4", difficulty: 1, question: "In a food chain, a herbivore feeding directly on a plant is a:", choices: ["producer", "primary consumer", "secondary consumer", "decomposer", "tertiary consumer"], answer: 1, solution: "A herbivore that eats a producer occupies the primary-consumer trophic level." },
  { topicId: "esat-bio4", difficulty: 2, question: "Why are the same restriction enzyme and plasmid often used when inserting a gene?", choices: ["they produce complementary sticky ends", "they translate the gene", "they prevent all mutations", "they copy the whole chromosome", "they destroy the plasmid"], answer: 0, solution: "Cutting both DNA sources with the same enzyme can produce complementary sticky ends that base-pair before ligation." },
  { topicId: "esat-bio4", difficulty: 2, question: "A marker gene in a genetically modified plasmid is useful because it helps scientists:", choices: ["identify cells that took up the plasmid", "increase every cell's size", "stop DNA replication", "remove all bacterial genes", "make restriction enzymes unnecessary"], answer: 0, solution: "A selectable or visible marker distinguishes transformed cells from cells that did not take up the plasmid." },
  { topicId: "esat-bio4", difficulty: 2, question: "Selective breeding differs from genetic engineering because selective breeding:", choices: ["chooses parents with desired existing traits", "always transfers one known gene between species", "does not involve reproduction", "creates no genetic variation", "works only in bacteria"], answer: 0, solution: "Selective breeding chooses parents with desired phenotypes and recombines existing variation over generations." },
  { topicId: "esat-bio4", difficulty: 2, question: "Why is less energy available at each successive trophic level?", choices: ["energy is lost in respiration, movement and waste", "energy is recycled completely", "predators make no biomass", "producers absorb no light", "all organisms have equal mass"], answer: 0, solution: "Not all biomass is eaten or assimilated, and much chemical energy is released by respiration and lost as heat." },
  { topicId: "esat-bio4", difficulty: 2, question: "Which process removes carbon dioxide from the atmosphere?", choices: ["photosynthesis", "respiration", "combustion", "decomposition", "fermentation"], answer: 0, solution: "Photosynthesis fixes atmospheric carbon dioxide into organic molecules." },
  { topicId: "esat-bio4", difficulty: 2, question: "Which process returns carbon dioxide to the atmosphere from living cells?", choices: ["aerobic respiration", "photosynthesis", "nitrate uptake", "transpiration", "osmosis"], answer: 0, solution: "Respiration oxidises organic molecules and releases carbon dioxide." },
  { topicId: "esat-bio4", difficulty: 2, question: "Why are quadrats useful in ecological sampling?", choices: ["they estimate abundance in a defined area", "they measure gene sequences directly", "they track every flying bird", "they prevent succession", "they remove sampling error completely"], answer: 0, solution: "Quadrats define sample areas from which abundance or percentage cover can be estimated." },
  { topicId: "esat-bio4", difficulty: 2, question: "A population grows rapidly and then levels off. The most likely reason for levelling off is that:", choices: ["it has reached carrying capacity", "mutations have stopped", "all competition has ended", "photosynthesis is impossible", "birth rate must be zero"], answer: 0, solution: "At carrying capacity, limiting factors make births plus immigration balance deaths plus emigration." },
  { topicId: "esat-bio4", difficulty: 2, question: "Fertiliser entering a lake may cause an algal bloom. Why can fish later die?", choices: ["decomposers use oxygen while breaking down dead algae", "algae permanently add too much oxygen", "fish become producers", "nitrate directly removes fish DNA", "water stops containing molecules"], answer: 0, solution: "When algae die, decomposer respiration increases and can deplete dissolved oxygen needed by fish." },
  { topicId: "esat-bio4", difficulty: 3, question: "A gene and plasmid are cut with different restriction enzymes that leave non-complementary ends. What is the most likely result?", choices: ["the gene will not ligate efficiently into the plasmid", "translation doubles", "the plasmid becomes a protein", "all bacteria are transformed", "the gene automatically gains matching bases"], answer: 0, solution: "Non-complementary ends do not base-pair, so stable recombinant plasmids are unlikely to form." },
  { topicId: "esat-bio4", difficulty: 3, question: "Producers store $12000\\,\\text{kJ}$ of energy and primary consumers store $1800\\,\\text{kJ}$. What is the transfer efficiency?", choices: ["$6.7\\%$", "$15\\%$", "$18\\%$", "$67\\%$", "$150\\%$"], answer: 1, solution: "Efficiency $=(1800/12000)\\times100=15\\%$." },
  { topicId: "esat-bio4", difficulty: 3, question: "A random sample of $25$ quadrats, each $0.50\\,\\text{m}^2$, contains $150$ plants in total. Estimate the mean density.", choices: ["$6\\,\\text{plants m}^{-2}$", "$12\\,\\text{plants m}^{-2}$", "$25\\,\\text{plants m}^{-2}$", "$75\\,\\text{plants m}^{-2}$", "$300\\,\\text{plants m}^{-2}$"], answer: 1, solution: "Total sampled area $=25\\times0.50=12.5\\,\\text{m}^2$. Density $=150/12.5=12\\,\\text{plants m}^{-2}$." },
  { topicId: "esat-bio4", difficulty: 3, question: "Which outcome is a plausible ecological risk of a herbicide-resistance gene moving from a crop into a wild relative?", choices: ["the wild relative may become harder to control", "all ecosystems immediately lose producers", "the gene must disappear in one generation", "the wild plant can no longer reproduce", "herbicides become nutrients"], answer: 0, solution: "Gene flow could give wild relatives a selective advantage where that herbicide is used, making them harder to control." },
];

const physicsSource = [...ESAT_MK5_PHYS, ...ESAT_MK6_PHYS, ...ESAT_MK7_PHYS, ...ESAT_MK10_MAG, ...ESAT_MK10_SCI];
const physicalNewCounts: Record<GapTopic, number> = {
  "esat-phys4": 4, "esat-phys5": 7, "esat-phys6": 1, "esat-phys7": 0,
  "esat-chem4": 0, "esat-chem5": 0, "esat-bio4": 0,
};
const physicalTopics: GapTopic[] = ["esat-phys4", "esat-phys5", "esat-phys6", "esat-phys7"];
const promotedPhysics = physicalTopics.flatMap((topicId) =>
  physicsSource
    .filter((question) => question.topicId === topicId && question.id !== "esat-mk10-s-19")
    .slice(0, 20 - physicalNewCounts[topicId])
    .map((question, index) => promote(question, topicId, index))
);

const quantitativeIds = new Set([
  "esat-mk8-c-03", "esat-mk8-c-04", "esat-mk8-c-05", "esat-mk8-c-06",
  "esat-mk8-c-07", "esat-mk8-c-08", "esat-mk8-c-09", "esat-mk8-c-10",
  "esat-mk8-c-15", "esat-mk8-c-21", "esat-mk8-c-24", "esat-mk8-c-26",
]);
const promotedChemistry = ESAT_MK8_CHEM
  .filter((question) => quantitativeIds.has(question.id) || question.id === "esat-mk8-c-20")
  .map((question, index) => promote(question, question.id === "esat-mk8-c-20" ? "esat-chem5" : "esat-chem4", index));
const promotedBiology = ESAT_MK9_BIO
  .filter((question) => question.id === "esat-mk9-b-26")
  .map((question, index) => promote(question, "esat-bio4", index));

export const ESAT_GAP_FILL_QUESTIONS: MCQQuestion[] = [
  ...promotedPhysics,
  ...promotedChemistry,
  ...promotedBiology,
  ...NEW_SEEDS.map(createQuestion),
];
