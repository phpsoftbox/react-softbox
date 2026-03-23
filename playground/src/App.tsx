import React from 'react';
import {
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Dropdown,
  Grid,
  Heading,
  Image,
  Input,
  Menu,
  Modal,
  MarkdownEditor,
  Notifier,
  Pagination,
  Progress,
  Row,
  Stack,
  Tabs,
  Text,
  Table,
  Tooltip,
  FileUploader,
  Drawer,
  Collapse,
  CollapseButton,
  getStoredThemeMode,
  setThemeMode,
} from '@phpsoftbox/react-softbox';
import type { SelectOption, ThemeMode, TableColumn } from '@phpsoftbox/react-softbox';
import avatarImage from '../avatar.png';

const paletteRow: Array<Parameters<typeof Button>[0]> = [
  { variant: 'default' },
  { variant: 'primary' },
  { variant: 'info' },
  { variant: 'success' },
  { variant: 'warning' },
  { variant: 'danger' },
];

const asyncMockData = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma' },
  { value: 'delta', label: 'Delta' },
  { value: 'epsilon', label: 'Epsilon' },
];

type UserEntity = {
  id: number;
  name: string;
  email: string;
  phone: string;
  country_icon: string;
};

type UserMeta = {
  email: string;
  phone: string;
  countryIcon: string;
};

const usersApiMock: UserEntity[] = [
  {
    id: 1,
    name: 'Василий Петров',
    email: 'vasya.petrov@email.ltd',
    phone: '+7 999 888-77-66',
    country_icon: 'ru',
  },
  {
    id: 2,
    name: 'Anna Schmidt',
    email: 'anna.schmidt@email.ltd',
    phone: '+49 152 2345 6789',
    country_icon: 'de',
  },
  {
    id: 3,
    name: 'John Miller',
    email: 'john.miller@email.ltd',
    phone: '+1 415 555 0192',
    country_icon: 'us',
  },
];

const mapUserEntityToOption = (entity: UserEntity): SelectOption<number, UserMeta> => ({
  value: entity.id,
  label: entity.name,
  meta: {
    email: entity.email,
    phone: entity.phone,
    countryIcon: entity.country_icon,
  },
});

const userOptionsMock: SelectOption<number, UserMeta>[] = usersApiMock.map(mapUserEntityToOption);

const tableRows = [
  { id: 'INV-1024', client: 'ООО Север', project: 'B2B портал', status: 'В работе', manager: 'Андрей', amount: 248000, due: '12.03.2026' },
  { id: 'INV-1031', client: 'TechNova', project: 'Мобильное приложение', status: 'Готово', manager: 'Ирина', amount: 92000, due: '27.02.2026' },
  { id: 'INV-1038', client: 'Ритейл+ ', project: 'Редизайн витрины', status: 'В ожидании', manager: 'Максим', amount: 156000, due: '19.03.2026' },
  { id: 'INV-1042', client: 'FinLab', project: 'Дашборд аналитики', status: 'В работе', manager: 'Наталья', amount: 310000, due: '03.04.2026' },
  { id: 'INV-1047', client: 'SkyLog', project: 'Интеграции', status: 'В ожидании', manager: 'Сергей', amount: 68000, due: '25.02.2026' },
];

const formatCurrency = (value: number) => new Intl.NumberFormat('ru-RU').format(value);

const getStatusVariant = (status: string) => {
  if (status === 'Готово') {
    return 'success';
  }
  if (status === 'В ожидании') {
    return 'warning';
  }
  return 'info';
};

const getSortValue = (row: (typeof tableRows)[number], key: string) => {
  const value = row[key as keyof typeof row];
  if (typeof value === 'number') {
    return value;
  }
  return value === null || value === undefined ? '' : String(value);
};

