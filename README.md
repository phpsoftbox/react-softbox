# ReactSoftBox

Набор UI‑компонентов для React.

## Подключение

```ts
import '@phpsoftbox/react-softbox/foundations/index.css';
```

```ts
import {
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  CollapseButton,
  Drawer,
  Dropdown,
  FileUploader,
  FloatLabel,
  FormField,
  Grid,
  Heading,
  Image,
  Input,
  Menu,
  Modal,
  Notifier,
  Pagination,
  Progress,
  Radio,
  Row,
  Select,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  Tooltip,
} from '@phpsoftbox/react-softbox';
```

## Тема

```ts
import { initTheme, setThemeMode } from '@phpsoftbox/react-softbox';

initTheme({ defaultMode: 'system' });
setThemeMode('dark');
```

## Документация

- `docs/README.md`
- `docs/layout.md`
- `docs/navigation.md`
- `docs/forms.md`
- `docs/table.md`
- `docs/tooltip.md`
- `docs/overlays.md`
- `docs/feedback.md`
- `docs/card.md`
- `docs/typography.md`
- `docs/theme.md`
- `docs/pagination.md`
- `docs/tabs.md`
- `docs/progress.md`
- `docs/breadcrumbs.md`

## Playground

Локальная площадка для проверки компонентов:

```bash
cd packages-js/ReactSoftBox/playground
yarn install
yarn dev --host 0.0.0.0 --port 5174
```

## Сборка пакета

```bash
yarn install
yarn build
```

## Краткий обзор компонентов

### Button

```tsx
<Button variant="primary">Primary</Button>
<Button variant="info" appearance="outline">Info</Button>
<Button variant="danger" appearance="ghost">Danger</Button>
<Button variant="primary" size="sm">Small</Button>
```

### Input / FloatLabel

```tsx
<Input>
  <Input.Label>Email</Input.Label>
  <Input.Field type="email" name="email" />
</Input>

<Input>
  <Input.FloatLabel label="Password">
    <Input.Field type="password" name="password" />
  </Input.FloatLabel>
</Input>
```

### Textarea / Radio

```tsx
<Textarea placeholder="Комментарий" />
<Radio name="mode" label="Основной" />
<Checkbox label="Согласен с условиями" />
```

### Switch

```tsx
<Switch label="Автообновления" defaultChecked />
```

### Select

```tsx
<Select label="Окружение" options={[{ value: 'dev', label: 'Development' }]} />
<Select label="Сервисы" options={options} multiple searchable />
```

### Table

```tsx
const columns = [
  { id: 'name', header: 'Название', accessor: 'name' },
  { id: 'amount', header: 'Сумма', accessor: 'amount', align: 'right', sortable: true },
];

<Table columns={columns} data={rows} />;
```

```tsx
<Table
  columns={columns}
  data={rows}
  selection={{
    selectedIds,
    onToggle: (id) => setSelected((prev) => prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id]),
    onToggleAll: (ids) => setSelected((prev) => ids.length > 0 && ids.every((id) => prev.includes(id)) ? [] : ids),
  }}
  renderBulkAction={(ids) => <span>Выбрано: {ids.length}</span>}
/>;
```

### FileUploader

```tsx
<FileUploader
  allowedTypes={['.jpg', '.png', '.pdf']}
  maxFileSizeKb={2048}
  multiple
  showPreview
  onUpload={(files) => api.upload(files)}
/>;
```

### Tooltip

```tsx
<Tooltip content="Подсказка">
  <Button>Наведи</Button>
</Tooltip>
```

### Grid / Flex

```tsx
<Grid columns={12} columnsLg={8} columnsMd={4} columnsSm={1} gap="16px">
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
</Grid>

<Row gap="12px">
  <div>A</div>
  <div>B</div>
</Row>

<Stack gap="12px">
  <div>Item</div>
  <div>Item</div>
</Stack>
```

### Menu / Dropdown

```tsx
const items = [
  { label: 'Главная', href: '/', active: true },
  { label: 'Документы', href: '#' },
  { divider: true },
  { label: 'Настройки', href: '#' },
];

<Menu items={items} />
<Menu items={items} orientation="horizontal" />

<Dropdown trigger={<span>Открыть</span>} orientation="vertical">
  <Dropdown.Header>Профиль</Dropdown.Header>
  <Dropdown.Item>Настройки</Dropdown.Item>
  <Dropdown.Separator />
  <Dropdown.Item href="/logout">Выход</Dropdown.Item>
</Dropdown>

// Dropdown внутри горизонтального меню
const topMenu = [
  { label: 'Главная', href: '/' },
  { label: 'Команда', children: [{ label: 'Участники' }, { label: 'Роли' }] },
];
<Menu items={topMenu} orientation="horizontal" />
```

### Collapsible Menu

```tsx
const collapsible = [
  {
    label: 'Сервисы',
    open: true,
    children: [
      { label: 'Database' },
      { label: 'Cache' },
    ],
  },
];

<Menu items={collapsible} />
```

### Badge

```tsx
<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
```

### Typography

```tsx
<Heading level={2}>Заголовок</Heading>
<Text muted>Подпись</Text>
<Text code>npm run dev</Text>
```

### Alert

```tsx
<Alert title="Info">Синхронизация завершится через 3 минуты.</Alert>
<Alert variant="danger" title="Ошибка" onClose={() => {}}>
  Ошибка доступа к сервису хранения.
</Alert>
```

### Notifier

```tsx
<Notifier items={items} onDismiss={(id) => remove(id)} />
```

### Card

```tsx
<Card>
  <Card.Header title="Заголовок" right={<Button appearance="ghost">...</Button>} />
  <Card.Body>
    Контент карточки
  </Card.Body>
  <Card.Footer>
    <Button appearance="ghost">Отмена</Button>
    <Button>Сохранить</Button>
  </Card.Footer>
</Card>
```

### CollapseButton

```tsx
<CollapseButton targetId="filters-panel" open={open} onClick={() => setOpen((prev) => !prev)}>
  Фильтры
</CollapseButton>
```

### Breadcrumbs

```tsx
<Breadcrumbs
  items={[
    { label: 'Главная', href: '/' },
    { label: 'Проекты', href: '#' },
    { label: 'Project', current: true },
  ]}
/>
```

### Tabs

```tsx
const items = [
  { id: 'overview', label: 'Обзор', content: 'Основная информация' },
  { id: 'metrics', label: 'Метрики', content: 'Показатели' },
];

<Tabs items={items} />
```

### Progress

```tsx
<Progress value={72} label="Сборка" variant="primary" />
<Progress label="Синхронизация" indeterminate />
```

### Pagination

```tsx
<Pagination meta={pagination.meta} links={pagination.links} onNavigate={(page) => setPage(page)} />
```

### Modal / Drawer

```tsx
<Modal open={open} title="Новый релиз" onClose={() => setOpen(false)}>
  Контент модалки
</Modal>

<Drawer open={open} title="Меню" onClose={() => setOpen(false)}>
  Контент шторки
</Drawer>
```

## Базовые состояния

- `Button`: hover, focus-visible, active, disabled
- `Input`: focus, error, placeholder, disabled
- `Menu`: hover, active, disabled, divider, keyboard arrows
