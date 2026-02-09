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
