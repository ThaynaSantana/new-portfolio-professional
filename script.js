// ── TAB SYSTEM ──
function openTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const btn = document.getElementById(tabId);
    const panel = document.getElementById('panel-' + tabId);
    if (btn) btn.classList.add('active');
    if (panel) {
        panel.classList.add('active');
        setTimeout(() => {
            panel.querySelectorAll('.reveal').forEach(el => { el.classList.remove('visible'); setTimeout(() => el.classList.add('visible'), 60); });
        }, 30);
    }
}

// ── TERMINAL HERO — fluxo de projeto ──
const lines = [
    { delay: 0, type: 'cmd', text: 'project_flow.sh --run' },
    { delay: 700, type: 'out', text: '📥  Demanda recebida...', cls: '' },
    { delay: 1400, type: 'out', text: '🤝  Contratação de fornecedor...', cls: '' },
    { delay: 2100, type: 'out', text: '🚀  Projeto iniciado', cls: 'ok' },
    { delay: 2900, type: 'cmd', text: 'sprint --start 01' },
    { delay: 3500, type: 'out', text: '⚙️   Desenvolvimento do projeto', cls: '' },
    { delay: 4300, type: 'out', text: '🧪  Homologação do projeto...', cls: 'warn' },
    { delay: 5100, type: 'out', text: '[✓] Projeto validado', cls: 'ok' },
    { delay: 5900, type: 'cmd', text: 'cutover --plan --execute' },
    { delay: 6600, type: 'out', text: '📋  Plano de cutover aprovado', cls: '' },
    { delay: 7300, type: 'out', text: '⏳  Implantando projeto...', cls: 'warn' },
    { delay: 8200, type: 'out', text: '[✓] Projeto implantado com segurança e qualidade', cls: 'ok' },
    { delay: 9100, type: 'out', text: '⭐⭐⭐⭐⭐ Cliente satisfeito!', cls: 'ok' },
    { delay: 9900, type: 'cmd', text: '' },
];
const termBody = document.getElementById('terminal-body');
function renderTerminal() {
    termBody.innerHTML = '';
    lines.forEach(({ delay, type, text, cls }) => {
        setTimeout(() => {
            if (type === 'cmd') {
                const row = document.createElement('div');
                row.className = 'term-line';
                row.innerHTML = `<span class="term-prompt">❯</span><span class="term-cmd">${text}</span>${text === '' ? '<span class="term-cursor"></span>' : ''}`;
                termBody.appendChild(row);
            } else {
                const row = document.createElement('div');
                row.className = `term-out ${cls || ''}`;
                row.textContent = text;
                termBody.appendChild(row);
            }
            termBody.scrollTop = termBody.scrollHeight;
        }, delay);
    });
    setTimeout(renderTerminal, 11000);
}
renderTerminal();

// ── THREAT BARS ANIMATION ──
function animateThreatBars() {
    document.querySelectorAll('.threat-fill').forEach(bar => {
        const target = bar.dataset.w;
        setTimeout(() => { bar.style.width = target; }, 400);
    });
}
const threatObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateThreatBars(); threatObs.disconnect(); } });
}, { threshold: 0.3 });
const threatSection = document.querySelector('#threat-bars');
if (threatSection) threatObs.observe(threatSection);

// ── PASSWORD CHECKER ──
function checkPw(pw) {
    const bars = [1, 2, 3, 4].map(i => document.getElementById('pw-b' + i));
    const label = document.getElementById('pw-label');
    bars.forEach(b => b.style.background = '');
    if (!pw) { label.textContent = '// aguardando input...'; label.style.color = 'var(--muted)'; return; }
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const colors = ['var(--red)', 'var(--amber)', 'var(--amber)', 'var(--green)'];
    const labels = ['// muito fraca — até minha avó quebraria', '// fraca — adicione números e símbolos', '// razoável — quase lá...', '// forte — aprovada pelo auditor 🔐'];
    const labelColors = ['var(--red)', 'var(--amber)', 'var(--amber)', 'var(--green)'];
    for (let i = 0; i < score; i++) bars[i].style.background = colors[score - 1];
    label.textContent = labels[score - 1] || '// ?';
    label.style.color = labelColors[score - 1] || 'var(--muted)';
}

// ── VISITOR RECON (dados reais) ──
let visitorData = null;

async function fetchVisitorData() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        const d = await res.json();
        visitorData = d;
        renderScan(d);
    } catch (e) {
        renderScan(null);
    }
}

