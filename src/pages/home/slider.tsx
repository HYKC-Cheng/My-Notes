import React, { useMemo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Menu, Flex, Space, Typography, Button, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FolderAddOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateNote,
  addNote,
  deleteNote,
  selectNote,
} from '@/store/slice/note-slice';

import styles from './index.module.less';

import type { MenuProps } from 'antd';
import type { RootState } from '@/store';

interface EditedStatus {
  [key: string]: boolean;
}

const { Paragraph } = Typography;

const Slider: React.FC = () => {
  const noteData = useSelector((state: RootState) => state.note);
  const selectedKey = useSelector((state: RootState) => state.note.selectedKey);

  const dispatch = useDispatch();

  const [editedStatus, setEditedStatus] = useState<EditedStatus>({});

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const result: EditedStatus = {};
    const getResult = (data: Array<RootState['note']>) => {
      data.forEach((item) => {
        if (item?.children) {
          getResult(item.children);
        } else {
          result[item.key] = false;
        }
      });
    };

    getResult(noteData.children || []);
    setEditedStatus(result);
  }, [noteData]);

  useEffect(() => {
    setOpenKeys(
      (noteData.children || [])
        .filter((item) => item.children)
        .map((item) => item.key),
    );
  }, []);

  useEffect(() => {
    if (Object.values(editedStatus).some((item) => item)) {
      return;
    }

    let result = '';

    const getParentKey = (
      data: Array<RootState['note']>,
      parentKey: string = '',
    ) => {
      data.some((item) => {
        if (item.key === selectedKey) {
          result = parentKey;
          return true;
        }

        if (item.children) {
          return getParentKey(item.children, item.key);
        }
      });
    };

    getParentKey(noteData.children || []);
    result && setOpenKeys((pre) => [...pre, result]);
  }, [selectedKey, noteData]);

  const menuItems = useMemo(() => {
    const getMenuItems = (data: RootState['note'][]) => {
      const menuItems: MenuProps['items'] = [];

      data.forEach((item) => {
        const { key, title, children } = item;
        const menuItem: (typeof menuItems)[0] = {
          key,
          label: (
            <Flex
              justify='space-between'
              align='center'
              className={styles.menuItem}
            >
              <Paragraph
                editable={{
                  editing: editedStatus[key],
                  icon: <></>,
                  enterIcon: <></>,
                  onChange(v) {
                    if (!v) {
                      dispatch(deleteNote(key));
                      setEditedStatus({
                        ...editedStatus,
                        [key]: false,
                      });
                      return;
                    }

                    if (v === title) {
                      setEditedStatus({
                        ...editedStatus,
                        [key]: false,
                      });
                      return;
                    }
                    setEditedStatus({
                      ...editedStatus,
                      [key]: false,
                    });
                    dispatch(updateNote({ key, changeValue: { title: v } }));
                  },
                  onCancel() {
                    setEditedStatus({
                      ...editedStatus,
                      [key]: false,
                    });
                  },
                }}
                className={styles.title}
                ellipsis={{ rows: 1, tooltip: true }}
              >
                {title}
              </Paragraph>
              <Space className={styles.icons} size={16}>
                {children && (
                  <PlusOutlined
                    onClick={(e) => {
                      handleCreate(e, key);
                    }}
                  />
                )}
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditedStatus({
                      ...editedStatus,
                      [key]: !editedStatus[key],
                    });
                  }}
                />
                <DeleteOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(deleteNote(key));
                  }}
                />
              </Space>
            </Flex>
          ),
          children: children ? getMenuItems(children) : undefined,
        };

        menuItems.push(menuItem);
      });

      return menuItems;
    };

    return getMenuItems(noteData.children || []);
  }, [noteData, editedStatus, dispatch]);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    dispatch(selectNote(key));
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

  return (
    <div style={{ position: 'relative' }}>
      <Menu
        openKeys={openKeys}
        onOpenChange={(curOpenKeys) => {
          if (Object.values(editedStatus).some((item) => item)) {
            return;
          }
          setOpenKeys(curOpenKeys);
        }}
        defaultOpenKeys={noteData.children
          ?.filter((item) => item.children && item.children.length > 0)
          .map((item) => item.key)}
        selectedKeys={[noteData.selectedKey || '']}
        className={styles.slider}
        onClick={onClick}
        style={{ width: 300 }}
        mode='inline'
        items={menuItems}
      />
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
    </div>
  );
};

export default Slider;
