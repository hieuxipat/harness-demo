import { FooterHelp, Link } from '@shopify/polaris';
import { StyledFooter } from './styled';

const Footer = () => {
  return (
    <StyledFooter>
      <FooterHelp>
        <Link removeUnderline>Need help? View our docs</Link>
        <Link removeUnderline>Visit our site</Link>
      </FooterHelp>
    </StyledFooter>
  );
};

export default Footer;
