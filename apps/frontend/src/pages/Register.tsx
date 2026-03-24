import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Loader2, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from '../api/api';

import { useAuth } from '../hooks/useAuth';
import type { AuthResponse } from '../types/auth';



const Register: React.FC = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { user, tokens } = await api.post<AuthResponse>('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }) as unknown as AuthResponse;
      
      // We log them in immediately
      login(user, tokens.accessToken, tokens.refreshToken);
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome aboard!</h2>
          <p className="text-gray-400">Your account has been created successfully. Redirecting you to onboarding...</p>
        </motion.div>
      </div>
    );
  }

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
            Join the Platform
          </h2>
          <p className="mt-2 text-gray-400 font-medium">
            Start managing your assets securely.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                  <UserIcon size={18} />
                </span>

                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
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
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-xl shadow-indigo-500/10 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden mt-6"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <span className="flex items-center">
                Create Account
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 pt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
