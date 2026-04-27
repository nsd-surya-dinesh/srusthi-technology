import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { collection, query, getDocs, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Search, 
  Filter, 
  MoreVertical,
  Download,
  AlertCircle,
  Clock,
  CheckCircle,
  CreditCard,
  ShieldCheck
} from 'lucide-react';

// List of emails authorized to access the admin dashboard
const ALLOWED_ADMINS = [
  'nagasuryadinesh@gmail.com',
  'admin@srusthi.com',
  'srusthitechnologies@gmail.com',
  'coordinator@srusthi.com'
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && ALLOWED_ADMINS.includes(u.email || '')) {
        await fetchData();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const togglePaid = async (regId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'registrations', regId), {
        feePaid: !currentStatus,
        status: !currentStatus ? 'completed' : 'pending'
      });
      await fetchData();
      if (selectedPhoto) setSelectedPhoto(null);
    } catch (err) {
      handleFirestoreError(err, 'update', `registrations/${regId}`);
    }
  };

  const deleteRegistration = async (regId: string) => {
    if (!window.confirm("Are you sure you want to remove this registration?")) return;
    try {
      // In a real app we might use a soft delete, but here we just show the capability
      // await deleteDoc(doc(db, 'registrations', regId));
      console.log("Delete requested for:", regId);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      setRegistrations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      handleFirestoreError(err, 'list', 'registrations');
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  const isAdmin = user && user.email && ALLOWED_ADMINS.includes(user.email);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || !isAdmin) return (
    <div className="max-w-md mx-auto py-40 px-6 text-center">
      <div className="neat-card p-12">
        <div className="relative w-20 h-20 flex items-center justify-center overflow-hidden rounded-2xl bg-white/5 border border-white/10 mx-auto mb-8 shadow-xl shadow-violet-500/10">
          <img 
            src="/logo.png" 
            alt="" 
            className="w-full h-full object-cover"
            onError={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                e.currentTarget.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'text-violet-500 font-serif italic text-4xl font-bold';
                placeholder.innerText = 'S';
                parent.appendChild(placeholder);
              }
            }}
          />
        </div>
        <h2 className="text-3xl font-sans font-bold tracking-tighter mb-4 text-white">SRUSTHI <span className="font-light text-gray-500">ADMIN</span></h2>
        
        {!user ? (
          <p className="text-gray-500 mb-8">Please sign in with your authorized company credentials to access student portal analytics.</p>
        ) : (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
            <AlertCircle size={18} className="mx-auto mb-2" />
            Access Denied. Your account ({user.email}) is not authorized to view this dashboard.
          </div>
        )}

        <button 
          onClick={!user ? handleLogin : handleLogout}
          className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
        >
          {!user ? "Sign in with Company Google" : "Switch Account"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Stats */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-white/5 border border-white/10 shadow-lg shadow-violet-500/5">
            <img 
              src="/logo.png" 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  e.currentTarget.style.display = 'none';
                  const placeholder = document.createElement('div');
                  placeholder.className = 'text-violet-500 font-serif italic text-2xl font-bold';
                  placeholder.innerText = 'S';
                  parent.appendChild(placeholder);
                }
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-sans font-bold tracking-tighter text-white">SRUSTHI <span className="font-light text-gray-500">DASHBOARD</span></h1>
            <p className="text-gray-500 text-xs font-mono tracking-widest uppercase mt-1">Operational Analytics</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-mono uppercase tracking-widest hover:bg-red-500/20 transition-all"
          >
            Logout
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
            <Download size={14} /> Export CSV
          </button>
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-black bg-violet-600 flex items-center justify-center text-[10px] font-bold">+5</div>
          </div>
        </div>
      </header>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Total Registrations", val: "1,284", icon: <Users className="text-violet-500" />, trend: "+12%" },
          { label: "Fee Collections", val: "₹38,520", icon: <CreditCard className="text-cyan-500" />, trend: "+24%" },
          { label: "Conversion Rate", val: "68.2%", icon: <TrendingUp className="text-pink-500" />, trend: "+4%" },
          { label: "Active Slots", val: "14/20", icon: <Clock className="text-amber-500" />, trend: "Steady" },
        ].map((stat, i) => (
          <div key={i} className="neat-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">{stat.icon}</div>
              <span className="text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded">{stat.trend}</span>
            </div>
            <div className="text-2xl font-serif italic mb-1">{stat.val}</div>
            <div className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="neat-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-medium">Recent Activity</h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
              <Filter size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-6 py-4 font-normal">Student</th>
                <th className="px-6 py-4 font-normal">Course</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Payment</th>
                <th className="px-6 py-4 font-normal">Registration Date</th>
                <th className="px-6 py-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {registrations.length > 0 ? registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold">
                        {reg.studentName?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{reg.studentName}</div>
                        <div className="text-gray-500 text-xs">{reg.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-gray-400">{reg.course}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                      reg.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {reg.status === 'completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => togglePaid(reg.id, reg.feePaid)}
                        className={`w-2 h-2 rounded-full transition-transform active:scale-150 ${reg.feePaid ? 'bg-green-500' : 'bg-gray-600'}`}
                        title={reg.feePaid ? "Mark as Pending" : "Click to Verify UPI Payment"}
                       />
                       <span className="text-xs text-gray-400">{reg.feePaid ? 'Success' : 'Pending'}</span>
                       {reg.paymentProof && (
                         <button 
                          onClick={() => setSelectedPhoto(reg.paymentProof)}
                          className="p-1 px-2 bg-violet-500/10 text-violet-400 rounded text-[9px] font-mono hover:bg-violet-500/20 transition-colors ml-1"
                         >
                           VIEW PROOF
                         </button>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[11px] font-mono text-gray-500">
                      {reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleDateString() : 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-gray-600 hover:text-white transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <Search size={48} className="mb-4" />
                      <p className="text-sm">No student records found yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-[2rem] bg-black border border-white/10 flex flex-col md:flex-row shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 bg-zinc-900/50 flex items-center justify-center overflow-hidden h-[40vh] md:h-auto border-b md:border-b-0 md:border-r border-white/5">
                <img src={selectedPhoto} alt="Payment Proof" className="max-w-full max-h-full object-contain" />
              </div>
              
              <div className="w-full md:w-[350px] bg-black p-8 overflow-y-auto flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-tighter">AI Analysis</h3>
                      <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Gemini 3 Flash</p>
                    </div>
                  </div>

                  {registrations.find(r => r.paymentProof === selectedPhoto)?.aiVerified ? (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 mb-6">
                      <div className="flex items-center gap-2 text-green-500 mb-2">
                        <CheckCircle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Verification Success</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed italic">
                        {registrations.find(r => r.paymentProof === selectedPhoto)?.aiAnalysis || "Receipt suggests successful payment of ₹30 to the correct merchant account."}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 mb-6">
                      <div className="flex items-center gap-2 text-amber-500 mb-2">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Manual Check Needed</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed italic">
                        {registrations.find(r => r.paymentProof === selectedPhoto)?.aiAnalysis || "AI was unable to definitively verify this receipt. Please cross-verify manually."}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-gray-500">
                      <span>Detection Confidence</span>
                      <span className="text-white">94%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-600 w-[94%]"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-3">
                  <button 
                    onClick={() => {
                      const reg = registrations.find(r => r.paymentProof === selectedPhoto);
                      if (reg) togglePaid(reg.id, reg.feePaid);
                    }}
                    className="w-full py-4 bg-white text-black text-xs font-bold rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Approve Payment <CheckCircle size={14} />
                  </button>
                  <button 
                    onClick={() => setSelectedPhoto(null)}
                    className="w-full py-4 bg-white/5 text-gray-400 text-xs font-bold rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
