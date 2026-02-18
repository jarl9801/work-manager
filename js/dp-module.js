// ============================================
// DP IMPORT MODULE - Compatible with FiberConnect CSV format
// ============================================

/**
 * CSV Format from FiberConnect:
 * - Projekt-nummer: Project number (e.g., 15157)
 * - Projekt: Project name (e.g., "Roßdorf Roßdorf")
 * - DP: DP code (e.g., QFF-001-DP006)
 * - Start Tiefbau: Start date
 * - Ende Tiefbau: End date
 * - Tiefbau Fertig: 1=Fertig, 0=Nicht Fertig
 * - Kabelsorte: Cable type (e.g., Leerrohr)
 * - Einblasen AP - DP: GEREED = completed
 * - Spleißen AP: GEREED = completed
 * - Spleiße DP bereit: GEREED = completed
 */

// Parse DP code to extract project info
function parseDPCode(dpCode) {
    if (!dpCode || typeof dpCode !== 'string') return null;
    
    const clean = dpCode.trim().toUpperCase();
    
    // Format: QFF-001-DP006
    const match = clean.match(/^([A-Z0-9]+-[0-9]+)-DP([0-9]+)$/i);
    
    if (match) {
        const projectCode = match[1];  // QFF-001
        const dpNumber = parseInt(match[2], 10);  // 6
        const dpNormalized = `DP${dpNumber.toString().padStart(3, '0')}`;  // DP006
        
        return {
            original: clean,
            projectCode: projectCode,
            dpNumber: dpNumber,
            dpCode: dpNormalized,
            fullDP: `${projectCode}-${dpNormalized}`
        };
    }
    
    return null;
}

// Parse German CSV with proper handling of quoted fields
function parseGermanCSV(text) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let insideQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];
        
        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                // Escaped quote
                currentField += '"';
                i++; // Skip next quote
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentLine.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (currentField || currentLine.length > 0) {
                currentLine.push(currentField.trim());
                lines.push(currentLine);
                currentLine = [];
                currentField = '';
            }
        } else {
            currentField += char;
        }
    }
    
    // Don't forget the last field/line
    if (currentField || currentLine.length > 0) {
        currentLine.push(currentField.trim());
        lines.push(currentLine);
    }
    
    return lines;
}

