import { BrowserRouter } from 'react-router-dom';
import { AppBridgeProvider } from './components/providers/AppBridgeProvider';
import { PolarisProvider } from './components/providers/PolarisProvider';
import { Routes } from './Routes';

export const App = () => {
  return (
    <BrowserRouter>
      <PolarisProvider>
        <AppBridgeProvider>
          <Routes />
        </AppBridgeProvider>
      </PolarisProvider>
    </BrowserRouter>
  );
};
