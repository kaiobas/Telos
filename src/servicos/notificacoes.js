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
} from '../armazenamento/armazenamentoSQLite';

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

// Controle de throttling para evitar reagendamentos muito frequentes
let ultimoReagendamento = 0;
const INTERVALO_MINIMO_REAGENDAMENTO = 1000; // 1 segundo
const MARGEM_SEGURANCA_MINUTOS = 2; // Margem de segurança para evitar disparos imediatos

// Verificar se o horário está muito próximo do atual (evitar disparos imediatos)
const verificarMargemSeguranca = (proximaNotificacao) => {
  const agora = new Date();
  const diferencaMinutos = (proximaNotificacao.getTime() - agora.getTime()) / (1000 * 60);
  return diferencaMinutos > MARGEM_SEGURANCA_MINUTOS;
};

// Função de debug para logging detalhado
const logDebugNotificacao = (horario, proximaNotificacao, agora) => {
  const diferencaMs = proximaNotificacao.getTime() - agora.getTime();
  const diferencaMinutos = Math.round(diferencaMs / (1000 * 60));
  
  console.log('=== DEBUG NOTIFICAÇÃO ===');
  console.log(`Horário solicitado: ${horario.hora}:${horario.minuto.toString().padStart(2, '0')}`);
  console.log(`Agora: ${agora.toLocaleTimeString()}`);
  console.log(`Próxima notificação: ${proximaNotificacao.toLocaleString()}`);
  console.log(`Diferença: ${diferencaMinutos} minutos`);
  console.log(`Margem de segurança OK: ${verificarMargemSeguranca(proximaNotificacao)}`);
  console.log('========================');
};

// Agendar notificação para um horário específico
export const agendarNotificacaoHorario = async (horario) => {
  if (!Notifications) {
    console.warn('Notifications não disponível');
    return;
  }
  
  try {
    const { hora, minuto, titulo, mensagem } = horario;
    
    // Validar se os valores de hora e minuto são válidos
    if (typeof hora !== 'number' || typeof minuto !== 'number' || 
        hora < 0 || hora > 23 || minuto < 0 || minuto > 59) {
      console.error('Valores de hora/minuto inválidos:', { hora, minuto });
      return;
    }
    
    // Calcular o próximo horário de disparo
    const agora = new Date();
    const proximaNotificacao = new Date();
    proximaNotificacao.setHours(hora, minuto, 0, 0);
    
    // Se o horário já passou hoje, agendar para amanhã
    if (proximaNotificacao <= agora) {
      proximaNotificacao.setDate(proximaNotificacao.getDate() + 1);
      console.log(`Horário ${hora}:${minuto.toString().padStart(2, '0')} já passou hoje, agendando para amanhã: ${proximaNotificacao.toLocaleString()}`);
    } else {
      // Verificar margem de segurança para evitar disparos imediatos
      if (!verificarMargemSeguranca(proximaNotificacao)) {
        proximaNotificacao.setDate(proximaNotificacao.getDate() + 1);
        console.log(`Horário ${hora}:${minuto.toString().padStart(2, '0')} muito próximo do atual, agendando para amanhã por segurança: ${proximaNotificacao.toLocaleString()}`);
      } else {
        console.log(`Horário ${hora}:${minuto.toString().padStart(2, '0')} ainda não passou, agendando para hoje: ${proximaNotificacao.toLocaleString()}`);
      }
    }
    
    console.log(`Agendando notificação "${titulo}" para ${proximaNotificacao.toLocaleString()}`);
    
    // Log de debug detalhado
    logDebugNotificacao(horario, proximaNotificacao, agora);
    
    // Usar date específica ao invés de hour/minute para evitar disparo imediato
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
    
    console.log(`Notificação agendada para ${proximaNotificacao.toLocaleString()} com repetição diária`);
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
    // Implementar throttling para evitar reagendamentos muito frequentes
    const agora = Date.now();
    if (agora - ultimoReagendamento < INTERVALO_MINIMO_REAGENDAMENTO) {
      console.log('Aguardando para evitar reagendamentos muito frequentes...');
      await new Promise(resolve => setTimeout(resolve, INTERVALO_MINIMO_REAGENDAMENTO));
    }
    ultimoReagendamento = Date.now();
    
    const configuracao = await carregarConfiguracaoNotificacao();
    
    if (!configuracao || !configuracao.ativo) {
      console.log('Notificações desativadas - cancelando todas');
      await cancelarTodasNotificacoes();
      return;
    }
    
    // Sempre cancelar todas primeiro para evitar duplicatas
    await cancelarTodasNotificacoes();
    
    // Aguardar um pouco mais para garantir que as notificações foram canceladas
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Reagendar apenas as ativas
    const horariosAtivos = configuracao.horarios.filter(h => h.ativo);
    
    if (horariosAtivos.length === 0) {
      console.log('Nenhum horário ativo para agendar');
      return;
    }
    
    for (const horario of horariosAtivos) {
      await agendarNotificacaoHorario(horario);
      // Pequeno delay entre cada agendamento
      await new Promise(resolve => setTimeout(resolve, 100));
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
export const agendarNotificacaoEvento = async (evento, antecedencia = 1440) => {
  if (!Notifications) {
    console.warn('Notifications não disponível');
    return;
  }
  
  try {
    const dataEvento = new Date(evento.data + 'T00:00:00');
    const dataNotificacao = new Date(dataEvento.getTime() - (antecedencia * 60 * 1000));
    
    // Formatear mensagem baseada na antecedência
    let mensagemTempo;
    if (antecedencia >= 1440) { // 1 dia ou mais
      const dias = Math.floor(antecedencia / 1440);
      mensagemTempo = dias === 1 ? 'amanhã' : `em ${dias} dias`;
    } else if (antecedencia >= 60) { // 1 hora ou mais
      const horas = Math.floor(antecedencia / 60);
      mensagemTempo = horas === 1 ? 'em 1 hora' : `em ${horas} horas`;
    } else { // menos de 1 hora
      mensagemTempo = antecedencia === 1 ? 'em 1 minuto' : `em ${antecedencia} minutos`;
    }
    
    // Só agendar se a data for no futuro
    if (dataNotificacao > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `📅 Evento se aproximando`,
          body: `${evento.titulo} acontece ${mensagemTempo}!`,
          data: { 
            tipo: 'evento',
            eventoId: evento.id 
          },
        },
        trigger: {
          date: dataNotificacao,
        },
      });
      
      console.log(`Notificação do evento "${evento.titulo}" agendada para ${dataNotificacao} (${mensagemTempo})`);
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
    
    // Log detalhado das notificações para debug
    notificacoes.forEach((notif, index) => {
      const trigger = notif.trigger;
      if (trigger.type === 'calendar') {
        console.log(`Notificação ${index + 1}: ${notif.content.title} - Data: ${new Date(trigger.value).toLocaleString()}`);
      } else if (trigger.hour !== undefined) {
        console.log(`Notificação ${index + 1}: ${notif.content.title} - Horário: ${trigger.hour}:${trigger.minute.toString().padStart(2, '0')} (repetição diária)`);
      } else {
        console.log(`Notificação ${index + 1}: ${notif.content.title} - Trigger:`, trigger);
      }
    });
    
    return notificacoes;
  } catch (error) {
    console.error('Erro ao verificar notificações:', error);
    return [];
  }
};
