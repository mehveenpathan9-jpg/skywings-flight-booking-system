// ==============================================================================
// SkyWings Airways - SQLite Database Engine
// Powered by Node.js Built-in SQLite Module (node:sqlite)
// ==============================================================================

const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const DB_DIR = __dirname;
const DB_FILE = path.join(DB_DIR, 'flights.db');
const SCHEMA_FILE = path.join(DB_DIR, 'schema.sql');
const JSON_BACKUP = path.join(__dirname, '..', 'bookings.json');

// Initialize SQLite database instance
const db = new DatabaseSync(DB_FILE);

// Enable WAL mode & foreign keys for performance and data integrity
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

function initDatabase() {
  console.log('[SQLite DB] Initializing tables from schema.sql...');
  
  if (fs.existsSync(SCHEMA_FILE)) {
    const schema = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    db.exec(schema);
  }

  // Check if bookings table has records; if not, import from bookings.json
  const countRow = db.prepare('SELECT COUNT(*) as count FROM bookings;').get();
  if (countRow.count === 0 && fs.existsSync(JSON_BACKUP)) {
    try {
      const initialData = JSON.parse(fs.readFileSync(JSON_BACKUP, 'utf-8'));
      console.log(`[SQLite DB] Seeding ${initialData.length} booking(s) from bookings.json...`);
      for (const booking of initialData) {
        insertBookingToSqlite(booking);
      }
    } catch (err) {
      console.warn('[SQLite DB] Seeding warning:', err.message);
    }
  }

  console.log(`[SQLite DB] Ready! Database connected at: ${DB_FILE}`);
}

function insertBookingToSqlite(booking) {
  const pnr = booking.pnr || `SKY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const tripType = booking.tripType || 'round';
  const status = booking.status || 'Confirmed';
  const email = booking.contact?.email || 'traveler@example.com';
  const phone = booking.contact?.phone || '+1 555-019-2834';
  const grandTotal = booking.pricing?.grandTotal || booking.pricing?.total || 0;
  const baseFare = booking.pricing?.baseFare || grandTotal * 0.8;
  const taxesFees = booking.pricing?.taxes || grandTotal * 0.2;
  const seatFees = booking.pricing?.seatSelection || 0;
  const addonsTotal = booking.pricing?.addOnsTotal || 0;
  const discountAmount = booking.pricing?.discount || 0;
  const currency = booking.pricing?.currency || 'USD';
  const promoCode = booking.pricing?.promoCode || null;
  const refundAmount = booking.refundAmount || 0;

  const outboundJson = JSON.stringify(booking.outboundFlight || {});
  const inboundJson = JSON.stringify(booking.inboundFlight || {});
  const addonsJson = JSON.stringify(booking.addOns || {});
  const createdAt = booking.createdAt || new Date().toISOString();

  const insertBooking = db.prepare(`
    INSERT INTO bookings (
      pnr, trip_type, status, contact_email, contact_phone,
      base_fare, taxes_fees, seat_fees, addons_total, discount_amount,
      grand_total, currency, promo_code, refund_amount,
      outbound_flight_json, inbound_flight_json, addons_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `);

  insertBooking.run(
    pnr, tripType, status, email, phone,
    baseFare, taxesFees, seatFees, addonsTotal, discountAmount,
    grandTotal, currency, promoCode, refundAmount,
    outboundJson, inboundJson, addonsJson, createdAt, createdAt
  );

  // Insert passengers
  if (Array.isArray(booking.passengers)) {
    const insertPassenger = db.prepare(`
      INSERT INTO passengers (
        pnr, title, first_name, last_name, dob, gender,
        passport_number, nationality, seat_outbound, seat_inbound,
        meal_preference, extra_baggage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);

    for (const p of booking.passengers) {
      insertPassenger.run(
        pnr,
        p.title || 'Mr',
        p.firstName || 'Traveler',
        p.lastName || '',
        p.dob || null,
        p.gender || null,
        p.passport || p.passportNumber || '',
        p.nationality || '',
        p.seatOutbound || '',
        p.seatInbound || '',
        p.meal || p.mealPreference || 'Standard',
        p.extraBaggage || 'none'
      );
    }
  }

  booking.pnr = pnr;
  return booking;
}

