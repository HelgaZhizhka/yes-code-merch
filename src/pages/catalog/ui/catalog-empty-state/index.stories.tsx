import type { Meta, StoryObj } from '@storybook/react-vite';

import { CatalogEmptyState } from './';

const meta: Meta<typeof CatalogEmptyState> = {
  title: 'Catalog/CatalogEmptyState',
  component: CatalogEmptyState,
};

export default meta;
type Story = StoryObj<typeof CatalogEmptyState>;

export const Default: Story = {};
