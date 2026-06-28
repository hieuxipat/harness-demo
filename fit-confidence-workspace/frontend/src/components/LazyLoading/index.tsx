import { Spinner } from '@shopify/polaris';
import { StyledLazyLoading } from './styled';

const LazyLoading = () => {
  return (
    <StyledLazyLoading>
      <Spinner size="large" />
    </StyledLazyLoading>
  );
};

export default LazyLoading;
