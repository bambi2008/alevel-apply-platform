import { describe, expect, it } from "vitest";
import { BACKGROUND_CATALOG, catalogEventKey, getCatalogItem, uniqueCatalogEvents } from "./catalog";

describe("competition catalogue presentation", () => {
  it("deduplicates BBO without deleting either historical identity", () => {
    expect(getCatalogItem("bg-sci-bbo")?.field).toBe("SCIENCE");
    expect(getCatalogItem("bg-med-bbo")?.field).toBe("MED");
    expect(catalogEventKey("bg-med-bbo")).toBe(catalogEventKey("bg-sci-bbo"));
    expect(uniqueCatalogEvents(BACKGROUND_CATALOG).filter(x => x.titleEn === "British Biology Olympiad")).toHaveLength(1);
    expect(uniqueCatalogEvents(BACKGROUND_CATALOG.filter(x => x.field === "MED")).some(x => x.id === "bg-med-bbo")).toBe(true);
  });
  it("counts current displayed events and preserves input order and records", () => {
    const before = structuredClone(BACKGROUND_CATALOG);
    expect(uniqueCatalogEvents(BACKGROUND_CATALOG)).toHaveLength(BACKGROUND_CATALOG.length - 1);
    expect(BACKGROUND_CATALOG).toEqual(before);
  });
  it("classifies named mathematics competitions without changing IDs", () => {
    for (const id of ["bg-math-yau", "bg-math-modeling"]) expect(getCatalogItem(id)?.category).toBe("COMPETITION");
  });
  it("separates Kaggle from ordinary open-source work while retaining the saved legacy ID", () => {
    expect(getCatalogItem("bg-cse-opensource")?.category).toBe("RESEARCH");
    expect(getCatalogItem("bg-cse-kaggle")?.category).toBe("COMPETITION");
    expect(new Set(BACKGROUND_CATALOG.map(x => x.id)).size).toBe(BACKGROUND_CATALOG.length);
  });
});
