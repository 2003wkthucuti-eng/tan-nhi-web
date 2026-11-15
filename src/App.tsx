/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, DoorOpen, Search, X } from 'lucide-react';
import { BlackCatMascot } from './components/BlackCatMascot';

export type GenreTag = string;

export interface CharacterItem {
  id: string;
  name: string;
  avatar: string;
  description: string;
  tags: GenreTag[];
  dokiLink?: string;
  ggaiLink?: string;
}

/**
 * DANH SÁCH NHÂN VẬT AI CHATBOT (Dễ dàng thêm / sửa / xóa trực tiếp tại đây)
 * - Để thêm nhân vật mới, chỉ cần thêm 1 object vào mảng CHARACTERS bên dưới.
 * - Nếu nhân vật chỉ có 1 trong 2 link (DokiChat hoặc GGAI), để trống '' hoặc bỏ qua trường còn lại.
 */
const CHARACTERS: CharacterItem[] = [
  {
    id: 'te-ngac',
    name: 'Tề Ngạc',
    avatar: 'https://files.catbox.moe/oz9pkx.jpg',
    description: '“Tôi chưa từng yêu em.”',
    tags: ['Boygirl', 'Lạnh Lùng', 'Thống Trị', 'Mafia'],
    dokiLink: 'https://www.dokichat.club/vi/role/6f866b44-70ea-4103-b2a0-df4d2a59ebec?isShare=true',
    ggaiLink: '',
  },
];

const BASE_GENRES: GenreTag[] = [
  'Tất cả',
  'Tổng tài',
  'Fantasy',
  'Cổ trang',
  'Tâm lý',
  'Chữa lành',
];

