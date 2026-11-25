# ✈️ SkyWings Airways - Flight Booking Web Application

A fully functional, modern, responsive flight booking web application built with clean architecture, interactive aircraft seat selection, realistic flight generator, simulated secure checkout, printable boarding passes with barcodes & QR codes, trip management, and real-time flight radar tracking.

---

## 🌟 Key Features

### 1. 🔍 Comprehensive Flight Search Engine
- **Round-Trip & One-Way** flight search modes with automatic date validation.
- **Airport Autocomplete**: Instant search by city, country, or 3-letter IATA code across 40+ major international and domestic hubs (e.g. JFK, LHR, DXB, SIN, HND, CDG, FRA, DEL, BOM, SYD, SFO).
- **Airport Swap Button**: One-click origin and destination switcher.
- **Traveler & Cabin Class Selector**: Adults (12+), Children (2-11), and Infants on lap. Cabin classes: Economy, Premium Economy, Business, and First Class.
- **Direct Flights Filter**: Quick toggle for non-stop flights only.

### 2. 🛫 Dynamic Flight Schedules & Search Results
- Generates realistic, schedule-accurate flights across world-class airlines (Emirates, Qatar Airways, Singapore Airlines, British Airways, Delta, Air India, Lufthansa, Air France, United, Qantas).
- Realistic flight durations calculated via great-circle geodesic distances.
- **Multi-stop and direct routing**: Layover hubs (Dubai, Doha, London Heathrow, Frankfurt, Singapore, Paris) with layover timelines.
- **Multi-tier Fare Selector**:
  - **Saver**: Basic fare (hand baggage only).
  - **Standard**: Includes 23kg checked bag + standard seat choice.
  - **Flex Plus**: 100% refundable, 2x checked bags, priority boarding.
- **Rich Sidebar Filters**:
  - Filter by stops: Direct only or 1 Stop.
  - Price range slider with dynamic currency conversion.
  - Departure time of day (Morning 06:00-12:00, Afternoon 12:00-18:00, Evening 18:00-24:00).
  - Airline multi-select checkboxes.
- **Sorting Options**: Cheapest First, Fastest Flight, Best Value, Earliest Departure.

### 3. 💺 Interactive Airplane Seat Map
- **Visual Fuselage Cabin Layout**: Cockpit nose, emergency exits, wings, and rear galley.
- **Row Configurations**: Rows 1-3 Business Class, Rows 4-10 Extra Legroom Seats, Rows 11-20 Standard Seats.
- **Multi-Passenger Seat Assignment**: Easily switch between Passenger 1, Passenger 2, etc.
- **Seat States**:
  - 🟢 **Selected** (vibrant green with seat number)
  - 🟡 **Extra Legroom** (+$35)
  - 🔵 **Standard Seat** (Included / free)
  - ⚪ **Occupied** (greyed out)
- Automatic outbound and return leg seat assignment for round trips.

### 4. 🧳 Passenger Details & Add-Ons
- Passenger personal details matching official photo IDs (Title, Name, Date of Birth, Gender, Nationality, Passport / National ID Number).
- In-flight meal selection (Standard, Asian Vegetarian Hindu, Strict Vegan, Halal Certified, Kosher, Gluten-Friendly, Child-Friendly).
- Add-on services:
  - Additional checked luggage (+15kg, +23kg, +32kg).
  - Comprehensive travel protection insurance.
  - VIP Airport Lounge access.
  - 100% Carbon neutral flight offset.

### 5. 💳 Checkout, Discount Coupons & Payment Simulation
- Itemized price breakdown: base fare, taxes and fees, seat selection, and add-ons.
- **Working Promo Codes**:
  - `FLY20`: **20% OFF** entire booking!
  - `SKY100`: **$100 discount**.
  - `FIRSTFLY`: **$50 discount**.
- **Payment Methods**:
  - Credit/Debit Card with live card preview (Visa, Mastercard, Amex detection, automatic card spacing, and expiry validation).
  - PayPal Express one-click simulator.
  - Apple Pay / Google Pay biometric simulator.
- Animated multi-stage payment verification with simulated airline GDS seat reservation and ticket issuance!

### 6. 🎫 Digital Boarding Pass & E-Ticket
- Generates a unique 6-character PNR code (e.g. `SKY-8A49K2`).
- Airline aesthetic boarding pass with realistic SVG Barcode and QR Code!
- Flight times, departure terminal, boarding gate, passenger name, and seat assignment.
- **Actions**:
  - **Print Boarding Pass / Save PDF** (clean dedicated print stylesheet).
  - **Add to Calendar** sync.
  - **Email E-Ticket** re-send.

### 7. 📁 "My Bookings" Trip Management
- Persistent storage using browser `localStorage`.
- Lookup any existing booking by PNR and Passenger Last Name.
- View upcoming or past bookings.
- **1-Click Cancellation Modal**: Computes 85% airline refund and updates booking status to "Cancelled".

### 8. 📡 Live Satellite Flight Radar Tracker
- Search by flight number (e.g. `EK-201`, `QR-704`, `SQ-321`, `BA-178`, `AI-102`, `LH-410`) or route.
- Live progress indicator with airplane radar marker.
- Real-time telemetries: Cruising Altitude, Ground Speed, Aircraft Model, Terminal, Gate, and Baggage Carousel belt!

### 9. 💱 Real-Time Multi-Currency Support
- Instant conversion across **USD ($)**, **EUR (€)**, **GBP (£)**, **INR (₹)**, **AED (د.إ)**, **JPY (¥)**, **CAD (CA$)**, and **AUD (AU$)**.

---

## 🚀 How to Run the Website

### Option 1: Double-Click (Windows)
Double-click `start.bat`. It will start the local server and open your default browser directly at `http://localhost:3000`.

### Option 2: Python Command Line
Run in PowerShell or Command Prompt:
```bash
python server.py
```
Then visit: `http://localhost:3000`

### Option 3: Node / NPX
```bash
npx serve -l 3000 .
```

---

## 📂 Project Structure

```
flight-booking-app/
├── index.html                  # Main single-page application markup & layout
├── css/
│   └── styles.css              # Custom styling, fuselage seat map, print styles
├── js/
│   ├── app.js                  # Main controller, view router, toast notifications
│   ├── state.js                # Central state store, currency rates, localStorage
│   ├── data/
│   │   ├── airports.js         # 40+ international airports database
│   │   └── flights.js          # Airline profiles & realistic flight generator
│   └── components/
│       ├── search.js           # Search box, autocomplete, date validation
│       ├── flight-list.js      # Results listing, filters, fare tier selector
│       ├── seat-map.js         # Interactive aircraft cabin seat map
│       ├── passenger-form.js   # Passenger forms, meals, passport info, add-ons
│       ├── checkout.js         # Price breakdown, promo codes, card simulator
│       ├── confirmation.js     # E-Ticket & printable boarding pass with barcode/QR
│       ├── my-bookings.js      # Trip management, PNR search, cancellations
│       └── flight-status.js    # Live flight radar tracker
├── server.py                   # Zero-dependency Python 3 HTTP server
├── start.bat                   # 1-click Windows launcher
├── package.json                # Project metadata
└── README.md                   # Complete documentation
```
