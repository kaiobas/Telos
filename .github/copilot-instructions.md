<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Instruções do Projeto - Aplicativo Diário Pessoal

Este é um aplicativo React Native construído com Expo, focado em produtividade pessoal e organização offline.

## Características do Projeto

### Tecnologias
- React Native com Expo
- Navegação com React Navigation (Bottom Tabs)
- Armazenamento local com AsyncStorage
- Biblioteca de calendário: react-native-calendars
- Ícones: @expo/vector-icons (Ionicons)

### Estrutura de Pastas
- `src/telas/` - Componentes de tela principais
- `src/componentes/` - Componentes reutilizáveis
- `src/navegacao/` - Configuração de navegação
- `src/armazenamento/` - Funções de armazenamento local
- `src/estilos/` - Arquivos de estilo e tema
- `src/servicos/` - Serviços auxiliares

### Tema Visual
- **Modo escuro**: Fundo preto (#000000) com texto branco
- **Estilo minimalista**: Interface limpa com elementos bem definidos
- **Animações suaves**: Transições e interações fluidas
- **Paleta monocromática**: Preto, branco e tons de cinza

### Funcionalidades Principais

1. **Calendário** (`CalendarioTela.js`)
   - Visualização mensal com marcações
   - Adicionar/editar/excluir eventos por data
   - Armazenamento local dos eventos

2. **Diário** (`DiarioTela.js`)
   - Criar entradas com título e conteúdo
   - Editar entradas existentes
   - Excluir entradas
   - Lista cronológica das entradas

3. **Finanças** (`FinancasTela.js`)
   - Registrar receitas e despesas
   - Categorização de transações
   - Resumo financeiro (receitas, despesas, saldo)
   - Excluir transações

4. **Assistente IA** (`BotaoIA.js`)
   - Botão flutuante para acesso rápido
   - Interface de chat modal
   - Preparado para integração futura com APIs de IA

### Padrões de Código

- **Armazenamento**: Todas as funções de persistência estão em `armazenamentoLocal.js`
- **Estilos**: Uso de `estilosGlobais.js` para consistência visual
- **Cores**: Centralizadas em `cores.js` para fácil manutenção
- **Nomenclatura**: Nomes de arquivos e pastas em português
- **Componentes**: Estrutura funcional com hooks React

### Boas Práticas

- Validação de dados antes de salvar
- Feedback visual para ações do usuário (alerts)
- Estados de carregamento e atualização
- Tratamento de erros com try/catch
- Interfaces responsivas e acessíveis

### Futuras Integrações

- **IA**: Estrutura preparada para integração com OpenAI ou modelos locais
- **Sincronização**: Base para futuras funcionalidades de backup
- **Notificações**: Estrutura extensível para lembretes

### Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar no desenvolvimento
npm start

# Executar em plataformas específicas
npm run android
npm run ios
npm run web
```

Mantenha o foco na usabilidade offline, organização pessoal e estética dark moderna.
