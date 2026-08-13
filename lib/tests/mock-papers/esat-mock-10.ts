// ESAT 模拟卷十（物理考纲补全卷 · 磁学 + 热/物质/波/放射性）—— 全新原创题。
// 依据官方 ESAT 物理考纲（P1 电、P2 磁、P3 力学、P4 热、P5 物质、P6 波、P7 放射性）
// 对现有 486 题做覆盖审计后发现：磁学（P2）此前完全缺失，热/物质/波/放射性偏少。
// 本卷专门补齐这些薄弱考点，使题库覆盖官方全部物理考纲。
// 题目全新原创，仅以官方考纲章节做结构校准，未照搬任何指南或真题内容。id 前缀 esat-mk10-*。
// g = 10 N/kg。

import type { MCQQuestion } from "@/lib/tests/questions/types";

// ── 模块一：磁学与电磁（官方 P2，此前零覆盖）——27 题 / 40 分钟 ──────────────
export const ESAT_MK10_MAG: MCQQuestion[] = [
  { id: "esat-mk10-g-01", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 1, marks: 1,
    question: "Two north poles of bar magnets are brought close together. They will:",
    options: [ {key:"A",text:"attract"},{key:"B",text:"repel"},{key:"C",text:"do nothing"},{key:"D",text:"stick together"},{key:"E",text:"lose magnetism"} ],
    answer: "B", solution: "Like poles repel; unlike poles attract." },

  { id: "esat-mk10-g-02", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 1, marks: 1,
    question: "Outside a bar magnet, magnetic field lines point:",
    options: [ {key:"A",text:"from south to north"},{key:"B",text:"from north to south"},{key:"C",text:"in circles around the magnet"},{key:"D",text:"straight down"},{key:"E",text:"in no particular direction"} ],
    answer: "B", solution: "By convention, field lines run from N to S outside the magnet (and S to N inside)." },

  { id: "esat-mk10-g-03", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 1, marks: 1,
    question: "Which metal is attracted to a magnet?",
    options: [ {key:"A",text:"copper"},{key:"B",text:"aluminium"},{key:"C",text:"iron"},{key:"D",text:"gold"},{key:"E",text:"zinc"} ],
    answer: "C", solution: "Iron (also nickel and cobalt) is magnetic; copper, aluminium and gold are not." },

  { id: "esat-mk10-g-04", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "Which change would NOT increase the strength of an electromagnet?",
    options: [ {key:"A",text:"increasing the current"},{key:"B",text:"adding more turns of wire"},{key:"C",text:"adding an iron core"},{key:"D",text:"using a longer air gap"},{key:"E",text:"winding the coils more closely"} ],
    answer: "D", solution: "More current, more turns and an iron core all strengthen an electromagnet; a larger air gap weakens it." },

  { id: "esat-mk10-g-05", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "A straight wire carries a current. The magnetic field around it is:",
    options: [ {key:"A",text:"straight lines along the wire"},{key:"B",text:"concentric circles around the wire"},{key:"C",text:"zero everywhere"},{key:"D",text:"pointing towards the wire"},{key:"E",text:"the same as a bar magnet"} ],
    answer: "B", solution: "A current in a straight wire produces concentric circular field lines around it." },

  { id: "esat-mk10-g-06", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "The magnetic field pattern of a current-carrying solenoid is most like that of:",
    options: [ {key:"A",text:"a single point charge"},{key:"B",text:"a bar magnet"},{key:"C",text:"a straight wire"},{key:"D",text:"a flat sheet"},{key:"E",text:"no field"} ],
    answer: "B", solution: "A solenoid produces a field like a bar magnet, with a north and south pole at its ends." },

  { id: "esat-mk10-g-07", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "Soft iron is used for electromagnet cores because it:",
    options: [ {key:"A",text:"stays permanently magnetised"},{key:"B",text:"is magnetised and demagnetised easily"},{key:"C",text:"is not magnetic"},{key:"D",text:"conducts electricity best"},{key:"E",text:"is very light"} ],
    answer: "B", solution: "Soft iron magnetises and demagnetises easily, so the electromagnet can be switched on and off." },

  { id: "esat-mk10-g-08", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "Steel rather than soft iron is used to make a permanent magnet because steel:",
    options: [ {key:"A",text:"is cheaper"},{key:"B",text:"retains its magnetism"},{key:"C",text:"loses magnetism quickly"},{key:"D",text:"is non-magnetic"},{key:"E",text:"conducts heat well"} ],
    answer: "B", solution: "Steel retains magnetism once magnetised, making it suitable for permanent magnets." },

  { id: "esat-mk10-g-09", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 1, marks: 1,
    question: "The unit of magnetic flux density is the:",
    options: [ {key:"A",text:"tesla"},{key:"B",text:"weber"},{key:"C",text:"newton"},{key:"D",text:"henry"},{key:"E",text:"ampere"} ],
    answer: "A", solution: "Magnetic flux density $B$ is measured in tesla (T)." },

  { id: "esat-mk10-g-10", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "A current-carrying wire lies at right angles to a magnetic field. It experiences a force. This is known as the:",
    options: [ {key:"A",text:"motor effect"},{key:"B",text:"generator effect"},{key:"C",text:"photoelectric effect"},{key:"D",text:"transformer effect"},{key:"E",text:"Doppler effect"} ],
    answer: "A", solution: "A current in a field experiences a force — the motor effect (direction from Fleming's left-hand rule)." },

  { id: "esat-mk10-g-11", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 3, marks: 1,
    question: "A wire of length $0.10\\,\\text{m}$ carries a current of $2.0\\,\\text{A}$ at right angles to a field of $0.50\\,\\text{T}$. The force on it is: $(F=BIL)$",
    options: [ {key:"A",text:"$0.01\\,\\text{N}$"},{key:"B",text:"$0.10\\,\\text{N}$"},{key:"C",text:"$1.0\\,\\text{N}$"},{key:"D",text:"$10\\,\\text{N}$"},{key:"E",text:"$0.25\\,\\text{N}$"} ],
    answer: "B", solution: "$F=BIL=0.50\\times2.0\\times0.10=0.10\\,\\text{N}$." },

  { id: "esat-mk10-g-12", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 3, marks: 1,
    question: "A force of $6.0\\,\\text{N}$ acts on a wire of length $0.50\\,\\text{m}$ carrying current in a field of $2.0\\,\\text{T}$ (at right angles). The current is: $(F=BIL)$",
    options: [ {key:"A",text:"$3.0\\,\\text{A}$"},{key:"B",text:"$6.0\\,\\text{A}$"},{key:"C",text:"$1.5\\,\\text{A}$"},{key:"D",text:"$12\\,\\text{A}$"},{key:"E",text:"$0.17\\,\\text{A}$"} ],
    answer: "B", solution: "$I=\\dfrac{F}{BL}=\\dfrac{6.0}{2.0\\times0.50}=6.0\\,\\text{A}$." },

  { id: "esat-mk10-g-13", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 3, marks: 1,
    question: "The force on a current-carrying wire in a magnetic field is greatest when the angle between the wire and the field is:",
    options: [ {key:"A",text:"$0^\\circ$"},{key:"B",text:"$30^\\circ$"},{key:"C",text:"$45^\\circ$"},{key:"D",text:"$90^\\circ$"},{key:"E",text:"$180^\\circ$"} ],
    answer: "D", solution: "The force is maximum when the wire is perpendicular ($90^\\circ$) to the field, and zero when parallel." },

  { id: "esat-mk10-g-14", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "To reverse the direction of the force on a current-carrying wire in a magnetic field, you could:",
    options: [ {key:"A",text:"increase the current"},{key:"B",text:"reverse the current direction"},{key:"C",text:"increase the field strength"},{key:"D",text:"use a longer wire"},{key:"E",text:"switch to a thicker wire"} ],
    answer: "B", solution: "Reversing either the current or the field reverses the force direction (Fleming's left-hand rule)." },

  { id: "esat-mk10-g-15", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "A d.c. motor uses a split-ring commutator in order to:",
    options: [ {key:"A",text:"increase the voltage"},{key:"B",text:"reverse the current in the coil every half turn"},{key:"C",text:"reduce friction"},{key:"D",text:"store charge"},{key:"E",text:"convert a.c. to heat"} ],
    answer: "B", solution: "The commutator reverses the current every half turn so the coil keeps rotating in the same direction." },

  { id: "esat-mk10-g-16", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "Moving a bar magnet into a coil of wire causes a voltage to be induced across the coil. This is:",
    options: [ {key:"A",text:"the motor effect"},{key:"B",text:"electromagnetic induction"},{key:"C",text:"electrolysis"},{key:"D",text:"resistance"},{key:"E",text:"static charging"} ],
    answer: "B", solution: "A changing magnetic field through a coil induces an e.m.f. — electromagnetic induction." },

  { id: "esat-mk10-g-17", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "Which change would increase the size of the voltage induced when a magnet is moved into a coil?",
    options: [ {key:"A",text:"moving the magnet more slowly"},{key:"B",text:"using fewer turns on the coil"},{key:"C",text:"moving the magnet faster"},{key:"D",text:"using a weaker magnet"},{key:"E",text:"holding the magnet still"} ],
    answer: "C", solution: "A faster rate of change of flux (faster movement, stronger magnet, more turns) induces a larger e.m.f." },

  { id: "esat-mk10-g-18", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "A generator (dynamo) converts:",
    options: [ {key:"A",text:"electrical energy to kinetic energy"},{key:"B",text:"kinetic energy to electrical energy"},{key:"C",text:"heat to light"},{key:"D",text:"chemical energy to electrical energy"},{key:"E",text:"light to electrical energy"} ],
    answer: "B", solution: "A generator uses induction to convert kinetic (mechanical) energy into electrical energy." },

  { id: "esat-mk10-g-19", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 1, marks: 1,
    question: "A step-up transformer:",
    options: [ {key:"A",text:"increases voltage"},{key:"B",text:"decreases voltage"},{key:"C",text:"changes a.c. to d.c."},{key:"D",text:"increases current and voltage together"},{key:"E",text:"has no effect on voltage"} ],
    answer: "A", solution: "A step-up transformer increases voltage (more turns on the secondary than the primary)." },

  { id: "esat-mk10-g-20", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 3, marks: 1,
    question: "A transformer has $100$ primary turns and $200$ secondary turns. If the primary voltage is $12\\,\\text{V}$, the secondary voltage is: $\\left(\\dfrac{V_s}{V_p}=\\dfrac{N_s}{N_p}\\right)$",
    options: [ {key:"A",text:"$6\\,\\text{V}$"},{key:"B",text:"$12\\,\\text{V}$"},{key:"C",text:"$24\\,\\text{V}$"},{key:"D",text:"$48\\,\\text{V}$"},{key:"E",text:"$2\\,\\text{V}$"} ],
    answer: "C", solution: "$V_s=V_p\\times\\dfrac{N_s}{N_p}=12\\times\\dfrac{200}{100}=24\\,\\text{V}$." },

  { id: "esat-mk10-g-21", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 3, marks: 1,
    question: "A transformer has $600$ primary turns and $150$ secondary turns. If the primary voltage is $240\\,\\text{V}$, the secondary voltage is:",
    options: [ {key:"A",text:"$30\\,\\text{V}$"},{key:"B",text:"$60\\,\\text{V}$"},{key:"C",text:"$120\\,\\text{V}$"},{key:"D",text:"$480\\,\\text{V}$"},{key:"E",text:"$960\\,\\text{V}$"} ],
    answer: "B", solution: "$V_s=240\\times\\dfrac{150}{600}=240\\times0.25=60\\,\\text{V}$ (step-down)." },

  { id: "esat-mk10-g-22", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "Transformers work with alternating current (a.c.) but not steady direct current (d.c.) because they require:",
    options: [ {key:"A",text:"a constant magnetic field"},{key:"B",text:"a continually changing magnetic field"},{key:"C",text:"very high resistance"},{key:"D",text:"a chemical reaction"},{key:"E",text:"no current at all"} ],
    answer: "B", solution: "Induction needs a changing flux; a.c. constantly changes the field, steady d.c. does not." },

  { id: "esat-mk10-g-23", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 3, marks: 1,
    question: "An ideal transformer has primary voltage $240\\,\\text{V}$ and secondary voltage $12\\,\\text{V}$. If the secondary current is $5.0\\,\\text{A}$, the primary current is: (assume $100\\%$ efficiency)",
    options: [ {key:"A",text:"$0.25\\,\\text{A}$"},{key:"B",text:"$0.50\\,\\text{A}$"},{key:"C",text:"$5.0\\,\\text{A}$"},{key:"D",text:"$100\\,\\text{A}$"},{key:"E",text:"$1.0\\,\\text{A}$"} ],
    answer: "A", solution: "Power is conserved: $V_pI_p=V_sI_s\\Rightarrow I_p=\\dfrac{12\\times5.0}{240}=0.25\\,\\text{A}$." },

  { id: "esat-mk10-g-24", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "Increasing the current in a straight wire will:",
    options: [ {key:"A",text:"reverse the field"},{key:"B",text:"increase the strength of the magnetic field around it"},{key:"C",text:"have no effect on the field"},{key:"D",text:"turn the field into an electric field"},{key:"E",text:"remove the field"} ],
    answer: "B", solution: "The magnetic field strength around a wire increases with the current." },

  { id: "esat-mk10-g-25", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "Which is a common use of an electromagnet?",
    options: [ {key:"A",text:"a compass needle"},{key:"B",text:"a scrapyard crane for lifting steel"},{key:"C",text:"a fridge door magnet"},{key:"D",text:"a permanent bar magnet"},{key:"E",text:"a glass lens"} ],
    answer: "B", solution: "Electromagnets can be switched on and off, ideal for a scrapyard crane; the others are permanent magnets or unrelated." },

  { id: "esat-mk10-g-26", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 2, marks: 1,
    question: "High-voltage transmission lines use step-up transformers before transmission mainly to:",
    options: [ {key:"A",text:"increase the current"},{key:"B",text:"reduce energy lost as heat in the cables"},{key:"C",text:"make the electricity safer to touch"},{key:"D",text:"convert a.c. to d.c."},{key:"E",text:"increase the resistance"} ],
    answer: "B", solution: "Higher voltage means lower current for the same power, so less energy is lost as heat ($P=I^2R$) in the cables." },

  { id: "esat-mk10-g-27", type: "mcq", testId: "esat", topicId: "esat-phys7", difficulty: 1, marks: 1,
    question: "A plotting compass placed near a current-carrying wire will:",
    options: [ {key:"A",text:"not move at all"},{key:"B",text:"be deflected by the wire's magnetic field"},{key:"C",text:"melt"},{key:"D",text:"become charged"},{key:"E",text:"always point to the wire"} ],
    answer: "B", solution: "The current produces a magnetic field that deflects the compass needle (Oersted's observation)." },
];

