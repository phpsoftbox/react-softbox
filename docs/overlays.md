# Overlays

## Modal

```tsx
<Modal open={open} title="Заголовок" lockScroll onClose={() => setOpen(false)}>
  Контент модалки
</Modal>
```

Поддерживает `footer` для действий и `lockScroll` для блокировки скролла страницы (по умолчанию `true`).

## Drawer

```tsx
<Drawer open={open} title="Меню" position="left" onClose={() => setOpen(false)}>
  Контент шторки
</Drawer>
```

`position` может быть `left` или `right`.

### Inline режим

Если нужен «постоянный» сайдбар:

```tsx
<Drawer open mode="inline" position="left" showHeader={false} showClose={false}>
  Контент навигации
</Drawer>
```
