import { useEffect, useState } from 'react';
import type { AvatarFrameDefinition } from '../data/avatarFrames';

const processedFrameCache = new Map<string, string>();
const pendingFramePromises = new Map<string, Promise<string>>();

function processDarkRingCutout(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  frame: AvatarFrameDefinition
): void {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);

  const cx = Math.max(0, Math.min(width - 1, Math.round(frame.centerX * width)));
  const cy = Math.max(0, Math.min(height - 1, Math.round(frame.centerY * height)));
  const minDim = Math.min(width, height);

  const innerThreshold = frame.darkThreshold ?? 34;
  const outerThreshold = Math.max(28, innerThreshold - 4);
  const maxInnerRadius = minDim * (frame.cutoutInnerRadiusRatio ?? frame.avatarDiameterRatio * 0.56);
  const maxInnerRadiusSq = maxInnerRadius * maxInnerRadius;
  const minOuterRadius = minDim * (frame.cutoutOuterRadiusRatio ?? frame.avatarDiameterRatio * 0.52);
  const minOuterRadiusSq = minOuterRadius * minOuterRadius;

  const isDarkPixel = (idx4: number, maxThreshold: number) => {
    const r = data[idx4];
    const g = data[idx4 + 1];
    const b = data[idx4 + 2];
    const lum = r * 0.299 + g * 0.587 + b * 0.114;
    return lum <= maxThreshold && Math.max(r, g, b) <= maxThreshold + 20;
  };

  // Pass 1: Xóa sạch tâm đen ở giữa khung để lộ avatar bên trong
  let head = 0;
  let tail = 0;
  const startIdx = cy * width + cx;
  visited[startIdx] = 1;
  queue[tail++] = startIdx;

  while (head < tail) {
    const p = queue[head++];
    const px = p % width;
    const py = (p - px) / width;
    const idx4 = p * 4;
    data[idx4 + 3] = 0;

    const neighbors = [
      px > 0 ? p - 1 : -1,
      px < width - 1 ? p + 1 : -1,
      py > 0 ? p - width : -1,
      py < height - 1 ? p + width : -1,
    ];

    for (let i = 0; i < 4; i += 1) {
      const n = neighbors[i];
      if (n < 0 || visited[n]) continue;
      const nx = n % width;
      const ny = (n - nx) / width;
      const dx = nx - cx;
      const dy = ny - cy;
      if (dx * dx + dy * dy > maxInnerRadiusSq) continue;
      if (isDarkPixel(n * 4, innerThreshold)) {
        visited[n] = 1;
        queue[tail++] = n;
      }
    }
  }

  // Pass 1b (tuỳ chọn): Xóa các ô tối khép kín bên trong vòng tâm (như lỗ mạng nhện ren trắng)
  if (frame.clearEnclosedInnerDark) {
    const innerScanSq = maxInnerRadius * 0.94 * (maxInnerRadius * 0.94);
    for (let y = 0; y < height; y += 1) {
      const dy = y - cy;
      for (let x = 0; x < width; x += 1) {
        const dx = x - cx;
        if (dx * dx + dy * dy > innerScanSq) continue;
        const p = y * width + x;
        if (!visited[p] && isDarkPixel(p * 4, innerThreshold)) {
          visited[p] = 1;
          data[p * 4 + 3] = 0;
        }
      }
    }
  }

  // Pass 2: Xóa nền đen bên ngoài viền khung (từ 4 cạnh vào)
  head = 0;
  tail = 0;
  const seedOuter = (x: number, y: number) => {
    const p = y * width + x;
    if (visited[p]) return;
    if (isDarkPixel(p * 4, outerThreshold)) {
      visited[p] = 1;
      queue[tail++] = p;
    }
  };

  for (let x = 0; x < width; x += 1) {
    seedOuter(x, 0);
    seedOuter(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    seedOuter(0, y);
    seedOuter(width - 1, y);
  }

  while (head < tail) {
    const p = queue[head++];
    const px = p % width;
    const py = (p - px) / width;
    data[p * 4 + 3] = 0;

    const neighbors = [
      px > 0 ? p - 1 : -1,
      px < width - 1 ? p + 1 : -1,
      py > 0 ? p - width : -1,
      py < height - 1 ? p + width : -1,
    ];

    for (let i = 0; i < 4; i += 1) {
      const n = neighbors[i];
      if (n < 0 || visited[n]) continue;
      const nx = n % width;
      const ny = (n - nx) / width;
      const dx = nx - cx;
      const dy = ny - cy;
      if (dx * dx + dy * dy < minOuterRadiusSq) continue;
      if (isDarkPixel(n * 4, outerThreshold)) {
        visited[n] = 1;
        queue[tail++] = n;
      }
    }
  }

  // Pass 3: Làm mềm mép viền 1px tiếp giáp vùng vừa xóa để không bị răng cưa đen
  const softEdges: Array<{ idx4: number; alpha: number }> = [];
  const edgeMaxLum = Math.max(68, innerThreshold + 34);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const p = y * width + x;
      const idx4 = p * 4;
      if (data[idx4 + 3] === 0) continue;
      const hasClearedNeighbor =
        data[(p - 1) * 4 + 3] === 0 ||
        data[(p + 1) * 4 + 3] === 0 ||
        data[(p - width) * 4 + 3] === 0 ||
        data[(p + width) * 4 + 3] === 0;
      if (!hasClearedNeighbor) continue;

      const lum = data[idx4] * 0.299 + data[idx4 + 1] * 0.587 + data[idx4 + 2] * 0.114;
      if (lum < edgeMaxLum) {
        const ratio = Math.max(0, Math.min(1, (lum - 16) / (edgeMaxLum - 16)));
        softEdges.push({ idx4, alpha: Math.round(ratio * 255) });
      }
    }
  }
  for (let i = 0; i < softEdges.length; i += 1) {
    data[softEdges[i].idx4 + 3] = softEdges[i].alpha;
  }
}

