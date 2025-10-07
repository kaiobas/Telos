import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';

const CustomDrawerContent = ({ navigation, state }) => {
  const menuItems = [
    {
      name: 'Calendario',
      label: 'Calendário',
      icon: 'calendar-outline',
      iconFocused: 'calendar',
    },
    {
      name: 'Diario',
      label: 'Diário',
      icon: 'book-outline',
      iconFocused: 'book',
    },
    {
      name: 'Financas',
      label: 'Carteira',
      icon: 'wallet-outline',
      iconFocused: 'wallet',
    },
    {
      name: 'Alimentacao',
      label: 'Alimentação',
      icon: 'restaurant-outline',
      iconFocused: 'restaurant',
    },
    {
      name: 'Academia',
      label: 'Academia',
      icon: 'barbell-outline',
      iconFocused: 'barbell',
    },
    {
      name: 'Configuracoes',
      label: 'Configurações',
      icon: 'settings-outline',
      iconFocused: 'settings',
    },
  ];

  const currentRoute = state.routeNames[state.index];

  return (
    <View style={styles.container}>
      {/* Header da Sidebar */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Telos</Text>
        <Text style={styles.appSubtitle}>Organize sua vida</Text>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item) => {
          const isActive = currentRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigation.navigate(item.name)}
            >
              <Ionicons
                name={isActive ? item.iconFocused : item.icon}
                size={24}
                color={isActive ? cores.primaria : cores.textoSecundario}
              />
              <Text
                style={[
                  styles.menuItemText,
                  isActive && styles.menuItemTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.closeDrawer()}
        >
          <Ionicons name="close" size={24} color={cores.textoSecundario} />
          <Text style={styles.footerText}>Fechar Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  header: {
    backgroundColor: cores.primaria,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 50,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: cores.fundo,
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 14,
    color: cores.fundo,
    opacity: 0.8,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: cores.fundoSecundario,
    borderLeftWidth: 4,
    borderLeftColor: cores.primaria,
  },
  menuItemText: {
    fontSize: 16,
    color: cores.textoSecundario,
    marginLeft: 15,
    fontWeight: '500',
  },
  menuItemTextActive: {
    color: cores.texto,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginLeft: 15,
  },
});

export default CustomDrawerContent;