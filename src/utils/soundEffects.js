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

/**
 * Vintage mechanical keyboard tactile switch clack (Cherry MX Blue style)
 */
export function playKeyboardClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // High tactile snap
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    const snapFreq = 2400 + Math.random() * 600;

    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(snapFreq, now);
    snapOsc.frequency.exponentialRampToValueAtTime(600, now + 0.02);

    snapGain.gain.setValueAtTime(0.15, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);

    snapOsc.start(now);
    snapOsc.stop(now + 0.025);

    // Bottom-out thud
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    const thudFreq = 380 + Math.random() * 80;

    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(thudFreq, now + 0.008);
    thudOsc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    thudGain.gain.setValueAtTime(0.12, now + 0.008);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);

    thudOsc.start(now + 0.008);
    thudOsc.stop(now + 0.05);
  } catch {
    // Graceful fallback
  }
}

/**
 * 3.5" Floppy disk stepper motor head seek & drive spin
 */
export function playDiskDriveSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Series of 3 rapid head step pulses
    for (let i = 0; i < 3; i++) {
      const stepTime = now + i * 0.045;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(700 + i * 150, stepTime);
      osc.frequency.setValueAtTime(220, stepTime + 0.02);

      gain.gain.setValueAtTime(0.08, stepTime);
      gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(stepTime);
      osc.stop(stepTime + 0.03);
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Tactile microswitch mouse click
 */
export function playMouseClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2100, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.015);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  } catch {
    // Graceful fallback
  }
}

/**
 * Paper page flip rustle
 */
export function playPageFlipSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Generate white noise buffer for page texture
    const bufferSize = Math.floor(ctx.sampleRate * 0.09);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(600, now + 0.08);
    filter.Q.value = 1.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.09);
  } catch {
    // Graceful fallback
  }
}

/**
 * Stationery & metallic pen clink
 */
export function playPenClinkSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(3400, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.06);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    // Graceful fallback
  }
}

/**
 * Ergonomic chair acoustic swivel squeak
 */
export function playChairSwivelSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.09);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Graceful fallback
  }
}
