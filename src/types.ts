export type BuiltinUiVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'dark'
  | 'light'
  | 'neutral';

export type CustomUiVariant = string & {};

export type UiVariant = BuiltinUiVariant | CustomUiVariant;
