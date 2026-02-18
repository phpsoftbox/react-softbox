import React from 'react';
import axios from 'axios';
import styles from './Select.module.css';
import useDropdownPosition from '../../../hooks/useDropdownPosition';
import { useFormFieldContext } from '../FormField/FormField';

export type SelectOptionValue = string | number | null;

export type SelectOption<T extends string | number = string | number> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type SelectEmptyOption<T extends string | number> = {
  value: T | null;
  label: string;
  disabled?: boolean;
};

type SelectItem<T extends string | number> = SelectOption<T> | SelectEmptyOption<T>;

type RequestConfig<T extends string | number = string | number> = {
  url: string;
  method?: 'get' | 'post';
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
  mapOptions?: (data: unknown) => SelectOption<T>[];
};

type SharedProps<T extends string | number> = {
  label?: string;
  id?: string;
  name?: string;
  options?: SelectOption<T>[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  clearLabel?: string;
  allowEmptyValue?: boolean;
  emptyOptionLabel?: string;
  emptyOptionValue?: T | null;
  loadingText?: string;
  emptyText?: string;
  loadOptions?: (query: string) => Promise<SelectOption<T>[]>;
  request?: RequestConfig<T>;
  onAfterRequest?: (options: SelectOption<T>[], query: string) => void;
  placement?: 'auto' | 'down' | 'up';
  disabled?: boolean;
  floatLabel?: boolean;
  className?: string;
};

type SingleProps<T extends string | number> = SharedProps<T> & {
  multiple?: false;
  clearable?: false;
  allowEmptyValue?: false;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T, options: SelectOption<T>[]) => void;
};

type SingleClearableProps<T extends string | number> = SharedProps<T> & {
  multiple?: false;
  clearable: true;
  allowEmptyValue?: false;
  value?: T | undefined;
  defaultValue?: T | undefined;
  onChange?: (value: T | undefined, options: SelectOption<T>[]) => void;
};

type SingleAllowEmptyProps<T extends string | number> = SharedProps<T> & {
  multiple?: false;
  allowEmptyValue: true;
  clearable?: boolean;
  value?: T | null | undefined;
  defaultValue?: T | null | undefined;
  emptyOptionValue?: T | null;
  onChange?: (
    value: T | null | undefined,
    options: SelectItem<T>[]
  ) => void;
};

type MultiProps<T extends string | number> = SharedProps<T> & {
  multiple: true;
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[], options: SelectOption<T>[]) => void;
};

type Props<T extends string | number> =
  | SingleProps<T>
  | SingleClearableProps<T>
  | SingleAllowEmptyProps<T>
  | MultiProps<T>;

const defaultMapOptions = <T extends string | number>(data: unknown): SelectOption<T>[] => {
  if (Array.isArray(data)) {
    return data as SelectOption<T>[];
  }
  return [];
};

