# 📱 Diário Pessoal - App de Produtividade

Um aplicativo mobile completo para organização pessoal, desenvolvido em React Native com Expo. Focado em funcionalidades offline com tema escuro elegante e minimalista.

## ✨ Funcionalidades

### 📆 Calendário
- Visualização mensal interativa
- Adicionar e gerenciar eventos por data
- Marcações visuais para dias com eventos
- Interface intuitiva para criação rápida de compromissos

### 📓 Diário
- Criar entradas diárias com título e conteúdo
- Editar entradas existentes
- Visualização cronológica das entradas
- Busca e organização de memórias pessoais

### 💸 Controle Financeiro
- Registrar receitas e despesas
- Categorização automática das transações
- Resumo financeiro em tempo real
- Acompanhamento de saldo e gastos

### 🤖 Assistente IA
- Botão flutuante para acesso rápido
- Interface de chat moderna
- **INTEGRAÇÃO COMPLETA com GPT-4o**
- **Pode adicionar entradas no diário automaticamente**
- **Pode registrar transações financeiras**
- **Nunca remove dados - apenas adiciona**
- Entende comandos em linguagem natural
- Feedback visual das ações executadas

## 🎨 Características de Design

- **Tema Dark**: Interface totalmente em preto e branco
- **Minimalismo**: Design limpo e focado na usabilidade
- **Animações Suaves**: Transições fluidas inspiradas no PrimeReact
- **Responsivo**: Adaptado para diferentes tamanhos de tela
- **Acessível**: Contrastes adequados e navegação clara

## 🛠️ Tecnologias Utilizadas

- **React Native** com Expo
- **React Navigation** (Bottom Tabs)
- **AsyncStorage** para persistência local
- **Ionicons** para ícones
- **react-native-calendars** para calendário
- **react-native-safe-area-context** para áreas seguras

## 📁 Estrutura do Projeto

```
src/
├── telas/                 # Telas principais do app
│   ├── CalendarioTela.js  # Tela do calendário
│   ├── DiarioTela.js      # Tela do diário
│   └── FinancasTela.js    # Tela de finanças
├── componentes/           # Componentes reutilizáveis
│   └── BotaoIA.js         # Botão flutuante da IA
├── navegacao/             # Configuração de navegação
│   └── NavegadorPrincipal.js
├── armazenamento/         # Funções de persistência
│   └── armazenamentoLocal.js
├── estilos/               # Arquivos de estilo
│   ├── cores.js           # Paleta de cores
│   └── estilosGlobais.js  # Estilos compartilhados
└── servicos/              # Serviços auxiliares
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI instalado globalmente

### Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd Diario
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm start
```

### Executar em Plataformas Específicas

```bash
# Android
npm run android

# iOS (requer macOS)
npm run ios

# Web
npm run web
```

## 💾 Armazenamento Local

Todos os dados são salvos localmente no dispositivo usando AsyncStorage:

- **Entradas do Diário**: Título, conteúdo e data de criação
- **Eventos do Calendário**: Título, descrição e data do evento
- **Transações Financeiras**: Descrição, valor, tipo e categoria

## 🔮 Funcionalidades Implementadas

- ✅ Integração completa com GPT-4o
- ✅ IA pode adicionar entradas no diário
- ✅ IA pode registrar transações financeiras  
- ✅ Interface de chat inteligente
- ✅ Comandos em linguagem natural
- ✅ Feedback visual de ações executadas

## 🔮 Futuras Implementações

- [ ] Sistema de backup e sincronização
- [ ] Notificações e lembretes
- [ ] Exportação de dados
- [ ] Temas personalizáveis
- [ ] Gráficos financeiros avançados
- [ ] Pesquisa avançada no diário
- [ ] Análises inteligentes com IA

## 🎯 Objetivos do Projeto

Este aplicativo foi desenvolvido com foco em:

1. **Privacidade**: Todos os dados ficam no dispositivo
2. **Simplicidade**: Interface intuitiva e fácil de usar
3. **Produtividade**: Ferramentas essenciais para organização pessoal
4. **Offline-First**: Funciona completamente sem internet
5. **Escalabilidade**: Estrutura preparada para futuras funcionalidades


## 🤝 Contribuição

Este é um projeto pessoal, mas sugestões e melhorias são sempre bem-vindas!

## 📄 Licença

Este projeto é de uso pessoal e educacional.

---

**Desenvolvido por Kaio Alves para organização pessoal e produtividade**
