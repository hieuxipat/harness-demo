import { ForwardRefExoticComponent, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { LinkLikeComponentProps } from '@shopify/polaris/build/ts/src/utilities/link';

const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

const NavigationLink: ForwardRefExoticComponent<
  Omit<LinkLikeComponentProps, 'ref'>
> = forwardRef<HTMLAnchorElement, LinkLikeComponentProps>(
  ({ children, url, external, ...rest }, ref) => {
    if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
      rest.target = '_blank';
      rest.rel = 'noopener noreferrer';
    }

    return (
      <Link {...rest} to={url} ref={ref}>
        {children}
      </Link>
    );
  }
);

export default NavigationLink;