function processLightRingCutout(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  frame: AvatarFrameDefinition
): void {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);

  const cx = Math.max(0, Math.min(width - 1, Math.round(frame.centerX * width)));
  const cy = Math.max(0, Math.min(height - 1, Math.round(frame.centerY * height)));
  const minDim = Math.min(width, height);

  const minLightLum = frame.lightThreshold ?? 232;
  const maxInnerRadius = minDim * (frame.cutoutInnerRadiusRatio ?? frame.avatarDiameterRatio * 0.6);
  const maxInnerRadiusSq = maxInnerRadius * maxInnerRadius;
  const minOuterRadius = minDim * (frame.cutoutOuterRadiusRatio ?? frame.avatarDiameterRatio * 0.54);
  const minOuterRadiusSq = minOuterRadius * minOuterRadius;

  const isLightPixel = (idx4: number, minLum: number) => {
    const r = data[idx4];
    const g = data[idx4 + 1];
    const b = data[idx4 + 2];
    const lum = r * 0.299 + g * 0.587 + b * 0.114;
    return lum >= minLum && Math.min(r, g, b) >= minLum - 14;
  };

  // Pass 1: Xóa tâm trắng ở giữa để giữ nguyên mây sáng và hào quang trên vành khung
  let head = 0;
  let tail = 0;
  const startIdx = cy * width + cx;
  visited[startIdx] = 1;
  queue[tail++] = startIdx;

  while (head < tail) {
    const p = queue[head++];
    const px = p % width;
    const py = (p - px) / width;
    data[p * 4 + 3] = 0;

    const neighbors = [
      px > 0 ? p - 1 : -1,
      px < width - 1 ? p + 1 : -1,
      py > 0 ? p - width : -1,
      py < height - 1 ? p + width : -1,
    ];

    for (let i = 0; i < 4; i += 1) {
      const n = neighbors[i];
      if (n < 0 || visited[n]) continue;
      const nx = n % width;
      const ny = (n - nx) / width;
      const dx = nx - cx;
      const dy = ny - cy;
      if (dx * dx + dy * dy > maxInnerRadiusSq) continue;
      if (isLightPixel(n * 4, minLightLum)) {
        visited[n] = 1;
        queue[tail++] = n;
      }
    }
  }

  // Pass 2: Xóa nền trắng bên ngoài viền tròn
  head = 0;
  tail = 0;
  const seedOuter = (x: number, y: number) => {
    const p = y * width + x;
    if (visited[p]) return;
    if (isLightPixel(p * 4, minLightLum)) {
      visited[p] = 1;
      queue[tail++] = p;
    }
  };

  for (let x = 0; x < width; x += 1) {
    seedOuter(x, 0);
    seedOuter(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    seedOuter(0, y);
    seedOuter(width - 1, y);
  }

  while (head < tail) {
    const p = queue[head++];
    const px = p % width;
    const py = (p - px) / width;
    data[p * 4 + 3] = 0;

    const neighbors = [
      px > 0 ? p - 1 : -1,
      px < width - 1 ? p + 1 : -1,
      py > 0 ? p - width : -1,
      py < height - 1 ? p + width : -1,
    ];

    for (let i = 0; i < 4; i += 1) {
      const n = neighbors[i];
      if (n < 0 || visited[n]) continue;
      const nx = n % width;
      const ny = (n - nx) / width;
      const dx = nx - cx;
      const dy = ny - cy;
      if (dx * dx + dy * dy < minOuterRadiusSq) continue;
      if (isLightPixel(n * 4, minLightLum)) {
        visited[n] = 1;
        queue[tail++] = n;
      }
    }
  }

  // Pass 3: Làm mềm mép viền trắng 1px để khung mượt trên nền tối
  const softEdges: Array<{ idx4: number; alpha: number }> = [];
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const p = y * width + x;
      const idx4 = p * 4;
      if (data[idx4 + 3] === 0) continue;
      const hasClearedNeighbor =
        data[(p - 1) * 4 + 3] === 0 ||
        data[(p + 1) * 4 + 3] === 0 ||
        data[(p - width) * 4 + 3] === 0 ||
        data[(p + width) * 4 + 3] === 0;
      if (!hasClearedNeighbor) continue;

      const lum = data[idx4] * 0.299 + data[idx4 + 1] * 0.587 + data[idx4 + 2] * 0.114;
      if (lum > 180) {
        const ratio = Math.max(0, Math.min(1, (242 - lum) / 62));
        softEdges.push({ idx4, alpha: Math.round(ratio * 255) });
      }
    }
  }
  for (let i = 0; i < softEdges.length; i += 1) {
    data[softEdges[i].idx4 + 3] = softEdges[i].alpha;
  }
}

