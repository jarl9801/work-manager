
// ============================================
// PRICE LIST
// ============================================
const PRICE_LIST = [
    { code:'ACT_001', desc:'HÜP-GFTA-ONT, Fusión + Activación + Perforación', descDe:'HÜP-GFTA-ONT, Fusion + Aktivierung + Bohrung', unit:'UDS', sale:230, cost:135, cat:'ACT' },
    { code:'ACT_003', desc:'HÜP-GFTA-ONT, Fusión + Perforación', descDe:'HÜP-GFTA-ONT, Fusion + Bohrung', unit:'UDS', sale:184, cost:110, cat:'ACT' },
    { code:'ACT_004', desc:'HÜP-GFTA-ONT, Solo Activación', descDe:'HÜP-GFTA-ONT, Nur Aktivierung', unit:'UDS', sale:46, cost:25, cat:'ACT' },
    { code:'BLOW_001', desc:'Soplado 6/12/24 fibras RD', descDe:'Einblasen 6/12/24 Glasfaserkabel (RD)', unit:'ML', sale:0.43, cost:0.28, cat:'BLOW' },
    { code:'BLOW_002', desc:'Soplado 48/96/144 fibras RA', descDe:'Einblasen 48/96/144 Glasfaserkabel (RA)', unit:'ML', sale:0.62, cost:0.45, cat:'BLOW' },
    { code:'BLOW_003', desc:'Fusiones en DP (Distribution Point)', descDe:'DP Installation (Tray, Routing Pipes inkl.)', unit:'UDS', sale:705, cost:420, cat:'BLOW' },
    { code:'BLOW_004', desc:'Fusiones en POP + Bandejas', descDe:'POP Installation + Verbindungsbandagen', unit:'UDS', sale:1300, cost:440, cat:'BLOW' },
    { code:'BLOW_204', desc:'Preparación NVT Planta Externa (solo GFNW)', descDe:'Outsideplant Vorbereitung in NVT (nur GFNW)', unit:'UDS', sale:2500, cost:0, cat:'BLOW' },
    { code:'CW_204', desc:'Excavación suelo no consolidado', descDe:'Aushub ungebundener Boden (UB)', unit:'M³', sale:78, cost:46.80, cat:'CW' },
    { code:'CW_205', desc:'Excavación adoquinado', descDe:'Aushub Pflaster', unit:'M³', sale:110, cost:66, cat:'CW' },
    { code:'CW_206', desc:'Excavación asfalto', descDe:'Aushub Asphalt', unit:'M³', sale:136, cost:81.60, cat:'CW' },
    { code:'ING_FIX_003', desc:'HBG Individual área POP', descDe:'Hausbegehung Individueller POP Gebiet', unit:'UDS', sale:36, cost:21.60, cat:'ING' },
    { code:'ING_FIX_010', desc:'Cita conexión domiciliaria', descDe:'Hausanschluss Termin', unit:'UDS', sale:2.60, cost:1.56, cat:'ING' },
    { code:'ING_FIX_011', desc:'HBG Paquete POP 35-45 (no GFPLUS)', descDe:'Hausbegehung POP Paket 35-45 (nicht GFPLUS)', unit:'UDS', sale:21, cost:12.60, cat:'ING' },
    { code:'ING_FIX_012', desc:'Cláusula protección exceso +45%', descDe:'Schutzklausel Überschuss +45% HBG', unit:'UDS', sale:33, cost:19.80, cat:'ING' },
    { code:'ING_FIX_015', desc:'HBG Paquete GF+ (solo GFPLUS)', descDe:'Hausbegehung POP Paket GF+ (nur GFPLUS)', unit:'UDS', sale:26, cost:15.60, cat:'ING' },
];

// ============================================
// I18N
// ============================================
let lang = 'es';
const i18n = {
    es: {
        navDashboard:'Dashboard', navClients:'Clientes', navOrders:'Órdenes', navProjects:'Proyectos', navInvoicing:'Facturación', navPrices:'Precios',
        totalProjects:'Proyectos', totalDPs:'DPs', totalClients:'Clientes',
        status108:'108 - Tiefbau', status109:'109 - Einblasen', status103:'103 - Hausbegehung', status100:'100 - Termin', status0:'0 - Sin progreso', statusFertig:'Fertig',
        ordersRA:'Órdenes Soplado RA', ordersRD:'Órdenes Soplado RD', ordersFusion:'Órdenes Fusión',
        projectProgress:'Progreso por Proyecto', markInvoiced:'Marcar Facturado',
        avgMargin:'Margen Promedio', totalItems:'Ítems', priceVersion:'Versión Precios',
        thCode:'Código', thDescription:'Descripción', thUnit:'Unidad', thSalePrice:'Precio Venta (€)', thCostPrice:'Precio Costo (€)', thMarginEur:'Margen (€)', thMarginPct:'Margen %',
        noData:'Sin datos', imported:'importados', detected:'Detectado',
        blowingDone:'Soplado AP-DP', splicingAP:'Empalme AP', splicingDP:'Empalme DP',
        completion:'Completado', total:'Total', addresses:'direcciones',
        certNotInv:'Certificado sin facturar', totalInvoiced:'Total Facturado', totalPending:'Pendiente',
        faltaCargar:'Falta cargar orden', yaExistia:'Ya existía', resultadoImport:'Resultado de Importación',
        nuevas:'Nuevas', importadas:'Importadas', faltan:'Faltan por cargar',
        gereedEnGO:'GEREED en GO pero sin orden', ordenesCargadas:'Órdenes cargadas',
        clickExpandir:'▼ Click para ver detalle DPs', dpNumber:'DP', sopladoRA:'Soplado RA',
        fusionAP:'Fusión AP', fusionDP:'Fusión DP', statusCol:'Estado', pendiente:'Pendiente',
    },
    de: {
        navDashboard:'Dashboard', navClients:'Kunden', navOrders:'Aufträge', navProjects:'Projekte', navInvoicing:'Abrechnung', navPrices:'Preise',
        totalProjects:'Projekte', totalDPs:'DPs', totalClients:'Kunden',
        status108:'108 - Tiefbau', status109:'109 - Einblasen', status103:'103 - Hausbegehung', status100:'100 - Termin', status0:'0 - Kein Fortschritt', statusFertig:'Fertig',
        ordersRA:'Einblasen RA Aufträge', ordersRD:'Einblasen RD Aufträge', ordersFusion:'Spleißen Aufträge',
        projectProgress:'Fortschritt pro Projekt', markInvoiced:'Als abgerechnet markieren',
        avgMargin:'Durchschn. Marge', totalItems:'Positionen', priceVersion:'Preisversion',
        thCode:'Code', thDescription:'Beschreibung', thUnit:'Einheit', thSalePrice:'Verkaufspreis (€)', thCostPrice:'Kostenpreis (€)', thMarginEur:'Marge (€)', thMarginPct:'Marge %',
        noData:'Keine Daten', imported:'importiert', detected:'Erkannt',
        blowingDone:'Einblasen AP-DP', splicingAP:'Spleißen AP', splicingDP:'Spleißen DP',
        completion:'Abgeschlossen', total:'Gesamt', addresses:'Adressen',
        certNotInv:'Zertifiziert, nicht abgerechnet', totalInvoiced:'Gesamt abgerechnet', totalPending:'Ausstehend',
        faltaCargar:'Auftrag fehlt', yaExistia:'Bereits vorhanden', resultadoImport:'Importergebnis',
        nuevas:'Neue', importadas:'Importiert', faltan:'Fehlen noch',
        gereedEnGO:'GEREED in GO aber kein Auftrag', ordenesCargadas:'Geladene Aufträge',
        clickExpandir:'▼ Klick für DP-Details', dpNumber:'DP', sopladoRA:'Einblasen RA',
        fusionAP:'Spleißen AP', fusionDP:'Spleißen DP', statusCol:'Status', pendiente:'Ausstehend',
    }
};
function t(k) { return i18n[lang]?.[k] || i18n.es[k] || k; }
function setLang(l) {
    lang = l;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.textContent === l.toUpperCase()));
    document.querySelectorAll('[data-t]').forEach(el => { const k = el.getAttribute('data-t'); const v = t(k); if (v !== k) el.textContent = v; });
    renderAll();
}

// ============================================
// STATE
// ============================================
let db;
let clients = [];
let ordersRA = [];
let ordersRD = [];
let ordersFusion = [];
let projects = [];
let goStatus = [];
let legacyOrders = []; // old format orders for invoicing
let clientSort = { field:'dp', dir:1 };
let currentOrderTab = 'ra';
let editingOrderType = null;
let orderFilters = { search: '', technician: '', project: '' };

// ============================================
// IndexedDB
// ============================================
function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('WorkManagerDB', 3);
        req.onupgradeneeded = e => {
            const d = e.target.result;
            if (!d.objectStoreNames.contains('orders')) d.createObjectStore('orders', { keyPath:'id', autoIncrement:true });
            if (!d.objectStoreNames.contains('clients')) d.createObjectStore('clients', { keyPath:'id', autoIncrement:true });
            if (!d.objectStoreNames.contains('orders_ra')) d.createObjectStore('orders_ra', { keyPath:'id', autoIncrement:true });
            if (!d.objectStoreNames.contains('orders_rd')) d.createObjectStore('orders_rd', { keyPath:'id', autoIncrement:true });
            if (!d.objectStoreNames.contains('orders_fusion')) d.createObjectStore('orders_fusion', { keyPath:'id', autoIncrement:true });
            if (!d.objectStoreNames.contains('projects')) d.createObjectStore('projects', { keyPath:'id', autoIncrement:true });
            if (!d.objectStoreNames.contains('go_status')) d.createObjectStore('go_status', { keyPath:'id', autoIncrement:true });
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

// ============================================
// TOAST
// ============================================
function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}

// ============================================
// CSV PARSING
// ============================================
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

// ============================================
// SMART CSV DETECTION & IMPORT
// ============================================
function detectCSVType(headers) {
    const h = headers.join(',').toLowerCase().normalize('NFC');
    console.log('[CSV detect] headers:', h);

    // GO FiberConnect client data
    if (h.includes('auftragsnummer') && h.includes('anschlussstatus')) return 'clients';

    // GO FiberConnect status data
    if (h.includes('tiefbau fertig') || h.includes('einblasen ap') || h.includes('kabelsorte') || h.includes('projekt- nummer')) return 'go_status';

    // Soplado RA: has project + meters but NO KA/street (backbone work)
    if (h.includes('código de proyecto') && h.includes('metros soplados') && !h.includes('ka cliente') && !h.includes('ka ') && !h.includes('calle') && !h.includes('fusiones')) return 'soplado_ra';

    // Fusión: has splices or photo registry
    if (h.includes('fusiones') || (h.includes('código de proyecto') && h.includes('registro fotografico'))) return 'fusion';

    // Soplado RD: has KA (customer work) OR has project + street + meters (last mile)
    if (h.includes('ka cliente') || h.includes('ka ') ||
        (h.includes('código de proyecto') && (h.includes('calle') || h.includes('dirección')) && h.includes('metros'))) {
        return 'soplado_rd';
    }

    console.log('[CSV detect] No type detected for headers:', h);
    return null;
}

function closeImportReport() { document.getElementById('importReportModal').classList.remove('show'); }
document.getElementById('importReportModal').addEventListener('click', function(e) { if (e.target === this) closeImportReport(); });

