import { StyleSheet } from "react-native";
import cores from "./cores";

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
  cabecalhoSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  botoesAcao: {
    flexDirection: 'row',
    gap: 8,
  },

  botaoAdicionar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },

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

  acoesHorario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  botaoEditar: {
    padding: 6,
  },

  botaoExcluir: {
    padding: 6,
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

  proximaNotificacao: {
    fontSize: 11,
    color: cores.primaria,
    marginTop: 2,
    fontWeight: '500',
  },

  botaoResetar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },

  textoBotaoResetar: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginLeft: 6,
  },

  semHorarios: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  textoSemHorarios: {
    fontSize: 16,
    color: cores.textoSecundario,
    marginTop: 12,
    textAlign: 'center',
  },

  dicaSemHorarios: {
    fontSize: 14,
    color: cores.textoTerciario,
    marginTop: 8,
    textAlign: 'center',
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

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: cores.overlay,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  modalConteudo: {
    backgroundColor: cores.fundo,
    borderRadius: 12,
    maxHeight: '90%',
    flexDirection: 'column',
  },

  modalScrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },

  modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  cabecalhoModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  labelInput: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 8,
    marginTop: 12,
  },

  seletorHorario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  inputHora: {
    alignItems: 'center',
  },

  labelHora: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginBottom: 4,
  },

  inputNumero: {
    backgroundColor: cores.fundoSecundario,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: cores.texto,
    textAlign: 'center',
    width: 60,
  },

  separadorHora: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginHorizontal: 16,
  },

  inputMensagem: {
    height: 80,
    textAlignVertical: 'top',
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },

  labelSwitch: {
    fontSize: 16,
    color: cores.texto,
  },

  previa: {
    backgroundColor: cores.fundoSecundario,
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 10,
  },

  labelPrevia: {
    fontSize: 12,
    color: cores.textoTerciario,
    marginBottom: 8,
  },

  horaPrevia: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.primaria,
    marginBottom: 4,
  },

  tituloPrevia: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 4,
  },

  mensagemPrevia: {
    fontSize: 12,
    color: cores.textoSecundario,
    lineHeight: 16,
  },

  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    backgroundColor: cores.fundo,
  },
});