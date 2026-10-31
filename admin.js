/* Panel de administración · Distribuidora Vicosa (Supabase) */
(function () {
  const CFG = window.VICOSA_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => 'Q' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const fdate = d => new Date(d).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' });
  const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const ST = ['nuevo', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado'];
  const STL = { nuevo: 'Nuevo', confirmado: 'Confirmado', preparando: 'Preparando', enviado: 'Enviado', entregado: 'Entregado', cancelado: 'Cancelado' };
  const SEC = { sorali: 'Línea Sorali', semi: 'Semipermanentes', aparatos: 'Herramientas' };
  const SET = [
    ['wa_number', 'Número de WhatsApp de la asesora (código de país + número, solo dígitos)', 'text'],
    ['shipping_fee', 'Costo de envío (Q). 0 = sin cargo', 'number'],
    ['free_shipping_min', 'Envío gratis en compras desde (Q). 0 = desactivado', 'number'],
    ['pay_info', 'Instrucciones de pago (se muestran al cliente al confirmar el pedido)', 'area'],
    ['store_open', 'Tienda abierta para recibir pedidos', 'bool'],
    ['banner', 'Aviso en la parte superior del sitio (vacío = oculto)', 'text']];
  const main = $('#main');
  if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY || !window.supabase) {
    $('#login').innerHTML = '<form><h1>Falta configurar</h1><p>Abre <b>config.js</b> y pega la URL y la clave <b>anon</b> de tu proyecto de Supabase.</p></form>'; return;
  }
  const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  let T = 'orders', ORD = [], PRD = [], CAT = [], me = null, started = false;

  function toast(m, er) { const t = $('#tt'); t.textContent = m; t.className = 'on' + (er ? ' er' : ''); clearTimeout(t._t); t._t = setTimeout(() => t.className = '', 2800); }
  async function q(p) { const r = await p; if (r.error) { toast(r.error.message, 1); throw r.error; } return r.data; }
  function beep() { try { const c = new (window.AudioContext || window.webkitAudioContext)(), o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.setValueAtTime(.15, c.currentTime); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .5); o.start(); o.stop(c.currentTime + .5); } catch (e) {} }
  const phone = p => { const d = String(p || '').replace(/\D/g, ''); return d.length === 8 ? '502' + d : d; };

  /* ---------- Acceso ---------- */
  $('#lf').onsubmit = async e => {
    e.preventDefault(); $('#le').textContent = '';
    const f = e.target, r = await sb.auth.signInWithPassword({ email: f.e.value, password: f.p.value });
    if (r.error) $('#le').textContent = 'Correo o contraseña incorrectos.';
  };
  $('#out').onclick = () => sb.auth.signOut();
  async function enter(s) {
    if (!s) { $('#app').hidden = true; $('#login').hidden = false; return; }
    const { data } = await sb.from('profiles').select('is_admin,email').eq('id', s.user.id).maybeSingle();
    if (!data || !data.is_admin) {
      $('#le').innerHTML = 'Esta cuenta no tiene permiso de administrador. En Supabase (SQL Editor) ejecuta:<br><code>update profiles set is_admin = true where email = \'' + esc(s.user.email) + '\';</code>';
      await sb.auth.signOut(); return;
    }
    me = s.user; $('#login').hidden = true; $('#app').hidden = false;
    if (!started) { started = true; live(); }
    show(T); badge();
  }
  sb.auth.getSession().then(r => enter(r.data.session));
  sb.auth.onAuthStateChange((ev, s) => { if (ev === 'SIGNED_IN' || ev === 'SIGNED_OUT') enter(s); });

  /* ---------- Tiempo real ---------- */
  let rt;
  function refresh() {
    clearTimeout(rt);
    rt = setTimeout(() => {
      badge();
      const a = document.activeElement;
      if ($('#md').open || (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && main.contains(a))) return;
      show(T, true);
    }, 350);
  }
  function live() {
    const ch = sb.channel('admin');
    ch.on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, p => { if (p.eventType === 'INSERT') { toast('🛎 Nuevo pedido #' + p.new.number); beep(); } refresh(); });
    ['products', 'categories', 'settings', 'profiles', 'site_content'].forEach(t => ch.on('postgres_changes', { event: '*', schema: 'public', table: t }, refresh));
    ch.subscribe();
  }
  async function badge() {
    const r = await sb.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'nuevo'), n = r.count || 0;
    $('#nb').hidden = !n; $('#nb').textContent = n; document.title = (n ? '(' + n + ') ' : '') + 'Panel · Distribuidora Vicosa';
  }
  $$('.top [data-t]').forEach(b => b.onclick = () => show(b.dataset.t));
  async function show(t, keep) {
    T = t; $$('.top [data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === t));
    try { await ({ orders: vOrders, products: vProducts, cats: vCats, site: vSite, settings: vSettings, users: vUsers }[t])(); } catch (e) {}
  }

  /* ---------- Pedidos ---------- */
  async function vOrders() {
    const fs = $('#fs') ? $('#fs').value : '', fq = $('#fq') ? $('#fq').value : '', open = new Set($$('details[open]').map(d => d.dataset.id));
    ORD = await q(sb.from('orders').select('*').order('created_at', { ascending: false }).limit(500));
    const live = ORD.filter(o => o.status !== 'cancelado'), cnt = s => ORD.filter(o => s.includes(o.status)).length, today = new Date().toDateString();
    main.innerHTML = '<div class="cards">' + [['Nuevos', cnt(['nuevo'])], ['En proceso', cnt(['confirmado', 'preparando', 'enviado'])], ['Entregados', cnt(['entregado'])], ['Pedidos hoy', ORD.filter(o => new Date(o.created_at).toDateString() === today).length], ['Ventas (sin cancelados)', money(live.reduce((a, o) => a + Number(o.total), 0))]].map(k => '<div class="k"><small>' + k[0] + '</small><b>' + k[1] + '</b></div>').join('') + '</div>' +
      '<div class="tb"><select id="fs"><option value="">Todos los estados</option>' + ST.map(s => '<option value="' + s + '">' + STL[s] + '</option>').join('') + '</select><input id="fq" type="search" placeholder="Buscar por número, nombre, teléfono…"><span class="gr"></span><button class="b o" id="csv">Exportar CSV</button></div><div id="ol"></div>';
    $('#fs').value = fs; $('#fq').value = fq; $('#fs').onchange = $('#fq').oninput = olist; $('#csv').onclick = csv; olist();
    open.forEach(id => { const d = $('details[data-id="' + id + '"]'); if (d) d.open = true; });
  }
  function olist() {
    const f = $('#fs').value, s = $('#fq').value.toLowerCase();
    const L = ORD.filter(o => (!f || o.status === f) && (!s || (o.number + ' ' + o.name + ' ' + o.phone + ' ' + o.email).toLowerCase().includes(s)));
    $('#ol').innerHTML = L.length ? L.map(ocard).join('') : '<p class="mut">No hay pedidos con ese filtro.</p>';
  }
  function ocard(o) {
    const wa = 'https://wa.me/' + phone(o.phone) + '?text=' + encodeURIComponent('Hola ' + o.name + ', te escribimos de Distribuidora Vicosa por tu pedido #' + o.number + '.');
    return '<details class="card" data-id="' + o.id + '"><summary><b>#' + o.number + '</b><span><b>' + esc(o.name) + '</b><br><span class="mut">' + fdate(o.created_at) + ' · ' + esc(o.phone) + '</span></span><b>' + money(o.total) + '</b><span class="badge s-' + o.status + '">' + STL[o.status] + '</span></summary>' +
      '<div class="det"><div><p><b>Contacto</b><br>' + esc(o.name) + '<br>' + esc(o.phone) + (o.email ? '<br>' + esc(o.email) : '') + '<br><a href="' + wa + '" target="_blank" rel="noopener">Escribir por WhatsApp ↗</a></p>' +
      '<p><b>Dirección</b><br>' + esc(o.address).replace(/\n/g, '<br>') + '</p>' + (o.notes ? '<p><b>Notas del cliente</b><br>' + esc(o.notes).replace(/\n/g, '<br>') + '</p>' : '') + '</div>' +
      '<div><table><tr><th>Producto</th><th>Cant.</th><th>Precio</th></tr>' + (o.items || []).map(i => '<tr><td>' + esc(i.name) + '<br><span class="mut">' + esc(String(i.detail || '').split(' · ')[0]) + '</span></td><td>' + i.q + '</td><td>' + money(i.price * i.q) + '</td></tr>').join('') +
      '<tr><td colspan="2">Subtotal</td><td>' + money(o.subtotal) + '</td></tr><tr><td colspan="2">Envío</td><td>' + money(o.shipping) + '</td></tr><tr><td colspan="2"><b>Total</b></td><td><b>' + money(o.total) + '</b></td></tr></table>' +
      '<p><label>Estado<select class="ost" data-id="' + o.id + '">' + ST.map(s => '<option value="' + s + '"' + (s === o.status ? ' selected' : '') + '>' + STL[s] + '</option>').join('') + '</select></label></p>' +
      '<label>Nota interna (el cliente no la ve)<textarea class="onote" data-id="' + o.id + '" rows="2">' + esc(o.admin_note) + '</textarea></label>' +
      '<p><button class="b d s odel" data-id="' + o.id + '">Eliminar pedido</button></p></div></div></details>';
  }
  function csv() {
    const R = [['Pedido', 'Fecha', 'Estado', 'Nombre', 'Teléfono', 'Correo', 'Dirección', 'Productos', 'Subtotal', 'Envío', 'Total', 'Notas']];
    ORD.forEach(o => R.push([o.number, fdate(o.created_at), STL[o.status], o.name, o.phone, o.email, o.address, (o.items || []).map(i => i.q + 'x ' + i.name).join(' | '), o.subtotal, o.shipping, o.total, o.notes]));
    const b = new Blob(['\ufeff' + R.map(r => r.map(c => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'pedidos-vicosa.csv'; a.click();
  }

  /* ---------- Productos (tarjetas como en la tienda) ---------- */
  let pview = 'cards', pre = null;
  async function vProducts() {
    const g = id => $(id) ? $(id).value : '';
    const keep = pre || { s: g('#fsec'), c: g('#fcat'), t: g('#fst'), q: g('#pq') }; pre = null;
    [PRD, CAT] = await Promise.all([q(sb.from('products').select('*').order('section').order('sort').order('name')), q(sb.from('categories').select('*').order('section').order('sort'))]);
    main.innerHTML = '<div class="tb"><input id="pq" type="search" placeholder="Buscar producto o categoría…" style="min-width:230px"><select id="fsec"><option value="">Todas las secciones</option>' + Object.keys(SEC).map(k => '<option value="' + k + '">' + SEC[k] + '</option>').join('') + '</select><select id="fcat"></select>' +
      '<select id="fst"><option value="">Todos</option><option value="vis">Visibles</option><option value="hid">Ocultos</option><option value="sold">Agotados</option><option value="np">Sin precio</option></select><span class="gr"></span>' +
      '<div class="seg"><button class="b s' + (pview === 'cards' ? '' : ' o') + '" data-v="cards">▦ Tarjetas</button><button class="b s' + (pview === 'list' ? '' : ' o') + '" data-v="list">☰ Lista</button></div><button class="b" id="pnew">＋ Nuevo producto</button></div><div id="pbox"></div>';
    $('#fsec').value = keep.s; fillFcat(keep.c); $('#fst').value = keep.t; $('#pq').value = keep.q;
    $('#fsec').onchange = () => { fillFcat(''); plist(); }; $('#fcat').onchange = $('#fst').onchange = $('#pq').oninput = plist; $('#pnew').onclick = () => pform(); plist();
  }
  function fillFcat(v) {
    const s = $('#fsec').value;
    $('#fcat').innerHTML = '<option value="">Todas las categorías</option>' + CAT.filter(c => !s || c.section === s).map(c => '<option value="' + esc(c.id) + '">' + esc(c.title) + '</option>').join('') + '<option value="_none">Sin categoría</option>';
    $('#fcat').value = v || '';
  }
  function pcard(p) {
    const sz = String(p.detail || '').split(' · ')[0], low = p.stock !== null && p.stock !== undefined;
    return '<div class="pcard' + (p.active ? '' : ' off') + '"><div class="pimg">' + (p.image_url ? '<img src="' + esc(p.image_url) + '" alt="" loading="lazy">' : '<i>🖼</i>') +
      (p.sold_out ? '<span class="tag">AGOTADO</span>' : '') + (!p.active ? '<span class="tag g" style="top:auto;bottom:8px">OCULTO</span>' : '') + (low ? '<span class="tag r">Inv. ' + p.stock + '</span>' : '') + '</div>' +
      '<h4>' + esc(p.name) + '</h4><p class="pd">' + esc(sz) + '&nbsp;</p>' +
      '<div class="pr">Q <input class="qp" type="number" step="0.01" min="0" value="' + p.price + '" data-f="price" data-id="' + p.id + '" title="Precio (0 = consultar precio)"></div>' +
      '<div class="pact"><button class="b s pedit" data-id="' + p.id + '">Editar</button><button class="b o s ptog' + (p.active ? '' : ' on') + '" data-f="active" data-id="' + p.id + '" title="Mostrar / ocultar en la tienda">' + (p.active ? '👁 Visible' : '🚫 Oculto') + '</button>' +
      '<button class="b o s ptog' + (p.sold_out ? ' on' : '') + '" data-f="sold_out" data-id="' + p.id + '">Agotado</button><button class="b o s pdup" data-id="' + p.id + '" title="Duplicar">⧉</button><button class="b d s pdel" data-id="' + p.id + '" title="Eliminar">✕</button></div></div>';
  }
  function plist() {
    const s = $('#fsec').value, c = $('#fcat').value, st = $('#fst').value, t = $('#pq').value.toLowerCase().trim();
    const L = PRD.filter(p => {
      const cat = CAT.find(x => x.id === p.category_id);
      return (!s || p.section === s) && (!c || (c === '_none' ? !p.category_id : p.category_id === c)) &&
        (!st || (st === 'vis' && p.active) || (st === 'hid' && !p.active) || (st === 'sold' && (p.sold_out || p.stock === 0)) || (st === 'np' && !(p.price > 0))) &&
        (!t || (p.name + ' ' + p.detail + ' ' + (cat ? cat.title : '')).toLowerCase().includes(t));
    });
    if (!L.length) { $('#pbox').innerHTML = '<p class="mut">No hay productos con ese filtro.</p>'; return; }
    if (pview === 'list') {
      $('#pbox').innerHTML = '<div class="tw"><table><tr><th></th><th>Producto</th><th>Categoría</th><th>Precio Q</th><th>Inventario</th><th>Visible</th><th>Agotado</th><th></th></tr>' + L.map(p => {
        const cc = CAT.find(x => x.id === p.category_id);
        return '<tr class="' + (p.active ? '' : 'off') + '"><td>' + (p.image_url ? '<img class="th" src="' + esc(p.image_url) + '" alt="">' : '<div class="th"></div>') + '</td><td><b>' + esc(p.name) + '</b><br><span class="mut">' + esc(String(p.detail).split(' · ')[0]) + '</span></td><td class="mut">' + esc(cc ? cc.title : '—') + '<br>' + SEC[p.section] + '</td>' +
          '<td><input type="number" step="0.01" min="0" style="width:90px" value="' + p.price + '" data-f="price" data-id="' + p.id + '"></td><td><input type="number" min="0" placeholder="∞" style="width:80px" value="' + (p.stock ?? '') + '" data-f="stock" data-id="' + p.id + '"></td>' +
          '<td><input type="checkbox" data-f="active" data-id="' + p.id + '"' + (p.active ? ' checked' : '') + '></td><td><input type="checkbox" data-f="sold_out" data-id="' + p.id + '"' + (p.sold_out ? ' checked' : '') + '></td>' +
          '<td style="white-space:nowrap"><button class="b o s pedit" data-id="' + p.id + '">Editar</button> <button class="b d s pdel" data-id="' + p.id + '">✕</button></td></tr>';
      }).join('') + '</table></div>'; return;
    }
    const groups = [...CAT.map(x => x.id), null], h = [];
    groups.forEach(id => {
      const G = L.filter(p => (p.category_id || null) === id); if (!G.length) return;
      const cc = CAT.find(x => x.id === id);
      h.push('<div class="sech"><h3>' + esc(cc ? cc.title : 'Sin categoría') + '</h3><span class="mut">' + (cc ? SEC[cc.section] + ' · ' : '') + G.length + ' producto' + (G.length > 1 ? 's' : '') + '</span></div><div class="pgrid">' + G.map(pcard).join('') + '</div>');
    });
    $('#pbox').innerHTML = h.join('');
  }
  function pform(id) {
    const p = PRD.find(x => x.id === id) || { section: $('#fsec').value || 'sorali', price: 0, active: true, sold_out: false, sort: 0 }, f = $('#mf');
    f.dataset.k = 'p'; f.dataset.id = id || '';
    f.innerHTML = '<h3>' + (id ? 'Editar' : 'Nuevo') + ' producto</h3><label>Sección<select name="section">' + Object.keys(SEC).map(k => '<option value="' + k + '">' + SEC[k] + '</option>').join('') + '</select></label><label>Categoría<select name="category_id"></select></label>' +
      '<label class="f">Nombre<input name="name" required></label><label class="f">Detalle / presentación<input name="detail" placeholder="Ej: 500 mL · descripción corta"></label>' +
      '<label>Precio (Q) — 0 = consultar<input name="price" type="number" step="0.01" min="0"></label><label>Inventario — vacío = sin control<input name="stock" type="number" min="0"></label>' +
      '<label class="f">Foto (subir archivo)<input type="file" id="pfile" accept="image/*"></label><label class="f">o enlace (URL) de la foto<input name="image_url"></label><label>Orden<input name="sort" type="number"></label>' +
      '<div class="ch"><label><input type="checkbox" name="active"> Visible</label><label><input type="checkbox" name="sold_out"> Agotado</label></div>' +
      '<div class="f" style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="b o" id="mc">Cancelar</button><button class="b">Guardar</button></div>';
    const E = f.elements, fill = () => { E.category_id.innerHTML = '<option value="">— Sin categoría —</option>' + CAT.filter(c => c.section === E.section.value).map(c => '<option value="' + esc(c.id) + '">' + esc(c.title) + '</option>').join(''); E.category_id.value = p.category_id || ''; };
    E.section.value = p.section; fill(); E.section.onchange = () => { p.category_id = ''; fill(); };
    E.name.value = p.name || ''; E.detail.value = p.detail || ''; E.price.value = p.price; E.stock.value = p.stock ?? ''; E.image_url.value = p.image_url || ''; E.sort.value = p.sort ?? 0; E.active.checked = !!p.active; E.sold_out.checked = !!p.sold_out;
    $('#mc').onclick = () => $('#md').close(); $('#md').showModal();
  }
  async function upload(file, pre = '') {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, ''), path = pre + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
    await q(sb.storage.from('productos').upload(path, file, { cacheControl: '31536000', contentType: file.type }));
    return sb.storage.from('productos').getPublicUrl(path).data.publicUrl;
  }

  /* ---------- Categorías (tarjetas) ---------- */
  async function vCats() {
    const keep = { s: $('#csec') ? $('#csec').value : '', q: $('#cq') ? $('#cq').value : '' };
    [CAT, PRD] = await Promise.all([q(sb.from('categories').select('*').order('section').order('sort')), q(sb.from('products').select('id,category_id,image_url,active'))]);
    main.innerHTML = '<div class="tb"><input id="cq" type="search" placeholder="Buscar categoría…" style="min-width:230px"><select id="csec"><option value="">Todas las secciones</option>' + Object.keys(SEC).map(k => '<option value="' + k + '">' + SEC[k] + '</option>').join('') + '</select><span class="gr"></span><button class="b" id="cnew">＋ Nueva categoría</button></div><div id="cbox"></div>';
    $('#csec').value = keep.s; $('#cq').value = keep.q; $('#csec').onchange = $('#cq').oninput = clist; $('#cnew').onclick = () => cform(); clist();
  }
  function clist() {
    const s = $('#csec').value, t = $('#cq').value.toLowerCase().trim(), h = [];
    Object.keys(SEC).forEach(sec => {
      if (s && s !== sec) return;
      const L = CAT.filter(c => c.section === sec && (!t || (c.title + ' ' + c.description).toLowerCase().includes(t)));
      if (!L.length) return;
      h.push('<div class="sech"><h3>' + SEC[sec] + '</h3><span class="mut">' + L.length + ' categoría' + (L.length > 1 ? 's' : '') + '</span></div><div class="cgrid">' + L.map(c => {
        const P = PRD.filter(p => p.category_id === c.id);
        return '<div class="ccard' + (c.active ? '' : ' off') + '"><div class="thm">' + [0, 1, 2, 3].map(i => '<div>' + (P[i] && P[i].image_url ? '<img src="' + esc(P[i].image_url) + '" alt="" loading="lazy">' : '') + '</div>').join('') + '</div>' +
          '<h4>' + esc(c.title) + '</h4><p class="pd">' + esc(c.description) + '</p><p class="mut" style="margin:0 2px">' + P.length + ' producto' + (P.length === 1 ? '' : 's') + '</p>' +
          '<div class="pact"><button class="b s cedit" data-id="' + esc(c.id) + '">Editar</button><button class="b o s cview" data-id="' + esc(c.id) + '">Ver productos</button><button class="b o s ctog' + (c.active ? '' : ' on') + '" data-id="' + esc(c.id) + '">' + (c.active ? '👁 Visible' : '🚫 Oculta') + '</button>' +
          '<button class="b o s cmove" data-d="-1" data-id="' + esc(c.id) + '" title="Subir">↑</button><button class="b o s cmove" data-d="1" data-id="' + esc(c.id) + '" title="Bajar">↓</button><button class="b d s cdel" data-id="' + esc(c.id) + '">✕</button></div></div>';
      }).join('') + '</div>');
    });
    $('#cbox').innerHTML = h.join('') || '<p class="mut">No hay categorías con ese filtro.</p>';
  }
  function cform(id) {
    const c = CAT.find(x => x.id === id) || { section: 'sorali', sort: 0, active: true }, f = $('#mf');
    f.dataset.k = 'c'; f.dataset.id = id || '';
    f.innerHTML = '<h3>' + (id ? 'Editar' : 'Nueva') + ' categoría</h3><label class="f">Sección<select name="section"' + (id ? ' disabled' : '') + '>' + Object.keys(SEC).map(k => '<option value="' + k + '">' + SEC[k] + '</option>').join('') + '</select></label>' +
      '<label class="f">Título<input name="title" required></label><label class="f">Descripción corta (se muestra bajo el título)<textarea name="description" rows="2"></textarea></label><label>Orden<input name="sort" type="number"></label><div class="ch"><label><input type="checkbox" name="active"> Visible</label></div>' +
      '<div class="f" style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="b o" id="mc">Cancelar</button><button class="b">Guardar</button></div>';
    const E = f.elements; E.section.value = c.section; E.title.value = c.title || ''; E.description.value = c.description || ''; E.sort.value = c.sort; E.active.checked = !!c.active;
    $('#mc').onclick = () => $('#md').close(); $('#md').showModal();
  }

  /* ---------- Sitio: textos, imágenes y secciones editables ---------- */
  const CMS = window.VICOSA_CMS || { pages: [] }, ITEM = {}; let SC = {};
  CMS.pages.forEach(pg => pg.secs.forEach(s => s.items.forEach(i => ITEM[i.k] = i)));
  const mod = k => SC[k] !== undefined && SC[k] !== '';
  async function vSite() {
    let rows;
    try { const r = await sb.from('site_content').select('key,value'); if (r.error) throw r.error; rows = r.data; }
    catch (e) { main.innerHTML = '<div class="set"><h2>Falta un paso</h2><p>Para editar el sitio desde aquí ejecuta una vez <b>supabase/3-actualizacion-v5.sql</b> en el SQL Editor de Supabase y recarga esta página.</p></div>'; return; }
    SC = {}; rows.forEach(r => SC[r.key] = r.value);
    const keep = { q: $('#sq') ? $('#sq').value : '', p: $('#sp') ? $('#sp').value : '', m: $('#smod') ? $('#smod').checked : false }, open = new Set($$('#sbox details[open]').map(d => d.dataset.p));
    main.innerHTML = '<div class="tb"><input id="sq" type="search" placeholder="Buscar un texto del sitio…" style="min-width:250px"><select id="sp"><option value="">Todas las páginas</option>' + CMS.pages.map(p => '<option value="' + p.id + '">' + esc(p.name) + '</option>').join('') + '</select><label class="chk"><input type="checkbox" id="smod"> Solo modificados</label><span class="gr"></span><small class="mut">Se guarda solo y se ve en el sitio al instante.</small></div><div id="sbox"></div>';
    $('#sq').value = keep.q; $('#sp').value = keep.p; $('#smod').checked = keep.m; $('#sq').oninput = $('#sp').onchange = $('#smod').onchange = slist;
    slist(open.size ? open : new Set(['index']));
  }
  function fld(i) {
    const m = mod(i.k), cur = m ? SC[i.k] : i.d, rst = '<button class="b o s srst" type="button" data-k="' + i.k + '"' + (m ? '' : ' hidden') + ' title="Volver al original">↺</button>';
    if (i.t === 'img') return '<div class="fld img" data-k="' + i.k + '"><div class="th2"><img src="' + esc(cur) + '" alt=""></div><div><b class="fl" style="padding:0">' + esc(i.l) + '</b><div class="mut">' + esc(i.alt || '') + '</div><div class="pact"><label class="b s o" style="flex-direction:row;cursor:pointer">Cambiar imagen<input type="file" accept="image/*" hidden data-img="' + i.k + '"></label>' + rst + '</div></div></div>';
    return '<div class="fld' + (m ? ' mod' : '') + '" data-k="' + i.k + '"><span class="fl">' + esc(i.l) + '</span>' + (i.t === 'area' ? '<textarea rows="3" data-sk="' + i.k + '">' : '<input data-sk="' + i.k + '" value="' + esc(cur) + '">') + (i.t === 'area' ? esc(cur) + '</textarea>' : '') + rst + '</div>';
  }
  function slist(open) {
    if (!(open instanceof Set)) open = new Set($$('#sbox details[open]').map(d => d.dataset.p));
    const t = $('#sq').value.toLowerCase().trim(), pf = $('#sp').value, md = $('#smod').checked, h = [];
    CMS.pages.forEach(pg => {
      if (pf && pg.id !== pf) return; let body = '', n = 0;
      pg.secs.forEach(s => {
        if (s.label === 'Tienda') return;
        const items = s.items.filter(i => (!t || (i.d + ' ' + (SC[i.k] || '')).toLowerCase().includes(t)) && (!md || mod(i.k)));
        if (!items.length) return; n += items.length;
        body += '<div class="ssh"><span>' + esc(s.label) + '</span>' + (s.nohide ? '' : '<label><input type="checkbox" data-hide="' + s.k + '"' + (SC['hide:' + s.k] === '1' ? '' : ' checked') + '> Mostrar esta sección</label>') + '</div>' + items.map(fld).join('');
      });
      if (n) h.push('<details class="sg" data-p="' + pg.id + '"' + (open.has(pg.id) || t || pf || md ? ' open' : '') + '><summary>' + esc(pg.name) + ' <span class="mut">' + n + (n === 1 ? ' campo' : ' campos') + '</span></summary><div class="ss">' + body + '</div></details>');
    });
    $('#sbox').innerHTML = h.join('') || '<p class="mut">No hay campos con ese filtro.</p>';
  }
  async function saveSite(k, v) {
    const it = ITEM[k];
    if (v === '' || v.trim() === '' || v === it.d) { await q(sb.from('site_content').delete().eq('key', k)); delete SC[k]; toast('Restaurado al original'); }
    else { await q(sb.from('site_content').upsert({ key: k, value: v, updated_at: new Date().toISOString() })); SC[k] = v; toast('Guardado'); }
    const f = $('.fld[data-k="' + k + '"]'); if (f) { f.classList.toggle('mod', mod(k)); const r = $('.srst', f); if (r) r.hidden = !mod(k); }
  }

  /* ---------- Ajustes ---------- */
  async function vSettings() {
    const S = {}; (await q(sb.from('settings').select('*'))).forEach(x => S[x.key] = x.value);
    main.innerHTML = '<form id="sf" class="set"><h2>Ajustes de la tienda</h2><p class="mut">Los cambios aparecen en el sitio al instante.</p>' + SET.map(s => '<label' + (s[2] === 'bool' ? ' style="flex-direction:row;align-items:center;gap:10px"' : '') + '>' +
      (s[2] === 'bool' ? '<input type="checkbox" name="' + s[0] + '"' + (S[s[0]] !== 'false' ? ' checked' : '') + '>' + s[1] : s[1] + (s[2] === 'area' ? '<textarea name="' + s[0] + '" rows="4">' + esc(S[s[0]]) + '</textarea>' : '<input name="' + s[0] + '" type="' + s[2] + '" step="0.01" min="0" value="' + esc(S[s[0]]) + '"' + (s[2] === 'number' ? '' : '') + '>')) + '</label>').join('') +
      '<div><button class="b">Guardar ajustes</button></div></form>';
    $('#sf').onsubmit = async e => {
      e.preventDefault(); const f = e.target.elements;
      await q(sb.from('settings').upsert(SET.map(s => ({ key: s[0], value: s[2] === 'bool' ? String(f[s[0]].checked) : (s[0] === 'wa_number' ? f[s[0]].value.replace(/\D/g, '') : f[s[0]].value) }))));
      toast('Ajustes guardados');
    };
  }

  /* ---------- Clientes ---------- */
  async function vUsers() {
    const [U, O] = await Promise.all([q(sb.from('profiles').select('*').order('created_at', { ascending: false })), q(sb.from('orders').select('user_id,total,status'))]);
    main.innerHTML = '<div class="tw"><table><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Registro</th><th>Pedidos</th><th>Administrador</th></tr>' + (U.length ? U.map(u => {
      const mine = O.filter(o => o.user_id === u.id);
      return '<tr><td><b>' + esc(u.name || '—') + '</b></td><td>' + esc(u.email) + '</td><td>' + esc(u.phone) + '</td><td class="mut">' + fdate(u.created_at) + '</td><td>' + mine.length + '</td><td><input type="checkbox" class="adm" data-id="' + u.id + '"' + (u.is_admin ? ' checked' : '') + (u.id === me.id ? ' disabled' : '') + '></td></tr>';
    }).join('') : '<tr><td colspan="6" class="mut">Aún no hay clientes registrados.</td></tr>') + '</table></div><p class="mut">Los pedidos sin cuenta (invitados) aparecen en la pestaña Pedidos.</p>';
  }

  /* ---------- Eventos ---------- */
  main.addEventListener('change', async e => {
    const t = e.target, id = t.dataset.id;
    if (t.classList.contains('ost')) { await q(sb.from('orders').update({ status: t.value }).eq('id', id)); toast('Estado actualizado'); badge(); const d = t.closest('details'); $('.badge', d).textContent = STL[t.value]; $('.badge', d).className = 'badge s-' + t.value; }
    else if (t.classList.contains('onote')) { await q(sb.from('orders').update({ admin_note: t.value }).eq('id', id)); toast('Nota guardada'); }
    else if (t.dataset.f) { let v = t.type === 'checkbox' ? t.checked : t.value; if (t.dataset.f === 'price') v = Number(v) || 0; if (t.dataset.f === 'stock') v = v === '' ? null : parseInt(v, 10); await q(sb.from('products').update({ [t.dataset.f]: v }).eq('id', id)); const lp = PRD.find(x => x.id === id); if (lp) lp[t.dataset.f] = v; toast('Guardado'); }
    else if (t.dataset.cf) { await q(sb.from('categories').update({ [t.dataset.cf]: t.checked }).eq('id', id)); toast('Guardado'); }
    else if (t.dataset.sk) await saveSite(t.dataset.sk, t.value);
    else if (t.dataset.hide) { const k = 'hide:' + t.dataset.hide; if (t.checked) { await q(sb.from('site_content').delete().eq('key', k)); delete SC[k]; } else { await q(sb.from('site_content').upsert({ key: k, value: '1' })); SC[k] = '1'; } toast(t.checked ? 'Sección visible' : 'Sección oculta'); }
    else if (t.dataset.img) {
      const file = t.files[0]; if (!file) return; toast('Subiendo imagen…'); const u = await upload(file, 'sitio/'); await q(sb.from('site_content').upsert({ key: t.dataset.img, value: u })); SC[t.dataset.img] = u;
      const f = $('.fld[data-k="' + t.dataset.img + '"]'); $('img', f).src = u; $('.srst', f).hidden = false; toast('Imagen actualizada');
    }
    else if (t.classList.contains('adm')) { await q(sb.rpc('set_admin', { uid: id, val: t.checked })); toast(t.checked ? 'Ahora es administrador' : 'Permiso retirado'); }
  });
  main.addEventListener('click', async e => {
    const b = e.target.closest('button'); if (!b) return; const id = b.dataset.id;
    if (b.dataset.v) { pview = b.dataset.v; show('products'); }
    else if (b.classList.contains('pedit')) pform(id); else if (b.classList.contains('cedit')) cform(id);
    else if (b.classList.contains('ptog')) { const p = PRD.find(x => x.id === id), f = b.dataset.f; await q(sb.from('products').update({ [f]: !p[f] }).eq('id', id)); p[f] = !p[f]; plist(); toast('Guardado'); }
    else if (b.classList.contains('pdup')) { const { id: _i, created_at, updated_at, ...row } = PRD.find(x => x.id === id); await q(sb.from('products').insert({ ...row, name: row.name + ' (copia)', active: false })); toast('Duplicado: quedó oculto para que lo edites'); show('products'); }
    else if (b.classList.contains('ctog')) { const c = CAT.find(x => x.id === id); await q(sb.from('categories').update({ active: !c.active }).eq('id', id)); c.active = !c.active; clist(); toast('Guardado'); }
    else if (b.classList.contains('cview')) { const c = CAT.find(x => x.id === id); pre = { s: c.section, c: c.id, t: '', q: '' }; $$('.top [data-t]').forEach(x => x.classList.toggle('on', x.dataset.t === 'products')); show('products'); }
    else if (b.classList.contains('cmove')) {
      const c = CAT.find(x => x.id === id), L = CAT.filter(x => x.section === c.section).sort((a, b2) => a.sort - b2.sort), i = L.indexOf(c), j = i + Number(b.dataset.d);
      if (j < 0 || j >= L.length) return; [L[i], L[j]] = [L[j], L[i]];
      await Promise.all(L.map((x, n) => q(sb.from('categories').update({ sort: n * 10 }).eq('id', x.id)))); L.forEach((x, n) => x.sort = n * 10); CAT.sort((a, b2) => a.section.localeCompare(b2.section) || a.sort - b2.sort); clist();
    }
    else if (b.classList.contains('srst')) { const k = b.dataset.k, it = ITEM[k]; await q(sb.from('site_content').delete().eq('key', k)); delete SC[k]; const f = $('.fld[data-k="' + k + '"]'); f.classList.remove('mod'); b.hidden = true; const c = $('[data-sk]', f); if (c) c.value = it.d; const im = $('img', f); if (im) im.src = it.d; toast('Restaurado al original'); }
    else if (b.classList.contains('pdel') && confirm('¿Eliminar este producto definitivamente? (Si solo quieres ocultarlo, desmarca "Visible")')) { await q(sb.from('products').delete().eq('id', id)); toast('Producto eliminado'); show('products'); }
    else if (b.classList.contains('cdel') && confirm('¿Eliminar esta categoría? Sus productos quedarán sin categoría.')) { await q(sb.from('categories').delete().eq('id', id)); toast('Categoría eliminada'); show('cats'); }
    else if (b.classList.contains('odel') && confirm('¿Eliminar este pedido definitivamente? Si solo lo cancelas, el inventario se devuelve.')) { await q(sb.from('orders').delete().eq('id', id)); toast('Pedido eliminado'); show('orders'); }
  });
  $('#mf').onsubmit = async e => {
    e.preventDefault(); const f = e.target, E = f.elements, id = f.dataset.id, btn = f.querySelector('button:not([type=button])'); btn.disabled = true;
    try {
      if (f.dataset.k === 'p') {
        let img = E.image_url.value.trim(); const file = $('#pfile').files[0]; if (file) { btn.textContent = 'Subiendo foto…'; img = await upload(file); }
        const row = { section: E.section.value, category_id: E.category_id.value || null, name: E.name.value.trim(), detail: E.detail.value.trim(), price: Number(E.price.value) || 0, stock: E.stock.value === '' ? null : parseInt(E.stock.value, 10), image_url: img, sort: parseInt(E.sort.value, 10) || 0, active: E.active.checked, sold_out: E.sold_out.checked };
        await q(id ? sb.from('products').update(row).eq('id', id) : sb.from('products').insert(row)); $('#md').close(); toast('Producto guardado'); show('products');
      } else {
        const row = { title: E.title.value.trim(), description: E.description.value.trim(), sort: parseInt(E.sort.value, 10) || 0, active: E.active.checked };
        if (id) await q(sb.from('categories').update(row).eq('id', id)); else await q(sb.from('categories').insert({ ...row, section: E.section.value, id: E.section.value + '-' + slug(row.title) }));
        $('#md').close(); toast('Categoría guardada'); show('cats');
      }
    } catch (er) { btn.disabled = false; btn.textContent = 'Guardar'; }
  };
})();
