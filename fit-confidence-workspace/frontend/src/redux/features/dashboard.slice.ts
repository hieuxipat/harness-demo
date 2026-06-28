import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface DashboardState {
  value: number;
}

const initialState: DashboardState = {
  value: 0
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

export const { increment, decrement, incrementByAmount } =
  dashboardSlice.actions;

export const selectCount = (state: RootState) => state.dashboard.value;

export default dashboardSlice.reducer;
