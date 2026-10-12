// === Утилиты ===
function $(id) { return document.getElementById(id); }
function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function fmt(n) { return n.toLocaleString('ru-RU'); }

// === Источники задолженностей ===
const MFO_SOURCES = ['Платиза', 'Быстроденьги', 'Екапуста', 'Кредит Плюс', 'Займер', 'Займиго', 'Бери Беру', 'Езаем', 'МаниБокс', 'Давака', 'Хурма Кредит', 'Финтерра', 'Деньги ОК', 'Дополучкино', 'МигКредит', '495 Кредит', 'Финмолл', 'Деньги Сразу', 'Небус'];
const BANK_SOURCES = ['СберБанк', 'Банк ВТБ', 'Газпромбанк', 'Альфа-Банк', 'Т-Банк', 'Россельхозбанк', 'Московский Кредитный Банк', 'ДОМ.РФ Банк', 'Совкомбанк', 'Райффайзенбанк', 'Новиком', 'Банк Россия', 'БСПБ', 'Ак Барс Банк', 'Ozon Банк', 'ОТП Банк', 'Банк Уралсиб', 'МТС Банк', 'Национальный Резервный Банк', 'ЮниКредит Банк', 'Дж.П. Морган Банк Интернешнл', 'Яндекс Банк', 'ТрансКапиталБанк', 'Азиатско-Тихоокеанский Банк', 'Экспобанк', 'Абсолют Банк', 'Аверс', 'Банк Зенит', 'Кредит Европа Банк', 'Росэксимбанк', 'Локо-Банк', 'Металлинвестбанк', 'УБРиР', 'Destroyed Финанс Банк', 'Кубань Кредит', 'ББР Банк', 'Вайлдберриз Банк', 'Примсоцбанк', 'Русский Стандарт', 'Мир Бизнес Банк'];

const debtParams = {
  credit: { min: 30000, max: 2000000, probability: 0.45, sources: BANK_SOURCES },
  creditCard: { min: 15000, max: 500000, probability: 0.20, sources: BANK_SOURCES },
  loan: { min: 1000, max: 50000, probability: 0.20, sources: MFO_SOURCES },
  tax: { min: 10000, max: 200000, probability: 0.10, sources: ['Федеральная налоговая служба'] },
  utilities: { min: 5000, max: 100000, probability: 0.05, sources: ['ЖКХ'] }
};

// === Генерация кредиторов ===
function generateCreditors(totalDebt) {
  const creditors = [];
  const usedNames = new Set();
  let remaining = totalDebt;
  const sortedTypes = Object.entries(debtParams).sort((a, b) => b[1].probability - a[1].probability);
  const typeCount = 2 + Math.floor(Math.random() * 3);
  const selectedTypes = [];
  for (let i = 0; i < typeCount && i < sortedTypes.length; i++) selectedTypes.push(sortedTypes[i][0]);
  let attempts = 0;
  while (remaining > 500 && creditors.length < 50 && attempts < 200) {
    attempts++;
    const type = selectedTypes[Math.floor(Math.random() * selectedTypes.length)];
    const params = debtParams[type];
    if (!params) continue;
    const availableSources = params.sources.filter(s => !usedNames.has(s));
    if (availableSources.length === 0) continue;
    const source = availableSources[Math.floor(Math.random() * availableSources.length)];
    usedNames.add(source);
    const amount = params.min + Math.floor(Math.random() * (params.max - params.min));
    if (amount > remaining) continue;
    creditors.push({
      id: creditors.length + 1, name: source, debtType: type, debt: amount,
      overdueMonths: Math.random() < 0.5 ? Math.floor(Math.random() * 8) : 0,
      submittedToCourt: Math.random() < 0.3
    });
    remaining -= amount;
  }
  return creditors;
}

