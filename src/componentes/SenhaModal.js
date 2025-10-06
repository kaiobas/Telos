import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';
import estilosGlobais from '../estilos/estilosGlobais';
import financasEstilos from '../estilos/financasEstilos';

const SenhaModal = ({ 
  visible, 
  onClose, 
  onSuccess, 
  isFirstTime = false, 
  title = "Digite a senha do cofre" 
}) => {
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [etapa, setEtapa] = useState('digitacao'); // 'digitacao' ou 'confirmacao'

  useEffect(() => {
    if (visible) {
      setSenha('');
      setConfirmacaoSenha('');
      setEtapa('digitacao');
    }
  }, [visible]);

  const adicionarDigito = (digito) => {
    if (etapa === 'digitacao') {
      if (senha.length < 4) {
        const novaSenha = senha + digito;
        setSenha(novaSenha);
        
        if (novaSenha.length === 4 && isFirstTime) {
          // Se é primeira vez, vai para confirmação
          setEtapa('confirmacao');
        }
      }
    } else {
      // Etapa de confirmação (apenas no primeiro cadastro)
      if (confirmacaoSenha.length < 4) {
        const novaConfirmacao = confirmacaoSenha + digito;
        setConfirmacaoSenha(novaConfirmacao);
      }
    }
  };

  const removerDigito = () => {
    if (etapa === 'digitacao') {
      setSenha(senha.slice(0, -1));
    } else {
      setConfirmacaoSenha(confirmacaoSenha.slice(0, -1));
    }
  };

  const confirmarSenha = () => {
    if (isFirstTime) {
      // Primeira vez - verificar se as senhas coincidem
      if (senha === confirmacaoSenha && senha.length === 4) {
        onSuccess(senha);
      } else {
        Vibration.vibrate(500);
        Alert.alert('Erro', 'As senhas não coincidem. Tente novamente.', [
          {
            text: 'OK',
            onPress: () => {
              setSenha('');
              setConfirmacaoSenha('');
              setEtapa('digitacao');
            }
          }
        ]);
      }
    } else {
      // Validação de senha existente
      if (senha.length === 4) {
        onSuccess(senha);
      }
    }
  };

  const voltarEtapa = () => {
    setEtapa('digitacao');
    setConfirmacaoSenha('');
  };

  // Determinar qual senha está sendo digitada
  const senhaAtual = etapa === 'digitacao' ? senha : confirmacaoSenha;
  const tituloAtual = isFirstTime 
    ? (etapa === 'digitacao' ? 'Crie uma senha de 4 dígitos' : 'Confirme a senha')
    : title;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={financasEstilos.modalSenhaContainer}>
        <View style={financasEstilos.modalSenhaConteudo}>
          {/* Cabeçalho */}
          <View style={financasEstilos.cabecalhoModalSenha}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="lock-closed" size={24} color={'#ffd700'} />
              <Text style={financasEstilos.tituloModalSenha}>{tituloAtual}</Text>
            </View>
            
            {!isFirstTime && (
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={cores.primaria} />
              </TouchableOpacity>
            )}
          </View>

          {/* Indicadores de dígitos */}
          <View style={financasEstilos.indicadoresSenha}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
                  financasEstilos.indicadorDigito,
                  senhaAtual.length > index && financasEstilos.indicadorDigitoPreenchido
                ]}
              />
            ))}
          </View>

          {/* Botão de voltar (apenas na confirmação) */}
          {isFirstTime && etapa === 'confirmacao' && (
            <TouchableOpacity 
              style={financasEstilos.botaoVoltarEtapa}
              onPress={voltarEtapa}
            >
              <Ionicons name="arrow-back" size={20} color={cores.primaria} />
              <Text style={financasEstilos.textoBotaoVoltarEtapa}>
                Alterar senha
              </Text>
            </TouchableOpacity>
          )}

          {/* Teclado numérico */}
          <View style={financasEstilos.tecladoSenha}>
            {/* Primeira linha */}
            <View style={financasEstilos.linhaTecladoSenha}>
              {[1, 2, 3].map((numero) => (
                <TouchableOpacity
                  key={numero}
                  style={financasEstilos.botaoTecladoSenha}
                  onPress={() => adicionarDigito(numero.toString())}
                >
                  <Text style={financasEstilos.textoTecladoSenha}>{numero}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Segunda linha */}
            <View style={financasEstilos.linhaTecladoSenha}>
              {[4, 5, 6].map((numero) => (
                <TouchableOpacity
                  key={numero}
                  style={financasEstilos.botaoTecladoSenha}
                  onPress={() => adicionarDigito(numero.toString())}
                >
                  <Text style={financasEstilos.textoTecladoSenha}>{numero}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Terceira linha */}
            <View style={financasEstilos.linhaTecladoSenha}>
              {[7, 8, 9].map((numero) => (
                <TouchableOpacity
                  key={numero}
                  style={financasEstilos.botaoTecladoSenha}
                  onPress={() => adicionarDigito(numero.toString())}
                >
                  <Text style={financasEstilos.textoTecladoSenha}>{numero}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quarta linha */}
            <View style={financasEstilos.linhaTecladoSenha}>
              <View style={financasEstilos.botaoTecladoSenha} />
              
              <TouchableOpacity
                style={financasEstilos.botaoTecladoSenha}
                onPress={() => adicionarDigito('0')}
              >
                <Text style={financasEstilos.textoTecladoSenha}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={financasEstilos.botaoTecladoSenha}
                onPress={removerDigito}
              >
                <Ionicons name="backspace-outline" size={24} color={cores.primaria} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão de confirmar */}
          <TouchableOpacity
            style={[
              financasEstilos.botaoConfirmarSenha,
              senhaAtual.length === 4 && financasEstilos.botaoConfirmarSenhaAtivo
            ]}
            onPress={confirmarSenha}
            disabled={senhaAtual.length < 4}
          >
            <Text style={[
              financasEstilos.textoBotaoConfirmarSenha,
              senhaAtual.length === 4 && financasEstilos.textoBotaoConfirmarSenhaAtivo
            ]}>
              {isFirstTime 
                ? (etapa === 'digitacao' ? 'Continuar' : 'Criar Senha')
                : 'Acessar Cofre'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SenhaModal;