// Convert CSV lines to objects with proper column mapping
function csvToDPObjects(lines) {
    if (lines.length < 2) return [];
    
    const headers = lines[0].map(h => h.replace(/"/g, '').trim());
    
    // Map German column names to English keys
    const columnMap = {
        'Projekt- nummer': 'projectNumber',
        'Projekt-nummer': 'projectNumber',
        'Projekt': 'projectName',
        'DP': 'dp',
        'Start Tiefbau': 'startDate',
        'Ende Tiefbau': 'endDate',
        'Tiefbau Fertig (1= Fertig, 0=Nicht Fertig)': 'tiefbauComplete',
        'Kabelsorte': 'cableType',
        'Einblasen AP - DP (Gereed = Fertig)': 'einblasen',
        'Spleißen AP (Gereed = Fertig)': 'spleissenAP',
        'Spleiße DP bereit': 'spleisseDP'
    };
    
    return lines.slice(1).map(line => {
        const obj = {};
        headers.forEach((header, index) => {
            const key = columnMap[header] || header;
            obj[key] = line[index] || '';
        });
        return obj;
    });
}

// Import DPs from FiberConnect CSV format
async function importDPsFromCSV(csvText) {
    console.log('[Import DPs] Starting import...');
    
    const lines = parseGermanCSV(csvText);
    const rows = csvToDPObjects(lines);
    
    console.log(`[Import DPs] Parsed ${rows.length} rows`);
    
    const results = {
        projects: new Map(),
        dps: [],
        errors: []
    };
    
    for (const row of rows) {
        const dpValue = row.dp;
        
        if (!dpValue) {
            results.errors.push({ row, error: 'No DP value' });
            continue;
        }
        
        const parsed = parseDPCode(dpValue);
        
        if (!parsed) {
            results.errors.push({ row, error: `Invalid DP format: ${dpValue}` });
            continue;
        }
        
        // Create project if not exists
        const projectKey = row.projectNumber || parsed.projectCode;
        if (!results.projects.has(projectKey)) {
            results.projects.set(projectKey, {
                id: projectKey,
                code: parsed.projectCode,
                name: row.projectName || parsed.projectCode,
                number: row.projectNumber || '',
                dps: [],
                stats: {
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    pending: 0
                }
            });
        }
        
        const project = results.projects.get(projectKey);
        
        // Determine status of each job
        const jobs = {
            einblasen: {
                name: 'Einblasen AP-DP',
                status: row.einblasen === 'GEREED' ? 'completed' : 'pending',
                completed: row.einblasen === 'GEREED'
            },
            spleissenAP: {
                name: 'Spleißen AP',
                status: row.spleissenAP === 'GEREED' ? 'completed' : 'pending',
                completed: row.spleissenAP === 'GEREED'
            },
            spleisseDP: {
                name: 'Spleiße DP',
                status: row.spleisseDP === 'GEREED' ? 'completed' : 'pending',
                completed: row.spleisseDP === 'GEREED'
            }
        };
        
        // Calculate overall DP status
        const completedJobs = Object.values(jobs).filter(j => j.completed).length;
        let dpStatus = 'pending';
        if (completedJobs === 3) dpStatus = 'completed';
        else if (completedJobs > 0) dpStatus = 'inProgress';
        
        const dpData = {
            id: `${projectKey}_${parsed.dpCode}`,
            dpCode: parsed.dpCode,
            fullDP: parsed.fullDP,
            projectCode: parsed.projectCode,
            projectNumber: row.projectNumber || '',
            projectName: row.projectName || '',
            startDate: row.startDate || '',
            endDate: row.endDate || '',
            tiefbauComplete: row.tiefbauComplete === '1',
            cableType: row.cableType || '',
            jobs: jobs,
            status: dpStatus,
            progress: Math.round((completedJobs / 3) * 100),
            importedAt: new Date().toISOString()
        };
        
        // Check if DP already exists
        const existingIndex = project.dps.findIndex(d => d.dpCode === parsed.dpCode);
        if (existingIndex >= 0) {
            project.dps[existingIndex] = dpData;
        } else {
            project.dps.push(dpData);
            project.stats.total++;
        }
        
        // Update project stats
        if (dpStatus === 'completed') project.stats.completed++;
        else if (dpStatus === 'inProgress') project.stats.inProgress++;
        else project.stats.pending++;
        
        results.dps.push(dpData);
    }
    
    // Save to database (only if db is ready)
    if (typeof db !== 'undefined' && db && typeof dbPut === 'function') {
        for (const [key, project] of results.projects) {
            try {
                await dbPut('projects', project);
            } catch (err) {
                console.warn('Could not save to DB:', err);
            }
        }
    } else {
        console.log('DB not available, storing in memory only');
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

// Generate preview of import
function generateImportPreview(rows, maxItems = 10) {
    const preview = [];
    
    for (let i = 0; i < Math.min(rows.length, maxItems); i++) {
        const row = rows[i];
        const dpValue = row.dp;
        const parsed = parseDPCode(dpValue);
        
        if (parsed) {
            const completedJobs = [
                row.einblasen === 'GEREED',
                row.spleissenAP === 'GEREED',
                row.spleisseDP === 'GEREED'
            ].filter(Boolean).length;
            
            preview.push({
                dp: parsed.fullDP,
                project: row.projectName || parsed.projectCode,
                progress: `${completedJobs}/3`,
                status: completedJobs === 3 ? '✅ Fertig' : completedJobs > 0 ? '🟡 In Progress' : '⚪ Pending'
            });
        }
    }
    
    return preview;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parseDPCode,
        parseGermanCSV,
        csvToDPObjects,
        importDPsFromCSV,
        generateImportPreview
    };
}
