import { type Locator } from '@playwright/test';

export class UpiPaymentModalComponent {
  readonly root: Locator;
  readonly heading: Locator;
  readonly upiIdText: Locator;
  readonly copyButton: Locator;
  readonly utrInput: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly simulateSuccessButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.heading = root.getByRole('heading', { name: 'Scan & Pay via UPI' });
    this.upiIdText = root.getByText('9691998370@ybl');
    this.copyButton = root.getByRole('button', { name: /Copy UPI|Copied!/i });
    this.utrInput = root.getByPlaceholder('e.g. 429817291024');
    this.confirmButton = root.getByRole('button', { name: /I Have Paid/i });
    this.cancelButton = root.getByRole('button', { name: 'Cancel & Return to Cart' });
    this.simulateSuccessButton = root.getByRole('button', { name: '⚡ Simulate Success' });
  }

  async fillUtr(utr: string): Promise<void> {
    await this.utrInput.fill(utr);
  }

  async confirm(): Promise<void> {
    await this.confirmButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async simulateSuccess(): Promise<void> {
    await this.simulateSuccessButton.click();
  }
}

