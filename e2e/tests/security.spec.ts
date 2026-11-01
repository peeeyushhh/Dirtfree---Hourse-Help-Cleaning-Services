import { test, expect } from '@playwright/test';

test.describe('Automated Security & Negative Testing', () => {
  test('SEC-01: Rejects missing required parameters on payment intent creation', async ({ request }) => {
    const response = await request.post('/api/payments/create-intent', {
      data: {
        amount: 1499,
        // orderId intentionally omitted
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toContain('orderId');
  });

  test('SEC-02: Rejects invalid JSON payloads on payment webhook endpoint', async ({ request }) => {
    const response = await request.post('/api/payments/webhook', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: Buffer.from('{ malformed_unclosed_json: '),
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toContain('Invalid JSON payload');
  });

  test('SEC-03: Rejects incomplete contact inquiries missing mandatory fields', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {
        name: 'Incomplete User',
        // email and message missing
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('SEC-04: Rejects registration requests with empty passwords', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: {
        name: 'Insecure User',
        phone: '9876543210',
        password: '', // empty password
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('SEC-05: Non-existent endpoints or disallowed methods return appropriate HTTP status', async ({ request }) => {
    const response = await request.get('/api/payments/create-intent');
    // GET is not defined on create-intent, Next.js returns 405 Method Not Allowed
    expect(response.status()).toBe(405);
  });
});
