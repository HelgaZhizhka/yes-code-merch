import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import 'dotenv/config';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
