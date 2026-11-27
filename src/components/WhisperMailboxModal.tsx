import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MailOpen, RefreshCw, Sparkles, UserRound, X } from 'lucide-react';
import type { CharacterItem } from '../App';
import { useSiteTheme } from '../themes/siteThemes';
import { playSoftTap, playTarotSpreadChime } from '../utils/soundEffects';
import { BlackCatMascot } from './BlackCatMascot';

interface WhisperMailboxModalProps {
  isOpen: boolean;
  characters: CharacterItem[];
  onInspectCharacter: (char: CharacterItem) => void;
  onEnvelopeOpened?: () => void;
  onClose: () => void;
}

const CHARACTER_WHISPER_SECRETS: Record<string, string> = {
  'te-ngac':
    'Sau lớp áo vest lạnh băng và tờ đơn ly hôn trên bàn, hắn đã giữ lại chiếc cốc em hay dùng ở ngăn tủ cao nhất.',
  'dong-hoang':
    'Mỗi tối đóng cửa quán, anh vẫn pha thừa một ly cà phê ít đường rồi ngồi nhìn ra góc phố nơi em từng đứng.',
  'han-duy':
    'Ban ngày lạnh lùng giữ cả gia tộc, nhưng chỉ cần nghe tiếng bước chân em ngoài hành lang là tim hắn mềm nhũn.',
  'han-trach':
    'Trong ngăn kéo bàn làm việc khóa kín là bức ảnh chụp lén em dưới ánh đèn sân khấu nhỏ năm nào.',
  'can-dat':
    'Anh chàng ngồi cạnh trên chuyến tàu hôm ấy thực ra chỉ muốn mượn cớ hỏi thăm để biết điểm dừng của cô.',
  'khinh-hoang':
    'Viên đạn cuối cùng hắn giữ lại chưa bao giờ nhắm vào kẻ địch, mà để bảo vệ đường lui cho em.',
  'chu-sat':
    'Những đêm mất kiểm soát, chỉ cần nghe giọng em gọi tên mình thật khẽ là cả thế giới liền yên ả trở lại.',
  'chu-canh-duong':
    'Ngoài mặt than vãn bận rộn, nhưng điện thoại lúc nào cũng đặt ảnh em ở màn hình khóa và ghim khung chat trên cùng.',
  'chu-dich-an':
    'Sau mỗi trận thắng giải, người đầu tiên cậu tìm sau cánh gà luôn là em chứ không phải ống kính truyền thông.',
  'co-tram':
    'Kẻ hay trêu chọc em ở trường thực chất đã lén nạp tiền game và canh giờ online cùng em suốt nửa năm trời.',
  'co-da-lam':
    'Mỗi lần em quay lưng đi, cậu đều đứng đợi thêm mười phút chỉ để chắc chắn em đã lên xe an toàn.',
  'tham-da':
    'Người tưởng như hờ hững nhất lại thuộc lòng từng thói quen nhỏ khi em thức khuya ôn bài.',
  'tham-canh-tham':
    'Sự im lặng của hắn không phải là hết yêu, mà là nỗi ân hận chưa kịp nói thành lời.',
  'tham-hoai-can':
    'Chiếc áo khoác đặt sẵn trên ghế phụ xe lúc nào cũng là cỡ của em, dù miệng chẳng bao giờ nhận.',
  'mac-bac':
    'Danh nghĩa bạn thân chỉ là cái cớ để cậu đường hoàng xua hết những ánh mắt khác quanh em.',
  'tan-tram':
    'Giữa Bắc Kinh ồn ào, nơi duy nhất khiến thiếu gia ngông cuồng hạ giọng dỗ dành chỉ có trước mặt em.',
  'tan-hao-nhien':
    'Cậu đếm từng ngày em vô tư gọi mình là bạn thân, tự hỏi bao giờ mới thôi giả vờ bình thản.',
  'tram-uyen':
    'Điều khiến hắn sợ nhất không phải mất đi thể diện, mà là khoảnh khắc em thật sự không còn ngoái đầu.',
  'luc-tu-han':
    'Mỗi lần nhìn thấy người khác nắm tay em, ly rượu trên tay hắn lại siết chặt thêm một chút.',
  'luc-canh-vien':
    'Cậu học bá ban ngày giữ khoảng cách chỉ vì sợ bộ dạng bất cần ban đêm của mình làm em hoảng sợ.',
  'tieu-truong-uyen':
    'Dưới ánh nến cung đình lạnh lẽo, người duy nhất khiến quân vương dao động luôn là bóng hình nàng.',
  'diep-trach':
    'Giữa triều đình đầy mưu toan, khoảnh khắc hắn cười thật lòng nhất là lúc thấy em làm nũng.',
  'ta-mac-than':
    'Miệng thì trêu chọc không ngớt, nhưng lúc em gặp rắc rối luôn là người đứng chắn phía trước đầu tiên.',
  'ta-quan-han':
    'Oan gia ngõ hẹp hay không không biết, chỉ biết lịch hẹn của hắn luôn chừa sẵn chỗ cho em.',
  'doan-huyen-da':
    'Giữa màn đêm bất tử, nhịp tim duy nhất khiến hắn say mê lại là hơi ấm mỏng manh nơi em.',
  'tran-cong-vien':
    'Giữa đất Nam bộ xưa mưa nắng thất thường, anh giữ trọn một chiếc ô chờ người năm cũ.',
  'tran-dat-phong':
    'Ngoài mặt hung dữ là thế, nhưng chỉ cần mắt em đỏ hoe là mọi phòng tuyến của cậu đều sụp đổ.',
  'bui-tu-han':
    'Người ngoài nể sợ bao nhiêu thì về đến cửa nhà, anh lại ngoan ngoãn chờ em dỗ dành bấy nhiêu.',
  'pho-can-du':
    'Thái tử gia kiêu ngạo ngoài thương trường lại cam tâm xếp hàng mua món tráng miệng em thích.',
  'luc-tu-than':
    'Chuỗi tràng hạt trên cổ tay hắn xoay chậm mỗi đêm, giữ lại một góc bình yên mang tên em.',
  'tong-canh-ngon':
    'Từng câu nói vô tình đều được anh tính toán dịu dàng để kéo em lại gần hơn một bước.',
  'lang-van-triet':
    'Mùa tuyết rơi năm nào hắn chẳng đợi ai, cho đến ngày bóng dáng em bước qua cổng phủ.',
};

