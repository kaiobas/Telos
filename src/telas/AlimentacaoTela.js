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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';
import estilosGlobais from '../estilos/estilosGlobais';
import Header from '../componentes/Header';
import ChatbotNutricional from '../componentes/ChatbotNutricional';

const AlimentacaoTela = ({ navigation }) => {
  const [gruposRefeicoes, setGruposRefeicoes] = useState([]);
  const [chatbotVisivel, setChatbotVisivel] = useState(false);
  const [modalGrupoVisivel, setModalGrupoVisivel] = useState(false);
  const [nomeGrupo, setNomeGrupo] = useState('');
  const [metaCalorias, setMetaCalorias] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [atualizando, setAtualizando] = useState(false);

  // Calcular totais do dia
  const calcularTotais = () => {
    const hoje = new Date().toDateString();
    let totais = { calorias: 0, proteinas: 0, carboidratos: 0, gordura: 0 };
    
    gruposRefeicoes.forEach(grupo => {
      grupo.refeicoes.forEach(refeicao => {
        if (new Date(refeicao.data).toDateString() === hoje) {
          totais.calorias += refeicao.calorias;
          totais.proteinas += refeicao.proteinas;
          totais.carboidratos += refeicao.carboidratos;
          totais.gordura += refeicao.gordura || 0;
        }
      });
    });
    
    return totais;
  };

  const calcularTotaisGrupo = (grupo) => {
    const hoje = new Date().toDateString();
    return grupo.refeicoes
      .filter(refeicao => new Date(refeicao.data).toDateString() === hoje)
      .reduce((totais, refeicao) => ({
        calorias: totais.calorias + refeicao.calorias,
        proteinas: totais.proteinas + refeicao.proteinas,
        carboidratos: totais.carboidratos + refeicao.carboidratos,
        gordura: totais.gordura + (refeicao.gordura || 0),
      }), { calorias: 0, proteinas: 0, carboidratos: 0, gordura: 0 });
  };

  const adicionarGrupoRefeicao = () => {
    if (!nomeGrupo.trim()) {
      Alert.alert('Erro', 'Nome do grupo é obrigatório.');
      return;
    }

    const novoGrupo = {
      id: Date.now(),
      nome: nomeGrupo.trim(),
      metaCalorias: parseFloat(metaCalorias) || 0,
      refeicoes: [],
      dataCriacao: new Date().toISOString(),
    };

    setGruposRefeicoes([...gruposRefeicoes, novoGrupo]);
    setModalGrupoVisivel(false);
    limparCamposGrupo();
    Alert.alert('Sucesso', 'Grupo de refeição criado com sucesso!');
  };

  const adicionarRefeicoesIA = (novasRefeicoes, grupoId = null) => {
    if (!grupoId && gruposRefeicoes.length === 0) {
      Alert.alert('Aviso', 'Crie um grupo de refeição primeiro para organizar seus alimentos.');
      return;
    }

    // Se não especificar grupo, usar o primeiro disponível
    const grupoAlvo = grupoId || gruposRefeicoes[0]?.id;
    
    const gruposAtualizados = gruposRefeicoes.map(grupo => {
      if (grupo.id === grupoAlvo) {
        return {
          ...grupo,
          refeicoes: [...grupo.refeicoes, ...novasRefeicoes]
        };
      }
      return grupo;
    });

    setGruposRefeicoes(gruposAtualizados);
  };

  const limparCamposGrupo = () => {
    setNomeGrupo('');
    setMetaCalorias('');
  };

  const excluirGrupo = (grupoId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este grupo? Todas as refeições serão perdidas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            setGruposRefeicoes(gruposRefeicoes.filter(grupo => grupo.id !== grupoId));
            Alert.alert('Sucesso', 'Grupo excluído com sucesso!');
          }
        }
      ]
    );
  };

  const excluirRefeicao = (grupoId, refeicaoId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta refeição?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            const gruposAtualizados = gruposRefeicoes.map(grupo => {
              if (grupo.id === grupoId) {
                return {
                  ...grupo,
                  refeicoes: grupo.refeicoes.filter(refeicao => refeicao.id !== refeicaoId)
                };
              }
              return grupo;
            });
            setGruposRefeicoes(gruposAtualizados);
            Alert.alert('Sucesso', 'Refeição excluída com sucesso!');
          }
        }
      ]
    );
  };

  const abrirChatbotParaGrupo = (grupo) => {
    setGrupoSelecionado(grupo);
    setChatbotVisivel(true);
  };

  const totais = calcularTotais();

  return (
    <View style={estilosGlobais.container}>
      <Header />
      
      {/* Cabeçalho da Tela */}
      <View style={estilosGlobais.cabecalho}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={estilosGlobais.titulo}>Alimentação</Text>
        </View>
        <TouchableOpacity
          style={estilosGlobais.botao}
          onPress={() => setModalGrupoVisivel(true)}
        >
          <Ionicons name="add" size={20} color={cores.fundo} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={estilosGlobais.conteudo}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => setAtualizando(false)}
            tintColor={cores.primaria}
          />
        }
      >
        {/* Resumo do Dia */}
        <View style={estilosGlobais.cartaoElevado}>
          <Text style={estilosGlobais.subtitulo}>Resumo de Hoje</Text>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            marginTop: 15,
            paddingVertical: 10 
          }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[estilosGlobais.textoNormal, { 
                color: '#ff6b35', 
                fontWeight: 'bold',
                fontSize: 18 
              }]}>
                {totais.calorias.toFixed(0)}
              </Text>
              <Text style={[estilosGlobais.textoPequeno, { color: cores.textoSecundario }]}>
                Kcal
              </Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[estilosGlobais.textoNormal, { 
                color: '#4ecdc4', 
                fontWeight: 'bold',
                fontSize: 18 
              }]}>
                {totais.proteinas.toFixed(1)}
              </Text>
              <Text style={[estilosGlobais.textoPequeno, { color: cores.textoSecundario }]}>
                Proteína (g)
              </Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[estilosGlobais.textoNormal, { 
                color: '#45b7d1', 
                fontWeight: 'bold',
                fontSize: 18 
              }]}>
                {totais.carboidratos.toFixed(1)}
              </Text>
              <Text style={[estilosGlobais.textoPequeno, { color: cores.textoSecundario }]}>
                Carboidrato (g)
              </Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[estilosGlobais.textoNormal, { 
                color: '#f39c12', 
                fontWeight: 'bold',
                fontSize: 18 
              }]}>
                {totais.gordura.toFixed(1)}
              </Text>
              <Text style={[estilosGlobais.textoPequeno, { color: cores.textoSecundario }]}>
                Gordura (g)
              </Text>
            </View>
          </View>
        </View>

        {/* Lista de Grupos de Refeições */}
        {gruposRefeicoes.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Ionicons name="restaurant-outline" size={64} color={cores.textoSecundario} />
            <Text style={estilosGlobais.textoNormal}>
              Nenhum grupo de refeição criado
            </Text>
            <Text style={estilosGlobais.textoPequeno}>
              Toque no + para criar um grupo
            </Text>
          </View>
        ) : (
          gruposRefeicoes.map((grupo) => {
            const totaisGrupo = calcularTotaisGrupo(grupo);
            const percentualMeta = grupo.metaCalorias > 0 ? (totaisGrupo.calorias / grupo.metaCalorias) * 100 : 0;
            
            return (
              <View key={grupo.id} style={estilosGlobais.cartaoElevado}>
                {/* Cabeçalho do Grupo */}
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: 12
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[estilosGlobais.subtitulo, { marginBottom: 8 }]}>
                      {grupo.nome}
                    </Text>
                    
                    {/* Informações de calorias */}
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center',
                      backgroundColor: cores.fundoTerciario,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                      alignSelf: 'flex-start'
                    }}>
                      <Text style={[estilosGlobais.textoPequeno, { 
                        color: cores.texto,
                        fontWeight: '600'
                      }]}>
                        {totaisGrupo.calorias.toFixed(0)}
                      </Text>
                      {grupo.metaCalorias > 0 && (
                        <>
                          <Text style={[estilosGlobais.textoPequeno, { 
                            color: cores.textoSecundario,
                            marginHorizontal: 4
                          }]}>
                            / {grupo.metaCalorias.toFixed(0)}
                          </Text>
                          <Text style={[estilosGlobais.textoPequeno, { 
                            color: percentualMeta >= 100 ? '#22c55e' : 
                                   percentualMeta >= 80 ? '#f39c12' : '#ef4444',
                            fontWeight: '600',
                            marginLeft: 4
                          }]}>
                            ({percentualMeta.toFixed(0)}%)
                          </Text>
                        </>
                      )}
                      <Text style={[estilosGlobais.textoPequeno, { 
                        color: cores.textoSecundario,
                        marginLeft: 4
                      }]}>
                        kcal
                      </Text>
                    </View>
                  </View>
                  
                  {/* Botões de ação */}
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity 
                      style={[estilosGlobais.botao, { 
                        paddingHorizontal: 12, 
                        paddingVertical: 8,
                        minWidth: 40,
                        alignItems: 'center'
                      }]}
                      onPress={() => abrirChatbotParaGrupo(grupo)}
                    >
                      <Ionicons name="sparkles" size={16} color={cores.fundo} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={{ 
                        paddingHorizontal: 12, 
                        paddingVertical: 8,
                        minWidth: 40,
                        alignItems: 'center'
                      }}
                      onPress={() => excluirGrupo(grupo.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#ff4757" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Lista de Refeições do Grupo */}
                {grupo.refeicoes.length > 0 ? (
                  <View style={{ 
                    borderTopWidth: 1,
                    borderTopColor: cores.borda,
                    paddingTop: 12
                  }}>
                    <Text style={[estilosGlobais.textoPequeno, { 
                      color: cores.textoSecundario,
                      marginBottom: 8,
                      fontWeight: '600'
                    }]}>
                      ALIMENTOS ({grupo.refeicoes.length})
                    </Text>
                    
                    {grupo.refeicoes.map((refeicao) => (
                      <View key={refeicao.id} style={{ 
                        backgroundColor: cores.fundoTerciario, 
                        borderRadius: 8, 
                        padding: 12, 
                        marginBottom: 8,
                        borderLeftWidth: 3,
                        borderLeftColor: '#4ecdc4'
                      }}>
                        <View style={{ 
                          flexDirection: 'row', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start' 
                        }}>
                          <View style={{ flex: 1 }}>
                            <Text style={[estilosGlobais.textoNormal, { 
                              fontWeight: '600',
                              marginBottom: 4
                            }]}>
                              {refeicao.nome}
                            </Text>
                            
                            {/* Macros em linha */}
                            <View style={{ 
                              flexDirection: 'row', 
                              flexWrap: 'wrap',
                              gap: 12 
                            }}>
                              <Text style={[estilosGlobais.textoPequeno, { 
                                color: '#ff6b35',
                                fontWeight: '600'
                              }]}>
                                {refeicao.calorias} kcal
                              </Text>
                              <Text style={[estilosGlobais.textoPequeno, { 
                                color: '#4ecdc4' 
                              }]}>
                                P: {refeicao.proteinas}g
                              </Text>
                              <Text style={[estilosGlobais.textoPequeno, { 
                                color: '#45b7d1' 
                              }]}>
                                C: {refeicao.carboidratos}g
                              </Text>
                              {refeicao.gordura > 0 && (
                                <Text style={[estilosGlobais.textoPequeno, { 
                                  color: '#f39c12' 
                                }]}>
                                  G: {refeicao.gordura}g
                                </Text>
                              )}
                            </View>
                          </View>
                          
                          <TouchableOpacity 
                            onPress={() => excluirRefeicao(grupo.id, refeicao.id)}
                            style={{ 
                              padding: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(239, 68, 68, 0.1)'
                            }}
                          >
                            <Ionicons name="close" size={14} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={{
                    borderTopWidth: 1,
                    borderTopColor: cores.borda,
                    paddingTop: 12,
                    alignItems: 'center',
                    paddingVertical: 20
                  }}>
                    <Ionicons name="restaurant-outline" size={32} color={cores.textoSecundario} />
                    <Text style={[estilosGlobais.textoPequeno, { 
                      color: cores.textoSecundario,
                      marginTop: 8,
                      textAlign: 'center'
                    }]}>
                      Nenhum alimento adicionado
                    </Text>
                    <Text style={[estilosGlobais.textoPequeno, { 
                      color: cores.textoTerciario,
                      marginTop: 4,
                      textAlign: 'center'
                    }]}>
                      Toque no ✨ para adicionar com IA
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Modal do Chatbot Nutricional */}
      <Modal
        visible={chatbotVisivel}
        animationType="slide"
        onRequestClose={() => setChatbotVisivel(false)}
      >
        <ChatbotNutricional
          onAddRefeicoes={(refeicoes) => adicionarRefeicoesIA(refeicoes, grupoSelecionado?.id)}
          onClose={() => {
            setChatbotVisivel(false);
            setGrupoSelecionado(null);
          }}
        />
      </Modal>

      {/* Modal de Adicionar Grupo de Refeição */}
      <Modal
        visible={modalGrupoVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalGrupoVisivel(false)}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          justifyContent: 'center', 
          padding: 20 
        }}>
          <View style={[estilosGlobais.cartaoElevado, { maxHeight: '80%' }]}>
            {/* Cabeçalho do Modal */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 20,
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderBottomColor: cores.borda
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="restaurant" size={24} color={cores.primaria} />
                <Text style={estilosGlobais.subtitulo}>Novo Grupo de Refeição</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setModalGrupoVisivel(false)}
                style={{ padding: 4 }}
              >
                <Ionicons name="close" size={24} color={cores.texto} />
              </TouchableOpacity>
            </View>

            {/* Campos do formulário */}
            <View style={{ marginBottom: 20 }}>
              <Text style={[estilosGlobais.textoPequeno, { 
                color: cores.textoSecundario,
                marginBottom: 8,
                fontWeight: '600'
              }]}>
                NOME DO GRUPO
              </Text>
              <TextInput
                style={estilosGlobais.input}
                placeholder="Ex: Café da manhã, Almoço, Jantar"
                placeholderTextColor={cores.textoSecundario}
                value={nomeGrupo}
                onChangeText={setNomeGrupo}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={[estilosGlobais.textoPequeno, { 
                color: cores.textoSecundario,
                marginBottom: 8,
                fontWeight: '600'
              }]}>
                META DE CALORIAS (OPCIONAL)
              </Text>
              <TextInput
                style={estilosGlobais.input}
                placeholder="Ex: 500, 800, 1200"
                placeholderTextColor={cores.textoSecundario}
                value={metaCalorias}
                onChangeText={setMetaCalorias}
                keyboardType="numeric"
              />
            </View>

            {/* Dica */}
            <View style={{ 
              backgroundColor: cores.fundoTerciario, 
              padding: 15, 
              borderRadius: 8, 
              marginBottom: 20,
              borderLeftWidth: 3,
              borderLeftColor: cores.primaria
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Ionicons name="bulb" size={16} color={cores.primaria} />
                <Text style={[estilosGlobais.textoPequeno, { 
                  color: cores.texto,
                  fontWeight: '600'
                }]}>
                  DICA
                </Text>
              </View>
              <Text style={[estilosGlobais.textoPequeno, { 
                color: cores.textoSecundario,
                lineHeight: 18
              }]}>
                Depois de criar o grupo, use o botão ✨ para adicionar alimentos com ajuda da IA nutricional
              </Text>
            </View>

            {/* Botões */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={[estilosGlobais.botaoSecundario, { flex: 1 }]}
                onPress={() => setModalGrupoVisivel(false)}
              >
                <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[estilosGlobais.botao, { flex: 1 }]}
                onPress={adicionarGrupoRefeicao}
              >
                <Text style={estilosGlobais.textoBotao}>Criar Grupo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AlimentacaoTela;