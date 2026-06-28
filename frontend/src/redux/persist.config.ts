import { PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { DashboardState } from './features/dashboard.slice';

export const dashboardPersistConfig: PersistConfig<DashboardState> = {
  key: 'dashboard',
  storage
};
