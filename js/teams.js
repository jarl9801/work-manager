// ============================================
// TEAMS.JS — Gantt Team Planner Module
// ============================================

(function() {
    'use strict';

    // ===== STATE =====
    let teamsData = [];
    let teamsAssignments = [];
    let teamsSelectedYear = new Date().getFullYear();
    let teamsZoomLevel = 1;
    let teamsInitialized = false;
    let teamsNextId = 1;
    let teamsNextAssignId = 1;

    // Drag state
    let teamsDragInfo = { isDragging: false, teamId: null, startWeek: null, endWeek: null, ghostEl: null };
    let teamsBarDrag = { isDragging: false, assignId: null, teamId: null, startX: 0, origWeek: 0, el: null };
    let teamsResize = { isResizing: false, assignId: null, startX: 0, origWidth: 0 };

    // Modal state
    let teamsModalState = { editing: null, teamId: null, startWeek: null, endWeek: null };

    const TEAMS_COLORS = ['#30d158','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316'];
    const DEFAULT_TEAMS = ['West-001','West-002','West-003','West-004','Plus-001'];

    // ===== DB HELPERS =====
    function teamsDB() { return db; } // uses global db from app.js

    function teamsGetAll(store) {
        return new Promise((resolve, reject) => {
            const tx = teamsDB().transaction(store, 'readonly');
            tx.objectStore(store).getAll().onsuccess = e => resolve(e.target.result || []);
            tx.onerror = e => reject(e);
        });
    }
    function teamsPut(store, obj) {
        return new Promise((resolve, reject) => {
            const tx = teamsDB().transaction(store, 'readwrite');
            const s = tx.objectStore(store);
            const req = obj.id ? s.put(obj) : s.add(obj);
            req.onsuccess = e => resolve(e.target.result);
            tx.onerror = e => reject(e);
        });
    }
    function teamsDelete(store, id) {
        return new Promise((resolve, reject) => {
            const tx = teamsDB().transaction(store, 'readwrite');
            tx.objectStore(store).delete(id).onsuccess = () => resolve();
            tx.onerror = e => reject(e);
        });
    }

    // ===== DATA LOADING =====
    async function teamsLoadData() {
        teamsData = await teamsGetAll('teams');
        teamsAssignments = await teamsGetAll('team_assignments');

        // Pre-populate if empty
        if (teamsData.length === 0) {
            for (const name of DEFAULT_TEAMS) {
                const id = await teamsPut('teams', { name });
                teamsData.push({ id, name });
            }
            // Reload to get proper IDs
            teamsData = await teamsGetAll('teams');
        }

        teamsNextId = teamsData.length ? Math.max(...teamsData.map(t => t.id)) + 1 : 1;
        teamsNextAssignId = teamsAssignments.length ? Math.max(...teamsAssignments.map(a => a.id)) + 1 : 1;
    }

    // ===== CALENDAR HELPERS =====
    function teamsGetISOWeek(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    function teamsGetWeeksInYear(year) {
        const d = new Date(year, 11, 31);
        const w = teamsGetISOWeek(d);
        return w === 1 ? 52 : w;
    }

    function teamsGetDateOfISOWeek(week, year) {
        const jan4 = new Date(year, 0, 4);
        const jan4Day = jan4.getDay() || 7;
        const w1Mon = new Date(jan4.getTime() - (jan4Day - 1) * 86400000);
        return new Date(w1Mon.getTime() + (week - 1) * 7 * 86400000);
    }

    // ===== RENDER =====
    function teamsRender() {
        const currentWeek = teamsGetISOWeek(new Date());
        const weeksInYear = teamsGetWeeksInYear(teamsSelectedYear);
        const cellW = 4 * teamsZoomLevel; // rem

        // Month headers
        const monthsEl = document.getElementById('teams-months');
        if (!monthsEl) return;
        monthsEl.innerHTML = '';
        monthsEl.style.gridTemplateColumns = `repeat(${weeksInYear}, ${cellW}rem)`;

        const monthSpans = [];
        let curMonth = null, mStart = 1, mCount = 0;
        for (let w = 1; w <= weeksInYear; w++) {
            const m = teamsGetDateOfISOWeek(w, teamsSelectedYear).getMonth();
            if (curMonth !== null && curMonth !== m) {
                monthSpans.push({ month: curMonth, span: mCount });
                mStart = w; mCount = 1;
            } else { mCount++; }
            curMonth = m;
        }
        if (curMonth !== null) monthSpans.push({ month: curMonth, span: mCount });

        monthSpans.forEach(ms => {
            const el = document.createElement('div');
            el.className = 'teams-month-header';
            el.style.gridColumn = `span ${ms.span}`;
            el.textContent = new Date(teamsSelectedYear, ms.month).toLocaleDateString('es', { month: 'short' }).toUpperCase();
            monthsEl.appendChild(el);
        });

        // Week headers
        const weeksEl = document.getElementById('teams-weeks');
        weeksEl.innerHTML = '';
        weeksEl.style.gridTemplateColumns = `repeat(${weeksInYear}, ${cellW}rem)`;
        for (let i = 1; i <= weeksInYear; i++) {
            const el = document.createElement('div');
            el.className = 'teams-kw-header';
            if (i === currentWeek && teamsSelectedYear === new Date().getFullYear()) el.classList.add('teams-today');
            el.textContent = `KW${i}`;
            weeksEl.appendChild(el);
        }

        // Body rows
        const body = document.getElementById('teams-gantt-body');
        body.innerHTML = '';
        const emptyState = document.getElementById('teams-empty-state');

        if (teamsData.length === 0) {
            emptyState.style.display = 'block';
            body.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            body.style.display = 'block';
        }

        teamsData.forEach(team => {
            const row = document.createElement('div');
            row.className = 'teams-gantt-row';
            row.dataset.teamId = team.id;

            // Label
            const label = document.createElement('div');
            label.className = 'teams-label';
            const nameSpan = document.createElement('span');
            nameSpan.className = 'teams-label-name';
            nameSpan.textContent = team.name;
            nameSpan.title = team.name;
            const delBtn = document.createElement('button');
            delBtn.className = 'teams-delete-btn';
            delBtn.textContent = '✕';
            delBtn.title = `Eliminar ${team.name}`;
            delBtn.onclick = () => window.teamsDeleteTeam(team.id);
            label.appendChild(nameSpan);
            label.appendChild(delBtn);
            row.appendChild(label);

            // Timeline
            const timeline = document.createElement('div');
            timeline.className = 'teams-timeline custom-scrollbar';
            const cellsCont = document.createElement('div');
            cellsCont.className = 'teams-cells-container';
            cellsCont.style.width = `${weeksInYear * cellW}rem`;

            // Today marker
            if (teamsSelectedYear === new Date().getFullYear()) {
                const marker = document.createElement('div');
                marker.className = 'teams-today-marker';
                marker.style.left = `${(currentWeek - 1) * cellW}rem`;
                cellsCont.appendChild(marker);
            }

            // Week cells
            for (let i = 1; i <= weeksInYear; i++) {
                const cell = document.createElement('div');
                cell.className = 'teams-cell';
                cell.style.width = `${cellW}rem`;
                cell.dataset.week = i;
                cell.dataset.teamId = team.id;
                if (i === currentWeek && teamsSelectedYear === new Date().getFullYear()) cell.classList.add('teams-today');
                cellsCont.appendChild(cell);
            }

            // Assignment bars
            const teamAssigns = teamsAssignments.filter(a => a.teamId === team.id);
            teamAssigns.forEach(assign => {
                if (assign.startWeek > weeksInYear || assign.endWeek < 1) return;
                const bar = document.createElement('div');
                bar.className = 'teams-bar';
                const s = Math.max(1, assign.startWeek);
                const e = Math.min(weeksInYear, assign.endWeek);
                bar.style.left = `${(s - 1) * cellW}rem`;
                bar.style.width = `${(e - s + 1) * cellW}rem`;
                bar.style.background = assign.color || TEAMS_COLORS[0];
                bar.textContent = assign.text || '';
                bar.title = `${assign.text} (KW${assign.startWeek}–${assign.endWeek}) ${assign.progress || 0}%`;
                bar.dataset.assignId = assign.id;

                // Progress bar
                if (assign.progress > 0) {
                    const prog = document.createElement('div');
                    prog.className = 'teams-progress';
                    prog.style.width = `${assign.progress}%`;
                    bar.appendChild(prog);
                }

                // Resize handle
                const handle = document.createElement('div');
                handle.className = 'teams-resize-handle';
                handle.addEventListener('mousedown', (ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    teamsResize.isResizing = true;
                    teamsResize.assignId = assign.id;
                    teamsResize.startX = ev.clientX;
                    teamsResize.origWidth = assign.endWeek - assign.startWeek + 1;
                    document.body.style.cursor = 'col-resize';
                });
                bar.appendChild(handle);

                // Click to edit
                bar.addEventListener('click', (ev) => {
                    if (teamsBarDrag.isDragging) return;
                    ev.stopPropagation();
                    window.teamsEditAssignment(assign.id);
                });

                // Drag bar to move
                bar.addEventListener('mousedown', (ev) => {
                    if (ev.target.classList.contains('teams-resize-handle') || ev.button !== 0) return;
                    ev.preventDefault();
                    ev.stopPropagation();
                    teamsBarDrag.isDragging = true;
                    teamsBarDrag.assignId = assign.id;
                    teamsBarDrag.teamId = team.id;
                    teamsBarDrag.startX = ev.clientX;
                    teamsBarDrag.origWeek = assign.startWeek;
                    teamsBarDrag.el = bar;
                    bar.classList.add('teams-bar-dragging');
                    document.body.style.cursor = 'grabbing';
                    document.body.style.userSelect = 'none';
                });

                cellsCont.appendChild(bar);
            });

            timeline.appendChild(cellsCont);
            row.appendChild(timeline);
            body.appendChild(row);
        });

        // Sync horizontal scroll across all timelines + header
        const allTimelines = body.querySelectorAll('.teams-timeline');
        const headerTimeline = document.querySelector('.teams-timeline-header');
        const syncScroll = (source) => {
            const left = source.scrollLeft;
            allTimelines.forEach(t => { if (t !== source) t.scrollLeft = left; });
            if (headerTimeline) headerTimeline.scrollLeft = left;
        };
        allTimelines.forEach(t => t.addEventListener('scroll', () => syncScroll(t)));
        if (headerTimeline) headerTimeline.addEventListener('scroll', () => {
            allTimelines.forEach(t => t.scrollLeft = headerTimeline.scrollLeft);
        });

        // Stats
        const totalAssigns = teamsAssignments.length;
        const active = teamsAssignments.filter(a => (a.progress || 0) < 100).length;
        const avgProg = totalAssigns ? Math.round(teamsAssignments.reduce((s, a) => s + (a.progress || 0), 0) / totalAssigns) : 0;
        const statsEl = document.getElementById('teams-stats-text');
        if (statsEl) statsEl.textContent = `${teamsData.length} equipos • ${totalAssigns} asignaciones • ${active} activas • ${avgProg}% promedio`;
        const countEl = document.getElementById('teams-count');
        if (countEl) countEl.textContent = teamsData.length;

        // Setup cell drag (create new assignments)
        setupTeamsCellDrag();
    }

    // ===== CELL DRAG (create assignments) =====
    function setupTeamsCellDrag() {
        const body = document.getElementById('teams-gantt-body');
        if (!body) return;

        body.addEventListener('mousedown', (e) => {
            const cell = e.target.closest('.teams-cell');
            if (!cell || e.target.closest('.teams-bar') || e.target.closest('.teams-resize-handle')) return;
            e.preventDefault();
            const row = e.target.closest('.teams-gantt-row');
            if (!row) return;

            teamsDragInfo.isDragging = true;
            teamsDragInfo.teamId = parseInt(row.dataset.teamId);
            teamsDragInfo.startWeek = parseInt(cell.dataset.week);
            teamsDragInfo.endWeek = teamsDragInfo.startWeek;

            const ghost = document.createElement('div');
            ghost.className = 'teams-bar teams-bar-ghost';
            ghost.style.left = `${(teamsDragInfo.startWeek - 1) * 4 * teamsZoomLevel}rem`;
            ghost.style.width = `${4 * teamsZoomLevel}rem`;
            ghost.textContent = 'Nueva';
            const cont = row.querySelector('.teams-cells-container');
            if (cont) { cont.appendChild(ghost); teamsDragInfo.ghostEl = ghost; }
        });

        body.addEventListener('mousemove', (e) => {
            if (!teamsDragInfo.isDragging || !teamsDragInfo.ghostEl) return;
            const cell = e.target.closest('.teams-cell');
            if (!cell) return;
            const row = e.target.closest('.teams-gantt-row');
            if (!row || parseInt(row.dataset.teamId) !== teamsDragInfo.teamId) return;

            teamsDragInfo.endWeek = parseInt(cell.dataset.week);
            const s = Math.min(teamsDragInfo.startWeek, teamsDragInfo.endWeek);
            const en = Math.max(teamsDragInfo.startWeek, teamsDragInfo.endWeek);
            const cellW = 4 * teamsZoomLevel;
            teamsDragInfo.ghostEl.style.left = `${(s - 1) * cellW}rem`;
            teamsDragInfo.ghostEl.style.width = `${(en - s + 1) * cellW}rem`;
            teamsDragInfo.ghostEl.textContent = `${en - s + 1} sem`;
        });
    }

    // Global mouseup for all drag operations
    document.addEventListener('mouseup', (e) => {
        // Cell drag → create assignment
        if (teamsDragInfo.isDragging) {
            if (teamsDragInfo.ghostEl) teamsDragInfo.ghostEl.remove();
            const s = Math.min(teamsDragInfo.startWeek, teamsDragInfo.endWeek);
            const en = Math.max(teamsDragInfo.startWeek, teamsDragInfo.endWeek);
            if (s && en && teamsDragInfo.teamId) {
                teamsModalState.editing = null;
                teamsModalState.teamId = teamsDragInfo.teamId;
                teamsModalState.startWeek = s;
                teamsModalState.endWeek = en;
                teamsOpenModal('Nueva Asignación', null);
            }
            teamsDragInfo = { isDragging: false, teamId: null, startWeek: null, endWeek: null, ghostEl: null };
        }

        // Bar drag → move
        if (teamsBarDrag.isDragging) {
            const deltaX = e.clientX - teamsBarDrag.startX;
            const deltaWeeks = Math.round(deltaX / (4 * teamsZoomLevel * 16));
            const assign = teamsAssignments.find(a => a.id === teamsBarDrag.assignId);
            if (assign && deltaWeeks !== 0) {
                const duration = assign.endWeek - assign.startWeek;
                const maxW = teamsGetWeeksInYear(teamsSelectedYear);
                assign.startWeek = Math.max(1, Math.min(maxW - duration, teamsBarDrag.origWeek + deltaWeeks));
                assign.endWeek = assign.startWeek + duration;
                teamsPut('team_assignments', assign).then(() => teamsRender());
            }
            if (teamsBarDrag.el) teamsBarDrag.el.classList.remove('teams-bar-dragging');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            // Delay reset so click doesn't fire
            setTimeout(() => { teamsBarDrag.isDragging = false; }, 50);
            teamsBarDrag.assignId = null;
            teamsBarDrag.teamId = null;
            teamsBarDrag.el = null;
        }

        // Resize
        if (teamsResize.isResizing) {
            teamsResize.isResizing = false;
            document.body.style.cursor = '';
            const assign = teamsAssignments.find(a => a.id === teamsResize.assignId);
            if (assign) teamsPut('team_assignments', assign).then(() => teamsRender());
        }
    });

    document.addEventListener('mousemove', (e) => {
        // Bar drag visual
        if (teamsBarDrag.isDragging && teamsBarDrag.el) {
            const deltaX = e.clientX - teamsBarDrag.startX;
            const deltaWeeks = Math.round(deltaX / (4 * teamsZoomLevel * 16));
            const assign = teamsAssignments.find(a => a.id === teamsBarDrag.assignId);
            if (assign) {
                const newStart = Math.max(1, teamsBarDrag.origWeek + deltaWeeks);
                teamsBarDrag.el.style.left = `${(newStart - 1) * 4 * teamsZoomLevel}rem`;
            }
        }

        // Resize visual
        if (teamsResize.isResizing) {
            const deltaX = e.clientX - teamsResize.startX;
            const deltaWeeks = Math.round(deltaX / (4 * teamsZoomLevel * 16));
            const assign = teamsAssignments.find(a => a.id === teamsResize.assignId);
            if (assign) {
                const maxW = teamsGetWeeksInYear(teamsSelectedYear);
                const newEnd = Math.min(maxW, Math.max(assign.startWeek, assign.startWeek + teamsResize.origWidth + deltaWeeks - 1));
                assign.endWeek = newEnd;
                const bar = document.querySelector(`[data-assign-id="${assign.id}"]`);
                if (bar) bar.style.width = `${(newEnd - assign.startWeek + 1) * 4 * teamsZoomLevel}rem`;
            }
        }
    });

    // ===== MODAL =====
    function teamsOpenModal(title, assign) {
        const modal = document.getElementById('teams-modal');
        document.getElementById('teams-modal-title').textContent = title;
        document.getElementById('teams-assignment-text').value = assign ? assign.text : '';
        document.getElementById('teams-assignment-progress').value = assign ? (assign.progress || 0) : 0;
        document.getElementById('teams-assignment-color').value = assign ? (assign.color || TEAMS_COLORS[0]) : TEAMS_COLORS[teamsAssignments.length % TEAMS_COLORS.length];
        document.getElementById('teams-progress-label').textContent = (assign ? (assign.progress || 0) : 0) + '%';
        document.getElementById('teams-delete-btn').style.display = assign ? 'inline-flex' : 'none';
        modal.style.display = 'flex';
        setTimeout(() => document.getElementById('teams-assignment-text').focus(), 50);
    }

    window.teamsCloseModal = function() {
        document.getElementById('teams-modal').style.display = 'none';
        teamsModalState = { editing: null, teamId: null, startWeek: null, endWeek: null };
    };

    window.teamsSaveAssignment = async function() {
        const text = document.getElementById('teams-assignment-text').value.trim();
        if (!text) return;
        const progress = parseInt(document.getElementById('teams-assignment-progress').value) || 0;
        const color = document.getElementById('teams-assignment-color').value;

        if (teamsModalState.editing) {
            // Update existing
            const assign = teamsAssignments.find(a => a.id === teamsModalState.editing);
            if (assign) {
                assign.text = text;
                assign.progress = progress;
                assign.color = color;
                await teamsPut('team_assignments', assign);
            }
        } else {
            // Create new
            const newAssign = {
                teamId: teamsModalState.teamId,
                text,
                startWeek: teamsModalState.startWeek,
                endWeek: teamsModalState.endWeek,
                color,
                progress
            };
            const id = await teamsPut('team_assignments', newAssign);
            newAssign.id = id;
            teamsAssignments.push(newAssign);
        }

        window.teamsCloseModal();
        teamsRender();
    };

    window.teamsDeleteAssignment = async function() {
        if (!teamsModalState.editing) return;
        if (!confirm('¿Eliminar esta asignación?')) return;
        await teamsDelete('team_assignments', teamsModalState.editing);
        teamsAssignments = teamsAssignments.filter(a => a.id !== teamsModalState.editing);
        window.teamsCloseModal();
        teamsRender();
    };

    window.teamsEditAssignment = function(assignId) {
        const assign = teamsAssignments.find(a => a.id === assignId);
        if (!assign) return;
        teamsModalState.editing = assign.id;
        teamsModalState.teamId = assign.teamId;
        teamsModalState.startWeek = assign.startWeek;
        teamsModalState.endWeek = assign.endWeek;
        teamsOpenModal('Editar Asignación', assign);
    };

    // ===== TEAM MANAGEMENT =====
    window.teamsAddTeam = async function() {
        const input = document.getElementById('teams-new-name');
        const name = input.value.trim();
        if (!name) return;
        if (teamsData.some(t => t.name.toLowerCase() === name.toLowerCase())) {
            alert('Ya existe un equipo con ese nombre');
            return;
        }
        const id = await teamsPut('teams', { name });
        teamsData.push({ id, name });
        input.value = '';
        teamsRender();
    };

    window.teamsDeleteTeam = async function(teamId) {
        const team = teamsData.find(t => t.id === teamId);
        if (!team) return;
        const count = teamsAssignments.filter(a => a.teamId === teamId).length;
        if (!confirm(`¿Eliminar "${team.name}"${count ? ` y sus ${count} asignaciones` : ''}?`)) return;
        await teamsDelete('teams', teamId);
        // Delete team's assignments
        const assigns = teamsAssignments.filter(a => a.teamId === teamId);
        for (const a of assigns) await teamsDelete('team_assignments', a.id);
        teamsData = teamsData.filter(t => t.id !== teamId);
        teamsAssignments = teamsAssignments.filter(a => a.teamId !== teamId);
        teamsRender();
    };

    // ===== CONTROLS =====
    window.teamsZoomIn = function() {
        teamsZoomLevel = Math.min(3, teamsZoomLevel * 1.2);
        teamsRender();
    };
    window.teamsZoomOut = function() {
        teamsZoomLevel = Math.max(0.5, teamsZoomLevel / 1.2);
        teamsRender();
    };
    window.teamsScrollToToday = function() {
        if (teamsSelectedYear !== new Date().getFullYear()) return;
        const cw = teamsGetISOWeek(new Date());
        const timelines = document.querySelectorAll('#view-teams .teams-timeline, #view-teams .teams-timeline-header');
        const pos = Math.max(0, (cw - 3) * 4 * teamsZoomLevel * 16);
        timelines.forEach(t => t.scrollTo({ left: pos, behavior: 'smooth' }));
    };

    window.teamsExportCSV = function() {
        const rows = [['Equipo','Asignación','Inicio (KW)','Fin (KW)','Duración','Progreso (%)','Color']];
        teamsData.forEach(team => {
            const assigns = teamsAssignments.filter(a => a.teamId === team.id);
            if (assigns.length === 0) {
                rows.push([team.name,'Sin asignaciones','','','','','']);
            } else {
                assigns.forEach(a => {
                    rows.push([`"${team.name}"`,`"${a.text}"`,a.startWeek,a.endWeek,a.endWeek-a.startWeek+1,a.progress||0,a.color||'']);
                });
            }
        });
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `equipos-gantt-${teamsSelectedYear}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    // ===== INIT =====
    window.initTeamsView = async function() {
        await teamsLoadData();

        if (!teamsInitialized) {
            teamsInitialized = true;

            // Year selector
            const yearSel = document.getElementById('teams-year-selector');
            if (yearSel && yearSel.options.length === 0) {
                const cy = new Date().getFullYear();
                for (let y = cy - 3; y <= cy + 3; y++) {
                    const opt = document.createElement('option');
                    opt.value = y; opt.textContent = y;
                    if (y === teamsSelectedYear) opt.selected = true;
                    yearSel.appendChild(opt);
                }
                yearSel.addEventListener('change', (e) => {
                    teamsSelectedYear = parseInt(e.target.value);
                    teamsRender();
                });
            }

            // Progress label update
            document.getElementById('teams-assignment-progress')?.addEventListener('input', (e) => {
                document.getElementById('teams-progress-label').textContent = e.target.value + '%';
            });

            // Enter key in team name input
            document.getElementById('teams-new-name')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') window.teamsAddTeam();
            });

            // Enter key in modal
            document.getElementById('teams-assignment-text')?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); window.teamsSaveAssignment(); }
            });

            // ESC to close modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && document.getElementById('teams-modal').style.display === 'flex') {
                    window.teamsCloseModal();
                }
            });
        }

        teamsRender();
        // Auto-scroll to today
        setTimeout(() => window.teamsScrollToToday(), 200);
    };

})();
