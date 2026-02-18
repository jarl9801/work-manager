// ============================================
// APP.JS - Main Application Logic
// ============================================

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Work Manager initialized');
    initApp();
});

// Main initialization
async function initApp() {
    // Setup navigation
    setupNavigation();
    
    // Setup language toggle
    setupLanguageToggle();
    
    // Load initial view
    renderDashboard();
}

// Navigation setup
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            // Render view
            switch(view) {
                case 'dashboard': renderDashboard(); break;
                case 'clients': renderClients(); break;
                case 'orders': renderOrders(); break;
                case 'projects': renderProjects(); break;
                case 'invoicing': renderInvoicing(); break;
                case 'prices': renderPrices(); break;
            }
        });
    });
}

// Language toggle setup
function setupLanguageToggle() {
    // Add language toggle button to header if not exists
    const header = document.querySelector('.header');
    if (header && !document.querySelector('.lang-toggle')) {
        const langToggle = document.createElement('div');
        langToggle.className = 'lang-toggle';
        langToggle.innerHTML = `
            <button class="lang-btn active" data-lang="es" onclick="setLanguage('es')">ES</button>
            <button class="lang-btn" data-lang="de" onclick="setLanguage('de')">DE</button>
        `;
        header.appendChild(langToggle);
    }
}

// ============================================
// VIEW RENDERERS
// ============================================

function renderDashboard() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="header">
            <h1 data-t="navDashboard">Dashboard</h1>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="showImportModal()">
                    📥 Importar CSV
                </button>
            </div>
        </div>
        
        <div class="kpi-grid">
            <div class="kpi-card green">
                <div class="kpi-label" data-t="totalProjects">Proyectos</div>
                <div class="kpi-value" id="kpi-projects">0</div>
            </div>
            <div class="kpi-card blue">
                <div class="kpi-label" data-t="totalDPs">DPs</div>
                <div class="kpi-value" id="kpi-dps">0</div>
            </div>
            <div class="kpi-card orange">
                <div class="kpi-label">Órdenes Pendientes</div>
                <div class="kpi-value" id="kpi-pending">0</div>
            </div>
            <div class="kpi-card purple">
                <div class="kpi-label">Completados</div>
                <div class="kpi-value" id="kpi-completed">0</div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-toolbar">
                <h3>Proyectos Activos</h3>
            </div>
            <div id="projects-list">
                <p style="padding: 20px; text-align: center; color: var(--text-secondary);">
                    No hay proyectos. Importa un CSV de DPs para comenzar.
                </p>
            </div>
        </div>
    `;
    
    updateKPIS();
}

function renderProjects() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="header">
            <h1 data-t="navProjects">Proyectos</h1>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="showImportDPModal()">
                    📥 Importar DPs
                </button>
            </div>
        </div>
        
        <div class="project-grid" id="projects-grid">
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
                <p>No hay proyectos cargados.</p>
                <p style="margin-top: 10px;">Importa un CSV con columna DP (ej: QFF-001-DP006)</p>
            </div>
        </div>
    `;
    
    renderProjectsList();
}

function renderProjectsList() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    
    // This would fetch from IndexedDB in full implementation
    // For now, show placeholder
    if (typeof projects !== 'undefined' && projects.length > 0) {
        grid.innerHTML = projects.map(p => renderProjectCard(p)).join('');
    }
}

function renderClients() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="header">
            <h1 data-t="navClients">Clientes</h1>
        </div>
        <p style="padding: 20px;">Módulo de clientes en desarrollo...</p>
    `;
}

function renderOrders() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="header">
            <h1 data-t="navOrders">Órdenes</h1>
        </div>
        <p style="padding: 20px;">Módulo de órdenes en desarrollo...</p>
    `;
}

function renderInvoicing() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="header">
            <h1 data-t="navInvoicing">Facturación</h1>
        </div>
        <p style="padding: 20px;">Módulo de facturación en desarrollo...</p>
    `;
}

function renderPrices() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="header">
            <h1 data-t="navPrices">Precios</h1>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th data-t="thCode">Código</th>
                        <th data-t="thDescription">Descripción</th>
                        <th data-t="thUnit">Unidad</th>
                        <th data-t="thSalePrice">Precio Venta</th>
                        <th data-t="thCostPrice">Precio Costo</th>
                    </tr>
                </thead>
                <tbody>
                    ${PRICE_LIST.map(p => `
                        <tr>
                            <td>${p.code}</td>
                            <td>${lang === 'de' ? p.descDe : p.desc}</td>
                            <td>${p.unit}</td>
                            <td>€${p.sale}</td>
                            <td>€${p.cost}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ============================================
