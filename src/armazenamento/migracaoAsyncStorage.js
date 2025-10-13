import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  salvarEntradaDiario,
  salvarTransacaoFinanceira,
  salvarEventoCalendario,
  salvarMemoriaIA,
  salvarConversaIA,

  salvarConfiguracaoApp
} from './armazenamentoSQLite';

// Função principal de migração
export const migrarDadosAsyncStorageParaSQLite = async () => {
  try {
    console.log('🔄 Iniciando migração do AsyncStorage para SQLite...');
    
    // Verificar se a migração já foi feita
    const migracao = await AsyncStorage.getItem('migracaoSQLiteCompleta');
    if (migracao === 'true') {
      console.log('✅ Migração já foi realizada anteriormente');
      return true;
    }

    let totalMigrados = 0;

    // Migrar entradas do diário
    const entrdasMigradas = await migrarEntradasDiario();
    totalMigrados += entrdasMigradas;

    // Migrar transações financeiras
    const transacoesMigradas = await migrarTransacoesFinanceiras();
    totalMigrados += transacoesMigradas;

    // Migrar eventos do calendário
    const eventosMigrados = await migrarEventosCalendario();
    totalMigrados += eventosMigrados;

    // Migrar dados da IA
    const dadosIAMigrados = await migrarDadosIA();
    totalMigrados += dadosIAMigrados;

    // Migrar configurações
    await migrarConfiguracoes();

    // Marcar migração como completa
    await AsyncStorage.setItem('migracaoSQLiteCompleta', 'true');
    
    console.log(`✅ Migração completa! ${totalMigrados} itens migrados com sucesso`);
    return true;
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    return false;
  }
};

// Migrar entradas do diário
const migrarEntradasDiario = async () => {
  try {
    const entradasString = await AsyncStorage.getItem('entradas_diario');
    if (!entradasString) return 0;

    const entradas = JSON.parse(entradasString);
    let migradas = 0;

    for (const entrada of entradas) {
      try {
        await salvarEntradaDiario({
          titulo: entrada.titulo,
          conteudo: entrada.conteudo,
          data: entrada.data
        });
        migradas++;
      } catch (error) {
        console.warn('Erro ao migrar entrada do diário:', entrada.id, error);
      }
    }

    console.log(`📓 Diário: ${migradas} entradas migradas`);
    return migradas;
  } catch (error) {
    console.warn('Erro ao migrar entradas do diário:', error);
    return 0;
  }
};

// Migrar transações financeiras
const migrarTransacoesFinanceiras = async () => {
  try {
    const transacoesString = await AsyncStorage.getItem('transacoes_financeiras');
    if (!transacoesString) return 0;

    const transacoes = JSON.parse(transacoesString);
    let migradas = 0;

    for (const transacao of transacoes) {
      try {
        await salvarTransacaoFinanceira({
          tipo: transacao.tipo,
          valor: transacao.valor,
          categoria: transacao.categoria,
          descricao: transacao.descricao,
          data: transacao.data
        });
        migradas++;
      } catch (error) {
        console.warn('Erro ao migrar transação financeira:', transacao.id, error);
      }
    }

    console.log(`💰 Finanças: ${migradas} transações migradas`);
    return migradas;
  } catch (error) {
    console.warn('Erro ao migrar transações financeiras:', error);
    return 0;
  }
};

// Migrar eventos do calendário
const migrarEventosCalendario = async () => {
  try {
    const eventosString = await AsyncStorage.getItem('eventos_calendario');
    if (!eventosString) return 0;

    const eventos = JSON.parse(eventosString);
    let migrados = 0;

    for (const evento of eventos) {
      try {
        await salvarEventoCalendario({
          titulo: evento.titulo,
          descricao: evento.descricao,
          data: evento.data,
          hora: evento.hora
        });
        migrados++;
      } catch (error) {
        console.warn('Erro ao migrar evento do calendário:', evento.id, error);
      }
    }

    console.log(`📅 Calendário: ${migrados} eventos migrados`);
    return migrados;
  } catch (error) {
    console.warn('Erro ao migrar eventos do calendário:', error);
    return 0;
  }
};

// Migrar dados da IA
const migrarDadosIA = async () => {
  try {
    let migrados = 0;

    // Migrar memória da IA
    const memoriaString = await AsyncStorage.getItem('memoria_ia');
    if (memoriaString) {
      try {
        const memoria = JSON.parse(memoriaString);
        for (const [chave, valor] of Object.entries(memoria)) {
          await salvarMemoriaIA(chave, valor);
          migrados++;
        }
      } catch (error) {
        console.warn('Erro ao migrar memória da IA:', error);
      }
    }

    // Migrar conversas da IA
    const conversasString = await AsyncStorage.getItem('conversas_ia');
    if (conversasString) {
      try {
        const conversas = JSON.parse(conversasString);
        for (const conversa of conversas) {
          await salvarConversaIA({
            mensagem: conversa.mensagem,
            resposta: conversa.resposta,
            timestamp: conversa.timestamp
          });
          migrados++;
        }
      } catch (error) {
        console.warn('Erro ao migrar conversas da IA:', error);
      }
    }

    console.log(`🤖 IA: ${migrados} itens migrados`);
    return migrados;
  } catch (error) {
    console.warn('Erro ao migrar dados da IA:', error);
    return 0;
  }
};

// Migrar configurações
const migrarConfiguracoes = async () => {
  try {


    // Migrar outras configurações do app
    const configuracoes = {};
    const chaves = [
      'tema_app',
      'versao_app',
      'primeira_inicializacao',
      'configuracoes_gerais'
    ];

    for (const chave of chaves) {
      try {
        const valor = await AsyncStorage.getItem(chave);
        if (valor !== null) {
          configuracoes[chave] = JSON.parse(valor);
        }
      } catch (error) {
        // Se não conseguir fazer parse, salvar como string
        const valor = await AsyncStorage.getItem(chave);
        if (valor !== null) {
          configuracoes[chave] = valor;
        }
      }
    }

    if (Object.keys(configuracoes).length > 0) {
      await salvarConfiguracaoApp(configuracoes);
      console.log('⚙️ Configurações do app migradas');
    }
  } catch (error) {
    console.warn('Erro ao migrar configurações:', error);
  }
};

// Função para limpar dados antigos do AsyncStorage (opcional)
export const limparAsyncStorageAposMigracao = async () => {
  try {
    const chaves = [
      'entradas_diario',
      'transacoes_financeiras',
      'eventos_calendario',
      'memoria_ia',
      'conversas_ia',

      'tema_app',
      'versao_app',
      'primeira_inicializacao',
      'configuracoes_gerais'
    ];

    for (const chave of chaves) {
      await AsyncStorage.removeItem(chave);
    }

    console.log('🧹 Dados antigos do AsyncStorage removidos');
    return true;
  } catch (error) {
    console.error('Erro ao limpar AsyncStorage:', error);
    return false;
  }
};
