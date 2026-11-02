import fs from 'node:fs';
import path from 'node:path';
import { getPostgresPool, query, ensurePostgresSchema } from './postgres';

export interface ServiceTier {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  duration: string;
  features: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  rating: number;
  reviewsCount: number;
  startingPrice: number;
  image: string;
  badge?: string;
  description: string;
  tiers: ServiceTier[];
  inclusions: string[];
  exclusions: string[];
}

export interface TimeSlot {
  id: 'morning' | 'afternoon' | 'evening';
  label: string;
  timeRange: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  icon: string;
  maxCapacity: number;
}

export interface BookingAddress {
  flatNo: string;
  building: string;
  landmark?: string;
  city: string;
  pincode: string;
  type: 'Home' | 'Office' | 'Other';
}

export interface BookingRecord {
  id: string;
  customerName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  tierId: string;
  tierName: string;
  date: string; // YYYY-MM-DD
  slotId: 'morning' | 'afternoon' | 'evening';
  slotTime: string;
  address: BookingAddress;
  totalAmount: number;
  paymentMethod: 'PAY_AFTER_SERVICE' | 'UPI';
  otp: string;
  status: 'CONFIRMED' | 'PARTNER_ASSIGNED' | 'ON_THE_WAY' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  partner?: {
    name: string;
    phone: string;
    rating: number;
    uniformVerified: boolean;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionRecord {
  id: string; // SUB-XXXXX
  customerName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  tierId: string;
  tierName: string;
  frequency: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY';
  preferredDay: string; // e.g., 'Saturday'
  slotId: 'morning' | 'afternoon' | 'evening';
  slotTime: string;
  address: BookingAddress;
  perVisitAmount: number;
  discountPercentage: number;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  nextVisits: {
    date: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'SKIPPED';
  }[];
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  services: ServiceItem[];
  slots: TimeSlot[];
  bookings: BookingRecord[];
  subscriptions: SubscriptionRecord[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'dirtfree.db.json');

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'full-home-cleaning',
    title: 'Full Home Deep Cleaning',
    category: 'Home Care',
    rating: 4.9,
    reviewsCount: 1420,
    startingPrice: 2499,
    image: '/Images/full-home-clean.jpg',
    badge: 'Most Popular',
    description: 'Complete top-to-bottom sanitization and vacuuming of all rooms, balconies, and living areas with hospital-grade equipment.',
    tiers: [
      {
        id: 'tier-1bhk',
        name: '1 BHK Deep Clean',
        price: 2499,
        originalPrice: 3200,
        duration: '3 - 4 hrs',
        features: ['1 Bedroom, 1 Hall, 1 Kitchen, 1 Bath', 'Floor scrubbing machine', 'Cobweb removal & dry vacuuming', 'Window pane & fan degreasing'],
      },
      {
        id: 'tier-2bhk',
        name: '2 BHK Deep Clean',
        price: 3499,
        originalPrice: 4500,
        duration: '4 - 5 hrs',
        features: ['2 Bedrooms, 1 Hall, 1 Kitchen, 2 Baths', 'Floor buffing with machine', 'Full balcony washing', 'Sanitization of switchboards & handles'],
      },
      {
        id: 'tier-3bhk',
        name: '3 BHK Deep Clean',
        price: 4499,
        originalPrice: 5800,
        duration: '5 - 6 hrs',
        features: ['3 Bedrooms, 1 Hall, 1 Kitchen, 3 Baths', 'Multi-crew team (3-4 experts)', 'Intense chemical-free descaling', 'Complete dust-free sanitization'],
      },
    ],
    inclusions: ['Eco-friendly certified chemicals', 'Heavy duty industrial scrubbers', 'DirtFree certified background-verified crew'],
    exclusions: ['Repainting or plumbing fixes', 'Removal of heavy construction debris'],
  },
  {
    id: 'washroom-cleaning',
    title: 'Washroom & Toilet Sanitization',
    category: 'Sanitization',
    rating: 4.95,
    reviewsCount: 2180,
    startingPrice: 499,
    image: '/Images/washroom-clean.jpg',
    badge: 'Instant Book',
    description: 'High-pressure tile scrubbing, hard-water stain removal, and bacterial sanitization of WC, washbasins, and fittings.',
    tiers: [
      {
        id: 'tier-single-bath',
        name: '1 Washroom Intense Descaling',
        price: 499,
        originalPrice: 699,
        duration: '45 - 60 mins',
        features: ['Hard water stain removal', 'Chrome fitting buffing (taps & showers)', 'Anti-microbial spray treatment', 'Mirror polishing'],
      },
      {
        id: 'tier-double-bath',
        name: '2 Washrooms Combo Clean',
        price: 899,
        originalPrice: 1399,
        duration: '1.5 - 2 hrs',
        features: ['Both bathrooms completely descaled', 'Grout line grime scrubbing', 'Exhaust fan & geyser wipe', 'Odor neutralization treatment'],
      },
    ],
    inclusions: ['Single-use microfiber cloths', 'Professional grade descaler safe on marble/granite', 'Fragrant sanitized finish'],
    exclusions: ['Tile replacement or grouting'],
  },
  {
    id: 'kitchen-cleaning',
    title: 'Kitchen & Chimney Degreasing',
    category: 'Kitchen Care',
    rating: 4.88,
    reviewsCount: 970,
    startingPrice: 999,
    image: '/Images/kitchen-clean.jpg',
    description: 'Oil, grime, and grease removal from kitchen tiles, countertop, gas stove, and complete exterior chimney cleaning.',
    tiers: [
      {
        id: 'tier-kitchen-standard',
        name: 'Standard Kitchen Deep Clean',
        price: 999,
        originalPrice: 1499,
        duration: '1.5 - 2 hrs',
        features: ['Tile degreasing & oil spot removal', 'Gas stove & burner polish', 'Sink descaling & tap shine', 'Exterior cabinet wipe down'],
      },
      {
        id: 'tier-kitchen-chimney',
        name: 'Kitchen + Chimney Degreasing',
        price: 1599,
        originalPrice: 2200,
        duration: '2.5 - 3 hrs',
        features: ['Baffle filter caustic boil & degrease', 'Motor cover oil strip', 'Full countertop sanitization', 'Inside empty cabinet vacuuming'],
      },
    ],
    inclusions: ['Food-safe certified degreasers', 'Steam sanitizer finish', 'Stainless steel polish'],
    exclusions: ['Dismantling internal chimney motor mechanics'],
  },
  {
    id: 'sofa-carpet-cleaning',
    title: 'Sofa & Carpet Shampooing',
    category: 'Upholstery',
    rating: 4.85,
    reviewsCount: 840,
    startingPrice: 799,
    image: '/Images/sofa-clean.jpg',
    description: 'Deep extraction shampooing, stain removal, and mite extraction for fabric/leather sofas, mattresses, and rugs.',
    tiers: [
      {
        id: 'tier-sofa-3seater',
        name: '3-Seater Sofa Spa',
        price: 799,
        originalPrice: 1199,
        duration: '1 - 1.5 hrs',
        features: ['Dry vacuuming for dust mites', 'Foam injection shampooing', 'Wet extraction suction', 'Fast 2-hr quick dry solution'],
      },
      {
        id: 'tier-sofa-5seater',
        name: '5-Seater / L-Shape Sofa Spa',
        price: 1299,
        originalPrice: 1899,
        duration: '2 - 2.5 hrs',
        features: ['Deep extraction on all seats & backrests', 'Pet hair & allergen extraction', 'Stain lifter treatment', 'Fabric conditioning'],
      },
    ],
    inclusions: ['German extraction vacuum system', 'Color-safe fabric shampoo', 'Gentle leather cream conditioning'],
    exclusions: ['Torn fabric restoration'],
  },
  {
    id: 'car-cleaning',
    title: 'Complete Car Wash & Detailing',
    category: 'Vehicle Care',
    rating: 4.92,
    reviewsCount: 1100,
    startingPrice: 699,
    image: '/Images/car-clean.jpg',
    description: 'Doorstep foam wash, underbody rinse, dashboard conditioning, and interior dry-cleaning at your parking slot.',
    tiers: [
      {
        id: 'tier-car-hatchback',
        name: 'Hatchback / Sedan Doorstep Spa',
        price: 699,
        originalPrice: 999,
        duration: '45 - 60 mins',
        features: ['Pressure foam exterior wash', 'Interior vacuuming (mats, seats, boot)', 'Tire dressing & rim shine', 'Dashboard UV protectant polish'],
      },
      {
        id: 'tier-car-suv',
        name: 'SUV / Luxury Car Spa',
        price: 899,
        originalPrice: 1299,
        duration: '60 - 75 mins',
        features: ['Complete high-pressure foam wash', 'Deep seat stain wipe', 'Glass streak-free repellent', 'AC vent steam sanitization'],
      },
    ],
    inclusions: ['100% water & power brought by crew if required', 'Scratch-safe plush microfiber towels', 'Car interior fragrance'],
    exclusions: ['Scratch denting or mechanical repairs'],
  },
  {
    id: 'home-help-maid',
    title: 'Daily / Weekly Home Help & Maid Assistance',
    category: 'Assistance',
    rating: 4.8,
    reviewsCount: 650,
    startingPrice: 299,
    image: '/Images/home-help.jpg',
    badge: 'Flexible Hourly',
    description: 'Trained, vetted helpers for routine sweeping, mopping, utensil cleaning, dusting, and household support.',
    tiers: [
      {
        id: 'tier-maid-2hr',
        name: '2-Hour Home Helper',
        price: 299,
        originalPrice: 450,
        duration: '2 hrs',
        features: ['Sweeping & mopping all rooms', 'Utensil washing & kitchen sink clean', 'Dusting surfaces & tables', 'Garbage disposal'],
      },
      {
        id: 'tier-maid-4hr',
        name: '4-Hour Intensive Help',
        price: 549,
        originalPrice: 800,
        duration: '4 hrs',
        features: ['Complete home sweeping & mopping', 'Dishwashing & kitchen prep', 'Wardrobe organizing / folding', 'Bathroom floor washing'],
      },
    ],
    inclusions: ['Verified ID & background checked staff', 'Punctual & trained in hygiene', 'Replacement guarantee if unavailable'],
    exclusions: ['Cooking full meals unless requested in advance'],
  },
];

const INITIAL_SLOTS: TimeSlot[] = [
  {
    id: 'morning',
    label: 'Morning Slot',
    timeRange: '08:30 AM - 11:30 AM',
    period: 'Morning',
    icon: 'SunMedium',
    maxCapacity: 8,
  },
  {
    id: 'afternoon',
    label: 'Afternoon Slot',
    timeRange: '12:30 PM - 03:30 PM',
    period: 'Afternoon',
    icon: 'Sun',
    maxCapacity: 8,
  },
  {
    id: 'evening',
    label: 'Evening Slot',
    timeRange: '04:30 PM - 07:30 PM',
    period: 'Evening',
    icon: 'Moon',
    maxCapacity: 6,
  },
];

class DatabaseStore {
  private ensureStore(): DatabaseSchema {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = {
        services: INITIAL_SERVICES,
        slots: INITIAL_SLOTS,
        bookings: [],
        subscriptions: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }

    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data: DatabaseSchema = JSON.parse(content);
      if (!data.services || data.services.length === 0) {
        data.services = INITIAL_SERVICES;
      }
      if (!data.slots || data.slots.length === 0) {
        data.slots = INITIAL_SLOTS;
      }
      if (!Array.isArray(data.bookings)) {
        data.bookings = [];
      }
      if (!Array.isArray(data.subscriptions)) {
        data.subscriptions = [];
      }
      return data;
    } catch {
      const reset: DatabaseSchema = {
        services: INITIAL_SERVICES,
        slots: INITIAL_SLOTS,
        bookings: [],
        subscriptions: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(reset, null, 2), 'utf-8');
      return reset;
    }
  }

