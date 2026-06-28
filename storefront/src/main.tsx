import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import App from './App.tsx';
import { AppContextProvider } from './context/AppContext/AppContext.tsx';
import { ShopifyContextProvider } from './context/ShopifyContext/ShopifyContext.js';

const rootElement = document.querySelector(`#root-element`);
if (rootElement) {
  if (!window.appMetafields) console.log('Metafields not found');
  if (window.appMetafields) {
    createRoot(rootElement).render(
      <StrictMode>
        <StyleSheetManager shouldForwardProp={() => true}>
          <ShopifyContextProvider>
            <AppContextProvider metafields={window.appMetafields}>
              <App />
            </AppContextProvider>
          </ShopifyContextProvider>
        </StyleSheetManager>
      </StrictMode>,
    );
  }
}
