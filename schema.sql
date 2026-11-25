-- ==============================================================================
-- SkyWings Airways - Relational Database Schema (SQLite)
-- Database file: database/flights.db
-- ==============================================================================

-- 1. Airports Table
CREATE TABLE IF NOT EXISTS airports (
    code VARCHAR(3) PRIMARY KEY,          -- e.g. 'JFK', 'DXB', 'LHR', 'DEL'
    name VARCHAR(150) NOT NULL,          -- e.g. 'John F. Kennedy International Airport'
    city VARCHAR(100) NOT NULL,          -- e.g. 'New York'
    country VARCHAR(100) NOT NULL,       -- e.g. 'United States'
    timezone VARCHAR(50) DEFAULT 'UTC',
    lat DECIMAL(9, 6),
    lng DECIMAL(9, 6)
);

-- 2. Airlines Table
CREATE TABLE IF NOT EXISTS airlines (
    code VARCHAR(3) PRIMARY KEY,          -- e.g. 'EK', 'BA', 'AI', 'QR'
    name VARCHAR(100) NOT NULL,          -- e.g. 'Emirates', 'British Airways'
    logo_url VARCHAR(255)
);

-- 3. Flights Schedule Table
CREATE TABLE IF NOT EXISTS flights (
    id VARCHAR(50) PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,  -- e.g. 'EK-201'
    airline_code VARCHAR(3) NOT NULL,
    origin_code VARCHAR(3) NOT NULL,
    destination_code VARCHAR(3) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    aircraft VARCHAR(100) DEFAULT 'Boeing 777-300ER',
    terminal VARCHAR(10) DEFAULT 'T1',
    gate VARCHAR(10) DEFAULT 'A1',
    base_price DECIMAL(10, 2) NOT NULL,
    available_seats INT DEFAULT 180,
    FOREIGN KEY (airline_code) REFERENCES airlines(code),
    FOREIGN KEY (origin_code) REFERENCES airports(code),
    FOREIGN KEY (destination_code) REFERENCES airports(code)
);

-- 4. Bookings Master Table (PNR)
CREATE TABLE IF NOT EXISTS bookings (
    pnr VARCHAR(10) PRIMARY KEY,         -- e.g. 'SKY-9X82F4'
    trip_type VARCHAR(10) NOT NULL,      -- 'round' or 'oneway'
    status VARCHAR(20) DEFAULT 'Confirmed', -- 'Confirmed', 'Cancelled'
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    base_fare DECIMAL(10, 2) DEFAULT 0,
    taxes_fees DECIMAL(10, 2) DEFAULT 0,
    seat_fees DECIMAL(10, 2) DEFAULT 0,
    addons_total DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    grand_total DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'USD',
    promo_code VARCHAR(20),
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    outbound_flight_json TEXT,           -- Complete outbound flight details
    inbound_flight_json TEXT,            -- Complete inbound flight details
    addons_json TEXT,                    -- Baggage, meals, insurance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Passengers Table
CREATE TABLE IF NOT EXISTS passengers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pnr VARCHAR(10) NOT NULL,
    title VARCHAR(10),                   -- 'Mr', 'Ms', 'Mrs', 'Dr'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE,
    gender VARCHAR(15),
    passport_number VARCHAR(50),
    nationality VARCHAR(50),
    seat_outbound VARCHAR(5),            -- e.g. '12A'
    seat_inbound VARCHAR(5),             -- e.g. '14F'
    meal_preference VARCHAR(50) DEFAULT 'Standard',
    extra_baggage VARCHAR(20) DEFAULT 'none',
    FOREIGN KEY (pnr) REFERENCES bookings(pnr) ON DELETE CASCADE
);

-- 6. Promo Codes Table
CREATE TABLE IF NOT EXISTS promo_codes (
    code VARCHAR(20) PRIMARY KEY,        -- e.g. 'FLY20', 'SKY100', 'FIRSTFLY'
    discount_type VARCHAR(10) NOT NULL,  -- 'PERCENT' or 'FIXED'
    discount_value DECIMAL(10, 2) NOT NULL,
    min_spend DECIMAL(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    expiry_date DATE
);

-- Seed Promo Codes
INSERT OR IGNORE INTO promo_codes (code, discount_type, discount_value, is_active) 
VALUES 
    ('FLY20', 'PERCENT', 20.0, 1),
    ('SKY100', 'FIXED', 100.0, 1),
    ('FIRSTFLY', 'FIXED', 50.0, 1);
