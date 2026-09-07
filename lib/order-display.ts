export const ORDER_STATUS: Record<string, { label: string; tone: 'waiting' | 'proof' | 'review' | 'good' | 'bad' | 'neutral'; message: string }> = {
  AWAITING_PAYMENT: { label: 'Waiting for payment', tone: 'waiting', message: 'Transfer by KBZ, include your order reference in the payment note, then submit your receipt.' },
  PAYMENT_DECLARED: { label: 'Upload payment proof', tone: 'proof', message: 'Payment reported. Upload your saved KBZ receipt to send this order for review.' },
  PAYMENT_SUBMITTED: { label: 'Payment under review', tone: 'review', message: 'Your screenshot is with the organisers. You do not need to submit it again.' },
  PAYMENT_REUPLOAD_REQUESTED: { label: 'New screenshot needed', tone: 'bad', message: 'The organisers need a clearer payment screenshot.' },
  PAYMENT_APPROVED: { label: 'Ready to collect', tone: 'good', message: 'Payment approved. Your digital collection ticket is ready.' },
  PAYMENT_REJECTED: { label: 'Payment rejected', tone: 'bad', message: 'The payment could not be approved. See the details for the reason.' },
  PAYMENT_EVIDENCE_EXPIRED: { label: 'Proof time expired', tone: 'bad', message: 'The upload period ended and your reserved food was released.' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral', message: 'This order was cancelled and its food was released.' },
  EXPIRED: { label: 'Reservation expired', tone: 'neutral', message: 'No payment was reported in time, so the food was released.' },
};

export function orderStatus(status: string) {
  return ORDER_STATUS[status] || { label: status.replaceAll('_', ' ').toLowerCase(), tone: 'neutral' as const, message: 'Open the order to see its latest information.' };
}
