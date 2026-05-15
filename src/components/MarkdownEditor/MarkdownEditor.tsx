import React from 'react';
import Prism from 'prismjs';
import PrismLoader from 'prismjs-components-loader';
import Textarea from '../Input/Textarea/Textarea';
import Hint from '../Input/Hint/Hint';
import Tooltip, { type TooltipPlacement } from '../Tooltip/Tooltip';
import Dropdown from '../Menu/Dropdown';
import type { MenuItem } from '../Menu/Menu';
import styles from './MarkdownEditor.module.css';

const prismLanguages: string[] = [
  'markup',
  'markup-templating',
  'clike',
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'json',
  'diff',
  'css',
  'bash',
  'markdown',
  'php',
];

let prismInitialized = false;

const initializePrismLanguages = () => {
  if (prismInitialized) {
    return;
  }

  for (const language of prismLanguages) {
    PrismLoader.load(Prism, language);
  }

  prismInitialized = true;
};

initializePrismLanguages();

export type MarkdownToolbarItem =
  | 'heading'
  | 'format'
  | 'link'
  | 'image-url'
  | 'image-file';

export type MarkdownToolbarTemplate = Array<MarkdownToolbarItem | MarkdownToolbarItem[]>;

export type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  label?: string;
  editorLabel?: string;
  previewLabel?: string;
  hint?: React.ReactNode;
  hintPlacement?: TooltipPlacement;
  readOnly?: boolean;
  minHeight?: number;
  className?: string;
  editorClassName?: string;
  previewClassName?: string;
  allowLinks?: boolean;
  allowImages?: boolean;
  toolbarTemplate?: MarkdownToolbarTemplate;
  onImageFileUpload?: (file: File) => Promise<string | null | undefined> | string | null | undefined;
  insertImageFileAsBase64?: boolean;
};

export type MarkdownEditorSlotProps = {
  className?: string;
  label?: string;
  id?: string;
  name?: string;
};

const MarkdownEditorTextareaSlot: React.FC<MarkdownEditorSlotProps> = () => null;
const MarkdownEditorPreviewSlot: React.FC<MarkdownEditorSlotProps> = () => null;

MarkdownEditorTextareaSlot.displayName = 'MarkdownEditor.Textarea';
MarkdownEditorPreviewSlot.displayName = 'MarkdownEditor.Preview';

const ALL_TOOLBAR_ITEMS: MarkdownToolbarItem[] = [
  'heading',
  'format',
  'link',
  'image-url',
  'image-file',
];

const DEFAULT_TOOLBAR_TEMPLATE: MarkdownToolbarTemplate = [
  'heading',
  'format',
  ['link', 'image-url', 'image-file'],
];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const resolvePrismLanguage = (language: string) => {
  const normalized = language.trim().toLowerCase();
  if (!normalized) {
    return 'markup';
  }
  const aliasMap: Record<string, string> = {
    js: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    ts: 'typescript',
    jsx: 'jsx',
    tsx: 'tsx',
    html: 'markup',
    xml: 'markup',
    svg: 'markup',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    md: 'markdown',
    php8: 'php',
    php7: 'php',
    phtml: 'php',
  };
  const resolved = aliasMap[normalized] ?? normalized;
  return Prism.languages[resolved] ? resolved : 'markup';
};

type RenderMarkdownOptions = {
  allowLinks: boolean;
  allowImages: boolean;
};

const isToolbarItem = (value: unknown): value is MarkdownToolbarItem => (
  typeof value === 'string' && ALL_TOOLBAR_ITEMS.includes(value as MarkdownToolbarItem)
);

const normalizeToolbarTemplate = (
  template: MarkdownToolbarTemplate | undefined,
): MarkdownToolbarItem[][] => {
  const source = template ?? DEFAULT_TOOLBAR_TEMPLATE;
  const normalized = source
    .map((entry) => {
      if (Array.isArray(entry)) {
        const groupItems = entry.filter(isToolbarItem);
        return groupItems;
      }
      if (isToolbarItem(entry)) {
        return [entry];
      }
      return [];
    })
    .filter((group) => group.length > 0);

  if (normalized.length > 0) {
    return normalized;
  }

  return DEFAULT_TOOLBAR_TEMPLATE.map((entry) => (
    Array.isArray(entry) ? [...entry] : [entry]
  ));
};

const readFileAsDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result !== 'string') {
      reject(new Error('Не удалось прочитать файл.'));
      return;
    }
    resolve(reader.result);
  };
  reader.onerror = () => reject(reader.error ?? new Error('Не удалось прочитать файл.'));
  reader.readAsDataURL(file);
});

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.toolIcon} aria-hidden="true">
    <path
      d="M10.59 13.41a1 1 0 0 1 0-1.41l3-3a3 3 0 1 1 4.24 4.24l-1.8 1.8a3 3 0 0 1-4.24 0 1 1 0 0 1 1.41-1.41 1 1 0 0 0 1.42 0l1.8-1.8a1 1 0 1 0-1.42-1.42l-3 3a1 1 0 0 1-1.41 0Z"
      fill="currentColor"
    />
    <path
      d="M13.41 10.59a1 1 0 0 1 0 1.41l-3 3a3 3 0 0 1-4.24-4.24l1.8-1.8a3 3 0 0 1 4.24 0 1 1 0 0 1-1.41 1.41 1 1 0 0 0-1.42 0l-1.8 1.8a1 1 0 1 0 1.42 1.42l3-3a1 1 0 0 1 1.41 0Z"
      fill="currentColor"
    />
  </svg>
);

const ImageUrlIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.toolIcon} aria-hidden="true">
    <path
      d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v8.17l3.09-3.09a1 1 0 0 1 1.41 0l2.8 2.8 2.2-2.2a1 1 0 0 1 1.42 0L19 14.76V6H5Zm14 12v-.41l-3.79-3.79-2.2 2.2a1 1 0 0 1-1.42 0l-2.8-2.8L5 17.99V18h14Z"
      fill="currentColor"
    />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
  </svg>
);

const ImageFileIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.toolIcon} aria-hidden="true">
    <path
      d="M6 3h8l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 1.5V9h4.5L13 4.5Zm-6 14h10v-2H7v2Zm0-4h10v-2H7v2Z"
      fill="currentColor"
    />
  </svg>
);

