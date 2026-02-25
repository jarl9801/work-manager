// ============================================
// APP.JS — Work Manager v2.0 (Main Application)
// ============================================

// ===== STATE =====
let db;
let lang = 'es';
let clients = [];
let ordersRA = [];
let ordersRD = [];
let ordersFusion = [];
let projects = [];
let goStatus = [];
let legacyOrders = [];
let clientSort = { field: 'dp', dir: 1 };
let currentOrderTab = 'ra';
let editingOrderType = null;
let orderFilters = { search: '', technician: '', project: '' };
let expandedProjects = new Set();

// ===== DATABASE =====
function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('WorkManagerDB', 3);
        req.onupgradeneeded = e => {
            const d = e.target.result;
            ['orders','clients','orders_ra','orders_rd','orders_fusion','projects','go_status'].forEach(s => {
                if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, { keyPath:'id', autoIncrement:true });
            });
        };
        req.onsuccess = e => { db = e.target.result; resolve(); };
        req.onerror = e => reject(e);
    });
}

function dbGetAll(store) {
    return new Promise(r => { const tx = db.transaction(store,'readonly'); tx.objectStore(store).getAll().onsuccess = e => r(e.target.result || []); });
}
function dbPut(store, obj) {
    return new Promise(r => { const tx = db.transaction(store,'readwrite'); const s = tx.objectStore(store); const req = obj.id ? s.put(obj) : s.add(obj); req.onsuccess = e => r(e.target.result); });
}
function dbClear(store) {
    return new Promise(r => { const tx = db.transaction(store,'readwrite'); tx.objectStore(store).clear().onsuccess = () => r(); });
}
function dbDelete(store, id) {
    return new Promise(r => { const tx = db.transaction(store,'readwrite'); tx.objectStore(store).delete(id).onsuccess = () => r(); });
}

async function loadAll() {
    clients = await dbGetAll('clients');
    ordersRA = await dbGetAll('orders_ra');
    ordersRD = await dbGetAll('orders_rd');
    ordersFusion = await dbGetAll('orders_fusion');
    projects = await dbGetAll('projects');
    goStatus = await dbGetAll('go_status');
    legacyOrders = await dbGetAll('orders');
}

// ===== i18n =====
const i18nStrings = {
    es: {
        navDashboard:'Dashboard', navClients:'Clientes', navOrders:'Órdenes', navProjects:'Proyectos', navInvoicing:'Facturación', navPrices:'Precios',
        totalProjects:'Proyectos', totalDPs:'DPs', totalClients:'Clientes',
        thCode:'Código', thDescription:'Descripción', thUnit:'Unidad', thSalePrice:'Precio Venta (€)', thCostPrice:'Precio Costo (€)', thMarginEur:'Margen (€)', thMarginPct:'Margen %',
        noData:'Sin datos', imported:'importados',
        blowingDone:'Soplado AP-DP', splicingAP:'Empalme AP', splicingDP:'Empalme DP',
        certNotInv:'Certificado sin facturar', totalInvoiced:'Total Facturado',
        resultadoImport:'Resultado de Importación', nuevas:'Nuevas', importadas:'Importadas',
        faltan:'Faltan por cargar', gereedEnGO:'GEREED en GO pero sin orden', ordenesCargadas:'Órdenes cargadas',
        yaExistia:'Ya existía', clickExpandir:'▼ Click para ver detalle DPs',
        dpNumber:'DP', sopladoRA:'Soplado RA', fusionAP:'Fusión AP', fusionDP:'Fusión DP', statusCol:'Estado', pendiente:'Pendiente',
    },
    de: {
        navDashboard:'Dashboard', navClients:'Kunden', navOrders:'Aufträge', navProjects:'Projekte', navInvoicing:'Abrechnung', navPrices:'Preise',
        totalProjects:'Projekte', totalDPs:'DPs', totalClients:'Kunden',
        thCode:'Code', thDescription:'Beschreibung', thUnit:'Einheit', thSalePrice:'Verkaufspreis (€)', thCostPrice:'Kostenpreis (€)', thMarginEur:'Marge (€)', thMarginPct:'Marge %',
        noData:'Keine Daten', imported:'importiert',
        blowingDone:'Einblasen AP-DP', splicingAP:'Spleißen AP', splicingDP:'Spleißen DP',
        certNotInv:'Zertifiziert, nicht abgerechnet', totalInvoiced:'Gesamt abgerechnet',
        resultadoImport:'Importergebnis', nuevas:'Neue', importadas:'Importiert',
        faltan:'Fehlen noch', gereedEnGO:'GEREED in GO aber kein Auftrag', ordenesCargadas:'Geladene Aufträge',
        yaExistia:'Bereits vorhanden', clickExpandir:'▼ Klick für DP-Details',
        dpNumber:'DP', sopladoRA:'Einblasen RA', fusionAP:'Spleißen AP', fusionDP:'Spleißen DP', statusCol:'Status', pendiente:'Ausstehend',
    }
};

function t(k) { return i18nStrings[lang]?.[k] || i18nStrings.es[k] || k; }

function setLang(l) {
    lang = l;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
    document.querySelectorAll('[data-t]').forEach(el => {
        const k = el.getAttribute('data-t');
        const v = t(k);
        if (v !== k) el.textContent = v;
    });
    renderAll();
}

// ===== TOAST =====
function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}

// ===== NAVIGATION =====
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        const view = item.dataset.view;
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-' + view).classList.add('active');
        document.getElementById('viewTitle').textContent = item.querySelector('span').textContent;
        closeSidebar();
    });
});

// ===== CSV PARSING =====
function parseCSV(text) {
    const lines = [];
    let current = '', inQuote = false, row = [];
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuote) {
            if (c === '"' && text[i+1] === '"') { current += '"'; i++; }
            else if (c === '"') { inQuote = false; }
            else { current += c; }
        } else {
            if (c === '"') { inQuote = true; }
            else if (c === ',') { row.push(current.trim()); current = ''; }
            else if (c === '\n' || (c === '\r' && text[i+1] === '\n')) {
                row.push(current.trim()); current = '';
                if (c === '\r') i++;
                if (row.some(x => x)) lines.push(row);
                row = [];
            } else { current += c; }
        }
    }
    row.push(current.trim());
    if (row.some(x => x)) lines.push(row);
    return lines;
}

function csvToObjects(lines) {
    if (lines.length < 2) return [];
    const headers = lines[0];
    return lines.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => obj[h] = row[i] || '');
        return obj;
    });
}

function getFieldValue(obj, fieldNames) {
    for (const name of fieldNames) { if (obj[name]) return obj[name]; }
    return '';
}

// DP normalization
function normalizeDP(raw) {
    if (!raw) return '';
    const str = raw.toString().trim().toUpperCase();
    if (/^\d+$/.test(str)) return 'DP' + str.padStart(3, '0');
    const m = str.match(/DP[- ]?(\d+)/);
    if (m) return 'DP' + m[1].padStart(3, '0');
    return raw.trim();
}

function extractProjectCode(row) {
    const dp = row['DP'] || '';
    const m = dp.match(/(QFF-\d+)/i);
    return m ? m[1] : '';
}

// ===== SMART CSV DETECTION & IMPORT =====
function detectCSVType(headers) {
    const h = headers.join(',').toLowerCase().normalize('NFC');
    if (h.includes('auftragsnummer') && h.includes('anschlussstatus')) return 'clients';
    if (h.includes('tiefbau fertig') || h.includes('einblasen ap') || h.includes('kabelsorte') || h.includes('projekt- nummer')) return 'go_status';
    if (h.includes('código de proyecto') && h.includes('metros soplados') && !h.includes('ka cliente') && !h.includes('ka ') && !h.includes('calle') && !h.includes('fusiones')) return 'soplado_ra';
    if (h.includes('fusiones') || (h.includes('código de proyecto') && h.includes('registro fotografico'))) return 'fusion';
    if (h.includes('ka cliente') || h.includes('ka ') || (h.includes('código de proyecto') && (h.includes('calle') || h.includes('dirección')) && h.includes('metros'))) return 'soplado_rd';
    return null;
}

async function smartImport(input) {
    const files = input.files;
    if (!files.length) return;
    for (const file of files) {
        const text = await file.text();
        const lines = parseCSV(text);
        if (lines.length < 2) continue;
        const type = detectCSVType(lines[0]);
        if (!type) { toast(`❌ No reconocido: ${file.name}`); continue; }
        const objs = csvToObjects(lines);
        switch(type) {
            case 'clients': await importClients(objs); break;
            case 'soplado_ra': await importRA(objs); break;
            case 'soplado_rd': await importRD(objs); break;
            case 'fusion': await importFusion(objs); break;
            case 'go_status': await importGoStatus(objs); break;
        }
    }
    await loadAll();
    renderAll();
    input.value = '';
}

