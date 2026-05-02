import type { Meta, StoryObj } from '@storybook/react-vite';

import { GridViewToggle } from './grid-view-toggle';

const meta: Meta<typeof GridViewToggle> = {
  title: 'Catalog/GridViewToggle',
  component: GridViewToggle,
  parameters: {
    docs: {
      description: {
        component:
          'Reads/writes the `view` URL search param via useCatalogSearch. Stories require a router-mock decorator if added in the future.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GridViewToggle>;

export const Default: Story = {};
