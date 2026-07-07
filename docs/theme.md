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
  --radius-md: 0.875rem;
  --spacing-4: 1.125rem;
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

## UiVariant tokens

Для каждого варианта доступны токены:

```css
:root {
  --variant-primary-bg: #14c9d6;
  --variant-primary-hover: #18d1de;
  --variant-primary-active: #0faeb9;
  --variant-primary-border: rgba(20, 201, 214, 0.72);
  --variant-primary-text: #06201c;
  --variant-primary-accent: var(--variant-primary-bg);
  --variant-primary-soft: rgba(20, 201, 214, 0.18);
  --variant-primary-disabled-bg: var(--variant-disabled-bg);
  --variant-primary-disabled-border: var(--variant-disabled-border);
  --variant-primary-disabled-text: var(--variant-disabled-text);
}
```

Та же схема есть для `default`, `primary`, `secondary`, `info`, `success`, `warning`, `danger`, `dark`, `light`, `neutral`.

`default` и `neutral` — разные варианты. `default` используется для обычного UI-состояния компонента, а `neutral` — для явного нейтрального/status-варианта в общей палитре.

## Radius and Units

Базовые размеры, отступы, font-size и radius задаются в `rem`, чтобы интерфейс корректно масштабировался вместе с настройками шрифта пользователя. Hairline-границы (`1px`, `2px`) остаются в `px`: так они предсказуемее выглядят на разных масштабах и плотностях экрана.

Основные radius-токены:

```css
:root {
  --radius-default: 0.25rem;
  --radius-pill: 50rem;
  --radius-circle: 50%;

  --btn-border-radius: var(--radius-default);
  --badge-border-radius: var(--radius-default);
  --card-border-radius: var(--radius-default);
  --input-border-radius: var(--radius-default);
}
```

Компоненты используют собственные `*-border-radius` переменные с fallback на базовые radius-токены. Для project-level кастомизации достаточно переопределить нужную component variable.