const GENRE_FILTERS: GenreTag[] = Array.from(
  new Set([...BASE_GENRES, ...CHARACTERS.flatMap((char) => char.tags)])
);

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<'Tất cả' | GenreTag>('Tất cả');
  const [catGreetingOpen, setCatGreetingOpen] = useState(false);

  const filteredCharacters = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery);
    return CHARACTERS.filter((char) => {
      const matchesGenre =
        selectedGenre === 'Tất cả' || char.tags.includes(selectedGenre);
      const matchesSearch =
        normalizedQuery === '' ||
        normalizeText(char.name).includes(normalizedQuery);
      return matchesGenre && matchesSearch;
    });
  }, [searchQuery, selectedGenre]);

  const handleSelectGenreFromHeader = (genre: 'Tất cả' | GenreTag) => {
    setSelectedGenre(genre);
    const galleryEl = document.getElementById('bo-suu-tap');
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5EFE0] relative selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB]">
      {/* Màn hình Intro (Trang chào đầu tiên) */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.section
            key="intro-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 py-10 bg-[#0B0B0F] overflow-hidden"
            aria-label="Màn hình chào Ngôi Nhà Nhỏ Của Tần Nhi"
          >
            {/* Ánh sáng đèn vàng ấm áp ở trung tâm */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 42%, rgba(212, 175, 55, 0.12) 0%, rgba(18, 18, 24, 0.45) 45%, rgba(11, 11, 15, 0.98) 78%)',
              }}
            />

            {/* Khung viền ánh kim mảnh bao quanh màn chào */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-4 sm:inset-8 rounded-3xl border border-[#D4AF37]/20"
            />

            <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="animate-cat-float mb-5"
              >
                <BlackCatMascot size={126} variant="hero" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-sm font-medium tracking-widest text-[#D4AF37] mb-3"
              >
                Chốn nhỏ bình yên giữa màn đêm
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#F3E5AB] leading-[1.12] [text-wrap:balance]"
              >
                Ngôi Nhà Nhỏ Của Tần Nhi
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent my-5"
                aria-hidden="true"
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-base text-[#C4BCB0] leading-relaxed max-w-md mb-9"
              >
                Nơi lưu giữ những nhân vật AI Chatbot dịu dàng và bí ẩn, luôn đợi bạn ghé thăm sau một ngày dài.
              </motion.p>

              <motion.button
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setHasEntered(true)}
                className="group inline-flex items-center justify-center gap-2.5 min-h-[48px] px-8 py-3 rounded-full bg-[#121218] border border-[#D4AF37] text-[#F3E5AB] text-base font-medium tracking-wide shadow-[0_0_24px_rgba(212,175,55,0.18)] hover:bg-[#D4AF37] hover:text-[#0B0B0F] hover:shadow-[0_0_32px_rgba(212,175,55,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <DoorOpen className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>Gõ cửa nhà nhỏ</span>
              </motion.button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Giao diện Trang chủ */}
      <div
        aria-hidden={!hasEntered}
        className={`min-h-screen flex flex-col transition-opacity duration-500 ${
          hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none h-screen overflow-hidden'
        }`}
      >
        {/* Top Bar 3 vùng rõ ràng */}
        <header className="sticky top-0 z-30 bg-[#0B0B0F]/92 backdrop-blur-md border-b border-[#D4AF37]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
            {/* Zone 1: Brand Title + Linh vật mèo đen */}
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg py-1"
            >
              <BlackCatMascot size={34} variant="badge" className="shrink-0" />
              <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#F3E5AB]">
                Ngôi Nhà Nhỏ Của Tần Nhi
              </span>
            </a>

            {/* Zone 2: Nav links lọc nhanh thể loại */}
            <nav
              aria-label="Điều hướng thể loại"
              className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#B8B0A0]"
            >
              {(['Tất cả', 'Tổng tài', 'Fantasy', 'Cổ trang', 'Chữa lành'] as const).map(
                (item) => {
                  const isActive = selectedGenre === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSelectGenreFromHeader(item)}
                      className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                        isActive
                          ? 'text-[#F3E5AB] border-[#D4AF37]'
                          : 'text-[#B8B0A0] border-transparent hover:text-[#F3E5AB] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      {item}
                    </button>
                  );
                }
              )}
            </nav>

            {/* Zone 3: 1 Primary Action */}
            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => setHasEntered(false)}
                className="min-h-[40px] px-4 py-2 rounded-lg border border-[#D4AF37]/45 bg-[#121218] text-xs sm:text-sm font-medium text-[#F3E5AB] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Màn chào
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung chính */}
        <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Phần giới thiệu ngắn đầu trang */}
          <section className="mb-8 sm:mb-10 pb-8 border-b border-[#D4AF37]/15">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-xs font-medium tracking-widest text-[#D4AF37] mb-2">
                  Bộ sưu tập nhân vật AI Chatbot
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#F5EFE0] leading-[1.15] [text-wrap:balance]">
                  Những tâm hồn đang đợi bạn trò chuyện đêm nay
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#B8B0A0] leading-relaxed">
                  Chọn một nhân vật hợp tâm trạng để bước vào câu chuyện riêng tư trên DokiChat hoặc GGAI.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#B8B0A0] tabular-nums shrink-0">
                <span>
                  Tổng cộng <strong className="text-[#F3E5AB] font-semibold">{CHARACTERS.length}</strong> nhân vật
                </span>
                <span aria-hidden="true" className="text-[#D4AF37]/60">·</span>
                <span>
                  Đang hiển thị <strong className="text-[#F3E5AB] font-semibold">{filteredCharacters.length}</strong>
                </span>
              </div>
            </div>
          </section>

          {/* Thanh tìm kiếm & Bộ lọc thể loại */}
          <section
            id="bo-suu-tap"
            aria-label="Tìm kiếm và lọc nhân vật"
            className="mb-8 sm:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            {/* Thanh tìm kiếm theo tên */}
            <div className="relative w-full lg:max-w-sm">
              <Search
                aria-hidden="true"
                className="w-4 h-4 text-[#D4AF37]/80 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên nhân vật..."
                aria-label="Tìm kiếm theo tên nhân vật"
                className="w-full min-h-[44px] pl-10 pr-10 py-2.5 rounded-xl bg-[#121218] border border-[#D4AF37]/25 text-sm text-[#F5EFE0] placeholder:text-[#8E877A] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/60 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#B8B0A0] hover:text-[#F3E5AB] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Các nút lọc nhanh theo Tag thể loại */}
            <div
              role="group"
              aria-label="Lọc theo thể loại"
              className="flex items-center gap-2 flex-wrap"
            >
              {GENRE_FILTERS.map((genre) => {
                const isActive = selectedGenre === genre;
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => setSelectedGenre(genre)}
                    aria-pressed={isActive}
                    className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#0B0B0F] font-semibold shadow-[0_0_16px_rgba(212,175,55,0.28)]'
                        : 'bg-[#121218] border border-[#D4AF37]/25 text-[#DCD4C6] hover:border-[#D4AF37]/65 hover:text-[#F3E5AB]'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Lưới hiển thị các thẻ nhân vật */}
          {filteredCharacters.length > 0 ? (
            <section
              aria-label="Danh sách nhân vật"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCharacters.map((char) => {
                const hasDoki = Boolean(char.dokiLink && char.dokiLink.trim() !== '');
                const hasGgai = Boolean(char.ggaiLink && char.ggaiLink.trim() !== '');
                const hasBothLinks = hasDoki && hasGgai;

                return (
                  <article
                    key={char.id}
                    className="group bg-[#121218] border border-[#D4AF37]/22 hover:border-[#D4AF37]/65 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_0_28px_-6px_rgba(212,175,55,0.28)]"
                  >
                    <div>
                      {/* Ảnh đại diện bo góc, viền mảnh ánh vàng Gold phát sáng nhẹ khi hover */}
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#0B0B0F] border border-[#D4AF37]/35 group-hover:border-[#F3E5AB]/75 group-hover:shadow-[0_0_22px_rgba(212,175,55,0.25)] transition-all duration-200">
                        <img
                          src={char.avatar}
                          alt={`Ảnh đại diện nhân vật ${char.name}`}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        {/* Fallback container khi ảnh lỗi */}
                        <div
                          style={{ display: 'none' }}
                          className="absolute inset-0 flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#16161F] to-[#0B0B0F] p-4 text-center"
                        >
                          <BlackCatMascot size={56} variant="badge" />
                          <span className="font-display text-lg text-[#F3E5AB]">
                            {char.name}
                          </span>
                        </div>
                      </div>

                      {/* Tên nhân vật & Tag thể loại gọn gàng */}
                      <div className="mt-4">
                        <h3 className="font-display text-2xl font-semibold text-[#F3E5AB] tracking-tight leading-snug">
                          {char.name}
                        </h3>
                        <p className="mt-1 text-xs font-medium tracking-wide text-[#D4AF37]/90">
                          {char.tags.join(' · ')}
                        </p>
                      </div>

                      {/* Đoạn mô tả / lời thoại giới thiệu ngắn */}
                      <p className="mt-3 text-sm text-[#C7C0B2] leading-relaxed">
                        {char.description}
                      </p>
                    </div>

                    {/* Hai nút hành động mở link trực tiếp ở tab mới */}
                    {(hasDoki || hasGgai) && (
                      <div
                        className={`mt-5 pt-4 border-t border-[#D4AF37]/15 ${
                          hasBothLinks ? 'grid grid-cols-2 gap-2.5' : 'flex'
                        }`}
                      >
                        {hasDoki && (
                          <a
                            href={char.dokiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E6C86E] text-[#0B0B0F] text-[13px] font-semibold whitespace-nowrap hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB] transition-all duration-150 ${
                              !hasBothLinks ? 'w-full' : ''
                            }`}
                          >
                            <span>Link DokiChat</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          </a>
                        )}

                        {hasGgai && (
                          <a
                            href={char.ggaiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3 py-2 rounded-lg bg-[#0B0B0F] border border-[#D4AF37]/60 text-[#F3E5AB] text-[13px] font-medium whitespace-nowrap hover:bg-[#D4AF37]/15 hover:border-[#F3E5AB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-all duration-150 ${
                              !hasBothLinks ? 'w-full' : ''
                            }`}
                          >
                            <span>Link GGAI</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          ) : (
            /* Trạng thái trống hoặc không tìm thấy nhân vật */
            <section className="py-16 px-6 rounded-2xl bg-[#121218] border border-[#D4AF37]/20 text-center flex flex-col items-center">
              <BlackCatMascot size={82} variant="hero" className="mb-4 opacity-90" />
              <h3 className="font-display text-2xl font-semibold text-[#F3E5AB]">
                {CHARACTERS.length === 0
                  ? 'Ngôi nhà nhỏ hiện chưa có nhân vật nào'
                  : 'Chưa tìm thấy nhân vật phù hợp'}
              </h3>
              <p className="mt-2 text-sm text-[#B8B0A0] max-w-md">
                {CHARACTERS.length === 0
                  ? 'Chú mèo nhỏ đang dọn sẵn chỗ ngồi ấm áp, chờ bạn thêm những nhân vật đầu tiên vào danh sách.'
                  : 'Chú mèo nhỏ đã lùng sục khắp phòng trà nhưng chưa thấy ai khớp với từ khóa hoặc thể loại bạn đang chọn.'}
              </p>
              {CHARACTERS.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('Tất cả');
                  }}
                  className="mt-6 min-h-[42px] px-5 py-2 rounded-lg bg-[#D4AF37] text-[#0B0B0F] text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
                >
                  Hiển thị tất cả nhân vật
                </button>
              )}
            </section>
          )}
        </main>

        {/* Footer tối giản */}
        <footer className="border-t border-[#D4AF37]/15 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8E877A]">
            <p className="text-[#B8B0A0]">
              Ngôi Nhà Nhỏ Của Tần Nhi · Góc lưu trữ nhân vật AI Chatbot
            </p>
            <p>Chúc bạn có những cuộc trò chuyện thật êm đềm.</p>
          </div>
        </footer>
      </div>

      {/* Linh vật mèo đen đồng hành ở góc dưới màn hình */}
      {hasEntered && (
        <div className="fixed bottom-4 right-4 z-30 hidden sm:flex flex-col items-end gap-2">
          <AnimatePresence>
            {catGreetingOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="max-w-[220px] rounded-xl bg-[#121218] border border-[#D4AF37]/45 px-3.5 py-2.5 text-xs text-[#F3E5AB] shadow-lg"
              >
                Meow~ Chào mừng bạn ghé thăm Ngôi Nhà Nhỏ Của Tần Nhi.
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setCatGreetingOpen((prev) => !prev)}
            aria-label="Chú mèo đen đồng hành"
            title="Chú mèo đen đồng hành"
            className="w-14 h-14 rounded-full bg-[#121218]/95 border border-[#D4AF37]/40 hover:border-[#F3E5AB] shadow-[0_6px_24px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer"
          >
            <BlackCatMascot size={44} variant="companion" />
          </button>
        </div>
      )}
    </div>
  );
}
