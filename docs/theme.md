# Theme

ReactSoftBox поддерживает светлую, темную и системную темы, а также режим `auto` (днем светлая, вечером темная).

## Быстрый старт

```ts
import { initTheme } from '@phpsoftbox/react-softbox';

initTheme({ defaultMode: 'system' });
```

## Смена темы

```ts
import { setThemeMode } from '@phpsoftbox/react-softbox';

setThemeMode('light');
setThemeMode('dark');
setThemeMode('system');
setThemeMode('auto');
```

## Настройка auto‑режима

```ts
setThemeMode('auto', {
  autoStartHour: 7,  // с 07:00 светлая
  autoEndHour: 19,   // с 19:00 темная
});
```

## Хранение выбора

По умолчанию режим сохраняется в `localStorage` по ключу `psb-theme-mode`.
Можно переопределить:

```ts
initTheme({ storageKey: 'my-app-theme' });
setThemeMode('dark', { storageKey: 'my-app-theme' });
```

## CSS‑переключение без JS

Если нужно вручную переключать тему без JS, можно выставить атрибут:

```html
<html data-theme="light"></html>
```

## Кастомизация тем

Все цвета и размеры задаются через CSS‑переменные в `tokens.css`.
Можно переопределить их в своем CSS:

```css
:root {
  --color-text: #0b1626;
  --surface-panel: rgba(255, 255, 255, 0.98);
  --radius-md: 14px;
  --spacing-4: 18px;
}

:root[data-theme="light"] {
  --color-text: #0b1626;
  --surface-panel: rgba(255, 255, 255, 0.98);
}

:root[data-theme="dark"] {
  --color-text: #e6f0ff;
  --surface-panel: rgba(12, 24, 42, 0.98);
}
```

Рекомендуемый подход:
1. Скопировать нужные переменные из `packages-js/ReactSoftBox/src/foundations/tokens.css`.
2. Переопределить только отличающиеся значения в своём CSS (до инициализации темы).
