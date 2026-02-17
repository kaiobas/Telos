import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';
import cofreEstilos from '../estilos/cofreEstilos';
import Header from '../componentes/Header';
import { 
  obterSaldoCofre,
  depositarNoCofre,
  retirarDoCofre,
  carregarHistoricoCofre,
  limparHistoricoCofre,
  salvarObjetivoFinanceiro,
  obterObjetivoFinanceiro,
  excluirObjetivoFinanceiro,
  calcularProgressoObjetivo
} from '../armazenamento/armazenamentoSQLite';
import { useDatabaseContext } from '../contextos/DatabaseContext';

const CofreTela = ({ navigation }) => {
  const { bancoInicializado } = useDatabaseContext();
  const [saldoCofre, setSaldoCofre] = useState(0);
  const [historicoCofre, setHistoricoCofre] = useState([]);
  const [objetivo, setObjetivo] = useState(null);
  const [progressoObjetivo, setProgressoObjetivo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  // Estados dos modais
  const [modalMovimentacaoVisivel, setModalMovimentacaoVisivel] = useState(false);
  const [modalObjetivoVisivel, setModalObjetivoVisivel] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState('deposito');
  const [valorMovimentacao, setValorMovimentacao] = useState('');
  const [descricaoMovimentacao, setDescricaoMovimentacao] = useState('');
  const [valorObjetivo, setValorObjetivo] = useState('');
  const [descricaoObjetivo, setDescricaoObjetivo] = useState('');

  useEffect(() => {
    if (bancoInicializado) {
      setTimeout(carregarDados, 500);
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [bancoInicializado, navigation]);

  const carregarDados = async () => {
    if (!bancoInicializado) {
      return;
    }

    try {
      setAtualizando(true);
      await new Promise(resolve => setTimeout(resolve, 200));

      const saldoAtual = await obterSaldoCofre();
      const historicoCarregado = await carregarHistoricoCofre();
      const objetivoCarregado = await obterObjetivoFinanceiro();
      const progressoCarregado = await calcularProgressoObjetivo();

      setSaldoCofre(saldoAtual);
      setHistoricoCofre(historicoCarregado || []);
      setObjetivo(objetivoCarregado);
      setProgressoObjetivo(progressoCarregado);
    } catch (error) {
      console.error('Erro ao carregar dados do cofre:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
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
      
      if (dataString.length === 10) {
        const [ano, mes, dia] = dataString.split('-');
        const dataLocal = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        return dataLocal.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      
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

  const abrirMovimentacao = (tipo) => {
    setTipoMovimentacao(tipo);
    setValorMovimentacao('');
    setDescricaoMovimentacao('');
    setModalMovimentacaoVisivel(true);
  };

  const executarMovimentacao = async () => {
    if (!valorMovimentacao.trim() || isNaN(parseFloat(valorMovimentacao.replace(',', '.')))) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    const valorNumerico = parseFloat(valorMovimentacao.replace(',', '.'));
    
    if (valorNumerico <= 0) {
      Alert.alert('Erro', 'O valor deve ser maior que zero.');
      return;
    }

    try {
      let sucesso = false;
      
      if (tipoMovimentacao === 'deposito') {
        sucesso = await depositarNoCofre(valorNumerico, descricaoMovimentacao.trim());
        if (sucesso) {
          Alert.alert('Sucesso', `Depósito de ${formatarMoeda(valorNumerico)} realizado!`);
        }
      } else {
        if (saldoCofre < valorNumerico) {
          Alert.alert('Erro', 'Saldo insuficiente no cofre.');
          return;
        }
        
        sucesso = await retirarDoCofre(valorNumerico, descricaoMovimentacao.trim());
        if (sucesso) {
          Alert.alert('Sucesso', `Retirada de ${formatarMoeda(valorNumerico)} realizada!`);
        }
      }

      if (sucesso) {
        await carregarDados();
        setModalMovimentacaoVisivel(false);
      } else {
        Alert.alert('Erro', 'Não foi possível realizar a operação.');
      }
    } catch (error) {
      console.error('Erro ao executar movimentação:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao realizar a operação.');
    }
  };

  const abrirModalObjetivo = () => {
    if (objetivo) {
      setValorObjetivo(objetivo.valorObjetivo.toString().replace('.', ','));
      setDescricaoObjetivo(objetivo.descricao || '');
    } else {
      setValorObjetivo('');
      setDescricaoObjetivo('');
    }
    setModalObjetivoVisivel(true);
  };

  const salvarObjetivo = async () => {
    if (!valorObjetivo.trim() || isNaN(parseFloat(valorObjetivo.replace(',', '.')))) {
      Alert.alert('Erro', 'Por favor, insira um valor válido para o objetivo.');
      return;
    }

    const valorNumerico = parseFloat(valorObjetivo.replace(',', '.'));
    
    if (valorNumerico <= 0) {
      Alert.alert('Erro', 'O valor do objetivo deve ser maior que zero.');
      return;
    }

    try {
      const sucesso = await salvarObjetivoFinanceiro(valorNumerico, descricaoObjetivo.trim());
      
      if (sucesso) {
        await carregarDados();
        setModalObjetivoVisivel(false);
        Alert.alert('Sucesso', `Objetivo de ${formatarMoeda(valorNumerico)} definido!`);
      } else {
        Alert.alert('Erro', 'Não foi possível salvar o objetivo.');
      }
    } catch (error) {
      console.error('Erro ao salvar objetivo:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o objetivo.');
    }
  };

  const excluirObjetivo = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir o objetivo atual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const sucesso = await excluirObjetivoFinanceiro();
              if (sucesso) {
                await carregarDados();
                setModalObjetivoVisivel(false);
                Alert.alert('Sucesso', 'Objetivo excluído com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível excluir o objetivo.');
              }
            } catch (error) {
              console.error('Erro ao excluir objetivo:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir o objetivo.');
            }
          }
        }
      ]
    );
  };

  const limparTodoHistorico = () => {
    if (historicoCofre.length === 0) {
      Alert.alert('Aviso', 'Não há histórico para limpar.');
      return;
    }

    Alert.alert(
      'Confirmar Limpeza',
      `Tem certeza que deseja limpar todo o histórico? Serão excluídos ${historicoCofre.length} registro(s). O saldo atual será mantido.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          style: 'destructive',
          onPress: async () => {
            try {
              const sucesso = await limparHistoricoCofre();
              if (sucesso) {
                await carregarDados();
                Alert.alert('Sucesso', 'Histórico limpo com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível limpar o histórico.');
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

  return (
    <View style={cofreEstilos.container}>
      <Header />
      
      {/* Cabeçalho da Tela */}
      <View style={cofreEstilos.cabecalho}>
        <View style={cofreEstilos.cabecalhoEsquerda}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={'#ffffff'} />
          </TouchableOpacity>
          <Text style={cofreEstilos.tituloCabecalho}>Cofre</Text>
        </View>
        <View style={cofreEstilos.cabecalhoDireita}>
          {historicoCofre.length > 0 && (
            <TouchableOpacity
              style={cofreEstilos.botaoLimpar}
              onPress={limparTodoHistorico}
            >
              <Ionicons name="trash-outline" size={20} color={'#ff4444'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={cofreEstilos.conteudo}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={carregarDados}
            tintColor={cores.branco}
          />
        }
      >
        {/* Saldo do Cofre */}
        <View style={cofreEstilos.secaoSaldo}>
          <Text style={cofreEstilos.tituloSaldo}>Saldo do Cofre</Text>
          <Text style={cofreEstilos.valorSaldo}>
            {formatarMoeda(saldoCofre)}
          </Text>
        </View>

        {/* Ações Principais */}
        <View style={cofreEstilos.containerAcoes}>
          <TouchableOpacity 
            style={cofreEstilos.botaoDeposito}
            onPress={() => abrirMovimentacao('deposito')}
          >
            <Ionicons name="arrow-down" size={24} color={cores.branco} />
            <Text style={cofreEstilos.textoBotaoDeposito}>Depositar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={cofreEstilos.botaoRetirada}
            onPress={() => abrirMovimentacao('retirada')}
          >
            <Ionicons name="arrow-up" size={24} color={cores.branco} />
            <Text style={cofreEstilos.textoBotaoRetirada}>Retirar</Text>
          </TouchableOpacity>
        </View>

        {/* Ações Secundárias */}
        <View style={cofreEstilos.containerAcoesSecundarias}>
          <TouchableOpacity 
            style={cofreEstilos.botaoSecundario}
            onPress={abrirModalObjetivo}
          >
            <Ionicons name="flag" size={24} color={'#ffffff'} />
            <Text style={cofreEstilos.textoBotaoSecundario}>
              {objetivo ? 'Editar Meta' : 'Definir Meta'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Seção do Objetivo */}
        {progressoObjetivo && (
          <View style={cofreEstilos.secaoObjetivo}>
            <Text style={cofreEstilos.tituloObjetivo}>
              {progressoObjetivo.objetivo.descricao || 'Objetivo Financeiro'}
            </Text>
            <Text style={cofreEstilos.valorObjetivo}>
              Meta: {formatarMoeda(progressoObjetivo.objetivo.valorObjetivo)}
            </Text>
            
            <View style={cofreEstilos.containerProgresso}>
              <View style={cofreEstilos.barraProgresso}>
                <View 
                  style={[
                    cofreEstilos.progressoPreenchido,
                    { width: `${Math.min(progressoObjetivo.progresso, 100)}%` }
                  ]}
                />
              </View>
              <Text style={cofreEstilos.textoProgresso}>
                {progressoObjetivo.progresso.toFixed(1)}%
              </Text>
            </View>
            
            {progressoObjetivo.objetivoAlcancado ? (
              <Text style={cofreEstilos.objetivoAlcancado}>
                Objetivo alcançado!
              </Text>
            ) : (
              <Text style={cofreEstilos.valorRestante}>
                Faltam {formatarMoeda(progressoObjetivo.valorRestante)}
              </Text>
            )}
          </View>
        )}

        {/* Histórico de Movimentações */}
        {historicoCofre.length > 0 ? (
          <View style={cofreEstilos.secaoHistorico}>
            <Text style={cofreEstilos.tituloHistorico}>Histórico</Text>
            
            {historicoCofre.map((item) => (
              <View key={item.id} style={cofreEstilos.itemHistorico}>
                <View style={cofreEstilos.cabecalhoItem}>
                  <Text style={cofreEstilos.tipoMovimentacao}>
                    {item.tipo === 'deposito' ? 'Depósito' : 'Retirada'}
                  </Text>
                  <Text style={cofreEstilos.dataMovimentacao}>
                    {formatarData(item.dataCriacao)}
                  </Text>
                </View>
                
                <Text style={[
                  cofreEstilos.valorMovimentacao,
                  item.tipo === 'deposito' ? 
                    cofreEstilos.valorPositivo : 
                    cofreEstilos.valorNegativo
                ]}>
                  {item.tipo === 'deposito' ? '+' : '-'} {formatarMoeda(item.valor)}
                </Text>
                
                {item.descricao ? (
                  <Text style={cofreEstilos.descricaoMovimentacao}>
                    {item.descricao}
                  </Text>
                ) : null}
                
                <Text style={cofreEstilos.saldoResultante}>
                  Saldo: {formatarMoeda(item.saldoNovo)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={cofreEstilos.secaoVazia}>
            <Ionicons name="lock-closed-outline" size={64} color={cores.textoSecundario} />
            <Text style={cofreEstilos.textoVazio}>
              Nenhuma movimentação registrada
            </Text>
            <Text style={cofreEstilos.dicaVazio}>
              Comece depositando ou retirando valores
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Movimentação */}
      <Modal
        visible={modalMovimentacaoVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalMovimentacaoVisivel(false)}
      >
        <View style={cofreEstilos.modalContainer}>
          <View style={cofreEstilos.modalConteudo}>
            <View style={cofreEstilos.cabecalhoModal}>
              <Text style={cofreEstilos.tituloModal}>
                {tipoMovimentacao === 'deposito' ? 'Depositar no Cofre' : 'Retirar do Cofre'}
              </Text>
              <TouchableOpacity onPress={() => setModalMovimentacaoVisivel(false)}>
                <Ionicons name="close" size={24} color={cores.branco} />
              </TouchableOpacity>
            </View>

            <View style={cofreEstilos.infoSaldoModal}>
              <Text style={cofreEstilos.labelSaldo}>Saldo Atual do Cofre:</Text>
              <Text style={cofreEstilos.valorSaldoModal}>
                {formatarMoeda(saldoCofre)}
              </Text>
            </View>

            <TextInput
              style={cofreEstilos.inputModal}
              placeholder="Valor da operação"
              placeholderTextColor={cores.textoSecundario}
              value={valorMovimentacao}
              onChangeText={setValorMovimentacao}
              keyboardType="numeric"
              maxLength={10}
            />

            <TextInput
              style={[cofreEstilos.inputModal, cofreEstilos.inputDescricao]}
              placeholder="Descrição (opcional)"
              placeholderTextColor={cores.textoSecundario}
              value={descricaoMovimentacao}
              onChangeText={setDescricaoMovimentacao}
              maxLength={100}
              multiline
              numberOfLines={3}
            />

            <View style={cofreEstilos.botoesModal}>
              <TouchableOpacity
                style={cofreEstilos.botaoCancelar}
                onPress={() => setModalMovimentacaoVisivel(false)}
              >
                <Text style={cofreEstilos.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  cofreEstilos.botaoConfirmar,
                  tipoMovimentacao === 'deposito' ? 
                    cofreEstilos.botaoConfirmarDeposito : 
                    cofreEstilos.botaoConfirmarRetirada
                ]}
                onPress={executarMovimentacao}
              >
                <Text style={cofreEstilos.textoBotaoConfirmar}>
                  {tipoMovimentacao === 'deposito' ? 'Depositar' : 'Retirar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Objetivo */}
      <Modal
        visible={modalObjetivoVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalObjetivoVisivel(false)}
      >
        <View style={cofreEstilos.modalContainer}>
          <View style={cofreEstilos.modalConteudo}>
            <View style={cofreEstilos.cabecalhoModal}>
              <Text style={cofreEstilos.tituloModal}>
                {objetivo ? 'Editar Objetivo' : 'Definir Objetivo'}
              </Text>
              <TouchableOpacity onPress={() => setModalObjetivoVisivel(false)}>
                <Ionicons name="close" size={24} color={cores.branco} />
              </TouchableOpacity>
            </View>

            {objetivo && (
              <View style={cofreEstilos.objetivoAtual}>
                <Text style={cofreEstilos.labelObjetivoAtual}>Objetivo Atual:</Text>
                <Text style={cofreEstilos.valorObjetivoAtual}>
                  {formatarMoeda(objetivo.valorObjetivo)}
                </Text>
                {objetivo.descricao && (
                  <Text style={cofreEstilos.descricaoObjetivoAtual}>
                    {objetivo.descricao}
                  </Text>
                )}
              </View>
            )}

            <TextInput
              style={cofreEstilos.inputModal}
              placeholder="Valor do objetivo"
              placeholderTextColor={cores.textoSecundario}
              value={valorObjetivo}
              onChangeText={setValorObjetivo}
              keyboardType="numeric"
              maxLength={12}
            />

            <TextInput
              style={[cofreEstilos.inputModal, cofreEstilos.inputDescricao]}
              placeholder="Descrição do objetivo (opcional)"
              placeholderTextColor={cores.textoSecundario}
              value={descricaoObjetivo}
              onChangeText={setDescricaoObjetivo}
              maxLength={100}
              multiline
              numberOfLines={3}
            />

            <View style={cofreEstilos.botoesObjetivo}>
              <TouchableOpacity
                style={cofreEstilos.botaoCancelar}
                onPress={() => setModalObjetivoVisivel(false)}
              >
                <Text style={cofreEstilos.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              {objetivo && (
                <TouchableOpacity
                  style={cofreEstilos.botaoExcluir}
                  onPress={excluirObjetivo}
                >
                  <Text style={cofreEstilos.textoBotaoExcluir}>Excluir</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={cofreEstilos.botaoSalvar}
                onPress={salvarObjetivo}
              >
                <Text style={cofreEstilos.textoBotaoSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CofreTela;