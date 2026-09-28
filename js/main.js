/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'anatolia-kebab-giambellino',
    whatsapp: {
      number: '', // WhatsApp non dichiarato: si chiama (02 423 5885) o si ordina su Glovo
      message: '',
      ids: [],
    },
    /* Google (28/9/2026): tutti i giorni 11–23; il venerdì 11–13:30 e 14:30–23 */
    hours: {
      0: [['11:00', '23:00']],
      1: [['11:00', '23:00']],
      2: [['11:00', '23:00']],
      3: [['11:00', '23:00']],
      4: [['11:00', '23:00']],
      5: [['11:00', '13:30'], ['14:30', '23:00']],
      6: [['11:00', '23:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1000,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Anatolia Kebab & Pizza, back to the top",
      "m.lingua": "Language",
      "t.chiama": "Call",
      "m.menu": "Open the menu",
      "m.nav": "The parts of the site",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.kebap": "Kebap",
      "n.pizze": "Pizzas",
      "n.banco": "From the counter",
      "n.dolci": "Turkish sweets",
      "n.dicono": "Reviews",
      "n.orari": "Hours",
      "n.locale": "The place",
      "h.sopra": "Since 2002 · Via Giambellino 15",
      "h.titolo": "Kebap made in house.",
      "h.testo": "We build the spit here, slice upon slice: veal only, or chicken only. And then the pizzas, the falafel and the homemade Turkish sweets.",
      "h.n": "4.4",
      "h.voto": "1,029 reviews on Google",
      "h.strada": "Directions",
      "h.glovo": "Order on Glovo",
      "f.titolo": "The veal spit, made by us",
      "f.desc": "A vertical spit in front of the grill: slices of meat drop one by one onto the rod and stack into a cone, the grill lights up, the spit turns and browns, the electric knife moves down its side and the curls of meat fall into the tray.",
      "f.nota": "The veal spit, one slice on top of another.",
      "f.rifai": "Another spit",
      "a.spiedo": "The spit under the hood: the electric disc knife cuts the meat, the grill glows behind it, the sliced meat lies in the tray below.",
      "c.spiedo": "The spit at the counter, with the disc knife.",
      "s.titolo": "We make the spit ourselves",
      "s.p1": "The kebap is <b>veal only</b>, made in house, or <b>chicken only</b>, prepared in house: the spit is built here, one slice on top of another on the rod, and cut to order.",
      "s.f1": "Veal only",
      "s.f2": "Or chicken only",
      "s.f3": "Our own falafel",
      "s.f4": "Homemade sweets",
      "s.f5": "No alcohol",
      "s.fonte": "Vivimilano, Corriere della Sera, February 2022 (“And the spit is prepared “in house”, a detail that is anything but a given”): the first of the three kebab places it picked, under the headline «Kebab, qui è un’arte» (Kebab is an art here).",
      "a.pizzakebap": "In front of the spit, freshly cut meat on the kebap pizza, in the box printed PIZZA.",
      "c.pizzakebap": "From the spit to the kebap pizza.",
      "t.titolo": "The board",
      "t.sotto": "The one above the counter, without the prices. The numbers in the circles are the same.",
      "k.titolo": "KEBAP",
      "k.sotto": "veal only or chicken only",
      "k.i1": "(veal or chicken, lettuce, tomato, onion, sauces)",
      "k.n3": "Döner kebap plate with chips and salad",
      "k.i3": "(yogurt sauce and hot sauce)",
      "k.n4": "Döner kebap plate with rice and salad",
      "k.n5": "Döner kebap in a tray",
      "k.i5": "(meat only, small or large)",
      "k.i6": "(tomato, mozzarella, veal or chicken kebap, lettuce, chips, onions, yogurt sauce and hot sauce)",
      "k.n7": "Kebap sandwich meal",
      "k.i7": "(with chips and a drink)",
      "k.n8": "Kebap wrap meal",
      "k.vege": "vegetarian, made by us",
      "k.i9": "(chickpeas, parsley, onions, spices, lettuce, tomato, sauces)",
      "k.n11": "Falafel plate with chips and salad",
      "k.n12": "Falafel sandwich meal",
      "a.piadine": "Six kebap wraps, rolled and stacked in a pyramid on the wooden board.",
      "o.vitellopollo": "veal or chicken",
      "a.panino": "A kebap wrap in its paper bag and a tray of chips with ketchup, on the tray.",
      "o.patatine": "with chips",
      "k.bulgur": "Kebap plate with bulgur",
      "a.bulgur": "A plate of kebap on bulgur, with salad, tomato and yogurt sauce.",
      "o.yogurt": "yogurt sauce",
      "a.vaschette": "Four foil trays with kebap, chips, yogurt sauce and hot sauce.",
      "o.asporto": "to take away",
      "p.titolo": "CLASSIC PIZZAS",
      "p.sotto": "with tomato and mozzarella",
      "p.i1": "(basil)",
      "p.i2": "(tomato, garlic, oregano: no mozzarella)",
      "p.i3": "(anchovies)",
      "p.i4": "(spicy salami)",
      "p.n5": "Ham and mushrooms",
      "p.n6": "Four seasons",
      "p.i6": "(ham, mushrooms, artichokes, olives)",
      "p.n7": "Four cheeses",
      "p.i7": "(gorgonzola, scamorza, grana)",
      "p.i8": "(olives, anchovies, oregano)",
      "p.i9": "(spicy salami, olives, oregano)",
      "p.i10": "(aubergines, courgettes, peppers)",
      "p.i11": "(frankfurters and chips)",
      "p.i12": "(with chips)",
      "p.i13": "(tuna, onions)",
      "p.i14": "(döner kebap meat, sauces)",
      "p.n15": "Seafood",
      "p.i16": "(tuna, spicy salami, onions)",
      "p.n17": "Sea and mountains",
      "p.i17": "(shrimps, mushrooms)",
      "p.i18": "(aubergines, grana)",
      "p.coda": "And then frankfurters, ham, mushrooms, tuna, pugliese, bomba, shrimps. The <b>pizza meal</b> (21) is the margherita with chips and a drink; by the slice, there is the margherita.",
      "a.margherita": "A margherita cut into slices on the white plate, with a tray of chips beside it.",
      "o.forno": "from the oven",
      "p.banco": "On the granite counter",
      "a.pizzebanco": "Pizzas stretched out on the granite counter, one with salami, one with ham, one with mozzarella; the peel.",
      "o.stese": "stretched by hand",
      "p.forno": "In the oven",
      "a.forno": "A pizza goes into the steel oven on the peel, another is already baking inside.",
      "o.caldo": "fresh from the oven",
      "b.titolo": "HOT DISHES",
      "b.sotto": "from the counter",
      "b.i1": "(chicken, potatoes, vegetables; also with rice)",
      "b.i2": "(durum wheat bulgur with minced meat, tomato sauce, onion, spices)",
      "b.n3": "Rice with vegetables",
      "b.i3": "(carrots, courgettes, peppers)",
      "b.frittelle": "FRITTERS",
      "b.pezzi": "by the piece",
      "b.i4": "(3 pieces: puff pastry, cheese, parsley, spices)",
      "b.i5": "(3 pieces: chickpeas, parsley, onions, spices)",
      "b.n6": "Vegetable fritters",
      "b.i6": "(3 pieces: mixed vegetables, spices)",
      "b.n7": "Potato parcel",
      "b.i7": "(3 pieces: potatoes with herbed cheese)",
      "b.n8": "Potato and onion",
      "b.i8": "(3 pieces)",
      "b.n9": "Potato croquettes",
      "b.i9": "(4 pieces)",
      "b.n10": "Chips",
      "b.i10": "(small or large)",
      "b.vetrina": "The hot display case",
      "a.vetrina": "The hot display case with trays of sigara börek, fritters, falafel, potato and onion, potato parcels and croquettes, with their name cards.",
      "o.pezzi": "3 pieces",
      "b.risobulgur": "Rice and bulgur",
      "a.risobulgur": "White rice and tomato bulgur in the steel trays of the counter.",
      "o.banco": "at the counter",
      "b.cipolla": "The onion, cut by knife",
      "a.cipolla": "A red onion sliced thin with a knife, on the chopping board.",
      "o.fresca": "fresh",
      "d.titolo": "TURKISH SWEETS",
      "d.sotto": "homemade",
      "d.i1": "(3 pieces: puff pastry, pistachios, walnuts, butter, sugar syrup)",
      "d.i2": "(3 rolled pieces: puff pastry, pistachios, walnuts, butter, sugar syrup)",
      "d.i3": "(filo pastry, walnuts, butter, sugar syrup)",
      "d.i4": "(semolina, flour, yogurt, milk, eggs, baking powder, syrup)",
      "d.i5": "(rice, milk, sugar, corn starch)",
      "d.bere": "TO DRINK",
      "d.alcol": "no alcohol",
      "d.i6": "(a yogurt drink)",
      "d.n7": "Iced tea",
      "d.i7": "(lemon or peach)",
      "d.n8": "ACE juice, soft drinks, water",
      "a.baklava": "The tray of baklava cut into squares, with chopped pistachio on top.",
      "o.pistacchio": "with pistachio",
      "a.sarma": "The tray of sarma: little rolls of pastry with stripes of pistachio.",
      "o.arrotolata": "rolled",
      "a.kadayif": "The tray of kadayif, the golden shredded pastry, with a tuft of coconut and pistachio on each piece.",
      "o.pezzo": "by the piece",
      "a.revani": "The tray of revani, the semolina cake in syrup, with coconut and pistachio.",
      "r.titolo": "What people say",
      "r.voto": "on Google, 1,029 reviews",
      "r.s5": "5 stars out of 5",
      "r.a2": "2 years ago",
      "r.m7": "7 months ago",
      "r.m3": "3 months ago",
      "r.a1": "a year ago",
      "r.nota": "From the Google reviews, as they were written (in Italian); cuts are marked […].",
      "r.tutte": "All the reviews",
      "l.titolo": "The place",
      "l.p1": "At number 15 on Via Giambellino, under the red sign and the awning: <b>22 seats</b> and, in good weather, the outdoor tables on the pavement. No bookings: just come in.",
      "l.p2": "We don’t deliver ourselves: order on <a href=\"https://glovoapp.com/it/it/milano/stores/anatolia-2\" target=\"_blank\" rel=\"noopener\">Glovo</a>. We don’t serve alcohol.",
      "a.facciata": "The front by day: the white sign with ANATOLIA and KEBAP & PIZZA in red, the red awning with the ochre edge.",
      "c.facciata": "The sign and the awning, by day.",
      "a.sera": "Evening: the red carpet on the pavement, the tables, the lit window and the lights under the awning.",
      "c.sera": "In the evening, with the red carpet.",
      "a.dehors": "The lit sign and the outdoor area with the wooden lattice fence and the artificial grass.",
      "c.dehors": "The outdoor tables on Via Giambellino.",
      "a.insegna": "The two signs, ANATOLIA and KEBAP & PIZZA, above the red awnings, and the house number 15.",
      "c.insegna": "Number 15.",
      "a.dolci": "The four trays of Turkish sweets in the display case: kadayif, revani, sarma and baklava.",
      "c.dolci": "The sweets, in the display case.",
      "q.titolo": "Questions at the counter",
      "q.1": "Can I book?",
      "q.1r": "No, no bookings: just come in. There are 22 seats and, in good weather, the outdoor tables on Via Giambellino.",
      "q.2": "Do you deliver?",
      "q.2r": "Not directly: for delivery, order on Glovo.",
      "q.3": "What meat is the kebap?",
      "q.3r": "Veal only, made in house, or chicken only, prepared in house.",
      "q.4": "Are there vegetarian dishes?",
      "q.4r": "Yes: the falafel sandwich, wrap and plate, the meat-free pizzas, the vegetable fritters, the potato and cheese parcels, the rice with vegetables, the sigara börek.",
      "q.5": "Do you serve alcohol?",
      "q.5r": "No. To drink there is ayran, iced tea, juices, soft drinks and water.",
      "q.6": "How do I get there?",
      "q.6r": "By tram 14, which stops right in front, at the Via Giambellino – Via Tolstoj stop. The M4 metro is 365 metres away at Tolstoj, and 460 metres away at Bolivar.",
      "o.titolo": "Hours and where",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.dove": "Via Giambellino 15, 20146 Milan. <b>Tram 14</b> stops right in front, at the Via Giambellino – Via Tolstoj stop; the <b>M4</b> is 365 metres away at Tolstoj, and 460 metres away at Bolivar.",
      "o.mappa": "Map: Anatolia Kebab & Pizza, Via Giambellino 15, Milan",
      "a.serranda": "The lowered shutter, painted: on the left Cappadocia with its balloons, on the right Istanbul at night; above it the sign with SPECIALITA’ TURCHE, GASTRONOMIA, ROSTICCERIA.",
      "z.quando": "Since 2002 at number 15 on Via Giambellino. Every day until 11 pm, then down comes the shutter.",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · photos from the Google listing (by the restaurant and by customers) and from the restaurant’s Instagram, reviews from Google, the menu from the restaurant’s board and from Glovo (September 2026). The spit at the top is drawn.",
      "z.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ ANATOLIA KEBAB & PIZZA — «Kebap di produzione propria.» ══════════
     La pagina va dalla strada al banco: l'insegna, il banco con lo spiedo, lo striscione, il tabellone luminoso.
     la FIRMA — lo spiedo, fetta per fetta: a) le fette cadono una a una sull'asta e si impilano (più larghe in alto), poi
     scende il cappello; b) la griglia si accende fornello per fornello e sale il bagliore; c) lo spiedo gira (ogni chiazza
     e ogni lembo stanno su un cilindro: x = cx + r·sin θ, y = y + ry·cos θ, larghezza r·w·cos θ, dietro non si vedono)
     e la carne passa dal rosa al bruno; d) il coltello elettrico scende lungo il fianco e i riccioli cadono nella
     vaschetta, dove il mucchio cresce.
     Stato finale = l'HTML/SVG. Senza JS e con reduced-motion: lo stato finale. L'attesa è la classe firma-attesa
     dell'head (l'asta vuota, la griglia spenta, via CSS), tolta dall'head dopo 2,5 s se il codice non arriva. Un rAF a
     tempo: la firma non dipende da GSAP. I dati vengono da _akg_firma.mjs. */
  var DATI = {"CX":200,"N":26,"PHI_FINE":0.35,"GIRO":10.996,"LAMA":22,"fette":[{"yt":460.8,"yb":476,"r":50.1,"kt":0.172,"kb":0.175,"raw":[195,112,95],"cotto":[147,80,42]},{"yt":447.5,"yb":460.8,"r":56.4,"kt":0.169,"kb":0.172,"raw":[218,126,107],"cotto":[164,89,47]},{"yt":433.4,"yb":447.5,"r":57.9,"kt":0.166,"kb":0.169,"raw":[190,110,93],"cotto":[143,78,41]},{"yt":418.8,"yb":433.4,"r":56.1,"kt":0.163,"kb":0.166,"raw":[209,120,102],"cotto":[157,86,45]},{"yt":404.7,"yb":418.8,"r":61.8,"kt":0.16,"kb":0.163,"raw":[204,117,99],"cotto":[153,83,44]},{"yt":390.4,"yb":404.7,"r":64.3,"kt":0.157,"kb":0.16,"raw":[200,115,97],"cotto":[150,82,43]},{"yt":375.4,"yb":390.4,"r":62.1,"kt":0.154,"kb":0.157,"raw":[191,110,93],"cotto":[144,78,41]},{"yt":361.6,"yb":375.4,"r":64.1,"kt":0.152,"kb":0.154,"raw":[198,114,97],"cotto":[149,81,43]},{"yt":347.8,"yb":361.6,"r":66.5,"kt":0.149,"kb":0.152,"raw":[208,119,101],"cotto":[156,85,45]},{"yt":334.5,"yb":347.8,"r":67.3,"kt":0.146,"kb":0.149,"raw":[207,119,101],"cotto":[156,85,44]},{"yt":321,"yb":334.5,"r":69.4,"kt":0.143,"kb":0.146,"raw":[212,122,104],"cotto":[159,87,46]},{"yt":307.2,"yb":321,"r":75.1,"kt":0.14,"kb":0.143,"raw":[203,117,99],"cotto":[153,83,44]},{"yt":292.3,"yb":307.2,"r":73.7,"kt":0.137,"kb":0.14,"raw":[209,120,102],"cotto":[157,86,45]},{"yt":279.3,"yb":292.3,"r":75,"kt":0.135,"kb":0.137,"raw":[190,109,93],"cotto":[143,78,41]},{"yt":264.8,"yb":279.3,"r":78.6,"kt":0.132,"kb":0.135,"raw":[189,109,92],"cotto":[142,77,41]},{"yt":251.6,"yb":264.8,"r":78.1,"kt":0.129,"kb":0.132,"raw":[194,112,95],"cotto":[146,79,42]},{"yt":238.3,"yb":251.6,"r":80,"kt":0.126,"kb":0.129,"raw":[212,122,104],"cotto":[159,87,46]},{"yt":224.1,"yb":238.3,"r":80.7,"kt":0.123,"kb":0.126,"raw":[194,112,95],"cotto":[146,79,42]},{"yt":209.6,"yb":224.1,"r":83.8,"kt":0.12,"kb":0.123,"raw":[219,126,107],"cotto":[164,90,47]},{"yt":196.4,"yb":209.6,"r":88.1,"kt":0.118,"kb":0.12,"raw":[206,118,100],"cotto":[155,84,44]},{"yt":182.7,"yb":196.4,"r":86.4,"kt":0.115,"kb":0.118,"raw":[209,120,102],"cotto":[157,86,45]},{"yt":168.2,"yb":182.7,"r":92,"kt":0.112,"kb":0.115,"raw":[201,116,98],"cotto":[151,82,43]},{"yt":153.4,"yb":168.2,"r":93.7,"kt":0.109,"kb":0.112,"raw":[191,110,93],"cotto":[143,78,41]},{"yt":139.6,"yb":153.4,"r":91.1,"kt":0.106,"kb":0.109,"raw":[214,123,104],"cotto":[161,88,46]},{"yt":125.1,"yb":139.6,"r":95.4,"kt":0.103,"kb":0.106,"raw":[204,118,100],"cotto":[154,84,44]},{"yt":111.5,"yb":125.1,"r":96.6,"kt":0.1,"kb":0.103,"raw":[206,118,100],"cotto":[155,84,44]}],"topRaw":[216,142,122],"topCotto":[170,104,62],"macchie":[{"f":0,"tipo":"vena","t0":5.234,"ys":470.7,"w":0.174,"ry":1.4,"o":0.604},{"f":0,"tipo":"vena","t0":5.834,"ys":469.8,"w":0.2,"ry":1.6,"o":0.668},{"f":0,"tipo":"vena","t0":1.745,"ys":471.9,"w":0.168,"ry":1,"o":0.758},{"f":0,"tipo":"vena","t0":1.453,"ys":469.1,"w":0.195,"ry":1.4,"o":0.751},{"f":0,"tipo":"crosta","t0":4.918,"ys":465.8,"w":0.166,"ry":1.4,"o":0.797},{"f":0,"tipo":"crosta","t0":0.908,"ys":472.2,"w":0.098,"ry":2.2,"o":0.624},{"f":0,"tipo":"crosta","t0":5.217,"ys":467.8,"w":0.131,"ry":2.3,"o":0.723},{"f":0,"tipo":"crosta","t0":4.327,"ys":471.8,"w":0.112,"ry":2.2,"o":0.828},{"f":1,"tipo":"vena","t0":1.451,"ys":452.6,"w":0.101,"ry":1,"o":0.658},{"f":1,"tipo":"vena","t0":4.197,"ys":456.2,"w":0.185,"ry":1,"o":0.762},{"f":1,"tipo":"vena","t0":5.999,"ys":452.9,"w":0.117,"ry":0.9,"o":0.677},{"f":1,"tipo":"vena","t0":5.388,"ys":451.2,"w":0.173,"ry":1.6,"o":0.654},{"f":1,"tipo":"crosta","t0":1.032,"ys":454.3,"w":0.078,"ry":1.8,"o":0.672},{"f":1,"tipo":"crosta","t0":0.717,"ys":451.6,"w":0.149,"ry":1.8,"o":0.539},{"f":1,"tipo":"crosta","t0":1.564,"ys":457,"w":0.083,"ry":1.5,"o":0.675},{"f":1,"tipo":"crosta","t0":6.09,"ys":452.9,"w":0.124,"ry":2.3,"o":0.57},{"f":2,"tipo":"vena","t0":6.028,"ys":440.1,"w":0.175,"ry":1.5,"o":0.657},{"f":2,"tipo":"vena","t0":1.585,"ys":438.7,"w":0.17,"ry":1.4,"o":0.752},{"f":2,"tipo":"vena","t0":4.137,"ys":436.7,"w":0.253,"ry":1.1,"o":0.72},{"f":2,"tipo":"vena","t0":5.711,"ys":440.7,"w":0.125,"ry":1.5,"o":0.543},{"f":2,"tipo":"crosta","t0":3.466,"ys":443.4,"w":0.093,"ry":2.5,"o":0.699},{"f":2,"tipo":"crosta","t0":4.501,"ys":440.5,"w":0.152,"ry":2,"o":0.594},{"f":2,"tipo":"crosta","t0":1.41,"ys":440.6,"w":0.075,"ry":1.5,"o":0.695},{"f":2,"tipo":"crosta","t0":0.795,"ys":436.4,"w":0.152,"ry":2.3,"o":0.727},{"f":3,"tipo":"vena","t0":4.996,"ys":424.4,"w":0.104,"ry":1.1,"o":0.728},{"f":3,"tipo":"vena","t0":6.108,"ys":426.5,"w":0.144,"ry":1.1,"o":0.53},{"f":3,"tipo":"vena","t0":1.036,"ys":421.4,"w":0.15,"ry":1.2,"o":0.521},{"f":3,"tipo":"vena","t0":0.803,"ys":429.1,"w":0.234,"ry":1.2,"o":0.59},{"f":3,"tipo":"crosta","t0":3.197,"ys":424,"w":0.102,"ry":2.1,"o":0.863},{"f":3,"tipo":"crosta","t0":4.144,"ys":424.8,"w":0.177,"ry":2,"o":0.573},{"f":3,"tipo":"crosta","t0":5.687,"ys":424.2,"w":0.115,"ry":1.7,"o":0.802},{"f":3,"tipo":"crosta","t0":5.882,"ys":422,"w":0.161,"ry":2.3,"o":0.752},{"f":4,"tipo":"vena","t0":3.186,"ys":414.6,"w":0.164,"ry":1.5,"o":0.529},{"f":4,"tipo":"vena","t0":0.735,"ys":415.2,"w":0.11,"ry":1.3,"o":0.605},{"f":4,"tipo":"vena","t0":4.18,"ys":414.1,"w":0.18,"ry":1.5,"o":0.836},{"f":4,"tipo":"vena","t0":3.647,"ys":407.4,"w":0.139,"ry":0.9,"o":0.793},{"f":4,"tipo":"crosta","t0":6.063,"ys":414.8,"w":0.117,"ry":1.7,"o":0.769},{"f":4,"tipo":"crosta","t0":0.567,"ys":411.3,"w":0.132,"ry":1.6,"o":0.796},{"f":4,"tipo":"crosta","t0":5.941,"ys":408.3,"w":0.144,"ry":1.9,"o":0.747},{"f":4,"tipo":"crosta","t0":0.914,"ys":411.9,"w":0.117,"ry":1.8,"o":0.571},{"f":5,"tipo":"vena","t0":5.913,"ys":395.7,"w":0.12,"ry":1.5,"o":0.501},{"f":5,"tipo":"vena","t0":3.193,"ys":397,"w":0.142,"ry":1.3,"o":0.555},{"f":5,"tipo":"vena","t0":5.334,"ys":399.1,"w":0.137,"ry":1.1,"o":0.634},{"f":5,"tipo":"vena","t0":2.753,"ys":396,"w":0.246,"ry":1.3,"o":0.763},{"f":5,"tipo":"crosta","t0":1.482,"ys":395.5,"w":0.133,"ry":2.4,"o":0.661},{"f":5,"tipo":"crosta","t0":3.946,"ys":398.7,"w":0.071,"ry":2.1,"o":0.541},{"f":5,"tipo":"crosta","t0":4.32,"ys":401.5,"w":0.128,"ry":2.5,"o":0.758},{"f":5,"tipo":"crosta","t0":2.081,"ys":400.7,"w":0.104,"ry":1.3,"o":0.528},{"f":6,"tipo":"vena","t0":4.463,"ys":382.7,"w":0.203,"ry":1.3,"o":0.59},{"f":6,"tipo":"vena","t0":5.577,"ys":384.2,"w":0.225,"ry":1.1,"o":0.76},{"f":6,"tipo":"vena","t0":2.017,"ys":380.8,"w":0.164,"ry":1.2,"o":0.526},{"f":6,"tipo":"vena","t0":0.497,"ys":384,"w":0.192,"ry":1.2,"o":0.589},{"f":6,"tipo":"crosta","t0":4.629,"ys":383.8,"w":0.103,"ry":1.8,"o":0.836},{"f":6,"tipo":"crosta","t0":0.816,"ys":386.7,"w":0.11,"ry":1.8,"o":0.539},{"f":6,"tipo":"crosta","t0":3.607,"ys":381.6,"w":0.167,"ry":1.9,"o":0.698},{"f":6,"tipo":"crosta","t0":5.694,"ys":386.9,"w":0.106,"ry":1.6,"o":0.643},{"f":7,"tipo":"vena","t0":3.136,"ys":365.5,"w":0.107,"ry":1,"o":0.729},{"f":7,"tipo":"vena","t0":6.107,"ys":372.4,"w":0.175,"ry":1.2,"o":0.711},{"f":7,"tipo":"vena","t0":3.192,"ys":364.9,"w":0.201,"ry":1.2,"o":0.747},{"f":7,"tipo":"vena","t0":2.464,"ys":369.8,"w":0.179,"ry":1.1,"o":0.702},{"f":7,"tipo":"crosta","t0":1.397,"ys":369.3,"w":0.168,"ry":1.7,"o":0.589},{"f":7,"tipo":"crosta","t0":4.99,"ys":367.9,"w":0.178,"ry":1.6,"o":0.816},{"f":7,"tipo":"crosta","t0":4.294,"ys":371.1,"w":0.112,"ry":2.4,"o":0.557},{"f":7,"tipo":"crosta","t0":5.048,"ys":366.5,"w":0.108,"ry":2.4,"o":0.658},{"f":8,"tipo":"vena","t0":2.374,"ys":350.6,"w":0.144,"ry":1,"o":0.706},{"f":8,"tipo":"vena","t0":5.735,"ys":351,"w":0.147,"ry":1.2,"o":0.606},{"f":8,"tipo":"vena","t0":2.849,"ys":352.5,"w":0.231,"ry":1.1,"o":0.623},{"f":8,"tipo":"vena","t0":0.137,"ys":355.5,"w":0.16,"ry":1.5,"o":0.621},{"f":8,"tipo":"crosta","t0":4.367,"ys":353.6,"w":0.116,"ry":1.3,"o":0.765},{"f":8,"tipo":"crosta","t0":1.895,"ys":358,"w":0.113,"ry":2.5,"o":0.841},{"f":8,"tipo":"crosta","t0":5.131,"ys":351.5,"w":0.118,"ry":1.9,"o":0.824},{"f":8,"tipo":"crosta","t0":1.236,"ys":358.9,"w":0.115,"ry":2.1,"o":0.886},{"f":9,"tipo":"vena","t0":2.581,"ys":339.6,"w":0.126,"ry":1.6,"o":0.7},{"f":9,"tipo":"vena","t0":2.799,"ys":343.1,"w":0.128,"ry":1.4,"o":0.604},{"f":9,"tipo":"vena","t0":2.712,"ys":340,"w":0.188,"ry":1.2,"o":0.809},{"f":9,"tipo":"vena","t0":5.696,"ys":339.6,"w":0.206,"ry":1,"o":0.631},{"f":9,"tipo":"crosta","t0":5.57,"ys":343.4,"w":0.074,"ry":2.4,"o":0.575},{"f":9,"tipo":"crosta","t0":1.378,"ys":338,"w":0.148,"ry":2.2,"o":0.506},{"f":9,"tipo":"crosta","t0":3.63,"ys":340.1,"w":0.166,"ry":1.8,"o":0.613},{"f":9,"tipo":"crosta","t0":5.703,"ys":339.7,"w":0.079,"ry":1.7,"o":0.508},{"f":10,"tipo":"vena","t0":1.375,"ys":330.1,"w":0.243,"ry":1.3,"o":0.564},{"f":10,"tipo":"vena","t0":3.598,"ys":324.3,"w":0.228,"ry":1.5,"o":0.59},{"f":10,"tipo":"vena","t0":3.817,"ys":324.2,"w":0.188,"ry":1,"o":0.651},{"f":10,"tipo":"vena","t0":2.841,"ys":326.8,"w":0.189,"ry":1.5,"o":0.802},{"f":10,"tipo":"crosta","t0":4.006,"ys":331,"w":0.071,"ry":1.7,"o":0.841},{"f":10,"tipo":"crosta","t0":3.036,"ys":329,"w":0.14,"ry":2.1,"o":0.802},{"f":10,"tipo":"crosta","t0":0.688,"ys":324.9,"w":0.133,"ry":1.9,"o":0.639},{"f":10,"tipo":"crosta","t0":5.544,"ys":331.2,"w":0.09,"ry":2.2,"o":0.742},{"f":11,"tipo":"vena","t0":3.057,"ys":316.1,"w":0.251,"ry":1.5,"o":0.712},{"f":11,"tipo":"vena","t0":2.337,"ys":318,"w":0.243,"ry":1.3,"o":0.799},{"f":11,"tipo":"vena","t0":3.492,"ys":313.1,"w":0.111,"ry":1.2,"o":0.828},{"f":11,"tipo":"vena","t0":1.754,"ys":317.8,"w":0.233,"ry":1,"o":0.551},{"f":11,"tipo":"crosta","t0":4.558,"ys":310.2,"w":0.131,"ry":2.4,"o":0.733},{"f":11,"tipo":"crosta","t0":1.016,"ys":311.8,"w":0.091,"ry":1.9,"o":0.827},{"f":11,"tipo":"crosta","t0":0.974,"ys":316.6,"w":0.176,"ry":2,"o":0.661},{"f":11,"tipo":"crosta","t0":4.949,"ys":310.9,"w":0.096,"ry":2.5,"o":0.629},{"f":12,"tipo":"vena","t0":1.209,"ys":302.8,"w":0.134,"ry":1,"o":0.766},{"f":12,"tipo":"vena","t0":1.374,"ys":302.8,"w":0.217,"ry":1.5,"o":0.715},{"f":12,"tipo":"vena","t0":2.342,"ys":301.6,"w":0.175,"ry":1.5,"o":0.618},{"f":12,"tipo":"vena","t0":0.621,"ys":297.2,"w":0.201,"ry":1,"o":0.842},{"f":12,"tipo":"crosta","t0":1.002,"ys":299.7,"w":0.179,"ry":2.3,"o":0.701},{"f":12,"tipo":"crosta","t0":2.258,"ys":297.3,"w":0.151,"ry":1.9,"o":0.626},{"f":12,"tipo":"crosta","t0":6.239,"ys":304.7,"w":0.113,"ry":1.9,"o":0.559},{"f":12,"tipo":"crosta","t0":1.979,"ys":300.9,"w":0.174,"ry":1.5,"o":0.633},{"f":13,"tipo":"vena","t0":3.346,"ys":286.2,"w":0.257,"ry":1,"o":0.556},{"f":13,"tipo":"vena","t0":5.534,"ys":286.2,"w":0.218,"ry":1.3,"o":0.605},{"f":13,"tipo":"vena","t0":6.162,"ys":287.2,"w":0.206,"ry":1,"o":0.813},{"f":13,"tipo":"vena","t0":5.203,"ys":286.3,"w":0.219,"ry":1,"o":0.633},{"f":13,"tipo":"crosta","t0":5.119,"ys":286.1,"w":0.128,"ry":2.4,"o":0.558},{"f":13,"tipo":"crosta","t0":1.439,"ys":282.8,"w":0.163,"ry":2.3,"o":0.872},{"f":13,"tipo":"crosta","t0":2.247,"ys":288.8,"w":0.175,"ry":2.2,"o":0.736},{"f":13,"tipo":"crosta","t0":6.133,"ys":283.3,"w":0.168,"ry":2,"o":0.639},{"f":14,"tipo":"vena","t0":2.885,"ys":267.6,"w":0.134,"ry":1.4,"o":0.647},{"f":14,"tipo":"vena","t0":6.234,"ys":267.6,"w":0.178,"ry":1.5,"o":0.655},{"f":14,"tipo":"vena","t0":2.055,"ys":272.6,"w":0.125,"ry":1.6,"o":0.65},{"f":14,"tipo":"vena","t0":3.361,"ys":269.9,"w":0.208,"ry":1.2,"o":0.546},{"f":14,"tipo":"crosta","t0":1.519,"ys":275.4,"w":0.09,"ry":1.3,"o":0.808},{"f":14,"tipo":"crosta","t0":3.861,"ys":275.4,"w":0.104,"ry":1.8,"o":0.518},{"f":14,"tipo":"crosta","t0":3.249,"ys":272.7,"w":0.141,"ry":2.5,"o":0.549},{"f":14,"tipo":"crosta","t0":3.167,"ys":270.9,"w":0.144,"ry":1.4,"o":0.834},{"f":15,"tipo":"vena","t0":0.87,"ys":254.4,"w":0.197,"ry":1.4,"o":0.832},{"f":15,"tipo":"vena","t0":5.815,"ys":259.7,"w":0.11,"ry":1.5,"o":0.674},{"f":15,"tipo":"vena","t0":3.276,"ys":261,"w":0.216,"ry":1.4,"o":0.616},{"f":15,"tipo":"vena","t0":0.039,"ys":261.2,"w":0.123,"ry":1.1,"o":0.793},{"f":15,"tipo":"crosta","t0":1.174,"ys":254.6,"w":0.096,"ry":1.7,"o":0.88},{"f":15,"tipo":"crosta","t0":3.212,"ys":258.8,"w":0.161,"ry":2.3,"o":0.714},{"f":15,"tipo":"crosta","t0":6.159,"ys":260.6,"w":0.112,"ry":1.4,"o":0.558},{"f":15,"tipo":"crosta","t0":4.057,"ys":259.8,"w":0.164,"ry":1.3,"o":0.609},{"f":16,"tipo":"vena","t0":2.858,"ys":241.7,"w":0.163,"ry":1.5,"o":0.736},{"f":16,"tipo":"vena","t0":6.02,"ys":247.4,"w":0.195,"ry":1.2,"o":0.758},{"f":16,"tipo":"vena","t0":2.812,"ys":241.6,"w":0.167,"ry":1.2,"o":0.649},{"f":16,"tipo":"vena","t0":3.284,"ys":246.5,"w":0.138,"ry":1.5,"o":0.809},{"f":16,"tipo":"crosta","t0":5.462,"ys":243.6,"w":0.102,"ry":1.3,"o":0.75},{"f":16,"tipo":"crosta","t0":3.863,"ys":248.5,"w":0.094,"ry":2.1,"o":0.529},{"f":16,"tipo":"crosta","t0":5.894,"ys":248.7,"w":0.076,"ry":2,"o":0.609},{"f":16,"tipo":"crosta","t0":0.141,"ys":246.9,"w":0.151,"ry":2.1,"o":0.667},{"f":17,"tipo":"vena","t0":2.034,"ys":233.7,"w":0.198,"ry":1.2,"o":0.645},{"f":17,"tipo":"vena","t0":3.534,"ys":234.2,"w":0.211,"ry":1.3,"o":0.515},{"f":17,"tipo":"vena","t0":5.619,"ys":229.5,"w":0.171,"ry":1.6,"o":0.726},{"f":17,"tipo":"vena","t0":1.714,"ys":233.1,"w":0.113,"ry":1.2,"o":0.822},{"f":17,"tipo":"crosta","t0":3.31,"ys":235.8,"w":0.107,"ry":2.1,"o":0.772},{"f":17,"tipo":"crosta","t0":5.06,"ys":230.1,"w":0.144,"ry":1.7,"o":0.864},{"f":17,"tipo":"crosta","t0":4.716,"ys":230,"w":0.142,"ry":2.6,"o":0.561},{"f":17,"tipo":"crosta","t0":0.057,"ys":231.4,"w":0.092,"ry":1.9,"o":0.549},{"f":18,"tipo":"vena","t0":3.132,"ys":218.2,"w":0.259,"ry":1.2,"o":0.58},{"f":18,"tipo":"vena","t0":0.077,"ys":219.9,"w":0.133,"ry":1.3,"o":0.718},{"f":18,"tipo":"vena","t0":0.989,"ys":218.5,"w":0.18,"ry":0.9,"o":0.512},{"f":18,"tipo":"vena","t0":5.267,"ys":215.4,"w":0.124,"ry":1.4,"o":0.845},{"f":18,"tipo":"crosta","t0":5.028,"ys":218.2,"w":0.17,"ry":2.2,"o":0.876},{"f":18,"tipo":"crosta","t0":6.202,"ys":220.9,"w":0.136,"ry":1.8,"o":0.631},{"f":18,"tipo":"crosta","t0":4.105,"ys":215.1,"w":0.142,"ry":2,"o":0.636},{"f":18,"tipo":"crosta","t0":0.77,"ys":221.4,"w":0.138,"ry":1.9,"o":0.57},{"f":19,"tipo":"vena","t0":4.644,"ys":205.7,"w":0.101,"ry":1.6,"o":0.695},{"f":19,"tipo":"vena","t0":1.666,"ys":202.6,"w":0.161,"ry":1.2,"o":0.658},{"f":19,"tipo":"vena","t0":0.473,"ys":199.8,"w":0.185,"ry":1.2,"o":0.75},{"f":19,"tipo":"vena","t0":0.225,"ys":205.2,"w":0.16,"ry":1.1,"o":0.595},{"f":19,"tipo":"crosta","t0":5.888,"ys":203.2,"w":0.114,"ry":1.3,"o":0.58},{"f":19,"tipo":"crosta","t0":1.634,"ys":206.8,"w":0.125,"ry":2.2,"o":0.872},{"f":19,"tipo":"crosta","t0":1.94,"ys":203.6,"w":0.176,"ry":2,"o":0.678},{"f":19,"tipo":"crosta","t0":2.158,"ys":199.8,"w":0.159,"ry":2.5,"o":0.616},{"f":20,"tipo":"vena","t0":0.535,"ys":187.7,"w":0.192,"ry":1.2,"o":0.673},{"f":20,"tipo":"vena","t0":1.771,"ys":192.7,"w":0.247,"ry":1.4,"o":0.529},{"f":20,"tipo":"vena","t0":5.91,"ys":193,"w":0.185,"ry":1.2,"o":0.763},{"f":20,"tipo":"vena","t0":2.306,"ys":192.5,"w":0.101,"ry":1.1,"o":0.562},{"f":20,"tipo":"crosta","t0":6.057,"ys":185.4,"w":0.18,"ry":1.6,"o":0.604},{"f":20,"tipo":"crosta","t0":4.696,"ys":193.1,"w":0.099,"ry":1.9,"o":0.554},{"f":20,"tipo":"crosta","t0":4.77,"ys":193.4,"w":0.104,"ry":1.5,"o":0.663},{"f":20,"tipo":"crosta","t0":3.384,"ys":190.8,"w":0.149,"ry":1.9,"o":0.584},{"f":21,"tipo":"vena","t0":4.476,"ys":177.2,"w":0.177,"ry":1.6,"o":0.533},{"f":21,"tipo":"vena","t0":1.716,"ys":173.9,"w":0.251,"ry":1.1,"o":0.77},{"f":21,"tipo":"vena","t0":3.408,"ys":178.1,"w":0.215,"ry":1.1,"o":0.819},{"f":21,"tipo":"vena","t0":0.21,"ys":174.2,"w":0.239,"ry":1.5,"o":0.707},{"f":21,"tipo":"crosta","t0":2.112,"ys":172,"w":0.085,"ry":2.5,"o":0.781},{"f":21,"tipo":"crosta","t0":4.435,"ys":171.4,"w":0.101,"ry":1.7,"o":0.721},{"f":21,"tipo":"crosta","t0":1.426,"ys":170.8,"w":0.123,"ry":2.5,"o":0.794},{"f":21,"tipo":"crosta","t0":1.092,"ys":173.1,"w":0.149,"ry":1.7,"o":0.854},{"f":22,"tipo":"vena","t0":4.191,"ys":164.7,"w":0.132,"ry":1.6,"o":0.588},{"f":22,"tipo":"vena","t0":0.217,"ys":165,"w":0.255,"ry":1,"o":0.617},{"f":22,"tipo":"vena","t0":1.122,"ys":162.9,"w":0.226,"ry":1.2,"o":0.538},{"f":22,"tipo":"vena","t0":2.226,"ys":159.1,"w":0.167,"ry":1,"o":0.539},{"f":22,"tipo":"crosta","t0":4.15,"ys":164,"w":0.125,"ry":1.6,"o":0.659},{"f":22,"tipo":"crosta","t0":3.22,"ys":163,"w":0.104,"ry":2.3,"o":0.556},{"f":22,"tipo":"crosta","t0":2.673,"ys":163.2,"w":0.082,"ry":1.6,"o":0.66},{"f":22,"tipo":"crosta","t0":4.701,"ys":158.7,"w":0.153,"ry":2.3,"o":0.524},{"f":23,"tipo":"vena","t0":4.549,"ys":145.9,"w":0.189,"ry":1.1,"o":0.842},{"f":23,"tipo":"vena","t0":3.077,"ys":148,"w":0.246,"ry":1.2,"o":0.682},{"f":23,"tipo":"vena","t0":3,"ys":146.9,"w":0.115,"ry":1.2,"o":0.793},{"f":23,"tipo":"vena","t0":4.015,"ys":148.9,"w":0.192,"ry":1.2,"o":0.751},{"f":23,"tipo":"crosta","t0":5.224,"ys":147.9,"w":0.16,"ry":2.3,"o":0.548},{"f":23,"tipo":"crosta","t0":2.695,"ys":142.4,"w":0.174,"ry":2.5,"o":0.757},{"f":23,"tipo":"crosta","t0":3.748,"ys":143.5,"w":0.162,"ry":2,"o":0.545},{"f":23,"tipo":"crosta","t0":1.685,"ys":146.2,"w":0.082,"ry":1.5,"o":0.613},{"f":24,"tipo":"vena","t0":5.921,"ys":129.5,"w":0.16,"ry":1.2,"o":0.579},{"f":24,"tipo":"vena","t0":6.239,"ys":131.3,"w":0.257,"ry":1.1,"o":0.744},{"f":24,"tipo":"vena","t0":0.204,"ys":131.2,"w":0.163,"ry":1.3,"o":0.792},{"f":24,"tipo":"vena","t0":3.535,"ys":134.5,"w":0.144,"ry":0.9,"o":0.776},{"f":24,"tipo":"crosta","t0":1.063,"ys":133.2,"w":0.139,"ry":2.5,"o":0.822},{"f":24,"tipo":"crosta","t0":0.076,"ys":131.4,"w":0.102,"ry":2.6,"o":0.664},{"f":24,"tipo":"crosta","t0":0.77,"ys":133.5,"w":0.07,"ry":2.5,"o":0.693},{"f":24,"tipo":"crosta","t0":4.128,"ys":131.7,"w":0.148,"ry":2,"o":0.741},{"f":25,"tipo":"vena","t0":3.02,"ys":114.1,"w":0.142,"ry":1.4,"o":0.508},{"f":25,"tipo":"vena","t0":4.311,"ys":116.2,"w":0.195,"ry":1.4,"o":0.762},{"f":25,"tipo":"vena","t0":0.242,"ys":122,"w":0.118,"ry":1.3,"o":0.601},{"f":25,"tipo":"vena","t0":2.704,"ys":114.2,"w":0.203,"ry":1.1,"o":0.664},{"f":25,"tipo":"crosta","t0":6.092,"ys":118.7,"w":0.12,"ry":1.7,"o":0.767},{"f":25,"tipo":"crosta","t0":1.32,"ys":122.4,"w":0.076,"ry":2.6,"o":0.585},{"f":25,"tipo":"crosta","t0":4.215,"ys":120.3,"w":0.133,"ry":2.3,"o":0.739},{"f":25,"tipo":"crosta","t0":2.58,"ys":120.9,"w":0.094,"ry":1.6,"o":0.798}],"lembi":[{"f":0,"t0":5.841,"ys":470.8,"e":2.9,"lx":6.2,"ly":5.2},{"f":0,"t0":1.16,"ys":463.9,"e":5.9,"lx":6.5,"ly":3.8},{"f":0,"t0":3.511,"ys":469.9,"e":4.2,"lx":6.3,"ly":5.3},{"f":1,"t0":1.409,"ys":453.4,"e":4.5,"lx":9.6,"ly":4},{"f":1,"t0":1.095,"ys":457.7,"e":5.4,"lx":5.4,"ly":4},{"f":1,"t0":2.398,"ys":452,"e":4.6,"lx":7.9,"ly":3.4},{"f":2,"t0":6.211,"ys":441.8,"e":3.6,"lx":9.4,"ly":3.7},{"f":2,"t0":1.664,"ys":438.9,"e":5.5,"lx":7,"ly":3.8},{"f":2,"t0":3.467,"ys":444.5,"e":4.9,"lx":5.5,"ly":4.1},{"f":3,"t0":3.418,"ys":428.1,"e":3.4,"lx":5.1,"ly":3.5},{"f":3,"t0":0.514,"ys":429.7,"e":5.5,"lx":8.6,"ly":4.1},{"f":3,"t0":4.13,"ys":422.1,"e":3.8,"lx":5.1,"ly":5},{"f":4,"t0":0.021,"ys":413.9,"e":3.3,"lx":9.3,"ly":5.3},{"f":4,"t0":3.734,"ys":413.4,"e":4.4,"lx":9,"ly":4.7},{"f":4,"t0":1.69,"ys":414.4,"e":2.9,"lx":9.7,"ly":3.3},{"f":5,"t0":0.309,"ys":400.8,"e":4.8,"lx":7.4,"ly":5.4},{"f":5,"t0":6.027,"ys":393.6,"e":3.1,"lx":7,"ly":5},{"f":5,"t0":0.253,"ys":394.4,"e":3.9,"lx":5.5,"ly":3.2},{"f":6,"t0":3.417,"ys":383.7,"e":4.2,"lx":9,"ly":4},{"f":6,"t0":4.255,"ys":381.9,"e":2.8,"lx":7.9,"ly":4.2},{"f":6,"t0":2.636,"ys":385.5,"e":2.9,"lx":9.7,"ly":4},{"f":7,"t0":0.32,"ys":368.4,"e":5,"lx":8.7,"ly":3},{"f":7,"t0":3.925,"ys":365.3,"e":5.1,"lx":7.1,"ly":3.9},{"f":7,"t0":2.015,"ys":365,"e":5.9,"lx":9.9,"ly":5.3},{"f":8,"t0":0.719,"ys":353.1,"e":3,"lx":5.8,"ly":5},{"f":8,"t0":0.947,"ys":352.5,"e":3,"lx":7.8,"ly":3.8},{"f":8,"t0":0.284,"ys":352.5,"e":5.2,"lx":7,"ly":5.4},{"f":9,"t0":0.7,"ys":340.3,"e":5,"lx":6.2,"ly":4.2},{"f":9,"t0":3.553,"ys":339.5,"e":5.1,"lx":9.2,"ly":5.2},{"f":9,"t0":1.559,"ys":340.9,"e":2.6,"lx":6.5,"ly":4.7},{"f":10,"t0":2.622,"ys":326.6,"e":3.6,"lx":7.4,"ly":4},{"f":10,"t0":0.961,"ys":329.2,"e":3.6,"lx":6.5,"ly":4.2},{"f":10,"t0":3.728,"ys":328.1,"e":2.8,"lx":8.6,"ly":3.9},{"f":11,"t0":3.701,"ys":316.5,"e":3.4,"lx":8.8,"ly":4.6},{"f":11,"t0":4.72,"ys":317.1,"e":4.9,"lx":9.7,"ly":4.5},{"f":11,"t0":2.149,"ys":313.2,"e":5.6,"lx":9.3,"ly":4},{"f":12,"t0":0.558,"ys":299.6,"e":3.1,"lx":8.6,"ly":4.5},{"f":12,"t0":1.15,"ys":298.1,"e":3.4,"lx":7.1,"ly":4.4},{"f":12,"t0":1.78,"ys":300.5,"e":3.3,"lx":6.9,"ly":4.4},{"f":13,"t0":3.152,"ys":283.2,"e":5,"lx":5.4,"ly":4.4},{"f":13,"t0":0.655,"ys":286.7,"e":3.4,"lx":7.8,"ly":5.2},{"f":13,"t0":0.286,"ys":286,"e":5,"lx":6,"ly":3.1},{"f":14,"t0":4.051,"ys":275.6,"e":5.1,"lx":5.6,"ly":4.4},{"f":14,"t0":0.328,"ys":276.2,"e":5.6,"lx":5.8,"ly":3.3},{"f":14,"t0":1.317,"ys":274.4,"e":4,"lx":7.7,"ly":3.5},{"f":15,"t0":6.272,"ys":261.2,"e":2.7,"lx":8.6,"ly":5.2},{"f":15,"t0":3.599,"ys":255.2,"e":3.9,"lx":6.1,"ly":5},{"f":15,"t0":3.516,"ys":259.5,"e":2.6,"lx":6,"ly":4.6},{"f":16,"t0":3.658,"ys":243.2,"e":4.5,"lx":6.9,"ly":4.4},{"f":16,"t0":3.286,"ys":245.5,"e":5.1,"lx":6.7,"ly":5.5},{"f":16,"t0":3.562,"ys":244.5,"e":3.8,"lx":5.3,"ly":5.4},{"f":17,"t0":1.08,"ys":233.6,"e":5.1,"lx":7.7,"ly":4.5},{"f":17,"t0":2.536,"ys":229.4,"e":2.6,"lx":7.3,"ly":4.6},{"f":17,"t0":2.694,"ys":229.7,"e":4.8,"lx":9,"ly":3.4},{"f":18,"t0":5.169,"ys":217.7,"e":3.2,"lx":6.1,"ly":4},{"f":18,"t0":5.179,"ys":218.2,"e":4,"lx":6.5,"ly":4.7},{"f":18,"t0":3.479,"ys":219.3,"e":4.2,"lx":6.7,"ly":4},{"f":19,"t0":2.498,"ys":199.8,"e":5.7,"lx":8.2,"ly":4.8},{"f":19,"t0":6.224,"ys":206.5,"e":3.6,"lx":8.7,"ly":4.5},{"f":19,"t0":0.187,"ys":202.2,"e":3.1,"lx":7.8,"ly":5.1},{"f":20,"t0":4.818,"ys":190.6,"e":3.3,"lx":7,"ly":5.3},{"f":20,"t0":2.509,"ys":192.2,"e":5.6,"lx":9.8,"ly":5},{"f":20,"t0":4.047,"ys":192.2,"e":5.6,"lx":10,"ly":4.2},{"f":21,"t0":0.495,"ys":172.7,"e":4,"lx":6.1,"ly":4.5},{"f":21,"t0":3.913,"ys":177.4,"e":5.9,"lx":7,"ly":4.1},{"f":21,"t0":4.799,"ys":173.4,"e":4.5,"lx":6.4,"ly":5.1},{"f":22,"t0":2.308,"ys":158.1,"e":5.2,"lx":9.9,"ly":3.1},{"f":22,"t0":2.289,"ys":156.7,"e":4.7,"lx":9.1,"ly":5},{"f":22,"t0":3.972,"ys":160.4,"e":5.6,"lx":7.5,"ly":3.5},{"f":23,"t0":0.51,"ys":149.6,"e":3.6,"lx":7.8,"ly":3.9},{"f":23,"t0":0.428,"ys":144,"e":4.8,"lx":6.4,"ly":4.8},{"f":23,"t0":5.019,"ys":143.9,"e":4.7,"lx":8.9,"ly":5},{"f":24,"t0":0.91,"ys":133,"e":4.1,"lx":9.9,"ly":4.5},{"f":24,"t0":1.377,"ys":129,"e":4,"lx":5.9,"ly":3.8},{"f":24,"t0":1.75,"ys":128.1,"e":3.9,"lx":7.6,"ly":3.4},{"f":25,"t0":5.922,"ys":120.9,"e":2.6,"lx":6.8,"ly":5.3},{"f":25,"t0":1.97,"ys":115.7,"e":3.9,"lx":8.7,"ly":5.2},{"f":25,"t0":5.921,"ys":119.1,"e":4.8,"lx":6.8,"ly":3.6}],"coltello":{"y0":121.5,"y1":468,"fuori":150},"ricci":[{"t":5509.2,"x0":296.4,"y0":137.3,"x1":208.9,"y1":587.8,"dur":640,"a0":102,"a1":-31},{"t":5542.1,"x0":292.1,"y0":146,"x1":185.2,"y1":587.8,"dur":634,"a0":100,"a1":22},{"t":5542.9,"x0":292.1,"y0":146.3,"x1":195.8,"y1":588.8,"dur":634,"a0":125,"a1":16},{"t":5575.9,"x0":294.7,"y0":155.1,"x1":249.4,"y1":589.3,"dur":628,"a0":21,"a1":14},{"t":5610.4,"x0":294.7,"y0":164.3,"x1":264.6,"y1":592.3,"dur":624,"a0":236,"a1":31},{"t":5602.9,"x0":294.7,"y0":162.3,"x1":216.6,"y1":589.5,"dur":623,"a0":77,"a1":3},{"t":5636.1,"x0":293,"y0":171.1,"x1":188.1,"y1":585.9,"dur":614,"a0":52,"a1":6},{"t":5666,"x0":293,"y0":179.1,"x1":232.4,"y1":585.7,"dur":608,"a0":99,"a1":28},{"t":5674.1,"x0":293,"y0":181.2,"x1":200.4,"y1":587.6,"dur":608,"a0":307,"a1":-25},{"t":5713.6,"x0":287.4,"y0":191.8,"x1":197.8,"y1":586.3,"dur":599,"a0":232,"a1":34},{"t":5734.6,"x0":289.1,"y0":197.4,"x1":231.8,"y1":586.7,"dur":595,"a0":33,"a1":22},{"t":5751.6,"x0":289.1,"y0":201.9,"x1":213.2,"y1":586,"dur":591,"a0":212,"a1":9},{"t":5776.9,"x0":289.1,"y0":208.6,"x1":209.7,"y1":586.5,"dur":586,"a0":145,"a1":-21},{"t":5790.3,"x0":284.8,"y0":212.2,"x1":219.3,"y1":584.5,"dur":582,"a0":63,"a1":23},{"t":5807.1,"x0":284.8,"y0":216.7,"x1":205.2,"y1":585.4,"dur":579,"a0":107,"a1":-1},{"t":5830.6,"x0":284.8,"y0":222.9,"x1":233.6,"y1":583.8,"dur":573,"a0":211,"a1":-2},{"t":5868,"x0":281.7,"y0":232.9,"x1":258.2,"y1":591.3,"dur":571,"a0":344,"a1":8},{"t":5875.2,"x0":281.7,"y0":234.8,"x1":206.4,"y1":586.4,"dur":565,"a0":325,"a1":12},{"t":5908.9,"x0":281,"y0":243.8,"x1":176.4,"y1":585.9,"dur":558,"a0":15,"a1":-30},{"t":5905.7,"x0":281,"y0":243,"x1":229.2,"y1":584.7,"dur":557,"a0":318,"a1":-30},{"t":5953.2,"x0":279.1,"y0":255.6,"x1":220.9,"y1":585.4,"dur":548,"a0":261,"a1":-3},{"t":5961.7,"x0":279.1,"y0":257.9,"x1":179.9,"y1":584.6,"dur":545,"a0":302,"a1":3},{"t":5989.5,"x0":279.6,"y0":265.3,"x1":226.3,"y1":581.3,"dur":536,"a0":57,"a1":19},{"t":6000.2,"x0":279.6,"y0":268.1,"x1":231.1,"y1":583.3,"dur":535,"a0":360,"a1":-30},{"t":6012.2,"x0":279.6,"y0":271.3,"x1":197.9,"y1":582,"dur":531,"a0":354,"a1":-31},{"t":6051.1,"x0":276,"y0":281.7,"x1":252.8,"y1":585.9,"dur":526,"a0":239,"a1":-31},{"t":6057.8,"x0":276,"y0":283.5,"x1":172.9,"y1":587.4,"dur":526,"a0":132,"a1":-8},{"t":6075.2,"x0":276,"y0":288.1,"x1":192,"y1":583.7,"dur":518,"a0":288,"a1":-7},{"t":6119.2,"x0":274.7,"y0":299.9,"x1":238.2,"y1":581.5,"dur":506,"a0":276,"a1":-23},{"t":6137.6,"x0":274.7,"y0":304.8,"x1":252.4,"y1":587.4,"dur":507,"a0":346,"a1":26},{"t":6156,"x0":276.1,"y0":309.7,"x1":197.7,"y1":581.8,"dur":497,"a0":101,"a1":-22},{"t":6173.8,"x0":276.1,"y0":314.4,"x1":220.2,"y1":579.9,"dur":491,"a0":51,"a1":1},{"t":6203,"x0":270.4,"y0":322.2,"x1":191.3,"y1":579.2,"dur":483,"a0":170,"a1":-3},{"t":6225.9,"x0":270.4,"y0":328.3,"x1":181.6,"y1":582.1,"dur":480,"a0":142,"a1":-8},{"t":6228.9,"x0":270.4,"y0":329.1,"x1":168.8,"y1":586.2,"dur":483,"a0":42,"a1":34},{"t":6250,"x0":268.3,"y0":334.7,"x1":232.5,"y1":579.4,"dur":472,"a0":289,"a1":23},{"t":6279.8,"x0":268.3,"y0":342.7,"x1":169.9,"y1":584.9,"dur":469,"a0":240,"a1":-8},{"t":6310.1,"x0":267.5,"y0":350.7,"x1":235.5,"y1":579,"dur":455,"a0":244,"a1":16},{"t":6317.2,"x0":267.5,"y0":352.6,"x1":192,"y1":580.8,"dur":455,"a0":22,"a1":-5},{"t":6361.1,"x0":265.1,"y0":364.3,"x1":225.5,"y1":578.7,"dur":441,"a0":163,"a1":26},{"t":6375.9,"x0":265.1,"y0":368.3,"x1":231.8,"y1":580.8,"dur":440,"a0":270,"a1":-34},{"t":6398.7,"x0":265.1,"y0":374.4,"x1":183.6,"y1":579.7,"dur":432,"a0":234,"a1":34},{"t":6418.1,"x0":263.1,"y0":379.5,"x1":240.7,"y1":580.4,"dur":427,"a0":191,"a1":-30},{"t":6434.3,"x0":263.1,"y0":383.9,"x1":204.3,"y1":581.5,"dur":424,"a0":26,"a1":-1},{"t":6457.6,"x0":263.1,"y0":390.1,"x1":171.7,"y1":582.2,"dur":418,"a0":352,"a1":-19},{"t":6466.6,"x0":265.3,"y0":392.5,"x1":204.4,"y1":579.2,"dur":412,"a0":309,"a1":-8},{"t":6504.2,"x0":265.3,"y0":402.5,"x1":230.1,"y1":577.4,"dur":399,"a0":154,"a1":34},{"t":6503.8,"x0":265.3,"y0":402.4,"x1":234.9,"y1":576.5,"dur":398,"a0":142,"a1":-33},{"t":6530.9,"x0":262.8,"y0":409.6,"x1":168.4,"y1":582.3,"dur":396,"a0":39,"a1":-21},{"t":6574,"x0":257.1,"y0":421.1,"x1":164.3,"y1":584,"dur":385,"a0":341,"a1":13},{"t":6593.8,"x0":257.1,"y0":426.4,"x1":201,"y1":579.9,"dur":374,"a0":112,"a1":35},{"t":6609.7,"x0":257.1,"y0":430.6,"x1":193,"y1":578,"dur":366,"a0":113,"a1":18},{"t":6625.1,"x0":258.9,"y0":434.7,"x1":159.8,"y1":587.3,"dur":372,"a0":329,"a1":-9},{"t":6654.1,"x0":258.9,"y0":442.4,"x1":189.7,"y1":577.9,"dur":351,"a0":113,"a1":10},{"t":6658.6,"x0":258.9,"y0":443.6,"x1":214.8,"y1":577,"dur":348,"a0":189,"a1":-26},{"t":6679.4,"x0":257.4,"y0":449.2,"x1":220.3,"y1":574.5,"dur":338,"a0":83,"a1":15}],"cappello":{"dy":-70},"mucchio":{"cx":212,"base":604},"tempi":{"fette":[150,2750],"cade":360,"schiaccia":110,"cappello":[2780,3120],"griglia":[3080,3900],"fornello":300,"alone":[3200,4050],"giro":[3300,7200],"cottura":[3500,6400],"coltello":[5100,5450,6750,7050],"fine":7350,"passo":85.2}};
  var figuraS = document.getElementById('spiedo');
  var svgS = figuraS && figuraS.querySelector('.spiedo__svg');
  var qaS = function (sel) { return svgS ? [].slice.call(svgS.querySelectorAll(sel)) : []; };
  var q1S = function (sel) { return svgS ? svgS.querySelector(sel) : null; };
  var fetteG = qaS('.fetta'), fetteIn = qaS('.fetta__in'), cimeEl = qaS('.fetta__cima'), braceEl = qaS('.fetta__brace');
  var macchieEl = qaS('.fetta__macchie ellipse'), lembiEl = qaS('.carne-lembo');
  var cappelloS = q1S('#cappello'), aloneS = q1S('#alone'), acceseS = qaS('.piastra__accesa');
  var coltelloS = q1S('#coltello'), lamaS = q1S('#lama'), mucchioS = q1S('#mucchio');
  var ricciEl = qaS('.riccio');
  var rifaiS = document.getElementById('rifaiSpiedo');
  var TS = DATI.tempi, FETTE = DATI.fette, MAC = DATI.macchie, LEM = DATI.lembi, RIC = DATI.ricci, CXS = DATI.CX;
  /* lo stato finale scritto nell'HTML: si rimette com'era alla chiusura */
  var leggiA = function (el, nomi) { return nomi.map(function (n) { return el.getAttribute(n); }); };
  var macchieA = macchieEl.map(function (el) { return leggiA(el, ['cx', 'cy', 'rx', 'opacity']); });
  var lembiA = lembiEl.map(function (el) { return leggiA(el, ['cx', 'cy', 'rx']); });
  var ricciA = ricciEl.map(function (el) { return el.getAttribute('transform'); });
  var coltelloA = coltelloS ? coltelloS.getAttribute('transform') : '';
  var faseS = 'fatta', rafS = 0, guardiaS = 0, larghezzaAvvioS = 0, corseS = 0, ultimaPhi = null, ultimoCuoce = null;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var esce = function (t) { return 1 - Math.pow(1 - t, 3); };
  var dolce = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var r1 = function (n) { return Math.round(n * 10) / 10; };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var rgb = function (c) { return 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')'; };
  var mescola = function (a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; };
  /* il raggio del cono all'altezza y, interpolato fra le metà delle fette (il coltello segue il fianco senza scatti) */
  function raggioA(y) {
    var n = FETTE.length, m0 = (FETTE[0].yt + FETTE[0].yb) / 2, mN = (FETTE[n - 1].yt + FETTE[n - 1].yb) / 2;
    if (y >= m0) return FETTE[0].r;
    if (y <= mN) return FETTE[n - 1].r;
    for (var i = 0; i < n - 1; i++) {
      var a = (FETTE[i].yt + FETTE[i].yb) / 2, b = (FETTE[i + 1].yt + FETTE[i + 1].yb) / 2;
      if (y <= a && y >= b) return FETTE[i].r + (FETTE[i + 1].r - FETTE[i].r) * (a - y) / (a - b);
    }
    return FETTE[0].r;
  }
  var xColtello = function (y) { return CXS + raggioA(y) + DATI.LAMA - 6; };
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background) la pagina va allo stato finale;
     si riarma a ogni fotogramma (#229) */
  function sorvegliaS() { clearTimeout(guardiaS); guardiaS = setTimeout(chiudiSpiedo, 1500); }
  /* il colore della carne: dal rosa al bruno (le fette via color/currentColor, la cima, le venature via --vena) */
  function colora(k) {
    for (var i = 0; i < fetteIn.length; i++) fetteIn[i].style.color = rgb(mescola(FETTE[i].raw, FETTE[i].cotto, k));
    var cima = rgb(mescola(DATI.topRaw, DATI.topCotto, k));
    for (var j = 0; j < cimeEl.length; j++) cimeEl[j].style.fill = cima;
    svgS.style.setProperty('--vena', rgb(mescola([240, 205, 189], [221, 166, 108], k)));
  }
  /* lo spiedo girato di phi: le chiazze e i lembi sul cilindro (la stessa formula di _akg_firma.mjs) */
  function gira(phi, cuoce) {
    var i, c, th, F, ky, el;
    for (i = 0; i < MAC.length; i++) {
      var M = MAC[i];
      F = FETTE[M.f]; th = M.t0 + phi; c = Math.cos(th); el = macchieEl[i];
      if (c <= 0) { if (el.__v !== 0) { el.setAttribute('opacity', '0'); el.__v = 0; } continue; }
      ky = F.kt + (F.kb - F.kt) * (M.ys - F.yt) / (F.yb - F.yt);
      el.setAttribute('cx', r1(CXS + F.r * Math.sin(th)));
      el.setAttribute('cy', r1(M.ys + F.r * ky * c));
      el.setAttribute('rx', r1(Math.max(0.1, F.r * M.w * c / 2)));
      el.setAttribute('opacity', r3(M.o * Math.min(1, c / 0.3) * (M.tipo === 'crosta' ? cuoce : 1)));
      el.__v = 1;
    }
    for (i = 0; i < LEM.length; i++) {
      var L = LEM[i], s = Math.sin(L.t0 + phi);
      F = FETTE[L.f]; c = Math.cos(L.t0 + phi); el = lembiEl[i];
      ky = F.kt + (F.kb - F.kt) * (L.ys - F.yt) / (F.yb - F.yt);
      el.setAttribute('cx', r1(CXS + (F.r + L.e) * s));
      el.setAttribute('cy', r1(L.ys + F.r * ky * c));
      el.setAttribute('rx', r1(L.lx * Math.abs(c) + L.ly * Math.abs(s)));
    }
  }
  function chiudiSpiedo() {
    cancelAnimationFrame(rafS); rafS = 0;
    clearTimeout(guardiaS);
    fetteG.forEach(function (g) { g.style.removeProperty('opacity'); g.__st = undefined; });
    fetteIn.forEach(function (g) { g.removeAttribute('transform'); g.style.removeProperty('color'); });
    cimeEl.forEach(function (el) { el.style.removeProperty('fill'); });
    braceEl.forEach(function (el) { el.style.removeProperty('opacity'); });
    macchieEl.forEach(function (el, i) { ['cx', 'cy', 'rx', 'opacity'].forEach(function (n, j) { el.setAttribute(n, macchieA[i][j]); }); el.__v = undefined; });
    lembiEl.forEach(function (el, i) { ['cx', 'cy', 'rx'].forEach(function (n, j) { el.setAttribute(n, lembiA[i][j]); }); });
    if (svgS) svgS.style.removeProperty('--vena');
    if (cappelloS) { cappelloS.style.removeProperty('opacity'); cappelloS.removeAttribute('transform'); }
    acceseS.forEach(function (el) { el.style.removeProperty('opacity'); });
    if (aloneS) aloneS.style.removeProperty('opacity');
    if (coltelloS) { coltelloS.style.removeProperty('visibility'); coltelloS.setAttribute('transform', coltelloA); }
    if (lamaS) lamaS.removeAttribute('transform');
    ricciEl.forEach(function (el, i) { el.style.removeProperty('opacity'); el.setAttribute('transform', ricciA[i]); el.__st = undefined; });
    if (mucchioS) { mucchioS.style.removeProperty('opacity'); mucchioS.removeAttribute('transform'); }
    ultimaPhi = null; ultimoCuoce = null;
    if (figuraS) figuraS.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseS = 'fatta';
    if (rifaiS) rifaiS.disabled = false;
  }
  function fotogrammaS(t) {
    var i, k, g;
    /* a) le fette cadono una a una e si impilano (una piccola schiacciata quando toccano) */
    for (i = 0; i < FETTE.length; i++) {
      var F = FETTE[i], s0 = TS.fette[0] + i * TS.passo, p = (t - s0) / TS.cade, st;
      g = fetteG[i];
      st = p < 0 ? 'su' : p < 1 ? 'cade' : (t - s0 - TS.cade) < TS.schiaccia ? 'schiaccia' : 'giu';
      if (st === 'su') { if (g.__st !== 'su') { g.style.opacity = '0'; g.__st = 'su'; } continue; }
      if (g.__st === 'su' || g.__st === undefined) g.style.opacity = '1';
      if (st === 'cade') fetteIn[i].setAttribute('transform', 'translate(0 ' + r1(-(F.yb + 30) * (1 - p * p)) + ')');
      else if (st === 'schiaccia') {
        var sy = 1 - 0.1 * Math.sin(Math.PI * (t - s0 - TS.cade) / TS.schiaccia);
        fetteIn[i].setAttribute('transform', 'translate(0 ' + r1(F.yb * (1 - sy)) + ') scale(1 ' + r3(sy) + ')');
      } else if (g.__st !== 'giu') fetteIn[i].removeAttribute('transform');
      g.__st = st;
    }
    /* il cappello scende sull'ultima fetta */
    k = (t - TS.cappello[0]) / (TS.cappello[1] - TS.cappello[0]);
    if (k < 0) cappelloS.style.opacity = '0';
    else {
      cappelloS.style.opacity = '1';
      if (k < 1) cappelloS.setAttribute('transform', 'translate(0 ' + r1(DATI.cappello.dy * (1 - esce(k))) + ')');
      else cappelloS.removeAttribute('transform');
    }
    /* b) la griglia si accende fornello per fornello (uno sfarfallio che si spegne verso la fine), sale il bagliore */
    var tremolio = 1 - c01((t - (TS.fine - 700)) / 600);
    for (i = 0; i < acceseS.length; i++) {
      k = c01((t - (TS.griglia[0] + i * 160)) / TS.fornello);
      acceseS[i].style.opacity = r3(k * (1 - 0.1 * tremolio * (0.5 + 0.5 * Math.sin(t / 47 + i * 1.9))));
    }
    k = r3(dolce(c01((t - TS.alone[0]) / (TS.alone[1] - TS.alone[0]))));
    if (aloneS.__k !== k) { aloneS.style.opacity = k; braceEl.forEach(function (el) { el.style.opacity = k; }); aloneS.__k = k; }
    /* c) lo spiedo gira e si colora */
    var phi = DATI.PHI_FINE - DATI.GIRO * (1 - dolce(c01((t - TS.giro[0]) / (TS.giro[1] - TS.giro[0]))));
    var cuoce = r3(dolce(c01((t - TS.cottura[0]) / (TS.cottura[1] - TS.cottura[0]))));
    if (cuoce !== ultimoCuoce) colora(cuoce);
    if (phi !== ultimaPhi || cuoce !== ultimoCuoce) gira(phi, cuoce);
    ultimaPhi = phi; ultimoCuoce = cuoce;
    /* d) il coltello entra da destra, scende lungo il fianco, esce; la lama gira */
    var C = TS.coltello, x, y;
    if (t < C[0] || t >= C[3]) coltelloS.style.visibility = 'hidden';
    else {
      if (t < C[1]) { y = DATI.coltello.y0; x = xColtello(y) + DATI.coltello.fuori * (1 - esce(c01((t - C[0]) / (C[1] - C[0])))); }
      else if (t < C[2]) { y = DATI.coltello.y0 + (DATI.coltello.y1 - DATI.coltello.y0) * (t - C[1]) / (C[2] - C[1]); x = xColtello(y); }
      else { y = DATI.coltello.y1; k = c01((t - C[2]) / (C[3] - C[2])); x = xColtello(y) + DATI.coltello.fuori * k * k; }
      coltelloS.setAttribute('transform', 'translate(' + r1(x) + ' ' + r1(y) + ')');
      coltelloS.style.visibility = 'visible';
      lamaS.setAttribute('transform', 'rotate(' + Math.round((t * 1.1) % 360) + ')');
    }
    /* i riccioli cadono nella vaschetta (y cresce col quadrato del tempo: cadono); il mucchio cresce */
    for (i = 0; i < RIC.length; i++) {
      var R = RIC[i], tau = (t - R.t) / R.dur;
      g = ricciEl[i];
      if (tau < 0) { if (g.__st !== 0) { g.style.opacity = '0'; g.__st = 0; } continue; }
      if (tau < 1) {
        g.style.opacity = '1';
        g.setAttribute('transform', 'translate(' + r1(R.x0 + (R.x1 - R.x0) * tau) + ' ' + r1(R.y0 + (R.y1 - R.y0) * tau * tau) + ') rotate(' + Math.round(R.a0 + (R.a1 - R.a0) * tau) + ')');
        g.__st = 1;
      } else if (g.__st !== 2) { g.style.opacity = '1'; g.setAttribute('transform', ricciA[i]); g.__st = 2; }
    }
    k = c01((t - (C[1] + 250)) / (C[2] - C[1] + 250));
    if (k <= 0) mucchioS.style.opacity = '0';
    else {
      var sy2 = 0.15 + 0.85 * esce(k), sx2 = 0.55 + 0.45 * esce(k);
      mucchioS.style.opacity = '1';
      if (k < 1) mucchioS.setAttribute('transform', 'translate(' + r1(DATI.mucchio.cx * (1 - sx2)) + ' ' + r1(DATI.mucchio.base * (1 - sy2)) + ') scale(' + r3(sx2) + ' ' + r3(sy2) + ')');
      else mucchioS.removeAttribute('transform');
    }
  }
  function avviaSpiedo() {
    /* dalla classe d'attesa agli stili in linea senza cambiare un pixel: l'asta vuota, la griglia spenta */
    fetteG.forEach(function (g) { g.style.opacity = '0'; g.__st = 'su'; });
    cappelloS.style.opacity = '0';
    acceseS.forEach(function (el) { el.style.opacity = '0'; });
    aloneS.style.opacity = '0'; aloneS.__k = 0;
    braceEl.forEach(function (el) { el.style.opacity = '0'; });
    ricciEl.forEach(function (el) { el.style.opacity = '0'; el.__st = 0; });
    mucchioS.style.opacity = '0';
    ultimaPhi = null; ultimoCuoce = null;
    root.classList.remove('firma-attesa');
    faseS = 'corre'; figuraS.setAttribute('data-firma', 'corre');
    larghezzaAvvioS = window.innerWidth;
    if (rifaiS) rifaiS.disabled = true;
    var t0 = null, corsa = ++corseS;
    function fotogramma(ts) {
      rafS = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseS !== 'corre' || corsa !== corseS) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaS(t);
      if (t >= TS.fine) { chiudiSpiedo(); return; }
      sorvegliaS();
      rafS = requestAnimationFrame(fotogramma);
    }
    sorvegliaS();
    rafS = requestAnimationFrame(fotogramma);
  }
  function inVistaS() {
    if (!svgS) return false;
    var r = svgS.getBoundingClientRect(), vh = window.innerHeight || 800;
    return r.top < vh * 0.85 && r.bottom > vh * 0.2;
  }

  /* la striscia della testata segna la parte in cui ti trovi */
  var linkStriscia = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliStriscia = linkStriscia.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaStriscia() {
    var y = (document.getElementById('testata') || { offsetHeight: 70 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliStriscia.length; i++) { if (bersagliStriscia[i] && bersagliStriscia[i].getBoundingClientRect().top <= y) ora = i; }
    linkStriscia.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickStriscia = 0;
  window.addEventListener('scroll', function () {
    if (tickStriscia) return;
    tickStriscia = requestAnimationFrame(function () { tickStriscia = 0; aggiornaStriscia(); });
  }, { passive: true });
  aggiornaStriscia();

  /* lo stato degli orari anche nella sezione degli orari, col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  new MutationObserver(copiaStato).observe(root, { attributes: true, attributeFilter: ['lang'] });

  if (figuraS && svgS && fetteG.length === DATI.N && fetteIn.length === DATI.N && macchieEl.length === MAC.length && lembiEl.length === LEM.length && ricciEl.length === RIC.length && cappelloS && aloneS && acceseS.length && coltelloS && lamaS && mucchioS) {
    try { clearTimeout(window.__attesaSpiedo); } catch (e) {}
    window.__spiedo = {
      stato: function () { return { fase: faseS, corse: corseS }; },
      tempi: TS,
    };
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una parte (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaS();
    /* perché la firma è partita o no (lo legge il check) */
    window.__spiedo.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: svgS.getBoundingClientRect().top, vh: window.innerHeight };
    if (!daFare || ancora) chiudiSpiedo();
    else if (inVista) avviaSpiedo();
    else if ('IntersectionObserver' in window) {
      /* lo spiedo sotto la piega (telefoni bassi): parte quando entra in vista; fino ad allora è l'asta vuota */
      var ioS = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting; })) return;
        ioS.disconnect();
        if (faseS === 'fatta' && root.classList.contains('firma-attesa')) avviaSpiedo();
      }, { threshold: 0.3 });
      ioS.observe(svgS);
      window.__spiedo.avvio.aspetta = true;
    } else chiudiSpiedo();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () { if (faseS === 'corre' && Math.abs(window.innerWidth - larghezzaAvvioS) > 1) chiudiSpiedo(); });
    if (rifaiS) rifaiS.addEventListener('click', function () { if (faseS === 'fatta' && !reducedMotion) avviaSpiedo(); });
  }
})();
