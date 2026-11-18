import { useState } from 'react';
import { ArrowRight, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { CONTACT_CONFIG } from '../config/contact';
import { HERO_MEDIA } from '../data/studioData';

interface HeroProps {
  onStartBooking: () => void;
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const HERO_PILLARS = [
  { title: 'Beleza natural', detail: 'Acabamento leve' },
  { title: 'Traços respeitados', detail: 'Expressão autêntica' },
  { title: 'Cuidado nos detalhes', detail: 'Atenção calma' },
] as const;

export function Hero({ onStartBooking }: HeroProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      id="topo"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#1E1410] text-[#FAF6F1]"
    >
      {/* Fotografia de fundo posicionada à direita com fusão suave para a esquerda (referência estrutural) */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-[60%] relative min-h-[340px] sm:min-h-[420px] lg:min-h-full overflow-hidden bg-[#2B1D17]">
        {!imageError ? (
          <motion.img
            src={HERO_MEDIA.src}
            alt={HERO_MEDIA.alt}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.95, ease: EASE_OUT_EXPO }}
            className="w-full h-full object-cover object-[center_22%]"
          />
        ) : (
          <div className="w-full h-full min-h-[340px] flex items-end p-8 bg-[#2B1D17] text-[#E4D6C5]">
            <p className="font-serif italic text-xl">
              Angelica Lamounier Beauty — Beleza natural
            </p>
          </div>
        )}

        {/* Scrim direcional para legibilidade e fusão suave */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#1E1410] via-[#1E1410]/45 to-transparent"
        />
        <div
          aria-hidden="true"
          className="lg:hidden absolute inset-0 bg-gradient-to-t from-[#1E1410] via-[#1E1410]/30 to-transparent"
        />
      </div>

      {/* Conteúdo editorial em primeiro plano */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8 pt-6 pb-14 lg:pt-20 lg:pb-20">
        <div className="max-w-xl space-y-8">
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE_OUT_EXPO }}
            className="font-serif text-[clamp(2.9rem,6vw,5.1rem)] leading-[0.98] tracking-[-0.02em] font-normal text-[#FAF6F1] text-balance"
          >
            <span className="block">Sua beleza,</span>
            <span className="block">com a sua</span>
            <span className="block italic text-[#D9AEA2] pt-1">essência.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease: EASE_OUT_EXPO }}
            className="text-[15.5px] sm:text-[17px] leading-[1.65] text-[#E4D6C5] max-w-[40ch]"
          >
            Maquiagem, sobrancelhas e unhas para valorizar o que faz você ser você.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: EASE_OUT_EXPO }}
            className="flex flex-wrap items-center gap-4 pt-1"
          >
            <button
              type="button"
              onClick={onStartBooking}
              className="inline-flex items-center gap-3 min-h-[48px] px-7 py-3.5 text-[14px] font-semibold tracking-[0.02em] text-[#241712] bg-[#C89A8E] rounded-sm transition-all duration-200 hover:bg-[#D9AEA2] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Quero agendar meu momento</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <a
              href="#servicos"
              className="inline-flex items-center min-h-[44px] px-2 py-2 text-[13.5px] font-medium text-[#E4D6C5] border-b border-[#D9AEA2]/40 hover:text-[#FAF6F1] hover:border-[#D9AEA2] transition-colors whitespace-nowrap shrink-0"
            >
              Conhecer os serviços
            </a>
          </motion.div>

          {/* 3 pilares horizontais no rodapé do Hero esquerdo (estrutura da referência) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.34, ease: EASE_OUT_EXPO }}
            className="pt-8 mt-4 border-t border-[#FAF6F1]/12 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg"
          >
            {HERO_PILLARS.map((pillar) => (
              <div key={pillar.title} className="space-y-1">
                <p className="font-serif text-[17px] sm:text-[18px] leading-snug text-[#FAF6F1]">
                  {pillar.title}
                </p>
                <p className="text-[12px] text-[#E4D6C5]/80">{pillar.detail}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Trilha social lateral discreta em telas grandes */}
        <div className="hidden xl:flex flex-col items-center gap-3 absolute right-8 bottom-12">
          <a
            href={CONTACT_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram oficial @angelicalamounier_beauty"
            className="w-10 h-10 rounded-full border border-[#FAF6F1]/25 bg-[#1E1410]/65 backdrop-blur-xs flex items-center justify-center text-[#FAF6F1] hover:border-[#D9AEA2] hover:text-[#D9AEA2] transition-colors"
          >
            <Instagram className="w-4 h-4" aria-hidden="true" />
          </a>
          <span className="w-px h-10 bg-[#FAF6F1]/25" aria-hidden="true" />
          <span className="text-[11px] tracking-[0.14em] text-[#E4D6C5] [writing-mode:vertical-rl]">
            Instagram
          </span>
        </div>
      </div>
    </section>
  );
}
