import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { IconChevronUp, IconChevronDown, IconSend } from '@tabler/icons';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown'
import { AIQ_A } from './AIQ_A';

// EchoChat component remains the same
const EchoChat = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    {
      text: "Hello, I'm EchoAI! Ask me about NESI metrics, power generation, inflation, GDP, or energy insights. How Can I help you ?",
      isAi: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const typeMessage = async (text, delay = 15) => {
    let currentText = '';
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { text: currentText, isAi: true };
        return newMessages;
      });
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  const getGreetingResponse = () => {
    const responses = [
      "Hello there! How can I help you with energy insights today?",
      "Hi! Ask me about power generation, inflation, or economic trends.",
      "Greetings! I'm here to assist you in developing and understanding your data and energy insights.",
      "Hello! Let me know your question about diesel prices, GDP, or forex."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const findAnswer = (question) => {
    const questionLower = question.toLowerCase();
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.some(greeting => questionLower.includes(greeting))) {
      return getGreetingResponse();
    }
    for (const entry of AIQ_A) {
      if (entry.keywords.some(keyword => questionLower.includes(keyword.toLowerCase()))) {
        return entry.answer;
      }
    }
    return "I'm not entirely sure about that. Could you please rephrase your question ?, Do you need help on writing a question relating to your data ?";
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { text: trimmed, isAi: false }]);
    setInput('');
    setIsThinking(true);
    setMessages(prev => [...prev, { text: '', isAi: true }]);
    const thinkingTime = Math.random() * 500 + 500;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));
    const response = findAnswer(trimmed);
    await typeMessage(response);
    setIsThinking(false);
  };

  return (
    <Box>
      <Box sx={{ height: 250, overflowY: 'auto', mb: 1 }}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ mb: 1, display: 'flex', justifyContent: msg.isAi ? 'flex-start' : 'flex-end' }}>
            <Box
              sx={{
                p: 1,
                bgcolor: msg.isAi ? 'grey.200' : 'primary.main',
                color: msg.isAi ? 'text.primary' : 'white',
                borderRadius: 1,
                maxWidth: '80%',
              }}
            >
              <Typography variant="body2">
                <ReactMarkdown>
                {msg.text}
                </ReactMarkdown>
                </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <IconButton 
          onClick={handleSend} 
          disabled={!input.trim() || isThinking} 
          sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <IconSend size={20} />
        </IconButton>
      </Box>
    </Box>
  );
};

const EchoWidget = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Keep Echo widget at the bottom with margin
  const WIDGET_MARGIN = 20;

  const toggleWidget = () => setExpanded(prev => !prev);

  return (
    <Box>
      {/* Collapsed state: header at the bottom */}
      {!expanded && (
        <Box
          onClick={toggleWidget}
          sx={{
            position: 'fixed',
            bottom: WIDGET_MARGIN,
            right: WIDGET_MARGIN,
            width: 200,
            bgcolor: theme.palette.primary.main,
            color: 'white',
            p: 1,
            borderRadius: 2,
            boxShadow: 3,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1200, // Lower z-index than settings
          }}
        >
          <Typography variant="subtitle1" sx={{ ml: 1 }}>Ask Echo</Typography>
          <IconChevronUp />
        </Box>
      )}
      {/* Expanded state: widget at the bottom */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: WIDGET_MARGIN,
              right: WIDGET_MARGIN,
              width: 350,
              height: 450,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: 8,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1200, // Lower z-index than settings
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                p: 1,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6">Ask Echo</Typography>
              <IconButton onClick={toggleWidget} sx={{ color: 'white' }}>
                <IconChevronDown />
              </IconButton>
            </Box>
            {/* Chat Content */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
              <EchoChat />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default EchoWidget;