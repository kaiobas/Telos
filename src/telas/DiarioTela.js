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
  salvarEntradaDiario, 
  carregarEntradasDiario, 
  excluirEntradaDiario,
  atualizarEntradaDiario 
} from '../armazenamento/armazenamentoLocal';

const DiarioTela = () => {
  const [entradas, setEntradas] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalLeitura, setModalLeitura] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [modoSelecao, setModoSelecao] = useState(false);
  const [entradasSelecionadas, setEntradasSelecionadas] = useState(new Set());
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [entradaEdicao, setEntradaEdicao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setAtualizando(true);
      const entradasCarregadas = await carregarEntradasDiario();
      setEntradas(entradasCarregadas);
    } catch (error) {
      console.error('Erro ao carregar entradas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as entradas do diário.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  };

  const adicionarEntrada = async () => {
    if (!titulo.trim() && !conteudo.trim()) {
      Alert.alert('Erro', 'Por favor, adicione um título ou conteúdo para a entrada.');
      return;
    }

    try {
      const novaEntrada = {
        titulo: titulo.trim() || 'Sem título',
        conteudo: conteudo.trim(),
      };

      const sucesso = await salvarEntradaDiario(novaEntrada);
      
      if (sucesso) {
        await carregarDados();
        limparCampos();
        setModalVisivel(false);
        Alert.alert('Sucesso', 'Entrada salva com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar a entrada.');
      }
    } catch (error) {
      console.error('Erro ao adicionar entrada:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a entrada.');
    }
  };

  const editarEntrada = async () => {
    if (!titulo.trim() && !conteudo.trim()) {
      Alert.alert('Erro', 'Por favor, mantenha um título ou conteúdo para a entrada.');
      return;
    }

    try {
      const dadosAtualizados = {
        titulo: titulo.trim() || 'Sem título',
        conteudo: conteudo.trim(),
      };

      const sucesso = await atualizarEntradaDiario(entradaEdicao.id, dadosAtualizados);
      
      if (sucesso) {
        await carregarDados();
        fecharModais();
        Alert.alert('Sucesso', 'Entrada atualizada com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar a entrada.');
      }
    } catch (error) {
      console.error('Erro ao editar entrada:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar a entrada.');
    }
  };

  const excluirEntrada = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta entrada? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const sucesso = await excluirEntradaDiario(id);
              if (sucesso) {
                await carregarDados();
                Alert.alert('Sucesso', 'Entrada excluída com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível excluir a entrada.');
              }
            } catch (error) {
              console.error('Erro ao excluir entrada:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir a entrada.');
            }
          }
        }
      ]
    );
  };

  const abrirEdicao = (entrada) => {
    setEntradaEdicao(entrada);
    setTitulo(entrada.titulo);
    setConteudo(entrada.conteudo);
    setModoEdicao(false);
    setModalLeitura(true);
  };

  const ativarModoEdicao = () => {
    setModoEdicao(true);
  };

  const cancelarEdicao = () => {
    if (entradaEdicao) {
      setTitulo(entradaEdicao.titulo);
      setConteudo(entradaEdicao.conteudo);
    }
    setModoEdicao(false);
  };

  const limparCampos = () => {
    setTitulo('');
    setConteudo('');
  };

  const fecharModais = () => {
    setModalVisivel(false);
    setModalLeitura(false);
    setModoEdicao(false);
    setEntradaEdicao(null);
    limparCampos();
  };

  const ativarModoSelecao = () => {
    setModoSelecao(true);
    setEntradasSelecionadas(new Set());
  };

  const desativarModoSelecao = () => {
    setModoSelecao(false);
    setEntradasSelecionadas(new Set());
  };

  const toggleSelecaoEntrada = (id) => {
    const novasSelecoes = new Set(entradasSelecionadas);
    if (novasSelecoes.has(id)) {
      novasSelecoes.delete(id);
    } else {
      novasSelecoes.add(id);
    }
    setEntradasSelecionadas(novasSelecoes);
  };

  const selecionarTodas = () => {
    if (entradasSelecionadas.size === entradas.length) {
      setEntradasSelecionadas(new Set());
    } else {
      setEntradasSelecionadas(new Set(entradas.map(entrada => entrada.id)));
    }
  };

  const excluirEntradasSelecionadas = () => {
    if (entradasSelecionadas.size === 0) {
      Alert.alert('Aviso', 'Nenhuma entrada selecionada para exclusão.');
      return;
    }

    Alert.alert(
      'Confirmar Exclusão Múltipla',
      `Tem certeza que deseja excluir ${entradasSelecionadas.size} entrada(s)? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              for (const id of entradasSelecionadas) {
                await excluirEntradaDiario(id);
              }
              await carregarDados();
              desativarModoSelecao();
              Alert.alert('Sucesso', `${entradasSelecionadas.size} entrada(s) excluída(s) com sucesso!`);
            } catch (error) {
              console.error('Erro ao excluir entradas:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir as entradas.');
            }
          }
        }
      ]
    );
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncarTexto = (texto, limite = 150) => {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  };

return (
    <View style={estilosGlobais.container}>
        <Header />
        
        {/* Cabeçalho da Seção */}
        <View style={estilos.cabecalho}>
            {modoSelecao ? (
                <>
                    <View>
                        <Text style={estilosGlobais.titulo}>Diário</Text>
                        <Text style={estilos.textoSelecao}>
                            {entradasSelecionadas.size} de {entradas.length} selecionada(s)
                        </Text>
                    </View>
                    <View style={estilos.botoesSelecao}>
                        <TouchableOpacity
                            style={estilos.botaoSelecao}
                            onPress={selecionarTodas}
                        >
                            <Ionicons 
                                name={entradasSelecionadas.size === entradas.length ? "checkbox" : "square-outline"} 
                                size={20} 
                                color={cores.primaria} 
                            />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[estilos.botaoSelecao, { backgroundColor: '#ff4444' }]}
                            onPress={excluirEntradasSelecionadas}
                        >
                            <Ionicons name="trash-outline" size={20} color={cores.fundo} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={estilos.botaoSelecao}
                            onPress={desativarModoSelecao}
                        >
                            <Ionicons name="close" size={20} color={cores.primaria} />
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                    <Text style={estilosGlobais.titulo}>Diário</Text>
                    <View style={estilos.botoesAcoes}>
                        {entradas.length > 0 && (
                            <TouchableOpacity
                                style={estilos.botaoSecundario}
                                onPress={ativarModoSelecao}
                            >
                                <Ionicons name="checkmark-circle-outline" size={20} color={cores.primaria} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={estilos.botaoAdicionar}
                            onPress={() => setModalVisivel(true)}
                        >
                            <Ionicons name="add" size={24} color={cores.fundo} />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>

        {/* Lista de Entradas */}
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
            {entradas.length > 0 ? (
                entradas.map((entrada) => (
                    <TouchableOpacity 
                        key={entrada.id} 
                        style={[
                            estilosGlobais.cartaoElevado,
                            modoSelecao && entradasSelecionadas.has(entrada.id) && estilos.entradaSelecionada
                        ]}
                        onPress={() => {
                            if (modoSelecao) {
                                toggleSelecaoEntrada(entrada.id);
                            } else {
                                abrirEdicao(entrada);
                            }
                        }}
                    >
                        <View style={estilos.cabecalhoEntrada}>
                            {modoSelecao && (
                                <TouchableOpacity
                                    style={estilos.checkbox}
                                    onPress={() => toggleSelecaoEntrada(entrada.id)}
                                >
                                    <Ionicons 
                                        name={entradasSelecionadas.has(entrada.id) ? "checkbox" : "square-outline"} 
                                        size={24} 
                                        color={entradasSelecionadas.has(entrada.id) ? cores.primaria : cores.textoTerciario} 
                                    />
                                </TouchableOpacity>
                            )}
                            
                            <Text style={[estilos.tituloEntrada, modoSelecao && { flex: 0.8 }]}>
                                {entrada.titulo}
                            </Text>
                            
                            {!modoSelecao && (
                                <View style={estilos.acoesEntrada}>
                                    <TouchableOpacity
                                        style={estilos.botaoAcao}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            excluirEntrada(entrada.id);
                                        }}
                                    >
                                        <Ionicons name="trash-outline" size={20} color={cores.primaria} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        
                        <Text style={estilos.dataEntrada}>
                            {formatarData(entrada.data)}
                        </Text>
                        
                        {entrada.conteudo && (
                            <Text style={estilos.conteudoEntrada}>
                                {truncarTexto(entrada.conteudo)}
                            </Text>
                        )}
                    </TouchableOpacity>
                ))
            ) : (
                <View style={estilos.estadoVazio}>
                    <Ionicons name="book-outline" size={64} color={cores.textoTerciario} />
                    <Text style={estilos.textoVazio}>Seu diário está vazio</Text>
                    <Text style={estilos.dicaVazio}>
                        Comece escrevendo sua primeira entrada tocando no botão +
                    </Text>
                </View>
            )}
            <View style={{ height: 32 }} />
        </ScrollView>

        {/* Modal para Nova Entrada */}
        <Modal
            visible={modalVisivel}
            transparent={true}
            animationType="slide"
            onRequestClose={fecharModais}
        >
            <View style={estilos.modalContainer}>
                <View style={estilos.modalConteudo}>
                    <View style={estilos.cabecalhoModal}>
                        <Text style={estilosGlobais.subtitulo}>Nova Entrada</Text>
                        <TouchableOpacity onPress={fecharModais}>
                            <Ionicons name="close" size={24} color={cores.primaria} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={estilosGlobais.input}
                        placeholder="Título da entrada"
                        placeholderTextColor={cores.textoTerciario}
                        value={titulo}
                        onChangeText={setTitulo}
                        maxLength={100}
                    />

                    <TextInput
                        style={[estilosGlobais.input, estilos.inputConteudo]}
                        placeholder="O que você quer registrar hoje?"
                        placeholderTextColor={cores.textoTerciario}
                        value={conteudo}
                        onChangeText={setConteudo}
                        multiline={true}
                        numberOfLines={10}
                        textAlignVertical="top"
                        maxLength={5000}
                    />

                    <Text style={estilos.contadorCaracteres}>
                        {conteudo.length}/5000 caracteres
                    </Text>

                    <View style={estilos.botoesModal}>
                        <TouchableOpacity
                            style={estilosGlobais.botaoSecundario}
                            onPress={fecharModais}
                        >
                            <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={estilosGlobais.botao}
                            onPress={adicionarEntrada}
                        >
                            <Text style={estilosGlobais.textoBotao}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {/* Modal para Editar Entrada */}
        <Modal
            visible={modalLeitura}
            transparent={true}
            animationType="slide"
            onRequestClose={fecharModais}
        >
            <View style={estilos.modalContainer}>
                <View style={[estilos.modalConteudo, estilos.modalLeitura]}>
                    <View style={estilos.cabecalhoModal}>
                        <Text style={estilosGlobais.subtitulo}>
                            {modoEdicao ? 'Editar Entrada' : 'Entrada do Diário'}
                        </Text>
                        <TouchableOpacity onPress={fecharModais}>
                            <Ionicons name="close" size={24} color={cores.primaria} />
                        </TouchableOpacity>
                    </View>

                    {modoEdicao ? (
                        <>
                            <TextInput
                                style={estilosGlobais.input}
                                placeholder="Título da entrada"
                                placeholderTextColor={cores.textoTerciario}
                                value={titulo}
                                onChangeText={setTitulo}
                                maxLength={100}
                            />

                            <TextInput
                                style={[estilosGlobais.input, estilos.inputConteudoLeitura]}
                                placeholder="Conteúdo da entrada"
                                placeholderTextColor={cores.textoTerciario}
                                value={conteudo}
                                onChangeText={setConteudo}
                                multiline={true}
                                numberOfLines={12}
                                textAlignVertical="top"
                                maxLength={5000}
                            />

                            <Text style={estilos.contadorCaracteres}>
                                {conteudo.length}/5000 caracteres
                            </Text>
                        </>
                    ) : (
                        <ScrollView style={estilos.conteudoLeitura} showsVerticalScrollIndicator={false}>
                            <Text style={estilos.tituloLeitura}>{titulo}</Text>
                            
                            <Text style={estilos.dataLeitura}>
                                {entradaEdicao && formatarData(entradaEdicao.data)}
                            </Text>
                            
                            <Text style={estilos.textoLeitura}>{conteudo}</Text>
                        </ScrollView>
                    )}

                    <View style={estilos.botoesModal}>
                        {modoEdicao ? (
                            <>
                                <TouchableOpacity
                                    style={estilosGlobais.botaoSecundario}
                                    onPress={cancelarEdicao}
                                >
                                    <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={estilosGlobais.botao}
                                    onPress={editarEntrada}
                                >
                                    <Text style={estilosGlobais.textoBotao}>Salvar</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={estilosGlobais.botaoSecundario}
                                    onPress={fecharModais}
                                >
                                    <Text style={estilosGlobais.textoBotaoSecundario}>Fechar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={estilosGlobais.botao}
                                    onPress={ativarModoEdicao}
                                >
                                    <Text style={estilosGlobais.textoBotao}>Editar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
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

  botoesAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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

  // Modo de seleção
  textoSelecao: {
    fontSize: 12,
    color: cores.textoTerciario,
    marginTop: 2,
  },

  botoesSelecao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  botaoSelecao: {
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

  entradaSelecionada: {
    borderWidth: 2,
    borderColor: cores.primaria,
    backgroundColor: cores.fundoTerciario,
  },

  checkbox: {
    marginRight: 12,
    padding: 4,
  },

  // Entradas
  cabecalhoEntrada: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  tituloEntrada: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    flex: 1,
    marginRight: 8,
  },

  acoesEntrada: {
    flexDirection: 'row',
  },

  botaoAcao: {
    padding: 4,
    marginLeft: 8,
  },

  dataEntrada: {
    fontSize: 12,
    color: cores.textoTerciario,
    marginBottom: 8,
  },

  conteudoEntrada: {
    fontSize: 14,
    color: cores.textoSecundario,
    lineHeight: 20,
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
    fontSize: 20,
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

  inputConteudo: {
    height: 200,
    textAlignVertical: 'top',
  },

  contadorCaracteres: {
    fontSize: 12,
    color: cores.textoTerciario,
    textAlign: 'right',
    marginBottom: 20,
  },

  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Modal de Leitura
  modalLeitura: {
    maxHeight: '85%',
    height: '85%',
  },

  conteudoLeitura: {
    flex: 1,
    marginBottom: 20,
  },

  tituloLeitura: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 8,
    lineHeight: 32,
  },

  dataLeitura: {
    fontSize: 14,
    color: cores.textoTerciario,
    marginBottom: 20,
    fontStyle: 'italic',
  },

  textoLeitura: {
    fontSize: 16,
    color: cores.textoSecundario,
    lineHeight: 24,
    textAlign: 'justify',
  },

  inputConteudoLeitura: {
    height: 250,
    textAlignVertical: 'top',
  },
});

export default DiarioTela;
