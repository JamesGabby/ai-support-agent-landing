"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useId, useRef, useEffect, useCallback, memo } from "react";
import { 
  Send, 
  Sparkles, 
  Code2, 
  Calendar, 
  HelpCircle, 
  Rocket,
  Bot,
  User,
  MessageSquare,
  Briefcase,
  DollarSign,
  Clock
} from "lucide-react";

// ============================================
// Memoized Input Component
// ============================================
const ChatInput = memo(function ChatInput({
  onSend,
  isLoading,
}: {
  onSend: (text: string) => void;
  isLoading: boolean;
}) {
  const [localInput, setLocalInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = localInput.trim();
    if (!trimmed || isLoading) return;
    
    onSend(trimmed);
    setLocalInput("");
    
    // Refocus after sending
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div 
        className={`relative flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-white rounded-xl sm:rounded-2xl border-2 transition-all duration-300 shadow-sm ${
          isFocused 
            ? 'border-purple-400 shadow-lg shadow-purple-500/10' 
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Input glow effect */}
        {isFocused && (
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-violet-500/5 animate-pulse pointer-events-none" />
        )}

        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          enterKeyHint="send"
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
          autoComplete="off"
          autoCorrect="on"
          autoCapitalize="sentences"
          spellCheck="true"
          className="relative flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-base border-none resize-none"
          style={{
            fontSize: '16px',
            WebkitAppearance: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || localInput.trim() === ""}
          className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
            localInput.trim() && !isLoading
              ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95'
              : 'bg-slate-100 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          {localInput.trim() && !isLoading && (
            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          )}
          
          <Send 
            size={16} 
            className={`sm:w-[18px] sm:h-[18px] relative transition-transform duration-300 ${
              localInput.trim() && !isLoading 
                ? 'text-white translate-x-0.5 -translate-y-0.5' 
                : 'text-slate-400'
            }`} 
          />
        </button>
      </div>
    </form>
  );
});

// ============================================
// Memoized Messages Component
// ============================================
const MessagesList = memo(function MessagesList({
  messages,
  isLoading,
  onQuickAction,
}: {
  messages: any[];
  isLoading: boolean;
  onQuickAction: (text: string) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  const getMessageText = (message: any): string => {
    if (message.content) return message.content;
    if (message.parts) {
      return message.parts
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text)
        .join("");
    }
    return "";
  };

  return (
    <>
      {messages.map((message, index) => {
        const text = getMessageText(message);
        if (!text) return null;
        const isUser = message.role === "user";

        return (
          <div
            key={message.id}
            className={`flex items-end gap-2 sm:gap-3 animate-slideIn ${
              isUser ? "flex-row-reverse" : "flex-row"
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 ${isUser ? 'order-1' : 'order-0'}`}>
              <div 
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md ${
                  isUser 
                    ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200'
                }`}
              >
                {isUser ? (
                  <User size={14} className="sm:w-4 sm:h-4 text-white" />
                ) : (
                  <Bot size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                )}
              </div>
            </div>

            {/* Message Bubble */}
            <div className={`group relative max-w-[85%] sm:max-w-[80%] ${isUser ? 'order-0' : 'order-1'}`}>
              <div
                className={`relative px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-sm transition-shadow hover:shadow-md ${
                  isUser
                    ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-md"
                    : "bg-white/90 backdrop-blur-sm text-slate-800 border border-slate-200/80 rounded-bl-md"
                }`}
              >
                {isUser && (
                  <div className="absolute inset-0 rounded-2xl rounded-br-md bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                )}
                
                <p className="relative text-xs sm:text-sm whitespace-pre-wrap leading-relaxed select-text">
                  {text}
                </p>
              </div>

              {/* Timestamp on hover (desktop) */}
              <span 
                className={`absolute -bottom-5 text-[9px] sm:text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block ${
                  isUser ? 'right-0' : 'left-0'
                }`}
              >
                Just now
              </span>
            </div>
          </div>
        );
      })}

      {/* Typing Indicator */}
      {isLoading && (
        <div className="flex items-end gap-2 sm:gap-3 animate-slideIn">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center shadow-md">
            <Bot size={14} className="sm:w-4 sm:h-4 text-purple-600" />
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl rounded-bl-md shadow-sm">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.15s' }} />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Suggestions */}
      {messages.length > 0 && messages.length <= 4 && !isLoading && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pl-9 sm:pl-11 animate-fadeIn">
          {messages.length === 2 && (
            <>
              <button
                onClick={() => onQuickAction("What's the typical timeline?")}
                type="button"
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs bg-white/80 hover:bg-white border border-slate-200/80 hover:border-purple-300 rounded-full text-slate-600 hover:text-purple-700 transition-all duration-200 active:scale-95"
              >
                <Clock size={10} className="sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1" />
                Timeline?
              </button>
              <button
                onClick={() => onQuickAction("Can I see your portfolio?")}
                type="button"
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs bg-white/80 hover:bg-white border border-slate-200/80 hover:border-purple-300 rounded-full text-slate-600 hover:text-purple-700 transition-all duration-200 active:scale-95"
              >
                <Briefcase size={10} className="sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1" />
                Portfolio
              </button>
              <button
                onClick={() => onQuickAction("How do I get started?")}
                type="button"
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs bg-white/80 hover:bg-white border border-slate-200/80 hover:border-purple-300 rounded-full text-slate-600 hover:text-purple-700 transition-all duration-200 active:scale-95"
              >
                <Rocket size={10} className="sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1" />
                Get started
              </button>
            </>
          )}
        </div>
      )}

      <div ref={messagesEndRef} />
    </>
  );
});

