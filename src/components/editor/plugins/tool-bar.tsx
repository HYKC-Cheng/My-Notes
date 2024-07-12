import React from 'react';
import type { Editor } from '@tiptap/react';
import { Button, Tooltip, Flex, Divider } from 'antd';
import {
  RedoOutlined,
  UndoOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  TagOutlined,
  CodeOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  DashOutlined,
  FontColorsOutlined,
  CheckSquareOutlined,
  ImportOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { downloadJson, readJson } from '@/utils';
import { LOCAL_STORAGE_KEY } from '@/store/const';
import { themeConfig } from '@/styles/config';
import { useSelector, useDispatch } from 'react-redux';
import { refresh } from '@/store/slice/note-slice';

import type { RootState } from '@/store';

const ToolBar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  const dispatch = useDispatch();
  const themeType = useSelector((state: RootState) => state.theme.theme);

  if (!editor) {
    return null;
  }

  return (
    // 外部容器
    <Flex gap={4} wrap align='center'>
      <Tooltip title='颜色'>
        <Button
          onClick={() => {
            if (
              editor.isActive('textStyle', {
                color: themeConfig['--theme-primary'][themeType],
              })
            ) {
              editor.chain().focus().setColor('').run();
            } else {
              editor
                .chain()
                .focus()
                .setColor(themeConfig['--theme-primary'][themeType])
                .run();
            }
          }}
          type={
            editor.isActive('textStyle', {
              color: themeConfig['--theme-primary'][themeType],
            })
              ? 'primary'
              : 'text'
          }
          icon={<FontColorsOutlined />}
        />
      </Tooltip>

      <Tooltip title='加粗'>
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          type={editor.isActive('bold') ? 'primary' : 'text'}
          icon={<BoldOutlined />}
        />
      </Tooltip>

      <Tooltip title='斜体'>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          type={editor.isActive('italic') ? 'primary' : 'text'}
          icon={<ItalicOutlined />}
        />
      </Tooltip>

      <Tooltip title='删除线'>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          type={editor.isActive('strike') ? 'primary' : 'text'}
          icon={<StrikethroughOutlined />}
        />
      </Tooltip>

      <Tooltip title='下划线'>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          type={editor.isActive('underline') ? 'primary' : 'text'}
          icon={<UnderlineOutlined />}
        />
      </Tooltip>

      <Tooltip title='分割线'>
        <Button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          type='text'
          icon={<DashOutlined />}
        />
      </Tooltip>

      <Divider style={{ fontSize: '24px', color: '#000' }} type='vertical' />

      <Tooltip title='左对齐'>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          disabled={!editor.can().chain().focus().setTextAlign('left').run()}
          type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'text'}
          icon={<AlignLeftOutlined />}
        />
      </Tooltip>

      <Tooltip title='居中对齐'>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          disabled={!editor.can().chain().focus().setTextAlign('center').run()}
          type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'text'}
          icon={<AlignCenterOutlined />}
        />
      </Tooltip>

      <Tooltip title='右对齐'>
        <Button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          disabled={!editor.can().chain().focus().setTextAlign('right').run()}
          type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'text'}
          icon={<AlignRightOutlined />}
        />
      </Tooltip>

      <Divider style={{ fontSize: '24px', color: '#000' }} type='vertical' />

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        type={editor.isActive('heading', { level: 1 }) ? 'primary' : 'text'}
      >
        H1
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        type={editor.isActive('heading', { level: 2 }) ? 'primary' : 'text'}
      >
        H2
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        type={editor.isActive('heading', { level: 3 }) ? 'primary' : 'text'}
      >
        H3
      </Button>

      <Divider style={{ fontSize: '24px', color: '#000' }} type='vertical' />

      <Tooltip title='无序列表'>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type={editor.isActive('bulletList') ? 'primary' : 'text'}
          icon={<UnorderedListOutlined />}
        />
      </Tooltip>

      <Tooltip title='有序列表'>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type={editor.isActive('orderedList') ? 'primary' : 'text'}
          icon={<OrderedListOutlined />}
        />
      </Tooltip>

      <Tooltip title='待办列表'>
        <Button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          disabled={!editor.can().chain().focus().toggleTaskList().run()}
          type={editor.isActive('taskList') ? 'primary' : 'text'}
          icon={<CheckSquareOutlined />}
        />
      </Tooltip>

      <Divider style={{ fontSize: '24px', color: '#000' }} type='vertical' />

      <Tooltip title='撤销'>
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          icon={<UndoOutlined />}
          type='text'
        />
      </Tooltip>

      <Tooltip title='重做'>
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          icon={<RedoOutlined />}
          type='text'
        />
      </Tooltip>

      <Divider style={{ fontSize: '24px', color: '#000' }} type='vertical' />

      <Tooltip title='标签'>
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          type={editor.isActive('code') ? 'primary' : 'text'}
          icon={<TagOutlined />}
        />
      </Tooltip>

      <Tooltip title='代码块'>
        <Button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          type={editor.isActive('codeBlock') ? 'primary' : 'text'}
          icon={<CodeOutlined />}
        />
      </Tooltip>

      <Divider style={{ fontSize: '24px', color: '#000' }} type='vertical' />

      <Tooltip title='导入'>
        <Button
          onClick={() => {
            readJson().then((res) => {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res));
              dispatch(refresh());
            });
          }}
          type='text'
          icon={<ImportOutlined />}
        />
      </Tooltip>

      <Tooltip title='导出'>
        <Button
          onClick={() =>
            downloadJson(
              JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}'),
            )
          }
          type='text'
          icon={<ExportOutlined />}
        />
      </Tooltip>
    </Flex>
  );
};

export default ToolBar;