function renderScan(d) {
    const list = document.getElementById('ping-list');
    const start = performance.now();
    const ping = Math.round(performance.now() - start + 8);
    const rows = d ? [
        { host: d.ip || '?.?.?.?', status: 'up', ms: ping + 'ms', label: 'IP público' },
        { host: (d.city || '?') + ', ' + (d.country_name || '?'), status: 'up', ms: '—', label: 'Localização' },
        { host: d.org || d.asn || 'desconhecido', status: 'up', ms: '—', label: 'Provedor (ISP)' },
        { host: (d.timezone || '?'), status: 'warn', ms: '—', label: 'Fuso horário' },
        { host: navigator.userAgent.includes('Mobile') ? '📱 Mobile' : '🖥️ Desktop', status: 'up', ms: '—', label: 'Dispositivo' },
    ] : [
        { host: '?.?.?.?', status: 'warn', ms: '—', label: 'IP (bloqueado)' },
        { host: 'Não foi possível coletar dados', status: 'down', ms: '—', label: '' },
    ];
    list.innerHTML = rows.map(r =>
        `<div class="ping-row">
      <span class="ping-host" title="${r.label}">${r.host}</span>
      <span class="ping-status ${r.status}">${r.status.toUpperCase()}</span>
      <span class="ping-ms">${r.ms}</span>
    </div>`
    ).join('');
}

function rescan() {
    document.getElementById('ping-list').innerHTML = '<div class="ping-row"><span class="ping-host" style="color:var(--cyan)">scanning...</span><span class="ping-status warn">...</span><span class="ping-ms">—</span></div>';
    setTimeout(() => visitorData ? renderScan(visitorData) : fetchVisitorData(), 800);
}

fetchVisitorData();

// ── COPY EMAIL ──
function copyEmail() {
    const email = 'thaynas.s502@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        const btn = document.getElementById('copy-btn');
        const icon = document.getElementById('copy-icon');
        const text = document.getElementById('copy-text');
        btn.classList.add('copied');
        icon.textContent = '✓';
        text.textContent = 'E-mail copiado!';
        setTimeout(() => {
            btn.classList.remove('copied');
            icon.textContent = '✉️';
            text.textContent = email;
        }, 2500);
    });
}

