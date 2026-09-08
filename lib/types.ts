export type Media = { url?: string; storageKey?: string; provider?: string };

export type EventData = {
  eventName?: string;
  eventDate?: string;
  eventTimezone?: string;
  preorderOpenAt?: string;
  preorderCloseAt?: string;
  orderingEnabled?: boolean;
  preorderStatus?: 'UPCOMING' | 'OPEN' | 'CLOSED' | 'DISABLED';
  orderReservationMinutes?: number;
  paymentProofGraceMinutes?: number;
  featureFlags?: { memoriesEnabled?: boolean; eventPageEnabled?: boolean; crushLettersEnabled?: boolean; quizEnabled?: boolean };
};

export type Stall = {
  _id: string;
  stallName: string;
  slug?: string;
  batch: string;
  description?: string;
  image?: Media;
  isActive?: boolean;
};

export type Discount = { type: 'percentage' | 'fixed'; value: number };

export type Food = {
  stallFoodId: string;
  stallId: string;
  foodId: string;
  stallName: string;
  stallBatch?: string;
  food: { name: string; description?: string; category?: string; image?: Media };
  eventDayPrice: number;
  discount: Discount;
  preorderPrice: number;
  ticketLimit: number;
  ticketsRemaining: number;
  isAvailable: boolean;
  demoImage?: string;
};

export type User = { _id: string; name: string; role: 'user' | 'admin' | 'stall_owner'; isActive?: boolean };
export type CartLine = { stallFoodId: string; quantity: number; food: Food };

export type OrderItem = {
  stallId: string;
  stallFoodId?: string;
  foodId?: string;
  stallName: string;
  foodName: string;
  foodImage?: Media | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Order = {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalQuantity: number;
  totalAmount: number;
  status: string;
  inventoryStatus: string;
  paymentReference: string;
  preorderPrivilegeCode?: string;
  reservationExpiresAt: string;
  paymentDeclaredAt?: string;
  paymentProofExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Ticket = {
  _id: string;
  orderId: Order | string;
  code: string;
  status: 'ACTIVE' | 'REDEEMED' | 'CANCELLED';
  generatedAt: string;
  redeemedAt?: string;
};

export type CheckoutPayment = {
  amount: number;
  reference: string;
  reservationExpiresAt: string;
  kbzAccountName?: string;
  kbzAccountNumber?: string;
  paymentInstructions?: string;
};

export type QuizCodeValidation = { eligible: boolean; alreadyUsed: boolean; orderId: string };
export type QuizQuestionPublic = { questionId: string; version: number; question: string; options: string[] };
export type QuizStart = { attemptId: string; questions: QuizQuestionPublic[] };
export type QuizSubmitResult = { attemptId: string; score: number; passed: boolean; timedOut: boolean; elapsedMs: number; reward?: { type: string; message?: string } };
export type QuizLeaderboardEntry = { rank: number; name: string; elapsedMs: number; submittedAt: string };
