'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Paperclip,
  Smile,
  MoreVertical,
  ArrowLeft,
  Zap,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }>>([
    {
      id: '1',
      content: "Hello! I'm your AI companion. I'm here to listen and support you. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: "I understand how you're feeling. Let's explore that together. Can you tell me more about what's been on your mind?",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-[#0A0A0F] text-white overflow-hidden flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-therapy-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-calm-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 backdrop-blur-2xl bg-white/5 border-b border-white/10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button size="sm" variant="ghost" className="hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full blur-md"
                  />
                  <div className="relative w-10 h-10 bg-gradient-to-br from-therapy-500 to-calm-600 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold">AI Companion</div>
                  <div className="text-xs text-gray-400 flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="hover:bg-white/10">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Messages Container */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.sender === 'user'
                      ? 'order-2'
                      : 'order-1'
                  }`}
                >
                  <div
                    className={`relative group ${
                      message.sender === 'user'
                        ? 'ml-auto'
                        : 'mr-auto'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-therapy-500/20 to-calm-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    <div
                      className={`relative p-4 rounded-2xl backdrop-blur-xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-therapy-500 to-calm-500 text-white'
                          : 'bg-white/10 border border-white/10 text-white'
                      }`}
                    >
                      {message.sender === 'ai' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Sparkles className="w-4 h-4 text-therapy-400" />
                          <span className="text-xs font-semibold text-therapy-400">AI</span>
                        </div>
                      )}
                      <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <div className="text-xs opacity-50 mt-2">
                        {message.timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-therapy-500/20 to-calm-500/20 rounded-2xl blur-xl" />
                <div className="relative px-6 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-therapy-400 animate-pulse" />
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                          className="w-2 h-2 bg-therapy-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="relative z-10 backdrop-blur-2xl bg-white/5 border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Suggested Prompts */}
          <div className="flex items-center space-x-2 mb-3 overflow-x-auto scrollbar-hide">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInputValue(prompt)}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-therapy-500/50 hover:bg-white/10 transition-all text-sm whitespace-nowrap"
              >
                <Zap className="w-3 h-3 inline mr-1 text-therapy-400" />
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-therapy-500/20 to-calm-500/20 rounded-2xl blur-xl" />
            <div className="relative flex items-end space-x-3 p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl">
              {/* Attachment Button */}
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>

              {/* Text Input */}
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 bg-transparent border-none outline-none resize-none text-white placeholder-gray-500 max-h-32 scrollbar-thin"
                style={{ minHeight: '40px' }}
              />

              {/* Voice Button */}
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                  isRecording
                    ? 'bg-red-500/20 text-red-400'
                    : 'hover:bg-white/10 text-gray-400'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              {/* Emoji Button */}
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                <Smile className="w-5 h-5 text-gray-400" />
              </button>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="flex-shrink-0 bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-therapy-500/50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Info Text */}
          <div className="text-xs text-gray-500 text-center mt-2">
            AI can make mistakes. Consider checking important information.
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const suggestedPrompts = [
  "I'm feeling anxious",
  'Help me relax',
  'Breathing exercises',
  'Talk about stress',
];
