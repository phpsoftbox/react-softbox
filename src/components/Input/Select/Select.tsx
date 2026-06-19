import React from 'react';
import axios from 'axios';
import { createPortal } from 'react-dom';
import styles from './Select.module.css';
import useDropdownPosition from '../../../hooks/useDropdownPosition';
import { useFormFieldContext } from '../FormField/FormField';
import ActionStack, { countActionItems } from '../ActionStack/ActionStack';

export type SelectOptionValue = string | number | null;

export type SelectOption<T extends string | number = string | number, M = unknown> = {
  value: T;
  label: string;
  disabled?: boolean;
  meta?: M;
};

type SelectEmptyOption<T extends string | number, M = unknown> = {
  value: T | null;
  label: string;
  disabled?: boolean;
  meta?: M;
};

type SelectItem<T extends string | number, M = unknown> = SelectOption<T, M> | SelectEmptyOption<T, M>;

type RequestConfig<T extends string | number = string | number, M = unknown> = {
  url: string;
  method?: 'get' | 'post';
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
  mapOptions?: (data: unknown) => SelectOption<T, M>[];
};

type SharedProps<T extends string | number, M = unknown> = {
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  options?: SelectOption<T, M>[];
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
  creatable?: boolean;
  createLabel?: (query: string) => string;
  creatingText?: string;
  onCreateOption?: (query: string) => Promise<SelectOption<T, M> | null | undefined> | SelectOption<T, M> | null | undefined;
  loadOptions?: (query: string) => Promise<SelectOption<T, M>[]>;
  request?: RequestConfig<T, M>;
  onAfterRequest?: (options: SelectOption<T, M>[], query: string) => void;
  renderOption?: (
    option: SelectItem<T, M>,
    state: {
      selected: boolean;
      active: boolean;
      multiple: boolean;
    }
  ) => React.ReactNode;
  renderValue?: (option: SelectItem<T, M>) => React.ReactNode;
  placement?: 'auto' | 'down' | 'up';
  portal?: boolean;
  disabled?: boolean;
  floatLabel?: boolean;
  endActions?: React.ReactNode;
  className?: string;
};

type SingleProps<T extends string | number, M = unknown> = SharedProps<T, M> & {
  multiple?: false;
  clearable?: false;
  allowEmptyValue?: false;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T, options: SelectOption<T, M>[]) => void;
};

type SingleClearableProps<T extends string | number, M = unknown> = SharedProps<T, M> & {
  multiple?: false;
  clearable: true;
  allowEmptyValue?: false;
  value?: T | undefined;
  defaultValue?: T | undefined;
  onChange?: (value: T | undefined, options: SelectOption<T, M>[]) => void;
};

type SingleAllowEmptyProps<T extends string | number, M = unknown> = SharedProps<T, M> & {
  multiple?: false;
  allowEmptyValue: true;
  clearable?: boolean;
  value?: T | null | undefined;
  defaultValue?: T | null | undefined;
  emptyOptionValue?: T | null;
  onChange?: (
    value: T | null | undefined,
    options: SelectItem<T, M>[]
  ) => void;
};

type MultiProps<T extends string | number, M = unknown> = SharedProps<T, M> & {
  multiple: true;
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[], options: SelectOption<T, M>[]) => void;
};

type Props<T extends string | number, M = unknown> =
  | SingleProps<T, M>
  | SingleClearableProps<T, M>
  | SingleAllowEmptyProps<T, M>
  | MultiProps<T, M>;

const defaultMapOptions = <T extends string | number, M = unknown>(data: unknown): SelectOption<T, M>[] => {
  if (Array.isArray(data)) {
    return data as SelectOption<T, M>[];
  }
  return [];
};

