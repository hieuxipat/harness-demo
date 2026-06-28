import { Navigation } from '@shopify/polaris';
import { ItemProps } from '@shopify/polaris/build/ts/src/components/Navigation/types';
import { useLocation } from 'react-router-dom';
import routerList from 'routes/routes';

const Sidebar = () => {
  const { pathname } = useLocation();

  const topSidebarItems = routerList.map(
    ({ name, path, icon, actionIcon, hiddenInSidebar }) => {
      let navigationItem: ItemProps = {
        url: path,
        label: name || '',
        icon,
        accessibilityLabel: hiddenInSidebar ? 'Hidden' : ''
      };

      if (actionIcon) {
        navigationItem = {
          ...navigationItem,
          secondaryActions: [{ ...actionIcon }]
        };
      }

      return navigationItem;
    }
  );

  return (
    <Navigation location={pathname}>
      <Navigation.Section
        title="MENU"
        items={topSidebarItems.filter(
          (sidebar) => sidebar.accessibilityLabel !== 'Hidden'
        )}
      />
    </Navigation>
  );
};

export default Sidebar;