// ===== UPLOAD HANDLERS =====
async function handleCSVUpload(input, type) {
    const file = input.files[0];
    if (!file) return;
    const statusEl = document.getElementById(`status${type.toUpperCase()}`);
    statusEl.className = 'upload-status processing';
    statusEl.textContent = '⏳ Procesando...';
    try {
        const text = await file.text();
        const lines = parseCSV(text);
        if (lines.length < 2) throw new Error('Archivo vacío');
        const objs = csvToObjects(lines);
        switch(type) {
            case 'ra': await importRA(objs); break;
            case 'rd': await importRD(objs); break;
            case 'fusion': await importFusion(objs); break;
        }
        await loadAll();
        orderFilters = { search: '', technician: '', project: '' };
        renderAll();
        statusEl.className = 'upload-status success';
        statusEl.textContent = `✅ ${objs.length} órdenes procesadas`;
        setTimeout(() => { statusEl.style.display = 'none'; }, 5000);
    } catch (error) {
        statusEl.className = 'upload-status error';
        statusEl.textContent = `❌ Error: ${error.message}`;
        setTimeout(() => { statusEl.style.display = 'none'; }, 8000);
    }
    input.value = '';
}

// ===== IMPORT FUNCTIONS =====
async function importClients(objs) {
    await dbClear('clients');
    const projectMap = {};
    for (const o of objs) {
        const dpFull = o['DP'] || '';
        const projCode = extractProjectCode(o);
        const dpNorm = normalizeDP(dpFull);
        const grundNA = (o['GrundNA'] || '').trim();
        let contract = 'R20';
        if (['R0','R18','R20'].includes(grundNA)) contract = grundNA;
        const statusRaw = (o['ANSCHLUSSSTATUS'] || o['Status'] || '0').toString().trim();
        const status = statusRaw === 'Fertig' ? 'Fertig' : statusRaw;
        const phase = (o['Status'] || '').trim();
        const client = {
            auftrag: o['Auftragsnummer'] || '', projektnummer: o['Projektnummer'] || '', projectCode: projCode,
            dp: dpNorm, dpFull, street: o['Straße'] || '', hausnummer: o['Hausnummer'] || '',
            hausnummerZusatz: o['Hausnummernzusatz'] || '', unit: o['Unit'] || '',
            cableId: o['Cable ID (From TRI)'] || '', contract, status, phase,
            farbeRohre: o['Farbe Rohre'] || '', datumHausanschluss: o['Datum Hausanschluss'] || '',
        };
        await dbPut('clients', client);
        if (projCode && !projectMap[projCode]) projectMap[projCode] = { code: projCode, projektnummer: client.projektnummer, dps: new Set() };
        if (projCode) projectMap[projCode].dps.add(dpNorm);
    }
    await dbClear('projects');
    for (const [code, data] of Object.entries(projectMap)) {
        await dbPut('projects', { code, projektnummer: data.projektnummer, dpCount: data.dps.size });
    }
    toast(`✅ ${objs.length} clientes ${t('imported')}`);
}

async function importRA(objs) {
    const newOrders = [], duplicates = [];
    const existingSet = new Set(ordersRA.map(o => `${o.projectCode}|${o.timestamp}`));
    for (const o of objs) {
        const projCode = getFieldValue(o, ['Código de Proyecto','Codigo de Proyecto','Project Code','Proyecto']);
        const technician = getFieldValue(o, ['Técnico Responsable','Tecnico Responsable','Técnico','Tecnico','Technician']);
        const startDate = getFieldValue(o, ['Fecha de Inicio','Fecha Inicio','Start Date','Inicio']);
        const endDate = getFieldValue(o, ['Fecha de Finalización','Fecha Finalizacion','Fecha Final','End Date']);
        const fibers = getFieldValue(o, ['Número de Fibras','Numero de Fibras','Fibras','Fibers']);
        const meters = getFieldValue(o, ['Metros Soplados','Metros','meters','Longitud']);
        const color = getFieldValue(o, ['Color miniducto','Color','Miniducto Color']);
        const incidents = getFieldValue(o, ['Incidencias (si las hubo)','Incidencias','Incidents']);
        const photos = getFieldValue(o, ['Fotos del Trabajo','Fotos','Photos']);
        const timestamp = getFieldValue(o, ['Timestamp','timestamp','Marca temporal']);
        const key = `${projCode}|${timestamp}`;
        if (existingSet.has(key)) { duplicates.push(`${projCode} (${technician}, ${meters}m)`); continue; }
        newOrders.push(`${projCode} (${technician}, ${fibers} fibras, ${meters}m)`);
        existingSet.add(key);
        await dbPut('orders_ra', { timestamp, projectCode:projCode, technician, startDate, endDate, fibers, meters, color, incidents, photos });
    }
    const missing = findMissingGO('ra');
    toast(`✅ ${objs.length} Soplado RA ${t('imported')}`);
    showImportReport('soplado_ra', newOrders, duplicates, missing);
}

async function importRD(objs) {
    const newOrders = [], duplicates = [];
    const existingSet = new Set(ordersRD.map(o => `${o.projectCode}|${o.dp}|${o.ka}`));
    for (const o of objs) {
        const dp = normalizeDP(getFieldValue(o, ['DP','dp','Distribution Point']));
        const projCode = getFieldValue(o, ['Código de Proyecto','Codigo de Proyecto','Project Code','Proyecto']);
        const ka = getFieldValue(o, ['KA cliente','KA Cliente','KA','ka cliente']);
        const street = getFieldValue(o, ['Calle','calle','Dirección','Address']);
        const technician = getFieldValue(o, ['Técnico Responsable','Tecnico Responsable','Técnico','Tecnico']);
        const startDate = getFieldValue(o, ['Fecha de Inicio','Fecha Inicio','Start Date']);
        const endDate = getFieldValue(o, ['Fecha de Finalización','Fecha Finalizacion','Fecha Final']);
        const meters = getFieldValue(o, ['Metros Soplados','Metros','meters']);
        const color = getFieldValue(o, ['Color miniducto','Color']);
        const incidents = getFieldValue(o, ['Incidencias (si las hubo)','Incidencias']);
        const photos = getFieldValue(o, ['Fotos del Trabajo','Fotos','Photos']);
        const fibers = getFieldValue(o, ['Número de Fibras','Numero de Fibras','Fibras']);
        const timestamp = getFieldValue(o, ['Timestamp','timestamp','Marca temporal']);
        const key = `${projCode}|${dp}|${ka}`;
        if (existingSet.has(key)) { duplicates.push(`${projCode} ${dp} ${ka}`); continue; }
        newOrders.push(`${projCode} ${dp} ${ka} (${technician}, ${meters}m)`);
        existingSet.add(key);
        await dbPut('orders_rd', { timestamp, projectCode:projCode, dp, street, ka, technician, startDate, endDate, meters, color, incidents, photos, fibers });
    }
    await loadAll();
    await autoUpdateFromRD();
    toast(`✅ ${objs.length} Soplado RD ${t('imported')}`);
    showImportReport('soplado_rd', newOrders, duplicates, []);
}

async function importFusion(objs) {
    const newOrders = [], duplicates = [];
    const existingSet = new Set(ordersFusion.map(o => `${o.projectCode}|${o.dp}`));
    for (const o of objs) {
        const dp = normalizeDP(getFieldValue(o, ['DP','dp','Distribution Point']));
        const projCode = getFieldValue(o, ['Código de Proyecto','Codigo de Proyecto','Project Code']);
        const technician = getFieldValue(o, ['Técnico Responsable','Tecnico Responsable','Técnico','Tecnico']);
        const startDate = getFieldValue(o, ['Fecha de Inicio','Fecha Inicio']);
        const endDate = getFieldValue(o, ['Fecha de Finalización','Fecha Finalizacion']);
        const splices = getFieldValue(o, ['Fusiones realizadas','Fusiones','Splices']);
        const incidents = getFieldValue(o, ['Incidencias (si las hubo)','Incidencias']);
        const photos = getFieldValue(o, ['Fotos del Trabajo','Fotos']);
        const photoRegistry = getFieldValue(o, ['Registro Fotografico','Registro Fotográfico']);
        const timestamp = getFieldValue(o, ['Timestamp','timestamp','Marca temporal']);
        const key = `${projCode}|${dp}`;
        if (existingSet.has(key)) { duplicates.push(`${projCode} ${dp}`); continue; }
        newOrders.push(`${projCode} ${dp} (${technician}, ${splices} fusiones)`);
        existingSet.add(key);
        await dbPut('orders_fusion', { timestamp, projectCode:projCode, dp, technician, startDate, endDate, splices, incidents, photos, photoRegistry });
    }
    await loadAll();
    await autoUpdateFromFusion();
    const fusionDPSet = new Set(ordersFusion.map(o => `${o.projectCode}|${o.dp}`));
    const missing = [];
    goStatus.forEach(g => {
        if (g.spleissenAP?.toUpperCase().includes('GEREED') || g.spleisseDPbereit?.toUpperCase().includes('GEREED')) {
            const client = clients.find(c => c.dp === g.dp);
            const pc = client?.projectCode || '';
            if (pc && !fusionDPSet.has(`${pc}|${g.dp}`)) missing.push(`${pc} ${g.dp}`);
        }
    });
    toast(`✅ ${objs.length} Fusión ${t('imported')}`);
    showImportReport('fusion', newOrders, duplicates, [...new Set(missing)]);
}

