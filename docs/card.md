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
- Выбирайте `Card.Toolbar inset` для отдельной панели в рамке с внешними отступами Card, а `inset={false}` — для полноширинной полосы с контентом на одной линии с Header/Body. `dividerTop`/`dividerBottom` по умолчанию равны `inset`, явные значения переопределяют каждую границу независимо. Общий gap корневого Card больше не разделяет произвольные дочерние элементы.

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

При размещении Toolbar непосредственно в Card:

- `inset={true}` (по умолчанию) — отдельная панель со скруглённой рамкой. Внешние отступы берутся из `--card-padding-x`/`--card-padding-y`: боковые края рамки начинаются там же, где контент Header/Body. Внутри рамки остаётся компактный padding Toolbar (`--spacing-2` по вертикали, `--spacing-3` по горизонтали; до 720px — `--spacing-2` по обеим осям).
- `inset={false}` — полоса на всю внутреннюю ширину Card, без внешних отступов, боковых границ и скруглений. Боковой padding контента равен `--card-padding-x`, как у Header/Body, в том числе на мобильных экранах. По вертикали остаётся компактный `--spacing-2`. Группы без divider не добавляют боковой padding, поэтому кнопки внутри Group/Grid/Row также сохраняют выравнивание.

`dividerTop` и `dividerBottom` независимо управляют верхней и нижней границами Toolbar. По умолчанию оба равны `inset`: панель имеет замкнутую рамку, полоса — без линий. Явный `false` убирает соответствующую границу панели, явный `true` добавляет линию полосе. Боковые разделители задаются отдельно на Group.

```tsx
<Card>
  <Card.Header title="Отчёты" />
  <Card.Toolbar inset={false} dividerTop dividerBottom>
    <Card.Toolbar.Button label="Обновить" />
  </Card.Toolbar>
  <Card.Body>Контент</Card.Body>
</Card>
```

Чтобы получить полноширинную полосу, размещайте Toolbar непосредственно в Card. Внутри `Card.Body` отступы задаёт сам Body: Toolbar не выходит за них и сохраняет компактный внутренний padding, без добавления внешних отступов Card. Самостоятельный Toolbar также сохраняет компактный padding. Рамка и разделители доступны при любом размещении. Радиус панели задаётся `--card-toolbar-border-radius` и не наследует углы Card, даже если Toolbar — первая или последняя секция. При `inset={false}` углы всегда прямые. Если соседний Header/Footer уже рисует линию на общем стыке, включайте разделитель только с одной стороны, чтобы не удваивать его толщину.

```tsx
<Card.Toolbar>
  <Card.Toolbar.Row>
    <Card.Toolbar.Group attached>
      <Card.Toolbar.Button label="Обзор" />
      <Card.Toolbar.Button label="Метрики" />
      <Card.Toolbar.Button label="Логи" />
    </Card.Toolbar.Group>

    <Card.Toolbar.Group attached divider="left">
      <Card.Toolbar.Button icon={<SaveIcon />} label="Сохранить" />
      <Card.Toolbar.Button icon={<RefreshIcon />} label="Обновить" />
    </Card.Toolbar.Group>

    <Card.Toolbar.Group divider="left">
      <Card.Toolbar.Button aria-label="Настройки" icon={<SettingsIcon />} />
    </Card.Toolbar.Group>
  </Card.Toolbar.Row>
</Card.Toolbar>
```

`Card.Toolbar.Button` принимает `icon` и/или `label` (минимум одно из них обязательно).
Если переданы оба, контент рендерится через отдельные icon/label слоты. На средних экранах текстовая часть скрывается.

### Группы и боковые разделители

`Card.Toolbar.Group attached` склеивает соседние кнопки; без `attached` между кнопками остаётся gap. Содержимым Group могут быть не только кнопки, но и текст, поля или другие элементы.

`divider="none" | "left" | "right" | "both"` задаёт боковые линии конкретной группы, по умолчанию `none`. Линии занимают высоту группы, а отступ от линии до контента задаётся `--card-toolbar-group-divider-gap` (по умолчанию `--spacing-2`). Проп совместим с `attached` и не зависит от выравнивания, вложенности или положения группы в строке. Left/right обозначают физические стороны.

