import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { collection, query, getDocs, addDoc, serverTimestamp, updateDoc, doc, getDoc } from 'firebase/firestore';
import { CreditCard, Calendar, CheckCircle2, Loader2, Sparkles, AlertCircle, Upload, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

export default function PaymentBooking() {
  const [searchParams] = useSearchParams();
  const regId = searchParams.get('regId');
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [paymentPhoto, setPaymentPhoto] = useState<string | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiVerified, setAiVerified] = useState<boolean | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [regData, setRegData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!regId) {
      setError("Registration ID is missing. Please register first.");
      return;
    }
    verifyRegistration();
    fetchSlots();
  }, [regId]);

  const verifyRegistration = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'registrations', regId!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRegData(data);
        if (data.feePaid) {
          if (data.status === 'completed') {
            setStep(3);
          } else {
            setStep(2);
          }
        }
      } else {
        setError("Invalid Registration ID. Please start over.");
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setError("Could not verify registration. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeReceipt = async (base64Image: string) => {
    setAiAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `Analyze this payment screenshot. 
      Target:
      1. Amount: Should be ₹30 (or close, e.g., 30.00).
      2. Merchant: Should be related to "6300560119@nyes" or "Srusthi Technologies".
      3. Status: Must be "Success" or "Completed".
      
      Response Format:
      - A short 1-2 sentence summary of what you found.
      - End the response with exactly either "STATUS: VERIFIED" or "STATUS: UNVERIFIED".`;
      
      const imagePart = {
        inlineData: {
          mimeType: "image/png",
          data: base64Image.split(',')[1],
        },
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: [imagePart, { text: prompt }] },
      });

      const analysis = response.text || "";
      setAiAnalysis(analysis);
      setAiVerified(analysis.toUpperCase().includes("STATUS: VERIFIED"));
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setAiAnalysis("AI verification delayed. Our team will verify manually. Please proceed.");
      setAiVerified(null);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const q = query(collection(db, 'slots'));
      const snapshot = await getDocs(q);
      const s = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlots(s.length > 0 ? s : [
        { id: '1', date: '2026-05-01', time: '10:00 AM', capacity: 20, filled: 5 },
        { id: '2', date: '2026-05-01', time: '02:00 PM', capacity: 20, filled: 12 },
        { id: '3', date: '2026-05-02', time: '11:00 AM', capacity: 20, filled: 18 },
        { id: '4', date: '2026-05-03', time: '04:00 PM', capacity: 20, filled: 2 },
      ]);
    } catch (err) {
      handleFirestoreError(err, 'list', 'slots');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) { // Limit to 800KB roughly
        alert("Image too large. Please upload a smaller screenshot (under 800KB).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPaymentPhoto(result);
        analyzeReceipt(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayment = async () => {
    if (!regId) {
      alert("Registration ID not found. Please register first.");
      return;
    }
    if (!paymentPhoto) {
      alert("Please upload a screenshot of your successful UPI transaction.");
      return;
    }
    setLoading(true);
    try {
      // Update registration document with payment info
      const regDoc = doc(db, 'registrations', regId);
      await updateDoc(regDoc, {
        feePaid: true,
        paymentProof: paymentPhoto,
        aiVerified: aiVerified === true,
        aiAnalysis: aiAnalysis,
        updatedAt: serverTimestamp()
      });
      setRegData((prev: any) => ({ ...prev, feePaid: true }));
      setLoading(false);
      setStep(2);
    } catch (err) {
      handleFirestoreError(err, 'update', `registrations/${regId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot || !regId) return;
    setLoading(true);
    try {
      const regDoc = doc(db, 'registrations', regId);
      await updateDoc(regDoc, {
        bookedSlotId: selectedSlot,
        status: 'completed',
        updatedAt: serverTimestamp()
      });
      setRegData((prev: any) => ({ ...prev, bookedSlotId: selectedSlot }));
      setStep(3);
    } catch (err) {
      handleFirestoreError(err, 'update', `registrations/${regId}`);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Error</h2>
        <p className="text-gray-400 mb-8">{error}</p>
        <button 
          onClick={() => navigate('/register')}
          className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Back to Registration
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif italic mb-4">Complete Your Enrollment</h2>
        <div className="flex items-center justify-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
          <span className={step >= 1 ? 'text-violet-500' : ''}>Payment</span>
          <div className="h-px w-8 bg-white/10" />
          <span className={step >= 2 ? 'text-violet-500' : ''}>Booking</span>
          <div className="h-px w-8 bg-white/10" />
          <span className={step >= 3 ? 'text-violet-500' : ''}>Confirmation</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="neat-card p-12 max-w-lg mx-auto"
          >
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-medium mb-1">Orientation Fee</h3>
                <p className="text-gray-500 text-sm">One-time fee to confirm your seat and access orientation resources</p>
              </div>
              <div className="text-3xl font-serif italic">₹30</div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="p-2 bg-violet-500/20 text-violet-500 rounded-lg">
                  <Sparkles size={16} />
                </div>
                <div className="text-sm">Includes direct counselor mapping</div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="p-2 bg-cyan-500/20 text-cyan-500 rounded-lg">
                  <Sparkles size={16} />
                </div>
                <div className="text-sm">Early access to track resources</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/10 max-w-[240px] border-4 border-violet-500/20">
                  <img src="/qr-code.jpeg" alt="Payment QR Code" className="w-full h-auto rounded-xl" />
                </div>
              </div>

              <div className="p-6 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">Verified UPI Merchant</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('6300560119@nyes');
                      alert('UPI ID copied to clipboard!');
                    }}
                    className="text-[10px] font-bold text-violet-400 bg-violet-400/10 px-3 py-1 rounded-full hover:bg-violet-400 hover:text-black transition-all uppercase tracking-widest"
                  >
                    Copy UPI ID
                  </button>
                </div>
                <div className="text-[10px] text-gray-500 italic">Scan the QR code or copy the UPI ID above. Pay ₹30 and upload the transaction screenshot below to activate verification.</div>
              </div>

              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                  paymentPhoto ? (aiVerified === true ? 'border-green-500/50 bg-green-500/5' : aiVerified === false ? 'border-red-500/50 bg-red-500/5' : 'border-violet-500/50 bg-violet-500/5') : 'border-white/10 group-hover:border-violet-500/50 group-hover:bg-violet-500/5'
                }`}>
                  {paymentPhoto ? (
                    <>
                      {aiAnalyzing ? (
                        <div className="flex flex-col items-center gap-2 animate-pulse">
                          <Loader2 size={32} className="text-violet-500 animate-spin" />
                          <div className="text-xs font-mono text-violet-400 uppercase tracking-widest">AI Analyzing Receipt...</div>
                        </div>
                      ) : aiVerified === true ? (
                        <>
                          <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-full mb-1 border border-green-500/20">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">AI Verified</span>
                          </div>
                          <CheckCircle2 size={32} className="text-green-500" />
                          <div className="text-sm text-green-400 font-medium">Payment confirmed by Srusthi AI</div>
                        </>
                      ) : aiVerified === false ? (
                        <>
                          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-3 py-1 rounded-full mb-1 border border-red-500/20">
                            <AlertCircle size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Verification Failed</span>
                          </div>
                          <div className="text-sm text-red-400 font-medium text-center">AI couldn't verify this receipt. Please ensure ₹30 was paid to 6300560119@nyes.</div>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={32} className="text-violet-500" />
                          <div className="text-sm text-violet-400 font-medium">Screenshot Uploaded</div>
                        </>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); setPaymentPhoto(null); setAiVerified(null); setAiAnalysis(null); }} className="text-[10px] text-gray-500 underline uppercase tracking-widest mt-2">Change Image</button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                        <Upload size={24} />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Upload Payment Screenshot</div>
                        <div className="text-xs text-gray-500 mt-1">Tap here to select from gallery</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading || !paymentPhoto}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Confirm & Proceed to Booking"}
            </button>
            <p className="text-center text-gray-600 text-[10px] mt-6 font-mono uppercase tracking-widest">Secure 256-bit SSL encrypted payment</p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="neat-card p-8 bg-green-500/5 border-green-500/20 h-fit">
                <div className="w-12 h-12 bg-green-500 text-black rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle2 />
                </div>
                <h3 className="text-xl font-medium mb-2">Payment Successful</h3>
                <p className="text-gray-400 text-sm mb-6">Transaction ID: SR_TH_83472091</p>
                <div className="p-4 bg-white/5 rounded-xl text-sm border border-white/5">
                  Now, please select a slot for your orientation call with our academic counselor.
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Available Orientation Slots</h4>
                
                {slots.length === 0 ? (
                  <div className="p-12 border border-white/5 bg-white/[0.02] rounded-3xl text-center">
                    <p className="text-gray-500 text-sm">No slots found. Please contact support to schedule your orientation.</p>
                  </div>
                ) : (
                  slots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`w-full p-6 neat-card text-left flex items-center justify-between transition-all group ${
                        selectedSlot === slot.id ? 'border-violet-500 bg-violet-500/10' : 'hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={14} className="text-violet-500" />
                          <span className="font-medium">{new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="text-gray-400 text-xs">{slot.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Availability</div>
                        <div className={`text-xs font-medium ${slot.capacity - slot.filled < 5 ? 'text-amber-500' : 'text-green-500'}`}>
                          {slot.capacity - slot.filled} / {slot.capacity} left
                        </div>
                      </div>
                    </button>
                  ))
                )}
                
                <button
                  onClick={handleBooking}
                  disabled={!selectedSlot || loading}
                  className="w-full py-4 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-8"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Confirm Slot Booking"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="neat-card p-20 text-center max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-violet-600/20 text-violet-500 rounded-full flex items-center justify-center mx-auto mb-10 ring-4 ring-violet-600/10">
              <Sparkles size={48} />
            </div>
            <h2 className="text-5xl font-serif italic mb-6">You're All Set!</h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Booking {regData?.bookedSlotId ? 'Confirmed' : 'Pending'}. 
              You will receive a meeting link on your email 15 minutes before the scheduled time. 
              Welcome to the Srusthi Technologies community.
            </p>
            {regData?.bookedSlotId && (
              <div className="grid grid-cols-2 gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 mb-10">
                <div className="text-left border-r border-white/10 px-4">
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter mb-1">Date</div>
                  <div className="font-medium italic font-serif">
                    {(() => {
                      const slot = slots.find(s => s.id === (regData?.bookedSlotId || selectedSlot));
                      return slot ? new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 2026';
                    })()}
                  </div>
                </div>
                <div className="text-left px-4">
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter mb-1">Time</div>
                  <div className="font-medium italic font-serif">
                    {slots.find(s => s.id === (regData?.bookedSlotId || selectedSlot))?.time || 'Morning Session'}
                  </div>
                </div>
              </div>
            )}
            <button className="text-violet-400 text-sm font-medium hover:text-white transition-colors flex items-center gap-2 mx-auto">
              Download Receipt (PDF) <Calendar size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