const FALLBACK_WHISPERS: string[] = [
  '“Có những tâm sự không viết trên trang hồ sơ, chỉ được giấu trong phong bì dấu sáp chờ đúng người mở ra.”',
  '“Đêm nay ánh đèn trong phòng trà vẫn sáng, đợi cậu gõ cửa thêm một lần nữa.”',
  '“Đằng sau câu thoại ngắn ngủi là cả một khoảng lặng chỉ dành riêng cho người chịu lắng nghe.”',
  '“Một cái chạm nhẹ vào dấu sáp cũng đủ đánh thức ký ức cũ giữa hai người.”',
];

function pickRandomEnvelopes(characters: CharacterItem[], count = 4): CharacterItem[] {
  if (characters.length <= count) return [...characters];
  const copy = [...characters];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function getSecretNoteForCharacter(char: CharacterItem, index: number): string {
  if (CHARACTER_WHISPER_SECRETS[char.id]) {
    return CHARACTER_WHISPER_SECRETS[char.id];
  }
  return FALLBACK_WHISPERS[index % FALLBACK_WHISPERS.length];
}

export const WhisperMailboxModal: React.FC<WhisperMailboxModalProps> = ({
  isOpen,
  characters,
  onInspectCharacter,
  onEnvelopeOpened,
  onClose,
}) => {
  const { activeTheme } = useSiteTheme();
  const [envelopes, setEnvelopes] = useState<CharacterItem[]>([]);
  const [openedId, setOpenedId] = useState<string | null>(null);
  const [openedHistoryIds, setOpenedHistoryIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;
    setEnvelopes(pickRandomEnvelopes(characters, 4));
    setOpenedId(null);
  }, [isOpen, characters]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playSoftTap('nav');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleClose = () => {
    playSoftTap('nav');
    onClose();
  };

  const handleShuffleEnvelopes = () => {
    playTarotSpreadChime();
    setEnvelopes(pickRandomEnvelopes(characters, 4));
    setOpenedId(null);
  };

  const handleOpenEnvelope = (char: CharacterItem) => {
    playSoftTap('card');
    setOpenedId(char.id);
    setOpenedHistoryIds((prev) => ({ ...prev, [char.id]: true }));
    onEnvelopeOpened?.();
  };

  const openedIndex = envelopes.findIndex((item) => item.id === openedId);
  const openedCharacter = openedIndex >= 0 ? envelopes[openedIndex] : null;
  const openedPrimaryName = openedCharacter
    ? openedCharacter.name.split(/\s+[—-]\s+/)[0]
    : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="whisper-mailbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="whisper-mailbox-title"
          onClick={handleClose}
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-[#050508]/86 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl my-auto rounded-[24px] bg-gradient-to-b from-[#171620] via-[#0E0E15] to-[#13111A] border border-[#D4AF37]/65 shadow-[0_24px_70px_rgba(0,0,0,0.92),0_0_40px_rgba(212,175,55,0.22)] p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 rounded-[18px] border border-[#D4AF37]/20"
            />

            <button
              type="button"
              onClick={handleClose}
              aria-label="Đóng Hộp Thư Thì Thầm"
              className="absolute top-3.5 right-3.5 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0B0B0F]/90 border border-[#D4AF37]/45 text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Header */}
            <div className="relative z-10 text-center pb-3.5 border-b border-[#D4AF37]/20 pr-8 pl-8">
              <p className="text-[10px] font-display tracking-[0.22em] uppercase text-[#D4AF37]">
                ✦ Phong Bì Dấu Sáp ✦
              </p>
              <h2
                id="whisper-mailbox-title"
                className="font-display text-2xl sm:text-[28px] font-semibold text-[#F3E5AB] mt-0.5"
              >
                Hộp Thư Thì Thầm
              </h2>
              <p className="text-xs text-[#B8B0A0] mt-1">
                Chạm vào một phong bì niêm phong dấu sáp để lắng nghe bí mật nhỏ từ nhân vật trong nhà.
              </p>
            </div>

            {/* Grid 4 phong bì dấu sáp */}
            <div className="relative z-10 mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {envelopes.map((char, idx) => {
                const isSelected = openedId === char.id;
                const wasOpened = Boolean(openedHistoryIds[char.id]);
                const shortName = char.name.split(/\s+[—-]\s+/)[0] || char.name;

                return (
                  <motion.button
                    key={`${char.id}-${idx}`}
                    type="button"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOpenEnvelope(char)}
                    aria-pressed={isSelected}
                    className={`group relative rounded-2xl border p-3 text-center flex flex-col items-center justify-between min-h-[136px] sm:min-h-[148px] transition-all cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'bg-[#1B1726] border-[#F3E5AB] shadow-[0_0_24px_rgba(212,175,55,0.32)]'
                        : 'bg-[#101018]/92 border-[#D4AF37]/35 hover:border-[#D4AF37]/80'
                    }`}
                  >
                    {/* Nắp phong bì hình tam giác nhẹ */}
                    <div
                      aria-hidden="true"
                      style={{
                        borderTopColor: isSelected
                          ? `${activeTheme.brightColor}55`
                          : `${activeTheme.accentColor}30`,
                      }}
                      className="pointer-events-none absolute top-0 left-0 right-0 h-10 border-b border-dashed border-[#D4AF37]/25 bg-gradient-to-b from-[#D4AF37]/12 to-transparent"
                    />

                    <span className="relative z-10 text-[10px] font-medium text-[#B8B0A0] tracking-wide">
                      Phong bì #{idx + 1}
                    </span>

                    {/* Dấu sáp niêm phong */}
                    <motion.div
                      animate={
                        isSelected
                          ? { scale: 1.08, rotate: -4 }
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.25 }}
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${activeTheme.waxOuter[0]}, ${activeTheme.waxOuter[1]} 45%, ${activeTheme.waxOuter[2]} 82%, ${activeTheme.waxOuter[3]})`,
                        boxShadow: isSelected
                          ? `0 0 18px ${activeTheme.accentColor}66`
                          : '0 6px 14px rgba(0,0,0,0.55)',
                      }}
                      className="relative z-10 my-2 w-12 h-12 rounded-full border border-white/25 flex items-center justify-center"
                    >
                      {isSelected ? (
                        <MailOpen
                          style={{ color: activeTheme.buttonTextColor }}
                          className="w-5 h-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <BlackCatMascot size={24} variant="badge" />
                      )}
                    </motion.div>

                    <div className="relative z-10 w-full">
                      <p className="text-xs font-semibold text-[#F3E5AB] truncate">
                        {wasOpened || isSelected ? shortName : 'Phong bì niêm phong'}
                      </p>
                      <p className="text-[10px] text-[#B8B0A0] mt-0.5 truncate">
                        {isSelected ? 'Đang mở thư' : wasOpened ? 'Đã bóc dấu sáp' : 'Chạm để mở'}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Lá thư mở ra bên dưới */}
            <AnimatePresence mode="wait">
              {openedCharacter ? (
                <motion.article
                  key={openedCharacter.id}
                  initial={{ opacity: 0, y: 14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 mt-4 rounded-2xl bg-[#0B0B0F]/90 border border-[#D4AF37]/50 p-4 sm:p-5 shadow-[0_14px_34px_rgba(0,0,0,0.75)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#D4AF37]/50 bg-[#121218] shrink-0">
                        <img
                          src={openedCharacter.avatar}
                          alt={openedPrimaryName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] tracking-widest uppercase text-[#D4AF37]">
                          Thì thầm từ dấu sáp
                        </p>
                        <h3 className="font-display text-lg sm:text-xl font-semibold text-[#F3E5AB] truncate">
                          {openedPrimaryName}
                        </h3>
                        <p className="text-[11px] text-[#B8B0A0] truncate">
                          {openedCharacter.tags.slice(0, 3).join(' · ')}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playSoftTap('card');
                        onClose();
                        onInspectCharacter(openedCharacter);
                      }}
                      className="shimmer-gold-btn inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-xs font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <UserRound className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Gõ cửa nhân vật</span>
                    </button>
                  </div>

                  <div className="mt-3.5 pt-3.5 border-t border-[#D4AF37]/20 space-y-2.5">
                    <blockquote className="font-display text-base sm:text-lg italic text-[#F3E5AB] leading-relaxed">
                      {openedCharacter.description}
                    </blockquote>
                    <p className="text-xs sm:text-[13px] text-[#DCD4C6] leading-relaxed">
                      <Sparkles
                        className="inline w-3.5 h-3.5 text-[#D4AF37] mr-1.5 -mt-0.5"
                        aria-hidden="true"
                      />
                      {getSecretNoteForCharacter(openedCharacter, openedIndex)}
                    </p>
                  </div>
                </motion.article>
              ) : (
                <motion.div
                  key="whisper-empty-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10 mt-4 rounded-2xl bg-[#0B0B0F]/65 border border-dashed border-[#D4AF37]/30 p-4 text-center text-xs text-[#B8B0A0]"
                >
                  Chọn một trong 4 phong bì niêm phong phía trên để bóc dấu sáp và đọc lời nhắn bí mật.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer action */}
            <div className="relative z-10 mt-4 flex items-center justify-between gap-2 pt-3 border-t border-[#D4AF37]/20">
              <button
                type="button"
                onClick={handleShuffleEnvelopes}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl bg-[#14121B] border border-[#D4AF37]/45 text-xs font-medium text-[#F3E5AB] hover:border-[#F3E5AB] hover:bg-[#D4AF37]/15 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span>Đổi xấp thư khác</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-xl bg-[#0B0B0F] border border-[#D4AF37]/35 text-xs font-medium text-[#DCD4C6] hover:border-[#D4AF37] hover:text-[#F3E5AB] transition-colors cursor-pointer"
              >
                Đóng hộp thư
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
