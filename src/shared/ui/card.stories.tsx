import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta = {
  title: 'shared/ui/layout/card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card without footer</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card doesn&apos;t have a footer.</p>
      </CardContent>
    </Card>
  ),
};

export const OnlyContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <p>Just some content without header or footer</p>
      </CardContent>
    </Card>
  ),
};

export const Bordered: Story = {
  render: () => (
    <Card className="w-[350px] border-2">
      <CardHeader className="border-b">
        <CardTitle>Bordered Card</CardTitle>
        <CardDescription>With bordered sections</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card with emphasized borders</p>
      </CardContent>
      <CardFooter className="border-t">
        <p>Bordered footer</p>
      </CardFooter>
    </Card>
  ),
};