export default function Select<T extends string | number = string | number>({
  label,
  id,
  name,
  options = [],
  value,
  defaultValue,
  placeholder = 'Выберите...',
  multiple = false,
  searchable = false,
  clearable = false,
  clearLabel = 'Очистить',
  allowEmptyValue = false,
  emptyOptionLabel = 'Не выбрано',
  emptyOptionValue,
  loadingText = 'Загрузка...',
  emptyText = 'Нет данных',
  loadOptions,
  request,
  onAfterRequest,
  placement = 'auto',
  disabled = false,
  floatLabel = false,
  className,
  onChange,
}: Props<T>) {
  const resolvedOptions = options as SelectOption<T>[];
  const resolvedLoadOptions = loadOptions as ((query: string) => Promise<SelectOption<T>[]>) | undefined;
  const resolvedRequest = request as RequestConfig<T> | undefined;
  const resolvedOnAfterRequest = onAfterRequest as ((options: SelectOption<T>[], query: string) => void) | undefined;
  const context = useFormFieldContext();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const isRemote = Boolean(resolvedLoadOptions || resolvedRequest);
  const [items, setItems] = React.useState<SelectOption<T>[]>(resolvedOptions);
  const controlRef = React.useRef<HTMLButtonElement>(null);
  const { ref: dropdownRef, style: dropdownStyle } = useDropdownPosition(open, {
    gap: 6,
    align: 'left',
    placement,
    anchorRef: controlRef,
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const generatedId = React.useId();
  const labelId = React.useId();
  const listId = React.useId();
  const controlId = id ?? context?.fieldId ?? generatedId;
  const hasLabel = Boolean(label);

  const isControlled = value !== undefined;
  const allowEmpty = allowEmptyValue && !multiple;
  const resolvedEmptyValue = (emptyOptionValue ?? null) as T | null;
  const [internalValue, setInternalValue] = React.useState<T | T[] | null | undefined>(
    defaultValue ?? (multiple ? [] : allowEmpty ? resolvedEmptyValue ?? undefined : undefined),
  );
  const emptyOption = React.useMemo<SelectEmptyOption<T> | null>(
    () => (allowEmpty ? { value: resolvedEmptyValue, label: emptyOptionLabel, disabled: false } : null),
    [allowEmpty, emptyOptionLabel, resolvedEmptyValue],
  );

  React.useEffect(() => {
    if (!isRemote) {
      setItems(resolvedOptions);
    }
  }, [resolvedOptions, isRemote]);

  React.useEffect(() => {
    if (!open || !isRemote) {
      return;
    }

    let active = true;
    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        let next: SelectOption<T>[] = [];
        if (resolvedLoadOptions) {
          next = await resolvedLoadOptions(query);
        } else if (resolvedRequest) {
          const response = await axios({
            url: resolvedRequest.url,
            method: resolvedRequest.method ?? 'get',
            params: { ...resolvedRequest.params, q: query },
            data: resolvedRequest.data,
          });
          const mapper = resolvedRequest.mapOptions ?? defaultMapOptions<T>;
          next = mapper(response.data);
        }

        if (active) {
          setItems(next);
          resolvedOnAfterRequest?.(next, query);
        }
      } catch {
        if (active) {
          setItems([]);
          resolvedOnAfterRequest?.([], query);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 200);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [open, query, isRemote, resolvedLoadOptions, resolvedRequest, resolvedOnAfterRequest]);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  React.useEffect(() => {
    context?.registerField(controlId, name);
  }, [context, controlId, name]);

  if (process.env.NODE_ENV !== 'production') {
    if (!id && !name) {
      // eslint-disable-next-line no-console
      console.warn('Input.Select: рекомендуется передавать id или name для связки с label.');
    }
  }

  React.useEffect(() => {
    if (open && searchable) {
      inputRef.current?.focus();
    }
  }, [open, searchable]);

  const allOptions = React.useMemo<SelectItem<T>[]>(
    () => (emptyOption ? [emptyOption, ...items] : items),
    [emptyOption, items],
  );
  const optionMap = React.useMemo(() => {
    return new Map(allOptions.map((item) => [item.value, item]));
  }, [allOptions]);

  const selectedValues = React.useMemo(() => {
    const raw = isControlled ? value : internalValue;
    if (multiple) {
      if (Array.isArray(raw)) {
        return raw.filter((item): item is T => item !== null && item !== undefined);
      }
      if (raw === null || raw === undefined) {
        return [];
      }
      return [raw as T];
    }
    const single = Array.isArray(raw) ? raw[0] : raw;
    if (single === undefined) {
      return allowEmpty ? resolvedEmptyValue : undefined;
    }
    if (single === null && !allowEmpty) {
      return undefined;
    }
    if (single === '' && !allowEmpty && !optionMap.has(single as T)) {
      return undefined;
    }
    return single as T | null;
  }, [value, internalValue, isControlled, multiple, allowEmpty, resolvedEmptyValue, optionMap]);

  const selectedList = React.useMemo(() => {
    if (multiple) {
      const values = selectedValues as T[];
      return values.map((val) => {
        const mapped = optionMap.get(val);
        if (mapped && mapped.value !== null) {
          return mapped as SelectOption<T>;
        }
        return { value: val, label: String(val) } as SelectOption<T>;
      });
    }
    const single = selectedValues as T | null | undefined;
    if (single === undefined) {
      return [];
    }
    const fallbackLabel = single === null ? emptyOptionLabel : String(single);
    return [optionMap.get(single) ?? { value: single, label: fallbackLabel }];
  }, [selectedValues, optionMap, multiple, emptyOptionLabel]);

  const hasValue = multiple ? (selectedValues as T[]).length > 0 : selectedValues !== undefined;
  const isEmptySelection = !multiple && allowEmpty && selectedValues === resolvedEmptyValue;
  const floatActive = floatLabel && (open || hasValue);

  const displayedOptions = React.useMemo(() => {
    if (isRemote) {
      const filtered = items;
      return emptyOption ? [emptyOption, ...filtered] : filtered;
    }

    if (!query) {
      return emptyOption ? [emptyOption, ...items] : items;
    }

    const lowered = query.toLowerCase();
    const filtered = items.filter((item) => item.label.toLowerCase().includes(lowered));
    return emptyOption ? [emptyOption, ...filtered] : filtered;
  }, [items, query, isRemote, emptyOption]);

  const updateValue = (next: T | T[] | null | undefined, nextOptions: SelectItem<T>[]) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    if (multiple) {
      (onChange as MultiProps<T>['onChange'])?.(next as T[], nextOptions as SelectOption<T>[]);
    } else {
      if (allowEmpty) {
        (onChange as SingleAllowEmptyProps<T>['onChange'])?.(next as T | null | undefined, nextOptions);
      } else {
        if (clearable) {
          (onChange as SingleClearableProps<T>['onChange'])?.(
            next as T | undefined,
            nextOptions as SelectOption<T>[],
          );
        } else {
          (onChange as SingleProps<T>['onChange'])?.(
            next as T,
            nextOptions as SelectOption<T>[],
          );
        }
      }
    }
  };

  const handleSelect = (option: SelectItem<T>) => {
    if (option.disabled) {
      return;
    }

    if (multiple) {
      if (option.value === null) {
        return;
      }
      const list = selectedValues as T[];
      const exists = list.includes(option.value);
      const nextValues = exists ? list.filter((val) => val !== option.value) : [...list, option.value];
      const nextOptions = exists
        ? selectedList.filter((item) => item.value !== option.value)
        : [...selectedList, option];
      updateValue(nextValues, nextOptions);
    } else {
      updateValue(option.value as T | null, [option]);
      setOpen(false);
    }
  };

  const handleRemove = (valueToRemove: T | null) => {
    if (!multiple) {
      return;
    }
    if (valueToRemove === null) {
      return;
    }

    const list = selectedValues as T[];
    const nextValues = list.filter((val) => val !== valueToRemove);
    const nextOptions = selectedList.filter((item) => item.value !== valueToRemove);
    updateValue(nextValues, nextOptions);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const showClear = clearable && searchable && !disabled && hasValue && !isEmptySelection;

  const handleClear = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    const nextValue = multiple ? [] : allowEmpty ? (resolvedEmptyValue as T) : undefined;
    const nextOptions = multiple ? [] : allowEmpty && emptyOption ? [emptyOption] : [];
    updateValue(nextValue, nextOptions);
    setQuery('');
  };

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-open={open}
      data-has-value={hasValue}
      data-has-query={query.length > 0}
      data-has-label={hasLabel}
      data-float-label={floatLabel ? 'true' : undefined}
      data-float-active={floatActive ? 'true' : undefined}
      data-has-clear={showClear ? 'true' : undefined}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {label ? (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      ) : null}
      <button
        type="button"
        className={styles.control}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={label ? labelId : undefined}
        id={controlId}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        ref={controlRef}
      >
        <div className={styles.value}>
          {hasValue ? (
            multiple ? (
              selectedList.map((item) => (
                <span key={String(item.value)} className={styles.tag}>
                  {item.label}
                  <span
                    role="button"
                    tabIndex={0}
                    className={styles.remove}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRemove(item.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        event.stopPropagation();
                        handleRemove(item.value);
                      }
                    }}
                    aria-label={`Удалить ${item.label}`}
                  >
                    ×
                  </span>
                </span>
              ))
            ) : (
              <span>{selectedList[0]?.label}</span>
            )
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
        <span className={styles.controls}>
          {showClear ? (
            <span
              role="button"
              tabIndex={0}
              className={styles.clearButton}
              aria-label={clearLabel}
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleClear}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleClear(event);
                }
              }}
            >
              ×
            </span>
          ) : null}
          <span className={styles.chevron} aria-hidden="true" />
        </span>
      </button>

      {open ? (
        <div className={styles.dropdown} ref={dropdownRef} style={dropdownStyle}>
          {searchable ? (
            <input
              ref={inputRef}
              className={styles.search}
              placeholder="Поиск..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          ) : null}
          <div className={styles.list} role="listbox" id={listId}>
            {loading ? <div className={styles.status}>{loadingText}</div> : null}
            {!loading && (allowEmpty ? displayedOptions.length <= 1 : displayedOptions.length === 0) ? (
              <div className={styles.status}>{emptyText}</div>
            ) : null}
            {!loading
              ? displayedOptions.map((option) => {
                  const selected = multiple
                    ? option.value !== null && (selectedValues as T[]).includes(option.value as T)
                    : selectedValues === option.value;

                  return (
                    <button
                      key={option.value ?? '__empty'}
                      type="button"
                      className={[
                        styles.option,
                        selected ? styles.optionSelected : null,
                        option.disabled ? styles.optionDisabled : null,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      role="option"
                      aria-selected={selected}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleSelect(option);
                      }}
                      onClick={(event) => {
                        if (event.detail === 0) {
                          handleSelect(option);
                        }
                      }}
                      disabled={option.disabled}
                    >
                      <span>{option.label}</span>
                      {selected ? <span className={styles.check}>✓</span> : null}
                    </button>
                  );
                })
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

Select.supportsFloatLabel = true;
