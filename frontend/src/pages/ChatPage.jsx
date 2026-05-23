import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, FileText, ChevronDown, ChevronUp, Loader2, Bot, User } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import { useChatHistory, useAskQuestion } from '../hooks/useChat';
import ReactMarkdown from 'react-markdown';

const SourceCard = ({ source, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden text-xs">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/50 hover:bg-muted transition-colors text-left"
      >
        <span className="font-medium text-muted-foreground">
          Source {index + 1} · chunk #{source.chunkIndex} · score {source.score}
        </span>
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <p className="px-3 py-2 text-muted-foreground leading-relaxed font-mono">
          {source.pageContent}
        </p>
      )}
    </div>
  );
};

const Message = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0
        ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`max-w-[75%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card border border-border text-foreground rounded-tl-sm prose prose-sm dark:prose-invert max-w-none'}`}>
          {isUser ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
        </div>
        {msg.sources?.length > 0 && (
          <div className="w-full flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground px-1">Sources used:</p>
            {msg.sources.map((s, i) => <SourceCard key={i} source={s} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChatPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useChatHistory(documentId);
  const ask = useAskQuestion(documentId);
  const [input, setInput] = useState('');
  const [optimistic, setOptimistic] = useState([]);
  const bottomRef = useRef(null);

  const messages = [...(data?.messages || []), ...optimistic];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || ask.isPending) return;
    const question = input.trim();
    setInput('');
    setOptimistic([{ role: 'user', content: question, _id: 'opt' }]);

    try {
      await ask.mutateAsync(question);
      setOptimistic([]);
    } catch {
      setOptimistic([]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />

      {/* Chat header */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {data?.documentName || 'Loading...'}
          </p>
          <p className="text-xs text-muted-foreground">Ask anything about this document</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium text-foreground">Start a conversation</p>
              <p className="text-sm text-muted-foreground mt-1">Ask anything about your document</p>
            </div>
          ) : (
            messages.map((msg, i) => <Message key={msg._id || i} msg={msg} />)
          )}
          {ask.isPending && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask a question about your document..."
            className="flex-1 h-11 rounded-xl border border-input bg-background px-4 text-sm
              placeholder:text-muted-foreground focus:outline-none focus:ring-2 ring-primary transition"
          />
          <Button onClick={handleSend} disabled={!input.trim() || ask.isPending} size="icon" className="h-11 w-11 rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}