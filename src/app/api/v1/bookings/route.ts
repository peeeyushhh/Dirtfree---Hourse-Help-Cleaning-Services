import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/booking-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone parameter is required to view bookings' },
        { status: 400 }
      );
    }

    const bookings = dbStore.getBookingsByPhone(phone);
    return NextResponse.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { customerName, phone, serviceId, tierId, date, slotId, address, paymentMethod, notes } = body;

    // Strict input validation
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Valid customer name is required' },
        { status: 400 }
      );
    }

    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Valid 10-digit mobile number is required' },
        { status: 400 }
      );
    }

    if (!serviceId || !tierId) {
      return NextResponse.json(
        { success: false, error: 'Service and package tier must be selected' },
        { status: 400 }
      );
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Valid booking date (YYYY-MM-DD) is required' },
        { status: 400 }
      );
    }

    if (!['morning', 'afternoon', 'evening'].includes(slotId)) {
      return NextResponse.json(
        { success: false, error: 'Valid slot (morning, afternoon, evening) is required' },
        { status: 400 }
      );
    }

    if (!address || !address.flatNo || !address.building || !address.pincode) {
      return NextResponse.json(
        { success: false, error: 'Complete address (Flat/House No, Building, Pincode) is required' },
        { status: 400 }
      );
    }

    const booking = dbStore.createBooking({
      customerName,
      phone,
      serviceId,
      tierId,
      date,
      slotId,
      address,
      paymentMethod,
      notes,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Booking confirmed successfully',
        data: booking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 400 }
    );
  }
}
