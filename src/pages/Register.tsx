import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    course: 'Python Builder Track',
    college: '',
    discovery: 'Social Media',
  });

  const courses = [
    "Python Builder Track",
    "Web Creation Track",
    "Data & AI Track",
    "Full-Stack Launch Track",
    "Full Summer Bundle"
  ];

  const discoverySources = [
    "Social Media",
    "Friend/Referral",
    "WhatsApp Group",
    "College Campus",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    const phoneRegex = /^[0-9+() -]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, 'registrations'), {
        ...formData,
        feePaid: false,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setRegistrationId(docRef.id);
      setSuccess(true);
    } catch (err: any) {
      console.error("Registration Error:", err);
      setError("Something went wrong. Please try again or contact support.");
      try {
        handleFirestoreError(err, 'create', 'registrations');
      } catch (lmsErr) {
        // Log the JSON error for our system
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-4xl font-serif italic mb-4">Registration Received!</h2>
          <p className="text-gray-400 mb-8">
            Thank you, {formData.studentName}. Your pre-registration for {formData.course} is successful. 
            Finalize your process by paying the enrollment fee of ₹30.
          </p>
          <button 
            onClick={() => navigate(`/payment?regId=${registrationId}`)}
            className="px-8 py-4 bg-violet-600 rounded-full font-medium hover:bg-violet-500 transition-colors"
          >
            Go to Payment & Slot Booking
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-20 items-start">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-[10px] font-mono uppercase tracking-widest mb-6">
          Limited Intake
        </div>
        <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter leading-[0.9] mb-8 text-white uppercase italic">
          Secure Your <br />
          <span className="text-violet-500">Future Seat.</span>
        </h2>
        
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl mb-12 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Next Batch</div>
              <div className="text-xl font-bold text-white italic font-serif">May 2026</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Availability</div>
              <div className="text-xl font-bold text-cyan-400 italic font-serif">20 Seats Only</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="flex gap-6 items-start group">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-500 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-violet-500 group-hover:text-black transition-all">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase italic tracking-tight">Execution First</h4>
              <p className="text-sm text-gray-500 leading-relaxed">No theory-only sessions. Build projects from day one.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start group">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-500 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-violet-500 group-hover:text-black transition-all">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase italic tracking-tight">Direct Access</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Direct mentorship and personalized code reviews.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="neat-card p-10 lg:p-12 relative max-w-lg mx-auto lg:mx-0"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-violet-600/10 blur-[60px] -z-10" />
        
        <h3 className="text-2xl font-bold text-white uppercase italic tracking-tight mb-8">Registration Form</h3>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full neat-input p-4 rounded-xl text-white" 
              placeholder="Arjun Verma"
              value={formData.studentName}
              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full neat-input p-4 rounded-xl text-white" 
                placeholder="arjun@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest">Phone Number</label>
              <input 
                required
                type="tel" 
                className="w-full neat-input p-4 rounded-xl text-white" 
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest">College / University</label>
            <input 
              required
              type="text" 
              className="w-full neat-input p-4 rounded-xl text-white" 
              placeholder="IIT Hyderabad / JNTU"
              value={formData.college}
              onChange={(e) => setFormData({...formData, college: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest">Which course?</label>
              <select 
                className="w-full neat-input p-4 rounded-xl text-white appearance-none cursor-pointer"
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
              >
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest">How did you hear?</label>
              <select 
                className="w-full neat-input p-4 rounded-xl text-white appearance-none cursor-pointer"
                value={formData.discovery}
                onChange={(e) => setFormData({...formData, discovery: e.target.value})}
              >
                {discoverySources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="p-6 bg-violet-600/5 border border-violet-500/20 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-violet-500 uppercase tracking-widest font-bold">Orientation Fee</div>
              <div className="text-2xl font-bold text-white tracking-tighter">₹30</div>
              <p className="text-[9px] text-gray-500 mt-1 max-w-[150px] leading-tight">One-time fee to confirm your seat and access orientation resources</p>
            </div>
            <button 
              disabled={loading}
              className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all shadow-xl shadow-white/10 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Register & Continue"}
            </button>
          </div>
          
          <p className="text-center text-gray-600 text-[10px] font-mono uppercase tracking-widest">Secure 256-bit encrypted booking</p>
        </form>
      </motion.div>
    </div>
  );
}
