import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';
import estilosGlobais from '../estilos/estilosGlobais';
import servicoIA from '../servicos/servicoIA';

const { width, height } = Dimensions.get('window');

const BotaoIA = () => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [conversa, setConversa] = useState([
    {
      id: '1',
      tipo: 'ia',
      texto: 'Opa! Como posso te ajudar agora?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [animacao] = useState(new Animated.Value(1));
  const [carregando, setCarregando] = useState(false);

  const alternarModal = () => {
    setModalVisivel(!modalVisivel);
  };

  const enviarMensagem = async () => {
    if (mensagem.trim() === '') return;

    const novaMensagem = {
      id: Date.now().toString(),
      tipo: 'usuario',
      texto: mensagem,
      timestamp: new Date().toISOString(),
    };

    setConversa(prev => [...prev, novaMensagem]);
    const mensagemUsuario = mensagem;
    setMensagem('');
    setCarregando(true);

    try {
      // Enviar mensagem para a IA com histórico da conversa
      const historicoParaIA = conversa.slice(-10); // Últimas 10 mensagens para contexto
      const resultado = await servicoIA.enviarMensagem(mensagemUsuario, historicoParaIA);

      // Adicionar resposta da IA
      const respostaIA = {
        id: (Date.now() + 1).toString(),
        tipo: 'ia',
        texto: resultado.resposta,
        timestamp: new Date().toISOString(),
        acoes: resultado.acoes || []
      };

      setConversa(prev => [...prev, respostaIA]);

      // Mostrar feedback das ações executadas
      if (resultado.acoes && resultado.acoes.length > 0) {
        const acoesExecutadas = resultado.acoes
          .filter(acao => acao.result.sucesso)
          .map(acao => acao.function_name);

        if (acoesExecutadas.length > 0) {
          setTimeout(() => {
            Alert.alert(
              '✅ Ações Executadas',
              `A IA executou as seguintes ações:\n${acoesExecutadas.map(acao => 
                acao === 'addDiaryEntry' ? '📓 Entrada adicionada ao diário' :
                acao === 'addFinancialTransaction' ? '💰 Transação financeira registrada' :
                acao
              ).join('\n')}`,
              [{ text: 'OK' }]
            );
          }, 1000);
        }
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      let mensagemErro = 'Desculpe, ocorreu um erro ao processar sua mensagem.';
      
      if (error.message.includes('Muitas solicitações')) {
        mensagemErro = '⏳ Muitas solicitações seguidas. Aguarde alguns segundos e tente novamente.';
      } else if (error.message.includes('autenticação')) {
        mensagemErro = '🔑 Erro de autenticação com a API. Verifique as configurações.';
      } else if (error.message.includes('servidor')) {
        mensagemErro = '🔧 Problema temporário no servidor. Tente novamente em instantes.';
      } else if (error.message.includes('conexão')) {
        mensagemErro = '📶 Problema de conexão. Verifique sua internet e tente novamente.';
      }
      
      const respostaErro = {
        id: (Date.now() + 1).toString(),
        tipo: 'ia',
        texto: mensagemErro,
        timestamp: new Date().toISOString(),
      };

      setConversa(prev => [...prev, respostaErro]);
      
      // Alert mais específico baseado no erro
      if (error.message.includes('Muitas solicitações')) {
        Alert.alert(
          '⏳ Rate Limit',
          'Você está enviando muitas mensagens seguidas. Aguarde alguns segundos antes de tentar novamente.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Erro de Conexão',
          'Não foi possível conectar com a IA. Verifique sua internet.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setCarregando(false);
    }
  };

  const animarBotao = () => {
    Animated.sequence([
      Animated.timing(animacao, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animacao, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const formatarHorario = (timestamp) => {
    const data = new Date(timestamp);
    return data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Botão Flutuante */}
      <Animated.View 
        style={[
          estilos.botaoFlutuante,
          { transform: [{ scale: animacao }] }
        ]}
      >
        <TouchableOpacity
          style={estilos.botao}
          onPress={() => {
            animarBotao();
            alternarModal();
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color={cores.fundo} />
        </TouchableOpacity>
      </Animated.View>

      {/* Modal do Chat */}
      <Modal
        visible={modalVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={alternarModal}
      >
        <View style={estilos.modalContainer}>
          <View style={estilos.chatContainer}>
            {/* Cabeçalho */}
            <View style={estilos.cabecalho}>
              <View style={estilos.infoIA}>
                <Ionicons name="sparkles" size={20} color={cores.primaria} />
                <Text style={estilos.tituloChat}>TELOS AI</Text>
              </View>
              <TouchableOpacity onPress={alternarModal}>
                <Ionicons name="close" size={24} color={cores.primaria} />
              </TouchableOpacity>
            </View>

            {/* Área de Conversa */}
            <ScrollView 
              style={estilos.areaConversa}
              showsVerticalScrollIndicator={false}
            >
              {conversa.map((item) => (
                <View 
                  key={item.id} 
                  style={[
                    estilos.mensagem,
                    item.tipo === 'usuario' ? estilos.mensagemUsuario : estilos.mensagemIA
                  ]}
                >
                  <Text style={[
                    estilos.textoMensagem,
                    item.tipo === 'usuario' ? estilos.textoUsuario : estilos.textoIA
                  ]}>
                    {item.texto}
                  </Text>
                  {item.acoes && item.acoes.length > 0 && (
                    <View style={estilos.acoesExecutadas}>
                      {item.acoes.map((acao, index) => (
                        <Text key={index} style={estilos.textoAcao}>
                          {acao.result.sucesso ? '✅' : '❌'} {acao.function_name === 'addDiaryEntry' ? 'Diário' : 'Finanças'}
                        </Text>
                      ))}
                    </View>
                  )}
                  <Text style={[
                    estilos.horarioMensagem,
                    item.tipo === 'usuario' ? estilos.horarioUsuario : estilos.horarioIA
                  ]}>
                    {formatarHorario(item.timestamp)}
                  </Text>
                  <View style={{ height: 6 }} />
                </View>
              ))}
              
              {/* Indicador de carregamento */}
              {carregando && (
                <View style={estilos.indicadorCarregamento}>
                  <ActivityIndicator size="small" color={cores.primaria} />
                  <Text style={estilos.textoCarregamento}>IA pensando...</Text>
                </View>
              )}
              <View style={{ height: 32 }} />
            </ScrollView>

            {/* Área de Input */}
            <View style={estilos.areaInput}>
              <TextInput
                style={estilos.inputMensagem}
                placeholder="Digite sua mensagem..."
                placeholderTextColor={cores.textoTerciario}
                value={mensagem}
                onChangeText={setMensagem}
                multiline={true}
                maxLength={500}
              />
              <TouchableOpacity 
                style={estilos.botaoEnviar}
                onPress={enviarMensagem}
                disabled={mensagem.trim() === '' || carregando}
              >
                {carregando ? (
                  <ActivityIndicator size={20} color={cores.fundo} />
                ) : (
                  <Ionicons 
                    name="send" 
                    size={20} 
                    color={mensagem.trim() ? cores.fundo : cores.textoTerciario} 
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const estilos = StyleSheet.create({
  // Botão flutuante
  botaoFlutuante: {
    position: 'absolute',
    bottom: 90, // Aumentei de 30 para 90 para ficar acima da aba de navegação
    right: 20,
    zIndex: 1000,
  },
  
  botao: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: cores.sombra,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: cores.overlay,
    justifyContent: 'flex-end',
  },

  chatContainer: {
    backgroundColor: cores.fundo,
    height: height * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },

  // Cabeçalho
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  infoIA: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tituloChat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.primaria,
    marginLeft: 8,
  },

  // Conversa
  areaConversa: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  mensagem: {
    marginVertical: 4,
    maxWidth: '80%',
  },

  mensagemUsuario: {
    alignSelf: 'flex-end',
  },

  mensagemIA: {
    alignSelf: 'flex-start',
  },

  textoMensagem: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    lineHeight: 20,
  },

  textoUsuario: {
    backgroundColor: cores.primaria,
    color: cores.fundo,
  },

  textoIA: {
    backgroundColor: cores.fundoSecundario,
    color: cores.texto,
    borderWidth: 1,
    borderColor: cores.borda,
  },

  horarioMensagem: {
    fontSize: 11,
    marginTop: 2,
    marginHorizontal: 12,
  },

  horarioUsuario: {
    color: cores.textoTerciario,
    textAlign: 'right',
  },

  horarioIA: {
    color: cores.textoTerciario,
    textAlign: 'left',
  },

  // Input
  areaInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },

  inputMensagem: {
    flex: 1,
    backgroundColor: cores.fundoTerciario,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: cores.texto,
    maxHeight: 100,
    marginRight: 10,
  },

  botaoEnviar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Indicadores e ações
  indicadorCarregamento: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },

  textoCarregamento: {
    marginLeft: 8,
    fontSize: 14,
    color: cores.textoSecundario,
    fontStyle: 'italic',
  },

  acoesExecutadas: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },

  textoAcao: {
    fontSize: 12,
    color: cores.textoTerciario,
    marginBottom: 2,
  },
});

export default BotaoIA;
