// My Bookings and Trip Management Component
import { store } from '../state.js';

export function renderMyBookings(container) {
  const state = store.getState();
  const bookings = state.savedBookings || [];

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <h2 class="text-3xl font-black text-slate-900 flex items-center space-x-2.5">
            <i data-lucide="briefcase" class="w-7 h-7 text-sky-600"></i>
            <span>Manage My Trips & Bookings</span>
          </h2>
          <p class="text-slate-500 text-sm mt-1">Review itinerary details, download boarding passes, or manage seat selections.</p>
        </div>

        <button id="btn-book-new" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 flex items-center space-x-2 transition">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Book a New Flight</span>
        </button>
      </div>

      <!-- Quick Lookup by PNR -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <h4 class="font-extrabold text-slate-900 text-sm mb-3">Find a Booking by Reference</h4>
        <div class="flex flex-wrap md:flex-nowrap gap-3">
          <input type="text" id="lookup-pnr" placeholder="Enter 6-digit PNR (e.g. SKY-9X82F4)" class="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase">
          <input type="text" id="lookup-lastname" placeholder="Passenger Last Name" class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500">
          <button id="btn-search-pnr" class="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition flex items-center space-x-2">
            <i data-lucide="search" class="w-4 h-4"></i>
            <span>Find Trip</span>
          </button>
        </div>
      </div>

      <!-- Bookings List -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-black text-slate-900">Your Saved Flights (${bookings.length})</h3>
        </div>

        ${bookings.length === 0 ? `
          <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <i data-lucide="plane-off" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
            <h4 class="text-lg font-bold text-slate-800">No active bookings found</h4>
            <p class="text-sm text-slate-500 mt-1">Ready to explore the world? Search for flights above to get started.</p>
            <button id="btn-empty-book" class="mt-4 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold transition">Start Booking</button>
          </div>
        ` : `
          <div class="space-y-4">
            ${bookings.map(b => renderBookingItem(b)).join('')}
          </div>
        `}
      </div>

      <!-- Cancel Confirmation Modal (Hidden by default) -->
      <div id="cancel-booking-modal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-center">
          <div class="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <i data-lucide="alert-triangle" class="w-6 h-6"></i>
          </div>
          <h3 class="text-xl font-black text-slate-900">Cancel Flight Reservation?</h3>
          <p class="text-xs text-slate-500">
            Are you sure you want to cancel booking <strong id="cancel-modal-pnr" class="text-slate-800 font-mono"></strong>? 
            In accordance with airline fare rules, an 85% refund will be credited to the original payment method within 3-5 business days.
          </p>
          <div class="p-3 bg-slate-50 rounded-xl text-xs flex justify-between font-bold border border-slate-200">
            <span class="text-slate-500">Refund Amount:</span>
            <span class="text-emerald-600 font-mono" id="cancel-modal-refund">$0</span>
          </div>
          <div class="flex space-x-3 pt-2">
            <button id="btn-cancel-modal-no" class="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50">Keep Reservation</button>
            <button id="btn-cancel-modal-yes" class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20">Confirm Cancellation</button>
          </div>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }

  attachMyBookingsEvents(container);
}

