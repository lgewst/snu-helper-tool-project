import axios from 'axios';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import toast from 'react-hot-toast';

import { StorageKey } from '../Utils/storageKey';

interface InitContextType {
  initialized: boolean;
  reinitialize: () => void;
  setInit: (e: boolean) => void;
}

const defaultValue: InitContextType = {
  initialized: !!localStorage.getItem(StorageKey.CURRENT_VERSION),
  reinitialize: () => null,
  setInit: () => null,
};

const initContext = createContext<InitContextType>(defaultValue);

export const InitContextProvider = ({ children }: PropsWithChildren<never>) => {
  const [initialized, setInit] = useState<boolean>(defaultValue.initialized);

  const reinitialize = () => {
    if (
      localStorage.getItem(StorageKey.CHROMIUM_REPO) != null &&
      localStorage.getItem(StorageKey.CURRENT_VERSION) != null &&
      localStorage.getItem(StorageKey.TARGET_VERSION) != null &&
      localStorage.getItem(StorageKey.WEBOSOSE_REPO) != null &&
      localStorage.getItem(StorageKey.WEBOSOSE_PATCHID) != null
    ) {
      axios
        .get('/chromium/init', {
          params: {
            chromium_repo: localStorage.getItem(StorageKey.CHROMIUM_REPO),
            webosose_repo: localStorage.getItem(StorageKey.WEBOSOSE_REPO),
            current_version: localStorage.getItem(StorageKey.CURRENT_VERSION),
            target_version: localStorage.getItem(StorageKey.TARGET_VERSION),
            webosose_patch_id: localStorage.getItem(StorageKey.WEBOSOSE_PATCHID),
          },
        })
        .then((res) => {
          toast.success(res.data.message);
        });
    } else {
      toast.error('nothing on local storage');
      setInit(false);
    }
  };

  return (
    <initContext.Provider value={{ initialized, reinitialize, setInit }}>
      {children}
    </initContext.Provider>
  );
};

export const useInitContext = () => useContext(initContext) as InitContextType;
