import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, Code2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, senha);
      if (success) {
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    blur: {
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" 
         style={{ background: '#121212' }}>
      
      {/* Background Gradient Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20"
             style={{ background: 'linear-gradient(135deg, #0066FF 0%, #6E44FF 100%)' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-15"
             style={{ background: 'linear-gradient(45deg, #6E44FF 0%, #0066FF 100%)' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
             style={{ background: 'linear-gradient(90deg, #0066FF 0%, #6E44FF 100%)' }}></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo and Brand */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{
              background: 'rgba(30, 30, 30, 0.25)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Code2 size={32} style={{ color: '#0066FF' }} />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2" 
              style={{ 
                fontFamily: "'Space Grotesk', sans-serif",
                color: '#F5F5F5',
                background: 'linear-gradient(90deg, #0066FF 0%, #6E44FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            Builder's Code
          </h1>
          <p className="text-base" style={{ color: '#AAAAAA', fontFamily: "'Inter', sans-serif" }}>
            CMS Dashboard - Faça login para continuar
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          variants={itemVariants}
          className="p-8 rounded-2xl"
          style={{
            background: 'rgba(30, 30, 30, 0.25)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium mb-2" 
                     style={{ color: '#F5F5F5', fontFamily: "'Inter', sans-serif" }}>
                Email
              </label>
              <motion.div
                className="relative"
                variants={inputVariants}
                animate={focusedField === 'email' ? 'focus' : 'blur'}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} style={{ color: focusedField === 'email' ? '#0066FF' : '#AAAAAA' }} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'rgba(30, 30, 30, 0.4)',
                    border: `1px solid ${focusedField === 'email' ? '#0066FF' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: '#F5F5F5',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </motion.div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label htmlFor="senha" className="block text-sm font-medium mb-2" 
                     style={{ color: '#F5F5F5', fontFamily: "'Inter', sans-serif" }}>
                Senha
              </label>
              <motion.div
                className="relative"
                variants={inputVariants}
                animate={focusedField === 'senha' ? 'focus' : 'blur'}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} style={{ color: focusedField === 'senha' ? '#0066FF' : '#AAAAAA' }} />
                </div>
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'rgba(30, 30, 30, 0.4)',
                    border: `1px solid ${focusedField === 'senha' ? '#0066FF' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: '#F5F5F5',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onFocus={() => setFocusedField('senha')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} style={{ color: '#AAAAAA' }} />
                  ) : (
                    <Eye size={20} style={{ color: '#AAAAAA' }} />
                  )}
                </button>
              </motion.div>
            </motion.div>

            {/* Forgot Password */}
            <motion.div variants={itemVariants} className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium transition-colors duration-200"
                style={{ 
                  color: '#0066FF',
                  fontFamily: "'Inter', sans-serif"
                }}
                onMouseEnter={(e) => e.target.style.color = '#6E44FF'}
                onMouseLeave={(e) => e.target.style.color = '#0066FF'}
              >
                Esqueceu sua senha?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading ? '#666666' : 'linear-gradient(90deg, #0066FF 0%, #6E44FF 100%)',
                  fontFamily: "'Inter', sans-serif"
                }}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Entrando...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="login"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Fazer Login
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <p className="text-sm" style={{ color: '#AAAAAA', fontFamily: "'Inter', sans-serif" }}>
            © 2024 Builder's Code. Todos os direitos reservados.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
