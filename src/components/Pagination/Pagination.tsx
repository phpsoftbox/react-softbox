import React from 'react';
import styles from './Pagination.module.css';

export type PaginationLinks = {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
  path?: string;
};

type Props = {
  meta: PaginationMeta;
  links?: PaginationLinks;
  pageParam?: string;
  window?: number;
  showEdges?: boolean;
  showInfo?: boolean;
  buildUrl?: (page: number) => string;
  onNavigate?: (page: number, url: string) => void;
  className?: string;
};

type PageItem =
  | { type: 'page'; page: number; active: boolean }
  | { type: 'ellipsis'; key: string };

const sanitizeBase = (url: string, pageParam: string) => {
  const cleaned = url.replace(new RegExp(`([?&])${pageParam}=[^&]*`, 'g'), '$1');
  return cleaned.replace(/[?&]$/, '');
};

const buildDefaultUrl = (page: number, pageParam: string, base?: string | null) => {
  if (!base) {
    return '';
  }
  const normalized = sanitizeBase(base, pageParam);
  const separator = normalized.includes('?') ? '&' : '?';
  return `${normalized}${separator}${pageParam}=${page}`;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function Pagination({
  meta,
  links,
  pageParam = 'page',
  window = 2,
  showEdges = true,
  showInfo = true,
  buildUrl,
  onNavigate,
  className,
}: Props) {
  const current = clamp(meta.current_page, 1, meta.last_page);
  const last = Math.max(meta.last_page, 1);
  const base = meta.path ?? links?.first ?? '';

  const resolveUrl = (page: number) => {
    if (buildUrl) {
      return buildUrl(page);
    }
    return buildDefaultUrl(page, pageParam, base);
  };

  const pages: PageItem[] = [];
  const start = Math.max(1, current - window);
  const end = Math.min(last, current + window);

  if (showEdges && start > 1) {
    pages.push({ type: 'page', page: 1, active: current === 1 });
    if (start > 2) {
      pages.push({ type: 'ellipsis', key: 'start' });
    }
  }

  for (let page = start; page <= end; page += 1) {
    pages.push({ type: 'page', page, active: page === current });
  }

  if (showEdges && end < last) {
    if (end < last - 1) {
      pages.push({ type: 'ellipsis', key: 'end' });
    }
    pages.push({ type: 'page', page: last, active: current === last });
  }

  const prevPage = current > 1 ? current - 1 : null;
  const nextPage = current < last ? current + 1 : null;
  const prevUrl = links?.prev ?? (prevPage ? resolveUrl(prevPage) : '');
  const nextUrl = links?.next ?? (nextPage ? resolveUrl(nextPage) : '');
  const firstUrl = links?.first ?? resolveUrl(1);
  const lastUrl = links?.last ?? resolveUrl(last);

  const handleNavigate = (event: React.MouseEvent, page: number | null, url: string) => {
    if (!page || !url) {
      event.preventDefault();
      return;
    }
    if (onNavigate) {
      event.preventDefault();
      onNavigate(page, url);
    }
  };

  const from = meta.from ?? (current - 1) * meta.per_page + 1;
  const to = meta.to ?? Math.min(current * meta.per_page, meta.total);

  return (
    <nav className={[styles.pagination, className].filter(Boolean).join(' ')} aria-label="Pagination">
      {showInfo ? (
        <div className={styles.info}>
          {meta.total === 0 ? 'Нет записей' : `${from}–${to} из ${meta.total}`}
        </div>
      ) : null}
      <div className={styles.controls}>
        {showEdges ? (
          <a
            href={firstUrl}
            className={[styles.control, current === 1 ? styles.disabled : null].filter(Boolean).join(' ')}
            aria-disabled={current === 1}
            onClick={(event) => handleNavigate(event, 1, firstUrl)}
          >
            «
          </a>
        ) : null}
        <a
          href={prevUrl}
          className={[styles.control, !prevPage ? styles.disabled : null].filter(Boolean).join(' ')}
          aria-disabled={!prevPage}
          onClick={(event) => handleNavigate(event, prevPage, prevUrl)}
        >
          ‹
        </a>
        <div className={styles.pages}>
          {pages.map((item) => {
            if (item.type === 'ellipsis') {
              return (
                <span key={item.key} className={styles.ellipsis}>
                  …
                </span>
              );
            }
            const url = resolveUrl(item.page);
            return (
              <a
                key={item.page}
                href={url}
                className={[styles.page, item.active ? styles.active : null].filter(Boolean).join(' ')}
                aria-current={item.active ? 'page' : undefined}
                onClick={(event) => handleNavigate(event, item.page, url)}
              >
                {item.page}
              </a>
            );
          })}
        </div>
        <a
          href={nextUrl}
          className={[styles.control, !nextPage ? styles.disabled : null].filter(Boolean).join(' ')}
          aria-disabled={!nextPage}
          onClick={(event) => handleNavigate(event, nextPage, nextUrl)}
        >
          ›
        </a>
        {showEdges ? (
          <a
            href={lastUrl}
            className={[styles.control, current === last ? styles.disabled : null].filter(Boolean).join(' ')}
            aria-disabled={current === last}
            onClick={(event) => handleNavigate(event, last, lastUrl)}
          >
            »
          </a>
        ) : null}
      </div>
    </nav>
  );
}
