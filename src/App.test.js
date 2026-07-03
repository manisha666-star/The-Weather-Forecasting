import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders the weather app landing content', () => {
  render(<App />);

  expect(
    screen.getByText(/Explore current weather data/i)
  ).toBeInTheDocument();
});
