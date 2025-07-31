import React, { useState, useEffect } from 'react';
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
  salvarHistoricoMensal,
  carregarHistoricoFinanceiro
} from '../armazenamento/armazenamentoSQLite';
import { useDatabaseContext } from '../contextos/DatabaseContext';

const FinancasTela = () => {
  const { bancoInicializado } = useDatabaseContext();
  const [transacoes, setTransacoes] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalHistoricoVisivel, setModalHistoricoVisivel] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('receita'); // 'receita' ou 'despesa'
  const [categoria, setCategoria] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [historicoMeses, setHistoricoMeses] = useState([]);
  const [mesAtual, setMesAtual] = useState(new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }));

  const categorias = {
    receita: ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros'],
    despesa: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Entretenimento', 'Educação', 'Compras', 'Outros']
  };

  useEffect(() => {
    if (bancoInicializado) {
      carregarDados();
    }
  }, [bancoInicializado]);

  const carregarDados = async () => {
    try {
      setAtualizando(true);
      const transacoesCarregadas = await carregarTransacoesFinanceiras();
      const historicoCarregado = await carregarHistoricoFinanceiro();
      setTransacoes(transacoesCarregadas);
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
      
      const novaTransacao = {
        descricao: descricao.trim(),
        valor: valorNumerico,
        tipo,
        categoria,
      };

      const sucesso = await salvarTransacaoFinanceira(novaTransacao);
      
      if (sucesso) {
        await carregarDados();
        limparCampos();
        setModalVisivel(false);
        Alert.alert('Sucesso', 'Transação adicionada com sucesso!');
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

  const passarProximoMes = () => {
    if (transacoes.length === 0) {
      Alert.alert('Aviso', 'Não há transações para arquivar no histórico mensal.');
      return;
    }

    Alert.alert(
      'Fechar Mês',
      `Tem certeza que deseja fechar o mês de ${mesAtual}? Todas as transações atuais serão arquivadas no histórico e a tela será zerada.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          style: 'default',
          onPress: async () => {
            try {
              const { totalReceitas, totalDespesas, saldo } = calcularResumo();
              
              // Criar registro do mês
              const registroMes = {
                mes: mesAtual,
                data: new Date().toISOString(),
                totalReceitas,
                totalDespesas,
                saldo,
                transacoes: [...transacoes],
                metaEconomia: 0, // Pode ser implementado depois
                economiaPorcentagem: 0
              };

              // Salvar no histórico
              const novoHistorico = [registroMes, ...historicoMeses];
              await salvarHistoricoMensal(novoHistorico);

              // Limpar todas as transações atuais
              for (const transacao of transacoes) {
                await excluirTransacaoFinanceira(transacao.id);
              }

              // Atualizar mês atual
              const proximaData = new Date();
              proximaData.setMonth(proximaData.getMonth() + 1);
              setMesAtual(proximaData.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }));

              await carregarDados();
              Alert.alert('Sucesso', `Mês arquivado com sucesso! Saldo final: ${formatarMoeda(saldo)}`);
            } catch (error) {
              console.error('Erro ao arquivar mês:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao arquivar o mês.');
            }
          }
        }
      ]
    );
  };

  const excluirRegistroHistorico = (index) => {
    const registroParaExcluir = historicoMeses[index];
    
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
              // Remover o registro do histórico
              const novoHistorico = historicoMeses.filter((_, i) => i !== index);
              await salvarHistoricoMensal(novoHistorico);
              
              // Atualizar estado local
              setHistoricoMeses(novoHistorico);
              
              Alert.alert('Sucesso', 'Registro do histórico excluído com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir registro do histórico:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir o registro.');
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
              await salvarHistoricoMensal([]);
              setHistoricoMeses([]);
              Alert.alert('Sucesso', 'Todo o histórico foi excluído com sucesso!');
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
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const { totalReceitas, totalDespesas, saldo } = calcularResumo();

return (
    <View style={estilosGlobais.container}>
        <Header />
        
        {/* Cabeçalho da Seção */}
        <View style={estilos.cabecalho}>
            <View>
                <Text style={estilosGlobais.titulo}>Finanças</Text>
                <Text style={estilos.mesAtual}>{mesAtual}</Text>
            </View>
            <View style={estilos.botoesAcoes}>
                <TouchableOpacity
                    style={estilos.botaoSecundario}
                    onPress={() => setModalHistoricoVisivel(true)}
                >
                    <Ionicons name="calendar-outline" size={20} color={cores.primaria} />
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={estilos.botaoSecundario}
                    onPress={passarProximoMes}
                >
                    <Ionicons name="arrow-forward-outline" size={20} color={cores.primaria} />
                </TouchableOpacity>
                
                {transacoes.length > 0 && (
                    <TouchableOpacity
                        style={estilos.botaoLimparTudo}
                        onPress={limparTodasTransacoes}
                    >
                        <Ionicons name="trash-outline" size={20} color={'#ff4444'} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={estilos.botaoAdicionar}
                    onPress={() => setModalVisivel(true)}
                >
                    <Ionicons name="add" size={24} color={cores.fundo} />
                </TouchableOpacity>
            </View>
        </View>

        <ScrollView 
            style={estilos.container}
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
                
                <View style={estilos.itemResumo}>
                    <View style={estilos.indicadorReceita} />
                    <Text style={estilos.labelResumo}>Receitas</Text>
                    <Text style={[estilos.valorResumo, estilos.valorReceita]}>
                        {formatarMoeda(totalReceitas)}
                    </Text>
                </View>

                <View style={estilos.itemResumo}>
                    <View style={estilos.indicadorDespesa} />
                    <Text style={estilos.labelResumo}>Despesas</Text>
                    <Text style={[estilos.valorResumo, estilos.valorDespesa]}>
                        {formatarMoeda(totalDespesas)}
                    </Text>
                </View>

                <View style={estilos.separadorResumo} />

                <View style={estilos.itemResumo}>
                    <View style={[
                        estilos.indicadorSaldo, 
                        { backgroundColor: saldo >= 0 ? cores.primaria : '#ff4444' }
                    ]} />
                    <Text style={estilos.labelSaldo}>Saldo</Text>
                    <Text style={[
                        estilos.valorSaldo,
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
                        <View key={transacao.id} style={estilos.itemTransacao}>
                            <View style={estilos.iconeTransacao}>
                                <Ionicons 
                                    name={obterIconeTransacao(transacao.tipo, transacao.categoria)} 
                                    size={20} 
                                    color={transacao.tipo === 'receita' ? cores.primaria : '#ff4444'} 
                                />
                            </View>
                            
                            <View style={estilos.infoTransacao}>
                                <Text style={estilos.descricaoTransacao}>
                                    {transacao.descricao}
                                </Text>
                                <Text style={estilos.categoriaTransacao}>
                                    {transacao.categoria} • {formatarData(transacao.data)}
                                </Text>
                            </View>

                            <View style={estilos.valorEAcoes}>
                                <Text style={[
                                    estilos.valorTransacao,
                                    transacao.tipo === 'receita' ? estilos.valorPositivo : estilos.valorNegativo
                                ]}>
                                    {transacao.tipo === 'receita' ? '+' : '-'} {formatarMoeda(transacao.valor)}
                                </Text>
                                
                                <TouchableOpacity
                                    style={estilos.botaoExcluir}
                                    onPress={() => excluirTransacao(transacao.id)}
                                >
                                    <Ionicons name="trash-outline" size={16} color={cores.textoTerciario} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={estilos.estadoVazio}>
                    <Ionicons name="wallet-outline" size={64} color={cores.textoTerciario} />
                    <Text style={estilos.textoVazio}>Nenhuma transação registrada</Text>
                    <Text style={estilos.dicaVazio}>
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
            <View style={estilos.modalContainer}>
                <View style={estilos.modalConteudo}>
                    <View style={estilos.cabecalhoModal}>
                        <Text style={estilosGlobais.subtitulo}>Nova Transação</Text>
                        <TouchableOpacity onPress={() => setModalVisivel(false)}>
                            <Ionicons name="close" size={24} color={cores.primaria} />
                        </TouchableOpacity>
                    </View>

                    {/* Seletor de Tipo */}
                    <View style={estilos.seletorTipo}>
                        <TouchableOpacity
                            style={[
                                estilos.botaoTipo,
                                tipo === 'receita' && estilos.botaoTipoAtivo
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
                                estilos.textoTipo,
                                tipo === 'receita' && estilos.textoTipoAtivo
                            ]}>
                                Receita
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                estilos.botaoTipo,
                                tipo === 'despesa' && estilos.botaoTipoAtivo
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
                                estilos.textoTipo,
                                tipo === 'despesa' && estilos.textoTipoAtivo
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
                    <Text style={estilos.labelCategoria}>Categoria:</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={estilos.categoriasContainer}
                    >
                        {categorias[tipo].map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    estilos.botaoCategoria,
                                    categoria === cat && estilos.botaoCategoriaAtiva
                                ]}
                                onPress={() => setCategoria(cat)}
                            >
                                <Text style={[
                                    estilos.textoCategoria,
                                    categoria === cat && estilos.textoCategoriaAtiva
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        
                    </ScrollView>

                    <View style={estilos.botoesModal}>
                        <TouchableOpacity
                            style={estilosGlobais.botaoSecundario}
                            onPress={() => setModalVisivel(false)}
                        >
                            <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={estilos.botaoLimpar}
                            onPress={limparCampos}
                        >
                            <Ionicons name="refresh-outline" size={16} color={cores.textoTerciario} />
                            <Text style={estilos.textoBotaoLimpar}>Limpar</Text>
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

        {/* Modal do Histórico Mensal */}
        <Modal
            visible={modalHistoricoVisivel}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalHistoricoVisivel(false)}
        >
            <View style={estilos.modalContainer}>
                <View style={estilos.modalConteudo}>
                    <View style={estilos.cabecalhoModal}>
                        <Text style={estilosGlobais.subtitulo}>📊 Histórico Mensal</Text>
                        <View style={estilos.botoesModalHistorico}>
                            {historicoMeses.length > 0 && (
                                <TouchableOpacity 
                                    style={estilos.botaoLimparHistorico}
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

                    <ScrollView style={estilos.historicoContainer}>
                        {historicoMeses.length > 0 ? (
                            historicoMeses.map((mes, index) => (
                                <View key={index} style={estilos.itemHistorico}>
                                    <View style={estilos.cabecalhoHistorico}>
                                        <Text style={estilos.mesHistorico}>{mes.mes}</Text>
                                        <View style={estilos.acaoHistorico}>
                                            <Text style={[
                                                estilos.saldoHistorico,
                                                { color: mes.saldo >= 0 ? cores.primaria : '#ff4444' }
                                            ]}>
                                                {formatarMoeda(mes.saldo)}
                                            </Text>
                                            <TouchableOpacity
                                                style={estilos.botaoExcluirHistorico}
                                                onPress={() => excluirRegistroHistorico(index)}
                                            >
                                                <Ionicons name="trash-outline" size={16} color={'#ff4444'} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    
                                    <View style={estilos.resumoHistorico}>
                                        <View style={estilos.itemResumoHistorico}>
                                            <Text style={estilos.labelHistorico}>💰 Receitas:</Text>
                                            <Text style={estilos.valorHistoricoPositivo}>
                                                {formatarMoeda(mes.totalReceitas)}
                                            </Text>
                                        </View>
                                        
                                        <View style={estilos.itemResumoHistorico}>
                                            <Text style={estilos.labelHistorico}>💸 Despesas:</Text>
                                            <Text style={estilos.valorHistoricoNegativo}>
                                                {formatarMoeda(mes.totalDespesas)}
                                            </Text>
                                        </View>
                                        
                                        <View style={estilos.itemResumoHistorico}>
                                            <Text style={estilos.labelHistorico}>📈 Performance:</Text>
                                            <Text style={estilos.valorHistorico}>
                                                {mes.saldo >= 0 ? 'Positivo ✅' : 'Negativo ❌'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={estilos.historicoVazio}>
                                <Ionicons name="calendar-outline" size={64} color={cores.textoTerciario} />
                                <Text style={estilos.textoHistoricoVazio}>
                                    Nenhum histórico mensal
                                </Text>
                                <Text style={estilos.dicaHistoricoVazio}>
                                    Feche o mês atual para criar o primeiro registro
                                </Text>
                            </View>
                        )}
                        <View style={{ height: 32 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    </View>
);
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  botoesAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  mesAtual: {
    fontSize: 12,
    color: cores.textoTerciario,
    marginTop: 2,
    textTransform: 'capitalize',
  },

  botaoSecundario: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.fundoSecundario,
    borderWidth: 2,
    borderColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: cores.primaria,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  botaoLimparTudo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.fundoSecundario,
    borderWidth: 2,
    borderColor: '#ff4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  botaoAdicionar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: cores.primaria,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },

  // Resumo
  itemResumo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  indicadorReceita: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: cores.primaria,
    marginRight: 12,
  },

  indicadorDespesa: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4444',
    marginRight: 12,
  },

  indicadorSaldo: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },

  labelResumo: {
    flex: 1,
    fontSize: 14,
    color: cores.textoSecundario,
  },

  labelSaldo: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
  },

  valorResumo: {
    fontSize: 14,
    fontWeight: '600',
  },

  valorReceita: {
    color: cores.primaria,
  },

  valorDespesa: {
    color: '#ff4444',
  },

  valorSaldo: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  separadorResumo: {
    height: 1,
    backgroundColor: cores.borda,
    marginVertical: 12,
  },

  // Transações
  itemTransacao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  iconeTransacao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.fundoTerciario,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoTransacao: {
    flex: 1,
  },

  descricaoTransacao: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 4,
  },

  categoriaTransacao: {
    fontSize: 12,
    color: cores.textoTerciario,
  },

  valorEAcoes: {
    alignItems: 'flex-end',
  },

  valorTransacao: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  valorPositivo: {
    color: cores.primaria,
  },

  valorNegativo: {
    color: '#ff4444',
  },

  botaoExcluir: {
    padding: 4,
  },

  // Estado vazio
  estadoVazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },

  textoVazio: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.textoSecundario,
    marginTop: 16,
    textAlign: 'center',
  },

  dicaVazio: {
    fontSize: 14,
    color: cores.textoTerciario,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: cores.overlay,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalConteudo: {
    backgroundColor: cores.fundo,
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },

  cabecalhoModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  botoesModalHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  botaoLimparHistorico: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: cores.fundoSecundario,
    borderWidth: 2,
    borderColor: '#ff4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // Seletor de tipo
  seletorTipo: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  botaoTipo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 8,
    marginHorizontal: 4,
  },

  botaoTipoAtivo: {
    backgroundColor: cores.primaria,
  },

  textoTipo: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: cores.primaria,
  },

  textoTipoAtivo: {
    color: cores.fundo,
  },

  // Categorias
  labelCategoria: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 8,
  },

  categoriasContainer: {
    marginBottom: 20,
  },

  botaoCategoria: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 20,
    marginRight: 8,
  },

  botaoCategoriaAtiva: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },

  textoCategoria: {
    fontSize: 12,
    color: cores.textoSecundario,
  },

  textoCategoriaAtiva: {
    color: cores.fundo,
  },

  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  botaoLimpar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    backgroundColor: cores.fundoSecundario,
  },

  textoBotaoLimpar: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: cores.textoTerciario,
  },

  // Histórico Mensal
  historicoContainer: {
    maxHeight: 400,
  },

  itemHistorico: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },

  cabecalhoHistorico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  acaoHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  botaoExcluirHistorico: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: cores.fundoTerciario,
    borderWidth: 1,
    borderColor: '#ff4444',
  },

  mesHistorico: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
    textTransform: 'capitalize',
  },

  saldoHistorico: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  resumoHistorico: {
    gap: 8,
  },

  itemResumoHistorico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  labelHistorico: {
    fontSize: 14,
    color: cores.textoSecundario,
  },

  valorHistorico: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.textoSecundario,
  },

  valorHistoricoPositivo: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.primaria,
  },

  valorHistoricoNegativo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff4444',
  },

  historicoVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  textoHistoricoVazio: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.textoSecundario,
    marginTop: 16,
    textAlign: 'center',
  },

  dicaHistoricoVazio: {
    fontSize: 14,
    color: cores.textoTerciario,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FinancasTela;
