# Layout

## Grid

`Grid` — базовая сетка с CSS‑переменными. На брейкпоинтах можно менять колонки.

```tsx
<Grid columns={12} columnsLg={8} columnsMd={4} columnsSm={1} gap="16px">
  <div>One</div>
  <div>Two</div>
</Grid>
```

Параметры:
- `columns` — количество колонок
- `columnsLg`, `columnsMd`, `columnsSm` — колонки на 1280/1024/720px
- `gap` — расстояние между колонками
- `minWidth` — минимальная ширина колонки

## Row / Stack

`Row` — горизонтальный flex, `Stack` — вертикальный flex.

```tsx
<Row gap="12px" wrap="wrap">
  <div>A</div>
  <div>B</div>
</Row>

<Stack gap="12px">
  <div>Item</div>
  <div>Item</div>
</Stack>
```

Параметры:
- `gap` — шаг между элементами
- `align`, `justify` — соответствуют flex‑свойствам
- `wrap` — управление переносом для `Row`

## Collapse

`Collapse` — анимированное сворачивание контента. Обычно используется вместе с `CollapseButton`.

```tsx
const [open, setOpen] = useState(false);

<CollapseButton targetId="filters-panel" open={open} onClick={() => setOpen((v) => !v)}>
  Фильтры
</CollapseButton>

<Collapse id="filters-panel" open={open}>
  <Card>
    <Card.Body>Контент фильтров</Card.Body>
  </Card>
</Collapse>
```

## Utility helpers

Utility helpers — публичный слой поверх дизайн-токенов. Компоненты должны держать только структурный минимум, состояния и accessibility; декоративные решения вроде регистра текста, border, radius, размера текста, позиционирования и простого layout лучше добавлять через helpers в `className`.

План миграции компонентов:
1. Новые component styles не должны добавлять opinionated-оформление, если это можно выразить helper-классом.
2. Существующие компоненты упрощаются по одному: сначала убираются декоративные typography/background/border/radius правила, затем примеры переводятся на helpers.
3. Цветовые состояния компонентов должны брать палитру из `UiVariant` tokens, а не из component-specific color tokens.
4. Component-specific CSS variables оставляются только для внутренней геометрии или сложного поведения, которое нельзя удобно описать helper-классом.

Глобальные классы для отступов и gap основаны на `--spacing-1…10`.

```tsx
<div className="p-4">Внутренний отступ</div>
<div className="px-6 py-3">Отступы по осям</div>
<div className="gap-3">Gap для flex/grid контейнера</div>
```

Доступны варианты:
- `p-`, `px-`, `py-`, `pt-`, `pr-`, `pb-`, `pl-`
- `m-`, `mx-`, `my-`, `mt-`, `mr-`, `mb-`, `ml-`
- `gap-`
- zero helpers: `p-0`, `px-0`, `py-0`, `m-0`, `gap-0`

Typography и text:
- размеры: `f-1`…`f-9`
- вес: `fw-normal`, `fw-medium`, `fw-semibold`, `fw-bold`
- line-height: `lh-1`, `lh-sm`, `lh-base`, `lh-lg`
- цвет: `text-body`, `text-muted`, `text-muted-2`, `text-default`, `text-primary`, `text-secondary`, `text-info`, `text-success`, `text-warning`, `text-danger`, `text-dark`, `text-light`, `text-neutral`
- выравнивание и регистр: `text-start`, `text-center`, `text-end`, `text-uppercase`, `text-lowercase`, `text-capitalize`, `text-normalcase`
- переносы: `text-wrap`, `text-nowrap`, `text-break`, `text-truncate`, `line-clamp-1`, `line-clamp-2`, `line-clamp-3`

Background, border и radius:
- фон: `bg-surface`, `bg-surface-2`, `bg-panel`, `bg-transparent`
- solid variant background: `bg-default`, `bg-primary`, `bg-secondary`, `bg-info`, `bg-success`, `bg-warning`, `bg-danger`, `bg-dark`, `bg-light`, `bg-neutral`
- soft background: `bg-default-soft`, `bg-primary-soft`, `bg-secondary-soft`, `bg-info-soft`, `bg-success-soft`, `bg-warning-soft`, `bg-danger-soft`, `bg-dark-soft`, `bg-light-soft`, `bg-neutral-soft`
- border: `border`, `border-0`, `border-top`, `border-right`, `border-bottom`, `border-left`, `border-1`, `border-2`, `border-3`
- border color: `border-default`, `border-primary`, `border-secondary`, `border-info`, `border-success`, `border-warning`, `border-danger`, `border-dark`, `border-light`, `border-neutral`
- radius: `rounded-0`, `rounded`, `rounded-xs`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-pill`, `rounded-circle`

Display, flex, grid и position:
- display: `d-none`, `d-block`, `d-inline-block`, `d-flex`, `d-inline-flex`, `d-grid`
- flex: `flex-row`, `flex-column`, `flex-wrap`, `flex-nowrap`, `flex-1`, `flex-auto`, `flex-none`, `grow-0`, `grow-1`, `shrink-0`, `shrink-1`
- align/justify: `items-start`, `items-center`, `items-end`, `items-stretch`, `justify-start`, `justify-center`, `justify-end`, `justify-between`, `justify-around`, `justify-evenly`
- grid: `grid-cols-1`, `grid-cols-2`, `grid-cols-3`, `grid-cols-4`, `grid-cols-6`, `grid-cols-12`, `col-span-1`, `col-span-2`, `col-span-3`, `col-span-4`, `col-span-6`, `col-span-12`
- position: `position-static`, `position-relative`, `position-absolute`, `position-fixed`, `position-sticky`, `inset-0`, `top-0`, `top-100`, `right-0`, `right-100`, `bottom-0`, `bottom-100`, `left-0`, `left-100`, `translate-none`, `translate-middle`, `translate-middle-x`, `translate-middle-y`, `z-0`, `z-1`, `z-10`, `z-20`, `z-50`
- размеры/overflow/link: `w-100`, `h-100`, `size-1`…`size-10`, `min-w-0`, `overflow-hidden`, `overflow-auto`, `stretched-link`

## Классы кнопок

Глобальные классы для кнопок, которые можно применять к `a`/`button`.

```tsx
<a className="btn btn-primary btn-solid" href="/create">Создать</a>
<a className="btn btn-info btn-outline" href="/details">Подробнее</a>
<button className="btn btn-danger btn-ghost">Удалить</button>

<div className="btn-group btn-group-horizontal" role="group" aria-label="Режим просмотра">
  <button className="btn btn-neutral btn-outline">День</button>
  <button className="btn btn-neutral btn-outline">Неделя</button>
  <button className="btn btn-neutral btn-outline">Месяц</button>
</div>
```

Доступны:
- базовый класс: `btn`
- варианты: `btn-default`, `btn-primary`, `btn-secondary`, `btn-info`, `btn-success`, `btn-warning`, `btn-danger`, `btn-dark`, `btn-light`, `btn-neutral`
- внешность: `btn-solid`, `btn-outline`, `btn-ghost`
- размеры: `btn-sm`, `btn-md`, `btn-lg`
- группы: `btn-group`, `btn-group-horizontal`, `btn-group-vertical`, `btn-group-stretch`
