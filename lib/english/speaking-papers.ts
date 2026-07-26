export type SpeakingPart = 1 | 2 | 3;

export interface SpeakingPrompt {
  id: string;
  part: SpeakingPart;
  prompt: string;
  seconds: number;
}

export interface SpeakingPaper {
  id: string;
  title: string;
  focus: string;
  prompts: SpeakingPrompt[];
}

export const IELTS_SPEAKING_PAPERS: SpeakingPaper[] = [
  {
    id: "speaking-fixed-1",
    title: "固定流程 1",
    focus: "学习与实用技能",
    prompts: [
      { id: "sp1-p1-1", part: 1, seconds: 45, prompt: "Do you work or are you a student?" },
      { id: "sp1-p1-2", part: 1, seconds: 45, prompt: "What part of your studies do you find most interesting?" },
      { id: "sp1-p1-3", part: 1, seconds: 45, prompt: "Do you prefer studying alone or with other people?" },
      { id: "sp1-p1-4", part: 1, seconds: 45, prompt: "Has the way you study changed in recent years?" },
      {
        id: "sp1-p2-1",
        part: 2,
        seconds: 120,
        prompt: "Describe a useful skill you learned outside school. You should say what the skill is, how you learned it, why you wanted to learn it, and explain how it has been useful to you.",
      },
      { id: "sp1-p3-1", part: 3, seconds: 75, prompt: "Why do some practical skills receive less attention in schools?" },
      { id: "sp1-p3-2", part: 3, seconds: 75, prompt: "Who should decide which skills young people need for the future?" },
      { id: "sp1-p3-3", part: 3, seconds: 75, prompt: "How has technology changed the way adults learn new skills?" },
      { id: "sp1-p3-4", part: 3, seconds: 75, prompt: "Do qualifications always show that someone can use a skill well?" },
    ],
  },
  {
    id: "speaking-fixed-2",
    title: "固定流程 2",
    focus: "出行与公共交通",
    prompts: [
      { id: "sp2-p1-1", part: 1, seconds: 45, prompt: "How do you usually travel around your town or city?" },
      { id: "sp2-p1-2", part: 1, seconds: 45, prompt: "Is public transport convenient where you live?" },
      { id: "sp2-p1-3", part: 1, seconds: 45, prompt: "Do you enjoy long journeys?" },
      { id: "sp2-p1-4", part: 1, seconds: 45, prompt: "What makes a journey comfortable for you?" },
      {
        id: "sp2-p2-1",
        part: 2,
        seconds: 120,
        prompt: "Describe a journey that you remember well. You should say where you went, who you travelled with, what happened during the journey, and explain why you remember it.",
      },
      { id: "sp2-p3-1", part: 3, seconds: 75, prompt: "Why do governments invest in public transport?" },
      { id: "sp2-p3-2", part: 3, seconds: 75, prompt: "What might persuade people to use cars less often?" },
      { id: "sp2-p3-3", part: 3, seconds: 75, prompt: "How could remote work change transport needs in cities?" },
      { id: "sp2-p3-4", part: 3, seconds: 75, prompt: "Should transport decisions prioritise speed or environmental impact?" },
    ],
  },
  {
    id: "speaking-fixed-3",
    title: "固定流程 3",
    focus: "社区与公共空间",
    prompts: [
      { id: "sp3-p1-1", part: 1, seconds: 45, prompt: "What do you like about the area where you live?" },
      { id: "sp3-p1-2", part: 1, seconds: 45, prompt: "Are there any public places you visit regularly?" },
      { id: "sp3-p1-3", part: 1, seconds: 45, prompt: "Do people in your area know their neighbours well?" },
      { id: "sp3-p1-4", part: 1, seconds: 45, prompt: "Has your local area changed since you were younger?" },
      {
        id: "sp3-p2-1",
        part: 2,
        seconds: 120,
        prompt: "Describe a public place that is important to your community. You should say where it is, what people do there, who uses it, and explain why it matters to the community.",
      },
      { id: "sp3-p3-1", part: 3, seconds: 75, prompt: "What makes a public space successful?" },
      { id: "sp3-p3-2", part: 3, seconds: 75, prompt: "Should local residents have more influence over urban development?" },
      { id: "sp3-p3-3", part: 3, seconds: 75, prompt: "Why do some community facilities struggle to attract young people?" },
      { id: "sp3-p3-4", part: 3, seconds: 75, prompt: "How might cities balance new housing with shared public space?" },
    ],
  },
];
