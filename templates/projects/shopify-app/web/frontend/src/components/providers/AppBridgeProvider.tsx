import { ReactNode, useMemo } from 'react';
import { Provider } from '@shopify/app-bridge-react';

interface AppBridgeProviderProps {
  children: ReactNode;
}

export const AppBridgeProvider = ({ children }: AppBridgeProviderProps) => {
  const host = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('host') || '';
  }, []);

  return (
    <Provider
      config={{
        apiKey: '{{shopify_api_key}}',
        host,
        forceRedirect: true,
      }}
    >
      {children}
    </Provider>
  );
};
