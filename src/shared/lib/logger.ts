export const logger = {
  error: (message: string, error?: unknown) => {
    if (!import.meta.env.DEV) return;

    if (error === undefined) {
      console.error(message);
      return;
    }
    if (error instanceof Error) {
      console.error(`${message}: ${error.message}`, error);
    } else {
      console.error(message, error);
    }
  },
};
