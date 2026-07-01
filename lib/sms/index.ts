// 短信适配器。开发版把验证码打印到服务端终端；
// 生产环境实现阿里云 / 腾讯云适配器（填 AccessKey），业务代码不变。

export interface SmsAdapter {
  /** 发送验证码短信。开发版仅打印到控制台。 */
  sendCode(phone: string, code: string): Promise<void>;
  /** 是否为开发适配器（决定是否把验证码回显到前端，便于本地测试）。 */
  readonly isDev: boolean;
}

class DevSmsAdapter implements SmsAdapter {
  readonly isDev = true;
  async sendCode(phone: string, code: string): Promise<void> {
    // 开发模式：不真正发短信，打印到后台终端
    console.log(
      `\n========================================\n[短信-开发模式] 手机号 ${phone} 的验证码：${code}\n（有效期 5 分钟。生产环境请配置真实短信服务商）\n========================================\n`
    );
  }
}

// 生产适配器占位（接入真短信时实现）：
// class AliyunSmsAdapter implements SmsAdapter {
//   readonly isDev = false;
//   async sendCode(phone: string, code: string) { /* 调用阿里云短信 API */ }
// }
// class TencentSmsAdapter implements SmsAdapter { ... }

export function getSms(): SmsAdapter {
  switch (process.env.SMS_DRIVER) {
    // case "aliyun": return new AliyunSmsAdapter();
    // case "tencent": return new TencentSmsAdapter();
    default:
      return new DevSmsAdapter();
  }
}
