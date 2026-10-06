import { describe,it,expect,vi,beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getReleasedPracticeQuestions } from "@/lib/tests/practice-banks";

const mocks=vi.hoisted(()=>({auth:vi.fn(),student:vi.fn(),load:vi.fn(),select:vi.fn()}));
vi.mock("@/auth",()=>({auth:mocks.auth}));
vi.mock("@/lib/db",()=>({db:{studentProfile:{findUnique:mocks.student}}}));
vi.mock("@/lib/study/adaptive-server",()=>({loadStudentAdaptiveData:mocks.load}));
vi.mock("@/lib/tests/adaptive",()=>({selectAdaptiveQuestions:mocks.select}));
import { GET } from "@/app/api/exam-sessions/adaptive/route";

beforeEach(()=>{
  vi.clearAllMocks();
  mocks.auth.mockResolvedValue({user:{id:"fixture-user"}});
  mocks.student.mockResolvedValue({id:"fixture-student"});
  mocks.load.mockImplementation(async (_:string,testId:string)=>({
    profile:{stage:"learning"},observations:[],practiceQuestions:getReleasedPracticeQuestions(testId),
  }));
  mocks.select.mockImplementation(({questions,count}:{questions:{id:string}[];count:number})=>questions.slice(0,count).map(q=>q.id));
});
describe("actual adaptive module boundary",()=>{
  it.each(["math1","math2","physics","chemistry","biology"])("selects only ESAT %s",async module=>{
    const res=await GET(new NextRequest("http://localhost/api/exam-sessions/adaptive?testId=esat&count=5&module="+module));
    expect(res.status).toBe(200);
    const selected=mocks.select.mock.calls[0][0].questions as {id:string}[];
    const prefixes:Record<string,string>={math1:"m1",math2:"m2",physics:"p",chemistry:"c",biology:"b"};
    // This is the available practice inventory, not a fixed-paper module.
    // Fixed-paper regressions separately retain exactly 27 questions/40 min.
    const inventory:Record<string,number>={math1:29,math2:27,physics:28,chemistry:28,biology:28};
    expect(selected).toHaveLength(inventory[module]);
    expect(selected.every(q=>q.id.startsWith("esat-boundary-"+prefixes[module]+"-"))).toBe(true);
  });
  it("rejects invalid/cross-exam module selection before reading student data",async()=>{
    const res=await GET(new NextRequest("http://localhost/api/exam-sessions/adaptive?testId=esat&module=step3"));
    expect(res.status).toBe(400);expect(mocks.auth).not.toHaveBeenCalled();
  });
  it("defaults ESAT to Math 1 rather than silently mixing subjects",async()=>{
    await GET(new NextRequest("http://localhost/api/exam-sessions/adaptive?testId=esat"));
    expect(mocks.select.mock.calls[0][0].questions.every((q:{id:string})=>q.id.startsWith("esat-boundary-m1-"))).toBe(true);
  });
  it("rejects a mutated/new database question even when the provider returns it",async()=>{
    const bank=getReleasedPracticeQuestions("esat");
    mocks.load.mockResolvedValue({profile:{stage:"learning"},observations:[],practiceQuestions:[
      {...bank[0],question:"Use eigenvalues to solve this problem"},...bank.slice(1),
    ]});
    await GET(new NextRequest("http://localhost/api/exam-sessions/adaptive?testId=esat"));
    expect(mocks.select.mock.calls[0][0].questions.some((q:{id:string})=>q.id===bank[0].id)).toBe(false);
  });
});
