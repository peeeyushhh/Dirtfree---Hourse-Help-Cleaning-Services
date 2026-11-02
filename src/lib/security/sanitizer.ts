/**
 * DirtFree Input Sanitization & Anti-Injection Guard
 * Blocks XSS, SQLi fragments, Prototype Pollution, and Malformed Payloads.
 */

export class SecuritySanitizer {
  /**
   * Strip HTML tags, script vectors, and event handlers
   */
  public static sanitizeString(input: unknown, maxLength: number = 255): string {
    if (typeof input !== 'string') return '';

    // Strip complete <script>...</script> and <style>...</style> blocks including contents
    let cleaned = input
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>?/gm, '') // Remove remaining HTML tags
      .replace(/javascript:/gi, '') // Remove JS URI schemes
      .replace(/on\w+\s*=/gi, '') // Remove inline event handlers (onclick=, etc.)
      .replace(/['";\\]/g, (char) => {
        // Neutralize SQL/shell delimiters
        const map: Record<string, string> = {
          "'": '&#39;',
          '"': '&quot;',
          ';': '&#59;',
          '\\': '&#92;',
        };
        return map[char] || char;
      })
      .trim();

    if (cleaned.length > maxLength) {
      cleaned = cleaned.slice(0, maxLength);
    }

    return cleaned;
  }

  /**
   * Validate and clean 10-digit Indian mobile number
   */
  public static normalizePhone(phone: unknown): string | null {
    if (typeof phone !== 'string') return null;
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return digits;
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    return null;
  }

  /**
   * Guard against Prototype Pollution in nested objects
   */
  public static detectPrototypePollution(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;

    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

    const check = (target: any): boolean => {
      for (const key of Object.keys(target)) {
        if (dangerousKeys.includes(key)) return true;
        if (target[key] && typeof target[key] === 'object') {
          if (check(target[key])) return true;
        }
      }
      return false;
    };

    return check(obj);
  }
}
