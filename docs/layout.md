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

## Утилитарные отступы

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

## Классы кнопок

Глобальные классы для кнопок, которые можно применять к `a`/`button`.

```tsx
<a className="btn btn-primary btn-solid" href="/create">Создать</a>
<a className="btn btn-info btn-outline" href="/details">Подробнее</a>
<button className="btn btn-danger btn-ghost">Удалить</button>
```

Доступны:
- базовый класс: `btn`
- варианты: `btn-default`, `btn-primary`, `btn-info`, `btn-success`, `btn-warning`, `btn-danger`
- внешность: `btn-solid`, `btn-outline`, `btn-ghost`
- размеры: `btn-sm`, `btn-md`, `btn-lg`
