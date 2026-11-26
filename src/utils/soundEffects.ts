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

/**
 * Tiếng chuông vòng cổ hòa nhẹ tiếng "meo" trong trẻo khi chạm vào chú mèo đen.
 */
export function playCatMeowChime(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.86, now);
    masterGain.connect(destination);

    // 1. Tiếng chuông cổ mèo mảnh mai, trong vắt
    const bellOsc = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(1760.0, now);

    bellGain.gain.setValueAtTime(0.0001, now);
    bellGain.gain.linearRampToValueAtTime(0.32, now + 0.004);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

    // 2. Đường cong âm sắc "meo~" nhẹ nhàng, thanh thoát bằng sóng sine mượt
    const meowOsc = ctx.createOscillator();
    const meowHarmonic = ctx.createOscillator();
    const meowGain = ctx.createGain();
    const meowHarmonicGain = ctx.createGain();

    meowOsc.type = 'sine';
    meowOsc.frequency.setValueAtTime(880.0, now + 0.025);
    meowOsc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.11);
    meowOsc.frequency.exponentialRampToValueAtTime(987.77, now + 0.34);

    meowHarmonic.type = 'sine';
    meowHarmonic.frequency.setValueAtTime(1760.0, now + 0.025);
    meowHarmonic.frequency.exponentialRampToValueAtTime(2349.32, now + 0.11);
    meowHarmonic.frequency.exponentialRampToValueAtTime(1975.53, now + 0.34);

    meowGain.gain.setValueAtTime(0.0001, now + 0.025);
    meowGain.gain.linearRampToValueAtTime(0.34, now + 0.09);
    meowGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    meowHarmonicGain.gain.setValueAtTime(0.0001, now + 0.025);
    meowHarmonicGain.gain.linearRampToValueAtTime(0.1, now + 0.09);
    meowHarmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    bellOsc.connect(bellGain);
    meowOsc.connect(meowGain);
    meowHarmonic.connect(meowHarmonicGain);

    bellGain.connect(masterGain);
    meowGain.connect(masterGain);
    meowHarmonicGain.connect(masterGain);

    bellOsc.start(now);
    meowOsc.start(now + 0.025);
    meowHarmonic.start(now + 0.025);

    bellOsc.stop(now + 0.68);
    meowOsc.stop(now + 0.46);
    meowHarmonic.stop(now + 0.36);
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Chuỗi chuông pha lê ngân dài huyền bí khi bấm "Gặp gỡ định mệnh".
 */
export function playDestinyChime(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.9, now);
    masterGain.connect(destination);

    // Hợp âm Tarot ánh sao ngân vang (F#5 - A5 - C#6 - E6 - G#6 - B6)
    const notes = [739.99, 880.0, 1108.73, 1318.51, 1661.22, 1975.53];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.065;
      const tailDuration = 2.35 - idx * 0.06;

      const fundamentalOsc = ctx.createOscillator();
      const fundamentalGain = ctx.createGain();
      fundamentalOsc.type = 'sine';
      fundamentalOsc.frequency.setValueAtTime(freq, startTime);

      fundamentalGain.gain.setValueAtTime(0.0001, startTime);
      fundamentalGain.gain.linearRampToValueAtTime(0.35, startTime + 0.006);
      fundamentalGain.gain.exponentialRampToValueAtTime(0.0001, startTime + tailDuration);

      const octaveOsc = ctx.createOscillator();
      const octaveGain = ctx.createGain();
      octaveOsc.type = 'sine';
      octaveOsc.frequency.setValueAtTime(freq * 2, startTime);

      octaveGain.gain.setValueAtTime(0.0001, startTime);
      octaveGain.gain.linearRampToValueAtTime(0.13, startTime + 0.005);
      octaveGain.gain.exponentialRampToValueAtTime(0.0001, startTime + tailDuration * 0.5);

      fundamentalOsc.connect(fundamentalGain);
      octaveOsc.connect(octaveGain);

      fundamentalGain.connect(masterGain);
      octaveGain.connect(masterGain);

      fundamentalOsc.start(startTime);
      octaveOsc.start(startTime);

      fundamentalOsc.stop(startTime + tailDuration + 0.05);
      octaveOsc.stop(startTime + tailDuration * 0.54);
    });
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Chuỗi chuông pha lê nhẹ nhàng khi 5 lá bài Tarot bay lên theo hình cánh quạt trên bàn nhung.
 */
