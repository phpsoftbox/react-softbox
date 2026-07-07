# Feedback

Все статусные компоненты используют единый набор встроенных вариантов: `default`, `primary`, `secondary`, `info`, `success`, `warning`, `danger`, `dark`, `light`, `neutral`.

Также поддерживаются custom variants через токены `--variant-{name}-*`; пример контракта описан в `theme.md`.

## Badge

```tsx
<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="brand">Brand</Badge>
<Badge size="sm" variant="info">Small</Badge>
<Badge size="md" variant="info">Medium</Badge>
<Badge size="lg" variant="info">Large</Badge>
<Badge variant="success" className="rounded-pill">Pill</Badge>
<Badge variant="warning" className="rounded-circle size-6 p-0 f-2">3</Badge>
<Badge variant="info" className="border border-info text-uppercase f-2">helper styled</Badge>
<Badge variant="danger" dot aria-label="Ошибка" className="p-2" />
```

`Badge` не меняет регистр текста и не задает font-size. Для декоративных решений используйте helpers: `text-uppercase`, `f-2`, `border`, `rounded-pill`, `rounded-circle` и т.д.

## Alert

```tsx
<Alert title="Info">Синхронизация завершится через 3 минуты.</Alert>
<Alert variant="success" title="Success">Релиз опубликован успешно.</Alert>
<Alert variant="success" title="Success" iconBgFilled>Релиз опубликован успешно.</Alert>
<Alert variant="warning" title="Warning">Лимит запросов близок к максимуму.</Alert>
<Alert variant="danger" title="Danger" onClose={() => {}}>
  Ошибка доступа к сервису хранения.
</Alert>
```

`iconBgFilled` включает подложку у иконки. Цвета подложки задаются CSS-переменными:
- `--alert-icon-bg`
- `--alert-icon-bg-border`

## Notifier

```tsx
<Notifier
  items={[
    { id: '1', title: 'Оповещение', message: 'Проверка уведомления', variant: 'info', duration: 3000 },
  ]}
  onDismiss={(id) => console.log(id)}
/>
```

`duration` включает авто‑dismiss и отображает таймер‑полосу внизу уведомления. Таймер ставится на паузу при наведении и когда вкладка браузера неактивна.