async function importGoStatus(objs) {
    await dbClear('go_status');
    for (const o of objs) {
        const keys = Object.keys(o);
        const projKey = keys.find(k => k.toLowerCase().includes('projekt') && k.toLowerCase().includes('nummer')) || keys[0];
        const dpFull = o['DP'] || '';
        const dpProjMatch = dpFull.match(/(QFF-\d+)/i);
        const goProjectCode = dpProjMatch ? dpProjMatch[1].toUpperCase() : '';
        await dbPut('go_status', {
            projektnummer: o[projKey] || '', projekt: o['Projekt'] || '',
            projectCode: goProjectCode,
            dp: normalizeDP(dpFull), dpFull,
            startTiefbau: o['Start Tiefbau'] || '', endeTiefbau: o['Ende Tiefbau'] || '',
            tiefbauFertig: (o[keys.find(k => k.toLowerCase().includes('tiefbau fertig'))] || '').toString(),
            kabelsorte: o['Kabelsorte'] || '',
            einblasenAPDP: o[keys.find(k => k.toLowerCase().includes('einblasen'))] || '',
            spleissenAP: o[keys.find(k => k.toLowerCase().includes('spleißen ap') || k.toLowerCase().includes('spleissen ap'))] || '',
            spleisseDPbereit: o[keys.find(k => k.toLowerCase().includes('spleiße dp') || k.toLowerCase().includes('spleisse dp'))] || '',
        });
    }
    toast(`✅ ${objs.length} GO Status ${t('imported')}`);
}

function findMissingGO(type) {
    const missing = [];
    if (type === 'ra') {
        const raProjects = new Set(ordersRA.map(o => o.projectCode));
        goStatus.forEach(g => {
            if (g.einblasenAPDP?.toUpperCase().includes('GEREED')) {
                const pc = g.projectCode || clients.find(c => c.dp === g.dp)?.projectCode || '';
                if (pc && !raProjects.has(pc)) missing.push(`${pc} ${g.dp}`);
            }
        });
    }
    return [...new Set(missing)];
}

// ===== AUTO STATUS UPDATE =====
async function autoUpdateFromRD() {
    for (const rd of ordersRD) {
        const matching = clients.filter(c => c.dp === rd.dp && c.cableId && c.cableId.includes(rd.ka));
        for (const c of matching) {
            if (c.status === '108') continue;
            if (c.status === '109') {
                const raExists = ordersRA.some(ra => ra.projectCode === rd.projectCode);
                if (raExists) { c.status = '103'; c.phase = 'Spleiße'; await dbPut('clients', c); }
            }
        }
    }
}

async function autoUpdateFromFusion() {
    for (const f of ordersFusion) {
        const matching = clients.filter(c => c.dp === f.dp);
        for (const c of matching) {
            if (c.status === '108') continue;
            if (['109','0'].includes(c.status)) { c.phase = 'Spleiße'; await dbPut('clients', c); }
        }
    }
}

// ===== IMPORT REPORT MODAL =====
function closeImportReport() { document.getElementById('importReportModal').classList.remove('show'); }

function showImportReport(type, newOrders, duplicates, missing) {
    const typeNames = { soplado_ra:'Soplado RA', soplado_rd:'Soplado RD', fusion:'Fusión' };
    document.getElementById('importReportTitle').textContent = `📊 ${t('resultadoImport')} — ${typeNames[type] || type}`;
    const total = newOrders.length + duplicates.length;
    let html = `<div style="display:flex;gap:12px;margin-bottom:16px;padding:14px;background:var(--bg-tertiary);border-radius:var(--radius);border:1px solid var(--border)">
        <div style="text-align:center;flex:1"><div style="font-size:20px;font-weight:800;color:var(--blue)">${total}</div><div style="font-size:11px;color:var(--text-secondary)">Total CSV</div></div>
        <div style="text-align:center;flex:1"><div style="font-size:20px;font-weight:800;color:var(--green)">${newOrders.length}</div><div style="font-size:11px;color:var(--text-secondary)">Nuevas</div></div>
        <div style="text-align:center;flex:1"><div style="font-size:20px;font-weight:800;color:var(--orange)">${duplicates.length}</div><div style="font-size:11px;color:var(--text-secondary)">Duplicadas</div></div>
        <div style="text-align:center;flex:1"><div style="font-size:20px;font-weight:800;color:var(--red)">${missing.length}</div><div style="font-size:11px;color:var(--text-secondary)">Faltan en GO</div></div>
    </div>`;
    const section = (badge, label, items) => {
        let s = `<div class="report-section"><h3><span class="report-badge report-badge-${badge}">${badge === 'new' ? '🆕' : badge === 'dup' ? '⚠️' : '❌'}</span> ${label}: <span class="report-count">${items.length}</span></h3>`;
        if (items.length) { s += '<ul class="report-list">' + items.map(i => `<li>${i}</li>`).join('') + '</ul>'; }
        else { s += '<p style="color:var(--text-tertiary);font-size:12px;margin:4px 0 0 24px">—</p>'; }
        return s + '</div>';
    };
    html += section('new', t('importadas'), newOrders);
    html += section('dup', t('yaExistia'), duplicates);
    if (missing.length) html += section('missing', `${t('faltan')} (${t('gereedEnGO')})`, missing);
    // Incidents
    const allOrders = type === 'soplado_ra' ? ordersRA : type === 'soplado_rd' ? ordersRD : ordersFusion;
    const withIncidents = allOrders.filter(o => o.incidents && o.incidents.trim() !== '');
    if (withIncidents.length) {
        html += `<div class="report-section" style="border-top:1px solid var(--border);padding-top:12px;margin-top:8px"><h3>🚨 Con incidencias: <span class="report-count">${withIncidents.length}</span></h3>`;
        html += '<ul class="report-list">' + withIncidents.map(o => `<li><strong>${o.projectCode} ${o.dp||''}</strong> (${o.technician}): ${o.incidents}</li>`).join('') + '</ul></div>';
    }
    document.getElementById('importReportContent').innerHTML = html;
    document.getElementById('importReportModal').classList.add('show');
}

// ===== CLEAN RECORDS =====
async function deleteOrder(store, id, label) {
    if (!confirm(`¿Eliminar este registro de ${label}?`)) return;
    await dbDelete(store, id);
    await loadAll();
    renderAll();
    toast(`🗑️ Eliminado de ${label}`);
}

async function cleanRARecords() {
    if (!confirm('⚠️ ¿Eliminar TODAS las órdenes de Soplado RA?')) return;
    await dbClear('orders_ra'); ordersRA = []; await loadAll(); renderAll(); toast('✅ Soplado RA eliminadas');
}
async function cleanRDRecords() {
    if (!confirm('⚠️ ¿Eliminar TODAS las órdenes de Soplado RD?')) return;
    await dbClear('orders_rd'); ordersRD = []; await loadAll(); renderAll(); toast('✅ Soplado RD eliminadas');
}
async function cleanFusionRecords() {
    if (!confirm('⚠️ ¿Eliminar TODAS las órdenes de Fusión?')) return;
    await dbClear('orders_fusion'); ordersFusion = []; await loadAll(); renderAll(); toast('✅ Fusión eliminadas');
}

