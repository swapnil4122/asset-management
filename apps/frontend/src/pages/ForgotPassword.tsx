import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, Shield, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from '../api/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/auth/forgot-password', { email });
      setIsSuccess(true);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-4 py-12 selection:bg-indigo-500/30">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-[#111827]/50 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-gray-800 relative z-10"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 mb-6"
          >
            <Shield className="w-8 h-8 text-indigo-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-gray-400 font-medium px-4">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Check your email</h3>
              <p className="text-gray-400">
                If an account exists for <span className="text-white font-semibold">{email}</span>, you will receive a password reset link shortly.
              </p>
            </div>
            <Link 
              to="/login"
              className="inline-flex items-center text-indigo-500 font-bold hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Login
            </Link>
          </motion.div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl font-medium">
                {error}
              </div>
            )}

            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-xl shadow-indigo-500/10 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="flex items-center">
                  Send reset link
                </span>
              )}
            </button>

            <div className="text-center">
              <Link 
                to="/login"
                className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
