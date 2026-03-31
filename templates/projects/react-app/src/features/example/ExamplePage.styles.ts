import styled from 'styled-components';

export const Container = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Counter = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Button = styled.button<{ $primary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  margin: 0 ${({ theme }) => theme.spacing.sm};
  font-size: 1.2rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ $primary, theme }) =>
    $primary ? theme.colors.primary : theme.colors.background};
  color: ${({ $primary, theme }) =>
    $primary ? theme.colors.background : theme.colors.text};

  &:hover {
    opacity: 0.9;
  }
`;