// ===== GO DISCREPANCIES =====
function calculateGODiscrepancies() {
    try {
        const discrepancies = [];
        const goByDP = buildGoByDP();
        ordersRD.forEach(o => {
            if (!o.dp) return;
            const g = goLookup(goByDP, o.projectCode, o.dp);
            if (!g) discrepancies.push({ type:'RD', project:o.projectCode, dp:o.dp, issue:'DP no encontrado en GO' });
            else if (!g.einblasenAPDP?.toUpperCase().includes('GEREED')) discrepancies.push({ type:'RD', project:o.projectCode, dp:o.dp, issue:'Soplado hecho, no GEREED en GO' });
        });
        ordersFusion.forEach(o => {
            if (!o.dp) return;
            const g = goLookup(goByDP, o.projectCode, o.dp);
            if (!g) discrepancies.push({ type:'Fusión', project:o.projectCode, dp:o.dp, issue:'DP no encontrado en GO' });
            else if (!g.spleissenAP?.toUpperCase().includes('GEREED') && !g.spleisseDPbereit?.toUpperCase().includes('GEREED'))
                discrepancies.push({ type:'Fusión', project:o.projectCode, dp:o.dp, issue:'Fusión hecha, no GEREED en GO' });
        });
        goStatus.forEach(g => {
            if (g.einblasenAPDP?.toUpperCase().includes('GEREED') && !ordersRD.some(o => o.dp === g.dp))
                discrepancies.push({ type:'GO→RD', project:g.projekt || g.projektnummer, dp:g.dp, issue:'GEREED pero sin orden RD' });
            if (g.spleissenAP?.toUpperCase().includes('GEREED') && !ordersFusion.some(o => o.dp === g.dp))
                discrepancies.push({ type:'GO→Fusión', project:g.projekt || g.projektnummer, dp:g.dp, issue:'GEREED pero sin orden Fusión' });
        });
        return discrepancies;
    } catch (e) { console.error(e); return []; }
}

// ===== EXPORT =====
function exportData() {
    let csv = '', filename = 'export.csv';
    const activeView = document.querySelector('.view.active')?.id;
    if (activeView === 'view-clients') {
        const h = ['Auftrag','Projektnummer','DP','Straße','Hausnummer','CableID','Contract','Status','Phase'];
        const rows = clients.map(c => [c.auftrag,c.projektnummer,c.dp,c.street,c.hausnummer,c.cableId,c.contract,c.status,c.phase].map(v=>`"${(v||'').toString().replace(/"/g,'""')}"`).join(','));
        csv = [h.join(','), ...rows].join('\n'); filename = 'clients.csv';
    } else if (activeView === 'view-orders') {
        if (currentOrderTab === 'ra') {
            const h = ['Timestamp','Project','Technician','StartDate','EndDate','Fibers','Meters','Color','Incidents'];
            const rows = ordersRA.map(o => [o.timestamp,o.projectCode,o.technician,o.startDate,o.endDate,o.fibers,o.meters,o.color,o.incidents].map(v=>`"${(v||'')}"`).join(','));
            csv = [h.join(','), ...rows].join('\n'); filename = 'orders-ra.csv';
        } else if (currentOrderTab === 'rd') {
            const h = ['Timestamp','Project','DP','Street','KA','Technician','Meters','Color','Fibers'];
            const rows = ordersRD.map(o => [o.timestamp,o.projectCode,o.dp,o.street,o.ka,o.technician,o.meters,o.color,o.fibers].map(v=>`"${(v||'')}"`).join(','));
            csv = [h.join(','), ...rows].join('\n'); filename = 'orders-rd.csv';
        } else {
            const h = ['Timestamp','Project','DP','Technician','Splices','Incidents'];
            const rows = ordersFusion.map(o => [o.timestamp,o.projectCode,o.dp,o.technician,o.splices,o.incidents].map(v=>`"${(v||'')}"`).join(','));
            csv = [h.join(','), ...rows].join('\n'); filename = 'orders-fusion.csv';
        }
    } else { return toast('Selecciona Clientes u Órdenes para exportar'); }
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    toast('📥 ' + filename);
}

// ===== RENDER ALL =====
function renderAll() {
    renderDashboard();
    renderClients();
    renderOrders();
    renderProjects();
    renderInvoicing();
    renderPrices();
    updateClientFilters();
}

// ===== DASHBOARD =====
function renderDashboard() {
    try {
        const uniqueProjects = new Set(clients.map(c => c.projectCode).filter(Boolean));
        const uniqueDPs = new Set(clients.map(c => c.dp).filter(Boolean));

        const el = id => document.getElementById(id);
        const setText = (id, v) => { const e = el(id); if (e) e.textContent = v; };

        setText('totalProjects', uniqueProjects.size);
        setText('totalDPs', uniqueDPs.size);
        setText('totalClients', clients.length);

        // Admin metrics
        const withIncidents = [...ordersRA, ...ordersRD, ...ordersFusion].filter(o => o.incidents && o.incidents.trim() !== '');
        const discrepancies = calculateGODiscrepancies();
        const dpsFused = new Set(ordersFusion.map(o => o.dp).filter(Boolean));
        const dpsBlown = new Set(ordersRD.map(o => o.dp).filter(Boolean));
        const readyToCertify = [...dpsFused].filter(dp => dpsBlown.has(dp)).length;

        setText('pendingReview', withIncidents.length);
        setText('goDiscrepancies', discrepancies.length);
        setText('readyToCertify', readyToCertify);
        setText('projectsTrend', `${ordersRA.length} RA cargados`);
        setText('dpsTrend', `${ordersRD.length} RD + ${ordersFusion.length} Fusión`);
        setText('clientsTrend', `${goStatus.length} en GO`);

        // Alerts
        const alertsEl = el('adminAlerts');
        if (alertsEl) {
            const alerts = [];
            const totalOrders = ordersRA.length + ordersRD.length + ordersFusion.length;
            if (totalOrders > 15) alerts.push({ type:'warning', msg:`⚠️ ${totalOrders} órdenes pendientes de revisión` });
            const noPhotos = ordersRD.filter(o => !o.photos || o.photos === '');
            if (noPhotos.length > 0) alerts.push({ type:'warning', msg:`📷 ${noPhotos.length} órdenes sin fotos` });
            if (discrepancies.length > 0) alerts.push({ type:'', msg:`🚨 ${discrepancies.length} discrepancias con GO FiberConnect` });
            alertsEl.innerHTML = alerts.map(a => `<div class="alert-item ${a.type}">${a.msg}</div>`).join('');
        }

        // Status overview
        renderStatusOverview();
        renderActivityFeed();
        renderDashboardProjects();
        renderProductivityGrid();
    } catch (e) { console.error('Dashboard error:', e); }
}

function renderStatusOverview() {
    const el = document.getElementById('statusOverview');
    if (!el) return;
    el.innerHTML = `
        <div class="status-card"><div class="status-value" style="color:var(--blue)">${ordersRA.length}</div><div class="status-label">Soplado RA</div></div>
        <div class="status-card"><div class="status-value" style="color:var(--cyan)">${ordersRD.length}</div><div class="status-label">Soplado RD</div></div>
        <div class="status-card"><div class="status-value" style="color:var(--orange)">${ordersFusion.length}</div><div class="status-label">Fusión</div></div>
        <div class="status-card"><div class="status-value" style="color:var(--green)">${[...new Set(ordersFusion.map(o=>o.dp).filter(Boolean))].filter(dp => new Set(ordersRD.map(o=>o.dp).filter(Boolean)).has(dp)).length}</div><div class="status-label">Listos Cert.</div></div>
    `;
}

function renderActivityFeed() {
    const feedEl = document.getElementById('activityFeed');
    if (!feedEl) return;
    const activities = [];
    ordersRA.forEach(o => { if (o.timestamp || o.startDate) activities.push({ action:`📋 RA: ${o.projectCode} — ${o.technician} (${o.meters}m)`, time: o.timestamp || o.startDate }); });
    ordersRD.forEach(o => { if (o.timestamp || o.startDate) activities.push({ action:`📋 RD: ${o.projectCode} ${o.dp} — ${o.technician} (${o.meters}m)`, time: o.timestamp || o.startDate }); });
    ordersFusion.forEach(o => { if (o.timestamp || o.startDate) activities.push({ action:`🔗 Fusión: ${o.projectCode} ${o.dp} — ${o.technician}`, time: o.timestamp || o.startDate }); });
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const latest = activities.slice(0, 10);
    feedEl.innerHTML = latest.length
        ? latest.map(a => `<div class="activity-item"><div>${a.action}</div><div class="activity-time">${a.time}</div></div>`).join('')
        : '<p style="color:var(--text-tertiary);text-align:center;padding:20px">Sin actividad reciente</p>';
}

