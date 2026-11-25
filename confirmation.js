// Booking Confirmation and Digital Boarding Pass Component
import { store } from '../state.js';

export function renderConfirmation(container) {
  const state = store.getState();
  const booking = state.currentConfirmedBooking || state.savedBookings[0];

  if (!booking) {
    store.setState({ activeTab: 'home' });
    return;
  }

  const { outboundFlight, inboundFlight, passengers, pnr } = booking;
  const leadPassenger = passengers[0] || { firstName: 'Traveler', lastName: '' };

  const depTime = new Date(outboundFlight.departureTime);
  const boardingTime = new Date(depTime.getTime() - 45 * 60000); // 45 min before dep

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      
      <!-- Success Header Banner -->
      <div class="text-center mb-8 no-print">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
          <i data-lucide="check" class="w-8 h-8 stroke-[3]"></i>
        </div>
        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Booking Confirmed & Ticket Issued!</h2>
        <p class="text-slate-500 text-sm mt-1">An official e-ticket and invoice has been dispatched to <strong class="text-slate-800">${booking.contact?.email || 'your email'}</strong></p>
        
        <!-- PNR Badge -->
        <div class="inline-flex items-center space-x-3 mt-4 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking Reference (PNR):</span>
          <span class="font-mono font-black text-base text-sky-700 select-all" id="text-pnr">${pnr}</span>
          <button id="btn-copy-pnr" class="p-1 hover:text-sky-600 text-slate-400 transition" title="Copy PNR">
            <i data-lucide="copy" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Action Buttons Bar -->
      <div class="flex flex-wrap items-center justify-center gap-3 mb-8 no-print">
        <button id="btn-print-pass" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 flex items-center space-x-2 transition">
          <i data-lucide="printer" class="w-4 h-4"></i>
          <span>Print Boarding Pass / Save PDF</span>
        </button>

        <button id="btn-email-pass" class="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl shadow-sm flex items-center space-x-2 transition">
          <i data-lucide="mail" class="w-4 h-4"></i>
          <span>Resend Email</span>
        </button>

        <button id="btn-add-calendar" class="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl shadow-sm flex items-center space-x-2 transition">
          <i data-lucide="calendar-plus" class="w-4 h-4"></i>
          <span>Add to Calendar</span>
        </button>

        <button id="btn-view-bookings" class="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl shadow-sm flex items-center space-x-2 transition">
          <i data-lucide="folder" class="w-4 h-4"></i>
          <span>My Bookings</span>
        </button>
      </div>

      <!-- Printable Boarding Pass Container -->
      <div id="printable-ticket" class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-8">
        
        <!-- Outbound Boarding Pass -->
        <div class="boarding-pass-cutout border-b border-dashed border-slate-300">
          
          <!-- Boarding Pass Header -->
          <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <i data-lucide="plane" class="w-5 h-5 text-sky-400"></i>
              <span class="font-display font-extrabold text-base tracking-wider">BOARDING PASS • ${outboundFlight.airline.name.toUpperCase()}</span>
            </div>
            <div class="flex items-center space-x-4 text-xs font-mono">
              <span>CLASS: <strong class="text-sky-400">ECONOMY</strong></span>
              <span>PNR: <strong class="text-sky-400">${pnr}</strong></span>
            </div>
          </div>

          <!-- Boarding Pass Main Body -->
          <div class="grid grid-cols-1 md:grid-cols-4 p-6 sm:p-8 gap-6">
            
            <!-- Left 3 Cols: Flight Details -->
            <div class="md:col-span-3 space-y-6">
              
              <!-- Route & Times -->
              <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div class="text-3xl font-black text-slate-900">${outboundFlight.origin.code}</div>
                  <div class="text-xs font-semibold text-slate-500">${outboundFlight.origin.city}</div>
                  <div class="text-xs font-bold text-sky-700 mt-1">${depTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                <div class="flex-1 px-8 text-center">
                  <div class="text-xs font-mono font-bold text-slate-400 mb-1">${outboundFlight.flightNumber}</div>
                  <div class="relative flex items-center justify-center">
                    <div class="w-full h-0.5 bg-slate-300"></div>
                    <i data-lucide="plane" class="w-4 h-4 text-sky-600 absolute"></i>
                  </div>
                  <div class="text-[11px] text-slate-400 mt-1">${outboundFlight.aircraft}</div>
                </div>

                <div class="text-right">
                  <div class="text-3xl font-black text-slate-900">${outboundFlight.destination.code}</div>
                  <div class="text-xs font-semibold text-slate-500">${outboundFlight.destination.city}</div>
                  <div class="text-xs font-bold text-sky-700 mt-1">${new Date(outboundFlight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>

              <!-- Passengers Grid -->
              <div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Passenger Information</div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Passenger</div>
                    <div class="text-sm font-extrabold text-slate-900 truncate">${leadPassenger.firstName} ${leadPassenger.lastName}</div>
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Boarding Time</div>
                    <div class="text-sm font-extrabold text-amber-600">${boardingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Gate</div>
                    <div class="text-sm font-extrabold text-slate-900">${outboundFlight.gate || 'B22'}</div>
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Seat</div>
                    <div class="text-sm font-black text-sky-600">${leadPassenger.seatOutbound || '14A'}</div>
                  </div>
                </div>
              </div>

              <!-- Barcode SVG Graphic -->
              <div class="pt-2">
                <div class="w-full h-12 flex items-center justify-between opacity-85">
                  ${generateBarcodeBars()}
                </div>
                <div class="text-center font-mono text-[9px] text-slate-400 tracking-widest mt-1">
                  *${pnr}-${outboundFlight.flightNumber}-TICKET*
                </div>
              </div>
            </div>

            <!-- Right Col: Tear-off Stub with QR Code -->
            <div class="md:col-span-1 md:border-l md:border-dashed md:border-slate-300 md:pl-6 flex flex-col justify-between items-center text-center">
              <div>
                <div class="text-xs font-bold text-slate-500 uppercase">Seat No.</div>
                <div class="text-3xl font-black text-sky-600 my-1">${leadPassenger.seatOutbound || '14A'}</div>
                <div class="text-[11px] font-mono text-slate-400 font-bold">${outboundFlight.origin.code} ➔ ${outboundFlight.destination.code}</div>
              </div>

              <!-- Realistic QR Code Graphic -->
              <div class="p-2 bg-white rounded-xl border border-slate-200 shadow-sm my-3">
                ${generateMockQR()}
              </div>

              <div class="text-[10px] text-slate-400 font-mono">
                Scan at Gate ${outboundFlight.gate || 'B22'}
              </div>
            </div>

          </div>
        </div>

        <!-- Inbound Return Boarding Pass if Round Trip -->
        ${inboundFlight ? `
          <div class="boarding-pass-cutout">
            <div class="bg-slate-800 text-white px-6 py-3 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i data-lucide="plane" class="w-4 h-4 text-sky-400"></i>
                <span class="font-display font-extrabold text-sm tracking-wider">RETURN BOARDING PASS • ${inboundFlight.airline.name.toUpperCase()}</span>
              </div>
              <div class="text-xs font-mono">PNR: <strong class="text-sky-400">${pnr}</strong></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-4 p-6 sm:p-8 gap-6">
              <div class="md:col-span-3 space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div class="text-2xl font-black text-slate-900">${inboundFlight.origin.code}</div>
                    <div class="text-xs font-semibold text-slate-500">${inboundFlight.origin.city}</div>
                  </div>
                  <div class="flex-1 px-8 text-center">
                    <div class="text-xs font-mono font-bold text-slate-400 mb-1">${inboundFlight.flightNumber}</div>
                    <div class="relative flex items-center justify-center">
                      <div class="w-full h-0.5 bg-slate-300"></div>
                      <i data-lucide="plane" class="w-3.5 h-3.5 text-sky-600 absolute"></i>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-black text-slate-900">${inboundFlight.destination.code}</div>
                    <div class="text-xs font-semibold text-slate-500">${inboundFlight.destination.city}</div>
                  </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Passenger</div>
                    <div class="text-xs font-bold text-slate-900">${leadPassenger.firstName} ${leadPassenger.lastName}</div>
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Date</div>
                    <div class="text-xs font-bold text-slate-900">${new Date(inboundFlight.departureTime).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Terminal</div>
                    <div class="text-xs font-bold text-slate-900">${inboundFlight.terminal || 'T3'}</div>
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Seat</div>
                    <div class="text-xs font-black text-sky-600">${leadPassenger.seatInbound || '14F'}</div>
                  </div>
                </div>
              </div>

              <div class="md:col-span-1 md:border-l md:border-dashed md:border-slate-300 md:pl-6 flex flex-col justify-center items-center text-center">
                <div class="text-xs font-bold text-slate-500 uppercase">Return Seat</div>
                <div class="text-2xl font-black text-sky-600 my-1">${leadPassenger.seatInbound || '14F'}</div>
                <div class="p-1 bg-white rounded-lg border border-slate-200 mt-2">
                  ${generateMockQR(70)}
                </div>
              </div>
            </div>
          </div>
        ` : ''}

      </div>

      <!-- Bottom Next Steps -->
      <div class="text-center no-print">
        <button id="btn-book-another" class="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition">
          Book Another Flight
        </button>
      </div>

    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }

  attachConfirmationEvents(container, pnr);
}

function generateBarcodeBars() {
  let bars = '';
  const widths = [1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1];
  for (let i = 0; i < 48; i++) {
    const w = widths[i % widths.length];
    bars += `<div style="width: ${w}px; height: 100%; background: #0f172a; margin-right: ${w % 2 === 0 ? 2 : 3}px;"></div>`;
  }
  return bars;
}

function generateMockQR(size = 90) {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="white"/>
      <!-- Top Left Finder -->
      <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="3"/>
      <rect x="11" y="11" width="16" height="16" fill="white" rx="2"/>
      <rect x="15" y="15" width="8" height="8" fill="#0f172a" rx="1"/>
      
      <!-- Top Right Finder -->
      <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="3"/>
      <rect x="73" y="11" width="16" height="16" fill="white" rx="2"/>
      <rect x="77" y="15" width="8" height="8" fill="#0f172a" rx="1"/>

      <!-- Bottom Left Finder -->
      <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="3"/>
      <rect x="11" y="73" width="16" height="16" fill="white" rx="2"/>
      <rect x="15" y="77" width="8" height="8" fill="#0f172a" rx="1"/>

      <!-- Random QR Data Bits -->
      <rect x="38" y="8" width="6" height="6" fill="#0f172a"/>
      <rect x="48" y="8" width="10" height="6" fill="#0f172a"/>
      <rect x="38" y="20" width="8" height="8" fill="#0f172a"/>
      <rect x="52" y="22" width="6" height="6" fill="#0f172a"/>
      <rect x="8" y="38" width="6" height="6" fill="#0f172a"/>
      <rect x="20" y="42" width="8" height="6" fill="#0f172a"/>
      <rect x="36" y="38" width="12" height="12" fill="#0f172a"/>
      <rect x="56" y="38" width="8" height="6" fill="#0f172a"/>
      <rect x="72" y="42" width="18" height="6" fill="#0f172a"/>
      <rect x="38" y="60" width="8" height="6" fill="#0f172a"/>
      <rect x="54" y="56" width="14" height="8" fill="#0f172a"/>
      <rect x="76" y="60" width="14" height="6" fill="#0f172a"/>
      <rect x="40" y="76" width="12" height="12" fill="#0f172a"/>
      <rect x="60" y="78" width="8" height="8" fill="#0f172a"/>
      <rect x="78" y="76" width="12" height="12" fill="#0f172a"/>
    </svg>
  `;
}

function attachConfirmationEvents(container, pnr) {
  // Copy PNR
  container.querySelector('#btn-copy-pnr')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(pnr);
    window.showToast?.(`PNR ${pnr} copied to clipboard!`, 'info');
  });

  // Print
  container.querySelector('#btn-print-pass')?.addEventListener('click', () => {
    window.print();
  });

  // Resend Email
  container.querySelector('#btn-email-pass')?.addEventListener('click', () => {
    window.showToast?.(`E-ticket and invoice resent to traveler's email!`, 'success');
  });

  // Add to Calendar
  container.querySelector('#btn-add-calendar')?.addEventListener('click', () => {
    window.showToast?.('Flight event added to calendar schedule!', 'success');
  });

  // View My Bookings
  container.querySelector('#btn-view-bookings')?.addEventListener('click', () => {
    store.setState({ activeTab: 'my-bookings' });
  });

  // Book Another Flight
  container.querySelector('#btn-book-another')?.addEventListener('click', () => {
    store.setState({
      activeTab: 'home',
      selectedBooking: {
        outboundFlight: null,
        outboundTier: 'standard',
        inboundFlight: null,
        inboundTier: 'standard',
        passengers: [],
        addOns: { extraBaggage: 'none', insurance: false, loungeAccess: false, carbonOffset: false },
        promoCode: null,
        discountAmount: 0
      }
    });
  });
}
