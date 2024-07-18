import React, { Children, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ReactSortable } from 'react-sortablejs';
import { Tooltip, Button } from 'antd';
import { PlusOutlined, FolderAddOutlined } from '@ant-design/icons';
import {
  NoteState,
  addNote,
  reset,
  updateNote,
} from '@/store/slice/note-slice';
import type { RootState } from '@/store';
import { useSelector, useDispatch } from 'react-redux';
import Column from './column';
import styles from './index.module.less';

interface Item {
  id: string;
  content: string;
  children?: Item[];
  origin: NoteState;
}

interface DragDropProps {
  list: NoteState[];
  isChild?: boolean;
  hoverDisable?: boolean;
  parentKey?: string;
}

const DragDrop: React.FC<DragDropProps> = (props) => {
  const {
    list: propList,
    isChild,
    hoverDisable: curHoverDisable = false,
    parentKey,
  } = props;

  const [list, setList] = useState<Item[]>([]);
  const [hoverDisable, setHoverDisable] = useState<boolean>(curHoverDisable);

  const selectedKey = useSelector((state: RootState) => state.note.selectedKey);

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = (data: NoteState[]): Item[] => {
      return data.map((item) => {
        return {
          id: item.key,
          content: item.title,
          children: item.children && getData(item.children),
          origin: item,
        };
      });
    };
    setList(getData(propList));
  }, [propList]);

  const handleSetList = (curList: Item[]) => {
    if (!curList || !curList.length) return;

    setList(curList);
    if (parentKey) {
      dispatch(
        updateNote({
          key: parentKey,
          changeValue: {
            children: curList.map((item) => item.origin),
          },
        }),
      );
      return;
    }
    dispatch(reset(curList.map((item) => item.origin)));
  };

  return (
    <ReactSortable
      animation={150}
      list={list}
      setList={handleSetList}
      onStart={() => setHoverDisable(true)}
      onEnd={() => setHoverDisable(false)}
    >
      {list?.map((item) => (
        <div key={item.id}>
          <Column
            id={item.id}
            title={item.content}
            isGroup={!!item.origin.children}
            isChild={isChild}
            hoverDisable={hoverDisable}
            selected={item.id === selectedKey}
          />
          {item.children && (
            <DragDrop
              list={item.origin.children || []}
              isChild
              parentKey={item.id}
              hoverDisable={hoverDisable}
            />
          )}
        </div>
      ))}
    </ReactSortable>
  );
};

const Slider = () => {
  const noteData = useSelector((state: RootState) => state.note);
  const dispatch = useDispatch();

  const handleCreateGroup = (e: any) => {
    e.stopPropagation();
    const key = `group-${dayjs().valueOf()}`;
    dispatch(
      addNote({
        data: {
          key,
          title: '新分类',
          children: [
            { key: `note-${dayjs().valueOf()}`, title: '新笔记', content: '' },
          ],
        },
      }),
    );
  };

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
    <div className={styles.slider}>
      <div className={styles.newButtons}>
        <Tooltip title='新建笔记'>
          <Button icon={<PlusOutlined />} type='text' onClick={handleCreate} />
        </Tooltip>
        <Tooltip title='新建分类'>
          <Button
            icon={<FolderAddOutlined />}
            type='text'
            onClick={handleCreateGroup}
          />
        </Tooltip>
      </div>
      <DragDrop list={noteData.children} />
    </div>
  );
};

export default Slider;
