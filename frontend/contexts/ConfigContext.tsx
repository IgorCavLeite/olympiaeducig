import React, {
  createContext,
  useState,
  useEffect
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

interface ConfigContextData {
  fonteGrande: boolean;
  idioma: string;

  alterarFonte: (valor: boolean) => void;
  alterarIdioma: (valor: string) => void;
}

export const ConfigContext =
createContext({} as ConfigContextData);

export function ConfigProvider({
  children
}: any) {

  const [fonteGrande, setFonteGrande] =
  useState(false);

  const [idioma, setIdioma] =
  useState('pt');

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  async function carregarConfiguracoes() {

    const fonte =
      await AsyncStorage.getItem(
        'fonteGrande'
      );

    const idiomaSalvo =
      await AsyncStorage.getItem(
        'idioma'
      );

    if (fonte) {
      setFonteGrande(JSON.parse(fonte));
    }

    if (idiomaSalvo) {
      setIdioma(idiomaSalvo);
      i18n.changeLanguage(idiomaSalvo);
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

  async function alterarIdioma(
    valor: string
  ) {

    setIdioma(valor);

    i18n.changeLanguage(valor);

    await AsyncStorage.setItem(
      'idioma',
      valor
    );
  }

  return (
    <ConfigContext.Provider
      value={{
        fonteGrande,
        idioma,
        alterarFonte,
        alterarIdioma
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
