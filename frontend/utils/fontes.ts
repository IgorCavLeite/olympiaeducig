import { useContext } from 'react';
<<<<<<< HEAD
import { ConfigContext } from '../contexts/configContext';
=======
import { ConfigContext } from '../contexts/ConfigContext';
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce

export function useFonte() {
  const { fonteGrande } =
    useContext(ConfigContext);

  return {
    titulo: fonteGrande ? 32 : 24,
    subtitulo: fonteGrande ? 24 : 18,
    texto: fonteGrande ? 20 : 16,
    pequeno: fonteGrande ? 16 : 12
  };
<<<<<<< HEAD
}
=======
}
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
