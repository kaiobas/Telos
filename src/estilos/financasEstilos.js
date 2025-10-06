import { StyleSheet } from 'react-native';
import cores from './cores'; // Importando as cores definidas no arquivo de estilos

const financasEstilos = StyleSheet.create({
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

  botoesAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  botaoSecundario: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.fundoSecundario,
    borderWidth: 2,
    borderColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: cores.primaria,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  botaoLimparTudo: {
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

  botaoAdicionar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: cores.primaria,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },

  // Resumo
  itemResumo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  indicadorReceita: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: cores.primaria,
    marginRight: 12,
  },

  indicadorDespesa: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4444',
    marginRight: 12,
  },

  indicadorSaldo: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },

  labelResumo: {
    flex: 1,
    fontSize: 14,
    color: cores.textoSecundario,
  },

  labelSaldo: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
  },

  valorResumo: {
    fontSize: 14,
    fontWeight: '600',
  },

  valorReceita: {
    color: cores.primaria,
  },

  valorDespesa: {
    color: '#ff4444',
  },

  valorSaldo: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  separadorResumo: {
    height: 1,
    backgroundColor: cores.borda,
    marginVertical: 12,
  },

  // Transações
  itemTransacao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  iconeTransacao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.fundoTerciario,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoTransacao: {
    flex: 1,
  },

  descricaoTransacao: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 4,
  },

  categoriaTransacao: {
    fontSize: 12,
    color: cores.textoTerciario,
  },

  valorEAcoes: {
    alignItems: 'flex-end',
  },

  valorTransacao: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  valorPositivo: {
    color: cores.primaria,
  },

  valorNegativo: {
    color: '#ff4444',
  },

  botaoExcluir: {
    padding: 4,
  },

  // Estado vazio
  estadoVazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },

  textoVazio: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.textoSecundario,
    marginTop: 16,
    textAlign: 'center',
  },

  dicaVazio: {
    fontSize: 14,
    color: cores.textoTerciario,
    marginTop: 8,
    textAlign: 'center',
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
    maxHeight: '90%',
  },

  cabecalhoModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  botoesModalHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  botaoLimparHistorico: {
    width: 36,
    height: 36,
    borderRadius: 18,
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

  // Seletor de tipo
  seletorTipo: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  botaoTipo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 8,
    marginHorizontal: 4,
  },

  botaoTipoAtivo: {
    backgroundColor: cores.primaria,
  },

  textoTipo: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: cores.primaria,
  },

  textoTipoAtivo: {
    color: cores.fundo,
  },

  // Categorias
  labelCategoria: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 8,
  },

  categoriasContainer: {
    marginBottom: 20,
  },

  botaoCategoria: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 20,
    marginRight: 8,
  },

  botaoCategoriaAtiva: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },

  textoCategoria: {
    fontSize: 12,
    color: cores.textoSecundario,
  },

  textoCategoriaAtiva: {
    color: cores.fundo,
  },

  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  botaoLimpar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: cores.primaria,
    borderRadius: 20,
    backgroundColor: cores.fundoSecundario,
    shadowColor: cores.primaria,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  textoBotaoLimpar: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: cores.textoSecundario,
  },

  // Histórico Mensal
  historicoContainer: {
    maxHeight: 400,
  },

  itemHistorico: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },

  cabecalhoHistorico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  acaoHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  botaoExcluirHistorico: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: cores.fundoTerciario,
    borderWidth: 1,
    borderColor: '#ff4444',
  },

  mesHistorico: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
    textTransform: 'capitalize',
  },

  saldoHistorico: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  resumoHistorico: {
    gap: 8,
  },

  itemResumoHistorico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  labelHistorico: {
    fontSize: 14,
    color: cores.textoSecundario,
  },

  valorHistorico: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.textoSecundario,
  },

  valorHistoricoPositivo: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.primaria,
  },

  valorHistoricoNegativo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff4444',
  },

  historicoVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  textoHistoricoVazio: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.textoSecundario,
    marginTop: 16,
    textAlign: 'center',
  },

  dicaHistoricoVazio: {
    fontSize: 14,
    color: cores.textoTerciario,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Estilos do Seletor de Mês/Ano
  seletorContainer: {
    backgroundColor: cores.fundoSecundario,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },

  tituloSecao: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },

  botaoSeletor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.fundoTerciario,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
  },

  textoSeletor: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },

  containerSeletor: {
    maxHeight: 400,
  },

  labelSeletor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
    marginTop: 16,
  },

  linhaSeletor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  botaoSeta: {
    padding: 12,
    backgroundColor: cores.fundoTerciario,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
  },

  containerValor: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },

  valorSeletor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  gridMeses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },

  botaoMes: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: cores.fundoTerciario,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  botaoMesAtivo: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },

  textoMes: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },

  textoMesAtivo: {
    color: cores.textoBotao,
    fontWeight: '600',
  },

  botaoCancelar: {
    flex: 1,
    backgroundColor: cores.fundoSecundario,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: cores.borda,
  },

  textoCancelar: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  botaoConfirmar: {
    flex: 1,
    backgroundColor: cores.primaria,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },

  // ====================== ESTILOS DA CALCULADORA ======================

  calculadoraContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  botaoCalculadora: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundoSecundario,
    borderWidth: 2,
    borderColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },

  textoCalculadora: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '600',
  },

  modalCalculadora: {
    backgroundColor: cores.fundo,
    borderRadius: 16,
    padding: 20,
    maxHeight: '100%',
    width: '100%',
    alignSelf: 'center',
  },

  displayCalculadora: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'flex-end',
    minHeight: 80,
    justifyContent: 'center',
  },

  textoDisplay: {
    color: cores.texto,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'right',
  },

  valorFormatado: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'right',
  },

  tecladoCalculadora: {
    gap: 12,
  },

  linhaTeclado: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },

  botaoTeclado: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: cores.fundoSecundario,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.fundoTerciario,
  },

  botaoZero: {
    flex: 2,
    aspectRatio: 2,
  },

  botaoOperacao: {
    backgroundColor: cores.primaria,
  },

  botaoLimpar: {
    backgroundColor: '#ff4444',
  },

  botaoIgual: {
    backgroundColor: cores.primaria,
  },

  botaoUsar: {
    backgroundColor: '#22c55e',
  },

  textoNumero: {
    color: cores.texto,
    fontSize: 24,
    fontWeight: '600',
  },

  textoOperacao: {
    color: '#000000ff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  botoesCalculadora: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },

  // ====================== ESTILOS DO COFRE ======================

  cofreContainer: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ffd700',
    shadowColor: '#ffd700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  cofreCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  cofreTitulo: {
    color: '#ffd700',
    fontSize: 18,
    fontWeight: 'bold',
  },

  cofreSaldo: {
    color: '#ffd700',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },

  cofreBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },

  botaoCofre: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },

  botaoDeposito: {
    backgroundColor: '#22c55e',
  },

  botaoRetirada: {
    backgroundColor: '#ef4444',
  },

  textoBotaoCofre: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal do Cofre
  modalCofre: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 16,
    margin: 10,
    padding: 20,
    maxHeight: '85%',
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  cofreHistoricoContainer: {
    maxHeight: 300,
  },

  itemHistoricoCofre: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: cores.fundo,
    borderRadius: 8,
    borderLeftWidth: 4,
  },

  historicoDeposito: {
    borderLeftColor: '#22c55e',
  },

  historicoRetirada: {
    borderLeftColor: '#ef4444',
  },

  infoHistoricoCofre: {
    flex: 1,
  },

  tipoHistoricoCofre: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 2,
  },

  descricaoHistoricoCofre: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginBottom: 2,
  },

  dataHistoricoCofre: {
    fontSize: 11,
    color: cores.textoTerciario,
  },

  valorHistoricoCofre: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },

  valorHistoricoPositivo: {
    color: '#22c55e',
  },

  valorHistoricoNegativo: {
    color: '#ef4444',
  },

  saldoHistoricoCofre: {
    fontSize: 12,
    color: cores.textoTerciario,
    textAlign: 'right',
    marginTop: 2,
  },

  cofreVazio: {
    alignItems: 'center',
    padding: 40,
  },

  textoCofreVazio: {
    color: cores.textoSecundario,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },

  dicaCofreVazio: {
    color: cores.textoTerciario,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },

  // ====================== ESTILOS DO OBJETIVO ======================

  objetivoContainer: {
    backgroundColor: cores.fundo,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: cores.primaria,
  },

  objetivoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  objetivoTitulo: {
    color: cores.primaria,
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaoObjetivo: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: cores.primaria,
    borderRadius: 6,
  },

  textoBotaoObjetivo: {
    color: cores.fundo,
    fontSize: 12,
    fontWeight: '600',
  },

  objetivoInfo: {
    marginBottom: 12,
  },

  objetivoValor: {
    color: cores.primaria,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  objetivoDescricao: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginBottom: 8,
  },

  objetivoProgresso: {
    marginBottom: 8,
  },

  progressoTexto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  progressoLabel: {
    color: cores.texto,
    fontSize: 14,
    fontWeight: '600',
  },

  progressoPorcentagem: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: 'bold',
  },

  barraProgressoContainer: {
    height: 8,
    backgroundColor: cores.fundoSecundario,
    borderRadius: 4,
    overflow: 'hidden',
  },

  barraProgresso: {
    height: '100%',
    backgroundColor: cores.primaria,
    borderRadius: 4,
  },

  objetivoCompleto: {
    backgroundColor: cores.primaria,
  },

  valorRestante: {
    color: cores.textoTerciario,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },

  objetivoAlcancado: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },

  // Modal do Objetivo
  modalObjetivo: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 16,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  objetivoAtualContainer: {
    backgroundColor: cores.fundo,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: cores.primaria,
  },

  objetivoAtualLabel: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginBottom: 4,
  },

  objetivoAtualValor: {
    color: cores.primaria,
    fontSize: 20,
    fontWeight: 'bold',
  },

  botoesObjetivo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  botaoExcluirObjetivo: {
    backgroundColor: cores.textoTerciario,
    flex: 1,
  },

  // ====================== ESTILOS DO MODAL DE SENHA ======================

  modalSenhaContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalSenhaConteudo: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  cabecalhoModalSenha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },

  tituloModalSenha: {
    color: cores.texto,
    fontSize: 18,
    fontWeight: 'bold',
  },

  indicadoresSenha: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 20,
  },

  indicadorDigito: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: cores.textoTerciario,
    backgroundColor: 'transparent',
  },

  indicadorDigitoPreenchido: {
    backgroundColor: '#ffd700',
    borderColor: '#ffd700',
  },

  botaoVoltarEtapa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: cores.fundo,
  },

  textoBotaoVoltarEtapa: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: '600',
  },

  tecladoSenha: {
    alignItems: 'center',
    marginBottom: 30,
  },

  linhaTecladoSenha: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 20,
  },

  botaoTecladoSenha: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: cores.fundo,
    borderWidth: 1,
    borderColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: cores.primaria,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  textoTecladoSenha: {
    color: cores.primaria,
    fontSize: 24,
    fontWeight: 'bold',
  },

  botaoConfirmarSenha: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: cores.textoTerciario,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoConfirmarSenhaAtivo: {
    backgroundColor: '#ffd700',
  },

  textoBotaoConfirmarSenha: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.5,
  },

  textoBotaoConfirmarSenhaAtivo: {
    color: cores.fundo,
    opacity: 1,
  },

  // ====================== ESTILOS ESPECÍFICOS DA TELA DO COFRE ======================

  cofreTelaContainer: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  cofreConteudoPrincipal: {
    flex: 1,
    paddingHorizontal: 20,
  },

  cofreSaldoCard: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffd700',
    shadowColor: '#ffd700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  cofreSaldoLabel: {
    color: cores.textoSecundario,
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },

  cofreSaldoValor: {
    color: '#ffd700',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  cofreAcoesContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
  },

  cofreAcaoBotao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  cofreAcaoTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  cofreObjetivoSection: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: cores.primaria,
  },

  cofreObjetivoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  cofreObjetivoTitulo: {
    color: cores.primaria,
    fontSize: 18,
    fontWeight: 'bold',
  },

  cofreObjetivoBotao: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: cores.primaria,
    borderRadius: 8,
  },

  cofreObjetivoBotaoTexto: {
    color: cores.fundo,
    fontSize: 14,
    fontWeight: '600',
  },

  cofreObjetivoContent: {
    marginBottom: 12,
  },

  cofreObjetivoValor: {
    color: cores.primaria,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  cofreObjetivoDescricao: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },

  cofreProgressoContainer: {
    marginBottom: 8,
  },

  cofreProgressoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  cofreProgressoLabel: {
    color: cores.texto,
    fontSize: 14,
    fontWeight: '500',
  },

  cofreProgressoPorcentagem: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: 'bold',
  },

  cofreProgressoBarra: {
    height: 10,
    backgroundColor: cores.fundo,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },

  cofreProgressoPreenchimento: {
    height: '100%',
    backgroundColor: cores.primaria,
    borderRadius: 5,
  },

  cofreProgressoCompleto: {
    backgroundColor: '#22c55e',
  },

  cofreObjetivoStatus: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },

  cofreObjetivoAlcancado: {
    color: '#22c55e',
  },

  cofreObjetivoRestante: {
    color: cores.textoTerciario,
  },

  cofreObjetivoPlaceholder: {
    color: cores.textoTerciario,
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  cofreHistoricoSection: {
    flex: 1,
    backgroundColor: cores.fundoSecundario,
    borderRadius: 16,
    padding: 20,
  },

  cofreHistoricoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  cofreHistoricoTitulo: {
    color: cores.texto,
    fontSize: 18,
    fontWeight: 'bold',
  },

  cofreHistoricoLimpar: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: cores.fundo,
  },

  cofreHistoricoLista: {
    flex: 1,
  },

  cofreHistoricoItem: {
    flexDirection: 'row',
    backgroundColor: cores.fundo,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  cofreHistoricoItemDeposito: {
    borderLeftColor: '#22c55e',
  },

  cofreHistoricoItemRetirada: {
    borderLeftColor: '#ef4444',
  },

  cofreHistoricoItemInfo: {
    flex: 1,
    marginRight: 16,
  },

  cofreHistoricoItemTipo: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 4,
  },

  cofreHistoricoItemDescricao: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 4,
    lineHeight: 18,
  },

  cofreHistoricoItemData: {
    fontSize: 12,
    color: cores.textoTerciario,
  },

  cofreHistoricoItemValores: {
    alignItems: 'flex-end',
  },

  cofreHistoricoItemValor: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  cofreHistoricoItemValorDeposito: {
    color: '#22c55e',
  },

  cofreHistoricoItemValorRetirada: {
    color: '#ef4444',
  },

  cofreHistoricoItemSaldo: {
    fontSize: 12,
    color: cores.textoTerciario,
  },

  cofreHistoricoVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  cofreHistoricoVazioTexto: {
    color: cores.textoSecundario,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },

  cofreHistoricoVazioDica: {
    color: cores.textoTerciario,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default financasEstilos;