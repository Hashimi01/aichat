import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Copy, Check, AlertTriangle, Code, Calculator, BarChart2, Hash } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error loading saved messages:', e);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopyMessage = async (messageId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const Message = ({ message, index }) => (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`
        max-w-[85%] md:max-w-[75%] p-4 rounded-2xl
        ${message.role === 'user' 
          ? 'bg-blue-600/20 text-white' 
          : 'bg-gray-800/50 text-gray-100'
        }
        relative group
      `}>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleCopyMessage(index, message.content)}
            className="p-1 rounded hover:bg-gray-700/50 transition-colors"
            title="نسخ الرسالة"
          >
            {copiedMessageId === index ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
        <MessageContent content={message.content} />
      </div>
    </div>
  );

  const ContentBlock = ({ icon: Icon, title, children, className = "" }) => (
    <div className={`mt-2 mb-4 rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/70 border-b border-gray-700">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      {children}
    </div>
  );

  const MessageContent = ({ content }) => {
    const parseContent = (text) => {
      const parts = [];
      let lastIndex = 0;
      
      // Enhanced regex patterns for different content types
      const patterns = {
        code: /```(\w+)?\n([\s\S]*?)```/g,
        table: /\|(.+)\|\n\|[-|\s]+\|\n((?:\|.+\|\n?)+)/g,
        heading: /^#{1,6}\s+(.+)$/gm,
        math: /🔢\s*Math:\s*([\s\S]*?)(?=\n\n|$)/g,
        analysis: /📊\s*Analysis:\s*([\s\S]*?)(?=\n\n|$)/g,
        link: /<a\s+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>|https?:\/\/[^\s]+/g
      };

      // Process patterns in order
      for (const [type, regex] of Object.entries(patterns)) {
        text = text.replace(regex, (match, ...args) => {
          const placeholder = `__${type}_${parts.length}__`;
          
          switch(type) {
            case 'code':
              parts.push({
                type,
                language: args[0] || 'plaintext',
                content: args[1].trim()
              });
              break;
            case 'table':
              const headers = args[0].split('|').filter(Boolean).map(h => h.trim());
              const rows = args[1].split('\n')
                .filter(row => row.trim())
                .map(row => row.split('|').filter(Boolean).map(cell => cell.trim()));
              parts.push({ type, headers, rows });
              break;
            case 'heading':
              const level = match.indexOf(' ') - 1;
              parts.push({ type, level, content: args[0] });
              break;
            case 'math':
            case 'analysis':
              parts.push({ type, content: args[0].trim() });
              break;
            case 'link':
              const url = args[0] || match;
              const text = args[1] || match;
              parts.push({ type, url, text });
              break;
          }
          return placeholder;
        });
      }

      // Process remaining text
      const segments = text.split(/__(\w+)_(\d+)__/);
      const result = [];
      
      for (let i = 0; i < segments.length; i += 3) {
        if (segments[i]) {
          result.push({ type: 'text', content: segments[i] });
        }
        if (segments[i + 1]) {
          result.push(parts[parseInt(segments[i + 2])]);
        }
      }

      return result;
    };

    const parts = parseContent(content);
    
    return (
      <div className="space-y-2">
        {parts.map((part, index) => {
          switch (part.type) {
            case 'code':
              return (
                <ContentBlock 
                  key={index}
                  icon={Code}
                  title={part.language}
                  className="bg-gray-800/50"
                >
                  <div className="p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{part.content}</code>
                    </pre>
                  </div>
                </ContentBlock>
              );
            
            case 'table':
              return (
                <div key={index} className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-800/70 border-b border-gray-700">
                        {part.headers.map((header, i) => (
                          <th key={i} className="px-4 py-2 text-right">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {part.rows.map((row, i) => (
                        <tr key={i} className="border-b border-gray-700/50">
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-2 text-right">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            
            case 'heading':
              const HeadingTag = `h${part.level}`;
              return (
                <ContentBlock 
                  key={index}
                  icon={Hash}
                  title="عنوان"
                  className="bg-gray-800/30"
                >
                  <HeadingTag className="px-4 py-2 text-lg font-semibold">
                    {part.content}
                  </HeadingTag>
                </ContentBlock>
              );
            
            case 'math':
              return (
                <ContentBlock 
                  key={index}
                  icon={Calculator}
                  title="عمليات حسابية"
                  className="bg-gray-800/30"
                >
                  <div className="p-4">
                    <p className="whitespace-pre-wrap font-mono">{part.content}</p>
                  </div>
                </ContentBlock>
              );
            
            case 'analysis':
              return (
                <ContentBlock 
                  key={index}
                  icon={BarChart2}
                  title="تحليل"
                  className="bg-gray-800/30"
                >
                  <div className="p-4">
                    <p className="whitespace-pre-wrap">{part.content}</p>
                  </div>
                </ContentBlock>
              );
            
            case 'link':
              return (
                <a
                  key={index}
                  href={part.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 hover:underline transition-colors"
                >
                  {part.text}
                </a>
              );
            
            default:
              return (
                <p key={index} className="whitespace-pre-wrap leading-relaxed" dir="auto">
                  {part.content}
                </p>
              );
          }
        })}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage = {
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
      localStorage.setItem('chatMessages', JSON.stringify([...messages, data.message]));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 pt-20">
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-5xl mx-auto px-4 py-6">
          <div
            ref={chatContainerRef}
            className="h-full flex flex-col bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-gray-700/30"
          >
            {error && (
              <div className="p-4 bg-red-500/10 border-b border-red-500/20">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-6">
              {messages.map((message, index) => (
                <Message key={index} message={message} index={index} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-700/50 bg-gray-900/30 p-4">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                      text-white placeholder-gray-400 transition-all duration-200 
                      min-h-[52px] max-h-[200px] resize-none
                      scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
                    disabled={isLoading}
                    style={{
                      direction: 'rtl',
                      lineHeight: '1.5'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 
                    flex items-center justify-center min-w-[4rem]"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}