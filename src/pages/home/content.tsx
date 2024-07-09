import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '@/components';
import { updateNote, getNoteByKey } from '@/store/slice/note-slice';

import styles from './index.module.less';

import type { RootState } from '@/store';

interface ContentProps {
  propKey: string;
}

const Content: React.FC<ContentProps> = (props) => {
  const { propKey } = props;

  const dispatch = useDispatch();
  const noteData = useSelector((state: RootState) => state.note);

  const content = useMemo(
    () => getNoteByKey(noteData, propKey)?.content || '',
    [propKey],
  );

  const handleChange = (html: string) => {
    dispatch(
      updateNote({
        key: propKey,
        changeValue: { content: html },
      }),
    );
  };

  return (
    <div className={styles.content}>
      <Editor onUpdate={handleChange} content={content} />
    </div>
  );
};

export default Content;
