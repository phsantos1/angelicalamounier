import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { STYLE_GUIDE_TOKENS } from '../data/studioData';

interface StyleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function StyleGuideModal({ isOpen, onClose }: StyleGuideModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="style-guide-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 bg-[#241712]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className="w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-[#FAF6F1] rounded-sm border border-[#3B2820]/15 shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#FAF6F1]/95 backdrop-blur-xs border-b border-[#3B2820]/10">
              <div>
                <p className="text-[12px] text-[#5E4A40]">Sistema visual</p>
                <h2
                  id="style-guide-title"
                  className="font-serif text-[26px] leading-tight text-[#241712]"
                >
                  Guia de Estilo — Angelica Lamounier Beauty
                </h2>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Fechar guia de estilo"
                className="inline-flex items-center justify-center w-11 h-11 text-[#241712] hover:bg-[#EFE6DA] rounded-sm transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-10">
              {/* Paleta */}
              <section className="space-y-4">
                <h3 className="font-serif text-[22px] text-[#241712]">
                  1. Paleta Cromática (60 · 30 · 10)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {STYLE_GUIDE_TOKENS.colors.map((swatch) => (
                    <div
                      key={swatch.hex}
                      className="flex items-center gap-3.5 p-3 rounded-sm bg-[#FFFDF9] border border-[#3B2820]/10"
                    >
                      <span
                        className="w-11 h-11 rounded-sm border border-[#3B2820]/15 shrink-0"
                        style={{ backgroundColor: swatch.hex }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-medium text-[#241712] truncate">
                          {swatch.name}
                        </p>
                        <p className="text-[12px] text-[#5E4A40] tabular-nums">
                          {swatch.hex} · {swatch.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tipografia */}
              <section className="space-y-4 pt-6 border-t border-[#3B2820]/10">
                <h3 className="font-serif text-[22px] text-[#241712]">
                  2. Tipografia Editorial
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {STYLE_GUIDE_TOKENS.typography.map((item, idx) => (
                    <div
                      key={item.family}
                      className="p-4 rounded-sm bg-[#FFFDF9] border border-[#3B2820]/10 space-y-2"
                    >
                      <p className="text-[12px] text-[#5E4A40]">{item.role}</p>
                      <p
                        className={
                          idx === 0
                            ? 'font-serif text-[28px] leading-tight text-[#241712]'
                            : 'font-sans text-[18px] font-medium text-[#241712]'
                        }
                      >
                        {item.family}
                      </p>
                      <p className="text-[13px] leading-[1.6] text-[#5E4A40]">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Diretrizes de Direção de Arte */}
              <section className="space-y-3 pt-6 border-t border-[#3B2820]/10">
                <h3 className="font-serif text-[22px] text-[#241712]">
                  3. Direção de Arte & Tom de Voz
                </h3>
                <ul className="space-y-2.5 text-[14px] leading-[1.65] text-[#3B2820]">
                  {STYLE_GUIDE_TOKENS.principles.map((rule) => (
                    <li
                      key={rule}
                      className="p-3.5 rounded-sm bg-[#EFE6DA]/60 border border-[#3B2820]/10"
                    >
                      {rule}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
