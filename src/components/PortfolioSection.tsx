import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  PORTFOLIO_ITEMS,
  type PortfolioCategory,
  type PortfolioItem,
} from '../data/studioData';

const FILTERS: { id: PortfolioCategory; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'maquiagem', label: 'Maquiagem' },
  { id: 'sobrancelhas', label: 'Sobrancelhas' },
  { id: 'unhas', label: 'Unhas' },
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('todos');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const filteredItems =
    activeCategory === 'todos'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  const activeItem: PortfolioItem | null =
    selectedIndex !== null ? filteredItems[selectedIndex] ?? null : null;

  useEffect(() => {
    if (selectedIndex === null) return;

    const timer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedIndex(null);
        window.requestAnimationFrame(() => {
          triggerRef.current?.focus();
        });
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredItems.length,
        );
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredItems.length) % filteredItems.length,
        );
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedIndex, filteredItems.length]);

  const closeLightbox = () => {
    setSelectedIndex(null);
    window.requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  const handleOpenItem = (index: number, buttonEl: HTMLButtonElement) => {
    triggerRef.current = buttonEl;
    setSelectedIndex(index);
  };

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="border-b border-[#3B2820]/10 bg-[#EFE6DA]/55"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#3B2820]/10"
        >
          <div className="space-y-3 max-w-2xl">
            <p className="text-[13px] tracking-[0.05em] text-[#5E4A40] font-medium">
              Portfólio & Referências visuais
            </p>
            <h2
              id="portfolio-heading"
              className="font-serif text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-normal text-[#241712] text-balance"
            >
              Estética suave, pele real e acabamento atemporal.
            </h2>
            <p className="text-[14px] leading-[1.6] text-[#5E4A40] max-w-[58ch]">
              As fotografias abaixo são imagens conceituais ilustrativas da direção estética do estúdio, sem atribuição de atendimentos reais até o envio de registros autorizados.
            </p>
          </div>

          {/* Filtros interativos */}
          <div
            role="group"
            aria-label="Filtrar galeria por categoria"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EFE6DA] rounded-sm self-start lg:self-auto"
          >
            {FILTERS.map((filter) => {
              const isSelected = activeCategory === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setActiveCategory(filter.id);
                    setSelectedIndex(null);
                  }}
                  className={`relative min-h-[40px] px-4 py-2 text-[13px] font-medium rounded-sm transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'text-[#241712]'
                      : 'text-[#5E4A40] hover:text-[#241712]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="portfolio-filter-indicator"
                      transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                      className="absolute inset-0 bg-[#FFFDF9] rounded-sm shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Grade assimétrica editorial */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10 items-start">
          <AnimatePresence mode="sync">
            {filteredItems.map((item, idx) => (
              <motion.figure
                key={item.id}
                layout="position"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                className={`group flex flex-col ${
                  idx % 3 === 1 ? 'lg:mt-8' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => handleOpenItem(idx, e.currentTarget)}
                  aria-label={`Ampliar imagem ilustrativa: ${item.title} (${item.categoryLabel})`}
                  className="relative w-full text-left overflow-hidden rounded-sm bg-[#EFE6DA] focus-visible:outline-2 focus-visible:outline-[#3B2820] cursor-pointer"
                >
                  <div className={`${item.aspectClass} w-full overflow-hidden`}>
                    {!failedImages[item.id] ? (
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                        }
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-6 text-[#5E4A40] font-serif italic text-xl">
                        {item.title}
                      </div>
                    )}
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-sm bg-[#FAF6F1]/90 text-[#241712] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 shadow-xs"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </button>

                <figcaption className="mt-3.5 space-y-1">
                  <div className="flex items-center gap-2 text-[12px] text-[#5E4A40]">
                    <span>{item.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>Imagem ilustrativa</span>
                  </div>
                  <p className="font-serif text-[21px] leading-[1.25] text-[#241712]">
                    {item.title}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox acessível com controle e devolução de foco */}
      <AnimatePresence>
        {activeItem && selectedIndex !== null && (
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            aria-describedby="lightbox-caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeLightbox();
              }
            }}
            className="fixed inset-0 z-50 bg-[#241712]/88 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.16, ease: EASE_OUT_EXPO }}
              className="relative w-full max-w-4xl bg-[#FAF6F1] rounded-sm overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#3B2820]/10">
                <div className="flex items-center gap-2 text-[12px] text-[#5E4A40] tabular-nums">
                  <span>{activeItem.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>Imagem conceitual ilustrativa</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {selectedIndex + 1} / {filteredItems.length}
                  </span>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Fechar ampliação da imagem"
                  className="inline-flex items-center justify-center w-11 h-11 text-[#241712] hover:bg-[#EFE6DA] rounded-sm transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-8 bg-[#EFE6DA] flex items-center justify-center max-h-[68vh] overflow-hidden">
                  <img
                    src={activeItem.image}
                    alt={activeItem.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full max-h-[68vh] object-contain"
                  />
                </div>

                <div className="md:col-span-4 p-6 flex flex-col justify-between bg-[#FAF6F1]">
                  <div className="space-y-3">
                    <h3
                      id="lightbox-title"
                      className="font-serif text-[26px] leading-[1.15] text-[#241712]"
                    >
                      {activeItem.title}
                    </h3>
                    <p
                      id="lightbox-caption"
                      className="text-[14px] leading-[1.6] text-[#5E4A40]"
                    >
                      {activeItem.caption}
                    </p>
                  </div>

                  {filteredItems.length > 1 && (
                    <div className="pt-6 mt-6 border-t border-[#3B2820]/10 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedIndex(
                            (selectedIndex - 1 + filteredItems.length) %
                              filteredItems.length,
                          )
                        }
                        aria-label="Imagem anterior"
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-[13px] font-medium text-[#241712] bg-[#EFE6DA] hover:bg-[#E4D6C5] rounded-sm transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                        <span>Anterior</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedIndex(
                            (selectedIndex + 1) % filteredItems.length,
                          )
                        }
                        aria-label="Próxima imagem"
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-[13px] font-medium text-[#241712] bg-[#EFE6DA] hover:bg-[#E4D6C5] rounded-sm transition-colors cursor-pointer"
                      >
                        <span>Próxima</span>
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
