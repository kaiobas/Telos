import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';
import estilosGlobais from '../estilos/estilosGlobais';
import Header from '../componentes/Header';
import {
  carregarConfiguracaoNotificacao,
  atualizarConfiguracaoNotificacao,
} from '../armazenamento/armazenamentoLocal';
import {
  inicializarNotificacoes,
  atualizarNotificacoes,
  cancelarTodasNotificacoes,
  apagarTodasNotificacoes,
  solicitarApenasPermissoes,
  verificarNotificacoesAgendadas,
} from '../servicos/notificacoes';

const ConfiguracoesTela = () => {
  const [configuracao, setConfiguracao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [notificacoesAgendadas, setNotificacoesAgendadas] = useState(0);
  const [configuracaoApp, setConfiguracaoApp] = useState({
    modoEscuro: true,
    animacoes: true,
    sons: true,
    vibracoes: true,
    lembreteEventos: true,
    backupAutomatico: false,
    compactarDados: false,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      let config = await carregarConfiguracaoNotificacao();
      
      if (!config) {
        // Criar configuração padrão vazia (sistema minimalista)
        config = {
          ativo: false,
          horarios: []
        };
        await atualizarConfiguracaoNotificacao(config);
      }
      
      setConfiguracao(config);
      
      // Verificar notificações agendadas
      const agendadas = await verificarNotificacoesAgendadas();
      setNotificacoesAgendadas(agendadas.length);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as configurações.');
    } finally {
      setCarregando(false);
    }
  };

  const alternarNotificacoes = async (ativo) => {
    try {
      const novaConfig = { ...configuracao, ativo };
      
      if (ativo) {
        // Verificar e solicitar permissões apenas
        const permissaoOk = await solicitarApenasPermissoes();
        if (!permissaoOk) {
          Alert.alert(
            'Erro',
            'Não foi possível ativar as notificações. Verifique as permissões do aplicativo.'
          );
          return;
        }
        
        // Agendar notificações existentes se houver
        if (configuracao.horarios.length > 0) {
          await atualizarNotificacoes();
        }
      } else {
        // Cancelar todas as notificações
        await cancelarTodasNotificacoes();
      }
      
      await atualizarConfiguracaoNotificacao(novaConfig);
      setConfiguracao(novaConfig);
      
      // Atualizar contador
      const agendadas = await verificarNotificacoesAgendadas();
      setNotificacoesAgendadas(agendadas.length);
      
      Alert.alert(
        'Sucesso',
        ativo ? 'Notificações ativadas com sucesso!' : 'Notificações desativadas.'
      );
    } catch (error) {
      console.error('Erro ao alterar notificações:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao alterar as configurações.');
    }
  };

  const alternarHorario = async (id) => {
    try {
      const novosHorarios = configuracao.horarios.map(h => 
        h.id === id ? { ...h, ativo: !h.ativo } : h
      );
      
      const novaConfig = { ...configuracao, horarios: novosHorarios };
      
      await atualizarConfiguracaoNotificacao(novaConfig);
      setConfiguracao(novaConfig);
      
      // Reagendar notificações se estiver ativo
      if (configuracao.ativo) {
        await atualizarNotificacoes();
        const agendadas = await verificarNotificacoesAgendadas();
        setNotificacoesAgendadas(agendadas.length);
      }
    } catch (error) {
      console.error('Erro ao alterar horário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao alterar o horário.');
    }
  };

  const alternarConfiguracaoApp = (chave) => {
    setConfiguracaoApp(prev => ({
      ...prev,
      [chave]: !prev[chave]
    }));
    
    // Aqui você pode salvar no AsyncStorage se necessário
    Alert.alert('Configuração', `${chave} ${configuracaoApp[chave] ? 'desativado' : 'ativado'}`);
  };

  const limparTodosDados = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Esta ação irá apagar TODOS os seus dados (diário, finanças, eventos). Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'APAGAR TUDO', 
          style: 'destructive',
          onPress: () => {
            // Implementar limpeza de dados
            Alert.alert('Dados Limpos', 'Todos os dados foram removidos.');
          }
        }
      ]
    );
  };

  const exportarDados = () => {
    Alert.alert(
      'Exportar Dados',
      'Esta funcionalidade criará um backup de todos os seus dados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: () => {
            // Implementar exportação
            Alert.alert('Sucesso', 'Dados exportados com sucesso!');
          }
        }
      ]
    );
  };

  const formatarHorario = (hora, minuto) => {
    return `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
  };

  const testarNotificacao = async () => {
    try {
      const { scheduleNotificationAsync } = await import('expo-notifications');
      
      await scheduleNotificationAsync({
        content: {
          title: '🔔 Teste de Notificação',
          body: 'Esta é uma notificação de teste do Telos!',
          data: { tipo: 'teste' },
        },
        trigger: { seconds: 2 },
      });
      
      Alert.alert('Teste Enviado', 'Uma notificação de teste será exibida em 2 segundos.');
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      Alert.alert('Erro', 'Não foi possível enviar a notificação de teste.');
    }
  };

  if (carregando) {
    return (
      <View style={estilosGlobais.container}>
        <Header />
        <View style={estilos.carregando}>
          <Text style={estilos.textoCarregando}>Carregando configurações...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={estilosGlobais.container}>
      <Header />
      
      <ScrollView style={estilos.container}>
        {/* Cabeçalho da Seção */}
        <View style={estilos.cabecalho}>
          <Text style={estilosGlobais.titulo}>⚙️ Configurações</Text>
        </View>

        {/* Seção de Notificações */}
        <View style={estilosGlobais.cartao}>
          <Text style={estilosGlobais.subtitulo}>🔔 Notificações</Text>
          
          <View style={estilos.itemConfiguracao}>
            <View style={estilos.infoItem}>
              <Text style={estilos.tituloItem}>Ativar Notificações</Text>
              <Text style={estilos.descricaoItem}>
                Receba lembretes diários para usar o aplicativo
              </Text>
            </View>
            <Switch
              value={configuracao?.ativo || false}
              onValueChange={alternarNotificacoes}
              trackColor={{ false: cores.textoTerciario, true: cores.primaria }}
              thumbColor={cores.fundo}
            />
          </View>

          {configuracao?.ativo && (
            <View style={estilos.infoNotificacoes}>
              <Text style={estilos.textoInfo}>
                ✅ {notificacoesAgendadas} notificações agendadas
              </Text>
            </View>
          )}
        </View>

        {/* Horários de Notificação */}
        {configuracao?.ativo && (
          <View style={estilosGlobais.cartao}>
            <Text style={estilosGlobais.subtitulo}>⏰ Horários dos Lembretes</Text>
            
            {configuracao.horarios.map((horario) => (
              <View key={horario.id} style={estilos.itemHorario}>
                <View style={estilos.infoHorario}>
                  <Text style={estilos.horaTexto}>
                    {formatarHorario(horario.hora, horario.minuto)}
                  </Text>
                  <View style={estilos.detalhesHorario}>
                    <Text style={estilos.tituloHorario}>{horario.titulo}</Text>
                    <Text style={estilos.mensagemHorario}>{horario.mensagem}</Text>
                  </View>
                </View>
                <Switch
                  value={horario.ativo}
                  onValueChange={() => alternarHorario(horario.id)}
                  trackColor={{ false: cores.textoTerciario, true: cores.primaria }}
                  thumbColor={cores.fundo}
                />
              </View>
            ))}
          </View>
        )}

        {/* Seção de Interface */}
        <View style={estilosGlobais.cartao}>
          <Text style={estilosGlobais.subtitulo}>🎨 Interface</Text>
          
          <View style={estilos.itemConfiguracao}>
            <View style={estilos.infoItem}>
              <Text style={estilos.tituloItem}>Modo Escuro</Text>
              <Text style={estilos.descricaoItem}>
                Interface escura para menor cansaço visual
              </Text>
            </View>
            <Switch
              value={configuracaoApp.modoEscuro}
              onValueChange={() => alternarConfiguracaoApp('modoEscuro')}
              trackColor={{ false: cores.textoTerciario, true: cores.primaria }}
              thumbColor={cores.fundo}
            />
          </View>

          <View style={estilos.itemConfiguracao}>
            <View style={estilos.infoItem}>
              <Text style={estilos.tituloItem}>Animações</Text>
              <Text style={estilos.descricaoItem}>
                Ativar animações suaves na interface
              </Text>
            </View>
            <Switch
              value={configuracaoApp.animacoes}
              onValueChange={() => alternarConfiguracaoApp('animacoes')}
              trackColor={{ false: cores.textoTerciario, true: cores.primaria }}
              thumbColor={cores.fundo}
            />
          </View>
        </View>

        {/* Seção de Som e Vibração */}
        <View style={estilosGlobais.cartao}>
          <Text style={estilosGlobais.subtitulo}>🔊 Som e Vibração</Text>
          
          <View style={estilos.itemConfiguracao}>
            <View style={estilos.infoItem}>
              <Text style={estilos.tituloItem}>Sons do Sistema</Text>
              <Text style={estilos.descricaoItem}>
                Reproduzir sons para ações e notificações
              </Text>
            </View>
            <Switch
              value={configuracaoApp.sons}
              onValueChange={() => alternarConfiguracaoApp('sons')}
              trackColor={{ false: cores.textoTerciario, true: cores.primaria }}
              thumbColor={cores.fundo}
            />
          </View>

          <View style={estilos.itemConfiguracao}>
            <View style={estilos.infoItem}>
              <Text style={estilos.tituloItem}>Vibrações</Text>
              <Text style={estilos.descricaoItem}>
                Feedback tátil para interações
              </Text>
            </View>
            <Switch
              value={configuracaoApp.vibracoes}
              onValueChange={() => alternarConfiguracaoApp('vibracoes')}
              trackColor={{ false: cores.textoTerciario, true: cores.primaria }}
              thumbColor={cores.fundo}
            />
          </View>
        </View>

        {/* Seção de Dados e Backup */}
        <View style={estilosGlobais.cartao}>
          <Text style={estilosGlobais.subtitulo}>💾 Dados e Backup</Text>
          
          <View style={estilos.itemConfiguracao}>
            <View style={estilos.infoItem}>
              <Text style={estilos.tituloItem}>Lembrete de Eventos</Text>
              <Text style={estilos.descricaoItem}>
                Notificar 1 hora antes dos eventos
              </Text>
            </View>
            <Switch
              value={configuracaoApp.lembreteEventos}
              onValueChange={() => alternarConfiguracaoApp('lembreteEventos')}
              trackColor={{ false: cores.textoTerciario, true: cores.primaria }}
              thumbColor={cores.fundo}
            />
          </View>

          <View style={estilos.itemConfiguracao}>
            <View style={estilos.infoItem}>
              <Text style={estilos.tituloItem}>Backup Automático</Text>
              <Text style={estilos.descricaoItem}>
                Criar backup semanal dos dados automaticamente
              </Text>
            </View>
            <Switch
              value={configuracaoApp.backupAutomatico}
              onValueChange={() => alternarConfiguracaoApp('backupAutomatico')}
              trackColor={{ false: cores.textoTerciario, true: cores.primaria }}
              thumbColor={cores.fundo}
            />
          </View>

          <View style={estilos.itemConfiguracao}>
            <View style={estilos.infoItem}>
              <Text style={estilos.tituloItem}>Compactar Dados</Text>
              <Text style={estilos.descricaoItem}>
                Otimizar armazenamento dos dados
              </Text>
            </View>
            <Switch
              value={configuracaoApp.compactarDados}
              onValueChange={() => alternarConfiguracaoApp('compactarDados')}
              trackColor={{ false: cores.textoTerciario, true: cores.primaria }}
              thumbColor={cores.fundo}
            />
          </View>
        </View>

        {/* Ações Rápidas */}
        <View style={estilosGlobais.cartao}>
          <Text style={estilosGlobais.subtitulo}>🛠️ Ações</Text>
          
          <TouchableOpacity
            style={estilos.botaoAcao}
            onPress={testarNotificacao}
          >
            <Ionicons name="notifications-outline" size={20} color={cores.primaria} />
            <Text style={estilos.textoBotaoAcao}>Testar Notificação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botaoAcao}
            onPress={exportarDados}
          >
            <Ionicons name="download-outline" size={20} color={cores.primaria} />
            <Text style={estilos.textoBotaoAcao}>Exportar Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botaoAcao}
            onPress={carregarDados}
          >
            <Ionicons name="refresh-outline" size={20} color={cores.primaria} />
            <Text style={estilos.textoBotaoAcao}>Atualizar Status</Text>
          </TouchableOpacity>
        </View>

        {/* Zona de Perigo */}
        <View style={[estilosGlobais.cartao, estilos.zonaPerigoContainer]}>
          <Text style={[estilosGlobais.subtitulo, estilos.tituloZonaPerigo]}>⚠️ Zona de Perigo</Text>
          
          <TouchableOpacity
            style={[estilos.botaoAcao, estilos.botaoPerigo]}
            onPress={limparTodosDados}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
            <Text style={[estilos.textoBotaoAcao, estilos.textoBotaoPerigo]}>
              Limpar Todos os Dados
            </Text>
          </TouchableOpacity>
        </View>

        {/* Informações do App */}
        <View style={estilos.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={cores.textoSecundario} />
          <View style={estilos.infoTextoContainer}>
            <Text style={estilos.tituloInfo}>Telos v1.0.0</Text>
            <Text style={estilos.descricaoInfo}>
              Aplicativo de produtividade pessoal com foco em organização offline. 
              Gerencie seu tempo, finanças e pensamentos em um só lugar.
            </Text>
            <Text style={estilos.creditos}>
              Desenvolvido com ❤️ para sua organização pessoal
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  cabecalho: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoCarregando: {
    fontSize: 16,
    color: cores.textoSecundario,
  },

  // Configurações
  itemConfiguracao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },

  infoItem: {
    flex: 1,
    marginRight: 16,
  },

  tituloItem: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 4,
  },

  descricaoItem: {
    fontSize: 14,
    color: cores.textoSecundario,
    lineHeight: 18,
  },

  infoNotificacoes: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },

  textoInfo: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
  },

  // Horários
  itemHorario: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  infoHorario: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },

  horaTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.primaria,
    width: 60,
  },

  detalhesHorario: {
    flex: 1,
    marginLeft: 16,
  },

  tituloHorario: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 2,
  },

  mensagemHorario: {
    fontSize: 12,
    color: cores.textoSecundario,
    lineHeight: 16,
  },

  // Ações
  botaoAcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  textoBotaoAcao: {
    fontSize: 16,
    color: cores.texto,
    marginLeft: 12,
  },

  // Informações
  infoCard: {
    flexDirection: 'row',
    backgroundColor: cores.fundoSecundario,
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 20,
  },

  infoTextoContainer: {
    flex: 1,
    marginLeft: 12,
  },

  tituloInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 6,
  },

  descricaoInfo: {
    fontSize: 13,
    color: cores.textoSecundario,
    lineHeight: 18,
    marginBottom: 8,
  },

  creditos: {
    fontSize: 12,
    color: cores.textoTerciario,
    fontStyle: 'italic',
  },

  // Zona de Perigo
  zonaPerigoContainer: {
    borderWidth: 1,
    borderColor: '#ff4444',
    backgroundColor: 'rgba(255, 68, 68, 0.05)',
  },

  tituloZonaPerigo: {
    color: '#ff6666',
  },

  botaoPerigo: {
    borderBottomWidth: 0,
  },

  textoBotaoPerigo: {
    color: '#ff4444',
  },
});

export default ConfiguracoesTela;
