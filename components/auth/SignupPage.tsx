

import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import Button from '../PixelButton';
import { Input } from '../Input';
import AuthLayout from './AuthLayout';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.95-4.25 1.95-3.57 0-6.45-3.05-6.45-6.85s2.88-6.85 6.45-6.85c2.05 0 3.28.8 4.1 1.65l2.33-2.33C18.16 2.66 15.63 1.5 12.48 1.5 7.23 1.5 3.06 5.66 3.06 10.92s4.17 9.42 9.42 9.42c2.8 0 4.93-1 6.37-2.44 1.45-1.45 2.18-3.68 2.18-5.78 0-.6-.05-1.18-.15-1.73H12.48z" fill="currentColor" />
    </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C7.325 19.182 6.345 18.5 6.345 18.5c-1.087-.744.082-.729.082-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/>
    </svg>
);

interface SignupPageProps {
  onNavigateToLogin: () => void;
  onNavigateToLanding: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin, onNavigateToLanding }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
      });
      if (error) throw error;
      
      const { user } = data;
      // Heuristic to check if the user object returned is for an existing user.
      // Supabase signUp returns a user object even if the email is taken, but the created_at timestamp will be old.
      if (user && (new Date().getTime() - new Date(user.created_at).getTime()) > 60000) {
        setError('An account with this email already exists. Please try logging in instead.');
      } else {
        if (isSupabaseConfigured) {
          setMessage('Success! Check your email for a confirmation link.');
        } else {
          setMessage('Demo account created! You can now log in with these credentials.');
        }
        setEmail('');
        setPassword('');
      }

    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Begin Your Adventure" onNavigateToLanding={onNavigateToLanding}>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => handleOAuthLogin('google')} disabled={loading}>
                <GoogleIcon className="h-5 w-5" />
                Google
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => handleOAuthLogin('github')} disabled={loading}>
                <GitHubIcon className="h-5 w-5" />
                GitHub
            </Button>
        </div>

        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                </span>
            </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          {message && <p className="text-sm text-center text-green-400">{message}</p>}
          {error && <p className="text-sm text-center text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading || !email || !password}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
      </div>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <button onClick={onNavigateToLogin} className="underline text-primary hover:text-primary/80 font-semibold">
          Sign In
        </button>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;