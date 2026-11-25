// Search Bar and Destination Explorer Component
import { searchAirports, getAirport, AIRPORTS } from '../data/airports.js';
import { generateFlights, MOCK_FLIGHT_STATUSES } from '../data/flights.js';
import { store } from '../state.js';

let activeServiceTab = 'flights'; // 'flights' | 'status' | 'checkin'

export function initSearchComponent() {
  const container = document.getElementById('search-container');
  if (!container) return;

  renderSearch(container);
}

export function renderSearch(container) {
  const state = store.getState();
  const { searchParams } = state;
  const originAirport = getAirport(searchParams.origin);
  const destAirport = getAirport(searchParams.destination);

  const totalPassengers = searchParams.passengers.adults + searchParams.passengers.children + searchParams.passengers.infants;

  container.innerHTML = `
    <!-- Top Service Selection Tabs -->
    <div class="flex items-center space-x-2 mb-3 max-w-xl mx-auto bg-slate-900/80 p-1.5 rounded-2xl backdrop-blur-md shadow-lg border border-white/10">
      <button id="service-tab-flights" class="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition ${activeServiceTab === 'flights' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/10'}">
        <i data-lucide="plane" class="w-4 h-4"></i>
        <span>Search Flights</span>
      </button>

      <button id="service-tab-status" class="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition ${activeServiceTab === 'status' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/10'}">
        <i data-lucide="radar" class="w-4 h-4 text-emerald-400"></i>
        <span>Flight Radar</span>
      </button>

      <button id="service-tab-checkin" class="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition ${activeServiceTab === 'checkin' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/10'}">
        <i data-lucide="ticket" class="w-4 h-4 text-amber-300"></i>
        <span>Web Check-In</span>
      </button>
    </div>

    <!-- Main Widget Body -->
    <div class="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8 animate-fade-in">
      
      ${activeServiceTab === 'flights' ? `
        <!-- Trip Type & Class Bar -->
        <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div class="flex items-center space-x-2 bg-slate-100/80 p-1.5 rounded-xl">
            <button id="btn-trip-round" class="px-4 py-2 text-sm font-semibold rounded-lg transition-all ${searchParams.tripType === 'round' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              Round Trip
            </button>
            <button id="btn-trip-oneway" class="px-4 py-2 text-sm font-semibold rounded-lg transition-all ${searchParams.tripType === 'oneway' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              One Way
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <!-- Passenger Selector Trigger -->
            <div class="relative">
              <button id="btn-passenger-dropdown" class="flex items-center space-x-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 transition">
                <i data-lucide="users" class="w-4 h-4 text-sky-600"></i>
                <span>${totalPassengers} ${totalPassengers === 1 ? 'Traveler' : 'Travelers'}</span>
                <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
              </button>

              <!-- Passenger Counter Popover -->
              <div id="passenger-popover" class="hidden absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-50 animate-fade-in">
                <div class="space-y-4">
                  <!-- Adults -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-semibold text-slate-800">Adults</div>
                      <div class="text-xs text-slate-400">Age 12+</div>
                    </div>
                    <div class="flex items-center space-x-3">
                      <button id="dec-adults" class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30" ${searchParams.passengers.adults <= 1 ? 'disabled' : ''}>-</button>
                      <span id="val-adults" class="w-4 text-center font-bold text-slate-800">${searchParams.passengers.adults}</span>
                      <button id="inc-adults" class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">+</button>
                    </div>
                  </div>

                  <!-- Children -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-semibold text-slate-800">Children</div>
                      <div class="text-xs text-slate-400">Age 2-11</div>
                    </div>
                    <div class="flex items-center space-x-3">
                      <button id="dec-children" class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30" ${searchParams.passengers.children <= 0 ? 'disabled' : ''}>-</button>
                      <span id="val-children" class="w-4 text-center font-bold text-slate-800">${searchParams.passengers.children}</span>
                      <button id="inc-children" class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">+</button>
                    </div>
                  </div>

                  <!-- Infants -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-semibold text-slate-800">Infants</div>
                      <div class="text-xs text-slate-400">Under 2 (on lap)</div>
                    </div>
                    <div class="flex items-center space-x-3">
                      <button id="dec-infants" class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30" ${searchParams.passengers.infants <= 0 ? 'disabled' : ''}>-</button>
                      <span id="val-infants" class="w-4 text-center font-bold text-slate-800">${searchParams.passengers.infants}</span>
                      <button id="inc-infants" class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">+</button>
                    </div>
                  </div>

                  <div class="pt-2 border-t border-slate-100 flex justify-end">
                    <button id="btn-close-passengers" class="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg">Done</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cabin Class Selector -->
            <select id="select-cabin" class="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
              <option value="economy" ${searchParams.cabinClass === 'economy' ? 'selected' : ''}>Economy</option>
              <option value="premium" ${searchParams.cabinClass === 'premium' ? 'selected' : ''}>Premium Economy</option>
              <option value="business" ${searchParams.cabinClass === 'business' ? 'selected' : ''}>Business Class</option>
              <option value="first" ${searchParams.cabinClass === 'first' ? 'selected' : ''}>First Class</option>
            </select>

            <!-- Direct Flights Toggle -->
            <label class="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer select-none">
              <input type="checkbox" id="check-direct" ${searchParams.directOnly ? 'checked' : ''} class="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500">
              <span>Direct flights only</span>
            </label>
          </div>
        </div>

        <!-- Search Inputs Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6 items-center">
          <!-- Origin Airport -->
          <div class="md:col-span-3 relative">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">From</label>
            <div class="relative">
              <input type="text" id="input-origin" value="${originAirport.city} (${originAirport.code})" placeholder="City or airport" autocomplete="off"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-sm font-semibold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-sky-500/20">
              <i data-lucide="plane-takeoff" class="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            </div>
            <div id="origin-dropdown" class="hidden absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-100 z-50"></div>
          </div>

          <!-- Swap Button -->
          <div class="md:col-span-1 flex justify-center -my-2 md:my-0">
            <button id="btn-swap-airports" title="Swap origin & destination" class="w-10 h-10 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-600 border border-slate-200 flex items-center justify-center text-slate-600 transition shadow-sm hover:scale-105 active:scale-95">
              <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Destination Airport -->
          <div class="md:col-span-3 relative">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">To</label>
            <div class="relative">
              <input type="text" id="input-destination" value="${destAirport.city} (${destAirport.code})" placeholder="City or airport" autocomplete="off"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-sm font-semibold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-sky-500/20">
              <i data-lucide="plane-landing" class="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            </div>
            <div id="dest-dropdown" class="hidden absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-100 z-50"></div>
          </div>

          <!-- Departure Date -->
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Departure</label>
            <div class="relative">
              <input type="date" id="input-departure-date" value="${searchParams.departureDate}" min="${new Date().toISOString().split('T')[0]}"
                class="w-full pl-10 pr-3 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-sm font-semibold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-sky-500/20">
              <i data-lucide="calendar" class="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            </div>
          </div>

          <!-- Return Date -->
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Return</label>
            <div class="relative">
              <input type="date" id="input-return-date" value="${searchParams.returnDate}" min="${searchParams.departureDate}" ${searchParams.tripType === 'oneway' ? 'disabled' : ''}
                class="w-full pl-10 pr-3 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-xl text-sm font-semibold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-40 disabled:bg-slate-100">
              <i data-lucide="calendar" class="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            </div>
          </div>

          <!-- Search Action Button -->
          <div class="md:col-span-1 pt-5">
            <button id="btn-submit-search" class="w-full h-12 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95">
              <i data-lucide="search" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
      ` : ''}

      ${activeServiceTab === 'status' ? `
        <!-- Live Flight Radar Tracker Form on Home -->
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 class="font-extrabold text-slate-900 text-base">Check Live Satellite Flight Status</h4>
              <p class="text-xs text-slate-500">Track flight progress, departure gates, and baggage carousel in real-time.</p>
            </div>
            <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg animate-pulse">● Live Link Active</span>
          </div>

          <div class="flex flex-wrap md:flex-nowrap gap-3 pt-2">
            <div class="relative flex-1">
              <input type="text" id="inline-status-input" placeholder="Enter Flight Number (e.g. EK-201, QR-704, SQ-321)" value="EK-201"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase">
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            </div>
            <button id="btn-inline-track" class="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 transition flex items-center space-x-2">
              <i data-lucide="radar" class="w-4 h-4"></i>
              <span>Track Flight</span>
            </button>
          </div>

          <!-- Quick Flight Suggestions -->
          <div class="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span class="text-slate-400 font-semibold">Track Live Now:</span>
            ${MOCK_FLIGHT_STATUSES.slice(0, 4).map(f => `
              <button class="btn-quick-track px-3 py-1 bg-slate-100 hover:bg-sky-100 hover:text-sky-700 rounded-lg text-slate-700 font-mono font-bold transition" data-flight="${f.flightNumber}">
                ${f.flightNumber} (${f.origin}➔${f.destination})
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${activeServiceTab === 'checkin' ? `
        <!-- Web Check-in & Boarding Pass Form on Home -->
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 class="font-extrabold text-slate-900 text-base">Online Web Check-In & Boarding Pass</h4>
              <p class="text-xs text-slate-500">Retrieve your digital boarding pass, check baggage allowance, and head straight to the gate.</p>
            </div>
            <span class="px-2.5 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-lg">Instant Pass</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            <div class="md:col-span-5">
              <label class="block text-xs font-bold text-slate-600 mb-1">Booking Reference (PNR)</label>
              <input type="text" id="inline-checkin-pnr" value="SKY-9X82F4" placeholder="e.g. SKY-9X82F4"
                class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase">
            </div>
            <div class="md:col-span-4">
              <label class="block text-xs font-bold text-slate-600 mb-1">Passenger Last Name</label>
              <input type="text" id="inline-checkin-lastname" value="Khan" placeholder="e.g. Khan"
                class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500">
            </div>
            <div class="md:col-span-3 pt-5">
              <button id="btn-inline-checkin" class="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 transition flex items-center justify-center space-x-2">
                <i data-lucide="ticket" class="w-4 h-4"></i>
                <span>Get Boarding Pass</span>
              </button>
            </div>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  if (window.lucide) {
    try {
      window.lucide.createIcons({ root: container });
    } catch(e) {}
  }

  attachSearchEvents(container);
}

function attachSearchEvents(container) {
  // Service Tab switchers
  container.querySelector('#service-tab-flights')?.addEventListener('click', () => {
    activeServiceTab = 'flights';
    renderSearch(container);
  });
  container.querySelector('#service-tab-status')?.addEventListener('click', () => {
    activeServiceTab = 'status';
    renderSearch(container);
  });
  container.querySelector('#service-tab-checkin')?.addEventListener('click', () => {
    activeServiceTab = 'checkin';
    renderSearch(container);
  });

  // Inline radar tracker button
  container.querySelector('#btn-inline-track')?.addEventListener('click', () => {
    store.setState({ activeTab: 'flight-status' });
  });

  container.querySelectorAll('.btn-quick-track').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setState({ activeTab: 'flight-status' });
    });
  });

  // Inline check-in button
  container.querySelector('#btn-inline-checkin')?.addEventListener('click', () => {
    const pnr = container.querySelector('#inline-checkin-pnr')?.value.trim().toUpperCase();
    const found = store.getState().savedBookings.find(b => b.pnr.toUpperCase().includes(pnr));
    if (found) {
      store.setState({ currentConfirmedBooking: found, activeTab: 'confirmation' });
      window.showToast?.(`Retrieved boarding pass for ${found.passengers[0]?.firstName} ${found.passengers[0]?.lastName}!`, 'success');
    } else {
      store.setState({ activeTab: 'confirmation' });
    }
  });

  if (activeServiceTab !== 'flights') return;

  const state = store.getState();

  // Trip Type Switcher
  container.querySelector('#btn-trip-round')?.addEventListener('click', () => {
    store.updateSearchParams({ tripType: 'round' });
    renderSearch(container);
  });

  container.querySelector('#btn-trip-oneway')?.addEventListener('click', () => {
    store.updateSearchParams({ tripType: 'oneway' });
    renderSearch(container);
  });

  // Cabin Class
  container.querySelector('#select-cabin')?.addEventListener('change', (e) => {
    store.updateSearchParams({ cabinClass: e.target.value });
  });

  // Direct toggle
  container.querySelector('#check-direct')?.addEventListener('change', (e) => {
    store.updateSearchParams({ directOnly: e.target.checked });
  });

  // Dates
  const depDateInput = container.querySelector('#input-departure-date');
  const returnDateInput = container.querySelector('#input-return-date');

  depDateInput?.addEventListener('change', (e) => {
    const newDep = e.target.value;
    const currentRet = state.searchParams.returnDate;
    let newRet = currentRet;
    if (new Date(newRet) < new Date(newDep)) {
      const nextDay = new Date(newDep);
      nextDay.setDate(nextDay.getDate() + 7);
      newRet = nextDay.toISOString().split('T')[0];
    }
    store.updateSearchParams({ departureDate: newDep, returnDate: newRet });
    if (returnDateInput) {
      returnDateInput.min = newDep;
      returnDateInput.value = newRet;
    }
  });

  returnDateInput?.addEventListener('change', (e) => {
    store.updateSearchParams({ returnDate: e.target.value });
  });

  // Swap Airports
  container.querySelector('#btn-swap-airports')?.addEventListener('click', () => {
    const curOrigin = store.getState().searchParams.origin;
    const curDest = store.getState().searchParams.destination;
    store.updateSearchParams({ origin: curDest, destination: curOrigin });
    renderSearch(container);
  });

  // Passenger Popover Toggle
  const passengerBtn = container.querySelector('#btn-passenger-dropdown');
  const passengerPopover = container.querySelector('#passenger-popover');
  const closePassengerBtn = container.querySelector('#btn-close-passengers');

  passengerBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    passengerPopover.classList.toggle('hidden');
  });

  closePassengerBtn?.addEventListener('click', () => {
    passengerPopover.classList.add('hidden');
    renderSearch(container);
  });

  document.addEventListener('click', (e) => {
    if (passengerPopover && !passengerPopover.contains(e.target) && !passengerBtn.contains(e.target)) {
      passengerPopover.classList.add('hidden');
    }
  });

  // Passenger counters
  const incAdults = container.querySelector('#inc-adults');
  const decAdults = container.querySelector('#dec-adults');
  const incChildren = container.querySelector('#inc-children');
  const decChildren = container.querySelector('#dec-children');
  const incInfants = container.querySelector('#inc-infants');
  const decInfants = container.querySelector('#dec-infants');

  incAdults?.addEventListener('click', () => {
    const cur = store.getState().searchParams.passengers;
    if (cur.adults < 9) {
      store.updateSearchParams({ passengers: { ...cur, adults: cur.adults + 1 } });
      container.querySelector('#val-adults').textContent = cur.adults + 1;
      decAdults.disabled = false;
    }
  });
  decAdults?.addEventListener('click', () => {
    const cur = store.getState().searchParams.passengers;
    if (cur.adults > 1) {
      store.updateSearchParams({ passengers: { ...cur, adults: cur.adults - 1 } });
      container.querySelector('#val-adults').textContent = cur.adults - 1;
      if (cur.adults - 1 <= 1) decAdults.disabled = true;
    }
  });

  incChildren?.addEventListener('click', () => {
    const cur = store.getState().searchParams.passengers;
    if (cur.children < 9) {
      store.updateSearchParams({ passengers: { ...cur, children: cur.children + 1 } });
      container.querySelector('#val-children').textContent = cur.children + 1;
      decChildren.disabled = false;
    }
  });
  decChildren?.addEventListener('click', () => {
    const cur = store.getState().searchParams.passengers;
    if (cur.children > 0) {
      store.updateSearchParams({ passengers: { ...cur, children: cur.children - 1 } });
      container.querySelector('#val-children').textContent = cur.children - 1;
      if (cur.children - 1 <= 0) decChildren.disabled = true;
    }
  });

  incInfants?.addEventListener('click', () => {
    const cur = store.getState().searchParams.passengers;
    if (cur.infants < cur.adults) {
      store.updateSearchParams({ passengers: { ...cur, infants: cur.infants + 1 } });
      container.querySelector('#val-infants').textContent = cur.infants + 1;
      decInfants.disabled = false;
    } else {
      window.showToast?.('Infants cannot exceed adult passengers', 'warning');
    }
  });
  decInfants?.addEventListener('click', () => {
    const cur = store.getState().searchParams.passengers;
    if (cur.infants > 0) {
      store.updateSearchParams({ passengers: { ...cur, infants: cur.infants - 1 } });
      container.querySelector('#val-infants').textContent = cur.infants - 1;
      if (cur.infants - 1 <= 0) decInfants.disabled = true;
    }
  });

  // Autocomplete
  setupAirportInput(
    container.querySelector('#input-origin'),
    container.querySelector('#origin-dropdown'),
    (code) => {
      store.updateSearchParams({ origin: code });
      renderSearch(container);
    }
  );

  setupAirportInput(
    container.querySelector('#input-destination'),
    container.querySelector('#dest-dropdown'),
    (code) => {
      store.updateSearchParams({ destination: code });
      renderSearch(container);
    }
  );

  // Search Action
  container.querySelector('#btn-submit-search')?.addEventListener('click', executeFlightSearch);
}

