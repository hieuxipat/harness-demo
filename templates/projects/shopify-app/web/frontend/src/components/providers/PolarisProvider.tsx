import { ReactNode } from 'react';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import en from '@shopify/polaris/locales/en.json';

interface PolarisProviderProps {
  children: ReactNode;
}

export const PolarisProvider = ({ children }: PolarisProviderProps) => {
  return (
    <AppProvider i18n={en}>
      {children}
    </AppProvider>
  );
};
