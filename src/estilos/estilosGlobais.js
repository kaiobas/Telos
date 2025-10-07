import { StyleSheet } from 'react-native';
import cores from './cores';

export const estilosGlobais = StyleSheet.create({
  // Contêineres principais
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  
  containerCentralizado: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  containerPadding: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: 20,
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
  
  // Textos
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 20,
  },
  
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 10,
  },
  
  textoNormal: {
    fontSize: 16,
    color: cores.texto,
    lineHeight: 24,
  },
  
  textoPequeno: {
    fontSize: 11,
    color: cores.textoSecundario,
  },
  
  // Cartões e superfícies
  cartao: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  
  cartaoElevado: {
    backgroundColor: cores.fundoSecundario,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  
  // Botões
  botao: {
    backgroundColor: cores.primaria,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  botaoSecundario: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  textoBotao: {
    color: cores.fundo,
    fontSize: 16,
    fontWeight: '600',
  },
  
  textoBotaoSecundario: {
    color: cores.primaria,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Inputs
  input: {
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
  
  inputFocado: {
    borderColor: cores.primaria,
  },
  
  // Lista
  itemLista: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  
  // Separadores
  separador: {
    height: 1,
    backgroundColor: cores.borda,
    marginVertical: 16,
  },
  
  // Centro
  centralizador: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Margens e espaçamentos
  margemVertical: {
    marginVertical: 8,
  },
  
  margemHorizontal: {
    marginHorizontal: 8,
  },
  
  // Flexbox helpers
  linha: {
    flexDirection: 'row',
  },
  
  coluna: {
    flexDirection: 'column',
  },
  
  espacoEntre: {
    justifyContent: 'space-between',
  },
  
  flex1: {
    flex: 1,
  },
});

export default estilosGlobais;
