/*
 * Trädgårdseliten JS – gemensam motor för alla designförslag.
 *
 * Innehåller företagsuppgifter, prisräknaren, säsongstips och kontaktformulär.
 * All logik ligger här; varje förslag styr bara utseendet via CSS-klasserna
 * som börjar på "tec-".
 *
 * PRISER: siffrorna i PRICING och i varje tjänsts "hours"-funktion är
 * uppskattningar. Justera dem till era riktiga priser innan sajten går live.
 */
(function () {
  'use strict';

  var COMPANY = {
    name: 'Trädgårdseliten JS',
    legal: 'Trädgårdseliten JS AB',
    email: 'Tradgardseliten@outlook.com',
    phone: '073-263 41 18',
    tel: '+46732634118',
    org: '559573-8534',
    owners: [
      { name: 'David Stevenson', role: 'Delägare', phone: '073-263 41 18', tel: '+46732634118' },
      { name: 'Lukas Jonsgården', role: 'Delägare', phone: '070-299 21 60', tel: '+46702992160' }
    ],
    social: {
      instagram: 'https://www.instagram.com/tradgardseliten/',
      facebook: 'https://www.facebook.com/p/Tr%C3%A4dg%C3%A5rdseliten-JS-61576988999724/',
      tiktok: 'https://www.tiktok.com/@tradgardseliten'
    }
  };

  var PRICING = {
    hourly: 550,      // kr/h inkl. moms, före RUT
    minHours: 1,      // minsta debitering per besök
    rut: 0.5,         // RUT-avdrag på arbetskostnaden
    vat: 0.25,
    disposal: 450,    // bortforsling/tippavgift per besök (ej RUT-berättigad)
    spread: 0.12      // ± osäkerhet i intervallet
  };

  // Hur många gånger gräset klipps under en säsong (april–oktober).
  var GRASS_VISITS = { once: 1, biweekly: 12, weekly: 24 };

  function pick(field, value) {
    for (var i = 0; i < field.opts.length; i++) {
      if (field.opts[i][0] === value) return field.opts[i];
    }
    return field.opts[0];
  }

  var SERVICES = [
    {
      id: 'hack',
      name: 'Häckklippning',
      short: 'Raka linjer, jämn topp och tät form.',
      fields: [
        { id: 'length', type: 'number', label: 'Häckens längd', unit: 'm', min: 1, max: 400, step: 1, def: 20,
          hint: 'Osäker? Gå längs häcken och räkna steg – ett steg är ungefär 0,75 m.' },
        { id: 'height', type: 'seg', label: 'Höjd', def: 'mid',
          opts: [['low', 'Under 1,2 m', 0.035], ['mid', '1,2–2 m', 0.06], ['high', 'Över 2 m', 0.11]] },
        { id: 'sides', type: 'seg', label: 'Vad ska klippas', def: 'both',
          opts: [['one', 'En sida + topp', 1], ['both', 'Båda sidor + topp', 1.8]] },
        { id: 'haul', type: 'check', label: 'Kratta upp och köra bort klippet', def: true }
      ],
      hours: function (v, f) {
        return v.length * pick(f.height, v.height)[2] * pick(f.sides, v.sides)[2] * (v.haul ? 1.15 : 1);
      },
      fees: function (v) { return v.haul ? PRICING.disposal : 0; },
      detail: function (v, f) {
        return v.length + ' m · ' + pick(f.height, v.height)[1].toLowerCase() + ' · ' + pick(f.sides, v.sides)[1].toLowerCase();
      }
    },
    {
      id: 'gras',
      name: 'Gräsklippning',
      short: 'Klippning, trimning runt kanter och uppsamling.',
      fields: [
        { id: 'area', type: 'number', label: 'Gräsytans storlek', unit: 'm²', min: 20, max: 5000, step: 10, def: 300,
          presets: [[120, 'Radhus'], [300, 'Villa'], [700, 'Stor tomt']] },
        { id: 'edges', type: 'check', label: 'Kantklippning mot rabatter och plattor', def: true },
        { id: 'freq', type: 'seg', label: 'Hur ofta', def: 'once',
          opts: [['once', 'En gång', 1], ['biweekly', 'Varannan vecka', 1], ['weekly', 'Varje vecka', 1]] }
      ],
      hours: function (v) { return Math.max(0.5, v.area / 650) * (v.edges ? 1.25 : 1); },
      fees: function () { return 0; },
      detail: function (v, f) {
        return v.area + ' m²' + (v.edges ? ' · med kanter' : '') + ' · ' + pick(f.freq, v.freq)[1].toLowerCase();
      }
    },
    {
      id: 'buskar',
      name: 'Buskar & prydnadsträd',
      short: 'Formklippning och gallring så att de mår bra länge.',
      fields: [
        { id: 'small', type: 'count', label: 'Små', sub: 'under 1 m', def: 0, max: 99 },
        { id: 'medium', type: 'count', label: 'Mellan', sub: '1–2 m', def: 3, max: 99 },
        { id: 'large', type: 'count', label: 'Stora', sub: 'över 2 m', def: 0, max: 99 },
        { id: 'haul', type: 'check', label: 'Köra bort riset', def: false }
      ],
      hours: function (v) { return v.small * 0.15 + v.medium * 0.35 + v.large * 0.75; },
      fees: function (v) { return v.haul ? PRICING.disposal : 0; },
      detail: function (v) {
        var p = [];
        if (v.small) p.push(v.small + ' små');
        if (v.medium) p.push(v.medium + ' mellan');
        if (v.large) p.push(v.large + ' stora');
        return p.join(' · ') || 'inga valda';
      }
    },
    {
      id: 'rabatt',
      name: 'Rabatter & ogräs',
      short: 'Rensning för hand, luckring och rena kanter.',
      fields: [
        { id: 'area', type: 'number', label: 'Rabattyta', unit: 'm²', min: 1, max: 1000, step: 1, def: 15,
          presets: [[5, 'En rabatt'], [15, 'Några'], [40, 'Många']] },
        { id: 'state', type: 'seg', label: 'Skick', def: 'normal',
          opts: [['light', 'Lite ogräs', 0.04], ['normal', 'Normalt', 0.08], ['heavy', 'Igenvuxet', 0.16]] }
      ],
      hours: function (v, f) { return v.area * pick(f.state, v.state)[2]; },
      fees: function () { return 0; },
      detail: function (v, f) { return v.area + ' m² · ' + pick(f.state, v.state)[1].toLowerCase(); }
    },
    {
      id: 'lov',
      name: 'Löv & höststädning',
      short: 'Krattning av gräsmatta, gångar och rabatter.',
      fields: [
        { id: 'area', type: 'number', label: 'Yta att kratta', unit: 'm²', min: 20, max: 5000, step: 10, def: 300,
          presets: [[120, 'Radhus'], [300, 'Villa'], [700, 'Stor tomt']] },
        { id: 'haul', type: 'check', label: 'Köra bort löven', def: true }
      ],
      hours: function (v) { return Math.max(0.5, v.area / 320); },
      fees: function (v) { return v.haul ? PRICING.disposal : 0; },
      detail: function (v) { return v.area + ' m²' + (v.haul ? ' · med bortforsling' : ''); }
    },
    {
      id: 'trad',
      name: 'Fruktträdsbeskärning',
      short: 'Rätt snitt vid rätt tid ger mer frukt och friskare träd.',
      fields: [
        { id: 'count', type: 'count', label: 'Antal träd', def: 2, max: 50 },
        { id: 'size', type: 'seg', label: 'Storlek', def: 'small',
          opts: [['small', 'Når från marken', 0.75], ['large', 'Behöver stege', 1.6]] }
      ],
      hours: function (v, f) { return v.count * pick(f.size, v.size)[2]; },
      fees: function () { return 0; },
      detail: function (v, f) { return v.count + ' st · ' + pick(f.size, v.size)[1].toLowerCase(); }
    }
  ];

  // Säsongsråd per månad (0 = januari). Används för "Just nu"-sektionen och
  // för att markera vilka tjänster som passar bäst just nu i räknaren.
  var SEASON = [
    { title: 'Vinterbeskärning', text: 'Fruktträd beskärs gärna nu när de är kala och man ser formen tydligt.', services: ['trad'] },
    { title: 'Vinterbeskärning', text: 'Sista chansen för vinterbeskärning av äpple och päron innan saven stiger.', services: ['trad'] },
    { title: 'Vårstädning', text: 'Kratta bort vinterns skräp och ge rabatterna en rensning innan allt börjar växa.', services: ['lov', 'rabatt', 'trad'] },
    { title: 'Säsongsstart', text: 'Första klippningen och rena rabatter – det som görs nu syns hela sommaren.', services: ['gras', 'rabatt'] },
    { title: 'Allt växer', text: 'Gräset tar fart och ogräset med det. Regelbunden klippning håller mattan tät.', services: ['gras', 'rabatt', 'buskar'] },
    { title: 'Häcktider', text: 'Efter midsommar är det dags för årets första häckklippning.', services: ['hack', 'gras'] },
    { title: 'Mitt i sommaren', text: 'Håll gräset och rabatterna i schack och sommarbeskär fruktträden.', services: ['gras', 'rabatt', 'trad'] },
    { title: 'Andra häckklippningen', text: 'Ett andra klipp nu ger en tät och jämn häck som står sig över vintern.', services: ['hack', 'gras', 'buskar'] },
    { title: 'Sensommar', text: 'Sista häckklippningen för säsongen och formklippning av buskar.', services: ['hack', 'buskar', 'gras'] },
    { title: 'Lövsäsong', text: 'Löven ska bort innan de kväver gräsmattan. Passa på med höststädningen.', services: ['lov', 'buskar'] },
    { title: 'Sista krattningen', text: 'De sista löven och en sista städning innan snön kommer.', services: ['lov'] },
    { title: 'Planera nästa år', text: 'Lugnt i trädgården. Ett bra läge att boka in vårens jobb i god tid.', services: ['trad'] }
  ];
  var MONTHS = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];

  var nf = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 });
  var hf = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1, minimumFractionDigits: 0 });
  function kr(n) { return nf.format(n) + ' kr'; }
  function round50(n) { return Math.round(n / 50) * 50; }

  function serviceById(id) {
    for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i];
    return null;
  }
  function fieldMap(svc) {
    var m = {};
    svc.fields.forEach(function (f) { m[f.id] = f; });
    return m;
  }

  function season(date) {
    var m = (date || new Date()).getMonth();
    var s = SEASON[m];
    return {
      month: MONTHS[m],
      title: s.title,
      text: s.text,
      services: s.services,
      names: s.services.map(function (id) { return serviceById(id).name; })
    };
  }

  /* ---------- Beräkning ---------- */

  // state: { mode: 'private'|'business', on: {id: bool}, values: {id: {...}} }
  function estimate(state) {
    var lines = [];
    var hours = 0;
    var fees = 0;
    var grass = null;
    SERVICES.forEach(function (svc) {
      if (!state.on[svc.id]) return;
      var v = state.values[svc.id];
      var f = fieldMap(svc);
      var h = svc.hours(v, f);
      var fee = svc.fees(v, f);
      if (h <= 0 && fee <= 0) return;
      hours += h;
      fees += fee;
      lines.push({ id: svc.id, name: svc.name, detail: svc.detail(v, f), hours: h, fees: fee });
      if (svc.id === 'gras' && v.freq !== 'once') {
        grass = { hours: h, visits: GRASS_VISITS[v.freq], freq: pick(f.freq, v.freq)[1].toLowerCase() };
      }
    });

    var business = state.mode === 'business';
    var vatDiv = business ? 1 + PRICING.vat : 1;
    var rutShare = business ? 0 : PRICING.rut;
    var billed = lines.length ? Math.max(PRICING.minHours, hours) : 0;
    var labor = billed * PRICING.hourly / vatDiv;
    var feeSum = fees / vatDiv;
    var rut = labor * rutShare;
    var total = labor + feeSum - rut;

    lines.forEach(function (l) {
      l.price = (l.hours * PRICING.hourly / vatDiv) * (1 - rutShare) + l.fees / vatDiv;
    });

    var recurring = null;
    if (grass) {
      var visitHours = Math.max(PRICING.minHours, grass.hours);
      var perVisit = visitHours * PRICING.hourly / vatDiv * (1 - rutShare);
      recurring = {
        perVisit: round50(perVisit),
        visits: grass.visits,
        season: round50(perVisit * grass.visits),
        freq: grass.freq
      };
    }

    return {
      business: business,
      lines: lines,
      hours: hours,
      billedHours: billed,
      minApplied: lines.length > 0 && hours < PRICING.minHours,
      labor: labor,
      fees: feeSum,
      rut: rut,
      gross: labor + feeSum,
      total: total,
      low: round50(total * (1 - PRICING.spread)),
      high: round50(total * (1 + PRICING.spread)),
      recurring: recurring
    };
  }

  function summaryText(state, est) {
    if (!est.lines.length) return '';
    var out = ['Uppskattning från prisräknaren på hemsidan (' + (est.business ? 'företag, exkl. moms' : 'privatperson, efter RUT') + '):', ''];
    est.lines.forEach(function (l) {
      out.push('• ' + l.name + ' – ' + l.detail);
    });
    out.push('');
    out.push('Uppskattat pris: ' + nf.format(est.low) + '–' + nf.format(est.high) + ' kr');
    if (est.recurring) {
      out.push('Därefter gräsklippning ' + est.recurring.freq + ': ca ' + kr(est.recurring.perVisit) + ' per gång');
    }
    return out.join('\n');
  }

  /* ---------- Rendering av prisräknaren ---------- */

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var val = attrs[k];
        if (val === null || val === undefined || val === false) return;
        if (k === 'text') el.textContent = val;
        else if (k === 'html') el.innerHTML = val;
        else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), val);
        else el.setAttribute(k, val === true ? '' : val);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  var STORE_KEY = 'te-calc-v1';
  function loadState() {
    var state = { mode: 'private', on: {}, values: {} };
    SERVICES.forEach(function (svc) {
      state.on[svc.id] = false;
      state.values[svc.id] = {};
      svc.fields.forEach(function (f) { state.values[svc.id][f.id] = f.def; });
    });
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (saved && saved.values) {
        state.mode = saved.mode === 'business' ? 'business' : 'private';
        SERVICES.forEach(function (svc) {
          state.on[svc.id] = !!(saved.on && saved.on[svc.id]);
          var sv = saved.values[svc.id] || {};
          svc.fields.forEach(function (f) {
            if (sv[f.id] !== undefined && typeof sv[f.id] === typeof f.def) state.values[svc.id][f.id] = sv[f.id];
          });
        });
      }
    } catch (e) { /* ingen lagring – kör på standardvärden */ }
    return state;
  }
  function saveState(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignorera */ }
  }

  var uid = 0;

  function mountCalculator(root, opts) {
    opts = opts || {};
    if (typeof root === 'string') root = document.querySelector(root);
    if (!root) return;
    var state = loadState();
    var now = season();
    var prefix = 'tec' + (++uid);

    // Första besöket: förvälj det som passar säsongen, så att räknaren aldrig är tom.
    var anyOn = SERVICES.some(function (s) { return state.on[s.id]; });
    if (!anyOn) state.on[now.services[0]] = true;

    root.classList.add('tec');
    root.innerHTML = '';

    var modeGroup = h('div', { class: 'tec-mode', role: 'radiogroup', 'aria-label': 'Kundtyp' });
    [['private', 'Privatperson', 'med RUT-avdrag'], ['business', 'Företag', 'exkl. moms']].forEach(function (m) {
      var input = h('input', { type: 'radio', name: prefix + '-mode', value: m[0] });
      input.checked = state.mode === m[0];
      input.addEventListener('change', function () { state.mode = m[0]; update(); });
      modeGroup.appendChild(h('label', { class: 'tec-mode-opt' }, [input, h('span', null, [h('b', { text: m[1] }), ' ', h('small', { text: m[2] })])]));
    });

    var servicesEl = h('div', { class: 'tec-services' });
    var cards = {};

    SERVICES.forEach(function (svc, idx) {
      var inSeason = now.services.indexOf(svc.id) !== -1;
      var bodyId = prefix + '-' + svc.id;
      var head = h('button', { type: 'button', class: 'tec-svc-head', 'aria-controls': bodyId }, [
        h('span', { class: 'tec-svc-check', 'aria-hidden': 'true' }),
        h('span', { class: 'tec-svc-no', text: String(idx + 1).padStart(2, '0') }),
        h('span', { class: 'tec-svc-name', text: svc.name }),
        inSeason ? h('span', { class: 'tec-svc-badge', text: 'Passar i ' + now.month }) : null,
        h('span', { class: 'tec-svc-short', text: svc.short })
      ]);
      var body = h('div', { class: 'tec-svc-body', id: bodyId });
      var card = h('section', { class: 'tec-svc', 'data-id': svc.id, 'data-season': inSeason ? 'true' : null }, [head, body]);

      head.addEventListener('click', function () {
        state.on[svc.id] = !state.on[svc.id];
        update();
        if (state.on[svc.id]) {
          var first = body.querySelector('input, button');
          if (first && opts.focusOnOpen !== false) first.focus({ preventScroll: true });
        }
      });

      var values = state.values[svc.id];
      svc.fields.forEach(function (f) {
        var fid = prefix + '-' + svc.id + '-' + f.id;
        if (f.type === 'number') {
          var num = h('input', { class: 'tec-input', type: 'number', id: fid, min: f.min, max: f.max, step: f.step, inputmode: 'numeric' });
          var range = h('input', { class: 'tec-range', type: 'range', min: f.min, max: Math.min(f.max, f.def * 5), step: f.step, 'aria-label': f.label, tabindex: '-1' });
          num.value = values[f.id];
          range.value = values[f.id];
          var set = function (val, from) {
            val = Math.round(Number(val));
            if (!isFinite(val)) return;
            val = Math.min(f.max, Math.max(f.min, val));
            values[f.id] = val;
            if (from !== num) num.value = val;
            if (Number(range.max) < val) range.max = val;
            range.value = val;
            update();
          };
          num.addEventListener('input', function () { if (num.value !== '') set(num.value, num); });
          num.addEventListener('blur', function () { num.value = values[f.id]; });
          range.addEventListener('input', function () { set(range.value, range); });
          var presets = null;
          if (f.presets) {
            presets = h('div', { class: 'tec-presets' }, f.presets.map(function (p) {
              return h('button', { type: 'button', class: 'tec-preset', onclick: function () { set(p[0]); } }, [
                h('span', { text: p[1] }), ' ', h('small', { text: '~' + nf.format(p[0]) + ' ' + f.unit })
              ]);
            }));
          }
          body.appendChild(h('div', { class: 'tec-field tec-field-number' }, [
            h('label', { class: 'tec-label', for: fid, text: f.label }),
            h('div', { class: 'tec-input-row' }, [
              h('span', { class: 'tec-input-wrap' }, [num, h('span', { class: 'tec-unit', text: f.unit })]),
              range
            ]),
            presets,
            f.hint ? h('p', { class: 'tec-hint', text: f.hint }) : null
          ]));
        } else if (f.type === 'seg') {
          var seg = h('div', { class: 'tec-seg' });
          f.opts.forEach(function (o) {
            var r = h('input', { type: 'radio', name: fid, value: o[0] });
            r.checked = values[f.id] === o[0];
            r.addEventListener('change', function () { values[f.id] = o[0]; update(); });
            seg.appendChild(h('label', { class: 'tec-seg-opt' }, [r, h('span', { text: o[1] })]));
          });
          body.appendChild(h('fieldset', { class: 'tec-field tec-field-seg' }, [h('legend', { class: 'tec-label', text: f.label }), seg]));
        } else if (f.type === 'check') {
          var cb = h('input', { type: 'checkbox', id: fid });
          cb.checked = !!values[f.id];
          cb.addEventListener('change', function () { values[f.id] = cb.checked; update(); });
          body.appendChild(h('label', { class: 'tec-check', for: fid }, [cb, h('span', { class: 'tec-check-box', 'aria-hidden': 'true' }), h('span', { text: f.label })]));
        } else if (f.type === 'count') {
          var out = h('output', { class: 'tec-count-value', 'aria-live': 'polite', text: String(values[f.id]) });
          var step = function (d) {
            values[f.id] = Math.min(f.max, Math.max(0, values[f.id] + d));
            out.textContent = String(values[f.id]);
            update();
          };
          body.appendChild(h('div', { class: 'tec-field tec-count' }, [
            h('span', { class: 'tec-label' }, [f.label, f.sub ? h('small', { text: ' ' + f.sub }) : null]),
            h('div', { class: 'tec-stepper' }, [
              h('button', { type: 'button', class: 'tec-step', 'aria-label': 'Minska ' + f.label.toLowerCase(), onclick: function () { step(-1); }, text: '−' }),
              out,
              h('button', { type: 'button', class: 'tec-step', 'aria-label': 'Öka ' + f.label.toLowerCase(), onclick: function () { step(1); }, text: '+' })
            ])
          ]));
        }
      });

      cards[svc.id] = { card: card, head: head, body: body };
      servicesEl.appendChild(card);
    });

    // Sammanfattning
    var linesEl = h('ul', { class: 'tec-lines' });
    var emptyEl = h('p', { class: 'tec-empty', text: 'Välj en eller flera tjänster för att se ett pris.' });
    var bdEl = h('dl', { class: 'tec-breakdown' });
    var totalLabel = h('span', { class: 'tec-total-label' });
    var totalValue = h('span', { class: 'tec-total-value' });
    var totalEl = h('div', { class: 'tec-total' }, [totalLabel, totalValue]);
    var recurEl = h('p', { class: 'tec-recurring' });
    var cta = h('button', { type: 'button', class: 'tec-cta', text: opts.ctaText || 'Skicka som offertförfrågan' });
    var note = h('p', { class: 'tec-note', text: 'Uppskattat pris baserat på ' + kr(PRICING.hourly) + '/h inkl. moms. Ni får ett fast pris efter ett kostnadsfritt platsbesök.' });

    var summary = h('aside', { class: 'tec-summary', 'aria-live': 'polite' }, [
      h('div', { class: 'tec-sum-head' }, [h('span', { class: 'tec-sum-title', text: opts.summaryTitle || 'Din uppskattning' }), h('span', { class: 'tec-sum-date', text: new Date().toLocaleDateString('sv-SE') })]),
      linesEl, emptyEl, bdEl, totalEl, recurEl, cta, note
    ]);

    cta.addEventListener('click', function () {
      var est = estimate(state);
      var target = document.querySelector(opts.messageTarget || '[data-te-message]');
      if (target) {
        var prev = target.dataset.summary || '';
        var rest = (prev ? target.value.replace(prev, '') : target.value).trim();
        var text = summaryText(state, est);
        target.dataset.summary = text;
        target.value = text + (rest ? '\n\n' + rest : '');
        var form = target.closest('form');
        (form || target).scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(function () { target.focus({ preventScroll: true }); }, 500);
      } else {
        window.location.href = mailto('Offertförfrågan', summaryText(state, est));
      }
    });

    root.appendChild(h('div', { class: 'tec-top' }, [
      modeGroup,
      h('p', { class: 'tec-season' }, [h('b', { text: 'Just nu, ' + now.month + ':' }), ' ' + now.title.toLowerCase() + '.'])
    ]));
    root.appendChild(h('div', { class: 'tec-grid' }, [servicesEl, summary]));

    function row(dt, dd, cls) {
      bdEl.appendChild(h('div', { class: 'tec-bd-row' + (cls ? ' ' + cls : '') }, [h('dt', { text: dt }), h('dd', { text: dd })]));
    }

    function update() {
      SERVICES.forEach(function (svc) {
        var c = cards[svc.id];
        var on = !!state.on[svc.id];
        c.card.setAttribute('data-on', on ? 'true' : 'false');
        c.head.setAttribute('aria-expanded', on ? 'true' : 'false');
        c.body.hidden = !on;
      });
      var est = estimate(state);
      root.setAttribute('data-mode', state.mode);

      linesEl.innerHTML = '';
      est.lines.forEach(function (l) {
        linesEl.appendChild(h('li', { class: 'tec-line' }, [
          h('span', { class: 'tec-line-name', text: l.name }),
          h('span', { class: 'tec-line-price', text: kr(round50(l.price)) }),
          h('span', { class: 'tec-line-detail', text: l.detail + ' · ca ' + hf.format(l.hours) + ' h' })
        ]));
      });
      var has = est.lines.length > 0;
      emptyEl.hidden = has;
      bdEl.hidden = !has;
      totalEl.hidden = !has;
      cta.disabled = !has;

      bdEl.innerHTML = '';
      if (has) {
        row('Arbete, ca ' + hf.format(est.billedHours) + ' h' + (est.minApplied ? ' (minsta debitering)' : ''), kr(round50(est.labor)));
        if (est.fees) row('Bortforsling', kr(round50(est.fees)));
        if (!est.business) row('RUT-avdrag 50 %', '−' + kr(round50(est.rut)), 'tec-bd-rut');
        else row('Moms tillkommer', kr(round50(est.gross * PRICING.vat)), 'tec-bd-vat');
      }
      totalLabel.textContent = est.business ? 'Uppskattat, exkl. moms' : 'Du betalar, ca';
      totalValue.innerHTML = '';
      totalValue.appendChild(h('span', { class: 'tec-total-low', text: nf.format(est.low) }));
      totalValue.appendChild(h('span', { class: 'tec-total-sep', text: '–' }));
      totalValue.appendChild(h('span', { class: 'tec-total-high', text: nf.format(est.high) }));
      totalValue.appendChild(h('span', { class: 'tec-total-unit', text: ' kr' }));

      if (est.recurring) {
        recurEl.hidden = false;
        recurEl.textContent = 'Därefter gräsklippning ' + est.recurring.freq + ': ca ' + kr(est.recurring.perVisit) +
          ' per gång, runt ' + kr(est.recurring.season) + ' för hela säsongen (' + est.recurring.visits + ' gånger).';
      } else {
        recurEl.hidden = true;
      }
      saveState(state);
      if (opts.onChange) opts.onChange(est, state);
    }

    update();
    return { state: state, update: update };
  }

  /* ---------- Kontaktformulär ---------- */

  function mailto(subject, body) {
    return 'mailto:' + COMPANY.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function mountContact(form) {
    if (typeof form === 'string') form = document.querySelector(form);
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get('namn') || '').toString().trim();
      var lines = [];
      if (d.get('meddelande')) lines.push(d.get('meddelande').toString().trim(), '');
      lines.push('Namn: ' + name);
      if (d.get('telefon')) lines.push('Telefon: ' + d.get('telefon'));
      if (d.get('epost')) lines.push('E-post: ' + d.get('epost'));
      if (d.get('adress')) lines.push('Adress/ort: ' + d.get('adress'));
      window.location.href = mailto('Förfrågan från hemsidan' + (name ? ' – ' + name : ''), lines.join('\n'));
      var status = form.querySelector('[data-te-status]');
      if (status) {
        status.hidden = false;
        status.textContent = 'Ditt mejlprogram öppnas med meddelandet ifyllt. Händer inget? Mejla ' + COMPANY.email + ' eller ring ' + COMPANY.phone + '.';
      }
    });
  }

  /* ---------- Fyll i dynamiska fält ---------- */

  function fill(scope) {
    scope = scope || document;
    var s = season();
    var map = {
      'season-month': s.month,
      'season-month-cap': s.month.charAt(0).toUpperCase() + s.month.slice(1),
      'season-title': s.title,
      'season-text': s.text,
      'season-list': s.names.join(', '),
      'year': String(new Date().getFullYear()),
      'hourly': nf.format(PRICING.hourly),
      'hourly-rut': nf.format(PRICING.hourly * (1 - PRICING.rut))
    };
    Object.keys(map).forEach(function (k) {
      scope.querySelectorAll('[data-te="' + k + '"]').forEach(function (el) { el.textContent = map[k]; });
    });
    scope.querySelectorAll('[data-te-season-services]').forEach(function (el) {
      el.innerHTML = '';
      s.names.forEach(function (n) { el.appendChild(h('li', { text: n })); });
    });
    scope.querySelectorAll('[data-te-service]').forEach(function (el) {
      if (s.services.indexOf(el.getAttribute('data-te-service')) !== -1) el.setAttribute('data-in-season', 'true');
    });
  }

  window.TE = {
    company: COMPANY,
    pricing: PRICING,
    services: SERVICES,
    season: season,
    estimate: estimate,
    mountCalculator: mountCalculator,
    mountContact: mountContact,
    fill: fill,
    kr: kr
  };

  // Se till att [hidden] alltid vinner över designernas display-regler.
  var base = document.createElement('style');
  base.textContent = '.tec [hidden],[data-te-status][hidden]{display:none!important}';
  document.head.appendChild(base);

  document.addEventListener('DOMContentLoaded', function () {
    fill();
    document.querySelectorAll('[data-te-calculator]').forEach(function (el) { mountCalculator(el); });
    document.querySelectorAll('form[data-te-contact]').forEach(mountContact);
    // Markera navigeringen när sidan scrollats (används av förslag med genomskinlig meny)
    var navEl = document.querySelector('.nav');
    if (navEl) {
      var onScroll = function () { navEl.classList.toggle('scrolled', window.scrollY > 40); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    // Mobilmeny
    document.querySelectorAll('[data-nav-toggle]').forEach(function (btn) {
      var nav = btn.closest('.nav');
      btn.addEventListener('click', function () {
        var open = nav.getAttribute('data-open') !== 'true';
        nav.setAttribute('data-open', open ? 'true' : 'false');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.querySelectorAll('.nav-links a').forEach(function (a) {
        a.addEventListener('click', function () { nav.setAttribute('data-open', 'false'); btn.setAttribute('aria-expanded', 'false'); });
      });
    });
  });
})();
