import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { IAppContext, IAppContextProviderProps } from './app-context.types';
import useFetch from '~/hooks/useFetch';
import { IShopifyAppMetafieldPayload } from '@nest/nest-types/shared/api/types/shopify-api.types';
import { useShopifyContext } from '../useContext';

const AppContext = createContext<IAppContext | undefined>(undefined);

const AppContextProvider = ({ children, metafields }: IAppContextProviderProps) => {
  const { callAppApi } = useFetch(metafields.rootLink);
  const { shop } = useShopifyContext();
  const [appMetafields, setAppMetafields] = useState<IShopifyAppMetafieldPayload['data']>(metafields.data);
  const { generalSettings } = useMemo(() => {
    if (!appMetafields) return {};
    const { shopGeneral } = appMetafields;
    return { generalSettings: shopGeneral };
  }, [appMetafields]);

  useEffect(() => {
    if (metafields.manualData && metafields.publicKey) {
      callAppApi('GET', 'GET_SHOP_METAFIELDS', {
        params: { shop, key: metafields.publicKey },
      }).then((res) => {
        if (res?.data) {
          window.appMetafields = res?.data?.app;
          setAppMetafields(res?.data?.app?.data);
        }
      });
    }
  }, [callAppApi, metafields.manualData, metafields.publicKey, shop]);

  return (
    <AppContext.Provider
      value={{
        //App settings
        generalSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider };

export default AppContext;
