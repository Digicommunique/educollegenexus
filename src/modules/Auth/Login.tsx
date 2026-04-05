import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[480px] bg-white rounded-[24px] shadow-2xl shadow-primary/10 p-10 md:p-12 border border-primary/5"
      >
        <div className="text-center mb-10">
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <GraduationCap className="text-primary w-10 h-10" />
            </div>
            <h2 className="text-primary font-bold text-xl tracking-tight">College Management System</h2>
          </div>
          
          <h1 className="text-4xl font-bold text-primary mb-3">Welcome Back!</h1>
          <p className="text-slate-500 font-medium">Please sign in to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-secondary transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-secondary transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-16 py-4 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors text-sm font-bold"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="text-right">
              <button type="button" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">
                Forgot Password?
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2",
              isLoading && "opacity-80 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 font-medium">
            Don't have an account? <button className="text-accent font-bold hover:underline">Register Here</button>
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="relative z-10 mt-12 text-slate-500 font-medium text-sm tracking-wide">
        © <span className="text-primary font-bold">Digital Communique Private Limited</span>
      </div>
    </div>
  );
};
