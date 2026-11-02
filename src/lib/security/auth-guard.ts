/**
 * DirtFree Client App Authentication & Key Protection Guard
 * Verifies that requests to private/write APIs originate from authentic DirtFree apps
 * and prevents unauthorized external scrapers/bots from draining resources.
 */

import type { NextRequest } from 'next/server';

export const APP_CLIENT_KEY = process.env.DIRTFREE_CLIENT_APP_KEY || 'df_client_app_v1_secure_live';
export const ADMIN_SECRET_KEY = process.env.DIRTFREE_ADMIN_SECRET || 'df_admin_sec_9930488722_ops';

export class AuthGuard {
  /**
   * Safely extract the client IP address from proxy headers
   */
  public static getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
      return realIp.trim();
    }
    return '127.0.0.1';
  }

  /**
   * Verify if the request carries a valid DirtFree client app key or internal authorization
   */
  public static verifyClientKey(request: NextRequest): boolean {
    const clientKey = request.headers.get('x-dirtfree-app-key') || request.headers.get('x-api-key');
    if (clientKey && (clientKey === APP_CLIENT_KEY || clientKey === ADMIN_SECRET_KEY)) {
      return true;
    }

    // Allow requests originating from our own verified domain or localhost dev
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('dirtfree.in') ||
      origin.includes('130-210-35-73.sslip.io')
    ) {
      return true;
    }

    return false;
  }

  /**
   * Verify administrative secret for management endpoints
   */
  public static verifyAdmin(request: NextRequest): boolean {
    const adminKey = request.headers.get('x-admin-secret') || request.headers.get('authorization');
    if (!adminKey) return false;
    const token = adminKey.replace(/^Bearer\s+/i, '');
    return token === ADMIN_SECRET_KEY;
  }
}
