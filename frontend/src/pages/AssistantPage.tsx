import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SourceCitation } from '../types';
import {
  Sparkles, Send, ShieldCheck, AlertCircle, BookOpen,
  Info, ExternalLink, CornerDownLeft, RefreshCw, CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: SourceCitation[];
  grounded?: boolean;
  confidenceNote?: string;
  fallbackMode?: boolean;
}

export const AssistantPage: React.FC = () => {
  const { addToast } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hello! I am the **ImpactSphere AI Grounded Assistant**. I answer questions using strictly verified non-profit documentation, field protocols, and annual impact briefs.\n\nAsk me about volunteer guidelines, child safeguarding, environmental standards, or verified impact results.",
      grounded: true,
      confidenceNote: "Knowledge Base connected with 4 verified non-profit document collections."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "What percentage of native saplings does GreenCanopy require?",
    "What cold-chain safety rules does NourishAll enforce for food rescue?",
    "What background check and safeguarding rules exist for youth mentors?",
    "How does GreenCanopy measure carbon sequestration and heat reduction?",
    "Can you invent a story about a secret gold mine in Antarctica?"
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputValue('');
    setLoading(true);

    try {
      const res = await api.chatWithAssistant(textToSend);
      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        citations: res.citations,
        grounded: res.grounded,
        confidenceNote: res.confidence_note,
        fallbackMode: res.fallback_mode
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Assistant Error',
        message: 'Could not connect to knowledge assistant.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest text-warmIvory text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-limeAccent" />
            <span>Grounded RAG Engine Active</span>
          </div>
          <h1 className="text-3xl font-extrabold text-forest mt-1.5">AI Impact Assistant</h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Trained and constrained to verified NGO policy manuals, annual reports, and field guidelines.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-2xl border border-stone-200 text-xs text-stone-600 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-primaryGreen" />
          <span className="font-medium">Zero-Hallucination Guardrails</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Example Grounded Prompts:</span>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-3 py-1.5 bg-white hover:bg-warmIvory-200 border border-stone-200 text-stone-700 rounded-xl transition-all shadow-sm text-left hover:border-primaryGreen/50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 min-h-[480px] flex flex-col justify-between">
        {/* Messages */}
        <div className="space-y-6 overflow-y-auto max-h-[520px] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-forest text-warmIvory font-medium'
                    : 'bg-warmIvory-50 border border-warmIvory-200 text-stone-800'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Grounding Status Pill */}
                {msg.sender === 'assistant' && msg.confidenceNote && (
                  <div className="mt-3 pt-2.5 border-t border-warmIvory-300 flex items-center justify-between text-[10px] text-stone-500 font-medium">
                    <span className="flex items-center space-x-1">
                      {msg.grounded ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-primaryGreen" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>{msg.confidenceNote}</span>
                    </span>
                    {msg.fallbackMode && (
                      <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">Refusal Triggered</span>
                    )}
                  </div>
                )}
              </div>

              {/* Citations Box */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="max-w-2xl w-full bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-2 text-xs">
                  <div className="flex items-center space-x-1 text-primaryGreen font-bold text-[11px] uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Verified Source Citations ({msg.citations.length})</span>
                  </div>
                  <div className="space-y-2">
                    {msg.citations.map((c, i) => (
                      <div key={i} className="p-2.5 bg-warmIvory rounded-xl border border-warmIvory-300 text-[11px]">
                        <div className="flex items-center justify-between font-bold text-stone-900">
                          <span>{c.organization_name} — {c.document_title}</span>
                          <span className="text-[10px] bg-limeAccent/60 text-forest-900 px-1.5 py-0.2 rounded font-mono">
                            {c.relevance_score}% Relevance
                          </span>
                        </div>
                        <div className="text-stone-500 text-[10px] uppercase font-semibold">{c.document_type}</div>
                        <blockquote className="text-stone-600 mt-1 italic pl-2 border-l-2 border-primaryGreen">
                          "{c.excerpt}"
                        </blockquote>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-stone-500 bg-warmIvory p-3 rounded-2xl w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-primaryGreen" />
              <span>Scanning verified knowledge base chunks & synthesizing grounded response...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-stone-100 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask a question about non-profit policies, hours, or verified metrics..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            className="flex-1 text-xs px-4 py-3 rounded-2xl border border-stone-200 focus:border-primaryGreen focus:ring-1 focus:ring-primaryGreen outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputValue.trim()}
            className="px-5 py-3 bg-primaryGreen hover:bg-primaryGreen-light text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
