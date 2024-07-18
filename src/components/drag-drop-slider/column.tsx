import React, { useState } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { Flex, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import {
  updateNote,
  deleteNote,
  addNote,
  selectNote,
} from '@/store/slice/note-slice';
import styles from './index.module.less';

export interface ColumnProps {
  id: string;
  title: string;
  isGroup?: boolean;
  selected?: boolean;
  isChild?: boolean;
  hoverDisable?: boolean;
}

const { Paragraph } = Typography;

const Column: React.FC<ColumnProps> = (props) => {
  const { title, id, isGroup, selected, isChild, hoverDisable } = props;

  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);

  const handleCreate = (e: any, groupKey?: string) => {
    e.stopPropagation();
    const key = `note-${dayjs().valueOf()}`;

    dispatch(
      addNote({
        data: {
          key,
          title: '新笔记',
          content: '',
        },
        key: groupKey,
      }),
    );
  };

  return (
    <Flex
      justify='space-between'
      align='center'
      className={classNames(styles.column, {
        [styles.columnSelected]: selected,
        [styles.columnChild]: isChild,
        [styles.hoverDisable]: hoverDisable,
      })}
      onClick={(e) => {
        e.stopPropagation();
        if (isGroup) return;
        dispatch(selectNote(id));
      }}
    >
      <Paragraph
        editable={{
          editing: editing,
          icon: <></>,
          enterIcon: <></>,
          onChange(v) {
            setEditing(false);
            if (!v) {
              dispatch(deleteNote(id));
              return;
            }
            if (v === title) return;
            dispatch(updateNote({ key: id, changeValue: { title: v } }));
          },
          onCancel() {
            setEditing(false);
          },
        }}
        className={styles.title}
        ellipsis={{ rows: 1, tooltip: true }}
      >
        {title}
      </Paragraph>
      <Space className={styles.icons} size={16}>
        {isGroup && (
          <PlusOutlined
            onClick={(e) => {
              handleCreate(e, id);
            }}
          />
        )}
        <EditOutlined
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        />
        <DeleteOutlined
          onClick={(e) => {
            e.stopPropagation();
            dispatch(deleteNote(id));
          }}
        />
      </Space>
    </Flex>
  );
};

export default Column;
