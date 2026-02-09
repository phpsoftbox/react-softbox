# Feedback

Все статусные компоненты используют единый набор вариантов: `default`, `primary`, `info`, `success`, `warning`, `danger`.

## Badge

```tsx
<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
```

## Alert

```tsx
<Alert title="Info">Синхронизация завершится через 3 минуты.</Alert>
<Alert variant="success" title="Success">Релиз опубликован успешно.</Alert>
<Alert variant="warning" title="Warning">Лимит запросов близок к максимуму.</Alert>
<Alert variant="danger" title="Danger" onClose={() => {}}>
  Ошибка доступа к сервису хранения.
</Alert>
```

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
