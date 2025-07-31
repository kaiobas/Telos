// Importações condicionais para evitar problemas de bundling
let Notifications, Device, Constants;

try {
  Notifications = require('expo-notifications');
  Device = require('expo-device');
  Constants = require('expo-constants');
} catch (error) {
  console.warn('Dependências de notificação não disponíveis:', error.message);
}
import { Platform } from 'react-native';
import { 
  salvarConfiguracaoNotificacao, 
  carregarConfiguracaoNotificacao 
} from '../armazenamento/armazenamentoLocal';

// Configurar comportamento das notificações
export const configurarNotificationHandler = () => {
  if (Notifications) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
};

// Configurar canal de notificação para Android
export const configurarCanalNotificacao = async () => {
  if (!Notifications || !Platform) return;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Telos - Lembretes',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#007AFF',
    });
  }
};

// Solicitar apenas permissões (sem agendar)
export const solicitarApenasPermissoes = async () => {
  if (!Notifications || !Device || !Platform) {
    console.warn('Dependências de notificação não disponíveis');
    return false;
  }
  
  try {
    if (Platform.OS === 'android') {
      await configurarCanalNotificacao();
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      return finalStatus === 'granted';
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao solicitar permissões:', error);
    return false;
  }
};

// Solicitar permissões
export const solicitarPermissoes = async () => {
  if (!Notifications || !Device || !Platform) {
    throw new Error('Dependências de notificação não disponíveis');
  }
  
  if (Platform.OS === 'android') {
    await configurarCanalNotificacao();
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      throw new Error('Falha ao obter permissão para notificações!');
    }
    
    return finalStatus === 'granted';
  } else {
    throw new Error('Deve ser usado em um dispositivo físico para notificações!');
  }
};

// Horários padrão para lembretes (removidos - sistema minimalista)
export const HORARIOS_PADRAO = [];

// Agendar notificação para um horário específico
export const agendarNotificacaoHorario = async (horario) => {
  if (!Notifications) {
    console.warn('Notifications não disponível');
    return;
  }
  
  try {
    const { hora, minuto, titulo, mensagem } = horario;
    
    // Calcular o próximo horário de disparo
    const agora = new Date();
    const proximaNotificacao = new Date();
    proximaNotificacao.setHours(hora, minuto, 0, 0);
    
    // Sempre agendar para o próximo dia para evitar disparos imediatos
    // quando o usuário está configurando as notificações
    proximaNotificacao.setDate(proximaNotificacao.getDate() + 1);
    
    console.log(`Agendando notificação "${titulo}" para ${proximaNotificacao.toLocaleString()}`);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: titulo,
        body: mensagem,
        data: { tipo: 'lembrete_diario' },
      },
      trigger: {
        date: proximaNotificacao,
        repeats: true,
        repeatInterval: 'day',
      },
    });
    
    console.log(`Notificação agendada para ${hora}:${minuto.toString().padStart(2, '0')}`);
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
    throw error;
  }
};

// Agendar todas as notificações configuradas
export const agendarTodasNotificacoes = async (forcarReagendamento = false) => {
  try {
    const configuracao = await carregarConfiguracaoNotificacao();
    
    if (!configuracao || !configuracao.ativo) {
      console.log('Notificações desativadas');
      await cancelarTodasNotificacoes();
      return;
    }
    
    // Só cancelar e reagendar se forçado ou se for a primeira vez
    if (forcarReagendamento) {
      await cancelarTodasNotificacoes();
    }
    
    // Agendar novos horários apenas para os ativos
    for (const horario of configuracao.horarios) {
      if (horario.ativo) {
        await agendarNotificacaoHorario(horario);
      }
    }
    
    console.log('Notificações ativas foram agendadas');
  } catch (error) {
    console.error('Erro ao agendar notificações:', error);
    throw error;
  }
};