export default function App() {
  const [themeMode, setThemeModeState] = React.useState<ThemeMode>(() => {
    if (typeof document !== 'undefined') {
      const attr = document.documentElement.getAttribute('data-theme-mode') as ThemeMode | null;
      if (attr) {
        return attr;
      }
    }
    return getStoredThemeMode() ?? 'system';
  });
  const [notifierItems, setNotifierItems] = React.useState<
    {
      id: string;
      title: string;
      message: string;
      variant: 'info' | 'success' | 'warning' | 'danger';
      duration: number;
    }[]
  >([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [multiValue, setMultiValue] = React.useState<string[]>(['cache']);
  const [asyncValue, setAsyncValue] = React.useState<string>('alpha');
  const [userValue, setUserValue] = React.useState<number | undefined>(1);
  const [creatableOptions, setCreatableOptions] = React.useState([
    { value: 'feature-a', label: 'Feature A' },
    { value: 'feature-b', label: 'Feature B' },
    { value: 'feature-c', label: 'Feature C' },
  ]);
  const [creatableValue, setCreatableValue] = React.useState<string | undefined>('feature-a');
  const [pageNumber, setPageNumber] = React.useState(2);
  const [tableSort, setTableSort] = React.useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'client',
    direction: 'asc',
  });
  const [selectedIds, setSelectedIds] = React.useState<React.Key[]>([]);
  const [smallSelectedIds, setSmallSelectedIds] = React.useState<React.Key[]>([]);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [markdownValue, setMarkdownValue] = React.useState(
    '# Документация\n\n**ReactSoftBox** — быстрый старт.\n\n- Пункты списка\n- Поддержка `inline` кода\n\n```ts\nconst ready = true;\nconst title = \"ReactSoftBox\";\nconsole.log(title, ready);\n```\n\n[Открыть сайт](https://phpsoftbox.com)\n'
  );

  const pushToast = (variant: 'info' | 'success' | 'warning' | 'danger') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setNotifierItems((prev) => [
      ...prev,
      {
        id,
        title: 'Уведомление',
        message: 'Проверка поведения Notifier и очереди.',
        variant,
        duration: 3200,
      },
    ]);
  };

  const menuItems = [
    { label: 'Главная', active: true },
    { label: 'Команда' },
    { divider: true },
    { label: 'Настройки' },
  ];

  const topMenu = [
    { label: 'Панель', href: '#' },
    {
      label: 'Релизы',
      children: [
        { label: 'Список' },
        { label: 'Новый релиз' },
        { divider: true },
        { label: 'Архив' },
      ],
    },
    { label: 'Команда', href: '#' },
  ];

  const dropdownItems = [
    { label: 'Редактировать' },
    { label: 'Копировать' },
    { divider: true },
    { label: 'Удалить' },
  ];

  const tabs = [
    {
      id: 'overview',
      label: 'Обзор',
      content: (
        <Stack gap="10px">
          <Text>Состояние фреймворка и общая сводка.</Text>
          <Progress value={58} label="Готовность" variant="primary" />
        </Stack>
      ),
    },
    {
      id: 'forms',
      label: 'Формы',
      content: <Text>Дополняем формы и состояния компонентов.</Text>,
    },
  ];

  const paginationMeta = {
    current_page: pageNumber,
    last_page: 8,
    per_page: 10,
    total: 76,
    from: (pageNumber - 1) * 10 + 1,
    to: Math.min(pageNumber * 10, 76),
    path: '/playground',
  };

  const loadAsync = (query: string) =>
    new Promise<typeof asyncMockData>((resolve) => {
      window.setTimeout(() => {
        const lowered = query.toLowerCase();
        const next = asyncMockData.filter((item) => item.label.toLowerCase().includes(lowered));
        resolve(next);
      }, 500);
    });

  const loadUsers = (query: string) =>
    new Promise<SelectOption<number, UserMeta>[]>((resolve) => {
      window.setTimeout(() => {
        const lowered = query.trim().toLowerCase();
        const next = usersApiMock
          .filter((entity) => (
            `${entity.name} ${entity.email} ${entity.phone}`
              .toLowerCase()
              .includes(lowered)
          ))
          .map(mapUserEntityToOption);
        resolve(next);
      }, 500);
    });

  const tableColumns = React.useMemo<TableColumn<(typeof tableRows)[number]>[]>(
    () => [
      {
        id: 'client',
        header: 'Клиент',
        accessor: 'client',
        sortable: true,
        footer: 'Итого',
      },
      {
        id: 'project',
        header: 'Проект',
        accessor: 'project',
        sortable: true,
        hideOn: 'sm' as const,
      },
      {
        id: 'manager',
        header: 'Менеджер',
        accessor: 'manager',
        hideOn: 'md' as const,
      },
      {
        id: 'status',
        header: 'Статус',
        sortable: true,
        sortKey: 'status',
        cell: (row: (typeof tableRows)[number]) => <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>,
      },
      {
        id: 'due',
        header: 'Срок',
        accessor: 'due',
        hideOn: 'sm' as const,
      },
      {
        id: 'amount',
        header: 'Сумма',
        align: 'right',
        sortable: true,
        sortKey: 'amount',
        accessor: (row: (typeof tableRows)[number]) => `${formatCurrency(row.amount)} ₽`,
        footer: (rows: (typeof tableRows)) => `${formatCurrency(rows.reduce((sum, row) => sum + row.amount, 0))} ₽`,
      },
    ],
    []
  );

  const tableColumnsWithActions = React.useMemo<TableColumn<(typeof tableRows)[number]>[]>(
    () => [
      ...tableColumns,
      {
        id: 'actions',
        header: 'Действия',
        align: 'right',
        width: 140,
        cell: (row: (typeof tableRows)[number]) => (
          <Dropdown
            align="right"
            trigger={<Button size="sm" appearance="outline">Действия</Button>}
          >
            <Dropdown.Item>Открыть</Dropdown.Item>
            <Dropdown.Item>Редактировать</Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item>Удалить</Dropdown.Item>
          </Dropdown>
        ),
      },
    ],
    [tableColumns],
  );

  const sortedRows = React.useMemo(() => {
    const next = [...tableRows];
    const direction = tableSort.direction === 'asc' ? 1 : -1;
    next.sort((a, b) => {
      const aValue = getSortValue(a, tableSort.key);
      const bValue = getSortValue(b, tableSort.key);
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }
      return String(aValue).localeCompare(String(bValue), 'ru', { sensitivity: 'base' }) * direction;
    });
    return next;
  }, [tableSort]);

  const handleTableSort = (next: { key: string; direction: 'asc' | 'desc' }, url: string) => {
    setTableSort(next);
    if (typeof window === 'undefined') {
      return;
    }
    if (url) {
      window.history.replaceState(null, '', url);
      return;
    }
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('sort', next.key);
    nextUrl.searchParams.set('order', next.direction);
    window.history.replaceState(null, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
  };

  const handleUpload = async (files: File[]) =>
    new Promise<void>((resolve) => {
      setUploadedFiles(files);
      window.setTimeout(() => resolve(), 800);
    });

  const handleToggleAll = (ids: React.Key[]) => {
    setSelectedIds((prev) => (ids.length > 0 && ids.every((id) => prev.includes(id)) ? [] : ids));
  };

  const handleToggleRow = (id: React.Key) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSmallToggleAll = (ids: React.Key[]) => {
    setSmallSelectedIds((prev) => (ids.length > 0 && ids.every((id) => prev.includes(id)) ? [] : ids));
  };

  const handleSmallToggleRow = (id: React.Key) => {
    setSmallSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div style={{ padding: '32px 40px' }}>
      <Stack gap="24px">
        <Stack gap="8px">
          <Heading level={2}>ReactSoftBox · Playground</Heading>
          <Text>Живая площадка для проверки компонентов и тем.</Text>
        </Stack>

        <Row gap="12px" wrap="wrap">
          <Input>
            <Input.Label hint="Переключает тему playground.">Тема</Input.Label>
            <Input.Select
              required
              options={[
                { value: 'system', label: 'Как в системе' },
                { value: 'auto', label: 'Авто (день/ночь)' },
                { value: 'light', label: 'Светлая' },
                { value: 'dark', label: 'Темная' },
              ]}
              value={themeMode}
              onChange={(next) => {
                const mode = next as ThemeMode;
                setThemeModeState(mode);
                setThemeMode(mode);
              }}
            />
          </Input>
          <Input.Switch label="Dev mode" defaultChecked />
        </Row>

        <Grid columns={12} columnsMd={6} columnsSm={12} gap="24px">
          <Card className="gridCard">
            <Card.Header title="Buttons" right={<Button variant="primary">Создать</Button>} />
            <Card.Body>
              <Stack gap="14px">
                <Row gap="12px" wrap="wrap">
                  {paletteRow.map((props, index) => (
                    <Button key={`${props.variant}-solid-${index}`} {...props}>
                      {props.variant}
                    </Button>
                  ))}
                </Row>
                <Row gap="12px" wrap="wrap">
                  {paletteRow.map((props, index) => (
                    <Button key={`${props.variant}-outline-${index}`} {...props} appearance="outline">
                      {props.variant}
                    </Button>
                  ))}
                  <Button appearance="ghost">ghost</Button>
                </Row>
                <Row gap="12px" wrap="wrap">
                  <a className="btn btn-primary btn-solid" href="#buttons">Link primary</a>
                  <a className="btn btn-info btn-outline" href="#buttons">Link outline</a>
                  <a className="btn btn-danger btn-ghost" href="#buttons">Link ghost</a>
                </Row>
                <Row gap="12px" wrap="wrap">
                  <a className="btn btn-primary btn-solid btn-sm" href="#buttons">Link sm</a>
                  <a className="btn btn-primary btn-solid btn-md" href="#buttons">Link md</a>
                  <a className="btn btn-primary btn-solid btn-lg" href="#buttons">Link lg</a>
                </Row>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Badges" />
            <Card.Body>
              <Stack gap="10px">
                <Row gap="10px" wrap="wrap">
                  <Badge variant="default">default</Badge>
                  <Badge variant="primary">primary</Badge>
                  <Badge variant="info">info</Badge>
                  <Badge variant="success">success</Badge>
                  <Badge variant="warning">warning</Badge>
                  <Badge variant="danger">danger</Badge>
                </Row>
                <Row gap="10px" wrap="wrap">
                  <Badge size="sm" variant="info">sm</Badge>
                  <Badge size="md" variant="info">md</Badge>
                  <Badge size="lg" variant="info">lg</Badge>
                </Row>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Menu / Tabs" />
            <Card.Body>
              <Stack gap="16px">
                <Menu items={menuItems} />
                <Menu items={topMenu} orientation="horizontal" />
                <Dropdown
                  trigger={<Button appearance="outline">Открыть меню (слева)</Button>}
                  items={dropdownItems}
                  align="left"
                  fullWidth
                />

                <Dropdown
                  trigger={<Button appearance="outline">Открыть меню (справа)</Button>}
                  items={dropdownItems}
                  align="right"
                  fullWidth
                />

                <Dropdown trigger={<Button appearance="outline">Уведомления</Button>} align="right">
                  <Dropdown.Header className="f-6">Уведомления</Dropdown.Header>
                  <Dropdown.Item static>Пока пусто</Dropdown.Item>
                  <Dropdown.Separator />
                  <Dropdown.Item href="#">Прочитать все</Dropdown.Item>
                </Dropdown>

                <Dropdown trigger={<Button appearance="outline">Профиль</Button>} align="right">
                  <Dropdown.Nav className="dropdownWide">
                    <Dropdown.Header className="f-6">Профиль</Dropdown.Header>
                    <Dropdown.Item static className="userDropdownHeader py-2 gap-3">
                      <Image src={avatarImage} alt="Avatar" width={48} height={48} shape="circle" />
                      <div className="userDropdownMeta">
                        <div className="userDropdownName f-5">Иван Петров</div>
                        <div className="userDropdownEmail f-3">ivan@petrov.ltd</div>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Separator />
                    <Dropdown.Item>Профиль</Dropdown.Item>
                    <Dropdown.Item>Настройки системы</Dropdown.Item>
                    <Dropdown.Separator />
                    <Dropdown.Item>Выход</Dropdown.Item>
                  </Dropdown.Nav>
                </Dropdown>

                <Tabs items={tabs} />
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Collapse" />
            <Card.Body>
              <Stack gap="12px">
                <CollapseButton
                  targetId="playground-collapse"
                  open={collapseOpen}
                  onClick={() => setCollapseOpen((prev) => !prev)}
                >
                  Дополнительные детали
                </CollapseButton>
                <Collapse id="playground-collapse" open={collapseOpen}>
                  <Text size="sm" muted>
                    Сворачиваемый контент. Можно размещать фильтры, списки и формы.
                  </Text>
                </Collapse>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Media" />
            <Card.Body>
              <Row gap="14px" wrap="wrap">
                <Image src={avatarImage} alt="Rounded" width={64} height={64} />
                <Image src={avatarImage} alt="Circle" width={64} height={64} shape="circle" />
              </Row>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Tooltip" />
            <Card.Body>
              <Stack gap="12px">
                <Row gap="10px" wrap="wrap">
                  <Tooltip content="Базовая подсказка">
                    <Button size="sm">Default</Button>
                  </Tooltip>
                  <Tooltip content="Информационная" variant="info">
                    <Button size="sm" variant="info">Info</Button>
                  </Tooltip>
                  <Tooltip content="Успех" variant="success">
                    <Button size="sm" variant="success">Success</Button>
                  </Tooltip>
                  <Tooltip content="Предупреждение" variant="warning">
                    <Button size="sm" variant="warning">Warning</Button>
                  </Tooltip>
                  <Tooltip content="Ошибка" variant="danger">
                    <Button size="sm" variant="danger">Danger</Button>
                  </Tooltip>
                </Row>
                <Row gap="10px" wrap="wrap">
                  <Tooltip content="Сверху" placement="top">
                    <Button size="sm" appearance="outline">Top</Button>
                  </Tooltip>
                  <Tooltip content="Справа" placement="right">
                    <Button size="sm" appearance="outline">Right</Button>
                  </Tooltip>
                  <Tooltip content="Снизу" placement="bottom">
                    <Button size="sm" appearance="outline">Bottom</Button>
                  </Tooltip>
                  <Tooltip content="Слева" placement="left">
                    <Button size="sm" appearance="outline">Left</Button>
                  </Tooltip>
                </Row>
                <Tooltip
                  interactive
                  content={
                    <>
                      <Tooltip.Header>Заголовок</Tooltip.Header>
                      <Tooltip.Body>Подробности и описание в теле подсказки.</Tooltip.Body>
                      <Tooltip.Footer>Доп. информация</Tooltip.Footer>
                    </>
                  }
                >
                  <Button size="sm" appearance="outline">Кастомный контент</Button>
                </Tooltip>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Forms" />
            <Card.Body>
              <Stack gap="12px">
                <Input>
                  <Input.Label hint="Текстовая подсказка для поля без float label.">Обычный input</Input.Label>
                  <Input.Field name="title" placeholder="Введите текст" required />
                </Input>
                <Input>
                  <Input.Label>Ошибка</Input.Label>
                  <Input.Field name="error-field" placeholder="С заполнением" hasError required />
                  <Input.ErrorBag>Введите корректное значение.</Input.ErrorBag>
                </Input>
                <Input>
                  <Input.Label>Ошибка (tooltip)</Input.Label>
                  <Input.Control>
                    <Input.Field name="error-tooltip-icon" placeholder="С заполнением" hasError required />
                    <Input.ErrorTooltip content="Некорректное значение" placement={"auto"} />
                  </Input.Control>
                </Input>
                <Input>
                  <Input.Label>Ошибка (tooltip на поле)</Input.Label>
                  <Input.Field name="error-tooltip-input" placeholder="С заполнением" hasError required />
                  <Input.ErrorTooltip target="input" content="Введите корректное значение" placement="bottom" />
                </Input>
                <Input layout="row" labelWidth={140} align="center" labelAlign="right">
                  <Input.Label>Телефон</Input.Label>
                  <Input.Control>
                    <Input.MaskedInput name="phone" mask="+7 (999) 999-99-99" placeholder="+7 (___) ___-__-__" required />
                  </Input.Control>
                </Input>
                <Input>
                  <Input.FloatLabel label="Email" hint="Подсказка внутри поля справа.">
                    <Input.Field type="email" name="email" required />
                  </Input.FloatLabel>
                </Input>
                <Input>
                  <Input.FloatLabel label="Float label + placeholder" hint="Placeholder скрыт без фокуса и виден только при фокусе.">
                    <Input.Field
                      type="text"
                      name="float-with-placeholder"
                      placeholder="Введите значение (placeholder виден только в фокусе)"
                      required
                    />
                  </Input.FloatLabel>
                </Input>
                <Input>
                  <Input.FloatLabel label="Комментарий" hint="Работает и для textarea.">
                    <Input.TextArea name="comment" rows={3} required />
                  </Input.FloatLabel>
                </Input>
                <Input>
                  <Input.Label>Дополнительные заметки</Input.Label>
                  <Input.TextArea name="notes" placeholder="Текст..." />
                </Input>
                <Input>
                  <Input.Label hint="Выберите окружение для запуска.">Окружение</Input.Label>
                  <Input.Select
                    required
                    name="environment"
                    options={[
                      { value: 'dev', label: 'Development' },
                      { value: 'stage', label: 'Staging' },
                      { value: 'prod', label: 'Production' },
                    ]}
                    allowEmptyValue
                    emptyOptionLabel="Не выбрано"
                    defaultValue="dev"
                  />
                </Input>
                <Input>
                  <Input.Label hint="Можно выбрать несколько сервисов.">Сервисы</Input.Label>
                  <Input.Select
                    required
                    name="services"
                    options={[
                      { value: 'cache', label: 'Cache' },
                      { value: 'queue', label: 'Queue' },
                      { value: 'db', label: 'Database' },
                      { value: 'search', label: 'Search' },
                    ]}
                    multiple
                    value={multiValue}
                    onChange={(next) => setMultiValue(next as string[])}
                  />
                </Input>
                <Input>
                  <Input.FloatLabel label="Float label select with tags" hint="Подсказка у float label-select.">
                    <Input.Select
                        required
                        name="services"
                        options={[
                          { value: 'cache', label: 'Cache' },
                          { value: 'queue', label: 'Queue' },
                          { value: 'db', label: 'Database' },
                          { value: 'search', label: 'Search' },
                        ]}
                        multiple
                        value={multiValue}
                        onChange={(next) => setMultiValue(next as string[])}
                    />
                  </Input.FloatLabel>
                </Input>
                <Input>
                  <Input.FloatLabel label="Async select" hint="Загружает варианты по мере ввода.">
                    <Input.Select
                        required
                        name="async"
                        loadOptions={loadAsync}
                        value={asyncValue}
                        onChange={(next) => setAsyncValue(next as string)}
                        loadingText="Загрузка..."
                        emptyText="Ничего не найдено"
                        searchable
                        clearable
                    />
                  </Input.FloatLabel>
                </Input>
                <Input>
                  <Input.FloatLabel label="Select + meta (API shape)" hint="Многострочный рендер и маппинг сущностей из API в options.">
                    <Input.Select<number, UserMeta>
                        required
                        name="users-api-shape"
                        searchable
                        clearable
                        value={userValue}
                        options={userOptionsMock}
                        loadOptions={loadUsers}
                        onChange={(next) => setUserValue(next as number | undefined)}
                        loadingText="Поиск пользователей..."
                        emptyText="Пользователь не найден"
                        placeholder="Начните вводить имя/email/телефон"
                        renderOption={(option) => {
                          if (option.value === null) {
                            return option.label;
                          }

                          return (
                            <div className="userOption">
                              <div className="userOptionPrimary">
                                <span className="userOptionCountry">{option.meta?.countryIcon?.toUpperCase()}</span>
                                <span>{option.label}</span>
                              </div>
                              <div className="userOptionMeta">{option.meta?.email}</div>
                              <div className="userOptionMeta">{option.meta?.phone}</div>
                            </div>
                          );
                        }}
                        renderValue={(option) => (
                          option.value === null ? option.label : `${option.meta?.countryIcon?.toUpperCase() ?? ''} ${option.label}`.trim()
                        )}
                    />
                  </Input.FloatLabel>
                </Input>
                <Input>
                  <Input.FloatLabel label="Async select" hint="Статический вариант без загрузки.">
                    <Input.Select
                        required
                        name="async"
                        value={asyncValue}
                        onChange={(next) => setAsyncValue(next as string)}
                        options={[
                          { value: 'cache', label: 'Cache' },
                          { value: 'queue', label: 'Queue' },
                          { value: 'db', label: 'Database' },
                          { value: 'search', label: 'Search' },
                        ]}
                    />
                  </Input.FloatLabel>
                </Input>
                <Input>
                  <Input.FloatLabel label="Creatable select" hint="Можно добавить новый вариант из поиска.">
                    <Input.Select
                        required
                        name="creatable"
                        searchable
                        creatable
                        value={creatableValue}
                        options={creatableOptions}
                        onChange={(next) => setCreatableValue(next as string | undefined)}
                        onCreateOption={(query) => {
                          const trimmed = query.trim();
                          if (!trimmed) {
                            return undefined;
                          }
                          const next = { value: trimmed.toLowerCase().replace(/\s+/g, '-'), label: trimmed };
                          setCreatableOptions((prev) => [...prev, next]);
                          return next;
                        }}
                    />
                  </Input.FloatLabel>
                </Input>
                <Input>
                  <Input.Label>Сумма</Input.Label>
                  <Input.Group stretch>
                    <Input.Addon>₽</Input.Addon>
                    <Input.Number name="amount" placeholder="0.00" required />
                    <Button appearance="outline">OK</Button>
                  </Input.Group>
                </Input>
                <Input>
                  <Input.Label hint="Выбор начальной и конечной даты.">Диапазон дат</Input.Label>
                  <Input.DateRange
                    startProps={{ name: 'range-start', required: true }}
                    endProps={{ name: 'range-end', required: true }}
                  />
                </Input>
                <Input>
                  <Input.Label hint="Выберите одну дату.">Дата</Input.Label>
                  <Input.DatePicker name="date" required />
                </Input>
                <Input layout="row" labelWidth={140} align="center" labelAlign="right">
                  <Input.Label hint="Формат HH:mm, ввод вручную поддерживается.">Время</Input.Label>
                  <Input.TimePicker name="time" required />
                </Input>
                <Row gap="14px" wrap="wrap">
                  <Input.Radio name="mode" label="Основной" hint="Основной режим работы." defaultChecked />
                  <Input.Radio name="mode" label="Резерв" />
                  <Input.Checkbox label="Согласен с условиями" hint="Нужно для продолжения." defaultChecked />
                  <Input.Switch label="Автообновление" hint="Проверять обновления автоматически." defaultChecked />
                </Row>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard gridCardWide">
            <Card.Header title="MarkdownEditor" />
            <Card.Body>
              <MarkdownEditor
                label="Описание релиза"
                value={markdownValue}
                onChange={setMarkdownValue}
                placeholder="Введите markdown..."
              >
                <Tabs
                  items={[
                    {
                      id: 'markdown-editor-tab',
                      label: 'Редактор',
                      content: <MarkdownEditor.Textarea label="Редактор" />,
                    },
                    {
                      id: 'markdown-preview-tab',
                      label: 'Просмотр',
                      content: <MarkdownEditor.Preview label="Предпросмотр" />,
                    },
                  ]}
                  defaultActiveId="markdown-editor-tab"
                />
              </MarkdownEditor>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Progress" />
            <Card.Body>
              <Stack gap="12px">
                <Progress value={48} label="Default" showValue />
                <Progress value={72} label="Primary" variant="primary" showValue />
                <Progress value={36} label="Success" variant="success" size="sm" showValue />
                <Progress value={92} label="Warning" variant="warning" size="lg" showValue />
                <Progress label="Indeterminate" variant="info" indeterminate />
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Alerts" />
            <Card.Body>
              <Stack gap="10px">
                <Alert variant="info" title="Информация">
                  Вариант для информирования.
                </Alert>
                <Alert variant="success" title="Готово">
                  Успешное действие.
                </Alert>
                <Alert variant="warning" title="Внимание">
                  Обратите внимание на состояние.
                </Alert>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Breadcrumbs / Pagination" />
            <Card.Body>
              <Stack gap="16px">
                <Breadcrumbs
                  items={[
                    { label: 'Главная', href: '#' },
                    { label: 'Компоненты', href: '#' },
                    { label: 'ReactSoftBox', current: true },
                  ]}
                />
                <Pagination
                  meta={paginationMeta}
                  onNavigate={(page) => setPageNumber(page)}
                />
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard gridCardWide">
            <Card.Header title="Tables" />
            <Card.Body>
              <Stack gap="20px">
                <Stack gap="8px">
                  <Text weight="semibold">Сортировка + футер</Text>
                  <Table
                    columns={tableColumns}
                    data={sortedRows}
                    showFooter
                    selection={{
                      selectedIds,
                      onToggle: (id) => handleToggleRow(id),
                      onToggleAll: (ids) => handleToggleAll(ids),
                    }}
                    renderBulkAction={(ids) => (
                      <Row align="center" justify="space-between" wrap="wrap" gap="12px">
                        <Text size="sm" muted>Выбрано: {ids.length}</Text>
                        <Row gap="8px" wrap="wrap">
                          <Button size="sm" appearance="outline" disabled={ids.length === 0} onClick={() => setSelectedIds([])}>
                            Сбросить
                          </Button>
                          <Button size="sm" variant="danger" disabled={ids.length === 0}>
                            Удалить
                          </Button>
                        </Row>
                      </Row>
                    )}
                    sort={{
                      key: tableSort.key,
                      direction: tableSort.direction,
                      param: 'sort',
                      orderParam: 'order',
                      onChange: handleTableSort,
                    }}
                  />
                </Stack>
                <Stack gap="8px">
                  <Text weight="semibold">Striped + compact</Text>
                  <Table
                    columns={tableColumns}
                    data={tableRows}
                    variant="striped"
                    size="sm"
                    showFooter={false}
                  />
                </Stack>
                <Stack gap="8px">
                  <Text weight="semibold">Bordered</Text>
                  <Table
                    columns={tableColumns}
                    data={sortedRows}
                    variant="bordered"
                    showFooter
                  />
                </Stack>
                <Stack gap="8px">
                  <Text weight="semibold">Row actions (Dropdown)</Text>
                  <Table
                    columns={tableColumnsWithActions}
                    data={sortedRows}
                    showFooter={false}
                  />
                </Stack>
                <Stack gap="8px">
                  <Text weight="semibold">One row + bulk actions</Text>
                  <Table
                    columns={tableColumns}
                    data={[tableRows[0]]}
                    selection={{
                      selectedIds: smallSelectedIds,
                      onToggle: (id) => handleSmallToggleRow(id),
                      onToggleAll: (ids) => handleSmallToggleAll(ids),
                    }}
                    bulkActions={{
                      selectedIds: smallSelectedIds,
                      actions: [
                        { id: 'remove', label: 'Удалить', variant: 'danger', icon: '-', onClick: () => setSmallSelectedIds([]) },
                        { id: 'restore', label: 'Восстановить', variant: 'success', icon: '+', onClick: () => setSmallSelectedIds([]) },
                      ],
                      onClear: () => setSmallSelectedIds([]),
                    }}
                  />
                </Stack>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard gridCardWide">
            <Card.Header title="FileUploader" />
            <Card.Body>
              <Stack gap="12px">
                <FileUploader
                  allowedTypes={['.jpg', '.png', '.pdf']}
                  maxFileSizeKb={2048}
                  multiple
                  showPreview
                  allowRemove
                  removeLabel="Убрать"
                  uploadButtonPlacement="both"
                  uploadButtonAlign="left"
                  buttonLabel="Выбрать файлы"
                  uploadLabel="Отправить"
                  dropLabel="Перетащите файлы или нажмите «Выбрать файлы»"
                  externalErrors={uploadedFiles.some((file) => file.name.toLowerCase().endsWith('.svg'))
                    ? ['SVG не поддерживается в этом примере.']
                    : []}
                  onChange={(files) => setUploadedFiles(files)}
                  onUpload={handleUpload}
                />
                {uploadedFiles.length ? (
                  <Text size="sm" muted>
                    Загружено: {uploadedFiles.length}
                  </Text>
                ) : null}
                <Text size="sm" muted>
                  Можно удалить выбранные файлы до отправки: из списка и из превью.
                </Text>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Modal / Drawer" />
            <Card.Body>
              <Row gap="12px" wrap="wrap">
                <Button variant="primary" onClick={() => setModalOpen(true)}>
                  Открыть модалку
                </Button>
                <Button variant="info" appearance="outline" onClick={() => setDrawerOpen(true)}>
                  Открыть drawer
                </Button>
              </Row>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Typography" />
            <Card.Body>
              <Stack gap="10px">
                <Heading level={3}>Заголовок уровня 3</Heading>
                <Heading level={4}>Заголовок уровня 4</Heading>
                <Text size="lg" weight="semibold">Крупный текст</Text>
                <Text muted>Muted текст для второстепенных деталей.</Text>
                <Text variant="primary">Акцентный текст</Text>
                <Text code>{'const isReady = true;'}</Text>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Notifier" />
            <Card.Body>
              <Row gap="12px" wrap="wrap">
                <Button variant="info" appearance="outline" onClick={() => pushToast('info')}>
                  Info
                </Button>
                <Button variant="success" appearance="outline" onClick={() => pushToast('success')}>
                  Success
                </Button>
                <Button variant="warning" appearance="outline" onClick={() => pushToast('warning')}>
                  Warning
                </Button>
                <Button variant="danger" appearance="outline" onClick={() => pushToast('danger')}>
                  Danger
                </Button>
              </Row>
            </Card.Body>
          </Card>
        </Grid>
      </Stack>

      <Modal
        open={modalOpen}
        title="Подтверждение"
        onClose={() => setModalOpen(false)}
        footer={
          <Row gap="12px" wrap="wrap">
            <Button appearance="outline" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Подтвердить
            </Button>
          </Row>
        }
      >
        <Text>Здесь можно разместить содержимое модального окна.</Text>
      </Modal>

      <Drawer
        open={drawerOpen}
        title="Боковая панель"
        onClose={() => setDrawerOpen(false)}
        footer={<Button variant="primary" onClick={() => setDrawerOpen(false)}>Готово</Button>}
      >
        <Stack gap="10px">
          <Text>Пример боковой панели для настройки параметров.</Text>
          <Input.Switch label="Включить" defaultChecked />
        </Stack>
      </Drawer>

      <Notifier items={notifierItems} onDismiss={(id) => setNotifierItems((prev) => prev.filter((item) => item.id !== id))} />
    </div>
  );
}
