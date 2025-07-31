import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para armazenamento
const CHAVES = {
  DIARIO: '@diario_entradas',
  FINANCAS: '@financas_transacoes',
  FINANCAS_HISTORICO: '@financas_historico_mensal',
  CALENDARIO: '@calendario_eventos',
  MEMORIA_IA: '@telos_memoria_ia',
  CONVERSAS_IA: '@telos_conversas_ia',
  NOTIFICACOES: '@telos_notificacoes_config',
  CONFIGURACOES_APP: '@telos_configuracoes_app',
};

// Funções genéricas de armazenamento
export const salvarDados = async (chave, dados) => {
  try {
    const dadosString = JSON.stringify(dados);
    await AsyncStorage.setItem(chave, dadosString);
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return false;
  }
};

export const carregarDados = async (chave) => {
  try {
    const dadosString = await AsyncStorage.getItem(chave);
    return dadosString ? JSON.parse(dadosString) : null;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return null;
  }
};

export const removerDados = async (chave) => {
  try {
    await AsyncStorage.removeItem(chave);
    return true;
  } catch (error) {
    console.error('Erro ao remover dados:', error);
    return false;
  }
};

// Funções específicas para o Diário
export const salvarEntradaDiario = async (entrada) => {
  try {
    const entradas = await carregarEntradasDiario();
    const novaEntrada = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      ...entrada,
    };
    
    const entradasAtualizadas = [novaEntrada, ...entradas];
    return await salvarDados(CHAVES.DIARIO, entradasAtualizadas);
  } catch (error) {
    console.error('Erro ao salvar entrada do diário:', error);
    return false;
  }
};

export const carregarEntradasDiario = async () => {
  const entradas = await carregarDados(CHAVES.DIARIO);
  return entradas || [];
};

export const atualizarEntradaDiario = async (id, dadosAtualizados) => {
  try {
    const entradas = await carregarEntradasDiario();
    const indice = entradas.findIndex(entrada => entrada.id === id);
    
    if (indice !== -1) {
      entradas[indice] = { ...entradas[indice], ...dadosAtualizados };
      return await salvarDados(CHAVES.DIARIO, entradas);
    }
    return false;
  } catch (error) {
    console.error('Erro ao atualizar entrada do diário:', error);
    return false;
  }
};

export const excluirEntradaDiario = async (id) => {
  try {
    const entradas = await carregarEntradasDiario();
    const entradasFiltradas = entradas.filter(entrada => entrada.id !== id);
    return await salvarDados(CHAVES.DIARIO, entradasFiltradas);
  } catch (error) {
    console.error('Erro ao excluir entrada do diário:', error);
    return false;
  }
};

// Funções específicas para Finanças
export const salvarTransacaoFinanceira = async (transacao) => {
  try {
    const transacoes = await carregarTransacoesFinanceiras();
    const novaTransacao = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      ...transacao,
    };
    
    const transacoesAtualizadas = [novaTransacao, ...transacoes];
    return await salvarDados(CHAVES.FINANCAS, transacoesAtualizadas);
  } catch (error) {
    console.error('Erro ao salvar transação financeira:', error);
    return false;
  }
};

export const carregarTransacoesFinanceiras = async () => {
  const transacoes = await carregarDados(CHAVES.FINANCAS);
  return transacoes || [];
};

export const atualizarTransacaoFinanceira = async (id, dadosAtualizados) => {
  try {
    const transacoes = await carregarTransacoesFinanceiras();
    const indice = transacoes.findIndex(transacao => transacao.id === id);
    
    if (indice !== -1) {
      transacoes[indice] = { ...transacoes[indice], ...dadosAtualizados };
      return await salvarDados(CHAVES.FINANCAS, transacoes);
    }
    return false;
  } catch (error) {
    console.error('Erro ao atualizar transação financeira:', error);
    return false;
  }
};

export const excluirTransacaoFinanceira = async (id) => {
  try {
    const transacoes = await carregarTransacoesFinanceiras();
    const transacoesFiltradas = transacoes.filter(transacao => transacao.id !== id);
    return await salvarDados(CHAVES.FINANCAS, transacoesFiltradas);
  } catch (error) {
    console.error('Erro ao excluir transação financeira:', error);
    return false;
  }
};

// Funções específicas para Calendário
export const salvarEventoCalendario = async (evento) => {
  try {
    const eventos = await carregarEventosCalendario();
    const novoEvento = {
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      ...evento,
    };
    
    const eventosAtualizados = [novoEvento, ...eventos];
    return await salvarDados(CHAVES.CALENDARIO, eventosAtualizados);
  } catch (error) {
    console.error('Erro ao salvar evento do calendário:', error);
    return false;
  }
};

export const carregarEventosCalendario = async () => {
  const eventos = await carregarDados(CHAVES.CALENDARIO);
  return eventos || [];
};

