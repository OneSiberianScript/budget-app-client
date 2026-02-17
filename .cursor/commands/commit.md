# commit

Сделай коммит в текущую ветку с подробным описанием изменений на русском.

1. `git add .`
2. `git commit` с сообщением, описывающим все изменения
3. Если pre-commit падает (docs:api, lint-staged, eslint, prettier) — фиксим (`npm run lint:fix`, `npm run format` или вручную), `git add .`, повторяем коммит
