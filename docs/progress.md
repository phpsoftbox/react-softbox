# Progress

`Progress` — индикатор выполнения задач.

## Примеры

```tsx
<Progress value={40} label="Миграции" />
<Progress value={72} label="Сборка" variant="primary" />
<Progress value={88} label="Тесты" variant="info" showValue />
<Progress value={36} label="Мини" variant="success" size="sm" showValue />
<Progress value={92} label="Крупный" variant="warning" size="lg" showValue />
<Progress label="Синхронизация" indeterminate />
```

## Варианты

- `variant`: `default`, `primary`, `info`, `success`, `warning`, `danger`.
- `size`: `sm`, `md`, `lg`; меняет высоту трека и размер шрифта `label`/`showValue`.
- `indeterminate`: бесконечная анимация, без значения.
