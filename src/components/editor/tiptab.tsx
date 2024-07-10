import React, { useEffect } from 'react';
import { Space } from 'antd';
import { useEditor, EditorContent } from '@tiptap/react';
import type { EditorEvents } from '@tiptap/react';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import StarterKit from '@tiptap/starter-kit';
import ToolBar from './plugins/tool-bar';
import { useDispatch, useSelector } from 'react-redux';
import { updateNote, getNoteByKey } from '@/store/slice/note-slice';
import type { RootState } from '@/store';

import './index.less';

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

const Editor: React.FC = () => {
  const dispatch = useDispatch();
  const selectedKey = useSelector((state: RootState) => state.note.selectedKey);
  const content = useSelector(getNoteByKey)?.content || '';

  const handleUpdate = (props: EditorEvents['update']) => {
    const { editor } = props;
    dispatch(
      updateNote({
        key: selectedKey,
        changeValue: { content: editor.getHTML() },
      }),
    );
  };

  const editor = useEditor(
    {
      extensions,
      content: content || '',
      onUpdate: handleUpdate,
    },
    [selectedKey],
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
