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
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    backgroundColor: cores.fundoSecundario,
  },

  textoBotaoLimpar: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: cores.textoTerciario,
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
});

export default financasEstilos;