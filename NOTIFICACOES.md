# 🔔 Sistema de Notificações do Telos

O Telos agora conta com um sistema completo de notificações para ajudar você a manter seus hábitos de organização pessoal.

## 📱 **Funcionalidades Implementadas**

### ✅ **1. Notificações Diárias Programadas**
- **4 horários padrão** configurados:
  - **08:00** - Bom dia! Planeje suas atividades
  - **12:00** - Pausa para almoço, revise seus eventos
  - **18:00** - Final de tarde, faça anotações no diário
  - **21:00** - Boa noite! Reflita sobre o dia

### ✅ **2. Notificações de Eventos**
- **Notificação automática** 1 hora antes dos eventos do calendário
- **Configuração inteligente** que só agenda para eventos futuros

### ✅ **3. Tela de Configurações**
- **Ativar/Desativar** sistema completo de notificações
- **Controle individual** de cada horário de lembrete
- **Teste de notificação** para verificar funcionamento
- **Status em tempo real** das notificações agendadas

## 🛠️ **Componentes Técnicos**

### **Arquivos Criados/Modificados:**

1. **`src/servicos/notificacoes.js`** - Serviço principal de notificações
2. **`src/telas/NotificacoesTela.js`** - Interface de configuração
3. **`src/armazenamento/armazenamentoLocal.js`** - Funções de persistência
4. **`App.js`** - Inicialização automática do sistema
5. **`app.json`** - Configurações de permissões

### **Dependências Instaladas:**
```bash
expo-notifications
expo-device  
expo-constants
```

## 🎯 **Como Usar**

### **Para o Usuário:**

1. **Primeira vez:**
   - O app vai solicitar permissão para notificações
   - Sistema será ativado automaticamente com horários padrão

2. **Configurar notificações:**
   - Vá para a aba **"Alertas"** 🔔
   - Use o switch principal para ativar/desativar
   - Configure horários individuais conforme sua preferência

3. **Testar funcionamento:**
   - Use o botão **"Testar Notificação"**
   - Verifica se receberá uma notificação em 2 segundos

### **Para Desenvolvedores:**

```javascript
// Importar funções do serviço
import { 
  inicializarNotificacoes,
  agendarNotificacaoEvento,
  cancelarTodasNotificacoes 
} from './src/servicos/notificacoes';

// Inicializar sistema
await inicializarNotificacoes();

// Agendar notificação para evento
await agendarNotificacaoEvento(evento, 60); // 60 minutos antes
```

## 📋 **Fluxo de Funcionamento**

### **Inicialização:**
1. App carrega → `inicializarNotificacoes()`
2. Solicita permissões do dispositivo
3. Cria configuração padrão se não existir
4. Agenda notificações baseadas na configuração

### **Adição de Eventos:**
1. Usuário cria evento no calendário
2. Sistema agenda notificação 1h antes automaticamente
3. Notificação só é criada se evento for no futuro

### **Configuração de Horários:**
1. Usuário acessa tela de Alertas
2. Pode ativar/desativar sistema completo
3. Pode configurar horários individuais
4. Mudanças aplicam automaticamente

## 🔧 **Configurações Técnicas**

### **Android:**
- Canal de notificação: `"Telos - Lembretes"`
- Importância: Padrão
- Vibração: Ativada
- Cor do LED: Azul (#007AFF)

### **iOS:**
- Permissões solicitadas automaticamente
- Sons e alertas ativados
- Badge desativado

### **Persistência:**
- Configurações salvas em `AsyncStorage`
- Chave: `@telos_notificacoes_config`
- Estrutura JSON com horários e estados

## 🚀 **Próximas Melhorias**

- [ ] **Notificações personalizadas** por categoria
- [ ] **Lembretes de finanças** (vencimentos, metas)
- [ ] **Configuração de antecedência** para eventos
- [ ] **Estatísticas** de engajamento com notificações
- [ ] **Sons personalizados** por tipo de lembrete

## 💡 **Dicas de Uso**

1. **Mantenha ativado** para criar hábitos consistentes
2. **Teste regularmente** se as notificações estão funcionando
3. **Personalize horários** de acordo com sua rotina
4. **Desative temporariamente** durante férias ou fins de semana

---

**🎯 Objetivo:** Transformar o Telos em seu companheiro diário de produtividade, lembrando você de manter seus hábitos de organização pessoal!
