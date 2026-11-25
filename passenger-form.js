// Passenger Information and Add-Ons Form Component
import { store } from '../state.js';

export function renderPassengerForm(container) {
  const state = store.getState();
  const { selectedBooking, searchParams } = state;

  if (!selectedBooking.outboundFlight) {
    store.setState({ activeTab: 'home' });
    return;
  }

  // Ensure passengers are initialized
  if (!selectedBooking.passengers || selectedBooking.passengers.length === 0) {
    const totalAdults = searchParams.passengers.adults || 1;
    const totalChildren = searchParams.passengers.children || 0;
    const totalInfants = searchParams.passengers.infants || 0;

    selectedBooking.passengers = [];
    for (let i = 0; i < totalAdults; i++) {
      selectedBooking.passengers.push({
        id: `p_adult_${i+1}`,
        type: 'Adult',
        title: i === 0 ? 'Ms' : 'Mr',
        firstName: i === 0 ? 'Mehveen' : '',
        lastName: i === 0 ? 'Khan' : '',
        dob: '1995-07-22',
        gender: i === 0 ? 'Female' : 'Male',
        passport: i === 0 ? 'MK7892104' : '',
        nationality: 'United States',
        meal: 'Regular',
        specialAssistance: 'none',
        seatOutbound: '14A',
        seatInbound: '14A'
      });
    }
    for (let i = 0; i < totalChildren; i++) {
      selectedBooking.passengers.push({
        id: `p_child_${i+1}`,
        type: 'Child',
        title: 'Master',
        firstName: '',
        lastName: '',
        dob: '2016-08-20',
        gender: 'Male',
        passport: '',
        nationality: 'United States',
        meal: 'Child Meal',
        specialAssistance: 'none',
        seatOutbound: null,
        seatInbound: null
      });
    }
  }

  const { passengers, addOns } = selectedBooking;

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      
      <!-- Top Breadcrumb & Flight Recap -->
      <div class="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
        <div>
          <button id="btn-back-to-results" class="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center space-x-1 mb-1">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            <span>Back to Flight Selection</span>
          </button>
          <h2 class="text-2xl font-black text-slate-900">Passenger Details & Add-Ons</h2>
          <p class="text-xs text-slate-500">Please enter passenger details matching government-issued photo IDs.</p>
        </div>

        <div class="hidden md:flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-right">
            <div class="text-xs font-bold text-slate-500">Selected Flight</div>
            <div class="text-sm font-extrabold text-slate-900">${selectedBooking.outboundFlight.airline.name} (${selectedBooking.outboundFlight.flightNumber})</div>
          </div>
          <div class="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            ${selectedBooking.outboundFlight.origin.code}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: Passenger Forms & Add-ons -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Passenger Cards -->
          ${passengers.map((p, index) => `
            <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm passenger-card" data-index="${index}">
              <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-black text-xs flex items-center justify-center">
                    ${index + 1}
                  </div>
                  <div>
                    <h4 class="font-extrabold text-slate-900 text-base">Passenger ${index + 1} (${p.type})</h4>
                    <span class="text-xs text-slate-400">Seat: ${p.seatOutbound || 'Not chosen yet'}</span>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase">
                  ${p.type}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
                <!-- Title -->
                <div class="md:col-span-1">
                  <label class="block text-xs font-bold text-slate-600 mb-1">Title</label>
                  <select class="input-pass-title w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="Mr" ${p.title === 'Mr' ? 'selected' : ''}>Mr</option>
                    <option value="Mrs" ${p.title === 'Mrs' ? 'selected' : ''}>Mrs</option>
                    <option value="Ms" ${p.title === 'Ms' ? 'selected' : ''}>Ms</option>
                    <option value="Dr" ${p.title === 'Dr' ? 'selected' : ''}>Dr</option>
                    <option value="Master" ${p.title === 'Master' ? 'selected' : ''}>Master</option>
                  </select>
                </div>

                <!-- First Name -->
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-600 mb-1">First Name *</label>
                  <input type="text" class="input-pass-first w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium" placeholder="First Name" value="${p.firstName || ''}" required>
                </div>

                <!-- Last Name -->
                <div class="md:col-span-3">
                  <label class="block text-xs font-bold text-slate-600 mb-1">Last / Family Name *</label>
                  <input type="text" class="input-pass-last w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium" placeholder="Last Name" value="${p.lastName || ''}" required>
                </div>

                <!-- Date of Birth -->
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-600 mb-1">Date of Birth</label>
                  <input type="date" class="input-pass-dob w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" value="${p.dob || '1995-01-01'}">
                </div>

                <!-- Gender -->
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-600 mb-1">Gender</label>
                  <select class="input-pass-gender w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
                    <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
                    <option value="Other" ${p.gender === 'Other' ? 'selected' : ''}>Other</option>
                  </select>
                </div>

                <!-- Nationality -->
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-600 mb-1">Nationality</label>
                  <select class="input-pass-nationality w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="United States" ${p.nationality === 'United States' ? 'selected' : ''}>United States</option>
                    <option value="United Kingdom" ${p.nationality === 'United Kingdom' ? 'selected' : ''}>United Kingdom</option>
                    <option value="India" ${p.nationality === 'India' ? 'selected' : ''}>India</option>
                    <option value="Germany" ${p.nationality === 'Germany' ? 'selected' : ''}>Germany</option>
                    <option value="France" ${p.nationality === 'France' ? 'selected' : ''}>France</option>
                    <option value="United Arab Emirates" ${p.nationality === 'United Arab Emirates' ? 'selected' : ''}>United Arab Emirates</option>
                    <option value="Singapore" ${p.nationality === 'Singapore' ? 'selected' : ''}>Singapore</option>
                    <option value="Canada" ${p.nationality === 'Canada' ? 'selected' : ''}>Canada</option>
                    <option value="Australia" ${p.nationality === 'Australia' ? 'selected' : ''}>Australia</option>
                    <option value="Japan" ${p.nationality === 'Japan' ? 'selected' : ''}>Japan</option>
                  </select>
                </div>

                <!-- Passport Number -->
                <div class="md:col-span-3">
                  <label class="block text-xs font-bold text-slate-600 mb-1">Passport / Gov ID Number *</label>
                  <input type="text" class="input-pass-passport w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono uppercase" placeholder="e.g. A9283719" value="${p.passport || ''}">
                </div>

                <!-- Meal Preference -->
                <div class="md:col-span-3">
                  <label class="block text-xs font-bold text-slate-600 mb-1">In-Flight Meal</label>
                  <select class="input-pass-meal w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="Regular" ${p.meal === 'Regular' ? 'selected' : ''}>Standard Airline Meal</option>
                    <option value="Vegetarian Hindu" ${p.meal === 'Vegetarian Hindu' ? 'selected' : ''}>Asian Vegetarian / Hindu</option>
                    <option value="Vegan" ${p.meal === 'Vegan' ? 'selected' : ''}>Strict Vegan (VGML)</option>
                    <option value="Halal" ${p.meal === 'Halal' ? 'selected' : ''}>Halal Certified (MOML)</option>
                    <option value="Kosher" ${p.meal === 'Kosher' ? 'selected' : ''}>Kosher Meal (KSML)</option>
                    <option value="Gluten-Free" ${p.meal === 'Gluten-Free' ? 'selected' : ''}>Gluten-Friendly (GFML)</option>
                    <option value="Child Meal" ${p.meal === 'Child Meal' ? 'selected' : ''}>Child-Friendly Meal</option>
                  </select>
                </div>
              </div>
            </div>
          `).join('')}

          <!-- Contact Details -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 class="font-extrabold text-slate-900 text-base mb-3 flex items-center space-x-2">
              <i data-lucide="mail" class="w-4 h-4 text-sky-600"></i>
              <span>Contact & Booking Details</span>
            </h4>
            <p class="text-xs text-slate-500 mb-4">Your E-Ticket, Boarding Pass, and flight change alerts will be sent here.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Email Address *</label>
                <input type="email" id="contact-email" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="mehveen.khan@example.com" value="mehveen.khan@example.com" required>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Mobile Phone (with country code) *</label>
                <input type="tel" id="contact-phone" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="+1 234 567 8900" value="+1 (555) 234-5678" required>
              </div>
            </div>
          </div>

          <!-- Add-ons & Travel Extras -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 class="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <i data-lucide="sparkles" class="w-4 h-4 text-sky-600"></i>
              <span>Travel Add-Ons & Protection</span>
            </h4>

            <!-- Extra Baggage -->
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center space-x-3.5">
                <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <i data-lucide="luggage" class="w-5 h-5"></i>
                </div>
                <div>
                  <div class="font-bold text-slate-900 text-sm">Additional Checked Baggage</div>
                  <div class="text-xs text-slate-500">Need extra luggage? Pre-book now to save up to 40% vs airport fees.</div>
                </div>
              </div>
              <select id="addon-baggage" class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="none" ${addOns.extraBaggage === 'none' ? 'selected' : ''}>Standard Allowance (0 extra)</option>
                <option value="15kg" ${addOns.extraBaggage === '15kg' ? 'selected' : ''}>+15 kg Bag (+${store.formatPrice(35)})</option>
                <option value="23kg" ${addOns.extraBaggage === '23kg' ? 'selected' : ''}>+23 kg Bag (+${store.formatPrice(50)})</option>
                <option value="32kg" ${addOns.extraBaggage === '32kg' ? 'selected' : ''}>+32 kg Heavy Bag (+${store.formatPrice(75)})</option>
              </select>
            </div>

            <!-- Travel Insurance -->
            <label class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/50 transition">
              <div class="flex items-center space-x-3.5">
                <input type="checkbox" id="addon-insurance" class="w-5 h-5 text-sky-600 rounded border-slate-300 focus:ring-sky-500" ${addOns.insurance ? 'checked' : ''}>
                <div>
                  <div class="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <span>Comprehensive Travel Insurance</span>
                    <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Recommended</span>
                  </div>
                  <div class="text-xs text-slate-500">Medical emergency cover up to $100,000, trip cancellation, and lost luggage guarantee.</div>
                </div>
              </div>
              <div class="text-right">
                <span class="text-sm font-extrabold text-slate-900">+${store.formatPrice(29)}</span>
                <span class="block text-[10px] text-slate-400">/ traveler</span>
              </div>
            </label>

            <!-- Airport Lounge Access -->
            <label class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/50 transition">
              <div class="flex items-center space-x-3.5">
                <input type="checkbox" id="addon-lounge" class="w-5 h-5 text-sky-600 rounded border-slate-300 focus:ring-sky-500" ${addOns.loungeAccess ? 'checked' : ''}>
                <div>
                  <div class="font-bold text-slate-900 text-sm">VIP Airport Lounge Pass</div>
                  <div class="text-xs text-slate-500">Enjoy complimentary gourmet meals, open bar, ultra-fast Wi-Fi, and private showers before takeoff.</div>
                </div>
              </div>
              <div class="text-right">
                <span class="text-sm font-extrabold text-slate-900">+${store.formatPrice(45)}</span>
                <span class="block text-[10px] text-slate-400">/ person</span>
              </div>
            </label>

            <!-- Carbon Offset -->
            <label class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/50 transition">
              <div class="flex items-center space-x-3.5">
                <input type="checkbox" id="addon-carbon" class="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" ${addOns.carbonOffset ? 'checked' : ''}>
                <div>
                  <div class="font-bold text-slate-900 text-sm">100% Carbon Neutral Flight Offset</div>
                  <div class="text-xs text-slate-500">Support certified global reforestation and clean energy climate projects.</div>
                </div>
              </div>
              <div class="text-right">
                <span class="text-sm font-extrabold text-slate-900">+${store.formatPrice(5)}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Right Col: Price Summary & Next Actions -->
        <div class="lg:col-span-1 space-y-4">
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <h4 class="font-extrabold text-slate-900 text-base mb-4 pb-3 border-b border-slate-100">Booking Summary</h4>
            
            <!-- Outbound Flight Summary -->
            <div class="mb-3 text-xs">
              <div class="font-bold text-slate-800 flex items-center justify-between">
                <span>Outbound (${selectedBooking.outboundFlight.origin.code} ➔ ${selectedBooking.outboundFlight.destination.code})</span>
                <span class="text-sky-700 font-extrabold">${store.formatPrice(selectedBooking.outboundFlight.fareTiers[selectedBooking.outboundTier].price)}</span>
              </div>
              <div class="text-slate-400 mt-0.5">${selectedBooking.outboundFlight.airline.name} • ${selectedBooking.outboundTier.toUpperCase()}</div>
            </div>

            <!-- Inbound Flight Summary if round-trip -->
            ${selectedBooking.inboundFlight ? `
              <div class="mb-3 text-xs pt-2 border-t border-slate-100">
                <div class="font-bold text-slate-800 flex items-center justify-between">
                  <span>Return (${selectedBooking.inboundFlight.origin.code} ➔ ${selectedBooking.inboundFlight.destination.code})</span>
                  <span class="text-sky-700 font-extrabold">${store.formatPrice(selectedBooking.inboundFlight.fareTiers[selectedBooking.inboundTier].price)}</span>
                </div>
                <div class="text-slate-400 mt-0.5">${selectedBooking.inboundFlight.airline.name} • ${selectedBooking.inboundTier.toUpperCase()}</div>
              </div>
            ` : ''}

            <!-- Passengers count breakdown -->
            <div class="py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Travelers</span>
              <span class="font-bold text-slate-800">${passengers.length} passenger(s)</span>
            </div>

            <!-- Action: Select Seats -->
            <button id="btn-goto-seats" class="w-full mt-4 py-3 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-sm rounded-xl border border-sky-200 flex items-center justify-center space-x-2 transition">
              <i data-lucide="armchair" class="w-4 h-4"></i>
              <span>Choose Airplane Seats</span>
            </button>

            <!-- Action: Continue to Payment -->
            <button id="btn-goto-payment" class="w-full mt-3 py-3.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2 transition">
              <span>Continue to Payment</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }

  attachPassengerFormEvents(container);
}

