# Typography

Компоненты для текста и заголовков с единым набором цветовых вариантов.

## Heading

```tsx
<Heading level={1}>Dashboard</Heading>
<Heading level={2} variant="primary">Сводка</Heading>
<Heading level={4} muted>Вспомогательный заголовок</Heading>
```

## Text

```tsx
<Text>Базовый текст</Text>
<Text size="sm" muted>Подпись</Text>
<Text weight="semibold">Полужирный</Text>
<Text italic>Курсив</Text>
<Text underline>Подчеркнутый</Text>
<Text strike>Зачеркнутый</Text>
<Text code>npm run dev</Text>
<Text variant="warning">Предупреждение</Text>
```

Поддерживаемые варианты: `default`, `primary`, `info`, `success`, `warning`, `danger`.

## Утилитарные классы размера

Можно задавать размер шрифта через классы `f-1`…`f-9`.

```tsx
<Dropdown.Header className="f-6">Уведомления</Dropdown.Header>
<Text className="f-3">Подпись</Text>
```

Шкала (px): `11, 12, 13, 14, 16, 18, 20, 24, 28`.
