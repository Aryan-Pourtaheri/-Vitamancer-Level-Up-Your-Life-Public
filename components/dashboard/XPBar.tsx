import React from 'react';
import { motion } from 'framer-motion';

interface XPBarProps {
  currentValue: number;
  maxValue: number;
}

const XPBar: React.FC<XPBarProps> = ({ currentValue, maxValue }) => {
  const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;

  return (
    <div className="w-full h-3 bg-secondary rounded-full overflow-hidden border border-border">
      <motion.div 
        className="h-full bg-green-500"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default XPBar;
