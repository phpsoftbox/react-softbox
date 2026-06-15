# Table

`Table` — табличный компонент с декларативными колонками, сортировкой и футером.

## Базовый пример

```tsx
const columns = [
  { id: 'name', header: 'Название', accessor: 'name' },
  { id: 'status', header: 'Статус', accessor: 'status' },
  { id: 'amount', header: 'Сумма', accessor: (row) => `${row.amount} ₽`, align: 'right' },
];

<Table columns={columns} data={rows} />;
```

## Колонки из бэкенда

```tsx
const backendColumns = [
  { id: 'client', title: 'Клиент', field: 'client', sortable: true },
  { id: 'project', title: 'Проект', field: 'project' },
  { id: 'amount', title: 'Сумма', field: 'amount', sortable: true, align: 'right' },
];

<Table columns={backendColumns} data={rows} />;
```

`header`, `label`, `title`, `field` используются по цепочке как заголовок. `accessor` может быть ключом или функцией.

## Сортировка с обновлением query‑параметров

```tsx
const [sort, setSort] = useState({ key: 'amount', direction: 'asc' });

<Table
  columns={[
    { id: 'client', header: 'Клиент', accessor: 'client', sortable: true },
    { id: 'amount', header: 'Сумма', accessor: 'amount', sortable: true, align: 'right' },
  ]}
  data={rows}
  sort={{
    key: sort.key,
    direction: sort.direction,
    param: 'sort',
    orderParam: 'order',
    onChange: (next, url) => {
      setSort(next);
      window.history.replaceState(null, '', url);
    },
  }}
/>;
```

## Футер

```tsx
const columns = [
  { id: 'name', header: 'Товар', accessor: 'name', footer: 'Итого' },
  {
    id: 'amount',
    header: 'Сумма',
    accessor: 'amount',
    align: 'right',
    footer: (rows) => rows.reduce((sum, row) => sum + row.amount, 0),
  },
];

<Table columns={columns} data={rows} showFooter />;
```

### Футер только в нужных колонках

```tsx
const columns = [
  { id: 'a', header: 'A', accessor: 'a' },
  { id: 'b', header: 'B', accessor: 'b' },
  { id: 'c', header: 'C', accessor: 'c' },
  { id: 'd', header: 'D', accessor: 'd', footer: 'Итого' },
  { id: 'e', header: 'E', accessor: 'e', footer: (rows) => rows.reduce((sum, row) => sum + row.e, 0) },
];

<Table columns={columns} data={rows} showFooter />;
```

## Выбор строк + renderBulkAction

```tsx
const [selected, setSelected] = useState<React.Key[]>([]);

<Table
  columns={columns}
  data={rows}
  selection={{
    selectedIds: selected,
    onToggle: (id) => setSelected((prev) => prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id]),
    onToggleAll: (ids) => setSelected((prev) => ids.length > 0 && ids.every((id) => prev.includes(id)) ? [] : ids),
  }}
  renderBulkAction={(ids) => (
    <div>
      Выбрано: {ids.length}
    </div>
  )}
/>;
```

## Bulk actions

```tsx
<Table
  columns={columns}
  data={rows}
  selection={{
    selectedIds: selected,
    onToggle: (id) => setSelected((prev) => prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id]),
  }}
  bulkActions={{
    selectedIds: selected,
    actions: [
      { id: 'remove', label: 'Удалить', onClick: (ids) => console.log(ids), variant: 'danger' },
      { id: 'restore', label: 'Восстановить', onClick: (ids) => console.log(ids), icon: '+' },
    ],
    disabled: false,
    placement: 'both',
  }}
/>;
```

По умолчанию `placement` = `both`.

Чтобы продублировать чекбокс выбора всех строк в `tfoot`, передайте `selection.showFooterToggle: true`.

## Полезные поля колонки

- `field` / `accessor` / `cell` — источник данных
- `sortable`, `sortKey` — сортировка для колонки
- `footer` — значение в футере (node или функция)
- `hideOn` — скрыть колонку на `sm`/`md`/`lg`
- `width` / `minWidth` — размеры колонки
- `align` — `left` | `center` | `right`
