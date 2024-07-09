import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { themeSlice, noteSlice } from './slice';

interface StoreProps {
  children: React.ReactNode;
}

const store = configureStore({
  reducer: {
    theme: themeSlice,
    note: noteSlice,
  },
});

const Store: React.FC<StoreProps> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default Store;
