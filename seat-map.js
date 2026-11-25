// Interactive Aircraft Seat Map Selection Component
import { store } from '../state.js';

let activePassengerIndex = 0;
let activeFlightLeg = 'outbound'; // 'outbound' | 'inbound'

export function renderSeatMap(container) {
  const state = store.getState();
  const { selectedBooking, searchParams } = state;
  const isRoundTrip = searchParams.tripType === 'round' && selectedBooking.inboundFlight;

  const currentFlight = activeFlightLeg === 'outbound' ? selectedBooking.outboundFlight : selectedBooking.inboundFlight;
  if (!currentFlight) {
    store.setState({ activeTab: 'home' });
    return;
  }

  const passengers = selectedBooking.passengers.length > 0 
    ? selectedBooking.passengers 
    : initializeDefaultPassengers(searchParams.passengers);

  selectedBooking.passengers = passengers;

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button id="btn-back-from-seats" class="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center space-x-1 mb-2">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            <span>Back to Passenger Details</span>
          </button>
          <h2 class="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <i data-lucide="armchair" class="w-6 h-6 text-sky-600"></i>
            <span>Select Your Preferred Seats</span>
          </h2>
          <p class="text-sm text-slate-500 mt-0.5">
            ${currentFlight.airline.name} ${currentFlight.flightNumber} • ${currentFlight.aircraft} • ${currentFlight.origin.code} ➔ ${currentFlight.destination.code}
          </p>
        </div>

        <!-- Round trip leg toggle -->
        ${isRoundTrip ? `
          <div class="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
            <button id="btn-seatleg-outbound" class="px-4 py-1.5 text-xs font-bold rounded-lg transition ${activeFlightLeg === 'outbound' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              Outbound: ${currentFlight.origin.code}
            </button>
            <button id="btn-seatleg-inbound" class="px-4 py-1.5 text-xs font-bold rounded-lg transition ${activeFlightLeg === 'inbound' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              Return: ${selectedBooking.inboundFlight.origin.code}
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Main Layout: Passenger Selector + Fuselage Seat Grid + Legend -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left: Passenger Assignment List & Summary -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 class="font-bold text-slate-900 text-sm mb-3">Passenger Seat Assignments</h4>
            <div class="space-y-2">
              ${passengers.map((p, idx) => {
                const assignedSeat = activeFlightLeg === 'outbound' ? p.seatOutbound : p.seatInbound;
                const isCurrent = idx === activePassengerIndex;
                return `
                  <button class="btn-select-passenger w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${isCurrent ? 'border-sky-600 bg-sky-50 ring-1 ring-sky-500' : 'border-slate-200 hover:bg-slate-50'}" data-index="${idx}">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-full ${isCurrent ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'} flex items-center justify-center text-xs font-bold">
                        ${idx + 1}
                      </div>
                      <div>
                        <div class="text-sm font-bold text-slate-800">${p.firstName || `Passenger ${idx + 1}`} ${p.lastName || ''}</div>
                        <div class="text-[11px] text-slate-400 capitalize">${p.type || 'Adult'}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      ${assignedSeat ? `
                        <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-lg shadow-sm">
                          ${assignedSeat}
                        </span>
                      ` : `
                        <span class="text-xs text-amber-600 font-semibold italic">Unselected</span>
                      `}
                    </div>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Seat Legend -->
            <div class="mt-6 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div class="font-bold text-slate-700 mb-2">Seat Types & Pricing</div>
              <div class="flex items-center space-x-2.5">
                <div class="w-5 h-5 rounded bg-sky-100 border border-sky-300"></div>
                <span class="text-slate-600">Standard Seat (Included / ${store.formatPrice(0)})</span>
              </div>
              <div class="flex items-center space-x-2.5">
                <div class="w-5 h-5 rounded bg-amber-100 border border-amber-300"></div>
                <span class="text-slate-600">Extra Legroom (+${store.formatPrice(35)})</span>
              </div>
              <div class="flex items-center space-x-2.5">
                <div class="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                <span class="text-slate-600 font-bold">Selected Seat</span>
              </div>
              <div class="flex items-center space-x-2.5">
                <div class="w-5 h-5 rounded bg-slate-200 border border-slate-300"></div>
                <span class="text-slate-400">Occupied (Unavailable)</span>
              </div>
            </div>

            <!-- Action Proceed -->
            <div class="mt-6 pt-4 border-t border-slate-100">
              <button id="btn-proceed-to-checkout" class="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2 transition">
                <span>Continue to Payment</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Center/Right: Interactive Aircraft Fuselage -->
        <div class="lg:col-span-2 flex justify-center">
          <div class="airplane-fuselage p-6 md:p-8 max-w-md w-full relative">
            <div class="airplane-wing-left"></div>
            <div class="airplane-wing-right"></div>

            <!-- Cockpit nose -->
            <div class="cockpit-nose">
              <div class="cockpit-window"></div>
              <div class="cockpit-window"></div>
            </div>
            
            <div class="text-center mb-4">
              <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400">Front of Aircraft • Cockpit</span>
            </div>

            <!-- Column Letters Header -->
            <div class="flex items-center justify-between px-2 mb-3 text-xs font-bold text-slate-400">
              <div class="flex space-x-2 w-28 justify-around">
                <span>A</span><span>B</span><span>C</span>
              </div>
              <div class="aisle-space">Row</div>
              <div class="flex space-x-2 w-28 justify-around">
                <span>D</span><span>E</span><span>F</span>
              </div>
            </div>

            <!-- Rows Generator -->
            <div class="space-y-2">
              ${generateAircraftSeatRows(passengers, activePassengerIndex, activeFlightLeg)}
            </div>

            <div class="text-center mt-6 pt-4 border-t border-slate-200">
              <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400">Rear of Aircraft • Galley & Restrooms</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }

  attachSeatMapEvents(container);
}

function initializeDefaultPassengers(passengerCounts) {
  const list = [];
  for (let i = 0; i < (passengerCounts.adults || 1); i++) {
    list.push({
      id: `p_adult_${i+1}`,
      type: 'Adult',
      title: i === 0 ? 'Ms' : 'Mr',
      firstName: i === 0 ? 'Mehveen' : '',
      lastName: i === 0 ? 'Khan' : '',
      passport: i === 0 ? 'MK7892104' : '',
      meal: 'Regular',
      seatOutbound: '14A',
      seatInbound: '14A'
    });
  }
  for (let i = 0; i < (passengerCounts.children || 0); i++) {
    list.push({
      id: `p_child_${i+1}`,
      type: 'Child',
      title: 'Master',
      firstName: '',
      lastName: '',
      passport: '',
      meal: 'Child Meal',
      seatOutbound: null,
      seatInbound: null
    });
  }
  return list;
}

function generateAircraftSeatRows(passengers, currentPassIdx, leg) {
  const totalRows = 20;
  const occupiedSeed = [
    '1B', '2D', '3A', '3F', '5B', '6C', '7E', '8A', '9D', '10F',
    '11B', '12E', '15C', '16A', '17D', '18F', '19B', '20E'
  ];

  // Currently selected seats across all passengers
  const selectedSeats = {};
  passengers.forEach((p, idx) => {
    const s = leg === 'outbound' ? p.seatOutbound : p.seatInbound;
    if (s) {
      selectedSeats[s] = { passengerIdx: idx, name: p.firstName || `P${idx+1}` };
    }
  });

  let rowsHtml = '';

  for (let r = 1; r <= totalRows; r++) {
    const isExitRow = r === 10;
    const isExtraLegroom = r <= 5 || r === 10;
    const isBusiness = r <= 3;

    rowsHtml += `
      ${isExitRow ? `
        <div class="flex items-center justify-between my-2 px-1 text-[10px] font-bold text-amber-600 bg-amber-50 rounded-lg py-1 border border-amber-200">
          <span>⤿ EMERGENCY EXIT</span>
          <span>EXTRA LEGROOM</span>
          <span>EMERGENCY EXIT ⤾</span>
        </div>
      ` : ''}

      <div class="flex items-center justify-between">
        <!-- Left 3 Seats: A, B, C -->
        <div class="flex space-x-2">
          ${['A', 'B', 'C'].map(col => {
            const seatId = `${r}${col}`;
            const isOccupied = occupiedSeed.includes(seatId);
            const selection = selectedSeats[seatId];
            const isSelected = !!selection;
            const isSelectedByActivePassenger = selection && selection.passengerIdx === currentPassIdx;

            let seatClass = 'seat ';
            if (isSelected) {
              seatClass += 'selected';
            } else if (isOccupied) {
              seatClass += 'occupied';
            } else if (isExtraLegroom) {
              seatClass += 'available extra-legroom';
            } else {
              seatClass += 'available';
            }

            return `
              <div class="${seatClass}" data-seat="${seatId}" data-price="${isExtraLegroom ? 35 : 0}" title="Seat ${seatId} ${isExtraLegroom ? '(+$35 Extra Legroom)' : '(Standard)'}">
                ${isSelected ? seatId : col}
              </div>
            `;
          }).join('')}
        </div>

        <!-- Aisle & Row Number -->
        <div class="aisle-space font-bold text-slate-400">
          ${r}
        </div>

        <!-- Right 3 Seats: D, E, F -->
        <div class="flex space-x-2">
          ${['D', 'E', 'F'].map(col => {
            const seatId = `${r}${col}`;
            const isOccupied = occupiedSeed.includes(seatId);
            const selection = selectedSeats[seatId];
            const isSelected = !!selection;
            const isSelectedByActivePassenger = selection && selection.passengerIdx === currentPassIdx;

            let seatClass = 'seat ';
            if (isSelected) {
              seatClass += 'selected';
            } else if (isOccupied) {
              seatClass += 'occupied';
            } else if (isExtraLegroom) {
              seatClass += 'available extra-legroom';
            } else {
              seatClass += 'available';
            }

            return `
              <div class="${seatClass}" data-seat="${seatId}" data-price="${isExtraLegroom ? 35 : 0}" title="Seat ${seatId} ${isExtraLegroom ? '(+$35 Extra Legroom)' : '(Standard)'}">
                ${isSelected ? seatId : col}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  return rowsHtml;
}

function attachSeatMapEvents(container) {
  const state = store.getState();
  const passengers = state.selectedBooking.passengers;

  // Back button
  container.querySelector('#btn-back-from-seats')?.addEventListener('click', () => {
    store.setState({ activeTab: 'passengers' });
  });

  // Leg switcher
  container.querySelector('#btn-seatleg-outbound')?.addEventListener('click', () => {
    activeFlightLeg = 'outbound';
    renderSeatMap(container);
  });
  container.querySelector('#btn-seatleg-inbound')?.addEventListener('click', () => {
    activeFlightLeg = 'inbound';
    renderSeatMap(container);
  });

  // Passenger selection buttons
  container.querySelectorAll('.btn-select-passenger').forEach(btn => {
    btn.addEventListener('click', () => {
      activePassengerIndex = parseInt(btn.getAttribute('data-index'), 10);
      renderSeatMap(container);
    });
  });

  // Seat click handlers
  container.querySelectorAll('.seat.available, .seat.selected').forEach(seatEl => {
    seatEl.addEventListener('click', () => {
      const seatCode = seatEl.getAttribute('data-seat');
      const seatPrice = parseInt(seatEl.getAttribute('data-price') || '0', 10);

      const currentPassenger = passengers[activePassengerIndex];
      if (!currentPassenger) return;

      const currentSeat = activeFlightLeg === 'outbound' ? currentPassenger.seatOutbound : currentPassenger.seatInbound;

      // If clicked already assigned seat to this passenger, unselect it
      if (currentSeat === seatCode) {
        if (activeFlightLeg === 'outbound') {
          currentPassenger.seatOutbound = null;
        } else {
          currentPassenger.seatInbound = null;
        }
        window.showToast?.(`Unassigned seat ${seatCode}`, 'info');
      } else {
        // Assign new seat
        if (activeFlightLeg === 'outbound') {
          currentPassenger.seatOutbound = seatCode;
        } else {
          currentPassenger.seatInbound = seatCode;
        }
        window.showToast?.(`Assigned seat ${seatCode} to ${currentPassenger.firstName || `Passenger ${activePassengerIndex + 1}`}`, 'success');

        // Automatically advance to next unassigned passenger if any
        const nextUnassigned = passengers.findIndex((p, i) => i > activePassengerIndex && (activeFlightLeg === 'outbound' ? !p.seatOutbound : !p.seatInbound));
        if (nextUnassigned !== -1) {
          activePassengerIndex = nextUnassigned;
        }
      }

      renderSeatMap(container);
    });
  });

  // Proceed to Checkout
  container.querySelector('#btn-proceed-to-checkout')?.addEventListener('click', () => {
    store.setState({ activeTab: 'checkout' });
  });
}
