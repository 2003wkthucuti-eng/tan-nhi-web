/**
 * Bộ tổng hợp âm thanh chuông gió / chuông pha lê (Crystal Chime) bằng Web Audio API.
 * Phát tức thì không độ trễ, âm sắc trong vắt nổi bật nhẹ nhàng trên nền nhạc <audio>.
 */

let audioCtx: AudioContext | null = null;
let outputLimiter: DynamicsCompressorNode | null = null;
let listenersBound = false;

function getAudioChain(): { ctx: AudioContext; destination: AudioNode } | null {
  if (typeof window === 'undefined') return null;

  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass({ latencyHint: 'interactive' });
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // Bỏ qua nếu trình duyệt chưa cho phép mở khóa audio
    });
  }

  if (!outputLimiter) {
    outputLimiter = audioCtx.createDynamicsCompressor();
    outputLimiter.threshold.setValueAtTime(-3, audioCtx.currentTime);
    outputLimiter.knee.setValueAtTime(10, audioCtx.currentTime);
    outputLimiter.ratio.setValueAtTime(4, audioCtx.currentTime);
    outputLimiter.attack.setValueAtTime(0.002, audioCtx.currentTime);
    outputLimiter.release.setValueAtTime(0.14, audioCtx.currentTime);
    outputLimiter.connect(audioCtx.destination);
  }

  return { ctx: audioCtx, destination: outputLimiter };
}

function bindUnlockListeners(): void {
  if (typeof window === 'undefined' || listenersBound) return;
  listenersBound = true;

  const unlock = () => {
    try {
      const chain = getAudioChain();
      if (chain && chain.ctx.state === 'running') {
        window.removeEventListener('pointerdown', unlock, true);
        window.removeEventListener('keydown', unlock, true);
      }
    } catch {
      // An toàn nếu trình duyệt chưa sẵn sàng
    }
  };

  window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
  window.addEventListener('keydown', unlock, { capture: true, passive: true });
}

bindUnlockListeners();

/**
 * Chuỗi âm chuông gió pha lê ngân dài, huyền ảo khi bấm "Gõ cửa nhà nhỏ".
 */
export function playDoorChime(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.88, now);
    masterGain.connect(destination);

    // Chuỗi hòa âm chuông pha lê Dmaj9 ngân vang thanh khiết (A5 -> C#6 -> D6 -> E6 -> F#6 -> A6)
    const notes = [880.0, 1108.73, 1174.66, 1318.51, 1479.98, 1760.0];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.072;
      const tailDuration = 2.25 - idx * 0.08;

      // 1. Âm nền chuông pha lê trong vắt
      const fundamentalOsc = ctx.createOscillator();
      const fundamentalGain = ctx.createGain();
      fundamentalOsc.type = 'sine';
      fundamentalOsc.frequency.setValueAtTime(freq, startTime);

      fundamentalGain.gain.setValueAtTime(0.0001, startTime);
      fundamentalGain.gain.linearRampToValueAtTime(0.38, startTime + 0.006);
      fundamentalGain.gain.exponentialRampToValueAtTime(0.0001, startTime + tailDuration);

      // 2. Bồi âm quãng 8 sáng lấp lánh
      const octaveOsc = ctx.createOscillator();
      const octaveGain = ctx.createGain();
      octaveOsc.type = 'sine';
      octaveOsc.frequency.setValueAtTime(freq * 2, startTime);

      octaveGain.gain.setValueAtTime(0.0001, startTime);
      octaveGain.gain.linearRampToValueAtTime(0.15, startTime + 0.005);
      octaveGain.gain.exponentialRampToValueAtTime(0.0001, startTime + tailDuration * 0.5);

      // 3. Bồi âm thủy tinh cao tạo độ vang pha lê tinh tế
      const crystalOsc = ctx.createOscillator();
      const crystalGain = ctx.createGain();
      crystalOsc.type = 'sine';
      crystalOsc.frequency.setValueAtTime(freq * 2.98, startTime);

      crystalGain.gain.setValueAtTime(0.0001, startTime);
      crystalGain.gain.linearRampToValueAtTime(0.052, startTime + 0.003);
      crystalGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

      fundamentalOsc.connect(fundamentalGain);
      octaveOsc.connect(octaveGain);
      crystalOsc.connect(crystalGain);

      fundamentalGain.connect(masterGain);
      octaveGain.connect(masterGain);
      crystalGain.connect(masterGain);

      fundamentalOsc.start(startTime);
      octaveOsc.start(startTime);
      crystalOsc.start(startTime);

      fundamentalOsc.stop(startTime + tailDuration + 0.04);
      octaveOsc.stop(startTime + tailDuration * 0.54);
      crystalOsc.stop(startTime + 0.44);
    });
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

export type SoftTapVariant = 'tap' | 'nav' | 'card' | 'music';

const VARIANT_CHIME_PITCHES: Record<SoftTapVariant, number> = {
  tap: 1174.66, // D6 - chạm tag thể loại / bộ lọc
  nav: 1318.51, // E6 - chuyển trang / điều hướng
  card: 1479.98, // F#6 - chạm thẻ nhân vật / nút link
  music: 1760.0, // A6 - chuyển bài nhạc / điều khiển nhạc
};

/**
 * Tiếng chuông gió / chuông pha lê ngắn gọn, trong trẻo và ngân vang êm tai cho mọi thao tác click.
 */
export function playSoftTap(variant: SoftTapVariant = 'tap'): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;
    const baseFreq = VARIANT_CHIME_PITCHES[variant];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.88, now);
    masterGain.connect(destination);

    // 1. Âm chuông chính tần số cao, thanh thoát với độ ngân dài êm tai
    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(baseFreq, now);

    chimeGain.gain.setValueAtTime(0.0001, now);
    chimeGain.gain.linearRampToValueAtTime(0.5, now + 0.004);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.68);

    // 2. Bồi âm quãng 8 trên giúp tiếng chuông trong vắt và rõ nét trên nền nhạc
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = 'sine';
    shimmerOsc.frequency.setValueAtTime(baseFreq * 2, now);

    shimmerGain.gain.setValueAtTime(0.0001, now);
    shimmerGain.gain.linearRampToValueAtTime(0.16, now + 0.003);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

    // 3. Điểm nhấn pha lê mảnh ở quãng hài cao khi vừa chạm
    const bellPartialOsc = ctx.createOscillator();
    const bellPartialGain = ctx.createGain();
    bellPartialOsc.type = 'sine';
    bellPartialOsc.frequency.setValueAtTime(baseFreq * 2.98, now);

    bellPartialGain.gain.setValueAtTime(0.0001, now);
    bellPartialGain.gain.linearRampToValueAtTime(0.06, now + 0.002);
    bellPartialGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    chimeOsc.connect(chimeGain);
    shimmerOsc.connect(shimmerGain);
    bellPartialOsc.connect(bellPartialGain);

    chimeGain.connect(masterGain);
    shimmerGain.connect(masterGain);
    bellPartialGain.connect(masterGain);

    chimeOsc.start(now);
    shimmerOsc.start(now);
    bellPartialOsc.start(now);

    chimeOsc.stop(now + 0.72);
    shimmerOsc.stop(now + 0.38);
    bellPartialOsc.stop(now + 0.2);
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}
