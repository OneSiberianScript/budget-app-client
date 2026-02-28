---
description: Сделать коммит в текущую ветку с подробным описанием изменений на русском
allowed-tools: Bash(git *), Bash(npm run lint:fix), Bash(npm run format), Read, Edit
---

Сделай коммит в текущую ветку:

1. Запусти `git status` и `git diff` чтобы понять изменения
2. При необходимости актуализируй **README.md** (описание проекта, переменные окружения, скрипты)
3. `git add .`
4. `git commit` с сообщением на русском, описывающим **все** изменения (не только последний файл)
5. Если pre-commit падает (lint-staged, eslint, prettier):
   - запусти `npm run lint:fix` и/или `npm run format`
   - `git add .`
   - повтори коммит
