# Card

`Card` — базовый контейнер для секций.

```tsx
<Card>
  <Card.Header title="Заголовок" right={<Button appearance="ghost">...</Button>} />
  <Card.Body>Контент</Card.Body>
  <Card.Footer>
    <Button appearance="ghost">Отмена</Button>
    <Button>Сохранить</Button>
  </Card.Footer>
</Card>
```

`Card.Header` умеет принимать:
- `title` и `subtitle`
- `right` для иконок/кнопок

## Toolbar

```tsx
<Card.Toolbar>
  <Card.Toolbar.Group>
    <Card.Toolbar.Button icon={<SaveIcon />} label="Сохранить" />
    <Card.Toolbar.Button icon={<RefreshIcon />} />
  </Card.Toolbar.Group>
</Card.Toolbar>
```

`Card.Toolbar.Button` принимает `icon` и/или `label` (минимум одно из них обязательно).
Если переданы оба, внутри кнопки появится вертикальный разделитель. На средних экранах текстовая часть скрывается.

Скрытие текста включено по умолчанию (`md`) и настраивается:
- на уровне `Card.Toolbar`: `buttonHideLabelOn="md" | "never"`
- на уровне конкретной кнопки: `hideLabelOn="md" | "never"` (переопределяет тулбар)
