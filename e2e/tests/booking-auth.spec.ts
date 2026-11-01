import { test, expect } from '../fixtures/base.fixture';

const sampleCartItem = {
  id: 'sofa-standard-101',
  category: 'Sofa Cleaning',
  tier: '3-Seater Fabric Shampoo',
  price: 799,
  duration: '45 mins',
  image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
  quantity: 1,
};

const sampleUser = {
  id: 'usr_playwright_test',
  firstName: 'Aman',
  lastName: 'Verma',
  mobile: '9876543210',
  displayName: 'Aman Verma',
};

test.describe('Booking Flow & Authentication Guard', () => {
  test('displays empty cart state when no services are added', async ({ bookingPage }) => {
    await bookingPage.setupSession({ cart: [] });
    await bookingPage.goto();

    await expect(bookingPage.emptyCartHeading).toBeVisible();
    await expect(bookingPage.exploreServicesButton).toBeVisible();
  });

  test('enforces sign-in for unauthenticated guests at Step 3', async ({ bookingPage, page }) => {
    // 1. Setup session with cart item and unauthenticated state
    await bookingPage.setupSession({ cart: [sampleCartItem], user: null });
    await bookingPage.goto();

    // 2. Step 1: Verify cart item and proceed
    await expect(page.getByText('3-Seater Fabric Shampoo')).toBeVisible();
    await bookingPage.proceedToSlotButton.click();

    // 3. Step 2: Select Date & Time slot
    await bookingPage.selectSlot('Morning Slot');
    await bookingPage.nextToAddressButton.click();

    // 4. Step 3: Fill address details
    await bookingPage.fillAddressForm({
      name: 'Pooja Sharma',
      phone: '9876543210',
      address: 'Flat 402, Lotus Boulevard, Sector 100',
      pincode: '201304',
    });

    // 5. Verify authentication guard is active
    await expect(bookingPage.signInToPlaceOrderButton).toBeVisible();

    // 6. Clicking "Sign In to Place Order" opens the AuthModal
    await bookingPage.signInToPlaceOrderButton.click();
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
    await expect(page.getByText('or with mobile password')).toBeVisible();
  });

  test('permits authenticated users to proceed with order payment', async ({ bookingPage }) => {
    await bookingPage.setupSession({ cart: [sampleCartItem], user: sampleUser });
    await bookingPage.goto();

    // Step 1 -> Step 2
    await bookingPage.proceedToSlotButton.click();

    // Step 2 -> Step 3
    await bookingPage.selectSlot('Morning Slot');
    await bookingPage.nextToAddressButton.click();

    // Step 3: Verified authenticated state
    await bookingPage.fillAddressForm({
      name: 'Aman Verma',
      phone: '9876543210',
      address: 'B-12, Indirapuram, Ghaziabad',
      pincode: '201014',
    });

    // Payment action button is visible and active for signed-in user
    await expect(bookingPage.proceedToPayButton).toBeVisible();
  });
});
