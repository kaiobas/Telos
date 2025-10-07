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

const AcademiaTela = ({ navigation }) => {
  const [rotinaSemanal, setRotinaSemanal] = useState({});
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tipoModal, setTipoModal] = useState('rotina'); // 'rotina', 'grupo', 'exercicio'
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [nomeRotina, setNomeRotina] = useState('');
  const [gruposMuscularesSelecionados, setGruposMuscularesSelecionados] = useState([]);
  const [nomeExercicio, setNomeExercicio] = useState('');
  const [series, setSeries] = useState('');
  const [repeticoes, setRepeticoes] = useState('');
  const [peso, setPeso] = useState('');
  const [atualizando, setAtualizando] = useState(false);

  const diasSemana = [
    { key: 'segunda', nome: 'Segunda-feira', abrev: 'SEG' },
    { key: 'terca', nome: 'Terça-feira', abrev: 'TER' },
    { key: 'quarta', nome: 'Quarta-feira', abrev: 'QUA' },
    { key: 'quinta', nome: 'Quinta-feira', abrev: 'QUI' },
    { key: 'sexta', nome: 'Sexta-feira', abrev: 'SEX' },
    { key: 'sabado', nome: 'Sábado', abrev: 'SAB' },
    { key: 'domingo', nome: 'Domingo', abrev: 'DOM' }
  ];

  const gruposMusculares = [
    { 
      id: 'peito', 
      nome: 'Peito', 
      cor: '#e74c3c',
      icone: 'fitness-outline',
      descricao: 'Peitoral maior e menor'
    },
    { 
      id: 'costas', 
      nome: 'Costas', 
      cor: '#3498db',
      icone: 'body-outline',
      descricao: 'Grande dorsal, trapézio, romboides'
    },
    { 
      id: 'ombros', 
      nome: 'Ombros', 
      cor: '#f39c12',
      icone: 'golf-outline',
      descricao: 'Deltoides anterior, posterior, lateral'
    },
    { 
      id: 'biceps', 
      nome: 'Bíceps', 
      cor: '#9b59b6',
      icone: 'barbell-outline',
      descricao: 'Bíceps braquial e braquial anterior'
    },
    { 
      id: 'triceps', 
      nome: 'Tríceps', 
      cor: '#e67e22',
      icone: 'fitness-outline',
      descricao: 'Tríceps braquial (3 cabeças)'
    },
    { 
      id: 'pernas', 
      nome: 'Pernas', 
      cor: '#2ecc71',
      icone: 'walk-outline',
      descricao: 'Quadríceps, posterior, adutores'
    },
    { 
      id: 'gluteos', 
      nome: 'Glúteos', 
      cor: '#e91e63',
      icone: 'body-outline',
      descricao: 'Glúteo máximo, médio e mínimo'
    },
    { 
      id: 'abdomen', 
      nome: 'Abdômen', 
      cor: '#00bcd4',
      icone: 'apps-outline',
      descricao: 'Reto abdominal, oblíquos'
    },
    { 
      id: 'panturrilha', 
      nome: 'Panturrilha', 
      cor: '#795548',
      icone: 'walk-outline',
      descricao: 'Gastrocnêmio e sóleo'
    },
    { 
      id: 'antebraco', 
      nome: 'Antebraço', 
      cor: '#607d8b',
      icone: 'hand-left-outline',
      descricao: 'Flexores e extensores'
    }
  ];

  const adicionarRotina = () => {
    if (!nomeRotina.trim() || !diaSelecionado) {
      Alert.alert('Erro', 'Nome da rotina e dia da semana são obrigatórios.');
      return;
    }

    const novaRotina = {
      id: Date.now(),
      nome: nomeRotina.trim(),
      dia: diaSelecionado,
      gruposMusculares: [],
      dataCriacao: new Date().toISOString(),
      ultimaExecucao: null,
    };

    setRotinaSemanal(prev => ({
      ...prev,
      [diaSelecionado]: novaRotina
    }));
    
    setModalVisivel(false);
    setNomeRotina('');
    setDiaSelecionado(null);
    Alert.alert('Sucesso', 'Rotina criada com sucesso!');
  };

  const adicionarGrupoMuscular = () => {
    if (gruposMuscularesSelecionados.length === 0 || !diaSelecionado) {
      Alert.alert('Erro', 'Selecione pelo menos um grupo muscular.');
      return;
    }

    const rotina = rotinaSemanal[diaSelecionado];
    if (!rotina) {
      Alert.alert('Erro', 'Rotina não encontrada.');
      return;
    }

    const novosGrupos = gruposMuscularesSelecionados.map(grupoId => ({
      id: Date.now() + Math.random(),
      grupoMuscularId: grupoId,
      exercicios: []
    }));

    setRotinaSemanal(prev => ({
      ...prev,
      [diaSelecionado]: {
        ...rotina,
        gruposMusculares: [...rotina.gruposMusculares, ...novosGrupos]
      }
    }));

    setModalVisivel(false);
    setGruposMuscularesSelecionados([]);
    Alert.alert('Sucesso', 'Grupos musculares adicionados com sucesso!');
  };

  const adicionarExercicio = () => {
    if (!nomeExercicio.trim()) {
      Alert.alert('Erro', 'Nome do exercício é obrigatório.');
      return;
    }

    const novoExercicio = {
      id: Date.now(),
      nome: nomeExercicio.trim(),
      series: parseInt(series) || 0,
      repeticoes: parseInt(repeticoes) || 0,
      peso: parseFloat(peso) || 0,
    };

    const rotina = rotinaSemanal[diaSelecionado];
    const gruposAtualizados = rotina.gruposMusculares.map(grupo => {
      if (grupo.id === grupoSelecionado.id) {
        return {
          ...grupo,
          exercicios: [...grupo.exercicios, novoExercicio]
        };
      }
      return grupo;
    });

    setRotinaSemanal(prev => ({
      ...prev,
      [diaSelecionado]: {
        ...rotina,
        gruposMusculares: gruposAtualizados
      }
    }));

    setModalVisivel(false);
    limparCamposExercicio();
    Alert.alert('Sucesso', 'Exercício adicionado com sucesso!');
  };

  const limparCamposExercicio = () => {
    setNomeExercicio('');
    setSeries('');
    setRepeticoes('');
    setPeso('');
  };

  const abrirModalRotina = (dia) => {
    setDiaSelecionado(dia);
    setTipoModal('rotina');
    setModalVisivel(true);
  };

  const abrirModalGrupoMuscular = (dia) => {
    setDiaSelecionado(dia);
    setTipoModal('grupo');
    setModalVisivel(true);
  };

  const abrirModalExercicio = (dia, grupo) => {
    setDiaSelecionado(dia);
    setGrupoSelecionado(grupo);
    setTipoModal('exercicio');
    setModalVisivel(true);
  };

  const toggleGrupoMuscular = (grupoId) => {
    setGruposMuscularesSelecionados(prev => 
      prev.includes(grupoId) 
        ? prev.filter(id => id !== grupoId)
        : [...prev, grupoId]
    );
  };

  const executarRotina = (dia) => {
    const rotina = rotinaSemanal[dia];
    if (!rotina) return;

    setRotinaSemanal(prev => ({
      ...prev,
      [dia]: {
        ...rotina,
        ultimaExecucao: new Date().toISOString()
      }
    }));
    
    Alert.alert('Treino Concluído', `Parabéns! Você completou a rotina "${rotina.nome}"`);
  };

  const excluirRotina = (dia) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta rotina? Todos os grupos e exercícios serão perdidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            setRotinaSemanal(prev => {
              const nova = { ...prev };
              delete nova[dia];
              return nova;
            });
            Alert.alert('Sucesso', 'Rotina excluída com sucesso!');
          }
        }
      ]
    );
  };

  const excluirGrupoMuscular = (dia, grupoId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este grupo muscular? Todos os exercícios serão perdidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            const rotina = rotinaSemanal[dia];
            setRotinaSemanal(prev => ({
              ...prev,
              [dia]: {
                ...rotina,
                gruposMusculares: rotina.gruposMusculares.filter(grupo => grupo.id !== grupoId)
              }
            }));
            Alert.alert('Sucesso', 'Grupo muscular excluído com sucesso!');
          }
        }
      ]
    );
  };

  const excluirExercicio = (dia, grupoId, exercicioId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este exercício?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            const rotina = rotinaSemanal[dia];
            const gruposAtualizados = rotina.gruposMusculares.map(grupo => {
              if (grupo.id === grupoId) {
                return {
                  ...grupo,
                  exercicios: grupo.exercicios.filter(exercicio => exercicio.id !== exercicioId)
                };
              }
              return grupo;
            });

            setRotinaSemanal(prev => ({
              ...prev,
              [dia]: {
                ...rotina,
                gruposMusculares: gruposAtualizados
              }
            }));
            Alert.alert('Sucesso', 'Exercício excluído com sucesso!');
          }
        }
      ]
    );
  };

  return (
    <View style={estilosGlobais.container}>
      <Header />
      
      {/* Cabeçalho da Tela */}
      <View style={estilosGlobais.cabecalho}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={estilosGlobais.titulo}>Academia</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={[estilosGlobais.botaoSecundario, { paddingHorizontal: 12 }]}
            onPress={() => {
              const hoje = new Date().getDay();
              const diasMap = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
              const diaHoje = diasMap[hoje];
              
              if (rotinaSemanal[diaHoje]) {
                executarRotina(diaHoje);
              } else {
                Alert.alert('Aviso', 'Não há rotina para hoje. Crie uma rotina primeiro.');
              }
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Ionicons name="play" size={16} color={cores.primaria} />
              <Text style={{ color: cores.primaria, fontSize: 12, fontWeight: '600' }}>Hoje</Text>
            </View>
          </TouchableOpacity>
        </View>
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
        {/* Rotina Semanal */}
        {diasSemana.map((dia) => {
          const rotina = rotinaSemanal[dia.key];
          const hoje = new Date().getDay();
          const diasMap = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
          const ehHoje = diasMap[hoje] === dia.key;

          return (
            <View key={dia.key} style={[
              estilosGlobais.cartaoElevado,
              ehHoje && { borderLeftWidth: 4, borderLeftColor: cores.primaria }
            ]}>
              {/* Cabeçalho do Dia */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 12
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{
                    backgroundColor: ehHoje ? cores.primaria : cores.fundoTerciario,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4
                  }}>
                    <Text style={[
                      estilosGlobais.textoPequeno,
                      { 
                        color: ehHoje ? cores.fundo : cores.textoSecundario,
                        fontWeight: '600'
                      }
                    ]}>
                      {dia.abrev}
                    </Text>
                  </View>
                  <View>
                    <Text style={[estilosGlobais.subtitulo, { fontSize: 16 }]}>
                      {dia.nome}
                    </Text>
                    {rotina && (
                      <Text style={[estilosGlobais.textoPequeno, { color: cores.textoSecundario }]}>
                        {rotina.nome}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 5 }}>
                  {rotina ? (
                    <>
                      <TouchableOpacity 
                        style={[estilosGlobais.botaoSecundario, { paddingHorizontal: 10, paddingVertical: 6 }]}
                        onPress={() => abrirModalGrupoMuscular(dia.key)}
                      >
                        <Ionicons name="add" size={14} color={cores.primaria} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[estilosGlobais.botao, { paddingHorizontal: 10, paddingVertical: 6 }]}
                        onPress={() => executarRotina(dia.key)}
                      >
                        <Ionicons name="play" size={14} color={cores.fundo} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={{ paddingHorizontal: 10, paddingVertical: 6 }}
                        onPress={() => excluirRotina(dia.key)}
                      >
                        <Ionicons name="trash-outline" size={14} color="#ff4757" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity 
                      style={[estilosGlobais.botaoSecundario, { paddingHorizontal: 12, paddingVertical: 6 }]}
                      onPress={() => abrirModalRotina(dia.key)}
                    >
                      <Text style={[estilosGlobais.textoPequeno, { color: cores.primaria, fontWeight: '600' }]}>
                        + Criar Rotina
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Conteúdo do Dia */}
              {rotina ? (
                <View>
                  {/* Informações da Rotina */}
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10
                  }}>
                    <Text style={[estilosGlobais.textoPequeno, { color: cores.textoSecundario, fontWeight: '600' }]}>
                      {rotina.gruposMusculares.length} GRUPO(S) MUSCULAR(ES)
                    </Text>
                    {rotina.ultimaExecucao && (
                      <Text style={[estilosGlobais.textoPequeno, { color: '#22c55e' }]}>
                        Último treino: {new Date(rotina.ultimaExecucao).toLocaleDateString('pt-BR')}
                      </Text>
                    )}
                  </View>

                  {/* Grupos Musculares */}
                  {rotina.gruposMusculares.length > 0 ? (
                    rotina.gruposMusculares.map((grupo) => {
                      const grupoInfo = gruposMusculares.find(g => g.id === grupo.grupoMuscularId);
                      if (!grupoInfo) return null;

                      return (
                        <View key={grupo.id} style={{
                          backgroundColor: cores.fundoTerciario,
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 8,
                          borderLeftWidth: 3,
                          borderLeftColor: grupoInfo.cor
                        }}>
                          <View style={{ 
                            flexDirection: 'row', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: 8
                          }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Ionicons name={grupoInfo.icone} size={20} color={grupoInfo.cor} />
                              <View>
                                <Text style={[estilosGlobais.textoNormal, { fontWeight: '600' }]}>
                                  {grupoInfo.nome}
                                </Text>
                                <Text style={[estilosGlobais.textoPequeno, { color: cores.textoSecundario }]}>
                                  {grupo.exercicios.length} exercício(s)
                                </Text>
                              </View>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 4 }}>
                              <TouchableOpacity 
                                style={[estilosGlobais.botaoSecundario, { paddingHorizontal: 8, paddingVertical: 4 }]}
                                onPress={() => abrirModalExercicio(dia.key, grupo)}
                              >
                                <Ionicons name="add" size={12} color={cores.primaria} />
                              </TouchableOpacity>
                              <TouchableOpacity 
                                style={{ paddingHorizontal: 8, paddingVertical: 4 }}
                                onPress={() => excluirGrupoMuscular(dia.key, grupo.id)}
                              >
                                <Ionicons name="close" size={12} color="#ff4757" />
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Exercícios do Grupo */}
                          {grupo.exercicios.map((exercicio) => (
                            <View key={exercicio.id} style={{
                              backgroundColor: cores.fundoSecundario,
                              borderRadius: 6,
                              padding: 8,
                              marginBottom: 4,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <View style={{ flex: 1 }}>
                                <Text style={[estilosGlobais.textoPequeno, { fontWeight: '600' }]}>
                                  {exercicio.nome}
                                </Text>
                                {(exercicio.series > 0 || exercicio.repeticoes > 0 || exercicio.peso > 0) && (
                                  <Text style={[estilosGlobais.textoPequeno, { 
                                    color: cores.textoSecundario,
                                    marginTop: 2
                                  }]}>
                                    {exercicio.series}x{exercicio.repeticoes}
                                    {exercicio.peso > 0 && ` - ${exercicio.peso}kg`}
                                  </Text>
                                )}
                              </View>
                              <TouchableOpacity 
                                onPress={() => excluirExercicio(dia.key, grupo.id, exercicio.id)}
                                style={{ padding: 4 }}
                              >
                                <Ionicons name="close" size={12} color="#ff4757" />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      );
                    })
                  ) : (
                    <View style={{
                      alignItems: 'center',
                      paddingVertical: 20,
                      borderTopWidth: 1,
                      borderTopColor: cores.borda
                    }}>
                      <Ionicons name="fitness-outline" size={32} color={cores.textoSecundario} />
                      <Text style={[estilosGlobais.textoPequeno, { 
                        color: cores.textoSecundario,
                        marginTop: 8,
                        textAlign: 'center'
                      }]}>
                        Nenhum grupo muscular adicionado
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={{
                  alignItems: 'center',
                  paddingVertical: 20
                }}>
                  <Ionicons name="calendar-outline" size={32} color={cores.textoSecundario} />
                  <Text style={[estilosGlobais.textoPequeno, { 
                    color: cores.textoSecundario,
                    marginTop: 8,
                    textAlign: 'center'
                  }]}>
                    Dia livre - sem rotina definida
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={[estilosGlobais.cartaoElevado, { maxHeight: '80%' }]}>
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
                <Ionicons 
                  name={
                    tipoModal === 'rotina' ? 'calendar' :
                    tipoModal === 'grupo' ? 'fitness' : 'barbell'
                  } 
                  size={24} 
                  color={cores.primaria} 
                />
                <Text style={estilosGlobais.subtitulo}>
                  {tipoModal === 'rotina' ? 'Nova Rotina' : 
                   tipoModal === 'grupo' ? 'Grupos Musculares' : 'Novo Exercício'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={24} color={cores.texto} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {tipoModal === 'rotina' ? (
                <>
                  <View style={{ marginBottom: 20 }}>
                    <Text style={[estilosGlobais.textoPequeno, { 
                      color: cores.textoSecundario,
                      marginBottom: 8,
                      fontWeight: '600'
                    }]}>
                      DIA DA SEMANA
                    </Text>
                    <View style={{
                      backgroundColor: cores.fundoTerciario,
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: cores.borda
                    }}>
                      <Text style={[estilosGlobais.textoNormal, { fontWeight: '600' }]}>
                        {diasSemana.find(d => d.key === diaSelecionado)?.nome || 'Dia não selecionado'}
                      </Text>
                    </View>
                  </View>

                  <View style={{ marginBottom: 20 }}>
                    <Text style={[estilosGlobais.textoPequeno, { 
                      color: cores.textoSecundario,
                      marginBottom: 8,
                      fontWeight: '600'
                    }]}>
                      NOME DA ROTINA
                    </Text>
                    <TextInput
                      style={estilosGlobais.input}
                      placeholder="Ex: Peito e Tríceps, Costas e Bíceps"
                      placeholderTextColor={cores.textoSecundario}
                      value={nomeRotina}
                      onChangeText={setNomeRotina}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    <TouchableOpacity
                      style={[estilosGlobais.botaoSecundario, { flex: 1 }]}
                      onPress={() => setModalVisivel(false)}
                    >
                      <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[estilosGlobais.botao, { flex: 1 }]}
                      onPress={adicionarRotina}
                    >
                      <Text style={estilosGlobais.textoBotao}>Criar Rotina</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : tipoModal === 'grupo' ? (
                <>
                  <Text style={[estilosGlobais.textoPequeno, { 
                    color: cores.textoSecundario,
                    marginBottom: 15,
                    fontWeight: '600'
                  }]}>
                    SELECIONE OS GRUPOS MUSCULARES
                  </Text>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                    {gruposMusculares.map((grupo) => {
                      const selecionado = gruposMuscularesSelecionados.includes(grupo.id);
                      return (
                        <TouchableOpacity
                          key={grupo.id}
                          style={{
                            backgroundColor: selecionado ? grupo.cor : cores.fundoTerciario,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: selecionado ? grupo.cor : cores.borda,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6
                          }}
                          onPress={() => toggleGrupoMuscular(grupo.id)}
                        >
                          <Ionicons 
                            name={grupo.icone} 
                            size={16} 
                            color={selecionado ? cores.fundo : grupo.cor} 
                          />
                          <Text style={[
                            estilosGlobais.textoPequeno,
                            { 
                              color: selecionado ? cores.fundo : cores.texto,
                              fontWeight: '600'
                            }
                          ]}>
                            {grupo.nome}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                      style={[estilosGlobais.botaoSecundario, { flex: 1 }]}
                      onPress={() => setModalVisivel(false)}
                    >
                      <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[estilosGlobais.botao, { flex: 1 }]}
                      onPress={adicionarGrupoMuscular}
                      disabled={gruposMuscularesSelecionados.length === 0}
                    >
                      <Text style={estilosGlobais.textoBotao}>
                        Adicionar ({gruposMuscularesSelecionados.length})
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={{ marginBottom: 20 }}>
                    <Text style={[estilosGlobais.textoPequeno, { 
                      color: cores.textoSecundario,
                      marginBottom: 8,
                      fontWeight: '600'
                    }]}>
                      GRUPO MUSCULAR
                    </Text>
                    <View style={{
                      backgroundColor: cores.fundoTerciario,
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: cores.borda,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      {grupoSelecionado && (
                        <>
                          <Ionicons 
                            name={gruposMusculares.find(g => g.id === grupoSelecionado.grupoMuscularId)?.icone} 
                            size={20} 
                            color={gruposMusculares.find(g => g.id === grupoSelecionado.grupoMuscularId)?.cor} 
                          />
                          <Text style={[estilosGlobais.textoNormal, { fontWeight: '600' }]}>
                            {gruposMusculares.find(g => g.id === grupoSelecionado.grupoMuscularId)?.nome}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>

                  <TextInput
                    style={estilosGlobais.input}
                    placeholder="Nome do exercício"
                    placeholderTextColor={cores.textoSecundario}
                    value={nomeExercicio}
                    onChangeText={setNomeExercicio}
                  />

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TextInput
                      style={[estilosGlobais.input, { flex: 1 }]}
                      placeholder="Séries"
                      placeholderTextColor={cores.textoSecundario}
                      value={series}
                      onChangeText={setSeries}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[estilosGlobais.input, { flex: 1 }]}
                      placeholder="Repetições"
                      placeholderTextColor={cores.textoSecundario}
                      value={repeticoes}
                      onChangeText={setRepeticoes}
                      keyboardType="numeric"
                    />
                  </View>

                  <TextInput
                    style={estilosGlobais.input}
                    placeholder="Peso (kg) - opcional"
                    placeholderTextColor={cores.textoSecundario}
                    value={peso}
                    onChangeText={setPeso}
                    keyboardType="numeric"
                  />

                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                    <TouchableOpacity
                      style={[estilosGlobais.botaoSecundario, { flex: 1 }]}
                      onPress={() => setModalVisivel(false)}
                    >
                      <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[estilosGlobais.botao, { flex: 1 }]}
                      onPress={adicionarExercicio}
                    >
                      <Text style={estilosGlobais.textoBotao}>Adicionar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AcademiaTela;