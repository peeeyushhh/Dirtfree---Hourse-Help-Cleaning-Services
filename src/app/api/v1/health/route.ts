import { NextResponse } from 'next/server';
import { checkPostgresHealth } from '@/lib/db/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbHealth = await checkPostgresHealth();

  return NextResponse.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'DirtFree API Cluster',
    database: {
      provider: dbHealth.provider,
      connected: dbHealth.isConnected,
      tables: dbHealth.tables || null,
      message: dbHealth.error || 'PostgreSQL database connection healthy',
    },
  });
}
