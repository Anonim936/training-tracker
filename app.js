const workouts = {
    A: {
        title: 'Тренировка A — грудь, трицепс, пресс',
        duration: '35–45 минут',
        warmup: 'Разминка 5–7 минут. Отдых между подходами — 60–120 секунд.',
        exercises: [
            { name: 'Классические отжимания', sets: '3 × 8–15', desc: 'Кисти под плечами, корпус прямой. Не проваливай поясницу.' },
            { name: 'Отжимания узким хватом', sets: '2 × 6–12', desc: 'Локти ближе к корпусу. Если тяжело — делай с колен.' },
            { name: 'Планка на предплечьях', sets: '3 × 25–45 сек', desc: 'Напряги пресс и ягодицы, удерживай естественное положение спины.' },
            { name: 'Обратные скручивания', sets: '3 × 10–15', desc: 'Поднимай таз за счёт мышц живота, не раскачивай ноги.' },
            { name: 'Приседания', sets: '2 × 15–20', desc: 'Поддерживают развитие ног и баланс общей нагрузки.' }
        ]
    },
    B: {
        title: 'Тренировка B — спина, бицепс, пресс',
        duration: '30–40 минут',
        warmup: 'Разминка 5–7 минут. Отдых между подходами — 60–90 секунд.',
        exercises: [
            { name: 'Подъёмы рук Y–T–W лёжа', sets: '2 круга × 5–8', desc: 'Поднимай руки невысоко, своди лопатки, не задирай плечи.' },
            { name: 'Птица-собака', sets: '3 × 8–12 на сторону', desc: 'На четвереньках вытягивай противоположные руку и ногу, не поворачивая таз.' },
            { name: 'Супермен', sets: '2 × 10–12', desc: 'Поднимай руки и ноги слегка, без резкого прогиба поясницы.' },
            { name: 'Сгибание рук с самосопротивлением', sets: '3 × 8–12 на руку', desc: 'Одной рукой сгибай другую, второй сопротивляйся. 3 сек вверх, 3 сек вниз.' },
            { name: 'Велосипед', sets: '3 × 20–30 сек', desc: 'Чередуй стороны плавно, не тяни голову руками.' }
        ]
    },
    C: {
        title: 'Тренировка C — всё тело',
        duration: '35–45 минут',
        warmup: 'Разминка 5–7 минут. Выполняй в контролируемом темпе. Заканчивай подход с запасом ~2 повторения.',
        exercises: [
            { name: 'Классические отжимания', sets: '3 × 8–15', desc: '' },
            { name: 'Ягодичный мостик', sets: '3 × 15–20', desc: '' },
            { name: 'Приседания', sets: '3 × 15–20', desc: '' },
            { name: 'Подъёмы рук Y–T–W лёжа', sets: '2 × 5–8', desc: 'Каждой формы.' },
            { name: 'Боковая планка', sets: '2 × 20–35 сек', desc: 'На каждую сторону.' },
            { name: 'Сгибания рук с самосопротивлением', sets: '2 × 10', desc: 'На каждую руку.' }
        ]
    }
};

const weekGoals = {
    1: '🎯 Неделя 1 — Техника. Нижняя граница повторений. Чистая техника.',
    2: '📈 Неделя 2 — Объём. Добавь 1–2 повторения, где техника стабильна.',
    3: '🔥 Неделя 3 — Сложность. Пауза в отжиманиях или +5 сек планки.',
    4: '✅ Неделя 4 — Закрепление. Повтори нагрузку. Усталость? Сократи подходы на треть.'
};

const dayMap = { mon: 'A', tue: 'B', wed: 'rest', thu: 'C', fri: 'rest', sat: 'cardio', sun: 'fullrest' };

let currentWeek = 1;
let currentDay = null;

function getTodayKey() {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[new Date().getDay()];
}

function loadData() {
    try {
        return JSON.parse(localStorage.getItem('trainingData')) || {};
    } catch { return {}; }
}

