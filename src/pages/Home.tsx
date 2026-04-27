import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Play, 
  MessageCircle, 
  Users, 
  UserPlus,
  Trophy, 
  Zap,
  Target,
  FileCode,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function Home() {
  const steps = [
    { icon: <Target className="text-violet-500" />, title: "Daily Task", desc: "Receive a real-world coding challenge every morning." },
    { icon: <FileCode className="text-cyan-500" />, title: "Live Submission", desc: "Push your code to GitHub before the evening deadline." },
    { icon: <MessageCircle className="text-pink-500" />, title: "Feedback", desc: "Get detailed mentor review on your code quality." },
    { icon: <CheckCircle className="text-amber-500" />, title: "Project Ship", desc: "Combine tasks into a fully functional product." },
  ];

  return (
    <div className="relative overflow-hidden flex flex-col min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 blur-[150px] -z-10 rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] -z-10 rounded-full" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-violet-400 text-[10px] font-mono tracking-[0.3em] uppercase mb-8">
            LEARN • BUILD • SUCCEED
          </span>
          <h1 className="text-7xl md:text-9xl font-sans font-bold leading-[0.8] tracking-tighter mb-8 text-white uppercase italic">
            STOP WATCHING.<br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 italic">START BUILDING.</span>
          </h1>
          <p className="text-gray-400 text-xl md:text-3xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Don't just collect certificates. Build a portfolio of real products with industry-led execution tracks.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link 
              to="/courses" 
              className="px-10 py-5 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all flex items-center gap-2 group shadow-2xl shadow-white/10"
            >
              Enroll Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/register" 
              className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center gap-2 group"
            >
              Register Now <UserPlus size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" />)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-none">72% COMPLETION</div>
                <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-0.5">Industry Standard: 5%</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="text-3xl font-bold text-white tracking-tighter mb-1 font-sans">25+</div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Active Students</div>
          </div>
          <div className="text-center border-x border-white/5 px-8">
            <div className="text-3xl font-bold text-white tracking-tighter mb-1 font-sans">72%</div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white tracking-tighter mb-1 font-sans italic">Rs.0</div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Marketing CAC</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="neat-card p-16 relative overflow-hidden border-red-500/10 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={120} /></div>
          <h2 className="text-2xl font-mono text-red-500 uppercase tracking-widest mb-8">The Sunday Evening Pain</h2>
          <p className="text-3xl md:text-4xl text-white font-serif italic leading-relaxed mb-10">
            "You just finished a 40-hour tutorial marathon. You have the certificate. But when you open a blank VS Code window to build your own idea... nothing happens."
          </p>
          <p className="text-gray-500 text-lg font-light leading-relaxed">
            Welcome to Tutorial Hell. passive watching gives you the illusion of learning. Coding is a sport—you can't learn it by watching matches. You need to play. SRUSTHI is the stadium where you actually play.
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter text-white mb-20 text-center uppercase italic underline decoration-violet-500/50 underline-offset-8">Execution System</h2>
        <div className="grid md:grid-cols-4 gap-12">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center group"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:border-violet-500/50 group-hover:bg-violet-500/10 transition-all duration-500">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter italic">{i + 1}. {s.title}</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">{s.desc}</p>
              {i < 3 && <ArrowRight size={24} className="hidden lg:block absolute top-8 -right-6 text-gray-800" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Courses Preview */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-sans font-bold tracking-tighter text-white uppercase italic">Active Tracks</h2>
            <p className="text-gray-500 mt-2 font-mono text-[10px] tracking-widest uppercase">Select your path to mastery</p>
          </div>
          <Link to="/courses" className="text-violet-400 font-mono text-xs hover:text-white transition-all uppercase tracking-widest">View All Tracks →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {['Python Builder Track', 'Web Creation Track', 'Data & AI Track', 'Full-Stack Launch Track', 'Game Design Track'].map((name, i) => (
            <div key={i} className="neat-card p-8 group border-white/5">
              <h3 className="text-xl font-bold text-white mb-8 h-12 leading-tight uppercase italic">{name}</h3>
              <Link to="/courses" className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all group">
                Explore Track <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Parent Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-4 text-center">
        <div className="neat-card p-16 border-cyan-500/20 bg-cyan-500/5 shadow-2xl shadow-cyan-500/10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono tracking-[0.2em] uppercase mb-8">
            Parental Transparency
          </div>
          <h2 className="text-4xl font-sans font-bold tracking-tighter text-white mb-6 uppercase italic">FOR THE PARENTS</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Weekly progress updates sent directly to your WhatsApp. Real metrics, actual built projects, and attendance reports. We believe in transparency as much as we believe in technology.
          </p>
          <div className="flex justify-center gap-8">
            <div className="text-left">
              <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Reporting</div>
              <div className="text-white font-bold">Weekly WhatsApp</div>
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Visibility</div>
              <div className="text-white font-bold">Real-time Portal</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
