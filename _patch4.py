# -*- coding: utf-8 -*-
p = r'c:/Users/1/OneDrive - СГСПУ/Рабочий стол/Банкротство/script.js'
with open(p, 'r', encoding='utf-8-sig', newline='') as f:
    data = f.read()

old = (
    "function showAchievements() {\n"
    "  hideAllOverlays();\n"
    "  renderAchievements();\n"
    "  showScreen('achievementsScreen');\n"
    "  updateBreadcrumb('Достижения');\n"
    "}\n\n"
    "function showAchievements() {\n"
    "  hideAllOverlays();\n"
    "  renderAchievements();\n"
    "  showScreen('achievementsScreen');\n"
    "  updateBreadcrumb('Достижения');\n"
    "}\n\n"
    "function togglePause()"
)

new = (
    "function showAchievements() {\n"
    "  hideAllOverlays();\n"
    "  renderAchievements();\n"
    "  showScreen('achievementsScreen');\n"
    "  updateBreadcrumb('Достижения');\n"
    "}\n\n"
    "function togglePause()"
)

count = data.count(old)
print('occurrences:', count)
assert count == 1, 'pattern not found exactly once'
data = data.replace(old, new)
with open(p, 'w', encoding='utf-8-sig', newline='') as f:
    f.write(data)
print('OK')