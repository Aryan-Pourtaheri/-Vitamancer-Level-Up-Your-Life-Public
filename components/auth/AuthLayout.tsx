
import React from 'react';
import { Card, CardContent } from '../Card';
import { ThemeToggleButton } from '../ThemeToggleButton';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative">
       <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggleButton />
      </div>
      <div className="text-center mb-8 z-10">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="text-4xl sm:text-5xl font-display tracking-widest hover:text-primary transition-colors no-underline">
          VITAMANCER
        </a>
        <h2 className="text-lg mt-4 text-muted-foreground font-mono">
          {title}
        </h2>
      </div>
      <Card className="w-full max-w-sm z-10 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6 pt-8">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
