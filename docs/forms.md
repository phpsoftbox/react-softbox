# Forms

## Input

```tsx
<Input>
  <Input.Label>Email</Input.Label>
  <Input.Field placeholder="name@example.com" />
</Input>

<Input>
  <Input.Label>Ошибка</Input.Label>
  <Input.Field hasError placeholder="Введите корректные данные" />
  <Input.ErrorBag>Поле заполнено неверно.</Input.ErrorBag>
</Input>

<Input layout="row" labelWidth={140}>
  <Input.Label>Телефон</Input.Label>
  <Input.Field placeholder="+7 (___) ___‑__‑__" />
</Input>
```

## Textarea

```tsx
<Input>
  <Input.Label>Комментарий</Input.Label>
  <Input.TextArea placeholder="Текст..." />
</Input>

<Input layout="row" labelWidth={140}>
  <Input.Label>Описание</Input.Label>
  <Input.TextArea />
</Input>
```

## Radio

```tsx
<Input.Radio name="mode" label="Основной" />
<Input.Radio name="mode" label="Резервный" />
```

## Switch

```tsx
<Input.Switch label="Автообновления" defaultChecked />
```

## FloatLabel

```tsx
<Input>
  <Input.FloatLabel label="Email">
    <Input.Field name="email" />
  </Input.FloatLabel>
</Input>

<Input>
  <Input.FloatLabel label="Комментарий">
    <Input.TextArea rows={4} />
  </Input.FloatLabel>
</Input>
```

`FloatLabel` добавляет placeholder и прокидывает `hasError` в вложенное поле.

## Select

### Статический список

```tsx
const options = [
  { value: 'dev', label: 'Development' },
  { value: 'prod', label: 'Production' },
];

<Input>
  <Input.Label>Окружение</Input.Label>
  <Input.Select options={options} />
</Input>
```

### Поиск + multiple

```tsx
<Input>
  <Input.Label>Сервисы</Input.Label>
  <Input.Select options={options} multiple searchable />
</Input>
```

### Загрузка через axios

```tsx
<Input>
  <Input.Label>Пользователь</Input.Label>
  <Input.Select
    request={{
      url: '/api/users',
      method: 'get',
      mapOptions: (data) => data.items.map((item) => ({ value: item.id, label: item.name })),
    }}
    onAfterRequest={(options, query) => console.log(options, query)}
  />
</Input>
```

## MaskedInput

```tsx
<Input>
  <Input.Label>Телефон</Input.Label>
  <Input.MaskedInput mask="+7 (999) 999-99-99" />
</Input>
```

## Number (money)

```tsx
<Input>
  <Input.Label>Сумма</Input.Label>
  <Input.Number placeholder="0.00" />
</Input>
```

## Date / Time

```tsx
<Input>
  <Input.Label>Дата</Input.Label>
  <Input.DatePicker />
</Input>

<Input>
  <Input.Label>Дата и время</Input.Label>
  <Input.DatePicker withTime />
</Input>

<Input>
  <Input.Label>Время</Input.Label>
  <Input.TimePicker />
</Input>
```

## Интервал дат

```tsx
<Input>
  <Input.Label>Период</Input.Label>
  <Input.DateRange />
</Input>
```

## InputGroup

```tsx
<Input>
  <Input.Label>Цена</Input.Label>
  <Input.Group stretch>
    <Input.Addon>₽</Input.Addon>
    <Input.Number placeholder="0.00" />
    <Button appearance="outline">OK</Button>
  </Input.Group>
</Input>
```
