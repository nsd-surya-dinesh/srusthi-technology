import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Shield, Users, Trophy } from 'lucide-react';

export default function About() {
  const stats = [
    { label: "Students Trained", val: "25+", icon: <Users className="text-violet-500" /> },
    { label: "Completion Rate", val: "72%", icon: <Trophy className="text-cyan-500" /> },
    { label: "Projects Built", val: "100+", icon: <CheckCircle2 className="text-pink-500" /> },
    { label: "CAC Efficiency", val: "Rs.0", icon: <Shield className="text-amber-500" /> },
  ];

  return (
    <div className="pt-20 pb-12">
      {/* Mission */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-violet-400 font-mono text-xs uppercase tracking-widest mb-4 block">Our Mission</span>
          <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tighter mb-8 text-white italic">
            Not a coaching class. <span className="text-gray-500 italic">An execution system.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            We don't sell videos. We provide a structured system where students are held accountable, pushed to their limits, and supported until they ship real products.
          </p>
        </div>
      </section>

      {/* How we are different */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter mb-16 text-center text-white italic uppercase underline decoration-violet-500/50 underline-offset-8">How We Are Different</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="neat-card p-10 border-red-500/20 bg-red-500/5">
            <h3 className="text-xl font-bold mb-6 text-red-400 font-mono uppercase">Traditional Platforms</h3>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li>• Passive video watching</li>
              <li>• Simulated lab environments</li>
              <li>• Low completion rates (typically &lt; 5%)</li>
              <li>• No personalized code reviews</li>
            </ul>
          </div>
          <div className="neat-card p-10 border-green-500/20 bg-green-500/5 ring-2 ring-green-500/20">
            <h3 className="text-xl font-bold mb-6 text-green-400 font-mono uppercase">SRUSTHI Execution System</h3>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li>• Mandatory Daily Deliverables</li>
              <li>• Real local environment development</li>
              <li>• High Completion Rate (72%)</li>
              <li>• Direct Mentor Feedback on every PR</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="text-center p-8 neat-card">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-6">
              {s.icon}
            </div>
            <div className="text-4xl font-sans font-bold tracking-tighter mb-2 text-white">{s.val}</div>
            <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
