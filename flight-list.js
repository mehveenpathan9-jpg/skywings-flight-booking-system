// Flight Search Results, Filtering, and Selection Component
import { store, CURRENCIES } from '../state.js';
import { getAirport } from '../data/airports.js';

let currentLeg = 'outbound'; // 'outbound' or 'inbound'

export function renderFlightResults(container) {
  const state = store.getState();
  const { searchResults, searchParams, filters, selectedBooking } = state;

  if (searchResults.loading) {
    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent mb-4"></div>
        <h3 class="text-xl font-bold text-slate-800">Finding the best flights for you...</h3>
        <p class="text-slate-500 text-sm mt-1">Comparing real-time airline rates, schedules & seat availability</p>
      </div>
    `;
    return;
  }

  const isRoundTrip = searchParams.tripType === 'round';
  const flightsToDisplay = currentLeg === 'outbound' ? searchResults.outbound : searchResults.inbound;

  const originAirport = currentLeg === 'outbound' ? getAirport(searchParams.origin) : getAirport(searchParams.destination);
  const destAirport = currentLeg === 'outbound' ? getAirport(searchParams.destination) : getAirport(searchParams.origin);
  const activeDate = currentLeg === 'outbound' ? searchParams.departureDate : searchParams.returnDate;

  // Apply filters
  const filteredFlights = filterAndSortFlights(flightsToDisplay, filters);

  // Collect unique airlines for filter list
  const availableAirlines = Array.from(new Set(flightsToDisplay.map(f => f.airline.name))).map(name => {
    const flight = flightsToDisplay.find(f => f.airline.name === name);
    return flight.airline;
  });

  const minPrice = flightsToDisplay.length ? Math.min(...flightsToDisplay.map(f => f.pricing.total)) : 0;
  const maxPrice = flightsToDisplay.length ? Math.max(...flightsToDisplay.map(f => f.pricing.total)) : 3000;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <!-- Search Summary Header -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <button id="btn-back-search" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <div>
            <div class="flex items-center space-x-2 text-lg font-bold text-slate-900">
              <span>${originAirport.city} (${originAirport.code})</span>
              <i data-lucide="arrow-right" class="w-4 h-4 text-sky-600"></i>
              <span>${destAirport.city} (${destAirport.code})</span>
            </div>
            <div class="text-xs text-slate-500 mt-0.5">
              ${new Date(activeDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • 
              ${searchParams.passengers.adults + searchParams.passengers.children + searchParams.passengers.infants} Traveler(s) • 
              <span class="capitalize">${searchParams.cabinClass}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button id="btn-modify-search" class="px-4 py-2 text-sm font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl transition flex items-center space-x-1.5">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
            <span>Modify Search</span>
          </button>
        </div>
      </div>

      <!-- Round Trip Step Indicator -->
      ${isRoundTrip ? `
        <div class="flex items-center justify-center space-x-4 mb-6">
          <button id="tab-leg-outbound" class="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${currentLeg === 'outbound' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}">
            <i data-lucide="plane-takeoff" class="w-4 h-4"></i>
            <span>1. Outbound: ${searchParams.origin} ➔ ${searchParams.destination}</span>
            ${selectedBooking.outboundFlight ? '<i data-lucide="check-circle" class="w-4 h-4 text-emerald-300"></i>' : ''}
          </button>
          <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
          <button id="tab-leg-inbound" class="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${currentLeg === 'inbound' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}" ${!selectedBooking.outboundFlight ? 'disabled opacity-50 cursor-not-allowed' : ''}>
            <i data-lucide="plane-landing" class="w-4 h-4"></i>
            <span>2. Return: ${searchParams.destination} ➔ ${searchParams.origin}</span>
            ${selectedBooking.inboundFlight ? '<i data-lucide="check-circle" class="w-4 h-4 text-emerald-300"></i>' : ''}
          </button>
        </div>
      ` : ''}

      <!-- Main Layout: Filters Sidebar + Results List -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <h4 class="font-bold text-slate-900 flex items-center space-x-2">
                <i data-lucide="sliders-horizontal" class="w-4 h-4 text-sky-600"></i>
                <span>Filters</span>
              </h4>
              <button id="btn-reset-filters" class="text-xs text-sky-600 hover:text-sky-800 font-semibold">Reset</button>
            </div>

            <!-- Stops Filter -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Stops</label>
              <div class="space-y-2">
                <label class="flex items-center justify-between text-sm text-slate-700 cursor-pointer">
                  <div class="flex items-center space-x-2">
                    <input type="radio" name="filter-stops" value="all" ${filters.stops === 'all' ? 'checked' : ''} class="text-sky-600 focus:ring-sky-500">
                    <span>All Flights</span>
                  </div>
                  <span class="text-xs text-slate-400">(${flightsToDisplay.length})</span>
                </label>
                <label class="flex items-center justify-between text-sm text-slate-700 cursor-pointer">
                  <div class="flex items-center space-x-2">
                    <input type="radio" name="filter-stops" value="direct" ${filters.stops === 'direct' ? 'checked' : ''} class="text-sky-600 focus:ring-sky-500">
                    <span>Non-stop only</span>
                  </div>
                  <span class="text-xs text-slate-400">(${flightsToDisplay.filter(f => f.stops === 0).length})</span>
                </label>
                <label class="flex items-center justify-between text-sm text-slate-700 cursor-pointer">
                  <div class="flex items-center space-x-2">
                    <input type="radio" name="filter-stops" value="1stop" ${filters.stops === '1stop' ? 'checked' : ''} class="text-sky-600 focus:ring-sky-500">
                    <span>1 Stop</span>
                  </div>
                  <span class="text-xs text-slate-400">(${flightsToDisplay.filter(f => f.stops === 1).length})</span>
                </label>
              </div>
            </div>

            <!-- Price Slider -->
            <div class="pt-4 border-t border-slate-100">
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Max Price</label>
                <span class="text-sm font-bold text-sky-600" id="filter-price-label">${store.formatPrice(filters.maxPrice)}</span>
              </div>
              <input type="range" id="filter-max-price" min="${minPrice}" max="${maxPrice + 200}" value="${filters.maxPrice}" step="20"
                class="w-full accent-sky-600 cursor-pointer">
              <div class="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>${store.formatPrice(minPrice)}</span>
                <span>${store.formatPrice(maxPrice)}</span>
              </div>
            </div>

            <!-- Departure Time of Day -->
            <div class="pt-4 border-t border-slate-100">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Departure Time</label>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <button class="filter-time-btn p-2 rounded-lg border text-center transition ${filters.timeOfDay === 'morning' ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}" data-time="morning">
                  <div class="font-bold">Morning</div>
                  <div class="text-[10px] text-slate-400">06:00 - 12:00</div>
                </button>
                <button class="filter-time-btn p-2 rounded-lg border text-center transition ${filters.timeOfDay === 'afternoon' ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}" data-time="afternoon">
                  <div class="font-bold">Afternoon</div>
                  <div class="text-[10px] text-slate-400">12:00 - 18:00</div>
                </button>
                <button class="filter-time-btn p-2 rounded-lg border text-center transition ${filters.timeOfDay === 'evening' ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}" data-time="evening">
                  <div class="font-bold">Evening</div>
                  <div class="text-[10px] text-slate-400">18:00 - 24:00</div>
                </button>
                <button class="filter-time-btn p-2 rounded-lg border text-center transition ${filters.timeOfDay === 'all' ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}" data-time="all">
                  <div class="font-bold">Any Time</div>
                  <div class="text-[10px] text-slate-400">24 Hours</div>
                </button>
              </div>
            </div>

            <!-- Airlines -->
            <div class="pt-4 border-t border-slate-100">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Airlines</label>
              <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                ${availableAirlines.map(airline => {
                  const isChecked = filters.airlines.length === 0 || filters.airlines.includes(airline.name);
                  return `
                    <label class="flex items-center justify-between text-sm text-slate-700 cursor-pointer">
                      <div class="flex items-center space-x-2">
                        <input type="checkbox" class="filter-airline-check text-sky-600 rounded focus:ring-sky-500" value="${airline.name}" ${isChecked ? 'checked' : ''}>
                        <span>${airline.name}</span>
                      </div>
                      <span class="text-xs text-slate-400">${airline.code}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Flight Cards Column -->
        <div class="lg:col-span-3 space-y-4">
          <!-- Sort Bar -->
          <div class="bg-white rounded-xl border border-slate-200/80 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-sm">
            <span class="text-slate-500 text-xs font-medium">Showing <strong class="text-slate-900">${filteredFlights.length}</strong> flights</span>
            
            <div class="flex items-center space-x-2">
              <span class="text-xs font-semibold text-slate-500">Sort by:</span>
              <select id="select-sort-flights" class="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                <option value="cheapest" ${filters.sortBy === 'cheapest' ? 'selected' : ''}>Cheapest Price</option>
                <option value="fastest" ${filters.sortBy === 'fastest' ? 'selected' : ''}>Fastest Duration</option>
                <option value="best" ${filters.sortBy === 'best' ? 'selected' : ''}>Best Value</option>
                <option value="departure" ${filters.sortBy === 'departure' ? 'selected' : ''}>Earliest Departure</option>
              </select>
            </div>
          </div>

          <!-- Flights Listing -->
          ${filteredFlights.length === 0 ? `
            <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <i data-lucide="plane-off" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
              <h4 class="text-lg font-bold text-slate-800">No flights match your filters</h4>
              <p class="text-sm text-slate-500 mt-1">Try expanding your price range or clearing some filters.</p>
              <button id="btn-clear-all-filters" class="mt-4 px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition">Reset All Filters</button>
            </div>
          ` : `
            <div class="space-y-4">
              ${filteredFlights.map(flight => renderFlightCard(flight, currentLeg, selectedBooking)).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }

  attachFlightListEvents(container);
}

function renderFlightCard(flight, leg, selectedBooking) {
  const isSelected = (leg === 'outbound' && selectedBooking.outboundFlight?.id === flight.id) ||
                     (leg === 'inbound' && selectedBooking.inboundFlight?.id === flight.id);

  const depTime = new Date(flight.departureTime);
  const arrTime = new Date(flight.arrivalTime);

  const formatHoursMins = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  const isNextDay = arrTime.getDate() !== depTime.getDate();

  return `
    <div class="flight-card bg-white rounded-2xl border transition-all ${isSelected ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md' : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'} overflow-hidden" data-flight-id="${flight.id}">
      <div class="p-5 sm:p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <!-- Airline & Flight Info -->
          <div class="flex items-center space-x-3.5 md:w-1/4">
            <div class="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 shadow-sm" style="border-left: 4px solid ${flight.airline.color}">
              ${flight.airline.code}
            </div>
            <div>
              <div class="font-bold text-slate-900 text-sm">${flight.airline.name}</div>
              <div class="text-xs text-slate-400 font-medium">${flight.flightNumber} • ${flight.aircraft}</div>
            </div>
          </div>

          <!-- Timeline: Departure - Arrow - Arrival -->
          <div class="flex items-center justify-between md:justify-center space-x-6 md:w-2/4">
            <!-- Departure -->
            <div class="text-left">
              <div class="text-xl font-extrabold text-slate-900">${depTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
              <div class="text-xs font-bold text-sky-700">${flight.origin.code}</div>
              <div class="text-[11px] text-slate-400 truncate max-w-[80px]">${flight.origin.city}</div>
            </div>

            <!-- Route Visualization -->
            <div class="flex-1 max-w-[160px] text-center">
              <div class="text-[11px] font-semibold text-slate-500 mb-1">${formatHoursMins(flight.durationMinutes)}</div>
              <div class="relative flex items-center justify-center">
                <div class="w-full h-0.5 bg-slate-200"></div>
                <div class="absolute w-2 h-2 rounded-full ${flight.stops === 0 ? 'bg-emerald-500' : 'bg-amber-500'}"></div>
                <i data-lucide="plane" class="w-3.5 h-3.5 text-sky-600 absolute right-0 -translate-y-[1px]"></i>
              </div>
              <div class="text-[11px] font-semibold mt-1 ${flight.stops === 0 ? 'text-emerald-600' : 'text-amber-600'}">
                ${flight.stops === 0 ? 'Direct' : `1 stop (${flight.layover.airport.code})`}
              </div>
            </div>

            <!-- Arrival -->
            <div class="text-right">
              <div class="text-xl font-extrabold text-slate-900 flex items-center justify-end">
                <span>${arrTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                ${isNextDay ? '<sup class="text-[10px] text-amber-500 font-bold ml-0.5">+1d</sup>' : ''}
              </div>
              <div class="text-xs font-bold text-sky-700">${flight.destination.code}</div>
              <div class="text-[11px] text-slate-400 truncate max-w-[80px]">${flight.destination.city}</div>
            </div>
          </div>

          <!-- Pricing & Action -->
          <div class="flex items-center justify-between md:justify-end md:flex-col md:items-end gap-2 md:w-1/4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            <div class="text-left md:text-right">
              <div class="text-2xl font-black text-slate-900">${store.formatPrice(flight.pricing.total)}</div>
              <div class="text-[11px] text-slate-400">per traveler (incl. taxes)</div>
            </div>
            
            <button class="btn-select-flight px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center space-x-1.5 ${isSelected ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-sky-600 hover:bg-sky-700 text-white'}" data-flight-id="${flight.id}">
              <span>${isSelected ? 'Selected' : 'Select Flight'}</span>
              <i data-lucide="${isSelected ? 'check' : 'chevron-right'}" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- Badges & Details Accordion Toggle -->
        <div class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div class="flex flex-wrap items-center gap-3">
            <span class="inline-flex items-center space-x-1 text-slate-600">
              <i data-lucide="luggage" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>${flight.baggageAllowance}</span>
            </span>
            <span class="inline-flex items-center space-x-1 text-slate-600">
              <i data-lucide="wifi" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>High-speed Wi-Fi</span>
            </span>
            <span class="inline-flex items-center space-x-1 text-slate-600">
              <i data-lucide="utensils" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>Meal Included</span>
            </span>
            <span class="text-amber-600 font-semibold">${flight.seatsRemaining} seats left at this price</span>
          </div>

          <button class="btn-toggle-flight-details text-sky-600 hover:text-sky-800 font-semibold flex items-center space-x-1 mt-2 sm:mt-0" data-flight-id="${flight.id}">
            <span>Flight Details & Fares</span>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- Expandable Details & Fare Tiers Drawer -->
        <div id="details-${flight.id}" class="hidden mt-4 pt-4 border-t border-slate-100">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <!-- Saver -->
            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div class="font-bold text-slate-800 text-sm">${flight.fareTiers.saver.name}</div>
                <div class="text-base font-extrabold text-slate-900 mt-1">${store.formatPrice(flight.fareTiers.saver.price)}</div>
                <ul class="text-xs text-slate-600 space-y-1.5 mt-2">
                  <li class="flex items-center space-x-1.5"><i data-lucide="check" class="w-3 h-3 text-emerald-500"></i><span>${flight.fareTiers.saver.checkedBaggage}</span></li>
                  <li class="flex items-center space-x-1.5"><i data-lucide="x" class="w-3 h-3 text-rose-500"></i><span>Seat: ${flight.fareTiers.saver.seatSelection}</span></li>
                  <li class="flex items-center space-x-1.5"><i data-lucide="x" class="w-3 h-3 text-rose-500"></i><span>${flight.fareTiers.saver.cancellation}</span></li>
                </ul>
              </div>
              <button class="btn-choose-fare w-full mt-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-xs font-bold text-slate-700 transition" data-flight-id="${flight.id}" data-tier="saver">
                Select Saver
              </button>
            </div>

            <!-- Standard (Popular) -->
            <div class="p-3.5 rounded-xl border-2 border-sky-500 bg-sky-50/30 flex flex-col justify-between relative shadow-sm">
              <div class="absolute -top-2.5 right-3 px-2 py-0.5 bg-sky-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Recommended</div>
              <div>
                <div class="font-bold text-slate-800 text-sm">${flight.fareTiers.standard.name}</div>
                <div class="text-base font-extrabold text-sky-700 mt-1">${store.formatPrice(flight.fareTiers.standard.price)}</div>
                <ul class="text-xs text-slate-600 space-y-1.5 mt-2">
                  <li class="flex items-center space-x-1.5"><i data-lucide="check" class="w-3 h-3 text-emerald-500"></i><span>${flight.fareTiers.standard.checkedBaggage}</span></li>
                  <li class="flex items-center space-x-1.5"><i data-lucide="check" class="w-3 h-3 text-emerald-500"></i><span>${flight.fareTiers.standard.seatSelection}</span></li>
                  <li class="flex items-center space-x-1.5"><i data-lucide="check" class="w-3 h-3 text-emerald-500"></i><span>${flight.fareTiers.standard.cancellation}</span></li>
                </ul>
              </div>
              <button class="btn-choose-fare w-full mt-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-xs font-bold text-white transition shadow-sm" data-flight-id="${flight.id}" data-tier="standard">
                Select Standard
              </button>
            </div>

            <!-- Flex -->
            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div class="font-bold text-slate-800 text-sm">${flight.fareTiers.flex.name}</div>
                <div class="text-base font-extrabold text-slate-900 mt-1">${store.formatPrice(flight.fareTiers.flex.price)}</div>
                <ul class="text-xs text-slate-600 space-y-1.5 mt-2">
                  <li class="flex items-center space-x-1.5"><i data-lucide="check" class="w-3 h-3 text-emerald-500"></i><span>${flight.fareTiers.flex.checkedBaggage}</span></li>
                  <li class="flex items-center space-x-1.5"><i data-lucide="check" class="w-3 h-3 text-emerald-500"></i><span>${flight.fareTiers.flex.seatSelection}</span></li>
                  <li class="flex items-center space-x-1.5"><i data-lucide="check" class="w-3 h-3 text-emerald-500"></i><span>${flight.fareTiers.flex.cancellation}</span></li>
                </ul>
              </div>
              <button class="btn-choose-fare w-full mt-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-xs font-bold text-slate-700 transition" data-flight-id="${flight.id}" data-tier="flex">
                Select Flex
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

function filterAndSortFlights(flights, filters) {
  let list = [...flights];

  // Filter stops
  if (filters.stops === 'direct') {
    list = list.filter(f => f.stops === 0);
  } else if (filters.stops === '1stop') {
    list = list.filter(f => f.stops === 1);
  }

  // Filter price
  list = list.filter(f => f.pricing.total <= filters.maxPrice);

  // Filter airlines
  if (filters.airlines.length > 0) {
    list = list.filter(f => filters.airlines.includes(f.airline.name));
  }

  // Filter time of day
  if (filters.timeOfDay !== 'all') {
    list = list.filter(f => {
      const h = new Date(f.departureTime).getHours();
      if (filters.timeOfDay === 'morning') return h >= 6 && h < 12;
      if (filters.timeOfDay === 'afternoon') return h >= 12 && h < 18;
      if (filters.timeOfDay === 'evening') return h >= 18 && h <= 23;
      return true;
    });
  }

  // Sort
  if (filters.sortBy === 'cheapest') {
    list.sort((a, b) => a.pricing.total - b.pricing.total);
  } else if (filters.sortBy === 'fastest') {
    list.sort((a, b) => a.durationMinutes - b.durationMinutes);
  } else if (filters.sortBy === 'departure') {
    list.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
  } else if (filters.sortBy === 'best') {
    list.sort((a, b) => (a.pricing.total * 0.6 + a.durationMinutes * 0.4) - (b.pricing.total * 0.6 + b.durationMinutes * 0.4));
  }

  return list;
}

function attachFlightListEvents(container) {
  // Back to Search
  container.querySelector('#btn-back-search')?.addEventListener('click', () => {
    store.setState({ activeTab: 'home' });
  });

  container.querySelector('#btn-modify-search')?.addEventListener('click', () => {
    store.setState({ activeTab: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Leg switcher for round trip
  container.querySelector('#tab-leg-outbound')?.addEventListener('click', () => {
    currentLeg = 'outbound';
    renderFlightResults(container);
  });

  container.querySelector('#tab-leg-inbound')?.addEventListener('click', () => {
    currentLeg = 'inbound';
    renderFlightResults(container);
  });

  // Filter Stops Radio
  container.querySelectorAll('input[name="filter-stops"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      store.updateFilters({ stops: e.target.value });
      renderFlightResults(container);
    });
  });

  // Price Slider
  const priceSlider = container.querySelector('#filter-max-price');
  priceSlider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    container.querySelector('#filter-price-label').textContent = store.formatPrice(val);
  });
  priceSlider?.addEventListener('change', (e) => {
    store.updateFilters({ maxPrice: parseInt(e.target.value, 10) });
    renderFlightResults(container);
  });

  // Time of Day buttons
  container.querySelectorAll('.filter-time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-time');
      store.updateFilters({ timeOfDay: t });
      renderFlightResults(container);
    });
  });

  // Airline Checkboxes
  container.querySelectorAll('.filter-airline-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = Array.from(container.querySelectorAll('.filter-airline-check:checked')).map(x => x.value);
      store.updateFilters({ airlines: selected });
      renderFlightResults(container);
    });
  });

  // Reset Filters
  const resetBtn = container.querySelector('#btn-reset-filters');
  const clearAllBtn = container.querySelector('#btn-clear-all-filters');
  const doReset = () => {
    store.updateFilters({
      stops: 'all',
      maxPrice: 3000,
      airlines: [],
      timeOfDay: 'all',
      sortBy: 'cheapest'
    });
    renderFlightResults(container);
  };
  resetBtn?.addEventListener('click', doReset);
  clearAllBtn?.addEventListener('click', doReset);

  // Sort dropdown
  container.querySelector('#select-sort-flights')?.addEventListener('change', (e) => {
    store.updateFilters({ sortBy: e.target.value });
    renderFlightResults(container);
  });

  // Accordion toggle details
  container.querySelectorAll('.btn-toggle-flight-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-flight-id');
      const drawer = container.querySelector(`#details-${id}`);
      if (drawer) {
        drawer.classList.toggle('hidden');
      }
    });
  });

  // Flight Selection / Fare Selection Handlers
  container.querySelectorAll('.btn-select-flight, .btn-choose-fare').forEach(btn => {
    btn.addEventListener('click', () => {
      const flightId = btn.getAttribute('data-flight-id');
      const tier = btn.getAttribute('data-tier') || 'standard';
      handleFlightSelection(flightId, tier, container);
    });
  });
}

function handleFlightSelection(flightId, tier, container) {
  const state = store.getState();
  const isRoundTrip = state.searchParams.tripType === 'round';
  const flightPool = currentLeg === 'outbound' ? state.searchResults.outbound : state.searchResults.inbound;
  const flight = flightPool.find(f => f.id === flightId);

  if (!flight) return;

  if (currentLeg === 'outbound') {
    state.selectedBooking.outboundFlight = flight;
    state.selectedBooking.outboundTier = tier;

    if (isRoundTrip) {
      window.showToast?.(`Outbound flight selected: ${flight.flightNumber}! Now choose return flight.`, 'success');
      currentLeg = 'inbound';
      renderFlightResults(container);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.showToast?.(`Flight selected: ${flight.flightNumber}`, 'success');
      // Advance to Passenger Details
      store.setState({ activeTab: 'passengers' });
    }
  } else {
    state.selectedBooking.inboundFlight = flight;
    state.selectedBooking.inboundTier = tier;
    window.showToast?.(`Return flight selected: ${flight.flightNumber}`, 'success');
    // Advance to Passenger Details
    store.setState({ activeTab: 'passengers' });
  }
}