export const atualizarEventoCalendario = async (id, dadosAtualizados) => {
  try {
    const eventos = await carregarEventosCalendario();
    const indice = eventos.findIndex(evento => evento.id === id);
    
    if (indice !== -1) {
      eventos[indice] = { ...eventos[indice], ...dadosAtualizados };
      return await salvarDados(CHAVES.CALENDARIO, eventos);
    }
    return false;
  } catch (error) {
    console.error('Erro ao atualizar evento do calendário:', error);
    return false;
  }
};

export const excluirEventoCalendario = async (id) => {
  try {
    const eventos = await carregarEventosCalendario();
    const eventosFiltrados = eventos.filter(evento => evento.id !== id);
    return await salvarDados(CHAVES.CALENDARIO, eventosFiltrados);
  } catch (error) {
    console.error('Erro ao excluir evento do calendário:', error);
    return false;
  }
};

// Função para obter eventos de uma data específica
export const obterEventosPorData = async (data) => {
  try {
    const eventos = await carregarEventosCalendario();
    const dataFormatada = data.split('T')[0]; // Pega apenas a parte da data (YYYY-MM-DD)
    
    return eventos.filter(evento => {
      const eventoData = evento.data ? evento.data.split('T')[0] : '';
      return eventoData === dataFormatada;
    });
  } catch (error) {
    console.error('Erro ao obter eventos por data:', error);
    return [];
  }
};

export default {
  salvarDados,
  carregarDados,
  removerDados,
  salvarEntradaDiario,
  carregarEntradasDiario,
  atualizarEntradaDiario,
  excluirEntradaDiario,
  salvarTransacaoFinanceira,
  carregarTransacoesFinanceiras,
  atualizarTransacaoFinanceira,
  excluirTransacaoFinanceira,
  salvarEventoCalendario,
  carregarEventosCalendario,
  atualizarEventoCalendario,
  excluirEventoCalendario,
  obterEventosPorData,
};

// ==========================================
// FUNÇÕES PARA MEMÓRIA E CONVERSAS DA IA
// ==========================================

const LIMITE_MENSAGENS_MEMORIA = 30; // Últimas 30 mensagens
const TAMANHO_MAX_MENSAGEM = 500; // Cortar mensagens muito longas
const LIMITE_CONVERSAS_SALVAS = 20; // Máximo 20 conversas salvas

// Salvar conversa atual na memória temporária
export const salvarMemoriaIA = async (conversa) => {
  try {
    if (!conversa || conversa.length === 0) return true;

    // Manter apenas mensagens recentes
    const conversaRecente = conversa.slice(-LIMITE_MENSAGENS_MEMORIA);
    
    // Otimizar conteúdo das mensagens
    const conversaOtimizada = conversaRecente.map(msg => ({
      tipo: msg.tipo,
      texto: msg.texto.length > TAMANHO_MAX_MENSAGEM 
        ? msg.texto.substring(0, TAMANHO_MAX_MENSAGEM) + '...'
        : msg.texto,
      timestamp: msg.timestamp || Date.now()
    }));

    await AsyncStorage.setItem(CHAVES.MEMORIA_IA, JSON.stringify(conversaOtimizada));
    
    console.log(`💾 Memória IA salva: ${conversaOtimizada.length} mensagens`);
    return true;
  } catch (error) {
    console.error('Erro ao salvar memória da IA:', error);
    return false;
  }
};

// Carregar conversa da memória temporária
export const carregarMemoriaIA = async () => {
  try {
    const memoriaString = await AsyncStorage.getItem(CHAVES.MEMORIA_IA);
    const memoria = memoriaString ? JSON.parse(memoriaString) : [];
    
    console.log(`🧠 Memória IA carregada: ${memoria.length} mensagens`);
    return memoria;
  } catch (error) {
    console.error('Erro ao carregar memória da IA:', error);
    return [];
  }
};

// Limpar memória temporária
export const limparMemoriaIA = async () => {
  try {
    await AsyncStorage.removeItem(CHAVES.MEMORIA_IA);
    console.log('🗑️ Memória IA limpa');
    return true;
  } catch (error) {
    console.error('Erro ao limpar memória da IA:', error);
    return false;
  }
};

