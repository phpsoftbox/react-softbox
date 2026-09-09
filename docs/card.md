# Card

`Card` — базовый контейнер для секций.

```tsx
<Card>
  <Card.Header divider title="Заголовок">
    <Card.Header.Content />
    <Card.Header.Aside><Button appearance="ghost">...</Button></Card.Header.Aside>
  </Card.Header>
  <Card.Body>Контент</Card.Body>
  <Card.Footer divider>
    <Button appearance="ghost">Отмена</Button>
    <Button>Сохранить</Button>
  </Card.Footer>
</Card>
```

`Card.Header` умеет принимать:

- `divider` — разделитель снизу на всю внутреннюю ширину карточки (по умолчанию `false`)
- `title` и `subtitle`
- `icon` — общая иконка слева от блока заголовка и подзаголовка
- `titleAs` и `subtitleAs` для управления тегами заголовка/подзаголовка
- `children` для явной композиции слотов или собственной сетки

`Card.Footer` принимает `divider` для разделителя сверху (по умолчанию `false`). Разделители независимы; у `Card.Body` их нет. Линию рисует секция, поэтому padding заголовка или содержимого не укорачивает её.

### Иконка заголовка

```tsx
<Card.Header
  icon={<TruckIcon />}
  title="Параметры сдачи"
  subtitle="Укажите, куда и как будет передана поставка"
/>

<Card.Header icon={<TruckIcon />}>
  <Card.Header.Icon />
  <Card.Header.Content>
    <Card.Header.Title>Параметры сдачи</Card.Header.Title>
    <Card.Header.Subtitle>Укажите, куда и как будет передана поставка</Card.Header.Subtitle>
  </Card.Header.Content>
  <Card.Header.Aside><Button>Создать</Button></Card.Header.Aside>
</Card.Header>
```

Иконка выравнивается по вертикальному центру всего текстового блока, включая многострочный subtitle, и не сжимается. Без subtitle она центрируется относительно title. `Card.Header.Aside` центрируется по вертикали в той же строке; на экранах до 720px переходит в отдельную строку справа.

`Card.Header.Icon` без `children` читает `icon` ближайшего Header. Переданные `children` заменяют иконку; явный `null` или `false` скрывает слот. Компонент работает и внутри вложенного Grid. Без `children` Header автоматически рендерит Icon и Content. При переданных `children` Header рендерит именно вашу композицию: автоматическая иконка не добавляется, поэтому явный Icon не дублируется.

`Card.Header.Content` без `children` выводит `title`/`subtitle` из Header с учётом `titleAs`/`subtitleAs`. Переданные `children` заменяют этот текст. Icon, Content и Aside принимают `className`, `style` и HTML/ARIA-атрибуты.

`icon` принимает ReactNode; SVG и изображения подстраиваются под размер слота. Настройки через CSS-переменные на Header или Card: `--card-header-icon-size` (по умолчанию `32px`), `--card-header-icon-gap` (по умолчанию `var(--spacing-4)`), `--card-header-icon-color` (по умолчанию `currentColor`). Например, `style={{ '--card-header-icon-color': '#ff6b00' } as React.CSSProperties}` задаёт оранжевый цвет для SVG с `stroke="currentColor"` или `fill="currentColor"`.

Иконка декоративная (`aria-hidden`), поэтому смысл заголовка или статус должны быть переданы текстом. Без `icon` слот и дополнительный отступ не создаются.

## Отступы секций и переход с прежней разметки

Это новый общий контракт Card без отдельного режима совместимости. Корневой `Card` отвечает за фон, рамку и скругление; его `padding` и `gap` равны нулю. `Card.Header`, `Card.Body` и `Card.Footer` имеют собственные отступы `var(--spacing-7)` по обеим осям. Внутренние gap секций сохраняются. Вертикальные padding соседних секций складываются, поэтому плотность карточек изменится.

Общие отступы секций можно настроить на Card через CSS-переменные (также работают на отдельных секциях):

