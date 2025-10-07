import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import cores from '../estilos/cores';

const Header = ({ title }) => {
  return (
    <View style={estilos.container}>
      <View style={estilos.conteudo}>
        <Image
          source={require('../../assets/icon.png')}
          style={estilos.icone}
        />
        <View style={estilos.tituloContainer}>
          <Text style={estilos.titulo}>{title || 'TELOS'}</Text>
        </View>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    paddingTop: 35,
    paddingBottom: 8,
    paddingHorizontal: 20,
    backgroundColor: cores.fundo,
    alignItems: 'center',
  },

  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icone: {
    width: 36,
    height: 36,
    marginRight: 5,
    borderRadius: 8,
    opacity: 0.95,
  },

  tituloContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  titulo: {
    fontSize: 24,
    fontWeight: '100',
    color: cores.texto,
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    opacity: 0.92,
  },
});

export default Header;
