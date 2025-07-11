import type { StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';
import type { PersistOptions, PersistStorage } from 'zustand/middleware';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export interface StorageOptions<T> {
  name: string;
  version?: number;
  skipHydration?: boolean;
  enablePersist?: boolean;
  partialize?: (state: T) => Partial<T>;
  storage?: PersistStorage<T>;
  useSessionStorage?: boolean;
}

export const createAppStore = <T>(
  initializer: StateCreator<T>,
  storageOptions: StorageOptions<T>
): UseBoundStore<StoreApi<T>> => {
  const {
    name,
    version = 1,
    skipHydration = false,
    enablePersist = true,
    storage,
    useSessionStorage = false,
    partialize,
  } = storageOptions;

  const getPersistConfig = (): PersistOptions<T> => ({
    name,
    version,
    skipHydration,
    storage:
      storage ||
      createJSONStorage(() =>
        useSessionStorage ? sessionStorage : localStorage
      ),
    ...(partialize && { partialize: partialize as (state: T) => T }),
  });

  const isDev = import.meta.env.DEV;

  if (isDev && enablePersist) {
    return create<T>()(
      devtools(persist(initializer, getPersistConfig()), { name })
    );
  }

  if (isDev) {
    return create<T>()(devtools(initializer, { name }));
  }

  if (enablePersist) {
    return create<T>()(persist(initializer, getPersistConfig()));
  }

  return create<T>()(initializer);
};
