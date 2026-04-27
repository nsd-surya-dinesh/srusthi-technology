import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Phone, Mail, MapPin, MessageSquare, Plus, Minus } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="text-lg text-gray-300 group-hover:text-white transition-colors tracking-tight">{question}</span>
        {isOpen ? <Minus size={18} className="text-violet-500" /> : <Plus size={18} className="text-violet-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-gray-500 text-sm mt-4 leading-relaxed font-light">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Contact() {
  const faqs = [
    { question: "Is this for beginners?", answer: "Yes! All our tracks are designed starting from absolute zero. We assume you've never written a line of code." },
    { question: "Will I get a certificate?", answer: "We provide an Execution Certificate, but more importantly, you'll have a portfolio of real projects on GitHub to show employers." },
    { question: "Can I cancel my enrollment?", answer: "You can cancel up to 48 hours before the first session for a full refund of the enrollment fee." },
    { question: "Do I need a high-end laptop?", answer: "Any laptop with 4GB RAM and an internet connection is sufficient. Most coding is done on cloud-friendly editors." },
    { question: "What is the daily time commitment?", answer: "Expect to spend 2-3 hours daily. 1 hour for the session and 1-2 hours for your execution task." },
    { question: "Is it completely online?", answer: "Yes, all sessions are live online. We use Discord for continuous support throughout the day." },
    { question: "How are parent updates sent?", answer: "We send a weekly status report via WhatsApp to the parent's number provided during registration." },
    { question: "Do you offer placement support?", answer: "We focus on building proof-of-work. Top performers are referred to our network of partner startups." },
    { question: "What happens if I miss a session?", answer: "All sessions are recorded and uploaded to the portal immediately. You'll still need to complete the task within 24 hours." },
    { question: "Is there an age limit?", answer: "No, as long as you are curious and ready to execute, you are welcome at SRUSTHI." },
  ];

  return (
    <div className="pt-20 pb-12">
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-20">
        <div>
          <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter mb-8 text-white italic uppercase">Get In Touch</h1>
          <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed font-light">
            Have questions about the execution system? Our team is ready to help you navigate your learning path.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                <Mail className="text-violet-500" size={20} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Email Us</div>
                <div className="text-white font-medium">srusthitechnologies@gmail.com</div>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Phone className="text-cyan-500" size={20} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Call Us</div>
                <div className="text-white font-medium">+91 70323 13051</div>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                <MapPin className="text-pink-500" size={20} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Location</div>
                <div className="text-white font-medium">Vijayawada, India</div>
              </div>
            </div>

            <a 
              href="https://wa.me/917032313051" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-violet-600 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-xl shadow-violet-500/20 mt-8"
            >
              <MessageSquare size={20} /> WhatsApp Us Now
            </a>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="neat-card p-10 lg:p-12"
        >
          <h3 className="text-2xl font-bold mb-8 text-white uppercase italic tracking-tight">Drop us a Message</h3>
          <form className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Full Name</label>
              <input type="text" className="w-full neat-input p-4 rounded-xl text-white" placeholder="Srinivas Rao" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Email Address</label>
              <input type="email" className="w-full neat-input p-4 rounded-xl text-white" placeholder="srinivas@gmail.com" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Message</label>
              <textarea className="w-full neat-input p-4 rounded-xl text-white h-32 resize-none" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all">
              Send Message <Send size={18} />
            </button>
          </form>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-sans font-bold tracking-tighter text-white italic uppercase underline decoration-violet-500/50 underline-offset-8">Frequent Questions</h2>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10">
          {faqs.map((f, i) => (
            <FAQItem key={i} question={f.question} answer={f.answer} />
          ))}
        </div>
      </section>
    </div>
  );
}
