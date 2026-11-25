// ==============================================================================
// SkyWings Airways - Complete Node.js Backend Server
// Built with Zero-External-Dependencies (pure Node.js http, fs, path, url)
// ==============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_FILE = path.join(ROOT_DIR, 'bookings.json');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// ------------------------------------------------------------------------------
// In-Memory Database & Persistence Helper
// ------------------------------------------------------------------------------
function loadStoredBookings() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('[Backend] Error reading bookings.json:', err.message);
  }

  // Initial Sample Booking for Mehveen Khan
  const initial = [
    {
      pnr: 'SKY-9X82F4',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'Confirmed',
      tripType: 'round',
      passengers: [
        {
          title: 'Ms',
          firstName: 'Mehveen',
          lastName: 'Khan',
          passport: 'MK7892104',
          seatOutbound: '12A',
          seatInbound: '14F',
          meal: 'Vegetarian Hindu'
        }
      ],
      outboundFlight: {
        flightNumber: 'EK-201',
        airline: { name: 'Emirates', code: 'EK' },
        origin: { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl' },
        destination: { code: 'DXB', city: 'Dubai', name: 'Dubai Intl' },
        departureTime: new Date(Date.now() + 86400000 * 3).toISOString(),
        arrivalTime: new Date(Date.now() + 86400000 * 3 + 45000000).toISOString(),
        terminal: 'T4',
        gate: 'B22',
        aircraft: 'Airbus A380-800'
      },
      inboundFlight: {
        flightNumber: 'EK-202',
        airline: { name: 'Emirates', code: 'EK' },
        origin: { code: 'DXB', city: 'Dubai', name: 'Dubai Intl' },
        destination: { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl' },
        departureTime: new Date(Date.now() + 86400000 * 10).toISOString(),
        arrivalTime: new Date(Date.now() + 86400000 * 10 + 46000000).toISOString(),
        terminal: 'T3',
        gate: 'A12',
        aircraft: 'Airbus A380-800'
      },
      pricing: { currency: 'USD', total: 1145, grandTotal: 1145 },
      contact: { email: 'mehveen.khan@example.com', phone: '+1 (555) 019-2834' }
    }
  ];

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (e) {}

  return initial;
}

let bookingsDb = loadStoredBookings();

function saveBookingsToDisk() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookingsDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Backend] Could not persist bookings to disk:', err.message);
  }
}

// ------------------------------------------------------------------------------
// Request Body Parser Helper
// ------------------------------------------------------------------------------
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

// ------------------------------------------------------------------------------
// HTTP Server & Router
// ------------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // ----------------------------------------------------------------------------
  // REST API Endpoints
  // ----------------------------------------------------------------------------
  
  // 1. Health check & Server Status
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'online',
      airline: 'SkyWings Airways Global API',
      timestamp: new Date().toISOString(),
      activeBookings: bookingsDb.length
    });
  }

  // 2. Coupon Validation API
  if (pathname === '/api/coupons/validate' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const code = (body.code || '').trim().toUpperCase();
      if (code === 'FLY20') {
        return sendJson(res, 200, { valid: true, code, discountPercent: 20, message: '20% discount applied!' });
      }
      if (code === 'SKY100') {
        return sendJson(res, 200, { valid: true, code, discountFixed: 100, message: '$100 discount applied!' });
      }
      return sendJson(res, 400, { valid: false, message: 'Invalid promo coupon code' });
    } catch (e) {
      return sendJson(res, 400, { error: 'Invalid JSON request body' });
    }
  }

  // 3. Get All Bookings API
  if (pathname === '/api/bookings' && req.method === 'GET') {
    return sendJson(res, 200, { bookings: bookingsDb });
  }

  // 4. Create New Booking API
  if (pathname === '/api/bookings' && req.method === 'POST') {
    try {
      const newBooking = await parseJsonBody(req);
      if (!newBooking.pnr) {
        // Generate PNR if missing
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let pnr = 'SKY-';
        for (let i = 0; i < 6; i++) pnr += chars.charAt(Math.floor(Math.random() * chars.length));
        newBooking.pnr = pnr;
      }
      newBooking.createdAt = new Date().toISOString();
      newBooking.status = 'Confirmed';

      bookingsDb.unshift(newBooking);
      saveBookingsToDisk();

      console.log(`[Backend] New Booking Confirmed: ${newBooking.pnr}`);
      return sendJson(res, 201, { success: true, booking: newBooking });
    } catch (e) {
      return sendJson(res, 400, { error: 'Failed to process booking' });
    }
  }

  // 5. Lookup Booking by PNR API
  if (pathname.startsWith('/api/bookings/') && req.method === 'GET') {
    const pnr = pathname.split('/')[3]?.toUpperCase();
    const match = bookingsDb.find(b => b.pnr.toUpperCase() === pnr);
    if (match) {
      return sendJson(res, 200, { booking: match });
    }
    return sendJson(res, 404, { error: `No booking found for PNR: ${pnr}` });
  }

  // 6. Cancel Booking API
  if (pathname.startsWith('/api/bookings/') && pathname.endsWith('/cancel') && req.method === 'POST') {
    const parts = pathname.split('/');
    const pnr = parts[3]?.toUpperCase();
    const booking = bookingsDb.find(b => b.pnr.toUpperCase() === pnr);

    if (booking) {
      booking.status = 'Cancelled';
      const total = booking.pricing?.total || booking.pricing?.grandTotal || 0;
      booking.refundAmount = Math.round(total * 0.85);
      booking.cancelledAt = new Date().toISOString();
      saveBookingsToDisk();

      console.log(`[Backend] Booking Cancelled: ${pnr}, Refund: $${booking.refundAmount}`);
      return sendJson(res, 200, { success: true, booking });
    }
    return sendJson(res, 404, { error: 'Booking not found to cancel' });
  }

  // ----------------------------------------------------------------------------
  // Static File Server
  // ----------------------------------------------------------------------------
  let safePath = pathname === '/' ? '/index.html' : pathname;
  // Prevent directory traversal
  safePath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(ROOT_DIR, safePath);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404 Not Found
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found - SkyWings Airways');
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('============================================================');
  console.log('🛫 SkyWings Airways Backend Server is Running!');
  console.log(`👉 Local Web URL:    http://localhost:${PORT}`);
  console.log(`👉 REST API Health:  http://localhost:${PORT}/api/health`);
  console.log(`👉 Bookings API:     http://localhost:${PORT}/api/bookings`);
  console.log('============================================================');
});
