/* Distribuidora Vicosa – lógica compartida (menú, pie, tienda, animaciones) */
(function () {
  var A = 'https://assets.cdn.filesafe.space/5FfDvLFuSRAD6OKIboJB/media/';
  var B = 'https://assets.cdn.filesafe.space/beCKtttBQrQ5750V4y3z/media/';
  var WA = 'https://wa.me/50255384158';
  var NAV = [['index.html', 'Inicio'], ['filmotherapy.html', 'Filmo Therapy'], ['lineasorali.html', 'Línea Sorali'],
    ['semipermanentes.html', 'Semipermanentes'], ['lineadeaparatos.html', 'Herramientas'], ['envios.html', 'Envíos']];
  var cur = location.pathname.split('/').pop() || 'index.html';

  /* ---------- CATÁLOGO: [nombre, detalle, precio Q (0 = consultar), imagen, agotado] ---------- */
  var DATA = {
    sorali: [
      { id: 'reconstruccion', t: 'Línea de reconstrucción', d: 'Para cabellos teñidos, decolorados, mechados y alisados.', i: [
        ['Shampoo Reconstructor', '500 mL', 310, '68d9bd63c791314b9f18e168.png'],
        ['Amino Reconstructor', '500 mL', 425, '68d9bd63a1d2dc9d17df569f.png'],
        ['Amino Keratin', '500 mL', 0, '68d9bd63a1d2dc9d17df569f.png'],
        ['Selaplex', '200 mL', 370, '690447d83469606c87631b24.png'],
        ['Shampoo', '300 mL', 225, '690447751e31ec4f0040773d.png'],
        ['Acondicionador', '300 mL', 220, '690447757bdc53c6a8a2ae28.png'],
        ['Reparador de puntas Sealplex', '30 mL', 225, '690446db1e31ec507c406927.png', 1]] },
      { id: 'nutricion', t: 'Línea para nutrición', d: 'Para todo tipo de cabello. Devuelve el brillo y la suavidad.', i: [
        ['Mascarilla Reparadora', '950 g', 0, '690446db34696016556305f5.png'],
        ['Shampoo Nutritivo', '1 L', 0, '690446db7bdc5367bba2a254.png'],
        ['Shampoo cabello seco', '300 mL', 225, '68d9bbf9c791311d5d18c3bd.png'],
        ['Acondicionador cabello seco', '300 mL', 185, '68d9bbf9337bbf7619534fc5.png'],
        ['Crema para peinar, hidratación 3D sin enjuague', '300 mL', 370, '68d9bbf94c35d61e4f991a55.png'],
        ['Thermic Gloss', '120 mL', 0, '690446dbab91c291156314ef.png']] },
      { id: 'hidratacion', t: 'Línea de hidratación', d: 'Repone el agua del cabello y le da brillo y suavidad.', i: [
        ['Just Sofistic', '500 g', 370, '68d9be71c79131b7ae190eb4.png'],
        ['Daily Therapy', '240 g', 255, '68d9be71337bbf69bd53919b.png']] },
      { id: 'post-alisado', t: 'Línea post alisado', d: 'Mantiene tu cabello liso y sano por más tiempo.', i: [
        ['Shampoo Hidratante', '300 mL', 250, '68d9c1ffc791319523198b23.png'],
        ['Amino Acondicionador', '300 mL', 300, '68d9c1ff373f4eea443fe07c.png'],
        ['Mascarilla Daily Therapy', '240 g', 255, '68d9be71337bbf69bd53919b.png']] },
      { id: 'pro-luminous', t: 'Línea Pro Luminous', d: 'Para cabellos rubios y canosos: ayuda a quitar el amarillo y el naranja sin manchar el cabello.', i: [
        ['Shampoo Matizador', '300 mL', 270, '68d9c482373f4e7e6e401b62.png'],
        ['Acondicionador Matizador', '300 mL', 255, '68d9c482337bbf8627548226.png'],
        ['Máscara Matizadora', '300 g', 310, '68d9c482a1d2dc62f7e049f1.png', 1]] },
      { id: 'detox', t: 'Línea Detox', d: 'Para la caída, el crecimiento y el fortalecimiento de tu cabello y tu rostro.', i: [
        ['Shampoo Detox', '300 mL', 281, '68d9c6f5337bbf6cb854d468.png', 1],
        ['Detox Equalizer', '300 mL', 351, '68d9c6f5a1d2dcd6cde0b10c.png'],
        ['Mascarilla Exfoliante', '200 g', 254, '68d9c6f5c79131696f1a210f.png'],
        ['Fluid Control', '60 mL', 422, '690446dbab91c2e9386314f0.png']] }
    ],
    semi: [
      { id: 'sorali', t: 'Semipermanentes Sorali', d: 'Orgánicos sin formol.', i: [
        ['Therapy Liss 4 en 1', '1 L · Alisa, hace tratamiento, bótox y relajamiento', 0, '68dd7612529d149791d14492.png'],
        ['Silver Therapy', '500 g · Semipermanente orgánico especial para rubias', 0, '69044e003469608f2d63a235.png'],
        ['Therapy Liss 4 en 1', '120 g · Alisa, hace tratamiento, bótox y relajamiento', 0, '69044e001e31ecdc6840fdb2.png']] },
      { id: 'hanna-lee', t: 'Semipermanentes Hanna Lee', d: 'Orgánicos sin formol.', i: [
        ['Ultimate Liss', '1 L · Alisa y nutre el cabello', 0, '68f069108065a62a57aaa999.jpeg'],
        ['Semipermanente orgánico 3 en 1', '250 g · Alisa, hace bótox y relaja colochos', 0, '69044e00ab91c2d37563b001.png'],
        ['Gotas Reparadoras', '120 g · Gotas Hanna Lee', 0, '69044e007bdc532fe1a33a29.png']] }
    ],
    aparatos: [
      { id: 'secadoras', t: 'Secadoras', d: 'Potencia y ligereza en una sola herramienta, ideal para salones exigentes.', i: [
        ['Fox iOn', 'Potencia: 2000W', 1100, '68c8a50c4f724e8513523e05.png'],
        ['Fox 3 Soft Green', 'Potencia: 2200W', 1400, '68c8a50c4404606b1488013e.png'],
        ['Fox 3 Soft Rose', 'Potencia: 2200W', 1400, '68c8a50cb74ab929d5fc2a0e.png'],
        ['Bulcan Digital', 'Potencia: 2500W', 1850, '68c8a50cc1b6ab40f8b36e23.png'],
        ['E-motion Digital', 'Potencia: 2500W', 1900, '68c8a50cc1b6ab4d9ab36e24.png'],
        ['Difusor Curves', 'Accesorio', 120, '68d999468b57d633e5c6551f.png']] },
      { id: 'planchas', t: 'Planchas', d: 'Placas de titanio para un deslizado perfecto.', i: [
        ['Vulcan Progress', 'Temp: 170 °C mín – 250 °C máx', 1400, '68c8a738d6040ac6f48bdd2a.png'],
        ['Titanium Progress', 'Temp: 170 °C mín – 250 °C máx', 1300, '68c8a738440460361f882eff.png']] },
      { id: 'rizadores', t: 'Rizadores', d: 'Ondas definidas y duraderas con la tecnología confiable que usan las expertas.', i: [
        ['Rizador Curves', 'Temp: 140 °C mín – 200 °C máx', 680, '68c8b42c0aed916c017450df.png'],
        ['Rizador Fox 3 Rose', 'Temp: 200 °C mín – 230 °C máx', 650, '68c8b42c06223a3a5f49df52.png']] },
      { id: 'cepillos', t: 'Cepillos eléctricos', d: 'Los mejores aparatos electrónicos para tu salón.', i: [
        ['Tourmaline 2 en 1', 'Potencia: 1200W', 750, '68d99dd84c35d600e5958b3b.png'],
        ['Easy Rose', 'Cepillo eléctrico', 530, '68c8b4c3f21b316f039c9b7c.png']] }
    ]
  };

  function src(v) { return /^https?:/.test(v) ? v : (v.indexOf('b:') === 0 ? B + v.slice(2) : A + v); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

  /* ---------- Header, pie, WhatsApp flotante, iconos ---------- */
  var hdr = document.getElementById('hdr');
  if (hdr) {
    hdr.innerHTML = '<div class="wrap nav"><a href="index.html"><img data-cms-img="global.logo" data-i="68b7815edd80039c1c254a3e.png" alt="Distribuidora Vicosa"></a>' +
      '<button class="burger" aria-label="Menú" aria-expanded="false" aria-controls="m"><span></span><span></span><span></span></button><ul id="m">' +
      NAV.map(function (n) { return '<li><a href="' + n[0] + '"' + (n[0] === cur ? ' class="on"' : '') + '>' + n[1] + '</a></li>'; }).join('') +
      '<li><a class="cta-n" href="' + WA + '" target="_blank" rel="noopener">Contacto</a></li></ul></div><div class="prog" aria-hidden="true"></div>';
  }
  var ftr = document.getElementById('ftr');
  if (ftr) {
    ftr.innerHTML = '<div class="wrap"><img data-cms-img="global.logo" data-i="68b7815edd80039c1c254a3e.png" alt="Vicosa"><p class="ft" data-cms="global.footer_tagline">Únicos distribuidores e importadores en Guatemala · Importado de Brasil</p>' +
      '<nav class="fn">' + NAV.map(function (n) { return '<a href="' + n[0] + '">' + n[1] + '</a>'; }).join('') + '<a href="' + WA + '" target="_blank" rel="noopener">WhatsApp</a></nav>' +
      '<small data-cms="global.footer_copy">© Copyright 2026 Distribuidora Vicosa. Todos los derechos reservados.</small></div>';
  }
  document.body.insertAdjacentHTML('beforeend',
    '<a class="fab" href="' + WA + '" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11 19.900L3 29l6.300-2A13 13 0 1 0 16 3zm0 23.600a10.600 10.600 0 0 1-5.400-1.500l-.4-.2-3.700 1.200 1.200-3.600-.3-.4A10.600 10.600 0 1 1 16 26.600zm5.800-7.900c-.3-.2-1.900-.9-2.200-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7.100a8.700 8.700 0 0 1-4.300-3.800c-.3-.6.300-.5.800-1.600.1-.2 0-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6a1.200 1.200 0 0 0-.9.400 3.700 3.700 0 0 0-1.100 2.700 6.400 6.400 0 0 0 1.300 3.400c.2.200 2.400 3.700 5.800 5.100 2.100.9 2.900.9 3.900.8a3.300 3.300 0 0 0 2.200-1.600 2.700 2.700 0 0 0 .2-1.600c-.1-.1-.3-.2-.6-.4z"/></svg></a>' +
    '<svg width="0" height="0" style="position:absolute"><defs>' +
    '<symbol id="i1" viewBox="0 0 32 32"><rect x="5" y="7" width="22" height="19" rx="3"/><path d="M11 4v5M21 4v5M10 15h12M10 20h8"/></symbol>' +
    '<symbol id="i2" viewBox="0 0 32 32"><path d="M16 5 4 11l12 6 12-6zM4 17l12 6 12-6M4 22l12 6 12-6"/></symbol>' +
    '<symbol id="i3" viewBox="0 0 32 32"><rect x="4" y="4" width="14" height="14" rx="3"/><path d="M14 22v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3h-3M10 11l3 3 4-5"/></symbol>' +
    '</defs></svg>');

  /* ---------- Imágenes y animaciones ---------- */
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  function eh(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  var io = window.IntersectionObserver ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }) : null;

  /* fotos visibles (para el parallax suave) */
  var vis = [];
  var pio = window.IntersectionObserver ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var i = vis.indexOf(e.target);
      if (e.isIntersecting && i < 0) vis.push(e.target);
      if (!e.isIntersecting && i > -1) vis.splice(i, 1);
    });
  }, { rootMargin: '10% 0px' }) : null;

  function setK(list) { [].forEach.call(list, function (el, i) { if (!el.style.getPropertyValue('--k')) el.style.setProperty('--k', i); }); }

  /* prepara escalonados, direcciones y titulares por palabras */
  function prep() {
    /* titulares del hero: cada palabra sube desde una máscara */
    [].forEach.call(document.querySelectorAll('.hero h1,.hero h2,.phero h1'), function (el) {
      if (el.dataset.sp) return; el.dataset.sp = 1;
      var par = el.parentElement, n = par._n || 0, txt = el.textContent.trim();
      el.setAttribute('aria-label', txt);
      el.innerHTML = txt.split(/\s+/).map(function (w) {
        return '<span class="w" aria-hidden="true"><span style="--k:' + (n++) + '">' + eh(w) + '</span></span>';
      }).join(' ');
      par._n = n;
    });
    /* columna de texto del hero: entra en cascada */
    [].forEach.call(document.querySelectorAll('.hero .txt,.phero .g2>div:first-child'), function (c) { setK(c.children); });
    [].forEach.call(document.querySelectorAll('.ticks'), function (u) { setK(u.children); });
    [].forEach.call(document.querySelectorAll('.nav ul'), function (u) { setK(u.children); });
    /* ítems dentro de bloques */
    [].forEach.call(document.querySelectorAll('.rv'), function (b) { setK(b.querySelectorAll('.li')); setK(b.querySelectorAll('.tl>div')); });
    /* rejillas: cada tarjeta entra con un pequeño retraso */
    [].forEach.call(document.querySelectorAll('.cards,.why,.feats,.steps3'), function (g) {
      [].forEach.call(g.children, function (c, i) { if (!c.style.getPropertyValue('--d')) c.style.setProperty('--d', (Math.min(i, 5) * 0.09) + 's'); });
    });
    [].forEach.call(document.querySelectorAll('.pg'), function (g) {
      [].forEach.call(g.children, function (c, i) { if (!c.style.getPropertyValue('--d')) c.style.setProperty('--d', ((i % 4) * 0.08) + 's'); });
    });
    /* filas de dos columnas: foto y texto entran desde lados opuestos */
    [].forEach.call(document.querySelectorAll('.row,.g2'), function (r) {
      var rev = r.classList.contains('rev');
      [].forEach.call(r.children, function (c, i) {
        if (!c.classList.contains('rv') || c.dataset.r) return;
        c.setAttribute('data-r', ((i === 0) !== rev) ? 'l' : 'r');
      });
    });
  }

  function init() {
    prep();
    [].forEach.call(document.querySelectorAll('img[data-i]'), function (i) {
      if (i.getAttribute('src')) return;
      var pi = i.closest('.pi'); if (pi) pi.classList.add('sk');
      i.onload = function () { i.classList.add('ld'); if (pi) pi.classList.remove('sk'); };
      i.onerror = function () { i.style.display = 'none'; if (pi) pi.classList.remove('sk'); };
      i.src = src(i.dataset.i);
      if (i.complete && i.naturalWidth) i.onload();
    });
    [].forEach.call(document.querySelectorAll('.rv:not(.in)'), function (el) { if (io) io.observe(el); else el.classList.add('in'); });
    if (pio && !reduce) [].forEach.call(document.querySelectorAll('.photo img:not([data-px])'), function (im) { im.dataset.px = 1; pio.observe(im); });
  }

  /* ---------- Scroll: barra de progreso, header y parallax ---------- */
  var prog = document.querySelector('.prog'), ticking = false;
  function update() {
    ticking = false;
    var y = window.pageYOffset || 0, h = root.scrollHeight - window.innerHeight;
    root.classList.toggle('is-scrolled', y > 40);
    if (prog) prog.style.setProperty('--pg', h > 0 ? Math.min(1, y / h).toFixed(4) : 0);
    if (reduce) return;
    var hp = document.querySelector('.hero .pic');
    if (hp && y < 900) hp.style.translate = '0 ' + (Math.min(y, 700) * 0.07).toFixed(1) + 'px';
    var vh = window.innerHeight;
    vis.forEach(function (im) {
      var r = im.parentElement.getBoundingClientRect();
      var d = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - vh / 2) / vh));
      im.style.translate = '0 ' + (d * -2.5).toFixed(2) + '%';
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------- Menú móvil ---------- */
  var burger = document.querySelector('.burger'), menu = document.getElementById('m');
  function toggleMenu(open) {
    if (!burger || !menu) return;
    var o = typeof open === 'boolean' ? open : !menu.classList.contains('open');
    menu.classList.toggle('open', o); burger.classList.toggle('open', o); burger.setAttribute('aria-expanded', o);
  }
  if (burger) {
    burger.addEventListener('click', function () { toggleMenu(); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) toggleMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });
  }

  /* ---------- Interacción con el cursor (solo con mouse) ---------- */
  if (fine && !reduce) {
    document.addEventListener('pointermove', function (e) {
      var t = e.target.closest && e.target.closest('.sc,.fc,.wc,.tl>div');
      if (!t) return;
      var r = t.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      t.style.setProperty('--mx', x + 'px'); t.style.setProperty('--my', y + 'px');
      if (t.classList.contains('sc')) {
        t.style.setProperty('--ry', ((x / r.width - 0.5) * 10).toFixed(2) + 'deg');
        t.style.setProperty('--rx', ((0.5 - y / r.height) * 8).toFixed(2) + 'deg');
      }
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var t = e.target.closest && e.target.closest('.sc');
      if (t && !t.contains(e.relatedTarget)) { t.style.removeProperty('--rx'); t.style.removeProperty('--ry'); }
    });
    /* botones principales con leve efecto magnético */
    [].forEach.call(document.querySelectorAll('.hero .btn,.cta .btn,.band .btn'), function (b) {
      var base = null;
      b.addEventListener('pointerenter', function () { b.style.translate = ''; base = b.getBoundingClientRect(); });
      b.addEventListener('pointermove', function (e) {
        if (!base) return;
        b.style.translate = ((e.clientX - base.left - base.width / 2) * 0.22).toFixed(1) + 'px ' + ((e.clientY - base.top - base.height / 2) * 0.32).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = ''; base = null; });
    });
  }

  /* ---------- Transición suave entre páginas ---------- */
  if (!reduce) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      var h = a.getAttribute('href');
      if (!h || h.charAt(0) === '#' || /^(mailto:|tel:)/i.test(h) || a.origin !== location.origin || a.pathname === location.pathname) return;
      e.preventDefault(); root.classList.add('leaving');
      setTimeout(function () { location.href = a.href; }, 260);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) root.classList.remove('leaving'); });
  }

  /* ====================== SUPABASE, TIENDA Y CARRITO ====================== */
  var CFG = window.VICOSA_CONFIG || {};
  var sb = (CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase) ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;
  var S = { wa_number: '50255384158', shipping_fee: '0', free_shipping_min: '0', pay_info: '', store_open: 'true', banner: '' };
  var ST = { nuevo: 'Nuevo', confirmado: 'Confirmado', preparando: 'Preparando', enviado: 'Enviado', entregado: 'Entregado', cancelado: 'Cancelado' };
  function money(n) { n = Number(n) || 0; return 'Q' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); }
  function slug(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function digits() { return String(S.wa_number).replace(/\D/g, ''); }

  function applyWA() {
    WA = 'https://wa.me/' + digits();
    [].forEach.call(document.querySelectorAll('a[href*="wa.me/"]'), function (a) { a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + digits()); });
  }
  function applyBanner() {
    var b = document.getElementById('ann');
    if (!S.banner) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement('div'); b.id = 'ann'; b.className = 'ann'; document.body.insertBefore(b, document.body.firstChild); }
    b.textContent = S.banner;
  }
  /* ---------- Contenido editable desde el panel (textos, imágenes, secciones) ---------- */
  var CMS = {}; try { CMS = JSON.parse(localStorage.getItem('vicosa_cms') || '{}'); } catch (e) { CMS = {}; }
  function applyCMS() {
    var resplit = false;
    [].forEach.call(document.querySelectorAll('[data-cms]'), function (el) {
      if (el.dataset.d0 === undefined) el.dataset.d0 = el.textContent;
      var v = CMS[el.dataset.cms]; if (v === undefined || v === '') v = el.dataset.d0;
      if (el.textContent !== v) {
        el.textContent = v;
        if (el.dataset.sp) { delete el.dataset.sp; el.parentElement._n = 0; resplit = true; }
      }
    });
    [].forEach.call(document.querySelectorAll('[data-cms-img]'), function (im) {
      if (im.dataset.d0 === undefined) im.dataset.d0 = im.dataset.i;
      var v = CMS[im.dataset.cmsImg] || im.dataset.d0;
      if (im.dataset.i !== v) { im.dataset.i = v; if (im.getAttribute('src')) im.src = src(v); }
    });
    [].forEach.call(document.querySelectorAll('[data-sec]'), function (s) { s.classList.toggle('is-off', CMS['hide:' + s.dataset.sec] === '1'); });
    if (resplit) prep();
  }
  applyCMS();
  function loadSettings() {
    if (!sb) return Promise.resolve();
    return Promise.all([Promise.resolve(sb.from('settings').select('key,value')), Promise.resolve(sb.from('site_content').select('key,value'))]).then(function (r) {
      (r[0].data || []).forEach(function (x) { S[x.key] = x.value; });
      if (!r[1].error && r[1].data) {
        var m = {}; r[1].data.forEach(function (x) { m[x.key] = x.value; });
        CMS = m; try { localStorage.setItem('vicosa_cms', JSON.stringify(m)); } catch (e) {}
        applyCMS();
      }
      applyWA(); applyBanner(); cartUI();
    });
  }
  var SP = loadSettings();

  /* ---------- Catálogo: p = {id, n, d, p, img, so} ---------- */
  function staticCat(k) {
    return DATA[k].map(function (c) {
      return { id: c.id, t: c.t, d: c.d, i: c.i.map(function (p) {
        return { id: slug(p[0] + ' ' + String(p[1]).split(' · ')[0]), n: p[0], d: p[1], p: p[2], img: p[3], so: !!p[4] };
      }) };
    });
  }
  function dbCat(k) {
    return Promise.all([
      sb.from('categories').select('*').eq('section', k).eq('active', true).order('sort'),
      sb.from('products').select('*').eq('section', k).eq('active', true).order('sort').order('name')
    ]).then(function (r) {
      if (r[0].error || r[1].error) throw (r[0].error || r[1].error);
      var P = r[1].data || [];
      return (r[0].data || []).map(function (c) {
        return { id: c.id, t: c.title, d: c.description || '', i: P.filter(function (p) { return p.category_id === c.id; }).map(function (p) {
          return { id: p.id, n: p.name, d: p.detail || '', p: Number(p.price), img: p.image_url, so: p.sold_out || (p.stock !== null && p.stock <= 0) };
        }) };
      }).filter(function (c) { return c.i.length; });
    });
  }

  /* ---------- Tienda ---------- */
  var curK = null, PM = {}, state = { c: 'all', q: '' };
  function waLink(p) {
    var sz = String(p.d).split(' · ')[0];
    var name = p.n + (/^\d+([.,]\d+)?\s?(mL|L|g|kg)$/i.test(sz) ? ' ' + sz : '');
    var msg = p.so ? 'Hola, vi en su página web el producto ' + name + ' y quisiera consultar su disponibilidad.'
      : 'Hola, vi en su página web el producto ' + name + ' y me interesa. ¿Me pueden dar más información?';
    return WA + '?text=' + encodeURIComponent(msg);
  }
  function card(p) {
    var can = p.p > 0 && !p.so && S.store_open !== 'false';
    return '<article class="pc rv' + (p.so ? ' so' : '') + '" data-t="' + esc((p.n + ' ' + p.d).toLowerCase()) + '">' +
      '<div class="pi">' + (p.img ? '<img data-i="' + esc(p.img) + '" alt="' + esc(p.n) + '" loading="lazy">' : '') + (p.so ? '<span class="sold">Agotado</span>' : '') + '</div>' +
      '<h3>' + eh(p.n) + '</h3><p class="ps">' + eh(p.d) + '</p><div class="pp">' + (p.p ? money(p.p) : '<small>Consultar precio</small>') + '</div>' +
      (can ? '<button class="btn sm add" data-id="' + esc(p.id) + '">Agregar al carrito</button><a class="pw" href="' + esc(waLink(p)) + '" target="_blank" rel="noopener">Preguntar por WhatsApp</a>'
        : '<a class="btn sm o" href="' + esc(waLink(p)) + '" target="_blank" rel="noopener">' + (p.so ? 'Consultar disponibilidad' : 'Consultar') + '</a>') + '</article>';
  }
  function filter(replay) {
    var c = document.querySelector('.chip.on').dataset.c, q = document.getElementById('q').value.toLowerCase().trim(), total = 0, shown = 0;
    document.querySelectorAll('.cat').forEach(function (s) {
      var n = 0;
      s.querySelectorAll('.pc').forEach(function (p) {
        var ok = (c === 'all' || s.dataset.c === c) && (!q || p.dataset.t.indexOf(q) > -1);
        p.style.display = ok ? '' : 'none'; if (ok) n++;
        if (ok && replay === true && p.classList.contains('in')) {
          p.classList.remove('pop'); void p.offsetWidth;
          p.style.setProperty('--d', (Math.min(shown, 8) * 0.045) + 's'); p.classList.add('pop');
        }
        if (ok) shown++;
      });
      s.style.display = n ? '' : 'none'; total += n;
    });
    document.getElementById('none').style.display = total ? 'none' : 'block';
  }
  function draw(D, quiet) {
    var el = document.getElementById('store'); PM = {};
    D.forEach(function (c) { c.i.forEach(function (p) { PM[p.id] = p; }); });
    var h = '<div class="bar"><div class="chips"><button class="chip" data-c="all">Todo</button>' +
      D.map(function (c) { return '<button class="chip" data-c="' + esc(c.id) + '">' + eh(c.t.replace(/^Línea (de |para )?/, '')) + '</button>'; }).join('') +
      '</div><input id="q" type="search" placeholder="Buscar producto…" aria-label="Buscar producto"></div>';
    D.forEach(function (c) {
      h += '<section class="cat" data-c="' + esc(c.id) + '"><div class="wrap"><h2>' + eh(c.t) + '</h2><p class="cd">' + eh(c.d) + '</p><div class="pg">' + c.i.map(card).join('') + '</div></div></section>';
    });
    h += '<div id="none" class="wrap empty" style="display:none">No encontramos productos con esa búsqueda. <a href="' + WA + '" target="_blank" rel="noopener">Pregúntale a una asesora</a>.</div>';
    el.innerHTML = h; el.classList.toggle('nofx', !!quiet);
    (el.querySelector('.chip[data-c="' + state.c + '"]') || el.querySelector('.chip')).classList.add('on');
    var q = document.getElementById('q'); q.value = state.q;
    el.querySelectorAll('.chip').forEach(function (b) {
      b.onclick = function () {
        el.querySelector('.chip.on').classList.remove('on'); b.classList.add('on'); state.c = b.dataset.c; filter(true);
        window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
      };
    });
    q.oninput = function () { state.q = q.value; filter(false); };
    filter(false);
    if (quiet) el.querySelectorAll('.rv').forEach(function (n) { n.classList.add('in'); });
    init();
  }
  window.store = function (k) {
    curK = k;
    var cat = sb ? dbCat(k).catch(function () { return staticCat(k); }) : Promise.resolve(staticCat(k));
    Promise.all([SP, cat]).then(function (r) { draw(r[1], false); });
  };

  /* ---------- Tiempo real: cualquier cambio del panel se refleja al instante ---------- */
  if (sb) {
    var rt;
    var re = function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        loadSettings().then(function () { return curK ? dbCat(curK) : null; }).then(function (D) { if (D) draw(D, true); }).catch(function () {});
      }, 400);
    };
    var ch = sb.channel('vicosa-live');
    ['products', 'categories', 'settings', 'site_content'].forEach(function (t) { ch.on('postgres_changes', { event: '*', schema: 'public', table: t }, re); });
    ch.subscribe();
  }

  /* ---------- Carrito ---------- */
  var cart = {}; try { cart = JSON.parse(localStorage.getItem('vicosa_cart') || '{}'); } catch (e) { cart = {}; }
  var user = null, profile = null, lastOrder = null, V = 'cart', dr, cb;
  function saveCart() { try { localStorage.setItem('vicosa_cart', JSON.stringify(cart)); } catch (e) {} cartUI(); }
  function count() { return Object.keys(cart).reduce(function (a, k) { return a + cart[k].q; }, 0); }
  function totals() {
    var sub = 0; Object.keys(cart).forEach(function (k) { sub += cart[k].p * cart[k].q; });
    var fee = Number(S.shipping_fee) || 0, min = Number(S.free_shipping_min) || 0;
    var ship = (!sub || (min > 0 && sub >= min)) ? 0 : fee;
    return { sub: sub, ship: ship, total: sub + ship };
  }
  function sumHtml(t) {
    var fee = Number(S.shipping_fee) || 0;
    return '<div class="sm">' + (fee > 0 ? '<div><span>Subtotal</span><span>' + money(t.sub) + '</span></div><div><span>Envío</span><span>' + (t.ship ? money(t.ship) : 'Gratis') + '</span></div>' : '') +
      '<div class="tt"><span>Total</span><span>' + money(t.total) + '</span></div></div>';
  }
  function cartUI() {
    if (!cb) return;
    var n = count(); document.getElementById('cn').textContent = n;
    cb.hidden = !(n || document.getElementById('store'));
    if (dr.classList.contains('on') && V === 'cart') paint();
  }
  function addToCart(p) {
    var c = cart[p.id] || (cart[p.id] = { n: p.n, d: p.d, p: p.p, img: p.img, q: 0 });
    c.q = Math.min(99, c.q + 1); c.p = p.p; saveCart();
    cb.classList.remove('bump'); void cb.offsetWidth; cb.classList.add('bump');
  }
  function syncCart() {
    var ks = Object.keys(cart); if (!sb || !ks.length) return Promise.resolve();
    ks.forEach(function (k) { if (!/^[0-9a-f-]{36}$/.test(k)) delete cart[k]; });
    return Promise.resolve(sb.from('products').select('id,price,sold_out,stock').in('id', Object.keys(cart))).then(function (r) {
      var m = {}; (r.data || []).forEach(function (x) { m[x.id] = x; });
      Object.keys(cart).forEach(function (k) {
        var x = m[k];
        if (!x || x.sold_out || (x.stock !== null && x.stock <= 0) || !(Number(x.price) > 0)) delete cart[k];
        else { cart[k].p = Number(x.price); if (x.stock !== null) cart[k].q = Math.min(cart[k].q, x.stock); }
      });
      saveCart();
    });
  }
  function openDr(v) { V = v || 'cart'; dr.classList.add('on'); document.body.classList.add('lock'); paint(); if (V === 'cart') syncCart(); }
  function closeDr() { dr.classList.remove('on'); document.body.classList.remove('lock'); }

  function vCart() {
    var ks = Object.keys(cart);
    if (!ks.length) return '<div class="em"><p>Tu carrito está vacío.</p><button class="btn sm" data-a="close">Seguir comprando</button></div>';
    return '<ul class="ci">' + ks.map(function (k) {
      var c = cart[k], e = esc(k);
      return '<li><div class="cim">' + (c.img ? '<img src="' + esc(src(c.img)) + '" alt="">' : '') + '</div><div class="cit"><b>' + eh(c.n) + '</b><small>' + eh(String(c.d).split(' · ')[0]) + '</small><span>' + money(c.p) + '</span></div>' +
        '<div class="cq"><button data-a="dec" data-k="' + e + '" aria-label="Quitar uno">−</button><em>' + c.q + '</em><button data-a="inc" data-k="' + e + '" aria-label="Agregar uno">+</button></div>' +
        '<button class="rm" data-a="rm" data-k="' + e + '" aria-label="Eliminar">×</button></li>';
    }).join('') + '</ul>' + sumHtml(totals()) +
      (S.store_open === 'false' ? '<p class="warn">La tienda está en pausa en este momento. Escríbenos por WhatsApp.</p>' : '<button class="btn" data-a="checkout">Finalizar pedido</button>');
  }
  function vCheckout() {
    var u = profile || {};
    return '<form id="cf" class="cfm"><label>Nombre completo<input name="name" required value="' + esc(u.name || '') + '"></label>' +
      '<label>Teléfono / WhatsApp<input name="phone" type="tel" required value="' + esc(u.phone || '') + '"></label>' +
      '<label>Correo (opcional)<input name="email" type="email" value="' + esc((user && user.email) || '') + '"></label>' +
      '<label>Dirección de entrega<textarea name="address" rows="2" required>' + esc(u.address || '') + '</textarea></label>' +
      '<label>Notas (opcional)<textarea name="notes" rows="2"></textarea></label>' +
      (S.pay_info ? '<div class="pay"><b>Forma de pago</b><p>' + eh(S.pay_info).replace(/\n/g, '<br>') + '</p></div>' : '') +
      sumHtml(totals()) + '<p id="ce" class="err"></p><button class="btn" type="submit">Confirmar pedido</button>' +
      '<button type="button" class="lk" data-a="cart">← Volver al carrito</button></form>';
  }
  function orderMsg(L) {
    var lines = ['Hola, hice un pedido en la página web.'];
    if (L.o) lines.push('Pedido #' + L.o.number);
    lines.push('Nombre: ' + L.cust.name, 'Teléfono: ' + L.cust.phone, 'Dirección: ' + L.cust.address, '');
    L.items.forEach(function (c) { lines.push('• ' + c.q + ' x ' + c.n + ' (' + String(c.d).split(' · ')[0] + ') — ' + money(c.p * c.q)); });
    lines.push('', 'Total: ' + money(L.t.total));
    if (L.cust.notes) lines.push('Notas: ' + L.cust.notes);
    return lines.join('\n');
  }
  function vDone() {
    var L = lastOrder;
    return '<div class="ok"><div class="okc">✓</div><h3>¡Pedido recibido!</h3>' + (L.o ? '<p>Tu número de pedido es <b>#' + L.o.number + '</b>.</p>' : '') +
      '<p>Para agilizar la confirmación, envía el detalle a nuestra asesora por WhatsApp.</p>' +
      '<a class="btn" target="_blank" rel="noopener" href="' + esc(WA + '?text=' + encodeURIComponent(orderMsg(L))) + '">Enviar pedido por WhatsApp</a>' +
      (user ? '<button class="lk" data-a="account">Ver mis pedidos</button>' : '') + '<button class="lk" data-a="close">Seguir comprando</button></div>';
  }
  function vAuth(reg) {
    return '<form id="af" class="cfm" data-reg="' + (reg ? 1 : 0) + '">' +
      (reg ? '<label>Nombre<input name="name" required></label><label>Teléfono<input name="phone" type="tel"></label>' : '') +
      '<label>Correo<input name="email" type="email" required></label><label>Contraseña<input name="pass" type="password" minlength="6" required></label>' +
      '<p id="ae" class="err"></p><button class="btn" type="submit">' + (reg ? 'Crear cuenta' : 'Ingresar') + '</button>' +
      '<button type="button" class="lk" data-a="' + (reg ? 'login' : 'register') + '">' + (reg ? 'Ya tengo cuenta' : 'Crear una cuenta') + '</button></form>';
  }
  function vAccount() {
    return '<div class="acct"><p>Hola, <b>' + eh((profile && profile.name) || (user && user.email) || '') + '</b></p><button class="lk" data-a="logout">Cerrar sesión</button></div><h4>Mis pedidos</h4><div id="ol">Cargando…</div>';
  }
  function loadOrders() {
    Promise.resolve(sb.from('orders').select('number,status,total,created_at,items').order('created_at', { ascending: false })).then(function (r) {
      var b = document.getElementById('ol'); if (!b) return;
      var D = r.data || [];
      b.innerHTML = D.length ? D.map(function (o) {
        return '<div class="od"><div><b>Pedido #' + o.number + '</b><small>' + new Date(o.created_at).toLocaleDateString('es-GT') + '</small></div><span class="st st-' + o.status + '">' + ST[o.status] + '</span><div class="odi">' +
          (o.items || []).map(function (i) { return i.q + ' x ' + eh(i.name); }).join('<br>') + '</div><b>' + money(o.total) + '</b></div>';
      }).join('') : '<p class="em">Aún no tienes pedidos.</p>';
    });
  }
  function paint() {
    var T = { cart: ['Tu carrito', vCart], checkout: ['Finalizar pedido', vCheckout], done: ['Pedido enviado', vDone], login: ['Ingresar', function () { return vAuth(false); }],
      register: ['Crear cuenta', function () { return vAuth(true); }], account: ['Mi cuenta', vAccount] }[V];
    document.getElementById('dt').textContent = T[0]; document.getElementById('db').innerHTML = T[1]();
    if (V === 'account') loadOrders();
  }
  function setUser(s) {
    user = s ? s.user : null; profile = null; accUI();
    if (user) Promise.resolve(sb.from('profiles').select('*').eq('id', user.id).maybeSingle()).then(function (r) { profile = r.data; accUI(); });
  }
  function accUI() {
    var a = document.getElementById('acc');
    if (a) a.textContent = user ? 'Hola, ' + (((profile && profile.name) || user.email || '').split(' ')[0].split('@')[0]) : 'Mi cuenta';
  }
  function submitOrder(f) {
    var d = new FormData(f), btn = f.querySelector('[type=submit]'), er = document.getElementById('ce');
    var cust = { name: d.get('name').trim(), phone: d.get('phone').trim(), email: String(d.get('email') || '').trim(), address: d.get('address').trim(), notes: String(d.get('notes') || '').trim() };
    var items = Object.keys(cart).map(function (k) { return { id: k, q: cart[k].q }; });
    btn.disabled = true; btn.textContent = 'Enviando…'; er.textContent = '';
    var go = sb ? Promise.resolve(sb.rpc('create_order', { p_name: cust.name, p_phone: cust.phone, p_email: cust.email, p_address: cust.address, p_notes: cust.notes, p_items: items }))
      .then(function (r) { if (r.error) throw r.error; return r.data; }) : Promise.resolve(null);
    go.then(function (o) {
      var snap = Object.keys(cart).map(function (k) { return cart[k]; });
      lastOrder = { o: o, cust: cust, items: snap, t: o ? { total: Number(o.total) } : totals() };
      if (sb && user) sb.from('profiles').update({ name: cust.name, phone: cust.phone, address: cust.address }).eq('id', user.id).then(function () {});
      cart = {}; saveCart(); V = 'done'; paint();
    }).catch(function (e) { er.textContent = (e && e.message) || 'No se pudo crear el pedido. Intenta de nuevo.'; btn.disabled = false; btn.textContent = 'Confirmar pedido'; });
  }
  function submitAuth(f) {
    var d = new FormData(f), reg = f.dataset.reg === '1', er = document.getElementById('ae'), btn = f.querySelector('[type=submit]');
    btn.disabled = true; er.textContent = '';
    var p = reg ? sb.auth.signUp({ email: d.get('email'), password: d.get('pass'), options: { data: { name: d.get('name'), phone: d.get('phone') } } })
      : sb.auth.signInWithPassword({ email: d.get('email'), password: d.get('pass') });
    Promise.resolve(p).then(function (r) {
      if (r.error) throw r.error;
      if (reg && !r.data.session) { er.className = 'ok2'; er.textContent = 'Cuenta creada. Revisa tu correo para confirmarla y luego ingresa.'; btn.disabled = false; return; }
      V = Object.keys(cart).length && lastOrder === null ? 'cart' : 'account'; paint();
    }).catch(function (e) { er.className = 'err'; er.textContent = (e && e.message) || 'No se pudo completar'; btn.disabled = false; });
  }
  function buildCartUI() {
    var w = document.createElement('div');
    w.innerHTML = '<button id="cb" class="cb" aria-label="Ver carrito" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.5L22 7H6"/></svg><span id="cn">0</span></button>' +
      '<div id="dr" class="dr"><div class="dv" data-a="close"></div><aside class="dp" role="dialog" aria-label="Carrito"><div class="dh"><h3 id="dt">Tu carrito</h3><button class="dx" data-a="close" aria-label="Cerrar">×</button></div><div id="db" class="db"></div></aside></div>';
    while (w.firstChild) document.body.appendChild(w.firstChild);
    cb = document.getElementById('cb'); dr = document.getElementById('dr');
    cb.onclick = function () { openDr('cart'); };
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDr(); });
    document.addEventListener('click', function (e) {
      var add = e.target.closest && e.target.closest('.add');
      if (add && PM[add.dataset.id]) { addToCart(PM[add.dataset.id]); add.textContent = 'Agregado ✓'; setTimeout(function () { add.textContent = 'Agregar al carrito'; }, 1100); return; }
      var a = e.target.closest && e.target.closest('[data-a]'); if (!a) return;
      var k = a.dataset.k, act = a.dataset.a;
      if (act === 'close') closeDr();
      else if (act === 'inc' && cart[k]) { cart[k].q = Math.min(99, cart[k].q + 1); saveCart(); }
      else if (act === 'dec' && cart[k]) { cart[k].q -= 1; if (cart[k].q < 1) delete cart[k]; saveCart(); }
      else if (act === 'rm') { delete cart[k]; saveCart(); }
      else if (act === 'logout') { sb.auth.signOut().then(function () { V = 'cart'; paint(); }); }
      else { V = act; paint(); }
    });
    document.getElementById('db').addEventListener('submit', function (e) {
      e.preventDefault(); if (e.target.id === 'cf') submitOrder(e.target); else if (e.target.id === 'af') submitAuth(e.target);
    });
    if (sb) {
      var ul = document.querySelector('.nav ul'), cta = ul && ul.querySelector('.cta-n');
      if (ul && cta) {
        var li = document.createElement('li'); li.innerHTML = '<a href="#" id="acc">Mi cuenta</a>'; ul.insertBefore(li, cta.parentNode);
        li.firstChild.onclick = function (e) { e.preventDefault(); openDr(user ? 'account' : 'login'); };
      }
      sb.auth.getSession().then(function (r) { setUser(r.data.session); });
      sb.auth.onAuthStateChange(function (ev, s) { setUser(s); });
      sb.channel('vicosa-mine').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, function () { if (dr.classList.contains('on') && V === 'account') loadOrders(); }).subscribe();
    }
    cartUI();
  }
  buildCartUI();
  init();
  update();
})();
