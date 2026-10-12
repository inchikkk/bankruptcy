
﻿// === Утилиты ===
function $(id) { return document.getElementById(id); }
function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function fmt(n) { return n.toLocaleString('ru-RU'); }

// === Источники задолженностей ===
const MFO_SOURCES = [
  'Платиза', 'Быстроденьги', 'Екапуста', 'Кредит Плюс', 'Займер',
  'Займиго', 'Бери Беру', 'Езаем', 'МаниБокс', 'Давака',
  'Хурма Кредит', 'Финтерра', 'Деньги ОК', 'Дополучкино', 'МигКредит',
  '495 Кредит', 'Финмолл', 'Деньги Сразу', 'Небус'
];

const BANK_SOURCES = [
  'СберБанк', 'Банк ВТБ', 'Газпромбанк', 'Альфа-Банк', 'Т-Банк',
  'Россельхозбанк', 'Московский Кредитный Банк', 'ДОМ.РФ Банк', 'Совкомбанк', 'Райффайзенбанк',
  'Новиком', 'Банк Россия', 'БСПБ', 'Ак Барс Банк', 'Ozon Банк',
  'ОТП Банк', 'Банк Уралсиб', 'МТС Банк', 'Национальный Резервный Банк', 'ЮниКредит Банк',
  'Дж.П. Морган Банк Интернешнл', 'Яндекс Банк', 'ТрансКапиталБанк', 'Азиатско-Тихоокеанский Банк', 'Экспобанк',
  'Абсолют Банк', 'Аверс', 'Банк Зенит', 'Кредит Европа Банк', 'Росэксимбанк',
  'Локо-Банк', 'Металлинвестбанк', 'УБРиР', 'Destroyed Финанс Банк', 'Кубань Кредит',
  'ББР Банк', 'Вайлдберриз Банк', 'Примсоцбанк', 'Русский Стандарт', 'Мир Бизнес Банк'
];

// === Параметры типов задолженностей ===
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
  const usedTypes = new Set();
  const bankDebts = {};
  const mfoDebts = {};
  let remaining = totalDebt;

  const sortedTypes = Object.entries(debtParams)
    .sort((a, b) => b[1].probability - a[1].probability);

  const typeCount = 2 + Math.floor(Math.random() * 3);
  const selectedTypes = [];
  for (let i = 0; i < typeCount && i < sortedTypes.length; i++) {
    selectedTypes.push(sortedTypes[i][0]);
  }

  function canAddBankDebt(bankName, debtType) {
    const debts = bankDebts[bankName] || [];
    if (debts.length >= 3) return false;
    if (debtType === 'creditCard') {
      return !debts.some(d => d.debtType === 'creditCard');
    }
    return true;
  }

  function canAddMfoDebt(mfoName) {
    return !mfoDebts[mfoName] || mfoDebts[mfoName].length === 0;
  }

  let attempts = 0;
  while (remaining > 500 && creditors.length < 50 && attempts < 200) {
    attempts++;
    const typeIndex = Math.floor(Math.random() * selectedTypes.length);
    const type = selectedTypes[typeIndex];
    const params = debtParams[type];
    if (!params) continue;

    if (usedTypes.has(type) && (type === 'tax' || type === 'utilities')) continue;

    const availableSources = params.sources.filter(s => !usedNames.has(s));
    if (availableSources.length === 0) continue;

    const source = availableSources[Math.floor(Math.random() * availableSources.length)];
    usedNames.add(source);

    const isBank = BANK_SOURCES.includes(source);
    const isMfo = MFO_SOURCES.includes(source);

    if (isBank && !canAddBankDebt(source, type)) continue;
    if (isMfo && !canAddMfoDebt(source)) continue;

    const uniqueOffset = Math.floor(Math.random() * 1000) - 500;
    const amount = Math.max(params.min, Math.min(
      params.max,
      Math.floor((params.min + params.max) / 2) + uniqueOffset
    ));
    const finalAmount = Math.min(amount, remaining);
    const isSubmittedToCourt = Math.random() < 0.3;

    creditors.push({
      id: creditors.length + 1,
      name: source,
      type: isBank ? 'bank' : (isMfo ? 'mfo' : 'other'),
      debtType: type,
      debt: finalAmount,
      overdueMonths: Math.random() < 0.5 ? Math.floor(Math.random() * 8) : 0,
      submittedToCourt: isSubmittedToCourt
    });
    remaining -= finalAmount;
    usedTypes.add(type);

    if (isBank) {
      if (!bankDebts[source]) bankDebts[source] = [];
      bankDebts[source].push(creditors[creditors.length - 1]);
    } else if (isMfo) {
      if (!mfoDebts[source]) mfoDebts[source] = [];
      mfoDebts[source].push(creditors[creditors.length - 1]);
    }
  }

  for (const [bankName, debts] of Object.entries(bankDebts)) {
    if (debts.length >= 3 && debts.some(d => d.submittedToCourt)) {
      debts.forEach(d => d.submittedToCourt = true);
    }
  }

  creditors.forEach((c, i) => c.id = i + 1);
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
  const male = Math.random() > 0.5;
  const age = 18 + Math.floor(Math.random() * 46);
  const debt = 300000 + Math.floor(Math.random() * 2700000);
  const income = 15000 + Math.floor(Math.random() * 60000);
  const profession = getRandomItem(professions);
  const company = getRandomItem(companies);
  const employment = getRandomItem(employments);
  const married = Math.random() > 0.6;
  const spouse = married ? getRandomItem(spouses) : '';
  const property = propertyPool.sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 4));
  const creditors = generateCreditors(debt);

  window.currentCase = {
    fio: fio,
    male: male,
    surname: surname,
    patname: patname,
    profession: profession,
    company: company,
    employment: employment,
    age: age,
    debt: debt,
    income: income,
    debts: creditors.length,
    property: property,
    married: married,
    spouse: spouse,
    creditors: creditors
  };
}

