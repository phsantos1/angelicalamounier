export type ServiceId = 'maquiagem' | 'sobrancelhas' | 'unhas';

export interface BookingData {
  service: ServiceId | '';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  name: string;
  notes: string;
}

export const SERVICE_LABELS: Record<ServiceId, string> = {
  maquiagem: 'Maquiagem',
  sobrancelhas: 'Sobrancelhas',
  unhas: 'Unhas',
};

export function getTodayLocalDateString(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentLocalTimeString(now: Date = new Date()): string {
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function isDateInPast(dateStr: string, now: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  return dateStr < getTodayLocalDateString(now);
}

export function isTimeInPastForDate(
  dateStr: string,
  timeStr: string,
  now: Date = new Date(),
): boolean {
  if (!dateStr || !/^\d{2}:\d{2}$/.test(timeStr)) return false;
  const today = getTodayLocalDateString(now);
  if (dateStr < today) return true;
  if (dateStr > today) return false;
  return timeStr <= getCurrentLocalTimeString(now);
}

export function formatDateBR(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function buildWhatsAppMessage(data: BookingData): string {
  const serviceLabel = data.service ? SERVICE_LABELS[data.service] : '';
  const trimmedName = data.name.trim();
  const formattedDate = formatDateBR(data.date);
  const trimmedNotes = data.notes.trim();

  const lines = [
    'Olá, Angelica! Gostaria de solicitar um atendimento.',
    '',
    `Nome: ${trimmedName}`,
    `Serviço: ${serviceLabel}`,
    `Data desejada: ${formattedDate}`,
    `Horário desejado: ${data.time}`,
  ];

  if (trimmedNotes.length > 0) {
    lines.push(`Observação: ${trimmedNotes}`);
  }

  lines.push('', 'Você pode confirmar a disponibilidade?');

  return lines.join('\n');
}

export function buildWhatsAppUrl(phoneE164: string, message: string): string {
  const cleanDigits = phoneE164.replace(/\D/g, '');
  return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(message)}`;
}
