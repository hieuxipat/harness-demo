import { TooltipProps } from '@shopify/polaris';
import { FunctionComponent, SVGProps } from 'react';

export interface IActionIcon {
  accessibilityLabel: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  url?: string;
  onClick?: () => void;
  tooltip?: TooltipProps;
}

export interface IRouter {
  name?: string;
  path?: string;
  element?: JSX.Element;
  icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  actionIcon?: IActionIcon;
  hiddenInSidebar?: boolean;
}
