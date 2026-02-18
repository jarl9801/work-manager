// ============================================
// DP & PROJECT IMPORT MODULE
// ============================================

/**
 * Estructura esperada del CSV de DPs:
 * Columna DP: formato "PROYECTO-DPXXX" ej: QFF-001-DP006
 * Los primeros 7 caracteres = código de proyecto
 * Cada DP tiene 3 trabajos: Soplado, Fusión AP, Fusión DP
 */

// Parse DP code to extract project
function parseDPCode(dpCode) {
    if (!dpCode || typeof dpCode !== 'string') return null;
    
    const clean = dpCode.trim().toUpperCase();
    
    // Format: QFF-001-DP006 -> project: QFF-001, dp: DP006
    // Or: QFF-001-DP6 -> project: QFF-001, dp: DP006 (normalized)
    
    const match = clean.match(/^([A-Z0-9]+-[0-9]+)-DP([0-9]+)$/i);
    
    if (match) {
        const projectCode = match[1];
        const dpNumber = parseInt(match[2], 10);
        const dpNormalized = `DP${dpNumber.toString().padStart(3, '0')}`;
        
        return {
            original: clean,
            projectCode: projectCode,
            dpNumber: dpNumber,
            dpCode: dpNormalized,
            fullDP: `${projectCode}-${dpNormalized}`
        };
    }
    
    // Fallback: try to extract project from first 7 chars
    if (clean.length >= 7) {
        return {
            original: clean,
            projectCode: clean.substring(0, 7),
            dpNumber: null,
            dpCode: clean,
            fullDP: clean
        };
    }
    
    return null;
}

// Detect CSV type for DP imports
function detectDPImportType(headers) {
    const h = headers.map(h => h.toLowerCase().trim());
    
    // Check for DP column
    const hasDP = h.includes('dp') || h.includes('dp_code') || h.includes('dp code');
    const hasProject = h.includes('project') || h.includes('project_code') || h.includes('projecto');
    
    if (hasDP) return 'dp_list';
    if (hasProject && !hasDP) return 'project_list';
    
    return null;
}

// Import DPs from CSV
async function importDPs(csvObjects) {
    console.log('[Import DPs] Starting import of', csvObjects.length, 'rows');
    
    const results = {
        projects: new Map(),  // projectCode -> {dps: [], stats: {}}
        dps: [],
        errors: []
    };
    
    for (const row of csvObjects) {
        // Find DP column (could be named 'DP', 'dp', 'DP_Code', etc.)
        const dpValue = row.DP || row.dp || row.DP_Code || row['DP Code'] || row.dp_code;
        
        if (!dpValue) {
            results.errors.push({ row, error: 'No DP column found' });
            continue;
        }
        
        const parsed = parseDPCode(dpValue);
        
        if (!parsed) {
            results.errors.push({ row, error: `Invalid DP format: ${dpValue}` });
            continue;
        }
        
        // Add to project
        if (!results.projects.has(parsed.projectCode)) {
            results.projects.set(parsed.projectCode, {
                code: parsed.projectCode,
                dps: [],
                stats: {
                    totalDPs: 0,
                    completed: 0,
                    pending: 0
                }
            });
        }
        
        const project = results.projects.get(parsed.projectCode);
        
        // Check if DP already exists
        const existingIndex = project.dps.findIndex(d => d.dpCode === parsed.dpCode);
        
        const dpData = {
            id: existingIndex >= 0 ? project.dps[existingIndex].id : Date.now() + Math.random(),
            dpCode: parsed.dpCode,
            fullDP: parsed.fullDP,
            projectCode: parsed.projectCode,
            originalCode: parsed.original,
            // Three jobs per DP
            jobs: {
                soplado: {
                    type: 'Soplado RA/RD',
                    status: 'pending', // pending, in_progress, completed
                    technician: null,
                    date: null
                },
                fusionAP: {
                    type: 'Fusión AP',
                    status: 'pending',
                    technician: null,
                    date: null
                },
                fusionDP: {
                    type: 'Fusión DP',
                    status: 'pending',
                    technician: null,
                    date: null
                }
            },
            // Extra data from CSV
            extraData: { ...row },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (existingIndex >= 0) {
            // Update existing
            project.dps[existingIndex] = { ...project.dps[existingIndex], ...dpData, updatedAt: new Date().toISOString() };
        } else {
            // Add new
            project.dps.push(dpData);
            project.stats.totalDPs++;
            project.stats.pending++;
        }
        
        results.dps.push(dpData);
    }
    
    // Save to database
    for (const [projectCode, projectData] of results.projects) {
        await dbPut('projects', projectData);
    }
    
    console.log('[Import DPs] Completed:', {
        projects: results.projects.size,
        dps: results.dps.length,
        errors: results.errors.length
    });
    
    return {
        projectCount: results.projects.size,
        dpCount: results.dps.length,
        errors: results.errors,
        projects: Array.from(results.projects.values())
    };
}

// Get project stats
function getProjectStats(projectCode) {
    const project = projects.find(p => p.code === projectCode);
    if (!project) return null;
    
    const stats = {
        totalDPs: project.dps.length,
        byStatus: {
            pending: 0,
            inProgress: 0,
            completed: 0
        },
        byJob: {
            soplado: { pending: 0, completed: 0 },
            fusionAP: { pending: 0, completed: 0 },
            fusionDP: { pending: 0, completed: 0 }
        }
    };
    
    for (const dp of project.dps) {
        let dpCompleted = 0;
        
        for (const [jobKey, job] of Object.entries(dp.jobs)) {
            if (job.status === 'completed') {
                stats.byJob[jobKey].completed++;
                dpCompleted++;
            } else {
                stats.byJob[jobKey].pending++;
            }
        }
        
        if (dpCompleted === 3) {
            stats.byStatus.completed++;
        } else if (dpCompleted > 0) {
            stats.byStatus.inProgress++;
        } else {
            stats.byStatus.pending++;
        }
    }
    
    return stats;
}

// Render project card with DP progress
function renderProjectCard(project) {
    const stats = getProjectStats(project.code);
    const completion = stats ? (stats.byStatus.completed / stats.totalDPs * 100).toFixed(1) : 0;
    
    return `
        <div class="project-card" data-project="${project.code}">
            <h3>${project.code}</h3>
            <div class="project-stat">
                <span>Total DPs:</span>
                <span>${stats?.totalDPs || 0}</span>
            </div>
            <div class="project-stat">
                <span>Completados:</span>
                <span class="text-green">${stats?.byStatus.completed || 0}</span>
            </div>
            <div class="project-stat">
                <span>En progreso:</span>
                <span class="text-orange">${stats?.byStatus.inProgress || 0}</span>
            </div>
            <div class="project-stat">
                <span>Pendientes:</span>
                <span class="text-yellow">${stats?.byStatus.pending || 0}</span>
            </div>
            <div class="progress-bar" style="margin-top: 12px;">
                <div class="progress-fill bg-green" style="width: ${completion}%"></div>
            </div>
            <div style="text-align: center; margin-top: 8px; font-size: 12px; color: var(--text-secondary);">
                ${completion}% completado
            </div>
        </div>
    `;
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parseDPCode,
        importDPs,
        getProjectStats,
        renderProjectCard,
        detectDPImportType
    };
}
