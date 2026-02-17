# Tooltip

`Tooltip` — всплывающая подсказка для элементов интерфейса.

## Базовый пример

```tsx
<Tooltip content="Подсказка">
  <Button>Наведи</Button>
</Tooltip>
```

## Направление

`placement`: `auto` | `top` | `bottom` | `left` | `right`.

```tsx
<Tooltip content="Справа" placement="right">
  <span>Help</span>
</Tooltip>
```

## Интерактивный контент

Если нужно, чтобы подсказка не исчезала при наведении мышью на сам tooltip (например, есть ссылки), включите `interactive`.

```tsx
<Tooltip
  interactive
  content={
    <>
      <Tooltip.Header>Подробности</Tooltip.Header>
      <Tooltip.Body>
        Перейдите в <a href="/docs">документацию</a>.
      </Tooltip.Body>
      <Tooltip.Footer>Последнее обновление: сегодня</Tooltip.Footer>
    </>
  }
>
  <Button>Подробнее</Button>
</Tooltip>
```

## Варианты

`variant`: `default` | `info` | `success` | `warning` | `danger`.

```tsx
<Tooltip content="Важно" variant="warning">
  <span>!</span>
</Tooltip>
```

## Header / Body / Footer

```tsx
<Tooltip
  content={
    <>
      <Tooltip.Header>Заголовок</Tooltip.Header>
      <Tooltip.Body>Подробности и описание.</Tooltip.Body>
      <Tooltip.Footer>Доп. инфо</Tooltip.Footer>
    </>
  }
>
  <Button>Подробнее</Button>
</Tooltip>
```
