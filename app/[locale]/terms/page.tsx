import { LegalPage } from "@/components/legal-page";
import { LEGAL_VERSION } from "@/lib/auth/security";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const contact = process.env.PRIVACY_CONTACT_EMAIL || "请通过平台运营方公布的联系渠道联系我们";
  if (locale === "en") {
    return (
      <LegalPage title="Terms of Service" version={LEGAL_VERSION} intro="These terms govern use of QiaoShen. The service supports your work; it does not apply to universities or sit examinations for you.">
        <section><h2>1. Accounts</h2><p>Provide accurate information, protect your credentials and notify us of suspected misuse. You must not access another person&apos;s account or bypass security controls.</p></section>
        <section><h2>2. Educational use</h2><p>Questions, marking and admissions information support preparation only. Official examination bodies and universities remain authoritative. You remain responsible for checking current requirements and submitting your own work.</p></section>
        <section><h2>3. Academic integrity and AI</h2><p>Do not use the service to impersonate another person, cheat, obtain live examination answers or submit AI output as your own work. AI feedback can be incomplete or wrong and must be checked by you.</p></section>
        <section><h2>4. Acceptable use</h2><p>Do not disrupt the service, scrape it at scale, upload malware, infringe rights, expose another person&apos;s data or attempt unauthorised access. We may restrict access when needed to protect users or the service.</p></section>
        <section><h2>5. Availability and liability</h2><p>We work to keep the service reliable but do not guarantee uninterrupted availability, admission, scores or a particular outcome. Nothing excludes rights or liability that cannot lawfully be excluded.</p></section>
        <section><h2>6. Changes and contact</h2><p>Material changes will be identified by a new version and, where appropriate, renewed consent. Contact: {contact}.</p></section>
      </LegalPage>
    );
  }
  return (
    <LegalPage title="服务条款" version={LEGAL_VERSION} intro="本条款适用于桥申平台。平台帮助学生完成自己的准备工作，不代替学生申请、考试或作出院校决定。">
      <section><h2>一、账号使用</h2><p>你应提供真实信息、妥善保管登录凭证，并在发现异常使用时及时联系我们。不得登录他人账号、转让账号或绕过安全措施。</p></section>
      <section><h2>二、教育与申请信息</h2><p>题目、评分和申请信息仅用于学习与准备。考试机构和院校官方信息具有最终效力；你应自行核对最新要求，并对提交的申请材料和作答负责。</p></section>
      <section><h2>三、学术诚信与 AI</h2><p>不得使用平台冒充他人、作弊、获取正在进行的考试答案，或把 AI 输出冒充本人原创成果。AI 点评可能不完整或出错，必须由你独立核验，不构成录取、法律或专业意见。</p></section>
      <section><h2>四、可接受使用</h2><p>不得攻击或干扰平台、批量抓取内容、上传恶意文件、侵犯他人权利、暴露他人个人信息或尝试未经授权的访问。为保护用户和平台安全，我们可以限制存在风险的访问。</p></section>
      <section><h2>五、服务可用性与责任边界</h2><p>我们会努力保持服务可靠，但不承诺永不中断，也不保证录取、分数或特定结果。本条款不排除依法不得排除的消费者权利和责任。</p></section>
      <section><h2>六、条款更新与联系</h2><p>发生重大变更时，我们会更新版本并在适当情况下重新取得同意。联系方式：{contact}。</p></section>
    </LegalPage>
  );
}
