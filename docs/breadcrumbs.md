# Breadcrumbs

`Breadcrumbs` — цепочка навигации с поддержкой активного элемента и кастомного разделителя.

## Базовое использование

```tsx
<Breadcrumbs
  items={[
    { label: 'Главная', href: '/' },
    { label: 'Проекты', href: '/projects' },
    { label: 'Project', current: true },
  ]}
/>;
```

## Кастомный компонент ссылок

По умолчанию используется `<a href>`. Можно передать любой компонент через `as`:

```tsx
import { Link } from '@inertiajs/react';

<Breadcrumbs
  as={Link}
  items={[
    { label: 'Главная', href: '/' },
    { label: 'Проекты', href: '/projects' },
    { label: 'ReactSoftBox', current: true },
  ]}
/>
```

## Настройка разделителя

```tsx
<Breadcrumbs
  separator="/"
  items={[
    { label: 'Команда', href: '/team' },
    { label: 'Дизайн‑система', href: '/team/ui' },
    { label: 'ReactSoftBox', current: true },
  ]}
/>;
```

Если `current` явно не указан, активным считается последний элемент.

## Overflow

Длинная цепочка сворачивает средние элементы в dropdown. Триггер можно настроить как содержимым, так и полностью своим React-элементом:

```tsx
<Breadcrumbs
  overflowTrigger="Еще"
  overflowTriggerClassName="btn btn-default btn-ghost btn-sm"
  overflowDropdownClassName="breadcrumbsDropdown"
  overflowAriaLabel="Скрытые хлебные крошки"
  items={items}
/>

<Breadcrumbs
  renderOverflowTrigger={(hiddenItems) => (
    <button type="button" className="btn btn-default btn-ghost btn-sm">
      Еще {hiddenItems.length}
    </button>
  )}
  items={items}
/>
```
