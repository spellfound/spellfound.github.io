import React from 'react';
import { render } from '@testing-library/react';
import Spellfound from './Spellfound';

test('renders learn react link', () => {
  const { getByText } = render(<Spellfound />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
