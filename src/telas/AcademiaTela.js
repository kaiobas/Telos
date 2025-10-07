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
  const [treinos, setTreinos] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tipoModal, setTipoModal] = useState('treino'); // 'treino' ou 'exercicio'
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [nomeTreino, setNomeTreino] = useState('');
  const [nomeExercicio, setNomeExercicio] = useState('');
  const [grupoMuscular, setGrupoMuscular] = useState('');
  const [series, setSeries] = useState('');
  const [repeticoes, setRepeticoes] = useState('');
  const [peso, setPeso] = useState('');
  const [atualizando, setAtualizando] = useState(false);

  const gruposMusculares = [
    'Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 
    'Pernas', 'Glúteos', 'Abdômen', 'Panturrilha', 'Antebraço'
  ];

  const adicionarTreino = () => {
    if (!nomeTreino.trim()) {
      Alert.alert('Erro', 'Nome do treino é obrigatório.');
      return;
    }

    const novoTreino = {
      id: Date.now(),
      nome: nomeTreino.trim(),
      exercicios: [],
      dataCriacao: new Date().toISOString(),
      ultimaExecucao: null,
    };

    setTreinos([...treinos, novoTreino]);
    setModalVisivel(false);
    setNomeTreino('');
    Alert.alert('Sucesso', 'Treino criado com sucesso!');
  };

  const adicionarExercicio = () => {
    if (!nomeExercicio.trim() || !grupoMuscular.trim()) {
      Alert.alert('Erro', 'Nome do exercício e grupo muscular são obrigatórios.');
      return;
    }

    const novoExercicio = {
      id: Date.now(),
      nome: nomeExercicio.trim(),
      grupoMuscular: grupoMuscular.trim(),
      series: parseInt(series) || 0,
      repeticoes: parseInt(repeticoes) || 0,
      peso: parseFloat(peso) || 0,
    };

    const treinosAtualizados = treinos.map(treino => {
      if (treino.id === treinoSelecionado.id) {
        return {
          ...treino,
          exercicios: [...treino.exercicios, novoExercicio]
        };
      }
      return treino;
    });

    setTreinos(treinosAtualizados);
    setModalVisivel(false);
    limparCamposExercicio();
    Alert.alert('Sucesso', 'Exercício adicionado com sucesso!');
  };

  const limparCamposExercicio = () => {
    setNomeExercicio('');
    setGrupoMuscular('');
    setSeries('');
    setRepeticoes('');
    setPeso('');
  };

  const abrirModalTreino = () => {
    setTipoModal('treino');
    setModalVisivel(true);
  };

  const abrirModalExercicio = (treino) => {
    setTreinoSelecionado(treino);
    setTipoModal('exercicio');
    setModalVisivel(true);
  };

  const executarTreino = (treino) => {
    const treinosAtualizados = treinos.map(t => {
      if (t.id === treino.id) {
        return { ...t, ultimaExecucao: new Date().toISOString() };
      }
      return t;
    });
    setTreinos(treinosAtualizados);
    Alert.alert('Treino Concluído', `Parabéns! Você completou o treino "${treino.nome}"`);
  };

  const excluirTreino = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este treino? Todos os exercícios serão perdidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            setTreinos(treinos.filter(treino => treino.id !== id));
            Alert.alert('Sucesso', 'Treino excluído com sucesso!');
          }
        }
      ]
    );
  };

  const excluirExercicio = (treinoId, exercicioId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este exercício?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            const treinosAtualizados = treinos.map(treino => {
              if (treino.id === treinoId) {
                return {
                  ...treino,
                  exercicios: treino.exercicios.filter(exercicio => exercicio.id !== exercicioId)
                };
              }
              return treino;
            });
            setTreinos(treinosAtualizados);
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
        <TouchableOpacity
          style={estilosGlobais.botao}
          onPress={abrirModalTreino}
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
        {/* Lista de Treinos */}
        {treinos.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Ionicons name="barbell-outline" size={64} color={cores.textoSecundario} />
            <Text style={estilosGlobais.textoNormal}>
              Nenhum treino criado
            </Text>
            <Text style={estilosGlobais.textoPequeno}>
              Toque no + para criar seu primeiro treino
            </Text>
          </View>
        ) : (
          treinos.map((treino) => (
            <View key={treino.id} style={estilosGlobais.cartaoElevado}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={estilosGlobais.subtitulo}>{treino.nome}</Text>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  <TouchableOpacity 
                    style={[estilosGlobais.botaoSecundario, { paddingHorizontal: 12, paddingVertical: 6 }]}
                    onPress={() => abrirModalExercicio(treino)}
                  >
                    <Ionicons name="add" size={16} color={cores.primaria} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[estilosGlobais.botao, { paddingHorizontal: 12, paddingVertical: 6 }]}
                    onPress={() => executarTreino(treino)}
                  >
                    <Ionicons name="play" size={16} color={cores.fundo} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                    onPress={() => excluirTreino(treino.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#ff4757" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={estilosGlobais.textoPequeno}>
                {treino.exercicios.length} exercício(s)
              </Text>

              {treino.ultimaExecucao && (
                <Text style={[estilosGlobais.textoPequeno, { color: cores.primaria, marginTop: 5 }]}>
                  Último treino: {new Date(treino.ultimaExecucao).toLocaleDateString('pt-BR')}
                </Text>
              )}

              {treino.exercicios.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  {treino.exercicios.map((exercicio, index) => (
                    <View key={exercicio.id} style={{ 
                      backgroundColor: cores.fundoTerciario, 
                      borderRadius: 8, 
                      padding: 12, 
                      marginBottom: 8 
                    }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={[estilosGlobais.textoNormal, { fontWeight: '600' }]}>
                            {exercicio.nome}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={[estilosGlobais.textoPequeno, { 
                            backgroundColor: cores.primaria, 
                            color: cores.fundo, 
                            paddingHorizontal: 8, 
                            paddingVertical: 2, 
                            borderRadius: 4 
                          }]}>
                            {exercicio.grupoMuscular}
                          </Text>
                          <TouchableOpacity 
                            onPress={() => excluirExercicio(treino.id, exercicio.id)}
                            style={{ padding: 4 }}
                          >
                            <Ionicons name="trash-outline" size={16} color="#ff4757" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      {(exercicio.series > 0 || exercicio.repeticoes > 0 || exercicio.peso > 0) && (
                        <Text style={[estilosGlobais.textoPequeno, { marginTop: 5 }]}>
                          {exercicio.series}x{exercicio.repeticoes} 
                          {exercicio.peso > 0 && ` - ${exercicio.peso}kg`}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={estilosGlobais.subtitulo}>
                {tipoModal === 'treino' ? 'Novo Treino' : 'Novo Exercício'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={24} color={cores.texto} />
              </TouchableOpacity>
            </View>

            {tipoModal === 'treino' ? (
              <>
                <TextInput
                  style={estilosGlobais.input}
                  placeholder="Nome do treino"
                  placeholderTextColor={cores.textoSecundario}
                  value={nomeTreino}
                  onChangeText={setNomeTreino}
                />

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                  <TouchableOpacity
                    style={estilosGlobais.botaoSecundario}
                    onPress={() => setModalVisivel(false)}
                  >
                    <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={estilosGlobais.botao}
                    onPress={adicionarTreino}
                  >
                    <Text style={estilosGlobais.textoBotao}>Criar Treino</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <TextInput
                  style={estilosGlobais.input}
                  placeholder="Nome do exercício"
                  placeholderTextColor={cores.textoSecundario}
                  value={nomeExercicio}
                  onChangeText={setNomeExercicio}
                />

                <TextInput
                  style={estilosGlobais.input}
                  placeholder="Grupo muscular"
                  placeholderTextColor={cores.textoSecundario}
                  value={grupoMuscular}
                  onChangeText={setGrupoMuscular}
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
                    style={estilosGlobais.botaoSecundario}
                    onPress={() => setModalVisivel(false)}
                  >
                    <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={estilosGlobais.botao}
                    onPress={adicionarExercicio}
                  >
                    <Text style={estilosGlobais.textoBotao}>Adicionar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AcademiaTela;