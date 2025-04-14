import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Keyboard,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Send, Bot, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/utils/theme';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import * as Clipboard from 'expo-clipboard';

// Message types
type MessageType = 'user' | 'assistant';

interface Message {
  id: string;
  text: string;
  type: MessageType;
  timestamp: Date;
}

// Mock responses for the assistant
const mockResponses = [
  "Based on your interests, I'd recommend checking out the Ferry Building Farmers Market on Saturday morning. It's a great place to sample local foods and enjoy the waterfront views.",
  "For a romantic evening, try Foreign Cinema in the Mission. They project classic films on the wall while you dine in their beautiful courtyard.",
  "If you're looking for something active, consider renting bikes and riding across the Golden Gate Bridge to Sausalito. The views are spectacular!",
  "The California Academy of Sciences in Golden Gate Park has a planetarium, aquarium, and rainforest all under one roof. It's perfect for a rainy day date.",
  "For a unique experience, check out Urban Putt in the Mission - it's an indoor miniature golf course with a bar and restaurant.",
  "The Exploratorium at Pier 15 is a hands-on science museum that's fun for all ages. They also have adults-only evening events on Thursdays.",
  "If you both enjoy art, the de Young Museum in Golden Gate Park has an excellent collection and a tower with panoramic views of the city.",
  "For a casual date, grab some takeout and have a picnic at Dolores Park. You'll get great views of the city skyline.",
  "The Japanese Tea Garden in Golden Gate Park is a peaceful spot for a stroll. It's especially beautiful during cherry blossom season.",
  "For coffee lovers, try a coffee tasting tour in the city. San Francisco has some world-class roasters like Blue Bottle, Ritual, and Sightglass."
];

export default function ChatScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuthStore();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your SparkLocal assistant. Ask me for date ideas, recommendations, or any questions about planning a great date!",
      type: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    Keyboard.dismiss();
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get a random response from the mock responses
      const randomIndex = Math.floor(Math.random() * mockResponses.length);
      const responseText = mockResponses[randomIndex];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        type: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process your request. Please try again later.",
        type: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyMessageToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Message copied to clipboard');
  };
  
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.type === 'user';
    
    return (
      <TouchableOpacity
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
          { backgroundColor: isUser ? colors.primary : colors.card }
        ]}
        onLongPress={() => copyMessageToClipboard(item.text)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.messageText,
          { color: isUser ? 'white' : colors.text }
        ]}>
          {item.text}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const goBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Bot size={24} color={colors.primary} style={styles.headerIcon} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Date Idea Assistant</Text>
        </View>
        <View style={styles.placeholder} />
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
      />
      
      {isLoading && (
        <View style={[styles.loadingContainer, { backgroundColor: colors.card }]}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={[styles.loadingText, { color: colors.text }]}>Thinking...</Text>
        </View>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={[styles.inputContainer, { backgroundColor: colors.card }]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Ask for date ideas..."
          placeholderTextColor={colors.subtext}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 16,
    marginLeft: 16,
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
