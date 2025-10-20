import React from 'react';
import { cn } from '../lib/utils';

const buttonVariants = {
  base: 'font-mono inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px active:shadow-none',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_-4px_0px_0px_rgba(0,0,0,0.2)] border-2 border-primary-foreground/20',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[inset_0_-4px_0px_0px_rgba(0,0,0,0.2)] border-2 border-primary-foreground/20',
      outline: 'border-2 border-border bg-transparent hover:bg-accent hover:text-accent-foreground shadow-[inset_0_-2px_0px_0px_hsl(var(--border))]',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[inset_0_-4px_0px_0px_rgba(0,0,0,0.1)] border-2 border-border',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-11 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-12 rounded-md px-8 text-base',
      icon: 'h-10 w-10',
    },
  },
};

type ButtonVariant = keyof (typeof buttonVariants.variants.variant);
type ButtonSize = keyof (typeof buttonVariants.variants.size);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const classes = [
      buttonVariants.base,
      buttonVariants.variants.variant[variant],
      buttonVariants.variants.size[size],
      className,
    ].filter(Boolean).join(' ');

    return (
      <button
        className={cn(classes)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export default Button;