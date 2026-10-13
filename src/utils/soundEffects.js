// Synthesized sound effects via Web Audio API (zero external audio files or dependencies)

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Mechanical toggle switch click sound (dual pulse with subtle spring resonance)
 */
export function playLampClickSound(isOn = true) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Frequency pitch slightly varies depending on on vs off
    osc.frequency.setValueAtTime(isOn ? 1400 : 950, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // Graceful fallback if Web Audio is blocked or unsupported
  }
}

/**
 * Vintage CRT terminal chirps & mode shift beeps
 */
export function playTerminalChirp(modeIndex = 0) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreqs = [1200, 1600, 1400, 1800];
    const freq = baseFreqs[modeIndex % baseFreqs.length];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.setValueAtTime(freq * 1.5, now + 0.025);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Graceful fallback
  }
}
