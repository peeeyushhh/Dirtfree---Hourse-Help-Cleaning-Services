import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/booking-store';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = dbStore.getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: `Booking not found: ${id}` },
        { status: 404 }
      );
    }

    // Step timeline mapping for mobile UI stepper
    const steps = [
      { key: 'CONFIRMED', label: 'Booking Confirmed', completed: true },
      {
        key: 'PARTNER_ASSIGNED',
        label: 'Partner Assigned',
        completed: ['PARTNER_ASSIGNED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status),
      },
      {
        key: 'ON_THE_WAY',
        label: 'Partner On The Way',
        completed: ['ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status),
      },
      {
        key: 'IN_PROGRESS',
        label: 'Cleaning In Progress',
        completed: ['IN_PROGRESS', 'COMPLETED'].includes(booking.status),
      },
      {
        key: 'COMPLETED',
        label: 'Completed & Inspected',
        completed: booking.status === 'COMPLETED',
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        ...booking,
        steps,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, partner } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const updated = dbStore.updateBookingStatus(id, status, partner);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Booking not found: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking updated',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update booking' },
      { status: 400 }
    );
  }
}
