# Navigation

## Menu

`Menu` — единый компонент для вертикальных и горизонтальных меню.

```tsx
const items = [
  { label: 'Главная', href: '/' },
  { label: 'Документы', href: '/docs' },
  { divider: true },
  { label: 'Настройки', href: '/settings' },
];

<Menu items={items} />
<Menu items={items} orientation="horizontal" />
```

### Кастомный компонент ссылок

По умолчанию используется `<a href>`. Если нужен `Link` (например, из Inertia/Next/React Router),
передайте его через `as` или укажите `as` у конкретного пункта.

```tsx
import { Link } from '@inertiajs/react';

<Menu items={items} as={Link} />

const customItems = [
  { label: 'Главная', href: '/', as: Link },
  { label: 'Документы', href: '/docs' },
];
```

### Collapsible (vertical)

```tsx
const groups = [
  {
    label: 'Сервисы',
    open: true,
    children: [{ label: 'Database' }, { label: 'Cache' }],
  },
];

<Menu items={groups} />
```

### Dropdown (horizontal)

```tsx
const topMenu = [
  { label: 'Главная', href: '/' },
  { label: 'Команда', children: [{ label: 'Участники' }, { label: 'Роли' }] },
];

<Menu items={topMenu} orientation="horizontal" />
```

В `MenuItem` можно указать `align: 'left' | 'right'` для выравнивания dropdown‑меню.

## Dropdown

Отдельный dropdown‑компонент, если нужен произвольный триггер.

```tsx
<Dropdown trigger={<span>Открыть</span>} orientation="vertical" align="left">
  <Dropdown.Header>Профиль</Dropdown.Header>
  <Dropdown.Item>Настройки</Dropdown.Item>
  <Dropdown.Separator />
  <Dropdown.Item href="/logout">Выход</Dropdown.Item>
</Dropdown>
```

Для ширины dropdown используйте `Dropdown.Nav`:

```tsx
<Dropdown
  trigger={<Button appearance="outline">Профиль</Button>}
  align="right"
>
  <Dropdown.Nav className="dropdownWide">
    <Dropdown.Header className="f-6">Профиль</Dropdown.Header>
    <Dropdown.Item static>Строка без кнопки</Dropdown.Item>
  </Dropdown.Nav>
</Dropdown>
```

Если нужен не кликабельный текст внутри списка, используйте `Dropdown.Item` с `static`.

```tsx
<Dropdown trigger={<span>Открыть</span>}>
  <Dropdown.Header>Уведомления</Dropdown.Header>
  <Dropdown.Item static>Пока пусто</Dropdown.Item>
</Dropdown>
```

## CollapseButton

Универсальная кнопка для коллапса/бургер‑меню.

```tsx
<CollapseButton targetId="filters-panel" open={open} onClick={() => setOpen((v) => !v)}>
  Фильтры
</CollapseButton>
```

Варианты: `burger` или `chevron`.
