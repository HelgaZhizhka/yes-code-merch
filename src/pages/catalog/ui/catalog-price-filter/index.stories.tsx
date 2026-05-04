import type { Meta, StoryObj } from '@storybook/react-vite';

import { CatalogPriceFilter } from './';

const meta: Meta<typeof CatalogPriceFilter> = {
  title: 'Catalog/CatalogPriceFilter',
  component: CatalogPriceFilter,
};

export default meta;
type Story = StoryObj<typeof CatalogPriceFilter>;

export const ClothesRange: Story = {
  args: { bounds: { min: 1000, max: 6000 } },
};

export const Wide: Story = {
  args: { bounds: { min: 110, max: 15000 } },
};
