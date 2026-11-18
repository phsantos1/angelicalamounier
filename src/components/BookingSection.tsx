import { useEffect, useId, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Copy,
  Instagram,
  MessageCircle,
  Pencil,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CONTACT_CONFIG } from '../config/contact';
import {
  SERVICE_LABELS,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatDateBR,
  getTodayLocalDateString,
  isDateInPast,
  isTimeInPastForDate,
  type BookingData,
  type ServiceId,
} from '../utils/booking';

interface BookingSectionProps {
  preselectedService: ServiceId | null;
  preselectNonce: number;
}

type FlowStage = 1 | 2 | 3 | 'summary';

interface StepErrors {
  service?: string;
  date?: string;
  time?: string;
  name?: string;
}

const STEP_META = [
  { step: 1 as const, label: 'Seu cuidado' },
  { step: 2 as const, label: 'Sua preferência' },
  { step: 3 as const, label: 'Seus dados' },
];

const SERVICE_OPTIONS: { id: ServiceId; label: string; hint: string }[] = [
  {
    id: 'maquiagem',
    label: 'Maquiagem',
    hint: 'Acabamento leve que respeita a textura natural da sua pele.',
  },
  {
    id: 'sobrancelhas',
    label: 'Sobrancelhas',
    hint: 'Desenho harmônico e valorização do formato natural.',
  },
  {
    id: 'unhas',
    label: 'Unhas',
    hint: 'Cuidado limpo, discreto e delicado para as mãos.',
  },
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function BookingSection({
  preselectedService,
  preselectNonce,
}: BookingSectionProps) {
  const [stage, setStage] = useState<FlowStage>(1);
  const [booking, setBooking] = useState<BookingData>({
    service: '',
    date: '',
    time: '',
    name: '',
    notes: '',
  });
  const [errors, setErrors] = useState<StepErrors>({});
  const [copiedMessage, setCopiedMessage] = useState(false);

  const headingId = useId();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const serviceFirstBtnRef = useRef<HTMLButtonElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const todayStr = getTodayLocalDateString();

  // Preenche o serviço quando a cliente vem da seção de Serviços ou do cabeçalho
  useEffect(() => {
    if (preselectNonce === 0) return;

    if (preselectedService) {
      setBooking((prev) => ({ ...prev, service: preselectedService }));
      setErrors((prev) => ({ ...prev, service: undefined }));
      setStage(1);
    }

    const timer = window.setTimeout(() => {
      stepHeadingRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [preselectedService, preselectNonce]);

  const moveFocusToStageHeading = () => {
    window.requestAnimationFrame(() => {
      stepHeadingRef.current?.focus();
    });
  };

  const validateStep1 = (): boolean => {
    if (!booking.service) {
      setErrors({ service: 'Escolha uma área de cuidado para continuar.' });
      window.requestAnimationFrame(() => {
        serviceFirstBtnRef.current?.focus();
      });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = (): boolean => {
    const nextErrors: StepErrors = {};
    const now = new Date();

    if (!booking.date) {
      nextErrors.date = 'Informe a data desejada.';
    } else if (isDateInPast(booking.date, now)) {
      nextErrors.date = 'Escolha uma data igual ou posterior ao dia de hoje.';
    }

    if (!booking.time) {
      nextErrors.time = 'Informe o horário desejado.';
    } else if (booking.date && !nextErrors.date && isTimeInPastForDate(booking.date, booking.time, now)) {
      nextErrors.time =
        'Para o dia de hoje, escolha um horário posterior ao horário atual.';
    }

    if (nextErrors.date || nextErrors.time) {
      setErrors(nextErrors);
      window.requestAnimationFrame(() => {
        if (nextErrors.date) {
          dateInputRef.current?.focus();
        } else if (nextErrors.time) {
          timeInputRef.current?.focus();
        }
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const validateStep3 = (): boolean => {
    const trimmedName = booking.name.trim();
    if (!trimmedName) {
      setErrors({ name: 'Informe seu nome para identificar a solicitação.' });
      window.requestAnimationFrame(() => {
        nameInputRef.current?.focus();
      });
      return false;
    }
    if (trimmedName.length < 2) {
      setErrors({ name: 'Digite seu nome com pelo menos 2 caracteres.' });
      window.requestAnimationFrame(() => {
        nameInputRef.current?.focus();
      });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (stage === 1 && validateStep1()) {
      setStage(2);
      moveFocusToStageHeading();
    } else if (stage === 2 && validateStep2()) {
      setStage(3);
      moveFocusToStageHeading();
    } else if (stage === 3 && validateStep3()) {
      setStage('summary');
      moveFocusToStageHeading();
    }
  };

  const handleBack = () => {
    setErrors({});
    if (stage === 2) {
      setStage(1);
    } else if (stage === 3) {
      setStage(2);
    } else if (stage === 'summary') {
      setStage(3);
    }
    moveFocusToStageHeading();
  };

  const jumpToStage = (target: 1 | 2 | 3) => {
    setErrors({});
    setStage(target);
    moveFocusToStageHeading();
  };

  const progressPercent =
    stage === 1 ? 33.33 : stage === 2 ? 66.66 : 100;

  const currentStepNumber = stage === 'summary' ? 3 : stage;
  const formattedMessage = buildWhatsAppMessage(booking);
  const canSendWhatsapp =
    CONTACT_CONFIG.isWhatsappConfirmed &&
    CONTACT_CONFIG.whatsappE164Confirmed.replace(/\D/g, '').length >= 12;

  const whatsappHref = canSendWhatsapp
    ? buildWhatsAppUrl(CONTACT_CONFIG.whatsappE164Confirmed, formattedMessage)
    : undefined;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 3200);
    } catch {
      setCopiedMessage(false);
    }
  };

  return (
    <section
      id="agendamento"
      aria-labelledby={headingId}
      className="border-b border-[#FAF6F1]/10 bg-[#1E1410] text-[#FAF6F1]"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Coluna Editorial Esquerda — Orientações claras no tom café da referência */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="lg:col-span-5 space-y-6"
          >
            <p className="text-[12.5px] tracking-[0.08em] text-[#D9AEA2] font-medium">
              Agendamento personalizado
            </p>

            <h2
              id={headingId}
              className="font-serif text-[clamp(2.25rem,3.8vw,3.25rem)] leading-[1.06] font-normal text-[#FAF6F1] text-balance"
            >
              Solicite seu{' '}
              <span className="italic text-[#D9AEA2]">momento</span> hoje.
            </h2>

            <p className="text-[15.5px] leading-[1.7] text-[#E4D6C5] max-w-[42ch]">
              Escolha o cuidado, indique sua preferência de dia e horário e revise sua mensagem antes de abrir o WhatsApp com Angelica.
            </p>

            <div className="p-5 rounded-sm bg-[#2B1D17] border border-[#FAF6F1]/12 space-y-2.5">
              <p className="text-[14px] font-medium text-[#FAF6F1]">
                Esta é uma solicitação. O atendimento será confirmado diretamente pelo WhatsApp.
              </p>
              <p className="text-[13px] leading-[1.6] text-[#E4D6C5]/85">
                Os horários informados representam apenas a sua preferência. Seus dados permanecem apenas nesta tela durante o preenchimento e não são armazenados no navegador.
              </p>
            </div>
          </motion.div>

          {/* Coluna Direita — Formulário em 3 etapas + Resumo editável */}
          <div className="lg:col-span-7">
            <div className="rounded-sm bg-[#FAF6F1] text-[#241712] border border-[#FAF6F1]/15 p-6 sm:p-9 shadow-xl">
              {/* Indicador animado de progresso */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between gap-2 text-[12.5px]">
                  {STEP_META.map((item) => {
                    const isCompleted =
                      stage === 'summary' || currentStepNumber > item.step;
                    const isCurrent =
                      stage !== 'summary' && currentStepNumber === item.step;
                    return (
                      <button
                        key={item.step}
                        type="button"
                        onClick={() => {
                          if (item.step < currentStepNumber || stage === 'summary') {
                            jumpToStage(item.step);
                          }
                        }}
                        disabled={item.step > currentStepNumber && stage !== 'summary'}
                        className={`inline-flex items-center gap-2 py-1 text-left transition-colors ${
                          isCurrent
                            ? 'text-[#241712] font-semibold'
                            : isCompleted
                              ? 'text-[#3B2820] hover:text-[#241712] cursor-pointer'
                              : 'text-[#5E4A40]/70 cursor-default'
                        }`}
                      >
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-sm text-[11px] tabular-nums transition-colors ${
                            isCurrent
                              ? 'bg-[#3B2820] text-[#FAF6F1]'
                              : isCompleted
                                ? 'bg-[#EFE6DA] text-[#241712]'
                                : 'bg-[#FAF6F1] border border-[#3B2820]/15 text-[#5E4A40]'
                          }`}
                        >
                          {isCompleted && !isCurrent ? (
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            item.step
                          )}
                        </span>
                        <span className="hidden sm:inline whitespace-nowrap">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Barra de progresso animada via transform (scaleX) */}
                <div
                  className="h-1 w-full bg-[#EFE6DA] rounded-sm overflow-hidden"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progressPercent)}
                  aria-label="Progresso da solicitação de atendimento"
                >
                  <motion.div
                    className="h-full w-full origin-left bg-[#3B2820]"
                    initial={false}
                    animate={{ scaleX: progressPercent / 100 }}
                    transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                  />
                </div>
              </div>

              {/* Conteúdo das etapas com preservação de foco */}
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
              >
                <AnimatePresence mode="wait">
                  {stage === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
                      className="space-y-6"
                    >
                      <div className="space-y-1.5">
                        <h3
                          ref={stepHeadingRef}
                          tabIndex={-1}
                          className="font-serif text-[28px] leading-[1.15] text-[#241712] outline-none"
                        >
                          1. Seu cuidado
                        </h3>
                        <p className="text-[14px] text-[#5E4A40]">
                          Selecione a área de atendimento desejada.
                        </p>
                      </div>

                      <div
                        role="radiogroup"
                        aria-label="Escolha o serviço desejado"
                        aria-invalid={Boolean(errors.service)}
                        aria-describedby={errors.service ? 'error-service' : undefined}
                        className="space-y-3"
                      >
                        {SERVICE_OPTIONS.map((option, idx) => {
                          const isSelected = booking.service === option.id;
                          return (
                            <button
                              key={option.id}
                              ref={idx === 0 ? serviceFirstBtnRef : undefined}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => {
                                setBooking((prev) => ({
                                  ...prev,
                                  service: option.id,
                                }));
                                setErrors((prev) => ({
                                  ...prev,
                                  service: undefined,
                                }));
                              }}
                              className={`w-full min-h-[68px] text-left p-4 sm:p-5 rounded-sm border transition-all duration-150 flex items-start justify-between gap-4 cursor-pointer ${
                                isSelected
                                  ? 'border-[#3B2820] bg-[#FAF6F1] shadow-xs'
                                  : 'border-[#3B2820]/15 bg-[#FFFDF9] hover:border-[#3B2820]/35'
                              }`}
                            >
                              <div className="space-y-1">
                                <span className="block font-serif text-[22px] leading-tight text-[#241712]">
                                  {option.label}
                                </span>
                                <span className="block text-[13.5px] text-[#5E4A40]">
                                  {option.hint}
                                </span>
                              </div>
                              <span
                                aria-hidden="true"
                                className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? 'border-[#3B2820] bg-[#3B2820] text-[#FAF6F1]'
                                    : 'border-[#3B2820]/30'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {errors.service && (
                        <p
                          id="error-service"
                          role="alert"
                          className="flex items-center gap-2 text-[13px] text-[#8E2A23]"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>{errors.service}</span>
                        </p>
                      )}

                      <div className="pt-4 border-t border-[#3B2820]/10 flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2.5 min-h-[46px] px-6 py-3 text-[14px] font-medium text-[#FAF6F1] bg-[#3B2820] hover:bg-[#241712] rounded-sm transition-colors cursor-pointer"
                        >
                          <span>Continuar</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {stage === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
                      className="space-y-6"
                    >
                      <div className="space-y-1.5">
                        <h3
                          ref={stepHeadingRef}
                          tabIndex={-1}
                          className="font-serif text-[28px] leading-[1.15] text-[#241712] outline-none"
                        >
                          2. Sua preferência
                        </h3>
                        <p className="text-[14px] text-[#5E4A40]">
                          Indique o dia e o horário de sua preferência. Não são horários garantidos — a disponibilidade será confirmada diretamente pelo WhatsApp.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Data desejada */}
                        <div className="space-y-2">
                          <label
                            htmlFor="booking-date"
                            className="flex items-center gap-2 text-[13.5px] font-medium text-[#241712]"
                          >
                            <Calendar className="w-4 h-4 text-[#5E4A40]" aria-hidden="true" />
                            <span>Data desejada *</span>
                          </label>
                          <input
                            ref={dateInputRef}
                            id="booking-date"
                            name="date"
                            type="date"
                            min={todayStr}
                            required
                            value={booking.date}
                            onChange={(e) => {
                              const nextDate = e.target.value;
                              setBooking((prev) => ({ ...prev, date: nextDate }));
                              setErrors((prev) => ({
                                ...prev,
                                date: undefined,
                                time: undefined,
                              }));
                            }}
                            aria-invalid={Boolean(errors.date)}
                            aria-describedby={
                              errors.date ? 'error-date' : 'hint-date'
                            }
                            className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-sm border bg-[#FAF6F1] text-[15px] text-[#241712] tabular-nums transition-colors ${
                              errors.date
                                ? 'border-[#8E2A23]'
                                : 'border-[#3B2820]/20 focus:border-[#3B2820]'
                            }`}
                          />
                          {errors.date ? (
                            <p
                              id="error-date"
                              role="alert"
                              className="flex items-start gap-1.5 text-[12.5px] text-[#8E2A23]"
                            >
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                              <span>{errors.date}</span>
                            </p>
                          ) : (
                            <p id="hint-date" className="text-[12px] text-[#5E4A40]">
                              Apenas datas a partir de hoje.
                            </p>
                          )}
                        </div>

                        {/* Horário desejado */}
                        <div className="space-y-2">
                          <label
                            htmlFor="booking-time"
                            className="flex items-center gap-2 text-[13.5px] font-medium text-[#241712]"
                          >
                            <Clock className="w-4 h-4 text-[#5E4A40]" aria-hidden="true" />
                            <span>Horário desejado (preferência) *</span>
                          </label>
                          <input
                            ref={timeInputRef}
                            id="booking-time"
                            name="time"
                            type="time"
                            required
                            value={booking.time}
                            onChange={(e) => {
                              const nextTime = e.target.value;
                              setBooking((prev) => ({ ...prev, time: nextTime }));
                              setErrors((prev) => ({ ...prev, time: undefined }));
                            }}
                            aria-invalid={Boolean(errors.time)}
                            aria-describedby={
                              errors.time ? 'error-time' : 'hint-time'
                            }
                            className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-sm border bg-[#FAF6F1] text-[15px] text-[#241712] tabular-nums transition-colors ${
                              errors.time
                                ? 'border-[#8E2A23]'
                                : 'border-[#3B2820]/20 focus:border-[#3B2820]'
                            }`}
                          />
                          {errors.time ? (
                            <p
                              id="error-time"
                              role="alert"
                              className="flex items-start gap-1.5 text-[12.5px] text-[#8E2A23]"
                            >
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                              <span>{errors.time}</span>
                            </p>
                          ) : (
                            <p id="hint-time" className="text-[12px] text-[#5E4A40]">
                              Indica sua preferência, sujeita à confirmação.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#3B2820]/10 flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="inline-flex items-center gap-2 min-h-[46px] px-5 py-3 text-[14px] font-medium text-[#241712] bg-[#EFE6DA] hover:bg-[#E4D6C5] rounded-sm transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                          <span>Voltar</span>
                        </button>

                        <button
                          type="submit"
                          className="inline-flex items-center gap-2.5 min-h-[46px] px-6 py-3 text-[14px] font-medium text-[#FAF6F1] bg-[#3B2820] hover:bg-[#241712] rounded-sm transition-colors cursor-pointer"
                        >
                          <span>Continuar</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {stage === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
                      className="space-y-6"
                    >
                      <div className="space-y-1.5">
                        <h3
                          ref={stepHeadingRef}
                          tabIndex={-1}
                          className="font-serif text-[28px] leading-[1.15] text-[#241712] outline-none"
                        >
                          3. Seus dados
                        </h3>
                        <p className="text-[14px] text-[#5E4A40]">
                          Preencha seu nome e, se quiser, uma observação breve sobre o atendimento.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label
                            htmlFor="booking-name"
                            className="block text-[13.5px] font-medium text-[#241712]"
                          >
                            Seu nome *
                          </label>
                          <input
                            ref={nameInputRef}
                            id="booking-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            maxLength={80}
                            placeholder="Como você gostaria de ser chamada"
                            value={booking.name}
                            onChange={(e) => {
                              const nextName = e.target.value;
                              setBooking((prev) => ({ ...prev, name: nextName }));
                              setErrors((prev) => ({ ...prev, name: undefined }));
                            }}
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={errors.name ? 'error-name' : undefined}
                            className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-sm border bg-[#FAF6F1] text-[15px] text-[#241712] placeholder:text-[#5E4A40]/60 transition-colors ${
                              errors.name
                                ? 'border-[#8E2A23]'
                                : 'border-[#3B2820]/20 focus:border-[#3B2820]'
                            }`}
                          />
                          {errors.name && (
                            <p
                              id="error-name"
                              role="alert"
                              className="flex items-center gap-1.5 text-[12.5px] text-[#8E2A23]"
                            >
                              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                              <span>{errors.name}</span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="booking-notes"
                            className="block text-[13.5px] font-medium text-[#241712]"
                          >
                            Observação (opcional)
                          </label>
                          <textarea
                            id="booking-notes"
                            name="notes"
                            rows={3}
                            maxLength={280}
                            placeholder="Ex.: ocasião do atendimento, preferência de período alternativo ou dúvida rápida."
                            value={booking.notes}
                            onChange={(e) =>
                              setBooking((prev) => ({
                                ...prev,
                                notes: e.target.value,
                              }))
                            }
                            aria-describedby="hint-notes"
                            className="w-full px-3.5 py-2.5 rounded-sm border border-[#3B2820]/20 focus:border-[#3B2820] bg-[#FAF6F1] text-[15px] text-[#241712] placeholder:text-[#5E4A40]/60 transition-colors resize-y"
                          />
                          <p id="hint-notes" className="text-[12px] text-[#5E4A40]">
                            Evite incluir informações médicas ou sensíveis.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#3B2820]/10 flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="inline-flex items-center gap-2 min-h-[46px] px-5 py-3 text-[14px] font-medium text-[#241712] bg-[#EFE6DA] hover:bg-[#E4D6C5] rounded-sm transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                          <span>Voltar</span>
                        </button>

                        <button
                          type="submit"
                          className="inline-flex items-center gap-2.5 min-h-[46px] px-6 py-3 text-[14px] font-medium text-[#FAF6F1] bg-[#3B2820] hover:bg-[#241712] rounded-sm transition-colors cursor-pointer"
                        >
                          <span>Revisar solicitação</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {stage === 'summary' && (
                    <motion.div
                      key="step-summary"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
                      className="space-y-6"
                    >
                      <div className="space-y-1.5">
                        <h3
                          ref={stepHeadingRef}
                          tabIndex={-1}
                          className="font-serif text-[28px] leading-[1.15] text-[#241712] outline-none"
                        >
                          Resumo da solicitação
                        </h3>
                        <p className="text-[14px] text-[#5E4A40]">
                          Confira ou edite qualquer detalhe antes de prosseguir.
                        </p>
                      </div>

                      {/* Resumo editável por campo */}
                      <dl className="divide-y divide-[#3B2820]/10 border-y border-[#3B2820]/10">
                        <div className="py-3.5 flex items-center justify-between gap-4">
                          <div>
                            <dt className="text-[12px] text-[#5E4A40]">Serviço</dt>
                            <dd className="text-[15px] font-medium text-[#241712]">
                              {booking.service ? SERVICE_LABELS[booking.service] : '—'}
                            </dd>
                          </div>
                          <button
                            type="button"
                            onClick={() => jumpToStage(1)}
                            className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-[12.5px] font-medium text-[#3B2820] hover:bg-[#EFE6DA] rounded-sm transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Editar</span>
                          </button>
                        </div>

                        <div className="py-3.5 flex items-center justify-between gap-4">
                          <div>
                            <dt className="text-[12px] text-[#5E4A40]">
                              Preferência de data e horário
                            </dt>
                            <dd className="text-[15px] font-medium text-[#241712] tabular-nums">
                              {formatDateBR(booking.date)} às {booking.time}
                            </dd>
                          </div>
                          <button
                            type="button"
                            onClick={() => jumpToStage(2)}
                            className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-[12.5px] font-medium text-[#3B2820] hover:bg-[#EFE6DA] rounded-sm transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Editar</span>
                          </button>
                        </div>

                        <div className="py-3.5 flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <dt className="text-[12px] text-[#5E4A40]">Seus dados</dt>
                            <dd className="text-[15px] font-medium text-[#241712]">
                              {booking.name.trim()}
                            </dd>
                            {booking.notes.trim().length > 0 && (
                              <dd className="text-[13.5px] text-[#5E4A40] break-words">
                                Observação: {booking.notes.trim()}
                              </dd>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => jumpToStage(3)}
                            className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-[12.5px] font-medium text-[#3B2820] hover:bg-[#EFE6DA] rounded-sm transition-colors shrink-0 cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Editar</span>
                          </button>
                        </div>
                      </dl>

                      {/* Prévia exata da mensagem formatada */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[12.5px] font-medium text-[#5E4A40]">
                            Prévia da mensagem para envio
                          </p>
                          <button
                            type="button"
                            onClick={handleCopyMessage}
                            className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1 text-[12.5px] font-medium text-[#3B2820] bg-[#EFE6DA] hover:bg-[#E4D6C5] rounded-sm transition-colors cursor-pointer"
                          >
                            {copiedMessage ? (
                              <>
                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Mensagem copiada</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Copiar mensagem</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="p-4 rounded-sm bg-[#FAF6F1] border border-[#3B2820]/12 text-[13px] leading-[1.6] text-[#241712] whitespace-pre-wrap font-sans">
                          {formattedMessage}
                        </pre>
                      </div>

                      {/* Aviso obrigatório + Estado de confirmação do WhatsApp */}
                      <div className="space-y-4">
                        <p className="text-[13px] font-medium text-[#241712]">
                          Esta é uma solicitação. O atendimento será confirmado diretamente pelo WhatsApp.
                        </p>

                        {canSendWhatsapp ? (
                          <p className="text-[13px] leading-[1.6] text-[#5E4A40]">
                            Ao clicar em <strong>Solicitar pelo WhatsApp</strong>, a conversa para {CONTACT_CONFIG.whatsappRawDisplay} será aberta com esta mensagem preenchida para você enviar diretamente.
                          </p>
                        ) : (
                          <div
                            role="status"
                            className="p-4 rounded-sm bg-[#EFE6DA] border border-[#3B2820]/15 space-y-2"
                          >
                            <p className="text-[13.5px] font-medium text-[#241712]">
                              Envio direto pelo WhatsApp aguardando confirmação do número
                            </p>
                            <p className="text-[13px] leading-[1.6] text-[#5E4A40]">
                              O contato recebido ({CONTACT_CONFIG.whatsappRawDisplay}) aguarda confirmação do formato completo pela profissional. Por segurança, o envio direto permanece desativado até essa confirmação. Você pode copiar a mensagem acima ou falar pelo Instagram oficial{' '}
                              <a
                                href={CONTACT_CONFIG.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-[#241712] underline underline-offset-2"
                              >
                                {CONTACT_CONFIG.instagramHandle}
                              </a>
                              .
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Ações finais */}
                      <div className="pt-4 border-t border-[#3B2820]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 text-[14px] font-medium text-[#241712] bg-[#EFE6DA] hover:bg-[#E4D6C5] rounded-sm transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                          <span>Voltar</span>
                        </button>

                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={CONTACT_CONFIG.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-4 py-3 text-[13.5px] font-medium text-[#241712] border border-[#3B2820]/20 hover:bg-[#EFE6DA] rounded-sm transition-colors"
                          >
                            <Instagram className="w-4 h-4" aria-hidden="true" />
                            <span>Instagram oficial</span>
                          </a>

                          {canSendWhatsapp && whatsappHref ? (
                            <a
                              href={whatsappHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2.5 min-h-[46px] px-6 py-3 text-[14px] font-medium text-[#FAF6F1] bg-[#3B2820] hover:bg-[#241712] rounded-sm transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" aria-hidden="true" />
                              <span>Solicitar pelo WhatsApp</span>
                            </a>
                          ) : (
                            <button
                              type="button"
                              disabled
                              aria-disabled="true"
                              title="Envio desativado até confirmação do número completo de WhatsApp"
                              className="inline-flex items-center justify-center gap-2.5 min-h-[46px] px-6 py-3 text-[14px] font-medium text-[#5E4A40] bg-[#E4D6C5] rounded-sm cursor-not-allowed opacity-80"
                            >
                              <MessageCircle className="w-4 h-4" aria-hidden="true" />
                              <span>Solicitar pelo WhatsApp</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
