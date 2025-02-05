import os from 'os';
export function getOSInfo() {
  // Get OS type
  const platform = os.platform();
  // get archeticture of the OS
  const arch = os.arch();
  return { platform, arch };
}
