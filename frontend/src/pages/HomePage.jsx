import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  FileText, Sparkles, Shield, Clock, MessageSquare,
  BookOpen, Moon, Sun, ArrowRight, Check,
  ChevronDown, Bot, User, Zap, Database, Lock
} from 'lucide-react';
import useThemeStore from '../store/themeStore';
import useAuthStore from '../store/authStore';

const NAV_LINKS = ['Features', 'How it works', 'Testimonials'];

function Navbar({ onNav }) {
  const { theme, toggle } = useThemeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="https://res.cloudinary.com/datflmfl4/image/upload/v1779815819/ChatGPT_Image_May_24_2026_01_41_54_AM_l5u7dl.png" alt="DocuMind logo" className="w-26 h-10" />
        </div>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <button
              key={link}
              onClick={() => onNav(link.toLowerCase().replace(' ', '-'))}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {link}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              Get started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ navigate }) {
    const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
  return (
    <section className="pt-32 pb-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Gemini AI + MongoDB Atlas Vector Search
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
          Chat with your{' '}
          <span className="text-primary">PDF documents</span>{' '}
          using AI
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
          Upload any PDF and instantly get accurate answers with exact source citations.
          No hallucinations — every answer is grounded in your document.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/auth')}
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-base cursor-pointer"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </button>
          
           <a href="https://github.com/aamirk0008"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl border border-border text-foreground font-medium hover:bg-accent transition-colors text-base"
          >
            <GithubIcon />
            View on GitHub
          </a>
        </div>

        <div className="flex items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
          {['Free to use', 'No credit card required', 'Deploy in seconds'].map(item => (
            <div key={item} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoMockup() {
  const [activeMsg, setActiveMsg] = useState(0);

  const messages = [
    { role: 'assistant', content: 'Hi! Your document is ready. Here are some questions you can ask:', suggestions: ['What are the key points?', 'Summarize this document', 'What skills are mentioned?'] },
    { role: 'user', content: 'What technologies are mentioned in this document?' },
    { role: 'assistant', content: 'Based on **Source 1**, the document mentions React.js, Node.js, MongoDB, Express.js, and JWT authentication. The author also has experience with Razorpay payment integration.', sources: [{ label: 'Source 1', score: 0.92 }, { label: 'Source 2', score: 0.87 }] },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMsg(p => (p + 1) % 3);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
          {/* Browser bar */}
          <div className="bg-muted border-b border-border px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground border border-border">
              docu-mind-neon-gamma.vercel.app/chat
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
            {/* Sidebar */}
            <div className="border-r border-border p-4 hidden md:block">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Documents</p>
              {['resume.pdf', 'contract.pdf', 'report.pdf'].map((doc, i) => (
                <div key={doc} className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-sm ${i === 0 ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent'}`}>
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{doc}</span>
                  <div className={`h-1.5 w-1.5 rounded-full ml-auto shrink-0 ${i === 2 ? 'bg-yellow-400' : 'bg-green-400'}`} />
                </div>
              ))}
            </div>

            {/* Chat */}
            <div className="flex flex-col h-80">
              <div className="flex-1 overflow-hidden p-4 flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 transition-opacity duration-500 ${i <= activeMsg ? 'opacity-100' : 'opacity-0'} ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>
                    <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                      <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground border border-border'}`}>
                        {msg.content}
                      </div>
                      {msg.suggestions && (
                        <div className="flex flex-wrap gap-1">
                          {msg.suggestions.map(s => (
                            <span key={s} className="px-2 py-1 rounded-full border border-border text-xs text-muted-foreground bg-background">{s}</span>
                          ))}
                        </div>
                      )}
                      {msg.sources && (
                        <div className="flex gap-1">
                          {msg.sources.map(s => (
                            <span key={s.label} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">{s.label} · {s.score}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-3 flex gap-2">
                <input
                  readOnly
                  placeholder="Ask anything about your document..."
                  className="flex-1 h-9 rounded-lg border border-input bg-background px-3 text-xs text-muted-foreground"
                />
                <button className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <ArrowRight className="h-3.5 w-3.5 text-primary-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: MessageSquare, color: 'text-primary bg-primary/10', title: 'Natural language Q&A', desc: 'Ask questions the way you think. Get precise answers grounded in your document content, not generic AI responses.' },
    { icon: BookOpen, color: 'text-green-500 bg-green-500/10', title: 'Source citations', desc: 'Every answer shows the exact chunk it came from with relevance scores. Verify any answer in one click.' },
    { icon: Sparkles, color: 'text-yellow-500 bg-yellow-500/10', title: 'AI suggested questions', desc: 'Gemini generates 5 contextual starter questions the moment your document is ready. Never stare at a blank input.' },
    { icon: Clock, color: 'text-blue-500 bg-blue-500/10', title: 'Real-time processing', desc: 'Upload and watch status update live — pending → processing → ready. No manual refresh needed.' },
    { icon: Shield, color: 'text-purple-500 bg-purple-500/10', title: 'Secure by default', desc: 'JWT dual-token auth with refresh rotation, reuse detection, and Google OAuth. Your documents stay private.' },
    { icon: Database, color: 'text-pink-500 bg-pink-500/10', title: 'Vector search', desc: 'MongoDB Atlas Vector Search with 3072-dim Gemini embeddings. Finds semantically relevant content, not just keywords.' },
    { icon: Zap, color: 'text-orange-500 bg-orange-500/10', title: 'Async ingestion', desc: 'BullMQ + Redis queue handles large PDFs without blocking. 3x retry with exponential backoff for reliability.' },
    { icon: Lock, color: 'text-teal-500 bg-teal-500/10', title: 'Chat history', desc: 'All conversations persisted to MongoDB. Pick up exactly where you left off, across sessions and devices.' },
  ];

  return (
    <section id="features" className="py-20 px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Features
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Everything you need to understand your documents</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Built with production-grade architecture. Every feature designed for accuracy and reliability.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: '01', icon: FileText, title: 'Upload your PDF', desc: 'Drag and drop or click to upload any PDF up to 20MB. We support resumes, contracts, research papers, textbooks — any PDF.' },
    { num: '02', icon: Zap, title: 'AI processes it', desc: 'Our pipeline parses the PDF, splits it into chunks, generates Gemini vector embeddings, and indexes everything in MongoDB Atlas.' },
    { num: '03', icon: Sparkles, title: 'Get suggestions', desc: 'Gemini analyzes your document and generates 5 contextual starter questions so you know exactly what to ask.' },
    { num: '04', icon: MessageSquare, title: 'Ask anything', desc: 'Ask in plain English. Vector search finds the most relevant chunks, Gemini generates a grounded answer with source citations.' },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
            <Clock className="h-4 w-4" />
            How it works
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">From upload to answer in under 30 seconds</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">A simple four-step process powered by a production-grade RAG pipeline.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ num, icon: Icon, title, desc }, i) => (
            <div key={num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-5 left-full w-full h-px bg-border z-0" style={{ width: 'calc(100% - 2.5rem)', left: '2.5rem' }} />
              )}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-primary/20">{num}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { initials: 'RK', name: 'Rahul K.', role: 'Legal Consultant', color: 'bg-blue-500/10 text-blue-500', text: '"I uploaded an 80-page contract and asked about the termination clause. Got the exact answer in seconds with the source highlighted. This is genuinely impressive."' },
    { initials: 'PS', name: 'Priya S.', role: 'PhD Student', color: 'bg-purple-500/10 text-purple-500', text: '"As a researcher, this changed how I read papers. I can ask questions about methodology, results, and conclusions without reading every line. Game changer."' },
    { initials: 'MA', name: 'Mohamed A.', role: 'Product Manager', color: 'bg-green-500/10 text-green-500', text: '"The source citations are what make this different from ChatGPT. I can actually verify every answer. That trust is everything for professional use."' },
  ];

  return (
    <section id="testimonials" className="py-20 px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
            <MessageSquare className="h-4 w-4" />
            Testimonials
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">What users are saying</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ initials, name, role, color, text }) => (
            <div key={name} className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{text}</p>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${color}`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ navigate }) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          Free to use · No credit card required
        </div>
        <h2 className="text-4xl font-bold text-foreground mb-6">Ready to chat with your documents?</h2>
        <p className="text-muted-foreground text-lg mb-10">Upload your first PDF in under a minute. Get answers instantly.</p>
        <button
          onClick={() => navigate('/auth')}
          className="inline-flex items-center gap-2 h-14 px-10 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          Get started for free
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function Footer() {
    const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
  return (
    <footer className="border-t border-border bg-card px-6 py-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">DocuMind</span>
          <span className="text-muted-foreground text-sm ml-2">© 2026 Sheikh Aamir</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>Built with React · Node.js · MongoDB · Gemini API</span>
        </div>

        <div className="flex items-center gap-4">
          
           <a
            href="https://github.com/aamirk0008"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <GithubIcon />
            GitHub
          </a>
          
           <a href="https://linkedin.com/in/sheikh-aamir"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const sectionsRef = useRef({});

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNav={scrollTo} />
      <HeroSection navigate={navigate} />
      <DemoMockup />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection navigate={navigate} />
      <Footer />
    </div>
  );
}