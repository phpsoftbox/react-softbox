# Details

Компонент для компактного вывода модели в формате `label / value`.

## Details

```tsx
<Details
  columns={2}
  items={[
    { label: 'ID', value: 'USR-1024' },
    { label: 'Email', value: 'anna@company.test' },
    { label: 'Телефон', value: '+7 999 123-45-67', priority: 'secondary' },
    { label: 'Комментарий', value: null, fullWidth: true, priority: 'secondary' },
  ]}
/>
```

- `columns`: `1 | 2 | 3`
- `emptyValue`: значение по умолчанию для `null/undefined/''` (по умолчанию `—`)
- `fullWidth` у элемента растягивает строку на всю ширину сетки
- `priority: 'secondary'` помечает поле как второстепенное
- `collapseSecondary` включает сворачивание secondary-полей (по умолчанию `true`)
- `defaultSecondaryOpen` задает начальное состояние secondary-блока
- `showSecondaryLabel` / `hideSecondaryLabel` настраивают подписи кнопки раскрытия
