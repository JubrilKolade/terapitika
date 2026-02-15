'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Send,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const MAX_GUEST_MESSAGES = 10;

export default function GuestChatPage() {
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }>>([
    {
      id: '1',
      content: "Hi! I'm your AI companion. You're in guest mode, which gives you 10 free messages to try out our service. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesRemaining = MAX_GUEST_MESSAGES - messageCount;
  const isLimitReached = messageCount >= MAX_GUEST_MESSAGES;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messagesRemaining <= 3 && messagesRemaining > 0) {
      setShowLimitWarning(true);
    }
  }, [messagesRemaining]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLimitReached) return;

    const newMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setMessageCount((prev) => prev + 1);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: "I understand. As a guest, you have limited messages. For unlimited AI chat and access to licensed therapists, consider creating a free account!",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="h-screen bg-[#0A0A0F] text-white overflow-hidden flex flex-col">
      {/* Background Effects */}
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
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-therapy-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-calm-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Guest Mode Banner */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 backdrop-blur-2xl bg-gradient-to-r from-therapy-500/20 to-calm-500/20 border-b border-white/10"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-therapy-400" />
              <div>
                <p className="text-sm font-semibold">Guest Mode</p>
                <p className="text-xs text-gray-400">
                  {messagesRemaining} messages remaining
                </p>
              </div>
            </div>
            <Link href="/register">
              <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                Sign Up for Unlimited
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${(messagesRemaining / MAX_GUEST_MESSAGES) * 100}%` }}
              className="h-full bg-gradient-to-r from-therapy-500 to-calm-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Warning Alert */}
      <AnimatePresence>
        {showLimitWarning && messagesRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10"
          >
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/10 rounded-xl blur-xl" />
                <div className="relative p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-xl flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-400">
                        Only {messagesRemaining} messages left!
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Create a free account to continue chatting without limits
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLimitWarning(false)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 backdrop-blur-2xl bg-white/5 border-b border-white/10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
                  <span>Guest Mode</span>
                </div>
              </div>
            </div>
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
                    message.sender === 'user' ? 'order-2' : 'order-1'
                  }`}
                >
                  <div
                    className={`relative group ${
                      message.sender === 'user' ? 'ml-auto' : 'mr-auto'
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

          {/* Limit Reached Message */}
          {isLimitReached && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/10 to-calm-500/10 rounded-3xl blur-2xl" />
              <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  You've reached your message limit
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Create a free account to continue chatting with our AI and access licensed therapists
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                      Create Free Account
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                </div>

                {/* Benefits */}
                <div className="grid sm:grid-cols-3 gap-4 mt-8 text-left">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-therapy-500/20">
                        <benefit.icon className="w-4 h-4 text-therapy-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{benefit.title}</p>
                        <p className="text-xs text-gray-400">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
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
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-therapy-500/20 to-calm-500/20 rounded-2xl blur-xl" />
            <div className="relative flex items-end space-x-3 p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLimitReached}
                placeholder={isLimitReached ? 'Sign up to continue chatting...' : 'Type your message...'}
                rows={1}
                className="flex-1 bg-transparent border-none outline-none resize-none text-white placeholder-gray-500 max-h-32 scrollbar-thin disabled:opacity-50"
                style={{ minHeight: '40px' }}
              />

              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLimitReached}
                className="flex-shrink-0 bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-therapy-500/50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center mt-2">
            Guest mode • Limited to {MAX_GUEST_MESSAGES} messages • No account required
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const benefits = [
  {
    icon: Sparkles,
    title: 'Unlimited AI Chat',
    description: 'Chat as much as you need',
  },
  {
    icon: Shield,
    title: 'Licensed Therapists',
    description: 'Access to professionals',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Always available',
  },
];