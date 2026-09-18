const PAYBACK_PRESETS = {
    solar: {
        cost: 7500,
        grant: 0,
        maintenance: 50,
        inflation: 5,
        kWp: 4,
        annualYield: 4000,
        selfUse: 40,
        elecRate: 26.1,
        exportRate: 15
    },
    ashp: {
        cost: 14000,
        grant: 7500,
        maintenance: 80,
        inflation: 5,
        heatDemand: 12000,
        scop: 3.2,
        boilerEff: 90,
        gasRate: 7.33,
        hpElecRate: 26.1,
        currentFuel: 'gas'
    },
    battery: {
        cost: 5500,
        grant: 0,
        maintenance: 0,
        inflation: 5,
        solarStoredKwh: 1500,
        efficiency: 90,
        batteryPeakRate: 26.1,
        batteryExportRate: 15,
        offPeakRate: 7.5,
        arbitrageKwh: 1200
    },
    custom: {
        cost: 8000,
        grant: 0,
        maintenance: 0,
        inflation: 5,
        annualSaving: 800
    }
};

const TECH_FIELDS = {
    solar: ['cost', 'grant', 'maintenance', 'inflation', 'kWp', 'annualYield', 'selfUse', 'elecRate', 'exportRate'],
    ashp: ['cost', 'grant', 'maintenance', 'inflation', 'currentFuel', 'heatDemand', 'scop', 'boilerEff', 'gasRate', 'hpElecRate'],
    battery: ['cost', 'grant', 'maintenance', 'inflation', 'solarStoredKwh', 'efficiency', 'batteryPeakRate', 'batteryExportRate', 'offPeakRate', 'arbitrageKwh'],
    custom: ['cost', 'grant', 'maintenance', 'inflation', 'annualSaving']
};

const COMBINED_TECHS = ['solar', 'battery', 'ashp'];
const TECH_LABELS = {
    solar: 'Solar PV',
    ashp: 'Heat pump',
    battery: 'Battery',
    custom: 'Custom'
};

const GRID_KG_PER_KWH = 0.207;
const MAX_SOLAR_KWH_PER_KWP = 1200;
const HEATING_FUELS = {
    gas: { rate: 7.33, kgPerKwh: 0.183, grant: 7500, boilerEff: 90, label: 'mains gas' },
    oil: { rate: 7.8, kgPerKwh: 0.27, grant: 9000, boilerEff: 90, label: 'oil' },
    lpg: { rate: 9.5, kgPerKwh: 0.23, grant: 9000, boilerEff: 90, label: 'LPG' },
    electric: { rate: 26.1, kgPerKwh: 0.207, grant: 0, boilerEff: 100, label: 'electric heating' }
};

const paybackStore = {
    solar: { ...PAYBACK_PRESETS.solar },
    ashp: { ...PAYBACK_PRESETS.ashp },
    battery: { ...PAYBACK_PRESETS.battery },
    custom: { ...PAYBACK_PRESETS.custom }
};

const paybackIncluded = {
    solar: true,
    ashp: true,
    battery: true
};

let paybackCurrentTech = 'solar';

function money(value) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 0
    }).format(value);
}

function number(value, digits = 1) {
    return new Intl.NumberFormat('en-GB', {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits
    }).format(value);
}

function formatYears(years) {
    if (!Number.isFinite(years) || years < 0) {
        return 'No payback';
    }
    if (years === 0) {
        return 'Immediate';
    }
    const whole = Math.floor(years);
    const months = Math.round((years - whole) * 12);
    if (months === 0 || months === 12) {
        const rounded = months === 12 ? whole + 1 : whole;
        return `${rounded} year${rounded === 1 ? '' : 's'}`;
    }
    return `${whole} yr ${months} mo`;
}

function numFrom(state, name) {
    const value = parseFloat(state[name]);
    return Number.isFinite(value) ? value : 0;
}

