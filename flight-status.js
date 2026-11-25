// Live Flight Status and Radar Tracker Component
import { MOCK_FLIGHT_STATUSES } from '../data/flights.js';
import { getAirport } from '../data/airports.js';

export function renderFlightStatus(container) {
  let activeFlight = MOCK_FLIGHT_STATUSES[0];

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto mb-8">
        <div class="inline-flex items-center space-x-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold mb-3">
          <i data-lucide="radio" class="w-3.5 h-3.5 animate-pulse text-sky-600"></i>
          <span>Live Satellite Flight Radar</span>
        </div>
        <h2 class="text-3xl font-black text-slate-900">Real-Time Flight Tracker</h2>
        <p class="text-slate-500 text-sm mt-1">Track live flight progress, arrival forecasts, gate changes, and baggage carousel numbers.</p>
      </div>

      <!-- Search Box -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <div class="flex flex-wrap md:flex-nowrap gap-3">
          <div class="relative flex-1">
            <input type="text" id="status-search-input" placeholder="Search by Flight Number (e.g. EK-201, QR-704, SQ-321)" value="${activeFlight.flightNumber}"
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
          </div>
          <button id="btn-status-search" class="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 transition flex items-center space-x-2">
            <span>Track Flight</span>
          </button>
        </div>

        <!-- Quick Suggestions -->
        <div class="flex flex-wrap items-center gap-2 mt-4 text-xs">
          <span class="text-slate-400 font-semibold">Popular Flights:</span>
          ${MOCK_FLIGHT_STATUSES.map(f => `
            <button class="quick-flight-btn px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 rounded-lg text-slate-700 font-mono font-bold transition" data-flight="${f.flightNumber}">
              ${f.flightNumber} (${f.origin}➔${f.destination})
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Live Flight Card Display -->
      <div id="flight-status-card-wrapper">
        ${renderStatusCard(activeFlight)}
      </div>

    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }

  attachFlightStatusEvents(container);
}

function renderStatusCard(f) {
  const originAirport = getAirport(f.origin);
  const destAirport = getAirport(f.destination);

  const getStatusBadgeClass = (status) => {
    if (status.includes('On Time')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (status.includes('Delayed')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (status.includes('In Flight')) return 'bg-purple-100 text-purple-800 border-purple-200 animate-pulse';
    if (status.includes('Landed')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  };

  return `
    <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in">
      
      <!-- Top Status Banner -->
      <div class="bg-slate-900 text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-3">
            <span class="text-2xl font-black font-display tracking-tight">${f.airline}</span>
            <span class="font-mono text-xl font-bold text-sky-400">${f.flightNumber}</span>
          </div>
          <div class="text-xs text-slate-400 mt-1">${f.aircraft} • Real-time Radar Link Established</div>
        </div>

        <div class="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusBadgeClass(f.status)}">
          ${f.status}
        </div>
      </div>

      <!-- Route Progress Tracker -->
      <div class="p-6 sm:p-8 border-b border-slate-100">
        
        <div class="flex items-center justify-between mb-6">
          <!-- Origin -->
          <div>
            <div class="text-3xl font-black text-slate-900">${f.origin}</div>
            <div class="text-xs font-semibold text-slate-600">${originAirport.city}</div>
            <div class="text-[11px] text-slate-400">${originAirport.name}</div>
          </div>

          <!-- Live Progress Bar with Plane Icon -->
          <div class="flex-1 max-w-md mx-6 text-center">
            <div class="relative flex items-center justify-center my-4">
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full" style="width: ${f.progressPercent}%"></div>
              </div>
              <!-- Moving plane marker -->
              <div class="absolute -top-3 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg transform -translate-x-1/2 transition-all duration-700" style="left: ${f.progressPercent}%">
                <i data-lucide="plane" class="w-4 h-4"></i>
              </div>
            </div>
            <span class="text-xs font-mono font-bold text-slate-500">${f.progressPercent}% Route Completed</span>
          </div>

          <!-- Destination -->
          <div class="text-right">
            <div class="text-3xl font-black text-slate-900">${f.destination}</div>
            <div class="text-xs font-semibold text-slate-600">${destAirport.city}</div>
            <div class="text-[11px] text-slate-400">${destAirport.name}</div>
          </div>
        </div>

        <!-- Times Comparison -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-center">
          <div class="p-3 bg-slate-50 rounded-xl">
            <div class="text-[10px] uppercase font-bold text-slate-400">Scheduled Departure</div>
            <div class="text-base font-extrabold text-slate-800">${f.scheduledDep}</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <div class="text-[10px] uppercase font-bold text-slate-400">Actual Departure</div>
            <div class="text-base font-extrabold text-sky-700">${f.actualDep}</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <div class="text-[10px] uppercase font-bold text-slate-400">Scheduled Arrival</div>
            <div class="text-base font-extrabold text-slate-800">${f.scheduledArr}</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl">
            <div class="text-[10px] uppercase font-bold text-slate-400">Estimated Arrival</div>
            <div class="text-base font-extrabold text-emerald-700">${f.estimatedArr}</div>
          </div>
        </div>

      </div>

      <!-- Terminal, Gate & Flight Telemetry -->
      <div class="p-6 sm:p-8 bg-slate-50/50">
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <i data-lucide="door-open" class="w-5 h-5 text-sky-600 mx-auto mb-1"></i>
            <div class="text-[10px] font-bold text-slate-400 uppercase">Boarding Gate</div>
            <div class="text-xl font-black text-slate-900">${f.gate}</div>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <i data-lucide="building" class="w-5 h-5 text-sky-600 mx-auto mb-1"></i>
            <div class="text-[10px] font-bold text-slate-400 uppercase">Terminal</div>
            <div class="text-xl font-black text-slate-900">${f.terminal}</div>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <i data-lucide="luggage" class="w-5 h-5 text-amber-600 mx-auto mb-1"></i>
            <div class="text-[10px] font-bold text-slate-400 uppercase">Baggage Carousel</div>
            <div class="text-xl font-black text-slate-900">${f.baggageCarousel}</div>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <i data-lucide="arrow-up" class="w-5 h-5 text-purple-600 mx-auto mb-1"></i>
            <div class="text-[10px] font-bold text-slate-400 uppercase">Altitude</div>
            <div class="text-base font-extrabold text-slate-900">${f.altitude}</div>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <i data-lucide="gauge" class="w-5 h-5 text-emerald-600 mx-auto mb-1"></i>
            <div class="text-[10px] font-bold text-slate-400 uppercase">Ground Speed</div>
            <div class="text-base font-extrabold text-slate-900">${f.speed}</div>
          </div>
        </div>
      </div>

    </div>
  `;
}

function attachFlightStatusEvents(container) {
  const searchInput = container.querySelector('#status-search-input');
  const searchBtn = container.querySelector('#btn-status-search');
  const wrapper = container.querySelector('#flight-status-card-wrapper');

  function doSearch(code) {
    const q = code.trim().toUpperCase().replace(/\s+/g, '');
    const found = MOCK_FLIGHT_STATUSES.find(f => f.flightNumber.replace('-', '') === q.replace('-', ''));
    if (found) {
      wrapper.innerHTML = renderStatusCard(found);
      if (window.lucide) window.lucide.createIcons({ root: wrapper });
      window.showToast?.(`Live status updated for ${found.flightNumber}`, 'success');
    } else {
      window.showToast?.(`Flight ${code} not found. Try EK-201, QR-704, SQ-321`, 'error');
    }
  }

  searchBtn?.addEventListener('click', () => {
    if (searchInput.value) doSearch(searchInput.value);
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value) doSearch(searchInput.value);
  });

  container.querySelectorAll('.quick-flight-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fl = btn.getAttribute('data-flight');
      searchInput.value = fl;
      doSearch(fl);
    });
  });
}
