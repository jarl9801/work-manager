// ============================================
// TEAMS.JS — Gantt Team Planner (Daily-based)
// ============================================

(function() {
    'use strict';

    let teamsData = [];
    let teamsDailyData = []; // {teamId, year, week, day (0-5 Mon-Sat)}
    let teamsSelectedYear = new Date().getFullYear();
    let teamsZoomLevel = 1;
    let teamsInitialized = false;
    let teamsCurrentWeekView = null;

    const TEAM_COLORS = ['#30d158','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316'];
    const DEFAULT_TEAMS = [
        { name: 'West-001', color: '#30d158' },
        { name: 'West-002', color: '#3b82f6' },
        { name: 'West-003', color: '#f59e0b' },
        { name: 'West-004', color: '#ef4444' },
        { name: 'Plus-001', color: '#8b5cf6' }
    ];

    // ===== DB HELPERS =====
    function tDB() { return db; }
    function tGetAll(store) {
        return new Promise((resolve, reject) => {
            const tx = tDB().transaction(store, 'readonly');
            tx.objectStore(store).getAll().onsuccess = e => resolve(e.target.result || []);
            tx.onerror = e => reject(e);
        });
    }
    function tPut(store, obj) {
        return new Promise((resolve, reject) => {
            const tx = tDB().transaction(store, 'readwrite');
            const req = obj.id ? tx.objectStore(store).put(obj) : tx.objectStore(store).add(obj);
            req.onsuccess = e => resolve(e.target.result);
            tx.onerror = e => reject(e);
        });
    }
    function tDelete(store, id) {
        return new Promise((resolve, reject) => {
            const tx = tDB().transaction(store, 'readwrite');
            tx.objectStore(store).delete(id).onsuccess = () => resolve();
            tx.onerror = e => reject(e);
        });
    }

    // ===== DATA =====
    async function loadTeamsData() {
        teamsData = await tGetAll('teams');
        teamsDailyData = await tGetAll('team_daily');
        if (teamsData.length === 0) {
            for (const t of DEFAULT_TEAMS) {
                const id = await tPut('teams', { name: t.name, color: t.color });
                teamsData.push({ id, name: t.name, color: t.color });
            }
            teamsData = await tGetAll('teams');
        }
    }

    function getWeekDays(teamId, year, week) {
        return teamsDailyData.filter(d => d.teamId === teamId && d.year === year && d.week === week);
    }

    function getWeekFill(teamId, year, week) {
        return getWeekDays(teamId, year, week).length / 6;
    }

    // ===== CALENDAR =====
    function getISOWeek(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    function getWeeksInYear(year) {
        const d = new Date(year, 11, 28);
        return getISOWeek(d);
    }

    function getMondayOfWeek(week, year) {
        const jan4 = new Date(year, 0, 4);
        const dow = jan4.getDay() || 7;
        const mon = new Date(jan4);
        mon.setDate(jan4.getDate() - dow + 1 + (week - 1) * 7);
        return mon;
    }

    // ===== GANTT RENDER =====
    function renderGantt() {
        const currentWeek = getISOWeek(new Date());
        const weeksInYear = getWeeksInYear(teamsSelectedYear);
        const cellW = 4 * teamsZoomLevel;

        // Months header
        const monthsEl = document.getElementById('teams-months');
        if (!monthsEl) return;
        monthsEl.innerHTML = '';
        monthsEl.style.gridTemplateColumns = `repeat(${weeksInYear}, ${cellW}rem)`;

        let curMonth = null, mCount = 0;
        const monthSpans = [];
        for (let w = 1; w <= weeksInYear; w++) {
            const m = getMondayOfWeek(w, teamsSelectedYear).getMonth();
            if (curMonth !== null && curMonth !== m) {
                monthSpans.push({ month: curMonth, span: mCount });
                mCount = 1;
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

        // Weeks header
        const weeksEl = document.getElementById('teams-weeks');
        weeksEl.innerHTML = '';
        weeksEl.style.gridTemplateColumns = `repeat(${weeksInYear}, ${cellW}rem)`;
        for (let i = 1; i <= weeksInYear; i++) {
            const el = document.createElement('div');
            el.className = 'teams-kw-header';
            if (i === currentWeek && teamsSelectedYear === new Date().getFullYear()) el.classList.add('teams-today');
            el.textContent = `KW${i}`;
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => window.teamsShowWeekDetail(i));
            weeksEl.appendChild(el);
        }

        // Body
        const body = document.getElementById('teams-gantt-body');
        body.innerHTML = '';
        const emptyState = document.getElementById('teams-empty-state');

        if (teamsData.length === 0) {
            emptyState.style.display = 'block';
            body.style.display = 'none';
            return;
        }
        emptyState.style.display = 'none';
        body.style.display = 'block';

        teamsData.forEach(team => {
            const row = document.createElement('div');
            row.className = 'teams-gantt-row';

            // Label
            const label = document.createElement('div');
            label.className = 'teams-label';
            const colorDot = document.createElement('span');
            colorDot.style.cssText = `width:10px;height:10px;border-radius:50%;background:${team.color || '#30d158'};flex-shrink:0;`;
            const nameSpan = document.createElement('span');
            nameSpan.className = 'teams-label-name';
            nameSpan.textContent = team.name;
            const delBtn = document.createElement('button');
            delBtn.className = 'teams-delete-btn';
            delBtn.textContent = '✕';
            delBtn.onclick = () => window.teamsDeleteTeam(team.id);
            label.appendChild(colorDot);
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

            for (let i = 1; i <= weeksInYear; i++) {
                const cell = document.createElement('div');
                cell.className = 'teams-cell';
                cell.style.width = `${cellW}rem`;
                if (i === currentWeek && teamsSelectedYear === new Date().getFullYear()) cell.classList.add('teams-today');

                const fill = getWeekFill(team.id, teamsSelectedYear, i);
                if (fill > 0) {
                    const color = team.color || '#30d158';
                    if (fill >= 1) {
                        cell.style.background = color;
                    } else {
                        cell.style.background = `linear-gradient(to right, ${color} ${fill * 100}%, transparent ${fill * 100}%)`;
                    }
                    const days = getWeekDays(team.id, teamsSelectedYear, i);
                    cell.title = `KW${i}: ${days.length}/6 días`;
                }

                cell.style.cursor = 'pointer';
                cell.addEventListener('click', () => window.teamsShowWeekDetail(i));
                cellsCont.appendChild(cell);
            }

            timeline.appendChild(cellsCont);
            row.appendChild(timeline);
            body.appendChild(row);
        });

        // Sync scroll
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
        const totalDays = teamsDailyData.filter(d => d.year === teamsSelectedYear).length;
        const statsEl = document.getElementById('teams-stats-text');
        if (statsEl) statsEl.textContent = `${teamsData.length} equipos • ${totalDays} días asignados en ${teamsSelectedYear}`;
        const countEl = document.getElementById('teams-count');
        if (countEl) countEl.textContent = teamsData.length;
    }

    // ===== WEEK DETAIL VIEW =====
    window.teamsShowWeekDetail = function(weekNum) {
        teamsCurrentWeekView = weekNum;
        const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const monday = getMondayOfWeek(weekNum, teamsSelectedYear);
        const dates = [];
        for (let d = 0; d < 6; d++) {
            const dt = new Date(monday);
            dt.setDate(monday.getDate() + d);
            dates.push(dt);
        }
        const todayStr = new Date().toISOString().split('T')[0];

        let rowsHtml = '';
        teamsData.forEach(team => {
            const days = getWeekDays(team.id, teamsSelectedYear, weekNum);
            const color = team.color || '#30d158';

            rowsHtml += `<div class="teams-week-team-label">
                <span style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;display:inline-block;"></span>
                ${team.name}
                <span style="font-size:11px;color:var(--text-secondary);margin-left:auto;">${days.length}/6</span>
            </div>`;

            dates.forEach((dt, di) => {
                const isToday = dt.toISOString().split('T')[0] === todayStr;
                const hasDay = teamsDailyData.find(d => d.teamId === team.id && d.year === teamsSelectedYear && d.week === weekNum && d.day === di);

                let cellClass = 'teams-week-cell';
                if (isToday) cellClass += ' teams-today';

                let content = '';
                let style = 'cursor:pointer;';
                if (hasDay) {
                    style += `background:${color}33;`;
                    content = `<div class="teams-week-day-filled" style="background:${color}">
                        <span>✔</span>
                        <button class="teams-week-remove" onclick="event.stopPropagation();window.teamsRemoveDay(${hasDay.id})">✕</button>
                    </div>`;
                }

                rowsHtml += `<div class="${cellClass}" style="${style}" onclick="window.teamsAddDay(${team.id},${weekNum},${di})">${content}</div>`;
            });
        });

        // Summary row
        let summaryHtml = '<div class="teams-week-team-label" style="font-weight:700;background:var(--bg-tertiary);">Total</div>';
        dates.forEach((dt, di) => {
            const count = teamsData.filter(team => teamsDailyData.some(d => d.teamId === team.id && d.year === teamsSelectedYear && d.week === weekNum && d.day === di)).length;
            const isToday = dt.toISOString().split('T')[0] === todayStr;
            summaryHtml += `<div class="teams-week-cell${isToday ? ' teams-today' : ''}" style="text-align:center;font-weight:600;font-size:14px;color:${count > 0 ? 'var(--green)' : 'var(--text-tertiary)'};">
                ${count}/${teamsData.length}
            </div>`;
        });

        const container = document.getElementById('teams-gantt-container');
        container.innerHTML = `
            <div class="teams-week-detail">
                <div class="teams-week-detail-header">
                    <button class="btn btn-sm btn-secondary" onclick="window.teamsBackToGantt()">← Volver</button>
                    <h3 style="margin:0;font-size:16px;">KW${weekNum} — ${monday.toLocaleDateString('es',{day:'numeric',month:'short'})} al ${dates[5].toLocaleDateString('es',{day:'numeric',month:'short',year:'numeric'})}</h3>
                    <div style="margin-left:auto;display:flex;gap:6px;">
                        <button class="btn btn-sm btn-secondary" onclick="window.teamsShowWeekDetail(${weekNum - 1})">◀</button>
                        <button class="btn btn-sm btn-secondary" onclick="window.teamsShowWeekDetail(${weekNum + 1})">▶</button>
                    </div>
                </div>
                <div class="teams-week-grid">
                    <div class="teams-week-corner">Equipo</div>
                    ${dates.map((dt, i) => {
                        const isToday = dt.toISOString().split('T')[0] === todayStr;
                        return `<div class="teams-week-day-header${isToday ? ' teams-today' : ''}">${dayNames[i]}<br><span style="font-size:11px;opacity:0.7">${dt.getDate()}.${(dt.getMonth()+1)}</span></div>`;
                    }).join('')}
                    ${rowsHtml}
                    ${summaryHtml}
                </div>
            </div>`;
    };

    // ===== DAY ACTIONS =====
    window.teamsAddDay = async function(teamId, week, day) {
        const existing = teamsDailyData.find(d => d.teamId === teamId && d.year === teamsSelectedYear && d.week === week && d.day === day);
        if (existing) return; // already assigned
        const entry = { teamId, year: teamsSelectedYear, week, day };
        const id = await tPut('team_daily', entry);
        entry.id = id;
        teamsDailyData.push(entry);
        window.teamsShowWeekDetail(week);
    };

    window.teamsRemoveDay = async function(entryId) {
        await tDelete('team_daily', entryId);
        teamsDailyData = teamsDailyData.filter(d => d.id !== entryId);
        window.teamsShowWeekDetail(teamsCurrentWeekView);
    };

    // ===== BACK TO GANTT =====
    window.teamsBackToGantt = function() {
        teamsCurrentWeekView = null;
        const container = document.getElementById('teams-gantt-container');
        container.innerHTML = `
            <div id="teams-gantt-header" class="teams-gantt-header">
                <div class="teams-label-header">
                    <span>👥 Equipos</span>
                    <span id="teams-count" class="teams-count-badge">0</span>
                </div>
                <div class="teams-timeline-header custom-scrollbar">
                    <div id="teams-months" class="teams-months"></div>
                    <div id="teams-weeks" class="teams-weeks"></div>
                </div>
            </div>
            <div id="teams-gantt-body"></div>
            <div id="teams-empty-state" class="teams-empty-state" style="display:none;">
                <div>👥</div>
                <h3>No hay equipos</h3>
                <p>Agrega tu primer equipo para organizar proyectos.</p>
            </div>`;
        renderGantt();
        setTimeout(() => window.teamsScrollToToday(), 200);
    };

    // ===== TEAM MANAGEMENT =====
    window.teamsAddTeam = async function() {
        const input = document.getElementById('teams-new-name');
        const name = input.value.trim();
        if (!name) {
            input.focus();
            input.placeholder = '⚠️ Escribe un nombre...';
            input.style.borderColor = '#ef4444';
            setTimeout(() => { input.placeholder = 'Nuevo equipo...'; input.style.borderColor = ''; }, 2000);
            return;
        }
        if (teamsData.some(t => t.name.toLowerCase() === name.toLowerCase())) {
            alert('Ya existe un equipo con ese nombre');
            return;
        }
        const color = TEAM_COLORS[teamsData.length % TEAM_COLORS.length];
        const id = await tPut('teams', { name, color });
        teamsData.push({ id, name, color });
        input.value = '';
        renderGantt();
    };

    window.teamsDeleteTeam = async function(teamId) {
        const team = teamsData.find(t => t.id === teamId);
        if (!team || !confirm(`¿Eliminar equipo "${team.name}" y todas sus asignaciones?`)) return;
        await tDelete('teams', teamId);
        // Remove all daily entries for this team
        const toRemove = teamsDailyData.filter(d => d.teamId === teamId);
        for (const d of toRemove) await tDelete('team_daily', d.id);
        teamsData = teamsData.filter(t => t.id !== teamId);
        teamsDailyData = teamsDailyData.filter(d => d.teamId !== teamId);
        renderGantt();
    };

    // ===== CONTROLS =====
    window.teamsZoomIn = function() { teamsZoomLevel = Math.min(3, teamsZoomLevel + 0.25); renderGantt(); };
    window.teamsZoomOut = function() { teamsZoomLevel = Math.max(0.5, teamsZoomLevel - 0.25); renderGantt(); };

    window.teamsScrollToToday = function() {
        const currentWeek = getISOWeek(new Date());
        const cellW = 4 * teamsZoomLevel;
        const timelines = document.querySelectorAll('.teams-timeline, .teams-timeline-header');
        const scrollTo = (currentWeek - 3) * cellW * 16; // rem to px
        timelines.forEach(t => t.scrollLeft = Math.max(0, scrollTo));
    };

    window.teamsExportCSV = function() {
        const rows = [['Equipo', 'Año', 'KW', 'Día', 'Fecha']];
        const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        teamsDailyData.filter(d => d.year === teamsSelectedYear).forEach(d => {
            const team = teamsData.find(t => t.id === d.teamId);
            const monday = getMondayOfWeek(d.week, d.year);
            const date = new Date(monday);
            date.setDate(monday.getDate() + d.day);
            rows.push([team?.name || '?', d.year, d.week, dayNames[d.day], date.toLocaleDateString('de-DE')]);
        });
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `equipos-${teamsSelectedYear}.csv`;
        a.click();
    };

    // ===== INIT =====
    window.initTeamsView = async function() {
        try { await loadTeamsData(); } catch(e) { console.error('Teams load error:', e); return; }

        if (!teamsInitialized) {
            teamsInitialized = true;
            const yearSel = document.getElementById('teams-year-selector');
            if (yearSel && yearSel.options.length === 0) {
                const cy = new Date().getFullYear();
                for (let y = cy - 2; y <= cy + 2; y++) {
                    const opt = document.createElement('option');
                    opt.value = y; opt.textContent = y;
                    if (y === teamsSelectedYear) opt.selected = true;
                    yearSel.appendChild(opt);
                }
                yearSel.addEventListener('change', (e) => {
                    teamsSelectedYear = parseInt(e.target.value);
                    renderGantt();
                });
            }
            document.getElementById('teams-new-name')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') window.teamsAddTeam();
            });
        }

        renderGantt();
        setTimeout(() => window.teamsScrollToToday(), 200);
    };

})();
