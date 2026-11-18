import { useState } from 'react';
import { motion } from 'motion/react';
import { ESSENCE_MEDIA } from '../data/studioData';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function EssenceSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      id="essencia"
      aria-labelledby="essencia-heading"
      className="relative overflow-hidden bg-[#1A100C] text-[#FAF6F1] border-t border-[#FAF6F1]/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Coluna Esquerda: Texto sobre naturalidade e expressão pessoal */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="lg:col-span-5 relative z-10 px-5 sm:px-8 lg:pl-14 xl:pl-24 py-14 sm:py-20 lg:py-24 flex flex-col justify-center space-y-6"
        >
          <p className="text-[12.5px] tracking-[0.08em] text-[#D9AEA2] font-medium">
            A essência do cuidado
          </p>

          <h2
            id="essencia-heading"
            className="font-serif text-[clamp(2.2rem,3.6vw,3.15rem)] leading-[1.06] font-normal text-[#FAF6F1] text-balance"
          >
            Naturalidade.
            <span className="block text-[#D9AEA2]">Expressão.</span>
            Cuidado.
          </h2>

          <div className="space-y-4 text-[15px] leading-[1.7] text-[#E4D6C5] max-w-[42ch]">
            <p>
              Cada atendimento parte da observação atenta dos seus traços, do seu conforto e da forma como você gosta de se ver no espelho.
            </p>
            <p>
              Mais do que seguir padrões prontos, o foco está na leveza, na expressão pessoal e nos pequenos detalhes que fazem o resultado parecer verdadeiramente seu.
            </p>
          </div>

          <p className="pt-2 font-serif italic text-[22px] text-[#D9AEA2]">
            Sua beleza, com a sua essência.
          </p>
        </motion.div>

        {/* Coluna Direita: Fotografia editorial em largura total com fusão lateral */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
          className="lg:col-span-7 relative min-h-[320px] sm:min-h-[400px] lg:min-h-[500px] bg-[#241712] overflow-hidden"
        >
          {!imageError ? (
            <img
              src={ESSENCE_MEDIA.src}
              alt={ESSENCE_MEDIA.alt}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover lg:absolute lg:inset-0 transition-transform duration-700 ease-out hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8 text-[#E4D6C5] font-serif italic text-xl">
              Cuidado nos detalhes
            </div>
          )}

          {/* Fusão gradual com o bloco café esquerdo */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#1A100C] via-[#1A100C]/35 to-transparent"
          />
          <div
            aria-hidden="true"
            className="lg:hidden absolute inset-0 bg-gradient-to-b from-[#1A100C] via-transparent to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
