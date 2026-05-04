import type { Meta, StoryObj } from '@storybook/react-vite';

import { CatalogColorFilter } from './';

const meta: Meta<typeof CatalogColorFilter> = {
  title: 'Catalog/CatalogColorFilter',
  component: CatalogColorFilter,
};

export default meta;
type Story = StoryObj<typeof CatalogColorFilter>;

export const FullPalette: Story = {
  args: {
    available: [
      'white',
      'black',
      'orange',
      'blue',
      'green',
      'purple',
      'red',
      'gray',
      'beige',
      'navy',
    ],
  },
};

export const TwoColors: Story = {
  args: { available: ['black', 'white'] },
};

export const Empty: Story = {
  args: { available: [] },
};
