// 全站共享常量

export const SUBJECTS = [
  "Mathematics", "Further Mathematics", "Physics", "Chemistry", "Biology",
  "Economics", "Computer Science", "Business", "Accounting", "History",
  "Geography", "English Literature", "Psychology", "Sociology", "Art",
  "Politics", "Law", "Media Studies", "Music", "Chinese",
];

export const GRADES = ["A*", "A", "B", "C", "D", "E"];

export const GRADE_KINDS = [
  { value: "PREDICTED", label: "预估" },
  { value: "ACTUAL", label: "实考" },
  { value: "AS", label: "AS" },
] as const;

export const REGIONS = [
  { value: "UK", label: "英国" },
  { value: "HK", label: "香港" },
] as const;
