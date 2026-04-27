import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Tag, Target, Sparkles } from 'lucide-react';

export default function Courses() {
  const [filter, setFilter] = useState('All');

  const courses = [
    {
      id: 'python-builder',
      name: 'Python Builder Track',
      duration: '4 Weeks',
      price: '299',
      category: 'Inter Students',
      outcome: 'Build 3 real-world games & utility tools',
      topics: ['Python Syntax & Logic', 'OOP Principles', 'Automation Basics', 'Data Visualization'],
      batch: 'May 10th, 2026'
    },
    {
      id: 'web-creation',
      name: 'Web Creation Track',
      duration: '6 Weeks',
      price: '599',
      category: 'All',
      outcome: 'Portfolio-ready full-stack website',
      topics: ['Modern React 18+', 'Tailwind CSS Mastery', 'State Management', 'Vite & Deployment'],
      batch: 'May 12th, 2026'
    },
    {
      id: 'data-ai',
      name: 'Data & AI Track',
      duration: '8 Weeks',
      price: '899',
      category: 'Engineering',
      outcome: 'Interactive Dashboard + ML Model',
      topics: ['NumPy & Pandas Analytics', 'Regression Models', 'NLP Foundations', 'Data Storytelling'],
      batch: 'May 15th, 2026'
    },
    {
      id: 'full-stack',
      name: 'Full-Stack Launch Track',
      duration: '12 Weeks',
      price: '1,199',
      category: 'Engineering',
      outcome: 'Complete SaaS application on GitHub',
      topics: ['Advanced Backend Architecture', 'DB Management', 'Authentication Systems', 'CI/CD Pipelines'],
      batch: 'May 20th, 2026'
    },
    {
      id: 'game-design',
      name: 'Game Design Track',
      duration: '6 Weeks',
      price: '699',
      category: 'All',
      outcome: 'Playable 3D Game Prototype',
      topics: ['Unity Engine Mastery', 'C# Game Logic', 'Level Design Principles', '3D Asset Workflow'],
      batch: 'May 18th, 2026'
    }
  ];

  const filteredCourses = filter === 'All' ? courses : courses.filter(c => {
    if (filter === 'Beginner') return c.category === 'Inter Students' || c.category === 'All';
    if (filter === 'Advanced') return c.category === 'Engineering';
    return true;
  });

  return (
    <div className="pt-20 pb-12">
      <section className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter mb-8 text-white uppercase italic">Choose Your Track</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {['All', 'Beginner', 'Advanced'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
                filter === f ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-white/5 text-gray-500 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 mb-20">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((c) => (
            <motion.div
              layout
              key={c.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="neat-card p-10 flex flex-col justify-between group hover:border-violet-500/30 transition-all h-full"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{c.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-violet-400">₹{c.price}</div>
                    <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Enrollment Fee</div>
                  </div>
                </div>

                <div className="flex gap-6 mb-8 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-400">
                  <span className="flex items-center gap-2"><Clock size={14} className="text-violet-500" /> {c.duration}</span>
                  <span className="flex items-center gap-2"><Target size={14} className="text-cyan-500" /> Next Batch: {c.batch}</span>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-8">
                  <span className="text-[10px] font-mono text-violet-500 uppercase tracking-widest block mb-2">Primary Outcome</span>
                  <p className="text-sm text-gray-300 font-medium italic">{c.outcome}</p>
                </div>

                <div className="space-y-3 mb-10">
                  <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest block mb-4">Core Modules</span>
                  {c.topics.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-1 h-1 rounded-full bg-violet-500/50" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              <Link 
                to={`/register?course=${encodeURIComponent(c.name)}`}
                className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all group/btn"
              >
                Enroll Now <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* Bundle Offer */}
      <section className="max-w-4xl mx-auto px-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="relative p-12 neat-card overflow-hidden border-violet-500/30 bg-gradient-to-br from-violet-600/10 to-transparent"
        >
          <div className="absolute top-0 right-0 p-4">
            <span className="px-4 py-1.5 bg-violet-600 text-white rounded-full text-[10px] font-mono uppercase tracking-widest shadow-xl">Best Value</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div>
              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <Sparkles className="text-amber-400" size={24} />
                <h2 className="text-3xl font-bold text-white uppercase italic tracking-tighter">Full Summer Bundle</h2>
              </div>
              <p className="text-gray-400 mb-2 leading-relaxed">Unlock access to all 4 tracks this summer. Master the full engineering spectrum.</p>
              <p className="text-cyan-400 text-xs font-mono tracking-widest">Python + Web + Data + Full-Stack</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2 tracking-tighter">₹2,499</div>
              <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-6">Original Value: ₹2,996</p>
              <Link 
                to="/register?course=Full Summer Bundle"
                className="px-10 py-4 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-500 transition-all shadow-xl shadow-violet-600/20 block"
              >
                Claim Bundle
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
