import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CONTACT_CONFIG } from '../config/contact';

interface HeaderProps {
  onSelectBookingCTA: () => void;
}

const NAV_LINKS = [
  { href: '#essencia', label: 'Essência' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#agendamento', label: 'Agendamento' },
] as const;

export function Header({ onSelectBookingCTA }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (mobileOpen) {
      wasOpenRef.current = true;
      const timer = window.setTimeout(() => {
        firstMobileLinkRef.current?.focus();
      }, 60);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setMobileOpen(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        window.clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      toggleBtnRef.current?.focus();
    }
  }, [mobileOpen]);

  const handleMobileNavClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1E1410]/95 backdrop-blur-md border-b border-[#FAF6F1]/10">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Assinatura tipográfica (não apresentada como logo oficial) */}
        <a
          href="#topo"
          className="inline-flex items-baseline gap-2 text-[#FAF6F1] whitespace-nowrap shrink-0 focus-visible:rounded-sm"
          aria-label="Angelica Lamounier Beauty — Voltar ao início"
        >
          <span className="font-serif text-[21px] sm:text-[23px] font-medium tracking-[0.01em]">
            {CONTACT_CONFIG.brandName}
          </span>
          <span className="font-serif italic text-[17px] text-[#D9AEA2] font-normal">
            {CONTACT_CONFIG.brandComplement}
          </span>
        </a>

        {/* Zone 2: Navegação Desktop centralizada */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-8 text-[13.5px] font-medium tracking-[0.02em] text-[#E4D6C5]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-2 whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#FAF6F1] after:content-[''] after:absolute after:left-0 after:bottom-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#D9AEA2] after:transition-transform after:duration-200 hover:after:scale-x-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Ação primária em rosado discreto + Gatilho Mobile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onSelectBookingCTA}
            className="hidden sm:inline-flex items-center justify-center min-h-[40px] px-5 py-2 text-[13px] font-semibold tracking-[0.02em] text-[#241712] bg-[#C89A8E] rounded-sm transition-all duration-200 hover:bg-[#D9AEA2] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Escolher meu cuidado
          </button>

          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#FAF6F1] hover:bg-[#FAF6F1]/10 rounded-sm transition-colors duration-150 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile acessível */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-[#1E1410] border-t border-[#FAF6F1]/10 px-6 py-8 flex flex-col justify-between overflow-y-auto"
          >
            <nav aria-label="Menu móvel" className="flex flex-col divide-y divide-[#FAF6F1]/10">
              {NAV_LINKS.map((item, idx) => (
                <a
                  key={item.href}
                  ref={idx === 0 ? firstMobileLinkRef : undefined}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMobileNavClick(item.href);
                  }}
                  className="py-5 min-h-[52px] flex items-center justify-between font-serif text-[28px] font-normal text-[#FAF6F1] hover:text-[#D9AEA2] transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-xs font-sans tracking-widest text-[#D9AEA2]">0{idx + 1}</span>
                </a>
              ))}
            </nav>

            <div className="pt-8 border-t border-[#FAF6F1]/10 space-y-5">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onSelectBookingCTA();
                }}
                className="w-full min-h-[48px] px-6 py-3 text-[14px] font-semibold text-[#241712] bg-[#C89A8E] rounded-sm hover:bg-[#D9AEA2] transition-colors cursor-pointer"
              >
                Escolher meu cuidado
              </button>
              <p className="text-[13px] text-[#E4D6C5]">
                Sua beleza, com a sua essência.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
