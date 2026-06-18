import React, {
  createContext,
  useState,
  useEffect
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface ConfigContextData {
  fonteGrande: boolean;

  alterarFonte: (valor: boolean) => void;
}

export const ConfigContext =
createContext({} as ConfigContextData);

export function ConfigProvider({
  children
}: any) {

  const [fonteGrande, setFonteGrande] =
  useState(false);

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  async function carregarConfiguracoes() {

    const fonte =
      await AsyncStorage.getItem(
        'fonteGrande'
      );

    if (fonte) {
      setFonteGrande(JSON.parse(fonte));
    }
  }

  async function alterarFonte(
    valor: boolean
  ) {

    setFonteGrande(valor);

    await AsyncStorage.setItem(
      'fonteGrande',
      JSON.stringify(valor)
    );
  }

  return (
    <ConfigContext.Provider
      value={{
        fonteGrande,
        alterarFonte,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
