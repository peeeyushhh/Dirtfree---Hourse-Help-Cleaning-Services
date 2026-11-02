-- ========================================================
-- DirtFree PostgreSQL Database Schema & Initial Seed
-- Container initialization script for Oracle Cloud Ubuntu VM
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Services Catalog Table
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

-- 2. Slots Master Table
CREATE TABLE IF NOT EXISTS slots (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    time_range VARCHAR(100) NOT NULL,
    period VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    max_capacity INT NOT NULL DEFAULT 8
);

-- 3. Bookings Table
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

-- Indexes for lightning fast mobile queries
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(booking_date, slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- 4. Subscriptions Table
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
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ========================================================
-- Seed Initial Slots Data
-- ========================================================
INSERT INTO slots (id, label, time_range, period, icon, max_capacity)
VALUES
    ('morning', 'Morning Slot', '08:30 AM - 11:30 AM', 'Morning', 'SunMedium', 8),
    ('afternoon', 'Afternoon Slot', '12:30 PM - 03:30 PM', 'Afternoon', 'Sun', 8),
    ('evening', 'Evening Slot', '04:30 PM - 07:30 PM', 'Evening', 'Moon', 6)
ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    time_range = EXCLUDED.time_range,
    period = EXCLUDED.period,
    icon = EXCLUDED.icon,
    max_capacity = EXCLUDED.max_capacity;

-- ========================================================
-- Seed Initial Services Data
-- ========================================================
INSERT INTO services (id, title, category, rating, reviews_count, starting_price, image, badge, description, tiers, inclusions, exclusions)
VALUES
(
    'full-home-cleaning',
    'Full Home Deep Cleaning',
    'Home Care',
    4.90,
    1420,
    2499.00,
    '/Images/full-home-clean.jpg',
    'Most Popular',
    'Complete top-to-bottom sanitization and vacuuming of all rooms, balconies, and living areas with hospital-grade equipment.',
    '[
        {"id": "tier-1bhk", "name": "1 BHK Deep Clean", "price": 2499, "originalPrice": 3200, "duration": "3 - 4 hrs", "features": ["1 Bedroom, 1 Hall, 1 Kitchen, 1 Bath", "Floor scrubbing machine", "Cobweb removal & dry vacuuming", "Window pane & fan degreasing"]},
        {"id": "tier-2bhk", "name": "2 BHK Deep Clean", "price": 3499, "originalPrice": 4500, "duration": "4 - 5 hrs", "features": ["2 Bedrooms, 1 Hall, 1 Kitchen, 2 Baths", "Floor buffing with machine", "Full balcony washing", "Sanitization of switchboards & handles"]},
        {"id": "tier-3bhk", "name": "3 BHK Deep Clean", "price": 4499, "originalPrice": 5800, "duration": "5 - 6 hrs", "features": ["3 Bedrooms, 1 Hall, 1 Kitchen, 3 Baths", "Multi-crew team (3-4 experts)", "Intense chemical-free descaling", "Complete dust-free sanitization"]}
    ]'::jsonb,
    '["Eco-friendly certified chemicals", "Heavy duty industrial scrubbers", "DirtFree certified background-verified crew"]'::jsonb,
    '["Repainting or plumbing fixes", "Removal of heavy construction debris"]'::jsonb
),
(
    'washroom-cleaning',
    'Washroom & Toilet Sanitization',
    'Sanitization',
    4.95,
    2180,
    499.00,
    '/Images/washroom-clean.jpg',
    'Instant Book',
    'High-pressure tile scrubbing, hard-water stain removal, and bacterial sanitization of WC, washbasins, and fittings.',
    '[
        {"id": "tier-single-bath", "name": "1 Washroom Intense Descaling", "price": 499, "originalPrice": 699, "duration": "45 - 60 mins", "features": ["Hard water stain removal", "Chrome fitting buffing (taps & showers)", "Anti-microbial spray treatment", "Mirror polishing"]},
        {"id": "tier-double-bath", "name": "2 Washrooms Combo Clean", "price": 899, "originalPrice": 1399, "duration": "1.5 - 2 hrs", "features": ["Both bathrooms completely descaled", "Grout line grime scrubbing", "Exhaust fan & geyser wipe", "Odor neutralization treatment"]}
    ]'::jsonb,
    '["Single-use microfiber cloths", "Professional grade descaler safe on marble/granite", "Fragrant sanitized finish"]'::jsonb,
    '["Tile replacement or grouting"]'::jsonb
),
(
    'kitchen-cleaning',
    'Kitchen & Chimney Degreasing',
    'Kitchen Care',
    4.88,
    970,
    999.00,
    '/Images/kitchen-clean.jpg',
    NULL,
    'Oil, grime, and grease removal from kitchen tiles, countertop, gas stove, and complete exterior chimney cleaning.',
    '[
        {"id": "tier-kitchen-standard", "name": "Standard Kitchen Deep Clean", "price": 999, "originalPrice": 1499, "duration": "1.5 - 2 hrs", "features": ["Tile degreasing & oil spot removal", "Gas stove & burner polish", "Sink descaling & tap shine", "Exterior cabinet wipe down"]},
        {"id": "tier-kitchen-chimney", "name": "Kitchen + Chimney Degreasing", "price": 1599, "originalPrice": 2200, "duration": "2.5 - 3 hrs", "features": ["Baffle filter caustic boil & degrease", "Motor cover oil strip", "Full countertop sanitization", "Inside empty cabinet vacuuming"]}
    ]'::jsonb,
    '["Food-safe certified degreasers", "Steam sanitizer finish", "Stainless steel polish"]'::jsonb,
    '["Dismantling internal chimney motor mechanics"]'::jsonb
),
(
    'sofa-carpet-cleaning',
    'Sofa & Carpet Shampooing',
    'Upholstery',
    4.85,
    840,
    799.00,
    '/Images/sofa-clean.jpg',
    NULL,
    'Deep extraction shampooing, stain removal, and mite extraction for fabric/leather sofas, mattresses, and rugs.',
    '[
        {"id": "tier-sofa-3seater", "name": "3-Seater Sofa Spa", "price": 799, "originalPrice": 1199, "duration": "1 - 1.5 hrs", "features": ["Dry vacuuming for dust mites", "Foam injection shampooing", "Wet extraction suction", "Fast 2-hr quick dry solution"]},
        {"id": "tier-sofa-5seater", "name": "5-Seater / L-Shape Sofa Spa", "price": 1299, "originalPrice": 1899, "duration": "2 - 2.5 hrs", "features": ["Deep extraction on all seats & backrests", "Pet hair & allergen extraction", "Stain lifter treatment", "Fabric conditioning"]}
    ]'::jsonb,
    '["German extraction vacuum system", "Color-safe fabric shampoo", "Gentle leather cream conditioning"]'::jsonb,
    '["Torn fabric restoration"]'::jsonb
),
(
    'car-cleaning',
    'Complete Car Wash & Detailing',
    'Vehicle Care',
    4.92,
    1100,
    699.00,
    '/Images/car-clean.jpg',
    NULL,
    'Doorstep foam wash, underbody rinse, dashboard conditioning, and interior dry-cleaning at your parking slot.',
    '[
        {"id": "tier-car-hatchback", "name": "Hatchback / Sedan Doorstep Spa", "price": 699, "originalPrice": 999, "duration": "45 - 60 mins", "features": ["Pressure foam exterior wash", "Interior vacuuming (mats, seats, boot)", "Tire dressing & rim shine", "Dashboard UV protectant polish"]},
        {"id": "tier-car-suv", "name": "SUV / Luxury Car Spa", "price": 899, "originalPrice": 1299, "duration": "60 - 75 mins", "features": ["Complete high-pressure foam wash", "Deep seat stain wipe", "Glass streak-free repellent", "AC vent steam sanitization"]}
    ]'::jsonb,
    '["100% water & power brought by crew if required", "Scratch-safe plush microfiber towels", "Car interior fragrance"]'::jsonb,
    '["Scratch denting or mechanical repairs"]'::jsonb
),
(
    'home-help-maid',
    'Daily / Weekly Home Help & Maid Assistance',
    'Assistance',
    4.80,
    650,
    299.00,
    '/Images/home-help.jpg',
    'Flexible Hourly',
    'Trained, vetted helpers for routine sweeping, mopping, utensil cleaning, dusting, and household support.',
    '[
        {"id": "tier-maid-2hr", "name": "2-Hour Home Helper", "price": 299, "originalPrice": 450, "duration": "2 hrs", "features": ["Sweeping & mopping all rooms", "Utensil washing & kitchen sink clean", "Dusting surfaces & tables", "Garbage disposal"]},
        {"id": "tier-maid-4hr", "name": "4-Hour Intensive Help", "price": 549, "originalPrice": 800, "duration": "4 hrs", "features": ["Complete home sweeping & mopping", "Dishwashing & kitchen prep", "Wardrobe organizing / folding", "Bathroom floor washing"]}
    ]'::jsonb,
    '["Verified ID & background checked staff", "Punctual & trained in hygiene", "Replacement guarantee if unavailable"]'::jsonb,
    '["Cooking full meals unless requested in advance"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    starting_price = EXCLUDED.starting_price,
    tiers = EXCLUDED.tiers;