function renderDashboardProjects() {
    const grid = document.getElementById('dashProjectsGrid');
    if (!grid) return;
    const projMap = buildProjectMap();
    const goByDP = buildGoByDP();
    let html = '';
    Object.entries(projMap).sort((a,b) => a[0].localeCompare(b[0])).forEach(([code, data]) => {
        const fertigPct = data.total ? Math.round(data.statusCounts['Fertig'] / data.total * 100) : 0;
        const colors = { '108':'var(--red)', '109':'var(--blue)', '103':'var(--yellow)', '100':'var(--orange)', '0':'var(--text-tertiary)', 'Fertig':'var(--green)' };
        let barHtml = '';
        for (const [s, cnt] of Object.entries(data.statusCounts)) {
            if (cnt > 0) barHtml += `<div style="width:${(cnt/data.total*100).toFixed(1)}%;background:${colors[s]}"></div>`;
        }
        let blowDone = 0, spliceDone = 0;
        data.dps.forEach(dp => {
            const g = goLookup(goByDP, code, dp);
            if (g?.einblasenAPDP?.toUpperCase().includes('GEREED')) blowDone++;
            if (g?.spleissenAP?.toUpperCase().includes('GEREED')) spliceDone++;
        });
        html += `<div class="project-card" onclick="document.querySelector('[data-view=projects]').click()">
            <h3>${code} <span style="font-size:12px;color:var(--text-tertiary)">${fertigPct}%</span></h3>
            <div class="project-stat"><span>DPs</span><span>${data.dps.size}</span></div>
            <div class="project-stat"><span>Clientes</span><span>${data.total}</span></div>
            <div class="project-stat"><span>${t('blowingDone')}</span><span>${blowDone}/${data.dps.size}</span></div>
            <div class="project-stat"><span>${t('splicingAP')}</span><span>${spliceDone}/${data.dps.size}</span></div>
            <div class="status-bar">${barHtml}</div>
            <div class="progress-bar"><div class="progress-fill" style="width:${fertigPct}%;background:var(--green)"></div></div>
        </div>`;
    });
    grid.innerHTML = html || '<p style="color:var(--text-tertiary);text-align:center;padding:40px">No hay proyectos. Importa un CSV para comenzar.</p>';
}

function renderProductivityGrid() {
    const gridEl = document.getElementById('productivityGrid');
    if (!gridEl) return;
    const techStats = {};
    ordersRA.forEach(o => { const t = o.technician || '?'; if (!techStats[t]) techStats[t] = { orders:0, ra:0, rd:0, fusion:0, meters:0, splices:0 }; techStats[t].orders++; techStats[t].ra++; techStats[t].meters += parseFloat(o.meters) || 0; });
    ordersRD.forEach(o => { const t = o.technician || '?'; if (!techStats[t]) techStats[t] = { orders:0, ra:0, rd:0, fusion:0, meters:0, splices:0 }; techStats[t].orders++; techStats[t].rd++; techStats[t].meters += parseFloat(o.meters) || 0; });
    ordersFusion.forEach(o => { const t = o.technician || '?'; if (!techStats[t]) techStats[t] = { orders:0, ra:0, rd:0, fusion:0, meters:0, splices:0 }; techStats[t].orders++; techStats[t].fusion++; techStats[t].splices += parseFloat(o.splices) || 0; });
    if (!Object.keys(techStats).length) { gridEl.innerHTML = '<p style="color:var(--text-tertiary);text-align:center;grid-column:1/-1;padding:20px">Sin datos de técnicos</p>'; return; }
    gridEl.innerHTML = Object.entries(techStats).map(([tech, s]) => {
        const prod = s.orders > 15 ? 'Alta' : s.orders > 8 ? 'Media' : 'Baja';
        const prodColor = s.orders > 15 ? 'var(--green)' : s.orders > 8 ? 'var(--orange)' : 'var(--red)';
        return `<div class="tech-card">
            <div class="tech-name">${tech}</div>
            <div class="tech-stats">
                <div class="tech-stat"><span>Total</span><span style="color:var(--green);font-weight:700">${s.orders}</span></div>
                <div class="tech-stat"><span>Produc.</span><span style="color:${prodColor};font-weight:700">${prod}</span></div>
                <div class="tech-stat"><span>RA</span><span>${s.ra}</span></div>
                <div class="tech-stat"><span>RD</span><span>${s.rd}</span></div>
                <div class="tech-stat"><span>Fusión</span><span>${s.fusion}</span></div>
                <div class="tech-stat"><span>Metros</span><span>${s.meters.toFixed(0)}</span></div>
            </div>
        </div>`;
    }).join('');
}

// ===== CLIENTS =====
function updateClientFilters() {
    const projs = [...new Set(clients.map(c => c.projectCode).filter(Boolean))].sort();
    const dps = [...new Set(clients.map(c => c.dp).filter(Boolean))].sort();
    const pSel = document.getElementById('clientFilterProject');
    const dSel = document.getElementById('clientFilterDP');
    if (!pSel || !dSel) return;
    const pv = pSel.value, dv = dSel.value;
    pSel.innerHTML = '<option value="">Todos Proyectos</option>' + projs.map(p => `<option value="${p}">${p}</option>`).join('');
    dSel.innerHTML = '<option value="">Todos DP</option>' + dps.map(d => `<option value="${d}">${d}</option>`).join('');
    pSel.value = pv; dSel.value = dv;
}

function sortClients(field) {
    if (clientSort.field === field) clientSort.dir *= -1;
    else { clientSort.field = field; clientSort.dir = 1; }
    renderClients();
}

function renderClients() {
    const search = (document.getElementById('clientSearch')?.value || '').toLowerCase();
    const fp = document.getElementById('clientFilterProject')?.value || '';
    const fd = document.getElementById('clientFilterDP')?.value || '';
    const fs = document.getElementById('clientFilterStatus')?.value || '';
    let filtered = clients.filter(c => {
        if (search && !`${c.auftrag} ${c.dp} ${c.street} ${c.hausnummer} ${c.cableId}`.toLowerCase().includes(search)) return false;
        if (fp && c.projectCode !== fp) return false;
        if (fd && c.dp !== fd) return false;
        if (fs && c.status !== fs) return false;
        return true;
    });
    const f = clientSort.field;
    filtered.sort((a, b) => {
        const va = a[f] || ''; const vb = b[f] || '';
        return va.localeCompare(vb) * clientSort.dir;
    });
    const tbody = document.getElementById('clientsBody');
    if (!tbody) return;
    tbody.innerHTML = filtered.length ? filtered.map(c => {
        const addr = `${c.street} ${c.hausnummer}${c.hausnummerZusatz ? ' '+c.hausnummerZusatz : ''}`;
        return `<tr>
            <td style="font-size:11px">${c.auftrag}</td>
            <td><strong>${c.dp}</strong></td>
            <td>${addr}</td>
            <td style="font-size:11px">${c.cableId}</td>
            <td><span class="badge badge-${c.contract}">${c.contract}</span></td>
            <td><span class="badge badge-${c.status}">${c.status}</span></td>
            <td style="font-size:12px">${c.phase}</td>
        </tr>`;
    }).join('') : `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-tertiary)">${t('noData')}</td></tr>`;
    const countEl = document.getElementById('clientCount');
    if (countEl) countEl.textContent = `${filtered.length} / ${clients.length} clientes`;
}

// ===== ORDERS =====
function switchOrderTab(tab) {
    currentOrderTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-'+tab));
}

function applyOrderFilters() {
    orderFilters.search = (document.getElementById('orderSearch')?.value || '').toLowerCase();
    orderFilters.technician = document.getElementById('filterTechnician')?.value || '';
    orderFilters.project = document.getElementById('filterProject')?.value || '';
    renderOrders();
}

function filterOrders(orders) {
    return orders.filter(o => {
        if (orderFilters.technician && o.technician !== orderFilters.technician) return false;
        if (orderFilters.project && o.projectCode !== orderFilters.project) return false;
        if (orderFilters.search) {
            const hay = `${o.projectCode} ${o.dp || ''} ${o.technician} ${o.street || ''} ${o.ka || ''}`.toLowerCase();
            if (!hay.includes(orderFilters.search)) return false;
        }
        return true;
    });
}

function renderPhotoLinks(photosStr) {
    if (!photosStr || photosStr.trim() === '' || photosStr === 'https://drive.google.com/') return '<span style="color:var(--text-tertiary)">—</span>';
    return photosStr.split(',').map(url => {
        url = url.trim();
        if (!url) return '';
        const display = url.length > 35 ? url.substring(0, 32) + '...' : url;
        return `<a href="${url}" target="_blank">${display}</a>`;
    }).filter(Boolean).join('');
}

