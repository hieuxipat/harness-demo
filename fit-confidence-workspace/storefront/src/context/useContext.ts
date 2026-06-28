import { useContext } from 'react';
import ShopifyContext from './ShopifyContext/ShopifyContext';
import AppContext from './AppContext/AppContext';

export const useShopifyContext = () => {
  const context = useContext(ShopifyContext);
  if (!context) throw new Error('useShopifyContext must be used within a ShopifyContextProvider');
  return context;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within a AppContextProvider');
  return context;
};
