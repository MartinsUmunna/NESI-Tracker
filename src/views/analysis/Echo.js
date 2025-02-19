import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Stack, 
  TextField, 
  Paper, 
  Avatar, 
  Typography, 
  IconButton, 
  Fade,
  useTheme,
  Container
} from '@mui/material';
import { IconSend, IconRobot, IconUser } from '@tabler/icons';
import ReactMarkdown from 'react-markdown'
import { AIQ_A } from './AIQ_A';

const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];

const getGreetingResponse = () => {
  const responses = [
    "Hello! How can I help you today with NESI metrics?",
    "Hi there! I'm ready to assist you with energy insights.",
    "Welcome! What would you like to know about power generation?",
    "Hello! I'm here to help with your energy-related questions."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

function findAnswer(question) {
  const questionLower = question.toLowerCase();
  
  if (greetings.some(greeting => questionLower.includes(greeting))) {
    return getGreetingResponse();
  }

  for (const entry of AIQ_A) {
    if (entry.keywords.some(keyword => questionLower.includes(keyword.toLowerCase()))) {
      return entry.answer;
    }
  }
  
  return "I'm not quite sure about that. Could you rephrase your question about NESI metrics or power generation?";
}

function Message({ text, isAi }) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ mb: 3 }}
      justifyContent={isAi ? 'flex-start' : 'flex-end'}
      alignItems="flex-start"
    >
      {isAi && (
        <Avatar 
          sx={{ 
            bgcolor: theme.palette.primary.main, 
            width: 45, 
            height: 45,
            boxShadow: 2,
            transition: 'all 0.3s ease'
          }}
        >
          <IconRobot size={28} />
        </Avatar>
      )}
      <Paper
        sx={{
          p: 2.5,
          maxWidth: '75%',
          bgcolor: isAi ? 'background.paper' : theme.palette.primary.main,
          color: isAi ? 'text.primary' : 'white',
          borderRadius: 3,
          boxShadow: theme.shadows[3],
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[6],
            transform: 'scale(1.01)'
          }
        }}
      >
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
         <ReactMarkdown>
          {text}</ReactMarkdown>
        </Typography>
      </Paper>
      {!isAi && (
        <Avatar 
          sx={{ 
            bgcolor: theme.palette.grey[700], 
            width: 45, 
            height: 45,
            boxShadow: 2,
            transition: 'all 0.3s ease'
          }}
        >
          <IconUser size={28} />
        </Avatar>
      )}
    </Stack>
  );
}

function ThinkingIndicator() {
  const theme = useTheme();
  return (
    <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar 
        sx={{ 
          bgcolor: theme.palette.primary.light,
          width: 35,
          height: 35,
        }}
      >
        <IconRobot size={20} />
      </Avatar>
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: '1rem'
        }}
      >
        EchoAI is thinking
        <span className="dot-animation">...</span>
      </Typography>
    </Box>
  );
}

export default function EchoAI() {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Show chat interface immediately
    setShowChat(true);
    
    // Add welcome message
    setMessages([
      {
        text: "Welcome to EchoAI! 👋\n\nI'm your intelligent assistant for analyzing NESI metrics and energy insights.\n\nFeel free to ask me about:\n- Power generation\n- Distribution patterns\n- Energy consumption trends\n- Any other energy-related metrics",
        isAi: true,
      },
    ]);
  }, []);

  useEffect(() => {
    if (hasInteracted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hasInteracted]);

  const typeMessage = async (text, delay = 15) => {
    let currentText = '';
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          text: currentText,
          isAi: true
        };
        return newMessages;
      });
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (!hasInteracted) {
      setHasInteracted(true);
    }

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
    <Container 
      maxWidth="lg" 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: hasInteracted ? 'flex-start' : 'center',
        justifyContent: 'center',
        py: 4,
        transition: 'all 0.3s ease'
      }}
    >
      <Box 
        sx={{ 
          width: '100%', 
          position: 'relative',
          transform: hasInteracted ? 'translateY(0)' : 'translateY(0)',
          transition: 'all 0.3s ease'
        }}
      >
        <Fade in={showChat} timeout={500}>
          <Paper 
            elevation={4}
            ref={chatContainerRef}
            sx={{ 
              height: '80vh',
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              mx: 'auto',
              maxWidth: '1200px'
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: theme.palette.primary.main,
                color: 'white',
                transition: 'all 0.3s ease',
                position: 'sticky',
                top: 0,
                zIndex: 1000
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'white',
                    width: 52,
                    height: 52,
                    color: theme.palette.primary.main
                  }}
                >
                  <IconRobot size={32} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    EchoAI
                  </Typography>
                  <Typography variant="subtitle1">
                    Your Intelligent NESI Metrics Assistant
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box 
              sx={{ 
                flexGrow: 1, 
                overflowY: 'auto', 
                p: 3,
                bgcolor: 'background.default',
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7))',
                backgroundSize: 'cover'
              }}
            >
              {messages.map((msg, idx) => (
                <Fade in key={idx} timeout={500}>
                  <Box>
                    <Message text={msg.text} isAi={msg.isAi} />
                  </Box>
                </Fade>
              ))}
              {isThinking && <ThinkingIndicator />}
              <div ref={messagesEndRef} />
            </Box>

            <Box 
              sx={{ 
                p: 3, 
                borderTop: 1, 
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  size="large"
                  multiline
                  maxRows={3}
                  placeholder="Ask about NESI metrics, power generation trends, or energy insights..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      padding: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: theme.shadows[2]
                      },
                      '&.Mui-focused': {
                        boxShadow: theme.shadows[4]
                      }
                    }
                  }}
                />
                <IconButton 
                  color="primary"
                  onClick={handleSend}
                  disabled={!input.trim() || isThinking}
                  sx={{ 
                    width: 56, 
                    height: 56,
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                      transform: 'scale(1.05)'
                    },
                    '&.Mui-disabled': {
                      bgcolor: theme.palette.grey[300],
                      color: theme.palette.grey[500]
                    }
                  }}
                >
                  <IconSend size={24} />
                </IconButton>
              </Stack>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Container>
  );
}