export function playTarotSpreadChime(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.84, now);
    masterGain.connect(destination);

    // 5 nốt chuông ứng với 5 lá bài bay lên (D6 - E6 - F#6 - A6 - B6)
    const notes = [1174.66, 1318.51, 1479.98, 1760.0, 1975.53];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.085;
      const duration = 1.05;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2, startTime);

      overtoneGain.gain.setValueAtTime(0.0001, startTime);
      overtoneGain.gain.linearRampToValueAtTime(0.08, startTime + 0.004);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

      osc.connect(gain);
      overtone.connect(overtoneGain);
      gain.connect(masterGain);
      overtoneGain.connect(masterGain);

      osc.start(startTime);
      overtone.start(startTime);
      osc.stop(startTime + duration + 0.04);
      overtone.stop(startTime + 0.48);
    });
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Âm thanh chuông pha lê rạng rỡ ngân vang khi mở khóa huy hiệu ẩn "Tri kỷ của Tần Nhi".
 */
export function playAchievementChime(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.92, now);
    masterGain.connect(destination);

    // Hợp âm chúc mừng lấp lánh (G5 - B5 - D6 - F#6 - A6 - D7)
    const notes = [783.99, 987.77, 1174.66, 1479.98, 1760.0, 2349.32];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.068;
      const tailDuration = 2.6 - idx * 0.08;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.36, startTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + tailDuration);

      const sparkle = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkle.type = 'sine';
      sparkle.frequency.setValueAtTime(freq * 2, startTime);

      sparkleGain.gain.setValueAtTime(0.0001, startTime);
      sparkleGain.gain.linearRampToValueAtTime(0.11, startTime + 0.004);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, startTime + tailDuration * 0.45);

      osc.connect(gain);
      sparkle.connect(sparkleGain);
      gain.connect(masterGain);
      sparkleGain.connect(masterGain);

      osc.start(startTime);
      sparkle.start(startTime);
      osc.stop(startTime + tailDuration + 0.05);
      sparkle.stop(startTime + tailDuration * 0.5);
    });
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Tiếng giọt pha lê rơi vào vạc vàng khi thả nguyên liệu độc dược.
 */
export function playPotionDropChime(stepIndex = 0): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;
    const basePitches = [659.25, 783.99, 987.77]; // E5, G5, B5
    const baseFreq = basePitches[stepIndex % basePitches.length];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.84, now);
    masterGain.connect(destination);

    // Giọt nước dâng tần số nhẹ ("bloop" pha lê)
    const dropOsc = ctx.createOscillator();
    const dropGain = ctx.createGain();
    dropOsc.type = 'sine';
    dropOsc.frequency.setValueAtTime(baseFreq * 0.72, now);
    dropOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.14);

    dropGain.gain.setValueAtTime(0.0001, now);
    dropGain.gain.linearRampToValueAtTime(0.42, now + 0.01);
    dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    dropOsc.connect(dropGain);
    dropGain.connect(masterGain);
    dropOsc.start(now);
    dropOsc.stop(now + 0.48);
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Chuỗi âm pha lê xoay vần khi khuấy đũa phép và triệu hồi nhân vật tình duyên.
 */
export function playPotionBrewChime(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.88, now);
    masterGain.connect(destination);

    const notes = [587.33, 739.99, 880.0, 1174.66, 1479.98, 1760.0];
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.095;
      const duration = 1.45 - idx * 0.06;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.32, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.04);
    });
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Nhịp tim / tiếng khóa khẽ khi đang nhấn giữ nghe lén sau cánh cửa.
 */
export function playEavesdropTick(dangerRatio: number): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.45, now);
    masterGain.connect(destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const freq = 420 + Math.min(1, Math.max(0, dangerRatio)) * 460;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.16);
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Âm thanh kịch tính khi cánh cửa bật mở bắt quả tang người chơi nghe lén.
 */
export function playDoorCaughtChime(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.9, now);
    masterGain.connect(destination);

    const chord = [293.66, 440.0, 523.25, 659.25, 880.0];
    chord.forEach((freq, idx) => {
      const startTime = now + idx * 0.025;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(idx === 0 ? 0.42 : 0.25, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.5);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startTime);
      osc.stop(startTime + 1.55);
    });
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Âm thanh vỡ sáp nhẹ + ngân vang pha lê khi mở con dấu sáp đỏ niêm phong bức thư.
 */
