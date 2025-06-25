import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="bg-white border border-surface-200 rounded-lg p-4"
  >
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 bg-surface-200 rounded-md animate-pulse mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface-200 rounded animate-pulse w-3/4" />
        <div className="flex gap-2">
          <div className="h-5 bg-surface-200 rounded-full animate-pulse w-16" />
          <div className="h-5 bg-surface-200 rounded-full animate-pulse w-12" />
          <div className="h-5 bg-surface-200 rounded-full animate-pulse w-20" />
        </div>
      </div>
    </div>
  </motion.div>
);

const LoadingState = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <SkeletonCard key={index} delay={index * 0.1} />
      ))}
    </div>
  );
};

export default LoadingState;