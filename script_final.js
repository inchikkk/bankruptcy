  creditors.forEach((c, i) => c.id = i + 1);
  return creditors;
}
function renderDebtsPanel() {
  const c = window.currentCase;
  if (!c) return;
  
  currentCreditors = c.creditors || generateCreditors(c.debt);
  const list = $('creditorsList');
  list.innerHTML = '';

  currentCreditors.forEach(cr => {
    const item = document.createElement('div');
    item.className = 'creditor-item' + (cr.overdueMonths > 3 ? ' sued' : '');
    const overdueText = cr.overdueMonths > 0 
      ? `<div class="creditor-overdue">РџСЂРѕСЃСЂРѕС‡РµРЅРЅР°СЏ Р·Р°РґРѕР»Р¶РµРЅРЅРѕСЃС‚СЊ: ${cr.overdueMonths} РјРµСЃ.</div>` 
      : '';
    const courtBadge = cr.overdueMonths > 3 
      ? `<span class="creditor-court-badge">РџРµСЂРµРґР°РЅР° РІ СЃСѓРґ</span>` 
      : '';
    item.innerHTML = `
      <div class="creditor-header">
        <span class="creditor-name">${cr.id}. ${cr.name} ${courtBadge}</span>
        <span class="creditor-type">${cr.type}</span>
      </div>
      <div class="creditor-debt-type">РўРёРї: ${cr.debtType}</div>
      <div class="creditor-amount">${fmt(cr.debt)}</div>
      ${overdueText}
    `;
    list.appendChild(item);
  });

  const total = currentCreditors.reduce((sum, cr) => sum + cr.debt, 0);
  $('debtTotal').innerHTML = `<div class="label">РћР±С‰Р°СЏ СЃСѓРјРјР° Р·Р°РґРѕР»Р¶РµРЅРЅРѕСЃС‚Рё</div><div class="amount">${fmt(total)}</div>`;
}

document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    playClick();
    console.log('Button clicked:', btn.dataset.action);
    const action=btn.dataset.action;
    if(action==='play'){show('loadingPanel');animateLoading();}
    else if(action==='settings'){show('settingsPanel');}
    else if(action==='resume'){backToPrevious();}
    else if(action==='exit'){closeSite();}
    else if(action==='back'){hideSideSquares();switchPanel('mainPanel');}
    else if(action==='stats'){show('statsPanel');}
    else if(action==='history'){showHistoryPanel();}
  });
});

// РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ: РїРѕРєР°Р·С‹РІР°РµРј mainPanel РїСЂРё Р·Р°РіСЂСѓР·РєРµ СЃС‚СЂР°РЅРёС†С‹
function initApp(){
  show('mainPanel');
}
if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
$('personAvatar').addEventListener('click',()=>{
  playClick();
  const existing=document.querySelector('.person-modal');
  if(existing){existing.remove();return;}
  const back=document.createElement('div');back.className='person-modal-backdrop';
  document.querySelector('.window').appendChild(back);
  const modal=document.createElement('div');modal.className='person-modal';
  const c=window.currentCase;if(!c)return;
  modal.innerHTML='<h2>'+c.fio+'</h2>'+
    '<p><b>РџРѕР»:</b> '+(c.male?'РњСѓР¶':'Р–РµРЅ')+'</p>'+
    '<p><b>Р”Р°С‚Р° СЂРѕР¶РґРµРЅРёСЏ:</b> '+birthDate(c.age)+'</p>'+
    '<p><b>РЎРµРјРµР№РЅРѕРµ РїРѕР»РѕР¶РµРЅРёРµ:</b> '+(c.married?'Р’ Р±СЂР°РєРµ: '+c.spouse:'РҐРѕР»РѕСЃС‚')+'</p>'+
    '<p><b>РљРѕРјРїР°РЅРёСЏ:</b> '+c.company+'</p>'+
    '<p><b>РџСЂРѕС„РµСЃСЃРёСЏ:</b> '+c.profession+'</p>'+
    '<p><b>РўСЂСѓРґРѕСѓСЃС‚СЂРѕР№СЃС‚РІРѕ:</b> '+c.employment+'</p>';
  const close=document.createElement('button');close.className='btn close-btn';close.textContent='Р—Р°РєСЂС‹С‚СЊ';
  close.addEventListener('click',()=>{back.remove();modal.remove();});
  modal.appendChild(close);
  document.querySelector('.window').appendChild(modal);
  back.addEventListener('click',()=>{back.remove();modal.remove();});
});
$('soundToggle').addEventListener('change',e=>{soundOn=e.target.checked;initAudio();if(soundOn)playClick();setStatus(soundOn?'Р—РІСѓРє РІРєР»СЋС‡С‘РЅ':'Р—РІСѓРє РѕС‚РєР»СЋС‡С‘РЅ');});
$('volume').addEventListener('input',e=>{mainGainVol=e.target.value/100;if(masterGain)masterGain.gain.value=mainGainVol;});
$('bgMusicToggle').addEventListener('change',e=>{
  musicOn=e.target.checked;initAudio();
  if(musicOn){musicGainVol=$('musicVolume').value/100;if(bgmusicGain)bgmusicGain.gain.value=musicGainVol;startBgMusic();setStatus('РњСѓР·С‹РєР° РІРєР»СЋС‡РµРЅР°');}
  else{stopBgMusic();setStatus('РњСѓР·С‹РєР° РІС‹РєР»СЋС‡РµРЅР°');}
});
$('musicVolume').addEventListener('input',e=>{musicGainVol=e.target.value/100;if(bgmusicGain)bgmusicGain.gain.value=musicGainVol;});
$('themeSelect').addEventListener('change',e=>document.body.setAttribute('data-theme',e.target.value));
function closeSite(){
  document.body.innerHTML='<div class="site-closed"><h1>РЎРїР°СЃРёР±Рѕ Р·Р° РёРіСЂСѓ!</h1><p>РЎРёРјСѓР»СЏС‚РѕСЂ Р±Р°РЅРєСЂРѕС‚СЃС‚РІР° Р·Р°РєСЂС‹С‚</p><button onclick="location.reload()">Р—Р°РєСЂС‹С‚СЊ РІРєР»Р°РґРєСѓ</button></div>';
}

// === РСЃС‚РѕСЂРёСЏ РґРµР» ===
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
    list.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">РСЃС‚РѕСЂРёСЏ РїСѓСЃС‚Р°. РЎРіРµРЅРµСЂРёСЂСѓР№С‚Рµ РґРµР»Рѕ, С‡С‚РѕР±С‹ РґРѕР±Р°РІРёС‚СЊ РµРіРѕ РІ РёСЃС‚РѕСЂРёСЋ.</p>';
    return;
  }
  caseHistory.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.style.cssText = 'border:1px solid #444;border-radius:8px;padding:12px;margin-bottom:10px;cursor:pointer;background:#2a2a2a;';
    item.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <strong>${entry.fio}</strong>
          <span style="color:#888;margin-left:10px;">${entry.age} Р»РµС‚</span>
        </div>
        <span style="color:#888;font-size:0.85em;">${new Date(entry.timestamp).toLocaleString('ru-RU')}</span>
      </div>
      <div style="margin-top:6px;font-size:0.9em;">
        Р”РѕР»Рі: ${fmt(entry.debt)} в‚Ѕ | Р”РѕС…РѕРґ: ${fmt(entry.income)} в‚Ѕ | ${entry.employment}
      </div>
    `;
    item.addEventListener('click', () => loadCaseFromHistory(entry));
    list.appendChild(item);
  });
}

function loadCaseFromHistory(entry) {
  window.currentCase = {
    fio: entry.fio,
    male: entry.male,
    surname: entry.fio.split(' ')[0],
    pat: entry.fio.split(' ')[2],
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
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(!$('pausePanel').classList.contains('hidden')){backToPrevious();}
  else {
    // РџСЂРѕРІРµСЂСЏРµРј, РІРёРґРёРј Р»Рё РјС‹ casePanel РёР»Рё РґСЂСѓРіСѓСЋ СЃР»Р°Р№Рґ-РїР°РЅРµР»СЊ
    const activePanel = document.querySelector('.slider-wrapper .panel.active');
    if(activePanel){show('pausePanel');}
  }
});
