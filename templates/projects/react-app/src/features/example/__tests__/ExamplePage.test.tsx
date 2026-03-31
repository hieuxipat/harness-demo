import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { store } from '../../../app/store';
import { theme } from '../../../styles/theme';
import { ExamplePage } from '../ExamplePage';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </Provider>,
  );
};

describe('ExamplePage', () => {
  it('should render the title', () => {
    renderWithProviders(<ExamplePage />);
    expect(screen.getByText('Example Feature')).toBeInTheDocument();
  });

  it('should increment counter when + is clicked', async () => {
    renderWithProviders(<ExamplePage />);
    const user = userEvent.setup();

    expect(screen.getByText('0')).toBeInTheDocument();
    await user.click(screen.getByText('+'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should decrement counter when - is clicked', async () => {
    renderWithProviders(<ExamplePage />);
    const user = userEvent.setup();

    await user.click(screen.getByText('+'));
    await user.click(screen.getByText('-'));
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
