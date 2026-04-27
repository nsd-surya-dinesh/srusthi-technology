import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Github, Mail, Lock, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  return (
    <div className="pt-24 pb-32 flex items-center justify-center min-h-[80vh]">
      <div className="max-w-md w-full px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neat-card p-12 text-center relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/10 blur-[50px] -z-10" />
          
          <div className="w-20 h-20 bg-violet-600/20 text-violet-500 rounded-3xl flex items-center justify-center mx-auto mb-8 ring-1 ring-violet-500/30">
            <LogIn size={40} />
          </div>
          <h1 className="text-4xl font-sans font-bold tracking-tighter text-white uppercase italic mb-4">LMS PORTAL</h1>
          <div className="inline-block px-4 py-1.5 bg-violet-600 text-white rounded-full text-[10px] font-mono uppercase tracking-[0.2em] mb-8">
            Coming Soon
          </div>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            We are currently building a custom execution dashboard for our students. Registration for the next batch is open—reserve your track now to get early access once we launch.
          </p>

          <Link 
            to="/courses"
            className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
          >
            Explore Tracks <ArrowRight size={18} />
          </Link>

          <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/5">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-relaxed">
              Already registered? Check your email for orientation details and Discord access.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