  private saveStore(data: DatabaseSchema): void {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public async getServices(): Promise<ServiceItem[]> {
    if (getPostgresPool()) {
      try {
        await ensurePostgresSchema();
        const res = await query('SELECT * FROM services ORDER BY starting_price ASC');
        if (res.rows.length > 0) {
          return res.rows.map((r) => ({
            id: r.id,
            title: r.title,
            category: r.category,
            rating: parseFloat(r.rating) || 4.9,
            reviewsCount: r.reviews_count || 0,
            startingPrice: parseFloat(r.starting_price) || 0,
            image: r.image,
            badge: r.badge,
            description: r.description,
            tiers: typeof r.tiers === 'string' ? JSON.parse(r.tiers) : (r.tiers || []),
            inclusions: typeof r.inclusions === 'string' ? JSON.parse(r.inclusions) : (r.inclusions || []),
            exclusions: typeof r.exclusions === 'string' ? JSON.parse(r.exclusions) : (r.exclusions || []),
          }));
        }
      } catch (err) {
        console.warn('PostgreSQL getServices notice, using store fallback:', err);
      }
    }
    return this.ensureStore().services;
  }

  public async getServiceById(id: string): Promise<ServiceItem | undefined> {
    const services = await this.getServices();
    return services.find((s) => s.id === id);
  }

  public async getSlots(): Promise<TimeSlot[]> {
    if (getPostgresPool()) {
      try {
        await ensurePostgresSchema();
        const res = await query('SELECT * FROM slots');
        if (res.rows.length > 0) {
          return res.rows.map((r) => ({
            id: r.id,
            label: r.label,
            timeRange: r.time_range,
            period: r.period,
            icon: r.icon,
            maxCapacity: r.max_capacity,
          }));
        }
      } catch (err) {
        console.warn('PostgreSQL getSlots notice, using store fallback:', err);
      }
    }
    return this.ensureStore().slots;
  }

  public async getSlotAvailability(date: string) {
    if (getPostgresPool()) {
      try {
        await ensurePostgresSchema();
        const slots = await this.getSlots();
        const bookingsRes = await query(
          "SELECT slot_id, COUNT(*) as count FROM bookings WHERE booking_date = $1 AND status != 'CANCELLED' GROUP BY slot_id",
          [date]
        );
        const bookedMap = new Map<string, number>();
        for (const row of bookingsRes.rows) {
          bookedMap.set(row.slot_id, parseInt(row.count, 10));
        }

        return slots.map((slot) => {
          const bookedCount = bookedMap.get(slot.id) || 0;
          const remainingCapacity = Math.max(0, slot.maxCapacity - bookedCount);
          const isAvailable = remainingCapacity > 0;

          let statusBadge = 'Available';
          if (!isAvailable) {
            statusBadge = 'Sold Out';
          } else if (remainingCapacity <= 2) {
            statusBadge = `${remainingCapacity} left - Filling Fast`;
          }

          return {
            ...slot,
            bookedCount,
            remainingCapacity,
            isAvailable,
            statusBadge,
          };
        });
      } catch (err) {
        console.warn('PostgreSQL getSlotAvailability notice, using store fallback:', err);
      }
    }

    const data = this.ensureStore();
    const bookingsOnDate = data.bookings.filter((b) => b.date === date && b.status !== 'CANCELLED');

    return data.slots.map((slot) => {
      const bookedCount = bookingsOnDate.filter((b) => b.slotId === slot.id).length;
      const remainingCapacity = Math.max(0, slot.maxCapacity - bookedCount);
      const isAvailable = remainingCapacity > 0;

      let statusBadge = 'Available';
      if (!isAvailable) {
        statusBadge = 'Sold Out';
      } else if (remainingCapacity <= 2) {
        statusBadge = `${remainingCapacity} left - Filling Fast`;
      }

      return {
        ...slot,
        bookedCount,
        remainingCapacity,
        isAvailable,
        statusBadge,
      };
    });
  }

  public async createBooking(payload: {
    customerName: string;
    phone: string;
    serviceId: string;
    tierId: string;
    date: string;
    slotId: 'morning' | 'afternoon' | 'evening';
    address: BookingAddress;
    paymentMethod?: 'PAY_AFTER_SERVICE' | 'UPI';
    notes?: string;
  }): Promise<BookingRecord> {
    const data = this.ensureStore();
    const service = data.services.find((s) => s.id === payload.serviceId);
    if (!service) {
      throw new Error(`Service not found: ${payload.serviceId}`);
    }

    const tier = service.tiers.find((t) => t.id === payload.tierId) || service.tiers[0];
    const slot = data.slots.find((s) => s.id === payload.slotId) || data.slots[0];

    // Check availability
    const bookedOnSlot = data.bookings.filter(
      (b) => b.date === payload.date && b.slotId === payload.slotId && b.status !== 'CANCELLED'
    ).length;

    if (bookedOnSlot >= slot.maxCapacity) {
      throw new Error(`Selected time slot (${slot.timeRange}) on ${payload.date} is fully booked.`);
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `DF-${randomNum}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const partners = [
      { name: 'Ramesh Sharma', phone: '+91 98201 44820', rating: 4.95, uniformVerified: true },
      { name: 'Sanjay Yadav', phone: '+91 98192 33110', rating: 4.9, uniformVerified: true },
      { name: 'Anil Kumar', phone: '+91 99304 88722', rating: 4.88, uniformVerified: true },
    ];
    const assignedPartner = partners[Math.floor(Math.random() * partners.length)];

    const now = new Date().toISOString();
    const booking: BookingRecord = {
      id: bookingId,
      customerName: payload.customerName.trim(),
      phone: payload.phone.trim(),
      serviceId: service.id,
      serviceName: service.title,
      tierId: tier.id,
      tierName: tier.name,
      date: payload.date,
      slotId: slot.id,
      slotTime: slot.timeRange,
      address: payload.address,
      totalAmount: tier.price,
      paymentMethod: payload.paymentMethod || 'PAY_AFTER_SERVICE',
      otp,
      status: 'CONFIRMED',
      partner: assignedPartner,
      notes: payload.notes,
      createdAt: now,
      updatedAt: now,
    };

    if (getPostgresPool()) {
      try {
        await ensurePostgresSchema();
        await query(
          `INSERT INTO bookings (
            id, customer_name, phone, service_id, service_name, tier_id, tier_name,
            booking_date, slot_id, slot_time, address, total_amount, payment_method,
            otp, status, partner, notes, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
          [
            booking.id,
            booking.customerName,
            booking.phone,
            booking.serviceId,
            booking.serviceName,
            booking.tierId,
            booking.tierName,
            booking.date,
            booking.slotId,
            booking.slotTime,
            JSON.stringify(booking.address),
            booking.totalAmount,
            booking.paymentMethod,
            booking.otp,
            booking.status,
            JSON.stringify(booking.partner),
            booking.notes || null,
            booking.createdAt,
            booking.updatedAt,
          ]
        );
      } catch (err) {
        console.warn('PostgreSQL insert notice, mirrored to store:', err);
      }
    }

    data.bookings.unshift(booking);
    this.saveStore(data);
    return booking;
  }

