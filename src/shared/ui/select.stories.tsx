import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

const meta = {
  title: 'shared/ui/form/select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithScrolling: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gr">Germany</SelectItem>
        <SelectItem value="fr">France</SelectItem>
        <SelectItem value="it">Italy</SelectItem>
        <SelectItem value="es">Spain</SelectItem>
        <SelectItem value="pl">Poland</SelectItem>
        <SelectItem value="pt">Portugal</SelectItem>
        <SelectItem value="bg">Bulgaria</SelectItem>
        <SelectItem value="ro">Romania</SelectItem>
        <SelectItem value="rs">Serbia</SelectItem>
        <SelectItem value="hr">Croatia</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="tr">Turkey</SelectItem>
        <SelectItem value="ba">Bosnia and Herzegovina</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Small: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]" size="sm">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sm">USD</SelectItem>
        <SelectItem value="md">EUR</SelectItem>
        <SelectItem value="lg">UAH</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithOnValueChange: Story = {
  render: () => (
    <Select onValueChange={(value) => console.log('Selected value:', value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="xs">XS</SelectItem>
        <SelectItem value="sm">S</SelectItem>
        <SelectItem value="md">M</SelectItem>
        <SelectItem value="lg">L</SelectItem>
        <SelectItem value="xl">XL</SelectItem>
      </SelectContent>
    </Select>
  ),
};