function setupAirportInput(inputEl, dropdownEl, onSelect) {
  if (!inputEl || !dropdownEl) return;

  function renderList(query) {
    const matches = searchAirports(query);
    if (matches.length === 0) {
      dropdownEl.innerHTML = `<div class="p-3 text-sm text-slate-400 text-center">No matching airports found</div>`;
      dropdownEl.classList.remove('hidden');
      return;
    }

    dropdownEl.innerHTML = matches.map(a => `
      <div class="airport-option flex items-center justify-between px-4 py-2.5 hover:bg-sky-50 cursor-pointer border-b border-slate-50 last:border-0" data-code="${a.code}">
        <div>
          <div class="font-semibold text-sm text-slate-800">${a.city}, ${a.country}</div>
          <div class="text-xs text-slate-400">${a.name}</div>
        </div>
        <span class="px-2 py-0.5 text-xs font-bold bg-sky-100 text-sky-700 rounded-md">${a.code}</span>
      </div>
    `).join('');

    dropdownEl.classList.remove('hidden');

    dropdownEl.querySelectorAll('.airport-option').forEach(item => {
      item.addEventListener('click', () => {
        const code = item.getAttribute('data-code');
        dropdownEl.classList.add('hidden');
        onSelect(code);
      });
    });
  }

  inputEl.addEventListener('focus', () => renderList(inputEl.value));
  inputEl.addEventListener('input', (e) => renderList(e.target.value));

  document.addEventListener('click', (e) => {
    if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
      dropdownEl.classList.add('hidden');
    }
  });
}

export function executeFlightSearch() {
  const { searchParams } = store.getState();

  if (searchParams.origin === searchParams.destination) {
    window.showToast?.('Origin and Destination airports cannot be identical', 'error');
    return;
  }

  window.showToast?.('Searching for best flights...', 'info');

  store.setState({
    activeTab: 'results',
    searchResults: {
      outbound: [],
      inbound: [],
      loading: true
    }
  });

  setTimeout(() => {
    const outbound = generateFlights(
      searchParams.origin,
      searchParams.destination,
      searchParams.departureDate,
      searchParams.cabinClass
    );

    let inbound = [];
    if (searchParams.tripType === 'round') {
      inbound = generateFlights(
        searchParams.destination,
        searchParams.origin,
        searchParams.returnDate,
        searchParams.cabinClass
      );
    }

    store.setState({
      searchResults: {
        outbound,
        inbound,
        loading: false
      }
    });

    window.showToast?.(`Found ${outbound.length} available flights!`, 'success');
  }, 600);
}
