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
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';
import estilosGlobais from '../estilos/estilosGlobais';
import Header from '../componentes/Header';
import { 
  salvarEventoCalendario, 
  carregarEventosCalendario, 
  excluirEventoCalendario,
  obterEventosPorData 
} from '../armazenamento/armazenamentoLocal';

const CalendarioTela = () => {
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [eventos, setEventos] = useState([]);
  const [eventosDia, setEventosDia] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tituloEvento, setTituloEvento] = useState('');
  const [descricaoEvento, setDescricaoEvento] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [todosEventos, setTodosEventos] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (dataSelecionada) {
      carregarEventosDia();
    }
  }, [dataSelecionada, eventos]);

  const carregarDados = async () => {
    try {
      setAtualizando(true);
      const eventosCarregados = await carregarEventosCalendario();
      setEventos(eventosCarregados);
      
      // Organizar todos os eventos por proximidade
      const eventosOrdenados = organizarEventosPorProximidade(eventosCarregados);
      setTodosEventos(eventosOrdenados);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os eventos.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  };

  const carregarEventosDia = async () => {
    try {
      const eventosDodia = await obterEventosPorData(dataSelecionada);
      setEventosDia(eventosDodia);
    } catch (error) {
      console.error('Erro ao carregar eventos do dia:', error);
    }
  };

  const adicionarEvento = async () => {
    if (!tituloEvento.trim()) {
      Alert.alert('Erro', 'Por favor, adicione um título para o evento.');
      return;
    }

    if (!dataSelecionada) {
      Alert.alert('Erro', 'Por favor, selecione uma data.');
      return;
    }

    try {
      const novoEvento = {
        titulo: tituloEvento.trim(),
        descricao: descricaoEvento.trim(),
        data: dataSelecionada,
      };

      const sucesso = await salvarEventoCalendario(novoEvento);
      
      if (sucesso) {
        await carregarDados();
        setTituloEvento('');
        setDescricaoEvento('');
        setModalVisivel(false);
        Alert.alert('Sucesso', 'Evento adicionado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar o evento.');
      }
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o evento.');
    }
  };

  const excluirEvento = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const sucesso = await excluirEventoCalendario(id);
              if (sucesso) {
                await carregarDados();
                Alert.alert('Sucesso', 'Evento excluído com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível excluir o evento.');
              }
            } catch (error) {
              console.error('Erro ao excluir evento:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir o evento.');
            }
          }
        }
      ]
    );
  };

  const organizarEventosPorProximidade = (eventos) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    return eventos
      .map(evento => {
        const dataEvento = new Date(evento.data + 'T00:00:00');
        return {
          ...evento,
          dataObj: dataEvento,
          diasRestantes: Math.ceil((dataEvento - hoje) / (1000 * 60 * 60 * 24))
        };
      })
      .sort((a, b) => a.dataObj - b.dataObj);
  };

  const ehEventoDeHoje = (dataEvento) => {
    const hoje = new Date();
    const evento = new Date(dataEvento + 'T00:00:00');
    return hoje.toDateString() === evento.toDateString();
  };

  const formatarDataRelativa = (diasRestantes) => {
    if (diasRestantes === 0) return 'Hoje';
    if (diasRestantes === 1) return 'Amanhã';
    if (diasRestantes === -1) return 'Ontem';
    if (diasRestantes < 0) return `${Math.abs(diasRestantes)} dias atrás`;
    return `Em ${diasRestantes} dias`;
  };

  const obterMarcacoes = () => {
    const marcacoes = {};
    
    eventos.forEach(evento => {
      const data = evento.data ? evento.data.split('T')[0] : '';
      if (data) {
        marcacoes[data] = {
          customStyles: {
            container: {
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderColor: cores.primaria,
              borderRadius: 16,
            },
            text: {
              color: cores.texto,
              fontWeight: 'bold',
            },
          },
        };
      }
    });

    if (dataSelecionada) {
      marcacoes[dataSelecionada] = {
        ...marcacoes[dataSelecionada],
        selected: true,
        selectedColor: cores.primaria,
        customStyles: {
          container: {
            backgroundColor: cores.primaria,
            borderWidth: 2,
            borderColor: cores.primaria,
            borderRadius: 16,
          },
          text: {
            color: cores.fundo,
            fontWeight: 'bold',
          },
        },
      };
    }

    return marcacoes;
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

return (
    <View style={estilosGlobais.container}>
        <Header />
        
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
            {/* Cabeçalho da Seção */}
            <View style={estilos.cabecalho}>
                <Text style={estilosGlobais.titulo}>Calendário</Text>
                <TouchableOpacity
                    style={estilos.botaoAdicionar}
                    onPress={() => setModalVisivel(true)}
                    disabled={!dataSelecionada}
                >
                    <Ionicons name="add" size={24} color={cores.fundo} />
                </TouchableOpacity>
            </View>

            {/* Calendário */}
            <View style={estilosGlobais.cartao}>
                <Calendar
                    theme={{
                        backgroundColor: cores.fundoSecundario,
                        calendarBackground: cores.fundoSecundario,
                        textSectionTitleColor: cores.texto,
                        dayTextColor: cores.texto,
                        todayTextColor: cores.primaria,
                        selectedDayTextColor: cores.fundo,
                        monthTextColor: cores.texto,
                        indicatorColor: cores.primaria,
                        selectedDayBackgroundColor: cores.primaria,
                        arrowColor: cores.primaria,
                        disabledArrowColor: cores.textoTerciario,
                        textDisabledColor: cores.textoTerciario,
                        dotColor: cores.primaria,
                        selectedDotColor: cores.fundo,
                    }}
                    onDayPress={(day) => setDataSelecionada(day.dateString)}
                    markedDates={obterMarcacoes()}
                    markingType={'custom'}
                    firstDay={0}
                    enableSwipeMonths={true}
                />
            </View>

            {/* Todos os Eventos Ordenados por Proximidade */}
                  <View style={estilosGlobais.cartao}>
                    <Text style={estilosGlobais.subtitulo}>📋 Próximos Eventos</Text>
                    
                    {todosEventos.length > 0 ? (
                      todosEventos.map((evento) => (
                        <View 
                          key={evento.id} 
                          style={[
                            estilos.itemEventoGeral,
                            ehEventoDeHoje(evento.data) && estilos.eventoHoje
                          ]}
                        >
                          <View style={estilos.conteudoEventoGeral}>
                            <View style={estilos.linhaTitulo}>
                              <Text style={estilos.tituloEventoGeral}>{evento.titulo}</Text>
                              <Text style={[
                                estilos.tempoRelativo,
                                ehEventoDeHoje(evento.data) && estilos.tempoRelativoHoje
                              ]}>
                                {formatarDataRelativa(evento.diasRestantes)}
                              </Text>
                            </View>
                            {evento.descricao && (
                              <Text style={estilos.descricaoEventoGeral}>{evento.descricao}</Text>
                            )}
                            <Text style={estilos.dataEventoGeral}>
                              📅 {formatarData(evento.data)}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={estilos.botaoExcluir}
                            onPress={() => excluirEvento(evento.id)}
                          >
                            <Ionicons name="trash-outline" size={20} color={cores.primaria} />
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <View style={estilos.semEventos}>
                        <Ionicons name="calendar-outline" size={48} color={cores.textoTerciario} />
                        <Text style={estilos.textoSemEventos}>
                          Nenhum evento agendado
                        </Text>
                        <Text style={estilos.dicaSemEventos}>
                          Selecione uma data e adicione seu primeiro evento
                        </Text>
                      </View>
                    )}
                  </View>
                  {/* Espaço extra no final do scroll */}
                  <View style={{ height: 32 }} />
                </ScrollView>

                {/* Modal para Adicionar Evento */}
        <Modal
            visible={modalVisivel}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisivel(false)}
        >
            <View style={estilos.modalContainer}>
                <View style={estilos.modalConteudo}>
                    <View style={estilos.cabecalhoModal}>
                        <Text style={estilosGlobais.subtitulo}>Novo Evento</Text>
                        <TouchableOpacity onPress={() => setModalVisivel(false)}>
                            <Ionicons name="close" size={24} color={cores.primaria} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={estilosGlobais.input}
                        placeholder="Título do evento"
                        placeholderTextColor={cores.textoTerciario}
                        value={tituloEvento}
                        onChangeText={setTituloEvento}
                        maxLength={100}
                    />

                    <TextInput
                        style={[estilosGlobais.input, estilos.inputDescricao]}
                        placeholder="Descrição (opcional)"
                        placeholderTextColor={cores.textoTerciario}
                        value={descricaoEvento}
                        onChangeText={setDescricaoEvento}
                        multiline={true}
                        numberOfLines={3}
                        maxLength={500}
                    />

                    {dataSelecionada && (
                        <Text style={estilos.dataEvento}>
                            📅 {formatarData(dataSelecionada)}
                        </Text>
                    )}

                    <View style={estilos.botoesModal}>
                        <TouchableOpacity
                            style={estilosGlobais.botaoSecundario}
                            onPress={() => setModalVisivel(false)}
                        >
                            <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={estilosGlobais.botao}
                            onPress={adicionarEvento}
                        >
                            <Text style={estilosGlobais.textoBotao}>Salvar</Text>
                        </TouchableOpacity>
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
  },

  // Eventos
  itemEvento: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  conteudoEvento: {
    flex: 1,
  },

  tituloEvento: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 4,
  },

  descricaoEvento: {
    fontSize: 14,
    color: cores.textoSecundario,
    lineHeight: 18,
  },

  botaoExcluir: {
    padding: 8,
  },

  // Estados vazios
  semEventos: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  textoSemEventos: {
    fontSize: 16,
    color: cores.textoSecundario,
    marginTop: 12,
    textAlign: 'center',
  },

  dicaSemEventos: {
    fontSize: 14,
    color: cores.textoTerciario,
    marginTop: 8,
    textAlign: 'center',
  },

  dicaInicial: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundoSecundario,
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },

  textoDica: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginLeft: 12,
    flex: 1,
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
    maxHeight: '80%',
  },

  cabecalhoModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  inputDescricao: {
    height: 80,
    textAlignVertical: 'top',
  },

  dataEvento: {
    fontSize: 16,
    color: cores.textoSecundario,
    marginBottom: 20,
    textAlign: 'center',
  },

  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  // Eventos gerais
  itemEventoGeral: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
    borderRadius: 8,
    marginVertical: 4,
  },

  eventoHoje: {
    borderWidth: 2,
    borderColor: '#007AFF', // Azul do iOS
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },

  conteudoEventoGeral: {
    flex: 1,
  },

  linhaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  tituloEventoGeral: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
    flex: 1,
    marginRight: 12,
  },

  descricaoEventoGeral: {
    fontSize: 14,
    color: cores.textoSecundario,
    lineHeight: 18,
    marginBottom: 6,
  },

  dataEventoGeral: {
    fontSize: 13,
    color: cores.textoTerciario,
  },

  tempoRelativo: {
    fontSize: 13,
    color: cores.textoSecundario,
    fontWeight: '500',
  },

  tempoRelativoHoje: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default CalendarioTela;
