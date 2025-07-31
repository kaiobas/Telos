import { executarQuery, executarComando, iniciarTransacao } from './database';

// ====================== FUNÇÕES DO DIÁRIO ======================

export const salvarEntradaDiario = async (entrada) => {
  try {
    const resultado = await executarComando(
      'INSERT INTO diario (titulo, conteudo, data, dataCriacao) VALUES (?, ?, ?, ?)',
      [entrada.titulo, entrada.conteudo, entrada.data || new Date().toISOString().split('T')[0], new Date().toISOString()]
    );
    return resultado.lastInsertRowId;
  } catch (error) {
    console.error('Erro ao salvar entrada do diário:', error);
    return false;
  }
};

export const carregarEntradasDiario = async () => {
  try {
    const entradas = await executarQuery(
      'SELECT * FROM diario ORDER BY data DESC, dataCriacao DESC'
    );
    return entradas.map(entrada => ({
      ...entrada,
      id: entrada.id.toString()
    }));
  } catch (error) {
    console.error('Erro ao carregar entradas do diário:', error);
    return [];
  }
};

export const atualizarEntradaDiario = async (id, dadosAtualizados) => {
  try {
    const campos = [];
    const valores = [];
    
    if (dadosAtualizados.titulo !== undefined) {
      campos.push('titulo = ?');
      valores.push(dadosAtualizados.titulo);
    }
    if (dadosAtualizados.conteudo !== undefined) {
      campos.push('conteudo = ?');
      valores.push(dadosAtualizados.conteudo);
    }
    if (dadosAtualizados.data !== undefined) {
      campos.push('data = ?');
      valores.push(dadosAtualizados.data);
    }
    
    campos.push('dataModificacao = ?');
    valores.push(new Date().toISOString());
    valores.push(id);
    
    const resultado = await executarComando(
      `UPDATE diario SET ${campos.join(', ')} WHERE id = ?`,
      valores
    );
    
    return resultado.changes > 0;
  } catch (error) {
    console.error('Erro ao atualizar entrada do diário:', error);
    return false;
  }
};

export const excluirEntradaDiario = async (id) => {
  try {
    const resultado = await executarComando('DELETE FROM diario WHERE id = ?', [id]);
    return resultado.changes > 0;
  } catch (error) {
    console.error('Erro ao excluir entrada do diário:', error);
    return false;
  }
};

// ====================== FUNÇÕES DE FINANÇAS ======================

export const salvarTransacaoFinanceira = async (transacao) => {
  try {
    await iniciarTransacao(async () => {
      // Inserir transação
      const resultado = await executarComando(
        'INSERT INTO financas (tipo, valor, categoria, descricao, data, dataCriacao) VALUES (?, ?, ?, ?, ?, ?)',
        [
          transacao.tipo,
          transacao.valor,
          transacao.categoria,
          transacao.descricao || '',
          transacao.data || new Date().toISOString().split('T')[0],
          new Date().toISOString()
        ]
      );
      
      // Atualizar histórico mensal
      const data = new Date(transacao.data || new Date());
      const ano = data.getFullYear();
      const mes = data.getMonth() + 1;
      
      await atualizarHistoricoMensal(ano, mes);
      
      return resultado.lastInsertRowId;
    });
    return true;
  } catch (error) {
    console.error('Erro ao salvar transação financeira:', error);
    return false;
  }
};

export const carregarTransacoesFinanceiras = async () => {
  try {
    const transacoes = await executarQuery(
      'SELECT * FROM financas ORDER BY data DESC, dataCriacao DESC'
    );
    return transacoes.map(transacao => ({
      ...transacao,
      id: transacao.id.toString(),
      valor: parseFloat(transacao.valor)
    }));
  } catch (error) {
    console.error('Erro ao carregar transações financeiras:', error);
    return [];
  }
};

