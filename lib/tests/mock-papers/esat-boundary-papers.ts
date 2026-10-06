import type { MockPaper,MockModule } from "./index";
import { ESAT_MATH1_BOUNDARY,ESAT_MATH2_BOUNDARY,ESAT_PHYSICS_BOUNDARY,ESAT_CHEMISTRY_BOUNDARY,ESAT_BIOLOGY_BOUNDARY } from "../questions/esat-boundary";
const modules:MockModule[] = [
  {id:"math1",title:"Mathematics 1",titleEn:"Mathematics 1",durationSec:2400,questions:ESAT_MATH1_BOUNDARY},
  {id:"math2",title:"Mathematics 2",titleEn:"Mathematics 2",durationSec:2400,questions:ESAT_MATH2_BOUNDARY},
  {id:"physics",title:"Physics",titleEn:"Physics",durationSec:2400,questions:ESAT_PHYSICS_BOUNDARY},
  {id:"chemistry",title:"Chemistry",titleEn:"Chemistry",durationSec:2400,questions:ESAT_CHEMISTRY_BOUNDARY},
  {id:"biology",title:"Biology",titleEn:"Biology",durationSec:2400,questions:ESAT_BIOLOGY_BOUNDARY},
];
export const ESAT_BOUNDARY_PAPERS:MockPaper[]=[];
for(let i=1;i<modules.length;i++) for(let j=i+1;j<modules.length;j++) {
  const pair=`${modules[i].id}-${modules[j].id}`;
  const selected=[modules[0],modules[i],modules[j]].map(m=>({...m,questions:m.questions.map(q=>({...q,id:`${q.id}-${pair}`}))}));
  ESAT_BOUNDARY_PAPERS.push({id:`esat-boundary-${modules[i].id}-${modules[j].id}`,testId:"esat",title:`ESAT · Mathematics 1 + ${modules[i].title} + ${modules[j].title}`,titleEn:`ESAT · Mathematics 1 + ${modules[i].title} + ${modules[j].title}`,description:"原创范围核验训练卷：3 个独立计时模块，每模块 27 题、40 分钟。按申请课程选择组合。各组合共用模块题组，并与专项练习复用；不声称未见题、官方难度或完整知识点覆盖。",modules:selected,formatType:"current",instructions:["无计算器；各模块时间不能互相挪用。","每题五选一、1 分。","请选择申请课程要求的组合；个别课程要求不同，应核对院校。"]});
}
