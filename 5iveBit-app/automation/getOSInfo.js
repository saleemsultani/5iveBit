import os from 'os';
export function getOSInfo() {
  const platform = os.platform(); // 'win32', 'darwin', 'linux'
  const arch = os.arch(); // 'x64', 'arm64', etc.
  return { platform, arch };
}
