import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// FIX: Using a named interface for props to resolve issues with JSX children type inference.
interface ModalProps {
  open: boolean;
  onOpenChange: () => void;
  children: React.ReactNode;
}

const Modal = ({ open, onOpenChange, children }: ModalProps) => (
    <AnimatePresence>
        {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => onOpenChange()}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                {children}
            </div>
        )}
    </AnimatePresence>
);

const ModalContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
    <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn("relative z-50 grid w-full max-w-lg gap-4 border-4 border-border bg-card p-6 rounded-lg", className)}
        {...props}
    >
        {children}
    </motion.div>
));
ModalContent.displayName = "ModalContent";


const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
ModalHeader.displayName = "ModalHeader";

const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props}/>
);
ModalFooter.displayName = "ModalFooter";

const ModalTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
ModalTitle.displayName = "ModalTitle";


export { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle };