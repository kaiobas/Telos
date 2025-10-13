import { executarQuery, executarComando, iniciarTransacao } from './database';

// ====================== FUNÇÕES AUXILIARES ======================

// Função para obter data/hora local no formato ISO
const obterDataHoraLocal = () => {
  const agora = new Date();
  // Criar string ISO com horário local real
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');
  const segundos = String(agora.getSeconds()).padStart(2, '0');
  const milissegundos = String(agora.getMilliseconds()).padStart(3, '0');
  
  // Retornar no formato ISO mas com horário local
  const dataHoraLocal = `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}.${milissegundos}`;
  console.log(`🕒 Data/hora local gerada: ${dataHoraLocal} (Horas: ${horas}, Minutos: ${minutos})`);
  return dataHoraLocal;
};

// Função para obter apenas a data local no formato YYYY-MM-DD
const obterDataLocal = () => {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

// ====================== FUNÇÕES DO DIÁRIO ======================

export const salvarEntradaDiario = async (entrada) => {
  try {
    const resultado = await executarComando(
      'INSERT INTO diario (titulo, conteudo, data, dataCriacao) VALUES (?, ?, ?, ?)',
      [entrada.titulo, entrada.conteudo, entrada.data || obterDataLocal(), obterDataHoraLocal()]
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

// Função para excluir transação sem atualizar histórico (para fechamento de mês)
export const excluirTransacaoSemAtualizarHistorico = async (id) => {
  try {
    const resultado = await executarComando('DELETE FROM financas WHERE id = ?', [id]);
    return resultado.changes > 0;
  } catch (error) {
    console.error('Erro ao excluir transação financeira:', error);
    return false;
  }
};

// Função para limpar transações e forçar atualização do histórico (apenas para meses NÃO fechados)
export const limparTransacoesEAtualizarHistorico = async (ano, mes) => {
  try {
    console.log(`🧹 Limpando transações e forçando atualização para ${mes}/${ano}...`);
    await forcarAtualizacaoHistorico(ano, mes);
    return true;
  } catch (error) {
    console.error('Erro ao limpar e atualizar histórico:', error);
    return false;
  }
};

// Função para atualizar histórico mensal
const atualizarHistoricoMensal = async (ano, mes) => {
  try {
    console.log(`Atualizando histórico para ${mes}/${ano}...`);
    
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
    
    console.log(`Totais calculados - Receitas: ${totalReceitas}, Despesas: ${totalDespesas}, Saldo: ${saldo}`);
    
    // Inserir ou atualizar histórico
    const resultado = await executarComando(
      `INSERT OR REPLACE INTO financas_historico 
       (ano, mes, totalReceitas, totalDespesas, saldo, dataCriacao, dataModificacao) 
       VALUES (?, ?, ?, ?, ?, COALESCE((SELECT dataCriacao FROM financas_historico WHERE ano = ? AND mes = ?), ?), ?)`,
      [ano, mes, totalReceitas, totalDespesas, saldo, ano, mes, new Date().toISOString(), new Date().toISOString()]
    );
    
    console.log(`Histórico atualizado. Resultado:`, resultado);
  } catch (error) {
    console.error('Erro ao atualizar histórico mensal:', error);
  }
};

// Função para forçar recálculo do histórico (usada apenas quando necessário)
const forcarAtualizacaoHistorico = async (ano, mes) => {
  try {
    console.log(`🔄 FORÇANDO atualização do histórico para ${mes}/${ano}...`);
    
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
    
    console.log(`Totais FORÇADOS - Receitas: ${totalReceitas}, Despesas: ${totalDespesas}, Saldo: ${saldo}`);
    
    // Forçar atualização
    const resultado = await executarComando(
      `INSERT OR REPLACE INTO financas_historico 
       (ano, mes, totalReceitas, totalDespesas, saldo, dataCriacao, dataModificacao) 
       VALUES (?, ?, ?, ?, ?, COALESCE((SELECT dataCriacao FROM financas_historico WHERE ano = ? AND mes = ?), ?), ?)`,
      [ano, mes, totalReceitas, totalDespesas, saldo, ano, mes, new Date().toISOString(), new Date().toISOString()]
    );
    
    console.log(`🔄 Histórico FORÇADO. Resultado:`, resultado);
  } catch (error) {
    console.error('Erro ao forçar atualização do histórico:', error);
  }
};

export const carregarHistoricoFinanceiro = async () => {
  try {
    const historico = await executarQuery(
      'SELECT * FROM financas_historico ORDER BY ano DESC, mes DESC'
    );
    
    console.log('Histórico bruto do banco:', historico);
    
    const mesesNomes = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const historicoFormatado = historico
      // Filtrar apenas registros que tenham dados válidos (incluir registros zerados)
      .filter(item => item && item.ano && item.mes)
      .map(item => ({
        ...item,
        ano: item.ano,
        mesNumerico: item.mes,
        mes: `${mesesNomes[item.mes - 1]} ${item.ano}`,
        totalReceitas: parseFloat(item.totalReceitas) || 0,
        totalDespesas: parseFloat(item.totalDespesas) || 0,
        saldo: parseFloat(item.saldo) || 0
      }));
    
    console.log('Histórico formatado e filtrado:', historicoFormatado);
    
    return historicoFormatado;
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

// Função para preservar histórico do mês antes de limpeza
export const preservarHistoricoMensal = async (ano, mes, totaisCalculados = null) => {
  try {
    console.log(`📅 Preservando histórico para ${mes}/${ano}...`);
    
    // Verificar se já existe um registro para este mês/ano
    const registroExistente = await executarQuery(
      'SELECT * FROM financas_historico WHERE ano = ? AND mes = ?',
      [ano, mes]
    );
    
    if (registroExistente.length > 0) {
      console.log(`⚠️ Já existe histórico para ${mes}/${ano} - NÃO sobrescrevendo`);
      console.log(`Registro existente:`, registroExistente[0]);
      return false; // Não permitir sobrescrever
    }
    
    // Se foram passados totais pré-calculados, usar eles SEMPRE (prioridade máxima)
    let totalReceitas, totalDespesas, saldo;
    
    if (totaisCalculados) {
      totalReceitas = totaisCalculados.totalReceitas;
      totalDespesas = totaisCalculados.totalDespesas;
      saldo = totaisCalculados.saldo;
      console.log(`💰 Usando totais pré-calculados - Receitas: ${totalReceitas}, Despesas: ${totalDespesas}, Saldo: ${saldo}`);
    } else {
      // Verificar se há transações para o mês
      const transacoes = await executarQuery(
        'SELECT * FROM financas WHERE strftime("%Y", data) = ? AND strftime("%m", data) = ?',
        [ano.toString(), mes.toString().padStart(2, '0')]
      );
      
      console.log(`Encontradas ${transacoes.length} transações para preservar`);
      
      // Calcular totais das transações existentes
      const receitas = await executarQuery(
        'SELECT COALESCE(SUM(valor), 0) as total FROM financas WHERE tipo = "receita" AND strftime("%Y", data) = ? AND strftime("%m", data) = ?',
        [ano.toString(), mes.toString().padStart(2, '0')]
      );
      
      const despesas = await executarQuery(
        'SELECT COALESCE(SUM(valor), 0) as total FROM financas WHERE tipo = "despesa" AND strftime("%Y", data) = ? AND strftime("%m", data) = ?',
        [ano.toString(), mes.toString().padStart(2, '0')]
      );
      
      totalReceitas = parseFloat(receitas[0].total) || 0;
      totalDespesas = parseFloat(despesas[0].total) || 0;
      saldo = totalReceitas - totalDespesas;
      console.log(`💰 Totais calculados no banco - Receitas: ${totalReceitas}, Despesas: ${totalDespesas}, Saldo: ${saldo}`);
    }
    
    // Salvar histórico APENAS como novo registro (INSERT sem REPLACE)
    const resultado = await executarComando(
      `INSERT INTO financas_historico 
       (ano, mes, totalReceitas, totalDespesas, saldo, dataCriacao, dataModificacao) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ano, mes, totalReceitas, totalDespesas, saldo, new Date().toISOString(), new Date().toISOString()]
    );
    
    // Verificar se foi salvo corretamente
    const historicoSalvo = await executarQuery(
      'SELECT * FROM financas_historico WHERE ano = ? AND mes = ?',
      [ano, mes]
    );
    
    console.log(`✅ NOVO histórico criado para ${mes}/${ano}:`, historicoSalvo);
    console.log(`✅ Resultado da inserção:`, resultado);
    
    return true;
  } catch (error) {
    console.error('Erro ao preservar histórico mensal:', error);
    return false;
  }
};

// Função para excluir registro específico do histórico
export const excluirRegistroHistorico = async (ano, mes) => {
  try {
    console.log(`Tentando excluir histórico para ano: ${ano}, mes: ${mes}`);
    console.log(`Tipos dos parâmetros - ano: ${typeof ano}, mes: ${typeof mes}`);
    
    // Verificar se o registro existe antes de excluir
    const registroExistente = await executarQuery(
      'SELECT * FROM financas_historico WHERE ano = ? AND mes = ?',
      [ano, mes]
    );
    
    console.log(`Registro encontrado para exclusão:`, registroExistente);
    
    if (registroExistente.length === 0) {
      console.log('Nenhum registro encontrado para exclusão');
      return false;
    }
    
    const resultado = await executarComando(
      'DELETE FROM financas_historico WHERE ano = ? AND mes = ?',
      [ano, mes]
    );
    
    console.log(`Resultado da exclusão:`, resultado);
    console.log(`Registros afetados: ${resultado.changes}`);
    
    return resultado.changes > 0;
  } catch (error) {
    console.error('Erro ao excluir registro do histórico:', error);
    return false;
  }
};

// Função para limpar todo o histórico
export const limparTodoHistoricoFinanceiro = async () => {
  try {
    const resultado = await executarComando('DELETE FROM financas_historico');
    return resultado.changes > 0;
  } catch (error) {
    console.error('Erro ao limpar histórico financeiro:', error);
    return false;
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

// ====================== FUNÇÕES DO COFRE ======================

// Inicializar cofre se não existir
export const inicializarCofre = async () => {
  try {
    const cofres = await executarQuery('SELECT * FROM cofre LIMIT 1');
    
    if (cofres.length === 0) {
      await executarComando(
        'INSERT INTO cofre (saldoTotal, dataCriacao) VALUES (?, ?)',
        [0, obterDataHoraLocal()]
      );
      console.log('Cofre inicializado com saldo zero');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao inicializar cofre:', error);
    return false;
  }
};

// Obter saldo atual do cofre
export const obterSaldoCofre = async () => {
  try {
    await inicializarCofre(); // Garantir que o cofre existe
    
    const resultado = await executarQuery('SELECT saldoTotal FROM cofre LIMIT 1');
    
    if (resultado.length > 0) {
      return parseFloat(resultado[0].saldoTotal);
    }
    
    return 0;
  } catch (error) {
    console.error('Erro ao obter saldo do cofre:', error);
    return 0;
  }
};

// Adicionar valor ao cofre (depósito)
export const depositarNoCofre = async (valor, descricao = '') => {
  try {
    if (valor <= 0) {
      console.error('Valor deve ser positivo para depósito');
      return false;
    }

    const saldoAtual = await obterSaldoCofre();
    const novoSaldo = saldoAtual + valor;
    
    await iniciarTransacao(async () => {
      // Atualizar saldo do cofre
      await executarComando(
        'UPDATE cofre SET saldoTotal = ?, dataModificacao = ? WHERE id = (SELECT id FROM cofre LIMIT 1)',
        [novoSaldo, obterDataHoraLocal()]
      );
      
      // Registrar no histórico
      await executarComando(
        'INSERT INTO cofre_historico (tipo, valor, descricao, saldoAnterior, saldoNovo, dataCriacao) VALUES (?, ?, ?, ?, ?, ?)',
        ['deposito', valor, descricao, saldoAtual, novoSaldo, obterDataHoraLocal()]
      );
    });
    
    console.log(`Depósito realizado: +${valor}. Saldo: ${saldoAtual} → ${novoSaldo}`);
    return true;
  } catch (error) {
    console.error('Erro ao depositar no cofre:', error);
    return false;
  }
};

// Retirar valor do cofre
export const retirarDoCofre = async (valor, descricao = '') => {
  try {
    if (valor <= 0) {
      console.error('Valor deve ser positivo para retirada');
      return false;
    }

    const saldoAtual = await obterSaldoCofre();
    
    if (saldoAtual < valor) {
      console.error('Saldo insuficiente no cofre');
      return false;
    }
    
    const novoSaldo = saldoAtual - valor;
    
    await iniciarTransacao(async () => {
      // Atualizar saldo do cofre
      await executarComando(
        'UPDATE cofre SET saldoTotal = ?, dataModificacao = ? WHERE id = (SELECT id FROM cofre LIMIT 1)',
        [novoSaldo, obterDataHoraLocal()]
      );
      
      // Registrar no histórico
      await executarComando(
        'INSERT INTO cofre_historico (tipo, valor, descricao, saldoAnterior, saldoNovo, dataCriacao) VALUES (?, ?, ?, ?, ?, ?)',
        ['retirada', valor, descricao, saldoAtual, novoSaldo, obterDataHoraLocal()]
      );
    });
    
    console.log(`Retirada realizada: -${valor}. Saldo: ${saldoAtual} → ${novoSaldo}`);
    return true;
  } catch (error) {
    console.error('Erro ao retirar do cofre:', error);
    return false;
  }
};

// Carregar histórico de movimentações do cofre
export const carregarHistoricoCofre = async (limite = 50) => {
  try {
    const historico = await executarQuery(
      'SELECT * FROM cofre_historico ORDER BY dataCriacao DESC LIMIT ?',
      [limite]
    );
    
    return historico.map(item => ({
      ...item,
      id: item.id.toString(),
      valor: parseFloat(item.valor),
      saldoAnterior: parseFloat(item.saldoAnterior),
      saldoNovo: parseFloat(item.saldoNovo)
    }));
  } catch (error) {
    console.error('Erro ao carregar histórico do cofre:', error);
    return [];
  }
};

// Limpar histórico do cofre (manter apenas saldo atual)
export const limparHistoricoCofre = async () => {
  try {
    const resultado = await executarComando('DELETE FROM cofre_historico');
    console.log(`${resultado.changes} registros de histórico do cofre foram excluídos`);
    return resultado.changes > 0;
  } catch (error) {
    console.error('Erro ao limpar histórico do cofre:', error);
    return false;
  }
};

// ====================== FUNÇÕES DE OBJETIVOS FINANCEIROS ======================

// Salvar ou atualizar objetivo financeiro
export const salvarObjetivoFinanceiro = async (valorObjetivo, descricao = '') => {
  try {
    if (valorObjetivo <= 0) {
      console.error('Valor do objetivo deve ser positivo');
      return false;
    }

    await iniciarTransacao(async () => {
      // Verificar se já existe um objetivo
      const objetivos = await executarQuery('SELECT * FROM cofre_objetivo LIMIT 1');
      
      if (objetivos.length > 0) {
        // Atualizar objetivo existente
        await executarComando(
          'UPDATE cofre_objetivo SET valorObjetivo = ?, descricao = ?, dataModificacao = ? WHERE id = ?',
          [valorObjetivo, descricao, obterDataHoraLocal(), objetivos[0].id]
        );
      } else {
        // Criar novo objetivo
        await executarComando(
          'INSERT INTO cofre_objetivo (valorObjetivo, descricao, dataCriacao) VALUES (?, ?, ?)',
          [valorObjetivo, descricao, obterDataHoraLocal()]
        );
      }
    });
    
    console.log(`Objetivo financeiro salvo: ${valorObjetivo}`);
    return true;
  } catch (error) {
    console.error('Erro ao salvar objetivo financeiro:', error);
    return false;
  }
};

// Obter objetivo financeiro atual
export const obterObjetivoFinanceiro = async () => {
  try {
    const resultado = await executarQuery('SELECT * FROM cofre_objetivo LIMIT 1');
    
    if (resultado.length > 0) {
      return {
        ...resultado[0],
        id: resultado[0].id.toString(),
        valorObjetivo: parseFloat(resultado[0].valorObjetivo)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao obter objetivo financeiro:', error);
    return null;
  }
};

// Excluir objetivo financeiro
export const excluirObjetivoFinanceiro = async () => {
  try {
    const resultado = await executarComando('DELETE FROM cofre_objetivo');
    console.log('Objetivo financeiro excluído');
    return resultado.changes > 0;
  } catch (error) {
    console.error('Erro ao excluir objetivo financeiro:', error);
    return false;
  }
};

// Calcular progresso do objetivo
export const calcularProgressoObjetivo = async () => {
  try {
    const objetivo = await obterObjetivoFinanceiro();
    if (!objetivo) {
      return null;
    }
    
    const saldoAtual = await obterSaldoCofre();
    const progresso = Math.min((saldoAtual / objetivo.valorObjetivo) * 100, 100);
    
    return {
      objetivo,
      saldoAtual,
      progresso: parseFloat(progresso.toFixed(2)),
      valorRestante: Math.max(objetivo.valorObjetivo - saldoAtual, 0),
      objetivoAlcancado: saldoAtual >= objetivo.valorObjetivo
    };
  } catch (error) {
    console.error('Erro ao calcular progresso do objetivo:', error);
    return null;
  }
};

// ====================== FUNÇÕES DE SENHA DO COFRE ======================

// Verificar se já existe senha cadastrada
export const verificarSenhaCofre = async () => {
  try {
    const resultado = await executarQuery('SELECT * FROM cofre_senha LIMIT 1');
    return resultado.length > 0;
  } catch (error) {
    console.error('Erro ao verificar senha do cofre:', error);
    return false;
  }
};

// Salvar nova senha do cofre (apenas na primeira vez)
export const salvarSenhaCofre = async (senha) => {
  try {
    if (senha.length !== 4 || !/^\d+$/.test(senha)) {
      console.error('Senha deve ter exatamente 4 dígitos');
      return false;
    }

    // Verificar se já existe senha
    const jaExiste = await verificarSenhaCofre();
    if (jaExiste) {
      console.error('Já existe uma senha cadastrada');
      return false;
    }

    await executarComando(
      'INSERT INTO cofre_senha (senha, dataCriacao) VALUES (?, ?)',
      [senha, obterDataHoraLocal()]
    );
    
    console.log('Senha do cofre cadastrada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao salvar senha do cofre:', error);
    return false;
  }
};

// Validar senha do cofre
export const validarSenhaCofre = async (senha) => {
  try {
    if (senha.length !== 4 || !/^\d+$/.test(senha)) {
      return false;
    }

    const resultado = await executarQuery('SELECT senha FROM cofre_senha LIMIT 1');
    
    if (resultado.length === 0) {
      console.error('Nenhuma senha cadastrada');
      return false;
    }
    
    return resultado[0].senha === senha;
  } catch (error) {
    console.error('Erro ao validar senha do cofre:', error);
    return false;
  }
};

// Alterar senha do cofre (funcionalidade futura, se necessário)
export const alterarSenhaCofre = async (senhaAtual, novaSenha) => {
  try {
    if (novaSenha.length !== 4 || !/^\d+$/.test(novaSenha)) {
      console.error('Nova senha deve ter exatamente 4 dígitos');
      return false;
    }

    // Validar senha atual
    const senhaValida = await validarSenhaCofre(senhaAtual);
    if (!senhaValida) {
      console.error('Senha atual incorreta');
      return false;
    }

    await executarComando(
      'UPDATE cofre_senha SET senha = ?, dataModificacao = ? WHERE id = (SELECT id FROM cofre_senha LIMIT 1)',
      [novaSenha, obterDataHoraLocal()]
    );
    
    console.log('Senha do cofre alterada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao alterar senha do cofre:', error);
    return false;
  }
};

// ====================== FUNÇÕES DE CONFIGURAÇÕES ======================

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
      await executarComando('DELETE FROM configuracoes_app');
    });
    
    console.log('Todos os dados foram limpos');
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return false;
  }
};

