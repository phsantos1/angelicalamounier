import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FAQ_ITEMS } from '../data/studioData';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section
      id="duvidas"
      aria-labelledby="faq-heading"
      className="border-b border-[#3B2820]/10 bg-[#FFFDF9]"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="lg:col-span-4 space-y-3"
          >
            <p className="text-[13px] tracking-[0.05em] text-[#5E4A40] font-medium">
              Perguntas frequentes
            </p>
            <h2
              id="faq-heading"
              className="font-serif text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.12] font-normal text-[#241712] text-balance"
            >
              Dúvidas sobre solicitação e contato.
            </h2>
          </motion.div>

          <div className="lg:col-span-8 divide-y divide-[#3B2820]/12 border-t border-b border-[#3B2820]/12">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              const panelId = `${item.id}-panel`;
              const buttonId = `${item.id}-button`;

              return (
                <div key={item.id}>
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="w-full min-h-[56px] py-5 flex items-center justify-between gap-6 text-left text-[#241712] hover:text-[#5E4A40] transition-colors cursor-pointer"
                    >
                      <span className="font-serif text-[22px] leading-[1.25] font-normal">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 text-[#5E4A40] transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-[15px] leading-[1.7] text-[#5E4A40] max-w-[62ch]">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
