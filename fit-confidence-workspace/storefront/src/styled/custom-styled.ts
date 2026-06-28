import { createGlobalStyle } from 'styled-components';

interface IProps {
  customCss: string;
}
export const CustomStyled = createGlobalStyle<IProps>`
  ${(props) => props.customCss}
`;
