import { test, expect } from '../fixtures/base.fixture';

const sampleCartItems = [
  {
    id: 'deep-home-2bhk',
    category: 'Full Home Deep Cleaning',
    tier: '2 BHK Standard Safai',
    price: 2499,
    duration: '4-5 Hours',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    quantity: 1,
  },
];

const sampleUser = {
  id: 'usr_safety_test',
  firstName: 'Neha',
  lastName: 'Kapoor',
  mobile: '9876543210',
  displayName: 'Neha Kapoor',
};

test.describe('Cart Safety on Payment Abandonment & Cancellation', () => {
  test('retains cart items if UPI payment modal is cancelled', async ({ bookingPage, page }) => {
    // 1. Setup session before navigation
    await bookingPage.setupSession({ cart: sampleCartItems, user: sampleUser });
    await bookingPage.goto();

    // 2. Step 1 -> Step 2
    await expect(page.getByText('2 BHK Standard Safai')).toBeVisible();
    await bookingPage.proceedToSlotButton.click();

    // 3. Step 2 -> Step 3
    await bookingPage.selectSlot('Morning Slot');
    await bookingPage.nextToAddressButton.click();

    // 4. Fill customer details and choose UPI
    await bookingPage.fillAddressForm({
      name: 'Neha Kapoor',
      phone: '9876543210',
      address: 'Tower 3, Flat 1204, Cloud9 Towers, Vaishali',
      pincode: '201010',
    });

    // 5. Open UPI Payment Modal
    await bookingPage.proceedToPayButton.click();
    await expect(bookingPage.upiModal.heading).toBeVisible();
    await expect(bookingPage.upiModal.upiIdText).toBeVisible();

    // 6. User decides to cancel and return to cart
    await bookingPage.upiModal.cancel();

    // 7. Verify modal is closed
    await expect(bookingPage.upiModal.heading).not.toBeVisible();

    // 8. CRITICAL SAFETY CHECK: Cart items in localStorage MUST NOT be wiped out
    const cartAfterCancel = await bookingPage.getCartFromStorage();
    expect(cartAfterCancel.length).toBe(1);
    expect(cartAfterCancel[0].tier).toBe('2 BHK Standard Safai');

    // 9. Re-navigating to /booking preserves the items and does NOT show empty cart
    await bookingPage.goto();
    await expect(page.getByText('2 BHK Standard Safai')).toBeVisible();
    await expect(bookingPage.emptyCartHeading).not.toBeVisible();
  });
});
