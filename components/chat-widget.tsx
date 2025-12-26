"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useId, useRef, useEffect, useCallback } from "react";
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

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uniqueId = useId();

  const { messages, sendMessage, status } = useChat({
    id: uniqueId,
    generateId: () => `${uniqueId}-${Date.now()}`,
    transport: new DefaultChatTransport({
      api: "/api/chat/widget",
    }),
  });

  const isLoading = status === "streaming";

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
      isInitialLoad.current = false;
    } else if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      // Delay focus to prevent issues on mobile
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  // Handle input focus for mobile
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    setIsInputActive(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    // Delay deactivation to allow click events to complete
    setTimeout(() => {
      setIsInputActive(false);
    }, 200);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: trimmedInput }],
    });
    setInput("");
    
    // Refocus input after sending on mobile
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [input, isLoading, sendMessage]);

  const handleQuickAction = useCallback((text: string) => {
    // Prevent quick action if input is active
    if (isInputActive) return;
    
    sendMessage({
      role: "user",
      parts: [{ type: "text", text }],
    });
  }, [isInputActive, sendMessage]);

  // Prevent touch events on quick actions from interfering with input
  const handleQuickActionClick = useCallback((e: React.MouseEvent | React.TouchEvent, text: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInputActive || isFocused) return;
    
    handleQuickAction(text);
  }, [isInputActive, isFocused, handleQuickAction]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  // Handle touch on input container to ensure focus
  const handleInputContainerTouch = useCallback((e: React.TouchEvent) => {
    // Don't prevent default - let the touch go through to focus the input
    inputRef.current?.focus();
  }, []);

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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Ambient Background Elements - Responsive sizes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 sm:-top-32 sm:-right-32 sm:w-64 sm:h-64 md:-top-40 md:-right-40 md:w-80 md:h-80 bg-gradient-to-br from-violet-200/40 to-fuchsia-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 sm:-bottom-32 sm:-left-32 sm:w-64 sm:h-64 md:-bottom-40 md:-left-40 md:w-80 md:h-80 bg-gradient-to-tr from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-r from-purple-100/30 to-pink-100/30 rounded-full blur-3xl" />
      </div>

      {/* Premium Header - Responsive padding and sizing */}
      <header className="relative z-10 flex-shrink-0">
        <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 shadow-xl">
          {/* Animated shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          {/* Decorative pattern - Hidden on very small screens */}
          <div className="absolute inset-0 opacity-10 hidden sm:block" aria-hidden="true">
            <div className="absolute top-2 left-10 w-2 h-2 bg-white rounded-full" />
            <div className="absolute top-6 left-20 w-1 h-1 bg-white rounded-full" />
            <div className="absolute bottom-3 right-16 w-1.5 h-1.5 bg-white rounded-full" />
            <div className="absolute top-4 right-8 w-1 h-1 bg-white rounded-full" />
          </div>

          <div className="relative flex items-center gap-3 sm:gap-4">
            {/* Logo/Avatar - Responsive sizing */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                <Code2 size={20} className="sm:w-[22px] sm:h-[22px] md:w-6 md:h-6 text-white" />
              </div>
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-400 rounded-full border-2 border-purple-600 shadow-lg" aria-label="Online">
                <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-base sm:text-lg tracking-tight flex items-center gap-1.5 sm:gap-2">
                <span className="truncate">James Gabbitus</span>
                <Sparkles size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-300 animate-pulse flex-shrink-0" aria-hidden="true" />
              </h1>
              <div className="flex items-center"> 
                <span className={`inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm ${isLoading ? 'text-yellow-200' : 'text-white/80'}`}>
                  {isLoading ? (
                    <>
                      <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2" aria-hidden="true">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-yellow-300" />
                      </span>
                      <span className="truncate">Typing...</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full flex-shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        <span className="hidden xs:inline">Online • </span>
                        <span className="xs:hidden">Online</span>
                        <span className="hidden xs:inline">Usually replies instantly</span>
                      </span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-violet-400/50 via-fuchsia-400/50 to-pink-400/50" aria-hidden="true" />
        </div>
      </header>

      {/* Messages Area */}
      <main 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto relative z-10 overscroll-contain" 
        role="log" 
        aria-live="polite" 
        aria-label="Chat messages"
      >
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Welcome State */}
          {messages.length === 0 && !isInputActive && (
            <div className="flex flex-col items-center justify-center py-4 sm:py-6 animate-fadeIn">
              {/* Welcome Icon - Responsive sizing */}
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                  <MessageSquare size={28} className="sm:w-8 sm:h-8 md:w-9 md:h-9 text-white" />
                </div>
                {/* Floating particles - Smaller on mobile */}
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }} aria-hidden="true" />
                <div className="absolute -bottom-0.5 -left-2 sm:-bottom-1 sm:-left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-pink-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.3s' }} aria-hidden="true" />
                <div className="absolute top-1/2 -right-3 sm:-right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.5s' }} aria-hidden="true" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5 sm:mb-2 text-center px-2">
                Hi! I'm James's AI assistant 👋
              </h2>
              <p className="text-sm sm:text-base text-slate-500 text-center max-w-xs sm:max-w-sm mb-5 sm:mb-8 leading-relaxed px-4">
                I can help you learn about services, pricing, and process—or help you get started on your project.
              </p>

              {/* Quick Actions Grid - Responsive grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 w-full max-w-sm sm:max-w-md mb-4 sm:mb-6 px-2 sm:px-0">
                {quickActions.map((action, index) => (
                  <button
                    key={action.label}
                    onClick={(e) => handleQuickActionClick(e, action.label)}
                    onTouchEnd={(e) => handleQuickActionClick(e, action.label)}
                    type="button"
                    disabled={isInputActive || isFocused}
                    className="group relative p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl sm:rounded-2xl hover:border-purple-300 hover:bg-white hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 text-left active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none touch-manipulation"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    aria-label={`${action.label}: ${action.description}`}
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden="true" />
                    
                    <div className="relative flex items-start gap-2.5 sm:gap-3 pointer-events-none">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center group-hover:from-violet-200 group-hover:to-fuchsia-200 transition-colors flex-shrink-0">
                        <action.icon size={18} className="sm:w-5 sm:h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 block leading-tight">
                          <span className="xs:hidden">{action.shortLabel}</span>
                          <span className="hidden xs:inline">{action.label}</span>
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-500 block mt-0.5 line-clamp-1">
                          {action.description}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Suggested Questions - Responsive */}
              <div className="w-full max-w-sm sm:max-w-md px-2 sm:px-0">
                <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium mb-2 sm:mb-3 text-center">
                  Or ask me something like...
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={question}
                      onClick={(e) => handleQuickActionClick(e, question)}
                      onTouchEnd={(e) => handleQuickActionClick(e, question)}
                      type="button"
                      disabled={isInputActive || isFocused}
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs bg-white/60 hover:bg-white border border-slate-200/80 hover:border-purple-300 rounded-full text-slate-600 hover:text-purple-700 transition-all duration-200 hover:shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none touch-manipulation"
                      style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                    >
                      <span className="line-clamp-1 pointer-events-none">{question}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
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
                {/* Avatar - Responsive sizing */}
                <div className={`flex-shrink-0 ${isUser ? 'order-1' : 'order-0'}`}>
                  <div 
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md ${
                      isUser 
                        ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500' 
                        : 'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200'
                    }`}
                    aria-hidden="true"
                  >
                    {isUser ? (
                      <User size={14} className="sm:w-4 sm:h-4 text-white" />
                    ) : (
                      <Bot size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                    )}
                  </div>
                </div>

                {/* Message Bubble - Responsive sizing */}
                <div
                  className={`group relative max-w-[85%] sm:max-w-[80%] ${
                    isUser ? 'order-0' : 'order-1'
                  }`}
                >
                  <div
                    className={`relative px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-sm transition-shadow hover:shadow-md ${
                      isUser
                        ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-md"
                        : "bg-white/90 backdrop-blur-sm text-slate-800 border border-slate-200/80 rounded-bl-md"
                    }`}
                  >
                    {/* Inner glow for user messages */}
                    {isUser && (
                      <div className="absolute inset-0 rounded-2xl rounded-br-md bg-gradient-to-br from-white/10 to-transparent pointer-events-none" aria-hidden="true" />
                    )}
                    
                    <p className="relative text-xs sm:text-sm whitespace-pre-wrap leading-relaxed select-text">
                      {text}
                    </p>
                  </div>

                  {/* Timestamp - Hidden on mobile, show on hover for larger screens */}
                  <span 
                    className={`absolute -bottom-5 text-[9px] sm:text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block ${
                      isUser ? 'right-0' : 'left-0'
                    }`}
                    aria-hidden="true"
                  >
                    Just now
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-end gap-2 sm:gap-3 animate-slideIn" role="status" aria-label="Assistant is typing">
              {/* Avatar */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center shadow-md" aria-hidden="true">
                <Bot size={14} className="sm:w-4 sm:h-4 text-purple-600" />
              </div>

              {/* Typing Bubble */}
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          )}

          {/* Follow-up Suggestions - Responsive */}
          {messages.length > 0 && messages.length <= 4 && !isLoading && !isInputActive && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pl-9 sm:pl-11 animate-fadeIn">
              {messages.length === 2 && (
                <>
                  <button
                    onClick={(e) => handleQuickActionClick(e, "What's the typical timeline?")}
                    type="button"
                    disabled={isInputActive || isFocused}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs bg-white/80 hover:bg-white border border-slate-200/80 hover:border-purple-300 rounded-full text-slate-600 hover:text-purple-700 transition-all duration-200 active:scale-95 disabled:opacity-50 touch-manipulation"
                  >
                    <Clock size={10} className="sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1 pointer-events-none" />
                    <span className="pointer-events-none">Timeline?</span>
                  </button>
                  <button
                    onClick={(e) => handleQuickActionClick(e, "Can I see your portfolio?")}
                    type="button"
                    disabled={isInputActive || isFocused}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs bg-white/80 hover:bg-white border border-slate-200/80 hover:border-purple-300 rounded-full text-slate-600 hover:text-purple-700 transition-all duration-200 active:scale-95 disabled:opacity-50 touch-manipulation"
                  >
                    <Briefcase size={10} className="sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1 pointer-events-none" />
                    <span className="pointer-events-none">Portfolio</span>
                  </button>
                  <button
                    onClick={(e) => handleQuickActionClick(e, "How do I get started?")}
                    type="button"
                    disabled={isInputActive || isFocused}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs bg-white/80 hover:bg-white border border-slate-200/80 hover:border-purple-300 rounded-full text-slate-600 hover:text-purple-700 transition-all duration-200 active:scale-95 disabled:opacity-50 touch-manipulation"
                  >
                    <Rocket size={10} className="sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1 pointer-events-none" />
                    <span className="pointer-events-none">Get started</span>
                  </button>
                </>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Premium Input Area - Responsive */}
      <footer className="relative z-20 p-3 sm:p-4 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 flex-shrink-0">
        {/* Top gradient line */}
        <div className="absolute top-0 left-3 right-3 sm:left-4 sm:right-4 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent pointer-events-none" aria-hidden="true" />

        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="relative"
        >
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <div 
            className={`relative flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-white rounded-xl sm:rounded-2xl border-2 transition-all duration-300 shadow-sm ${
              isFocused 
                ? 'border-purple-400 shadow-lg shadow-purple-500/10' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onTouchStart={handleInputContainerTouch}
          >
            {/* Input glow effect */}
            {isFocused && (
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-violet-500/5 animate-pulse pointer-events-none" aria-hidden="true" />
            )}

            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              inputMode="text"
              enterKeyHint="send"
              value={input}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Type your message..."
              className="relative flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-base sm:text-sm appearance-none"
              disabled={isLoading}
              autoComplete="off"
              autoCorrect="on"
              autoCapitalize="sentences"
              spellCheck="true"
              aria-describedby="chat-hint"
              style={{
                fontSize: '16px', // Prevents iOS zoom
                WebkitAppearance: 'none',
              }}
            />

            {/* Send Button - Responsive sizing */}
            <button
              type="submit"
              disabled={isLoading || input.trim() === ""}
              className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 touch-manipulation ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95'
                  : 'bg-slate-100 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              {/* Button inner glow */}
              {input.trim() && !isLoading && (
                <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" aria-hidden="true" />
              )}
              
              <Send 
                size={16} 
                className={`sm:w-[18px] sm:h-[18px] relative transition-transform duration-300 pointer-events-none ${
                  input.trim() && !isLoading 
                    ? 'text-white translate-x-0.5 -translate-y-0.5' 
                    : 'text-slate-400'
                }`} 
              />
            </button>
          </div>
          <p id="chat-hint" className="sr-only">
            Press Enter to send your message
          </p>
        </form>

        {/* Powered by badge with CTA - Responsive */}
        <div className="flex items-center justify-between mt-2.5 sm:mt-3 px-0.5 sm:px-1">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Sparkles size={10} className="sm:w-3 sm:h-3 text-purple-400" />
            <span className="text-[10px] sm:text-[11px] text-slate-400">
              <span className="hidden xs:inline">AI assistant • </span>
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

      {/* Custom Styles */}
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
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }

        /* Prevent iOS zoom on input focus */
        input[type="text"] {
          font-size: 16px !important;
        }

        /* Better touch handling */
        .touch-manipulation {
          touch-action: manipulation;
        }

        /* Prevent overscroll */
        .overscroll-contain {
          overscroll-behavior: contain;
        }

        /* Custom scrollbar - Thinner on mobile */
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
        
        /* Custom xs breakpoint utilities */
        @media (min-width: 475px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        /* Ensure proper stacking on iOS */
        html, body {
          height: 100%;
          overflow: hidden;
        }

        /* Fix for iOS Safari keyboard */
        @supports (-webkit-touch-callout: none) {
          .h-screen {
            height: -webkit-fill-available;
          }
        }
      `}</style>
    </div>
  );
}