// === Рендер данных должника ===
function renderCaseCards(data) {
  const cards = $('caseCards');
  if (!cards) return;
  cards.innerHTML = '';
  const items = [
    {icon: '👤', label: 'ФИО', value: data.fio},
    {icon: '🎂', label: 'Дата рождения', value: data.birthdate},
    {icon: '📅', label: 'Возраст', value: data.age + ' лет'},
    {icon: '💍', label: 'Семейное положение', value: data.marital},
    {icon: '💼', label: 'Компания', value: data.company},
    {icon: '📋', label: 'Профессия', value: data.profession},
    {icon: '💰', label: 'Доход', value: data.income},
    {icon: '🏢', label: 'Трудоустройство', value: data.employment},
    {icon: '📊', label: 'Общая задолженность', value: data.debt}
  ];
  items.forEach(function(i) {
    const el = document.createElement('div');
    el.className = 'info-card';
    el.innerHTML = '<div class="ic-icon">' + i.icon + '</div><div class="ic-body"><span class="ic-label">' + i.label + '</span><span class="ic-val">' + i.value + '</span></div>';
    cards.appendChild(el);
  });
}

function renderPropertyList(properties) {
  const list = $('propertyList');
  if (!list || !properties || properties.length === 0) return;
  list.innerHTML = '';
  properties.forEach(function(p, i) {
    const el = document.createElement('div');
    el.className = 'property-item';
    el.style.cssText = 'padding:8px 12px;background:rgba(255,255,255,.04);border-radius:8px;margin-bottom:6px;font-size:.9em;color:#cfd6ff;';
    el.textContent = (i + 1) + '. ' + p;
    list.appendChild(el);
  });
}

function renderCase() {
  const c = window.currentCase;
  if (!c) return;
  renderCaseCards({
    fio: c.fio,
    gender: c.male ? 'Муж' : 'Жен',
    birthdate: birthDate(c.age),
    age: c.age,
    marital: c.married ? 'В браке с ' + c.spouse : 'Холост',
    company: c.company,
    profession: c.profession,
    employment: c.employment,
    debt: fmt(c.debt),
    income: fmt(c.income)
  });
  renderPropertyList(c.property);
}

function birthDate(age) {
  const d = new Date();
  d.setFullYear(d.getFullYear() - age);
  return d.toLocaleDateString('ru-RU');
}

