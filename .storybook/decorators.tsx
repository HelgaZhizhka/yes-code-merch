import type { Decorator } from '@storybook/react-vite';
import React from 'react';

import '../src/app/styles/index.css';
import { TanStackQueryProvider } from '../src/shared/api/tanstack-query';

export const withStyleDecorator: Decorator = (Story: React.FC) => {
  return <Story />;
};

export const withQueryClient: Decorator = (Story: React.FC) => {
  return (
    <TanStackQueryProvider.Provider>
      <Story />
    </TanStackQueryProvider.Provider>
  );
};
