# Progress

`Progress` — индикатор выполнения задач.

## Примеры

```tsx
<Progress value={40} label="Миграции" />
<Progress value={72} label="Сборка" variant="primary" />
<Progress value={88} label="Тесты" variant="info" showValue />
<Progress label="Синхронизация" indeterminate />
```

## Варианты

- `variant`: `default`, `primary`, `info`, `success`, `warning`, `danger`.
- `size`: `sm`, `md`, `lg`.
- `indeterminate`: бесконечная анимация, без значения.
