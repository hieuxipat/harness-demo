import { ReactNode } from 'react';
import { Container, Header, Main } from './Layout.styles';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Container>
      <Header>
        <h1>{{project_name}}</h1>
      </Header>
      <Main>{children}</Main>
    </Container>
  );
};
