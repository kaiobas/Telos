import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cores from '../estilos/cores';
import estilosGlobais from '../estilos/estilosGlobais';

const { width, height } = Dimensions.get('window');

const API_KEY = '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';
const API_URL = 'https://api.openai.com/v1/chat/completions';

const ChatbotNutricional = ({ onAddRefeicoes, onClose }) => {
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      tipo: 'ia',
      texto: 'Olá! 🍽️ Sou sua nutricionista digital. Descreva o que você comeu e eu vou calcular as informações nutricionais para você!\n\nExemplo: "comi 1 prato de arroz, 150g de frango grelhado e 1 concha de feijão"',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const scrollViewRef = useRef();

  const promptNutricionista = `Papel: Você é um nutricionista computacional.
Tarefa: Ler a descrição do que a pessoa comeu e estimar kcal, proteína (g), carboidrato (g) e gordura (g) por item e no total.
Fontes: Use apenas conhecimento nutricional geral do seu modelo; não invente marcas.
Saída: Somente JSON válido no esquema abaixo, em gramas para macros e kcal para energia.
Idioma: Português do Brasil.

Regras:
- Unidades & conversões: aceite g, kg, ml, l, unidades, fatias, colheres, xícaras. Converta tudo para gramas (ml→g: água/leite ≈1:1; óleos ≈0,92 g/ml).
- Cozido vs cru: se não especificado, assuma cozido para arroz/macarrão/feijão/carnes comuns.
- Estimativa explícita: quando usar conhecimento geral/estimativa, indique em notes o racional.
- Arredondamento: por item: 1 casa decimal; totais: 0 kcal e 1 casa decimal (g).
- Incerteza: inclua confidence por item (0–1). Se não conseguir mapear, recognized=false, macros=0 e explique em notes.
- Sem conselhos: apenas calcule.
- JSON estrito: não escreva nada fora do JSON.

Esquema de saída:
{
  "totals": {"kcal": 0, "protein_g": 0.0, "carbs_g": 0.0, "fat_g": 0.0},
  "items": [
    {
      "name": "string",
      "quantity_g": 0,
      "recognized": true,
      "kcal": 0,
      "protein_g": 0.0,
      "carbs_g": 0.0,
      "fat_g": 0.0,
      "confidence": 0.0,
      "notes": "string opcional"
    }
  ],
  "assumptions": ["lista de suposições/conversões usadas"]
}`;

  const formatarHorario = (timestamp) => {
    const data = new Date(timestamp);
    return data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const enviarMensagem = async () => {
    if (!mensagem.trim()) return;

    const novaMensagem = {
      id: Date.now(),
      tipo: 'usuario',
      texto: mensagem.trim(),
      timestamp: new Date().toISOString(),
    };

    setMensagens(prev => [...prev, novaMensagem]);
    setMensagem('');
    setCarregando(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: promptNutricionista
            },
            {
              role: 'user',
              content: `Entrada do usuário: "${mensagem.trim()}"`
            }
          ],
          temperature: 0.3,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      const respostaIA = data.choices[0].message.content.trim();

      // Tentar fazer parse do JSON retornado
      try {
        const dadosNutricionais = JSON.parse(respostaIA);
        
        // Criar mensagem com resumo nutricional
        const resumo = `✅ **Análise Nutricional Completa**

📊 **Totais:**
• Calorias: ${dadosNutricionais.totals.kcal} kcal
• Proteínas: ${dadosNutricionais.totals.protein_g}g  
• Carboidratos: ${dadosNutricionais.totals.carbs_g}g
• Gordura: ${dadosNutricionais.totals.fat_g}g

📋 **Itens analisados:**
${dadosNutricionais.items.map(item => 
  `• ${item.name} (${item.quantity_g}g) - ${item.kcal} kcal`
).join('\n')}

${dadosNutricionais.assumptions.length > 0 ? `\n🔍 **Considerações:**\n${dadosNutricionais.assumptions.map(a => `• ${a}`).join('\n')}` : ''}

Quer adicionar esses dados ao seu registro de alimentação?`;

        const mensagemIA = {
          id: Date.now() + 1,
          tipo: 'ia',
          texto: resumo,
          timestamp: new Date().toISOString(),
          dadosNutricionais: dadosNutricionais
        };

        setMensagens(prev => [...prev, mensagemIA]);

      } catch (parseError) {
        // Se não conseguir fazer parse, mostrar a resposta da IA mesmo assim
        const mensagemIA = {
          id: Date.now() + 1,
          tipo: 'ia',
          texto: `Desculpe, houve um erro ao processar os dados nutricionais. Resposta da IA:\n\n${respostaIA}`,
          timestamp: new Date().toISOString(),
        };
        setMensagens(prev => [...prev, mensagemIA]);
      }

    } catch (error) {
      console.error('Erro ao consultar IA:', error);
      const mensagemErro = {
        id: Date.now() + 1,
        tipo: 'ia',
        texto: '❌ Desculpe, não consegui processar sua solicitação no momento. Verifique sua conexão e tente novamente.',
        timestamp: new Date().toISOString(),
      };
      setMensagens(prev => [...prev, mensagemErro]);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarRefeicoes = (dadosNutricionais) => {
    if (!dadosNutricionais?.items) {
      Alert.alert('Erro', 'Dados nutricionais inválidos');
      return;
    }

    const refeicoes = dadosNutricionais.items.map(item => ({
      id: Date.now() + Math.random(),
      nome: item.name,
      calorias: item.kcal || 0,
      proteinas: item.protein_g || 0,
      carboidratos: item.carbs_g || 0,
      gordura: item.fat_g || 0,
      data: new Date().toISOString(),
      confidence: item.confidence || 0,
      notes: item.notes || ''
    }));

    onAddRefeicoes(refeicoes);
    Alert.alert('Sucesso', `${refeicoes.length} refeição(ões) adicionada(s) com sucesso!`);
    onClose();
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [mensagens]);

  return (
    <View style={estilos.modalContainer}>
      <View style={estilos.chatContainer}>
        {/* Cabeçalho */}
        <View style={estilos.cabecalho}>
          <View style={estilos.infoIA}>
            <Ionicons name="nutrition-outline" size={24} color={cores.primaria} />
            <Text style={estilos.tituloChat}>Nutricionista IA</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={cores.texto} />
          </TouchableOpacity>
        </View>

        {/* Área de Conversa */}
        <ScrollView 
          ref={scrollViewRef}
          style={estilos.areaConversa}
          showsVerticalScrollIndicator={false}
        >
          {mensagens.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                estilos.mensagem,
                msg.tipo === 'usuario' ? estilos.mensagemUsuario : estilos.mensagemIA
              ]}
            >
              <Text style={[
                estilos.textoMensagem,
                msg.tipo === 'usuario' ? estilos.textoUsuario : estilos.textoIA
              ]}>
                {msg.texto}
              </Text>
              
              {msg.dadosNutricionais && (
                <TouchableOpacity 
                  style={estilos.botaoAdicionar}
                  onPress={() => adicionarRefeicoes(msg.dadosNutricionais)}
                >
                  <Text style={estilos.textoBotaoAdicionar}>
                    ✅ Adicionar ao Registro
                  </Text>
                </TouchableOpacity>
              )}
              
              <Text style={[
                estilos.horarioMensagem,
                msg.tipo === 'usuario' ? estilos.horarioUsuario : estilos.horarioIA
              ]}>
                {formatarHorario(msg.timestamp)}
              </Text>
              <View style={{ height: 6 }} />
            </View>
          ))}
          
          {/* Indicador de carregamento */}
          {carregando && (
            <View style={estilos.indicadorCarregamento}>
              <ActivityIndicator size="small" color={cores.primaria} />
              <Text style={estilos.textoCarregamento}>Analisando nutrição...</Text>
            </View>
          )}
          <View style={{ height: 32 }} />
        </ScrollView>

        {/* Área de Input */}
        <View style={estilos.areaInput}>
          <TextInput
            style={estilos.inputMensagem}
            placeholder="Descreva o que você comeu..."
            placeholderTextColor={cores.textoSecundario}
            value={mensagem}
            onChangeText={setMensagem}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              estilos.botaoEnviar,
              { backgroundColor: mensagem.trim() ? cores.primaria : cores.textoSecundario }
            ]}
            onPress={enviarMensagem}
            disabled={carregando || !mensagem.trim()}
          >
            <Ionicons 
              name={carregando ? "hourglass" : "send"} 
              size={20} 
              color={cores.fundo} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: cores.overlay,
    justifyContent: 'flex-end',
  },

  chatContainer: {
    backgroundColor: cores.fundo,
    height: height * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },

  // Cabeçalho
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },

  infoIA: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tituloChat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.primaria,
    marginLeft: 8,
  },

  // Conversa
  areaConversa: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  mensagem: {
    marginVertical: 4,
    maxWidth: '80%',
  },

  mensagemUsuario: {
    alignSelf: 'flex-end',
  },

  mensagemIA: {
    alignSelf: 'flex-start',
  },

  textoMensagem: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    lineHeight: 20,
  },

  textoUsuario: {
    backgroundColor: cores.primaria,
    color: cores.fundo,
  },

  textoIA: {
    backgroundColor: cores.fundoSecundario,
    color: cores.texto,
    borderWidth: 1,
    borderColor: cores.borda,
  },

  horarioMensagem: {
    fontSize: 11,
    marginTop: 2,
    marginHorizontal: 12,
  },

  horarioUsuario: {
    color: cores.textoTerciario,
    textAlign: 'right',
  },

  horarioIA: {
    color: cores.textoTerciario,
    textAlign: 'left',
  },

  // Botão adicionar refeições
  botaoAdicionar: {
    backgroundColor: '#22c55e',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
    marginHorizontal: 12,
  },

  textoBotaoAdicionar: {
    color: cores.fundo,
    fontWeight: '600',
    fontSize: 14,
  },

  // Input
  areaInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },

  inputMensagem: {
    flex: 1,
    backgroundColor: cores.fundoTerciario,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: cores.texto,
    maxHeight: 100,
    marginRight: 10,
  },

  botaoEnviar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Indicadores
  indicadorCarregamento: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },

  textoCarregamento: {
    marginLeft: 8,
    fontSize: 14,
    color: cores.textoSecundario,
    fontStyle: 'italic',
  },
});

export default ChatbotNutricional;