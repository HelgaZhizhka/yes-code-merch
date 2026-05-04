import type { Meta, StoryObj } from '@storybook/react-vite';

import { CatalogActiveFilters } from './';

const meta: Meta<typeof CatalogActiveFilters> = {
  title: 'Catalog/CatalogActiveFilters',
  component: CatalogActiveFilters,
  parameters: {
    docs: {
      description: {
        component:
          'Reads colors/sizes from URL via useCatalogSearch. Stories show the empty case when there is no router context.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CatalogActiveFilters>;

export const NoActiveFilters: Story = {};
