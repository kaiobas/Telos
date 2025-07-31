import * as SQLite from 'expo-sqlite';

// Abrir/criar banco de dados
const db = SQLite.openDatabase('telos.db');

// Inicializar tabela do diário
export const inicializarDiario = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS diario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        conteudo TEXT NOT NULL,
        data TEXT NOT NULL
      );`
    );
  });
};

// Salvar nova entrada no diário
export const salvarEntradaDiario = (titulo, conteudo, callback) => {
  const data = new Date().toISOString();
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO diario (titulo, conteudo, data) VALUES (?, ?, ?);',
      [titulo, conteudo, data],
      (_, result) => callback && callback(true, result),
      (_, error) => { console.error(error); callback && callback(false, error); return false; }
    );
  });
};

// Buscar todas as entradas do diário (ordem cronológica)
export const buscarEntradasDiario = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM diario ORDER BY data DESC;',
      [],
      (_, { rows }) => callback && callback(rows._array),
      (_, error) => { console.error(error); callback && callback([]); return false; }
    );
  });
};

