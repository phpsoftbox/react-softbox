# ReactSoftBox · Документация

ReactSoftBox — набор базовых компонентов для админ‑панели. Все стили построены на CSS‑модулях и общих токенах из `foundations/`.

## Структура

- `foundations/` — токены, типографика, layout‑переменные
- `components/` — UI‑компоненты
- `docs/` — документация по компонентам

## Принципы

- Все компоненты самодостаточны и не зависят от глобальных CSS.
- Адаптив — через `Grid`/`Row` и CSS‑модули компонентов.
- Состояния (hover, focus, disabled) задаются внутри компонента.

## Быстрый старт

```ts
import '@phpsoftbox/react-softbox/foundations/index.css';
```

```ts
import { Button, Card, Menu } from '@phpsoftbox/react-softbox';
```

## Разделы

- `layout.md` — Grid, Flex, утилиты
- `navigation.md` — Menu, Dropdown, CollapseButton
- `forms.md` — Input (Field/Select/FloatLabel), Switch, Radio, Checkbox, FileUploader
- `table.md` — Table, сортировка, футер
- `tooltip.md` — Tooltip и варианты
- `overlays.md` — Modal, Drawer
- `feedback.md` — Badge, Alert, Notifier
- `card.md` — Card и его секции
- `typography.md` — Тексты и заголовки
- `media.md` — Image и медиа‑элементы
- `theme.md` — Темы и режимы
- `pagination.md` — Pagination и управление ссылками
- `tabs.md` — Tabs (горизонтальные и вертикальные)
- `progress.md` — Progress и его варианты
- `breadcrumbs.md` — Breadcrumbs и разделители
