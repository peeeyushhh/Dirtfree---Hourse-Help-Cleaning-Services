import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('=== Mobile Client Reactive Store & Business Logic Tests ===', () => {

  // Simple in-memory mirror of the storage subscriber mechanism
  class ReactiveStore {
    constructor() {
      this.listeners = new Set();
      this.state = {
        hasSeenWelcome: false,
        selectedCity: 'Mumbai',
        user: {
          name: 'Guest',
          phone: '',
          isLoggedIn: false,
          walletBalance: 250,
        },
        appliedCoupon: {
          code: 'FIRST300',
          discountAmount: 300,
          minBooking: 799,
        },
        savedAddresses: [],
        activeBooking: null,
      };
    }

    subscribe(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    }

    notify() {
      for (const listener of this.listeners) {
        listener({ ...this.state });
      }
    }

    setHasSeenWelcome(val) {
      this.state.hasSeenWelcome = val;
      this.notify();
    }

    setSelectedCity(city) {
      this.state.selectedCity = city;
      this.notify();
    }

    login(name, phone) {
      this.state.user = {
        ...this.state.user,
        name,
        phone,
        isLoggedIn: true,
      };
      this.notify();
    }

    logout() {
      this.state.user.isLoggedIn = false;
      this.notify();
    }

    addAddress(addr) {
      this.state.savedAddresses.push(addr);
      this.notify();
    }

    calculateTotal(originalPrice, coupon, walletUsed = 0) {
      let finalPrice = originalPrice;
      if (coupon && originalPrice >= coupon.minBooking) {
        finalPrice -= coupon.discountAmount;
      }
      finalPrice = Math.max(0, finalPrice - walletUsed);
      return finalPrice;
    }
  }

  it('notifies subscribers immediately when state mutates', () => {
    const store = new ReactiveStore();
    let emittedCity = '';
    const unsub = store.subscribe((state) => {
      emittedCity = state.selectedCity;
    });

    store.setSelectedCity('Bangalore');
    assert.equal(emittedCity, 'Bangalore');

    unsub();
    store.setSelectedCity('Delhi NCR');
    assert.equal(emittedCity, 'Bangalore', 'Listener should not be called after unsubscribe');
  });

  it('manages login and logout lifecycle state correctly', () => {
    const store = new ReactiveStore();
    assert.equal(store.state.user.isLoggedIn, false);

    store.login('Piyush Sharma', '9876543210');
    assert.equal(store.state.user.isLoggedIn, true);
    assert.equal(store.state.user.name, 'Piyush Sharma');
    assert.equal(store.state.user.phone, '9876543210');

    store.logout();
    assert.equal(store.state.user.isLoggedIn, false);
  });

  it('correctly calculates discounts for valid coupons (FIRST300)', () => {
    const store = new ReactiveStore();
    const coupon = store.state.appliedCoupon;

    // Price below minBooking (₹500 < ₹799)
    const belowMin = store.calculateTotal(500, coupon);
    assert.equal(belowMin, 500, 'Discount must not apply when below minimum booking');

    // Price above minBooking (₹2499 >= ₹799)
    const aboveMin = store.calculateTotal(2499, coupon);
    assert.equal(aboveMin, 2199, 'Must apply ₹300 discount');

    // Wallet balance application
    const withWallet = store.calculateTotal(2499, coupon, 250);
    assert.equal(withWallet, 1949, 'Must apply ₹300 coupon + ₹250 wallet');
  });

  it('prevents total price from dropping below zero', () => {
    const store = new ReactiveStore();
    const coupon = store.state.appliedCoupon;
    const extremeTotal = store.calculateTotal(200, { minBooking: 100, discountAmount: 500 }, 100);
    assert.equal(extremeTotal, 0, 'Total price cannot be negative');
  });

  it('stores customer addresses safely without mutation collisions', () => {
    const store = new ReactiveStore();
    store.addAddress({ id: 'addr-1', flatNo: '101', building: 'Lotus', pincode: '400001' });
    store.addAddress({ id: 'addr-2', flatNo: '202', building: 'Rose', pincode: '400002' });

    assert.equal(store.state.savedAddresses.length, 2);
    assert.equal(store.state.savedAddresses[0].id, 'addr-1');
    assert.equal(store.state.savedAddresses[1].id, 'addr-2');
  });
});

