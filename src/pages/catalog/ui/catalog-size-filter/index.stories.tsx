import type { Meta, StoryObj } from '@storybook/react-vite';

import { CatalogSizeFilter } from './';

const meta: Meta<typeof CatalogSizeFilter> = {
  title: 'Catalog/CatalogSizeFilter',
  component: CatalogSizeFilter,
};

export default meta;
type Story = StoryObj<typeof CatalogSizeFilter>;

export const ClothesSizes: Story = {
  args: {
    available: ['xs', 's', 'm', 'l', 'xl', 'xxl', 'one-size'],
  },
};

export const Empty: Story = {
  args: { available: [] },
};
