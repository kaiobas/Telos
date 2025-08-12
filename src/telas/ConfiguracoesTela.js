import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';
import estilos from '../estilos/configuracaoEstilos'
import estilosGlobais from '../estilos/estilosGlobais';
import Header from '../componentes/Header';
import {
  carregarConfiguracaoNotificacao,
  atualizarConfiguracaoNotificacao,
  carregarConfiguracaoApp,
  atualizarConfiguracaoApp,
  exportarTodosDados,
  limparTodosDados,
} from '../armazenamento/armazenamentoSQLite';
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
  const [modalHorarioVisivel, setModalHorarioVisivel] = useState(false);
  const [novoHorario, setNovoHorario] = useState({
    hora: 8,
    minuto: 0,
    titulo: '',
    mensagem: '',
    ativo: true
  });
  const [editandoHorario, setEditandoHorario] = useState(null);

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
      
      // Carregar configurações do app
      let configApp = await carregarConfiguracaoApp();
      if (!configApp) {
        configApp = {
          modoEscuro: true,
          animacoes: true,
          sons: true,
          vibracoes: true,
          lembreteEventos: true,
          backupAutomatico: false,
          compactarDados: false,
        };
        await atualizarConfiguracaoApp(configApp);
      }
      
      setConfiguracaoApp(configApp);
      
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
        // Verificar e solicitar permissões
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
        ativo 
          ? 'Notificações ativadas! Os lembretes serão enviados nos horários configurados a partir de amanhã.' 
          : 'Notificações desativadas.'
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

  const alternarConfiguracaoApp = async (chave) => {
    const novaConfig = {
      ...configuracaoApp,
      [chave]: !configuracaoApp[chave]
    };
    
    setConfiguracaoApp(novaConfig);
    
    // Salvar no AsyncStorage
    const sucesso = await atualizarConfiguracaoApp(novaConfig);
    
    if (sucesso) {
      Alert.alert('Configuração', `${chave} ${configuracaoApp[chave] ? 'desativado' : 'ativado'}`);
    } else {
      // Reverter se falhou
      setConfiguracaoApp(configuracaoApp);
      Alert.alert('Erro', 'Não foi possível salvar a configuração.');
    }
  };

  const limparTodosDadosConfirmacao = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Esta ação irá apagar TODOS os seus dados (diário, finanças, eventos). Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'APAGAR TUDO', 
          style: 'destructive',
          onPress: async () => {
            const sucesso = await limparTodosDados();
            if (sucesso) {
              Alert.alert('Dados Limpos', 'Todos os dados foram removidos.');
              // Recarregar dados para resetar a interface
              carregarDados();
            } else {
              Alert.alert('Erro', 'Não foi possível limpar os dados.');
            }
          }
        }
      ]
    );
  };

  const exportarDadosConfirmacao = async () => {
    Alert.alert(
      'Exportar Dados',
      'Esta funcionalidade criará um backup de todos os seus dados no console.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: async () => {
            const dados = await exportarTodosDados();
            if (dados) {
              Alert.alert(
                'Backup Criado',
                'Dados exportados no console do desenvolvedor. Copie e salve o JSON mostrado.',
                [{ text: 'OK' }]
              );
            } else {
              Alert.alert('Erro', 'Não foi possível exportar os dados.');
            }
          }
        }
      ]
    );
  };

  const abrirModalHorario = (horario = null) => {
    if (horario) {
      // Editando horário existente
      setEditandoHorario(horario.id);
      setNovoHorario({
        hora: horario.hora,
        minuto: horario.minuto,
        titulo: horario.titulo,
        mensagem: horario.mensagem,
        ativo: horario.ativo
      });
    } else {
      // Novo horário
      setEditandoHorario(null);
      setNovoHorario({
        hora: 8,
        minuto: 0,
        titulo: '',
        mensagem: '',
        ativo: true
      });
    }
    setModalHorarioVisivel(true);
  };

  const salvarHorario = async () => {
    if (!novoHorario.titulo.trim()) {
      Alert.alert('Erro', 'Por favor, adicione um título para o lembrete.');
      return;
    }

    if (!novoHorario.mensagem.trim()) {
      Alert.alert('Erro', 'Por favor, adicione uma mensagem para o lembrete.');
      return;
    }

    try {
      let novosHorarios;
      
      if (editandoHorario !== null) {
        // Editando horário existente
        novosHorarios = configuracao.horarios.map(h => 
          h.id === editandoHorario ? { ...novoHorario, id: editandoHorario } : h
        );
      } else {
        // Adicionando novo horário
        const novoId = configuracao.horarios.length > 0 
          ? Math.max(...configuracao.horarios.map(h => h.id)) + 1 
          : 0;
        
        novosHorarios = [...configuracao.horarios, { ...novoHorario, id: novoId }];
      }

      const novaConfig = { ...configuracao, horarios: novosHorarios };
      
      await atualizarConfiguracaoNotificacao(novaConfig);
      setConfiguracao(novaConfig);
      
      // Reagendar notificações se estiver ativo
      if (configuracao.ativo) {
        await atualizarNotificacoes();
        const agendadas = await verificarNotificacoesAgendadas();
        setNotificacoesAgendadas(agendadas.length);
      }
      
      setModalHorarioVisivel(false);
      Alert.alert(
        'Sucesso', 
        editandoHorario !== null 
          ? 'Horário atualizado! A notificação será enviada no próximo horário agendado.' 
          : 'Horário adicionado! A notificação será enviada no próximo horário agendado.'
      );
    } catch (error) {
      console.error('Erro ao salvar horário:', error);
      Alert.alert('Erro', 'Não foi possível salvar o horário.');
    }
  };

  const excluirHorario = (id) => {
    Alert.alert(
      'Excluir Horário',
      'Tem certeza que deseja excluir este horário de lembrete?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const novosHorarios = configuracao.horarios.filter(h => h.id !== id);
              const novaConfig = { ...configuracao, horarios: novosHorarios };
              
              await atualizarConfiguracaoNotificacao(novaConfig);
              setConfiguracao(novaConfig);
              
              // Reagendar notificações se estiver ativo
              if (configuracao.ativo) {
                await atualizarNotificacoes();
                const agendadas = await verificarNotificacoesAgendadas();
                setNotificacoesAgendadas(agendadas.length);
              }
              
              Alert.alert('Sucesso', 'Horário excluído!');
            } catch (error) {
              console.error('Erro ao excluir horário:', error);
              Alert.alert('Erro', 'Não foi possível excluir o horário.');
            }
          }
        }
      ]
    );
  };

  const apagarTodasNotificacoesConfig = () => {
    Alert.alert(
      'Apagar Todas as Notificações',
      'Isto irá remover todas as notificações configuradas e desativar o sistema. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Apagar Tudo', 
          style: 'destructive',
          onPress: async () => {
            try {
              const novaConfig = await apagarTodasNotificacoes();
              setConfiguracao(novaConfig);
              setNotificacoesAgendadas(0);
              
              Alert.alert('Sucesso', 'Todas as notificações foram apagadas!');
            } catch (error) {
              console.error('Erro ao apagar notificações:', error);
              Alert.alert('Erro', 'Não foi possível apagar as notificações.');
            }
          }
        }
      ]
    );
  };

  const formatarHorario = (hora, minuto) => {
    return `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
  };

  const calcularProximaNotificacao = (hora, minuto) => {
    const agora = new Date();
    const proxima = new Date();
    proxima.setHours(hora, minuto, 0, 0);
    
    // Se o horário já passou hoje, será amanhã
    if (proxima <= agora) {
      proxima.setDate(proxima.getDate() + 1);
    }
    
    const isAmanha = proxima.getDate() !== agora.getDate();
    const horasRestantes = Math.floor((proxima - agora) / (1000 * 60 * 60));
    const minutosRestantes = Math.floor(((proxima - agora) % (1000 * 60 * 60)) / (1000 * 60));
    
    if (isAmanha) {
      return `Amanhã às ${formatarHorario(hora, minuto)}`;
    } else if (horasRestantes > 0) {
      return `Em ${horasRestantes}h ${minutosRestantes}min`;
    } else {
      return `Em ${minutosRestantes} minutos`;
    }
  };

  const testarNotificacao = async () => {
    try {
      const { scheduleNotificationAsync } = await import('expo-notifications');
      
      await scheduleNotificationAsync({
        content: {
          title: 'Teste de Notificação',
          body: 'Esta é uma notificação de teste do Telos! Sistema funcionando perfeitamente.',
          data: { tipo: 'teste' },
        },
        trigger: { seconds: 2 },
      });
      
      Alert.alert(
        'Teste Enviado',
        'Uma notificação de teste será exibida em 2 segundos.\n\nSuas notificações regulares serão enviadas nos horários configurados, não imediatamente.',
        [{ text: 'Entendi' }]
      );
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
          <Text style={estilosGlobais.titulo}>Configurações</Text>
        </View>

        {/* Seção de Notificações */}
        <View style={estilosGlobais.cartao}>
          <Text style={estilosGlobais.subtitulo}>Notificações</Text>
          
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
                 {notificacoesAgendadas} notificações agendadas
              </Text>
            </View>
          )}
        </View>

        {/* Horários de Notificação */}
        {configuracao?.ativo && (
          <View style={estilosGlobais.cartao}>
            <View style={estilos.cabecalhoSecao}>
              <Text style={estilosGlobais.subtitulo}>Horários dos Lembretes</Text>
              <View style={estilos.botoesAcao}>
                <TouchableOpacity
                  style={estilos.botaoAdicionar}
                  onPress={() => abrirModalHorario()}
                >
                  <Ionicons name="add" size={20} color={cores.fundo} />
                </TouchableOpacity>
              </View>
            </View>
            
            {configuracao.horarios.length > 0 ? (
              <>
                {configuracao.horarios.map((horario) => (
                  <View key={horario.id} style={estilos.itemHorario}>
                    <View style={estilos.infoHorario}>
                      <Text style={estilos.horaTexto}>
                        {formatarHorario(horario.hora, horario.minuto)}
                      </Text>
                      <View style={estilos.detalhesHorario}>
                        <Text style={estilos.tituloHorario}>{horario.titulo}</Text>
                        <Text style={estilos.mensagemHorario}>{horario.mensagem}</Text>
                        {horario.ativo && configuracao?.ativo && (
                          <Text style={estilos.proximaNotificacao}>
                            {calcularProximaNotificacao(horario.hora, horario.minuto)}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={estilos.acoesHorario}>
                      <TouchableOpacity
                        style={estilos.botaoEditar}
                        onPress={() => abrirModalHorario(horario)}
                      >
                        <Ionicons name="pencil-outline" size={16} color={cores.primaria} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={estilos.botaoExcluir}
                        onPress={() => excluirHorario(horario.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#ff4444" />
                      </TouchableOpacity>
                      <Switch
                        value={horario.ativo}
                        onValueChange={() => alternarHorario(horario.id)}
                        trackColor={{ false: cores.textoTerciario, true: cores.primaria }}
                        thumbColor={cores.fundo}
                      />
                    </View>
                  </View>
                ))}
                
                <TouchableOpacity
                  style={estilos.botaoResetar}
                  onPress={apagarTodasNotificacoesConfig}
                >
                  <Ionicons name="trash-outline" size={16} color={cores.textoSecundario} />
                  <Text style={estilos.textoBotaoResetar}>Apagar Todas</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={estilos.semHorarios}>
                <Ionicons name="time-outline" size={48} color={cores.textoTerciario} />
                <Text style={estilos.textoSemHorarios}>
                  Nenhum horário configurado
                </Text>
                <Text style={estilos.dicaSemHorarios}>
                  Toque no botão + para adicionar seu primeiro lembrete
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Seção de Interface */}
        <View style={estilosGlobais.cartao}>
          <Text style={estilosGlobais.subtitulo}>Interface</Text>
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
          <Text style={estilosGlobais.subtitulo}>Som e Vibração</Text>
          
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
          <Text style={estilosGlobais.subtitulo}>Dados e Backup</Text>
          
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
          <Text style={estilosGlobais.subtitulo}>Ações</Text>
          
          <TouchableOpacity
            style={estilos.botaoAcao}
            onPress={testarNotificacao}
          >
            <Ionicons name="notifications-outline" size={20} color={cores.primaria} />
            <Text style={estilos.textoBotaoAcao}>Testar Notificação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botaoAcao}
            onPress={exportarDadosConfirmacao}
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
          <Text style={[estilosGlobais.subtitulo, estilos.tituloZonaPerigo]}>Zona de Perigo</Text>
          
          <TouchableOpacity
            style={[estilos.botaoAcao, estilos.botaoPerigo]}
            onPress={limparTodosDadosConfirmacao}
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
              Desenvolvido para organização pessoal
            </Text>
          </View>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modal para Adicionar/Editar Horário */}
      <Modal
        visible={modalHorarioVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalHorarioVisivel(false)}
      >
        <View style={estilos.modalContainer}>
          <View style={estilos.modalConteudo}>
            <View style={estilos.cabecalhoModal}>
              <Text style={estilosGlobais.subtitulo}>
                {editandoHorario !== null ? 'Editar Lembrete' : 'Novo Lembrete'}
              </Text>
              <TouchableOpacity onPress={() => setModalHorarioVisivel(false)}>
                <Ionicons name="close" size={24} color={cores.primaria} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={estilos.modalScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={estilos.modalScrollContent}
            >
              {/* Seletor de Horário */}
              <Text style={estilos.labelInput}>Horário</Text>
              <View style={estilos.seletorHorario}>
                <View style={estilos.inputHora}>
                  <Text style={estilos.labelHora}>Hora</Text>
                  <TextInput
                    style={estilos.inputNumero}
                    value={novoHorario.hora.toString()}
                    onChangeText={(text) => {
                      // Permitir string vazia temporariamente
                      if (text === '') {
                        setNovoHorario(prev => ({ ...prev, hora: 0 }));
                        return;
                      }
                      
                      const hora = parseInt(text);
                      if (!isNaN(hora) && hora >= 0 && hora <= 23) {
                        setNovoHorario(prev => ({ ...prev, hora }));
                      }
                    }}
                    onBlur={() => {
                      // Garantir que sempre tenha um valor válido ao sair do campo
                      if (novoHorario.hora < 0 || novoHorario.hora > 23 || isNaN(novoHorario.hora)) {
                        setNovoHorario(prev => ({ ...prev, hora: 8 }));
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="08"
                    placeholderTextColor={cores.textoTerciario}
                    selectTextOnFocus={true}
                  />
                </View>
                
                <Text style={estilos.separadorHora}>:</Text>
                
                <View style={estilos.inputHora}>
                  <Text style={estilos.labelHora}>Minuto</Text>
                  <TextInput
                    style={estilos.inputNumero}
                    value={novoHorario.minuto.toString()}
                    onChangeText={(text) => {
                      // Permitir string vazia temporariamente
                      if (text === '') {
                        setNovoHorario(prev => ({ ...prev, minuto: 0 }));
                        return;
                      }
                      
                      const minuto = parseInt(text);
                      if (!isNaN(minuto) && minuto >= 0 && minuto <= 59) {
                        setNovoHorario(prev => ({ ...prev, minuto }));
                      }
                    }}
                    onBlur={() => {
                      // Garantir que sempre tenha um valor válido ao sair do campo
                      if (novoHorario.minuto < 0 || novoHorario.minuto > 59 || isNaN(novoHorario.minuto)) {
                        setNovoHorario(prev => ({ ...prev, minuto: 0 }));
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="00"
                    placeholderTextColor={cores.textoTerciario}
                    selectTextOnFocus={true}
                  />
                </View>
              </View>

              {/* Título */}
              <Text style={estilos.labelInput}>Título</Text>
              <TextInput
                style={estilosGlobais.input}
                placeholder="Adicione um título para o lembrete"
                placeholderTextColor={cores.textoTerciario}
                value={novoHorario.titulo}
                onChangeText={(text) => setNovoHorario(prev => ({ ...prev, titulo: text }))}
                maxLength={50}
              />

              {/* Mensagem */}
              <Text style={estilos.labelInput}>Mensagem</Text>
              <TextInput
                style={[estilosGlobais.input, estilos.inputMensagem]}
                placeholder="Adicione uma mensagem para o lembrete"
                placeholderTextColor={cores.textoTerciario}
                value={novoHorario.mensagem}
                onChangeText={(text) => setNovoHorario(prev => ({ ...prev, mensagem: text }))}
                multiline={true}
                numberOfLines={3}
                maxLength={200}
              />

              {/* Switch Ativo */}
              <View style={estilos.switchContainer}>
                <Text style={estilos.labelSwitch}>Ativar este lembrete</Text>
                <Switch
                  value={novoHorario.ativo}
                  onValueChange={(ativo) => setNovoHorario(prev => ({ ...prev, ativo }))}
                  trackColor={{ false: cores.textoTerciario, true: cores.primaria }}
                  thumbColor={cores.fundo}
                />
              </View>

              {/* Prévia */}
              <View style={estilos.previa}>
                <Text style={estilos.labelPrevia}>Prévia:</Text>
                <Text style={estilos.horaPrevia}>
                  {formatarHorario(novoHorario.hora, novoHorario.minuto)}
                </Text>
                <Text style={estilos.tituloPrevia}>{novoHorario.titulo || 'Título do lembrete'}</Text>
                <Text style={estilos.mensagemPrevia}>
                  {novoHorario.mensagem || 'Mensagem do lembrete'}
                </Text>
              </View>
            </ScrollView>

            {/* Botões fixos na parte inferior */}
            <View style={estilos.botoesModal}>
              <TouchableOpacity
                style={estilosGlobais.botaoSecundario}
                onPress={() => setModalHorarioVisivel(false)}
              >
                <Text style={estilosGlobais.textoBotaoSecundario}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={estilosGlobais.botao}
                onPress={salvarHorario}
              >
                <Text style={estilosGlobais.textoBotao}>
                  {editandoHorario !== null ? 'Atualizar' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConfiguracoesTela;