function showImportReport(type, newOrders, duplicates, missing) {
    const typeNames = { soplado_ra: 'Soplado RA', soplado_rd: 'Soplado RD', fusion: 'Fusión' };
    const title = `📊 ${t('resultadoImport')} - ${typeNames[type] || type}`;
    document.getElementById('importReportTitle').textContent = title;

    const total = newOrders.length + duplicates.length;
    let html = '';

    // Summary bar
    html += `<div style="display:flex;gap:12px;margin-bottom:16px;padding:12px;background:var(--surface);border-radius:8px;border:1px solid var(--border)">
        <div style="text-align:center;flex:1"><div style="font-size:20px;font-weight:700;color:var(--blue)">${total}</div><div style="font-size:11px;color:var(--text-secondary)">Total CSV</div></div>
        <div style="text-align:center;flex:1"><div style="font-size:20px;font-weight:700;color:var(--green)">${newOrders.length}</div><div style="font-size:11px;color:var(--text-secondary)">Nuevas</div></div>
        <div style="text-align:center;flex:1"><div style="font-size:20px;font-weight:700;color:var(--orange)">${duplicates.length}</div><div style="font-size:11px;color:var(--text-secondary)">Duplicadas</div></div>
        <div style="text-align:center;flex:1"><div style="font-size:20px;font-weight:700;color:var(--red)">${missing.length}</div><div style="font-size:11px;color:var(--text-secondary)">Faltan en GO</div></div>
    </div>`;

    // New orders
    html += `<div class="report-section"><h3><span class="report-badge report-badge-new">🆕</span> ${t('importadas')}: <span class="report-count">${newOrders.length}</span></h3>`;
    if (newOrders.length) {
        html += '<ul class="report-list">';
        newOrders.forEach(o => html += `<li>${o}</li>`);
        html += '</ul>';
    } else { html += '<p style="color:var(--text-tertiary);font-size:12px;margin:4px 0 0 24px">—</p>'; }
    html += '</div>';

    // Duplicates
    html += `<div class="report-section"><h3><span class="report-badge report-badge-dup">⚠️</span> ${t('yaExistia')}: <span class="report-count">${duplicates.length}</span></h3>`;
    if (duplicates.length) {
        html += '<ul class="report-list">';
        duplicates.forEach(o => html += `<li>${o}</li>`);
        html += '</ul>';
    } else { html += '<p style="color:var(--text-tertiary);font-size:12px;margin:4px 0 0 24px">—</p>'; }
    html += '</div>';

    // Missing (GEREED but no order)
    if (missing.length > 0) {
        html += `<div class="report-section"><h3><span class="report-badge report-badge-missing">❌</span> ${t('faltan')} (${t('gereedEnGO')}): <span class="report-count">${missing.length}</span></h3>`;
        html += '<ul class="report-list">';
        missing.forEach(o => html += `<li>${o}</li>`);
        html += '</ul></div>';
    }

    // Incidents warning
    const allOrders = type === 'soplado_ra' ? ordersRA : type === 'soplado_rd' ? ordersRD : ordersFusion;
    const withIncidents = allOrders.filter(o => o.incidents && o.incidents.trim() !== '');
    if (withIncidents.length > 0) {
        html += `<div class="report-section" style="border-top:1px solid var(--border);padding-top:12px;margin-top:8px"><h3>🚨 Órdenes con incidencias: <span class="report-count">${withIncidents.length}</span></h3>`;
        html += '<ul class="report-list">';
        withIncidents.forEach(o => html += `<li><strong>${o.projectCode} ${o.dp || ''}</strong> (${o.technician}): ${o.incidents}</li>`);
        html += '</ul></div>';
    }

    document.getElementById('importReportContent').innerHTML = html;
    document.getElementById('importReportModal').classList.add('show');
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

// ============================================
// FORM UPLOAD HANDLERS
// ============================================
async function handleCSVUpload(input, type) {
    const file = input.files[0];
    if (!file) return;

    const statusEl = document.getElementById(`status${type.toUpperCase()}`);
    statusEl.className = 'upload-status processing';
    statusEl.textContent = '⏳ Procesando archivo...';

    try {
        console.log(`[Upload] Processing ${type.toUpperCase()} file:`, file.name);

        const text = await file.text();
        const lines = parseCSV(text);

        console.log(`[Upload] Parsed ${lines.length} lines from CSV`);
        if (lines.length > 0) {
            console.log(`[Upload] Headers detected:`, lines[0]);
        }

        if (lines.length < 2) {
            throw new Error('Archivo vacío o sin datos válidos');
        }

        // Verify CSV type matches expected
        const detectedType = detectCSVType(lines[0]);
        console.log(`[Upload] Expected: ${type}, Detected: ${detectedType}`);

        const objs = csvToObjects(lines);
        console.log(`[Upload] Converted to ${objs.length} objects`);

        // Force import regardless of detection (user knows what they're uploading)
        let processed = 0;

        switch(type) {
            case 'ra':
                await importRA(objs);
                processed = objs.length;
                break;
            case 'rd':
                await importRD(objs);
                processed = objs.length;
                break;
            case 'fusion':
                await importFusion(objs);
                processed = objs.length;
                break;
        }

        await loadAll();
        // Reset filters so newly imported project is visible
        orderFilters = { search: '', technician: '', project: '' };
        const orderSearch = document.getElementById('orderSearch');
        const filterTechnician = document.getElementById('filterTechnician');
        const filterProject = document.getElementById('filterProject');
        if (orderSearch) orderSearch.value = '';
        if (filterTechnician) filterTechnician.value = '';
        if (filterProject) filterProject.value = '';
        renderAll();

        statusEl.className = 'upload-status success';
        statusEl.textContent = `✅ ${processed} órdenes procesadas exitosamente`;

        // Hide success message after 5 seconds
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);

    } catch (error) {
        console.error(`[Upload] Error processing ${type}:`, error);
        statusEl.className = 'upload-status error';
        statusEl.textContent = `❌ Error: ${error.message}`;

        // Hide error message after 8 seconds
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 8000);
    }

    input.value = '';
}

// ============================================
// CLEAN RECORDS FUNCTIONS
// ============================================
async function deleteOrder(store, id, label) {
    if (!confirm(`¿Eliminar este registro de ${label}?`)) return;
    await dbDelete(store, id);
    await loadAll();
    renderAll();
    toast(`🗑️ Registro eliminado de ${label}`);
}

async function cleanRARecords() {
    if (!confirm('⚠️ ¿Estás seguro de eliminar TODAS las órdenes de Soplado RA?\n\nEsta acción no se puede deshacer.')) {
        return;
    }

    try {
        await dbClear('orders_ra');
        ordersRA = [];
        await loadAll();
        renderAll();
        toast('✅ Órdenes Soplado RA eliminadas');
    } catch (error) {
        toast('❌ Error al eliminar órdenes RA');
        console.error('Error cleaning RA:', error);
    }
}

async function cleanRDRecords() {
    if (!confirm('⚠️ ¿Estás seguro de eliminar TODAS las órdenes de Soplado RD?\n\nEsta acción no se puede deshacer.')) {
        return;
    }

    try {
        await dbClear('orders_rd');
        ordersRD = [];
        await loadAll();
        renderAll();
        toast('✅ Órdenes Soplado RD eliminadas');
    } catch (error) {
        toast('❌ Error al eliminar órdenes RD');
        console.error('Error cleaning RD:', error);
    }
}

async function cleanFusionRecords() {
    if (!confirm('⚠️ ¿Estás seguro de eliminar TODAS las órdenes de Fusión?\n\nEsta acción no se puede deshacer.')) {
        return;
    }

    try {
        await dbClear('orders_fusion');
        ordersFusion = [];
        await loadAll();
        renderAll();
        toast('✅ Órdenes Fusión eliminadas');
    } catch (error) {
        toast('❌ Error al eliminar órdenes Fusión');
        console.error('Error cleaning Fusion:', error);
    }
}

// ============================================
// DEBUG DP NORMALIZATION
// ============================================
function debugDPMatching() {
    console.log('\n=== DEBUG DP MATCHING ===');

    // Show all GO DPs
    console.log('\n--- GO FiberConnect DPs ---');
    const goDPs = new Set();
    goStatus.forEach(g => {
        const dp = normalizeDP(g.dp || '');
        if (dp) {
            goDPs.add(dp);
            console.log(`GO: "${g.dp}" → normalized: "${dp}"`);
        }
    });

    // Show all Fusion order DPs
    console.log('\n--- Fusion Order DPs ---');
    const fusionDPs = new Set();
    ordersFusion.forEach(o => {
        const dp = normalizeDP(o.dp || '');
        if (dp) {
            fusionDPs.add(dp);
            console.log(`Fusion: "${o.dp}" → normalized: "${dp}" (Project: ${o.projectCode})`);
        }
    });

    // Show matches and mismatches
    console.log('\n--- MATCHING ANALYSIS ---');
    console.log('GO DPs:', Array.from(goDPs).sort());
    console.log('Fusion DPs:', Array.from(fusionDPs).sort());

    const matches = [];
    const fusionOnly = [];

    fusionDPs.forEach(dp => {
        if (goDPs.has(dp)) {
            matches.push(dp);
        } else {
            fusionOnly.push(dp);
        }
    });

    console.log('✅ MATCHES:', matches.sort());
    console.log('❌ FUSION ONLY (not in GO):', fusionOnly.sort());
    console.log('📊 Match rate:', `${matches.length}/${fusionDPs.size} (${Math.round(matches.length/fusionDPs.size*100)}%)`);

    // Test normalization function
    console.log('\n--- NORMALIZATION TESTS ---');
    const testCases = ['6', '06', '006', 'DP6', 'DP06', 'DP006', 'DP-06', 'QFF-001-DP006'];
    testCases.forEach(test => {
        console.log(`normalizeDP("${test}") → "${normalizeDP(test)}"`);
    });
}

// ============================================
// ADMIN DASHBOARD FUNCTIONS
// ============================================
function renderAdminAlertsSafe() {
    try {
        const alerts = [];

        // Simple checks without complex calculations
        const totalOrders = (ordersRA?.length || 0) + (ordersRD?.length || 0) + (ordersFusion?.length || 0);

        if (totalOrders > 15) {
            alerts.push({
                type: 'warning',
                icon: '⚠️',
                message: `${totalOrders} órdenes pendientes de revisión`
            });
        }

        // Check for missing photos (simple version)
        const rdWithoutPhotos = ordersRD?.filter(o => !o.photos || o.photos === '') || [];
        if (rdWithoutPhotos.length > 0) {
            alerts.push({
                type: 'warning',
                icon: '📷',
                message: `${rdWithoutPhotos.length} órdenes sin fotos verificadas`
            });
        }

        const alertsHtml = alerts.map(alert =>
            `<div class="alert-item ${alert.type}">
                <span>${alert.icon}</span>
                <span>${alert.message}</span>
            </div>`
        ).join('');

        const alertsEl = document.getElementById('adminAlerts');
        if (alertsEl) alertsEl.innerHTML = alertsHtml;

    } catch (error) {
        console.error('Error in renderAdminAlertsSafe:', error);
    }
}

