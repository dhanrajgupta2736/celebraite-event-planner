import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Copy,
  Check,
  Minimize2,
  Maximize2,
  Crown,
  Zap,
  DollarSign,
  HeartHandshake,
} from 'lucide-react';
import { askPlannerCopilot } from '../services/geminiService';

/**
 * 24/7 Context-Aware Event Copilot Chat Component
 * Provides interactive advisory with 4 specialized planner personas
 * (Eleanor, Kai, Maya, Marcus) backed by Gemini 3.8 Flash & offline fallback.
 * @param {{ event: object, isOpen: boolean, onClose: () => void }} props
 * @returns {React.ReactElement | null}
 */
export default function CopilotChat({ event, isOpen, onClose }) {
  if (!isOpen) return null;

  const [messages, setMessages] = useState([
    {
      id: 'm-init',
      sender: 'ai',
      text: `Hello! I am your AI Celebration Copilot, tuned to "${event.title}". How can I assist you with budget allocations, vendor negotiations, or schedule precision today?`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [persona, setPersona] = useState('eleanor');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const PERSONAS = [
    { id: 'eleanor', name: 'Eleanor', title: 'Luxury Concierge', icon: Crown, color: '#D4AF37' },
    { id: 'kai', name: 'Kai', title: 'Modern & High-Energy', icon: Zap, color: '#8B5CF6' },
    { id: 'maya', name: 'Maya', title: 'Budget & DIY Wizard', icon: DollarSign, color: '#10B981' },
    { id: 'marcus', name: 'Marcus', title: 'Community Logistics', icon: HeartHandshake, color: '#06B6D4' },
  ];

  const QUICK_PROMPTS = [
    'How can I trim $1,500 off catering without sacrificing guest delight?',
    'What are 3 critical vendor contract traps to watch for?',
    'Suggest a high-energy interactive game for our guests.',
    'Write a 60-second welcome toast for the host.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await askPlannerCopilot({
        message: query,
        history: messages,
        eventState: {
          title: event.title,
          eventType: event.eventType,
          budget: event.budget,
          spent: (event.budgetItems || []).reduce((acc, i) => acc + (Number(i.actualSpent) || 0), 0),
          guestCount: event.guestCount,
          date: event.date,
          vibes: event.vibes,
          themeTitle: event.theme?.title,
        },
        persona,
      });

      const aiMsg = { id: `ai-${Date.now()}`, sender: 'ai', text: response };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `I ran into a temporary issue (${err.message}). For ${event.title}, remember to lock in catering and venue first as they represent 60%+ of the total outlay!`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <aside
      aria-label="CelebrAIte Intelligent Copilot Chat Drawer"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: isMinimized ? '340px' : '440px',
        height: isMinimized ? '60px' : '620px',
        maxHeight: 'calc(100vh - 48px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-highlight)',
        boxShadow: 'var(--shadow-lg), var(--shadow-purple)',
        overflow: 'hidden',
        transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s ease',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(22, 29, 49, 0.95), rgba(15, 20, 34, 0.95))',
          borderBottom: isMinimized ? 'none' : '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--gold-primary), var(--purple-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>AI Planning Copilot</h3>
            {!isMinimized && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Powered by Gemini 3.8 Flash
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="btn btn-secondary btn-icon"
            style={{ width: '28px', height: '28px' }}
            title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
          >
            {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="btn btn-secondary btn-icon"
            style={{ width: '28px', height: '28px' }}
            title="Close Copilot"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Persona Selection Strip */}
          <div
            style={{
              display: 'flex',
              gap: '0.35rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(10, 13, 20, 0.65)',
              borderBottom: '1px solid var(--border-subtle)',
              overflowX: 'auto',
            }}
          >
            {PERSONAS.map((p) => {
              const Icon = p.icon;
              const isActive = persona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    border: isActive ? `1px solid ${p.color}` : '1px solid var(--border-subtle)',
                    background: isActive ? `${p.color}22` : 'transparent',
                    color: isActive ? p.color : 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                  }}
                  title={p.title}
                >
                  <Icon size={12} />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Scroll Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={m.id || idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'flex-start',
                    maxWidth: '85%',
                    flexDirection: m.sender === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: m.sender === 'user' ? 'var(--purple-primary)' : 'var(--gold-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {m.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>

                  <div
                    style={{
                      background:
                        m.sender === 'user'
                          ? 'linear-gradient(135deg, var(--purple-dark), var(--purple-primary))'
                          : 'rgba(22, 29, 49, 0.95)',
                      color: '#fff',
                      padding: '0.75rem 1rem',
                      borderRadius:
                        m.sender === 'user'
                          ? '16px 16px 4px 16px'
                          : '16px 16px 16px 4px',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-sm)',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {m.text}

                    {m.sender === 'ai' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                        <button
                          onClick={() => handleCopyMessage(m.text, idx)}
                          className="btn btn-secondary btn-icon"
                          style={{ width: '22px', height: '22px', opacity: 0.7 }}
                          title="Copy response"
                        >
                          {copiedIndex === idx ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                <Sparkles size={14} className="pulse-glow" style={{ color: 'var(--gold-primary)' }} />
                <span>Generating tailored intelligence...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div
            style={{
              padding: '0.4rem 0.85rem',
              background: 'rgba(10, 13, 20, 0.5)',
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder={`Ask ${PERSONAS.find((p) => p.id === persona)?.name} for guidance...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              style={{ fontSize: '0.88rem', padding: '0.6rem 0.85rem' }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-icon"
              disabled={!inputValue.trim() || isTyping}
              style={{ width: '40px', height: '40px', flexShrink: 0 }}
            >
              <Send size={16} />
            </button>
          </form>
        </>
      )}
    </aside>
  );
}
