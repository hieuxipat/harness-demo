import { createContext, ReactNode, useMemo } from 'react';
import { IShopifyContext } from './shopify-context.types';

const ShopifyContext = createContext<undefined | IShopifyContext>(undefined);

const ShopifyContextProvider = ({ children }: { children: ReactNode }) => {
  const { locale, currentPage, shop } = useMemo(() => {
    const locale = window?.Shopify?.locale || '';
    const currentPage = window?.__st?.p || '';
    const shop = window?.Shopify?.shop || '';

    return {
      locale,
      currentPage,
      shop,
    };
  }, []);

  return (
    <ShopifyContext.Provider
      value={{
        locale,
        currentPage,
        shop,
      }}
    >
      {children}
    </ShopifyContext.Provider>
  );
};

export { ShopifyContextProvider };

export default ShopifyContext;
