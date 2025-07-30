import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Platform } from 'react-native';
import cores from '../estilos/cores';

const SplashTela = ({ onFinish }) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const nomeOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Sequência de animações
    const animationSequence = Animated.sequence([
      // 1. Logo aparece com fade + escala
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      
      // 2. Pausa de 300ms
      Animated.delay(300),
      
      // 3. Nome aparece
      Animated.timing(nomeOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      
      // 4. Pausa final de 1 segundo
      Animated.delay(1000),
    ]);

    // Executa a sequência
    animationSequence.start(() => {
      // Callback quando termina - navega para o app
      if (onFinish) {
        onFinish();
      }
    });
  }, [logoOpacity, nomeOpacity, logoScale, onFinish]);

  return (
    <View style={estilos.container}>
      <View style={estilos.conteudo}>
        {/* Logo com animação */}
        <Animated.View
          style={[
            estilos.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/icon.png')}
            style={estilos.logo}
          />
        </Animated.View>

        {/* Nome com animação */}
        <Animated.View
          style={[
            estilos.nomeContainer,
            { opacity: nomeOpacity },
          ]}
        >
          <Text style={estilos.nome}>TELOS</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    alignItems: 'center',
  },

  conteudo: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoContainer: {
    marginBottom: 40,
  },

  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },

  nomeContainer: {
    alignItems: 'center',
  },

  nome: {
    fontSize: 36,
    fontWeight: '100',
    color: cores.texto,
    letterSpacing: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    opacity: 0.95,
  },
});

export default SplashTela;