function renderBookingItem(b) {
  const isCancelled = b.status === 'Cancelled';
  const out = b.outboundFlight;
  const leadP = b.passengers[0] || {};
  const depDate = new Date(out.departureTime);

  return `
    <div class="bg-white rounded-2xl border transition-all ${isCancelled ? 'border-rose-200 bg-rose-50/20 opacity-75' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'} p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        
        <!-- PNR & Status -->
        <div class="flex items-center space-x-3">
          <div class="px-3 py-1 bg-slate-100 text-slate-800 font-mono font-black text-sm rounded-lg border border-slate-200">
            ${b.pnr}
          </div>
          <span class="px-2.5 py-0.5 text-xs font-extrabold rounded-full ${isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
            ${b.status}
          </span>
          <span class="text-xs text-slate-400">Booked on ${new Date(b.createdAt).toLocaleDateString()}</span>
        </div>

        <!-- Total Price -->
        <div class="text-right">
          <div class="text-lg font-black text-slate-900">${store.formatPrice(b.pricing?.total || b.pricing?.grandTotal || 0)}</div>
          <div class="text-[11px] text-slate-400">${b.passengers.length} passenger(s) • ${b.tripType === 'round' ? 'Round Trip' : 'One Way'}</div>
        </div>
      </div>

      <!-- Flight Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 items-center">
        <!-- Airline & Route -->
        <div class="flex items-center space-x-4">
          <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-sm">
            ${out.airline?.code || 'FL'}
          </div>
          <div>
            <div class="font-bold text-slate-900 text-sm">${out.airline?.name} • ${out.flightNumber}</div>
            <div class="text-xs text-sky-700 font-bold">${out.origin?.code} ➔ ${out.destination?.code}</div>
          </div>
        </div>

        <!-- Dates & Times -->
        <div class="text-xs text-slate-600">
          <div><strong class="text-slate-800">Departure:</strong> ${depDate.toLocaleDateString()} at ${depDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div><strong class="text-slate-800">Seats:</strong> ${b.passengers.map(p => p.seatOutbound || 'N/A').join(', ')}</div>
        </div>

        <!-- Primary Traveler -->
        <div class="text-xs text-slate-600">
          <div><strong class="text-slate-800">Lead Traveler:</strong> ${leadP.firstName} ${leadP.lastName}</div>
          <div><strong class="text-slate-800">Contact:</strong> ${b.contact?.email || 'N/A'}</div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div class="text-xs text-slate-500">
          ${isCancelled ? `<span class="text-rose-600 font-semibold">Refund of ${store.formatPrice(b.refundAmount || 0)} initiated</span>` : 'Terminal & Gate info available on boarding pass.'}
        </div>

        <div class="flex items-center space-x-2">
          ${!isCancelled ? `
            <button class="btn-cancel-trip px-3.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg transition" data-pnr="${b.pnr}">
              Cancel Booking
            </button>
            <button class="btn-view-pass px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center space-x-1" data-pnr="${b.pnr}">
              <i data-lucide="printer" class="w-3.5 h-3.5"></i>
              <span>View Boarding Pass</span>
            </button>
          ` : `
            <button class="btn-view-pass px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition" data-pnr="${b.pnr}">
              View Cancelled Details
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

function attachMyBookingsEvents(container) {
  // New Booking Button
  container.querySelector('#btn-book-new')?.addEventListener('click', () => {
    store.setState({ activeTab: 'home' });
  });
  container.querySelector('#btn-empty-book')?.addEventListener('click', () => {
    store.setState({ activeTab: 'home' });
  });

  // PNR Search
  container.querySelector('#btn-search-pnr')?.addEventListener('click', () => {
    const pnrQuery = container.querySelector('#lookup-pnr').value.trim().toUpperCase();
    if (!pnrQuery) {
      window.showToast?.('Please enter a PNR reference code', 'warning');
      return;
    }

    const state = store.getState();
    const match = state.savedBookings.find(b => b.pnr.toUpperCase().includes(pnrQuery));
    if (match) {
      window.showToast?.(`Found booking for ${match.pnr}!`, 'success');
      store.setState({
        currentConfirmedBooking: match,
        activeTab: 'confirmation'
      });
    } else {
      window.showToast?.(`No booking found matching PNR ${pnrQuery}`, 'error');
    }
  });

  // View Boarding Pass
  container.querySelectorAll('.btn-view-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const pnr = btn.getAttribute('data-pnr');
      const b = store.getState().savedBookings.find(x => x.pnr === pnr);
      if (b) {
        store.setState({
          currentConfirmedBooking: b,
          activeTab: 'confirmation'
        });
      }
    });
  });

  // Cancel Booking Modal Triggers
  const modal = container.querySelector('#cancel-booking-modal');
  let pnrToCancel = null;

  container.querySelectorAll('.btn-cancel-trip').forEach(btn => {
    btn.addEventListener('click', () => {
      pnrToCancel = btn.getAttribute('data-pnr');
      const b = store.getState().savedBookings.find(x => x.pnr === pnrToCancel);
      if (!b) return;

      container.querySelector('#cancel-modal-pnr').textContent = pnrToCancel;
      const refund = Math.round((b.pricing?.total || b.pricing?.grandTotal || 0) * 0.85);
      container.querySelector('#cancel-modal-refund').textContent = store.formatPrice(refund);

      modal.classList.remove('hidden');
    });
  });

  container.querySelector('#btn-cancel-modal-no')?.addEventListener('click', () => {
    modal.classList.add('hidden');
    pnrToCancel = null;
  });

  container.querySelector('#btn-cancel-modal-yes')?.addEventListener('click', () => {
    if (pnrToCancel) {
      store.cancelBooking(pnrToCancel);
      modal.classList.add('hidden');
      window.showToast?.(`Reservation ${pnrToCancel} cancelled. Refund credited!`, 'info');
      renderMyBookings(container);
    }
  });
}