// === Генерация дела ===
function generateCase() {
  const surnames = ['Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Соколов', 'Михайлов', 'Новиков'];
  const names = ['Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артём', 'Илья', 'Кирилл', 'Михаил'];
  const patnames = ['Александрович', 'Дмитриевич', 'Максимович', 'Сергеевич', 'Андреевич', 'Алексеевич', 'Артемович', 'Ильич', 'Кириллович', 'Михайлович'];
  const professions = ['Водитель', 'Бухгалтер', 'Продавец', 'Рабочий', 'Инженер', 'Офисный работник', 'Таксист', 'Дальнобойщик', 'Строитель', 'Фермер'];
  const companies = ['ООО "Ромашка"', 'ИП Петров', 'ЗАО "Вектор"', 'ООО "Прогресс"', 'АО "Строймонтаж"', 'ИП Сидоров', 'ООО "Техно"', 'ЗАО "Альфа"', 'ООО "Бета"', 'ИП Иванов'];
  const employments = ['Работаю', 'Не работаю', 'Фриланс', 'Пенсионер', 'Студент'];
  const spouses = ['Елена', 'Мария', 'Анна', 'Ольга', 'Наталья', 'Татьяна', 'Ирина', 'Светлана', 'Екатерина', 'Юлия'];
  const propertyPool = ['Квартира', 'Машина', 'Земельный участок', 'Дача', 'Гараж', 'Ведомственное жилье'];
  const surname = getRandomItem(surnames);
  const name = getRandomItem(names);
  const patname = getRandomItem(patnames);
  const fio = surname + ' ' + name + ' ' + patname;
  const age = 18 + Math.floor(Math.random() * 46);
  const debt = 300000 + Math.floor(Math.random() * 2700000);
  const income = 15000 + Math.floor(Math.random() * 60000);
  const profession = getRandomItem(professions);
  const company = getRandomItem(companies);
  const employment = getRandomItem(employments);
  const married = Math.random() > 0.6;
  const spouse = married ? getRandomItem(spouses) : '';
  const property = propertyPool.sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 3));
  const creditors = generateCreditors(debt);
  window.currentCase = {
    fio, male: Math.random() > 0.5, surname, patname, profession, company, employment,
    age, debt, income, debts: creditors.length, property, married, spouse, creditors
  };
}

// === Рендер данных должника ===
function renderCase() {
  const c = window.currentCase;
  if (!c) return;
  if ($('debtorName')) $('debtorName').textContent = c.fio;
  if ($('caseSubtitle')) $('caseSubtitle').textContent = c.fio + ' - Вымышленный должник';
  if ($('debtorGrid')) {
    var html = '<div class="debt-info-item"><span class="debt-info-label">Возраст</span><span class="debt-info-value">' + c.age + ' лет</span></div>';
    html += '<div class="debt-info-item"><span class="debt-info-label">Город</span><span class="debt-info-value">Нижний Новгород</span></div>';
    html += '<div class="debt-info-item"><span class="debt-info-label">Занятость</span><span class="debt-info-value">' + c.employment + '</span></div>';
    html += '<div class="debt-info-item"><span class="debt-info-label">Доход в месяц</span><span class="debt-info-value">' + fmt(c.income) + ' ₽</span></div>';
    $('debtorGrid').innerHTML = html;
  }
  renderPropertyList(c.property);
  renderCaseSummary(c);
}

function renderPropertyList(properties) {
  if (!$('propertyList')) return;
  var icons = {'Квартира': '🏠', 'Машина': '🚗', 'Земельный участок': '🌳', 'Дача': '🏡', 'Гараж': '🏗️', 'Ведомственное жилье': '🏢'};
  var html = '';
  properties.forEach(function(p) {
    var value = 300000 + Math.floor(Math.random() * 700000);
    var icon = icons[p] || '🏠';
    html += '<div class="property-item"><div class="property-icon">' + icon + '</div><div class="property-info"><div class="property-type">' + p + '</div><div class="property-detail">Оценка рынка</div></div><div class="property-value">' + fmt(value) + ' ₽</div></div>';
  });
  $('propertyList').innerHTML = html;
  if ($('propertyCount')) $('propertyCount').textContent = properties.length + ' объекта';
  var total = properties.reduce(function(s, p) { return s + (300000 + Math.floor(Math.random() * 700000)); }, 0);
  if ($('propertyTotal')) $('propertyTotal').innerHTML = '<span>Общая оценочная стоимость</span><span>' + fmt(total) + ' ₽</span>';
}