// Função específica para atualizar notificações quando há mudanças na configuração
export const atualizarNotificacoes = async () => {
  try {
    const configuracao = await carregarConfiguracaoNotificacao();
    
    if (!configuracao || !configuracao.ativo) {
      console.log('Notificações desativadas - cancelando todas');
      await cancelarTodasNotificacoes();
      return;
    }
    
    // Sempre cancelar todas primeiro para evitar duplicatas
    await cancelarTodasNotificacoes();
    
    // Aguardar um pequeno delay para garantir que as notificações foram canceladas
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Reagendar apenas as ativas
    const horariosAtivos = configuracao.horarios.filter(h => h.ativo);
    
    if (horariosAtivos.length === 0) {
      console.log('Nenhum horário ativo para agendar');
      return;
    }
    
    for (const horario of horariosAtivos) {
      await agendarNotificacaoHorario(horario);
    }
    
    console.log(`${horariosAtivos.length} notificações ativas foram agendadas`);
  } catch (error) {
    console.error('Erro ao atualizar notificações:', error);
    throw error;
  }
};

// Cancelar todas as notificações
export const cancelarTodasNotificacoes = async () => {
  if (!Notifications) {
    console.warn('Notifications não disponível');
    return;
  }
  
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Todas as notificações foram canceladas');
  } catch (error) {
    console.error('Erro ao cancelar notificações:', error);
    throw error;
  }
};

// Apagar todas as notificações e configurações
export const apagarTodasNotificacoes = async () => {
  try {
    // Cancelar todas as notificações agendadas
    await cancelarTodasNotificacoes();
    
    // Resetar configuração para estado inicial
    const configuracaoLimpa = {
      ativo: false,
      horarios: []
    };
    
    await salvarConfiguracaoNotificacao(configuracaoLimpa);
    console.log('Todas as notificações e configurações foram apagadas');
    
    return configuracaoLimpa;
  } catch (error) {
    console.error('Erro ao apagar notificações:', error);
    throw error;
  }
};

// Agendar notificação para evento específico
export const agendarNotificacaoEvento = async (evento, antecedencia = 60) => {
  if (!Notifications) {
    console.warn('Notifications não disponível');
    return;
  }
  
  try {
    const dataEvento = new Date(evento.data + 'T00:00:00');
    const dataNotificacao = new Date(dataEvento.getTime() - (antecedencia * 60 * 1000));
    
    // Só agendar se a data for no futuro
    if (dataNotificacao > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `📅 Evento se aproximando`,
          body: `${evento.titulo} está chegando em ${antecedencia} minutos!`,
          data: { 
            tipo: 'evento',
            eventoId: evento.id 
          },
        },
        trigger: {
          date: dataNotificacao,
        },
      });
      
      console.log(`Notificação do evento "${evento.titulo}" agendada para ${dataNotificacao}`);
    }
  } catch (error) {
    console.error('Erro ao agendar notificação do evento:', error);
    throw error;
  }
};

// Inicializar sistema de notificações
export const inicializarNotificacoes = async () => {
  if (!Notifications || !Device) {
    console.warn('Dependências de notificação não disponíveis');
    return false;
  }
  
  try {
    // Configurar handler primeiro
    configurarNotificationHandler();
    
    const permissao = await solicitarPermissoes();
    
    if (permissao) {
      // Verificar se já existe configuração
      let configuracao = await carregarConfiguracaoNotificacao();
      
      if (!configuracao) {
        // Criar configuração padrão vazia (sistema minimalista)
        configuracao = {
          ativo: false,
          horarios: []
        };
        
        await salvarConfiguracaoNotificacao(configuracao);
      }
      
      // Não agendar automaticamente na inicialização
      // As notificações serão agendadas apenas quando o usuário ativar manualmente
      console.log('Sistema de notificações inicializado - aguardando ativação manual');
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao inicializar notificações:', error);
    return false;
  }
};

// Verificar status das notificações agendadas
export const verificarNotificacoesAgendadas = async () => {
  if (!Notifications) {
    console.warn('Notifications não disponível');
    return [];
  }
  
  try {
    const notificacoes = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Notificações agendadas:', notificacoes.length);
    return notificacoes;
  } catch (error) {
    console.error('Erro ao verificar notificações:', error);
    return [];
  }
};
