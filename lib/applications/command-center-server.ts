import { db } from "@/lib/db";
import { buildMaterialTemplate, calculateReadiness, effectiveMaterialStatus, type MaterialState } from "./readiness";

export async function ownedApplication(userId: string, applicationId: string) {
  return db.application.findFirst({
    where: { id: applicationId, student: { userId } },
    include: { program: { include: { university: true } } },
  });
}

export async function syncApplicationMaterials(userId: string, applicationId: string) {
  const application = await ownedApplication(userId, applicationId);
  if (!application) return null;
  const template = buildMaterialTemplate(application.choiceType);
  await db.$transaction(template.map((item) => db.applicationMaterial.upsert({
    where: { applicationId_key: { applicationId, key: item.key } },
    create: { applicationId, ...item },
    update: { label: item.label, category: item.category, required: item.required, acceptedTypes: item.acceptedTypes },
  })));
  return application;
}

export async function loadCommandCenter(userId: string, applicationId: string) {
  const application = await syncApplicationMaterials(userId, applicationId);
  if (!application) return null;
  const [materials, documents, references] = await Promise.all([
    db.applicationMaterial.findMany({
      where: { applicationId }, include: { document: true }, orderBy: [{ required: "desc" }, { createdAt: "asc" }],
    }),
    db.document.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" } }),
    db.recommendationRequest.findMany({
      where: { applicationId }, select: { id: true, recommenderName: true, recommenderEmail: true, status: true, expiresAt: true, submittedAt: true, createdAt: true }, orderBy: { createdAt: "desc" },
    }),
  ]);
  const normalized = materials.map((material) => ({
    ...material,
    status: effectiveMaterialStatus({
      status: material.status as MaterialState,
      documentId: material.documentId,
      validUntil: material.document?.validUntil,
    }),
  }));
  const stale = normalized.filter((item, index) => item.status !== materials[index].status);
  if (stale.length) await db.$transaction(stale.map((item) => db.applicationMaterial.update({ where: { id: item.id }, data: { status: item.status } })));
  const readiness = calculateReadiness(normalized.map((item) => ({ required: item.required, status: item.status, label: item.label })));
  const materialTask = await db.task.findFirst({ where: { applicationId, category: "DOC" } });
  const taskData = {
    title: `完成 ${application.program.university.nameZh || application.program.university.name} 申请材料`,
    dueDate: application.program.deadlineEarlyOverride ?? application.program.university.deadlineMain ?? application.program.university.deadlineEarly,
    status: readiness.canSubmit ? "DONE" as const : "TODO" as const,
  };
  if (materialTask) await db.task.update({ where: { id: materialTask.id }, data: taskData });
  else await db.task.create({ data: { studentId: application.studentId, applicationId, category: "DOC", ...taskData } });
  return {
    application: {
      id: application.id, status: application.status, choiceType: application.choiceType,
      externalRef: application.externalRef, submittedAt: application.submittedAt, feePaid: application.feePaid,
      program: application.program,
    },
    materials: normalized,
    documents,
    references,
    readiness,
  };
}
