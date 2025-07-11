import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Loader } from './loader';

describe('Loader', () => {
  it('renders Spinner and is accessible', () => {
    render(<Loader />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText(/loading/i)).toBeTruthy();
  });
});