export default function Select<T extends string | number = string | number, M = unknown>({
  label,
  id,
  name,
  required = false,
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
  creatable = false,
  createLabel = (nextQuery) => `Добавить "${nextQuery}"`,
  creatingText = 'Добавление...',
  onCreateOption,
  loadOptions,
  request,
  onAfterRequest,
  renderOption,
  renderValue,
  placement = 'auto',
  portal = true,
  disabled = false,
  floatLabel = false,
  endActions,
  className,
  onChange,
}: Props<T, M>) {
  const resolvedOptions = options as SelectOption<T, M>[];
  const resolvedLoadOptions = loadOptions as ((query: string) => Promise<SelectOption<T, M>[]>) | undefined;
  const resolvedRequest = request as RequestConfig<T, M> | undefined;
  const resolvedOnAfterRequest = onAfterRequest as ((options: SelectOption<T, M>[], query: string) => void) | undefined;
  const context = useFormFieldContext();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = React.useState(-1);
  const isRemote = Boolean(resolvedLoadOptions || resolvedRequest);
  const canPortal = typeof document !== 'undefined' && Boolean(document.body);
  const shouldPortal = portal && canPortal;
  const [items, setItems] = React.useState<SelectOption<T, M>[]>(resolvedOptions);
  const [createdItems, setCreatedItems] = React.useState<SelectOption<T, M>[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const controlRef = React.useRef<HTMLButtonElement>(null);
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const activeOptionSourceRef = React.useRef<'sync' | 'keyboard' | 'mouse'>('sync');
  const { ref: dropdownRef, style: dropdownStyle } = useDropdownPosition(open, {
    gap: 6,
    align: 'left',
    placement,
    anchorRef: containerRef,
    strategy: shouldPortal ? 'fixed' : 'absolute',
  });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
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
  const emptyOption = React.useMemo<SelectEmptyOption<T, M> | null>(
    () => (allowEmpty ? { value: resolvedEmptyValue, label: emptyOptionLabel, disabled: false } : null),
    [allowEmpty, emptyOptionLabel, resolvedEmptyValue],
  );

  React.useEffect(() => {
    if (!isRemote) {
      setItems(resolvedOptions);
    }
  }, [resolvedOptions, isRemote]);

  const mergedItems = React.useMemo(() => {
    const map = new Map<T, SelectOption<T, M>>();
    items.forEach((item) => {
      map.set(item.value, item);
    });
    createdItems.forEach((item) => {
      map.set(item.value, item);
    });
    return Array.from(map.values());
  }, [items, createdItems]);

  React.useEffect(() => {
    if (!open || !isRemote) {
      return;
    }

    let active = true;
    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        let next: SelectOption<T, M>[] = [];
        if (resolvedLoadOptions) {
          next = await resolvedLoadOptions(query);
        } else if (resolvedRequest) {
          const response = await axios({
            url: resolvedRequest.url,
            method: resolvedRequest.method ?? 'get',
            params: { ...resolvedRequest.params, q: query },
            data: resolvedRequest.data,
          });
          const mapper = resolvedRequest.mapOptions ?? defaultMapOptions<T, M>;
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

      const target = event.target as Node;
      const eventPath = typeof event.composedPath === 'function' ? event.composedPath() : [];
      const insideControl = containerRef.current.contains(target) || eventPath.includes(containerRef.current);
      const insideDropdown = dropdownRef.current ? dropdownRef.current.contains(target) : false;
      if (!insideControl && !insideDropdown) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [dropdownRef]);

  React.useEffect(() => {
    context?.registerField(controlId, name, required === true);
  }, [context, controlId, name, required]);

  const warnedRef = React.useRef(false);
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    if (!id && !name && !warnedRef.current) {
      warnedRef.current = true;
      // eslint-disable-next-line no-console
      console.warn('Input.Select: рекомендуется передавать id или name для связки с label.');
    }
  }, [id, name]);

  React.useEffect(() => {
    if (open && searchable) {
      const target = inputRef.current;
      if (!target) {
        return;
      }
      try {
        target.focus({ preventScroll: true });
      } catch {
        target.focus();
      }
    }
  }, [open, searchable]);

  React.useEffect(() => {
    if (!open && query !== '') {
      setQuery('');
    }
  }, [open, query]);

  const allOptions = React.useMemo<SelectItem<T, M>[]>(
    () => (emptyOption ? [emptyOption, ...mergedItems] : mergedItems),
    [emptyOption, mergedItems],
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
          return mapped as SelectOption<T, M>;
        }
        return { value: val, label: String(val) } as SelectOption<T, M>;
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
  const showInlineSearch = searchable && open;
  const searchPlaceholder = React.useMemo(() => {
    if (!hasValue) {
      return placeholder;
    }
    const selectedLabel = selectedList.map((item) => item.label).filter(Boolean).join(', ');
    return selectedLabel || placeholder;
  }, [hasValue, selectedList, placeholder]);

  const displayedOptions = React.useMemo(() => {
    if (isRemote) {
      const filtered = mergedItems;
      return emptyOption ? [emptyOption, ...filtered] : filtered;
    }

    if (!query) {
      return emptyOption ? [emptyOption, ...mergedItems] : mergedItems;
    }

    const lowered = query.toLowerCase();
    const filtered = mergedItems.filter((item) => item.label.toLowerCase().includes(lowered));
    return emptyOption ? [emptyOption, ...filtered] : filtered;
  }, [mergedItems, query, isRemote, emptyOption]);

  const trimmedQuery = query.trim();
  const selectableDisplayedCount = React.useMemo(
    () => displayedOptions.filter((option) => option.value !== null).length,
    [displayedOptions],
  );
  const canCreate = searchable
    && creatable
    && trimmedQuery.length > 0
    && !loading
    && !creating
    && selectableDisplayedCount === 0;

  const findFirstSelectableIndex = React.useCallback(
    () => displayedOptions.findIndex((option) => !option.disabled),
    [displayedOptions],
  );
  const findLastSelectableIndex = React.useCallback(() => {
    for (let index = displayedOptions.length - 1; index >= 0; index -= 1) {
      if (!displayedOptions[index]?.disabled) {
        return index;
      }
    }
    return -1;
  }, [displayedOptions]);
  const findAdjacentSelectableIndex = React.useCallback((current: number, direction: 1 | -1) => {
    if (displayedOptions.length === 0) {
      return -1;
    }
    if (current < 0) {
      return direction === 1 ? findFirstSelectableIndex() : findLastSelectableIndex();
    }
    for (let step = 1; step <= displayedOptions.length; step += 1) {
      const nextIndex = (current + direction * step + displayedOptions.length) % displayedOptions.length;
      if (!displayedOptions[nextIndex]?.disabled) {
        return nextIndex;
      }
    }
    return -1;
  }, [displayedOptions, findFirstSelectableIndex, findLastSelectableIndex]);

  const updateValue = (next: T | T[] | null | undefined, nextOptions: SelectItem<T, M>[]) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    if (multiple) {
      (onChange as MultiProps<T, M>['onChange'])?.(next as T[], nextOptions as SelectOption<T, M>[]);
    } else {
      if (allowEmpty) {
        (onChange as SingleAllowEmptyProps<T, M>['onChange'])?.(next as T | null | undefined, nextOptions);
      } else {
        if (clearable) {
          (onChange as SingleClearableProps<T, M>['onChange'])?.(
            next as T | undefined,
            nextOptions as SelectOption<T, M>[],
          );
        } else {
          (onChange as SingleProps<T, M>['onChange'])?.(
            next as T,
            nextOptions as SelectOption<T, M>[],
          );
        }
      }
    }
  };

  const handleSelect = (option: SelectItem<T, M>) => {
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

  React.useEffect(() => {
    if (!open) {
      activeOptionSourceRef.current = 'sync';
      setActiveOptionIndex(-1);
      return;
    }

    activeOptionSourceRef.current = 'sync';
    setActiveOptionIndex((prev) => {
      if (prev >= 0 && prev < displayedOptions.length && !displayedOptions[prev]?.disabled) {
        return prev;
      }

      const selectedIndex = displayedOptions.findIndex((option) => {
        if (option.disabled) {
          return false;
        }

        return multiple
          ? option.value !== null && (selectedValues as T[]).includes(option.value as T)
          : selectedValues === option.value;
      });

      if (selectedIndex >= 0) {
        return selectedIndex;
      }

      return findFirstSelectableIndex();
    });
  }, [open, displayedOptions, multiple, selectedValues, findFirstSelectableIndex]);

  React.useEffect(() => {
    if (!open || activeOptionIndex < 0) {
      return;
    }
    if (activeOptionSourceRef.current === 'mouse') {
      return;
    }
    const option = optionRefs.current[activeOptionIndex];
    const list = listRef.current;
    if (!option || !list) {
      return;
    }

    const optionTop = option.offsetTop;
    const optionBottom = optionTop + option.offsetHeight;
    const viewTop = list.scrollTop;
    const viewBottom = viewTop + list.clientHeight;

    if (optionTop < viewTop) {
      list.scrollTop = optionTop;
      return;
    }

    if (optionBottom > viewBottom) {
      list.scrollTop = optionBottom - list.clientHeight;
    }
  }, [open, activeOptionIndex]);

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
    if (event.defaultPrevented || disabled) {
      return;
    }
    const target = event.target as EventTarget | null;
    if (target instanceof HTMLButtonElement && target !== controlRef.current) {
      return;
    }

    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault();
        setOpen(false);
        controlRef.current?.focus();
      }
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      activeOptionSourceRef.current = 'keyboard';

      if (!open) {
        setOpen(true);
        setActiveOptionIndex(direction === 1 ? findFirstSelectableIndex() : findLastSelectableIndex());
        return;
      }

      setActiveOptionIndex((prev) => findAdjacentSelectableIndex(prev, direction));
      return;
    }

    if (event.key === 'Enter' && open) {
      const activeOption = displayedOptions[activeOptionIndex];
      if (activeOption) {
        event.preventDefault();
        handleSelect(activeOption);
        return;
      }
      if (canCreate) {
        event.preventDefault();
        void handleCreateOption();
      }
    }
  };

  const showClear = clearable && searchable && !disabled && hasValue && !isEmptySelection;
  const controlActionCount = 1 + (showClear ? 1 : 0) + countActionItems(endActions);
  const controlStyle = React.useMemo(
    () =>
      ({
        ['--ui-select-controls-space']: `${26 + Math.max(0, controlActionCount - 1) * 24}px`,
      }) as React.CSSProperties,
    [controlActionCount],
  );

  const handleClear = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    const nextValue = multiple ? [] : allowEmpty ? (resolvedEmptyValue as T) : undefined;
    const nextOptions = multiple ? [] : allowEmpty && emptyOption ? [emptyOption] : [];
    updateValue(nextValue, nextOptions);
    setQuery('');
  };

  const createFallbackOption = (nextQuery: string): SelectOption<T, M> => ({
    value: nextQuery as unknown as T,
    label: nextQuery,
  });

  const handleCreateOption = async () => {
    if (!canCreate || disabled) {
      return;
    }

    const nextQuery = trimmedQuery;
    if (!nextQuery) {
      return;
    }

    setCreating(true);
    try {
      const created = await onCreateOption?.(nextQuery);
      const nextOption = created ?? createFallbackOption(nextQuery);
      if (nextOption.value === null || nextOption.value === undefined) {
        return;
      }

      setCreatedItems((prev) => {
        const exists = prev.some((item) => item.value === nextOption.value);
        if (exists) {
          return prev.map((item) => (item.value === nextOption.value ? nextOption : item));
        }
        return [...prev, nextOption];
      });

      if (multiple) {
        const values = selectedValues as T[];
        if (!values.includes(nextOption.value as T)) {
          updateValue([...values, nextOption.value as T], [...selectedList, nextOption]);
        }
      } else {
        updateValue(nextOption.value as T, [nextOption]);
        setOpen(false);
      }
      setQuery('');
    } finally {
      setCreating(false);
    }
  };

  const controlWidth = containerRef.current?.getBoundingClientRect().width;
  const resolvedDropdownStyle = shouldPortal
    ? {
        ...dropdownStyle,
        width: controlWidth ? `${controlWidth}px` : undefined,
        minWidth: controlWidth ? `${controlWidth}px` : undefined,
      }
    : dropdownStyle;

  const dropdown = open ? (
    <div
      className={[styles.dropdown, shouldPortal ? styles.dropdownPortal : null].filter(Boolean).join(' ')}
      ref={dropdownRef}
      style={resolvedDropdownStyle}
    >
      <div className={styles.list} role="listbox" id={listId} ref={listRef}>
        {loading ? <div className={styles.status}>{loadingText}</div> : null}
        {!loading && !canCreate && (allowEmpty ? displayedOptions.length <= 1 : displayedOptions.length === 0) ? (
          <div className={styles.status}>{emptyText}</div>
        ) : null}
        {!loading && canCreate ? (
          <button
            type="button"
            className={[styles.option, styles.optionCreate].filter(Boolean).join(' ')}
            onMouseDown={(event) => {
              event.preventDefault();
              void handleCreateOption();
            }}
            onClick={(event) => {
              if (event.detail === 0) {
                void handleCreateOption();
              }
            }}
            disabled={creating}
          >
            <span>{creating ? creatingText : createLabel(trimmedQuery)}</span>
            <span className={styles.createMark}>+</span>
          </button>
        ) : null}
        {!loading
          ? displayedOptions.map((option, index) => {
              const selected = multiple
                ? option.value !== null && (selectedValues as T[]).includes(option.value as T)
                : selectedValues === option.value;
              const active = index === activeOptionIndex;

              return (
                <button
                  key={option.value ?? '__empty'}
                  type="button"
                  className={[
                    styles.option,
                    selected ? styles.optionSelected : null,
                    active ? styles.optionActive : null,
                    option.disabled ? styles.optionDisabled : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  aria-selected={selected}
                  aria-label={option.label}
                  onMouseEnter={() => {
                    activeOptionSourceRef.current = 'mouse';
                    setActiveOptionIndex(index);
                  }}
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
                  {renderOption
                    ? renderOption(option, { selected, active, multiple })
                    : <span className={styles.optionLabel}>{option.label}</span>}
                  {selected ? <span className={styles.check}>✓</span> : null}
                </button>
              );
            })
          : null}
      </div>
    </div>
  ) : null;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-open={open}
      data-has-value={hasValue}
      data-multiple={multiple ? 'true' : 'false'}
      data-has-query={query.length > 0}
      data-has-label={hasLabel}
      data-float-label={floatLabel ? 'true' : undefined}
      data-float-active={floatActive ? 'true' : undefined}
      data-has-clear={showClear ? 'true' : undefined}
      ref={containerRef}
      style={controlStyle}
      onKeyDown={handleKeyDown}
    >
      {label ? (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      ) : null}
      {showInlineSearch ? (
        <input
          ref={inputRef}
          id={controlId}
          className={styles.controlSearch}
          style={controlStyle}
          value={query}
          placeholder={searchPlaceholder}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={label ? labelId : undefined}
          disabled={disabled}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && canCreate) {
              event.preventDefault();
              void handleCreateOption();
            }
          }}
        />
      ) : (
        <button
          type="button"
          className={styles.control}
          style={controlStyle}
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
                  <div key={String(item.value)} className={styles.tag}>
                    {renderValue ? renderValue(item) : item.label}
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
                  </div>
                ))
              ) : (
                <span className={styles.singleValue}>
                  {selectedList[0] ? (renderValue ? renderValue(selectedList[0]) : selectedList[0].label) : null}
                </span>
              )
            ) : (
              <span className={[styles.placeholder, styles.singleValue].join(' ')}>{placeholder}</span>
            )}
          </div>
        </button>
      )}
      <ActionStack className={styles.controls}>
        {endActions}
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
      </ActionStack>
      {dropdown ? (shouldPortal ? createPortal(dropdown, document.body) : dropdown) : null}
    </div>
  );
}

Select.supportsFloatLabel = true;
Select.floatLabelKind = 'select';