Для одинаковых расстояний по обе стороны линии между соседними группами используйте `Card.Toolbar.Row`: он согласует gap с отступами Group по умолчанию. Обычный Row остаётся универсальным: например, его gap 16px и padding группы 8px дадут асимметрию. В Grid с растянутыми колонками свободное место в колонке также влияет на расстояние до контента; для плотного ряда групп используйте Row.

Group требует предка Card.Toolbar, но между ними могут находиться Grid, Row и пользовательские компоненты. Без Toolbar компонент выдаёт понятную ошибку. Текст и отдельные кнопки не обязательно оборачивать в Group.

При переносе явно заданные боковые линии сохраняются. Автоматических разделителей между группами и строками нет. Для адаптивного изменения линий используйте класс/style группы; не задавайте одновременно right и left у соседних групп, если нужна одна общая линия.

Для колонок используйте Grid, для ряда с переносами — `Card.Toolbar.Row`. Toolbar не добавляет обёрток и не управляет шириной колонок.

```tsx
<Card.Toolbar inset={false} dividerBottom>
  <Grid columns={2} columnsSm={1} gap="16px">
    <Card.Toolbar.Group>
      <Text>Всего записей: 5</Text>
    </Card.Toolbar.Group>
    <Card.Toolbar.Group divider="left" style={{ justifyContent: 'flex-end' }}>
      <Card.Toolbar.Button label="Экспорт" />
      <Card.Toolbar.Button label="Добавить" />
    </Card.Toolbar.Group>
  </Grid>
</Card.Toolbar>
```

Для разнесения по краям без разделителя:

```tsx
<Card.Toolbar inset={false}>
  <Card.Toolbar.Row justify="space-between">
    <Text>Всего записей: 5</Text>
    <Card.Toolbar.Group>
      <Card.Toolbar.Button label="Экспорт" />
      <Card.Toolbar.Button label="Добавить" />
    </Card.Toolbar.Group>
  </Card.Toolbar.Row>
</Card.Toolbar>
```

Для трёх зон с геометрически центрированной средней колонкой задайте Grid `grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr)`. На узком экране переключайте колонки через CSS media query. Готовые примеры есть в playground.

### Toolbar.Row

Обёртка над обычным Row без дополнительных DOM-элементов. По умолчанию `gap="var(--card-toolbar-group-divider-gap, var(--spacing-2))"`, `wrap="wrap"`, `align="center"`, `justify="flex-start"`.

Принимает все пропсы Row, включая числовой или строковый gap, className, style и HTML/ARIA-атрибуты; экспортируется тип `CardToolbarRowProps`. Любой параметр можно переопределить. Явный gap меняет только расстояние между группами. Чтобы одновременно изменить gap и отступы до линий, задайте `--card-toolbar-group-divider-gap` на Toolbar или Toolbar.Row. Пропы и значения по умолчанию универсального Row не изменены.

### Переход со старого Toolbar

- Удалены `align`, `dividers`, `Card.Toolbar.Section` и типы `CardToolbarSectionAlign`/`CardToolbarSectionProps`.
- Вместо `align="between"` используйте `Card.Toolbar.Row justify="space-between"`; вместо left/right — `justify="flex-start"`/`"flex-end"`.
- Вместо Section используйте колонки Grid. Grid/Row — непосредственные дети Toolbar, без служебных обёрток.
- Несколько соседних групп оберните в `Card.Toolbar.Row` с готовыми настройками gap/wrap либо в обычный Row с явными параметрами. Toolbar теперь отвечает только за оформление контейнера.
- Вместо общего `dividers` назначайте нужным группам `divider`. По умолчанию линий нет, включая раскладку space-between.
- Удалите стили для старых `data-toolbar-row-*`/`data-card-toolbar-item`: измерения строк, автоматические псевдоэлементы и ResizeObserver больше не используются.

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

## Проверка раскладки в браузере

При установленном Playwright с Chromium запустите playground (`yarn --cwd playground dev`), затем из корня репозитория:

```sh
node playground/tests/card-toolbar.browser.mjs http://127.0.0.1:5174
```

Скрипт проверяет ширину Grid, все варианты Group.divider, выравнивание inset-режимов и отсутствие автоматической линии в space-between на экранах 1440, 900 и 375px. Для существующей установки можно передать путь к модулю Playwright через `PLAYWRIGHT_MODULE`, а к браузеру — через `BROWSER_PATH`.