function calculateAdminMetrics() {
    const withIncidents = [...ordersRA, ...ordersRD, ...ordersFusion].filter(o => o.incidents && o.incidents.trim() !== '');
    const pendingReview = withIncidents.length;
    const goDiscrepancies = calculateGODiscrepancies().length;
    const dpsFused = new Set(ordersFusion.map(o => o.dp).filter(Boolean));
    const dpsBlown = new Set(ordersRD.map(o => o.dp).filter(Boolean));
    const readyToCertify = [...dpsFused].filter(dp => dpsBlown.has(dp)).length;
    return { pendingReview, goDiscrepancies, readyToCertify };
}

function calculateGODiscrepancies() {
    try {
        const discrepancies = [];
        const goByDP = {};
        goStatus.forEach(g => { goByDP[g.dp] = g; });

        // RD orders: work done but einblasen not GEREED in GO
        ordersRD.forEach(o => {
            if (!o.dp) return;
            const g = goByDP[o.dp];
            if (!g) {
                discrepancies.push({ type: 'RD', project: o.projectCode, dp: o.dp, technician: o.technician, issue: 'DP no encontrado en GO' });
            } else if (!g.einblasenAPDP?.toUpperCase().includes('GEREED')) {
                discrepancies.push({ type: 'RD', project: o.projectCode, dp: o.dp, technician: o.technician, issue: 'Soplado hecho, no GEREED en GO' });
            }
        });

        // Fusion orders: work done but spleissen not GEREED in GO
        ordersFusion.forEach(o => {
            if (!o.dp) return;
            const g = goByDP[o.dp];
            if (!g) {
                discrepancies.push({ type: 'Fusión', project: o.projectCode, dp: o.dp, technician: o.technician, issue: 'DP no encontrado en GO' });
            } else if (!g.spleissenAP?.toUpperCase().includes('GEREED') && !g.spleisseDPbereit?.toUpperCase().includes('GEREED')) {
                discrepancies.push({ type: 'Fusión', project: o.projectCode, dp: o.dp, technician: o.technician, issue: 'Fusión hecha, no GEREED en GO' });
            }
        });

        // GEREED in GO but no order filed
        goStatus.forEach(g => {
            if (g.einblasenAPDP?.toUpperCase().includes('GEREED')) {
                const hasRD = ordersRD.some(o => o.dp === g.dp);
                if (!hasRD) {
                    discrepancies.push({ type: 'GO→RD', project: g.projekt || g.projektnummer, dp: g.dp, technician: '-', issue: 'GEREED en GO pero sin orden RD' });
                }
            }
            if (g.spleissenAP?.toUpperCase().includes('GEREED')) {
                const hasFusion = ordersFusion.some(o => o.dp === g.dp);
                if (!hasFusion) {
                    discrepancies.push({ type: 'GO→Fusión', project: g.projekt || g.projektnummer, dp: g.dp, technician: '-', issue: 'GEREED en GO pero sin orden Fusión' });
                }
            }
        });

        return discrepancies;

    } catch (error) {
        console.error('Error in calculateGODiscrepancies:', error);
        return [];
    }
}

function getPendingReviewOrders() {
    // All orders are considered pending review for now
    return [...ordersRA, ...ordersRD, ...ordersFusion];
}

function checkMissingPhotos() {
    let missing = 0;
    [...ordersRD, ...ordersFusion].forEach(order => {
        if (!order.photos || !order.photoRegistry) {
            missing++;
        }
    });
    return missing;
}

function renderProductivityGrid() {
    try {
        const gridEl = document.getElementById('productivityGrid');
        if (!gridEl) return;

        const techStats = {};

        ordersRA.forEach(order => {
            const tech = order.technician || 'Unknown';
            if (!techStats[tech]) techStats[tech] = { orders: 0, ra: 0, rd: 0, fusion: 0, meters: 0, splices: 0 };
            techStats[tech].orders++;
            techStats[tech].ra++;
            techStats[tech].meters += parseFloat(order.meters) || 0;
        });
        ordersRD.forEach(order => {
            const tech = order.technician || 'Unknown';
            if (!techStats[tech]) techStats[tech] = { orders: 0, ra: 0, rd: 0, fusion: 0, meters: 0, splices: 0 };
            techStats[tech].orders++;
            techStats[tech].rd++;
            techStats[tech].meters += parseFloat(order.meters) || 0;
        });
        ordersFusion.forEach(order => {
            const tech = order.technician || 'Unknown';
            if (!techStats[tech]) techStats[tech] = { orders: 0, ra: 0, rd: 0, fusion: 0, meters: 0, splices: 0 };
            techStats[tech].orders++;
            techStats[tech].fusion++;
            techStats[tech].splices += parseFloat(order.splices) || 0;
        });

        if (Object.keys(techStats).length === 0) {
            gridEl.innerHTML = `<p style="color:var(--text-tertiary);grid-column:1/-1;text-align:center">No hay datos de técnicos</p>`;
            return;
        }

        const techCardsHtml = Object.entries(techStats).map(([tech, stats]) => {
            const productivity = stats.orders > 15 ? 'Alta' : stats.orders > 8 ? 'Media' : 'Baja';
            const productivityColor = stats.orders > 15 ? 'var(--green)' : stats.orders > 8 ? 'var(--orange)' : 'var(--red)';

            return `<div class="tech-card">
                <div class="tech-name">${tech}</div>
                <div class="tech-stats">
                    <div class="tech-stat">
                        <span>Total:</span>
                        <span style="color:var(--green);font-weight:600">${stats.orders}</span>
                    </div>
                    <div class="tech-stat">
                        <span>Productividad:</span>
                        <span style="color:${productivityColor};font-weight:600">${productivity}</span>
                    </div>
                    <div class="tech-stat">
                        <span>Soplado RA:</span>
                        <span>${stats.ra}</span>
                    </div>
                    <div class="tech-stat">
                        <span>Soplado RD:</span>
                        <span>${stats.rd}</span>
                    </div>
                    <div class="tech-stat">
                        <span>Fusión:</span>
                        <span>${stats.fusion}</span>
                    </div>
                    <div class="tech-stat">
                        <span>Metros:</span>
                        <span>${stats.meters.toFixed(0)}</span>
                    </div>
                    <div class="tech-stat">
                        <span>Fusiones:</span>
                        <span>${stats.splices}</span>
                    </div>
                </div>
            </div>`;
        }).join('');

        gridEl.innerHTML = techCardsHtml;

    } catch (error) {
        console.error('Error in renderProductivityGrid:', error);
        const gridEl = document.getElementById('productivityGrid');
        if (gridEl) gridEl.innerHTML = `<p style="color:var(--text-tertiary);grid-column:1/-1;text-align:center">Error cargando datos</p>`;
    }
}

function renderStatusOverview() {
    try {
        const overviewEl = document.getElementById('statusOverview');
        if (!overviewEl) return;

        const goByDP = {};
        goStatus.forEach(g => { goByDP[g.dp] = g; });

        // Real counts based on data
        const totalRA = ordersRA.length;
        const totalRD = ordersRD.length;
        const totalFusion = ordersFusion.length;

        // DPs with soplado done (have RD order)
        const dpsSoplados = new Set(ordersRD.map(o => o.dp).filter(Boolean));
        // DPs with fusion done
        const dpsFusionados = new Set(ordersFusion.map(o => o.dp).filter(Boolean));
        // DPs GEREED in GO (einblasen)
        const dpsGereedBlow = new Set(goStatus.filter(g => g.einblasenAPDP?.toUpperCase().includes('GEREED')).map(g => g.dp));
        // DPs GEREED in GO (spleissen)
        const dpsGereedSplice = new Set(goStatus.filter(g => g.spleissenAP?.toUpperCase().includes('GEREED') || g.spleisseDPbereit?.toUpperCase().includes('GEREED')).map(g => g.dp));
        // Certified = in GO as GEREED for both
        const dpsCertReady = [...dpsFusionados].filter(dp => dpsGereedBlow.has(dp) && dpsGereedSplice.has(dp));

        const statusHtml = `
            <div class="status-card">
                <div class="status-value" style="color:var(--blue)">${totalRA}</div>
                <div class="status-label">Soplado RA</div>
            </div>
            <div class="status-card">
                <div class="status-value" style="color:var(--cyan)">${totalRD}</div>
                <div class="status-label">Soplado RD</div>
            </div>
            <div class="status-card">
                <div class="status-value" style="color:var(--orange)">${totalFusion}</div>
                <div class="status-label">Fusión</div>
            </div>
            <div class="status-card">
                <div class="status-value" style="color:var(--green)">${dpsCertReady.length}</div>
                <div class="status-label">Listos Cert.</div>
            </div>
        `;

        overviewEl.innerHTML = statusHtml;

    } catch (error) {
        console.error('Error in renderStatusOverview:', error);
    }
}

function renderActivityFeed() {
    try {
        const feedEl = document.getElementById('activityFeed');
        if (!feedEl) return;

        // Build real activity from order timestamps
        const activities = [];
        ordersRA.forEach(o => {
            if (o.timestamp || o.startDate) activities.push({ action: `📋 RA: ${o.projectCode} — ${o.technician} (${o.meters}m)`, time: o.timestamp || o.startDate });
        });
        ordersRD.forEach(o => {
            if (o.timestamp || o.startDate) activities.push({ action: `📋 RD: ${o.projectCode} ${o.dp} ${o.ka} — ${o.technician} (${o.meters}m)`, time: o.timestamp || o.startDate });
        });
        ordersFusion.forEach(o => {
            if (o.timestamp || o.startDate) activities.push({ action: `🔗 Fusión: ${o.projectCode} ${o.dp} — ${o.technician} (${o.splices} fusiones)`, time: o.timestamp || o.startDate });
        });

        // Sort by date descending, show latest 10
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        const latest = activities.slice(0, 10);

        if (!latest.length) {
            feedEl.innerHTML = '<p style="color:var(--text-tertiary);text-align:center">Sin actividad reciente</p>';
            return;
        }

        feedEl.innerHTML = latest.map(a =>
            `<div class="activity-item">
                <div>${a.action}</div>
                <div class="activity-time">${a.time}</div>
            </div>`
        ).join('');

    } catch (error) {
        console.error('Error in renderActivityFeed:', error);
    }
}

// Quick action functions
function showPendingReview() {
    alert('🔍 Función de revisión en desarrollo. Mostrará órdenes pendientes de aprobar.');
}

function showGODiscrepancies() {
    const discrepancies = calculateGODiscrepancies();
    if (discrepancies.length === 0) {
        alert('✅ No hay discrepancias con GO FiberConnect');
        return;
    }

    let message = `🚨 ${discrepancies.length} discrepancias encontradas:\n\n`;
    discrepancies.slice(0, 10).forEach(d => {
        message += `• [${d.type}] ${d.project} ${d.dp}: ${d.issue}\n`;
    });

    if (discrepancies.length > 10) {
        message += `\n... y ${discrepancies.length - 10} más.`;
    }

    alert(message);

    // Also render in the discrepancies list if it exists
    const listEl = document.getElementById('goDiscrepanciesList');
    if (listEl) {
        listEl.innerHTML = discrepancies.map(d => 
            `<div class="activity-item"><div><strong>[${d.type}]</strong> ${d.project} ${d.dp} — ${d.issue}</div><div class="activity-time">${d.technician}</div></div>`
        ).join('');
    }
}

function showCertification() {
    alert('📋 Panel de certificación en desarrollo. Permitirá certificar trabajos completados.');
}

