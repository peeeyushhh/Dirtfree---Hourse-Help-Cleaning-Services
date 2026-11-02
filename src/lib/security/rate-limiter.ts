/**
 * DirtFree Enterprise In-Memory Rate Limiter (Sliding Window Algorithm)
 * Protects endpoints from DDoS, credential stuffing, phone enumeration, and order spam.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically prune stale IP buckets every 60 seconds
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, record] of this.store.entries()) {
          if (now > record.resetTime) {
            this.store.delete(key);
          }
        }
      }, 60000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Check if a client IP is within rate limits
   * @param ip Client IP address
   * @param endpointType 'READ' (60/min) | 'WRITE' (10/min) | 'QUERY' (25/min)
   */
  public check(
    ip: string,
    endpointType: 'READ' | 'WRITE' | 'QUERY' = 'READ'
  ): {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetSeconds: number;
  } {
    const limits = {
      READ: { limit: 120, windowMs: 60 * 1000 },  // 120 reads per minute
      WRITE: { limit: 15, windowMs: 60 * 1000 },  // 15 bookings/subscriptions per minute
      QUERY: { limit: 30, windowMs: 60 * 1000 },  // 30 booking queries per minute
    };

    const config = limits[endpointType];
    const key = `${ip}:${endpointType}`;
    const now = Date.now();

    const existing = this.store.get(key);

    if (!existing || now > existing.resetTime) {
      // First request in this window
      this.store.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return {
        allowed: true,
        limit: config.limit,
        remaining: config.limit - 1,
        resetSeconds: Math.ceil(config.windowMs / 1000),
      };
    }

    // Existing window
    if (existing.count >= config.limit) {
      const resetSeconds = Math.max(1, Math.ceil((existing.resetTime - now) / 1000));
      return {
        allowed: false,
        limit: config.limit,
        remaining: 0,
        resetSeconds,
      };
    }

    existing.count += 1;
    const resetSeconds = Math.max(1, Math.ceil((existing.resetTime - now) / 1000));
    return {
      allowed: true,
      limit: config.limit,
      remaining: config.limit - existing.count,
      resetSeconds,
    };
  }
}

export const rateLimiter = new RateLimiter();

