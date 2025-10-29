import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';

// Force CDN cache refresh - build timestamp: 2025-10-27
export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        navigate('/feed');
      } else {
        // Signup
        // First check if username is available
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', formData.username)
          .single();

        if (existingUser) {
          throw new Error('Username already taken');
        }

        // Sign up with metadata
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/#/email-confirmed`,
            data: {
              username: formData.username,
              full_name: formData.fullName || null,
            },
          },
        });

        if (signUpError) throw signUpError;

        // Manually create profile (backup in case trigger doesn't exist)
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: signUpData.user.id,
              username: formData.username,
              full_name: formData.fullName || null,
              email: formData.email,
              communities: [],
              topics: [],
            });

          // Ignore error if profile already exists (trigger created it)
          if (profileError && !profileError.message.includes('duplicate')) {
            console.error('Error creating profile:', profileError);
          }
        }

        // Check if email confirmation is required
        if (signUpData.user && !signUpData.session) {
          // Email confirmation is required
          setEmailSent(true);
        } else {
          // No email confirmation needed (or instant confirmation)
          // Wait a moment for profile creation, then navigate
          setTimeout(() => {
            navigate('/onboarding');
          }, 500);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6 animate-float">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            {isLogin ? 'Welcome Back!' : 'Join Aesop Blog'}
          </h1>
          <p className="text-cyan-200 text-lg">
            {isLogin ? 'Sign in to continue your journey' : 'Create your account and start writing'}
          </p>
        </div>

        {/* Form */}
        <div className="card p-8 backdrop-blur-md">
          {emailSent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
              <p className="text-cyan-200 mb-6">
                We've sent a confirmation email to <strong className="text-white">{formData.email}</strong>.
                Please click the link in the email to activate your account and complete the onboarding process.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Check your spam folder if you don't see the email in a few minutes.
                </p>
              </div>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setIsLogin(true);
                }}
                className="btn btn-secondary w-full"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-cyan-200 mb-2">
                    Username *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                    <input
                      type="text"
                      required
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cyan-200 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="input pl-10"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-cyan-200 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cyan-200 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pl-10"
                />
              </div>
              {!isLogin && (
                <p className="mt-2 text-sm text-cyan-300">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
          </>
          )}
        </div>

        <p className="mt-6 text-center text-cyan-200 text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
