import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/booking-store';
import { SecuritySanitizer } from '@/lib/security/sanitizer';
import { AuthGuard } from '@/lib/security/auth-guard';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPhone = searchParams.get('phone');

    if (rawPhone) {
      const cleanPhone = SecuritySanitizer.normalizePhone(rawPhone) || rawPhone.replace(/\D/g, '').slice(-10);
      const list = dbStore.getSubscriptionsByPhone(cleanPhone);
      return NextResponse.json({
        success: true,
        subscriptions: list,
      });
    }

    return NextResponse.json({
      success: true,
      subscriptions: [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal error retrieving subscription routines' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Client App Key verification
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

    const {
      customerName,
      phone,
      serviceId,
      tierId,
      frequency,
      preferredDay,
      slotId,
      address,
      startDate,
    } = body;

    if (!customerName || !phone || !frequency || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required subscription fields' },
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

    const validFrequencies = ['WEEKLY', 'BI_WEEKLY', 'MONTHLY'];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { success: false, error: 'Invalid cadence frequency (must be WEEKLY, BI_WEEKLY, or MONTHLY)' },
        { status: 400 }
      );
    }

    const sanitizedAddress = {
      flatNo: SecuritySanitizer.sanitizeString(address.flatNo || '', 80),
      building: SecuritySanitizer.sanitizeString(address.building || '', 100),
      landmark: SecuritySanitizer.sanitizeString(address.landmark || '', 100),
      city: SecuritySanitizer.sanitizeString(address.city || 'Mumbai', 50),
      pincode: SecuritySanitizer.sanitizeString(address.pincode || '', 10),
      type: (['Home', 'Office', 'Other'].includes(address.type) ? address.type : 'Home') as 'Home' | 'Office' | 'Other',
    };

    const subscription = dbStore.createSubscription({
      customerName: cleanName,
      phone: cleanPhone,
      serviceId: serviceId || 'full-home-cleaning',
      tierId: tierId || 'tier-1bhk',
      frequency,
      preferredDay: preferredDay || 'Saturday',
      slotId: slotId || 'morning',
      address: sanitizedAddress,
      startDate,
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      subscription,
      data: subscription,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create subscription' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Subscription id and target status are required' },
        { status: 400 }
      );
    }

    const updated = dbStore.updateSubscriptionStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Subscription not found: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update subscription status' },
      { status: 400 }
    );
  }
}