function poundsFromPence(pence) {
    return pence / 100;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function pvBatteryFlow(solarState, batteryState) {
    const generation = Math.max(0, numFrom(solarState, 'annualYield'));
    const directShare = clamp(numFrom(solarState, 'selfUse') / 100, 0, 1);
    const solarImportRate = poundsFromPence(numFrom(solarState, 'elecRate'));
    const solarExportRate = poundsFromPence(numFrom(solarState, 'exportRate'));
    const directSelfUseKwh = generation * directShare;
    const surplusKwh = Math.max(0, generation - directSelfUseKwh);

    const requestedStore = Math.max(0, numFrom(batteryState, 'solarStoredKwh'));
    const storedSolarKwh = Math.min(requestedStore, surplusKwh);
    const efficiency = clamp(numFrom(batteryState, 'efficiency') / 100, 0.5, 1) || 0.9;
    const peakRate = poundsFromPence(numFrom(batteryState, 'batteryPeakRate') || numFrom(solarState, 'elecRate'));
    const exportRate = poundsFromPence(numFrom(batteryState, 'batteryExportRate') || numFrom(solarState, 'exportRate'));
    const offPeakRate = poundsFromPence(numFrom(batteryState, 'offPeakRate'));
    const arbitrageInKwh = Math.max(0, numFrom(batteryState, 'arbitrageKwh'));

    const solarDischargedKwh = storedSolarKwh * efficiency;
    const remainingExportKwh = surplusKwh - storedSolarKwh;
    const solarShiftSaving = solarDischargedKwh * peakRate - storedSolarKwh * exportRate;
    const arbitrageOutKwh = arbitrageInKwh * efficiency;
    const arbitrageSaving = arbitrageOutKwh * peakRate - arbitrageInKwh * offPeakRate;

    return {
        generation,
        directSelfUseKwh,
        surplusKwh,
        requestedStore,
        storedSolarKwh,
        capped: requestedStore > surplusKwh + 0.05,
        efficiency,
        remainingExportKwh,
        solarDischargedKwh,
        solarShiftSaving,
        arbitrageInKwh,
        arbitrageOutKwh,
        arbitrageSaving,
        peakRate,
        exportRate,
        offPeakRate,
        solarDirectSaving: directSelfUseKwh * solarImportRate + surplusKwh * solarExportRate
    };
}

function inflatedPayback(netCost, annualNet, inflationRate) {
    if (annualNet <= 0) {
        return Infinity;
    }
    if (netCost <= 0) {
        return 0;
    }

    let cumulative = 0;
    for (let year = 1; year <= 50; year += 1) {
        const yearSaving = annualNet * Math.pow(1 + inflationRate, year - 1);
        if (cumulative + yearSaving >= netCost) {
            const fraction = (netCost - cumulative) / yearSaving;
            return year - 1 + fraction;
        }
        cumulative += yearSaving;
    }
    return Infinity;
}

function cumulativeSavings(annualNet, inflationRate, years) {
    if (inflationRate === 0) {
        return annualNet * years;
    }
    return annualNet * ((Math.pow(1 + inflationRate, years) - 1) / inflationRate);
}

function yearSavingForParts(parts, year) {
    return parts.reduce((sum, part) => {
        return sum + part.annualNet * Math.pow(1 + part.inflationRate, year - 1);
    }, 0);
}

function combinedInflatedPayback(parts, totalNet) {
    const firstYearSaving = yearSavingForParts(parts, 1);
    if (firstYearSaving <= 0) {
        return Infinity;
    }
    if (totalNet <= 0) {
        return 0;
    }

    let cumulative = 0;
    for (let year = 1; year <= 50; year += 1) {
        const yearSaving = yearSavingForParts(parts, year);
        if (cumulative + yearSaving >= totalNet) {
            return year - 1 + (totalNet - cumulative) / yearSaving;
        }
        cumulative += yearSaving;
    }
    return Infinity;
}

function combinedCumulative(parts, years) {
    let total = 0;
    for (let year = 1; year <= years; year += 1) {
        total += yearSavingForParts(parts, year);
    }
    return total;
}

function resultFromCashflow(cost, grant, maintenance, inflationRate, annualSaving, carbonKg, note) {
    const netCost = Math.max(0, cost - grant);
    const annualNet = annualSaving - maintenance;
    const simple = annualNet > 0 ? netCost / annualNet : (netCost <= 0 ? 0 : Infinity);
    return {
        cost,
        grant,
        maintenance,
        inflationRate,
        netCost,
        annualSaving,
        annualNet,
        simplePayback: simple,
        inflatedPayback: inflatedPayback(netCost, annualNet, inflationRate),
        tenYear: cumulativeSavings(annualNet, inflationRate, 10) - netCost,
        twentyYear: cumulativeSavings(annualNet, inflationRate, 20) - netCost,
        carbonKg,
        note
    };
}

function calculateFromState(tech, state, store = paybackStore) {
    const cost = Math.max(0, numFrom(state, 'cost'));
    const grant = Math.max(0, numFrom(state, 'grant'));
    const maintenance = numFrom(state, 'maintenance');
    const inflationRate = Math.max(0, numFrom(state, 'inflation')) / 100;

    let annualSaving = 0;
    let carbonKg = 0;
    let note = '';

    if (tech === 'solar') {
        const maxYield = Math.round(Math.max(0, numFrom(state, 'kWp')) * MAX_SOLAR_KWH_PER_KWP);
        const generation = Math.min(Math.max(0, numFrom(state, 'annualYield')), maxYield);
        const selfUse = Math.min(100, Math.max(0, numFrom(state, 'selfUse'))) / 100;
        const selfConsumed = generation * selfUse;
        const exported = generation * (1 - selfUse);
        const importRate = poundsFromPence(numFrom(state, 'elecRate'));
        const exportRate = poundsFromPence(numFrom(state, 'exportRate'));
        annualSaving = selfConsumed * importRate + exported * exportRate;
        carbonKg = generation * GRID_KG_PER_KWH;
        note = `${number(generation, 0)} kWh generated a year, with ${number(selfUse * 100, 0)}% used directly as generated. Battery storage of leftover solar is counted on the Battery tab, not here.`;
    } else if (tech === 'ashp') {
        const heatDemand = numFrom(state, 'heatDemand');
        const scop = Math.max(0.1, numFrom(state, 'scop'));
        const boilerEff = Math.min(100, Math.max(1, numFrom(state, 'boilerEff'))) / 100;
        const fuel = HEATING_FUELS[state.currentFuel] || HEATING_FUELS.gas;
        const currentCost = (heatDemand / boilerEff) * poundsFromPence(numFrom(state, 'gasRate'));
        const heatPumpCost = (heatDemand / scop) * poundsFromPence(numFrom(state, 'hpElecRate'));
        annualSaving = currentCost - heatPumpCost;
        const fuelAvoidedKg = (heatDemand / boilerEff) * fuel.kgPerKwh;
        const electricityKg = (heatDemand / scop) * GRID_KG_PER_KWH;
        carbonKg = Math.max(0, fuelAvoidedKg - electricityKg);
        if (annualSaving <= 0) {
            note = 'At these tariffs the heat pump needs a higher SCOP, a lower electricity rate, or replacement of oil, LPG or electric heating to save money.';
        } else {
            note = `Compares ${fuel.label} at ${number(boilerEff * 100, 0)}% efficiency with a heat pump at SCOP ${number(scop, 1)}.`;
        }
    } else if (tech === 'battery') {
        const flow = pvBatteryFlow(store.solar, state);
        annualSaving = flow.solarShiftSaving + flow.arbitrageSaving;
        carbonKg = 0;
        const capNote = flow.capped
            ? ` Stored solar is capped at the ${number(flow.surplusKwh, 0)} kWh PV surplus, so it is not counted twice as Solar PV self-use.`
            : ` Stored solar is taken from the ${number(flow.surplusKwh, 0)} kWh PV surplus, so Solar PV still only counts direct self-use.`;
        note = `Solar-shift ${money(flow.solarShiftSaving)} from ${number(flow.storedSolarKwh, 0)} kWh stored (${number(flow.solarDischargedKwh, 0)} kWh after ${number(flow.efficiency * 100, 0)}% efficiency). Arbitrage ${money(flow.arbitrageSaving)} from ${number(flow.arbitrageInKwh, 0)} kWh off-peak charging.${capNote}`;
    } else {
        annualSaving = Math.max(0, numFrom(state, 'annualSaving'));
        note = 'Enter the annual bill saving from your quote or energy assessment.';
    }

    return resultFromCashflow(cost, grant, maintenance, inflationRate, annualSaving, carbonKg, note);
}

function calculateCombined(store, included) {
    const parts = COMBINED_TECHS
        .filter((tech) => included[tech])
        .map((tech) => calculateFromState(tech, store[tech], store));

    const cost = parts.reduce((sum, part) => sum + part.cost, 0);
    const grant = parts.reduce((sum, part) => sum + part.grant, 0);
    const maintenance = parts.reduce((sum, part) => sum + part.maintenance, 0);
    const netCost = parts.reduce((sum, part) => sum + part.netCost, 0);
    const annualNet = parts.reduce((sum, part) => sum + part.annualNet, 0);
    const carbonKg = parts.reduce((sum, part) => sum + part.carbonKg, 0);
    const includedLabels = COMBINED_TECHS
        .filter((tech) => included[tech])
        .map((tech) => TECH_LABELS[tech]);

    return {
        parts,
        cost,
        grant,
        maintenance,
        netCost,
        annualNet,
        simplePayback: annualNet > 0 ? netCost / annualNet : (netCost <= 0 ? 0 : Infinity),
        inflatedPayback: combinedInflatedPayback(parts, netCost),
        tenYear: combinedCumulative(parts, 10) - netCost,
        twentyYear: combinedCumulative(parts, 20) - netCost,
        carbonKg,
        note: includedLabels.length
            ? `Combined payback for ${includedLabels.join(', ')}. Solar PV counts direct self-use only. Battery solar-shift is extra self-use from leftover PV, not added again on the Solar tab. Arbitrage is off-peak charging valued at the peak rate.`
            : 'Include at least one technology to see an overall payback.'
    };
}

function readFormState(form, tech) {
    const state = {};
    (TECH_FIELDS[tech] || []).forEach((name) => {
        if (form.elements[name]) {
            state[name] = form.elements[name].value;
        }
    });
    return state;
}

function writeFormState(form, tech, state) {
    (TECH_FIELDS[tech] || []).forEach((name) => {
        if (form.elements[name] && state[name] !== undefined) {
            form.elements[name].value = state[name];
        }
    });
}

function toggleGroups(root, tech) {
    root.querySelectorAll('.payback-group').forEach((group) => {
        group.hidden = group.dataset.tech !== tech;
    });
}

function saveCurrentForm(form) {
    if (paybackCurrentTech !== 'overall') {
        paybackStore[paybackCurrentTech] = readFormState(form, paybackCurrentTech);
    }
}

function renderPayback(resultsEl, result, heading) {
    const set = (key, value) => {
        const el = resultsEl.querySelector(`[data-result="${key}"]`);
        if (el) {
            el.textContent = value;
        }
    };

    set('heading', heading);
    set('netCost', money(result.netCost));
    set('annualNet', money(result.annualNet));
    set('simplePayback', formatYears(result.simplePayback));
    set('inflatedPayback', formatYears(result.inflatedPayback));
    set('tenYear', money(result.tenYear));
    set('twentyYear', money(result.twentyYear));
    set('carbon', result.carbonKg > 0 ? `${number(result.carbonKg / 1000, 2)} t` : '—');
    set('note', result.note);

    resultsEl.querySelectorAll('[data-result="tenYear"], [data-result="twentyYear"]').forEach((el) => {
        const key = el.dataset.result;
        el.classList.toggle('is-negative', result[key] < 0);
        el.classList.toggle('is-positive', result[key] > 0);
    });
}

function renderSummary(root, combined) {
    const rowsEl = root.querySelector('#payback-summary-rows');
    if (!rowsEl) {
        return;
    }

    const byTech = {};
    COMBINED_TECHS.forEach((tech) => {
        byTech[tech] = calculateFromState(tech, paybackStore[tech], paybackStore);
    });

    rowsEl.innerHTML = COMBINED_TECHS.map((tech) => {
        const result = byTech[tech];
        const checked = paybackIncluded[tech] ? 'checked' : '';
        return `
            <article class="payback-summary-card">
                <label class="payback-summary-include">
                    <input type="checkbox" data-include="${tech}" ${checked}>
                    Include ${TECH_LABELS[tech]}
                </label>
                <dl>
                    <div><dt>Net investment</dt><dd>${money(result.netCost)}</dd></div>
                    <div><dt>Annual net saving</dt><dd>${money(result.annualNet)}</dd></div>
                    <div><dt>Simple payback</dt><dd>${formatYears(result.simplePayback)}</dd></div>
                </dl>
            </article>
        `;
    }).join('');

    rowsEl.querySelectorAll('[data-include]').forEach((input) => {
        input.addEventListener('change', () => {
            paybackIncluded[input.dataset.include] = input.checked;
            updatePayback(root);
        });
    });
}

function showTech(root, tech, save = true) {
    const form = root.querySelector('#payback-form');
    const summary = root.querySelector('#payback-summary');
    const isOverall = tech === 'overall';

    if (save) {
        saveCurrentForm(form);
    }
    paybackCurrentTech = tech;
    form.hidden = isOverall;
    summary.hidden = !isOverall;

    if (!isOverall) {
        writeFormState(form, tech, paybackStore[tech]);
        toggleGroups(root, tech);
    }

    updatePayback(root);
}

function applyAnnualYieldLimit(form, solarState) {
    const kWp = Math.max(0, numFrom(solarState, 'kWp'));
    const maxYield = Math.round(kWp * MAX_SOLAR_KWH_PER_KWP);
    const input = form.elements.annualYield;
    const hint = form.querySelector('[data-annual-yield-max]');

    if (hint) {
        hint.textContent = kWp > 0
            ? `Maximum ${number(maxYield, 0)} kWh for a ${number(kWp, 1)} kWp array (${number(MAX_SOLAR_KWH_PER_KWP, 0)} kWh / kWp UK ceiling).`
            : 'Enter array size to set a maximum annual yield.';
    }

    if (!input) {
        return maxYield;
    }

    input.max = String(maxYield);
    const yieldKwh = numFrom({ annualYield: input.value }, 'annualYield');
    if (yieldKwh > maxYield) {
        input.value = maxYield;
        solarState.annualYield = maxYield;
    }

    return maxYield;
}

function applySolarStoredLimit(form, solarState, batteryState) {
    const generation = Math.max(0, numFrom(solarState, 'annualYield'));
    const directShare = clamp(numFrom(solarState, 'selfUse') / 100, 0, 1);
    const surplusKwh = Math.max(0, Math.round(generation * (1 - directShare)));
    const input = form.elements.solarStoredKwh;
    const hint = form.querySelector('[data-solar-stored-max]');

    if (hint) {
        hint.textContent = `Maximum ${number(surplusKwh, 0)} kWh leftover after ${number(directShare * 100, 0)}% direct self-use.`;
    }

    if (!input) {
        return surplusKwh;
    }

    input.max = String(surplusKwh);
    const stored = numFrom({ solarStoredKwh: input.value }, 'solarStoredKwh');
    if (stored > surplusKwh) {
        input.value = surplusKwh;
        batteryState.solarStoredKwh = surplusKwh;
    }

    return surplusKwh;
}

function renderBatteryFlow(root, solarState, batteryState) {
    const flowEl = root.querySelector('#battery-flow');
    if (!flowEl) {
        return;
    }
    const flow = pvBatteryFlow(solarState, batteryState);
    const capText = flow.capped
        ? `Capped to ${number(flow.surplusKwh, 0)} kWh leftover solar — extra kWh would double-count Solar PV self-use.`
        : `${number(flow.surplusKwh, 0)} kWh leftover solar after direct self-use.`;
    flowEl.innerHTML = `
        <span>PV surplus available</span>
        <strong>${number(flow.surplusKwh, 0)} kWh</strong>
        <span>Solar shifted ${number(flow.storedSolarKwh, 0)} kWh → ${money(flow.solarShiftSaving)}. Arbitrage ${number(flow.arbitrageInKwh, 0)} kWh → ${money(flow.arbitrageSaving)}. ${capText}</span>
    `;
}

function updatePayback(root) {
    const form = root.querySelector('#payback-form');
    const resultsEl = root.querySelector('#payback-results');
    if (!form || !resultsEl) {
        return;
    }

    if (paybackCurrentTech === 'overall') {
        applyAnnualYieldLimit(form, paybackStore.solar);
        applySolarStoredLimit(form, paybackStore.solar, paybackStore.battery);
        const combined = calculateCombined(paybackStore, paybackIncluded);
        renderSummary(root, combined);
        renderPayback(resultsEl, combined, 'Overall results');
        return;
    }

    paybackStore[paybackCurrentTech] = readFormState(form, paybackCurrentTech);
    applyAnnualYieldLimit(form, paybackStore.solar);
    paybackStore.solar = {
        ...paybackStore.solar,
        ...readFormState(form, 'solar')
    };
    applySolarStoredLimit(form, paybackStore.solar, paybackStore.battery);
    paybackStore.battery = {
        ...paybackStore.battery,
        ...readFormState(form, 'battery')
    };
    if (paybackCurrentTech === 'battery') {
        renderBatteryFlow(root, paybackStore.solar, paybackStore.battery);
    }
    renderPayback(resultsEl, calculateFromState(paybackCurrentTech, paybackStore[paybackCurrentTech], paybackStore), 'Results');
}

function initPaybackCalculator() {
    const root = document.getElementById('payback-calculator');
    if (!root) {
        return;
    }

    const form = root.querySelector('#payback-form');
    const selected = root.querySelector(`input[name="payback-tech"][value="${paybackCurrentTech}"]`);
    if (selected) {
        selected.checked = true;
    }

    if (root.dataset.ready === 'true') {
        showTech(root, paybackCurrentTech, false);
        return;
    }

    showTech(root, paybackCurrentTech, false);

    root.querySelectorAll('input[name="payback-tech"]').forEach((input) => {
        input.addEventListener('change', () => {
            showTech(root, input.value);
        });
    });

    form.elements.currentFuel.addEventListener('change', () => {
        const fuel = HEATING_FUELS[form.elements.currentFuel.value];
        if (!fuel) {
            return;
        }
        form.elements.gasRate.value = fuel.rate;
        form.elements.boilerEff.value = fuel.boilerEff;
        form.elements.grant.value = fuel.grant;
        updatePayback(root);
    });

    form.addEventListener('input', () => updatePayback(root));
    form.addEventListener('change', () => updatePayback(root));
    root.dataset.ready = 'true';
}

window.initPaybackCalculator = initPaybackCalculator;
