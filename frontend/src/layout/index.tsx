import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { Frame } from '@shopify/polaris';
import { CONSTANT } from 'helpers';
import { LazyLoading } from 'components';
import Sidebar from './Sidebar';
import Footer from './Footer';

import { StyledContentLayout } from './styled';

const AdminLayout = () => {
  return (
    <Frame navigation={!CONSTANT.isEmbedded && <Sidebar />}>
      <StyledContentLayout>
        <div className="main-content">
          <Suspense fallback={<LazyLoading />}>
            <Outlet />
          </Suspense>
        </div>
        <Footer />
      </StyledContentLayout>
    </Frame>
  );
};

export default AdminLayout;
