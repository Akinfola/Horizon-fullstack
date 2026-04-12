export interface CreateAccountInput {
  bankName: string;
  accountNumber: string;
  accountType: "savings" | "checking" | "credit";
  cardHolder: string;
  expiryDate: string;
  cardVariant: "blue" | "purple";
  currentBalance: number;
  availableBalance: number;
  spendingLimit: number;
}