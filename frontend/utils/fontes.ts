import { useContext } from 'react';
import { ConfigContext } from '../contexts/configContext';

export function useFonte() {
  const { fonteGrande } =
    useContext(ConfigContext);

  return {
    titulo: fonteGrande ? 32 : 24,
    subtitulo: fonteGrande ? 24 : 18,
    texto: fonteGrande ? 20 : 16,
    pequeno: fonteGrande ? 16 : 12
  };
}