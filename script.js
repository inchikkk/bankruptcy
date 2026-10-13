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
function animateLoading(containerId) {
  var container = $(containerId || 'rightBlockContainer');
  if (!container) return;

  // Вставляем блок загрузки в правую карточку
  container.innerHTML =
    '<div class="gen-progress-wrap">' +
      '<svg class="gen-progress-circle" viewBox="0 0 200 200" aria-hidden="true">' +
        '<circle class="gen-progress-bg" cx="100" cy="100" r="80"></circle>' +
        '<circle class="gen-progress-fill" id="genProgressCircle" cx="100" cy="100" r="80"></circle>' +
      '</svg>' +
      '<span class="gen-progress-text" id="genProgressText">0%</span>' +
    '</div>' +
    '<p class="gen-hint" id="genHint">Подождите, пока материалы будут готовы...</p>';

  var circle = $('genProgressCircle');
  var text = $('genProgressText');
  var hint = $('genHint');
  if (!circle || !text) return;
  
  var progress = 0;
  var circumference = 502; // 2 * PI * 80 ≈ 502
  var dotsCount = 0;
  
  // Анимация многоточия
  var dotsInterval = setInterval(function() {
    dotsCount = (dotsCount % 3) + 1;
    var dots = '';
    for (var i = 0; i < dotsCount; i++) dots += '.';
    if (hint) hint.textContent = 'Подождите, пока материалы будут готовы' + dots;
  }, 400);
  
  var interval = setInterval(function() {
    progress += Math.random() * 8 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      clearInterval(dotsInterval);
      if (hint) hint.textContent = 'Подождите, пока материалы будут готовы.';
      // Заполняем круг на 100%
      circle.style.strokeDashoffset = circumference - (circumference * progress / 100);
      text.textContent = Math.round(progress) + '%';
      setTimeout(function() { generateCase(); showCase(); switchTab('debtorTab'); }, 300);
      return;
    }
    // Обновляем прогресс-бар
    circle.style.strokeDashoffset = circumference - (circumference * progress / 100);
    text.textContent = Math.round(progress) + '%';
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

// === Система сохранений (персонаж + текущее дело) ===
function loadSave() {
  try {
    var data = localStorage.getItem('bankruptcy_save');
    return data ? JSON.parse(data) : null;
  } catch(e) { return null; }
}
function saveGame(characterName, caseData) {
  var save = {
    characterName: characterName || 'Без имени',
    currentCase: caseData,
    timestamp: Date.now()
  };
  localStorage.setItem('bankruptcy_save', JSON.stringify(save));
}
function deleteSave() {
  localStorage.removeItem('bankruptcy_save');
}

// === Экран персонажа ===
function showCharacterScreen() {
  hideAllOverlays();
  showScreen('characterScreen');
  updateBreadcrumb('Создание персонажа');
  var input = $('characterNameInput');
  if (input) {
    input.value = '';
    input.focus();
  }
  var confirmBtn = $('confirmCharacterBtn');
  if (confirmBtn) {
    confirmBtn.onclick = function() {
      var name = input.value.trim();
      if (!name) {
        alert('Введите имя персонажа');
        return;
      }
      // Генерируем новое дело и сохраняем
      generateCase();
      window.currentCase.characterName = name;
      saveGame(name, window.currentCase);
      showCase();
      switchTab('workspaceTab');
    };
  }
}

// === Начать новую игру (с экрана главного) ===
function startNewGame() {
  showCharacterScreen();
}

// === Продолжить игру (с сохранения) ===
function continueGame() {
  var save = loadSave();
  if (save && save.currentCase) {
    window.currentCase = save.currentCase;
    if (save.characterName) window.currentCase.characterName = save.characterName;
    showCase();
    switchTab('workspaceTab');
  } else {
    startNewGame();
  }
}

// === Обновить кнопки на главном экране в зависимости от сохранений ===
function updateGenesisButtons() {
  var save = loadSave();
  var playBtn = document.querySelector('[data-action="play"]');
  if (!playBtn) return;
  if (save && save.currentCase) {
    // Делаем кнопку "Продолжить игру"
    var svg = playBtn.querySelector('svg');
    var text = playBtn.childNodes[playBtn.childNodes.length - 1];
    playBtn.className = 'btn-primary';
    if (svg) svg.style.display = '';
    if (text) text.nodeValue = 'Продолжить игру';
    playBtn.onclick = function(e) { e.preventDefault(); continueGame(); };
    // Добавляем кнопку "Начать новую игру"
    var actionsDiv = playBtn.closest('.genesis-actions');
    if (actionsDiv && !actionsDiv.querySelector('[data-action="newgame"]')) {
      var newGameBtn = document.createElement('button');
      newGameBtn.className = 'btn-ghost';
      newGameBtn.dataset.action = 'newgame';
      newGameBtn.innerHTML = '<svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg> Начать новую игру';
      newGameBtn.onclick = function() { startNewGame(); };
      actionsDiv.insertBefore(newGameBtn, playBtn.nextSibling);
    }
  } else {
    // Кнопка "Начать новую игру"
    playBtn.className = 'btn-primary';
    playBtn.onclick = function(e) { e.preventDefault(); startNewGame(); };
    var svg = playBtn.querySelector('svg');
    var text = playBtn.childNodes[playBtn.childNodes.length - 1];
    if (svg) svg.style.display = '';
    if (text) text.nodeValue = 'Начать новую игру';
    // Убираем лишнюю кнопку, если была
    var actionsDiv = playBtn.closest('.genesis-actions');
    if (actionsDiv) {
      var old = actionsDiv.querySelector('[data-action="newgame"]');
      if (old) old.remove();
    }
  }
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

function showHistory() {
  hideAllOverlays();
  loadHistory();
  renderHistoryList();
  showScreen('historyScreen');
  updateBreadcrumb('История дел');
}

function showStats() {
  hideAllOverlays();
  renderStats();
  showScreen('statsScreen');
  updateBreadcrumb('Статистика');
}

function showAchievements() {
  hideAllOverlays();
  renderAchievements();
  showScreen('achievementsScreen');
  updateBreadcrumb('Достижения');
}

function togglePause() {
  var overlay = $('pauseOverlay');
  if (overlay) overlay.classList.toggle('hidden');
}

function showSettings() {
  hideAllOverlays();
  renderSettings();
  showScreen('settingsScreen');
  updateBreadcrumb('Настройки');
}

// === Обработчики событий ===
document.querySelectorAll('[data-action]').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var action = btn.dataset.action;
    if (action === 'play') { continueGame(); }
    else if (action === 'newgame') { startNewGame(); }
    else if (action === 'history') { showHistory(); }
    else if (action === 'stats') { showStats(); }
    else if (action === 'achievements') { showAchievements(); }
    else if (action === 'resume') { var pauseEl = $('pauseOverlay'); if (pauseEl) pauseEl.classList.add('hidden'); }
    else if (action === 'exit') { location.reload(); }
    else if (action === 'back') { 
      // Проверяем, какой overlay сейчас открыт
      var pauseOverlay = $('pauseOverlay');
      var settingsOverlay = $('settingsOverlay');
      // Также проверяем экраны settingsScreen, statsScreen, achievementsScreen, historyScreen
      var settingsScreen = $('settingsScreen');
      var statsScreen = $('statsScreen');
      var achievementsScreen = $('achievementsScreen');
      var historyScreen = $('historyScreen');
      if (pauseOverlay && !pauseOverlay.classList.contains('hidden')) {
        pauseOverlay.classList.add('hidden');
      } else if (settingsOverlay && !settingsOverlay.classList.contains('hidden')) {
        settingsOverlay.classList.add('hidden');
      } else if (settingsScreen && !settingsScreen.classList.contains('hidden')) {
        showGenesis();
      } else if (statsScreen && !statsScreen.classList.contains('hidden')) {
        showGenesis();
      } else if (achievementsScreen && !achievementsScreen.classList.contains('hidden')) {
        showGenesis();
      } else if (historyScreen && !historyScreen.classList.contains('hidden')) {
        showGenesis();
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

var getCaseBtn = $('getCaseBtn');
if (getCaseBtn) {
  getCaseBtn.addEventListener('click', function() {
    animateLoading('workspacePanel');
    setTimeout(function() {
      generateCase();
      showCase();
      switchTab('debtorTab');
    }, 300);
  });
}

document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape' && e.keyCode !== 27) return;
  var pauseOverlay = $('pauseOverlay');
  var settingsOverlay = $('settingsOverlay');
  // Сначала проверяем настройки
  if (settingsOverlay && !settingsOverlay.classList.contains('hidden')) {
    settingsOverlay.classList.add('hidden');
    return;
  }
  // Переключаем паузу
  if (pauseOverlay) {
    if (pauseOverlay.classList.contains('hidden')) {
      pauseOverlay.classList.remove('hidden');
    } else {
      pauseOverlay.classList.add('hidden');
    }
  }
});

// === Рендер статистики ===
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
    '</div>';
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

// === Запуск ===
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initApp() {
  // Применяем сохранённую тему
  var theme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', theme);
  showGenesis();
  updateGenesisButtons();
}

// === Рендер настроек ===
function renderSettings() {
  var container = $('settingsScroll');
  if (!container) return;

  var savedTheme = localStorage.getItem('theme') || 'dark';
  var savedSound = localStorage.getItem('soundEnabled') !== 'false';
  var savedVolume = localStorage.getItem('volume') || '60';
  var savedBgMusic = localStorage.getItem('bgMusicEnabled') !== 'false';
  var savedMusicVolume = localStorage.getItem('musicVolume') || '35';

                  var svg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  function icon(path) { return svg + path + '</svg>'; }

  container.innerHTML = '' +
    '<div class="settings-panel">' +
      '<div class="settings-group">' +
        '<div class="settings-group-label">Интерфейс</div>' +
        '<div class="settings-item">' +
          '<div class="settings-item-left">' +
            '<div class="settings-item-icon">' + icon('<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>') + '</div>' +
            '<div class="settings-item-text">' +
              '<div class="settings-item-title">Тема</div>' +
              '<div class="settings-item-subtitle">Цветовая схема приложения</div>' +
            '</div>' +
          '</div>' +
          '<div class="settings-item-control">' +
            '<select class="settings-select" id="themeSelect">' +
              '<option value="dark" ' + (savedTheme === 'dark' ? 'selected' : '') + '>Тёмная</option>' +
              '<option value="light" ' + (savedTheme === 'light' ? 'selected' : '') + '>Светлая</option>' +
              '<option value="blue" ' + (savedTheme === 'blue' ? 'selected' : '') + '>Синяя</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="settings-group">' +
        '<div class="settings-group-label">Звук</div>' +
        '<div class="settings-item">' +
          '<div class="settings-item-left">' +
            '<div class="settings-item-icon">' + icon('<path d="M11 5L6 9H2v6h4l5 4V5z"/>') + '</div>' +
            '<div class="settings-item-text">' +
              '<div class="settings-item-title">Звуковые эффекты</div>' +
              '<div class="settings-item-subtitle">Включить/выключить звуки интерфейса</div>' +
            '</div>' +
          '</div>' +
          '<div class="settings-item-control">' +
            '<label class="settings-switch">' +
              '<input type="checkbox" id="soundToggle" ' + (savedSound ? 'checked' : '') + '>' +
              '<span class="settings-switch-slider"></span>' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<div class="settings-item">' +
          '<div class="settings-item-left">' +
            '<div class="settings-item-icon">' + icon('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>') + '</div>' +
            '<div class="settings-item-text">' +
              '<div class="settings-item-title">Громкость звуков</div>' +
              '<div class="settings-item-subtitle">' + savedVolume + '%</div>' +
            '</div>' +
          '</div>' +
          '<div class="settings-item-control">' +
            '<input type="range" class="settings-range" id="volume" min="0" max="100" value="' + savedVolume + '">' +
          '</div>' +
        '</div>' +
        '<div class="settings-item">' +
          '<div class="settings-item-left">' +
            '<div class="settings-item-icon">' + icon('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>') + '</div>' +
            '<div class="settings-item-text">' +
              '<div class="settings-item-title">Фоновая музыка</div>' +
              '<div class="settings-item-subtitle">Включить/выключить музыку в меню</div>' +
            '</div>' +
          '</div>' +
          '<div class="settings-item-control">' +
            '<label class="settings-switch">' +
              '<input type="checkbox" id="bgMusicToggle" ' + (savedBgMusic ? 'checked' : '') + '>' +
              '<span class="settings-switch-slider"></span>' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<div class="settings-item">' +
          '<div class="settings-item-left">' +
            '<div class="settings-item-icon">' + icon('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>') + '</div>' +
            '<div class="settings-item-text">' +
              '<div class="settings-item-title">Громкость музыки</div>' +
              '<div class="settings-item-subtitle">' + savedMusicVolume + '%</div>' +
            '</div>' +
          '</div>' +
          '<div class="settings-item-control">' +
            '<input type="range" class="settings-range" id="musicVolume" min="0" max="100" value="' + savedMusicVolume + '">' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="settings-footer"><button class="btn-primary" id="saveSettingsBtn">Сохранить</button></div>' +
    '</div>';

  var vol = $('volume');
  var musVol = $('musicVolume');
  if (vol) { vol.addEventListener('input', updateSub); }
  if (musVol) { musVol.addEventListener('input', updateSub); }
  function updateSub(e) {
    var input = e.target;
    var sub = input.parentElement.previousElementSibling.querySelector('.settings-item-subtitle');
    if (sub) sub.textContent = input.value + '%';
  }

  var saveBtn = $('saveSettingsBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      var theme = $('themeSelect').value;
      var sound = $('soundToggle').checked;
      var volume = $('volume').value;
      var bgMusic = $('bgMusicToggle').checked;
      var musicVolume = $('musicVolume').value;
      localStorage.setItem('theme', theme);
      localStorage.setItem('soundEnabled', sound);
      localStorage.setItem('volume', volume);
      localStorage.setItem('bgMusicEnabled', bgMusic);
      localStorage.setItem('musicVolume', musicVolume);
      document.body.setAttribute('data-theme', theme);
      var originalText = saveBtn.textContent;
      saveBtn.textContent = 'Сохранено!';
      saveBtn.style.background = '#10b981';
      setTimeout(function() { saveBtn.textContent = originalText; saveBtn.style.background = ''; }, 1500);
    });
  }
}