// 各入学笔试的「报名与出分/查分」信息（原创整理）。
// ⚠️ 报名窗口、考试与出分日期每年会调整，此处为通行规律，务必以当年官网为准。
// 与 ADMISSIONS_TESTS 解耦：详情页按 test.id 读取，缺失则不显示该板块。

export interface RegInfo {
  registerWindow: string; // 报名窗口
  registerHow: string;    // 如何报名
  testDate: string;       // 考试时间
  resultsWhen: string;    // 出分/查分时间
  resultsHow: string;     // 如何查分
  resultsUrl?: string;    // 查分/官方结果页
}

export const REGISTRATION_INFO: Record<string, RegInfo> = {
  bmo: {
    registerWindow: "SMC（Senior Maths Challenge，晋级入口）通常 9 月开放报名、10 月上旬开考；BMO1 报名随后开放，约在 11 月中旬考试（均以当年 UKMT 官网为准）。",
    registerHow: "通常由学校或教师通过 UKMT 报名；SMC 与 BMO1 的晋级、直接报名资格、国际考点和费用，以当年主办方说明为准。",
    testDate: "SMC：10 月上旬，90 分钟 25 题（22 选择 + 3 道 000–999 数字作答，机考或纸笔）；BMO1：11 月中旬，3.5 小时 6 道证明题（每题 10 分，需写完整过程）。",
    resultsWhen: "SMC 成绩通常数周内返回学校并公布晋级名单；BMO1 评阅后于次年 1 月前后公布成绩与奖项。",
    resultsHow: "成绩发至报名学校/教师；SMC 按比例授予 Gold/Silver/Bronze 并据分数线发出 BMO1 邀请；BMO1 按成绩授予奖项并选拔进入 BMO2。",
    resultsUrl: "https://www.ukmt.org.uk/",
  },
  bpho: {
    registerWindow: "通常 9 月起开放，Round 1 报名截止约在 11 月考前 48 小时（以当年官网为准）",
    registerHow: "通常由学校或物理教师通过 BPhO 报名；个人报名资格、国际考点和费用，以当年主办方说明为准。",
    testDate: "本站 Round 1 训练分为两节，每节 60 分钟；正式比赛日期与时长，以当年主办方安排为准。",
    resultsWhen: "答卷扫描上传后由 BPhO 统一评阅，成绩与证书通常在 1 月初学期开始时发回学校",
    resultsHow: "成绩发送至报名教师邮箱；按比例授予 Top Gold / Gold / Silver / Bronze 证书，Top Gold 获邀参加次年 1 月底的 Round 2",
    resultsUrl: "https://www.bpho.org.uk/",
  },
  mat: {
    registerWindow: "通常每年 8 月开放、9 月底至 10 月初截止",
    registerHow: "经 Pearson VUE 授权考点在线预约（牛津已改为机考）。中国大陆考生需选择就近的授权考点。",
    testDate: "通常在 10 月下旬",
    resultsWhen: "分数通常随牛津申请结果在次年 1 月前后一并反馈",
    resultsHow: "由牛津向考生/中学提供，可按官网指引申请获取具体分数。",
    resultsUrl: "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests",
  },
  pat: {
    registerWindow: "通常每年 8 月开放、9 月底至 10 月初截止",
    registerHow: "经 Pearson VUE 授权考点在线预约（机考）。",
    testDate: "通常在 10 月下旬",
    resultsWhen: "随牛津申请结果在次年 1 月前后反馈",
    resultsHow: "由牛津提供，可按官网指引获取分数。",
    resultsUrl: "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/admissions-tests",
  },
  step: {
    registerWindow: "通常每年 3 月开放、5 月初前截止",
    registerHow: "由所在考点（学校或授权考点）向 OCR 报名；自学考生需联系可接收外部考生的考点。",
    testDate: "通常在 6 月",
    resultsWhen: "通常在 8 月中旬公布（与 A-Level 放榜相近）",
    resultsHow: "通过 OCR「Results」在线系统或考点查询；分数会发送至相关院校。",
    resultsUrl: "https://www.ocr.org.uk/administration/step/",
  },
  esat: {
    registerWindow: "通常有 10 月与次年 1 月两次考试机会，报名在各次考试前数周开放",
    registerHow: "经 esat-tmua.ac.uk（UAT-UK / Pearson VUE 体系）注册并预约就近授权考点。",
    testDate: "10 月与次年 1 月两个考期",
    resultsWhen: "通常在每次考试后数周公布",
    resultsHow: "在 esat-tmua.ac.uk 考生账户查看；分数发送至剑桥/帝国理工等相关院校。",
    resultsUrl: "https://esat-tmua.ac.uk/",
  },
  tmua: {
    registerWindow: "通常在 10 月考期前数周开放报名",
    registerHow: "经 esat-tmua.ac.uk 注册并预约就近授权考点。",
    testDate: "通常在 10 月",
    resultsWhen: "通常在考试后数周、UCAS 申请评估前公布",
    resultsHow: "在 esat-tmua.ac.uk 考生账户查看标准化分数（1–9）；分数发送至相关院校。",
    resultsUrl: "https://esat-tmua.ac.uk/",
  },
  tara: {
    registerWindow: "第一次考试（10 月）报名通常 7 月底开放、9 月底截止；第二次（次年 1 月）报名约 10 月底至 12 月中。牛津申请须选 10 月场。",
    registerHow: "先在 UAT-UK 建账户，再经 Pearson VUE 授权考点在线预约（全球机考）。",
    testDate: "两个考期：10 月中旬与次年 1 月中旬（牛津申请须选 10 月）。",
    resultsWhen: "通常在考试后约 4 周经 UAT-UK 账户公布。",
    resultsHow: "批判性思维与问题解决分数（各 1–9）经 UAT-UK 账户查看并自动发送院校；写作任务答卷直接转交院校。",
    resultsUrl: "https://esat-tmua.ac.uk/about-the-tests/tara/",
  },
  lnat: {
    registerWindow: "通常每年 8 月初开放报名与预约",
    registerHow: "经 lnat.ac.uk 注册后，在 Pearson VUE 考点预约考试。申牛津需在 10 月中旬前完成，其他院校截止较晚。",
    testDate: "报名后自选考点日期（牛津须在 10 月中旬前）",
    resultsWhen: "A 部分（选择题）分数通常在次年 2 月前后告知考生；B 部分（作文）由目标院校自行评阅",
    resultsHow: "A 部分分数经 lnat.ac.uk 反馈；作文随申请材料发送至院校。",
    resultsUrl: "https://lnat.ac.uk/",
  },
};
