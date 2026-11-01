import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { UpiPaymentModalComponent } from './components/upi-modal.component';

export class BookingPage extends BasePage {
  readonly path = '/booking';
  readonly upiModal: UpiPaymentModalComponent;

  // Step 1 locators
  readonly emptyCartHeading: Locator;
  readonly exploreServicesButton: Locator;
  readonly proceedToSlotButton: Locator;

  // Step 2 locators
  readonly nextToAddressButton: Locator;

  // Step 3 locators
  readonly customerNameInput: Locator;
  readonly customerPhoneInput: Locator;
  readonly addressInput: Locator;
  readonly pincodeInput: Locator;
  readonly upiOption: Locator;
  readonly postServiceOption: Locator;
  readonly signInToPlaceOrderButton: Locator;
  readonly proceedToPayButton: Locator;
  readonly confirmPostServiceButton: Locator;

  // Step 4 (Confirmation) locators
  readonly successMessage: Locator;
  readonly viewInBookingsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.upiModal = new UpiPaymentModalComponent(page.locator('div.fixed.inset-0.z-50'));

    this.emptyCartHeading = page.getByRole('heading', { name: 'Your Booking Cart is Empty' });
    this.exploreServicesButton = page.getByRole('link', { name: 'Explore Cleaning Services' });
    this.proceedToSlotButton = page.getByRole('button', { name: 'Proceed to Slot Selection' });

    this.nextToAddressButton = page.getByRole('button', { name: 'Next: Customer Address' });

    this.customerNameInput = page.getByPlaceholder('e.g. Rahul Sharma');
    this.customerPhoneInput = page.getByPlaceholder('10-digit mobile number');
    this.addressInput = page.getByPlaceholder('Flat/House No., Building, Street...');
    this.pincodeInput = page.getByPlaceholder('e.g. 201014');

    this.upiOption = page.getByText('Pay via UPI (GPay/PhonePe)');
    this.postServiceOption = page.getByText('Pay Post-Service');

    this.signInToPlaceOrderButton = page.getByRole('button', { name: 'Sign In to Place Order' });
    this.proceedToPayButton = page.getByRole('button', { name: /Proceed to Pay/i });
    this.confirmPostServiceButton = page.getByRole('button', { name: /Confirm Booking \(Pay/i });

    this.successMessage = page.getByText(/safai is scheduled|booking is confirmed/i);
    this.viewInBookingsButton = page.getByRole('link', { name: 'View in My Bookings' });
  }

  async selectSlot(slotLabel: string): Promise<void> {
    await this.page.getByRole('button', { name: new RegExp(slotLabel, 'i') }).click();
  }

  async fillAddressForm(details: { name: string; phone: string; address: string; pincode?: string }): Promise<void> {
    await this.customerNameInput.fill(details.name);
    await this.customerPhoneInput.fill(details.phone);
    await this.addressInput.fill(details.address);
    if (details.pincode) {
      await this.pincodeInput.fill(details.pincode);
    }
  }

  async setupSession(data: { cart?: any[]; user?: any; city?: string } = {}): Promise<void> {
    await this.setupStorage({
      city: data.city || 'ghaziabad',
      cart: data.cart ?? [],
      user: data.user,
    });
  }

  async getCartFromStorage(): Promise<any[]> {
    return this.page.evaluate(() => {
      try {
        return JSON.parse(localStorage.getItem('dirtfree_cart') || '[]');
      } catch {
        return [];
      }
    });
  }
}
