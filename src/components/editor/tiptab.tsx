import React, { useEffect } from 'react';
import { Space } from 'antd';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import StarterKit from '@tiptap/starter-kit';

import { useEditor, EditorContent } from '@tiptap/react';

import ToolBar from './plugins/tool-bar';

import type { EditorEvents } from '@tiptap/react';

import './index.less';

export interface EditorProps {
  content?: string;
  onUpdate?: (html: string) => void;
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({}),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
];

const Editor: React.FC<EditorProps> = (props) => {
  const { content, onUpdate } = props;

  const handleUpdate = (props: EditorEvents['update']) => {
    const { editor } = props;
    onUpdate?.(editor.getHTML());
  };

  const editor = useEditor(
    {
      extensions,
      content: content || 'hello world',
      onUpdate: handleUpdate,
    },
    [content],
  );

  useEffect(() => {
    editor?.commands.focus('end');
  }, [editor]);

  return (
    <Space direction='vertical' size='large'>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </Space>
  );
};

export default Editor;
