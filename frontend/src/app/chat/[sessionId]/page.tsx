'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Paperclip,
  Smile,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authstore';
import { MessageType } from '@/types';

interface SessionMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: 'user' | 'therapist';
  content: string;
  type: MessageType;
  createdAt: Date;
}

const ChatSessionPage = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !user) return;

    const now = new Date();
    const newMessage: SessionMessage = {
      id: now.getTime().toString(),
      sessionId,
      senderId: user.id,
      senderType: 'user',
      content: inputValue,
      type: MessageType.TEXT,
      createdAt: now,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-[#0A0A0F] text-white overflow-hidden flex flex-col">
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="relative z-10 backdrop-blur-2xl bg-white/5 border-b border-white/10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-white/10"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-therapy-500 to-calm-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    Session chat
                  </div>
                  <div className="text-xs text-gray-400">
                    Session {sessionId.slice(0, 6)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-gray-500">
              <MessageSquare className="w-8 h-8 text-gray-600" />
              <p className="text-sm">
                No messages yet. Start the conversation below.
              </p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => {
              const isUser = message.senderId === user?.id;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[75%]">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-therapy-500 to-calm-500 text-white rounded-br-none'
                          : 'bg-white/10 border border-white/10 text-gray-100 rounded-bl-none'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="mt-1 text-[10px] text-gray-500">
                      {message.createdAt.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-[#050509]/90">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-end space-x-3">
            <button
              type="button"
              className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
            >
              <Smile className="w-4 h-4" />
            </button>
            <div className="flex-1 flex items-center space-x-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full resize-none bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-therapy-500"
              />
              <Button
                size="icon"
                className="rounded-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                onClick={handleSend}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSessionPage;

