import { StyleSheet } from 'react-native';
import cores from './cores';

const estilos = StyleSheet.create({
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

  // Modo de seleção
  textoSelecao: {
    fontSize: 12,
    color: cores.textoTerciario,
    marginTop: 2,
  },

  botoesSelecao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  botaoSelecao: {
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

  entradaSelecionada: {
    borderWidth: 2,
    borderColor: cores.primaria,
    backgroundColor: cores.fundoTerciario,
  },

  checkbox: {
    marginRight: 12,
    padding: 4,
  },

  // Entradas
  cabecalhoEntrada: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  tituloEntrada: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    flex: 1,
    marginRight: 8,
  },

  acoesEntrada: {
    flexDirection: 'row',
  },

  botaoAcao: {
    padding: 4,
    marginLeft: 8,
  },

  dataEntrada: {
    fontSize: 12,
    color: cores.textoTerciario,
    marginBottom: 8,
  },

  conteudoEntrada: {
    fontSize: 14,
    color: cores.textoSecundario,
    lineHeight: 20,
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
    fontSize: 20,
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

  inputConteudo: {
    height: 200,
    textAlignVertical: 'top',
  },

  contadorCaracteres: {
    fontSize: 12,
    color: cores.textoTerciario,
    textAlign: 'right',
    marginBottom: 20,
  },

  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Modal de Leitura
  modalLeitura: {
    maxHeight: '85%',
    height: '85%',
  },

  conteudoLeitura: {
    flex: 1,
    marginBottom: 20,
  },

  tituloLeitura: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 8,
    lineHeight: 32,
  },

  dataLeitura: {
    fontSize: 14,
    color: cores.textoTerciario,
    marginBottom: 20,
    fontStyle: 'italic',
  },

  textoLeitura: {
    fontSize: 16,
    color: cores.textoSecundario,
    lineHeight: 24,
    textAlign: 'justify',
  },

  inputConteudoLeitura: {
    height: 250,
    textAlignVertical: 'top',
  },

  // Botão "Ler mais"
  botaoLerMais: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 8,
  },

  textoLerMais: {
    fontSize: 14,
    color: cores.primaria,
    fontWeight: '600',
    marginRight: 4,
  },
});

export default estilos;