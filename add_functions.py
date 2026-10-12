# -*- coding: utf-8 -*-
p = r'c:/Users/1/OneDrive - СГСПУ/Рабочий стол/Банкротство/script.js'
with open(p, 'r', encoding='utf-8-sig', newline='') as f:
    data = f.read()

addition = '''// === Рендер статистики ===
function renderStats() {
  var container = $('statsScroll');
  if (!container) return;
  var history = loadHistory();
  if (history.length === 0) {
    container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:40px;">Статистика пуста. Сыграйте хотя бы одно дело.</p>';
    return;
  }
  var totalCases = history.length;
  var totalDebt = history.reduce(function(s, c) { return s + (c.debt || 0); }, 0);
  var totalIncome = history.reduce(function(s, c) { return s + (c.income || 0); }, 0);
  var avgDebt = totalCases ? Math.round(totalDebt / totalCases) : 0;
  var avgIncome = totalCases ? Math.round(totalIncome / totalCases) : 0;
  var maxDebt = Math.max.apply(null, history.map(function(c) { return c.debt || 0; }));
  var minDebt = Math.min.apply(null, history.map(function(c) { return c.debt || 0; }));

  container.innerHTML =
    '<div class="stat-grid">' +
      '<div class="stat-card"><div class="stat-value">' + totalCases + '</div><div class="stat-label">Всего дел</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + fmt(totalDebt) + ' ₽</div><div class="stat-label">Суммарный долг</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + fmt(avgDebt) + ' ₽</div><div class="stat-label">Средний долг</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + fmt(maxDebt) + ' ₽</div><div class="stat-label">Макс. долг</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + fmt(minDebt) + ' ₽</div><div class="stat-label">Мин. долг</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + fmt(avgIncome) + ' ₽</div><div class="stat-label">Средний доход</div></div>' +
    '</div>' +
    '<div class="stat-section"><h3>Последние дела</h3><div id="recentCases"></div></div>';

  var recent = $('recentCases');
  if (recent) {
    history.slice(0, 5).forEach(function(c) {
      var el = document.createElement('div');
      el.className = 'recent-case';
      el.innerHTML = '<span>' + c.fio + ' — ' + fmt(c.debt || 0) + ' ₽</span><span>' + new Date(c.timestamp).toLocaleDateString('ru-RU') + '</span>';
      recent.appendChild(el);
    });
  }
}

// === Рендер достижений ===
function renderAchievements() {
  var container = $('achievementsScroll');
  if (!container) return;
  var history = loadHistory();
  var totalCases = history.length;

  var achievements = [
    { id: 'first_case', title: 'Первое дело', desc: 'Сыграйте 1 дело', icon: '🏆', unlocked: totalCases >= 1 },
    { id: 'five_cases', title: 'Опытный менеджер', desc: 'Сыграйте 5 дел', icon: '📊', unlocked: totalCases >= 5 },
    { id: 'ten_cases', title: 'Ветеран', desc: 'Сыграйте 10 дел', icon: '⭐', unlocked: totalCases >= 10 },
    { id: 'big_debt', title: 'Крупный кредитор', desc: 'Долг более 5 млн в одном деле', icon: '💰', unlocked: history.some(function(c){ return (c.debt||0) >= 5000000; }) },
    { id: 'rich_debtor', title: 'Богатый должник', desc: 'Доход более 500к', icon: '💼', unlocked: history.some(function(c){ return (c.income||0) >= 500000; }) },
  ];

  container.innerHTML = '<div class="achievements-grid">' + achievements.map(function(a) {
    return '<div class="achievement-card ' + (a.unlocked ? '' : 'locked') + '">' +
      '<div class="achievement-icon">' + a.icon + '</div>' +
      '<div class="achievement-title">' + a.title + '</div>' +
      '<div class="achievement-desc">' + a.desc + '</div>' +
      '<div class="achievement-status">' + (a.unlocked ? '✅ Разблокировано' : '🔒 Заблокировано') + '</div>' +
    '</div>';
  }).join('') + '</div>';
}

'''

idx = data.index('// === Запуск ===')
data = data[:idx] + addition + data[idx:]
with open(p, 'w', encoding='utf-8-sig', newline='') as f:
    f.write(data)
print('OK')