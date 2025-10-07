import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';

// Importar as telas
import CalendarioTela from '../telas/CalendarioTela';
import DiarioTela from '../telas/DiarioTela';
import FinancasTela from '../telas/FinancasTela';
import AlimentacaoTela from '../telas/AlimentacaoTela';
import AcademiaTela from '../telas/AcademiaTela';
import ConfiguracoesTela from '../telas/ConfiguracoesTela';
import CofreTela from '../telas/CofreTela';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navegador de Tabs Expandido
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
          } else if (route.name === 'Alimentacao') {
            nomeIcone = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Academia') {
            nomeIcone = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Configuracoes') {
            nomeIcone = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={nomeIcone} size={size} color={color} />;
        },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
          backgroundColor: cores.fundoSecundario,
          borderTopWidth: 1,
          borderTopColor: cores.borda,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 9,
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
        name="Alimentacao" 
        component={AlimentacaoTela}
        options={{
          tabBarLabel: 'Alimentação',
        }}
      />
      <Tab.Screen 
        name="Academia" 
        component={AcademiaTela}
        options={{
          tabBarLabel: 'Academia',
        }}
      />
      <Tab.Screen 
        name="Configuracoes" 
        component={ConfiguracoesTela}
        options={{
          tabBarLabel: 'Config',
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