function processInkWhiteCutout(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = r * 0.299 + g * 0.587 + b * 0.114;
    if (lum >= 240) {
      data[i + 3] = 0;
    } else if (lum > 155) {
      const alpha = Math.round(((240 - lum) / (240 - 155)) * 255);
      data[i + 3] = Math.max(0, Math.min(255, alpha));
    } else {
      data[i + 3] = 255;
    }
  }
}

export function getProcessedAvatarFrameUrl(frame: AvatarFrameDefinition): Promise<string> {
  const cached = processedFrameCache.get(frame.id);
  if (cached) {
    return Promise.resolve(cached);
  }
  const pending = pendingFramePromises.get(frame.id);
  if (pending) {
    return pending;
  }

  const task = new Promise<string>((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve(frame.imageUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const targetSize = 480;
        const aspect = img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : 1;
        const width = aspect >= 1 ? targetSize : Math.round(targetSize * aspect);
        const height = aspect >= 1 ? Math.round(targetSize / aspect) : targetSize;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(frame.imageUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        if (frame.cutoutMode === 'ink-white') {
          processInkWhiteCutout(imageData.data);
        } else if (frame.cutoutMode === 'light-ring') {
          processLightRingCutout(imageData.data, width, height, frame);
        } else {
          processDarkRingCutout(imageData.data, width, height, frame);
        }
        ctx.putImageData(imageData, 0, 0);

        const pngUrl = canvas.toDataURL('image/png');
        processedFrameCache.set(frame.id, pngUrl);
        resolve(pngUrl);
      } catch {
        resolve(frame.imageUrl);
      }
    };
    img.onerror = () => {
      resolve(frame.imageUrl);
    };
    img.src = frame.imageUrl;
  }).finally(() => {
    pendingFramePromises.delete(frame.id);
  });

  pendingFramePromises.set(frame.id, task);
  return task;
}

export function useProcessedAvatarFrameUrl(frame: AvatarFrameDefinition | null): string | null {
  const [url, setUrl] = useState<string | null>(() =>
    frame ? processedFrameCache.get(frame.id) ?? null : null
  );

  useEffect(() => {
    if (!frame) {
      setUrl(null);
      return;
    }
    const cached = processedFrameCache.get(frame.id);
    if (cached) {
      setUrl(cached);
      return;
    }
    let cancelled = false;
    void getProcessedAvatarFrameUrl(frame).then((resolved) => {
      if (!cancelled) {
        setUrl(resolved);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [frame]);

  return url;
}