// ── GANTT INTERATIVO ──
(function () {
    const COLS = 12; // semanas visíveis
    const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Tarefa: { label, start (semana 0-based), dur (semanas), color, emoji }
    let tasks = [
        { label: 'Escuta & Escopo', start: 0, dur: 2, color: '#2F80ED', emoji: '👂' },
        { label: 'Contratos', start: 1, dur: 2, color: '#F59E0B', emoji: '📄' },
        { label: 'Planejamento', start: 2, dur: 2, color: '#56A3F1', emoji: '📋' },
        { label: 'Desenvolvimento', start: 3, dur: 4, color: '#06B6D4', emoji: '⚙️' },
        { label: 'Testes & QA', start: 6, dur: 2, color: '#10B981', emoji: '🧪' },
        { label: 'Segurança & LGPD', start: 7, dur: 2, color: '#EF4444', emoji: '🔐' },
        { label: 'Implantação', start: 8, dur: 2, color: '#8B5CF6', emoji: '🚀' },
        { label: 'Validação cliente', start: 10, dur: 1, color: '#F59E0B', emoji: '⭐' },
    ];

    // Anchor: segunda-feira desta semana
    function getMonday() {
        const d = new Date();
        const day = d.getDay();
        const diff = (day === 0) ? -6 : 1 - day;
        d.setDate(d.getDate() + diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function weekStart(weekIdx) {
        const d = getMonday();
        d.setDate(d.getDate() + weekIdx * 7);
        return d;
    }

    function fmtDate(d) {
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    function fmtFull(d) {
        return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
    }

    function renderGantt() {
        const weeksEl = document.getElementById('gantt-weeks');
        const rowsEl = document.getElementById('gantt-rows');
        if (!weeksEl || !rowsEl) return;

        // Header de semanas
        weeksEl.innerHTML = '';
        for (let w = 0; w < COLS; w++) {
            const d = weekStart(w);
            const el = document.createElement('div');
            el.className = 'gantt-h-week';
            el.textContent = fmtDate(d);
            el.title = fmtFull(d);
            weeksEl.appendChild(el);
        }

        // Rows
        rowsEl.innerHTML = '';
        tasks.forEach((task, ti) => {
            const row = document.createElement('div');
            row.className = 'gantt-row';

            const lbl = document.createElement('div');
            lbl.className = 'gantt-row-label';
            lbl.textContent = task.emoji + ' ' + task.label;
            row.appendChild(lbl);

            const track = document.createElement('div');
            track.className = 'gantt-track';

            const bar = document.createElement('div');
            bar.className = 'gantt-bar';
            bar.style.background = task.color;
            bar.style.left = ((task.start / COLS) * 100) + '%';
            bar.style.width = ((task.dur / COLS) * 100) + '%';
            bar.style.boxShadow = `0 0 10px ${task.color}55`;

            // Tooltip: hover
            const tip = document.getElementById('gantt-tip') || (() => {
                const t = document.createElement('div');
                t.id = 'gantt-tip'; t.className = 'gantt-tooltip';
                document.body.appendChild(t); return t;
            })();

            bar.addEventListener('mouseenter', (e) => {
                const s = weekStart(task.start);
                const end = weekStart(task.start + task.dur);
                end.setDate(end.getDate() - 1);
                tip.innerHTML = `<strong>${task.emoji} ${task.label}</strong><br>Início: ${fmtFull(s)}<br>Fim: ${fmtFull(end)}<br>Duração: ${task.dur * 7} dias`;
                tip.style.display = 'block';
            });
            bar.addEventListener('mousemove', (e) => {
                tip.style.left = (e.clientX + 14) + 'px';
                tip.style.top = (e.clientY - 10) + 'px';
            });
            bar.addEventListener('mouseleave', () => { tip.style.display = 'none'; });

            // Drag to reposition
            let dragStartX, dragStartWeek;
            bar.addEventListener('mousedown', (e) => {
                e.preventDefault();
                dragStartX = e.clientX;
                dragStartWeek = task.start;
                const trackRect = track.getBoundingClientRect();
                const weekPx = trackRect.width / COLS;

                function onMove(ev) {
                    const delta = Math.round((ev.clientX - dragStartX) / weekPx);
                    const newStart = Math.max(0, Math.min(COLS - task.dur, dragStartWeek + delta));
                    if (newStart !== task.start) {
                        const shift = newStart - task.start;
                        task.start = newStart;
                        // cascade: push subsequent tasks that overlap
                        tasks.forEach((t2, i2) => {
                            if (i2 > ti && t2.start < task.start + task.dur) {
                                t2.start = Math.min(COLS - t2.dur, t2.start + shift);
                            }
                        });
                        renderGantt();
                        tip.style.display = 'none';
                    }
                }
                function onUp() {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                }
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });

            // Day-of-week hover on track cells
            track.addEventListener('mousemove', (e) => {
                const rect = track.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                const weekIdx = Math.floor(pct * COLS);
                const dayInWeek = Math.floor(((e.clientX - rect.left) / rect.width * COLS % 1) * 7);
                const d = weekStart(weekIdx);
                d.setDate(d.getDate() + dayInWeek);
                tip.innerHTML = `📅 ${fmtFull(d)}`;
                tip.style.display = 'block';
                tip.style.left = (e.clientX + 14) + 'px';
                tip.style.top = (e.clientY - 10) + 'px';
            });
            track.addEventListener('mouseleave', () => { tip.style.display = 'none'; });

            track.appendChild(bar);
            row.appendChild(track);
            rowsEl.appendChild(row);
        });
    }

    // Inicializa quando painel cronograma fica visível
    const ganttObs = new MutationObserver(() => {
        if (document.getElementById('fp-2') && document.getElementById('fp-2').classList.contains('active')) {
            renderGantt();
        }
    });
    ganttObs.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });

    // Também tenta renderizar na carga caso já esteja ativo
    document.addEventListener('DOMContentLoaded', renderGantt);
    setTimeout(renderGantt, 500);
})();

// ── FLOW STEPS ──
document.querySelectorAll('.flow-step').forEach(step => {
    step.addEventListener('click', () => {
        const idx = step.dataset.step;
        document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.flow-panel').forEach(p => p.classList.remove('active'));
        step.classList.add('active');
        const panel = document.getElementById('fp-' + idx);
        if (panel) panel.classList.add('active');
        if (idx === '2') setTimeout(() => { const r = document.getElementById('gantt-rows'); if (r && !r.children.length) { /* trigger */ } }, 50);
    });
});

// ── SCROLL REVEAL ──
const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
