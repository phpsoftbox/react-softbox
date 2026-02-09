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