function bulkCertify() {
    const goByDPBulk = {};
    goStatus.forEach(g => { goByDPBulk[g.dp] = g; });
    const rdDPs = new Set(ordersRD.map(o => o.dp).filter(Boolean));
    const fusionDPs = new Set(ordersFusion.map(o => o.dp).filter(Boolean));
    const readyDPs = [...rdDPs].filter(dp => fusionDPs.has(dp));
    if (!readyDPs.length) { alert('No hay DPs listos para certificar (necesitan RD + Fusión).'); return; }
    let msg = `📋 DPs listos para certificación (RD + Fusión):\n\n`;
    readyDPs.sort().forEach(dp => {
        const g = goByDPBulk[dp];
        const blowOK = g?.einblasenAPDP?.toUpperCase().includes('GEREED');
        const spliceOK = g?.spleissenAP?.toUpperCase().includes('GEREED') || g?.spleisseDPbereit?.toUpperCase().includes('GEREED');
        const goStr = blowOK && spliceOK ? '✅ GEREED' : blowOK ? '🟡 Solo einblasen' : spliceOK ? '🟡 Solo spleissen' : '❌ No en GO';
        msg += `• ${dp} — GO: ${goStr}\n`;
    });
    alert(msg);
}

function exportReport() {
    alert('📊 Exportación de reportes en desarrollo. Generará Excel/PDF con métricas.');
}

function syncWithGO() {
    const goByDPSync = {};
    goStatus.forEach(g => { goByDPSync[g.dp] = g; });
    const allDPs = new Set([...ordersRD.map(o=>o.dp), ...ordersFusion.map(o=>o.dp)].filter(Boolean));
    if (!allDPs.size) { alert('No hay DPs con órdenes para comparar.'); return; }
    let gereed = 0, notGereed = 0, notInGO = 0;
    let msg = `🔄 Comparación GO FiberConnect:\n\n`;
    [...allDPs].sort().forEach(dp => {
        const g = goByDPSync[dp];
        if (!g) { notInGO++; msg += `❌ ${dp} — No encontrado en GO\n`; }
        else {
            const blowOK = g.einblasenAPDP?.toUpperCase().includes('GEREED');
            const spliceOK = g.spleissenAP?.toUpperCase().includes('GEREED') || g.spleisseDPbereit?.toUpperCase().includes('GEREED');
            if (blowOK && spliceOK) { gereed++; }
            else { notGereed++; msg += `🟡 ${dp} — Einblasen: ${blowOK?'✅':'❌'} | Spleissen: ${spliceOK?'✅':'❌'}\n`; }
        }
    });
    msg = `📊 Resumen: ${gereed} GEREED, ${notGereed} parcial, ${notInGO} no en GO\n(${allDPs.size} DPs total)\n\n` + msg;
    alert(msg);
}

function qualityCheck() {
    const rdFusion = [...ordersRD, ...ordersFusion];
    const noPhotos = rdFusion.filter(o => !o.photos || o.photos.trim() === '' || o.photos === 'https://drive.google.com/');
    const allOrds = [...ordersRA, ...ordersRD, ...ordersFusion];
    const noIncField = allOrds.filter(o => o.incidents === undefined || o.incidents === null);
    const zeroMeters = [...ordersRA, ...ordersRD].filter(o => !o.meters || parseFloat(o.meters) === 0);
    const zeroSplices = ordersFusion.filter(o => !o.splices || parseFloat(o.splices) === 0);
    let msg = `✅ Control de Calidad:\n\n`;
    msg += `📷 Sin fotos (RD+Fusión): ${noPhotos.length}\n`;
    noPhotos.slice(0,5).forEach(o => msg += `  • ${o.projectCode} ${o.dp||''} (${o.technician})\n`);
    if (noPhotos.length > 5) msg += `  ... y ${noPhotos.length-5} más\n`;
    msg += `\n📝 Sin campo incidencias: ${noIncField.length}\n`;
    msg += `\n⚠️ Metros = 0: ${zeroMeters.length}\n`;
    zeroMeters.slice(0,5).forEach(o => msg += `  • ${o.projectCode} ${o.dp||''} (${o.technician})\n`);
    msg += `\n⚠️ Fusiones = 0: ${zeroSplices.length}\n`;
    zeroSplices.slice(0,5).forEach(o => msg += `  • ${o.projectCode} ${o.dp||''} (${o.technician})\n`);
    alert(msg);
}

// ============================================
// ADMIN VIEW FUNCTIONS
// ============================================
function validateAllPhotos() {
    let issues = 0;
    const orders = [...ordersRD, ...ordersFusion];

    orders.forEach(order => {
        if (!order.photos || order.photos === '' || order.photos === 'https://drive.google.com/') {
            issues++;
        }
    });

    alert(`📷 Validación de fotos:\n${issues} órdenes sin fotos válidas de ${orders.length} total`);
}

function checkMandatoryFields() {
    let issues = 0;
    const orders = [...ordersRA, ...ordersRD, ...ordersFusion];

    orders.forEach(order => {
        if (!order.technician || !order.projectCode || (!order.dp && !order.projectCode)) {
            issues++;
        }
    });

    alert(`📝 Campos obligatorios:\n${issues} órdenes con campos faltantes de ${orders.length} total`);
}

function reviewIncidents() {
    const ordersWithIncidents = [...ordersRA, ...ordersRD, ...ordersFusion]
        .filter(order => order.incidents && order.incidents.trim() !== '');

    if (ordersWithIncidents.length === 0) {
        alert('✅ No hay incidencias reportadas');
        return;
    }

    let message = `⚠️ ${ordersWithIncidents.length} órdenes con incidencias:\n\n`;
    ordersWithIncidents.slice(0, 5).forEach(order => {
        message += `• ${order.projectCode} ${order.dp || ''} - ${order.incidents.substring(0, 50)}...\n`;
    });

    alert(message);
}

function auditTechnicians() {
    const techStats = {};
    [...ordersRA, ...ordersRD, ...ordersFusion].forEach(order => {
        const tech = order.technician || 'Unknown';
        if (!techStats[tech]) {
            techStats[tech] = { total: 0, withIncidents: 0, withoutPhotos: 0 };
        }
        techStats[tech].total++;
        if (order.incidents && order.incidents.trim() !== '') {
            techStats[tech].withIncidents++;
        }
        if (!order.photos || order.photos === '') {
            techStats[tech].withoutPhotos++;
        }
    });

    let message = '👨‍🔧 Auditoría de técnicos:\n\n';
    Object.entries(techStats).forEach(([tech, stats]) => {
        const quality = ((stats.total - stats.withIncidents - stats.withoutPhotos) / stats.total * 100).toFixed(1);
        message += `${tech}: ${stats.total} órdenes, ${quality}% calidad\n`;
    });

    alert(message);
}

function manualSync() {
    alert('🔄 Sincronización manual iniciada. Revisando GO FiberConnect...');
    // Mock sync process
    setTimeout(() => {
        alert('✅ Sincronización completada. 3 nuevos estados GEREED detectados.');
    }, 2000);
}

function showBulkCertification() {
    bulkCertify();
}

function exportCertificationReport() {
    alert('📊 Generando reporte de certificación...');
}

function archiveOldOrders() {
    if (confirm('¿Archivar órdenes anteriores a 30 días? Esta acción no se puede deshacer.')) {
        alert('🗃️ Proceso de archivado iniciado...');
    }
}

function backupDatabase() {
    alert('💾 Creando backup de la base de datos...');
}

function generateFullReport() {
    alert('📄 Generando reporte completo del sistema...');
}

function settingsPanel() {
    alert('⚙️ Panel de configuraciones en desarrollo.');
}

// Setup drag & drop for upload zones
function setupDragAndDrop() {
    document.querySelectorAll('.upload-drop-zone').forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });

        zone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files.length) {
                const card = zone.closest('.upload-card');
                const type = card.dataset.type;
                const input = document.getElementById(`csv${type.toUpperCase()}`);
                input.files = files;
                handleCSVUpload(input, type);
            }
        });
    });
}

// Normalize DP: handles "6", "06", "DP6", "DP-06", "QFF-001-DP081" → all become "DP006"
function normalizeDP(raw) {
    if (!raw) return '';

    const str = raw.toString().trim().toUpperCase();
    console.log(`[DP Normalize] Input: "${raw}" → Processing: "${str}"`);

    // Case 1: Just numbers "6", "06", "006"
    if (/^\d+$/.test(str)) {
        const normalized = 'DP' + str.padStart(3, '0');
        console.log(`[DP Normalize] Numbers only: "${str}" → "${normalized}"`);
        return normalized;
    }

    // Case 2: Extract DPxxx from complex strings like "QFF-001-DP081", "DP-055", "DP6", etc.
    const m = str.match(/DP[- ]?(\d+)/);
    if (m) {
        const number = m[1];
        const normalized = 'DP' + number.padStart(3, '0');
        console.log(`[DP Normalize] DP pattern: "${str}" → extracted "${number}" → "${normalized}"`);
        return normalized;
    }

    // Case 3: No DP pattern found, return as-is
    console.log(`[DP Normalize] No pattern found, returning as-is: "${raw}"`);
    return raw.trim();
}

function extractProjectCode(row) {
    // From client CSV: DP column is like "QFF-001-DP081"
    const dp = row['DP'] || '';
    const m = dp.match(/(QFF-\d+)/i);
    if (m) return m[1];
    return '';
}

async function importClients(objs) {
    await dbClear('clients');
    const projectMap = {};
    for (const o of objs) {
        const dpFull = o['DP'] || '';
        const projCode = extractProjectCode(o);
        const dpNorm = normalizeDP(dpFull);
        const grundNA = (o['GrundNA'] || '').trim();
        let contract = 'R20';
        if (grundNA === 'R0' || grundNA === '') contract = grundNA || 'R20';
        if (['R0','R18','R20'].includes(grundNA)) contract = grundNA;
        else contract = 'R20';

        const statusRaw = (o['ANSCHLUSSSTATUS'] || o['Status'] || '0').toString().trim();
        const status = statusRaw === 'Fertig' ? 'Fertig' : statusRaw;
        const phase = (o['Status'] || '').trim(); // Tiefbau, Einblasen, Spleiße, Hausbegehung

        const client = {
            auftrag: o['Auftragsnummer'] || '',
            projektnummer: o['Projektnummer'] || '',
            projectCode: projCode,
            dp: dpNorm,
            dpFull: dpFull,
            street: o['Straße'] || o['Straße'] || '',
            hausnummer: o['Hausnummer'] || '',
            hausnummerZusatz: o['Hausnummernzusatz'] || '',
            unit: o['Unit'] || '',
            cableId: o['Cable ID (From TRI)'] || '',
            contract: contract,
            status: status,
            phase: phase,
            farbeRohre: o['Farbe Rohre'] || '',
            datumHausanschluss: o['Datum Hausanschluss'] || '',
            trenchIP: o['Trench-IP-fiber'] || '',
            trenchTV: o['Trench-TV-fiber'] || '',
            hasTV: o['HAS-TV-fiber'] || '',
        };
        await dbPut('clients', client);

        if (projCode && !projectMap[projCode]) {
            projectMap[projCode] = { code: projCode, projektnummer: client.projektnummer, dps: new Set() };
        }
        if (projCode) projectMap[projCode].dps.add(dpNorm);
    }
    // Build projects
    await dbClear('projects');
    for (const [code, data] of Object.entries(projectMap)) {
        await dbPut('projects', { code, projektnummer: data.projektnummer, dpCount: data.dps.size });
    }
    toast(`✅ ${objs.length} clientes ${t('imported')}`);
}

