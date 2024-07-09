import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
  theme: 'light' | 'dark';
  size: 'normal' | 'small' | 'large';
}

const initialState: ThemeState = {
  theme: 'light',
  size: 'normal',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<ThemeState['theme']>) => {
      state.theme = action.payload;
    },
    setSize: (state, action: PayloadAction<ThemeState['size']>) => {
      state.size = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setSize } = themeSlice.actions;

export default themeSlice.reducer;
