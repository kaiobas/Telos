import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';

// Importar as telas
import CalendarioTela from '../telas/CalendarioTela';
import DiarioTela from '../telas/DiarioTela';
import FinancasTela from '../telas/FinancasTela';
import ConfiguracoesTela from '../telas/ConfiguracoesTela';
import CofreTela from '../telas/CofreTela';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navegador de Tabs Principal
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let nomeIcone;

          if (route.name === 'Calendario') {
            nomeIcone = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Diario') {
            nomeIcone = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Financas') {
            nomeIcone = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Configuracoes') {
            nomeIcone = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={nomeIcone} size={size} color={color} />;
        },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoTerciario,
        tabBarStyle: {
          backgroundColor: cores.fundoSecundario,
          borderTopWidth: 1,
          borderTopColor: cores.borda,
          height: 75,
          paddingBottom: 18,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Calendario" 
        component={CalendarioTela}
        options={{
          tabBarLabel: 'Calendário',
        }}
      />
      <Tab.Screen 
        name="Diario" 
        component={DiarioTela}
        options={{
          tabBarLabel: 'Diário',
        }}
      />
      <Tab.Screen 
        name="Financas" 
        component={FinancasTela}
        options={{
          tabBarLabel: 'Carteira',
        }}
      />
      <Tab.Screen 
        name="Configuracoes" 
        component={ConfiguracoesTela}
        options={{
          tabBarLabel: 'Configurações',
        }}
      />
    </Tab.Navigator>
  );
};

// Navegador Principal com Stack
const NavegadorPrincipal = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator}
        />
        <Stack.Screen 
          name="Cofre" 
          component={CofreTela}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavegadorPrincipal;