```tsx
<Card style={{ '--card-padding-x': '24px', '--card-padding-y': '16px' } as React.CSSProperties}>
  <Card.Header title="Настройки" divider />
  <Card.Body>Содержимое</Card.Body>
  <Card.Footer divider>Действия</Card.Footer>
</Card>
```

При обновлении проектов:

- Оберните контент, который раньше получал отступы непосредственно от Card, в `Card.Body`. Содержимое без обёртки теперь занимает всю внутреннюю ширину.
- Перенесите `padding`/`p-*` с Card на нужную секцию или используйте `--card-padding-x`/`--card-padding-y`, чтобы избежать двойных отступов.
- Удалите отрицательные margin и расширение ширины Header/Footer, компенсировавшие старый padding Card. Используйте `divider` вместо самодельной линии.
- Замените удалённый `right={actions}` на `<Card.Header.Aside>{actions}</Card.Header.Aside>`. В явной композиции добавьте `<Card.Header.Content />` для вывода пропсов title/subtitle и `<Card.Header.Icon />` для иконки из пропса. Дочерние Title и Subtitle объединяйте в Content, чтобы они занимали одну колонку.
- Для таблиц и другого контента на всю ширину используйте `<Card.Body style={{ padding: 0 }}>…</Card.Body>`.
- `Card.Toolbar`, расположенный непосредственно в Card, сохраняет рамку и по умолчанию получает внешние отступы по тем же переменным. `inset={false}` отключает эти отступы. Toolbar внутри Body и самостоятельный Toolbar сохраняют собственные компактные отступы. Общий gap корневого Card больше не разделяет произвольные дочерние элементы.

Корень Card не обрезает overflow: выпадающие меню и другие выступающие элементы остаются видимыми. Крайние Header/Body/Footer наследуют соответствующие скругления карточки.

Также доступны подкомпоненты:

```tsx
<Card.Header>
  <Card.Header.Content>
    <Card.Header.Title>Заголовок</Card.Header.Title>
    <Card.Header.Subtitle>Подзаголовок</Card.Header.Subtitle>
  </Card.Header.Content>
  <Card.Header.Aside><Button appearance="ghost">...</Button></Card.Header.Aside>
</Card.Header>
```

`Card.Header.Title` и `Card.Header.Subtitle` поддерживают `as` с любым `React.ElementType` (включая кастомный компонент).

### Собственная сетка Header

Header использует CSS Grid для прямых слотов. Произвольная обёртка внутри Header занимает всю его ширину, поэтому можно вложить существующий `Grid` и полностью управлять колонками:

```tsx
<Card.Header icon={<TruckIcon />} title="Параметры сдачи" subtitle="Укажите место передачи">
  <Grid gap="16px" style={{ gridTemplateColumns: 'auto minmax(0, 1fr) auto', alignItems: 'center' }}>
    <Card.Header.Icon />
    <Card.Header.Content />
    <Card.Header.Aside><Button>Создать</Button></Card.Header.Aside>
  </Grid>
</Card.Header>
```

В собственной сетке размеры колонок, расстояния и адаптивность задаёт Grid/ваш CSS. Для обычной сетки с долями доступны `Grid columns={12}` и классы `col-span-*`; отдельный Col для Header не требуется.

## Toolbar

`inset` (по умолчанию `true`) включает внешние отступы от Card, заданные `--card-padding-x` и `--card-padding-y`. Для Toolbar на всю внутреннюю ширину карточки передайте `inset={false}`:

```tsx
<Card>
  <Card.Header title="Отчёты" />
  <Card.Toolbar inset={false}>
    <Card.Toolbar.Button label="Обновить" />
  </Card.Toolbar>
  <Card.Body>Контент</Card.Body>
</Card>
```

Пропс влияет только на Toolbar, расположенный непосредственно в Card. Внутренние padding, рамка и скругление Toolbar сохраняются. Внутри `Card.Body` отступы задаёт сам Body; `inset` их не отменяет и не добавляет вторые.

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