// ============================================
// Memoized Quick Actions (Welcome State)
// ============================================
const QuickActions = memo(function QuickActions({
  onAction,
}: {
  onAction: (text: string) => void;
}) {
  const quickActions = [
    { 
      label: "View services & pricing", 
      shortLabel: "Services & Pricing",
      icon: DollarSign,
      description: "Landing pages, websites & apps"
    },
    { 
      label: "See my process", 
      shortLabel: "My Process",
      icon: Rocket,
      description: "How projects work"
    },
    { 
      label: "Book a discovery call", 
      shortLabel: "Book a Call",
      icon: Calendar,
      description: "Free 30-min consultation"
    },
    { 
      label: "What can you help with?", 
      shortLabel: "Get Help",
      icon: HelpCircle,
      description: "Tech stack, timeline, etc."
    },
  ];

  const suggestedQuestions = [
    "What's included in the Starter package?",
    "How long does a landing page take?",
    "What technologies do you use?",
    "Can you work with my existing team?",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-6 animate-fadeIn">
      {/* Welcome Icon */}
      <div className="relative mb-4 sm:mb-6">
        <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
          <MessageSquare size={28} className="sm:w-8 sm:h-8 md:w-9 md:h-9 text-white" />
        </div>
        {/* Floating particles */}
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }} />
        <div className="absolute -bottom-0.5 -left-2 sm:-bottom-1 sm:-left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-pink-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-1/2 -right-3 sm:-right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.5s' }} />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5 sm:mb-2 text-center px-2">
        Hi! I'm James's AI assistant 👋
      </h2>
      <p className="text-sm sm:text-base text-slate-500 text-center max-w-xs sm:max-w-sm mb-5 sm:mb-8 leading-relaxed px-4">
        I can help you learn about services, pricing, and process—or help you get started on your project.
      </p>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-sm sm:max-w-md mb-4 sm:mb-6 px-2 sm:px-0">
        {quickActions.map((action, index) => (
          <button
            key={action.label}
            onClick={() => onAction(action.label)}
            type="button"
            className="group relative p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl sm:rounded-2xl hover:border-purple-300 hover:bg-white hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 text-left active:scale-[0.98]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Hover gradient */}
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="relative flex items-start gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center group-hover:from-violet-200 group-hover:to-fuchsia-200 transition-colors flex-shrink-0">
                <action.icon size={18} className="sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-slate-800 block leading-tight">
                  <span className="sm:hidden">{action.shortLabel}</span>
                  <span className="hidden sm:inline">{action.label}</span>
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 block mt-0.5 line-clamp-1">
                  {action.description}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Suggested Questions */}
      <div className="w-full max-w-sm sm:max-w-md px-2 sm:px-0">
        <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium mb-2 sm:mb-3 text-center">
          Or ask me something like...
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
          {suggestedQuestions.map((question, index) => (
            <button
              key={question}
              onClick={() => onAction(question)}
              type="button"
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs bg-white/60 hover:bg-white border border-slate-200/80 hover:border-purple-300 rounded-full text-slate-600 hover:text-purple-700 transition-all duration-200 hover:shadow-sm active:scale-95"
              style={{ animationDelay: `${0.4 + index * 0.05}s` }}
            >
              <span className="line-clamp-1">{question}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

// ============================================
// Main Component
// ============================================
export default function EmbeddedChatWidget() {
  const uniqueId = useId();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: uniqueId,
    generateId: () => `${uniqueId}-${Date.now()}`,
    transport: new DefaultChatTransport({
      api: "/api/chat/widget",
    }),
  });

  const isLoading = status === "streaming";

  const handleSendMessage = useCallback((text: string) => {
    sendMessage({
      role: "user",
      parts: [{ type: "text", text }],
    });
  }, [sendMessage]);

  return (
    <div 
      className="flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden"
      style={{ 
        height: '100dvh',
        minHeight: '-webkit-fill-available',
      }}
    >
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 sm:-top-32 sm:-right-32 sm:w-64 sm:h-64 md:-top-40 md:-right-40 md:w-80 md:h-80 bg-gradient-to-br from-violet-200/40 to-fuchsia-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 sm:-bottom-32 sm:-left-32 sm:w-64 sm:h-64 md:-bottom-40 md:-left-40 md:w-80 md:h-80 bg-gradient-to-tr from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-r from-purple-100/30 to-pink-100/30 rounded-full blur-3xl" />
      </div>

      {/* Premium Header */}
      <header className="relative z-10 flex-shrink-0">
        <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 shadow-xl">
          {/* Animated shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10 hidden sm:block">
            <div className="absolute top-2 left-10 w-2 h-2 bg-white rounded-full" />
            <div className="absolute top-6 left-20 w-1 h-1 bg-white rounded-full" />
            <div className="absolute bottom-3 right-16 w-1.5 h-1.5 bg-white rounded-full" />
            <div className="absolute top-4 right-8 w-1 h-1 bg-white rounded-full" />
          </div>

          <div className="relative flex items-center gap-3 sm:gap-4">
            {/* Logo/Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                <Code2 size={20} className="sm:w-[22px] sm:h-[22px] md:w-6 md:h-6 text-white" />
              </div>
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-400 rounded-full border-2 border-purple-600 shadow-lg">
                <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-base sm:text-lg tracking-tight flex items-center gap-1.5 sm:gap-2">
                <span className="truncate">James Gabbitus</span>
                <Sparkles size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-300 animate-pulse flex-shrink-0" />
              </h1>
              <div className="flex items-center"> 
                <span className={`inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm ${isLoading ? 'text-yellow-200' : 'text-white/80'}`}>
                  {isLoading ? (
                    <>
                      <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-yellow-300" />
                      </span>
                      <span className="truncate">Typing...</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full flex-shrink-0" />
                      <span className="truncate">
                        <span className="hidden sm:inline">Online • Usually replies instantly</span>
                        <span className="sm:hidden">Online</span>
                      </span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-violet-400/50 via-fuchsia-400/50 to-pink-400/50" />
        </div>
      </header>

      {/* Messages Area */}
      <main 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto relative z-10"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {messages.length === 0 ? (
            <QuickActions onAction={handleSendMessage} />
          ) : (
            <MessagesList 
              messages={messages} 
              isLoading={isLoading} 
              onQuickAction={handleSendMessage}
            />
          )}
        </div>
      </main>

      {/* Premium Input Area */}
      <footer className="relative z-20 p-3 sm:p-4 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 flex-shrink-0">
        {/* Top gradient line */}
        <div className="absolute top-0 left-3 right-3 sm:left-4 sm:right-4 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent pointer-events-none" />

        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />

        {/* Footer info */}
        <div className="flex items-center justify-between mt-2.5 sm:mt-3 px-0.5 sm:px-1">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Sparkles size={10} className="sm:w-3 sm:h-3 text-purple-400" />
            <span className="text-[10px] sm:text-[11px] text-slate-400">
              <span className="hidden sm:inline">AI assistant • </span>
              <span>Replies instantly</span>
            </span>
          </div>
          <a 
            href="https://calendly.com/jamesgabbitus" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] sm:text-[11px] text-purple-500 hover:text-purple-600 font-medium transition-colors flex items-center gap-0.5 sm:gap-1"
          >
            <Calendar size={10} className="sm:w-[11px] sm:h-[11px]" />
            <span>Book a call</span>
          </a>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shimmer { animation: shimmer 3s infinite; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }

        /* Critical mobile fixes */
        * {
          -webkit-tap-highlight-color: transparent;
        }

        input, textarea, select {
          font-size: 16px !important;
        }

        html, body {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
          overscroll-behavior: none;
        }

        @supports (-webkit-touch-callout: none) {
          body {
            height: -webkit-fill-available;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        @media (min-width: 640px) {
          ::-webkit-scrollbar {
            width: 6px;
          }
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a78bfa, #e879f9);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #8b5cf6, #d946ef);
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer,
          .animate-fadeIn,
          .animate-slideIn,
          .animate-bounce,
          .animate-ping,
          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}