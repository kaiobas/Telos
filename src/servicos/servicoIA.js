const API_KEY = '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';
const API_URL = 'https://api.openai.com/v1/chat/completions';

import { 
  salvarEntradaDiario, 
  salvarTransacaoFinanceira,
  carregarEntradasDiario,
  carregarTransacoesFinanceiras,
  salvarEventoCalendario,
  carregarEventosCalendario,
  obterEventosPorData
} from '../armazenamento/armazenamentoSQLite';

class ServicoIA {
  constructor() {
    this.sistemPrompt = `Você é um assistente pessoal chamado Telos, feito para ajudar o Kaio. Seu papel é apoiar a produtividade, organização, foco e desenvolvimento pessoal de forma prática e direta.

Sobre o Kaio:
- Ele é um desenvolvedor criativo, autodidata, que busca sempre evoluir suas habilidades técnicas e pessoais.
- É detalhista, gosta de clareza, estrutura e respostas com organização visual simples (tabelas, listas ou passos).
- É impaciente com enrolação ou explicações vagas — prefere o direto ao ponto.
- Está construindo um aplicativo pessoal que envolve calendário, diário, Carteira e uma IA integrada. Ele valoriza interfaces bonitas, limpas e funcionais.
- Tem uma planilha financeira onde acompanha seus gastos e metas (como economizar R$275 por mês).
- Trabalha em um projeto chamado SóDiárias e também com YOLOv8 em contagem de objetos — é técnico, mas gosta de ideias bem aplicadas ao mundo real.
- Ele luta contra ansiedade, procrastinação e distrações, mas está constantemente buscando estratégias e hábitos para melhorar foco, controle emocional e disciplina.
- Gosta de ser desafiado, desde que as sugestões venham com lógica e propósito.
- Valoriza o apoio da namorada, que o incentiva em tudo que ele faz.

Modo de resposta ideal:
- Estruturado, simples, claro e visual (quando possível).
- Com linguagem informal e próxima, mas respeitosa.
- Prático: traga sugestões que ele possa aplicar agora.
- Quando algo for técnico, use termos precisos, mas traduza de forma simples se necessário.
- Quando ele estiver confuso ou sem foco, ajude com direção, sem julgamentos.

Sempre pense como um aliado que conhece o Kaio e quer ver ele no topo. Seu objetivo é torná-lo mais produtivo, tranquilo e no controle da própria vida.

=== FUNCIONALIDADES TÉCNICAS ===

Você tem acesso às seguintes funcionalidades do aplicativo:

1. **DIÁRIO**: Você pode criar entradas no diário do Kaio
2. **CARTEIRA**: Você pode registrar transações financeiras (receitas e despesas)
3. **CALENDÁRIO**: Você pode adicionar eventos e compromissos em datas específicas
4. **CONSULTAS**: Você pode acessar dados existentes para fornecer insights

**IMPORTANTE**: Você NUNCA pode excluir ou remover dados existentes, apenas adicionar novos.

Quando o Kaio pedir para:
- Escrever algo no diário, registrar uma memória, anotar ideias, reflexões: use addDiaryEntry
- Registrar gastos, receitas, compras, transações financeiras: use addFinancialTransaction
- Adicionar eventos, compromissos, lembretes em datas específicas: use addCalendarEvent
- Ver resumo financeiro, consultar saldo, verificar gastos: use getFinancialSummary
- Consultar entradas do diário, ver últimas anotações: use getDiaryEntries
- Ver eventos de uma data específica: use getCalendarEvents

**Categorias financeiras disponíveis:**
- Receitas: Salário, Freelance, Investimentos, Vendas, Outros
- Despesas: Alimentação, Transporte, Moradia, Saúde, Entretenimento, Educação, Compras, Outros

**Lembre-se da meta dele**: economizar R$275 por mês. Sempre que relevante, conecte as transações com essa meta.

Sempre confirme com o Kaio antes de adicionar dados e seja conversacional, direto e útil.`;

    this.tools = [
      {
        type: "function",
        function: {
          name: "addDiaryEntry",
          description: "Adiciona uma nova entrada no diário do usuário",
          parameters: {
            type: "object",
            properties: {
              titulo: {
                type: "string",
                description: "Título da entrada do diário"
              },
              conteudo: {
                type: "string",
                description: "Conteúdo da entrada do diário"
              }
            },
            required: ["titulo", "conteudo"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "addFinancialTransaction",
          description: "Adiciona uma nova transação financeira",
          parameters: {
            type: "object",
            properties: {
              descricao: {
                type: "string",
                description: "Descrição da transação"
              },
              valor: {
                type: "number",
                description: "Valor da transação (sempre positivo)"
              },
              tipo: {
                type: "string",
                enum: ["receita", "despesa"],
                description: "Tipo da transação"
              },
              categoria: {
                type: "string",
                enum: ["Salário", "Freelance", "Investimentos", "Vendas", "Outros", "Alimentação", "Transporte", "Moradia", "Saúde", "Entretenimento", "Educação", "Compras"],
                description: "Categoria da transação"
              }
            },
            required: ["descricao", "valor", "tipo", "categoria"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getDiaryEntries",
          description: "Busca entradas recentes do diário para contexto",
          parameters: {
            type: "object",
            properties: {
              limite: {
                type: "number",
                description: "Número máximo de entradas para retornar (padrão: 5)"
              }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getFinancialSummary",
          description: "Obtém resumo financeiro atual",
          parameters: {
            type: "object",
            properties: {}
          }
        }
      },
      {
        type: "function",
        function: {
          name: "addCalendarEvent",
          description: "Adiciona um evento no calendário para uma data específica",
          parameters: {
            type: "object",
            properties: {
              date: {
                type: "string",
                description: "Data do evento no formato YYYY-MM-DD (ex: 2024-01-15)"
              },
              title: {
                type: "string",
                description: "Título do evento"
              },
              description: {
                type: "string",
                description: "Descrição opcional do evento"
              }
            },
            required: ["date", "title"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getCalendarEvents",
          description: "Busca eventos do calendário para uma data específica",
          parameters: {
            type: "object",
            properties: {
              date: {
                type: "string",
                description: "Data para buscar eventos no formato YYYY-MM-DD (ex: 2024-01-15)"
              }
            },
            required: ["date"]
          }
        }
      }
    ];
  }

  async enviarMensagem(mensagem, conversaHistorico = []) {
    try {
      const mensagens = [
        {
          role: "system",
          content: this.sistemPrompt
        },
        ...conversaHistorico.map(item => ({
          role: item.tipo === 'usuario' ? 'user' : 'assistant',
          content: item.texto
        })),
        {
          role: "user",
          content: mensagem
        }
      ];

      const response = await this.chamarAPIComRetry({
        model: 'gpt-4o',
        messages: mensagens,
        tools: this.tools,
        tool_choice: "auto",
        temperature: 0.7,
        max_tokens: 800 // Reduzindo tokens para economizar
      });

      const data = await response.json();
      const resposta = data.choices[0].message;

      // Verificar se a IA quer usar alguma ferramenta
      if (resposta.tool_calls && resposta.tool_calls.length > 0) {
        const resultados = await this.executarFerramentas(resposta.tool_calls);
        
        // Enviar resposta com resultados das ferramentas de volta para a IA
        const mensagemComResultados = [
          ...mensagens,
          {
            role: "assistant",
            content: resposta.content,
            tool_calls: resposta.tool_calls
          },
          ...resultados.map(resultado => ({
            role: "tool",
            tool_call_id: resultado.call_id,
            content: JSON.stringify(resultado.result)
          }))
        ];

        const responseComResultados = await this.chamarAPIComRetry({
          model: 'gpt-4o-mini',
          messages: mensagemComResultados,
          temperature: 0.7,
          max_tokens: 600
        });

        const dataComResultados = await responseComResultados.json();
        return {
          resposta: dataComResultados.choices[0].message.content,
          acoes: resultados
        };
      }

      return {
        resposta: resposta.content || "Desculpe, não consegui processar sua mensagem.",
        acoes: []
      };

    } catch (error) {
      console.error('Erro no serviço de IA:', error);
      
      // Mensagens de erro mais específicas
      if (error.message.includes('429')) {
        throw new Error('Muitas solicitações. Aguarde alguns segundos e tente novamente.');
      } else if (error.message.includes('401')) {
        throw new Error('Erro de autenticação. Verifique a chave da API.');
      } else if (error.message.includes('500')) {
        throw new Error('Erro no servidor da OpenAI. Tente novamente em instantes.');
      } else {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      }
    }
  }

  async chamarAPIComRetry(body, tentativas = 3) {
    for (let i = 0; i < tentativas; i++) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          return response;
        }

        // Se for erro 429 (rate limit), aguarda antes de tentar novamente
        if (response.status === 429) {
          const aguardar = Math.pow(2, i) * 1000; // Backoff exponencial: 1s, 2s, 4s
          console.log(`Rate limit atingido. Aguardando ${aguardar/1000}s antes da próxima tentativa...`);
          await new Promise(resolve => setTimeout(resolve, aguardar));
          continue;
        }

        // Para outros erros, não tenta novamente
        throw new Error(`Erro da API: ${response.status}`);

      } catch (error) {
        if (i === tentativas - 1) {
          throw error;
        }
        
        // Aguarda 1 segundo entre tentativas para erros de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  async executarFerramentas(toolCalls) {
    const resultados = [];

    for (const toolCall of toolCalls) {
      const { name, arguments: args } = toolCall.function;
      const parametros = JSON.parse(args);

      try {
        let resultado;

        switch (name) {
          case 'addDiaryEntry':
            resultado = await this.adicionarEntradaDiario(parametros);
            break;
          case 'addFinancialTransaction':
            resultado = await this.adicionarTransacaoFinanceira(parametros);
            break;
          case 'getDiaryEntries':
            resultado = await this.obterEntradasDiario(parametros.limite || 5);
            break;
          case 'getFinancialSummary':
            resultado = await this.obterResumoFinanceiro();
            break;
          case 'addCalendarEvent':
            resultado = await this.adicionarEventoCalendario(parametros);
            break;
          case 'getCalendarEvents':
            resultado = await this.obterEventosCalendario(parametros.date);
            break;
          default:
            resultado = { erro: 'Função não encontrada' };
        }

        resultados.push({
          call_id: toolCall.id,
          function_name: name,
          result: resultado
        });

      } catch (error) {
        resultados.push({
          call_id: toolCall.id,
          function_name: name,
          result: { erro: error.message }
        });
      }
    }

    return resultados;
  }

  async adicionarEntradaDiario({ titulo, conteudo }) {
    try {
      const sucesso = await salvarEntradaDiario({ titulo, conteudo });
      if (sucesso) {
        return { sucesso: true, mensagem: 'Entrada adicionada ao diário com sucesso!' };
      } else {
        return { sucesso: false, mensagem: 'Erro ao salvar entrada no diário' };
      }
    } catch (error) {
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  async adicionarTransacaoFinanceira({ descricao, valor, tipo, categoria }) {
    try {
      const sucesso = await salvarTransacaoFinanceira({ 
        descricao, 
        valor: Math.abs(valor), // Garantir que o valor seja positivo
        tipo, 
        categoria 
      });
      if (sucesso) {
        return { sucesso: true, mensagem: 'Transação financeira registrada com sucesso!' };
      } else {
        return { sucesso: false, mensagem: 'Erro ao salvar transação financeira' };
      }
    } catch (error) {
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  async obterEntradasDiario(limite = 5) {
    try {
      const entradas = await carregarEntradasDiario();
      const entradasRecentes = entradas.slice(0, limite).map(entrada => ({
        titulo: entrada.titulo,
        conteudo: entrada.conteudo.substring(0, 200) + (entrada.conteudo.length > 200 ? '...' : ''),
        data: entrada.data
      }));
      return { entradas: entradasRecentes };
    } catch (error) {
      return { erro: error.message };
    }
  }

  async obterResumoFinanceiro() {
    try {
      const transacoes = await carregarTransacoesFinanceiras();
      
      const totalReceitas = transacoes
        .filter(t => t.tipo === 'receita')
        .reduce((total, t) => total + t.valor, 0);

      const totalDespesas = transacoes
        .filter(t => t.tipo === 'despesa')
        .reduce((total, t) => total + t.valor, 0);

      const saldo = totalReceitas - totalDespesas;

      return {
        totalReceitas,
        totalDespesas,
        saldo,
        quantidadeTransacoes: transacoes.length
      };
    } catch (error) {
      return { erro: error.message };
    }
  }

  async adicionarEventoCalendario({ date, title, description = '' }) {
    try {
      const evento = {
        id: Date.now().toString(),
        titulo: title,
        descricao: description,
        data: date
      };

      const sucesso = await salvarEventoCalendario(date, evento);
      if (sucesso) {
        return { sucesso: true, mensagem: `Evento "${title}" adicionado para ${date}!` };
      } else {
        return { sucesso: false, mensagem: 'Erro ao salvar evento no calendário' };
      }
    } catch (error) {
      return { sucesso: false, mensagem: `Erro: ${error.message}` };
    }
  }

  async obterEventosCalendario(date) {
    try {
      const eventos = await obterEventosPorData(date);
      return { 
        data: date,
        eventos: eventos.map(evento => ({
          titulo: evento.titulo,
          descricao: evento.descricao,
          id: evento.id
        }))
      };
    } catch (error) {
      return { erro: error.message };
    }
  }
}

export default new ServicoIA();
