import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface ExampleState {
  count: number;
}

const initialState: ExampleState = {
  count: 0,
};

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
  },
});

export const { increment, decrement } = exampleSlice.actions;
export const selectCount = (state: RootState) => state.example.count;
