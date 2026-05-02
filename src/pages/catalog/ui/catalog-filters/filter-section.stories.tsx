import type { Meta, StoryObj } from '@storybook/react-vite';

import { FilterSection } from './filter-section';

const meta: Meta<typeof FilterSection> = {
  title: 'Catalog/FilterSection',
  component: FilterSection,
};

export default meta;
type Story = StoryObj<typeof FilterSection>;

export const Open: Story = {
  args: {
    title: 'Color',
    defaultOpen: true,
    children: <p>Filter body content</p>,
  },
};

export const Closed: Story = {
  args: {
    title: 'Price',
    defaultOpen: false,
    children: <p>Hidden until expanded</p>,
  },
};
