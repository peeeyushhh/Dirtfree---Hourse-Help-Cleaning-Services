import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/booking-store';
import { SecuritySanitizer } from '@/lib/security/sanitizer';
import { AuthGuard } from '@/lib/security/auth-guard';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPhone = searchParams.get('phone');

    if (!rawPhone) {
      return NextResponse.json(
        { success: false, error: 'Phone parameter is required to view bookings' },
        { status: 400 }
      );
    }

    const cleanPhone = SecuritySanitizer.normalizePhone(rawPhone) || rawPhone.replace(/\D/g, '').slice(-10);
    const bookings = await dbStore.getBookingsByPhone(cleanPhone);

    return NextResponse.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error processing booking lookup' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Client App Key verification (protects against unauthorized automated bot submission)
    if (!AuthGuard.verifyClientKey(request)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Missing or invalid DirtFree application signature',
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 2. Prototype Pollution Defense
    if (SecuritySanitizer.detectPrototypePollution(body)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload structure: Potential security hazard detected' },
        { status: 400 }
      );
    }

    const { customerName, phone, serviceId, tierId, date, slotId, address, paymentMethod, notes } = body;

    // 3. Strict Input Validation & XSS Sanitization
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Valid customer name is required' },
        { status: 400 }
      );
    }
    const cleanName = SecuritySanitizer.sanitizeString(customerName, 80);

    const cleanPhone = SecuritySanitizer.normalizePhone(phone);
    if (!cleanPhone) {
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

    const sanitizedAddress = {
      flatNo: SecuritySanitizer.sanitizeString(address.flatNo, 80),
      building: SecuritySanitizer.sanitizeString(address.building, 100),
      landmark: SecuritySanitizer.sanitizeString(address.landmark || '', 100),
      city: SecuritySanitizer.sanitizeString(address.city || 'Mumbai', 50),
      pincode: SecuritySanitizer.sanitizeString(address.pincode, 10),
      type: (['Home', 'Office', 'Other'].includes(address.type) ? address.type : 'Home') as 'Home' | 'Office' | 'Other',
    };

    const sanitizedNotes = notes ? SecuritySanitizer.sanitizeString(notes, 300) : undefined;

    const booking = await dbStore.createBooking({
      customerName: cleanName,
      phone: cleanPhone,
      serviceId,
      tierId,
      date,
      slotId,
      address: sanitizedAddress,
      paymentMethod,
      notes: sanitizedNotes,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Booking confirmed successfully',
        data: booking,
        booking,
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
