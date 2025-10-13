import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';
import estilos from '../estilos/configuracaoEstilos'
import estilosGlobais from '../estilos/estilosGlobais';
import Header from '../componentes/Header';
import {
  carregarConfiguracaoApp,
  atualizarConfiguracaoApp,
  exportarTodosDados,
  limparTodosDados,
} from '../armazenamento/armazenamentoSQLite';

const ConfiguracoesTela = () => {
  const [carregando, setCarregando] = useState(true);
  const [configuracaoApp, setConfiguracaoApp] = useState({
    modoEscuro: true,
    animacoes: true,
    sons: true,
    vibracoes: true,
    lembreteEventos: true,
    backupAutomatico: false,
    compactarDados: false,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Carregar configurações do app
      let configApp = await carregarConfiguracaoApp();
      if (!configApp) {
        configApp = {
          modoEscuro: true,
          animacoes: true,
          sons: true,
          vibracoes: true,
          lembreteEventos: true,
          backupAutomatico: false,
          compactarDados: false,
        };
        await atualizarConfiguracaoApp(configApp);
      }
      
      setConfiguracaoApp(configApp);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as configurações.');
    } finally {
      setCarregando(false);
    }
  };

  const alternarConfiguracaoApp = async (chave, valor) => {
    try {
      const novaConfigApp = { ...configuracaoApp, [chave]: valor };
      await atualizarConfiguracaoApp(novaConfigApp);
      setConfiguracaoApp(novaConfigApp);
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a configuração.');
    }
  };

  const exportarDados = async () => {
    try {
      const dados = await exportarTodosDados();
      const dadosString = JSON.stringify(dados, null, 2);
      
      await Share.share({
        message: 'Dados do Aplicativo Diário:\n\n' + dadosString,
        title: 'Backup dos Dados'
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      Alert.alert('Erro', 'Não foi possível exportar os dados.');
    }
  };

  const confirmarLimpezaDados = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Esta ação irá remover permanentemente todos os seus dados (diário, eventos, finanças). Esta ação não pode ser desfeita.\n\nDeseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar Tudo', 
          style: 'destructive', 
          onPress: executarLimpezaDados 
        }
      ]
    );
  };

  const executarLimpezaDados = async () => {
    try {
      await limparTodosDados();
      Alert.alert('Sucesso', 'Todos os dados foram removidos.');
      // Recarregar configurações padrão
      await carregarDados();
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      Alert.alert('Erro', 'Não foi possível limpar os dados.');
    }
  };

  if (carregando) {
    return (
      <View style={[estilosGlobais.container, estilosGlobais.containerCentralizado]}>
        <ActivityIndicator size="large" color={cores.branco} />
        <Text style={[estilosGlobais.texto, { marginTop: 10 }]}>
          Carregando configurações...
        </Text>
      </View>
    );
  }

  return (
    <View style={estilosGlobais.container}>
      <Header titulo="Configurações" />
      
      <ScrollView style={estilosGlobais.containerComHeader} showsVerticalScrollIndicator={false}>
        {/* Seção de Preferências do App */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            <Ionicons name="settings-outline" size={18} color={cores.branco} /> Preferências
          </Text>
          
          <View style={estilos.itemConfiguracao}>
            <View style={estilos.itemTexto}>
              <Text style={estilos.tituloItem}>Modo Escuro</Text>
              <Text style={estilos.subtituloItem}>Interface com fundo escuro</Text>
            </View>
            <Switch
              value={configuracaoApp.modoEscuro}
              onValueChange={(valor) => alternarConfiguracaoApp('modoEscuro', valor)}
              trackColor={{ false: cores.cinzaEscuro, true: cores.branco }}
              thumbColor={configuracaoApp.modoEscuro ? cores.preto : cores.cinza}
            />
          </View>

          <View style={estilos.itemConfiguracao}>
            <View style={estilos.itemTexto}>
              <Text style={estilos.tituloItem}>Animações</Text>
              <Text style={estilos.subtituloItem}>Transições suaves na interface</Text>
            </View>
            <Switch
              value={configuracaoApp.animacoes}
              onValueChange={(valor) => alternarConfiguracaoApp('animacoes', valor)}
              trackColor={{ false: cores.cinzaEscuro, true: cores.branco }}
              thumbColor={configuracaoApp.animacoes ? cores.preto : cores.cinza}
            />
          </View>

          <View style={estilos.itemConfiguracao}>
            <View style={estilos.itemTexto}>
              <Text style={estilos.tituloItem}>Sons</Text>
              <Text style={estilos.subtituloItem}>Feedback sonoro nas ações</Text>
            </View>
            <Switch
              value={configuracaoApp.sons}
              onValueChange={(valor) => alternarConfiguracaoApp('sons', valor)}
              trackColor={{ false: cores.cinzaEscuro, true: cores.branco }}
              thumbColor={configuracaoApp.sons ? cores.preto : cores.cinza}
            />
          </View>

          <View style={estilos.itemConfiguracao}>
            <View style={estilos.itemTexto}>
              <Text style={estilos.tituloItem}>Vibrações</Text>
              <Text style={estilos.subtituloItem}>Feedback tátil nas interações</Text>
            </View>
            <Switch
              value={configuracaoApp.vibracoes}
              onValueChange={(valor) => alternarConfiguracaoApp('vibracoes', valor)}
              trackColor={{ false: cores.cinzaEscuro, true: cores.branco }}
              thumbColor={configuracaoApp.vibracoes ? cores.preto : cores.cinza}
            />
          </View>
        </View>

        {/* Seção de Dados */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>
            <Ionicons name="archive-outline" size={18} color={cores.branco} /> Gerenciar Dados
          </Text>
          
          <TouchableOpacity style={estilos.botaoSecundario} onPress={exportarDados}>
            <Ionicons name="share-outline" size={20} color={cores.branco} />
            <Text style={estilos.textoBotaoSecundario}>Exportar Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.botaoPerigo} onPress={confirmarLimpezaDados}>
            <Ionicons name="trash-outline" size={20} color={cores.branco} />
            <Text style={estilos.textoBotaoPerigo}>Limpar Todos os Dados</Text>
          </TouchableOpacity>
        </View>

        {/* Seção de Informações */}
        <View style={[estilos.secao, { marginBottom: 100 }]}>
          <Text style={estilos.tituloSecao}>
            <Ionicons name="information-circle-outline" size={18} color={cores.branco} /> Sobre
          </Text>
          
          <View style={estilos.itemInfo}>
            <Text style={estilos.textoInfo}>
              Aplicativo Diário Pessoal
            </Text>
            <Text style={estilos.textoInfoSecundario}>
              Versão 1.0.0
            </Text>
          </View>

          <View style={estilos.itemInfo}>
            <Text style={estilos.textoInfo}>
              Armazenamento 100% local e privado
            </Text>
            <Text style={estilos.textoInfoSecundario}>
              Seus dados permanecem no seu dispositivo
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ConfiguracoesTela;