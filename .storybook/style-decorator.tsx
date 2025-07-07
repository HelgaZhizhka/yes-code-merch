import type { Decorator } from '@storybook/react-vite';
import React from 'react';

import '../src/app/styles/index.css';

export const withStyleDecorator: Decorator = (Story) => {
  return <Story />;
};
