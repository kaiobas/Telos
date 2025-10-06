import { StyleSheet } from 'react-native';
import cores from './cores';

const cofreEstilos = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  
  conteudo: {
    flex: 1,
    padding: 20,
  },

  // Cabeçalho
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  
  cabecalhoEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  cabecalhoDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  
  tituloCabecalho: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
  },
  
  botaoLimpar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.fundoSecundario,
    borderWidth: 2,
    borderColor: '#ff4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // Seção do Saldo
  secaoSaldo: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    shadowColor: cores.sombra,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  tituloSaldo: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 12,
  },
  
  valorSaldo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: cores.primaria,
  },

  // Container de Ações
  containerAcoes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  
  containerAcoesSecundarias: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },

  // Botões de Ação Principais
  botaoDeposito: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#22c55e',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  botaoRetirada: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ef4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  textoBotaoDeposito: {
    color: cores.fundo,
    fontSize: 16,
    fontWeight: '600',
  },
  
  textoBotaoRetirada: {
    color: cores.fundo,
    fontSize: 16,
    fontWeight: '600',
  },

  // Botões Secundários
  botaoSecundario: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.primaria,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  
  textoBotaoSecundario: {
    color: cores.primaria,
    fontSize: 16,
    fontWeight: '600',
  },

  // Seção do Objetivo
  secaoObjetivo: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  
  tituloObjetivo: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 10,
  },
  
  valorObjetivo: {
    fontSize: 16,
    color: cores.textoSecundario,
    marginBottom: 12,
  },
  
  containerProgresso: {
    marginBottom: 8,
  },
  
  barraProgresso: {
    height: 8,
    backgroundColor: cores.fundoTerciario,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  
  progressoPreenchido: {
    height: '100%',
    backgroundColor: cores.primaria,
    borderRadius: 4,
  },
  
  textoProgresso: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'right',
  },
  
  objetivoAlcancado: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  
  valorRestante: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginTop: 5,
  },

  // Seção do Histórico
  secaoHistorico: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  
  tituloHistorico: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 10,
  },
  
  itemHistorico: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  
  cabecalhoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  tipoMovimentacao: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
  },
  
  dataMovimentacao: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
  
  valorMovimentacao: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  
  valorPositivo: {
    color: '#22c55e',
  },
  
  valorNegativo: {
    color: '#ef4444',
  },
  
  descricaoMovimentacao: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  
  saldoResultante: {
    fontSize: 12,
    color: cores.textoSecundario,
    textAlign: 'right',
  },

  // Seção Vazia
  secaoVazia: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  
  textoVazio: {
    fontSize: 16,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  
  dicaVazio: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
    opacity: 0.7,
  },

  // Modais
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  modalConteudo: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  
  cabecalhoModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  tituloModal: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.texto,
  },

  // Info Saldo Modal
  infoSaldoModal: {
    backgroundColor: cores.fundoTerciario,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
  },
  
  labelSaldo: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 4,
  },
  
  valorSaldoModal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.primaria,
  },

  // Inputs do Modal
  inputModal: {
    backgroundColor: cores.fundoTerciario,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: cores.texto,
    marginBottom: 16,
  },
  
  inputDescricao: {
    height: 80,
    textAlignVertical: 'top',
  },

  // Botões do Modal
  botoesModal: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  
  botoesObjetivo: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  
  botaoCancelar: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: cores.primaria,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  textoBotaoCancelar: {
    color: cores.primaria,
    fontSize: 16,
    fontWeight: '600',
  },
  
  botaoConfirmar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  botaoConfirmarDeposito: {
    backgroundColor: '#22c55e',
  },
  
  botaoConfirmarRetirada: {
    backgroundColor: '#ef4444',
  },
  
  textoBotaoConfirmar: {
    color: cores.fundo,
    fontSize: 16,
    fontWeight: '600',
  },
  
  botaoSalvar: {
    flex: 1,
    backgroundColor: cores.primaria,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  textoBotaoSalvar: {
    color: cores.fundo,
    fontSize: 16,
    fontWeight: '600',
  },
  
  botaoExcluir: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  textoBotaoExcluir: {
    color: cores.fundo,
    fontSize: 16,
    fontWeight: '600',
  },

  // Objetivo Atual no Modal
  objetivoAtual: {
    backgroundColor: cores.fundoTerciario,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  
  labelObjetivoAtual: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 4,
  },
  
  valorObjetivoAtual: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.primaria,
    marginBottom: 4,
  },
  
  descricaoObjetivoAtual: {
    fontSize: 14,
    color: cores.textoSecundario,
    fontStyle: 'italic',
  },
});

export default cofreEstilos;