function attachPassengerFormEvents(container) {
  const state = store.getState();
  const passengers = state.selectedBooking.passengers;

  // Back to Results
  container.querySelector('#btn-back-to-results')?.addEventListener('click', () => {
    store.setState({ activeTab: 'results' });
  });

  // Sync inputs with passenger data
  function saveCurrentInputs() {
    container.querySelectorAll('.passenger-card').forEach((card, idx) => {
      const p = passengers[idx];
      if (p) {
        p.title = card.querySelector('.input-pass-title').value;
        p.firstName = card.querySelector('.input-pass-first').value.trim();
        p.lastName = card.querySelector('.input-pass-last').value.trim();
        p.dob = card.querySelector('.input-pass-dob').value;
        p.gender = card.querySelector('.input-pass-gender').value;
        p.nationality = card.querySelector('.input-pass-nationality').value;
        p.passport = card.querySelector('.input-pass-passport').value.trim();
        p.meal = card.querySelector('.input-pass-meal').value;
      }
    });

    const contactEmail = container.querySelector('#contact-email')?.value;
    const contactPhone = container.querySelector('#contact-phone')?.value;
    state.selectedBooking.contact = { email: contactEmail, phone: contactPhone };

    state.selectedBooking.addOns.extraBaggage = container.querySelector('#addon-baggage')?.value || 'none';
    state.selectedBooking.addOns.insurance = container.querySelector('#addon-insurance')?.checked || false;
    state.selectedBooking.addOns.loungeAccess = container.querySelector('#addon-lounge')?.checked || false;
    state.selectedBooking.addOns.carbonOffset = container.querySelector('#addon-carbon')?.checked || false;
  }

  // Add-on changes trigger state update
  container.querySelector('#addon-baggage')?.addEventListener('change', saveCurrentInputs);
  container.querySelector('#addon-insurance')?.addEventListener('change', saveCurrentInputs);
  container.querySelector('#addon-lounge')?.addEventListener('change', saveCurrentInputs);
  container.querySelector('#addon-carbon')?.addEventListener('change', saveCurrentInputs);

  // Navigate to Seat Map
  container.querySelector('#btn-goto-seats')?.addEventListener('click', () => {
    saveCurrentInputs();
    store.setState({ activeTab: 'seats' });
  });

  // Navigate to Payment
  container.querySelector('#btn-goto-payment')?.addEventListener('click', () => {
    saveCurrentInputs();
    // Validate first name and last name
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].firstName || !passengers[i].lastName) {
        window.showToast?.(`Please enter first and last name for Passenger ${i + 1}`, 'error');
        return;
      }
    }
    store.setState({ activeTab: 'checkout' });
  });
}
