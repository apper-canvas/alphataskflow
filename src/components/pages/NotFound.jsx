import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md"
      >
        {/* Floating Icons Animation */}
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ApperIcon name="Search" size={32} className="text-surface-400" />
          </motion.div>
          
          {/* Floating elements */}
          <motion.div
            animate={{ 
              x: [0, 10, 0],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute top-4 left-8 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center"
          >
            <ApperIcon name="CheckSquare" size={16} className="text-primary-600" />
          </motion.div>
          
          <motion.div
            animate={{ 
              x: [0, -8, 0],
              y: [0, 8, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-8 right-12 w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center"
          >
            <ApperIcon name="Calendar" size={12} className="text-accent-600" />
          </motion.div>
        </div>

        {/* 404 Text */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-display font-bold text-surface-200 mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-display font-semibold text-surface-900 mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-surface-600 mb-8 leading-relaxed"
        >
          Looks like this task got lost! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            size="lg"
            icon="Home"
            className="w-full sm:w-auto"
          >
            Go to Dashboard
          </Button>
          
          <div className="block sm:inline-block sm:ml-3">
            <Button
              onClick={() => navigate(-1)}
              variant="secondary"
              size="lg"
              icon="ArrowLeft"
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-surface-200"
        >
          <p className="text-sm text-surface-500 mb-4">
            Quick navigation:
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { path: '/today', label: 'Today', icon: 'Calendar' },
              { path: '/upcoming', label: 'Upcoming', icon: 'Clock' },
              { path: '/completed', label: 'Completed', icon: 'CheckCircle' }
            ].map((link) => (
              <motion.button
                key={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-150"
              >
                <ApperIcon name={link.icon} size={16} />
                {link.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;