// IMPORT MODAL
// ============================================

function showImportDPModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.id = 'importDPModal';
    modal.innerHTML = `
        <div class="modal">
            <h2>Importar DPs desde CSV</h2>
            <p style="margin-bottom: 16px; color: var(--text-secondary);">
                El CSV debe tener una columna llamada <strong>DP</strong> con formato: QFF-001-DP006
            </p>
            <div class="form-group">
                <label>Archivo CSV</label>
                <input type="file" id="dp-csv-file" accept=".csv" onchange="handleDPFileSelect(this)">
            </div>
            <div id="dp-import-preview" style="margin-top: 16px;"></div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeImportDPModal()">Cancelar</button>
                <button class="btn btn-primary" id="dp-import-btn" onclick="processDPImport()" disabled>Importar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) closeImportDPModal();
    });
}

function closeImportDPModal() {
    const modal = document.getElementById('importDPModal');
    if (modal) modal.remove();
}

let dpImportData = null;

function handleDPFileSelect(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = parseCSV(text);
        
        if (lines.length < 2) {
            alert('CSV vacío o inválido');
            return;
        }
        
        const headers = lines[0];
        const dpColumn = headers.findIndex(h => 
            h.toLowerCase().includes('dp') || 
            h.toLowerCase().includes('dp_code')
        );
        
        if (dpColumn === -1) {
            alert('No se encontró columna DP en el CSV');
            return;
        }
        
        // Parse data
        dpImportData = csvToObjects(lines);
        
        // Show preview
        const preview = document.getElementById('dp-import-preview');
        const sampleDPs = dpImportData.slice(0, 5).map(row => {
            const dpVal = row.DP || row.dp || row.DP_Code;
            const parsed = parseDPCode(dpVal);
            return parsed ? `
                <div style="padding: 8px; border-bottom: 1px solid var(--border);">
                    <strong>${parsed.fullDP}</strong>
                    <span style="color: var(--text-secondary); margin-left: 10px;">Proyecto: ${parsed.projectCode}</span>
                </div>
            ` : `
                <div style="padding: 8px; color: var(--red);">
                    Formato inválido: ${dpVal}
                </div>
            `;
        }).join('');
        
        preview.innerHTML = `
            <div style="background: var(--bg-tertiary); border-radius: 8px; padding: 12px;">
                <div style="margin-bottom: 10px;">
                    <strong>Total filas: ${dpImportData.length}</strong>
                </div>
                <div style="max-height: 200px; overflow-y: auto;">
                    ${sampleDPs}
                    ${dpImportData.length > 5 ? `
                        <div style="padding: 8px; text-align: center; color: var(--text-secondary);">
                            ... y ${dpImportData.length - 5} más
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.getElementById('dp-import-btn').disabled = false;
    };
    reader.readAsText(file);
}

async function processDPImport() {
    if (!dpImportData) return;
    
    const btn = document.getElementById('dp-import-btn');
    btn.disabled = true;
    btn.textContent = 'Importando...';
    
    try {
        const result = await importDPs(dpImportData);
        
        alert(`✅ Importación completada!\n\nProyectos: ${result.projectCount}\nDPs: ${result.dpCount}`);
        
        closeImportDPModal();
        renderProjects();
    } catch (err) {
        console.error(err);
        alert('❌ Error en importación: ' + err.message);
    }
}

// ============================================
// HELPERS
// ============================================

function updateKPIS() {
    // Update KPI counters
    const projectsEl = document.getElementById('kpi-projects');
    const dpsEl = document.getElementById('kpi-dps');
    
    if (projectsEl && typeof projects !== 'undefined') {
        projectsEl.textContent = projects.length;
    }
    if (dpsEl) {
        // Count total DPs across all projects
        const totalDPs = projects.reduce((sum, p) => sum + (p.dps?.length || 0), 0);
        dpsEl.textContent = totalDPs;
    }
}

function renderAll() {
    // Re-render current view with new language
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav) {
        activeNav.click();
    }
}

// Placeholder functions (would be implemented fully)
function showImportModal() {
    alert('Importar CSV - Función en desarrollo');
}

// CSV parsing (basic implementation)
function parseCSV(text) {
    return text.split('\n')
        .map(line => line.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, '')))
        .filter(line => line.length > 0 && line[0]);
}

function csvToObjects(lines) {
    const headers = lines[0];
    return lines.slice(1).map(line => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = line[i] || '';
        });
        return obj;
    });
}
