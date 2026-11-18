import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SERVICES, type ServiceItem } from '../data/studioData';
import type { ServiceId } from '../utils/booking';

interface ServicesSectionProps {
  onChooseService: (serviceId: ServiceId) => void;
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function ServicesSection({ onChooseService }: ServicesSectionProps) {
  const [activeId, setActiveId] = useState<ServiceId>('maquiagem');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const activeService: ServiceItem =
    SERVICES.find((item) => item.id === activeId) ?? SERVICES[0];

  const markImageFailed = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="servicos"
      aria-labelledby="servicos-heading"
      className="border-b border-[#3B2820]/10 bg-[#FAF6F1] text-[#241712]"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-24">
        {/* Estrutura fiel à faixa clara da referência: título empilhado à esquerda + faixa de cards fotográficos à direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-start">
          {/* Coluna Esquerda */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="lg:col-span-3 space-y-6 lg:sticky lg:top-24"
          >
            <div className="space-y-3">
              <p className="text-[12.5px] tracking-[0.06em] text-[#5E4A40] font-medium">
                Áreas de cuidado
              </p>
              <h2
                id="servicos-heading"
                className="font-serif text-[clamp(2.25rem,3.4vw,3rem)] leading-[1.04] font-normal text-[#241712]"
              >
                <span className="block">Nossos</span>
                <span className="block italic text-[#8E5B4F]">Cuidados</span>
                <span className="block">Essenciais</span>
              </h2>
            </div>

            <p className="text-[14.5px] leading-[1.65] text-[#5E4A40] max-w-[28ch]">
              Três áreas pensadas para valorizar sua beleza natural, sem excessos.
            </p>

            {/* Seletor conectado entre áreas */}
            <div
              role="tablist"
              aria-label="Selecionar área de cuidado em destaque"
              className="flex flex-col gap-1.5 pt-2"
            >
              {SERVICES.map((service) => {
                const isSelected = service.id === activeId;
                return (
                  <button
                    key={service.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`servico-destaque-${service.id}`}
                    onClick={() => setActiveId(service.id)}
                    className={`min-h-[42px] px-3.5 py-2 rounded-sm text-left text-[13.5px] font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#241712] text-[#FAF6F1]'
                        : 'text-[#5E4A40] hover:bg-[#EFE6DA] hover:text-[#241712]'
                    }`}
                  >
                    <span>
                      <span className="tabular-nums mr-2 opacity-75">{service.index}</span>
                      {service.name}
                    </span>
                    <span className="w-6 h-px bg-current opacity-50" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Coluna Direita: 3 cartões fotográficos com scrim inferior + descrição e ação direta */}
          <div className="lg:col-span-9 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {SERVICES.map((service, index) => {
                const isActive = service.id === activeId;
                return (
                  <motion.article
                    key={service.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.08, ease: EASE_OUT_EXPO }}
                    className={`group flex flex-col justify-between rounded-sm overflow-hidden border transition-all duration-200 bg-[#FFFDF9] ${
                      isActive
                        ? 'border-[#3B2820]/45 shadow-sm'
                        : 'border-[#3B2820]/12 hover:border-[#3B2820]/30'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(service.id)}
                      aria-label={`Ver detalhes de ${service.name}`}
                      className="relative w-full text-left aspect-[3/4] overflow-hidden bg-[#EFE6DA] cursor-pointer focus-visible:outline-offset-[-3px]"
                    >
                      {!failedImages[service.id] ? (
                        <img
                          src={service.image}
                          alt={service.imageAlt}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={() => markImageFailed(service.id)}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-6 text-[#5E4A40] font-serif italic text-xl">
                          {service.name}
                        </div>
                      )}

                      {/* Scrim inferior inspirado na referência com título centralizado */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1A100C]/90 via-[#1A100C]/45 to-transparent"
                      />

                      <div className="absolute inset-x-0 bottom-0 p-5 text-center space-y-1">
                        <p className="text-[11px] tracking-[0.14em] text-[#D9AEA2] tabular-nums">
                          {service.index} · {service.kicker}
                        </p>
                        <h3 className="font-serif text-[26px] leading-tight font-normal text-[#FAF6F1]">
                          {service.name}
                        </h3>
                      </div>
                    </button>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <p className="text-[13.5px] leading-[1.6] text-[#5E4A40]">
                        {service.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => onChooseService(service.id)}
                        className="w-full min-h-[44px] px-4 py-2.5 inline-flex items-center justify-between text-[13px] font-medium text-[#241712] bg-[#EFE6DA] hover:bg-[#C89A8E] rounded-sm transition-colors duration-200 cursor-pointer"
                      >
                        <span>{service.ctaLabel}</span>
                        <ArrowRight
                          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Faixa conectada de destaque sincronizado */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                id={`servico-destaque-${activeService.id}`}
                role="tabpanel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                className="p-6 sm:p-7 rounded-sm bg-[#EFE6DA]/65 border border-[#3B2820]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="space-y-1.5 max-w-xl">
                  <p className="text-[12px] text-[#5E4A40] tabular-nums">
                    {activeService.index} · {activeService.name}
                  </p>
                  <p className="font-serif text-[22px] leading-snug text-[#241712]">
                    {activeService.focusNote}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onChooseService(activeService.id)}
                  className="inline-flex items-center justify-center gap-2.5 min-h-[46px] px-6 py-3 text-[13.5px] font-semibold text-[#FAF6F1] bg-[#241712] hover:bg-[#3B2820] rounded-sm transition-colors shrink-0 cursor-pointer"
                >
                  <span>{activeService.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
