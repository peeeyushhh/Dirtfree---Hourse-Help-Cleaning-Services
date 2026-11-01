import { test, expect } from '@playwright/test';

test.describe('API Contracts & Data Endpoints', () => {
  test('GET /api/cities returns active operating cities', async ({ request }) => {
    const response = await request.get('/api/cities');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('cities');
    expect(Array.isArray(data.cities)).toBe(true);
    expect(data.cities.length).toBeGreaterThan(0);

    const firstCity = data.cities[0];
    expect(firstCity).toHaveProperty('id');
    expect(firstCity).toHaveProperty('name');
  });

  test('GET /api/categories returns cleaning categories', async ({ request }) => {
    const response = await request.get('/api/categories');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('categories');
    expect(Array.isArray(data.categories)).toBe(true);
    expect(data.categories.length).toBeGreaterThan(0);

    const firstCategory = data.categories[0];
    expect(firstCategory).toHaveProperty('id');
    expect(firstCategory).toHaveProperty('title');
  });

  test('GET /api/services returns catalog items with prices and tiers', async ({ request }) => {
    const response = await request.get('/api/services');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('services');
    expect(Array.isArray(data.services)).toBe(true);
    expect(data.services.length).toBeGreaterThan(0);

    const firstService = data.services[0];
    expect(firstService).toHaveProperty('id');
    expect(firstService).toHaveProperty('name');
    expect(firstService).toHaveProperty('category');
    expect(firstService).toHaveProperty('price');
    expect(typeof firstService.price).toBe('number');
  });

  test('POST /api/payments/create-intent generates valid checkout response', async ({ request }) => {
    const response = await request.post('/api/payments/create-intent', {
      data: {
        orderId: `TEST-${Date.now()}`,
        amount: 1499,
        customerName: 'Playwright QA Bot',
        customerPhone: '9876543210',
        customerEmail: 'qa-bot@dirtfree.test',
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('checkoutUrl');
    expect(data.checkoutUrl).toContain('/orders?payment_success=');
  });
});
