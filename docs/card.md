# Card

`Card` — базовый контейнер для секций.

```tsx
<Card>
  <Card.Header title="Заголовок" right={<Button appearance="ghost">...</Button>} />
  <Card.Body>Контент</Card.Body>
  <Card.Footer>
    <Button appearance="ghost">Отмена</Button>
    <Button>Сохранить</Button>
  </Card.Footer>
</Card>
```

`Card.Header` умеет принимать:
- `title` и `subtitle`
- `titleAs` и `subtitleAs` для управления тегами заголовка/подзаголовка
- `right` для иконок/кнопок
- `children` для полного кастомного содержимого

Также доступны подкомпоненты:

```tsx
<Card.Header right={<Button appearance="ghost">...</Button>}>
  <Card.Header.Title>Заголовок</Card.Header.Title>
  <Card.Header.Subtitle>Подзаголовок</Card.Header.Subtitle>
</Card.Header>
```

`Card.Header.Title` и `Card.Header.Subtitle` поддерживают `as` с любым `React.ElementType` (включая кастомный компонент).

## Toolbar

```tsx
<Card.Toolbar>
  <Card.Toolbar.Group attached>
    <Card.Toolbar.Button icon={<SaveIcon />} label="Сохранить" />
    <Card.Toolbar.Button icon={<RefreshIcon />} />
  </Card.Toolbar.Group>
</Card.Toolbar>
```

`Card.Toolbar.Button` принимает `icon` и/или `label` (минимум одно из них обязательно).
Если переданы оба, внутри кнопки появится вертикальный разделитель. На средних экранах текстовая часть скрывается.
`Card.Toolbar.Group attached` склеивает соседние кнопки в одну группу; без `attached` группы остаются разделёнными gap и toolbar-разделителями.

Для ссылок используйте `component`. Это работает и с native `<a>`, и с внешними link-компонентами:

```tsx
import { Link } from '@inertiajs/react';

<Card.Toolbar.Button
  component={Link}
  href="/reports/export"
  method="post"
  preserveScroll
  as="button"
  icon={<ExportIcon />}
  label="Экспорт"
/>
```

`component`, а не `as`, используется намеренно: у Inertia `Link` есть собственный проп `as`, и его нужно передавать дальше без конфликта.

Скрытие текста включено по умолчанию (`md`) и настраивается:
- на уровне `Card.Toolbar`: `buttonHideLabelOn="md" | "never"`
- на уровне конкретной кнопки: `hideLabelOn="md" | "never"` (переопределяет тулбар)