  public async getBookingById(id: string): Promise<BookingRecord | undefined> {
    if (getPostgresPool()) {
      try {
        await ensurePostgresSchema();
        const res = await query('SELECT * FROM bookings WHERE UPPER(id) = UPPER($1)', [id]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            customerName: r.customer_name,
            phone: r.phone,
            serviceId: r.service_id,
            serviceName: r.service_name,
            tierId: r.tier_id,
            tierName: r.tier_name,
            date: typeof r.booking_date === 'string' ? r.booking_date.split('T')[0] : new Date(r.booking_date).toISOString().split('T')[0],
            slotId: r.slot_id,
            slotTime: r.slot_time,
            address: typeof r.address === 'string' ? JSON.parse(r.address) : r.address,
            totalAmount: parseFloat(r.total_amount),
            paymentMethod: r.payment_method,
            otp: r.otp,
            status: r.status,
            partner: typeof r.partner === 'string' ? JSON.parse(r.partner) : r.partner,
            notes: r.notes,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          };
        }
      } catch {}
    }
    return this.ensureStore().bookings.find((b) => b.id.toUpperCase() === id.toUpperCase());
  }

  public async getBookingsByPhone(phone: string): Promise<BookingRecord[]> {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (getPostgresPool()) {
      try {
        await ensurePostgresSchema();
        const res = await query(
          `SELECT * FROM bookings 
           WHERE RIGHT(REGEXP_REPLACE(phone, '\\D', '', 'g'), 10) = $1 
           ORDER BY created_at DESC`,
          [cleanPhone]
        );
        if (res.rows.length > 0) {
          return res.rows.map((r) => ({
            id: r.id,
            customerName: r.customer_name,
            phone: r.phone,
            serviceId: r.service_id,
            serviceName: r.service_name,
            tierId: r.tier_id,
            tierName: r.tier_name,
            date: typeof r.booking_date === 'string' ? r.booking_date.split('T')[0] : new Date(r.booking_date).toISOString().split('T')[0],
            slotId: r.slot_id,
            slotTime: r.slot_time,
            address: typeof r.address === 'string' ? JSON.parse(r.address) : r.address,
            totalAmount: parseFloat(r.total_amount),
            paymentMethod: r.payment_method,
            otp: r.otp,
            status: r.status,
            partner: typeof r.partner === 'string' ? JSON.parse(r.partner) : r.partner,
            notes: r.notes,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));
        }
      } catch (err) {
        console.warn('PostgreSQL getBookingsByPhone notice, using store fallback:', err);
      }
    }

    return this.ensureStore().bookings.filter((b) => {
      const bPhone = b.phone.replace(/\D/g, '').slice(-10);
      return bPhone === cleanPhone;
    });
  }

  public async updateBookingStatus(
    id: string,
    status: BookingRecord['status'],
    partnerUpdate?: BookingRecord['partner']
  ): Promise<BookingRecord | null> {
    const now = new Date().toISOString();

    if (getPostgresPool()) {
      try {
        await ensurePostgresSchema();
        const partnerJson = partnerUpdate ? JSON.stringify(partnerUpdate) : null;
        await query(
          `UPDATE bookings 
           SET status = $1, partner = COALESCE($2, partner), updated_at = $3 
           WHERE UPPER(id) = UPPER($4)`,
          [status, partnerJson, now, id]
        );
      } catch (err) {
        console.warn('PostgreSQL updateBookingStatus notice:', err);
      }
    }

    const data = this.ensureStore();
    const index = data.bookings.findIndex((b) => b.id.toUpperCase() === id.toUpperCase());
    if (index === -1) return null;

    data.bookings[index].status = status;
    if (partnerUpdate) {
      data.bookings[index].partner = partnerUpdate;
    }
    data.bookings[index].updatedAt = now;
    this.saveStore(data);
    return data.bookings[index];
  }

  public async createSubscription(payload: {
    customerName: string;
    phone: string;
    serviceId: string;
    tierId: string;
    frequency: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY';
    preferredDay: string;
    slotId: 'morning' | 'afternoon' | 'evening';
    address: BookingAddress;
    startDate?: string;
  }): Promise<SubscriptionRecord> {
    const data = this.ensureStore();
    const service = data.services.find((s) => s.id === payload.serviceId) || data.services[0];
    const tier = service.tiers.find((t) => t.id === payload.tierId) || service.tiers[0];
    const slot = data.slots.find((s) => s.id === payload.slotId) || data.slots[0];

    const discountMap = {
      WEEKLY: 20,
      BI_WEEKLY: 15,
      MONTHLY: 10,
    };
    const discountPercentage = discountMap[payload.frequency] || 15;
    const perVisitAmount = Math.round(tier.price * (1 - discountPercentage / 100));

    const nextVisits = [];
    const baseDate = payload.startDate ? new Date(payload.startDate) : new Date();
    const intervalDays = payload.frequency === 'WEEKLY' ? 7 : payload.frequency === 'BI_WEEKLY' ? 14 : 28;

    for (let i = 1; i <= 4; i++) {
      const visitDate = new Date(baseDate);
      visitDate.setDate(baseDate.getDate() + i * intervalDays);
      nextVisits.push({
        date: visitDate.toISOString().split('T')[0],
        status: 'SCHEDULED' as const,
      });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const subId = `SUB-${randomNum}`;
    const now = new Date().toISOString();

    const subscription: SubscriptionRecord = {
      id: subId,
      customerName: payload.customerName.trim(),
      phone: payload.phone.trim(),
      serviceId: service.id,
      serviceName: service.title,
      tierId: tier.id,
      tierName: tier.name,
      frequency: payload.frequency,
      preferredDay: payload.preferredDay,
      slotId: slot.id,
      slotTime: slot.timeRange,
      address: payload.address,
      perVisitAmount,
      discountPercentage,
      status: 'ACTIVE',
      nextVisits,
      createdAt: now,
      updatedAt: now,
    };

    if (getPostgresPool()) {
      try {
        await ensurePostgresSchema();
        await query(
          `INSERT INTO subscriptions (
            id, customer_name, phone, service_id, service_name, tier_id, tier_name,
            frequency, preferred_day, slot_id, slot_time, address, per_visit_amount,
            discount_percentage, status, next_visits, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [
            subscription.id,
            subscription.customerName,
            subscription.phone,
            subscription.serviceId,
            subscription.serviceName,
            subscription.tierId,
            subscription.tierName,
            subscription.frequency,
            subscription.preferredDay,
            subscription.slotId,
            subscription.slotTime,
            JSON.stringify(subscription.address),
            subscription.perVisitAmount,
            subscription.discountPercentage,
            subscription.status,
            JSON.stringify(subscription.nextVisits),
            subscription.createdAt,
            subscription.updatedAt,
          ]
        );
      } catch (err) {
        console.warn('PostgreSQL subscription insert notice:', err);
      }
    }

    data.subscriptions.unshift(subscription);
    this.saveStore(data);
    return subscription;
  }

  public async getSubscriptionsByPhone(phone: string): Promise<SubscriptionRecord[]> {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (getPostgresPool()) {
      try {
        await ensurePostgresSchema();
        const res = await query(
          `SELECT * FROM subscriptions 
           WHERE RIGHT(REGEXP_REPLACE(phone, '\\D', '', 'g'), 10) = $1 
           ORDER BY created_at DESC`,
          [cleanPhone]
        );
        if (res.rows.length > 0) {
          return res.rows.map((r) => ({
            id: r.id,
            customerName: r.customer_name,
            phone: r.phone,
            serviceId: r.service_id,
            serviceName: r.service_name,
            tierId: r.tier_id,
            tierName: r.tier_name,
            frequency: r.frequency,
            preferredDay: r.preferred_day,
            slotId: r.slot_id,
            slotTime: r.slot_time,
            address: typeof r.address === 'string' ? JSON.parse(r.address) : r.address,
            perVisitAmount: parseFloat(r.per_visit_amount),
            discountPercentage: r.discount_percentage,
            status: r.status,
            nextVisits: typeof r.next_visits === 'string' ? JSON.parse(r.next_visits) : r.next_visits,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));
        }
      } catch (err) {
        console.warn('PostgreSQL getSubscriptionsByPhone notice, using store fallback:', err);
      }
    }

    return this.ensureStore().subscriptions.filter((s) => {
      const sPhone = s.phone.replace(/\D/g, '').slice(-10);
      return sPhone === cleanPhone;
    });
  }

  public async updateSubscriptionStatus(
    id: string,
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED'
  ): Promise<SubscriptionRecord | null> {
    const now = new Date().toISOString();

    if (getPostgresPool()) {
      try {
        await ensurePostgresSchema();
        await query(
          `UPDATE subscriptions 
           SET status = $1, updated_at = $2 
           WHERE UPPER(id) = UPPER($3)`,
          [status, now, id]
        );
      } catch (err) {
        console.warn('PostgreSQL updateSubscriptionStatus notice:', err);
      }
    }

    const data = this.ensureStore();
    const index = data.subscriptions.findIndex((s) => s.id.toUpperCase() === id.toUpperCase());
    if (index === -1) return null;

    data.subscriptions[index].status = status;
    data.subscriptions[index].updatedAt = now;
    this.saveStore(data);
    return data.subscriptions[index];
  }
}

export const dbStore = new DatabaseStore();