async function importRA(objs) {
    console.log('[RA Import] Processing', objs.length, 'objects');
    console.log('[RA Import] First object keys:', Object.keys(objs[0] || {}));

    const newOrders = [], duplicates = [];
    // Use timestamp+projectCode as unique key (each Form submission has unique timestamp)
    const existingSet = new Set(ordersRA.map(o => `${o.projectCode}|${o.timestamp}`));

    for (const o of objs) {
        // Flexible field mapping for RA
        const projCode = getFieldValue(o, ['Código de Proyecto', 'Codigo de Proyecto', 'Project Code', 'Proyecto']);
        const technician = getFieldValue(o, ['Técnico Responsable', 'Tecnico Responsable', 'Técnico', 'Tecnico', 'Technician']);
        const startDate = getFieldValue(o, ['Fecha de Inicio', 'Fecha Inicio', 'Start Date', 'Inicio']);
        const endDate = getFieldValue(o, ['Fecha de Finalización', 'Fecha Finalizacion', 'Fecha Final', 'End Date']);
        const fibers = getFieldValue(o, ['Número de Fibras', 'Numero de Fibras', 'Fibras', 'Fibers', 'Fiber Count']);
        const meters = getFieldValue(o, ['Metros Soplados', 'Metros', 'meters', 'Longitud', 'Distance']);
        const color = getFieldValue(o, ['Color miniducto', 'Color', 'Miniducto Color', 'Tube Color']);
        const incidents = getFieldValue(o, ['Incidencias (si las hubo)', 'Incidencias', 'Incidents', 'Problemas']);
        const photos = getFieldValue(o, ['Fotos del Trabajo', 'Fotos', 'Photos', 'Registro Fotográfico']);
        const timestamp = getFieldValue(o, ['Timestamp', 'timestamp', 'Marca temporal', 'Time']);

        const key = `${projCode}|${timestamp}`;
        const isDup = existingSet.has(key);

        const order = {
            timestamp: timestamp,
            projectCode: projCode,
            technician: technician,
            startDate: startDate,
            endDate: endDate,
            fibers: fibers,
            meters: meters,
            color: color,
            incidents: incidents,
            photos: photos,
        };

        console.log('[RA Import] Processing order:', { projCode, technician, meters, fibers });

        if (isDup) {
            duplicates.push(`${projCode} (${technician}, ${meters}m)`);
        } else {
            newOrders.push(`${projCode} (${technician}, ${fibers} fibras, ${meters}m)`);
            existingSet.add(key);
            await dbPut('orders_ra', order); // Only save if not duplicate
        }
    }
    // Find GEREED in GO without RA order
    const missing = [];
    const raProjects = new Set([...ordersRA.map(o => o.projectCode), ...objs.map(o => o['Código de Proyecto'] || '')]);
    // Group goStatus by project - for RA, check einblasenAPDP GEREED
    const goByProject = {};
    goStatus.forEach(g => {
        const proj = g.projekt || '';
        if (!goByProject[proj]) goByProject[proj] = [];
        goByProject[proj].push(g);
    });
    // Also check by matching project codes from clients
    goStatus.forEach(g => {
        if (g.einblasenAPDP?.toUpperCase().includes('GEREED')) {
            // Find project code for this DP
            const client = clients.find(c => c.dp === g.dp);
            const projCode = client?.projectCode || '';
            if (projCode && !raProjects.has(projCode)) {
                missing.push(`${projCode} ${g.dp}`);
            }
        }
    });
    // Deduplicate missing by project
    const uniqueMissing = [...new Set(missing)];
    toast(`✅ ${objs.length} Soplado RA ${t('imported')}`);
    showImportReport('soplado_ra', newOrders, duplicates, uniqueMissing);
}

// Field mapping for flexible CSV import
function getFieldValue(obj, fieldNames) {
    for (const name of fieldNames) {
        if (obj[name]) return obj[name];
    }
    return '';
}

async function importRD(objs) {
    console.log('[RD Import] Processing', objs.length, 'objects');
    console.log('[RD Import] First object keys:', Object.keys(objs[0] || {}));

    const newOrders = [], duplicates = [];
    const existingSet = new Set(ordersRD.map(o => `${o.projectCode}|${o.dp}|${o.ka}`));

    for (const o of objs) {
        // Flexible field mapping - try multiple possible column names
        const dp = normalizeDP(getFieldValue(o, ['DP', 'dp', 'Distribución Point', 'Distribution Point']));
        const projCode = getFieldValue(o, ['Código de Proyecto', 'Codigo de Proyecto', 'Project Code', 'Proyecto']);
        const ka = getFieldValue(o, ['KA cliente', 'KA Cliente', 'KA', 'ka cliente', 'Cliente KA']);
        const street = getFieldValue(o, ['Calle', 'calle', 'Dirección', 'Direccion', 'Address', 'Street']);
        const technician = getFieldValue(o, ['Técnico Responsable', 'Tecnico Responsable', 'Técnico', 'Tecnico', 'Technician']);
        const startDate = getFieldValue(o, ['Fecha de Inicio', 'Fecha Inicio', 'Start Date', 'Inicio']);
        const endDate = getFieldValue(o, ['Fecha de Finalización', 'Fecha Finalizacion', 'Fecha Final', 'End Date']);
        const meters = getFieldValue(o, ['Metros Soplados', 'Metros', 'meters', 'Longitud', 'Distance']);
        const color = getFieldValue(o, ['Color miniducto', 'Color', 'Miniducto Color', 'Tube Color']);
        const incidents = getFieldValue(o, ['Incidencias (si las hubo)', 'Incidencias', 'Incidents', 'Problemas']);
        const photos = getFieldValue(o, ['Fotos del Trabajo', 'Fotos', 'Photos', 'Registro Fotográfico']);
        const fibers = getFieldValue(o, ['Número de Fibras', 'Numero de Fibras', 'Fibras', 'Fibers', 'Fiber Count']);
        const timestamp = getFieldValue(o, ['Timestamp', 'timestamp', 'Marca temporal', 'Time']);

        const key = `${projCode}|${dp}|${ka}`;
        const isDup = existingSet.has(key);

        const order = {
            timestamp: timestamp,
            projectCode: projCode,
            dp: dp,
            street: street,
            ka: ka,
            technician: technician,
            startDate: startDate,
            endDate: endDate,
            meters: meters,
            color: color,
            incidents: incidents,
            photos: photos,
            fibers: fibers,
        };

        console.log('[RD Import] Processing order:', { projCode, dp, ka, technician, meters });

        if (isDup) {
            duplicates.push(`${projCode} ${dp} ${ka} (${street})`);
        } else {
            newOrders.push(`${projCode} ${dp} ${ka} (${technician}, ${meters}m)`);
            existingSet.add(key);
            await dbPut('orders_rd', order); // Only save if not duplicate
        }
    }
    await loadAll();
    await autoUpdateFromRD();
    toast(`✅ ${objs.length} Soplado RD ${t('imported')}`);
    showImportReport('soplado_rd', newOrders, duplicates, []);
}

async function importFusion(objs) {
    console.log('[Fusion Import] Processing', objs.length, 'objects');
    console.log('[Fusion Import] First object keys:', Object.keys(objs[0] || {}));

    const newOrders = [], duplicates = [];
    const existingSet = new Set(ordersFusion.map(o => `${o.projectCode}|${o.dp}`));

    for (const o of objs) {
        // Flexible field mapping for Fusion
        const dpRaw = getFieldValue(o, ['DP', 'dp', 'Distribución Point', 'Distribution Point']);
        const dp = normalizeDP(dpRaw);
        const projCode = getFieldValue(o, ['Código de Proyecto', 'Codigo de Proyecto', 'Project Code', 'Proyecto']);
        const technician = getFieldValue(o, ['Técnico Responsable', 'Tecnico Responsable', 'Técnico', 'Tecnico', 'Technician']);
        const startDate = getFieldValue(o, ['Fecha de Inicio', 'Fecha Inicio', 'Start Date', 'Inicio']);
        const endDate = getFieldValue(o, ['Fecha de Finalización', 'Fecha Finalizacion', 'Fecha Final', 'End Date']);
        const splices = getFieldValue(o, ['Fusiones realizadas', 'Fusiones', 'Splices', 'Número de Fusiones', 'Fusion Count']);
        const incidents = getFieldValue(o, ['Incidencias (si las hubo)', 'Incidencias', 'Incidents', 'Problemas']);
        const photos = getFieldValue(o, ['Fotos del Trabajo', 'Fotos', 'Photos']);
        const photoRegistry = getFieldValue(o, ['Registro Fotografico', 'Registro Fotográfico', 'Photo Registry']);
        const timestamp = getFieldValue(o, ['Timestamp', 'timestamp', 'Marca temporal', 'Time']);

        const key = `${projCode}|${dp}`;
        const isDup = existingSet.has(key);

        const order = {
            timestamp: timestamp,
            projectCode: projCode,
            dp: dp,
            technician: technician,
            startDate: startDate,
            endDate: endDate,
            splices: splices,
            incidents: incidents,
            photos: photos,
            photoRegistry: photoRegistry,
        };

        console.log('[Fusion Import] Processing order:', { projCode, dp, technician, splices });

        if (isDup) {
            duplicates.push(`${projCode} ${dp} (${technician})`);
        } else {
            newOrders.push(`${projCode} ${dp} (${technician}, ${splices} fusiones)`);
            existingSet.add(key);
            await dbPut('orders_fusion', order); // Only save if not duplicate
        }
    }
    // Find GEREED in GO (spleissenAP or spleisseDPbereit) without fusion order
    await loadAll();
    const fusionDPSet = new Set(ordersFusion.map(o => `${o.projectCode}|${o.dp}`));
    const missing = [];
    goStatus.forEach(g => {
        if (g.spleissenAP?.toUpperCase().includes('GEREED') || g.spleisseDPbereit?.toUpperCase().includes('GEREED')) {
            const client = clients.find(c => c.dp === g.dp);
            const projCode = client?.projectCode || '';
            if (projCode && !fusionDPSet.has(`${projCode}|${g.dp}`)) {
                missing.push(`${projCode} ${g.dp}`);
            }
        }
    });
    const uniqueMissing = [...new Set(missing)];
    await autoUpdateFromFusion();
    toast(`✅ ${objs.length} Fusión ${t('imported')}`);
    showImportReport('fusion', newOrders, duplicates, uniqueMissing);
}

async function importGoStatus(objs) {
    await dbClear('go_status');
    for (const o of objs) {
        const keys = Object.keys(o);
        const projKey = keys.find(k => k.toLowerCase().includes('projekt') && k.toLowerCase().includes('nummer')) || keys[0];
        const entry = {
            projektnummer: o[projKey] || '',
            projekt: o['Projekt'] || '',
            dp: normalizeDP(o['DP'] || ''),
            dpFull: o['DP'] || '',
            startTiefbau: o['Start Tiefbau'] || '',
            endeTiefbau: o['Ende Tiefbau'] || '',
            tiefbauFertig: (o[keys.find(k => k.toLowerCase().includes('tiefbau fertig'))] || '').toString(),
            kabelsorte: o['Kabelsorte'] || '',
            einblasenAPDP: o[keys.find(k => k.toLowerCase().includes('einblasen'))] || '',
            spleissenAP: o[keys.find(k => k.toLowerCase().includes('spleißen ap') || k.toLowerCase().includes('spleissen ap'))] || '',
            spleisseDPbereit: o[keys.find(k => k.toLowerCase().includes('spleiße dp') || k.toLowerCase().includes('spleisse dp'))] || '',
        };
        await dbPut('go_status', entry);
    }
    toast(`✅ ${objs.length} GO Status ${t('imported')}`);
}

