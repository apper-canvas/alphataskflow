import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import TaskList from '@/components/organisms/TaskList';
import taskService from '@/services/api/taskService';

const Completed = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const tasks = await taskService.getCompletedTasks();
      // Sort by completion date, most recent first
      const sortedTasks = tasks.sort((a, b) => 
        new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt)
      );
      setCompletedTasks(sortedTasks);
    } catch (err) {
      setError(err.message || 'Failed to load completed tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTaskUpdate = () => {
    loadData();
  };

  // Group tasks by completion date
  const groupedTasks = completedTasks.reduce((groups, task) => {
    const completedDate = task.completedAt ? 
      format(parseISO(task.completedAt), 'yyyy-MM-dd') : 
      'Unknown';
    
    if (!groups[completedDate]) {
      groups[completedDate] = [];
    }
    groups[completedDate].push(task);
    
    return groups;
  }, {});

  const formatGroupDate = (dateString) => {
    if (dateString === 'Unknown') return 'Unknown Date';
    
    const date = parseISO(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  const TaskGroup = ({ date, tasks, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-success rounded-full" />
        <h2 className="text-lg font-display font-semibold text-surface-900">
          {formatGroupDate(date)} ({tasks.length})
        </h2>
      </div>
      
      <TaskList
        tasks={tasks}
        loading={false}
        error={null}
        onTaskUpdate={handleTaskUpdate}
      />
    </motion.div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckCircle" size={18} className="text-success" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface-900">
            Completed
          </h1>
        </div>
        <p className="text-surface-600">
          Celebrate your achievements! Here are all your completed tasks.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
            <ApperIcon name="Trophy" size={24} className="text-success" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-display font-semibold text-surface-900">
              Well Done! 🎉
            </h3>
            <p className="text-surface-600">
              You've completed {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'}. 
              Keep up the great work!
            </p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="space-y-4">
              <div className="h-6 bg-surface-200 rounded w-48 animate-pulse" />
              <div className="space-y-3">
                {[0, 1].map(j => (
                  <div key={j} className="h-20 bg-surface-100 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <ApperIcon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load completed tasks</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      ) : completedTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckCircle" size={32} className="text-surface-400" />
          </div>
          <h3 className="text-lg font-display font-semibold text-surface-900 mb-2">
            No completed tasks yet
          </h3>
          <p className="text-surface-600">
            Complete some tasks to see them here and celebrate your progress!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedTasks)
            .sort(([a], [b]) => b.localeCompare(a)) // Sort dates descending
            .map(([date, tasks], index) => (
            <TaskGroup
              key={date}
              date={date}
              tasks={tasks}
              delay={0.1 + (index * 0.05)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Completed;