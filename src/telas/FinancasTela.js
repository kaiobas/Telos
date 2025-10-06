import React, { useState, useEffect } from 'react';
import financasEstilos from '../estilos/financasEstilos';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';
import estilosGlobais from '../estilos/estilosGlobais';
import Header from '../componentes/Header';
import { 
  salvarTransacaoFinanceira, 
  carregarTransacoesFinanceiras, 
  excluirTransacaoFinanceira,
  excluirTransacaoSemAtualizarHistorico,
  limparTransacoesEAtualizarHistorico,
  carregarHistoricoFinanceiro,
  preservarHistoricoMensal,
  excluirRegistroHistorico as excluirRegistroHistoricoSQLite,
  limparTodoHistoricoFinanceiro,
  verificarSenhaCofre,
  salvarSenhaCofre,
  validarSenhaCofre
} from '../armazenamento/armazenamentoSQLite';
import SenhaModal from '../componentes/SenhaModal';
import { useDatabaseContext } from '../contextos/DatabaseContext';

const FinancasTela = ({ navigation }) => {
  const { bancoInicializado } = useDatabaseContext();
  const [transacoes, setTransacoes] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalHistoricoVisivel, setModalHistoricoVisivel] = useState(false);
  const [modalSeletorMesVisivel, setModalSeletorMesVisivel] = useState(false);
  const [modalCalculadoraVisivel, setModalCalculadoraVisivel] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('receita'); // 'receita' ou 'despesa'
  const [categoria, setCategoria] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [historicoMeses, setHistoricoMeses] = useState([]);
  
  // Estados do modal de senha
  const [modalSenhaVisivel, setModalSenhaVisivel] = useState(false);
  const [isFirstTimePassword, setIsFirstTimePassword] = useState(false);
  
  // Estados da calculadora
  const [displayCalculadora, setDisplayCalculadora] = useState('0');
  const [valorAnterior, setValorAnterior] = useState(null);
  const [operacao, setOperacao] = useState(null);
  const [aguardandoOperando, setAguardandoOperando] = useState(false);
  
  // Controle do mês/ano selecionado para transações
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  
  // Controle do filtro do histórico
  const [anoFiltroHistorico, setAnoFiltroHistorico] = useState(new Date().getFullYear());
  const [mesFiltroHistorico, setMesFiltroHistorico] = useState(new Date().getMonth() + 1);

  const categorias = {
    receita: ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros'],
    despesa: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Entretenimento', 'Educação', 'Compras', 'Outros']
  };

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  useEffect(() => {
    if (bancoInicializado) {
      // Aguardar um pouco para garantir que o banco está completamente pronto
      setTimeout(carregarDados, 500);
    }
  }, [bancoInicializado]);

  const carregarDados = async () => {
    if (!bancoInicializado) {
      console.log('Banco não inicializado, pulando carregamento');
      return;
    }
    
    try {
      setAtualizando(true);
      
      // Aguardar um pouco antes de fazer as consultas
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Carregar transações do mês/ano selecionado
      const todasTransacoes = await carregarTransacoesFinanceiras();
      console.log(`🔍 Filtrando transações para ${mesSelecionado}/${anoSelecionado}`);
      console.log(`📊 Total de transações encontradas: ${todasTransacoes.length}`);
      
      const transacoesDoMes = todasTransacoes.filter(transacao => {
        const dataTransacao = new Date(transacao.data + 'T12:00:00'); // Adicionar horário para evitar problemas de fuso
        const anoTransacao = dataTransacao.getFullYear();
        const mesTransacao = dataTransacao.getMonth() + 1; // getMonth() retorna 0-11, então +1
        
        console.log(`📅 Transação: ${transacao.data} -> Ano: ${anoTransacao}, Mês: ${mesTransacao}`);
        
        return anoTransacao === anoSelecionado && mesTransacao === mesSelecionado;
      });
      
      console.log(`✅ Transações filtradas para ${mesSelecionado}/${anoSelecionado}: ${transacoesDoMes.length}`);
      
      const historicoCarregado = await carregarHistoricoFinanceiro();
      
      setTransacoes(transacoesDoMes);
      setHistoricoMeses(historicoCarregado || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  };

  const adicionarTransacao = async () => {
    if (!descricao.trim()) {
      Alert.alert('Erro', 'Por favor, adicione uma descrição para a transação.');
      return;
    }

    if (!valor.trim() || isNaN(parseFloat(valor.replace(',', '.')))) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    if (!categoria) {
      Alert.alert('Erro', 'Por favor, selecione uma categoria.');
      return;
    }

    try {
      const valorNumerico = parseFloat(valor.replace(',', '.'));
      
      // Criar data para o mês/ano selecionado de forma mais explícita
      // Formato: YYYY-MM-DD (sempre dia 15 para evitar problemas de fuso horário)
      const mesFormatado = mesSelecionado.toString().padStart(2, '0');
      const dataFormatada = `${anoSelecionado}-${mesFormatado}-15`;
      
      console.log(`📅 Criando transação para: ${dataFormatada} (Mês selecionado: ${mesSelecionado})`);
      
      const novaTransacao = {
        descricao: descricao.trim(),
        valor: valorNumerico,
        tipo,
        categoria,
        data: dataFormatada
      };

      const sucesso = await salvarTransacaoFinanceira(novaTransacao);
      
      if (sucesso) {
        await carregarDados();
        limparCampos();
        setModalVisivel(false);
        Alert.alert('Sucesso', `Transação adicionada para ${nomesMeses[mesSelecionado - 1]} ${anoSelecionado}!`);
      } else {
        Alert.alert('Erro', 'Não foi possível salvar a transação.');
      }
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a transação.');
    }
  };

  const excluirTransacao = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta transação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const sucesso = await excluirTransacaoFinanceira(id);
              if (sucesso) {
                await carregarDados();
                Alert.alert('Sucesso', 'Transação excluída com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível excluir a transação.');
              }
            } catch (error) {
              console.error('Erro ao excluir transação:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir a transação.');
            }
          }
        }
      ]
    );
  };

  const limparCampos = () => {
    setDescricao('');
    setValor('');
    setTipo('receita');
    setCategoria('');
  };

  const limparTodasTransacoes = () => {
    Alert.alert(
      'Confirmar Limpeza',
      'Tem certeza que deseja excluir TODAS as transações? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar Tudo', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Excluir todas as transações uma por uma
              for (const transacao of transacoes) {
                await excluirTransacaoFinanceira(transacao.id);
              }
              await carregarDados();
              Alert.alert('Sucesso', 'Todas as transações foram excluídas!');
            } catch (error) {
              console.error('Erro ao limpar transações:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao limpar as transações.');
            }
          }
        }
      ]
    );
  };

  const salvarMesAtual = () => {
    if (transacoes.length === 0) {
      Alert.alert('Aviso', 'Não há transações para salvar no histórico mensal.');
      return;
    }

    Alert.alert(
      'Salvar Mês',
      `Deseja salvar as informações de ${nomesMeses[mesSelecionado - 1]} ${anoSelecionado} no histórico?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salvar', 
          style: 'default',
          onPress: async () => {
            try {
              const { totalReceitas, totalDespesas, saldo } = calcularResumo();
              
              console.log(`💾 Salvando histórico para ${mesSelecionado}/${anoSelecionado}`);
              console.log(`📊 Resumo - Receitas: ${totalReceitas}, Despesas: ${totalDespesas}, Saldo: ${saldo}`);
              
              // Salvar o histórico do mês selecionado
              const sucesso = await preservarHistoricoMensal(anoSelecionado, mesSelecionado, {
                totalReceitas,
                totalDespesas,
                saldo
              });
              
              if (sucesso) {
                await carregarDados();
                Alert.alert('Sucesso', `Histórico de ${nomesMeses[mesSelecionado - 1]} ${anoSelecionado} salvo! Saldo: ${formatarMoeda(saldo)}`);
              } else {
                Alert.alert('Aviso', 'Já existe um histórico salvo para este mês/ano.');
              }
            } catch (error) {
              console.error('Erro ao salvar mês:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao salvar o histórico.');
            }
          }
        }
      ]
    );
  };

  const excluirRegistroHistorico = (index) => {
    console.log('Tentando excluir registro no índice:', index);
    console.log('Array historicoMeses:', historicoMeses);
    console.log('Tamanho do array:', historicoMeses.length);
    
    const registroParaExcluir = historicoMeses[index];
    console.log('Registro encontrado:', registroParaExcluir);
    
    if (!registroParaExcluir) {
      console.log('Registro não encontrado no índice:', index);
      Alert.alert('Erro', 'Registro não encontrado.');
      return;
    }
    
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o registro do mês de ${registroParaExcluir.mes}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Excluindo registro:', registroParaExcluir.ano, registroParaExcluir.mesNumerico);
              
              // Excluir registro específico do histórico SQLite
              const sucesso = await excluirRegistroHistoricoSQLite(registroParaExcluir.ano, registroParaExcluir.mesNumerico);
              
              if (sucesso) {
                await carregarDados();
                Alert.alert('Sucesso', 'Registro do histórico excluído com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível excluir o registro do histórico.');
              }
            } catch (error) {
              console.error('Erro ao excluir registro do histórico:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir o registro do histórico.');
            }
          }
        }
      ]
    );
  };

  const limparTodoHistorico = () => {
    if (historicoMeses.length === 0) {
      Alert.alert('Aviso', 'Não há registros no histórico para excluir.');
      return;
    }

    Alert.alert(
      'Confirmar Limpeza Total',
      `Tem certeza que deseja excluir TODO o histórico mensal? Serão excluídos ${historicoMeses.length} registro(s). Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar Tudo', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Limpar todo o histórico financeiro do SQLite
              const sucesso = await limparTodoHistoricoFinanceiro();
              
              if (sucesso) {
                await carregarDados();
                Alert.alert('Sucesso', 'Todo o histórico foi limpo com sucesso!');
              } else {
                Alert.alert('Aviso', 'Nenhum registro foi encontrado para limpar.');
              }
            } catch (error) {
              console.error('Erro ao limpar histórico:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao limpar o histórico.');
            }
          }
        }
      ]
    );
  };

  const calcularResumo = () => {
    const totalReceitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((total, t) => total + t.valor, 0);

    const totalDespesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((total, t) => total + t.valor, 0);

    const saldo = totalReceitas - totalDespesas;

    return { totalReceitas, totalDespesas, saldo };
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'Data não disponível';
    
    try {
      // Se é uma string ISO completa (com T), usar diretamente
      if (dataString.includes('T')) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Se é apenas data (YYYY-MM-DD), criar data local para evitar problemas de UTC
      if (dataString.length === 10) {
        const [ano, mes, dia] = dataString.split('-');
        const dataLocal = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        return dataLocal.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      
      // Fallback para outros formatos
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const obterIconeTransacao = (tipo, categoria) => {
    if (tipo === 'receita') {
      return 'trending-up';
    } else {
      switch (categoria) {
        case 'Alimentação': return 'restaurant';
        case 'Transporte': return 'car';
        case 'Moradia': return 'home';
        case 'Saúde': return 'medical';
        case 'Entretenimento': return 'game-controller';
        case 'Educação': return 'school';
        case 'Compras': return 'bag';
        default: return 'trending-down';
      }
    }
  };

  // ====================== FUNÇÕES DA CALCULADORA ======================

  const limparCalculadora = () => {
    setDisplayCalculadora('0');
    setValorAnterior(null);
    setOperacao(null);
    setAguardandoOperando(false);
  };

  const inserirNumero = (numero) => {
    if (aguardandoOperando) {
      setDisplayCalculadora(String(numero));
      setAguardandoOperando(false);
    } else {
      setDisplayCalculadora(displayCalculadora === '0' ? String(numero) : displayCalculadora + numero);
    }
  };

  const inserirDecimal = () => {
    if (aguardandoOperando) {
      setDisplayCalculadora('0,');
      setAguardandoOperando(false);
    } else if (displayCalculadora.indexOf(',') === -1) {
      setDisplayCalculadora(displayCalculadora + ',');
    }
  };

  const executarOperacao = (proximaOperacao) => {
    const inputValue = parseFloat(displayCalculadora.replace(',', '.'));

    if (valorAnterior === null) {
      setValorAnterior(inputValue);
    } else if (operacao) {
      const valorAtual = valorAnterior || 0;
      const novoValor = calcular(valorAtual, inputValue, operacao);

      setDisplayCalculadora(String(novoValor).replace('.', ','));
      setValorAnterior(novoValor);
    }

    setAguardandoOperando(true);
    setOperacao(proximaOperacao);
  };

  const calcular = (primeiroOperando, segundoOperando, operacao) => {
    switch (operacao) {
      case '+':
        return primeiroOperando + segundoOperando;
      case '-':
        return primeiroOperando - segundoOperando;
      case '*':
        return primeiroOperando * segundoOperando;
      case '/':
        return primeiroOperando / segundoOperando;
      case '=':
        return segundoOperando;
      default:
        return segundoOperando;
    }
  };

  const calcularResultado = () => {
    const inputValue = parseFloat(displayCalculadora.replace(',', '.'));

    if (valorAnterior !== null && operacao) {
      const novoValor = calcular(valorAnterior, inputValue, operacao);
      setDisplayCalculadora(String(novoValor).replace('.', ','));
      setValorAnterior(null);
      setOperacao(null);
      setAguardandoOperando(true);
    }
  };

  const usarResultadoCalculadora = () => {
    const resultado = parseFloat(displayCalculadora.replace(',', '.'));
    if (!isNaN(resultado) && resultado > 0) {
      setValor(resultado.toString().replace('.', ','));
      setModalCalculadoraVisivel(false);
      setModalVisivel(true);
    } else {
      Alert.alert('Erro', 'Por favor, calcule um valor válido primeiro.');
    }
  };

  // ====================== FUNÇÕES DO COFRE ======================

  const acessarCofre = async () => {
    try {
      const temSenha = await verificarSenhaCofre();
      
      if (temSenha) {
        // Já tem senha cadastrada, pedir para digitar
        setIsFirstTimePassword(false);
        setModalSenhaVisivel(true);
      } else {
        // Primeira vez, pedir para criar senha
        setIsFirstTimePassword(true);
        setModalSenhaVisivel(true);
      }
    } catch (error) {
      console.error('Erro ao verificar senha do cofre:', error);
      Alert.alert('Erro', 'Não foi possível acessar o cofre.');
    }
  };

  const handleSenhaSuccess = async (senha) => {
    try {
      if (isFirstTimePassword) {
        // Primeira vez - salvar a nova senha
        const sucesso = await salvarSenhaCofre(senha);
        if (sucesso) {
          setModalSenhaVisivel(false);
          Alert.alert('Sucesso', 'Senha do cofre criada com sucesso!', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Cofre')
            }
          ]);
        } else {
          Alert.alert('Erro', 'Não foi possível criar a senha.');
        }
      } else {
        // Validar senha existente
        const senhaValida = await validarSenhaCofre(senha);
        if (senhaValida) {
          setModalSenhaVisivel(false);
          navigation.navigate('Cofre');
        } else {
          Alert.alert('Erro', 'Senha incorreta. Tente novamente.');
          // Não fechar o modal, deixar tentar novamente
        }
      }
    } catch (error) {
      console.error('Erro ao processar senha:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao processar a senha.');
    }
  };

  const fecharModalSenha = () => {
    if (!isFirstTimePassword) {
      // Só permite fechar se não for primeira vez
      setModalSenhaVisivel(false);
    }
  };

  const { totalReceitas, totalDespesas, saldo } = calcularResumo();

return (
    <View style={estilosGlobais.container}>
        <Header />
        
        {/* Cabeçalho da Seção */}
        <View style={financasEstilos.cabecalho}>
            <View>
                <Text style={estilosGlobais.titulo}>Carteira</Text>
            </View>
            <View style={financasEstilos.botoesAcoes}>
                <TouchableOpacity
                    style={financasEstilos.botaoSecundario}
                    onPress={() => setModalHistoricoVisivel(true)}
                >
                    <Ionicons name="calendar-outline" size={20} color={cores.primaria} />
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={financasEstilos.botaoSecundario}
                    onPress={acessarCofre}
                >
                    <Ionicons name="lock-closed" size={20} color={'#ffd700'} />
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={financasEstilos.botaoSecundario}
                    onPress={salvarMesAtual}
                >
                    <Ionicons name="save-outline" size={20} color={cores.primaria} />
                </TouchableOpacity>
                
                {transacoes.length > 0 && (
                    <TouchableOpacity
                        style={financasEstilos.botaoLimparTudo}
                        onPress={limparTodasTransacoes}
                    >
                        <Ionicons name="trash-outline" size={20} color={'#ff4444'} />
                     </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={financasEstilos.botaoAdicionar}
                    onPress={() => setModalVisivel(true)}
                >
                    <Ionicons name="add" size={24} color={cores.fundo} />
                </TouchableOpacity>
            </View>
        </View>
        
        {/* Seletor de Mês/Ano para Transações */}
        <View style={financasEstilos.seletorContainer}>
          <Text style={financasEstilos.tituloSecao}>Mês/Ano das Transações</Text>
          <TouchableOpacity 
            style={financasEstilos.botaoSeletor}
            onPress={() => setModalSeletorMesVisivel(true)}
          >
            <Text style={financasEstilos.textoSeletor}>
              {nomesMeses[mesSelecionado - 1]} {anoSelecionado}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Botão da Calculadora */}
        <View style={financasEstilos.calculadoraContainer}>
          <TouchableOpacity 
            style={financasEstilos.botaoCalculadora}
            onPress={() => {
              limparCalculadora();
              setModalCalculadoraVisivel(true);
            }}
          >
            <Ionicons name="calculator-outline" size={24} color={cores.primaria} />
            <Text style={financasEstilos.textoCalculadora}>Calculadora</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
            style={financasEstilos.container}
            refreshControl={
                <RefreshControl
                    refreshing={atualizando}
                    onRefresh={carregarDados}
                    tintColor={cores.primaria}
                />
            }
        >
            {/* Resumo Financeiro */}
            <View style={estilosGlobais.cartaoElevado}>
                <Text style={estilosGlobais.subtitulo}>Resumo</Text>

                <View style={financasEstilos.itemResumo}>
                    <View style={financasEstilos.indicadorReceita} />
                    <Text style={financasEstilos.labelResumo}>Receitas</Text>
                    <Text style={[financasEstilos.valorResumo, financasEstilos.valorReceita]}>
                        {formatarMoeda(totalReceitas)}
                    </Text>
                </View>

                <View style={financasEstilos.itemResumo}>
                    <View style={financasEstilos.indicadorDespesa} />
                    <Text style={financasEstilos.labelResumo}>Despesas</Text>
                    <Text style={[financasEstilos.valorResumo, financasEstilos.valorDespesa]}>
                        {formatarMoeda(totalDespesas)}
                    </Text>
                </View>

                <View style={financasEstilos.separadorResumo} />

                <View style={financasEstilos.itemResumo}>
                    <View style={[
                        financasEstilos.indicadorSaldo, 
                        { backgroundColor: saldo >= 0 ? cores.primaria : '#ff4444' }
                    ]} />
                    <Text style={financasEstilos.labelSaldo}>Saldo</Text>
                    <Text style={[
                        financasEstilos.valorSaldo,
                        { color: saldo >= 0 ? cores.primaria : '#ff4444' }
                    ]}>
                        {formatarMoeda(saldo)}
                    </Text>
                </View>
            </View>

            {/* Lista de Transações */}
            {transacoes.length > 0 ? (
                <View style={estilosGlobais.cartao}>
                    <Text style={estilosGlobais.subtitulo}>Transações Recentes</Text>
                    
                    {transacoes.map((transacao) => (
                        <View key={transacao.id} style={financasEstilos.itemTransacao}>
                            <View style={financasEstilos.iconeTransacao}>
                                <Ionicons 
                                    name={obterIconeTransacao(transacao.tipo, transacao.categoria)} 
                                    size={20} 
                                    color={transacao.tipo === 'receita' ? cores.primaria : '#ff4444'} 
                                />
                            </View>
                            
                            <View style={financasEstilos.infoTransacao}>
                                <Text style={financasEstilos.descricaoTransacao}>
                                    {transacao.descricao}
                                </Text>
                                <Text style={financasEstilos.categoriaTransacao}>
                                    {transacao.categoria} • {formatarData(transacao.dataCriacao)}
                                </Text>
                            </View>

                            <View style={financasEstilos.valorEAcoes}>
                                <Text style={[
                                    financasEstilos.valorTransacao,
                                    transacao.tipo === 'receita' ? financasEstilos.valorPositivo : financasEstilos.valorNegativo
                                ]}>
                                    {transacao.tipo === 'receita' ? '+' : '-'} {formatarMoeda(transacao.valor)}
                                </Text>
                                
                                <TouchableOpacity
                                    style={financasEstilos.botaoExcluir}
                                    onPress={() => excluirTransacao(transacao.id)}
                                >
                                    <Ionicons name="trash-outline" size={16} color={cores.textoTerciario} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={financasEstilos.estadoVazio}>
                    <Ionicons name="wallet-outline" size={64} color={cores.textoTerciario} />
                    <Text style={financasEstilos.textoVazio}>Nenhuma transação registrada</Text>
                    <Text style={financasEstilos.dicaVazio}>
                        Comece adicionando suas receitas e despesas
                    </Text>
                </View>
            )}
        </ScrollView>

        {/* Modal para Nova Transação */}
        <Modal
            visible={modalVisivel}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisivel(false)}
        >
            <View style={financasEstilos.modalContainer}>
                <View style={financasEstilos.modalConteudo}>
                    <View style={financasEstilos.cabecalhoModal}>
                        <Text style={estilosGlobais.subtitulo}>Nova Transação</Text>
                        <TouchableOpacity onPress={() => setModalVisivel(false)}>
                            <Ionicons name="close" size={24} color={cores.primaria} />
                        </TouchableOpacity>
                    </View>

                    {/* Seletor de Tipo */}
                    <View style={financasEstilos.seletorTipo}>
                        <TouchableOpacity
                            style={[
                                financasEstilos.botaoTipo,
                                tipo === 'receita' && financasEstilos.botaoTipoAtivo
                            ]}
                            onPress={() => {
                                setTipo('receita');
                                setCategoria('');
                            }}
                        >
                            <Ionicons 
                                name="trending-up" 
                                size={20} 
                                color={tipo === 'receita' ? cores.fundo : cores.primaria} 
                            />
                            <Text style={[
                                financasEstilos.textoTipo,
                                tipo === 'receita' && financasEstilos.textoTipoAtivo
                            ]}>
                                Receita
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                financasEstilos.botaoTipo,
                                tipo === 'despesa' && financasEstilos.botaoTipoAtivo
                            ]}
                            onPress={() => {
                                setTipo('despesa');
                                setCategoria('');
                            }}
                        >
                            <Ionicons 
                                name="trending-down" 
                                size={20} 
                                color={tipo === 'despesa' ? cores.fundo : cores.primaria} 
                            />
                            <Text style={[
                                financasEstilos.textoTipo,
                                tipo === 'despesa' && financasEstilos.textoTipoAtivo
                            ]}>
                                Despesa
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={estilosGlobais.input}
                        placeholder="Descrição da transação"
                        placeholderTextColor={cores.textoTerciario}
                        value={descricao}
                        onChangeText={setDescricao}
                        maxLength={100}
                    />

                    <TextInput
                        style={estilosGlobais.input}
                        placeholder="Valor da transação"
                        placeholderTextColor={cores.textoTerciario}
                        value={valor}
                        onChangeText={setValor}
                        keyboardType="numeric"
                        maxLength={10}
                    />

                    {/* Seletor de Categoria */}
                    <Text style={financasEstilos.labelCategoria}>Categoria:</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={financasEstilos.categoriasContainer}
                    >
                        {categorias[tipo].map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    financasEstilos.botaoCategoria,
                                    categoria === cat && financasEstilos.botaoCategoriaAtiva
                                ]}
                                onPress={() => setCategoria(cat)}
                            >
                                <Text style={[
                                    financasEstilos.textoCategoria,
                                    categoria === cat && financasEstilos.textoCategoriaAtiva
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        
                    </ScrollView>

                    <View style={financasEstilos.botoesModal}>
                        <TouchableOpacity
                            style={estilosGlobais.botaoSecundario}
                            onPress={() => setModalVisivel(false)}
                        >
                            <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={financasEstilos.botao}
                            onPress={limparCampos}
                        >
                            <Ionicons name="refresh-outline" size={35} color={cores.textoTerciario} /> 
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={estilosGlobais.botao}
                            onPress={adicionarTransacao}
                        >
                            <Text style={estilosGlobais.textoBotao}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {/* Modal Seletor de Mês/Ano */}
        <Modal
            visible={modalSeletorMesVisivel}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalSeletorMesVisivel(false)}
        >
            <View style={financasEstilos.modalContainer}>
                <View style={financasEstilos.modalConteudo}>
                    <View style={financasEstilos.cabecalhoModal}>
                        <Text style={estilosGlobais.subtitulo}>Selecionar Mês/Ano</Text>
                        <TouchableOpacity onPress={() => setModalSeletorMesVisivel(false)}>
                            <Ionicons name="close" size={24} color={cores.primaria} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={financasEstilos.containerSeletor}>
                        {/* Seletor de Ano */}
                        <Text style={financasEstilos.labelSeletor}>Ano:</Text>
                        <View style={financasEstilos.linhaSeletor}>
                            <TouchableOpacity 
                                style={financasEstilos.botaoSeta}
                                onPress={() => setAnoSelecionado(anoSelecionado - 1)}
                            >
                                <Ionicons name="chevron-back" size={24} color={cores.primaria} />
                            </TouchableOpacity>
                            
                            <View style={financasEstilos.containerValor}>
                                <Text style={financasEstilos.valorSeletor}>{anoSelecionado}</Text>
                            </View>
                            
                            <TouchableOpacity 
                                style={financasEstilos.botaoSeta}
                                onPress={() => setAnoSelecionado(anoSelecionado + 1)}
                            >
                                <Ionicons name="chevron-forward" size={24} color={cores.primaria} />
                            </TouchableOpacity>
                        </View>

                        {/* Seletor de Mês */}
                        <Text style={financasEstilos.labelSeletor}>Mês:</Text>
                        <View style={financasEstilos.gridMeses}>
                            {nomesMeses.map((nomeMes, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        financasEstilos.botaoMes,
                                        mesSelecionado === index + 1 && financasEstilos.botaoMesAtivo
                                    ]}
                                    onPress={() => setMesSelecionado(index + 1)}
                                >
                                    <Text style={[
                                        financasEstilos.textoMes,
                                        mesSelecionado === index + 1 && financasEstilos.textoMesAtivo
                                    ]}>
                                        {nomeMes.substring(0, 3)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={financasEstilos.botoesModal}>
                        <TouchableOpacity
                            style={financasEstilos.botaoCancelar}
                            onPress={() => setModalSeletorMesVisivel(false)}
                        >
                            <Text style={financasEstilos.textoCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={financasEstilos.botaoConfirmar}
                            onPress={() => {
                                setModalSeletorMesVisivel(false);
                                carregarDados();
                            }}
                        >
                            <Text style={estilosGlobais.textoBotao}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {/* Modal do Histórico Mensal */}
        <Modal
            visible={modalHistoricoVisivel}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalHistoricoVisivel(false)}
        >
            <View style={financasEstilos.modalContainer}>
                <View style={financasEstilos.modalConteudo}>
                    <View style={financasEstilos.cabecalhoModal}>
                        <Text style={estilosGlobais.subtitulo}>📊 Histórico Mensal</Text>
                        <View style={financasEstilos.botoesModalHistorico}>
                            {historicoMeses.length > 0 && (
                                <TouchableOpacity 
                                    style={financasEstilos.botaoLimparHistorico}
                                    onPress={limparTodoHistorico}
                                >
                                    <Ionicons name="trash" size={18} color={'#ff4444'} />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => setModalHistoricoVisivel(false)}>
                                <Ionicons name="close" size={24} color={cores.primaria} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={financasEstilos.historicoContainer}>
                        {historicoMeses.length > 0 ? (
                            historicoMeses.map((mes, index) => (
                                <View key={index} style={financasEstilos.itemHistorico}>
                                    <View style={financasEstilos.cabecalhoHistorico}>
                                        <Text style={financasEstilos.mesHistorico}>{mes.mes}</Text>
                                        <View style={financasEstilos.acaoHistorico}>
                                            <Text style={[
                                                financasEstilos.saldoHistorico,
                                                { color: mes.saldo >= 0 ? cores.primaria : '#ff4444' }
                                            ]}>
                                                {formatarMoeda(mes.saldo)}
                                            </Text>
                                            <TouchableOpacity
                                                style={financasEstilos.botaoExcluirHistorico}
                                                onPress={() => excluirRegistroHistorico(index)}
                                            >
                                                <Ionicons name="trash-outline" size={16} color={'#ff4444'} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    
                                    <View style={financasEstilos.resumoHistorico}>
                                        <View style={financasEstilos.itemResumoHistorico}>
                                            <Text style={financasEstilos.labelHistorico}>💰 Receitas:</Text>
                                            <Text style={financasEstilos.valorHistoricoPositivo}>
                                                {formatarMoeda(mes.totalReceitas)}
                                            </Text>
                                        </View>
                                        
                                        <View style={financasEstilos.itemResumoHistorico}>
                                            <Text style={financasEstilos.labelHistorico}>💸 Despesas:</Text>
                                            <Text style={financasEstilos.valorHistoricoNegativo}>
                                                {formatarMoeda(mes.totalDespesas)}
                                            </Text>
                                        </View>
                                        
                                        <View style={financasEstilos.itemResumoHistorico}>
                                            <Text style={financasEstilos.labelHistorico}>📈 Performance:</Text>
                                            <Text style={financasEstilos.valorHistorico}>
                                                {mes.saldo >= 0 ? 'Positivo ✅' : 'Negativo ❌'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={financasEstilos.historicoVazio}>
                                <Ionicons name="calendar-outline" size={64} color={cores.textoTerciario} />
                                <Text style={financasEstilos.textoHistoricoVazio}>
                                    Nenhum histórico mensal
                                </Text>
                                <Text style={financasEstilos.dicaHistoricoVazio}>
                                    Feche o mês atual para criar o primeiro registro
                                </Text>
                            </View>
                        )}
                        <View style={{ height: 32 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>

        {/* Modal da Calculadora */}
        <Modal
            visible={modalCalculadoraVisivel}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalCalculadoraVisivel(false)}
        >
            <View style={financasEstilos.modalContainer}>
                <View style={financasEstilos.modalCalculadora}>
                    <View style={financasEstilos.cabecalhoModal}>
                        <Text style={estilosGlobais.subtitulo}> Calculadora</Text>
                        <TouchableOpacity onPress={() => setModalCalculadoraVisivel(false)}>
                            <Ionicons name="close" size={24} color={cores.primaria} />
                        </TouchableOpacity>
                    </View>

                    {/* Display da Calculadora */}
                    <View style={financasEstilos.displayCalculadora}>
                        <Text style={financasEstilos.textoDisplay}>{displayCalculadora}</Text>
                        <Text style={financasEstilos.valorFormatado}>
                            {!isNaN(parseFloat(displayCalculadora.replace(',', '.'))) ? 
                              formatarMoeda(parseFloat(displayCalculadora.replace(',', '.'))) : ''}
                        </Text>
                    </View>

                    {/* Teclado da Calculadora */}
                    <View style={financasEstilos.tecladoCalculadora}>
                        {/* Primeira linha */}
                        <View style={financasEstilos.linhaTeclado}>
                            <TouchableOpacity 
                                style={[financasEstilos.botaoTeclado, financasEstilos.botaoLimpar]}
                                onPress={limparCalculadora}
                            >
                                <Text style={financasEstilos.textoOperacao}>C</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[financasEstilos.botaoTeclado, financasEstilos.botaoOperacao]}
                                onPress={() => executarOperacao('/')}
                            >
                                <Text style={financasEstilos.textoOperacao}>÷</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[financasEstilos.botaoTeclado, financasEstilos.botaoOperacao]}
                                onPress={() => executarOperacao('*')}
                            >
                                <Text style={financasEstilos.textoOperacao}>×</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[financasEstilos.botaoTeclado, financasEstilos.botaoOperacao]}
                                onPress={() => executarOperacao('-')}
                            >
                                <Text style={financasEstilos.textoOperacao}>-</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Segunda linha */}
                        <View style={financasEstilos.linhaTeclado}>
                            <TouchableOpacity 
                                style={financasEstilos.botaoTeclado}
                                onPress={() => inserirNumero('7')}
                            >
                                <Text style={financasEstilos.textoNumero}>7</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={financasEstilos.botaoTeclado}
                                onPress={() => inserirNumero('8')}
                            >
                                <Text style={financasEstilos.textoNumero}>8</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={financasEstilos.botaoTeclado}
                                onPress={() => inserirNumero('9')}
                            >
                                <Text style={financasEstilos.textoNumero}>9</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[financasEstilos.botaoTeclado, financasEstilos.botaoOperacao]}
                                onPress={() => executarOperacao('+')}
                            >
                                <Text style={financasEstilos.textoOperacao}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Terceira linha */}
                        <View style={financasEstilos.linhaTeclado}>
                            <TouchableOpacity 
                                style={financasEstilos.botaoTeclado}
                                onPress={() => inserirNumero('4')}
                            >
                                <Text style={financasEstilos.textoNumero}>4</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={financasEstilos.botaoTeclado}
                                onPress={() => inserirNumero('5')}
                            >
                                <Text style={financasEstilos.textoNumero}>5</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={financasEstilos.botaoTeclado}
                                onPress={() => inserirNumero('6')}
                            >
                                <Text style={financasEstilos.textoNumero}>6</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[financasEstilos.botaoTeclado, financasEstilos.botaoIgual]}
                                onPress={calcularResultado}
                            >
                                <Text style={financasEstilos.textoOperacao}>=</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Quarta linha */}
                        <View style={financasEstilos.linhaTeclado}>
                            <TouchableOpacity 
                                style={financasEstilos.botaoTeclado}
                                onPress={() => inserirNumero('1')}
                            >
                                <Text style={financasEstilos.textoNumero}>1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={financasEstilos.botaoTeclado}
                                onPress={() => inserirNumero('2')}
                            >
                                <Text style={financasEstilos.textoNumero}>2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={financasEstilos.botaoTeclado}
                                onPress={() => inserirNumero('3')}
                            >
                                <Text style={financasEstilos.textoNumero}>3</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[financasEstilos.botaoTeclado, financasEstilos.botaoUsar]}
                                onPress={usarResultadoCalculadora}
                            >
                                <Ionicons name="checkmark" size={20} color="#ffffff" />
                            </TouchableOpacity>
                        </View>

                        {/* Quinta linha */}
                        <View style={financasEstilos.linhaTeclado}>
                            <TouchableOpacity 
                                style={[financasEstilos.botaoTeclado, financasEstilos.botaoZero]}
                                onPress={() => inserirNumero('0')}
                            >
                                <Text style={financasEstilos.textoNumero}>0</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={financasEstilos.botaoTeclado}
                                onPress={inserirDecimal}
                            >
                                <Text style={financasEstilos.textoNumero}>,</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={financasEstilos.botoesCalculadora}>
                        <TouchableOpacity
                            style={estilosGlobais.botaoSecundario}
                            onPress={() => setModalCalculadoraVisivel(false)}
                        >
                            <Text style={estilosGlobais.textoBotaoSecundario}>Fechar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={estilosGlobais.botao}
                            onPress={usarResultadoCalculadora}
                        >
                            <Text style={estilosGlobais.textoBotao}>Usar Valor</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {/* Modal de Senha do Cofre */}
        <SenhaModal
            visible={modalSenhaVisivel}
            onClose={fecharModalSenha}
            onSuccess={handleSenhaSuccess}
            isFirstTime={isFirstTimePassword}
            title={isFirstTimePassword ? "Crie uma senha de 4 dígitos" : "Digite a senha do cofre"}
        />
    </View>
);
};



export default FinancasTela;