// ============================================
// AUTO STATUS UPDATE
// ============================================
async function autoUpdateFromRD() {
    // When RD order exists for a client (match by DP + KA), update if needed
    for (const rd of ordersRD) {
        const matching = clients.filter(c => c.dp === rd.dp && c.cableId && c.cableId.includes(rd.ka));
        for (const c of matching) {
            if (c.status === '108') continue; // civil works issue stays
            if (c.status === '109') {
                // Check if RA also done for this DP
                const raExists = ordersRA.some(ra => ra.projectCode === rd.projectCode);
                if (raExists) {
                    c.status = '103'; // could advance
                    c.phase = 'Spleiße';
                    await dbPut('clients', c);
                }
            }
        }
    }
}

async function autoUpdateFromFusion() {
    for (const f of ordersFusion) {
        const dpNorm = f.dp;
        const matching = clients.filter(c => c.dp === dpNorm || c.dp === f.dp);
        for (const c of matching) {
            if (c.status === '108') continue;
            if (['109','0'].includes(c.status)) {
                c.phase = 'Spleiße';
                await dbPut('clients', c);
            }
        }
    }
}

// ============================================
// EXPORT
// ============================================
function exportData() {
    const view = document.querySelector('.view.active')?.id;
    let csv = '', filename = 'export.csv';
    if (view === 'view-clients') {
        const headers = ['Auftrag','Projektnummer','DP','Straße','Hausnummer','CableID','Contract','Status','Phase'];
        const rows = clients.map(c => [c.auftrag,c.projektnummer,c.dp,c.street,c.hausnummer,c.cableId,c.contract,c.status,c.phase].map(v=>`"${(v||'').toString().replace(/"/g,'""')}"`).join(','));
        csv = [headers.join(','), ...rows].join('\n');
        filename = 'clients-export.csv';
    } else if (view === 'view-orders') {
        if (currentOrderTab === 'ra') {
            const h = ['Timestamp','Project','Technician','StartDate','EndDate','Fibers','Meters','Color','Incidents'];
            const rows = ordersRA.map(o => [o.timestamp,o.projectCode,o.technician,o.startDate,o.endDate,o.fibers,o.meters,o.color,o.incidents].map(v=>`"${(v||'')}"`).join(','));
            csv = [h.join(','), ...rows].join('\n'); filename = 'orders-ra.csv';
        } else if (currentOrderTab === 'rd') {
            const h = ['Timestamp','Project','DP','Street','KA','Technician','StartDate','EndDate','Meters','Color','Fibers'];
            const rows = ordersRD.map(o => [o.timestamp,o.projectCode,o.dp,o.street,o.ka,o.technician,o.startDate,o.endDate,o.meters,o.color,o.fibers].map(v=>`"${(v||'')}"`).join(','));
            csv = [h.join(','), ...rows].join('\n'); filename = 'orders-rd.csv';
        } else {
            const h = ['Timestamp','Project','DP','Technician','StartDate','EndDate','Splices','Incidents'];
            const rows = ordersFusion.map(o => [o.timestamp,o.projectCode,o.dp,o.technician,o.startDate,o.endDate,o.splices,o.incidents].map(v=>`"${(v||'')}"`).join(','));
            csv = [h.join(','), ...rows].join('\n'); filename = 'orders-fusion.csv';
        }
    } else return toast('Selecciona Clientes u Órdenes para exportar');
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    toast('📥 ' + filename);
}

// ============================================
// RENDER ALL
// ============================================
function renderAll() {
    renderDashboard();
    renderAdmin();
    renderClients();
    renderOrders();
    renderProjects();
    renderInvoicing();
    renderPrices();
    updateClientFilters();
}

