import React, {ChangeEvent, DragEvent, useEffect, useRef, useState} from "react";
import {Button, Col, Figure, Form, Row} from "react-bootstrap";
import {toast} from "react-toastify";

export type AllowedTypes = '.jpg' | '.jpeg' | '.png' | '.webp' | '.gif' | '.pdf' | '.doc' | '.docx' | '.xls' | '.xlsx' | '.csv' | '.txt';

type FileUploaderProps = {
    handleChange?: (files: File[]) => void;
    handleUpload: (files: File[]) => void;
    autoUpload?: boolean;
    fileTypes: AllowedTypes[];
    maxFileSizeKb: number;
    multiple?: boolean;
    dropLabel?: string;
    supportedTypesLabel?: string;
    maxFileSizeLabel?: string;
    buttonLabel?: string;
    filesPlural?: string[];
    selectedPlural?: string[];
};

type Base64FileType = {
    name: string;
    data: string;
};

export default function FileUploader({
    handleChange,
    handleUpload,
    autoUpload = false,
    fileTypes,
    maxFileSizeKb,
    multiple,
    dropLabel = 'Для загрузки переместите файлы в эту область',
    supportedTypesLabel = 'Допустимые форматы:',
    maxFileSizeLabel = 'Максимальный размер каждого файла',
    buttonLabel = 'Выбрать файлы',
    filesPlural = ['файл', 'файла', 'файлов'],
    selectedPlural = ['выбран', 'выбрано', 'выбрано'],
}: FileUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [base64Files, setBase64Files] = useState<Base64FileType[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Генерация случайного имени для файла
    function generateName(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // Переименование файла при конфликте имен
    function renameFile(file: File): File {
        const extension = '.' + file.name.split('.').pop();
        if (files.some(f => f.name === file.name)) {
            const newName = file.name.split('.').slice(0, -1).join('.') + '_' + generateName(5) + extension;
            return new File([file], newName, { type: file.type });
        }
        return file;
    }

    // Валидация файла
    function validateFile(file: File): boolean {
        const extension = '.' + file.name.split('.').pop();
        if (!fileTypes.includes(extension as AllowedTypes)) {
            setErrors(prev => [...prev, `Файл ${file.name} имеет недопустимое расширение`]);
            return false;
        }

        const fileSizeKb = Math.ceil(file.size / 1024);
        if (fileSizeKb > maxFileSizeKb) {
            setErrors(prev => [...prev, `Вес файла ${file.name} (${fileSizeKb} кб) превышает максимально допустимое значение`]);
            return false;
        }

        return true;
    }

    // Конвертация в base64
    async function convertToBase64Async(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result?.toString() || '');
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // Обработчик изменения файлов
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (!multiple && selectedFiles?.length > 1) {
            setFiles([]);
            setBase64Files([])
        }

        setErrors([]);

        if (selectedFiles?.length) {
            const newFiles = Array.from(selectedFiles);
            processFiles(newFiles);
        }

        // Сбрасываем значение input, чтобы можно было выбрать тот же файл снова
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    };

    // Обработчик drag and drop
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setErrors([]);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length) {
            const newFiles = Array.from(droppedFiles);
            processFiles(newFiles);
        }
    };

    // Основная обработка файлов
    const processFiles = (newFiles: File[]) => {
        const processedFiles = newFiles
            .filter(validateFile)
            .map(file => multiple ? renameFile(file) : file);

        if (!processedFiles.length) return;

        const updatedFiles = multiple ? [...files, ...processedFiles] : [processedFiles[0]];
        setFiles(updatedFiles);
        handleChange?.(updatedFiles);
    };

    // Загрузка файлов
    const onUpload = async () => {
        if (!files.length) return;

        try {
            setIsUploading(true);
            await handleUpload(files);
            setFiles([]);
            setBase64Files([]);
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    // Эффект для конвертации изображений в base64
    useEffect(() => {
        const processImages = async () => {
            const imageFiles = files.filter(file => /image\/(jpe?g|png|webp|gif|svg)$/i.test(file.type));

            for (const file of imageFiles) {
                if (!base64Files.some(f => f.name === file.name)) {
                    try {
                        const base64 = await convertToBase64Async(file);
                        setBase64Files(prev => [...prev, { name: file.name, data: base64 }]);
                    } catch (error) {
                        console.error("Failed to convert image:", error);
                    }
                }
            }
        };

        processImages();
    }, [files]);

    // Эффект для авто-загрузки
    useEffect(() => {
        if (autoUpload && files.length) {
            onUpload();
        }
    }, [files, autoUpload]);

    // Эффект для отображения ошибок
    useEffect(() => {
        errors.forEach(error => toast.error(error));
    }, [errors]);

    // Функция для склонения слов
    function pluralize(num: number, titles: string[]): string {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[(num % 100 > 4 && num % 100 < 20) ? 2 : cases[Math.min(num % 10, 5)]];
    }

    const totalFilesText = `${files.length} ${pluralize(files.length, filesPlural)} ${pluralize(files.length, selectedPlural)}`;

    return (
        <div className="drag-n-drop">
            <div
                className={`drag-n-drop-area ${files.length ? "active" : ""}`}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
            >
                <div className="upload-info">
                    <div>
                        <p>{dropLabel}</p>
                        <p>{supportedTypesLabel} {fileTypes.join(', ').toLowerCase()}</p>
                        <p className="mb-3">{maxFileSizeLabel} {maxFileSizeKb} кбайт</p>

                        <Form.Control
                            id="fileBrowse"
                            type="file"
                            onChange={handleFileChange}
                            hidden
                            multiple={multiple}
                            accept={fileTypes.join(',')}
                            ref={fileInputRef}
                        />

                        <label htmlFor="fileBrowse"
                               className="btn btn-success d-flex justify-content-center align-items-center">
                            {buttonLabel}
                        </label>
                    </div>
                </div>

                <div className="uploaded-files">
                    {base64Files.length > 0 && (
                        <Row>
                            {base64Files.map((file, index) => (
                                <Col xl={1} lg={2} md={4} sm={6} xs={6} key={`img_${index}`}>
                                    <Figure className="d-flex flex-column align-items-center">
                                        <Figure.Image alt={file.name} src={file.data} />
                                        <Figure.Caption className="text-center">
                                            <small>{file.name}</small>
                                        </Figure.Caption>
                                    </Figure>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>

                {files.length > 0 && (
                    <div className="success-file">
                        <p>{totalFilesText}</p>
                        {!autoUpload && (
                            <Button
                                variant="success"
                                onClick={onUpload}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Загрузка...' : 'Загрузить'}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
