export type DeviceCapabilitySnapshot = {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
};

const MOBILE_OR_TABLET_USER_AGENT = /Android|iPad|iPhone|iPod|Mobile/i;

export function supportsDirectCameraCapture({
  userAgent,
  platform = "",
  maxTouchPoints = 0,
}: DeviceCapabilitySnapshot) {
  const isIPadInDesktopMode = platform === "MacIntel" && maxTouchPoints > 1;
  return MOBILE_OR_TABLET_USER_AGENT.test(userAgent) || isIPadInDesktopMode;
}