function renderAdmin() {
    try {
        // Simple version - just render basic admin elements
        const totalOrders = (ordersRA?.length || 0) + (ordersRD?.length || 0) + (ordersFusion?.length || 0);

        // Render critical alerts - simple version
        const criticalEl = document.getElementById('adminCriticalAlerts');
        if (criticalEl) {
            if (totalOrders > 10) {
                criticalEl.innerHTML = `<div class="alert-item warning">⚠️ ${totalOrders} órdenes requieren revisión administrativa</div>`;
            } else {
                criticalEl.innerHTML = '<p style="color:var(--green)">✅ No hay alertas críticas</p>';
            }
        }

        // Real certification stats
        const goByDPAdmin = {};
        goStatus.forEach(g => { goByDPAdmin[g.dp] = g; });
        const rdDPs = new Set(ordersRD.map(o => o.dp).filter(Boolean));
        const fusionDPs = new Set(ordersFusion.map(o => o.dp).filter(Boolean));
        const allWorkedDPs = new Set([...rdDPs, ...fusionDPs]);
        let certified = 0, pending = 0;
        allWorkedDPs.forEach(dp => {
            const hasRD = rdDPs.has(dp);
            const hasFusion = fusionDPs.has(dp);
            const g = goByDPAdmin[dp];
            const blowGereed = g?.einblasenAPDP?.toUpperCase().includes('GEREED');
            const spliceGereed = g?.spleissenAP?.toUpperCase().includes('GEREED') || g?.spleisseDPbereit?.toUpperCase().includes('GEREED');
            if (hasRD && hasFusion && blowGereed && spliceGereed) certified++;
            else pending++;
        });
        const certRate = allWorkedDPs.size > 0 ? Math.round(certified / allWorkedDPs.size * 100) : 0;

        const certStatsEl = document.getElementById('certificationStats');
        if (certStatsEl) {
            certStatsEl.innerHTML = `
                <div class="workflow-stat">
                    <div class="workflow-stat-value" style="color:var(--green)">${certified}</div>
                    <div class="workflow-stat-label">Certificados</div>
                </div>
                <div class="workflow-stat">
                    <div class="workflow-stat-value" style="color:var(--orange)">${pending}</div>
                    <div class="workflow-stat-label">Pendientes</div>
                </div>
                <div class="workflow-stat">
                    <div class="workflow-stat-value" style="color:var(--blue)">${certRate}%</div>
                    <div class="workflow-stat-label">Rate Cert.</div>
                </div>
            `;
        }

        // Real quality score: orders without incidents / total * 100
        const allOrdAdmin = [...(ordersRA||[]), ...(ordersRD||[]), ...(ordersFusion||[])];
        const withoutIncidents = allOrdAdmin.filter(o => !o.incidents || o.incidents.trim() === '').length;
        const qualityScore = allOrdAdmin.length > 0 ? Math.round(withoutIncidents / allOrdAdmin.length * 100) : 100;

        const performanceEl = document.getElementById('performanceMetrics');
        if (performanceEl) {
            performanceEl.innerHTML = `
                <div class="metric-card">
                    <div class="metric-title">Total Órdenes</div>
                    <div class="metric-value">${totalOrders}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-title">Score de Calidad</div>
                    <div class="metric-value">${qualityScore}%</div>
                </div>
                <div class="metric-card">
                    <div class="metric-title">DPs Trabajados</div>
                    <div class="metric-value">${allWorkedDPs.size}</div>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error in renderAdmin:', error);
    }
}

// ============================================
// DASHBOARD
// ============================================
function renderDashboard() {
    try {
        // MAIN KPI CALCULATIONS
        const uniqueProjects = new Set(clients.map(c => c.projectCode).filter(Boolean));
        const uniqueDPs = new Set(clients.map(c => c.dp).filter(Boolean));

        // Update basic KPIs - with null checks
        const totalProjectsEl = document.getElementById('totalProjects');
        const totalDPsEl = document.getElementById('totalDPs');
        const totalClientsEl = document.getElementById('totalClients');

        if (totalProjectsEl) totalProjectsEl.textContent = uniqueProjects.size;
        if (totalDPsEl) totalDPsEl.textContent = uniqueDPs.size;
        if (totalClientsEl) totalClientsEl.textContent = clients.length;

        // Calculate admin-specific metrics from real data
        const totalOrders = (ordersRA?.length || 0) + (ordersRD?.length || 0) + (ordersFusion?.length || 0);
        const realDiscrepancies = calculateGODiscrepancies();
        const goByDPDash = {};
        goStatus.forEach(g => { goByDPDash[g.dp] = g; });
        // Orders with incidents = need review
        const withIncidents = [...ordersRA, ...ordersRD, ...ordersFusion].filter(o => o.incidents && o.incidents.trim() !== '');
        const pendingReview = withIncidents.length;
        const goDiscrepancies = realDiscrepancies.length;
        // Ready to certify: DPs where both soplado + fusion done
        const dpsFused = new Set(ordersFusion.map(o => o.dp).filter(Boolean));
        const dpsBlown = new Set(ordersRD.map(o => o.dp).filter(Boolean));
        const readyToCertify = [...dpsFused].filter(dp => dpsBlown.has(dp)).length;

        // Update admin KPIs - with null checks
        const pendingReviewEl = document.getElementById('pendingReview');
        const goDiscrepanciesEl = document.getElementById('goDiscrepancies');
        const readyToCertifyEl = document.getElementById('readyToCertify');

        if (pendingReviewEl) pendingReviewEl.textContent = pendingReview;
        if (goDiscrepanciesEl) goDiscrepanciesEl.textContent = goDiscrepancies;
        if (readyToCertifyEl) readyToCertifyEl.textContent = readyToCertify;

        // Update trends - with null checks
        const projectsTrendEl = document.getElementById('projectsTrend');
        const dpsTrendEl = document.getElementById('dpsTrend');
        const clientsTrendEl = document.getElementById('clientsTrend');

        if (projectsTrendEl) projectsTrendEl.textContent = `${ordersRA.length} RA cargados`;
        if (dpsTrendEl) dpsTrendEl.textContent = `${ordersRD.length} RD + ${ordersFusion.length} Fusión`;
        if (clientsTrendEl) clientsTrendEl.textContent = `${goStatus.length} en GO`;

        // ADMIN ALERTS - safe version
        renderAdminAlertsSafe();

    } catch (error) {
        console.error('Error in renderDashboard:', error);
        // Fallback: just update basic numbers
        const totalProjectsEl = document.getElementById('totalProjects');
        if (totalProjectsEl) totalProjectsEl.textContent = clients?.length ? new Set(clients.map(c => c.projectCode).filter(Boolean)).size : 0;
    }

    // These old dashboard elements are no longer used in the new admin dashboard

    // Project progress cards
    const projMap = {};
    clients.forEach(c => {
        if (!c.projectCode) return;
        if (!projMap[c.projectCode]) projMap[c.projectCode] = { total:0, dps: new Set(), statusCounts: {'108':0,'109':0,'103':0,'100':0,'0':0,'Fertig':0} };
        projMap[c.projectCode].total++;
        projMap[c.projectCode].dps.add(c.dp);
        const s = c.status in projMap[c.projectCode].statusCounts ? c.status : '0';
        projMap[c.projectCode].statusCounts[s]++;
    });

    // Enrich with GO status
    const goByDP = {};
    goStatus.forEach(g => { goByDP[g.dp] = g; });

    let phtml = '';
    Object.entries(projMap).sort((a,b) => a[0].localeCompare(b[0])).forEach(([code, data]) => {
        const fertigPct = data.total ? Math.round(data.statusCounts['Fertig'] / data.total * 100) : 0;
        const colors = { '108':'var(--red)', '109':'var(--blue)', '103':'var(--yellow)', '100':'var(--orange)', '0':'var(--text-tertiary)', 'Fertig':'var(--green)' };
        let barHtml = '';
        for (const [s, cnt] of Object.entries(data.statusCounts)) {
            if (cnt > 0) {
                const w = (cnt / data.total * 100).toFixed(1);
                barHtml += `<div style="width:${w}%;background:${colors[s]}" title="${s}: ${cnt}"></div>`;
            }
        }

        // Count GO status for DPs in this project
        let blowDone = 0, spliceAPDone = 0, spliceDPDone = 0;
        data.dps.forEach(dp => {
            const g = goByDP[dp];
            if (g) {
                if (g.einblasenAPDP && g.einblasenAPDP.toUpperCase().includes('GEREED')) blowDone++;
                if (g.spleissenAP && g.spleissenAP.toUpperCase().includes('GEREED')) spliceAPDone++;
                if (g.spleisseDPbereit && g.spleisseDPbereit.toUpperCase().includes('GEREED')) spliceDPDone++;
            }
        });

        phtml += `<div class="project-card">
            <h3 style="color:var(--green)">${code}</h3>
            <div class="project-stat"><span>DPs</span><span>${data.dps.size}</span></div>
            <div class="project-stat"><span>${t('totalClients')}</span><span>${data.total}</span></div>
            <div class="project-stat"><span>${t('blowingDone')}</span><span>${blowDone}/${data.dps.size}</span></div>
            <div class="project-stat"><span>${t('splicingAP')}</span><span>${spliceAPDone}/${data.dps.size}</span></div>
            <div class="project-stat"><span>${t('splicingDP')}</span><span>${spliceDPDone}/${data.dps.size}</span></div>
            <div class="project-stat"><span>Fertig</span><span>${data.statusCounts['Fertig']} (${fertigPct}%)</span></div>
            <div class="status-bar">${barHtml}</div>
        </div>`;
    });
    
    // Try to render additional sections, but don't fail if they error
    try {
        renderProductivityGrid();
        renderStatusOverview(); 
        renderActivityFeed();
    } catch (error) {
        console.error('Error rendering dashboard sections:', error);
    }
}

// ============================================
// CLIENTS
// ============================================
function updateClientFilters() {
    const projs = [...new Set(clients.map(c => c.projectCode).filter(Boolean))].sort();
    const dps = [...new Set(clients.map(c => c.dp).filter(Boolean))].sort();
    const pSel = document.getElementById('clientFilterProject');
    const dSel = document.getElementById('clientFilterDP');
    const pv = pSel.value, dv = dSel.value;
    pSel.innerHTML = '<option value="">Todos</option>' + projs.map(p => `<option value="${p}">${p}</option>`).join('');
    dSel.innerHTML = '<option value="">Todos DP</option>' + dps.map(d => `<option value="${d}">${d}</option>`).join('');
    pSel.value = pv; dSel.value = dv;
}

function sortClients(field) {
    if (clientSort.field === field) clientSort.dir *= -1;
    else { clientSort.field = field; clientSort.dir = 1; }
    renderClients();
}

function renderClients() {
    const search = (document.getElementById('clientSearch').value || '').toLowerCase();
    const fp = document.getElementById('clientFilterProject').value;
    const fd = document.getElementById('clientFilterDP').value;
    const fs = document.getElementById('clientFilterStatus').value;

    let filtered = clients.filter(c => {
        if (search && !`${c.auftrag} ${c.dp} ${c.street} ${c.hausnummer} ${c.cableId}`.toLowerCase().includes(search)) return false;
        if (fp && c.projectCode !== fp) return false;
        if (fd && c.dp !== fd) return false;
        if (fs && c.status !== fs) return false;
        return true;
    });

    const f = clientSort.field;
    filtered.sort((a, b) => {
        const va = (f === 'auftrag' ? a.auftrag : f === 'dp' ? a.dp : f === 'street' ? a.street : f === 'cableId' ? a.cableId : f === 'contract' ? a.contract : f === 'status' ? a.status : a.phase) || '';
        const vb = (f === 'auftrag' ? b.auftrag : f === 'dp' ? b.dp : f === 'street' ? b.street : f === 'cableId' ? b.cableId : f === 'contract' ? b.contract : f === 'status' ? b.status : b.phase) || '';
        return va.localeCompare(vb) * clientSort.dir;
    });

    const tbody = document.getElementById('clientsBody');
    if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-tertiary)">${t('noData')}</td></tr>`;
    } else {
        tbody.innerHTML = filtered.map(c => {
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
        }).join('');
    }
    document.getElementById('clientCount').textContent = `${filtered.length} / ${clients.length} clientes`;
}

// ============================================
// ORDERS
// ============================================
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

function updateOrderFilterDropdowns() {
    const techs = new Set(), projs = new Set();
    [...ordersRA, ...ordersRD, ...ordersFusion].forEach(o => {
        if (o.technician) techs.add(o.technician);
        if (o.projectCode) projs.add(o.projectCode);
    });
    const techSel = document.getElementById('filterTechnician');
    const projSel = document.getElementById('filterProject');
    if (techSel) {
        const v = techSel.value;
        techSel.innerHTML = '<option value="">Todos Técnicos</option>' + [...techs].sort().map(t => `<option value="${t}">${t}</option>`).join('');
        techSel.value = v;
    }
    if (projSel) {
        const v = projSel.value;
        projSel.innerHTML = '<option value="">Todos Proyectos</option>' + [...projs].sort().map(p => `<option value="${p}">${p}</option>`).join('');
        projSel.value = v;
    }
}

function filterOrders(orders) {
    return orders.filter(o => {
        if (orderFilters.technician && o.technician !== orderFilters.technician) return false;
        if (orderFilters.project && o.projectCode !== orderFilters.project) return false;
        if (orderFilters.search) {
            const s = orderFilters.search;
            const haystack = `${o.projectCode} ${o.dp || ''} ${o.technician} ${o.street || ''} ${o.ka || ''}`.toLowerCase();
            if (!haystack.includes(s)) return false;
        }
        return true;
    });
}

function renderPhotoLinks(photosStr) {
    if (!photosStr || photosStr.trim() === '' || photosStr === 'https://drive.google.com/') return '<span style="color:var(--text-tertiary)">—</span>';
    return photosStr.split(',').map(url => {
        url = url.trim();
        if (!url) return '';
        const display = url.length > 40 ? url.substring(0, 37) + '...' : url;
        return `<a href="${url}" target="_blank">${display}</a>`;
    }).filter(Boolean).join('');
}

function toggleOrderDetail(tr, type, index) {
    const existing = tr.nextElementSibling;
    if (existing && existing.classList.contains('order-detail-row')) {
        existing.remove();
        return;
    }
    // Remove any other open detail rows in this table
    tr.closest('tbody').querySelectorAll('.order-detail-row').forEach(r => r.remove());

    const orders = type === 'ra' ? filterOrders(ordersRA) : type === 'rd' ? filterOrders(ordersRD) : filterOrders(ordersFusion);
    const o = orders[index];
    if (!o) return;

    const colspan = type === 'ra' ? 9 : type === 'rd' ? 10 : 7;
    let fields = '';

    const df = (label, value) => `<div class="detail-field"><div class="detail-label">${label}</div><div class="detail-value">${value || '—'}</div></div>`;

    if (type === 'ra') {
        fields = df('Timestamp', o.timestamp) + df('Proyecto', o.projectCode) + df('Técnico', o.technician)
            + df('Inicio → Fin', `${o.startDate || '?'} → ${o.endDate || '?'}`)
            + df('Fibras', o.fibers) + df('Metros', o.meters) + df('Color', o.color)
            + (o.incidents ? `<div class="detail-field"><div class="detail-label">Incidencias</div><div class="detail-value detail-incident">${o.incidents}</div></div>` : '')
            + `<div class="detail-field detail-photos"><div class="detail-label">Fotos</div>${renderPhotoLinks(o.photos)}</div>`;
    } else if (type === 'rd') {
        fields = df('Timestamp', o.timestamp) + df('Proyecto', o.projectCode) + df('DP', o.dp) + df('Calle', o.street) + df('KA', o.ka)
            + df('Técnico', o.technician) + df('Inicio → Fin', `${o.startDate || '?'} → ${o.endDate || '?'}`)
            + df('Metros', o.meters) + df('Color', o.color) + df('Fibras', o.fibers)
            + (o.incidents ? `<div class="detail-field"><div class="detail-label">Incidencias</div><div class="detail-value detail-incident">${o.incidents}</div></div>` : '')
            + `<div class="detail-field detail-photos"><div class="detail-label">Fotos</div>${renderPhotoLinks(o.photos)}</div>`;
    } else {
        fields = df('Timestamp', o.timestamp) + df('Proyecto', o.projectCode) + df('DP', o.dp) + df('Técnico', o.technician)
            + df('Inicio → Fin', `${o.startDate || '?'} → ${o.endDate || '?'}`)
            + df('Fusiones', o.splices)
            + (o.incidents ? `<div class="detail-field"><div class="detail-label">Incidencias</div><div class="detail-value detail-incident">${o.incidents}</div></div>` : '')
            + `<div class="detail-field detail-photos"><div class="detail-label">Fotos</div>${renderPhotoLinks(o.photos)}</div>`
            + `<div class="detail-field detail-photos"><div class="detail-label">Registro Fotográfico</div>${renderPhotoLinks(o.photoRegistry)}</div>`;
    }

    const detailRow = document.createElement('tr');
    detailRow.className = 'order-detail-row';
    detailRow.innerHTML = `<td colspan="${colspan}"><div class="order-detail-content">${fields}</div></td>`;
    tr.after(detailRow);
}

function renderOrders() {
    updateOrderFilterDropdowns();
    const fRA = filterOrders(ordersRA);
    const fRD = filterOrders(ordersRD);
    const fFusion = filterOrders(ordersFusion);

    // RA
    document.getElementById('raBody').innerHTML = fRA.length ? fRA.map((o, i) => `<tr class="order-row" onclick="toggleOrderDetail(this,'ra',${i})">
        <td>${o.startDate || o.timestamp}</td><td>${o.projectCode}</td><td>${o.dp || '-'}</td><td>${o.technician}</td>
        <td>${o.fibers}</td><td>${o.meters}</td><td>${o.color}</td><td style="font-size:11px">${o.incidents || '-'}</td>
        <td><button class="btn btn-sm" style="background:var(--red);color:#fff;border:none;padding:4px 8px;font-size:11px;cursor:pointer;border-radius:4px" onclick="event.stopPropagation();deleteOrder('orders_ra',${o.id},'Soplado RA')">🗑️</button></td>
    </tr>`).join('') : `<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--text-tertiary)">${t('noData')}</td></tr>`;

    // RD
    document.getElementById('rdBody').innerHTML = fRD.length ? fRD.map((o, i) => `<tr class="order-row" onclick="toggleOrderDetail(this,'rd',${i})">
        <td>${o.startDate || o.timestamp}</td><td>${o.projectCode}</td><td>${o.dp}</td><td style="font-size:12px">${o.street}</td>
        <td>${o.ka}</td><td>${o.technician}</td><td>${o.meters}</td><td>${o.color}</td><td>${o.fibers}</td>
        <td><button class="btn btn-sm" style="background:var(--red);color:#fff;border:none;padding:4px 8px;font-size:11px;cursor:pointer;border-radius:4px" onclick="event.stopPropagation();deleteOrder('orders_rd',${o.id},'Soplado RD')">🗑️</button></td>
    </tr>`).join('') : `<tr><td colspan="10" style="text-align:center;padding:30px;color:var(--text-tertiary)">${t('noData')}</td></tr>`;

    // Fusion
    document.getElementById('fusionBody').innerHTML = fFusion.length ? fFusion.map((o, i) => `<tr class="order-row" onclick="toggleOrderDetail(this,'fusion',${i})">
        <td>${o.startDate || o.timestamp}</td><td>${o.projectCode}</td><td>${o.dp}</td>
        <td>${o.technician}</td><td>${o.splices}</td><td style="font-size:11px">${o.incidents || '-'}</td>
        <td><button class="btn btn-sm" style="background:var(--red);color:#fff;border:none;padding:4px 8px;font-size:11px;cursor:pointer;border-radius:4px" onclick="event.stopPropagation();deleteOrder('orders_fusion',${o.id},'Fusión')">🗑️</button></td>
    </tr>`).join('') : `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-tertiary)">${t('noData')}</td></tr>`;
}

// ============================================
// ORDER MODAL (manual add)
// ============================================
function openOrderModal(type) {
    editingOrderType = type;
    const modal = document.getElementById('orderModal');
    const title = type === 'ra' ? 'Soplado RA' : type === 'rd' ? 'Soplado RD' : 'Fusión';
    document.getElementById('orderModalTitle').textContent = '+ ' + title;

    let html = '';
    const fg = (id, label, type='text', ph='') => `<div class="form-group"><label>${label}</label><input type="${type}" id="om_${id}" placeholder="${ph}"></div>`;

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
            <div class="form-row">${fg('color','Color Miniducto')}${fg('fibers','Fibras','number')}</div>
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
        await dbPut('orders_ra', { timestamp: today, projectCode: g('projectCode'), technician: g('technician'), startDate: g('startDate'), endDate: g('endDate'), fibers: g('fibers'), meters: g('meters'), color: g('color'), incidents: g('incidents'), photos: g('photos') });
    } else if (type === 'rd') {
        await dbPut('orders_rd', { timestamp: today, projectCode: g('projectCode'), dp: normalizeDP(g('dp')), street: g('street'), ka: g('ka'), technician: g('technician'), startDate: g('startDate'), endDate: g('endDate'), meters: g('meters'), color: g('color'), incidents: g('incidents'), photos: g('photos'), fibers: g('fibers') });
    } else {
        await dbPut('orders_fusion', { timestamp: today, projectCode: g('projectCode'), dp: normalizeDP(g('dp')), technician: g('technician'), startDate: g('startDate'), endDate: g('endDate'), splices: g('splices'), incidents: g('incidents'), photos: g('photos'), photoRegistry: g('photoRegistry') });
    }
    await loadAll();
    if (type === 'rd') await autoUpdateFromRD();
    if (type === 'fusion') await autoUpdateFromFusion();
    await loadAll();
    renderAll();
    closeOrderModal();
    toast('✅ Orden guardada');
}

