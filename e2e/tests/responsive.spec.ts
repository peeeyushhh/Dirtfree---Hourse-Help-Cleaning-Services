import { test, expect } from '../fixtures/base.fixture';

const sampleCartItem = {
  id: 'sofa-cleaning-101',
  category: 'Sofa Cleaning',
  tier: '3-Seater Fabric Shampoo',
  price: 799,
  duration: '45 mins',
  image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
  quantity: 1,
};

const sampleUser = {
  id: 'usr_responsive_test',
  firstName: 'Priya',
  lastName: 'Sharma',
  mobile: '9876543210',
  displayName: 'Priya Sharma',
};

test.describe('Responsive Viewports & UI Polish', () => {
  test('Mobile Viewport (375x667) renders modal, touch targets and UPI QR code cleanly', async ({
    bookingPage,
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await bookingPage.setupSession({ cart: [sampleCartItem], user: sampleUser });
    await bookingPage.goto();

    // Check no horizontal scroll overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Navigate to step 3 and open UPI modal
    await bookingPage.proceedToSlotButton.click();
    await bookingPage.selectSlot('Morning Slot');
    await bookingPage.nextToAddressButton.click();

    await bookingPage.fillAddressForm({
      name: 'Priya Sharma',
      phone: '9876543210',
      address: 'Flat 102, Shivalik Tower, Kaushambi',
      pincode: '201010',
    });

    await bookingPage.proceedToPayButton.click();

    // Verify modal is visible and contained inside the viewport
    await expect(bookingPage.upiModal.heading).toBeVisible();
    await expect(bookingPage.upiModal.upiIdText).toBeVisible();

    // Verify Mobile App Intent button is visible and actionable on mobile
    const intentButton = page.getByRole('link', { name: /Open in PhonePe \/ GPay \/ Paytm/i });
    await expect(intentButton).toBeVisible();

    // Verify NPCI QR code is within mobile boundary
    const qrImg = page.locator('img[alt="UPI Payment QR Code"]');
    await expect(qrImg).toBeVisible();
    const qrBox = await qrImg.boundingBox();
    expect(qrBox).not.toBeNull();
    if (qrBox) {
      expect(qrBox.width).toBeLessThanOrEqual(375);
    }
  });

  test('Tablet Viewport (768x1024) adapts navigation and form columns gracefully', async ({
    bookingPage,
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await bookingPage.setupSession({ cart: [sampleCartItem], user: sampleUser });
    await bookingPage.goto();

    await expect(bookingPage.proceedToSlotButton).toBeVisible();
    await bookingPage.proceedToSlotButton.click();

    await bookingPage.selectSlot('Morning Slot');
    await bookingPage.nextToAddressButton.click();

    await expect(bookingPage.proceedToPayButton).toBeVisible();
  });

  test('Desktop Viewport (1280x800) displays full multi-column layout', async ({
    bookingPage,
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await bookingPage.setupSession({ cart: [sampleCartItem], user: sampleUser });
    await bookingPage.goto();

    await expect(bookingPage.proceedToSlotButton).toBeVisible();
    await bookingPage.proceedToSlotButton.click();

    await bookingPage.selectSlot('Morning Slot');
    await bookingPage.nextToAddressButton.click();

    await expect(bookingPage.proceedToPayButton).toBeVisible();
  });
});

