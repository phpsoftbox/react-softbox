import React from 'react';
import Button from '../Button/Button';
import styles from './FileUploader.module.css';

export type FileUploaderProps = {
  value?: File[];
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void> | void;
  autoUpload?: boolean;
  multiple?: boolean;
  accept?: string;
  allowedTypes?: string[];
  maxFileSizeKb?: number;
  disabled?: boolean;
  showPreview?: boolean;
  uploadButtonAlign?: 'left' | 'right';
  uploadButtonPlacement?: 'beforePreview' | 'afterPreview' | 'both';
  externalErrors?: string[];
  dropLabel?: React.ReactNode;
  supportedTypesLabel?: React.ReactNode;
  maxFileSizeLabel?: React.ReactNode;
  buttonLabel?: React.ReactNode;
  uploadLabel?: React.ReactNode;
  filesLabel?: (count: number) => React.ReactNode;
  allowRemove?: boolean;
  removeLabel?: React.ReactNode;
  className?: string;
};

const toLower = (value: string) => value.trim().toLowerCase();

const getExtension = (name: string) => {
  const segments = name.split('.');
  if (segments.length < 2) {
    return '';
  }
  return `.${segments.pop()}`.toLowerCase();
};

const isAllowedType = (file: File, allowedTypes: string[]) => {
  if (!allowedTypes.length) {
    return true;
  }
  const fileType = toLower(file.type || '');
  const ext = getExtension(file.name);

  return allowedTypes.some((type) => {
    const token = toLower(type);
    if (!token) {
      return false;
    }
    if (token.endsWith('/*')) {
      return fileType.startsWith(token.slice(0, -1));
    }
    if (token.startsWith('.')) {
      return ext === token;
    }
    return fileType === token || ext === token;
  });
};

const isImage = (file: File) => file.type.startsWith('image/');

const defaultFilesLabel = (count: number) => `Выбрано: ${count}`;

