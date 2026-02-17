import React from 'react';
import axios from 'axios';
import styles from './Select.module.css';
import useDropdownPosition from '../../../hooks/useDropdownPosition';
import { useFormFieldContext } from '../FormField/FormField';

export type SelectOption = {
  value: string | null;
  label: string;
  disabled?: boolean;
};

type RequestConfig = {
  url: string;
  method?: 'get' | 'post';
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
  mapOptions?: (data: unknown) => SelectOption[];
};

type Props = {
  label?: string;
  id?: string;
  name?: string;
  options?: SelectOption[];
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  clearLabel?: string;
  allowEmptyValue?: boolean;
  emptyOptionLabel?: string;
  emptyOptionValue?: string | null;
  loadingText?: string;
  emptyText?: string;
  loadOptions?: (query: string) => Promise<SelectOption[]>;
  request?: RequestConfig;
  onAfterRequest?: (options: SelectOption[], query: string) => void;
  placement?: 'auto' | 'down' | 'up';
  disabled?: boolean;
  floatLabel?: boolean;
  className?: string;
  onChange?: (value: string | string[] | null, options: SelectOption[]) => void;
};

const defaultMapOptions = (data: unknown): SelectOption[] => {
  if (Array.isArray(data)) {
    return data as SelectOption[];
  }
  return [];
};

export default function Select({
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
}: Props) {
  const context = useFormFieldContext();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const isRemote = Boolean(loadOptions || request);
  const [items, setItems] = React.useState<SelectOption[]>(options);
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
  const [internalValue, setInternalValue] = React.useState<string | string[] | null>(
    defaultValue ?? (multiple ? [] : ''),
  );
  const allowEmpty = allowEmptyValue && !multiple;
  const resolvedEmptyValue = emptyOptionValue ?? null;
  const emptyOption = React.useMemo(
    () => (allowEmpty ? { value: resolvedEmptyValue, label: emptyOptionLabel } : null),
    [allowEmpty, emptyOptionLabel, resolvedEmptyValue],
  );

  const selectedValues = React.useMemo(() => {
    const raw = isControlled ? value : internalValue;
    if (multiple) {
      return Array.isArray(raw) ? raw : raw ? [raw] : [];
    }
    if (Array.isArray(raw)) {
      return raw[0] ?? '';
    }
    return raw === undefined ? '' : raw;
  }, [value, internalValue, isControlled, multiple]);

  React.useEffect(() => {
    if (!isRemote) {
      setItems(options);
    }
  }, [options, isRemote]);

  React.useEffect(() => {
    if (!open || !isRemote) {
      return;
    }

    let active = true;
    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        let next: SelectOption[] = [];
        if (loadOptions) {
          next = await loadOptions(query);
        } else if (request) {
          const response = await axios({
            url: request.url,
            method: request.method ?? 'get',
            params: { ...request.params, q: query },
            data: request.data,
          });
          const mapper = request.mapOptions ?? defaultMapOptions;
          next = mapper(response.data);
        }

        if (active) {
          setItems(next);
          onAfterRequest?.(next, query);
        }
      } catch {
        if (active) {
          setItems([]);
          onAfterRequest?.([], query);
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
  }, [open, query, isRemote, loadOptions, request]);

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

  const allOptions = React.useMemo(() => (emptyOption ? [emptyOption, ...items] : items), [emptyOption, items]);
  const optionMap = React.useMemo(() => {
    return new Map(allOptions.map((item) => [item.value, item]));
  }, [allOptions]);

  const selectedList = React.useMemo(() => {
    if (multiple) {
      const values = selectedValues as string[];
      return values.map((val) => optionMap.get(val) ?? { value: val, label: val });
    }
    const single = selectedValues as string | null;
    if (single === '' || (single === null && !allowEmpty)) {
      return [];
    }
    const fallbackLabel = single === null ? emptyOptionLabel : String(single);
    return [optionMap.get(single) ?? { value: single, label: fallbackLabel }];
  }, [selectedValues, optionMap, multiple, allowEmpty, emptyOptionLabel]);

  const hasValue = multiple
    ? (selectedValues as string[]).length > 0
    : selectedValues !== '' && selectedValues !== undefined && (selectedValues !== null || allowEmpty);
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

  const updateValue = (next: string | string[] | null, nextOptions: SelectOption[]) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next, nextOptions);
  };

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) {
      return;
    }

    if (multiple) {
      if (option.value === null) {
        return;
      }
      const list = selectedValues as string[];
      const exists = list.includes(option.value);
      const nextValues = exists ? list.filter((val) => val !== option.value) : [...list, option.value];
      const nextOptions = exists
        ? selectedList.filter((item) => item.value !== option.value)
        : [...selectedList, option];
      updateValue(nextValues, nextOptions);
    } else {
      updateValue(option.value, [option]);
      setOpen(false);
    }
  };

  const handleRemove = (valueToRemove: string) => {
    if (!multiple) {
      return;
    }

    const list = selectedValues as string[];
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
    const nextValue = multiple ? [] : allowEmpty ? resolvedEmptyValue : '';
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
                <span key={item.value} className={styles.tag}>
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
                    ? option.value !== null && (selectedValues as string[]).includes(option.value)
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
