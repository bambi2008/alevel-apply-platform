import type { MCQQuestion } from "./types";

export const PAT_WAVE_CALIBRATION: MCQQuestion[] = [
  {
    id: "pat-wave-cal-001", type: "mcq", testId: "pat", topicId: "pat-wave", difficulty: 3, marks: 1,
    question: "Two coherent waves of equal amplitude $A$ arrive at a point with phase difference $120^\\circ$. What is the amplitude of their resultant?",
    options: [{ key: "A", text: "$0$" }, { key: "B", text: "$A$" }, { key: "C", text: "$\\sqrt{2}A$" }, { key: "D", text: "$\\sqrt{3}A$" }, { key: "E", text: "$2A$" }],
    answer: "B",
    solution: "$R^2=A^2+A^2+2A^2\\cos120^\\circ=2A^2-A^2=A^2$, so $R=A$.",
  },
  {
    id: "pat-wave-cal-002", type: "mcq", testId: "pat", topicId: "pat-wave", difficulty: 3, marks: 1,
    question: "A converging lens forms a real image four times the height of an object. The object and image are $100\\,\\text{cm}$ apart. What is the focal length of the lens?",
    options: [{ key: "A", text: "$12\\,\\text{cm}$" }, { key: "B", text: "$16\\,\\text{cm}$" }, { key: "C", text: "$20\\,\\text{cm}$" }, { key: "D", text: "$25\\,\\text{cm}$" }, { key: "E", text: "$40\\,\\text{cm}$" }],
    answer: "B",
    solution: "For a real image, $v/u=4$ and $u+v=100$, giving $u=20\\,\\text{cm}$ and $v=80\\,\\text{cm}$. Hence $1/f=1/u+1/v=1/20+1/80=1/16$.",
  },
  {
    id: "pat-wave-cal-003", type: "mcq", testId: "pat", topicId: "pat-wave", difficulty: 3, marks: 1,
    question: "A diffraction grating has $600$ lines per millimetre and is illuminated normally with light of wavelength $500\\,\\text{nm}$. What is the highest observable diffraction order?",
    options: [{ key: "A", text: "$1$" }, { key: "B", text: "$2$" }, { key: "C", text: "$3$" }, { key: "D", text: "$4$" }, { key: "E", text: "$5$" }],
    answer: "C",
    solution: "The spacing is $d=(600\\,\\text{mm}^{-1})^{-1}=1.67\\times10^{-6}\\,\\text{m}$. Since $n\\lambda=d\\sin\\theta\\le d$, $n\\le d/\\lambda=3.33$, so the greatest integer order is $3$.",
  },
  {
    id: "pat-wave-cal-004", type: "mcq", testId: "pat", topicId: "pat-wave", difficulty: 3, marks: 1,
    question: "A string of length $1.5\\,\\text{m}$ and mass $12\\,\\text{g}$ is fixed at both ends under tension $80\\,\\text{N}$. What is the frequency of its third harmonic?",
    options: [{ key: "A", text: "$33.3\\,\\text{Hz}$" }, { key: "B", text: "$66.7\\,\\text{Hz}$" }, { key: "C", text: "$100\\,\\text{Hz}$" }, { key: "D", text: "$150\\,\\text{Hz}$" }, { key: "E", text: "$300\\,\\text{Hz}$" }],
    answer: "C",
    solution: "$\\mu=m/L=0.012/1.5=0.008\\,\\text{kg m}^{-1}$, so $v=\\sqrt{T/\\mu}=100\\,\\text{m s}^{-1}$. Then $f_3=3v/(2L)=100\\,\\text{Hz}$.",
  },
  {
    id: "pat-wave-cal-005", type: "mcq", testId: "pat", topicId: "pat-wave", difficulty: 3, marks: 1,
    question: "In a double-slit experiment, the slit separation is increased by $20\\%$ and the screen distance is decreased by $25\\%$. The wavelength is unchanged. The new fringe spacing is what fraction of the original?",
    options: [{ key: "A", text: "$\\dfrac{1}{2}$" }, { key: "B", text: "$\\dfrac{5}{8}$" }, { key: "C", text: "$\\dfrac{3}{4}$" }, { key: "D", text: "$\\dfrac{4}{5}$" }, { key: "E", text: "$\\dfrac{6}{5}$" }],
    answer: "B",
    solution: "Fringe spacing $w=\\lambda D/d$. Therefore $w'/w=(0.75D)/(1.20d)\\div(D/d)=0.75/1.20=5/8$.",
  },
];