function toggleOrderDetail(tr, type, index) {
    const existing = tr.nextElementSibling;
    if (existing && existing.classList.contains('order-detail-row')) { existing.remove(); return; }
    tr.closest('tbody').querySelectorAll('.order-detail-row').forEach(r => r.remove());
    const orders = type === 'ra' ? filterOrders(ordersRA) : type === 'rd' ? filterOrders(ordersRD) : filterOrders(ordersFusion);
    const o = orders[index];
    if (!o) return;
    const colspan = type === 'ra' ? 9 : type === 'rd' ? 10 : 7;
    const df = (l, v) => `<div><div class="detail-label">${l}</div><div class="detail-value">${v || '—'}</div></div>`;
    let fields = '';
    if (type === 'ra') {
        fields = df('Timestamp', o.timestamp) + df('Proyecto', o.projectCode) + df('Técnico', o.technician)
            + df('Período', `${o.startDate || '?'} → ${o.endDate || '?'}`) + df('Fibras', o.fibers) + df('Metros', o.meters)
            + (o.incidents ? `<div><div class="detail-label">Incidencias</div><div class="detail-value detail-incident">${o.incidents}</div></div>` : '')
            + `<div class="detail-photos"><div class="detail-label">Fotos</div>${renderPhotoLinks(o.photos)}</div>`;
    } else if (type === 'rd') {
        fields = df('Timestamp', o.timestamp) + df('Proyecto', o.projectCode) + df('DP', o.dp) + df('Calle', o.street) + df('KA', o.ka)
            + df('Técnico', o.technician) + df('Metros', o.meters) + df('Color', o.color)
            + (o.incidents ? `<div><div class="detail-label">Incidencias</div><div class="detail-value detail-incident">${o.incidents}</div></div>` : '')
            + `<div class="detail-photos"><div class="detail-label">Fotos</div>${renderPhotoLinks(o.photos)}</div>`;
    } else {
        fields = df('Timestamp', o.timestamp) + df('Proyecto', o.projectCode) + df('DP', o.dp) + df('Técnico', o.technician)
            + df('Fusiones', o.splices)
            + (o.incidents ? `<div><div class="detail-label">Incidencias</div><div class="detail-value detail-incident">${o.incidents}</div></div>` : '')
            + `<div class="detail-photos"><div class="detail-label">Fotos</div>${renderPhotoLinks(o.photos)}</div>`
            + `<div class="detail-photos"><div class="detail-label">Registro</div>${renderPhotoLinks(o.photoRegistry)}</div>`;
    }
    const row = document.createElement('tr');
    row.className = 'order-detail-row';
    row.innerHTML = `<td colspan="${colspan}"><div class="order-detail-content">${fields}</div></td>`;
    tr.after(row);
}

function renderOrders() {
    // Update filter dropdowns
    const techs = new Set(), projs = new Set();
    [...ordersRA, ...ordersRD, ...ordersFusion].forEach(o => {
        if (o.technician) techs.add(o.technician);
        if (o.projectCode) projs.add(o.projectCode);
    });
    const techSel = document.getElementById('filterTechnician');
    const projSel = document.getElementById('filterProject');
    if (techSel) { const v = techSel.value; techSel.innerHTML = '<option value="">Todos Técnicos</option>' + [...techs].sort().map(t => `<option value="${t}">${t}</option>`).join(''); techSel.value = v; }
    if (projSel) { const v = projSel.value; projSel.innerHTML = '<option value="">Todos Proyectos</option>' + [...projs].sort().map(p => `<option value="${p}">${p}</option>`).join(''); projSel.value = v; }

    // Tab counts
    const setText = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    setText('countRA', ordersRA.length);
    setText('countRD', ordersRD.length);
    setText('countFusion', ordersFusion.length);

    const fRA = filterOrders(ordersRA);
    const fRD = filterOrders(ordersRD);
    const fFusion = filterOrders(ordersFusion);
    const noData = `<tr><td colspan="10" style="text-align:center;padding:30px;color:var(--text-tertiary)">${t('noData')}</td></tr>`;
    const delBtn = (store, id, label) => `<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();deleteOrder('${store}',${id},'${label}')">🗑️</button>`;

    document.getElementById('raBody').innerHTML = fRA.length ? fRA.map((o, i) => `<tr class="order-row" onclick="toggleOrderDetail(this,'ra',${i})">
        <td>${o.startDate || o.timestamp}</td><td>${o.projectCode}</td><td>${o.dp||'-'}</td><td>${o.technician}</td>
        <td>${o.fibers}</td><td>${o.meters}</td><td>${o.color}</td><td style="font-size:11px">${o.incidents||'-'}</td>
        <td>${delBtn('orders_ra',o.id,'Soplado RA')}</td></tr>`).join('') : noData;

    document.getElementById('rdBody').innerHTML = fRD.length ? fRD.map((o, i) => `<tr class="order-row" onclick="toggleOrderDetail(this,'rd',${i})">
        <td>${o.startDate || o.timestamp}</td><td>${o.projectCode}</td><td>${o.dp}</td><td style="font-size:12px">${o.street}</td>
        <td>${o.ka}</td><td>${o.technician}</td><td>${o.meters}</td><td>${o.color}</td><td>${o.fibers}</td>
        <td>${delBtn('orders_rd',o.id,'Soplado RD')}</td></tr>`).join('') : noData;

    document.getElementById('fusionBody').innerHTML = fFusion.length ? fFusion.map((o, i) => `<tr class="order-row" onclick="toggleOrderDetail(this,'fusion',${i})">
        <td>${o.startDate || o.timestamp}</td><td>${o.projectCode}</td><td>${o.dp}</td>
        <td>${o.technician}</td><td>${o.splices}</td><td style="font-size:11px">${o.incidents||'-'}</td>
        <td>${delBtn('orders_fusion',o.id,'Fusión')}</td></tr>`).join('') : noData;
}

// ===== ORDER MODAL =====
function openOrderModal(type) {
    editingOrderType = type;
    const modal = document.getElementById('orderModal');
    const title = type === 'ra' ? 'Soplado RA' : type === 'rd' ? 'Soplado RD' : 'Fusión';
    document.getElementById('orderModalTitle').textContent = '+ ' + title;
    const fg = (id, label, type='text', ph='') => `<div class="form-group"><label>${label}</label><input type="${type}" id="om_${id}" placeholder="${ph}"></div>`;
    let html = '';
    if (type === 'ra') {
        html = `<div class="form-row">${fg('projectCode','Proyecto','text','QFF-001')}${fg('technician','Técnico')}</div>
            <div class="form-row">${fg('startDate','Fecha Inicio','date')}${fg('endDate','Fecha Fin','date')}</div>
            <div class="form-row">${fg('fibers','Fibras','number')}${fg('meters','Metros','number')}</div>
            ${fg('color','Color Miniducto')}${fg('incidents','Incidencias')}${fg('photos','Fotos (URLs)')}`;
    } else if (type === 'rd') {
        html = `<div class="form-row">${fg('projectCode','Proyecto','text','QFF-001')}${fg('dp','DP','text','DP055')}</div>
            <div class="form-row">${fg('street','Calle')}${fg('ka','KA Cliente','text','KA28')}</div>
            <div class="form-row">${fg('technician','Técnico')}${fg('meters','Metros','number')}</div>
            <div class="form-row">${fg('startDate','Fecha Inicio','date')}${fg('endDate','Fecha Fin','date')}</div>
            <div class="form-row">${fg('color','Color')}${fg('fibers','Fibras','number')}</div>
            ${fg('incidents','Incidencias')}${fg('photos','Fotos (URLs)')}`;
    } else {
        html = `<div class="form-row">${fg('projectCode','Proyecto','text','QFF-002')}${fg('dp','DP','text','DP030')}</div>
            <div class="form-row">${fg('technician','Técnico')}${fg('splices','Fusiones','number')}</div>
            <div class="form-row">${fg('startDate','Fecha Inicio','date')}${fg('endDate','Fecha Fin','date')}</div>
            ${fg('incidents','Incidencias')}${fg('photos','Fotos (URLs)')}${fg('photoRegistry','Registro Fotográfico')}`;
    }
    document.getElementById('orderModalFields').innerHTML = html;
    modal.classList.add('show');
}

function closeOrderModal() { document.getElementById('orderModal').classList.remove('show'); }

async function saveOrderFromModal() {
    const g = id => (document.getElementById('om_'+id)?.value || '').trim();
    const type = editingOrderType;
    const today = new Date().toISOString().split('T')[0];
    if (type === 'ra') {
        await dbPut('orders_ra', { timestamp:today, projectCode:g('projectCode'), technician:g('technician'), startDate:g('startDate'), endDate:g('endDate'), fibers:g('fibers'), meters:g('meters'), color:g('color'), incidents:g('incidents'), photos:g('photos') });
    } else if (type === 'rd') {
        await dbPut('orders_rd', { timestamp:today, projectCode:g('projectCode'), dp:normalizeDP(g('dp')), street:g('street'), ka:g('ka'), technician:g('technician'), startDate:g('startDate'), endDate:g('endDate'), meters:g('meters'), color:g('color'), incidents:g('incidents'), photos:g('photos'), fibers:g('fibers') });
    } else {
        await dbPut('orders_fusion', { timestamp:today, projectCode:g('projectCode'), dp:normalizeDP(g('dp')), technician:g('technician'), startDate:g('startDate'), endDate:g('endDate'), splices:g('splices'), incidents:g('incidents'), photos:g('photos'), photoRegistry:g('photoRegistry') });
    }
    await loadAll();
    if (type === 'rd') await autoUpdateFromRD();
    if (type === 'fusion') await autoUpdateFromFusion();
    await loadAll();
    renderAll();
    closeOrderModal();
    toast('✅ Orden guardada');
}

