import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/booking-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Expected YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const slots = dbStore.getSlotAvailability(date);

    return NextResponse.json({
      success: true,
      date,
      slots,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch slots' },
      { status: 500 }
    );
  }
}
