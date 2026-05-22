const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5926965612';

export function createWhatsAppLink(message: string) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export const whatsappContactLabel =
  process.env.NEXT_PUBLIC_WHATSAPP_LABEL || '+592 696 5612';