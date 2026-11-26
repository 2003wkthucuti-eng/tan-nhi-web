import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, Ghost, Sparkles, X } from 'lucide-react';
import type { CharacterItem } from '../App';
import { playSoftTap } from '../utils/soundEffects';

export interface TabWhisperPayload {
  id: number;
  character: CharacterItem;
  justUnlockedBadge: boolean;
}

interface TabWhisperToastProps {
  whisper: TabWhisperPayload | null;
  onInspectCharacter: (character: CharacterItem) => void;
  onDismiss: () => void;
}

function cleanQuote(text: string): string {
  const trimmed = text.trim().replace(/^["“]+|["”]+$/g, '');
  return `“${trimmed}”`;
}

export const TabWhisperToast: React.FC<TabWhisperToastProps> = ({
  whisper,
  onInspectCharacter,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {whisper && (
        <motion.aside
          key={whisper.id}
          initial={{ opacity: 0, x: -18, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -14, y: 8, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-3 sm:bottom-5 sm:left-5 z-[55] w-[calc(100vw-1.5rem)] max-w-xs sm:max-w-sm rounded-2xl bg-[#111018]/96 backdrop-blur-md border border-[#D4AF37]/70 p-3.5 shadow-[0_16px_42px_rgba(0,0,0,0.88),0_0_26px_rgba(212,175,55,0.22)]"
        >
          <button
            type="button"
            onClick={() => {
              playSoftTap('nav');
              onDismiss();
            }}
            aria-label="Đóng lời thì thầm"
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full inline-flex items-center justify-center text-[#B8B0A0] hover:text-[#F3E5AB] hover:bg-[#D4AF37]/15 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <div className="pr-6">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F3E5AB]">
              <Ghost className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
              <span>Cuối cùng bạn cũng quay lại rồi...</span>
            </div>

            <div className="mt-2 rounded-xl bg-[#0B0B0F]/85 border border-[#D4AF37]/25 px-3 py-2">
              <p className="text-[11px] font-medium text-[#D4AF37]">
                {whisper.character.name.split(/\s+[—-]\s+/)[0]} khẽ thì thầm:
              </p>
              <p className="mt-0.5 text-xs text-[#E5DEC9] italic leading-relaxed line-clamp-2">
                {cleanQuote(whisper.character.description)}
              </p>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              {whisper.justUnlockedBadge ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D4AF37]/20 border border-[#F3E5AB]/50 text-[10px] font-medium text-[#F3E5AB]">
                  <Award className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span>Mở khóa: Kẻ Lạc Lối Quay Về</span>
                </span>
              ) : (
                <span className="text-[10px] text-[#8E877A]">
                  Huy hiệu: Kẻ Lạc Lối Quay Về
                </span>
              )}

              <button
                type="button"
                onClick={() => onInspectCharacter(whisper.character)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[11px] font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/25 hover:border-[#F3E5AB] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>Gặp người ấy</span>
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
