# -*- coding: utf-8 -*-
p = r'c:/Users/1/OneDrive - СГСПУ/Рабочий стол/Банкротство/script.js'
with open(p, 'r', encoding='utf-8-sig', newline='') as f:
    data = f.read()

old = (
    "if (action === 'play') { showGenesis(); animateLoading(); }\n"
    "    else if (action === 'history') { showHistory(); }\n"
    "    else if (action === 'resume')"
)

new = (
    "if (action === 'play') { showGenesis(); animateLoading(); }\n"
    "    else if (action === 'history') { showHistory(); }\n"
    "    else if (action === 'stats') { showStats(); }\n"
    "    else if (action === 'achievements') { showAchievements(); }\n"
    "    else if (action === 'resume')"
)

count = data.count(old)
print('occurrences:', count)
assert count == 1, 'pattern not found exactly once'
data = data.replace(old, new)
with open(p, 'w', encoding='utf-8-sig', newline='') as f:
    f.write(data)
print('OK')