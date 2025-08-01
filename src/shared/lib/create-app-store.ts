/**
 * Creates a Zustand store with optional middleware: devtools, persist, immer.
 * Middleware are applied in the order: immer -> persist -> devtools.
 *
 * @param initializer - The base state creator function.
 * @param storageOptions - Configuration options for persistence and middleware.
 * @returns A Zustand store hook bound to the created store.
 */
import type { StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';
import type { PersistOptions, PersistStorage } from 'zustand/middleware';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface StorageOptions<T> {
  name: string;
  version?: number;
  enableDevtools?: boolean;
  enablePersist?: boolean;
  enableImmer?: boolean;
  skipHydration?: boolean;
  partialize?: (state: T) => Partial<T>;
  storage?: PersistStorage<T>;
  useSessionStorage?: boolean;
}

type Middleware<T> = (
  creator: StateCreator<T, [], [], T>
) => StateCreator<T, [], [], T>;

export const createAppStore = <T>(
  initializer: StateCreator<T, [], [], T>,
  storageOptions: StorageOptions<T>
): UseBoundStore<StoreApi<T>> => {
  const {
    name,
    storage,
    partialize,
    version = 1,
    enableDevtools = true,
    enablePersist = false,
    enableImmer = false,
    skipHydration = false,
    useSessionStorage = false,
  } = storageOptions;

  const isDev: boolean = import.meta.env.DEV;

  const getPersistConfig = (): PersistOptions<T, Partial<T>> => ({
    name,
    version,
    skipHydration,
    storage:
      (storage as PersistStorage<Partial<T>> | undefined) ??
      createJSONStorage(() =>
        useSessionStorage ? sessionStorage : localStorage
      ),
    ...(partialize ? { partialize } : {}),
  });

  const middlewares: Middleware<T>[] = [];

  if (enableImmer) middlewares.push(immer as Middleware<T>);
  if (enablePersist)
    middlewares.push(
      (sc) => persist(sc, getPersistConfig()) as StateCreator<T>
    );

  if (isDev && enableDevtools)
    middlewares.push((sc) => devtools(sc, { name }) as StateCreator<T>);

  const composed = middlewares.reduceRight(
    (acc, middleware) => middleware(acc),
    initializer
  );

  return create<T>(composed);
};
