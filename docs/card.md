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
    <Card.Toolbar.Button label="Обзор" />
    <Card.Toolbar.Button label="Метрики" />
    <Card.Toolbar.Button label="Логи" />
  </Card.Toolbar.Group>

  <Card.Toolbar.Group attached>
    <Card.Toolbar.Button icon={<SaveIcon />} label="Сохранить" />
    <Card.Toolbar.Button icon={<RefreshIcon />} label="Обновить" />
  </Card.Toolbar.Group>

  <Card.Toolbar.Group>
    <Card.Toolbar.Button aria-label="Настройки" icon={<SettingsIcon />} />
  </Card.Toolbar.Group>
</Card.Toolbar>
```

`Card.Toolbar.Button` принимает `icon` и/или `label` (минимум одно из них обязательно).
Если переданы оба, контент рендерится через отдельные icon/label слоты. На средних экранах текстовая часть скрывается.
`Card.Toolbar.Group attached` склеивает соседние кнопки в одну группу; без `attached` группы остаются разделёнными gap и toolbar-разделителями.
`Card.Toolbar` по умолчанию рисует вертикальные разделители между группами; если они не нужны, передайте `dividers={false}`.

`Card.Toolbar align="left" | "right" | "between"` задает общее выравнивание прямых групп. Если нужно разнести несколько зон независимо, используйте `Card.Toolbar.Section`:

```tsx
<Card.Toolbar>
  <Card.Toolbar.Section align="left">
    <Card.Toolbar.Group attached>
      <Card.Toolbar.Button label="Все" />
      <Card.Toolbar.Button label="Активные" />
    </Card.Toolbar.Group>
  </Card.Toolbar.Section>

  <Card.Toolbar.Section align="center">
    <Card.Toolbar.Group attached>
      <Card.Toolbar.Button label="День" />
      <Card.Toolbar.Button label="Неделя" />
    </Card.Toolbar.Group>
  </Card.Toolbar.Section>

  <Card.Toolbar.Section align="right">
    <Card.Toolbar.Group>
      <Button.Split
        variant="primary"
        main={{ label: 'Импорт', onClick: handleImport }}
        menu={{ ariaLabel: 'Действия импорта', items }}
      />
    </Card.Toolbar.Group>
  </Card.Toolbar.Section>
</Card.Toolbar>
```

`Button.Split` можно размещать внутри `Card.Toolbar.Group`; toolbar выставит ему ту же высоту, размер и attached-геометрию, что и обычным toolbar-кнопкам.

Если передан `icon` без `label`, кнопка становится стабильным square-контролом. Для таких кнопок указывайте `aria-label`.

Размер toolbar-кнопки по умолчанию — `md`. Его можно переопределить через `size="sm" | "md" | "lg"`;
высота, горизонтальный padding и размер icon-only слота берутся из `--card-toolbar-button-*` токенов.

Основной polymorphic prop для `Card.Toolbar.Button` — `as`.
Для ссылок используйте `as`. Это работает и с native `<a>`, и с внешними link-компонентами:

```tsx
import { Link } from '@inertiajs/react';

<Card.Toolbar.Button
  as="a"
  href="/reports.csv"
  download
  icon={<DownloadIcon />}
  label="Скачать"
/>

<Card.Toolbar.Button
  as={Link}
  href="/reports"
  icon={<ReportIcon />}
  label="Отчеты"
/>

<Card.Toolbar.Button
  as={Link}
  href="/reports/export"
  method="post"
  preserveScroll
  icon={<ExportIcon />}
  label="Экспорт"
/>

<Card.Toolbar.Button
  as={Link}
  href="/reports/export"
  disabled
  icon={<ExportIcon />}
  label="Экспорт"
/>
```

Если нужно передать Inertia `Link` собственный `as="button"`, используйте adapter:

```tsx
const InertiaToolbarButtonLink = (props) => (
  <Link as="button" {...props} />
);

<Card.Toolbar.Button
  as={InertiaToolbarButtonLink}
  href="/reports/export"
  method="post"
  icon={<ExportIcon />}
  label="Экспорт"
/>
```

Для link-рендера `disabled` добавляет `aria-disabled`, убирает ссылку из tab order и блокирует click handler.

Скрытие текста включено по умолчанию (`md`) и настраивается:
- на уровне `Card.Toolbar`: `buttonHideLabelOn="md" | "never"`
- на уровне конкретной кнопки: `hideLabelOn="md" | "never"` (переопределяет тулбар)
