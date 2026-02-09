# Tabs

`Tabs` — переключатель контентных панелей. Поддерживает горизонтальное и вертикальное расположение.

## Базовое использование

```tsx
const items = [
  { id: 'overview', label: 'Обзор', content: 'Основная информация' },
  { id: 'metrics', label: 'Метрики', content: 'Графики и показатели' },
  { id: 'settings', label: 'Настройки', content: 'Скоро', disabled: true },
];

<Tabs items={items} />
```

## Управляемое состояние

```tsx
const [activeId, setActiveId] = useState('overview');

<Tabs items={items} activeId={activeId} onChange={setActiveId} />;
```

## Вертикальная ориентация

```tsx
<Tabs items={items} orientation="vertical" />;
```

## Дополнительно

- `badge` — дополнительная метка справа (например, `<Badge variant="info">3</Badge>`).
- `defaultActiveId` — активная вкладка по умолчанию (uncontrolled).
