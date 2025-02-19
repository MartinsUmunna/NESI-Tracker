import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Stack, Avatar, useTheme, Fade } from '@mui/material';
import { IconSend, IconRobot, IconUser } from '@tabler/icons';
import ReactMarkdown from 'react-markdown'
import { AIQ_A } from './AIQ_A';

// Helper function to return a canned QnA response if a keyword is found.
const getQnAResponse = (question) => {
  const questionLower = question.toLowerCase();
  for (const item of AIQ_A) {
    for (const keyword of item.keywords) {
      if (questionLower.includes(keyword.toLowerCase())) {
        return item.answer;
      }
    }
  }
  return null;
};

// Helper to type out text character-by-character.
// const typeText = (text, setFn, delay = 20) => {
//   return new Promise((resolve) => {
//     let index = 0;
//     const intervalId = setInterval(() => {
//       if (index < text.length) {
//         setFn((prev) => prev + text.charAt(index));
//         index++;
//       } else {
//         clearInterval(intervalId);
//         resolve(text);
//       }
//     }, delay);
//   });
// };





// Basic chat message bubble component.
const Message = ({ message, isAi }) => {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ mb: 2 }}
      alignItems="flex-start"
      justifyContent={isAi ? 'flex-start' : 'flex-end'}
    >
      {isAi && (
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 32,
            height: 32
          }}
        >
          <IconRobot size={20} />
        </Avatar>
      )}
      <Paper
        sx={{
          p: 2,
          maxWidth: '80%',
          bgcolor: isAi ? 'background.paper' : theme.palette.primary.main,
          color: isAi ? 'text.primary' : 'white',
          borderRadius: 2,
          boxShadow: theme.shadows[1]
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          
          <ReactMarkdown>{message}</ReactMarkdown>
        </Typography>
      </Paper>
      {!isAi && (
        <Avatar
          sx={{
            bgcolor: theme.palette.grey[500],
            width: 32,
            height: 32
          }}
        >
          <IconUser size={20} />
        </Avatar>
      )}
    </Stack>
  );
};

// AIInsights component wrapped with forwardRef.
const AIInsights = forwardRef(({ selectedMetrics = [], chartData = [], metrics = {} }, ref) => {
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm Echo. I can help you analyze your selected metrics. Ask me anything about trends, patterns, or relationships in your data.",
      isAi: true
    }
  ]);
  const [input, setInput] = useState('');
  const [loadingResponse, setLoadingResponse] = useState(false);
  const messagesEndRef = useRef(null);


  const typeText = async (text, delay = 15) => {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Core function to send and process a message.
  const sendMessage = async (content) => {
    if (!content.trim()) return;
    // Append the user's message.
    setMessages(prev => [...prev, { text: content, isAi: false }]);
    setInput('');
    // Append an empty placeholder for the AI response.
    setMessages(prev => [...prev, { text: '', isAi: true }]);
    setLoadingResponse(true);
    await new Promise((r) => setTimeout(r, 1000));

    let response = '';
    const cannedResponse = getQnAResponse(content);
    if (cannedResponse !== null) {
      response = cannedResponse;
    } else {
      // Fallback message if no canned response is found.
      response = "I'm sorry, I don't understand that. Could you please rephrase your question about NESI metrics or power generation?";
    }
    
    console.log("Generated response:", response);

    // If the response includes an external fetch tag, simulate fetching external data.
    if (response.includes('<external>')) {
      const splitted = response.split('<external>');
      const partialResponse = splitted[0];
      let typedFullText = '';
      await typeText(partialResponse, (chunk) => {
        typedFullText = chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { text: typedFullText, isAi: true };
          return updated;
        });
      }, 25);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: typedFullText + "\n(Echo is fetching external data…)", isAi: true };
        return updated;
      });
      const externalData = await new Promise((res) => setTimeout(() => res("I found some external energy data: for Q1 2025, the projected usage is 42,000 MWh. This might give you extra context in your analysis!"), 1000));
      response = typedFullText + "\n" + externalData;
    }

    // Type out the final response character-by-character.
    // let typedResponse = '';
    // await typeText(response, (chunk) => {
    //   typedResponse = chunk;
    //   console.log("The typed response is", typedResponse)
    //   setMessages(prev => {
    //     const updated = [...prev];
    //     updated[updated.length - 1] = { text: typedResponse, isAi: true };
    //     return updated;
    //   });


    // //   console.log("The message to display is", messages)
    // }, 25);


    typeText(response)
    setLoadingResponse(false);
  };

  // Expose the sendMessage method so parent components can trigger a message.
  useImperativeHandle(ref, () => ({
    sendMessage
  }));

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((message, idx) => (
          <Fade in key={idx}>
            <Box>
              <Message message={message.text} isAi={message.isAi} />
            </Box>
          </Fade>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      {/* "Thinking" indicator */}
      {loadingResponse && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="textSecondary">
            Echo is thinking...
          </Typography>
        </Box>
      )}
      {/* Input area */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="Ask about your metrics..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                sendMessage(input);
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loadingResponse}
          >
            <IconSend size={20} />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
});

export default AIInsights;