function renderCaseSummary(c) {
  if (!$('caseSummary')) return;
  var html = '<div class="case-summary-item"><div class="case-summary-label">Общая задолженность</div><div class="case-summary-value debt">' + fmt(c.debt) + ' ₽</div></div>';
  html += '<div class="case-summary-item"><div class="case-summary-label">Кредиторы</div><div class="case-summary-value count">' + c.creditors.length + '</div></div>';
  html += '<div class="case-summary-item"><div class="case-summary-label">Имущество</div><div class="case-summary-value">' + c.property.length + ' объектов</div></div>';
  html += '<div class="case-summary-item"><div class="case-summary-label">Статус</div><div class="case-summary-value" style="font-size:12px;color:var(--text-secondary);">Учебный пример</div></div>';
  $('caseSummary').innerHTML = html;
}

function renderDebtsPanel() {
  var c = window.currentCase;
  if (!c) return;
  if (!$('creditorsList')) return;
  var html = '';
  c.creditors.forEach(function(cr) {
    var typeLabel = cr.debtType === 'tax' ? 'Налоговый долг' : (cr.debtType === 'utilities' ? 'ЖКХ долг' : 'Кредит');
    var overdue = cr.overdueMonths > 0 ? ' | Просрочка: ' + cr.overdueMonths + ' мес.' : '';
    html += '<div class="creditor-item"><div><div class="creditor-name">' + cr.id + '. ' + cr.name + '</div><div class="creditor-type">' + typeLabel + overdue + '</div></div><div class="creditor-amount">' + fmt(cr.debt) + ' ₽</div></div>';
  });
  $('creditorsList').innerHTML = html;
  if ($('debtTotalBlock')) {
    var total = c.creditors.reduce(function(s, cr) { return s + cr.debt; }, 0);
    $('debtTotalBlock').innerHTML = '<div class="debt-total-value">' + fmt(total) + ' ₽</div>';
  }
}

// === Анимация загрузки ===
function animateLoading() {
  var fill = $('genProgressFill');
  var text = $('genProgressText');
  if (!fill || !text) return;
  var progress = 0;
  var interval = setInterval(function() {
    progress += Math.random() * 8 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(function() { generateCase(); showCase(); }, 300);
    }
    fill.style.width = progress + '%';
    text.textContent = 'Генерация дела ' + Math.round(progress) + '%';
  }, 150);
}

// === Показ/скрытие экранов ===
function hideAllOverlays() {
  // Скрываем все оверлеи
  var overlays = ['pauseOverlay', 'settingsOverlay'];
  overlays.forEach(function(id) {
    var el = $(id);
    if (el) el.classList.add('hidden');
  });
}

function showScreen(screenId) {
  // Скрываем все оверлеи при переходе на другой экран
  hideAllOverlays();
  
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
    s.classList.add('hidden');
  });
  var el = $(screenId);
  if (!el) return;
  el.classList.remove('hidden');
  setTimeout(function() { el.classList.add('active'); }, 10);
}

function showGenesis() {
  showScreen('genesisScreen');
  updateBreadcrumb('Главная');
}

function showCase() {
  showScreen('caseScreen');
  renderCase();
  renderDebtsPanel();
  updateBreadcrumb('Дело / Данные должника');
}

function updateBreadcrumb(text) {
  var bc = $('headerBreadcrumb');
  if (bc) bc.innerHTML = '<span class="breadcrumb-dot"></span><span class="breadcrumb-text">' + text + '</span>';
}

function switchTab(panelId) {
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.panel === panelId);
  });
  document.querySelectorAll('.panel').forEach(function(p) {
    p.classList.remove('active');
    p.classList.add('hidden');
  });
  var panel = $(panelId);
  if (panel) {
    panel.classList.remove('hidden');
    setTimeout(function() { panel.classList.add('active'); }, 10);
  }
  var breadcrumbMap = {
    'debtorTab': 'Данные должника', 'workspaceTab': 'Рабочее место', 'debtTab': 'Задолженность',
    'placeholder1Tab': 'Заглушка 1', 'placeholder2Tab': 'Заглушка 2', 'placeholder3Tab': 'Заглушка 3',
    'placeholder5Tab': 'Заглушка 5', 'placeholder6Tab': 'Заглушка 6'
  };
  updateBreadcrumb('Дело / ' + (breadcrumbMap[panelId] || panelId));
}

// === История дел ===
function loadHistory() {
  try {
    var data = localStorage.getItem('bankruptcy_cases_history');
    return data ? JSON.parse(data) : [];
  } catch(e) { return []; }
}

