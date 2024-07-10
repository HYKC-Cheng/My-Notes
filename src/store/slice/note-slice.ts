import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_KEY } from '@/store/const';
import type { RootState } from '@/store';
import { fork } from 'child_process';

export interface NoteState {
  key: string;
  title: string;
  content?: string;
  children?: NoteState[];
  [key: string]: any;
}

const initialState: NoteState = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_KEY) || 'null',
) || {
  key: 'root',
  title: 'root',
  selectedKey: 'Note 01',
  children: [{ key: 'Note 01', title: 'Note 01', content: 'hello world !' }],
};

const save = (state: NoteState) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    // 添加
    addNote: (
      state,
      action: PayloadAction<{ data: NoteState; key?: string }>,
    ) => {
      const cloneData = [...(state.children || [])];
      if (action.payload.key) {
        cloneData.some((item) => {
          if (item.key === action.payload.key) {
            item.children = [
              ...(item.children || []),
              ...[action.payload.data],
            ];
            return true;
          }
        });

        state.children = [...cloneData];
      } else {
        state.children = [...cloneData, ...[action.payload.data]];
      }

      console.log(action.payload.data, 111);

      state.selectedKey = action.payload.data.children
        ? action.payload.data.children[action.payload.data.children.length - 1]
            .key
        : action.payload.data.key;
      save(state);
    },

    // 更新
    updateNote: (
      state,
      action: PayloadAction<{
        key: string;
        changeValue: {
          key?: string;
          title?: string;
          content?: string;
          children?: NoteState[];
        };
      }>,
    ) => {
      const { key, changeValue } = action.payload;
      const updateChild = (children: NoteState[]) => {
        children.some((child, index) => {
          if (child.key === key) {
            children[index] = { ...child, ...changeValue };
            return true;
          }
          if (child.children) {
            updateChild(child.children);
          }
        });
      };

      const cloneData = [...(state.children || [])];
      updateChild(cloneData);
      state.children = cloneData;
      save(state);
    },

    // 删除
    deleteNote: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      const deleteChild = (children: NoteState[]) => {
        children.some((child) => {
          if (child.key === key) {
            children.splice(children.indexOf(child), 1);
            return true;
          }
          if (child.children) {
            deleteChild(child.children);
          }
        });
      };

      const cloneData = [...(state.children || [])];
      deleteChild(cloneData);
      state.children = cloneData;
      state.selectedKey = cloneData[0]?.children
        ? cloneData[0]?.children[0].key
        : cloneData[0].key;

      save(state);
    },

    // 选择
    selectNote: (state, action: PayloadAction<string>) => {
      state.selectedKey = action.payload;
      save(state);
    },
  },
});

export const { addNote, updateNote, deleteNote, selectNote } =
  noteSlice.actions;

export const getNoteByKey = (state: RootState) => {
  const note = state.note;

  const key = note.selectedKey;

  const getContent = (data: NoteState[]): NoteState | undefined => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.children) {
        return getContent(item.children);
      }
      if (item.key === key) {
        return item;
      }
    }
  };

  return getContent(note.children || []);
};

export default noteSlice.reducer;
