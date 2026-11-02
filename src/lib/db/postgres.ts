import { Pool, QueryResult, QueryResultRow } from 'pg';
import fs from 'node:fs';
import path from 'node:path';

// Singleton connection pool for PostgreSQL
let pool: Pool | null = null;
let isSchemaInitialized = false;

export function getPostgresPool(): Pool | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 15,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client pool:', err);
    });
  }

  return pool;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const p = getPostgresPool();
  if (!p) {
    throw new Error('DATABASE_URL is not configured');
  }
  return p.query<T>(text, params);
}

/**
 * Initializes tables and triggers auto-migration from init-db.sql if available
 */
export async function ensurePostgresSchema(): Promise<boolean> {
  const p = getPostgresPool();
  if (!p || isSchemaInitialized) return Boolean(p);

  try {
    // 1. Check or execute DDL
    const ddl = `
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        rating NUMERIC(3, 2) DEFAULT 4.90,
        reviews_count INT DEFAULT 0,
        starting_price NUMERIC(10, 2) NOT NULL,
        image TEXT NOT NULL,
        badge VARCHAR(100),
        description TEXT NOT NULL,
        tiers JSONB NOT NULL DEFAULT '[]'::jsonb,
        inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
        exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS slots (
        id VARCHAR(50) PRIMARY KEY,
        label VARCHAR(100) NOT NULL,
        time_range VARCHAR(100) NOT NULL,
        period VARCHAR(50) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        max_capacity INT NOT NULL DEFAULT 8
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(150) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        service_id VARCHAR(100) NOT NULL,
        service_name VARCHAR(255) NOT NULL,
        tier_id VARCHAR(100) NOT NULL,
        tier_name VARCHAR(255) NOT NULL,
        booking_date DATE NOT NULL,
        slot_id VARCHAR(50) NOT NULL,
        slot_time VARCHAR(100) NOT NULL,
        address JSONB NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL DEFAULT 'PAY_AFTER_SERVICE',
        otp VARCHAR(10) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
        partner JSONB,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone);
      CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

      CREATE TABLE IF NOT EXISTS subscriptions (
        id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(150) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        service_id VARCHAR(100) NOT NULL,
        service_name VARCHAR(255) NOT NULL,
        tier_id VARCHAR(100) NOT NULL,
        tier_name VARCHAR(255) NOT NULL,
        frequency VARCHAR(50) NOT NULL,
        preferred_day VARCHAR(50) NOT NULL,
        slot_id VARCHAR(50) NOT NULL,
        slot_time VARCHAR(100) NOT NULL,
        address JSONB NOT NULL,
        per_visit_amount NUMERIC(10, 2) NOT NULL,
        discount_percentage INT DEFAULT 20,
        status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
        next_visits JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_subscriptions_phone ON subscriptions(phone);
    `;

    await p.query(ddl);
    isSchemaInitialized = true;
    return true;
  } catch (err) {
    console.warn('PostgreSQL Schema Initialization notice:', err);
    return false;
  }
}

export async function checkPostgresHealth(): Promise<{
  isConnected: boolean;
  provider: 'PostgreSQL' | 'Local File Store';
  error?: string;
  tables?: {
    bookings: number;
    subscriptions: number;
    services: number;
  };
}> {
  const p = getPostgresPool();
  if (!p) {
    return {
      isConnected: false,
      provider: 'Local File Store',
      error: 'DATABASE_URL not set (running on resilient in-memory/JSON store)',
    };
  }

  try {
    await ensurePostgresSchema();
    const res = await p.query('SELECT NOW() as current_time');
    const bookingsCount = await p.query('SELECT COUNT(*) as count FROM bookings');
    const subsCount = await p.query('SELECT COUNT(*) as count FROM subscriptions');
    const servicesCount = await p.query('SELECT COUNT(*) as count FROM services');

    return {
      isConnected: Boolean(res.rows[0]?.current_time),
      provider: 'PostgreSQL',
      tables: {
        bookings: parseInt(bookingsCount.rows[0]?.count || '0', 10),
        subscriptions: parseInt(subsCount.rows[0]?.count || '0', 10),
        services: parseInt(servicesCount.rows[0]?.count || '0', 10),
      },
    };
  } catch (err: any) {
    return {
      isConnected: false,
      provider: 'Local File Store',
      error: err?.message || 'Database connection error',
    };
  }
}