// === Рендер задолженностей ===
function renderDebtsPanel() {
  const c = window.currentCase;
  if (!c) return;

  const currentCreditors = c.creditors || generateCreditors(c.debt);
  const list = $('creditorsList');
  if (!list) return;
  list.innerHTML = '';

  currentCreditors.forEach(function(cr) {
    const item = document.createElement('div');
    const overdueText = cr.overdueMonths > 0
      ? '<div class="creditor-overdue">Просроченная задолженность: ' + cr.overdueMonths + ' мес.</div>'
      : '';
    const courtBadge = cr.submittedToCourt
      ? '<span class="creditor-court-badge">Передана в суд</span>'
      : '';
    const typeLabel = cr.debtType === 'tax' ? 'Налоговый долг' : (cr.debtType === 'utilities' ? 'ЖКХ долг' : 'Кредит');
    const borderLeft = cr.submittedToCourt ? '3px solid #ef4444;' : (cr.id % 2 === 0 ? '3px solid #8b5cf6' : '3px solid #4a6cff');
    const textColor = cr.submittedToCourt ? '#ef4444' : '#4a6cff';
    item.style.cssText = 'background:rgba(255,255,255,.04);padding:16px 18px;border-radius:12px;margin-bottom:10px;border-left:' + borderLeft;
    item.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><div style="font-weight:600;color:#fff;">' + cr.id + '. ' + cr.name + '</div><div style="display:flex;gap:6px;align-items:center;">' + courtBadge + '<span class="badge">' + typeLabel + '</span></div></div><div style="font-size:.85em;color:#888;margin-bottom:4px;">Тип: ' + typeLabel + '</div><div style="font-size:1.4em;font-weight:700;color:' + textColor + ';">' + fmt(cr.debt) + ' ₽</div>' + overdueText;
    list.appendChild(item);
  });

  const total = currentCreditors.reduce(function(sum, cr) { return sum + cr.debt; }, 0);
  const totalEl = $('debtTotal');
  if (totalEl) totalEl.innerHTML = '<div class="label">Общая сумма задолженности</div><div class="amount">' + fmt(total) + '</div>';
}

// === Анимация загрузки ===
function animateLoading() {
  const fill = $('progressFill');
  const text = $('progressText');
  if (!fill || !text) return;
  let progress = 0;
  const interval = setInterval(function() {
    progress += Math.random() * 8 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(function() {
        generateCase();
        showSideSquares();
        switchPanel('casePanel');
      }, 300);
    }
    fill.style.width = progress + '%';
    text.textContent = 'Генерация дела ' + Math.round(progress) + '%';
  }, 150);
}

// === Показ/скрытие панелей ===
const modalPanels = ['pausePanel', 'settingsPanel'];
let previousPanel = 'mainPanel';

function show(panel) {
  // Save current active panel BEFORE hiding anything (for modal panels like pause)
  if (modalPanels.indexOf(panel) !== -1) {
    const current = document.querySelector('.slider-wrapper .panel.active');
    previousPanel = current ? current.id : 'mainPanel';
  } else {
    previousPanel = panel;
  }
  document.querySelectorAll('.slider-wrapper .panel').forEach(function(p) {
    p.classList.add('hidden');
    p.classList.remove('active');
  });
  const el = $(panel);
  if (!el) return;
  el.classList.remove('hidden');
  setTimeout(function() { el.classList.add('active'); }, 10);
}

function backToPrevious() {
  // Hide any open modal panels (pause, settings)
  modalPanels.forEach(function(id) {
    const el = $(id);
    if (el && !el.classList.contains('hidden')) {
      el.classList.add('hidden');
      el.classList.remove('active');
    }
  });
  // Also hide pause backdrop if present
  const backdrop = $('pauseBackdrop');
  if (backdrop && !backdrop.classList.contains('hidden')) {
    backdrop.classList.add('hidden');
  }
  // Return to the panel that was active before the modal was shown
  const target = (previousPanel === 'pausePanel') ? 'casePanel' : previousPanel;
  show(target);
}

function hideModals() {
  modalPanels.forEach(function(id) {
    const el = $(id);
    if (el) { el.classList.add('hidden'); el.classList.remove('active'); }
  });
}

function switchPanel(panelId) {
  hideModals();
  document.querySelectorAll('.square').forEach(function(sq) {
    sq.classList.toggle('active', sq.dataset.panel === panelId);
  });
  if (panelId) show(panelId);
  if (panelId === 'casePanel' && window.currentCase) {
    renderCase();
    renderPropertyList(window.currentCase.property);
  }
  if (panelId === 'debtsPanel') renderDebtsPanel();
}

function showSideSquares() {
  const sideSquares = $('sideSquares');
  if (sideSquares) sideSquares.classList.remove('hidden');
}

function hideSideSquares() {
  const sideSquares = $('sideSquares');
  if (sideSquares) sideSquares.classList.add('hidden');
}

