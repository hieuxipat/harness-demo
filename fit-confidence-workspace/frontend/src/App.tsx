import { useLocation, useNavigate } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import { NavigationMenu, Provider } from '@shopify/app-bridge-react';
import { NavigationLink } from 'components';
import { Environment, embeddedNavLinks } from 'app:constants';
import { CONSTANT } from 'helpers';
import { useMemo } from 'react';
import AppRoutes from 'routes';
import translations from '@shopify/polaris/locales/en.json';
import './App.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const configApp = {
    apiKey: import.meta.env.VITE_APP_API_KEY || '',
    host: new URLSearchParams(location.search).get('host') || '',
    forceRedirect: import.meta.env.VITE_APP_MODE === Environment.Production
  };
  const router = useMemo(
    () => ({
      location,
      history: { replace: (path: string) => navigate(path, { replace: true }) }
    }),
    [location, navigate]
  );

  return (
    <AppProvider i18n={translations} linkComponent={NavigationLink}>
      {import.meta.env.VITE_APP_MODE !== Environment.Test &&
      CONSTANT.isEmbedded ? (
        <Provider config={configApp} router={router}>
          <NavigationMenu
            navigationLinks={embeddedNavLinks}
            matcher={(link) => link.destination === location.pathname}
          />
          <AppRoutes />
        </Provider>
      ) : (
        <AppRoutes />
      )}
    </AppProvider>
  );
}

export default App;
