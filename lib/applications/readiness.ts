export type MaterialState = "MISSING" | "READY" | "NEEDS_UPDATE" | "WAIVED";
export type MaterialDocType = "TRANSCRIPT" | "PASSPORT" | "PREDICTED_GRADES" | "IELTS" | "TOEFL" | "CERTIFICATE" | "PHOTO" | "OTHER";

export interface MaterialTemplate {
  key: string;
  label: string;
  category: "IDENTITY" | "ACADEMIC" | "LANGUAGE" | "WRITING" | "REFERENCE" | "SUPPORTING";
  required: boolean;
  acceptedTypes: MaterialDocType[];
}

const COMMON: MaterialTemplate[] = [
  { key: "passport", label: "护照或身份证明", category: "IDENTITY", required: true, acceptedTypes: ["PASSPORT"] },
  { key: "transcript", label: "在校成绩单", category: "ACADEMIC", required: true, acceptedTypes: ["TRANSCRIPT"] },
  { key: "predicted-grades", label: "A-Level 预估成绩", category: "ACADEMIC", required: true, acceptedTypes: ["PREDICTED_GRADES"] },
  { key: "language-score", label: "英语语言成绩", category: "LANGUAGE", required: false, acceptedTypes: ["IELTS", "TOEFL"] },
];

export function buildMaterialTemplate(choiceType: "UCAS_CHOICE" | "HK_DIRECT"): MaterialTemplate[] {
  if (choiceType === "UCAS_CHOICE") return [
    ...COMMON,
    { key: "personal-statement", label: "UCAS Personal Statement", category: "WRITING", required: true, acceptedTypes: ["OTHER"] },
    { key: "reference", label: "推荐信", category: "REFERENCE", required: true, acceptedTypes: ["OTHER"] },
  ];
  return [
    ...COMMON,
    { key: "personal-statement", label: "个人陈述或申请 Essay", category: "WRITING", required: true, acceptedTypes: ["OTHER"] },
    { key: "id-photo", label: "证件照", category: "IDENTITY", required: true, acceptedTypes: ["PHOTO"] },
    { key: "supporting-certificates", label: "竞赛与活动证明", category: "SUPPORTING", required: false, acceptedTypes: ["CERTIFICATE"] },
  ];
}

export function effectiveMaterialStatus(input: {
  status: MaterialState;
  documentId?: string | null;
  validUntil?: Date | string | null;
}, now = new Date()): MaterialState {
  if (input.status === "WAIVED") return "WAIVED";
  if (!input.documentId) return "MISSING";
  if (input.validUntil && new Date(input.validUntil) < now) return "NEEDS_UPDATE";
  return "READY";
}

export function calculateReadiness(materials: Array<{ required: boolean; status: MaterialState; label: string }>) {
  const required = materials.filter((item) => item.required && item.status !== "WAIVED");
  const ready = required.filter((item) => item.status === "READY");
  const blockers = required.filter((item) => item.status !== "READY").map((item) => ({ label: item.label, status: item.status }));
  return {
    score: required.length ? Math.round((ready.length / required.length) * 100) : 100,
    ready: ready.length,
    required: required.length,
    canSubmit: blockers.length === 0,
    blockers,
  };
}

export function canConfirmSubmission(readiness: { canSubmit: boolean }, feePaid: boolean) {
  return readiness.canSubmit && feePaid;
}
