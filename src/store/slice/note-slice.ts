import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_KEY } from '@/store/const';

export interface NoteState {
  key: string;
  title: string;
  content?: string;
  children?: NoteState[];
}

const initialState: NoteState = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_KEY) || 'null',
) || {
  key: 'root',
  title: 'root',
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
    addNote: (state, action: PayloadAction<NoteState>) => {
      state.children = [...(state.children || []), action.payload];
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
      save(state);
    },
  },
});

export const { addNote, updateNote, deleteNote } = noteSlice.actions;

export const getNoteByKey = (note: NoteState, key: string) => {
  const getContent = (data: NoteState[]): NoteState | undefined =>
    data?.find((item) => {
      if (item.children) {
        return getContent(item.children);
      }
      return item.key === key;
    });

  return getContent(note.children || []);
};

export default noteSlice.reducer;
