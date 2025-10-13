import React, { createContext, useContext, useState, useEffect } from 'react';
import { inicializarDatabase } from '../armazenamento/database';
import { criarTabelas } from '../armazenamento/database';

const DatabaseContext = createContext();

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseContext deve ser usado dentro de DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [bancoInicializado, setBancoInicializado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const iniciarServicos = async () => {
      try {
        setCarregando(true);
        setErro(null);
        setBancoInicializado(false);
        
        console.log('Iniciando serviços...');
        
        // Aguardar um pouco para evitar condições de corrida
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Inicializar banco de dados SQLite
        const bancoOk = await inicializarDatabase();
        if (!bancoOk) {
          throw new Error('Falha ao inicializar banco de dados');
        }
        
        console.log('Banco de dados SQLite inicializado');
        
        // Aguardar mais um pouco para garantir que está pronto
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setBancoInicializado(true);
      } catch (error) {
        console.error('Erro ao inicializar serviços:', error);
        setErro(error.message);
        setBancoInicializado(false);
      } finally {
        setCarregando(false);
      }
    };

    iniciarServicos();
  }, []);

  return (
    <DatabaseContext.Provider value={{ 
      bancoInicializado, 
      carregando, 
      erro 
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};