const renderMarkdown = (value: string, options: RenderMarkdownOptions) => {
  if (!value) {
    return '';
  }

  const codeBlocks: Array<{ token: string; html: string }> = [];
  let codeIndex = 0;

  const markdownWithCodeTokens = value.replace(/```([^\n`]*)\n?([\s\S]*?)```/g, (_, rawLanguage: string, rawCode: string) => {
    const language = (rawLanguage ?? '').trim().toLowerCase();
    const cleanCode = (rawCode ?? '').replace(/^\n+|\n+$/g, '');
    const prismLanguage = resolvePrismLanguage(language);
    const grammar = Prism.languages[prismLanguage];
    const highlighted = cleanCode
      ? Prism.highlight(cleanCode, grammar, prismLanguage)
      : '';
    const lines = (highlighted || '&nbsp;').split('\n');
    const codeLinesHtml = lines
      .map((line: string, index: number) => {
        return `<span class="md-code-line"><span class="md-code-num">${index + 1}</span><span class="md-code-text">${line || '&nbsp;'}</span></span>`;
      })
      .join('');
    const token = `@@CODEBLOCK_${codeIndex}@@`;
    const encodedCode = escapeHtml(encodeURIComponent(cleanCode));
    const languageLabel = escapeHtml(language || prismLanguage || 'text');
    const languageClass = escapeHtml((prismLanguage || 'text').replace(/[^a-z0-9_-]/g, ''));
    const block = `
<div class="md-code-wrap" data-code-block="true" data-code="${encodedCode}">
  <div class="md-code-head">
    <span class="md-code-lang">${languageLabel}</span>
    <button type="button" class="md-code-copy" data-code-copy="true">Скопировать</button>
  </div>
  <pre class="md-code-pre"><code class="md-code md-lang-${languageClass}">${codeLinesHtml}</code></pre>