// ── 模块二：热 / 物质 / 波 / 放射性（补 P4/P5/P6/P7）——27 题 / 40 分钟 ────────
export const ESAT_MK10_SCI: MCQQuestion[] = [
  { id: "esat-mk10-s-01", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 2, marks: 1,
    question: "How much energy is needed to heat $0.50\\,\\text{kg}$ of water by $20^\\circ\\text{C}$? (specific heat capacity $=4200\\,\\text{J kg}^{-1}\\text{K}^{-1}$)",
    options: [ {key:"A",text:"$4200\\,\\text{J}$"},{key:"B",text:"$21000\\,\\text{J}$"},{key:"C",text:"$42000\\,\\text{J}$"},{key:"D",text:"$84000\\,\\text{J}$"},{key:"E",text:"$2100\\,\\text{J}$"} ],
    answer: "C", solution: "$Q=mc\\Delta T=0.50\\times4200\\times20=42000\\,\\text{J}$." },

  { id: "esat-mk10-s-02", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 3, marks: 1,
    question: "$8400\\,\\text{J}$ of energy is supplied to $0.20\\,\\text{kg}$ of water (specific heat $4200\\,\\text{J kg}^{-1}\\text{K}^{-1}$). The temperature rise is:",
    options: [ {key:"A",text:"$5^\\circ\\text{C}$"},{key:"B",text:"$10^\\circ\\text{C}$"},{key:"C",text:"$20^\\circ\\text{C}$"},{key:"D",text:"$40^\\circ\\text{C}$"},{key:"E",text:"$2^\\circ\\text{C}$"} ],
    answer: "B", solution: "$\\Delta T=\\dfrac{Q}{mc}=\\dfrac{8400}{0.20\\times4200}=\\dfrac{8400}{840}=10^\\circ\\text{C}$." },

  { id: "esat-mk10-s-03", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 2, marks: 1,
    question: "Metals are good conductors of heat mainly because they contain:",
    options: [ {key:"A",text:"tightly bound electrons"},{key:"B",text:"free (delocalised) electrons"},{key:"C",text:"large atoms"},{key:"D",text:"trapped air"},{key:"E",text:"water"} ],
    answer: "B", solution: "Free delocalised electrons transfer energy quickly through the metal." },

  { id: "esat-mk10-s-04", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 2, marks: 1,
    question: "Hot water rises in a heated tank because, when heated, the water:",
    options: [ {key:"A",text:"becomes denser"},{key:"B",text:"becomes less dense and rises by convection"},{key:"C",text:"conducts better"},{key:"D",text:"radiates more"},{key:"E",text:"freezes"} ],
    answer: "B", solution: "Heated water expands, becomes less dense, and rises — convection." },

  { id: "esat-mk10-s-05", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 2, marks: 1,
    question: "Energy supplied to melt ice at $0^\\circ\\text{C}$ into water at $0^\\circ\\text{C}$ is used to:",
    options: [ {key:"A",text:"raise the temperature"},{key:"B",text:"change the state without changing temperature"},{key:"C",text:"increase the mass"},{key:"D",text:"create new atoms"},{key:"E",text:"cool the surroundings"} ],
    answer: "B", solution: "Latent heat changes state at constant temperature (breaking bonds between particles)." },

  { id: "esat-mk10-s-06", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 1, marks: 1,
    question: "A liquid has density $800\\,\\text{kg m}^{-3}$. What mass occupies a volume of $0.025\\,\\text{m}^3$?",
    options: [ {key:"A",text:"$0.032\\,\\text{kg}$"},{key:"B",text:"$2.0\\,\\text{kg}$"},{key:"C",text:"$20\\,\\text{kg}$"},{key:"D",text:"$32\\,\\text{kg}$"},{key:"E",text:"$20000\\,\\text{kg}$"} ],
    answer: "C", solution: "$m=\\rho V=800\\times0.025=20\\,\\text{kg}$." },

  { id: "esat-mk10-s-07", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 2, marks: 1,
    question: "In a liquid, pressure:",
    options: [ {key:"A",text:"is the same at all depths"},{key:"B",text:"increases with depth"},{key:"C",text:"decreases with depth"},{key:"D",text:"acts only downwards"},{key:"E",text:"is zero"} ],
    answer: "B", solution: "Fluid pressure increases with depth (more weight of liquid above)." },

  { id: "esat-mk10-s-08", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 1, marks: 1,
    question: "In a gas, the particles are:",
    options: [ {key:"A",text:"fixed in a regular pattern"},{key:"B",text:"close together and vibrating"},{key:"C",text:"far apart and moving randomly"},{key:"D",text:"joined in long chains"},{key:"E",text:"not moving"} ],
    answer: "C", solution: "Gas particles are far apart and move rapidly and randomly." },

  { id: "esat-mk10-s-09", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 2, marks: 1,
    question: "Gas pressure on the walls of a container is caused by:",
    options: [ {key:"A",text:"particles colliding with the walls"},{key:"B",text:"particles sticking to the walls"},{key:"C",text:"gravity"},{key:"D",text:"the walls vibrating"},{key:"E",text:"chemical reactions"} ],
    answer: "A", solution: "Gas pressure arises from many particle collisions with the container walls." },

  { id: "esat-mk10-s-10", type: "mcq", testId: "esat", topicId: "esat-phys6", difficulty: 3, marks: 1,
    question: "At constant temperature, a gas of volume $200\\,\\text{cm}^3$ at $100\\,\\text{kPa}$ is compressed to $50\\,\\text{cm}^3$. Its new pressure is: $(P_1V_1=P_2V_2)$",
    options: [ {key:"A",text:"$25\\,\\text{kPa}$"},{key:"B",text:"$100\\,\\text{kPa}$"},{key:"C",text:"$200\\,\\text{kPa}$"},{key:"D",text:"$400\\,\\text{kPa}$"},{key:"E",text:"$50\\,\\text{kPa}$"} ],
    answer: "D", solution: "$P_2=\\dfrac{P_1V_1}{V_2}=\\dfrac{100\\times200}{50}=400\\,\\text{kPa}$." },

  { id: "esat-mk10-s-11", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 1, marks: 1,
    question: "A wave travels at $340\\,\\text{m/s}$ with a frequency of $500\\,\\text{Hz}$. Its wavelength is:",
    options: [ {key:"A",text:"$0.68\\,\\text{m}$"},{key:"B",text:"$1.5\\,\\text{m}$"},{key:"C",text:"$170\\,\\text{m}$"},{key:"D",text:"$0.34\\,\\text{m}$"},{key:"E",text:"$840\\,\\text{m}$"} ],
    answer: "A", solution: "$\\lambda=\\dfrac{v}{f}=\\dfrac{340}{500}=0.68\\,\\text{m}$." },

  { id: "esat-mk10-s-12", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 1, marks: 1,
    question: "Sound waves are:",
    options: [ {key:"A",text:"transverse"},{key:"B",text:"longitudinal"},{key:"C",text:"electromagnetic"},{key:"D",text:"stationary only"},{key:"E",text:"unable to travel through air"} ],
    answer: "B", solution: "Sound is a longitudinal wave (particles vibrate parallel to the direction of travel)." },

  { id: "esat-mk10-s-13", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 2, marks: 1,
    question: "A wave has a period of $0.004\\,\\text{s}$. Its frequency is:",
    options: [ {key:"A",text:"$4\\,\\text{Hz}$"},{key:"B",text:"$25\\,\\text{Hz}$"},{key:"C",text:"$250\\,\\text{Hz}$"},{key:"D",text:"$400\\,\\text{Hz}$"},{key:"E",text:"$2500\\,\\text{Hz}$"} ],
    answer: "C", solution: "$f=\\dfrac1T=\\dfrac{1}{0.004}=250\\,\\text{Hz}$." },

  { id: "esat-mk10-s-14", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 2, marks: 1,
    question: "When a wave is reflected from a flat surface, the angle of incidence is:",
    options: [ {key:"A",text:"greater than the angle of reflection"},{key:"B",text:"less than the angle of reflection"},{key:"C",text:"equal to the angle of reflection"},{key:"D",text:"always zero"},{key:"E",text:"always $90^\\circ$"} ],
    answer: "C", solution: "The law of reflection: angle of incidence $=$ angle of reflection (measured from the normal)." },

  { id: "esat-mk10-s-15", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 2, marks: 1,
    question: "When light passes from air into glass, it slows down and bends:",
    options: [ {key:"A",text:"away from the normal"},{key:"B",text:"towards the normal"},{key:"C",text:"back on itself"},{key:"D",text:"along the surface"},{key:"E",text:"it does not bend"} ],
    answer: "B", solution: "Entering a denser medium, light slows and refracts towards the normal." },

  { id: "esat-mk10-s-16", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 2, marks: 1,
    question: "Which part of the electromagnetic spectrum has the highest frequency?",
    options: [ {key:"A",text:"radio waves"},{key:"B",text:"visible light"},{key:"C",text:"infrared"},{key:"D",text:"gamma rays"},{key:"E",text:"microwaves"} ],
    answer: "D", solution: "Gamma rays have the highest frequency (and shortest wavelength) of the EM spectrum." },

  { id: "esat-mk10-s-17", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 2, marks: 1,
    question: "A wave transfers:",
    options: [ {key:"A",text:"matter but not energy"},{key:"B",text:"energy but not matter"},{key:"C",text:"both matter and energy"},{key:"D",text:"neither"},{key:"E",text:"only charge"} ],
    answer: "B", solution: "Waves transfer energy from place to place without transferring matter." },

  { id: "esat-mk10-s-18", type: "mcq", testId: "esat", topicId: "esat-phys4", difficulty: 1, marks: 1,
    question: "All electromagnetic waves travel through a vacuum at:",
    options: [ {key:"A",text:"the speed of sound"},{key:"B",text:"the same speed (the speed of light)"},{key:"C",text:"different speeds depending on frequency"},{key:"D",text:"zero speed"},{key:"E",text:"$340\\,\\text{m/s}$"} ],
    answer: "B", solution: "In a vacuum, all EM waves travel at the same speed, $3\\times10^8\\,\\text{m/s}$." },

  { id: "esat-mk10-s-19", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 1, marks: 1,
    question: "An alpha particle is identical to:",
    options: [ {key:"A",text:"a helium nucleus"},{key:"B",text:"an electron"},{key:"C",text:"a proton"},{key:"D",text:"a photon"},{key:"E",text:"a neutron"} ],
    answer: "A", solution: "An alpha particle is a helium nucleus (2 protons + 2 neutrons)." },

  { id: "esat-mk10-s-20", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 1, marks: 1,
    question: "A beta-minus particle is:",
    options: [ {key:"A",text:"a helium nucleus"},{key:"B",text:"a high-speed electron"},{key:"C",text:"a proton"},{key:"D",text:"electromagnetic radiation"},{key:"E",text:"a neutron"} ],
    answer: "B", solution: "A beta-minus particle is a fast-moving electron emitted from the nucleus." },

  { id: "esat-mk10-s-21", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 2, marks: 1,
    question: "Which type of nuclear radiation is the most penetrating?",
    options: [ {key:"A",text:"alpha"},{key:"B",text:"beta"},{key:"C",text:"gamma"},{key:"D",text:"they are equal"},{key:"E",text:"none penetrate"} ],
    answer: "C", solution: "Gamma is the most penetrating (stopped by thick lead/concrete); alpha is the least (stopped by paper)." },

  { id: "esat-mk10-s-22", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 2, marks: 1,
    question: "Which type of radiation is stopped by a sheet of paper?",
    options: [ {key:"A",text:"alpha"},{key:"B",text:"beta"},{key:"C",text:"gamma"},{key:"D",text:"X-rays"},{key:"E",text:"none"} ],
    answer: "A", solution: "Alpha particles are stopped by paper; beta needs a few mm of aluminium; gamma needs thick lead." },

  { id: "esat-mk10-s-23", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 2, marks: 1,
    question: "Which type of nuclear radiation has no electric charge?",
    options: [ {key:"A",text:"alpha"},{key:"B",text:"beta-minus"},{key:"C",text:"gamma"},{key:"D",text:"all of them"},{key:"E",text:"none of them"} ],
    answer: "C", solution: "Gamma radiation is an uncharged electromagnetic wave; alpha is $+2$, beta-minus is $-1$." },

  { id: "esat-mk10-s-24", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 3, marks: 1,
    question: "A sample has a half-life of $2.0\\,\\text{hours}$. How long until only $\\tfrac18$ of the original remains?",
    options: [ {key:"A",text:"$2\\,\\text{h}$"},{key:"B",text:"$4\\,\\text{h}$"},{key:"C",text:"$6\\,\\text{h}$"},{key:"D",text:"$8\\,\\text{h}$"},{key:"E",text:"$16\\,\\text{h}$"} ],
    answer: "C", solution: "$\\tfrac18=\\left(\\tfrac12\\right)^3$, so $3$ half-lives $=3\\times2.0=6\\,\\text{h}$." },

  { id: "esat-mk10-s-25", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 3, marks: 1,
    question: "A radioactive source falls from $80\\,\\text{g}$ to $10\\,\\text{g}$ of the original isotope in $12\\,\\text{days}$. Its half-life is:",
    options: [ {key:"A",text:"$2\\,\\text{days}$"},{key:"B",text:"$3\\,\\text{days}$"},{key:"C",text:"$4\\,\\text{days}$"},{key:"D",text:"$6\\,\\text{days}$"},{key:"E",text:"$12\\,\\text{days}$"} ],
    answer: "C", solution: "$80\\to40\\to20\\to10$ is $3$ half-lives in $12\\,\\text{days}$, so each is $4\\,\\text{days}$." },

  { id: "esat-mk10-s-26", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 2, marks: 1,
    question: "Which type of radiation is the most strongly ionising?",
    options: [ {key:"A",text:"alpha"},{key:"B",text:"beta"},{key:"C",text:"gamma"},{key:"D",text:"radio waves"},{key:"E",text:"they are all equal"} ],
    answer: "A", solution: "Alpha is the most strongly ionising (but least penetrating)." },

  { id: "esat-mk10-s-27", type: "mcq", testId: "esat", topicId: "esat-phys5", difficulty: 1, marks: 1,
    question: "Which is a natural source of background radiation?",
    options: [ {key:"A",text:"radon gas from rocks"},{key:"B",text:"mobile phones"},{key:"C",text:"household electricity"},{key:"D",text:"visible light bulbs"},{key:"E",text:"loudspeakers"} ],
    answer: "A", solution: "Radon gas from rocks (and cosmic rays) is a natural background source; the others are not ionising radiation sources." },
];