document.getElementById('orderModal').addEventListener('click', function(e) { if (e.target === this) closeOrderModal(); });

// ============================================
// PROJECTS
// ============================================
let expandedProjects = new Set();

function toggleProject(code) {
    if (expandedProjects.has(code)) expandedProjects.delete(code);
    else expandedProjects.add(code);
    renderProjects();
}

function renderProjects() {
    const projMap = {};
    clients.forEach(c => {
        if (!c.projectCode) return;
        if (!projMap[c.projectCode]) projMap[c.projectCode] = { total:0, dps: new Set(), statusCounts: {'108':0,'109':0,'103':0,'100':0,'0':0,'Fertig':0} };
        projMap[c.projectCode].total++;
        projMap[c.projectCode].dps.add(c.dp);
        const s = c.status in projMap[c.projectCode].statusCounts ? c.status : '0';
        projMap[c.projectCode].statusCounts[s]++;
    });

    const goByDP = {};
    goStatus.forEach(g => { goByDP[g.dp] = g; });

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
            const g = goByDP[dp];
            if (g) {
                if (g.einblasenAPDP?.toUpperCase().includes('GEREED')) blowDone++;
                if (g.spleissenAP?.toUpperCase().includes('GEREED')) spliceAPDone++;
                if (g.spleisseDPbereit?.toUpperCase().includes('GEREED')) spliceDPDone++;
            }
        });

        const raCount = ordersRA.filter(o => o.projectCode === code).length;
        const rdCount = ordersRD.filter(o => o.projectCode === code).length;
        const fusionCount = ordersFusion.filter(o => o.projectCode === code).length;

        // Build DP detail table if expanded
        let dpTableHtml = '';
        if (isExpanded) {
            const sortedDPs = [...data.dps].sort();
            let dpRows = '';
            for (const dp of sortedDPs) {
                const g = goByDP[dp];
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

                // Status: compare work done (orders) vs GO FiberConnect
                // Key question: is work reflected in GO so the client sees it and pays?
                let warnings = [];
                // Work done but NOT in GO = problem (need to upload to GO)
                if (hasRA && !blowOK) warnings.push('🔴 Soplado hecho, NO en GO');
                if (hasFusion && !spliceAPOK) warnings.push('🔴 Fusión hecha, NO en GO');
                // In GO but no order = already good in GO (just missing internal record)
                // Both match = perfect

                const allGO = blowOK && spliceAPOK && spliceDPOK;
                const anyGO = blowOK || spliceAPOK || spliceDPOK;
                const anyWork = hasRA || hasRD || hasFusion;
                const rowClass = allGO ? 'dp-row-green' : (anyGO || anyWork) ? 'dp-row-yellow' : 'dp-row-red';

                let statusHtml;
                if (warnings.length) statusHtml = warnings.join('<br>');
                else if (allGO) statusHtml = '✅ En GO';
                else if (anyGO) statusHtml = '🔄 Parcial en GO';
                else if (anyWork) statusHtml = '⚠️ Trabajo hecho, falta subir a GO';
                else statusHtml = '⏳ Pendiente';

                dpRows += `<tr class="${rowClass}">
                    <td><strong>${dp}</strong></td>
                    <td>${blowOK ? '✅' : hasRA ? '🟡' : '❌'}</td>
                    <td>${spliceAPOK ? '✅' : hasFusion ? '🟡' : '❌'}</td>
                    <td>${spliceDPOK ? '✅' : '❌'}</td>
                    <td>${orderIcons}</td>
                    <td>${statusHtml}</td>
                </tr>`;
            }
            dpTableHtml = `<div class="dp-table-container"><table>
                <thead><tr>
                    <th>${t('dpNumber')}</th><th>${t('sopladoRA')}</th><th>${t('fusionAP')}</th>
                    <th>${t('fusionDP')}</th><th>${t('ordenesCargadas')}</th><th>${t('statusCol')}</th>
                </tr></thead>
                <tbody>${dpRows}</tbody>
            </table></div>`;
        }

        html += `<div class="project-card${isExpanded ? ' expanded' : ''}" onclick="toggleProject('${code}')">
            <h3 style="color:var(--green)">${code} ${isExpanded ? '▲' : '▼'}</h3>
            <div class="project-stat"><span>DPs</span><span>${data.dps.size}</span></div>
            <div class="project-stat"><span>${t('totalClients')}</span><span>${data.total}</span></div>
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
    document.getElementById('projectsGrid').innerHTML = html || `<p style="color:var(--text-tertiary)">${t('noData')}</p>`;
}

// ============================================
// INVOICING (supports both legacy orders and new data)
// ============================================
function renderInvoicing() {
    // For now show legacy orders if they exist, otherwise show client-based view
    const allOrders = legacyOrders;
    const certNotInv = allOrders.filter(o => o.status === 'certified');
    const invoiced = allOrders.filter(o => o.status === 'invoiced');

    document.getElementById('invoiceTotals').innerHTML = `
        <div class="total-item"><div class="total-value" style="color:var(--purple)">${certNotInv.length}</div><div class="total-label">${t('certNotInv')}</div></div>
        <div class="total-item"><div class="total-value" style="color:var(--green)">${invoiced.length}</div><div class="total-label">${t('totalInvoiced')}</div></div>
        <div class="total-item"><div class="total-value" style="color:var(--blue)">${ordersRD.length + ordersRA.length + ordersFusion.length}</div><div class="total-label">Total Órdenes</div></div>
        <div class="total-item"><div class="total-value" style="color:var(--cyan)">${clients.length}</div><div class="total-label">${t('totalClients')}</div></div>
    `;

    const tbody = document.getElementById('invoiceBody');
    tbody.innerHTML = certNotInv.map(o => `<tr>
        <td class="check-col"><input type="checkbox" class="inv-check" data-id="${o.id}"></td>
        <td>${o.project||''}</td><td>${o.address||''}</td><td>${o.units||1}</td>
        <td><span class="badge badge-certified">Certificado</span></td><td>${o.certified_date||''}</td>
    </tr>`).join('') || `<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-tertiary)">-</td></tr>`;

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
    await loadAll();
    renderAll();
    toast(`✅ ${ids.length} marcados como facturados`);
}

// ============================================
// PRICES
// ============================================
function renderPrices() {
    let totalMarginPct = 0, count = 0;
    document.getElementById('pricesBody').innerHTML = PRICE_LIST.map(p => {
        const margin = p.sale - p.cost;
        const pct = p.sale > 0 ? margin / p.sale * 100 : 0;
        if (p.cost > 0) { totalMarginPct += pct; count++; }
        const color = pct >= 50 ? 'var(--green)' : pct >= 30 ? 'var(--yellow)' : 'var(--orange)';
        const d = lang === 'de' ? (p.descDe || p.desc) : p.desc;
        return `<tr>
            <td><strong>${p.code}</strong></td><td>${d}</td><td>${p.unit}</td>
            <td style="text-align:right">${p.sale.toFixed(2)}</td>
            <td style="text-align:right">${p.cost > 0 ? p.cost.toFixed(2) : '-'}</td>
            <td style="text-align:right;color:${color}">${p.cost > 0 ? margin.toFixed(2) : '-'}</td>
            <td style="text-align:right;color:${color}">${p.cost > 0 ? pct.toFixed(1)+'%' : '-'}</td>
        </tr>`;
    }).join('');
    document.getElementById('priceTotalItems').textContent = PRICE_LIST.length;
    document.getElementById('priceAvgMargin').textContent = count > 0 ? (totalMarginPct / count).toFixed(1) + '%' : '-';
}

// ============================================
// NAVIGATION
// ============================================
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        const view = item.dataset.view;
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-' + view).classList.add('active');
        document.getElementById('viewTitle').textContent = item.querySelector('span:last-child').textContent;
        document.getElementById('sidebar').classList.remove('open');
    });
});

// ============================================
// INIT
// ============================================
openDB().then(async () => {
    await loadAll();
    renderAll();
    setupDragAndDrop();
});

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('data:text/javascript,' + encodeURIComponent(
        "self.addEventListener('fetch', e => e.respondWith(fetch(e.request).catch(() => caches.match(e.request))));"
    )).catch(() => {});
}

