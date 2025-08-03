import type { Draft } from 'immer';
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
export type ImmerCompatibleSet<T> = (
  updater: (state: Draft<T>) => void
) => void;

type StoreInitializer<T> = StateCreator<T>;

type StoreCreator<T> = StateCreator<T, [], [], T>;
type ImmerStoreCreator<T> = StateCreator<T, [['zustand/immer', never]], []>;

const toStoreCreator = <T>(creator: unknown): StoreCreator<T> => {
  return creator as StoreCreator<T>;
};
const toImmerStoreCreator = <T>(creator: unknown): ImmerStoreCreator<T> => {
  return creator as ImmerStoreCreator<T>;
};

export const createAppStore = <T>(
  initializer: StoreInitializer<T>,
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

  let storeCreator = toStoreCreator<T>(initializer);
  if (enableImmer) {
    storeCreator = toStoreCreator(immer(toImmerStoreCreator(storeCreator)));
  }
  if (enablePersist) {
    storeCreator = toStoreCreator(persist(storeCreator, getPersistConfig()));
  }
  if (isDev && enableDevtools) {
    storeCreator = toStoreCreator(devtools(storeCreator, { name }));
  }
  return create<T>()(storeCreator);
};
