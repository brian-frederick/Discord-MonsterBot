export interface IOutcomeCategory {
  description: string;
  title: string;
}

export interface IOutcome {
  advanced: IOutcomeCategory | null;
  fail: IOutcomeCategory | null;
  high: IOutcomeCategory | null;
  success: IOutcomeCategory | null;
}