# Pagination

`Pagination` — компонент навигации по страницам, совместимый с `links/meta` из бекенд‑пагинатора.

## Базовое использование

```tsx
const pagination = {
  links: {
    first: 'https://api.local/users?page=1',
    last: 'https://api.local/users?page=5',
    prev: null,
    next: 'https://api.local/users?page=2',
  },
  meta: {
    current_page: 1,
    last_page: 5,
    per_page: 15,
    total: 70,
    from: 1,
    to: 15,
    path: 'https://api.local/users',
  },
};

<Pagination meta={pagination.meta} links={pagination.links} />
```

## Inertia Link

Для клиентской навигации можно передать компонент ссылки через `as`. Он будет
использован для всех ссылок пагинации:

```tsx
import { Link } from '@inertiajs/react';

<Pagination
  as={Link}
  meta={pagination.meta}
  links={pagination.links}
/>;
```

## Управление навигацией вручную

Если нужен полный контроль над переходом, используйте `onNavigate`.

```tsx
<Pagination
  meta={pagination.meta}
  links={pagination.links}
  onNavigate={(page, url) => {
    // Можно отправить запрос или обновить состояние
    console.log(page, url);
  }}
/>;
```

## Полезные параметры

- `window` — количество страниц вокруг текущей.
- `showEdges` — показывать первую/последнюю страницу.
- `showInfo` — показывать текст `from–to из total`.
- `pageParam` — имя query‑параметра, по умолчанию `page`.
- `buildUrl` — собственный способ собрать URL.
- `as` — компонент, которым рендерятся ссылки (например, Inertia `Link`).
