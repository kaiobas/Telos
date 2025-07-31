import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importar componentes principais
import NavegadorPrincipal from './src/navegacao/NavegadorPrincipal';
import BotaoIA from './src/componentes/BotaoIA';
import SplashTela from './src/telas/SplashTela';
import cores from './src/estilos/cores';
import { DatabaseProvider } from './src/contextos/DatabaseContext';

export default function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true);

  useEffect(() => {
    // Timer para splash screen
    const timer = setTimeout(() => {
      setMostrarSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const finalizarSplash = () => {
    setMostrarSplash(false);
  };

  if (mostrarSplash) {
    return (
      <SafeAreaProvider>
        <DatabaseProvider>
          <View style={{ flex: 1, backgroundColor: cores.fundo }}>
            <StatusBar style="light" backgroundColor={cores.fundo} />
            <SplashTela onFinish={finalizarSplash} />
          </View>
        </DatabaseProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <View style={{ flex: 1, backgroundColor: cores.fundo }}>
          {/* Configurar status bar para tema escuro */}
          <StatusBar style="light" backgroundColor={cores.fundo} />
          
          {/* Navegação principal */}
          <NavegadorPrincipal />
          
          {/* Botão flutuante da IA */}
          <BotaoIA />
        </View>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}