// Salvar conversa no histórico permanente
export const salvarConversaIA = async (conversa, titulo = null) => {
  try {
    if (!conversa || conversa.length === 0) return false;

    const conversas = await carregarConversasIA();
    
    // Gerar título automático se não fornecido
    const tituloConversa = titulo || gerarTituloConversa(conversa);
    
    // Otimizar mensagens para armazenamento
    const mensagensOtimizadas = conversa.map(msg => ({
      tipo: msg.tipo,
      texto: msg.texto.length > TAMANHO_MAX_MENSAGEM 
        ? msg.texto.substring(0, TAMANHO_MAX_MENSAGEM) + '...'
        : msg.texto,
      timestamp: msg.timestamp || Date.now()
    }));

    const novaConversa = {
      id: Date.now().toString(),
      titulo: tituloConversa,
      mensagens: mensagensOtimizadas,
      dataCriacao: new Date().toISOString(),
      dataUltimaAtualizacao: new Date().toISOString(),
      quantidadeMensagens: mensagensOtimizadas.length
    };

    // Adicionar no início da lista
    conversas.unshift(novaConversa);
    
    // Manter apenas as últimas X conversas
    const conversasLimitadas = conversas.slice(0, LIMITE_CONVERSAS_SALVAS);
    
    await AsyncStorage.setItem(CHAVES.CONVERSAS_IA, JSON.stringify(conversasLimitadas));
    
    console.log(`💬 Conversa salva: "${tituloConversa}" (${mensagensOtimizadas.length} mensagens)`);
    return novaConversa.id;
  } catch (error) {
    console.error('Erro ao salvar conversa da IA:', error);
    return false;
  }
};

// Carregar todas as conversas salvas
export const carregarConversasIA = async () => {
  try {
    const conversasString = await AsyncStorage.getItem(CHAVES.CONVERSAS_IA);
    const conversas = conversasString ? JSON.parse(conversasString) : [];
    
    console.log(`📚 Conversas carregadas: ${conversas.length}`);
    return conversas;
  } catch (error) {
    console.error('Erro ao carregar conversas da IA:', error);
    return [];
  }
};

