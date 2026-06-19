import React from 'react';
import { Card, Tabs } from '@phpsoftbox/react-softbox';
import { MarkdownEditor } from '@phpsoftbox/react-softbox/markdown';

export default function MarkdownEditorDemo() {
  const [markdownValue, setMarkdownValue] = React.useState(
    '# Документация\n\n**ReactSoftBox** — быстрый старт.\n\n- Пункты списка\n- Поддержка `inline` кода\n\n> Важная заметка: не забудьте подключить базовые стили.\n\n```ts\nconst ready = true;\nconst title = "ReactSoftBox";\nconsole.log(title, ready);\n```\n\n[Открыть сайт](https://phpsoftbox.com)\n',
  );

  return (
    <Card className="gridCard gridCardWide">
      <Card.Header title="MarkdownEditor" />
      <Card.Body>
        <MarkdownEditor
          label="Описание релиза"
          value={markdownValue}
          onChange={setMarkdownValue}
          placeholder="Введите markdown..."
        >
          <Tabs
            items={[
              {
                id: 'markdown-editor-tab',
                label: 'Редактор',
                content: <MarkdownEditor.Textarea label="Редактор" />,
              },
              {
                id: 'markdown-preview-tab',
                label: 'Просмотр',
                content: <MarkdownEditor.Preview label="Предпросмотр" />,
              },
            ]}
            defaultActiveId="markdown-editor-tab"
          />
        </MarkdownEditor>
      </Card.Body>
    </Card>
  );
}