export const atualizarTransacaoFinanceira = async (id, dadosAtualizados) => {
  try {
    const campos = [];
    const valores = [];
    
    if (dadosAtualizados.tipo !== undefined) {
      campos.push('tipo = ?');
      valores.push(dadosAtualizados.tipo);
    }
    if (dadosAtualizados.valor !== undefined) {
      campos.push('valor = ?');
      valores.push(dadosAtualizados.valor);
    }
    if (dadosAtualizados.categoria !== undefined) {
      campos.push('categoria = ?');
      valores.push(dadosAtualizados.categoria);
    }
    if (dadosAtualizados.descricao !== undefined) {
      campos.push('descricao = ?');
      valores.push(dadosAtualizados.descricao);
    }
    if (dadosAtualizados.data !== undefined) {
      campos.push('data = ?');
      valores.push(dadosAtualizados.data);
    }
    
    campos.push('dataModificacao = ?');
    valores.push(new Date().toISOString());
    valores.push(id);
    
    await iniciarTransacao(async () => {
      const resultado = await executarComando(
        `UPDATE financas SET ${campos.join(', ')} WHERE id = ?`,
        valores
      );
      
      // Se a data foi alterada, atualizar históricos
      if (dadosAtualizados.data !== undefined) {
        const dataAntiga = await executarQuery('SELECT data FROM financas WHERE id = ?', [id]);
        if (dataAntiga.length > 0) {
          const dataAntigaObj = new Date(dataAntiga[0].data);
          const anoAntigo = dataAntigaObj.getFullYear();
          const mesAntigo = dataAntigaObj.getMonth() + 1;
          
          const dataNovaObj = new Date(dadosAtualizados.data);
          const anoNovo = dataNovaObj.getFullYear();
          const mesNovo = dataNovaObj.getMonth() + 1;
          
          await atualizarHistoricoMensal(anoAntigo, mesAntigo);
          if (anoAntigo !== anoNovo || mesAntigo !== mesNovo) {
            await atualizarHistoricoMensal(anoNovo, mesNovo);
          }
        }
      }
      
      return resultado.changes > 0;
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar transação financeira:', error);
    return false;
  }
};

export const excluirTransacaoFinanceira = async (id) => {
  try {
    await iniciarTransacao(async () => {
      // Obter dados da transação antes de excluir
      const transacao = await executarQuery('SELECT data FROM financas WHERE id = ?', [id]);
      
      if (transacao.length > 0) {
        const data = new Date(transacao[0].data);
        const ano = data.getFullYear();
        const mes = data.getMonth() + 1;
        
        // Excluir transação
        const resultado = await executarComando('DELETE FROM financas WHERE id = ?', [id]);
        
        // Atualizar histórico mensal
        await atualizarHistoricoMensal(ano, mes);
        
        return resultado.changes > 0;
      }
      return false;
    });
    return true;
  } catch (error) {
    console.error('Erro ao excluir transação financeira:', error);
    return false;
  }
};

// Função para atualizar histórico mensal
const atualizarHistoricoMensal = async (ano, mes) => {
  try {
    // Calcular totais do mês
    const receitas = await executarQuery(
      'SELECT COALESCE(SUM(valor), 0) as total FROM financas WHERE tipo = "receita" AND strftime("%Y", data) = ? AND strftime("%m", data) = ?',
      [ano.toString(), mes.toString().padStart(2, '0')]
    );
    
    const despesas = await executarQuery(
      'SELECT COALESCE(SUM(valor), 0) as total FROM financas WHERE tipo = "despesa" AND strftime("%Y", data) = ? AND strftime("%m", data) = ?',
      [ano.toString(), mes.toString().padStart(2, '0')]
    );
    
    const totalReceitas = parseFloat(receitas[0].total) || 0;
    const totalDespesas = parseFloat(despesas[0].total) || 0;
    const saldo = totalReceitas - totalDespesas;
    
    // Inserir ou atualizar histórico
    await executarComando(
      `INSERT OR REPLACE INTO financas_historico 
       (ano, mes, totalReceitas, totalDespesas, saldo, dataCriacao, dataModificacao) 
       VALUES (?, ?, ?, ?, ?, COALESCE((SELECT dataCriacao FROM financas_historico WHERE ano = ? AND mes = ?), ?), ?)`,
      [ano, mes, totalReceitas, totalDespesas, saldo, ano, mes, new Date().toISOString(), new Date().toISOString()]
    );
  } catch (error) {
    console.error('Erro ao atualizar histórico mensal:', error);
  }
};

export const carregarHistoricoFinanceiro = async () => {
  try {
    const historico = await executarQuery(
      'SELECT * FROM financas_historico ORDER BY ano DESC, mes DESC'
    );
    return historico.map(item => ({
      ...item,
      totalReceitas: parseFloat(item.totalReceitas) || 0,
      totalDespesas: parseFloat(item.totalDespesas) || 0,
      saldo: parseFloat(item.saldo) || 0
    }));
  } catch (error) {
    console.error('Erro ao carregar histórico financeiro:', error);
    return [];
  }
};

// Função para carregar histórico mensal específico (compatibilidade)
export const carregarHistoricoMensal = async (ano, mes) => {
  try {
    const historico = await executarQuery(
      'SELECT * FROM financas_historico WHERE ano = ? AND mes = ?',
      [ano, mes]
    );
    
    if (historico.length > 0) {
      const item = historico[0];
      return {
        ...item,
        totalReceitas: parseFloat(item.totalReceitas) || 0,
        totalDespesas: parseFloat(item.totalDespesas) || 0,
        saldo: parseFloat(item.saldo) || 0
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao carregar histórico mensal:', error);
    return null;
  }
};

// ====================== FUNÇÕES DO CALENDÁRIO ======================

export const salvarEventoCalendario = async (evento) => {
  try {
    const resultado = await executarComando(
      'INSERT INTO calendario (titulo, descricao, data, hora, dataCriacao) VALUES (?, ?, ?, ?, ?)',
      [
        evento.titulo,
        evento.descricao || '',
        evento.data,
        evento.hora || null,
        new Date().toISOString()
      ]
    );
    return resultado.lastInsertRowId;
  } catch (error) {
    console.error('Erro ao salvar evento do calendário:', error);
    return false;
  }
};

export const carregarEventosCalendario = async () => {
  try {
    const eventos = await executarQuery(
      'SELECT * FROM calendario ORDER BY data ASC, hora ASC'
    );
    return eventos.map(evento => ({
      ...evento,
      id: evento.id.toString()
    }));
  } catch (error) {
    console.error('Erro ao carregar eventos do calendário:', error);
    return [];
  }
};

export const atualizarEventoCalendario = async (id, dadosAtualizados) => {
  try {
    const campos = [];
    const valores = [];
    
    if (dadosAtualizados.titulo !== undefined) {
      campos.push('titulo = ?');
      valores.push(dadosAtualizados.titulo);
    }
    if (dadosAtualizados.descricao !== undefined) {
      campos.push('descricao = ?');
      valores.push(dadosAtualizados.descricao);
    }
    if (dadosAtualizados.data !== undefined) {
      campos.push('data = ?');
      valores.push(dadosAtualizados.data);
    }
    if (dadosAtualizados.hora !== undefined) {
      campos.push('hora = ?');
      valores.push(dadosAtualizados.hora);
    }
    
    campos.push('dataModificacao = ?');
    valores.push(new Date().toISOString());
    valores.push(id);
    
    const resultado = await executarComando(
      `UPDATE calendario SET ${campos.join(', ')} WHERE id = ?`,
      valores
    );
    
    return resultado.changes > 0;
  } catch (error) {
    console.error('Erro ao atualizar evento do calendário:', error);
    return false;
  }
};

export const excluirEventoCalendario = async (id) => {
  try {
    const resultado = await executarComando('DELETE FROM calendario WHERE id = ?', [id]);
    return resultado.changes > 0;
  } catch (error) {
    console.error('Erro ao excluir evento do calendário:', error);
    return false;
  }
};

export const obterEventosPorData = async (data) => {
  try {
    const eventos = await executarQuery(
      'SELECT * FROM calendario WHERE data = ? ORDER BY hora ASC',
      [data]
    );
    return eventos.map(evento => ({
      ...evento,
      id: evento.id.toString()
    }));
  } catch (error) {
    console.error('Erro ao obter eventos por data:', error);
    return [];
  }
};

// ====================== FUNÇÕES DE CONFIGURAÇÕES ======================

export const salvarConfiguracaoNotificacao = async (configuracao) => {
  try {
    await iniciarTransacao(async () => {
      // Limpar configurações antigas
      await executarComando('DELETE FROM notificacoes_config');
      await executarComando('DELETE FROM notificacoes_horarios');
      
      // Salvar configuração principal
      await executarComando(
        'INSERT INTO notificacoes_config (ativo, configuracao, dataCriacao) VALUES (?, ?, ?)',
        [configuracao.ativo ? 1 : 0, JSON.stringify(configuracao), new Date().toISOString()]
      );
      
      // Salvar horários
      if (configuracao.horarios && configuracao.horarios.length > 0) {
        for (const horario of configuracao.horarios) {
          await executarComando(
            'INSERT INTO notificacoes_horarios (hora, minuto, titulo, mensagem, ativo, dataCriacao) VALUES (?, ?, ?, ?, ?, ?)',
            [
              horario.hora,
              horario.minuto,
              horario.titulo,
              horario.mensagem,
              horario.ativo ? 1 : 0,
              new Date().toISOString()
            ]
          );
        }
      }
    });
    return true;
  } catch (error) {
    console.error('Erro ao salvar configuração de notificação:', error);
    return false;
  }
};

export const carregarConfiguracaoNotificacao = async () => {
  try {
    const config = await executarQuery('SELECT * FROM notificacoes_config ORDER BY id DESC LIMIT 1');
    
    if (config.length === 0) {
      return null;
    }
    
    const horarios = await executarQuery('SELECT * FROM notificacoes_horarios ORDER BY hora ASC, minuto ASC');
    
    return {
      ativo: config[0].ativo === 1,
      horarios: horarios.map(h => ({
        id: h.id,
        hora: h.hora,
        minuto: h.minuto,
        titulo: h.titulo,
        mensagem: h.mensagem,
        ativo: h.ativo === 1
      }))
    };
  } catch (error) {
    console.error('Erro ao carregar configuração de notificação:', error);
    return null;
  }
};

export const atualizarConfiguracaoNotificacao = async (configuracao) => {
  return await salvarConfiguracaoNotificacao(configuracao);
};

export const salvarConfiguracaoApp = async (configuracao) => {
  try {
    await iniciarTransacao(async () => {
      for (const [chave, valor] of Object.entries(configuracao)) {
        await executarComando(
          'INSERT OR REPLACE INTO configuracoes_app (chave, valor, dataCriacao, dataModificacao) VALUES (?, ?, COALESCE((SELECT dataCriacao FROM configuracoes_app WHERE chave = ?), ?), ?)',
          [chave, JSON.stringify(valor), chave, new Date().toISOString(), new Date().toISOString()]
        );
      }
    });
    return true;
  } catch (error) {
    console.error('Erro ao salvar configuração do app:', error);
    return false;
  }
};

export const carregarConfiguracaoApp = async () => {
  try {
    const configs = await executarQuery('SELECT chave, valor FROM configuracoes_app');
    const configuracao = {};
    
    for (const config of configs) {
      try {
        configuracao[config.chave] = JSON.parse(config.valor);
      } catch {
        configuracao[config.chave] = config.valor;
      }
    }
    
    return Object.keys(configuracao).length > 0 ? configuracao : null;
  } catch (error) {
    console.error('Erro ao carregar configuração do app:', error);
    return null;
  }
};

export const atualizarConfiguracaoApp = async (configuracao) => {
  return await salvarConfiguracaoApp(configuracao);
};

// ====================== FUNÇÕES DA IA ======================

export const salvarMemoriaIA = async (chave, valor) => {
  try {
    await executarComando(
      'INSERT OR REPLACE INTO memoria_ia (chave, valor, dataCriacao, dataModificacao) VALUES (?, ?, COALESCE((SELECT dataCriacao FROM memoria_ia WHERE chave = ?), ?), ?)',
      [chave, JSON.stringify(valor), chave, new Date().toISOString(), new Date().toISOString()]
    );
    return true;
  } catch (error) {
    console.error('Erro ao salvar memória da IA:', error);
    return false;
  }
};

export const carregarMemoriaIA = async () => {
  try {
    const memorias = await executarQuery('SELECT chave, valor FROM memoria_ia');
    const memoria = {};
    
    for (const item of memorias) {
      try {
        memoria[item.chave] = JSON.parse(item.valor);
      } catch {
        memoria[item.chave] = item.valor;
      }
    }
    
    return memoria;
  } catch (error) {
    console.error('Erro ao carregar memória da IA:', error);
    return {};
  }
};

export const salvarConversaIA = async (conversa) => {
  try {
    const resultado = await executarComando(
      'INSERT INTO conversas_ia (mensagem, resposta, timestamp, dataCriacao) VALUES (?, ?, ?, ?)',
      [conversa.mensagem, conversa.resposta, conversa.timestamp, new Date().toISOString()]
    );
    return resultado.lastInsertRowId;
  } catch (error) {
    console.error('Erro ao salvar conversa da IA:', error);
    return false;
  }
};

export const carregarConversasIA = async () => {
  try {
    const conversas = await executarQuery(
      'SELECT * FROM conversas_ia ORDER BY timestamp DESC'
    );
    return conversas.map(conversa => ({
      ...conversa,
      id: conversa.id.toString()
    }));
  } catch (error) {
    console.error('Erro ao carregar conversas da IA:', error);
    return [];
  }
};

// ====================== FUNÇÕES UTILITÁRIAS ======================

export const exportarTodosDados = async () => {
  try {
    const dados = {
      diario: await carregarEntradasDiario(),
      financas: await carregarTransacoesFinanceiras(),
      financasHistorico: await carregarHistoricoFinanceiro(),
      calendario: await carregarEventosCalendario(),
      memoriaIA: await carregarMemoriaIA(),
      conversasIA: await carregarConversasIA(),
      notificacoes: await carregarConfiguracaoNotificacao(),
      configuracoes: await carregarConfiguracaoApp(),
      dataExportacao: new Date().toISOString()
    };
    
    console.log('=== BACKUP DOS DADOS TELOS ===');
    console.log(JSON.stringify(dados, null, 2));
    console.log('=== FIM DO BACKUP ===');
    
    return dados;
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return null;
  }
};

export const limparTodosDados = async () => {
  try {
    await iniciarTransacao(async () => {
      await executarComando('DELETE FROM diario');
      await executarComando('DELETE FROM financas');
      await executarComando('DELETE FROM financas_historico');
      await executarComando('DELETE FROM calendario');
      await executarComando('DELETE FROM memoria_ia');
      await executarComando('DELETE FROM conversas_ia');
      await executarComando('DELETE FROM notificacoes_config');
      await executarComando('DELETE FROM notificacoes_horarios');
      await executarComando('DELETE FROM configuracoes_app');
    });
    
    console.log('Todos os dados foram limpos');
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return false;
  }
};

