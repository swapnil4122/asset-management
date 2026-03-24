import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, Loader2, Sparkles, Camera, Bell, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from '../api/api';

import { useAuth } from '../hooks/useAuth';

const steps = [
  { id: 1, title: 'Profile', icon: User },
  { id: 2, title: 'Preferences', icon: Settings },
  { id: 3, title: 'Verification', icon: ShieldCheck },
];

const Onboarding: React.FC = () => {

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    theme: 'dark',
    notifications: true,
  });

  const { user, updateUser, token } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // 1. Update Profile (Backend endpoint: PATCH /users/:id)
      await api.patch(`/users/${user?.id}`, {
        username: formData.username || user?.username,
        onboardingCompleted: true,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });


      updateUser({ onboardingCompleted: true, username: formData.username || user?.username });
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error('Onboarding update failed', axiosError);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center px-4 selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-2xl w-full">
        {/* Progress Stepper */}
        <div className="mb-12 relative flex justify-between items-center px-2">
          <div className="absolute h-0.5 bg-gray-800 left-10 right-10 top-1/2 -translate-y-1/2 -z-10" />
          <motion.div 
            className="absolute h-0.5 bg-indigo-500 left-10 transition-all duration-500 -z-10" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 80px)' }}
          />
          
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <motion.div 
                  animate={{ 
                    scale: isCurrent ? 1.2 : 1,
                    backgroundColor: isActive ? '#4F46E5' : '#111827'
                  }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
                    isActive ? 'border-indigo-400' : 'border-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                </motion.div>
                <span className={`text-xs font-bold tracking-widest uppercase ${isActive ? 'text-indigo-400' : 'text-gray-600'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827]/50 backdrop-blur-xl border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">Create your profile</h2>
                  <p className="text-gray-400">Let the community know who you are.</p>
                </div>

                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-3xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center group-hover:border-indigo-500 transition-all overflow-hidden relative">
                      {user?.username ? (
                        <div className="text-2xl font-bold text-indigo-500 uppercase">{user.username.slice(0, 2)}</div>
                      ) : (
                        <Camera className="text-gray-600" />
                      )}
                      <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="text-white w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Username</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Satoshi"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 px-5 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Bio</label>
                    <textarea 
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 px-5 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">Customize experience</h2>
                  <p className="text-gray-400">Tailor the platform to your needs.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-3xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
                        <Palette className="text-indigo-500 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">Dark Theme</h4>
                        <p className="text-sm text-gray-500">Enable premium night mode by default.</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                      <div className="absolute right-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-3xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
                        <Bell className="text-indigo-500 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">Smart Notifications</h4>
                        <p className="text-sm text-gray-500">Get alerts for significant asset movements.</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                      <div className="absolute right-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center"
              >
                <div className="w-24 h-24 bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-12 h-12 text-indigo-500" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-white">Almost there!</h2>
                  <p className="text-gray-400 max-w-sm mx-auto">
                    Your account is set up. You can start exploring the marketplace immediately. Advanced features may require identity verification later.
                  </p>
                </div>

                <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-3xl flex items-center gap-4 text-left max-w-sm mx-auto">
                  <CheckCircle2 className="text-green-500 w-8 h-8 shrink-0" />
                  <div>
                    <h4 className="text-white font-bold">Platform Status</h4>
                    <p className="text-sm text-gray-500 underline decoration-indigo-500/40">Basic access granted</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between pt-6 border-t border-gray-800">
            <button 
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center text-sm font-bold transition-all ${
                currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-white'
              }`}
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </button>
            
            <button 
              onClick={currentStep === 3 ? handleFinish : handleNext}
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all shadow-xl shadow-indigo-600/10 flex items-center"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : (
                <>
                  {currentStep === 3 ? 'Complete Setup' : 'Continue'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        <p className="text-center text-gray-600 text-xs mt-8 font-medium">
          Step {currentStep} of {steps.length} • Powered by AssetMgmt Identity
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