function saveCase() {
  if (!window.currentCase) return;
  var historyKey = 'bankruptcy_cases_history';
  var caseHistory = [];
  try {
    var data = localStorage.getItem(historyKey);
    caseHistory = data ? JSON.parse(data) : [];
  } catch(e) {}
  var entry = {
    fio: window.currentCase.fio, male: window.currentCase.male, age: window.currentCase.age,
    profession: window.currentCase.profession, company: window.currentCase.company,
    employment: window.currentCase.employment, debt: window.currentCase.debt,
    income: window.currentCase.income, married: window.currentCase.married,
    spouse: window.currentCase.spouse, debts: window.currentCase.debts,
    property: window.currentCase.property, creditors: window.currentCase.creditors,
    timestamp: Date.now()
  };
  caseHistory.unshift(entry);
  if (caseHistory.length > 50) caseHistory = caseHistory.slice(0, 50);
  localStorage.setItem(historyKey, JSON.stringify(caseHistory));
  renderHistoryList();
}

function renderHistoryList() {
  if (!$('historyList')) return;
  $('historyList').innerHTML = '';
  var caseHistory = loadHistory();
  if (caseHistory.length === 0) {
    $('historyList').innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:20px;">История пуста. Сгенерируйте дело, чтобы добавить его в историю.</p>';
    return;
  }
  caseHistory.forEach(function(entry) {
    var item = document.createElement('div');
    item.className = 'creditor-item';
    item.style.cursor = 'pointer';
    item.innerHTML = '<div><strong>' + entry.fio + '</strong><span style="color:var(--text-secondary);margin-left:10px;">' + entry.age + ' лет</span></div><span style="color:var(--text-secondary);font-size:0.85em;">' + new Date(entry.timestamp).toLocaleString('ru-RU') + '</span>';
    item.addEventListener('click', function() { loadCaseFromHistory(entry); });
    $('historyList').appendChild(item);
  });
}

function loadCaseFromHistory(entry) {
  window.currentCase = Object.assign({}, entry);
  showCase();
}

function showStats() {
  showScreen('statsScreen');
  updateBreadcrumb('Статистика');
}

function showHistory() {
  hideAllOverlays();
  loadHistory();
  renderHistoryList();
  showScreen('historyScreen');
  updateBreadcrumb('История дел');
}

function togglePause() {
  var overlay = $('pauseOverlay');
  if (overlay) overlay.classList.toggle('hidden');
}

function showSettings() {
  hideAllOverlays(); // Скрываем другие оверлеи
  var settingsOv = $('settingsOverlay');
  if (settingsOv) settingsOv.classList.remove('hidden');
}

// === Обработчики событий ===
document.querySelectorAll('[data-action]').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var action = btn.dataset.action;
    if (action === 'play') { showGenesis(); animateLoading(); }
    else if (action === 'history') { showHistory(); }
    else if (action === 'resume') { var pauseEl = $('pauseOverlay'); if (pauseEl) pauseEl.classList.add('hidden'); }
    else if (action === 'exit') { location.reload(); }
    else if (action === 'back') { 
      // Проверяем, какой overlay сейчас открыт
      var pauseOverlay = $('pauseOverlay');
      var settingsOverlay = $('settingsOverlay');
      if (pauseOverlay && !pauseOverlay.classList.contains('hidden')) {
        pauseOverlay.classList.add('hidden');
      } else if (settingsOverlay && !settingsOverlay.classList.contains('hidden')) {
        settingsOverlay.classList.add('hidden');
      } else {
        showGenesis();
      }
    }
    else if (action === 'settings') { 
      showSettings();
    }
  });
});

document.querySelectorAll('.tab-btn').forEach(function(btn) {
  btn.addEventListener('click', function() { switchTab(btn.dataset.panel); });
});

var pauseBtn = document.querySelector('[data-action="pause"]');
if (pauseBtn) pauseBtn.addEventListener('click', togglePause);

document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  var pauseOverlay = $('pauseOverlay');
  if (pauseOverlay && !pauseOverlay.classList.contains('hidden')) {
    pauseOverlay.classList.add('hidden');
  }
});

// === Запуск ===
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showGenesis);
} else {
  showGenesis();
}