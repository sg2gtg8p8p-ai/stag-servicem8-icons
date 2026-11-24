/* Model-bound manufacturer reference; independent of the controls wiring schema. */
(() => {
  'use strict';
  const identity = Object.freeze({
    id: 'worcester-greenstar-i-system-compact-30kw-ng-7733600062',
    manufacturer: 'Worcester Bosch', model: 'Greenstar i System Compact 30kW NG',
    gcNumber: '41-406-60', productNumber: '7733600062', fuel: 'Natural Gas'
  });
  const image = './boiler-wiring/worcester-6720813280-201507-page60.png';
  const official = 'https://www.worcester-bosch.co.uk/support/literature/download/6720813280#page=60';
  function matches(boiler, section) {
    return ['technicalData', 'sources'].includes(section) && !!boiler &&
      Object.keys(identity).every(key => boiler[key] === identity[key]) &&
      Array.isArray(boiler.sources) && boiler.sources.some(source =>
        source.documentReference === '6720813280' && source.revision === '2015/07' &&
        Array.isArray(source.models) && source.models.includes(identity.model));
  }
  function render(parent, boiler, section) {
    if (!matches(boiler, section) || !parent || parent.querySelector('[data-boiler-wiring-reference]')) return false;
    const make = (tag, text) => { const el = document.createElement(tag); if (text) el.textContent = text; return el; };
    const card = make('details'); card.className = 'info-card'; card.setAttribute('data-boiler-wiring-reference', identity.id);
    card.append(make('summary', 'Boiler wiring diagram — manufacturer reference'));
    card.append(make('p', 'Worcester Greenstar i System Compact 30kW NG · GC 41-406-60 · product 7733600062.'));
    card.append(make('p', 'Manual 6720813280 (2015/07), page 60, section 8.1: Internal Wiring Diagram. Original manufacturer page; saved with the app after the complete pack downloads.'));
    card.append(make('p', 'Confirm the actual appliance, applicable manual revision, control board, harness and installed controls before using this reference. Serial and later production changes remain unverified. This does not establish external-control compatibility or provide testing, repair or installation approval.'));
    const figure = make('figure'); figure.style.margin = '0';
    const img = make('img'); img.src = image; img.alt = 'Original Worcester Bosch internal wiring diagram, manual 6720813280 (2015/07), page 60; exact NG 30i System Compact reference only.';
    img.loading = 'lazy'; img.style.width = '100%'; img.style.height = 'auto';
    figure.append(img, make('figcaption', 'Source: Worcester Bosch, 6720813280 (2015/07), page 60. Diagram labels are retained unchanged.'));
    card.append(figure);
    for (const [label, href] of [['Open saved diagram at full size', image], ['Open manufacturer manual (online)', official]]) {
      const link = make('a', label); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.className = 'manual-button'; card.append(link);
    }
    card.append(make('p', 'Other outputs, fuels, generations and controls are outside this reference. Follow the applicable manufacturer instructions for safety and isolation.'));
    parent.append(card); return true;
  }
  globalThis.STAG_BOILER_WIRING_REFERENCE = Object.freeze({matches, render});
})();