// Carregar conversa específica por ID
export const carregarConversaIA = async (conversaId) => {
  try {
    const conversas = await carregarConversasIA();
    const conversa = conversas.find(c => c.id === conversaId);
    
    if (conversa) {
      console.log(`📖 Conversa carregada: "${conversa.titulo}"`);
      return conversa;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao carregar conversa específica:', error);
    return null;
  }
};

// Excluir conversa específica
export const excluirConversaIA = async (conversaId) => {
  try {
    const conversas = await carregarConversasIA();
    const conversasAtualizadas = conversas.filter(c => c.id !== conversaId);
    
    await AsyncStorage.setItem(CHAVES.CONVERSAS_IA, JSON.stringify(conversasAtualizadas));
    
    console.log(`🗑️ Conversa excluída: ${conversaId}`);
    return true;
  } catch (error) {
    console.error('Erro ao excluir conversa:', error);
    return false;
  }
};

// Atualizar conversa existente
export const atualizarConversaIA = async (conversaId, novasMensagens) => {
  try {
    const conversas = await carregarConversasIA();
    const indiceConversa = conversas.findIndex(c => c.id === conversaId);
    
    if (indiceConversa === -1) return false;
    
    // Otimizar novas mensagens
    const mensagensOtimizadas = novasMensagens.map(msg => ({
      tipo: msg.tipo,
      texto: msg.texto.length > TAMANHO_MAX_MENSAGEM 
        ? msg.texto.substring(0, TAMANHO_MAX_MENSAGEM) + '...'
        : msg.texto,
      timestamp: msg.timestamp || Date.now()
    }));
    
    // Atualizar conversa
    conversas[indiceConversa].mensagens = mensagensOtimizadas;
    conversas[indiceConversa].dataUltimaAtualizacao = new Date().toISOString();
    conversas[indiceConversa].quantidadeMensagens = mensagensOtimizadas.length;
    
    await AsyncStorage.setItem(CHAVES.CONVERSAS_IA, JSON.stringify(conversas));
    
    console.log(`📝 Conversa atualizada: ${conversaId}`);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar conversa:', error);
    return false;
  }
};

// Limpar todo o histórico de conversas
export const limparHistoricoConversasIA = async () => {
  try {
    await AsyncStorage.removeItem(CHAVES.CONVERSAS_IA);
    console.log('🗑️ Histórico de conversas limpo');
    return true;
  } catch (error) {
    console.error('Erro ao limpar histórico de conversas:', error);
    return false;
  }
};

// Obter estatísticas da memória
export const obterEstatisticasMemoriaIA = async () => {
  try {
    const memoria = await carregarMemoriaIA();
    const conversas = await carregarConversasIA();
    
    const memoriaString = JSON.stringify(memoria);
    const conversasString = JSON.stringify(conversas);
    
    const tamanhoMemoria = memoriaString.length;
    const tamanhoConversas = conversasString.length;
    const tamanhoTotal = tamanhoMemoria + tamanhoConversas;
    
    return {
      memoria: {
        mensagens: memoria.length,
        tamanhoBytes: tamanhoMemoria,
        tamanhoKB: (tamanhoMemoria / 1024).toFixed(2)
      },
      conversas: {
        quantidade: conversas.length,
        totalMensagens: conversas.reduce((total, c) => total + c.quantidadeMensagens, 0),
        tamanhoBytes: tamanhoConversas,
        tamanhoKB: (tamanhoConversas / 1024).toFixed(2)
      },
      total: {
        tamanhoBytes: tamanhoTotal,
        tamanhoKB: (tamanhoTotal / 1024).toFixed(2),
        tamanhoMB: (tamanhoTotal / 1024 / 1024).toFixed(2)
      }
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return null;
  }
};

// Gerar título automático para conversa
const gerarTituloConversa = (conversa) => {
  if (!conversa || conversa.length === 0) return 'Conversa vazia';
  
  // Pegar primeira mensagem do usuário
  const primeiraMensagemUsuario = conversa.find(msg => msg.tipo === 'usuario');
  
  if (primeiraMensagemUsuario) {
    let titulo = primeiraMensagemUsuario.texto;
    
    // Limitar tamanho do título
    if (titulo.length > 50) {
      titulo = titulo.substring(0, 47) + '...';
    }
    
    return titulo;
  }
  
  // Fallback com data/hora
  const agora = new Date();
  return `Conversa ${agora.toLocaleDateString()} ${agora.toLocaleTimeString()}`;
};

// Funções específicas para o Histórico Mensal de Finanças
export const salvarHistoricoMensal = async (historico) => {
  try {
    return await salvarDados(CHAVES.FINANCAS_HISTORICO, historico);
  } catch (error) {
    console.error('Erro ao salvar histórico mensal:', error);
    return false;
  }
};

export const carregarHistoricoMensal = async () => {
  try {
    return await carregarDados(CHAVES.FINANCAS_HISTORICO) || [];
  } catch (error) {
    console.error('Erro ao carregar histórico mensal:', error);
    return [];
  }
};

export const excluirHistoricoMensal = async () => {
  try {
    return await removerDados(CHAVES.FINANCAS_HISTORICO);
  } catch (error) {
    console.error('Erro ao excluir histórico mensal:', error);
    return false;
  }
};

// Funções específicas para Notificações
export const salvarConfiguracaoNotificacao = async (configuracao) => {
  try {
    return await salvarDados(CHAVES.NOTIFICACOES, configuracao);
  } catch (error) {
    console.error('Erro ao salvar configuração de notificações:', error);
    return false;
  }
};

export const carregarConfiguracaoNotificacao = async () => {
  try {
    return await carregarDados(CHAVES.NOTIFICACOES);
  } catch (error) {
    console.error('Erro ao carregar configuração de notificações:', error);
    return null;
  }
};

export const atualizarConfiguracaoNotificacao = async (novaConfiguracao) => {
  try {
    return await salvarDados(CHAVES.NOTIFICACOES, novaConfiguracao);
  } catch (error) {
    console.error('Erro ao atualizar configuração de notificações:', error);
    return false;
  }
};

export const excluirConfiguracaoNotificacao = async () => {
  try {
    return await removerDados(CHAVES.NOTIFICACOES);
  } catch (error) {
    console.error('Erro ao excluir configuração de notificações:', error);
    return false;
  }
};

// Funções específicas para Configurações do App
export const salvarConfiguracaoApp = async (configuracao) => {
  try {
    return await salvarDados(CHAVES.CONFIGURACOES_APP, configuracao);
  } catch (error) {
    console.error('Erro ao salvar configuração do app:', error);
    return false;
  }
};

export const carregarConfiguracaoApp = async () => {
  try {
    return await carregarDados(CHAVES.CONFIGURACOES_APP);
  } catch (error) {
    console.error('Erro ao carregar configuração do app:', error);
    return null;
  }
};

export const atualizarConfiguracaoApp = async (novaConfiguracao) => {
  try {
    return await salvarDados(CHAVES.CONFIGURACOES_APP, novaConfiguracao);
  } catch (error) {
    console.error('Erro ao atualizar configuração do app:', error);
    return false;
  }
};

// Função para exportar todos os dados (backup)
export const exportarTodosDados = async () => {
  try {
    const dados = {
      eventos: await carregarEventosCalendario(),
      entradas: await carregarEntradasDiario(),
      transacoes: await carregarTransacoesFinanceiras(),
      notificacoes: await carregarConfiguracaoNotificacao(),
      configuracoes: await carregarConfiguracaoApp(),
      versao: '1.0.0',
      dataExportacao: new Date().toISOString()
    };
    
    console.log('📄 Dados exportados:', JSON.stringify(dados, null, 2));
    return dados;
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return null;
  }
};

// Função para limpar todos os dados
export const limparTodosDados = async () => {
  try {
    const chaves = Object.values(CHAVES);
    const promessas = chaves.map(chave => removerDados(chave));
    await Promise.all(promessas);
    
    console.log('🗑️ Todos os dados foram removidos');
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return false;
  }
};
