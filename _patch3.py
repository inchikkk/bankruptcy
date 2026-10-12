# -*- coding: utf-8 -*-
p = r'c:/Users/1/OneDrive - СГСПУ/Рабочий стол/Банкротство/script.js'
with open(p, 'r', encoding='utf-8-sig', newline='') as f:
    data = f.read()

# Удаляем старый showStats (который БЕЗ hideAllOverlays и renderStats)
old = (
    "function showStats() {\n"
    "  showScreen('statsScreen');\n"
    "  updateBreadcrumb('Статистика');\n"
    "}\n\n"
    "function showHistory() {\n"
    "  hideAllOverlays();\n"
    "  loadHistory();\n"
    "  renderHistoryList();\n"
    "  showScreen('historyScreen');\n"
    "  updateBreadcrumb('История дел');\n"
    "}\n\n"
    "function showStats() {\n"
    "  hideAllOverlays();\n"
    "  renderStats();\n"
    "  showScreen('statsScreen');\n"
    "  updateBreadcrumb('Статистика');\n"
    "}"
)

new = (
    "function showHistory() {\n"
    "  hideAllOverlays();\n"
    "  loadHistory();\n"
    "  renderHistoryList();\n"
    "  showScreen('historyScreen');\n"
    "  updateBreadcrumb('История дел');\n"
    "}\n\n"
    "function showStats() {\n"
    "  hideAllOverlays();\n"
    "  renderStats();\n"
    "  showScreen('statsScreen');\n"
    "  updateBreadcrumb('Статистика');\n"
    "}\n\n"
    "function showAchievements() {\n"
    "  hideAllOverlays();\n"
    "  renderAchievements();\n"
    "  showScreen('achievementsScreen');\n"
    "  updateBreadcrumb('Достижения');\n"
    "}"
)

count = data.count(old)
print('occurrences:', count)
assert count == 1, 'pattern not found exactly once'
data = data.replace(old, new)
with open(p, 'w', encoding='utf-8-sig', newline='') as f:
    f.write(data)
print('OK')