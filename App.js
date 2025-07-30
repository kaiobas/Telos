import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importar componentes principais
import NavegadorPrincipal from './src/navegacao/NavegadorPrincipal';
import BotaoIA from './src/componentes/BotaoIA';
import SplashTela from './src/telas/SplashTela';
import cores from './src/estilos/cores';

export default function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true);

  const finalizarSplash = () => {
    setMostrarSplash(false);
  };

  if (mostrarSplash) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: cores.fundo }}>
          <StatusBar style="light" backgroundColor={cores.fundo} />
          <SplashTela onFinish={finalizarSplash} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: cores.fundo }}>
        {/* Configurar status bar para tema escuro */}
        <StatusBar style="light" backgroundColor={cores.fundo} />
        
        {/* Navegação principal */}
        <NavegadorPrincipal />
        
        {/* Botão flutuante da IA */}
        <BotaoIA />
      </View>
    </SafeAreaProvider>
  );
}
