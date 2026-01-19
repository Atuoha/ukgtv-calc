// Constants
const COST_VISA_FEE = 766; // Per person (Standard)
const COST_IHS_ADULT = 1035; // Per year
const COST_IHS_CHILD = 776;  // Per year
const COST_PRIORITY = 500;   // Per person (Optional)

// DOM Elements
const isMarriedRadios = document.getElementsByName('married');
const childrenInput = document.getElementById('children');
const durationInput = document.getElementById('duration');
const durationLabel = document.getElementById('durationVal');

// Settings
const flightInput = document.getElementById('flightCost');
const rentInput = document.getElementById('rentCost');
const rentMonthsSelect = document.getElementById('rentMonths');
const miscInput = document.getElementById('miscCost');
const prioritySwitch = document.getElementById('prioritySwitch');

const childrenContainer = document.getElementById('childrenContainer');

// Currency Elements
const currencySelector = document.getElementById('currencySelector');
const exchangeRateInput = document.getElementById('exchangeRate');
const localTotalEl = document.getElementById('localTotal');

// Output Elements
const visaCountEl = document.getElementById('visaCount');
const visaTotalEl = document.getElementById('visaTotal');
const priorityRow = document.getElementById('priorityRow');
const priorityTotalEl = document.getElementById('priorityTotal');
const ihsAdultTotalEl = document.getElementById('ihsAdultTotal');
const ihsChildTotalEl = document.getElementById('ihsChildTotal');
const ihsChildRow = document.getElementById('ihsChildRow');
const flightTotalEl = document.getElementById('flightTotal');
const rentTotalEl = document.getElementById('rentTotal');
const rentLabelMonthsEl = document.getElementById('rentLabelMonths');
const miscTotalEl = document.getElementById('miscTotal');
const grandTotalEl = document.getElementById('grandTotal');

// Print Summary Element
const printConfigText = document.getElementById('printConfigText');

function formatCurrency(amount, symbol = '£') {
    return symbol + amount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function calculate() {
    // Get Inputs
    let isMarried = document.querySelector('input[name="married"]:checked').value === 'yes';
    let numChildren = parseInt(childrenInput.value) || 0;
    let isPriority = prioritySwitch.checked;

    let rawYears = parseFloat(durationInput.value);
    let years = Math.round(rawYears);

    let flightEstPerPerson = parseInt(flightInput.value) || 0;
    let rentEst = parseInt(rentInput.value) || 0;
    let rentMonths = parseInt(rentMonthsSelect.value) || 1;
    let miscEst = parseInt(miscInput.value) || 0;

    let currencySymbol = currencySelector.value;
    let exchangeRate = parseFloat(exchangeRateInput.value) || 0;

    // Visibility Logic
    if (!isMarried) {
        numChildren = 0;
        childrenContainer.style.opacity = "0.3";
        childrenInput.disabled = true;
    } else {
        childrenContainer.style.opacity = "1";
        childrenInput.disabled = false;
    }

    // Calculations
    let numAdults = isMarried ? 2 : 1;
    let totalPeople = numAdults + numChildren;

    // 1. Visa Fees
    let totalVisaFee = totalPeople * COST_VISA_FEE;

    // 2. Priority Fees
    let totalPriorityFee = isPriority ? (totalPeople * COST_PRIORITY) : 0;

    // 3. IHS Fees
    let totalIhsAdult = numAdults * COST_IHS_ADULT * years;
    let totalIhsChild = numChildren * COST_IHS_CHILD * years;

    // 4. Flights
    let totalFlight = totalPeople * flightEstPerPerson;

    // 5. Rent
    let totalRent = rentEst * rentMonths;

    // Grand Total
    let grandTotalGBP = totalVisaFee + totalPriorityFee + totalIhsAdult + totalIhsChild + totalFlight + totalRent + miscEst;
    let localTotal = grandTotalGBP * exchangeRate;

    // Update UI
    durationLabel.innerText = years;
    visaCountEl.innerText = totalPeople;
    visaTotalEl.innerText = formatCurrency(totalVisaFee);

    // Priority UI
    if (isPriority) {
        priorityRow.style.display = 'flex';
        priorityTotalEl.innerText = formatCurrency(totalPriorityFee);
    } else {
        priorityRow.style.display = 'none';
    }

    ihsAdultTotalEl.innerText = formatCurrency(totalIhsAdult) + ` (${numAdults} Adult${numAdults > 1 ? 's' : ''} × ${years} yrs)`;

    if (numChildren > 0) {
        ihsChildRow.style.display = 'flex';
        ihsChildTotalEl.innerText = formatCurrency(totalIhsChild) + ` (${numChildren} Child${numChildren > 1 ? 'ren' : ''} × ${years} yrs)`;
    } else {
        ihsChildRow.style.display = 'none';
    }

    flightTotalEl.innerText = formatCurrency(totalFlight);

    // Rent UI
    rentLabelMonthsEl.innerText = rentMonths;
    rentTotalEl.innerText = formatCurrency(totalRent);

    miscTotalEl.innerText = formatCurrency(miscEst);
    grandTotalEl.innerText = formatCurrency(grandTotalGBP);

    if (exchangeRate > 0) {
        localTotalEl.innerText = `≈ ${formatCurrency(localTotal, currencySymbol)}`;
    } else {
        localTotalEl.innerText = "Enter valid exchange rate";
    }

    // Update Print Summary Text
    printConfigText.innerHTML = `
        <strong>Applicants:</strong> ${totalPeople} (${numAdults} Adults, ${numChildren} Children)<br>
        <strong>Duration:</strong> ${years} Years<br>
        <strong>Exchange Rate:</strong> 1 GBP = ${exchangeRate} ${currencySymbol}
    `;
}

// Event Listeners
const inputs = [
    childrenInput, durationInput, flightInput,
    rentInput, miscInput, exchangeRateInput
];

inputs.forEach(input => input.addEventListener('input', calculate));
isMarriedRadios.forEach(radio => radio.addEventListener('change', calculate));

// Select & Checkbox listeners
currencySelector.addEventListener('change', calculate);
rentMonthsSelect.addEventListener('change', calculate);
prioritySwitch.addEventListener('change', calculate);

// Initial Calculation
calculate();


// === THEME TOGGLE LOGIC ===
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = themeToggleBtn.querySelector('i');
const htmlElement = document.getElementById('htmlPage');

// 1. Check LocalStorage on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
}

// 2. Event Listener
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

// 3. Apply Theme Function
function applyTheme(theme) {
    htmlElement.setAttribute('data-bs-theme', theme);
    
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeToggleBtn.classList.remove('btn-outline-light');
        themeToggleBtn.classList.add('btn-light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeToggleBtn.classList.remove('btn-light');
        themeToggleBtn.classList.add('btn-outline-light');
    }
}