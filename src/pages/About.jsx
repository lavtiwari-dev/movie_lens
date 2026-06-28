import { useState } from 'react';
import Footer from '../components/Footer';

export default function About() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    }
  };

  const features = [
    { title: 'Live OMDb Integration', desc: 'Queries the complete open movie database live for instant matching.' },
    { title: 'Unified Movie Ratings', desc: 'Aggregates scores from IMDb, Rotten Tomatoes, and Metacritic for fast comparison.' },
    { title: 'Local Catalog Storage', desc: 'Bookmark favorites to a permanent local storage watchlist with custom sorting.' },
    { title: 'Clean Obsidian Interface', desc: 'A stunning minimalist visual design optimized for modern mobile and desktop screens.' },
  ];

  const technologies = [
    { name: 'React 19', category: 'Core UI Component Library' },
    { name: 'Tailwind CSS', category: 'Responsive Styling Utility System' },
    { name: 'React Router v7', category: 'Declarative Clientside Routing Engine' },
    { name: 'Vite 8', category: 'Next-Generation Bundling & Development' },
    { name: 'Axios', category: 'Asynchronous OMDb API Fetch Client' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 flex-1 w-full text-white animate-fade-in">
        
        {/* Hero Section */}
        <section className="border border-brand-border rounded-2xl p-6 md:p-10 mb-10 flex flex-col lg:flex-row gap-8 items-center justify-between relative overflow-hidden bg-brand-card/25 shadow-md">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col gap-4 flex-1 z-10">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              About <span className="text-brand-yellow">MovieLens</span>
            </h1>
            <p className="text-brand-gray text-[13px] md:text-sm leading-relaxed max-w-2xl font-normal">
              MovieLens is an elegant, ad-free movie search engine and watchlist curator. Built for film lovers, it gathers scores across multiple database directories, aggregates runtimes, and helps you keep track of what to watch next.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <a
                href="https://github.com/lavtiwari-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow-purple px-5 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase cursor-pointer"
              >
                GitHub Code
              </a>
              <a
                href="https://linkedin.com/in/lavtiwaridev"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow-yellow px-5 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase cursor-pointer"
              >
                LinkedIn Profile
              </a>
              <a
                href="https://www.lavtiwari.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 hover:border-brand-yellow hover:text-brand-yellow bg-white/5 px-5 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer"
              >
                www.lavtiwari.dev
              </a>
            </div>
          </div>

          {/* Graphic illustration placeholder */}
          <div className="w-full lg:w-80 shrink-0 aspect-[16/10] bg-brand-card/40 border border-brand-border rounded-xl flex items-center justify-center relative overflow-hidden select-none">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
              <span className="text-5xl filter drop-shadow-[0_0_8px_rgba(229,184,66,0.25)]">🎬</span>
              <span className="text-xs font-bold text-white tracking-widest uppercase mt-4">Cinematic Explorer</span>
              <span className="text-[10px] text-brand-gray/80 mt-1 font-medium">OMDb REST Data Stream</span>
            </div>
            {/* Animated neon circles inside graphic */}
            <div className="absolute w-44 h-44 rounded-full border border-brand-yellow/5 animate-spin duration-[15s]" />
            <div className="absolute w-32 h-32 rounded-full border border-dashed border-brand-yellow/10 animate-spin duration-[8s] reverse" />
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Mission & Features */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gray border-b border-brand-border pb-3">Our Mission</h2>
              <p className="text-brand-gray text-[13px] leading-relaxed pt-1.5 font-normal">
                To build a lightweight, beautiful movie catalog application that provides film enthusiasts with quick aggregate scores, director summaries, and cast grids, without heavy advertisement blockades or tracking script bloat.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gray border-b border-brand-border pb-3">Core Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                {features.map((f, i) => (
                  <div key={i} className="bg-brand-card/30 border border-brand-border rounded-xl p-4 flex flex-col gap-1 hover:border-brand-yellow/30 transition-all">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{f.title}</h4>
                    <p className="text-brand-gray text-[11px] leading-relaxed mt-0.5 font-normal">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tech Stack & Contact Form */}
          <div className="flex flex-col gap-8">
            {/* Technologies */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gray border-b border-brand-border pb-3">Technology Stack</h2>
              <ul className="flex flex-col gap-2.5 mt-2">
                {technologies.map((t, i) => (
                  <li key={i} className="flex justify-between items-center text-[11px] font-semibold py-1.5 border-b border-white/5">
                    <span className="text-white">{t.name}</span>
                    <span className="text-brand-gray text-right font-normal">{t.category}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Form */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gray border-b border-brand-border pb-3">Contact Support</h2>
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-3 mt-2">
                {formSubmitted && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-emerald-400 text-xs font-semibold text-center">
                    ✓ Your inquiry has been sent! We will contact you soon.
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="bg-brand-card border border-brand-border rounded-lg px-4 py-2.5 text-xs text-white placeholder-brand-gray/80 focus:outline-none focus:border-brand-yellow/50 transition-all"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your Email"
                    className="bg-brand-card border border-brand-border rounded-lg px-4 py-2.5 text-xs text-white placeholder-brand-gray/80 focus:outline-none focus:border-brand-yellow/50 transition-all"
                  />
                </div>
                <textarea
                  required
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Inquiry message..."
                  className="bg-brand-card border border-brand-border rounded-lg px-4 py-2.5 text-xs text-white placeholder-brand-gray/80 focus:outline-none focus:border-brand-yellow/50 transition-all resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="btn-glow-purple py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