</div>`;
    codeBlocks.push({ token, html: block });
    codeIndex += 1;
    return token;
  });

  let html = escapeHtml(markdownWithCodeTokens);

  html = html.replace(/^######\s(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s(.+)$/gm, '<h1>$1</h1>');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<u>$1</u>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  if (options.allowImages) {
    html = html.replace(/!\[(.*?)\]\(((?:https?:\/\/|blob:|data:image\/)[^\s)]+)\)/g, '<img src="$2" alt="$1" />');
  }
  if (options.allowLinks) {
    html = html.replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  const lines = html.split('\n');
  const output: string[] = [];
  let inQuote = false;
  let lastWasText = false;
  const listStack: Array<{ type: 'ul' | 'ol'; level: number; openItem: boolean }> = [];

  const closeQuote = () => {
    if (inQuote) {
      output.push('</blockquote>');
      inQuote = false;
      lastWasText = false;
    }
  };

  const closeList = () => {
    const item = listStack.pop();
    if (!item) {
      return;
    }
    if (item.openItem) {
      output.push('</li>');
    }
    output.push(`</${item.type}>`);
  };

  const closeListsToLevel = (level: number) => {
    while (listStack.length > 0 && listStack[listStack.length - 1].level > level) {
      closeList();
    }
  };

  const closeCurrentItem = () => {
    const current = listStack[listStack.length - 1];
    if (current?.openItem) {
      output.push('</li>');
      current.openItem = false;
    }
  };

  const openList = (type: 'ul' | 'ol', level: number) => {
    output.push(`<${type}>`);
    listStack.push({ type, level, openItem: false });
  };

  const openListItem = (content: string) => {
    const current = listStack[listStack.length - 1];
    if (!current) {
      return;
    }
    output.push(`<li>${content}`);
    current.openItem = true;
  };

  const closeAllLists = () => {
    while (listStack.length > 0) {
      closeList();
    }
  };

  lines.forEach((rawLine) => {
    const normalized = rawLine.replace(/\t/g, '  ');
    const trimmed = normalized.trim();
    const codeTokenMatch = /^@@CODEBLOCK_\d+@@$/.exec(trimmed);
    if (codeTokenMatch) {
      closeQuote();
      closeAllLists();
      output.push(trimmed);
      lastWasText = false;
      return;
    }

    const quoteMatch = /^\s*(?:>|&gt;)\s?(.*)$/.exec(normalized);
    if (quoteMatch) {
      closeAllLists();
      if (!inQuote) {
        output.push('<blockquote>');
        inQuote = true;
      } else if (lastWasText) {
        output.push('<br />');
      }
      output.push(quoteMatch[1]);
      lastWasText = true;
      return;
    }

    closeQuote();

    const ulMatch = /^(\s*)[-*]\s+(.+)$/.exec(normalized);
    const olMatch = /^(\s*)\d+\.\s+(.+)$/.exec(normalized);
    const listMatch = ulMatch ?? olMatch;
    if (listMatch) {
      const type = ulMatch ? 'ul' : 'ol';
      const indent = listMatch[1]?.length ?? 0;
      const level = Math.floor(indent / 2);
      const content = listMatch[2];

      if (listStack.length === 0) {
        openList(type, level);
      } else {
        let current = listStack[listStack.length - 1];
        if (level > current.level) {
          for (let nextLevel = current.level + 1; nextLevel <= level; nextLevel += 1) {
            openList(type, nextLevel);
          }
        } else if (level < current.level) {
          closeCurrentItem();
          closeListsToLevel(level);
        }

        current = listStack[listStack.length - 1];
        if (!current || current.level !== level) {
          openList(type, level);
          current = listStack[listStack.length - 1];
        }

        if (current && current.type !== type) {
          closeCurrentItem();
          closeList();
          openList(type, level);
        }
      }

      closeCurrentItem();
      openListItem(content);
      lastWasText = false;
      return;
    }

    closeAllLists();

    if (!trimmed) {
      if (lastWasText) {
        output.push('<br />');
      }
      lastWasText = false;
      return;
    }

    if (lastWasText) {
      output.push('<br />');
    }
    output.push(normalized);
    lastWasText = true;
  });

  closeQuote();
  closeAllLists();

  html = output.join('');
  codeBlocks.forEach((block) => {
    html = html.replace(block.token, block.html);
  });

  return html;
};

type ActiveFormats = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  code: boolean;
  codeBlock: boolean;
  quote: boolean;
  list: 'ul' | 'ol' | null;
  heading: number | null;
};

type EditSnapshot = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

function MarkdownEditorRoot({
  value,
  onChange,
  children,
  placeholder = 'Введите текст...',
  label,
  editorLabel = 'Редактор',
  previewLabel = 'Предпросмотр',
  hint,
  hintPlacement = 'auto',
  readOnly = false,
  minHeight = 220,
  className,
  editorClassName,
  previewClassName,
  allowLinks = true,
  allowImages = true,
  toolbarTemplate,
  onImageFileUpload,
  insertImageFileAsBase64 = false,
}: MarkdownEditorProps) {
  const html = React.useMemo(() => (
    renderMarkdown(value, {
      allowLinks,
      allowImages,
    })
  ), [value, allowLinks, allowImages]);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const objectUrlsRef = React.useRef<string[]>([]);
  const copyTimerRef = React.useRef<Map<HTMLButtonElement, number>>(new Map());
  const editHistoryRef = React.useRef<{ undo: EditSnapshot[]; redo: EditSnapshot[] }>({ undo: [], redo: [] });
  const [activePanel, setActivePanel] = React.useState<null | 'link' | 'image-url'>(null);
  const [linkText, setLinkText] = React.useState('');
  const [linkUrl, setLinkUrl] = React.useState('https://');
  const [imageAlt, setImageAlt] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('https://');
  const [panelError, setPanelError] = React.useState('');
  const [activeFormats, setActiveFormats] = React.useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    code: false,
    codeBlock: false,
    quote: false,
    list: null,
    heading: null,
  });
  const textareaFallbackId = React.useId();
  const toolbarGroups = React.useMemo(
    () => normalizeToolbarTemplate(toolbarTemplate),
    [toolbarTemplate],
  );
  const toolbarEnabledSet = React.useMemo(() => {
    const enabled = new Set<MarkdownToolbarItem>();
    toolbarGroups.forEach((group) => {
      group.forEach((item) => enabled.add(item));
    });
    return enabled;
  }, [toolbarGroups]);
  const canUseLink = allowLinks && toolbarEnabledSet.has('link');
  const canUseImageUrl = allowImages && toolbarEnabledSet.has('image-url');
  const canUseImageFile = allowImages
    && toolbarEnabledSet.has('image-file')
    && (typeof onImageFileUpload === 'function' || insertImageFileAsBase64);

  React.useEffect(() => {
    if (activePanel === 'link' && !canUseLink) {
      setActivePanel(null);
      setPanelError('');
      return;
    }
    if (activePanel === 'image-url' && !canUseImageUrl) {
      setActivePanel(null);
      setPanelError('');
    }
  }, [activePanel, canUseLink, canUseImageUrl]);

  React.useEffect(() => () => {
    if (typeof URL === 'undefined') {
      return;
    }
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
  }, []);

  React.useEffect(() => () => {
    copyTimerRef.current.forEach((timerId) => window.clearTimeout(timerId));
    copyTimerRef.current.clear();
  }, []);

  const getLineRange = (start: number, end: number) => {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEndIndex = value.indexOf('\n', end);
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
    const line = value.slice(lineStart, lineEnd);
    return { lineStart, lineEnd, line };
  };

  const isInsideCodeBlock = (start: number, end: number) => {
    const before = value.slice(0, start);
    const after = value.slice(end);
    const beforeCount = (before.match(/```/g) ?? []).length;
    const afterCount = (after.match(/```/g) ?? []).length;
    return beforeCount % 2 === 1 && afterCount > 0;
  };

  const updateActiveFormats = React.useCallback(() => {
    const target = textareaRef.current;
    if (!target) {
      return;
    }
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? start;
    const { lineStart, line } = getLineRange(start, end);
    const lineOffset = start - lineStart;

    const headingMatch = /^(\s*)(#{1,6})\s+/.exec(line);
    const heading = headingMatch ? headingMatch[2].length : null;
    const quote = /^\s*>\s?/.test(line);
    const list = /^(\s*)\d+\.\s+/.test(line) ? 'ol' : /^(\s*)[-*]\s+/.test(line) ? 'ul' : null;

    const isWrapped = (marker: string, forbidAdjacent = false) => {
      if (start !== end) {
        if (start < marker.length) {
          return false;
        }
        return value.slice(start - marker.length, start) === marker
          && value.slice(end, end + marker.length) === marker;
      }
      return Boolean(findWrapInLine(line, lineOffset, marker, forbidAdjacent));
    };

    const isItalicWrapped = () => {
      if (start !== end) {
        if (start < 1) {
          return false;
        }
        const before = value.slice(start - 1, start);
        const after = value.slice(end, end + 1);
        if (before !== '*' || after !== '*') {
          return false;
        }
        const beforePair = start >= 2 ? value.slice(start - 2, start) : '';
        const afterPair = value.slice(end, end + 2);
        return beforePair !== '**' && afterPair !== '**';
      }

      const findSingleLeft = (text: string, pos: number) => {
        for (let i = pos - 1; i >= 0; i -= 1) {
          if (text[i] !== '*') {
            continue;
          }
          if (text[i - 1] === '*' || text[i + 1] === '*') {
            continue;
          }
          return i;
        }
        return -1;
      };

      const findSingleRight = (text: string, pos: number) => {
        for (let i = pos; i < text.length; i += 1) {
          if (text[i] !== '*') {
            continue;
          }
          if (text[i - 1] === '*' || text[i + 1] === '*') {
            continue;
          }
          return i;
        }
        return -1;
      };

      const left = findSingleLeft(line, lineOffset);
      const right = findSingleRight(line, lineOffset);
      return left !== -1 && right !== -1 && left < lineOffset && right >= lineOffset;
    };

    const codeBlock = isInsideCodeBlock(start, end);

    setActiveFormats({
      bold: isWrapped('**', true),
      italic: isItalicWrapped(),
      underline: isWrapped('__', true),
      strike: isWrapped('~~'),
      code: !codeBlock && isWrapped('`', true),
      codeBlock,
      quote,
      list,
      heading,
    });
  }, [value]);

  React.useEffect(() => {
    updateActiveFormats();
  }, [value, updateActiveFormats]);

  const scheduleSelection = (start: number, end: number) => {
    if (typeof window === 'undefined') {
      return;
    }
    window.requestAnimationFrame(() => {
      const target = textareaRef.current;
      if (!target) {
        return;
      }
      target.focus();
      target.setSelectionRange(start, end);
      updateActiveFormats();
    });
  };

  const getSelectionRange = () => {
    const target = textareaRef.current;
    if (!target) {
      return { start: value.length, end: value.length, text: '' };
    }
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? start;
    return {
      start,
      end,
      text: value.slice(start, end),
    };
  };

  const pushHistory = () => {
    const { start, end } = getSelectionRange();
    const history = editHistoryRef.current;
    history.undo.push({
      value,
      selectionStart: start,
      selectionEnd: end,
    });
    if (history.undo.length > 150) {
      history.undo.shift();
    }
    history.redo = [];
  };

  const undoEdit = () => {
    const history = editHistoryRef.current;
    const snapshot = history.undo.pop();
    if (!snapshot) {
      return false;
    }
    const { start, end } = getSelectionRange();
    history.redo.push({
      value,
      selectionStart: start,
      selectionEnd: end,
    });
    onChange(snapshot.value);
    scheduleSelection(snapshot.selectionStart, snapshot.selectionEnd);
    return true;
  };

  const redoEdit = () => {
    const history = editHistoryRef.current;
    const snapshot = history.redo.pop();
    if (!snapshot) {
      return false;
    }
    const { start, end } = getSelectionRange();
    history.undo.push({
      value,
      selectionStart: start,
      selectionEnd: end,
    });
    onChange(snapshot.value);
    scheduleSelection(snapshot.selectionStart, snapshot.selectionEnd);
    return true;
  };

  const findFenceRange = (selectionStart: number, selectionEnd: number) => {
    const fenceRegex = /^```[^\n]*$/gm;
    const fences: Array<{ start: number; end: number }> = [];
    let match: RegExpExecArray | null = fenceRegex.exec(value);
    while (match) {
      fences.push({
        start: match.index,
        end: match.index + match[0].length,
      });
      match = fenceRegex.exec(value);
    }

    for (let i = 0; i + 1 < fences.length; i += 2) {
      const openFence = fences[i];
      const closeFence = fences[i + 1];
      const openLineEndIndex = value.indexOf('\n', openFence.end);
      const openSectionEnd = openLineEndIndex === -1 ? value.length : openLineEndIndex + 1;
      const closeLineEndIndex = value.indexOf('\n', closeFence.end);
      const closeSectionEnd = closeLineEndIndex === -1 ? value.length : closeLineEndIndex + 1;
      const contentStart = openSectionEnd;
      const contentEnd = closeFence.start;
      const isInside =
        selectionStart >= contentStart
        && selectionEnd <= contentEnd;
      if (isInside) {
        return {
          openFenceStart: openFence.start,
          contentStart,
          contentEnd,
          closeFenceStart: closeFence.start,
          closeFenceEnd: closeSectionEnd,
        };
      }
    }

    return null;
  };

  const applyEdit = (
    replacement: string,
    rangeStart: number,
    rangeEnd: number,
    selectionStart: number,
    selectionEnd: number
  ) => {
    pushHistory();
    const target = textareaRef.current;
    if (target && typeof target.setRangeText === 'function') {
      if (document.activeElement !== target) {
        try {
          target.focus({ preventScroll: true });
        } catch {
          target.focus();
        }
      }
      target.setRangeText(replacement, rangeStart, rangeEnd, 'preserve');
      onChange(target.value);
      scheduleSelection(selectionStart, selectionEnd);
      return;
    }

    const nextValue = `${value.slice(0, rangeStart)}${replacement}${value.slice(rangeEnd)}`;
    onChange(nextValue);
    scheduleSelection(selectionStart, selectionEnd);
  };

  const replaceSelection = (replacement: string, selectionStart: number, selectionEnd: number) => {
    const { start, end } = getSelectionRange();
    applyEdit(replacement, start, end, selectionStart, selectionEnd);
  };

  const isMarkerAt = (text: string, index: number, marker: string, forbidAdjacent: boolean) => {
    if (index < 0 || index + marker.length > text.length) {
      return false;
    }
    if (text.slice(index, index + marker.length) !== marker) {
      return false;
    }
    if (!forbidAdjacent) {
      return true;
    }
    const ch = marker[0];
    const before = text[index - 1];
    const after = text[index + marker.length];
    if (before === ch || after === ch) {
      return false;
    }
    return true;
  };

  const findWrapInLine = (line: string, offset: number, marker: string, forbidAdjacent: boolean) => {
    const positions: number[] = [];
    for (let i = 0; i <= line.length - marker.length; i += 1) {
      if (isMarkerAt(line, i, marker, forbidAdjacent)) {
        positions.push(i);
        i += marker.length - 1;
      }
    }
    if (positions.length < 2) {
      return null;
    }
    const beforeCount = positions.filter((pos) => pos < offset).length;
    if (beforeCount === 0 || beforeCount % 2 === 0) {
      return null;
    }
    const left = positions[beforeCount - 1];
    const right = positions[beforeCount];
    if (right === undefined || right <= left) {
      return null;
    }
    return { left, right };
  };

  const toggleWrap = (marker: string, placeholder: string, forbidAdjacent = false) => {
    const { start, end, text } = getSelectionRange();
    if (start !== end) {
      const hasLeft = start >= marker.length && value.slice(start - marker.length, start) === marker;
      const hasRight = value.slice(end, end + marker.length) === marker;
      if (hasLeft && hasRight) {
        const rangeStart = start - marker.length;
        const rangeEnd = end + marker.length;
        applyEdit(text, rangeStart, rangeEnd, rangeStart, rangeStart + text.length);
        return;
      }
      const content = text || placeholder;
      const replacement = `${marker}${content}${marker}`;
      applyEdit(replacement, start, end, start + marker.length, start + marker.length + content.length);
      return;
    }

    const { lineStart, line } = getLineRange(start, end);
    const offset = start - lineStart;
    const pair = findWrapInLine(line, offset, marker, forbidAdjacent);
    if (pair) {
      const rangeStart = lineStart + pair.left;
      const rangeEnd = lineStart + pair.right + marker.length;
      const content = value.slice(rangeStart + marker.length, rangeEnd - marker.length);
      const cursor = Math.max(rangeStart, start - marker.length);
      applyEdit(content, rangeStart, rangeEnd, cursor, cursor);
      return;
    }

    const replacement = `${marker}${placeholder}${marker}`;
    const selectionStart = start + marker.length;
    const selectionEnd = selectionStart + placeholder.length;
    replaceSelection(replacement, selectionStart, selectionEnd);
  };

  const toggleItalic = () => toggleWrap('*', 'Курсив', true);

  const applyHeading = (level: number) => {
    const prefix = `${'#'.repeat(level)} `;
    const { start, end } = getSelectionRange();
    const { lineStart, lineEnd, line } = getLineRange(start, end);
    const lines = line.split('\n');
    const allPrefixed = lines.every((lineItem) => lineItem.trim() === '' || lineItem.startsWith(prefix));
    const replacement = lines
      .map((lineItem) => {
        if (lineItem.trim() === '') {
          return lineItem;
        }
        const cleaned = lineItem.replace(/^#{1,6}\s+/, '');
        return allPrefixed ? cleaned : `${prefix}${cleaned}`;
      })
      .join('\n');
    applyEdit(replacement, lineStart, lineEnd, lineStart, lineStart + replacement.length);
  };

  const applyList = (type: 'ul' | 'ol') => {
    const { start, end } = getSelectionRange();
    const { lineStart, lineEnd, line } = getLineRange(start, end);
    const lines = line.split('\n');
    const prefixMatcher = type === 'ol' ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/;
    const stripOther = type === 'ol' ? /^\s*[-*]\s+/ : /^\s*\d+\.\s+/;
    const allPrefixed = lines.every((lineItem) => lineItem.trim() === '' || prefixMatcher.test(lineItem));
    const replacement = lines
      .map((lineItem, index) => {
        if (lineItem.trim() === '') {
          return lineItem;
        }
        if (allPrefixed) {
          return lineItem.replace(prefixMatcher, '');
        }
        const cleaned = lineItem.replace(prefixMatcher, '').replace(stripOther, '');
        if (type === 'ul') {
          return `- ${cleaned}`;
        }
        return `${index + 1}. ${cleaned}`;
      })
      .join('\n');
    applyEdit(replacement, lineStart, lineEnd, lineStart, lineStart + replacement.length);
  };

  const applyQuote = () => {
    const { start, end } = getSelectionRange();
    const { lineStart, lineEnd, line } = getLineRange(start, end);
    const lines = line.split('\n');
    const allQuoted = lines.every((lineItem) => lineItem.trim() === '' || /^\s*>\s?/.test(lineItem));
    const replacement = lines
      .map((lineItem) => {
        if (lineItem.trim() === '') {
          return lineItem;
        }
        const cleaned = lineItem.replace(/^\s*>\s?/, '');
        return allQuoted ? cleaned : `> ${cleaned}`;
      })
      .join('\n');
    applyEdit(replacement, lineStart, lineEnd, lineStart, lineStart + replacement.length);
  };

  const toggleCodeBlock = () => {
    const { start, end, text } = getSelectionRange();
    const fenceRange = findFenceRange(start, end);
    if (fenceRange) {
      const content = value.slice(fenceRange.contentStart, fenceRange.contentEnd);
      const selectionStart = Math.max(
        fenceRange.openFenceStart,
        fenceRange.openFenceStart + (start - fenceRange.contentStart)
      );
      const selectionEnd = Math.max(
        selectionStart,
        fenceRange.openFenceStart + (end - fenceRange.contentStart)
      );
      applyEdit(content, fenceRange.openFenceStart, fenceRange.closeFenceEnd, selectionStart, selectionEnd);
      return;
    }

    const content = text || 'код';
    const replacement = `\`\`\`text\n${content}\n\`\`\``;
    const selectionStart = start + 8;
    const selectionEnd = selectionStart + content.length;
    replaceSelection(replacement, selectionStart, selectionEnd);
  };

  const isValidHttpUrl = (next: string) => /^https?:\/\/\S+/i.test(next.trim());
  const isValidImageUrl = (next: string) => /^(https?:\/\/|blob:|data:image\/)\S+/i.test(next.trim());
  const isInsertableImageSource = (next: string) => /^(https?:\/\/|blob:|data:image\/|\/|\.\/|\.\.\/)\S+/i.test(next.trim());

  const insertLink = () => {
    if (!canUseLink) {
      return;
    }
    const trimmed = linkUrl.trim();
    if (!trimmed) {
      setPanelError('Введите URL ссылки.');
      return;
    }
    if (!isValidHttpUrl(trimmed)) {
      setPanelError('Некорректный URL. Разрешены только http/https.');
      return;
    }
    const text = linkText.trim() || 'Ссылка';
    const replacement = `[${text}](${trimmed})`;
    const { start } = getSelectionRange();
    const selectionStart = start + 1;
    const selectionEnd = selectionStart + text.length;
    replaceSelection(replacement, selectionStart, selectionEnd);
    setActivePanel(null);
    setPanelError('');
  };

  const insertImageByUrl = () => {
    if (!canUseImageUrl) {
      return;
    }
    const trimmed = imageUrl.trim();
    if (!trimmed) {
      setPanelError('Введите URL изображения.');
      return;
    }
    if (!isValidImageUrl(trimmed)) {
      setPanelError('Некорректный URL. Разрешены http/https, blob, data:image.');
      return;
    }
    const text = imageAlt.trim() || 'Изображение';
    const replacement = `![${text}](${trimmed})`;
    const { start } = getSelectionRange();
    const selectionStart = start + 2;
    const selectionEnd = selectionStart + text.length;
    replaceSelection(replacement, selectionStart, selectionEnd);
    setActivePanel(null);
    setPanelError('');
  };

  const handleFileInsert = async (file: File | null) => {
    if (!canUseImageFile || !file) {
      return;
    }

    let imageSource: string | null = null;
    if (typeof onImageFileUpload === 'function') {
      try {
        const resolved = await onImageFileUpload(file);
        if (typeof resolved === 'string' && resolved.trim() !== '') {
          imageSource = resolved.trim();
        }
      } catch {
        setPanelError('Не удалось загрузить изображение.');
        return;
      }
    }

    if (imageSource === null && insertImageFileAsBase64) {
      try {
        imageSource = await readFileAsDataUrl(file);
      } catch {
        setPanelError('Не удалось прочитать изображение.');
        return;
      }
    }

    if (imageSource === null || !isInsertableImageSource(imageSource)) {
      setPanelError('Не удалось получить URL изображения.');
      return;
    }

    if (imageSource.startsWith('blob:') && typeof URL !== 'undefined') {
      objectUrlsRef.current.push(imageSource);
    }

    const baseName = file.name.replace(/\.[^.]+$/, '');
    const replacement = `![${baseName || 'Изображение'}](${imageSource})`;
    const { start } = getSelectionRange();
    const selectionStart = start + 2;
    const selectionEnd = selectionStart + (baseName || 'Изображение').length;
    replaceSelection(replacement, selectionStart, selectionEnd);
    setPanelError('');
  };

  const handleOpenLinkPanel = () => {
    if (!canUseLink) {
      return;
    }
    const { text } = getSelectionRange();
    setLinkText(text || 'Ссылка');
    setLinkUrl('https://');
    setActivePanel((prev) => (prev === 'link' ? null : 'link'));
    setPanelError('');
  };

  const handleOpenImagePanel = () => {
    if (!canUseImageUrl) {
      return;
    }
    const { text } = getSelectionRange();
    setImageAlt(text || 'Изображение');
    setImageUrl('https://');
    setActivePanel((prev) => (prev === 'image-url' ? null : 'image-url'));
    setPanelError('');
  };

  const handleFileButtonClick = () => {
    if (readOnly || !canUseImageFile) {
      return;
    }
    setPanelError('');
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    await handleFileInsert(file);
    event.target.value = '';
  };

  const handlePreviewClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }
    const button = target.closest('[data-code-copy="true"]') as HTMLButtonElement | null;
    if (!button) {
      return;
    }
    event.preventDefault();

    const wrapper = button.closest('[data-code-block="true"]') as HTMLElement | null;
    const encoded = wrapper?.getAttribute('data-code');
    if (!encoded) {
      return;
    }

    let code = '';
    try {
      code = decodeURIComponent(encoded);
    } catch {
      return;
    }

    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied && typeof document !== 'undefined') {
      const area = document.createElement('textarea');
      area.value = code;
      area.setAttribute('readonly', 'true');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
      document.body.removeChild(area);
    }

    if (!copied) {
      return;
    }

    const defaultLabel = button.dataset.defaultLabel || button.textContent || 'Скопировать';
    button.dataset.defaultLabel = defaultLabel;
    button.textContent = 'Скопировано';

    const previousTimer = copyTimerRef.current.get(button);
    if (previousTimer) {
      window.clearTimeout(previousTimer);
    }
    const timerId = window.setTimeout(() => {
      button.textContent = defaultLabel;
      copyTimerRef.current.delete(button);
    }, 1400);
    copyTimerRef.current.set(button, timerId);
  };

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) {
      return;
    }
    if (event.nativeEvent.isComposing) {
      return;
    }

    const { start, end, text } = getSelectionRange();
    const hasSelection = start !== end;
    const hasModifier = event.ctrlKey || event.metaKey || event.altKey;
    const key = event.key;

    if (!hasModifier && hasSelection) {
      if (key === '"' || key === "'") {
        const marker = key;
        const hasLeft = start > 0 && value[start - 1] === marker;
        const hasRight = value[end] === marker;
        event.preventDefault();
        event.stopPropagation();
        if (hasLeft && hasRight) {
          scheduleSelection(start, end);
        } else {
          replaceSelection(`${marker}${text}${marker}`, start + 1, end + 1);
        }
        return;
      }

      if (key === '*') {
        event.preventDefault();
        event.stopPropagation();
        toggleItalic();
        return;
      }

      if (key === '_') {
        event.preventDefault();
        event.stopPropagation();
        toggleWrap('__', 'Подчеркнутый', true);
        return;
      }

      if (key === '~') {
        event.preventDefault();
        event.stopPropagation();
        toggleWrap('~~', 'Зачеркнутый');
        return;
      }
    }

    const isMod = event.ctrlKey || event.metaKey;
    if (!isMod) {
      return;
    }

    const consume = () => {
      event.preventDefault();
      event.stopPropagation();
    };

    const code = event.code;

    if (!event.altKey && code === 'KeyZ') {
      const handled = event.shiftKey ? redoEdit() : undoEdit();
      if (handled) {
        consume();
        return;
      }
    }

    if (!event.altKey && code === 'KeyY') {
      const handled = redoEdit();
      if (handled) {
        consume();
        return;
      }
    }

    if (event.altKey) {
      const digitMatch = /^Digit([1-6])$/.exec(code);
      const numpadMatch = /^Numpad([1-6])$/.exec(code);
      const level = digitMatch ? Number(digitMatch[1]) : numpadMatch ? Number(numpadMatch[1]) : null;
      if (level) {
        consume();
        applyHeading(level);
        return;
      }
    }

    if (event.shiftKey) {
      switch (code) {
        case 'KeyX':
          consume();
          toggleWrap('~~', 'Зачеркнутый');
          return;
        case 'KeyQ':
          consume();
          applyQuote();
          return;
        case 'KeyK':
          if (canUseImageUrl) {
            consume();
            handleOpenImagePanel();
          }
          return;
        default:
          break;
      }
      if (code === 'Digit7' || code === 'Numpad7') {
        consume();
        applyList('ol');
        return;
      }
      if (code === 'Digit8' || code === 'Numpad8') {
        consume();
        applyList('ul');
        return;
      }
    }

    if (event.altKey && code === 'KeyC') {
      consume();
      toggleCodeBlock();
      return;
    }

    switch (code) {
      case 'KeyB':
        consume();
        toggleWrap('**', 'Жирный', true);
        return;
      case 'KeyI':
        consume();
        toggleItalic();
        return;
      case 'KeyU':
        consume();
        toggleWrap('__', 'Подчеркнутый', true);
        return;
      case 'KeyE':
        consume();
        toggleWrap('`', 'Код', true);
        return;
      case 'KeyK':
        if (canUseLink) {
          consume();
          handleOpenLinkPanel();
        }
        return;
      default:
        break;
    }
  };

  const headingActive = activeFormats.heading !== null;
  const formatActive =
    activeFormats.bold
    || activeFormats.italic
    || activeFormats.underline
    || activeFormats.strike
    || activeFormats.code
    || activeFormats.codeBlock
    || activeFormats.quote
    || activeFormats.list !== null;

  const headingItems: MenuItem[] = [
    {
      label: 'H1 Заголовок',
      icon: 'H1',
      onClick: () => applyHeading(1),
      meta: 'Ctrl/Meta+Alt+1',
      disabled: readOnly,
      active: activeFormats.heading === 1,
    },
    {
      label: 'H2 Заголовок',
      icon: 'H2',
      onClick: () => applyHeading(2),
      meta: 'Ctrl/Meta+Alt+2',
      disabled: readOnly,
      active: activeFormats.heading === 2,
    },
    {
      label: 'H3 Заголовок',
      icon: 'H3',
      onClick: () => applyHeading(3),
      meta: 'Ctrl/Meta+Alt+3',
      disabled: readOnly,
      active: activeFormats.heading === 3,
    },
    {
      label: 'H4 Заголовок',
      icon: 'H4',
      onClick: () => applyHeading(4),
      meta: 'Ctrl/Meta+Alt+4',
      disabled: readOnly,
      active: activeFormats.heading === 4,
    },
    {
      label: 'H5 Заголовок',
      icon: 'H5',
      onClick: () => applyHeading(5),
      meta: 'Ctrl/Meta+Alt+5',
      disabled: readOnly,
      active: activeFormats.heading === 5,
    },
    {
      label: 'H6 Заголовок',
      icon: 'H6',
      onClick: () => applyHeading(6),
      meta: 'Ctrl/Meta+Alt+6',
      disabled: readOnly,
      active: activeFormats.heading === 6,
    },
  ];

  const formatItems: MenuItem[] = [
    {
      label: 'Жирный',
      icon: 'B',
      onClick: () => toggleWrap('**', 'Жирный', true),
      meta: 'Ctrl/Meta+B',
      disabled: readOnly,
      active: activeFormats.bold,
    },
    {
      label: 'Курсив',
      icon: 'I',
      onClick: () => toggleItalic(),
      meta: 'Ctrl/Meta+I',
      disabled: readOnly,
      active: activeFormats.italic,
    },
    {
      label: 'Подчеркнутый',
      icon: 'U',
      onClick: () => toggleWrap('__', 'Подчеркнутый', true),
      meta: 'Ctrl/Meta+U',
      disabled: readOnly,
      active: activeFormats.underline,
    },
    {
      label: 'Зачеркнутый',
      icon: 'S',
      onClick: () => toggleWrap('~~', 'Зачеркнутый'),
      meta: 'Ctrl/Meta+Shift+X',
      disabled: readOnly,
      active: activeFormats.strike,
    },
    { divider: true },
    {
      label: 'Inline код',
      icon: '</>',
      onClick: () => toggleWrap('`', 'Код', true),
      meta: 'Ctrl/Meta+E',
      disabled: readOnly,
      active: activeFormats.code,
    },
    {
      label: 'Код блок',
      icon: '{}',
      onClick: () => toggleCodeBlock(),
      meta: 'Ctrl/Meta+Alt+C',
      disabled: readOnly,
      active: activeFormats.codeBlock,
    },
    { divider: true },
    {
      label: 'Цитата',
      icon: '>',
      onClick: () => applyQuote(),
      meta: 'Ctrl/Meta+Shift+Q',
      disabled: readOnly,
      active: activeFormats.quote,
    },
    {
      label: 'Маркированный список',
      icon: '*',
      onClick: () => applyList('ul'),
      meta: 'Ctrl/Meta+Shift+8',
      disabled: readOnly,
      active: activeFormats.list === 'ul',
    },
    {
      label: 'Нумерованный список',
      icon: '1.',
      onClick: () => applyList('ol'),
      meta: 'Ctrl/Meta+Shift+7',
      disabled: readOnly,
      active: activeFormats.list === 'ol',
    },
  ];

  const renderHeadingButton = (key: React.Key) => (
    <React.Fragment key={key}>
      {readOnly ? (
        <span
          className={[
            styles.toolButton,
            styles.toolButtonDisabled,
            headingActive ? styles.toolButtonActive : null,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          Заголовок
          <span className={styles.toolCaret} aria-hidden="true" />
        </span>
      ) : (
        <Dropdown
          items={headingItems}
          align="left"
          trigger={(
            <span className={[styles.toolButton, headingActive ? styles.toolButtonActive : null].filter(Boolean).join(' ')}>
              Заголовок
              <span className={styles.toolCaret} aria-hidden="true" />
            </span>
          )}
        />
      )}
    </React.Fragment>
  );

  const renderFormatButton = (key: React.Key) => (
    <React.Fragment key={key}>
      {readOnly ? (
        <span
          className={[
            styles.toolButton,
            styles.toolButtonDisabled,
            formatActive ? styles.toolButtonActive : null,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          Формат
          <span className={styles.toolCaret} aria-hidden="true" />
        </span>
      ) : (
        <Dropdown
          items={formatItems}
          align="left"
          trigger={(
            <span className={[styles.toolButton, formatActive ? styles.toolButtonActive : null].filter(Boolean).join(' ')}>
              Формат
              <span className={styles.toolCaret} aria-hidden="true" />
            </span>
          )}
        />
      )}
    </React.Fragment>
  );

  const renderIconButton = ({
    key,
    active = false,
    onClick,
    icon,
    tooltip,
    ariaLabel,
    disabled,
  }: {
    key: React.Key;
    active?: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    tooltip: string;
    ariaLabel: string;
    disabled: boolean;
  }) => (
    <Tooltip key={key} content={tooltip}>
      <span className={styles.toolIconButtonWrap}>
        <button
          type="button"
          className={[
            styles.toolButton,
            styles.toolIconButton,
            active ? styles.toolButtonActive : null,
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel}
        >
          {icon}
        </button>
      </span>
    </Tooltip>
  );

  const renderToolbarItem = (item: MarkdownToolbarItem, key: React.Key) => {
    switch (item) {
      case 'heading':
        return renderHeadingButton(key);
      case 'format':
        return renderFormatButton(key);
      case 'link':
        if (!canUseLink) {
          return null;
        }
        return renderIconButton({
          key,
          active: activePanel === 'link',
          onClick: handleOpenLinkPanel,
          icon: <LinkIcon />,
          tooltip: 'Вставить ссылку (Ctrl/Meta+K)',
          ariaLabel: 'Вставить ссылку',
          disabled: readOnly,
        });
      case 'image-url':
        if (!canUseImageUrl) {
          return null;
        }
        return renderIconButton({
          key,
          active: activePanel === 'image-url',
          onClick: handleOpenImagePanel,
          icon: <ImageUrlIcon />,
          tooltip: 'Вставить изображение по URL (Ctrl/Meta+Shift+K)',
          ariaLabel: 'Вставить изображение по URL',
          disabled: readOnly,
        });
      case 'image-file':
        if (!canUseImageFile) {
          return null;
        }
        return renderIconButton({
          key,
          onClick: handleFileButtonClick,
          icon: <ImageFileIcon />,
          tooltip: 'Загрузить изображение',
          ariaLabel: 'Загрузить изображение',
          disabled: readOnly,
        });
      default:
        return null;
    }
  };

  const renderEditorPanel = (slotProps?: MarkdownEditorSlotProps, slotKey?: React.Key) => {
    return (
      <div key={slotKey} className={[styles.panel, editorClassName, slotProps?.className].filter(Boolean).join(' ')}>
        <div className={styles.panelHeader}>{slotProps?.label ?? editorLabel}</div>
        <div className={styles.toolbar}>
          {toolbarGroups.map((group, groupIndex) => {
            const groupNodes = group
              .map((item, itemIndex) => renderToolbarItem(item, `toolbar-item-${groupIndex}-${itemIndex}`))
              .filter(Boolean);
            if (groupNodes.length === 0) {
              return null;
            }

            return (
              <div key={`toolbar-group-${groupIndex}`} className={styles.toolbarGroup}>
                {groupNodes}
              </div>
            );
          })}
          {canUseImageFile ? (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleFileChange}
              tabIndex={-1}
            />
          ) : null}
        </div>
        {activePanel === 'link' && canUseLink ? (
          <div className={styles.toolPanel}>
            <input
              type="text"
              className={styles.toolInput}
              value={linkText}
              onChange={(event) => {
                setLinkText(event.target.value);
                setPanelError('');
              }}
              placeholder="Текст ссылки"
              disabled={readOnly}
            />
            <input
              type="text"
              className={styles.toolInput}
              value={linkUrl}
              onChange={(event) => {
                setLinkUrl(event.target.value);
                setPanelError('');
              }}
              placeholder="https://example.com"
              disabled={readOnly}
            />
            <button type="button" className={styles.toolAction} onClick={insertLink} disabled={readOnly}>
              Вставить
            </button>
            {panelError ? <div className={styles.toolError}>{panelError}</div> : null}
          </div>
        ) : null}
        {activePanel === 'image-url' && canUseImageUrl ? (
          <div className={styles.toolPanel}>
            <input
              type="text"
              className={styles.toolInput}
              value={imageAlt}
              onChange={(event) => {
                setImageAlt(event.target.value);
                setPanelError('');
              }}
              placeholder="Alt текст"
              disabled={readOnly}
            />
            <input
              type="text"
              className={styles.toolInput}
              value={imageUrl}
              onChange={(event) => {
                setImageUrl(event.target.value);
                setPanelError('');
              }}
              placeholder="https://example.com/image.png"
              disabled={readOnly}
            />
            <button type="button" className={styles.toolAction} onClick={insertImageByUrl} disabled={readOnly}>
              Вставить
            </button>
            {panelError ? <div className={styles.toolError}>{panelError}</div> : null}
          </div>
        ) : null}
        {panelError && activePanel === null ? (
          <div className={styles.toolError}>{panelError}</div>
        ) : null}
        <Textarea
          ref={textareaRef}
          id={slotProps?.id ?? textareaFallbackId}
          name={slotProps?.name ?? 'markdown'}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleTextareaKeyDown}
          onKeyUp={updateActiveFormats}
          onSelect={updateActiveFormats}
          onClick={updateActiveFormats}
          className={styles.textarea}
          readOnly={readOnly}
        />
      </div>
    );
  };

  const renderPreviewPanel = (slotProps?: MarkdownEditorSlotProps, slotKey?: React.Key) => {
    return (
      <div key={slotKey} className={[styles.panel, previewClassName, slotProps?.className].filter(Boolean).join(' ')}>
        <div className={styles.panelHeader}>{slotProps?.label ?? previewLabel}</div>
        <div className={styles.preview} data-empty={value === ''} onClick={handlePreviewClick}>
          {value ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null}
        </div>
      </div>
    );
  };

  const renderValue = (input: unknown, path = 'root'): unknown => {
    if (Array.isArray(input)) {
      let changed = false;
      const next = input.map((item, index) => {
        const rendered = renderValue(item, `${path}.${index}`);
        if (rendered !== item) {
          changed = true;
        }
        return rendered;
      });
      return changed ? next : input;
    }

    if (React.isValidElement(input)) {
      if (input.type === MarkdownEditorTextareaSlot) {
        return renderEditorPanel(input.props as MarkdownEditorSlotProps, input.key ?? `${path}:editor`);
      }
      if (input.type === MarkdownEditorPreviewSlot) {
        return renderPreviewPanel(input.props as MarkdownEditorSlotProps, input.key ?? `${path}:preview`);
      }

      const props = (input.props ?? {}) as Record<string, unknown>;
      let changed = false;
      const nextProps: Record<string, unknown> = {};
      Object.keys(props).forEach((key) => {
        const nextValue = renderValue(props[key], `${path}.${key}`);
        nextProps[key] = nextValue;
        if (nextValue !== props[key]) {
          changed = true;
        }
      });
      if (!changed) {
        return input;
      }
      return React.cloneElement(input as React.ReactElement<Record<string, unknown>>, nextProps);
    }

    if (input && typeof input === 'object') {
      const record = input as Record<string, unknown>;
      let changed = false;
      const nextRecord: Record<string, unknown> = {};
      Object.keys(record).forEach((key) => {
        const nextValue = renderValue(record[key], `${path}.${key}`);
        nextRecord[key] = nextValue;
        if (nextValue !== record[key]) {
          changed = true;
        }
      });
      return changed ? nextRecord : input;
    }

    return input;
  };

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{
        ['--markdown-editor-min-height' as string]: `${minHeight}px`,
      }}
    >
      {label ? (
        <div className={styles.label}>
          <span>{label}</span>
          <Hint content={hint} placement={hintPlacement} ariaLabel={`Подсказка к полю "${label}"`} />
        </div>
      ) : null}
      {renderValue(children) as React.ReactNode}
    </div>
  );
}

type MarkdownEditorComponent = typeof MarkdownEditorRoot & {
  Textarea: typeof MarkdownEditorTextareaSlot;
  Preview: typeof MarkdownEditorPreviewSlot;
};

const MarkdownEditor = MarkdownEditorRoot as MarkdownEditorComponent;
MarkdownEditor.Textarea = MarkdownEditorTextareaSlot;
MarkdownEditor.Preview = MarkdownEditorPreviewSlot;

export default MarkdownEditor;
