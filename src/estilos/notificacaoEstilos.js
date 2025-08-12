import { StyleSheet } from 'react-native';
import cores from './cores';

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
});

export default estilos;