function formatBookingRow(row) {
  if (!row) return null;

  // Retrieve passengers for this PNR
  const passRows = db.prepare('SELECT * FROM passengers WHERE pnr = ?;').all(row.pnr);
  const passengers = passRows.map(p => ({
    title: p.title,
    firstName: p.first_name,
    lastName: p.last_name,
    dob: p.dob,
    gender: p.gender,
    passport: p.passport_number,
    nationality: p.nationality,
    seatOutbound: p.seat_outbound,
    seatInbound: p.seat_inbound,
    meal: p.meal_preference,
    extraBaggage: p.extra_baggage
  }));

  let outboundFlight = {};
  let inboundFlight = null;
  let addOns = {};

  try { outboundFlight = JSON.parse(row.outbound_flight_json || '{}'); } catch(e) {}
  try { inboundFlight = JSON.parse(row.inbound_flight_json || 'null'); } catch(e) {}
  try { addOns = JSON.parse(row.addons_json || '{}'); } catch(e) {}

  return {
    pnr: row.pnr,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    tripType: row.trip_type,
    passengers,
    outboundFlight,
    inboundFlight,
    addOns,
    pricing: {
      currency: row.currency,
      baseFare: row.base_fare,
      taxes: row.taxes_fees,
      seatSelection: row.seat_fees,
      addOnsTotal: row.addons_total,
      discount: row.discount_amount,
      total: row.grand_total,
      grandTotal: row.grand_total,
      promoCode: row.promo_code
    },
    refundAmount: row.refund_amount,
    contact: {
      email: row.contact_email,
      phone: row.contact_phone
    }
  };
}

// ------------------------------------------------------------------------------
// Exported Database Operations
// ------------------------------------------------------------------------------

const Database = {
  init: initDatabase,

  getAllBookings() {
    const rows = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC;').all();
    return rows.map(formatBookingRow);
  },

  getBookingByPnr(pnr) {
    if (!pnr) return null;
    const row = db.prepare('SELECT * FROM bookings WHERE UPPER(pnr) = ?;').get(pnr.toUpperCase());
    return formatBookingRow(row);
  },

  createBooking(booking) {
    const result = insertBookingToSqlite(booking);

    // Also mirror to bookings.json for file-level inspection
    try {
      const all = Database.getAllBookings();
      fs.writeFileSync(JSON_BACKUP, JSON.stringify(all, null, 2), 'utf-8');
    } catch (e) {}

    return result;
  },

  cancelBooking(pnr) {
    if (!pnr) return null;
    const upperPnr = pnr.toUpperCase();
    const row = db.prepare('SELECT * FROM bookings WHERE UPPER(pnr) = ?;').get(upperPnr);
    if (!row) return null;

    const refund = Math.round(row.grand_total * 0.85);
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE bookings 
      SET status = 'Cancelled', refund_amount = ?, updated_at = ?
      WHERE UPPER(pnr) = ?;
    `).run(refund, now, upperPnr);

    // Sync to JSON backup
    try {
      const all = Database.getAllBookings();
      fs.writeFileSync(JSON_BACKUP, JSON.stringify(all, null, 2), 'utf-8');
    } catch (e) {}

    return Database.getBookingByPnr(upperPnr);
  },

  validateCoupon(code) {
    if (!code) return { valid: false, message: 'Coupon code required' };
    const row = db.prepare('SELECT * FROM promo_codes WHERE UPPER(code) = ? AND is_active = 1;').get(code.toUpperCase());
    if (row) {
      if (row.discount_type === 'PERCENT') {
        return { valid: true, code: row.code, discountPercent: row.discount_value, message: `${row.discount_value}% discount applied!` };
      } else {
        return { valid: true, code: row.code, discountFixed: row.discount_value, message: `$${row.discount_value} discount applied!` };
      }
    }
    return { valid: false, message: 'Invalid or expired promo coupon code' };
  },

  getStats() {
    const bookingsCount = db.prepare('SELECT COUNT(*) as count FROM bookings;').get().count;
    const passengersCount = db.prepare('SELECT COUNT(*) as count FROM passengers;').get().count;
    const promoCount = db.prepare('SELECT COUNT(*) as count FROM promo_codes WHERE is_active = 1;').get().count;
    const stats = fs.statSync(DB_FILE);

    return {
      engine: 'SQLite 3 (Node.js Native node:sqlite)',
      databaseFile: DB_FILE,
      sizeBytes: stats.size,
      totalBookings: bookingsCount,
      totalPassengers: passengersCount,
      activePromos: promoCount
    };
  }
};

module.exports = Database;
