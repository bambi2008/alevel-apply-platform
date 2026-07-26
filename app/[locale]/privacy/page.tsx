import { LegalPage } from "@/components/legal-page";
import { LEGAL_VERSION } from "@/lib/auth/security";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const contact = process.env.PRIVACY_CONTACT_EMAIL || "请通过平台运营方公布的联系渠道联系我们";
  if (locale === "en") {
    return (
      <LegalPage title="Privacy Policy" version={LEGAL_VERSION} intro="This policy explains how QiaoShen handles personal information when you use its application and exam-preparation services.">
        <section><h2>1. Who we are</h2><p>QiaoShen project team operates this service. Privacy contact: {contact}.</p></section>
        <section><h2>2. Information we process</h2><ul><li>Account identifiers, password hashes and consent records.</li><li>Profile, grades, target courses, applications and study plans that you enter.</li><li>Exam answers, timing and interaction telemetry used for marking and difficulty calibration.</li><li>Documents you choose to upload, plus technical logs needed for security and reliability.</li></ul></section>
        <section><h2>3. Why we use it</h2><p>We use information to provide account access, save progress, personalise study, grade work, secure the service, respond to requests and meet applicable obligations. We do not sell personal information.</p></section>
        <section><h2>4. AI processing</h2><p>AI features are optional. Only when you trigger an AI feature and have separately consented may the submitted content be sent to the AI provider configured by the service, currently DeepSeek when enabled. Do not submit unnecessary identity, passport, health or payment information. You may withdraw this consent from Account &amp; Privacy without losing non-AI features.</p></section>
        <section><h2>5. Sharing and storage</h2><p>Infrastructure, email delivery and AI providers process only the information needed for their service. Production deployment must list the actual providers and locations here before public launch. Uploaded files and the database are kept in protected persistent storage; backups are encrypted.</p></section>
        <section><h2>6. Retention and your choices</h2><p>Account data is normally kept while your account is active. Reset links expire after 30 minutes and SMS codes after 5 minutes. You can export or delete account data from Account &amp; Privacy. Deleted data may remain in rolling encrypted backups until they expire, unless law requires longer retention.</p></section>
        <section><h2>7. Young users</h2><p>Users under 18 should review this policy with a parent or guardian and confirm guardian consent during registration. We limit collection to what is needed for study and application support.</p></section>
        <section><h2>8. Security and complaints</h2><p>We use access controls, password hashing, rate limits, encrypted backups, upload validation and audit logs. No system is risk-free. Contact {contact} to exercise your rights or report a concern.</p></section>
      </LegalPage>
    );
  }
  return (
    <LegalPage title="隐私政策" version={LEGAL_VERSION} intro="本政策说明桥申在提供留学申请与考试备考服务时如何处理个人信息。请在注册和使用 AI 功能前认真阅读。">
      <section><h2>一、运营者与联系方式</h2><p>本服务由桥申项目团队运营。隐私事务联系方式：{contact}。</p></section>
      <section><h2>二、我们处理的信息</h2><ul><li>邮箱、手机号、密码哈希、登录安全记录和同意记录。</li><li>你填写的姓名、学校、成绩、目标专业、申请与学习计划。</li><li>考试答案、作答时长及必要的交互数据，用于评分、学习建议和题目难度校准。</li><li>你主动上传的申请资料，以及保障安全与稳定所需的设备、网络和错误日志。</li></ul></section>
      <section><h2>三、处理目的</h2><p>我们仅为账号登录、保存进度、个性化备考、评分反馈、文件管理、安全防护、响应请求及履行适用义务处理信息，不出售个人信息。</p></section>
      <section><h2>四、AI 功能与单独同意</h2><p>AI 功能是可选功能。只有在你主动触发 AI 功能并给予单独同意后，本次提交的作答或文字才会发送给平台配置的 AI 服务商处理；当前启用时为 DeepSeek。请勿提交与任务无关的身份证件、健康、支付等敏感信息。你可以在“账号与隐私”中撤回同意，撤回不影响普通题库和非 AI 功能。</p></section>
      <section><h2>五、委托处理、存储与跨境说明</h2><p>云基础设施、邮件发送和 AI 服务商仅在提供相应服务所需范围内处理信息。公开上线前，运营者必须在本节补充实际服务商、存储地点及跨境情况。数据库和上传文件存放于受保护的持久化存储中，备份采用认证加密。</p></section>
      <section><h2>六、保存期限与用户权利</h2><p>账号数据通常保存至账号注销；密码重置链接 30 分钟失效，短信验证码 5 分钟失效。你可以在“账号与隐私”下载个人数据或永久注销账号。已删除数据可能在滚动加密备份到期前暂时保留；法律另有要求的除外。</p></section>
      <section><h2>七、未成年人保护</h2><p>未满 18 周岁的用户应与父母或监护人共同阅读本政策，并在注册时确认已获得监护人同意。平台仅收集完成学习与申请支持所必需的信息，不以未成年人为对象进行个性化广告。</p></section>
      <section><h2>八、安全与投诉</h2><p>我们采用访问控制、密码哈希、限流、上传校验、加密备份和审计日志等措施，但任何系统都无法承诺绝对安全。你可以通过 {contact} 提出访问、更正、删除、撤回同意或投诉请求。</p></section>
    </LegalPage>
  );
}
