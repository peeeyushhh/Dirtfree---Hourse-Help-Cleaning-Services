import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'https://130-210-35-73.sslip.io/api/v1';

describe('=== DirtFree End-to-End & Integration Test Suite ===', () => {

  // 1. SERVICES INVENTORY
  describe('1. Services Catalog API (/api/v1/services)', () => {
    it('returns 200 OK with valid JSON and non-empty array of services', async () => {
      const res = await fetch(`${BASE_URL}/services`);
      assert.equal(res.status, 200, 'Expected HTTP 200');
      const data = await res.json();
      assert.equal(data.success, true, 'success field must be true');
      assert.ok(Array.isArray(data.data), 'data must be an array');
      assert.ok(data.data.length >= 3, 'Must have at least 3 active cleaning services');

      // Schema verification
      const first = data.data[0];
      assert.ok(first.id, 'Service must have an id');
      assert.ok(first.title, 'Service must have a title');
      assert.ok(typeof first.startingPrice === 'number', 'startingPrice must be number');
      assert.ok(Array.isArray(first.tiers), 'tiers must be an array');
      assert.ok(first.tiers.length >= 1, 'Service must have package tiers');
    });

    it('validates tier pricing integrity (price > 0 and originalPrice >= price)', async () => {
      const res = await fetch(`${BASE_URL}/services`);
      const { data } = await res.json();
      for (const service of data) {
        for (const tier of service.tiers) {
          assert.ok(tier.price > 0, `Tier ${tier.name} price should be > 0`);
          assert.ok(
            tier.originalPrice >= tier.price,
            `Tier ${tier.name} originalPrice (${tier.originalPrice}) must be >= price (${tier.price})`
          );
        }
      }
    });
  });

  // 2. REAL-TIME SLOTS
  describe('2. Real-Time Capacity Slots API (/api/v1/slots)', () => {
    it('returns morning, afternoon, and evening slots for tomorrow', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      const res = await fetch(`${BASE_URL}/slots?date=${dateStr}`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(Array.isArray(data.slots), 'slots must be an array');
      assert.equal(data.slots.length, 3, 'Must provide 3 standard slots (morning, afternoon, evening)');

      const ids = data.slots.map(s => s.id);
      assert.deepEqual(ids.sort(), ['afternoon', 'evening', 'morning'].sort());
    });
  });

  // 3. BOOKING CREATION & VALIDATION
  describe('3. Booking Engine API (/api/v1/bookings)', () => {
    it('rejects booking with missing customer name (HTTP 400)', async () => {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '9876543210',
          serviceId: 'deep-cleaning',
        }),
      });
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.ok(data.error.includes('customer name') || data.error.includes('name'));
    });

    it('rejects booking with invalid phone number (< 10 digits) (HTTP 400)', async () => {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Piyush Sharma',
          phone: '12345',
          serviceId: 'full-home-cleaning',
          tierId: 'tier-1bhk',
          date: '2026-11-10',
          slotId: 'morning',
          address: { flatNo: '101', building: 'Tower A', pincode: '400001' },
        }),
      });
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.ok(data.error.includes('mobile number') || data.error.includes('phone'));
    });

    it('successfully creates booking with valid payload and returns 4-digit OTP', async () => {
      const testPhone = '9998887776';
      // Use dynamic date to avoid slot capacity collisions
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 20) + 5);
      const testDate = futureDate.toISOString().split('T')[0];

      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Test Automation Suite',
          phone: testPhone,
          serviceId: 'full-home-cleaning',
          tierId: 'tier-1bhk',
          date: testDate,
          slotId: 'morning',
          address: {
            flatNo: '702',
            building: 'Automated Testing Tower',
            landmark: 'Near Quality Park',
            city: 'Mumbai',
            pincode: '400053',
            type: 'Home',
          },
          paymentMethod: 'PAY_AFTER_SERVICE',
        }),
      });

      assert.equal(res.status, 201, 'Expected HTTP 201 Created');
      const json = await res.json();
      assert.equal(json.success, true);
      const booking = json.data || json.booking;
      assert.ok(booking, 'Must return created booking');
      assert.ok(booking.id.startsWith('DF-') || booking.id.startsWith('BK-'), 'Booking ID must start with DF- or BK-');
      assert.match(booking.otp, /^\d{4}$/, 'OTP must be exactly 4 digits for customer verification');
      assert.equal(booking.status, 'CONFIRMED');
      assert.ok(booking.partner, 'Must assign a verified partner');
      assert.equal(booking.partner.uniformVerified, true, 'Partner must be uniform-verified');
    });

    it('retrieves bookings by customer phone query', async () => {
      const testPhone = '9998887776';
      const res = await fetch(`${BASE_URL}/bookings?phone=${testPhone}`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(Array.isArray(data.data));
      assert.ok(data.data.length >= 1, 'Should find at least 1 booking for test phone');
      assert.equal(data.data[0].phone, testPhone);
    });
  });

  // 4. PRONTO RECURRING ROUTINES
  describe('4. Recurring Routines & Subscriptions API (/api/v1/subscriptions)', () => {
    it('creates weekly routine with 20% discount applied', async () => {
      const testPhone = '9998887775';
      const res = await fetch(`${BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Aarav Mehta',
          phone: testPhone,
          serviceId: 'full-home-cleaning',
          tierId: 'tier-1bhk',
          frequency: 'WEEKLY',
          preferredDay: 'Sunday',
          slotId: 'morning',
          address: {
            flatNo: '304',
            building: 'Skyline Palms',
            city: 'Bangalore',
            pincode: '560001',
            type: 'Home',
          },
          startDate: '2026-11-20',
        }),
      });

      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.subscription, 'Must return created subscription');
      assert.ok(data.subscription.id.startsWith('SUB-'), 'Subscription ID must start with SUB-');
      assert.equal(data.subscription.frequency, 'WEEKLY');
      assert.equal(data.subscription.discountPercentage, 20, 'Weekly must apply 20% routine discount');
    });

    it('fetches existing subscriptions by phone', async () => {
      const testPhone = '9998887775';
      const res = await fetch(`${BASE_URL}/subscriptions?phone=${testPhone}`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(Array.isArray(data.subscriptions));
      assert.ok(data.subscriptions.length >= 1, 'Must retrieve the created routine');
    });
  });

  // 5. ADVERSARIAL & SECURITY TESTING (break-ui / security-testing-verification)
  describe('5. Adversarial Input & Security Verification', () => {
    it('handles long customer name without server crash (Break-UI boundary test)', async () => {
      const veryLongName = 'Aleksandra Wisniewska-Kowalczyk von Hohenzollern-Sigmaringen The Third of Cambridge';
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 20) + 15);
      const testDate = futureDate.toISOString().split('T')[0];

      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: veryLongName,
          phone: '9876543210',
          serviceId: 'full-home-cleaning',
          tierId: 'tier-1bhk',
          date: testDate,
          slotId: 'afternoon',
          address: { flatNo: '1', building: 'Test Bldg', pincode: '400001' },
          paymentMethod: 'PAY_AFTER_SERVICE',
        }),
      });
      assert.equal(res.status, 201);
      const json = await res.json();
      const booking = json.data || json.booking;
      assert.ok(booking, 'Must return created booking');
      assert.equal(booking.customerName, veryLongName);
    });

    it('neutralizes SQL injection attempt in phone parameter safely', async () => {
      const maliciousPhone = "' OR '1'='1' --";
      const res = await fetch(`${BASE_URL}/bookings?phone=${encodeURIComponent(maliciousPhone)}`);
      // Should not crash or dump database
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.data.length, 0, 'Must return 0 records for non-matching injected phone');
    });

    it('rejects unsupported HTTP methods gracefully', async () => {
      const res = await fetch(`${BASE_URL}/services`, { method: 'DELETE' });
      assert.ok(res.status === 405 || res.status === 404, 'Must reject unsupported DELETE on services');
    });
  });

});
