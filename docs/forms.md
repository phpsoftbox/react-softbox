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

### Ошибка через Tooltip

```tsx
<Input>
  <Input.Label>Почта</Input.Label>
  <Input.Control>
    <Input.Field hasError placeholder="name@example.com" />
    <Input.ErrorTooltip content="Некорректный email" />
  </Input.Control>
</Input>

<Input>
  <Input.Label>Телефон</Input.Label>
  <Input.Field hasError placeholder="+7 (___) ___-__-__" />
  <Input.ErrorTooltip target="input" content="Введите номер" placement="right" />
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

## Checkbox

```tsx
<Input.Checkbox label="Согласен с условиями" />
<Input.Checkbox label="Премиум" description="Расширенные права" />
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

`value` и `options.value` могут быть `string` или `number`.

Для строгой типизации можно указать тип значения:

```tsx
import type { SelectOption } from '@phpsoftbox/react-softbox';

type StatusValue = 10 | 20 | 30;

const statusOptions = [
  { value: 10, label: 'Active' },
  { value: 20, label: 'Blocked' },
  { value: 30, label: 'Deleted' },
] satisfies SelectOption<StatusValue>[];

<Input.Select<StatusValue>
  options={statusOptions}
  value={status}
  onChange={(value) => setStatus(value)}
/>;
```

### Поиск + multiple

```tsx
<Input>
  <Input.Label>Сервисы</Input.Label>
  <Input.Select options={options} multiple searchable />
</Input>
```

В `multiple searchable` выбранные значения отображаются tag-ами прямо в открытом control, поэтому dropdown остается открыт для серии выборов. Если нужно закрывать его после выбора, передайте `closeOnSelect`.

### Пустое значение и сброс

```tsx
<Input>
  <Input.Label>Статус</Input.Label>
  <Input.Select
    options={options}
    allowEmptyValue
    emptyOptionLabel="Не выбрано"
    searchable
    clearable
  />
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

`value` можно передавать как в маске, так и в виде "сырых" символов — компонент сам нормализует.

Если нужно указать литеральный символ маски `9`/`A`/`*`, экранируйте его через `\`:

```tsx
<Input.MaskedInput mask="+7 (\\9 99) 999-99-99" />
```

## Number (money)

```tsx
<Input>
  <Input.Label>Сумма</Input.Label>
  <Input.Number placeholder="0.00" />
</Input>
```

Дополнительно можно задать `min`, `max`, `allowNegative`, `decimalScale`:

```tsx
<Input>
  <Input.Label>Скидка</Input.Label>
  <Input.Number min={0} max={100} decimalScale={0} />
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
    <Input.Group.Label>₽</Input.Group.Label>
    <Input.Number placeholder="0.00" />
    <Input.Group.Text>без НДС</Input.Group.Text>
  </Input.Group>
</Input>

<Input>
  <Input.Label>Телефон</Input.Label>
  <Input.Group stretch>
    <Input.Select
      value={country}
      options={countryOptions}
      style={{ flex: '0 0 150px' }}
      onChange={(next) => {
        setCountry(next);
        setPhone('');
      }}
    />
    <Input.MaskedInput mask={phoneMasks[country]} value={phone} onChange={setPhone} />
  </Input.Group>
</Input>

<Input>
  <Input.Label>Скидка</Input.Label>
  <Input.Group stretch>
    <Input.Group.Choice>
      <Input.Radio name="discount" label="%" />
    </Input.Group.Choice>
    <Input.Number placeholder="10" />
  </Input.Group>
</Input>
```

## FileUploader

```tsx
<FileUploader
  allowedTypes={['.jpg', '.png', '.pdf']}
  maxFileSizeKb={2048}
  multiple
  showPreview
  onChange={(files) => console.log(files)}
  onUpload={(files) => api.upload(files)}
/>;
```

Параметры:
- `allowedTypes` — допустимые типы (расширения `.png` или MIME `image/*`)
- `maxFileSizeKb` — ограничение размера
- `multiple` — разрешить множественный выбор
- `showPreview` — превью для изображений
- `onUpload` — колбэк загрузки (опционально)
