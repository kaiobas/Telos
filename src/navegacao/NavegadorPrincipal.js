import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';

// Importar as telas
import CalendarioTela from '../telas/CalendarioTela';
import DiarioTela from '../telas/DiarioTela';
import FinancasTela from '../telas/FinancasTela';
import ConfiguracoesTela from '../telas/ConfiguracoesTela';

const Tab = createBottomTabNavigator();

const NavegadorPrincipal = () => {
return (
    <NavigationContainer>
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
                    height: 75, // aumentada para dar mais espaço
                    paddingBottom: 18, // aumentada para afastar da borda inferior
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerStyle: {
                    backgroundColor: cores.fundo,
                    borderBottomWidth: 1,
                    borderBottomColor: cores.borda,
                },
                headerTintColor: cores.texto,
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 18,
                },
                headerShown: false, // Ocultamos o header pois cada tela tem seu próprio cabeçalho
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
    </NavigationContainer>
);
};

export default NavegadorPrincipal;