// ===== PROJECTS =====
window.navigateTo = function(view) {
    const navItem = document.querySelector(`[data-view="${view}"]`);
    if (navItem) navItem.click();
};

window.toggleProject = function(code) {
    if (expandedProjects.has(code)) expandedProjects.delete(code);
    else expandedProjects.add(code);
    renderProjects();
}

window.filterDPTable = function(safeCode) {
    const search = (document.getElementById(`dpSearch_${safeCode}`)?.value || '').toLowerCase();
    const blowF = document.getElementById(`dpFilterBlow_${safeCode}`)?.value || '';
    const spliceAPF = document.getElementById(`dpFilterSpliceAP_${safeCode}`)?.value || '';
    const spliceDPF = document.getElementById(`dpFilterSpliceDP_${safeCode}`)?.value || '';
    const statusF = document.getElementById(`dpFilterStatus_${safeCode}`)?.value || '';
    const tbody = document.getElementById(`dpTableBody_${safeCode}`);
    if (!tbody) return;
    let visible = 0, total = 0;
    tbody.querySelectorAll('tr').forEach(tr => {
        total++;
        const dp = tr.dataset.dp || '';
        const matchSearch = !search || dp.toLowerCase().includes(search);
        const matchBlow = !blowF || tr.dataset.blow === blowF;
        const matchSpliceAP = !spliceAPF || tr.dataset.spliceap === spliceAPF;
        const matchSpliceDP = !spliceDPF || tr.dataset.splicedp === spliceDPF;
        const matchStatus = !statusF || tr.dataset.status === statusF;
        const show = matchSearch && matchBlow && matchSpliceAP && matchSpliceDP && matchStatus;
        tr.style.display = show ? '' : 'none';
        if (show) visible++;
    });
    const countEl = document.getElementById(`dpCount_${safeCode}`);
    if (countEl) countEl.textContent = (blowF || spliceAPF || spliceDPF || statusF || search) ? `${visible}/${total} DPs` : `${total} DPs`;
}

function buildProjectMap() {
    const projMap = {};
    clients.forEach(c => {
        if (!c.projectCode) return;
        if (!projMap[c.projectCode]) projMap[c.projectCode] = { total:0, dps: new Set(), statusCounts: {'108':0,'109':0,'103':0,'100':0,'0':0,'Fertig':0} };
        projMap[c.projectCode].total++;
        projMap[c.projectCode].dps.add(c.dp);
        const s = c.status in projMap[c.projectCode].statusCounts ? c.status : '0';
        projMap[c.projectCode].statusCounts[s]++;
    });
    return projMap;
}

function buildGoByDP() {
    const goByDP = {};
    goStatus.forEach(g => {
        // Key by projectCode|dp if available, and also by just dp as fallback
        if (g.projectCode) {
            goByDP[`${g.projectCode}|${g.dp}`] = g;
        }
        // Fallback: only set if no collision (don't overwrite)
        if (!goByDP[g.dp]) goByDP[g.dp] = g;
    });
    return goByDP;
}
function goLookup(goByDP, projectCode, dp) {
    return goByDP[`${projectCode}|${dp}`] || goByDP[dp] || null;
}

function renderProjects() {
    const projMap = buildProjectMap();
    const goByDP = buildGoByDP();
    let html = '';

    Object.entries(projMap).sort((a,b) => a[0].localeCompare(b[0])).forEach(([code, data]) => {
        const isExpanded = expandedProjects.has(code);
        const fertigPct = data.total ? Math.round(data.statusCounts['Fertig'] / data.total * 100) : 0;
        const colors = { '108':'var(--red)', '109':'var(--blue)', '103':'var(--yellow)', '100':'var(--orange)', '0':'var(--text-tertiary)', 'Fertig':'var(--green)' };
        let barHtml = '';
        for (const [s, cnt] of Object.entries(data.statusCounts)) {
            if (cnt > 0) barHtml += `<div style="width:${(cnt/data.total*100).toFixed(1)}%;background:${colors[s]}" title="${s}: ${cnt}"></div>`;
        }

        let blowDone = 0, spliceAPDone = 0, spliceDPDone = 0;
        data.dps.forEach(dp => {
            const g = goLookup(goByDP, code, dp);
            if (g?.einblasenAPDP?.toUpperCase().includes('GEREED')) blowDone++;
            if (g?.spleissenAP?.toUpperCase().includes('GEREED')) spliceAPDone++;
            if (g?.spleisseDPbereit?.toUpperCase().includes('GEREED')) spliceDPDone++;
        });

        const raCount = ordersRA.filter(o => o.projectCode === code).length;
        const rdCount = ordersRD.filter(o => o.projectCode === code).length;
        const fusionCount = ordersFusion.filter(o => o.projectCode === code).length;

        let dpTableHtml = '';
        if (isExpanded) {
            const sortedDPs = [...data.dps].sort();
            const safeCode = code.replace(/[^a-zA-Z0-9_-]/g,'');
            let dpRows = '';
            for (const dp of sortedDPs) {
                const g = goLookup(goByDP, code, dp);
                const blowOK = g?.einblasenAPDP?.toUpperCase().includes('GEREED');
                const spliceAPOK = g?.spleissenAP?.toUpperCase().includes('GEREED');
                const spliceDPOK = g?.spleisseDPbereit?.toUpperCase().includes('GEREED');
                const hasRA = ordersRA.some(o => o.projectCode === code);
                const hasRD = ordersRD.some(o => o.projectCode === code && normalizeDP(o.dp) === normalizeDP(dp));
                const hasFusion = ordersFusion.some(o => o.projectCode === code && normalizeDP(o.dp) === normalizeDP(dp));
                let orderIcons = '';
                if (hasRA) orderIcons += '📋RA ';
                if (hasRD) orderIcons += '📋RD ';
                if (hasFusion) orderIcons += '📋Fusión ';
                if (!orderIcons) orderIcons = '-';
                const allGO = blowOK && spliceAPOK && spliceDPOK;
                const anyGO = blowOK || spliceAPOK || spliceDPOK;
                const anyWork = hasRA || hasRD || hasFusion;
                const rowClass = allGO ? 'dp-row-green' : (anyGO || anyWork) ? 'dp-row-yellow' : 'dp-row-red';
                const statusVal = allGO ? 'en-go' : anyGO ? 'parcial' : anyWork ? 'falta-go' : 'pendiente';
                const statusHtml = allGO ? '✅ En GO' : anyGO ? '🔄 Parcial' : anyWork ? '⚠️ Falta GO' : '⏳ Pendiente';
                const blowVal = blowOK ? 'ok' : hasRA ? 'parcial' : 'no';
                const spliceAPVal = spliceAPOK ? 'ok' : hasFusion ? 'parcial' : 'no';
                const spliceDPVal = spliceDPOK ? 'ok' : 'no';
                dpRows += `<tr class="${rowClass}" data-dp="${dp}" data-blow="${blowVal}" data-spliceap="${spliceAPVal}" data-splicedp="${spliceDPVal}" data-status="${statusVal}"><td><strong>${dp}</strong></td><td>${blowOK?'✅':hasRA?'🟡':'❌'}</td><td>${spliceAPOK?'✅':hasFusion?'🟡':'❌'}</td><td>${spliceDPOK?'✅':'❌'}</td><td>${orderIcons}</td><td>${statusHtml}</td></tr>`;
            }
            const filterBar = `<div class="dp-filter-bar" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px;padding:8px 0;">
                <input type="text" id="dpSearch_${safeCode}" placeholder="🔍 Buscar DP..." oninput="filterDPTable('${safeCode}')" style="background:var(--bg-tertiary);border:1px solid var(--border);color:var(--text-primary);padding:6px 10px;border-radius:8px;font-size:12px;width:120px;">
                <select id="dpFilterBlow_${safeCode}" onchange="filterDPTable('${safeCode}')" style="background:var(--bg-tertiary);border:1px solid var(--border);color:var(--text-primary);padding:6px 8px;border-radius:8px;font-size:12px;">
                    <option value="">Soplado: Todos</option><option value="ok">✅ GEREED</option><option value="parcial">🟡 Parcial</option><option value="no">❌ No</option>
                </select>
                <select id="dpFilterSpliceAP_${safeCode}" onchange="filterDPTable('${safeCode}')" style="background:var(--bg-tertiary);border:1px solid var(--border);color:var(--text-primary);padding:6px 8px;border-radius:8px;font-size:12px;">
                    <option value="">Fusión AP: Todos</option><option value="ok">✅ GEREED</option><option value="parcial">🟡 Parcial</option><option value="no">❌ No</option>
                </select>
                <select id="dpFilterSpliceDP_${safeCode}" onchange="filterDPTable('${safeCode}')" style="background:var(--bg-tertiary);border:1px solid var(--border);color:var(--text-primary);padding:6px 8px;border-radius:8px;font-size:12px;">
                    <option value="">Fusión DP: Todos</option><option value="ok">✅ GEREED</option><option value="no">❌ No</option>
                </select>
                <select id="dpFilterStatus_${safeCode}" onchange="filterDPTable('${safeCode}')" style="background:var(--bg-tertiary);border:1px solid var(--border);color:var(--text-primary);padding:6px 8px;border-radius:8px;font-size:12px;">
                    <option value="">Status: Todos</option><option value="en-go">✅ En GO</option><option value="parcial">🔄 Parcial</option><option value="falta-go">⚠️ Falta GO</option><option value="pendiente">⏳ Pendiente</option>
                </select>
                <span id="dpCount_${safeCode}" style="font-size:11px;color:var(--text-secondary);margin-left:auto;"></span>
            </div>`;
            dpTableHtml = `<div class="dp-table-container">${filterBar}<table><thead><tr><th>${t('dpNumber')}</th><th>${t('sopladoRA')}</th><th>${t('fusionAP')}</th><th>${t('fusionDP')}</th><th>${t('ordenesCargadas')}</th><th>${t('statusCol')}</th></tr></thead><tbody id="dpTableBody_${safeCode}">${dpRows}</tbody></table></div>`;
        }

        html += `<div class="project-card${isExpanded ? ' expanded' : ''}" onclick="toggleProject('${code}')">
            <h3>${code} <span style="font-size:12px;font-weight:500;color:var(--text-tertiary)">${isExpanded ? '▲' : '▼'}</span></h3>
            <div class="project-stat"><span>DPs</span><span>${data.dps.size}</span></div>
            <div class="project-stat"><span>Clientes</span><span>${data.total}</span></div>
            <div class="status-bar">${barHtml}</div>
            <div class="project-stat"><span>${t('blowingDone')} (GO)</span><span>${blowDone}/${data.dps.size}</span></div>
            <div class="project-stat"><span>${t('splicingAP')} (GO)</span><span>${spliceAPDone}/${data.dps.size}</span></div>
            <div class="project-stat"><span>${t('splicingDP')} (GO)</span><span>${spliceDPDone}/${data.dps.size}</span></div>
            <div style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px">
                <div class="project-stat"><span>Soplado RA</span><span>${raCount}</span></div>
                <div class="project-stat"><span>Soplado RD</span><span>${rdCount}</span></div>
                <div class="project-stat"><span>Fusión</span><span>${fusionCount}</span></div>
            </div>
            <div class="project-stat" style="margin-top:8px"><span>Fertig</span><span style="color:var(--green)">${data.statusCounts['Fertig']} (${fertigPct}%)</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width:${fertigPct}%;background:var(--green)"></div></div>
            ${isExpanded ? dpTableHtml : `<div class="dp-expand-hint">${t('clickExpandir')}</div>`}
        </div>`;
    });

    document.getElementById('projectsGrid').innerHTML = html || `<p style="color:var(--text-tertiary);text-align:center;padding:40px">${t('noData')} — Importa un CSV de clientes para ver proyectos.</p>`;
}

