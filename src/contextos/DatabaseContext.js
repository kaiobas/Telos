import React, { createContext, useContext, useState, useEffect } from 'react';
import { inicializarDatabase } from '../armazenamento/database';
import { inicializarNotificacoes } from '../servicos/notificacoes';

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
        
        // Inicializar banco de dados SQLite
        await inicializarDatabase();
        console.log('Banco de dados SQLite inicializado');
        
        // Inicializar notificações
        await inicializarNotificacoes();
        console.log('Sistema de notificações inicializado');
        
        setBancoInicializado(true);
      } catch (error) {
        console.error('Erro ao inicializar serviços:', error);
        setErro(error.message);
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
