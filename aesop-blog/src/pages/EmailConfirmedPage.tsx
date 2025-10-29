import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Logo from '../components/Logo';

export default function EmailConfirmedPage() {
  const navigate = useNavigate();
  const { fetchUser } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    handleEmailConfirmation();
  }, []);

  const handleEmailConfirmation = async () => {
    try {
      // Get the current session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session) {
        // Email confirmed successfully
        setStatus('success');
        setMessage('Your email has been confirmed successfully!');
        
        // Fetch user profile
        await fetchUser();

        // Redirect to onboarding after 2 seconds
        setTimeout(() => {
          navigate('/onboarding');
        }, 2000);
      } else {
        // No session found
        setStatus('error');
        setMessage('Email confirmation link expired or invalid. Please try signing up again.');
      }
    } catch (error: any) {
      console.error('Email confirmation error:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to confirm email. Please try again.');
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
        </div>

        {/* Status Card */}
        <div className="card p-8 backdrop-blur-md text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Confirming Email</h2>
              <p className="text-cyan-200 mb-6">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Email Confirmed!</h2>
              <p className="text-cyan-200 mb-6">{message}</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  Redirecting you to complete your profile setup...
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Confirmation Failed</h2>
              <p className="text-cyan-200 mb-6">{message}</p>
              <button
                onClick={() => navigate('/auth')}
                className="btn btn-primary w-full"
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-cyan-200 text-sm">
          Need help? Contact support
        </p>
      </div>
    </div>
  );
}