function saveData(data) {
    localStorage.setItem('trainingData', JSON.stringify(data));
}

function getWeekData(week) {
    const data = loadData();
    return data[`week_${week}`] || { checklist: {} };
}

function setWeekData(week, weekData) {
    const data = loadData();
    data[`week_${week}`] = weekData;
    saveData(data);
}

function renderWorkout(dayKey) {
    const content = document.getElementById('workoutContent');
    const type = dayMap[dayKey];

    if (type === 'rest') {
        content.innerHTML = `<div class="rest-day-card"><div class="emoji">🚶</div><h2>День восстановления</h2><p>Прогулка или лёгкая активность. Без высокой интенсивности.</p></div>`;
        return;
    }
    if (type === 'fullrest') {
        content.innerHTML = `<div class="rest-day-card"><div class="emoji">😴</div><h2>Полный отдых</h2><p>Восстанавливайся. Сон 8–10 часов. Организм растёт во время отдыха.</p></div>`;
        return;
    }
    if (type === 'cardio') {
        content.innerHTML = `<div class="rest-day-card"><div class="emoji">🏃</div><h2>Лёгкое кардио</h2><p>20–30 минут. Подвижность, прогулка, велосипед — без высокой интенсивности.</p></div>`;
        return;
    }

    const w = workouts[type];
    let html = `<div class="workout-card">
        <h2>${w.title}</h2>
        <p class="workout-meta">⏱ ${w.duration}</p>
        <div class="warmup-note">⚡ ${w.warmup}</div>`;

    w.exercises.forEach((ex, i) => {
        html += `<div class="exercise">
            <div class="exercise-header">
                <span class="exercise-name">${i + 1}. ${ex.name}</span>
                <span class="exercise-sets">${ex.sets}</span>
            </div>
            ${ex.desc ? `<p class="exercise-desc">${ex.desc}</p>` : ''}
        </div>`;
    });

    html += '</div>';
    content.innerHTML = html;
}

function updateChecklist() {
    const weekData = getWeekData(currentWeek);
    const checks = document.querySelectorAll('.check-item input');
    let done = 0;
    checks.forEach(cb => {
        const task = cb.dataset.task;
        cb.checked = !!weekData.checklist[task];
        if (cb.checked) done++;
    });
    document.getElementById('progressFill').style.width = `${(done / 5) * 100}%`;
    document.getElementById('progressText').textContent = `${done} из 5`;
}

function updateWeekInfo() {
    document.getElementById('weekInfo').textContent = weekGoals[currentWeek];
}

function setActiveDay(dayKey) {
    currentDay = dayKey;
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.day === dayKey);
    });
    renderWorkout(dayKey);
}

function setActiveWeek(week) {
    currentWeek = week;
    document.querySelectorAll('.week-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.week) === week);
    });
    updateWeekInfo();
    updateChecklist();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Day navigation
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', () => setActiveDay(btn.dataset.day));
    });

    // Week navigation
    document.querySelectorAll('.week-btn').forEach(btn => {
        btn.addEventListener('click', () => setActiveWeek(parseInt(btn.dataset.week)));
    });

    // Checklist
    document.querySelectorAll('.check-item input').forEach(cb => {
        cb.addEventListener('change', () => {
            const weekData = getWeekData(currentWeek);
            weekData.checklist[cb.dataset.task] = cb.checked;
            setWeekData(currentWeek, weekData);
            updateChecklist();
        });
    });

    // New week
    document.getElementById('newWeekBtn').addEventListener('click', () => {
        if (currentWeek < 4) {
            setActiveWeek(currentWeek + 1);
        } else {
            if (confirm('Это последняя неделя! Начать заново с 1-й недели?')) {
                localStorage.removeItem('trainingData');
                setActiveWeek(1);
            }
        }
    });

    // Set today
    const today = getTodayKey();
    setActiveDay(today);
    setActiveWeek(1);
});
