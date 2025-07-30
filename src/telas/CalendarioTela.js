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

  const obterMarcacoes = () => {
    const marcacoes = {};
    
    eventos.forEach(evento => {
      const data = evento.data ? evento.data.split('T')[0] : '';
      if (data) {
        marcacoes[data] = {
          marked: true,
          dotColor: cores.primaria,
        };
      }
    });

    if (dataSelecionada) {
      marcacoes[dataSelecionada] = {
        ...marcacoes[dataSelecionada],
        selected: true,
        selectedColor: cores.primaria,
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
                <Text style={estilosGlobais.titulo}>📆 Calendário</Text>
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
                    firstDay={0}
                    enableSwipeMonths={true}
                />
            </View>

            {/* Eventos do Dia Selecionado */}
            {dataSelecionada && (
                <View style={estilosGlobais.cartao}>
                    <Text style={estilosGlobais.subtitulo}>
                        {formatarData(dataSelecionada)}
                    </Text>
                    
                    {eventosDia.length > 0 ? (
                        eventosDia.map((evento) => (
                            <View key={evento.id} style={estilos.itemEvento}>
                                <View style={estilos.conteudoEvento}>
                                    <Text style={estilos.tituloEvento}>{evento.titulo}</Text>
                                    {evento.descricao && (
                                        <Text style={estilos.descricaoEvento}>{evento.descricao}</Text>
                                    )}
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
                                Nenhum evento para este dia
                            </Text>
                            <Text style={estilos.dicaSemEventos}>
                                Toque no botão + para adicionar um evento
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {/* Dica inicial */}
            {!dataSelecionada && (
                <View style={estilos.dicaInicial}>
                    <Ionicons name="information-circle-outline" size={24} color={cores.textoSecundario} />
                    <Text style={estilos.textoDica}>
                        Selecione uma data no calendário para ver ou adicionar eventos
                    </Text>
                </View>
            )}
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
});

export default CalendarioTela;
