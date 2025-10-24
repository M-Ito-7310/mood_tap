/**
 * Haptic Feedback Utilities
 * モバイルデバイスでの触覚フィードバックを提供
 */

/**
 * Vibration APIがサポートされているかチェック
 */
export function isHapticSupported(): boolean {
  return typeof window !== 'undefined' && 'vibrate' in navigator;
}

/**
 * 軽いタップフィードバック
 */
export function lightHaptic(): void {
  if (isHapticSupported()) {
    navigator.vibrate(10);
  }
}

/**
 * 中程度のタップフィードバック
 */
export function mediumHaptic(): void {
  if (isHapticSupported()) {
    navigator.vibrate(20);
  }
}

/**
 * 強いタップフィードバック
 */
export function heavyHaptic(): void {
  if (isHapticSupported()) {
    navigator.vibrate(30);
  }
}

/**
 * 成功フィードバック
 */
export function successHaptic(): void {
  if (isHapticSupported()) {
    navigator.vibrate([10, 50, 10]);
  }
}

/**
 * エラーフィードバック
 */
export function errorHaptic(): void {
  if (isHapticSupported()) {
    navigator.vibrate([50, 100, 50]);
  }
}

/**
 * 選択フィードバック
 */
export function selectionHaptic(): void {
  if (isHapticSupported()) {
    navigator.vibrate(5);
  }
}
