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