// === Построение боковых квадратов ===
function buildSideSquares() {
  const container = $('sideSquares');
  if (!container) return;
  container.innerHTML = '';
  const sqNames = ['Рабочее место', 'Должник', 'Задолженность', 'Заглушка 1', 'Заглушка 2', 'Заглушка 3'];
  const sqPanels = ['workspacePanel', 'casePanel', 'debtsPanel', 'placeholder1Panel', 'placeholder2Panel', 'placeholder3Panel'];
  
  sqNames.forEach(function(name, i) {
    const n = i + 1;
    const row = document.createElement('div');
    row.className = 'sq-row';
    
    const sq = document.createElement('div');
    sq.className = 'square square-' + n;
    sq.title = name;
    sq.dataset.panel = sqPanels[i] || 'placeholder6Panel';
    
    const lbl = document.createElement('span');
    lbl.className = 'sq-label';
    lbl.textContent = n;
    sq.appendChild(lbl);
    
    const nameEl = document.createElement('div');
    nameEl.className = 'sq-name';
    nameEl.textContent = name;
    
    row.appendChild(sq);
    row.appendChild(nameEl);
    
    sq.addEventListener('click', function() {
      document.querySelectorAll('.square').forEach(function(x) { x.classList.remove('active'); });
      sq.classList.add('active');
      const panelId = sq.dataset.panel;
      if (panelId) switchPanel(panelId);
    });
    
    container.appendChild(row);
  });
}

// === История дел ===
const HISTORY_KEY = 'bankruptcy_cases_history';
let caseHistory = [];

function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      caseHistory = JSON.parse(saved);
    } else {
      caseHistory = [];
    }
  } catch(e) {
    caseHistory = [];
  }
  renderHistoryList();
}

function saveCaseToHistory(caseData) {
  const entry = {
    id: Date.now() + '_' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    fio: caseData.fio,
    male: caseData.male,
    age: caseData.age,
    debt: caseData.debt,
    income: caseData.income,
    profession: caseData.profession,
    company: caseData.company,
    employment: caseData.employment,
    married: caseData.married,
    spouse: caseData.spouse,
    debts: caseData.debts,
    property: caseData.property,
    creditors: caseData.creditors
  };
  caseHistory.unshift(entry);
  if (caseHistory.length > 50) caseHistory = caseHistory.slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(caseHistory));
  renderHistoryList();
}

function renderHistoryList() {
  const list = $('historyList');
  if (!list) return;
  list.innerHTML = '';
  if (caseHistory.length === 0) {
    list.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">История пуста. Сгенерируйте дело, чтобы добавить его в историю.</p>';
    return;
  }
  caseHistory.forEach(function(entry) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.style.cssText = 'border:1px solid #444;border-radius:8px;padding:12px;margin-bottom:10px;cursor:pointer;background:#2a2a2a;';
    item.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;"><div><strong>' + entry.fio + '</strong><span style="color:#888;margin-left:10px;">' + entry.age + ' лет</span></div><span style="color:#888;font-size:0.85em;">' + new Date(entry.timestamp).toLocaleString('ru-RU') + '</span></div><div style="margin-top:6px;font-size:0.9em;">Долг: ' + fmt(entry.debt) + ' ₽ | Доход: ' + fmt(entry.income) + ' ₽ | ' + entry.employment + '</div>';
    item.addEventListener('click', function() { loadCaseFromHistory(entry); });
    list.appendChild(item);
  });
}

function loadCaseFromHistory(entry) {
  window.currentCase = {
    fio: entry.fio,
    male: entry.male,
    surname: entry.fio.split(' ')[0],
    patname: entry.fio.split(' ')[2],
    profession: entry.profession,
    company: entry.company,
    employment: entry.employment,
    age: entry.age,
    debt: entry.debt,
    income: entry.income,
    debts: entry.debts,
    property: entry.property,
    married: entry.married,
    spouse: entry.spouse,
    creditors: entry.creditors
  };
  show('casePanel');
  renderCase();
  renderDebtsPanel();
}

function showHistoryPanel() {
  loadHistory();
  show('historyPanel');
}

// === Инициализация ===
function initApp() {
  show('mainPanel');
  buildSideSquares();
}

// === Обработчики событий ===
document.querySelectorAll('.btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const action = btn.dataset.action;
    if (action === 'play') {
      show('loadingPanel');
      animateLoading();
    } else if (action === 'settings') {
      show('settingsPanel');
    } else if (action === 'resume') {
      backToPrevious();
    } else if (action === 'exit') {
      location.reload();
    } else if (action === 'back') {
      hideSideSquares();
      switchPanel('mainPanel');
    } else if (action === 'stats') {
      show('statsPanel');
    } else if (action === 'history') {
      showHistoryPanel();
    }
  });
});

document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  if (!$('pausePanel').classList.contains('hidden')) {
    backToPrevious();
  } else {
    const activePanel = document.querySelector('.slider-wrapper .panel.active');
    if (activePanel) show('pausePanel');
  }
});

// === Запуск ===
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
