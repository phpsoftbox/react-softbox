# Журнал изменений

## [Unreleased]

### Added
- Polymorphic `Button` and `Card.Toolbar.Button` via `as` for native links and external link components.
- Public toolbar types: `CardToolbarProps`, `CardToolbarGroupProps`, `CardToolbarButtonProps`.
- Toolbar icon-only button sizing tokens and stable square icon-only mode.

### Changed
- `Card.Toolbar.Button` now has toolbar-specific `sm` / `md` / `lg` sizing with `md` as the default.

### Fixed
- Disabled link buttons now expose `aria-disabled`, are removed from the tab order, and block click handlers.
