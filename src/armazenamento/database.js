import * as SQLite from 'expo-sqlite';

// Nome do banco de dados
const DATABASE_NAME = 'telos.db';

// Instância do banco de dados
let database = null;

// Inicializar banco de dados
export const inicializarDatabase = async () => {
  try {
    database = await SQLite.openDatabaseAsync(DATABASE_NAME);
    
    // Habilitar chaves estrangeiras
    await database.execAsync('PRAGMA foreign_keys = ON');
    
    await criarTabelas();
    console.log('Banco de dados inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    return false;
  }
};

// Obter instância do banco
export const getDatabase = () => {
  if (!database) {
    throw new Error('Banco de dados não foi inicializado. Chame inicializarDatabase() primeiro.');
  }
  return database;
};

// Criar todas as tabelas
const criarTabelas = async () => {
  const db = getDatabase();
  
  try {
    // Tabela para entradas do diário
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS diario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        conteudo TEXT NOT NULL,
        data TEXT NOT NULL,
        dataCriacao TEXT NOT NULL,
        dataModificacao TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela para transações financeiras
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS financas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
        valor REAL NOT NULL,
        categoria TEXT NOT NULL,
        descricao TEXT,
        data TEXT NOT NULL,
        dataCriacao TEXT NOT NULL,
        dataModificacao TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela para histórico financeiro mensal
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS financas_historico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ano INTEGER NOT NULL,
        mes INTEGER NOT NULL,
        totalReceitas REAL DEFAULT 0,
        totalDespesas REAL DEFAULT 0,
        saldo REAL DEFAULT 0,
        dataCriacao TEXT NOT NULL,
        dataModificacao TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(ano, mes)
      );
    `);

    // Tabela para eventos do calendário
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS calendario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT,
        data TEXT NOT NULL,
        hora TEXT,
        dataCriacao TEXT NOT NULL,
        dataModificacao TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela para memória da IA
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS memoria_ia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chave TEXT UNIQUE NOT NULL,
        valor TEXT NOT NULL,
        dataCriacao TEXT NOT NULL,
        dataModificacao TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela para conversas da IA
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS conversas_ia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mensagem TEXT NOT NULL,
        resposta TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        dataCriacao TEXT NOT NULL
      );
    `);

    // Tabela para configurações de notificações
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notificacoes_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ativo BOOLEAN NOT NULL DEFAULT 0,
        configuracao TEXT NOT NULL,
        dataCriacao TEXT NOT NULL,
        dataModificacao TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela para horários de notificações
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notificacoes_horarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hora INTEGER NOT NULL,
        minuto INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        ativo BOOLEAN NOT NULL DEFAULT 1,
        dataCriacao TEXT NOT NULL,
        dataModificacao TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela para configurações do app
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS configuracoes_app (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chave TEXT UNIQUE NOT NULL,
        valor TEXT NOT NULL,
        dataCriacao TEXT NOT NULL,
        dataModificacao TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Criar índices para melhor performance
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_diario_data ON diario(data);
      CREATE INDEX IF NOT EXISTS idx_financas_data ON financas(data);
      CREATE INDEX IF NOT EXISTS idx_financas_tipo ON financas(tipo);
      CREATE INDEX IF NOT EXISTS idx_calendario_data ON calendario(data);
      CREATE INDEX IF NOT EXISTS idx_historico_ano_mes ON financas_historico(ano, mes);
    `);

    console.log('Tabelas criadas com sucesso');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    throw error;
  }
};

// Função para executar consultas preparadas
export const executarQuery = async (query, params = []) => {
  try {
    const db = getDatabase();
    const resultado = await db.getAllAsync(query, params);
    return resultado;
  } catch (error) {
    console.error('Erro ao executar query:', error);
    throw error;
  }
};

// Função para executar comandos (INSERT, UPDATE, DELETE)
export const executarComando = async (query, params = []) => {
  try {
    const db = getDatabase();
    const resultado = await db.runAsync(query, params);
    return resultado;
  } catch (error) {
    console.error('Erro ao executar comando:', error);
    throw error;
  }
};

// Função para iniciar transação
export const iniciarTransacao = async (callback) => {
  const db = getDatabase();
  try {
    await db.withTransactionAsync(callback);
  } catch (error) {
    console.error('Erro na transação:', error);
    throw error;
  }
};

// Função para resetar banco de dados (para desenvolvimento)
export const resetarDatabase = async () => {
  try {
    const db = getDatabase();
    
    // Dropar todas as tabelas
    await db.execAsync(`
      DROP TABLE IF EXISTS diario;
      DROP TABLE IF EXISTS financas;
      DROP TABLE IF EXISTS financas_historico;
      DROP TABLE IF EXISTS calendario;
      DROP TABLE IF EXISTS memoria_ia;
      DROP TABLE IF EXISTS conversas_ia;
      DROP TABLE IF EXISTS notificacoes_config;
      DROP TABLE IF EXISTS notificacoes_horarios;
      DROP TABLE IF EXISTS configuracoes_app;
    `);
    
    // Recriar tabelas
    await criarTabelas();
    console.log('Banco de dados resetado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao resetar banco de dados:', error);
    return false;
  }
};

// Função para fechar banco de dados
export const fecharDatabase = async () => {
  try {
    if (database) {
      await database.closeAsync();
      database = null;
      console.log('Banco de dados fechado');
    }
  } catch (error) {
    console.error('Erro ao fechar banco de dados:', error);
  }
};
