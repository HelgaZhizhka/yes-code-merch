export const logger = {
  error: (message: string, error?: unknown) => {
    if (import.meta.env.DEV) {
      if (error instanceof Error) {
        console.error(`${message}: ${error.message}`, error);
      } else if (error === undefined) {
        console.error(message);
      } else {
        console.error(`${message}: ${String(error)}`);
      }
    }
  },
};
