import { useRef } from 'react';
import { Instagram, Palette } from 'lucide-react';
import { CONTACT_CONFIG } from '../config/contact';

interface FooterProps {
  onOpenStyleGuide: (triggerEl: HTMLButtonElement) => void;
}

export function Footer({ onOpenStyleGuide }: FooterProps) {
  const styleBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <footer className="bg-[#1A100C] text-[#E4D6C5]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#FAF6F1]/12">
          {/* Assinatura e conceito */}
          <div className="md:col-span-5 space-y-3">
            <p className="inline-flex items-baseline gap-2 text-[#FAF6F1]">
              <span className="font-serif text-[24px] font-medium">
                {CONTACT_CONFIG.brandName}
              </span>
              <span className="font-serif italic text-[18px] text-[#D9AEA2]">
                {CONTACT_CONFIG.brandComplement}
              </span>
            </p>
            <p className="text-[14px] leading-[1.6] text-[#E4D6C5]/85 max-w-[38ch]">
              Sua beleza, com a sua essência. Maquiagem, sobrancelhas e unhas com foco na valorização da beleza natural.
            </p>
          </div>

          {/* Contato e Instagram oficial */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-[12.5px] font-medium text-[#D9AEA2]">
              Canais oficiais
            </p>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <a
                  href={CONTACT_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FAF6F1] hover:text-[#D9AEA2] underline underline-offset-4 decoration-[#D9AEA2]/40 transition-colors"
                >
                  <Instagram className="w-4 h-4" aria-hidden="true" />
                  <span>{CONTACT_CONFIG.instagramHandle}</span>
                </a>
              </li>
              <li className="text-[#E4D6C5] tabular-nums">
                Contato informado: {CONTACT_CONFIG.whatsappRawDisplay}{' '}
                <span className="block text-[12.5px] text-[#E4D6C5]/75">
                  {CONTACT_CONFIG.isWhatsappConfirmed
                    ? 'WhatsApp confirmado'
                    : 'Aguardando confirmação do número completo para envio direto'}
                </span>
              </li>
            </ul>
          </div>

          {/* Navegação e Guia de Estilo */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-[12.5px] font-medium text-[#D9AEA2]">
              Navegação
            </p>
            <ul className="space-y-2 text-[14px]">
              <li>
                <a href="#essencia" className="hover:text-[#FAF6F1] transition-colors">
                  Essência
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-[#FAF6F1] transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#FAF6F1] transition-colors">
                  Portfólio
                </a>
              </li>
              <li>
                <a href="#agendamento" className="hover:text-[#FAF6F1] transition-colors">
                  Agendamento
                </a>
              </li>
              <li className="pt-1">
                <button
                  ref={styleBtnRef}
                  type="button"
                  onClick={() => {
                    if (styleBtnRef.current) {
                      onOpenStyleGuide(styleBtnRef.current);
                    }
                  }}
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-[#FAF6F1] hover:text-[#D9AEA2] underline underline-offset-4 decoration-[#D9AEA2]/40 cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Guia de estilo visual</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12.5px] text-[#E4D6C5]/75">
          <p>Angelica Lamounier Beauty</p>
          <p>Solicitações de atendimento sujeitas à confirmação direta.</p>
        </div>
      </div>
    </footer>
  );
}
