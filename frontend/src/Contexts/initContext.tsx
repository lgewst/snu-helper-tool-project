import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { StorageKey } from '../Utils/storageKey';

interface InitContextType {
  initialized: boolean;
  setInit: (e: boolean) => void;
}

const defaultValue: InitContextType = {
  initialized: !!localStorage.getItem(StorageKey.CURRENT_VERSION),
  setInit: () => null,
};

const initContext = createContext<InitContextType>(defaultValue);

export const InitContextProvider = ({ children }: PropsWithChildren<never>) => {
  const [initialized, setInit] = useState<boolean>(defaultValue.initialized);

  return <initContext.Provider value={{ initialized, setInit }}>{children}</initContext.Provider>;
};

export const useInitContext = () => useContext(initContext) as InitContextType;
