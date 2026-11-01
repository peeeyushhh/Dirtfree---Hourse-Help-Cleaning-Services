import { test, expect } from '../fixtures/base.fixture';

const sampleCartItems = [
  {
    id: 'kitchen-deep-clean',
    category: 'Kitchen Cleaning',
    tier: 'Modular Kitchen Degreasing',
    price: 1299,
    duration: '2 Hours',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f',
    quantity: 1,
  },
];

const sampleUser = {
  id: 'usr_upi_customer',
  firstName: 'Vikram',
  lastName: 'Singh',
  mobile: '9691998370',
  displayName: 'Vikram Singh',
};

test.describe('Direct UPI Payment & Order Finalization', () => {
  test('renders NPCI QR, payee VPA and mobile app intent links', async ({ bookingPage, page }) => {
    await bookingPage.setupSession({ cart: sampleCartItems, user: sampleUser });
    await bookingPage.goto();

    await bookingPage.proceedToSlotButton.click();
    await bookingPage.selectSlot('Morning Slot');
    await bookingPage.nextToAddressButton.click();

    await bookingPage.fillAddressForm({
      name: 'Vikram Singh',
      phone: '9691998370',
      address: 'House 88, Sector 15, Vasundhara',
      pincode: '201012',
    });

    await bookingPage.proceedToPayButton.click();

    // Verify UPI modal elements
    await expect(bookingPage.upiModal.heading).toBeVisible();
    await expect(bookingPage.upiModal.upiIdText).toBeVisible();
    await expect(page.getByText('DirtFree Cleaning Services')).toBeVisible();

    // Verify dynamic NPCI QR Image is generated
    const qrImage = page.locator('img[alt="UPI Payment QR Code"]');
    await expect(qrImage).toBeVisible();
    const qrSrc = await qrImage.getAttribute('src');
    expect(qrSrc).toContain('api.qrserver.com');
    expect(qrSrc).toContain('9691998370%40ybl');

    // Verify Mobile Intent Link (PhonePe / GPay / Paytm)
    const intentLink = page.getByRole('link', { name: /Open in PhonePe \/ GPay \/ Paytm/i });
    await expect(intentLink).toBeVisible();
    const href = await intentLink.getAttribute('href');
    expect(href).toContain('upi://pay?pa=9691998370@ybl');
  });

  test('completes payment, displays confirmation, and clears cart on verified success', async ({ bookingPage, page }) => {
    await bookingPage.setupSession({ cart: sampleCartItems, user: sampleUser });
    await bookingPage.goto();

    await bookingPage.proceedToSlotButton.click();
    await bookingPage.selectSlot('Morning Slot');
    await bookingPage.nextToAddressButton.click();

    await bookingPage.fillAddressForm({
      name: 'Vikram Singh',
      phone: '9691998370',
      address: 'House 88, Sector 15, Vasundhara',
      pincode: '201012',
    });

    await bookingPage.proceedToPayButton.click();
    await expect(bookingPage.upiModal.heading).toBeVisible();

    // Trigger payment simulation
    await bookingPage.upiModal.simulateSuccess();

    // Verify Step 4 Success Screen
    await expect(bookingPage.successMessage).toBeVisible();
    await expect(bookingPage.viewInBookingsButton).toBeVisible();

    // Verify cart is now cleanly cleared on verified success
    const cartAfterSuccess = await bookingPage.getCartFromStorage();
    expect(cartAfterSuccess.length).toBe(0);
  });
});