export function playWaxSealBreakChime(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.88, now);
    masterGain.connect(destination);

    // 1. Tiếng tách giòn nhẹ mô phỏng sáp vỡ
    const crackOsc = ctx.createOscillator();
    const crackGain = ctx.createGain();
    crackOsc.type = 'triangle';
    crackOsc.frequency.setValueAtTime(340, now);
    crackOsc.frequency.exponentialRampToValueAtTime(110, now + 0.08);
    crackGain.gain.setValueAtTime(0.0001, now);
    crackGain.gain.linearRampToValueAtTime(0.42, now + 0.004);
    crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    crackOsc.connect(crackGain);
    crackGain.connect(masterGain);
    crackOsc.start(now);
    crackOsc.stop(now + 0.13);

    // 2. Hợp âm mở thư dịu dàng (E5 - G#5 - B5 - E6 - G#6)
    const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
    notes.forEach((freq, idx) => {
      const startTime = now + 0.05 + idx * 0.07;
      const duration = 1.9 - idx * 0.08;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.04);
    });
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Âm nhịp đập trầm ấm khẽ vang khi bắt đầu chu kỳ hào quang trong Nhịp Đập Cộng Hưởng.
 */
export function playHeartbeatPulseTone(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.5, now);
    masterGain.connect(destination);

    // Hai nhịp "lub-dub" rất êm
    [0, 0.14].forEach((offset, idx) => {
      const startTime = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 112 : 92, startTime);
      osc.frequency.exponentialRampToValueAtTime(52, startTime + 0.12);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(idx === 0 ? 0.34 : 0.24, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.17);
    });
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Chuông cộng hưởng dâng cao dần theo 3 bước (1/3 -> 2/3 -> 3/3) khi chạm chuẩn nhịp.
 */
export function playResonanceHitChime(stepNumber: number): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;
    const pitches = [987.77, 1318.51, 1760.0]; // B5 -> E6 -> A6
    const freq = pitches[Math.max(0, Math.min(2, stepNumber - 1))];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.88, now);
    masterGain.connect(destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    const harmonic = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(freq * 1.5, now);
    harmonicGain.gain.setValueAtTime(0.0001, now);
    harmonicGain.gain.linearRampToValueAtTime(0.18, now + 0.005);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc.connect(gain);
    harmonic.connect(harmonicGain);
    gain.connect(masterGain);
    harmonicGain.connect(masterGain);

    osc.start(now);
    harmonic.start(now);
    osc.stop(now + 0.9);
    harmonic.stop(now + 0.6);
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Âm nhẹ báo chạm lệch nhịp trong Nhịp Đập Cộng Hưởng.
 */
export function playResonanceMissTone(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.55, now);
    masterGain.connect(destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.18);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Chuỗi chuông huyền bí ngân nhẹ khi giải mã thành công "Căn Phòng Bí Mật Của Chủ Nhà".
 */
export function playSecretRoomChime(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.86, now);
    masterGain.connect(destination);

    // Hợp âm bí ẩn Ebmaj9 / Dmaj9 ngân nhẹ (D5 - F#5 - A5 - C#6 - E6 - A6)
    const notes = [587.33, 739.99, 880.0, 1108.73, 1318.51, 1760.0];
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.078;
      const tailDuration = 2.4 - idx * 0.08;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.32, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + tailDuration);

      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(freq * 2, startTime);
      shimmerGain.gain.setValueAtTime(0.0001, startTime);
      shimmerGain.gain.linearRampToValueAtTime(0.1, startTime + 0.005);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, startTime + tailDuration * 0.48);

      osc.connect(gain);
      shimmer.connect(shimmerGain);
      gain.connect(masterGain);
      shimmerGain.connect(masterGain);

      osc.start(startTime);
      shimmer.start(startTime);
      osc.stop(startTime + tailDuration + 0.04);
      shimmer.stop(startTime + tailDuration * 0.52);
    });
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}

/**
 * Chuông đêm sâu thanh mảnh khi bước vào Khung Giờ Ma Thuật (00:00 – 03:00).
 */
export function playWitchingHourChime(): void {
  try {
    const chain = getAudioChain();
    if (!chain) return;

    const { ctx, destination } = chain;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.78, now);
    masterGain.connect(destination);

    // 3 tiếng chuông đồng hồ nửa đêm dịu dàng (A5 - E6 - B6)
    const notes = [880.0, 1318.51, 1975.53];
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.14;
      const duration = 2.1 - idx * 0.12;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.04);
    });
  } catch {
    // An toàn nếu trình duyệt chặn audio context
  }
}


