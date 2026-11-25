// Checkout, Price Calculation, Promo Codes, and Payment Simulation Component
import { store } from '../state.js';

export function renderCheckout(container) {
  const state = store.getState();
  const { selectedBooking, searchParams } = state;

  if (!selectedBooking.outboundFlight) {
    store.setState({ activeTab: 'home' });
    return;
  }

  const calculation = calculateOrderTotal(selectedBooking);

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      
      <!-- Top Title -->
      <div class="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
        <div>
          <button id="btn-back-to-seats" class="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center space-x-1 mb-1">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            <span>Back to Seat Map</span>
          </button>
          <h2 class="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <i data-lucide="shield-check" class="w-6 h-6 text-emerald-600"></i>
            <span>Review & Secure Checkout</span>
          </h2>
          <p class="text-xs text-slate-500">All transactions are protected by 256-bit bank-level SSL encryption.</p>
        </div>

        <div class="flex items-center space-x-2 text-xs text-slate-500 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
          <i data-lucide="lock" class="w-4 h-4"></i>
          <span>Secure Checkout</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: Flight Recap & Payment Methods -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Itinerary Summary Card -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 class="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <i data-lucide="plane" class="w-5 h-5 text-sky-600"></i>
              <span>Flight Itinerary</span>
            </h4>

            <!-- Outbound Flight -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div class="flex items-center justify-between mb-2">
                <span class="px-2.5 py-0.5 bg-sky-100 text-sky-800 text-xs font-bold rounded-md">Outbound Flight</span>
                <span class="text-xs font-bold text-slate-600">${selectedBooking.outboundFlight.airline.name} • ${selectedBooking.outboundFlight.flightNumber}</span>
              </div>
              <div class="flex items-center justify-between text-sm font-extrabold text-slate-900">
                <div>
                  <div class="text-base">${selectedBooking.outboundFlight.origin.city} (${selectedBooking.outboundFlight.origin.code})</div>
                  <div class="text-xs text-slate-500 font-normal">${new Date(selectedBooking.outboundFlight.departureTime).toLocaleDateString()} at ${new Date(selectedBooking.outboundFlight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <i data-lucide="arrow-right" class="w-4 h-4 text-sky-600"></i>
                <div class="text-right">
                  <div class="text-base">${selectedBooking.outboundFlight.destination.city} (${selectedBooking.outboundFlight.destination.code})</div>
                  <div class="text-xs text-slate-500 font-normal">${new Date(selectedBooking.outboundFlight.arrivalTime).toLocaleDateString()} at ${new Date(selectedBooking.outboundFlight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            </div>

            <!-- Inbound Flight if any -->
            ${selectedBooking.inboundFlight ? `
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div class="flex items-center justify-between mb-2">
                  <span class="px-2.5 py-0.5 bg-sky-100 text-sky-800 text-xs font-bold rounded-md">Return Flight</span>
                  <span class="text-xs font-bold text-slate-600">${selectedBooking.inboundFlight.airline.name} • ${selectedBooking.inboundFlight.flightNumber}</span>
                </div>
                <div class="flex items-center justify-between text-sm font-extrabold text-slate-900">
                  <div>
                    <div class="text-base">${selectedBooking.inboundFlight.origin.city} (${selectedBooking.inboundFlight.origin.code})</div>
                    <div class="text-xs text-slate-500 font-normal">${new Date(selectedBooking.inboundFlight.departureTime).toLocaleDateString()} at ${new Date(selectedBooking.inboundFlight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <i data-lucide="arrow-right" class="w-4 h-4 text-sky-600"></i>
                  <div class="text-right">
                    <div class="text-base">${selectedBooking.inboundFlight.destination.city} (${selectedBooking.inboundFlight.destination.code})</div>
                    <div class="text-xs text-slate-500 font-normal">${new Date(selectedBooking.inboundFlight.arrivalTime).toLocaleDateString()} at ${new Date(selectedBooking.inboundFlight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Passengers & Assigned Seats -->
            <div class="pt-2">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirmed Passengers & Seats</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${selectedBooking.passengers.map((p, idx) => `
                  <div class="p-2.5 rounded-lg border border-slate-100 bg-white flex items-center justify-between text-xs">
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[11px]">${idx + 1}</div>
                      <span class="font-bold text-slate-800">${p.firstName} ${p.lastName}</span>
                    </div>
                    <div class="space-x-1">
                      <span class="px-2 py-0.5 bg-sky-50 text-sky-700 font-mono font-bold rounded">Seat: ${p.seatOutbound || '14A'}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Payment Methods Selector -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h4 class="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <i data-lucide="credit-card" class="w-5 h-5 text-sky-600"></i>
              <span>Select Payment Method</span>
            </h4>

            <!-- Payment Type Tabs -->
            <div class="grid grid-cols-3 gap-3">
              <button id="pay-method-card" class="pay-method-tab p-3 rounded-xl border-2 border-sky-600 bg-sky-50/50 flex flex-col items-center justify-center text-center transition">
                <i data-lucide="credit-card" class="w-5 h-5 text-sky-600 mb-1"></i>
                <span class="text-xs font-bold text-slate-900">Credit / Debit Card</span>
              </button>
              <button id="pay-method-paypal" class="pay-method-tab p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex flex-col items-center justify-center text-center transition">
                <i data-lucide="wallet" class="w-5 h-5 text-indigo-600 mb-1"></i>
                <span class="text-xs font-bold text-slate-900">PayPal Express</span>
              </button>
              <button id="pay-method-apple" class="pay-method-tab p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex flex-col items-center justify-center text-center transition">
                <i data-lucide="smartphone" class="w-5 h-5 text-slate-800 mb-1"></i>
                <span class="text-xs font-bold text-slate-900">Apple / Google Pay</span>
              </button>
            </div>

            <!-- Credit Card Form Section -->
            <div id="card-form-wrapper" class="space-y-4 pt-2">
              
              <!-- Virtual Card Graphic -->
              <div class="w-full max-w-sm mx-auto h-48 rounded-2xl p-5 text-white bg-gradient-to-tr from-slate-900 via-sky-950 to-blue-900 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div class="absolute -right-6 -bottom-6 w-36 h-36 bg-sky-500/10 rounded-full blur-xl"></div>
                <div class="flex items-center justify-between">
                  <span class="font-display font-bold text-sm tracking-widest text-sky-300">SKYWINGS AIRWAYS</span>
                  <div class="font-bold text-base tracking-widest" id="card-preview-brand">VISA</div>
                </div>
                <div>
                  <div class="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">Card Number</div>
                  <div class="font-mono text-lg font-bold tracking-widest text-white/90" id="card-preview-number">•••• •••• •••• 4242</div>
                </div>
                <div class="flex items-center justify-between text-xs font-mono">
                  <div>
                    <div class="text-[9px] text-slate-400 uppercase">Cardholder</div>
                    <div class="font-bold truncate max-w-[150px]" id="card-preview-name">${selectedBooking.passengers[0]?.firstName || 'MEHVEEN'} ${selectedBooking.passengers[0]?.lastName || 'KHAN'}</div>
                  </div>
                  <div>
                    <div class="text-[9px] text-slate-400 uppercase">Expires</div>
                    <div class="font-bold" id="card-preview-expiry">12/28</div>
                  </div>
                </div>
              </div>

              <!-- Card Input Fields -->
              <div class="space-y-3 pt-2">
                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1">Cardholder Name</label>
                  <input type="text" id="card-holder" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium" value="${selectedBooking.passengers[0]?.firstName || 'Mehveen'} ${selectedBooking.passengers[0]?.lastName || 'Khan'}" placeholder="Full Name on Card">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1">Card Number</label>
                  <div class="relative">
                    <input type="text" id="card-number" maxlength="19" class="w-full pl-10 pr-4 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500" value="4532 8921 4092 4242" placeholder="4000 1234 5678 9010">
                    <i data-lucide="credit-card" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">Expiry Date (MM/YY)</label>
                    <input type="text" id="card-expiry" maxlength="5" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500" value="12/28" placeholder="MM/YY">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">CVV / CVC Code</label>
                    <input type="password" id="card-cvv" maxlength="4" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500" value="842" placeholder="123">
                  </div>
                </div>
              </div>
            </div>

            <!-- Alternative Wallet View (Hidden by default) -->
            <div id="wallet-form-wrapper" class="hidden p-6 text-center border border-slate-200 rounded-xl bg-slate-50 space-y-3">
              <i data-lucide="check-circle-2" class="w-8 h-8 text-emerald-600 mx-auto"></i>
              <div class="font-bold text-slate-800 text-sm">Instant Express Checkout Enabled</div>
              <p class="text-xs text-slate-500">You will authorize payment via biometric verification or one-click authorization.</p>
            </div>
          </div>
        </div>

        <!-- Right Col: Price Breakdown & Coupon Code -->
        <div class="lg:col-span-1 space-y-4">
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-4">
            <h4 class="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">Price Breakdown</h4>

            <!-- Line Items -->
            <div class="space-y-2.5 text-xs text-slate-600">
              <!-- Base Fares -->
              <div class="flex items-center justify-between">
                <span>Flight Fares (${calculation.passengerCount} traveler${calculation.passengerCount > 1 ? 's' : ''})</span>
                <span class="font-bold text-slate-800">${store.formatPrice(calculation.baseFaresTotal)}</span>
              </div>

              <!-- Taxes & Fees -->
              <div class="flex items-center justify-between">
                <span>Airport Taxes & Security Fees</span>
                <span class="font-bold text-slate-800">${store.formatPrice(calculation.taxesTotal)}</span>
              </div>

              <!-- Seat Selection Surcharges -->
              ${calculation.seatCharges > 0 ? `
                <div class="flex items-center justify-between">
                  <span>Preferred & Extra Legroom Seats</span>
                  <span class="font-bold text-slate-800">+${store.formatPrice(calculation.seatCharges)}</span>
                </div>
              ` : ''}

              <!-- Add-ons -->
              ${calculation.addOnsTotal > 0 ? `
                <div class="flex items-center justify-between">
                  <span>Baggage & Travel Extras</span>
                  <span class="font-bold text-slate-800">+${store.formatPrice(calculation.addOnsTotal)}</span>
                </div>
              ` : ''}

              <!-- Promo Discount -->
              ${calculation.discount > 0 ? `
                <div class="flex items-center justify-between text-emerald-600 font-bold">
                  <span>Promo Code (${selectedBooking.promoCode})</span>
                  <span>-${store.formatPrice(calculation.discount)}</span>
                </div>
              ` : ''}
            </div>

            <!-- Promo Code Input -->
            <div class="pt-4 border-t border-slate-100">
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Have a Promo Coupon?</label>
              <div class="flex space-x-2">
                <input type="text" id="input-promo" placeholder="Try FLY20 or SKY100" class="flex-1 p-2 uppercase bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500">
                <button id="btn-apply-promo" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition">Apply</button>
              </div>
              <div class="text-[11px] text-slate-400 mt-1">Use coupon <strong class="text-sky-600">FLY20</strong> for 20% off or <strong class="text-sky-600">SKY100</strong> for $100 off</div>
            </div>

            <!-- Grand Total -->
            <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div class="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Amount</div>
                <div class="text-xs text-slate-400">All taxes included</div>
              </div>
              <div class="text-2xl font-black text-slate-900" id="grand-total-display">
                ${store.formatPrice(calculation.grandTotal)}
              </div>
            </div>

            <!-- Pay Now Button -->
            <button id="btn-submit-payment" class="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-base rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-95">
              <i data-lucide="lock" class="w-4 h-4"></i>
              <span>Pay ${store.formatPrice(calculation.grandTotal)} Now</span>
            </button>

            <!-- Processing Modal / Overlay (Hidden by default) -->
            <div id="payment-processing-modal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div class="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl space-y-4">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
                <h3 class="text-lg font-extrabold text-slate-900" id="processing-step-title">Authorizing Payment...</h3>
                <p class="text-xs text-slate-500" id="processing-step-desc">Connecting with secure payment gateway</p>
                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div id="processing-progress-bar" class="bg-sky-600 h-2 w-1/4 transition-all duration-500"></div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }

  attachCheckoutEvents(container, calculation);
}

function calculateOrderTotal(selectedBooking) {
  const pCount = selectedBooking.passengers.length || 1;
  const outTierPrice = selectedBooking.outboundFlight?.fareTiers[selectedBooking.outboundTier]?.price || 0;
  const inTierPrice = selectedBooking.inboundFlight ? (selectedBooking.inboundFlight.fareTiers[selectedBooking.inboundTier]?.price || 0) : 0;

  const baseFaresTotal = Math.round((outTierPrice + inTierPrice) * 0.82) * pCount;
  const taxesTotal = Math.round((outTierPrice + inTierPrice) * 0.18) * pCount;

  // Add-ons
  let addOnsTotal = 0;
  const addOns = selectedBooking.addOns || {};
  if (addOns.extraBaggage === '15kg') addOnsTotal += 35 * pCount;
  if (addOns.extraBaggage === '23kg') addOnsTotal += 50 * pCount;
  if (addOns.extraBaggage === '32kg') addOnsTotal += 75 * pCount;
  if (addOns.insurance) addOnsTotal += 29 * pCount;
  if (addOns.loungeAccess) addOnsTotal += 45 * pCount;
  if (addOns.carbonOffset) addOnsTotal += 5 * pCount;

  // Seat charges
  let seatCharges = 0;
  selectedBooking.passengers.forEach(p => {
    if (p.seatOutbound && parseInt(p.seatOutbound, 10) <= 5) seatCharges += 35;
    if (p.seatInbound && parseInt(p.seatInbound, 10) <= 5) seatCharges += 35;
  });

  const subtotal = baseFaresTotal + taxesTotal + addOnsTotal + seatCharges;

  // Promo code discount
  let discount = 0;
  if (selectedBooking.promoCode === 'FLY20') {
    discount = Math.round(subtotal * 0.20);
  } else if (selectedBooking.promoCode === 'SKY100') {
    discount = Math.min(100, subtotal - 50);
  } else if (selectedBooking.promoCode === 'FIRSTFLY') {
    discount = Math.min(50, subtotal - 50);
  }

  const grandTotal = Math.max(10, subtotal - discount);

  return {
    passengerCount: pCount,
    baseFaresTotal,
    taxesTotal,
    addOnsTotal,
    seatCharges,
    discount,
    grandTotal
  };
}

function attachCheckoutEvents(container, calculation) {
  const state = store.getState();

  // Back to Seats
  container.querySelector('#btn-back-to-seats')?.addEventListener('click', () => {
    store.setState({ activeTab: 'seats' });
  });

  // Payment Tabs Toggle
  const cardTab = container.querySelector('#pay-method-card');
  const paypalTab = container.querySelector('#pay-method-paypal');
  const appleTab = container.querySelector('#pay-method-apple');
  const cardWrapper = container.querySelector('#card-form-wrapper');
  const walletWrapper = container.querySelector('#wallet-form-wrapper');

  function setMethod(method) {
    [cardTab, paypalTab, appleTab].forEach(t => {
      t.classList.remove('border-sky-600', 'bg-sky-50/50', 'border-2');
      t.classList.add('border-slate-200');
    });

    if (method === 'card') {
      cardTab.classList.add('border-sky-600', 'bg-sky-50/50', 'border-2');
      cardWrapper.classList.remove('hidden');
      walletWrapper.classList.add('hidden');
    } else {
      (method === 'paypal' ? paypalTab : appleTab).classList.add('border-sky-600', 'bg-sky-50/50', 'border-2');
      cardWrapper.classList.add('hidden');
      walletWrapper.classList.remove('hidden');
    }
  }

  cardTab?.addEventListener('click', () => setMethod('card'));
  paypalTab?.addEventListener('click', () => setMethod('paypal'));
  appleTab?.addEventListener('click', () => setMethod('apple'));

  // Live Card Preview Handlers
  const cardNumInput = container.querySelector('#card-number');
  const cardHolderInput = container.querySelector('#card-holder');
  const cardExpiryInput = container.querySelector('#card-expiry');
  const previewNum = container.querySelector('#card-preview-number');
  const previewName = container.querySelector('#card-preview-name');
  const previewExpiry = container.querySelector('#card-preview-expiry');
  const previewBrand = container.querySelector('#card-preview-brand');

  cardNumInput?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    e.target.value = formatted;
    previewNum.textContent = formatted || '•••• •••• •••• 4242';

    if (val.startsWith('4')) previewBrand.textContent = 'VISA';
    else if (val.startsWith('5')) previewBrand.textContent = 'MASTERCARD';
    else if (val.startsWith('3')) previewBrand.textContent = 'AMEX';
    else previewBrand.textContent = 'CARD';
  });

  cardHolderInput?.addEventListener('input', (e) => {
    previewName.textContent = e.target.value.toUpperCase() || 'TRAVELER NAME';
  });

  cardExpiryInput?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    e.target.value = val;
    previewExpiry.textContent = val || 'MM/YY';
  });

  // Promo Code Apply
  container.querySelector('#btn-apply-promo')?.addEventListener('click', () => {
    const promo = container.querySelector('#input-promo').value.trim().toUpperCase();
    if (promo === 'FLY20' || promo === 'SKY100' || promo === 'FIRSTFLY') {
      state.selectedBooking.promoCode = promo;
      window.showToast?.(`Coupon code ${promo} successfully applied!`, 'success');
      renderCheckout(container);
    } else {
      window.showToast?.('Invalid coupon code. Try FLY20 or SKY100', 'error');
    }
  });

  // Submit Payment Action & Processing Simulation
  container.querySelector('#btn-submit-payment')?.addEventListener('click', () => {
    const modal = container.querySelector('#payment-processing-modal');
    const titleEl = container.querySelector('#processing-step-title');
    const descEl = container.querySelector('#processing-step-desc');
    const progressEl = container.querySelector('#processing-progress-bar');

    modal.classList.remove('hidden');

    // Step 1
    setTimeout(() => {
      progressEl.style.width = '45%';
      titleEl.textContent = 'Securing Flight Seats...';
      descEl.textContent = 'Reserving confirmed inventory on airline GDS';
    }, 700);

    // Step 2
    setTimeout(() => {
      progressEl.style.width = '80%';
      titleEl.textContent = 'Generating E-Ticket & PNR...';
      descEl.textContent = 'Issuing IATA certified digital boarding pass';
    }, 1400);

    // Step 3: Complete
    setTimeout(() => {
      progressEl.style.width = '100%';
      titleEl.textContent = 'Payment Approved!';
      descEl.textContent = 'Your booking is confirmed.';

      setTimeout(() => {
        const pnr = generatePNR();
        const finalBooking = {
          pnr,
          createdAt: new Date().toISOString(),
          status: 'Confirmed',
          tripType: state.searchParams.tripType,
          passengers: state.selectedBooking.passengers,
          outboundFlight: state.selectedBooking.outboundFlight,
          inboundFlight: state.selectedBooking.inboundFlight,
          addOns: state.selectedBooking.addOns,
          pricing: {
            ...calculation,
            currency: state.currency
          },
          contact: state.selectedBooking.contact || {
            email: 'traveler@example.com',
            phone: '+1 555-019-2834'
          }
        };

        store.saveBooking(finalBooking);
        modal.classList.add('hidden');
        window.showToast?.(`Booking Confirmed! PNR: ${pnr}`, 'success');
        store.setState({ activeTab: 'confirmation' });
      }, 600);
    }, 2100);
  });
}

function generatePNR() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SKY-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
