import { test as base } from '@playwright/test';
import { BookingPage } from '../pages/booking.page';

type TestFixtures = {
  bookingPage: BookingPage;
};

export const test = base.extend<TestFixtures>({
  bookingPage: async ({ page }, use) => {
    const bookingPage = new BookingPage(page);
    await use(bookingPage);
  },
});

export { expect } from '@playwright/test';

