import React from 'react';
import {
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Details,
  Dropdown,
  Grid,
  Heading,
  Image,
  Input,
  Menu,
  Modal,
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
  Wizard,
  getStoredThemeMode,
  setThemeMode,
} from '@phpsoftbox/react-softbox';
import type { DetailsItem, SelectOption, ThemeMode, TableColumn, WizardProgressState, WizardSummaryData } from '@phpsoftbox/react-softbox';
import avatarImage from '../avatar.png';

const MarkdownEditorDemo = React.lazy(() => import('./MarkdownEditorDemo'));

const paletteRow: Array<Parameters<typeof Button>[0]> = [
  { variant: 'default' },
  { variant: 'primary' },
  { variant: 'secondary' },
  { variant: 'info' },
  { variant: 'success' },
  { variant: 'warning' },
  { variant: 'danger' },
  { variant: 'dark' },
  { variant: 'light' },
  { variant: 'neutral' },
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

type DiscountKind = 'percent' | 'amount';

type WizardSimpleState = {
  company: string;
  owner: string;
  contact: string;
};

type WizardGuardedState = {
  email: string;
  plan: 'basic' | 'pro' | 'enterprise' | '';
  approved: boolean;
};

type WizardWindowState = {
  project: string;
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

const profileDetails: DetailsItem[] = [
  { label: 'ID', value: 'USR-2037' },
  { label: 'Имя', value: 'Anna Schmidt' },
  { label: 'Email', value: 'anna.schmidt@email.ltd' },
  { label: 'Телефон', value: '+49 152 2345 6789', priority: 'secondary' },
  { label: 'Роль', value: 'Product manager', priority: 'secondary' },
  { label: 'Комментарий', value: null, fullWidth: true, priority: 'secondary' },
];

const breadcrumbsLongItems = [
  { label: 'Главная', href: '#' },
  { label: 'Склады', href: '#' },
  { label: 'Центральный склад', href: '#' },
  { label: 'Товары', href: '#' },
  { label: 'Шампуни', href: '#' },
  { label: 'SKU-001245', href: '#' },
  { label: 'Транзакции', current: true },
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

const phoneMasks = {
  ru: '+7 (999) 999-99-99',
  us: '+1 (999) 999-9999',
  kz: '+7 (999) 999-99-99',
} as const;

type PhoneCountry = keyof typeof phoneMasks;

const phoneCountryOptions: SelectOption<PhoneCountry>[] = [
  { value: 'ru', label: 'Россия' },
  { value: 'us', label: 'США' },
  { value: 'kz', label: 'Казахстан' },
];

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
  const [modalAssignee, setModalAssignee] = React.useState<string>('qa');
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [multiValue, setMultiValue] = React.useState<string[]>(['cache']);
  const [asyncValue, setAsyncValue] = React.useState<string>('alpha');
  const [searchableValue, setSearchableValue] = React.useState<string | undefined>('cache');
  const [phoneCountry, setPhoneCountry] = React.useState<PhoneCountry>('ru');
  const [groupPhone, setGroupPhone] = React.useState('');
  const [discountKind, setDiscountKind] = React.useState<DiscountKind>('percent');
  const [discountValue, setDiscountValue] = React.useState('');
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
  const [wizardShowFutureSteps, setWizardShowFutureSteps] = React.useState(false);
  const [wizardShowPrevOnFirstStep, setWizardShowPrevOnFirstStep] = React.useState(false);
  const [wizardSimpleProgress, setWizardSimpleProgress] = React.useState<WizardProgressState>({
    total: 0,
    current: 0,
    completed: 0,
    percent: 0,
  });
  const [wizardGuardedProgress, setWizardGuardedProgress] = React.useState<WizardProgressState>({
    total: 0,
    current: 0,
    completed: 0,
    percent: 0,
  });
  const [wizardSimpleState, setWizardSimpleState] = React.useState<WizardSimpleState>({
    company: '',
    owner: '',
    contact: '',
  });
  const [wizardGuardedState, setWizardGuardedState] = React.useState<WizardGuardedState>({
    email: '',
    plan: '',
    approved: false,
  });
  const [wizardWindowState] = React.useState<WizardWindowState>({
    project: 'API migration',
  });
  const wizardGuardedSummaryData = React.useMemo<WizardSummaryData>(() => {
    const summary: WizardSummaryData = {};
    const profileErrors: string[] = [];
    const planErrors: string[] = [];
    const confirmErrors: string[] = [];

    const email = wizardGuardedState.email.trim();
    if (!email) {
      profileErrors.push('Введите email.');
    } else if (!email.includes('@')) {
      profileErrors.push('Email должен содержать символ @.');
    }

    if (!wizardGuardedState.plan) {
      planErrors.push('Выберите тариф.');
    }

    if (!wizardGuardedState.approved) {
      confirmErrors.push('Подтвердите данные чекбоксом.');
    }

    if (profileErrors.length > 0) {
      summary.Профиль = profileErrors;
    }
    if (planErrors.length > 0) {
      summary.Тариф = planErrors;
    }
    if (confirmErrors.length > 0) {
      summary.Подтверждение = confirmErrors;
    }

    return summary;
  }, [wizardGuardedState]);
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
            <Card.Header right={<Button variant="primary">Создать</Button>}>
              <Card.Header.Title>Buttons</Card.Header.Title>
              <Card.Header.Subtitle>Пример использования Header subcomponents.</Card.Header.Subtitle>
            </Card.Header>
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
                <Row gap="12px" wrap="wrap" align="flex-start">
                  <Button.Group aria-label="View mode">
                    <Button appearance="outline">День</Button>
                    <Button appearance="outline">Неделя</Button>
                    <Button appearance="outline">Месяц</Button>
                  </Button.Group>
                  <Button.Group orientation="vertical" aria-label="Sort order">
                    <Button size="sm" appearance="outline">A-Z</Button>
                    <Button size="sm" appearance="outline">Z-A</Button>
                  </Button.Group>
                </Row>
                <Button.Group stretch aria-label="Segmented actions">
                  <Button variant="secondary">Черновик</Button>
                  <Button variant="primary">Опубликовать</Button>
                  <Button variant="danger" appearance="outline">Удалить</Button>
                </Button.Group>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard">
            <Card.Header title="Badges" />
            <Card.Body>
              <Stack gap="10px">
                <Row gap="10px" wrap="wrap">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="dark">Dark</Badge>
                  <Badge variant="light">Light</Badge>
                  <Badge variant="neutral">Neutral</Badge>
                </Row>
                <Row gap="10px" wrap="wrap">
                  <Badge size="sm" variant="info">sm</Badge>
                  <Badge size="md" variant="info">md</Badge>
                  <Badge size="lg" variant="info">lg</Badge>
                  <Badge variant="success" className="rounded-pill">pill</Badge>
                  <Badge variant="warning" className="rounded-circle size-6 p-0 f-2">3</Badge>
                  <Badge variant="info" className="border border-info text-uppercase f-2">helper styled</Badge>
                  <Badge variant="danger" dot aria-label="Ошибка" />
                </Row>
                <Row gap="12px" wrap="wrap">
                  <Button variant="primary" className="position-relative">
                    Inbox
                    <Badge variant="danger" className="position-absolute top-0 left-100 translate-middle rounded-pill f-2">
                      12
                    </Badge>
                  </Button>
                  <Button variant="secondary" appearance="outline" className="position-relative">
                    Updates
                    <Badge
                      variant="success"
                      dot
                      aria-label="Есть обновления"
                      className="position-absolute top-0 left-100 translate-middle p-2"
                    />
                  </Button>
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
                  <Input.FloatLabel label="Float label + placeholder + mega long text" hint="Placeholder скрыт без фокуса и виден только при фокусе.">
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
                  <Input.FloatLabel label="Searchable select" hint="Фильтрация локального списка без async-запроса.">
                    <Input.Select
                        required
                        name="searchable-static"
                        searchable
                        clearable
                        value={searchableValue}
                        onChange={(next) => setSearchableValue(next as string | undefined)}
                        options={[
                          { value: 'cache', label: 'Cache' },
                          { value: 'queue', label: 'Queue' },
                          { value: 'db', label: 'Database' },
                          { value: 'search', label: 'Search' },
                          { value: 'analytics', label: 'Analytics' },
                        ]}
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
                    <Input.Group.Label>₽</Input.Group.Label>
                    <Input.Number name="amount" placeholder="0.00" required />
                    <Input.Group.Text>без НДС</Input.Group.Text>
                  </Input.Group>
                </Input>
                <Input>
                  <Input.Label hint="Select меняет маску соседнего поля через onChange.">Телефон с кодом страны</Input.Label>
                  <Input.Group stretch>
                    <Input.Select<PhoneCountry>
                      name="phone-country"
                      value={phoneCountry}
                      options={phoneCountryOptions}
                      style={{ flex: '0 0 150px' }}
                      onChange={(next) => {
                        setPhoneCountry(next as PhoneCountry);
                        setGroupPhone('');
                      }}
                    />
                    <Input.MaskedInput
                      name="group-phone"
                      mask={phoneMasks[phoneCountry]}
                      value={groupPhone}
                      onChange={setGroupPhone}
                      placeholder={phoneMasks[phoneCountry].replace(/9/g, '_')}
                      required
                    />
                  </Input.Group>
                </Input>
                <Input>
                  <Input.Label>Диапазон значений</Input.Label>
                  <Input.Group stretch>
                    <Input.Group.Label>от</Input.Group.Label>
                    <Input.Number name="range-from" placeholder="0" />
                    <Input.Group.Label>до</Input.Group.Label>
                    <Input.Number name="range-to" placeholder="100" />
                  </Input.Group>
                </Input>
                <Input>
                  <Input.Label>Поиск по заказу</Input.Label>
                  <Input.Group stretch>
                    <Button appearance="outline">Найти</Button>
                    <Input.Field name="group-order" placeholder="Номер заказа" />
                    <Button variant="primary">Открыть</Button>
                  </Input.Group>
                </Input>
                <Input>
                  <Input.Label>Скидка</Input.Label>
                  <Input.Group stretch>
                    <Input.Group.Choice>
                      <Input.Radio
                        name="discount-mode"
                        label="%"
                        checked={discountKind === 'percent'}
                        onChange={() => {
                          setDiscountKind('percent');
                          setDiscountValue('');
                        }}
                      />
                    </Input.Group.Choice>
                    <Input.Number
                      name="discount-value"
                      placeholder={discountKind === 'percent' ? '10' : '500'}
                      value={discountValue}
                      onChange={setDiscountValue}
                      max={discountKind === 'percent' ? 100 : undefined}
                      decimalScale={discountKind === 'percent' ? 0 : 2}
                    />
                    <Input.Group.Choice>
                      <Input.Radio
                        name="discount-mode"
                        label="₽"
                        checked={discountKind === 'amount'}
                        onChange={() => {
                          setDiscountKind('amount');
                          setDiscountValue('');
                        }}
                      />
                    </Input.Group.Choice>
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

          <React.Suspense
            fallback={(
              <Card className="gridCard gridCardWide">
                <Card.Header title="MarkdownEditor" />
                <Card.Body>
                  <Text muted>Загрузка редактора...</Text>
                </Card.Body>
              </Card>
            )}
          >
            <MarkdownEditorDemo />
          </React.Suspense>

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
                <Alert variant="info" title="Информация" iconPlacement="top">
                  Вариант для информирования. Иконка выровнена по верхнему краю.
                </Alert>
                <Alert variant="success" title="Готово" iconPlacement="center" iconBgFilled>
                  Успешное действие. Иконка выровнена по центру.
                </Alert>
                <Alert variant="warning" title="Внимание" iconPlacement="bottom">
                  Обратите внимание на состояние. Иконка выровнена по нижнему краю.
                </Alert>
                <Alert
                  variant="danger"
                  title="Ошибка публикации"
                  icon={
                    <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>
                      ⛔
                    </span>
                  }
                  actions={(
                    <Row gap="8px" wrap="wrap">
                      <Button size="sm" appearance="outline">Логи</Button>
                      <Button size="sm" variant="danger">Повторить</Button>
                    </Row>
                  )}
                >
                  Кастомная иконка и блок действий.
                </Alert>
                <Alert variant="default" title="Без иконки" icon={null}>
                  Пример с отключенной иконкой.
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
                <Breadcrumbs items={breadcrumbsLongItems} />
                <Breadcrumbs
                  items={breadcrumbsLongItems}
                  maxVisibleItems={5}
                  overflowTailCount={3}
                  overflowAriaLabel="Показать скрытые крошки"
                  renderOverflowTrigger={(hiddenItems) => (
                    <button type="button" className="btn btn-default btn-ghost btn-sm">
                      Еще {hiddenItems.length}
                    </button>
                  )}
                />
                <Pagination
                  meta={paginationMeta}
                  onNavigate={(page) => setPageNumber(page)}
                />
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard gridCardWide">
            <Card.Header title="Toolbar Groups" subtitle="Группы с разделителями как в desktop UI." />
            <Card.Body>
              <Stack gap="12px">
                <Card.Toolbar align="left">
                  <Card.Toolbar.Group attached>
                    <Tooltip content="Назад" placement="top">
                      <Card.Toolbar.Button
                        aria-label="Назад"
                        icon={<span aria-hidden="true">←</span>}
                      />
                    </Tooltip>
                    <Tooltip content="Вперед" placement="top">
                      <Card.Toolbar.Button
                        aria-label="Вперед"
                        icon={<span aria-hidden="true">→</span>}
                      />
                    </Tooltip>
                  </Card.Toolbar.Group>
                  <Card.Toolbar.Group attached>
                    <Card.Toolbar.Button
                      icon={<span aria-hidden="true">✂</span>}
                      label="Вырезать"
                    />
                    <Card.Toolbar.Button
                      icon={<span aria-hidden="true">⎘</span>}
                      label="Копировать"
                    />
                    <Card.Toolbar.Button
                      icon={<span aria-hidden="true">⎘</span>}
                      label="Вставить"
                    />
                  </Card.Toolbar.Group>
                  <Card.Toolbar.Group>
                    <Tooltip content="Настройки" placement="top">
                      <Card.Toolbar.Button
                        aria-label="Настройки"
                        icon={<span aria-hidden="true">⚙</span>}
                      />
                    </Tooltip>
                    <Card.Toolbar.Button
                      icon={<span aria-hidden="true">✓</span>}
                      label="Сохранить"
                      variant="primary"
                    />
                  </Card.Toolbar.Group>
                </Card.Toolbar>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard gridCardWide">
            <Card.Header title="Wizard · Без условий" subtitle="Переходы вперед/назад без валидации шагов." />
            <Card.Body>
              <Stack gap="14px">
                <Input.Switch
                  label="Показывать будущие шаги"
                  checked={wizardShowFutureSteps}
                  onChange={(event) => setWizardShowFutureSteps(event.target.checked)}
                />
                <Input.Switch
                  label="Показывать кнопку «Назад» на первом шаге"
                  checked={wizardShowPrevOnFirstStep}
                  onChange={(event) => setWizardShowPrevOnFirstStep(event.target.checked)}
                />
                <Progress
                  value={wizardSimpleProgress.percent}
                  size="sm"
                  variant="primary"
                  label={`Шаг ${wizardSimpleProgress.current} из ${wizardSimpleProgress.total || 0}`}
                  showValue
                />
                <Wizard<WizardSimpleState>
                  state={wizardSimpleState}
                  showFutureSteps={wizardShowFutureSteps}
                  showPrevOnFirstStep={wizardShowPrevOnFirstStep}
                  onStepStateChange={({ progress }) => setWizardSimpleProgress(progress)}
                  onComplete={() => pushToast('success')}
                >
                  <Wizard.Step id="company" title="Компания" description="Профиль">
                    <Input>
                      <Input.Label>Название компании</Input.Label>
                      <Input.Field
                        name="wizard-company"
                        placeholder="ООО Пример"
                        value={wizardSimpleState.company}
                        onChange={(event) => setWizardSimpleState((prev) => ({
                          ...prev,
                          company: event.target.value,
                        }))}
                      />
                    </Input>
                  </Wizard.Step>
                  <Wizard.Step id="owner" title="Контакт" description="Ответственный">
                    <Input>
                      <Input.Label>ФИО</Input.Label>
                      <Input.Field
                        name="wizard-owner"
                        placeholder="Иван Иванов"
                        value={wizardSimpleState.owner}
                        onChange={(event) => setWizardSimpleState((prev) => ({
                          ...prev,
                          owner: event.target.value,
                        }))}
                      />
                    </Input>
                  </Wizard.Step>
                  <Wizard.Step id="final" title="Финал" description="Подтверждение">
                    <Input>
                      <Input.Label>Email</Input.Label>
                      <Input.Field
                        name="wizard-contact-email"
                        type="email"
                        placeholder="manager@example.com"
                        value={wizardSimpleState.contact}
                        onChange={(event) => setWizardSimpleState((prev) => ({
                          ...prev,
                          contact: event.target.value,
                        }))}
                      />
                    </Input>
                  </Wizard.Step>
                </Wizard>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard gridCardWide">
            <Card.Header title="Wizard · С условиями" subtitle="Три шага с canEnter/canExit." />
            <Card.Body>
              <Stack gap="12px">
                <Wizard.Summary
                  variant="warning"
                  title="Ошибки по шагам"
                  data={wizardGuardedSummaryData}
                />
                <Wizard<WizardGuardedState>
                  state={wizardGuardedState}
                  showFutureSteps={wizardShowFutureSteps}
                  showPrevOnFirstStep={wizardShowPrevOnFirstStep}
                  showProgress
                  progressProps={{
                    label: `Шаг ${wizardGuardedProgress.current} из ${wizardGuardedProgress.total || 0}`,
                    showValue: true,
                    variant: 'info',
                    size: 'sm',
                  }}
                  stepsOrientation="vertical"
                  template={({ stepsNode, progressNode, contentNode, actionsNode }) => (
                    <Stack gap="14px">
                      <div className="wizardSplit">
                        <div className="wizardSplitSteps">
                          {stepsNode}
                        </div>
                        <div className="wizardSplitContent">
                          {contentNode}
                        </div>
                      </div>
                      {progressNode}
                      {actionsNode}
                    </Stack>
                  )}
                  onStepStateChange={({ progress }) => setWizardGuardedProgress(progress)}
                  onComplete={() => pushToast('success')}
                >
                  <Wizard.Step<WizardGuardedState>
                    id="profile"
                    title="Профиль"
                    description="Email"
                    canExit={({ state }) => state.email.trim().includes('@')}
                  >
                    <Input>
                      <Input.Label>Email</Input.Label>
                      <Input.Field
                        name="wizard-profile-email"
                        type="email"
                        placeholder="name@example.com"
                        value={wizardGuardedState.email}
                        onChange={(event) => setWizardGuardedState((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))}
                      />
                    </Input>
                  </Wizard.Step>
                  <Wizard.Step<WizardGuardedState>
                    id="plan"
                    title="Тариф"
                    description="Выбор"
                    canEnter={({ state }) => state.email.trim().includes('@')}
                    canExit={({ state }) => state.plan !== ''}
                  >
                    <Row gap="12px" wrap="wrap">
                      <Input.Radio
                        name="wizard-plan"
                        label="Basic"
                        checked={wizardGuardedState.plan === 'basic'}
                        onChange={() => setWizardGuardedState((prev) => ({ ...prev, plan: 'basic' }))}
                      />
                      <Input.Radio
                        name="wizard-plan"
                        label="Pro"
                        checked={wizardGuardedState.plan === 'pro'}
                        onChange={() => setWizardGuardedState((prev) => ({ ...prev, plan: 'pro' }))}
                      />
                      <Input.Radio
                        name="wizard-plan"
                        label="Enterprise"
                        checked={wizardGuardedState.plan === 'enterprise'}
                        onChange={() => setWizardGuardedState((prev) => ({ ...prev, plan: 'enterprise' }))}
                      />
                    </Row>
                  </Wizard.Step>
                  <Wizard.Step<WizardGuardedState>
                    id="confirm"
                    title="Подтверждение"
                    description="Проверка"
                    canEnter={({ state }) => state.plan !== ''}
                  >
                    <Stack gap="12px">
                      <Text size="sm">Email: {wizardGuardedState.email || '—'}</Text>
                      <Text size="sm">Тариф: {wizardGuardedState.plan || '—'}</Text>
                      <Input.Checkbox
                        label="Данные подтверждены"
                        checked={wizardGuardedState.approved}
                        onChange={(event) => setWizardGuardedState((prev) => ({
                          ...prev,
                          approved: event.target.checked,
                        }))}
                      />
                    </Stack>
                  </Wizard.Step>
                </Wizard>
              </Stack>
            </Card.Body>
          </Card>

          <Card className="gridCard gridCardWide">
            <Card.Header title="Wizard · Много шагов" subtitle="Окно шагов: показывается только часть списка вокруг текущего." />
            <Card.Body>
              <Wizard<WizardWindowState>
                state={wizardWindowState}
                stepsViewMode="window"
                stepsWindowSize={4}
                stepsWindowSizeByBreakpoint={{
                  sm: 1,
                  md: 2,
                  lg: 3,
                  xl: 4,
                }}
                showFutureSteps
                showPrevOnFirstStep
                showProgress
                progressProps={{
                  label: 'Прогресс',
                  showValue: true,
                  variant: 'primary',
                  size: 'sm',
                }}
              >
                <Wizard.Step id="s1" title="Инициализация" description="Шаг 1">
                  <Text size="sm">Проект: {wizardWindowState.project}</Text>
                </Wizard.Step>
                <Wizard.Step id="s2" title="Доступы" description="Шаг 2">
                  <Text size="sm">Проверка прав и ролей.</Text>
                </Wizard.Step>
                <Wizard.Step id="s3" title="Схема" description="Шаг 3">
                  <Text size="sm">Подготовка структуры данных.</Text>
                </Wizard.Step>
                <Wizard.Step id="s4" title="Импорт" description="Шаг 4">
                  <Text size="sm">Загрузка первичного набора.</Text>
                </Wizard.Step>
                <Wizard.Step id="s5" title="Валидация" description="Шаг 5">
                  <Text size="sm">Контроль целостности данных.</Text>
                </Wizard.Step>
                <Wizard.Step id="s6" title="Индексы" description="Шаг 6">
                  <Text size="sm">Оптимизация запросов.</Text>
                </Wizard.Step>
                <Wizard.Step id="s7" title="Финал" description="Шаг 7">
                  <Text size="sm">Проверка и завершение.</Text>
                </Wizard.Step>
              </Wizard>
            </Card.Body>
          </Card>

          <Card className="gridCard gridCardWide">
            <Card.Toolbar align="between">
              <Card.Toolbar.Group>
                <Text size="sm" muted>Всего записей: {sortedRows.length}</Text>
              </Card.Toolbar.Group>
              <Card.Toolbar.Group>
                <Row gap="8px" wrap="wrap">
                  <Button size="sm" appearance="outline">Экспорт</Button>
                  <Button size="sm" variant="primary">Добавить</Button>
                </Row>
              </Card.Toolbar.Group>
            </Card.Toolbar>
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
                      position: 'left',
                      showFooterToggle: true,
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

          <Card className="gridCard">
            <Card.Header title="Details" subtitle="Secondary-поля скрыты и раскрываются по кнопке." />
            <Card.Body>
              <Details
                columns={1}
                items={profileDetails}
                showSecondaryLabel="Показать дополнительные поля"
                hideSecondaryLabel="Скрыть дополнительные поля"
              />
            </Card.Body>
          </Card>

          <Card className="gridCard gridCardWide">
            <Card.Header title="FileUploader" />
            <Card.Body>
              <Stack gap="12px">
                <FileUploader
                  allowedTypes={['.jpg', '.png', '.pdf']}
                  allowedMimeTypes={['image/jpeg', 'image/png', 'application/pdf']}
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
        <Stack gap="12px">
          <Text>Проверка поведения выпадающих меню внутри модалки.</Text>
          <Input>
            <Input.Label>Ответственный</Input.Label>
            <Input.Select
              name="modal-assignee"
              searchable
              value={modalAssignee}
              onChange={(next) => setModalAssignee(next as string)}
              options={[
                { value: 'pm', label: 'Project manager' },
                { value: 'qa', label: 'QA engineer' },
                { value: 'dev', label: 'Frontend developer' },
                { value: 'ops', label: 'DevOps engineer' },
                { value: 'support', label: 'Support specialist' },
              ]}
              placeholder="Выберите сотрудника"
            />
          </Input>
          <Text muted size="sm">
            Если экран маленький и body модалки скроллится, список должен открываться поверх modal-body и не ломать скролл.
          </Text>
          <Text size="sm" muted>
            Дополнительный контент для проверки переполнения и прокрутки на мобильных устройствах.
          </Text>
          <Text size="sm" muted>
            При открытом списке прокрутка должна оставаться у модалки, а не у внутреннего контейнера селекта.
          </Text>
        </Stack>
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