export default function FileUploader({
  value,
  defaultValue,
  onChange,
  onUpload,
  autoUpload = false,
  multiple = false,
  accept,
  allowedTypes = [],
  maxFileSizeKb,
  disabled = false,
  showPreview = false,
  uploadButtonAlign = 'right',
  uploadButtonPlacement = 'afterPreview',
  externalErrors = [],
  dropLabel = 'Перетащите файлы сюда или выберите вручную',
  supportedTypesLabel = 'Допустимые форматы:',
  maxFileSizeLabel = 'Максимальный размер файла:',
  buttonLabel = 'Выбрать файлы',
  uploadLabel = 'Загрузить',
  filesLabel = defaultFilesLabel,
  allowRemove = true,
  removeLabel = 'Удалить',
  className,
}: FileUploaderProps) {
  const [internalFiles, setInternalFiles] = React.useState<File[]>(defaultValue ?? []);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [previews, setPreviews] = React.useState<Array<{ name: string; url: string; fileIndex: number }>>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const files = value ?? internalFiles;

  const updateFiles = React.useCallback(
    (next: File[]) => {
      if (value === undefined) {
        setInternalFiles(next);
      }
      onChange?.(next);
    },
    [onChange, value],
  );

  const validateFiles = React.useCallback(
    (incoming: File[]) => {
      const nextErrors: string[] = [];
      const validFiles = incoming.filter((file) => {
        if (!isAllowedType(file, allowedTypes)) {
          nextErrors.push(`Файл ${file.name} имеет недопустимый формат`);
          return false;
        }
        if (maxFileSizeKb) {
          const sizeKb = Math.ceil(file.size / 1024);
          if (sizeKb > maxFileSizeKb) {
            nextErrors.push(`Файл ${file.name} превышает ${maxFileSizeKb} кбайт`);
            return false;
          }
        }
        return true;
      });
      return { validFiles, nextErrors };
    },
    [allowedTypes, maxFileSizeKb],
  );

  const handleFiles = React.useCallback(
    (list: FileList | null) => {
      if (disabled || !list) {
        return;
      }
      const incoming = Array.from(list);
      const { validFiles, nextErrors } = validateFiles(incoming);
      setErrors(nextErrors);

      if (!validFiles.length) {
        return;
      }

      const next = multiple ? [...files, ...validFiles] : [validFiles[0]];
      updateFiles(next);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [disabled, files, multiple, updateFiles, validateFiles],
  );

  const handleBrowse = () => {
    if (disabled) {
      return;
    }
    inputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    }
    if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleUpload = React.useCallback(async () => {
    if (!onUpload || !files.length || disabled) {
      return;
    }
    try {
      setIsUploading(true);
      await onUpload(files);
      updateFiles([]);
    } finally {
      setIsUploading(false);
    }
  }, [disabled, files, onUpload, updateFiles]);

  const removeFile = React.useCallback((fileIndex: number) => {
    if (disabled || fileIndex < 0 || fileIndex >= files.length) {
      return;
    }

    const next = files.filter((_, index) => index !== fileIndex);
    updateFiles(next);
    setErrors([]);
  }, [disabled, files, updateFiles]);

  React.useEffect(() => {
    if (autoUpload && onUpload && files.length) {
      handleUpload();
    }
  }, [autoUpload, files, handleUpload, onUpload]);

  React.useEffect(() => {
    if (!showPreview) {
      setPreviews([]);
      return;
    }

    const next: Array<{ name: string; url: string; fileIndex: number }> = [];
    files.forEach((file, fileIndex) => {
      if (!isImage(file)) {
        return;
      }

      next.push({
        name: file.name,
        url: URL.createObjectURL(file),
        fileIndex,
      });
    });

    setPreviews(next);
    return () => {
      next.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [files, showPreview]);

  const acceptValue = accept ?? (allowedTypes.length ? allowedTypes.join(',') : undefined);
  const metaParts = [
    allowedTypes.length ? `${supportedTypesLabel} ${allowedTypes.join(', ')}` : null,
    maxFileSizeKb ? `${maxFileSizeLabel} ${maxFileSizeKb} кбайт` : null,
  ].filter(Boolean);

  const wrapperClasses = [
    styles.uploader,
    dragActive ? styles.dragActive : null,
    disabled ? styles.disabled : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const shouldShowUploadButton = !!onUpload && !autoUpload && files.length > 0;
  const shouldRenderBeforePreview = uploadButtonPlacement === 'beforePreview' || uploadButtonPlacement === 'both';
  const shouldRenderAfterPreview = uploadButtonPlacement === 'afterPreview' || uploadButtonPlacement === 'both';
  const actionsClasses = [
    styles.actions,
    uploadButtonAlign === 'left' ? styles.actionsLeft : styles.actionsRight,
  ]
    .filter(Boolean)
    .join(' ');

  const renderUploadButton = () => {
    if (!shouldShowUploadButton) {
      return null;
    }

    return (
      <div className={actionsClasses}>
        <Button variant="primary" type="button" onClick={handleUpload} disabled={disabled || isUploading}>
          {isUploading ? 'Загрузка...' : uploadLabel}
        </Button>
      </div>
    );
  };

  return (
    <div className={wrapperClasses}>
      <div
        className={styles.dropzone}
        onDrop={handleDrop}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
      >
        <input
          ref={inputRef}
          type="file"
          className={styles.input}
          onChange={(event) => handleFiles(event.target.files)}
          multiple={multiple}
          accept={acceptValue}
          disabled={disabled}
        />
        <div className={styles.dropContent}>
          <div className={styles.dropLabel}>{dropLabel}</div>
          {metaParts.length ? (
            <div className={styles.meta}>
              {metaParts.map((item, index) => (
                <div key={`${index}`} className={styles.metaItem}>
                  {item}
                </div>
              ))}
            </div>
          ) : null}
          <Button appearance="outline" type="button" onClick={handleBrowse} disabled={disabled}>
            {buttonLabel}
          </Button>
          {externalErrors.length ? (
            <ul className={styles.inlineErrors}>
              {externalErrors.map((error, index) => (
                <li key={`${error}-${index}`}>{error}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {files.length ? (
        <div className={styles.filesInfo}>
          <div className={styles.filesCount}>{filesLabel(files.length)}</div>
          <div className={styles.filesList}>
            {files.map((file, index) => (
              <div key={`${file.name}-${file.size}-${file.lastModified}`} className={styles.fileItem}>
                <div className={styles.fileMeta}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>{Math.ceil(file.size / 1024)} кбайт</span>
                </div>
                {allowRemove ? (
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeFile(index)}
                    disabled={disabled || isUploading}
                  >
                    {removeLabel}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {shouldRenderBeforePreview ? renderUploadButton() : null}

      {showPreview && previews.length ? (
        <div className={styles.previewGrid}>
          {previews.map((preview) => (
            <div key={preview.url} className={styles.previewItem}>
              {allowRemove ? (
                <button
                  type="button"
                  className={styles.previewRemove}
                  onClick={() => removeFile(preview.fileIndex)}
                  disabled={disabled || isUploading}
                  aria-label={`Удалить ${preview.name}`}
                >
                  ×
                </button>
              ) : null}
              <img src={preview.url} alt={preview.name} className={styles.previewImage} />
              <div className={styles.previewName}>{preview.name}</div>
            </div>
          ))}
        </div>
      ) : null}

      {shouldRenderAfterPreview ? renderUploadButton() : null}

      {errors.length ? (
        <ul className={styles.errors}>
          {errors.map((error, index) => (
            <li key={`${error}-${index}`}>{error}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
