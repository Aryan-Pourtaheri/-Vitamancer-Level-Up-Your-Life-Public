import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Button from './PixelButton';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './Modal';
import { Input } from './Input';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
}

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.95-4.25 1.95-3.57 0-6.45-3.05-6.45-6.85s2.88-6.85 6.45-6.85c2.05 0 3.28.8 4.1 1.65l2.33-2.33C18.16 2.66 15.63 1.5 12.48 1.5 7.23 1.5 3.06 5.66 3.06 10.92s4.17 9.42 9.42 9.42c2.8 0 4.93-1 6.37-2.44 1.45-1.45 2.18-3.68 2.18-5.78 0-.6-.05-1.18-.15-1.73H12.48z" fill="currentColor" />
    </svg>
);


const Auth: React.FC<AuthProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      
      if (isSignUp) {
        setMessage('Success! Check your email for a confirmation link.');
        setEmail('');
        setPassword('');
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google') => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setMessage('');
    setError('');
    setEmail('');
    setPassword('');
  };


  return (
    // FIX: The Modal component requires the content to be passed as children. ModalContent and its descendants are now correctly nested within the Modal component.
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="text-2xl">{isSignUp ? 'Create Your Account' : 'Welcome Back'}</ModalTitle>
        </ModalHeader>
        <div className="space-y-4 pt-4">
           <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => handleOAuthLogin('google')} disabled={loading}>
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
            </Button>

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

          <form onSubmit={handleSubmit} className="space-y-4">
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
                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={toggleAuthMode} className="underline text-primary hover:text-primary/80 font-semibold">
                {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default Auth;