// ===== INVOICING =====
function renderInvoicing() {
    const certNotInv = legacyOrders.filter(o => o.status === 'certified');
    const invoiced = legacyOrders.filter(o => o.status === 'invoiced');
    const totalOrders = ordersRD.length + ordersRA.length + ordersFusion.length;

    document.getElementById('invoiceTotals').innerHTML = `
        <div class="invoice-total-card"><div class="invoice-total-value" style="color:var(--purple)">${certNotInv.length}</div><div class="invoice-total-label">${t('certNotInv')}</div></div>
        <div class="invoice-total-card"><div class="invoice-total-value" style="color:var(--green)">${invoiced.length}</div><div class="invoice-total-label">${t('totalInvoiced')}</div></div>
        <div class="invoice-total-card"><div class="invoice-total-value" style="color:var(--blue)">${totalOrders}</div><div class="invoice-total-label">Total Órdenes</div></div>
        <div class="invoice-total-card"><div class="invoice-total-value" style="color:var(--cyan)">${clients.length}</div><div class="invoice-total-label">Clientes</div></div>
    `;

    const tbody = document.getElementById('invoiceBody');
    tbody.innerHTML = certNotInv.length ? certNotInv.map(o => `<tr>
        <td class="check-col"><input type="checkbox" class="inv-check" data-id="${o.id}"></td>
        <td>${o.project||''}</td><td>${o.address||''}</td><td>${o.units||1}</td>
        <td><span class="badge badge-certified">Certificado</span></td><td>${o.certified_date||''}</td>
    </tr>`).join('') : `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-tertiary)">Sin órdenes certificadas pendientes</td></tr>`;

    document.querySelectorAll('.inv-check').forEach(cb => cb.addEventListener('change', () => {
        document.getElementById('markInvoicedBtn').style.display = document.querySelectorAll('.inv-check:checked').length > 0 ? '' : 'none';
    }));
}

function toggleAllInv(master) {
    document.querySelectorAll('.inv-check').forEach(cb => cb.checked = master.checked);
    document.getElementById('markInvoicedBtn').style.display = document.querySelectorAll('.inv-check:checked').length > 0 ? '' : 'none';
}

async function markInvoiced() {
    const ids = [...document.querySelectorAll('.inv-check:checked')].map(cb => parseInt(cb.dataset.id));
    if (!ids.length) return;
    const invNum = prompt('Nº Factura:');
    if (!invNum) return;
    for (const id of ids) {
        const o = legacyOrders.find(x => x.id === id);
        if (o) { o.status = 'invoiced'; o.invoice_number = invNum; await dbPut('orders', o); }
    }
    await loadAll(); renderAll();
    toast(`✅ ${ids.length} marcados como facturados`);
}

// ===== PRICES =====
function renderPrices() {
    const search = (document.getElementById('priceSearch')?.value || '').toLowerCase();
    const catFilter = document.getElementById('priceCatFilter')?.value || '';
    let filtered = PRICE_LIST.filter(p => {
        if (catFilter && p.cat !== catFilter) return false;
        if (search) {
            const hay = `${p.code} ${p.desc} ${p.descDe}`.toLowerCase();
            if (!hay.includes(search)) return false;
        }
        return true;
    });
    let totalMarginPct = 0, count = 0;
    document.getElementById('pricesBody').innerHTML = filtered.map(p => {
        const margin = p.sale - p.cost;
        const pct = p.sale > 0 ? margin / p.sale * 100 : 0;
        if (p.cost > 0) { totalMarginPct += pct; count++; }
        const color = pct >= 50 ? 'var(--green)' : pct >= 30 ? 'var(--yellow)' : 'var(--orange)';
        const d = lang === 'de' ? (p.descDe || p.desc) : p.desc;
        return `<tr>
            <td><strong>${p.code}</strong></td><td>${d}</td><td>${p.unit}</td>
            <td style="text-align:right">${p.sale.toFixed(2)}</td>
            <td style="text-align:right">${p.cost > 0 ? p.cost.toFixed(2) : '—'}</td>
            <td style="text-align:right;color:${color}">${p.cost > 0 ? margin.toFixed(2) : '—'}</td>
            <td style="text-align:right;color:${color}">${p.cost > 0 ? pct.toFixed(1)+'%' : '—'}</td>
        </tr>`;
    }).join('');
    document.getElementById('priceTotalItems').textContent = filtered.length;
    document.getElementById('priceAvgMargin').textContent = count > 0 ? (totalMarginPct / count).toFixed(1) + '%' : '—';
}

// ===== DRAG & DROP =====
function setupDragAndDrop() {
    document.querySelectorAll('.upload-drop-zone').forEach(zone => {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', e => { e.preventDefault(); zone.classList.remove('dragover'); });
        zone.addEventListener('drop', e => {
            e.preventDefault(); zone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length) {
                const card = zone.closest('.upload-card') || zone.closest('[data-type]');
                const type = card?.dataset?.type;
                if (type) {
                    const input = zone.querySelector('input[type=file]');
                    if (input) { input.files = files; handleCSVUpload(input, type); }
                }
            }
        });
    });
}

// ===== INIT =====
openDB().then(async () => {
    await loadAll();
    renderAll();
    setupDragAndDrop();
});

// Service Worker (minimal)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('data:text/javascript,' + encodeURIComponent(
        "self.addEventListener('fetch', e => e.respondWith(fetch(e.request).catch(() => caches.match(e.request))));"
    )).catch(() => {});
}
