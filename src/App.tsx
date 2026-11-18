import { useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { BookingSection } from './components/BookingSection';
import { EssenceSection } from './components/EssenceSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PortfolioSection } from './components/PortfolioSection';
import { ServicesSection } from './components/ServicesSection';
import { StyleGuideModal } from './components/StyleGuideModal';
import type { ServiceId } from './utils/booking';

export default function App() {
  const [preselectedService, setPreselectedService] = useState<ServiceId | null>(null);
  const [preselectNonce, setPreselectNonce] = useState(0);
  const [styleGuideOpen, setStyleGuideOpen] = useState(false);
  const styleGuideTriggerRef = useRef<HTMLButtonElement | null>(null);

  const scrollToBooking = (serviceId: ServiceId | null = null) => {
    setPreselectedService(serviceId);
    setPreselectNonce((n) => n + 1);

    const target = document.getElementById('agendamento');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#2B1D17]">
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#3B2820] focus:text-[#FAF6F1] focus:rounded-sm focus:text-sm focus:font-medium"
        >
          Ir para o conteúdo principal
        </a>

        <Header onSelectBookingCTA={() => scrollToBooking(null)} />

        <main id="conteudo-principal" className="flex-1">
          <Hero onStartBooking={() => scrollToBooking(null)} />
          <EssenceSection />
          <ServicesSection onChooseService={(serviceId) => scrollToBooking(serviceId)} />
          <PortfolioSection />
          <BookingSection
            preselectedService={preselectedService}
            preselectNonce={preselectNonce}
          />
          <FaqSection />
        </main>

        <Footer
          onOpenStyleGuide={(triggerEl) => {
            styleGuideTriggerRef.current = triggerEl;
            setStyleGuideOpen(true);
          }}
        />

        <StyleGuideModal
          isOpen={styleGuideOpen}
          onClose={() => {
            setStyleGuideOpen(false);
            window.requestAnimationFrame(() => {
              styleGuideTriggerRef.current?.focus();
            });
          }}
        />
      </div>
    </MotionConfig>
  );
}
