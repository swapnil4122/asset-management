import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Shield, Globe, Wallet } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from '../api/api';

import { ethers } from 'ethers';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

import type { AuthResponse } from '../types/auth';



const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<'email' | 'wallet'>('email');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { user, tokens } = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      }) as unknown as AuthResponse;

      login(user, tokens.accessToken, tokens.refreshToken);
      
      if (!user.onboardingCompleted) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalletLogin = async () => {
    if (!window.ethereum) {
      setError('Please install a Web3 wallet (e.g., MetaMask)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // 1. Get Challenge
      const message = await api.post<string>('/auth/wallet/challenge', {
        walletAddress: address,
      }) as unknown as string;

      // 2. Sign Challenge
      const signature = await signer.signMessage(message);

      // 3. Verify
      const { user, tokens } = await api.post<AuthResponse>('/auth/wallet/login', {
        walletAddress: address,
        message,
        signature,
      }) as unknown as AuthResponse;

      login(user, tokens.accessToken, tokens.refreshToken);

      if (!user.onboardingCompleted) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || axiosError.message || 'Wallet authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
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
            Secure Access
          </h2>
          <p className="mt-2 text-gray-400 font-medium">
            Manage your digital assets with confidence.
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex p-1 bg-gray-900/50 rounded-xl border border-gray-800">
          <button
            onClick={() => setAuthMode('email')}
            className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg transition-all ${
              authMode === 'email' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </button>
          <button
            onClick={() => setAuthMode('wallet')}
            className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg transition-all ${
              authMode === 'wallet' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4 mr-2" />
            Wallet
          </button>
        </div>

        <AnimatePresence mode="wait">
          {authMode === 'email' ? (
            <motion.form 
              key="email-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
              onSubmit={handleEmailLogin}
            >
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-4">
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

                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-800 bg-gray-900 text-indigo-600 focus:ring-indigo-500/50" />
                  <span className="ml-2 text-sm text-gray-500">Stay signed in</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-indigo-500 hover:text-indigo-400 transition-colors">
                  Forgot?
                </Link>

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
                    Sign In
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </span>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="wallet-auth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4 text-center"
            >
              <div className="bg-indigo-600/10 p-4 rounded-3xl border border-indigo-500/20 mb-2">
                <Wallet className="w-12 h-12 text-indigo-500 mx-auto" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Connect Web3 Wallet</h3>
                <p className="text-sm text-gray-500">Sign a one-time message to securely authenticate without a password.</p>
              </div>
              
              <button
                onClick={handleWalletLogin}
                disabled={isSubmitting}
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-2xl text-white font-bold transition-all flex items-center justify-center"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Connect & Sign'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold text-gray-600 tracking-widest">
            <span className="bg-[#111827] px-4">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-4 px-4 bg-white hover:bg-gray-100 rounded-2xl text-gray-900 font-bold transition-all shadow-md group"
        >
          <Globe className="w-5 h-5 mr-3 text-red-500 group-hover:rotate-12 transition-transform" />
          Google Account
        </button>

        <p className="text-center text-sm text-gray-500 pt-4">
          New to the platform?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

