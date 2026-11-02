import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SecuritySanitizer } from '../src/lib/security/sanitizer.ts';
import { rateLimiter } from '../src/lib/security/rate-limiter.ts';
import { AuthGuard, APP_CLIENT_KEY } from '../src/lib/security/auth-guard.ts';

describe('=== DirtFree Comprehensive API & Key Security Audit ===', () => {

  // 1. INPUT SANITIZATION & XSS PROTECTION
  describe('1. Sanitization & Anti-Injection Guard', () => {
    it('strips <script> tags and malicious vectors from customer names', () => {
      const maliciousName = "<script>alert('pwned')</script>Dr. John Doe";
      const sanitized = SecuritySanitizer.sanitizeString(maliciousName);
      assert.equal(sanitized, 'Dr. John Doe', 'Must completely strip script tags');
      assert.ok(!sanitized.includes('<script>'), 'Must not contain script tags');
    });

    it('neutralizes inline event handlers (onerror=, onclick=)', () => {
      const payload = '<img src=x onerror=alert(document.cookie)>Tower A';
      const sanitized = SecuritySanitizer.sanitizeString(payload);
      assert.equal(sanitized, 'Tower A');
    });

    it('sanitizes and strictly normalizes 10-digit Indian mobile numbers', () => {
      assert.equal(SecuritySanitizer.normalizePhone('+91 99304-88722'), '9930488722');
      assert.equal(SecuritySanitizer.normalizePhone('09930488722'), '9930488722');
      assert.equal(SecuritySanitizer.normalizePhone('9930488722'), '9930488722');
      assert.equal(SecuritySanitizer.normalizePhone('12345'), null, 'Short numbers must be rejected');
      assert.equal(SecuritySanitizer.normalizePhone('abcdefghij'), null, 'Non-digits must be rejected');
    });

    it('detects and blocks Prototype Pollution attacks', () => {
      const maliciousPayload = JSON.parse('{"customerName":"Hacker", "__proto__": {"admin": true}}');
      const isDangerous = SecuritySanitizer.detectPrototypePollution(maliciousPayload);
      assert.equal(isDangerous, true, 'Must detect __proto__ prototype pollution attack');

      const safePayload = { customerName: 'Piyush', address: { flatNo: '101' } };
      assert.equal(SecuritySanitizer.detectPrototypePollution(safePayload), false);
    });
  });

  // 2. SLIDING-WINDOW RATE LIMITING
  describe('2. Rate Limiting Engine', () => {
    it('allows requests within threshold and tracks remaining budget', () => {
      const testIp = '10.0.0.1';
      const firstCheck = rateLimiter.check(testIp, 'WRITE');
      assert.equal(firstCheck.allowed, true);
      assert.equal(firstCheck.limit, 15);
      assert.ok(firstCheck.remaining < 15);
    });

    it('enforces HTTP 429 throttle when limit is reached', () => {
      const spammerIp = '10.0.0.99';
      // Consume all 15 write requests
      for (let i = 0; i < 15; i++) {
        rateLimiter.check(spammerIp, 'WRITE');
      }

      // 16th request must be blocked
      const blockedCheck = rateLimiter.check(spammerIp, 'WRITE');
      assert.equal(blockedCheck.allowed, false, 'Must block requests after limit is reached');
      assert.equal(blockedCheck.remaining, 0);
      assert.ok(blockedCheck.resetSeconds > 0, 'Must provide reset countdown for Retry-After header');
    });
  });

  // 3. CLIENT APP KEY & AUTHORIZATION GUARD
  describe('3. Application Signature & Key Protection', () => {
    it('authenticates valid client key from DirtFree mobile app', () => {
      const mockRequest = {
        headers: new Headers({
          'x-dirtfree-app-key': APP_CLIENT_KEY,
        }),
      };
      const isAuthorized = AuthGuard.verifyClientKey(mockRequest);
      assert.equal(isAuthorized, true, 'Legitimate app key must be authorized');
    });

    it('rejects bot requests with missing or forged keys', () => {
      const botRequest = {
        headers: new Headers({
          'user-agent': 'python-requests/2.28.1',
          'x-dirtfree-app-key': 'malicious_forged_key',
        }),
      };
      const isAuthorized = AuthGuard.verifyClientKey(botRequest);
      assert.equal(isAuthorized, false, 'Forged key must be blocked');
    });

    it('safely extracts client IP behind proxies', () => {
      const proxyRequest = {
        headers: new Headers({
          'x-forwarded-for': '203.0.113.195, 10.0.0.1',
        }),
      };
      const ip = AuthGuard.getClientIp(proxyRequest);
      assert.equal(ip, '203.0.113.195', 'Must extract genuine origin IP, ignoring proxy hop');
    });
  });

});
