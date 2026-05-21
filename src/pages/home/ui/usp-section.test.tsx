import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { render, screen, waitFor } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { USPSection } from './usp-section';

function renderWithRouter(ui: ReactElement) {
  const rootRoute = createRootRoute({ component: () => <>{ui}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory(),
  });
  return render(<RouterProvider router={router} />);
}

describe('USPSection', () => {
  it('renders section heading', async () => {
    renderWithRouter(<USPSection />);
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /shopping easy with yes code/i })
      ).toBeInTheDocument()
    );
  });

  it('renders all three card titles', async () => {
    renderWithRouter(<USPSection />);
    await waitFor(() => {
      expect(screen.getByText('Free and Fast delivery')).toBeInTheDocument();
      expect(screen.getByText('Wide range')).toBeInTheDocument();
      expect(screen.getByText('Quick order placement')).toBeInTheDocument();
    });
  });

  it('renders "Contact us" as a tel: anchor', async () => {
    renderWithRouter(<USPSection />);
    const link = await screen.findByRole('link', { name: /contact us/i });
    expect(link).toHaveAttribute('href', 'tel:971588284186');
  });

  it('renders "More" buttons as router links pointing to /', async () => {
    renderWithRouter(<USPSection />);
    await waitFor(() => {
      const moreLinks = screen.getAllByRole('link', { name: /^more$/i });
      expect(moreLinks).toHaveLength(2);
      moreLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', '/');
      });
    });
  });
});
