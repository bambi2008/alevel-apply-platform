export interface EnglishRequirement {
  id: string;
  institution: string;
  overall: number;
  component: number;
  note: string;
  sourceUrl: string;
  checkedAt: string;
}

export const ENGLISH_REQUIREMENTS: EnglishRequirement[] = [
  {
    id: "oxford-standard",
    institution: "University of Oxford",
    overall: 7.5,
    component: 7,
    note: "本科课程采用 higher level；不接受把多次考试单项拼分。豁免与替代资格以官网为准。",
    sourceUrl: "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/for-international-students/english-language-requirements-visas-and-funding",
    checkedAt: "2026-07",
  },
  {
    id: "cambridge-typical",
    institution: "University of Cambridge",
    overall: 7.5,
    component: 7,
    note: "通常要求总分 7.5、单项通常不低于 7.0；学院或 Offer 可提出具体条件。",
    sourceUrl: "https://www.undergraduate.study.cam.ac.uk/apply/before/entry-requirements",
    checkedAt: "2026-07",
  },
  {
    id: "hku-general",
    institution: "The University of Hong Kong",
    overall: 6.5,
    component: 0,
    note: "一般英语要求基线；个别课程可能更高，最终以课程页面与 Offer 为准。",
    sourceUrl: "https://admissions.hku.hk/apply/international-qualifications",
    checkedAt: "2026-07",
  },
  {
    id: "hkust-general",
    institution: "HKUST",
    overall: 6,
    component: 0,
    note: "一般 IELTS Academic 基线；课程、资格类型和录取条件可能另有要求。",
    sourceUrl: "https://join.hkust.edu.hk/oas/elar.pdf",
    checkedAt: "2026-07",
  },
];
