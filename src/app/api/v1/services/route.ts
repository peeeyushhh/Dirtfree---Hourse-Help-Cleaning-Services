import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/booking-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = await dbStore.getServices();
    return NextResponse.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

