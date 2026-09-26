/**
 * Audio Chime & Browser Notification Engine
 * Uses the Web Audio API for a calm, soothing Tibetan singing bowl / crystal chime (528 Hz)
 * and the HTML5 Notification API for real system/browser desktop alerts.
 */

export function playSoothingChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic frequencies for an organic, therapeutic chime
    const frequencies = [528, 792, 1056]; // Fundamental (528 Hz - Love/Transformation frequency), 5th overtone, octave

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Gentle attack and long soothing decay
      const initialGain = idx === 0 ? 0.25 : 0.1 / (idx + 1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(initialGain, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    });
  } catch (err) {
    console.warn('Web Audio API not supported or autoplay restricted:', err);
  }
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return 'default';
  }
}

export function sendBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=128&auto=format&fit=crop&q=80',
        badge: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=64&auto=format&fit=crop&q=80',
        silent: true, // We trigger our own soothing chime instead of system beep
        ...options,
      });
      return true;
    } catch (err) {
      console.warn('Failed to send browser notification:', err);
      return false;
    }
  }
  return false;
}
